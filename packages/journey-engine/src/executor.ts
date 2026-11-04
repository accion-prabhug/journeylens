
import { chromium, type Browser } from "playwright";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import type {
  Journey,
  JourneyStep,
  ExecutionResult,
  StepResult,
  StepAssertion,
  AssertionResult,
} from "@journeylens/contracts";
import { scanAccessibility } from "./collectors/accessibility-collector";


const SCREENSHOT_DIR = path.resolve(
  __dirname,
  "../../../storage/screenshots"
);

async function executeStep(
  page: import("playwright").Page,
  step: JourneyStep
): Promise<void> {
  switch (step.action) {
    case "navigate":
      await page.goto(step.value ?? "", {
        waitUntil: "domcontentloaded",
        timeout: step.timeout ?? 30000,
      });
      break;

    case "click":
      if (!step.target) throw new Error("Click requires a target");
      await page.locator(step.target).click({
        timeout: step.timeout ?? 10000,
      });
      break;

    case "type":
      if (!step.target) throw new Error("Type requires a target");
      await page.locator(step.target).fill(step.value ?? "", {
        timeout: step.timeout ?? 10000,
      });
      break;

    case "select":
      if (!step.target) throw new Error("Select requires a target");
      await page.locator(step.target).selectOption(step.value ?? "", {
        timeout: step.timeout ?? 10000,
      });
      break;

    case "scroll":
      await page.evaluate(() => window.scrollBy(0, 600));
      break;

    case "wait":
      await page.waitForTimeout(Number(step.value ?? 1000));
      break;

    default:
      throw new Error(`Unsupported action: ${step.action}`);
  }
}

async function executeAssertions(
  page: import("playwright").Page,
  assertions: StepAssertion[]
): Promise<AssertionResult[]> {
  const results: AssertionResult[] = [];

  for (const assertion of assertions) {
    try {
      let actual: string | number | undefined;
      let passed = false;

      switch (assertion.type) {
        case "visible": {
          if (!assertion.target) {
            throw new Error("Target is required");
          }

          const locator = page.locator(assertion.target);

          await locator.waitFor({
            state: "visible",
            timeout: 5000,
          });

          actual = "visible";
          passed = true;
          break;
        }

        case "hidden": {
          if (!assertion.target) {
            throw new Error("Target is required");
          }

          const locator = page.locator(assertion.target);

          await locator.waitFor({
            state: "hidden",
            timeout: 5000,
          });

          actual = "hidden";
          passed = true;
          break;
        }

        case "text": {
          if (!assertion.target) {
            throw new Error("Target is required");
          }

          const locator = page.locator(assertion.target);

          await locator.waitFor({
            state: "visible",
            timeout: 5000,
          });

          actual = (await locator.innerText()).trim();
          passed = actual.includes(String(assertion.expected));
          break;
        }

        case "url": {
          actual = page.url();
          passed = actual.includes(String(assertion.expected));
          break;
        }

        case "count": {
          if (!assertion.target) {
            throw new Error("Target is required");
          }

          actual = await page.locator(assertion.target).count();
          passed = actual === Number(assertion.expected);
          break;
        }
      }

      results.push({
        description: assertion.description,
        passed,
        expected: assertion.expected,
        actual,
      });
    } catch (error) {
      results.push({
        description: assertion.description,
        passed: false,
        expected: assertion.expected,
        error:
          error instanceof Error ? error.message : String(error),
      });
    }
  }

  return results;
}

