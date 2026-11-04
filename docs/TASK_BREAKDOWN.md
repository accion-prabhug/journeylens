# JourneyLens Task Breakdown

Assign one owner per task and agree on file ownership before parallel
development.

  ------------------------------------------------------------------------
  ID                Task               Priority          Suggested owner
  ----------------- ------------------ ----------------- -----------------
  JL-01             Fix incomplete     High              Backend
                    accessibility                        
                    report aggregation                   

  JL-02             AI-powered UX      High              AI/backend
                    analysis                             

  JL-03             Explainable UX     High              Backend/product
                    scoring                              

  JL-04             Dashboard/report   Medium            Frontend
                    improvements                         

  JL-05             Input-driven       Medium            Full-stack
                    evaluations                          

  JL-06             Security,          High before       Backend/QA
                    reliability and QA public launch     

  JL-07             CI and deployment  Medium            DevOps/backend
                    readiness                            
  ------------------------------------------------------------------------

## JL-01 --- Accessibility aggregation

Reproduce the missing incomplete-check findings. Add temporary
diagnostics, rebuild scoring-engine -\> journey-engine -\> API, restart
API, and run evaluation. Verify analyzer input/output and returned API
report. Remove logs and add a regression test using an execution fixture
with an incomplete `color-contrast` check.

Acceptance: manual-review finding appears; it is not labelled a
confirmed violation.

## JL-02 --- AI analysis

Analyze persona context, journey outcomes, selected screenshots,
assertions, timings and browser evidence. Return structured findings
with title, description, severity, persona, evidence references,
affected steps, recommendation and confidence/evidence strength.

Requirements: structured output; contract validation; reject unsupported
findings; provider timeout/error handling; redact credentials and
sensitive data; keep AI interpretations distinct from deterministic
results; do not claim actual human behavior or conversion prediction.

Acceptance: demo returns valid, evidence-grounded AI findings; malformed
or unsupported output is safely handled.

## JL-03 --- Explainable scoring

Implement overall, usability, efficiency, accessibility and clarity
scores only after documenting inputs, weights, penalties,
missing-evidence behavior and treatment of incomplete checks. Add tests
and document limitations.

Acceptance: scores are deterministic, explainable and traceable. Missing
evidence must not imply a perfect score. Incomplete axe checks are not
confirmed failures.

## JL-04 --- Dashboard

Improve executive summary, persona comparison, severity grouping,
finding evidence links, recommendations, manual-review indicators,
distinction between deterministic and AI findings, and
loading/empty/error states.

Acceptance: important findings are understandable without expanding
every step; evidence remains accessible.

## JL-05 --- Input-driven evaluations

Accept validated website URL, journey ID and persona IDs instead of
relying only on hardcoded demo values. Keep SauceDemo as the default
demo; custom journey authoring can remain out of scope.

Acceptance: valid requests run; unsupported IDs and invalid input return
clear errors; existing demo remains functional.

## JL-06 --- Security and reliability

Review URL validation and SSRF protections. Block localhost,
private/link-local ranges and cloud metadata endpoints; revalidate
redirects and resolved IPs to reduce DNS rebinding risks. Add browser
timeouts, resource/concurrency limits, screenshot retention,
credential/PII redaction, payload validation, structured errors/logs and
dependency review.

Acceptance: unsafe destinations rejected; failures handled cleanly;
secrets not exposed; tests cover sensitive validation.

## JL-07 --- CI and deployment

Document environment variables and AI provider setup. Add CI for
install, typecheck and build. Decide production browser execution,
screenshot/object storage and retention. Document deployment and
rollback.

Acceptance: fresh setup is reproducible and CI catches build/type
regressions.

## Suggested parallel ownership

-   Developer 1: JL-01 and JL-03; coordinate changes to scoring files.
-   Developer 2: JL-02; coordinate shared contract changes.
-   Developer 3: JL-04; owns dashboard page and styles.
-   Developer 4: JL-06 and JL-07; coordinate API/bootstrap changes.
-   JL-05 can follow after agreeing on request contracts.

## MVP completion criteria

A user can start a validated evaluation; personas run independently;
evidence and accessibility results are collected; deterministic and AI
findings are distinguished and evidence-grounded; scores are
explainable; dashboard presents the report; unsafe URLs and sensitive
data are handled; setup/build instructions work on a fresh machine.
