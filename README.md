# JourneyLens 🔍

**AI-assisted website usability testing through scripted user journeys and persona-informed analysis.**

JourneyLens helps identify potential usability friction in a website before it affects real users.

Define a user journey, execute it in a real browser, collect interaction evidence, and use AI to identify usability issues and suggest improvements.

> The goal is to make website usability testing more accessible, repeatable, and actionable.

## 🎯 The Problem

Traditional website testing tools primarily focus on whether a website works:

- Do buttons work?
- Do forms submit?
- Do pages load?
- Does the expected navigation happen?

But functional correctness doesn't necessarily mean a good user experience.

A website can work perfectly while still confusing users, hiding important information, or making tasks unnecessarily difficult.

JourneyLens aims to bridge this gap by combining browser automation with AI-assisted UX analysis.

## 💡 How It Works

1. **Define a journey** — Specify a website URL, user goal, actions, and expected outcomes.
2. **Select personas** — Choose different user perspectives for analysis.
3. **Execute the journey** — Run the same scripted journey independently in isolated browser contexts.
4. **Collect evidence** — Capture screenshots, DOM information, accessibility details, and browser telemetry.
5. **Analyze with AI** — Identify potential usability friction using the collected evidence and persona context.
6. **Generate a report** — Present findings, severity, confidence, supporting evidence, and recommendations.

### Important distinction

Personas provide different perspectives for interpreting the same scripted journey. They do not represent real human participants or independently navigate the website.

JourneyLens is intended to complement functional testing, analytics, and human usability testing—not replace them.

## 🏗️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Backend | Node.js, NestJS |
| Browser automation | Playwright |
| AI analysis | Claude API (initial provider) |
| Database | SQLite initially |
| Package management | npm |
| Styling | Tailwind CSS |

Infrastructure will evolve as the product grows. PostgreSQL, Redis, BullMQ, and isolated browser workers are planned for later stages.

## 📁 Project Structure

```text
journeylens/
├── apps/
│   ├── web/                  # Next.js frontend
│   └── api/                  # Backend API
│
├── packages/
│   ├── contracts/            # Shared types and schemas
│   ├── journey-engine/       # Journey DSL and execution logic
│   └── scoring-engine/       # Deterministic scoring
│
├── storage/                  # Local database and artifacts
│
├── README.md
└── package.json
```

## 🛠️ Development Setup

### Prerequisites

- Node.js
- npm
- Git

### Clone the repository

```bash
git clone <repository-url>
cd journeylens
```

### Install dependencies

Frontend and backend dependencies will be installed independently as their applications are initialized.

```bash
cd apps/web
npm install
```

### Start the frontend

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Backend setup instructions will be added as the API implementation takes shape.

## 🚀 Development Roadmap

### Phase 1 — Foundation
- [ ] Initialize monorepo
- [ ] Set up Next.js frontend
- [ ] Set up NestJS backend
- [ ] Establish shared TypeScript contracts

### Phase 2 — Journey Engine
- [ ] Define Journey DSL
- [ ] Validate journey definitions
- [ ] Implement supported browser actions
- [ ] Add expected outcome verification

### Phase 3 — Browser Automation
- [ ] Integrate Playwright
- [ ] Execute scripted journeys
- [ ] Support isolated persona contexts
- [ ] Capture screenshots and browser evidence

### Phase 4 — AI Analysis
- [ ] Integrate Claude API
- [ ] Design structured analysis prompts
- [ ] Identify usability friction
- [ ] Generate evidence-backed recommendations

### Phase 5 — Scoring and Reporting
- [ ] Implement deterministic scoring
- [ ] Add persona-level analysis
- [ ] Generate usability reports
- [ ] Track simulation history

### Phase 6 — Productization
- [ ] Build dashboard
- [ ] Add journey builder
- [ ] Add simulation progress tracking
- [ ] Improve security and execution isolation

## 🧭 Product Principles

- Evidence over assumptions.
- Repeatability over randomness.
- Usability insights over vanity scores.
- Deterministic execution, AI-assisted interpretation.
- Transparency about limitations and confidence.
- Complement human usability testing rather than claim to replace it.

## 📌 Project Status

<kbd>Early Development — MVP</kbd>

JourneyLens is currently under active development. The initial focus is to validate the core workflow: scripted browser execution, evidence collection, and useful AI-assisted usability findings.

Features and architecture may evolve as the MVP is developed and tested.

## 🤝 Contributions

This project is currently under active development. Contribution guidelines will be added as the project matures.

## 📄 License

License to be decided.