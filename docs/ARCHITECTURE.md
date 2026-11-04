# JourneyLens Architecture

## Workflow

``` text
Dashboard -> NestJS API -> Evaluation orchestration
         -> Journey engine -> Playwright (one run per persona)
         -> Evidence collection -> Scoring/analysis
         -> Persona reports -> Dashboard
```

The same scripted journey is executed independently for each persona.
Persona changes the evaluation perspective, not the scripted actions.

## Stack

  Layer           Technology
  --------------- --------------------------------------
  Frontend        Next.js, React, TypeScript, Tailwind
  API             NestJS
  Browser         Playwright
  Accessibility   axe-core / @axe-core/playwright
  Runtime         Node.js
  Monorepo        npm workspaces

## Components

-   `apps/web`: dashboard, API integration, persona reports, findings,
    step timeline, screenshots and evidence.
-   `apps/api`: `GET /health` and `POST /evaluations`; currently
    orchestrates the demo and calls journey-engine directly.
-   `packages/contracts`: shared journey, persona, evaluation, evidence
    and finding types.
-   `packages/journey-engine`: purchase journey, personas, Playwright
    executor, accessibility collector.
-   `packages/scoring-engine`: rule-based analysis, accessibility
    analysis and efficiency metrics.

Supported actions: navigate, click, type, select, scroll, wait.\
Supported assertions: visible, hidden, text, URL, count.

## Demo journey

SauceDemo purchase flow: navigate; enter `standard_user` and demo
password; log in; add Sauce Labs Backpack; open cart; checkout; enter
Demo User and postal code 411001; continue; finish; verify
`Thank you for your order!`.

This is a fixed demo journey, not a general journey builder.

## Personas

  -----------------------------------------------------------------------
  Persona                             Focus
  ----------------------------------- -----------------------------------
  First-time Shopper                  Discoverability, navigation
                                      clarity, instruction clarity

  Time-conscious Shopper              Interaction efficiency, number of
                                      steps, response time

  Accessibility-conscious Shopper     Keyboard accessibility, labels,
                                      focus management, error feedback
  -----------------------------------------------------------------------

## Evidence

The executor captures step status, screenshot path, URL/title, console
errors, failed requests, HTTP errors, interactions, action/assertion
timings, and axe results. Password values are redacted from interaction
evidence.

## Accessibility interpretation

Configured axe tags: WCAG 2 A/AA and WCAG 2.1 A/AA. - Violation:
automated rule failure. - Incomplete: axe cannot determine pass/fail;
manual review is required. - No detected violations does not prove full
accessibility or WCAG compliance.

Recent SauceDemo evidence contained no axe violations but did contain
incomplete `color-contrast` checks on inventory states, including
`.active_option`, `select`, and an item description. These are not
confirmed contrast failures.

## Decisions

-   Keep the MVP scripted; do not add autonomous browser agents yet.
-   Separate evidence collection from interpretation.
-   Distinguish deterministic results from AI-generated interpretations.
-   Require evidence for findings.
-   Do not infer real user behavior or conversion rates.
-   Extract workers only when operational needs justify it.
