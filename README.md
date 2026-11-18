# carecubedjs

Playwright tests for the CareCubed app. So far they cover logging in and opening an application from the dashboard. The application form itself is added next.

## Layout

```
src/pages        one class per screen: login, dashboard, and next the application form
src/components   shared drivers for widget types the form uses (dropdowns, radio groups, rich text)
src/data         types for the form data plus a generator that fills in realistic values
tests            the specs
```

Tests don't touch selectors directly. Anything that has to know about the actual page structure lives in `src/pages` or `src/components`, so if the app changes a label or an id, there's one place to fix it.

## Requirements

Node 18 or newer, and a login for the app itself.

## Setup

```
npm install
npx playwright install chromium
copy .env.example .env
```

Open `.env` and fill in `CARECUBE_EMAIL` and `CARECUBE_PASSWORD` with a real account. `BASE_URL` already points at the app. Change it only if you're testing against a different environment.

`.env` is not committed. Don't add real credentials anywhere else in the project.

## Running the tests

```
npm test               runs everything headless
npm run test:headed    runs with a visible browser window
npm run typecheck      type-checks the project
npm run report         opens the html report from the last run
```
