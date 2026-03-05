# tests-e2e

End-to-end tests for the Corbado JavaScript SDK, using Playwright.

## Overview

There are two test suites:

- **Complete** — tests the full Corbado auth UI component (signup, login, passkey list, social login, observe). Runs against a local Vite/React playground.
- **Connect** — tests the Corbado Connect passkey integration (login, append, network blocking). Runs against a local Next.js playground that talks to AWS Cognito.

Each suite has its own Playwright config (`playwright.config.complete.ts` / `playwright.config.connect.ts`), env files, and `globalSetup` that automatically:
1. Installs playground dependencies
2. Builds the playground
3. Spawns it on a random port before tests start

No manual playground setup is needed.

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

| Workflow | Trigger | What it does |
|---|---|---|
| `test.yml` | PR + push to develop | Runs Complete and Connect tests for **react** platform only (matrix) |
| `test-all.yml` | Nightly schedule (3x/day) + manual | Runs Complete tests for **react, web-js, web-js-script** + Connect tests for **react** (matrix, parallel) |

### How test-all.yml works

The workflow uses a GitHub Actions **matrix strategy** to run 4 test combinations in parallel on separate runners:

| testType | platform | configFile |
|---|---|---|
| complete | react | playwright.config.complete.ts |
| complete | web-js | playwright.config.complete.ts |
| complete | web-js-script | playwright.config.complete.ts |
| connect | react | playwright.config.connect.ts |

Env vars are **scoped by test type** using **GitHub Environments**:
- Each matrix entry runs with `environment: ${{ matrix.testType }}`, so `secrets.X` resolves from the matching environment
- Complete-only secrets (JWT, Google OAuth) live in the `complete` environment — empty on connect runners
- Connect-only secrets (Cognito, NEXT_PUBLIC_*) live in the `connect` environment — empty on complete runners
- CloudWatch logging uses **repo-level** `CLOUDWATCH_AWS_*` credentials via step-level env override, so they never conflict with the Connect Cognito AWS credentials

After each test run, results are uploaded as artifacts and sent to AWS CloudWatch via `scripts/cloudwatch-log.sh`.

## Environment variables

### Complete tests

```bash
#!/bin/bash

PRIVATE_KEY_PATH="private.pem"
KID="pki-..."
ISS="https://auth.corbado-dev.com"
USER_ID="usr-..."
USER_NAME="systemtest"
USER_EMAIL="anders.choi+systemtest@corbado.com"

NOW=$( date +%s )
IAT=${NOW}
EXP=$((${NOW} +  3000000)) # after around 34 days
NBF=$((${NOW} -  10)) # 10 seconds ago
HEADER_RAW='{"alg":"RS256","kid":"'"${KID}"'","typ":"JWT"}'
HEADER=$( echo  -n "${HEADER_RAW}" |  openssl base64 |  tr  -d '=' |  tr '/+' '_-' |  tr  -d '\n' )
PAYLOAD_RAW='{"iss":"'"${ISS}"'","sub":"'"${USER_ID}"'","exp":'"${EXP}"',"nbf":'"${NBF}"',"iat":'"${IAT}"',"name":"'"${USER_NAME}"'","orig":"'"${USER_EMAIL}"'","email":"'"${USER_EMAIL}"'","version":2}'
PAYLOAD=$( echo  -n "${PAYLOAD_RAW}" |  openssl base64 |  tr  -d '=' |  tr '/+' '_-' |  tr  -d '\n' )
HEADER_PAYLOAD="${HEADER}.${PAYLOAD}"
SIGNATURE=$( openssl dgst -sha256  -sign ${PRIVATE_KEY_PATH} <(echo  -n "${HEADER_PAYLOAD}") |  openssl base64 |  tr  -d '=' |  tr '/+' '_-' |  tr  -d '\n' )
JWT="${HEADER_PAYLOAD}.${SIGNATURE}"

echo  $JWT
```

The first segment contains all values that must be extracted from the backend deployment. The token is valid for ~34 days and should be renewed monthly.

## Authoring rules (connect)

- Knowledge about page structure lives in `/models` only. Scenarios call model methods, not raw selectors.
- All passkey authenticator interactions flow through `VirtualAuthenticator`.
- All TOTP authenticator interactions flow through `AuthenticatorApp`.
- Scenarios set up app state via navigation helpers and avoid duplicating UI logic.
- Prefer explicit `awaitPage/visible` checks when changing screens.
