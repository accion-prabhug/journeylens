
import AxeBuilder from "@axe-core/playwright";
import type {
  AccessibilityScanResult,
} from "@journeylens/contracts";
import type { Page } from "playwright";

export async function scanAccessibility(
  page: Page
): Promise<AccessibilityScanResult> {
  const results = await new AxeBuilder({ page })
    .withTags([
      "wcag2a",
      "wcag2aa",
      "wcag21a",
      "wcag21aa",
    ])
    .analyze();

  return {
    violations: results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact ?? null,
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      affectedElements: violation.nodes.map((node) => ({
        target: node.target.map(String),
        failureSummary: node.failureSummary ?? null,
      })),
    })),

    incompleteChecks: results.incomplete.map((check) => ({
      id: check.id,
      impact: check.impact ?? null,
      description: check.description,
      help: check.help,
      helpUrl: check.helpUrl,
      affectedElements: check.nodes.map((node) => ({
        target: node.target.map(String),
        failureSummary: node.failureSummary ?? null,
      })),
    })),

    passes: results.passes.length,
    incomplete: results.incomplete.length,
    timestamp: new Date().toISOString(),
  };
}
