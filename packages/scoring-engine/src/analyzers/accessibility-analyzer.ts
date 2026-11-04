import type {
  ExecutionResult,
  Persona,
  UXFinding,
} from "@journeylens/contracts";

function mapSeverity(
  impact: string | null
): UXFinding["severity"] {
  switch (impact) {
    case "critical":
      return "critical";
    case "serious":
      return "high";
    case "moderate":
      return "medium";
    case "minor":
      return "low";
    default:
      return "medium";
  }
}

export function analyzeAccessibility(
  execution: ExecutionResult,
  persona: Persona
): UXFinding[] {
  const violations = new Map<
    string,
    {
      impact: string | null;
      description: string;
      help: string;
      helpUrl: string;
      steps: Set<string>;
      targets: Set<string>;
    }
  >();

  for (const step of execution.steps) {
    for (const violation of step.accessibility?.violations ?? []) {
      const existing = violations.get(violation.id);

      if (existing) {
        existing.steps.add(step.stepId);

        for (const element of violation.affectedElements) {
          element.target.forEach((target) =>
            existing.targets.add(target)
          );
        }
      } else {
        violations.set(violation.id, {
          impact: violation.impact,
          description: violation.description,
          help: violation.help,
          helpUrl: violation.helpUrl,
          steps: new Set([step.stepId]),
          targets: new Set(
            violation.affectedElements.flatMap(
              (element) => element.target
            )
          ),
        });
      }
    }
  }

  return Array.from(violations.entries()).map(
    ([ruleId, violation]) => ({
      id: `accessibility-${ruleId}`,
      title: `Accessibility issue: ${ruleId}`,
      description: violation.description,
      severity: mapSeverity(violation.impact),
      recommendation: violation.help,
      evidence: [
        `Axe rule: ${ruleId}`,
        `Affected journey steps: ${Array.from(violation.steps).join(", ")}`,
        `Affected elements: ${Array.from(violation.targets).join(", ") || "Not specified"}`,
        `Impact: ${violation.impact ?? "Not rated by axe"}`,
        `Reference: ${violation.helpUrl}`,
      ],
      personaId: persona.id,
    })
  );
}

export function analyzeIncompleteAccessibilityChecks(
  execution: ExecutionResult,
  persona: Persona
): UXFinding[] {
    console.log(
  "[Accessibility Analyzer] Incomplete checks:",
  execution.steps.map((step) => ({
    stepId: step.stepId,
    count: step.accessibility?.incompleteChecks?.length ?? 0,
  }))
);
  const incompleteChecks = new Map<
    string,
    {
      description: string;
      help: string;
      helpUrl: string;
      steps: Set<string>;
      targets: Set<string>;
    }
  >();

  for (const step of execution.steps) {
    for (const check of step.accessibility?.incompleteChecks ?? []) {
      const existing = incompleteChecks.get(check.id);

      if (existing) {
        existing.steps.add(step.stepId);

        for (const element of check.affectedElements) {
          element.target.forEach((target) =>
            existing.targets.add(target)
          );
        }
      } else {
        incompleteChecks.set(check.id, {
          description: check.description,
          help: check.help,
          helpUrl: check.helpUrl,
          steps: new Set([step.stepId]),
          targets: new Set(
            check.affectedElements.flatMap(
              (element) => element.target
            )
          ),
        });
      }
    }
  }

  return Array.from(incompleteChecks.entries()).map(
    ([ruleId, check]) => ({
      id: `accessibility-incomplete-${ruleId}`,
      title: `Manual accessibility review needed: ${ruleId}`,
      description: check.description,
      severity: "low",
      recommendation: check.help,
      evidence: [
        `Axe rule: ${ruleId}`,
        `Affected journey steps: ${Array.from(check.steps).join(", ")}`,
        `Affected elements: ${Array.from(check.targets).join(", ") || "Not specified"}`,
        "Status: Incomplete — axe could not automatically determine whether this check passes or fails.",
        `Reference: ${check.helpUrl}`,
      ],
      personaId: persona.id,
    })
  );
}