export async function executeJourney(
  journey: Journey,
  evaluationId: string,
  personaId: string
): Promise<ExecutionResult> {
  // 1. Launch browser
  const browser: Browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext();
  // 2. Create page
  const page = await context.newPage();

  // 3. Register evidence listeners HERE
  const consoleErrors: string[] = [];
  const failedRequests: {
    url: string;
    method: string;
    failure: string;
  }[] = [];
  const httpErrors: {
    url: string;
    method: string;
    status: number;
    statusText: string;
    resourceType: string;
  }[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  page.on("requestfailed", (request) => {
    failedRequests.push({
      url: request.url(),
      method: request.method(),
      failure: request.failure()?.errorText ?? "Unknown failure",
    });
  });

  page.on("response", (response) => {
    if (response.status() >= 400) {
      const request = response.request();

      httpErrors.push({
        url: response.url(),
        method: request.method(),
        status: response.status(),
        statusText: response.statusText(),
        resourceType: request.resourceType(),
      });
    }
  });

  // 4. Execute journey steps
  const startedAt = new Date();
  const stepResults: StepResult[] = [];
  const screenshots: string[] = [];
  const errors: string[] = [];

  await mkdir(SCREENSHOT_DIR, { recursive: true });
  try {
    for (const step of journey.steps) {
      const consoleErrorStart = consoleErrors.length;
      const failedRequestStart = failedRequests.length;
      const httpErrorStart = httpErrors.length;

      const stepStartedAt = Date.now();
      const interactions: {
        action: string;
        target?: string;
        value?: string;
        timestamp: string;
      }[] = [];
      let assertionResults: AssertionResult[] = [];
      let actionDurationMs = 0;
      let assertionDurationMs = 0;
      let accessibilityResult: | Awaited<ReturnType<typeof scanAccessibility>> | undefined;

      try {

        const actionStartedAt = Date.now();

        await executeStep(page, step);

        actionDurationMs = Date.now() - actionStartedAt;

        const assertionStartedAt = Date.now();

        assertionResults = await executeAssertions(
          page,
          step.assertions ?? []
        );

        assertionDurationMs = Date.now() - assertionStartedAt;
        
        interactions.push({
          action: step.action,
          target: step.target,
          value:
            step.action === "type"
              ? shouldRedactValue(step)
                ? "[REDACTED]"
                : step.value
              : undefined,
          timestamp: new Date().toISOString(),
        });

       
        const failedAssertions = assertionResults.filter(
        (assertion) => !assertion.passed
        );

        if (failedAssertions.length > 0) {
        throw new Error(
            `Assertions failed: ${failedAssertions
            .map((assertion) => assertion.description)
            .join(", ")}`
        );
        }
        accessibilityResult = await scanAccessibility(page);

        const screenshotPath =
          `${SCREENSHOT_DIR}/${evaluationId}-${personaId}-${step.id}.png`;

        await page.screenshot({
          path: screenshotPath,
          fullPage: false,
        });

        screenshots.push(screenshotPath);

        stepResults.push({
          stepId: step.id,
          status: "passed",
          durationMs: Date.now() - stepStartedAt,
          screenshotPath,
          assertions: assertionResults,
          pageUrl: page.url(),
          pageTitle: await page.title(),
          consoleErrors: consoleErrors.slice(consoleErrorStart),
          failedRequests: failedRequests.slice(failedRequestStart),
          interactions,
          actionDurationMs,
          assertionDurationMs,
          accessibility: accessibilityResult,
          httpErrors: httpErrors.slice(httpErrorStart),
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);

        errors.push(message);

        stepResults.push({
          stepId: step.id,
          status: "failed",
          durationMs: Date.now() - stepStartedAt,
          error: message,
          assertions: assertionResults,
          pageUrl: page.url(),
          pageTitle: await page.title(),
          consoleErrors: consoleErrors.slice(consoleErrorStart),
          failedRequests: failedRequests.slice(failedRequestStart),
          interactions,
          actionDurationMs,
          assertionDurationMs,
          accessibility: accessibilityResult,
          httpErrors: httpErrors.slice(httpErrorStart),
        });

        break;
      }
    }
  } finally {
    // 5. Close browser
    await context.close();
    await browser.close();
  }

  const completedAt = new Date();

  const hasFailedStep = stepResults.some(
    (step) => step.status === "failed"
  );

  return {
    id: `${evaluationId}-${personaId}`,
    evaluationId,
    personaId,
    status: hasFailedStep ? "failed" : "completed",
    steps: stepResults,
    screenshots,
    errors,
    startedAt: startedAt.toISOString(),
    completedAt: completedAt.toISOString(),
    durationMs: completedAt.getTime() - startedAt.getTime(),
  };
}


function shouldRedactValue(step: JourneyStep): boolean {
  const sensitivePattern =
    /password|secret|token|api.?key|authorization|cookie|credit.?card|card.?number|cvv|ssn/i;

  return sensitivePattern.test(
    `${step.target ?? ""} ${step.description}`
  );
}