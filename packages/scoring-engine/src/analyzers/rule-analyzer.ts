import type {
  ExecutionResult,
  Persona,
  UXFinding,
  StepResult,
} from "@journeylens/contracts";

export function analyzeExecution(
  execution: ExecutionResult,
  persona: Persona
): UXFinding[] {
  const findings: UXFinding[] = [];

  for (const step of execution.steps) {
    analyzeFailedStep(step, persona, findings);
    analyzeFailedAssertions(step, persona, findings);
    analyzeConsoleErrors(step, persona, findings);
    analyzeFailedRequests(step, persona, findings);
    analyzeSlowActions(step, persona, findings);
  }

  return findings;
}

function analyzeFailedStep(
  step: StepResult,
  persona: Persona,
  findings: UXFinding[]
) {
  if (step.status !== "failed") return;

  findings.push({
    id: `${executionStepId(step)}-execution-failure`,
    title: "Journey step failed",
    description: step.error ?? "The browser action could not be completed.",
    severity: "high",
    recommendation:
      "Investigate the failed interaction and ensure the expected action can be completed.",
    evidence: [
      `Step: ${step.stepId}`,
      `Error: ${step.error ?? "Unknown error"}`,
    ],
    personaId: persona.id,
  });
}

function analyzeFailedAssertions(
  step: StepResult,
  persona: Persona,
  findings: UXFinding[]
) {
  for (const assertion of step.assertions ?? []) {
    if (assertion.passed) continue;

    findings.push({
      id: `${step.stepId}-assertion-${findings.length}`,
      title: "Expected interface state was not reached",
      description: assertion.description,
      severity: "medium",
      recommendation:
        "Review the interface behaviour and ensure the expected state is displayed.",
      evidence: [
        `Step: ${step.stepId}`,
        `Expected: ${assertion.expected ?? "Not specified"}`,
        `Actual: ${assertion.actual ?? assertion.error ?? "Not available"}`,
      ],
      personaId: persona.id,
    });
  }
}

function analyzeConsoleErrors(
  step: StepResult,
  persona: Persona,
  findings: UXFinding[]
) {
  for (const error of step.consoleErrors ?? []) {
    // Browser messages such as "Failed to load resource...401"
    // do not contain the request URL. Match them against captured
    // HTTP errors from the same step.
    const statusMatch = error.match(/\b([45]\d{2})\b/);
    const status = statusMatch ? Number(statusMatch[1]) : undefined;

    const matchingThirdPartyError = (step.httpErrors ?? []).some(
      (httpError) => {
        if (status === undefined || httpError.status !== status) {
          return false;
        }

        try {
          const pageHost = new URL(step.pageUrl ?? "").hostname;
          const requestHost = new URL(httpError.url).hostname;

          return pageHost !== "" && requestHost !== pageHost;
        } catch {
          return false;
        }
      }
    );

    // Avoid reporting a known third-party HTTP error as a UX finding.
    if (matchingThirdPartyError) {
      continue;
    }

    findings.push({
      id: `${step.stepId}-console-${findings.length}`,
      title: "Browser console error detected",
      description: error,
      severity: "medium",
      recommendation:
        "Investigate the browser console error and resolve the underlying issue.",
      evidence: [`Step: ${step.stepId}`, error],
      personaId: persona.id,
    });
  }
}

function analyzeFailedRequests(
  step: StepResult,
  persona: Persona,
  findings: UXFinding[]
) {
  for (const request of step.failedRequests ?? []) {
    findings.push({
      id: `${step.stepId}-request-${findings.length}`,
      title: "Network request failed",
      description: `${request.method} request failed: ${request.url}`,
      severity: "medium",
      recommendation:
        "Investigate the failed network request and ensure the required resource loads successfully.",
      evidence: [
        `Step: ${step.stepId}`,
        `URL: ${request.url}`,
        `Failure: ${request.failure}`,
      ],
      personaId: persona.id,
    });
  }
}

function analyzeSlowActions(
  step: StepResult,
  persona: Persona,
  findings: UXFinding[]
) {
  const thresholdMs = 3000;

  if (
    step.actionDurationMs === undefined ||
    step.actionDurationMs <= thresholdMs
  ) {
    return;
  }

  findings.push({
    id: `${step.stepId}-slow-action`,
    title: "Slow browser interaction",
    description: `The browser action took ${step.actionDurationMs}ms to complete.`,
    severity: "medium",
    recommendation:
      "Investigate the interaction delay and look for opportunities to improve responsiveness.",
    evidence: [
      `Step: ${step.stepId}`,
      `Action duration: ${step.actionDurationMs}ms`,
      `Threshold: ${thresholdMs}ms`,
    ],
    personaId: persona.id,
  });
}

function executionStepId(step: StepResult): string {
  return step.stepId;
}