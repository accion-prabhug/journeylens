# JourneyLens Local Setup

## Requirements

Node.js 20+, npm, Git, Playwright Chromium. Development used Node.js 24.
Docker and pnpm are not required.

## Clone and install

``` bash
git clone https://github.com/bsdangra/journeylens.git
cd journeylens
npm install
npx playwright install chromium
```

## Build

From repository root, build dependencies in order:

``` bash
npm run build -w @journeylens/contracts
npm run build -w @journeylens/scoring-engine
npm run build -w @journeylens/journey-engine
npm run build -w @journeylens/api
npm run build -w web
```

## Start API

Terminal 1:

``` bash
npm run start:dev -w @journeylens/api
```

API: http://localhost:3000

``` bash
curl http://localhost:3000/health
```

## Start dashboard

Terminal 2:

``` bash
npm run dev -w web -- --port 3001
```

Dashboard: http://localhost:3001

The API CORS configuration currently allows `http://localhost:3001`.

## Run evaluation

``` bash
curl -X POST http://localhost:3000/evaluations \
  -H "Content-Type: application/json"
```

Save output:

``` bash
curl -s -X POST http://localhost:3000/evaluations \
  -H "Content-Type: application/json" \
  -o evaluation.json
```

Or use the dashboard's Run demo evaluation control.

## Screenshots

Stored in `storage/screenshots/` and served at:
`http://localhost:3000/screenshots/<screenshot-filename>`

## Useful commands

``` bash
npm run typecheck -w @journeylens/journey-engine
npm run build -w @journeylens/scoring-engine
npm run build -w @journeylens/journey-engine
npm run build -w @journeylens/api
npm run build -w web
```

## Troubleshooting

-   Stale package output: rebuild contracts, scoring-engine,
    journey-engine, API in order, then restart API.
-   Missing browser: `npx playwright install chromium`.
-   Screenshot failure: confirm file exists, static asset configuration
    is correct, and URL returns HTTP 200.
-   Frontend/API connection: verify both ports and CORS origin; check
    `NEXT_PUBLIC_API_URL` if overridden.
