import { executeJourney } from "./executor";
import { purchaseJourney } from "./journeys/purchase.journey";
import { generateReport } from "@journeylens/scoring-engine";
import { personas } from "./personas";

async function main() {
  console.log("Starting JourneyLens evaluation...");
  console.log(`Personas selected: ${personas.length}`);

  const results = [];

  for (const persona of personas) {
    console.log(`\n--------------------------------`);
    console.log(`Running persona: ${persona.name}`);
    console.log(`--------------------------------`);

    const result = await executeJourney(
      purchaseJourney,
      "JL-EVAL-001",
      persona.id
    );

    results.push(result);

    const accessibilitySummary = result.steps.reduce(
      (summary, step) => {
        const scan = step.accessibility;

        if (scan?.incompleteChecks.length) {
          console.log(
            "Incomplete accessibility checks:",
            JSON.stringify(scan.incompleteChecks, null, 2)
          );
        }

        if (!scan) return summary;

        summary.scans += 1;
        summary.passes += scan.passes;
        summary.incomplete += scan.incomplete;

        for (const violation of scan.violations) {
          const existing = summary.violations[violation.id];

          if (existing) {
            existing.occurrences += 1;
          } else {
            summary.violations[violation.id] = {
              impact: violation.impact,
              description: violation.description,
              occurrences: 1,
            };
          }
        }

        return summary;
      },
      {
        scans: 0,
        passes: 0,
        incomplete: 0,
        violations: {} as Record<
          string,
          {
            impact: string | null;
            description: string;
            occurrences: number;
          }
        >,
      }
    );

    console.log("\nAccessibility scan summary:");
    console.log(JSON.stringify(accessibilitySummary, null, 2));
    
    const report = generateReport(result, persona);
    console.log(`\nUX Report: ${persona.name}`);
    console.log(JSON.stringify(report, null, 2));

    console.log(
      `${persona.name}: ${result.status} (${result.durationMs}ms)`
    );
  }

  console.log("\n========== EVALUATION SUMMARY ==========");

  console.log(
    JSON.stringify(
      results.map((result) => ({
        id: result.id,
        personaId: result.personaId,
        status: result.status,
        totalSteps: result.steps.length,
        passedSteps: result.steps.filter(
          (step) => step.status === "passed"
        ).length,
        failedSteps: result.steps.filter(
          (step) => step.status === "failed"
        ).length,
        durationMs: result.durationMs,
        errors: result.errors,
      })),
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error("Journey execution failed:", error);
  process.exitCode = 1;
});