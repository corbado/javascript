# tests-e2e

End-to-end tests for the Corbado JavaScript SDK, using Playwright.

## Overview

### Playground applications

Each SDK has a corresponding **playground application** in `playground/`:

| Playground                 | SDK                            | Framework      |
| -------------------------- | ------------------------------ | -------------- |
| `playground/react`         | `@corbado/react`               | Vite + React   |
| `playground/web-js`        | `@corbado/web-js`              | Vite (vanilla) |
| `playground/web-js-script` | `@corbado/web-js` (script tag) | Vite (vanilla) |
| `playground/connect-next`  | `@corbado/connect-react`       | Next.js        |

Playgrounds serve two purposes:

1. **Manual testing** — each playground can be started locally (`npm run dev`) and is deployed automatically to Vercel on every push. This gives a quick way to verify SDK behaviour in a real browser without writing tests.
2. **Automated testing** — Playwright tests run _on top of_ these playgrounds. The `globalSetup` in each test suite installs dependencies, builds the playground, and spawns it on a random port before tests start. No manual playground setup is needed.

### Test suites

Because multiple playgrounds can expose the same SDK surface, a single Playwright suite can be **reused across different playground apps**. For example, the three Complete playgrounds (`react`, `web-js`, `web-js-script`) all render the same auth UI component, so they share the same test suite — only the playground that gets spawned changes.

There are two test suites:

- **Complete** — tests the full Corbado auth UI component (signup, login, passkey list, social login, observe). By default runs against the React playground; in the nightly workflow it also runs against `web-js` and `web-js-script`.
- **Connect** — tests the Corbado Connect passkey integration (login, append, network blocking). Runs against the Next.js playground that talks to AWS Cognito.

Each suite has its own Playwright config (`playwright.config.complete.ts` / `playwright.config.connect.ts`) and env files.

## Running locally

### 1. Set up env files

Copy the example files and fill in the secrets:

```bash
cd packages/tests-e2e
cp .env.complete.example .env.complete.local
cp .env.connect.example .env.connect.local
```

Edit `.env.complete.local` and `.env.connect.local` with the required values. See the [Environment variables](#environment-variables) section below.

### 2. Run tests

```bash
cd packages/tests-e2e

# Headless
npm run e2e:complete
npm run e2e:connect

# With Playwright UI
npm run e2e:complete:ui
npm run e2e:connect:ui
```

## Running in CI

### Workflows

| Workflow       | Trigger                            | What it does                                                                                              |
| -------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `test.yml`     | PR + push to develop               | Runs Complete and Connect tests for **react** platform only (matrix)                                      |
| `test-all.yml` | Nightly schedule (3x/day) + manual | Runs Complete tests for **react, web-js, web-js-script** + Connect tests for **react** (matrix, parallel) |

## Authoring rules (connect)

- Knowledge about page structure lives in `/models` only. Scenarios call model methods, not raw selectors.
- All passkey authenticator interactions flow through `VirtualAuthenticator`.
- All TOTP authenticator interactions flow through `AuthenticatorApp`.
- Scenarios set up app state via navigation helpers and avoid duplicating UI logic.
- Prefer explicit `awaitPage/visible` checks when changing screens.
