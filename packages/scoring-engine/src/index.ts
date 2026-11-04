import type {
  ExecutionResult,
  Persona,
  EvaluationReport,
} from "@journeylens/contracts";

import { analyzeExecution } from "./analyzers/rule-analyzer";
import {
  analyzeAccessibility,
  analyzeIncompleteAccessibilityChecks,
} from "./analyzers/accessibility-analyzer";

function getMedian(values: number[]): number | null {
  if (values.length === 0) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

export function generateReport(
  execution: ExecutionResult,
  persona: Persona
): EvaluationReport {
  const findings = [
    ...analyzeExecution(execution, persona),
    ...analyzeAccessibility(execution, persona),
    ...analyzeIncompleteAccessibilityChecks(execution, persona),
  ];

  const failedSteps = execution.steps.filter(
    (step) => step.status === "failed"
  ).length;

  const completedSteps = execution.steps.filter(
    (step) => step.status === "passed"
  ).length;

  const actionDurations = execution.steps
    .map((step) => step.actionDurationMs)
    .filter((duration): duration is number => duration !== undefined);

  const totalActionDurationMs =
    actionDurations.length > 0
      ? actionDurations.reduce((total, duration) => total + duration, 0)
      : null;

  const averageActionDurationMs =
    totalActionDurationMs !== null
      ? totalActionDurationMs / actionDurations.length
      : null;

  return {
    evaluationId: execution.evaluationId,
    personaId: persona.id,

    score: {
      overall: null,
      usability: null,
      efficiency: null,
      accessibility: null,
      clarity: null,
    },

    efficiency: {
      totalSteps: execution.steps.length,
      completedSteps,
      failedSteps,
      measuredActionCount: actionDurations.length,
      totalActionDurationMs,
      averageActionDurationMs,
      medianActionDurationMs: getMedian(actionDurations),
      journeyDurationMs: execution.durationMs ?? null,
    },

    findings,

    summary:
      findings.length === 0
        ? `No rule-based UX issues were detected for ${persona.name}. This does not establish that the website is fully usable or accessible.`
        : `${findings.length} evidence-based issues were detected for ${persona.name}.`,
  };
}