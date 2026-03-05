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

| Variable | Source in CI | Secret? | Description |
|---|---|---|---|
| `PLAYWRIGHT_TEST_URL` | `.env.complete.ci` | No | Base URL for playground (default: `http://localhost`) |
| `DEVELOPERPANEL_API_URL` | `.env.complete.ci` | No | Developer panel API URL for project creation |
| `CORBADO_BACKEND_API_URL` | `.env.complete.ci` | No | Backend API URL |
| `FRONTEND_API_URL_SUFFIX` | `.env.complete.ci` | No | Frontend API URL suffix |
| `DEFAULT_CORBADO_PROJECT_ID` | `.env.complete.ci` | No | Default project ID (used by observe tests) |
| `DEFAULT_CORBADO_BACKEND_API_BASIC_AUTH` | GitHub secret | Yes | Basic auth credentials for default project's backend API |
| `PLAYWRIGHT_JWT_TOKEN` | GitHub secret | Yes | JWT for developer panel auth |
| `PLAYWRIGHT_GOOGLE_EMAIL` | GitHub secret | Yes | Google account for social login tests |
| `PLAYWRIGHT_GOOGLE_PASSWORD` | GitHub secret | Yes | Google account password |
| `PLAYWRIGHT_GOOGLE_TOTP_SECRET` | GitHub secret | Yes | Google TOTP secret for 2FA |
| `PLAYWRIGHT_NUM_CORES` | Workflow | No | Number of CPU cores for worker calculation |
| `PLAYGROUND_TYPE` | Workflow matrix | No | Which playground to use (`react`, `web-js`, `web-js-script`) |

### Connect tests

| Variable | Source in CI | Secret? | Description |
|---|---|---|---|
| `PLAYWRIGHT_TEST_URL` | `.env.connect.ci` | No | Base URL for playground |
| `CORBADO_BACKEND_API_URL` | `.env.connect.ci` + GitHub secret | No | Backend API URL |
| `CORBADO_BACKEND_API_BASIC_AUTH` | GitHub secret | Yes | Backend API basic auth |
| `NEXT_PUBLIC_CORBADO_PROJECT_ID` | GitHub secret | Yes | Corbado project ID (needed by Next.js playground at build time) |
| `NEXT_PUBLIC_CORBADO_FRONTEND_API_URL_SUFFIX` | GitHub secret | Yes | Frontend API suffix (needed by Next.js playground) |
| `NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID` | GitHub secret | Yes | Cognito pool ID (needed by Next.js playground client-side) |
| `NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID` | GitHub variable | No | Cognito client ID (needed by Next.js playground client-side) |
| `PLAYWRIGHT_CONNECT_PROJECT_ID` | GitHub secret | Yes | Project ID for connect tests |
| `PLAYWRIGHT_NGROK_AUTH_TOKEN` | GitHub secret | Yes | Ngrok token for tunneling |
| `AWS_COGNITO_USER_POOL_ID` | GitHub secret | Yes | Cognito user pool ID (server-side) |
| `AWS_COGNITO_CLIENT_ID` | GitHub secret | Yes | Cognito client ID (server-side) |
| `AWS_COGNITO_CLIENT_SECRET` | GitHub secret | Yes | Cognito client secret |
| `AWS_REGION` | GitHub secret | No* | AWS region for Cognito |
| `AWS_ACCESS_KEY_ID` | GitHub secret `COGNITO_AWS_ACCESS_KEY_ID` | Yes | AWS key for Cognito operations |
| `AWS_SECRET_ACCESS_KEY` | GitHub secret `COGNITO_AWS_SECRET_ACCESS_KEY` | Yes | AWS secret for Cognito operations |

*`AWS_REGION` is not truly secret but is stored as one.

### CloudWatch logging (both test types)

| Variable | Source in CI | Description |
|---|---|---|
| `CLOUDWATCH_AWS_ACCESS_KEY_ID` | GitHub secret | AWS key for CloudWatch (separate from Cognito) |
| `CLOUDWATCH_AWS_SECRET_ACCESS_KEY` | GitHub secret | AWS secret for CloudWatch |
| `AWS_REGION` | GitHub secret | AWS region for CloudWatch |

## GitHub Secrets & Environments setup

The workflow uses **GitHub Environments** to scope secrets by test type. Each matrix entry runs with `environment: ${{ matrix.testType }}`, so complete runners only see `complete` environment secrets and connect runners only see `connect` environment secrets.

### Repo-level secrets (Settings > Secrets and variables > Actions > Secrets)

These are shared across all environments:

- `AWS_REGION`
- `CLOUDWATCH_AWS_ACCESS_KEY_ID` — (previously named `AWS_ACCESS_KEY_ID`)
- `CLOUDWATCH_AWS_SECRET_ACCESS_KEY` — (previously named `AWS_SECRET_ACCESS_KEY`)

### `complete` environment (Settings > Environments > complete)

**Secrets:**
- `DEFAULT_CORBADO_BACKEND_API_BASIC_AUTH` — (previously `CORBADO_BACKEND_API_BASIC_AUTH` in `.env.complete.ci`)
- `PLAYWRIGHT_JWT_TOKEN`
- `PLAYWRIGHT_GOOGLE_EMAIL`
- `PLAYWRIGHT_GOOGLE_PASSWORD`
- `PLAYWRIGHT_GOOGLE_TOTP_SECRET`

No protection rules (no required reviewers, no branch restrictions) — otherwise scheduled and manual runs will be blocked.

### `connect` environment (Settings > Environments > connect)

**Secrets:**
- `NEXT_PUBLIC_CORBADO_PROJECT_ID`
- `NEXT_PUBLIC_CORBADO_FRONTEND_API_URL_SUFFIX`
- `CORBADO_BACKEND_API_URL`
- `CORBADO_BACKEND_API_BASIC_AUTH`
- `PLAYWRIGHT_CONNECT_PROJECT_ID`
- `PLAYWRIGHT_NGROK_AUTH_TOKEN`
- `AWS_COGNITO_USER_POOL_ID`
- `AWS_COGNITO_CLIENT_ID`
- `AWS_COGNITO_CLIENT_SECRET`
- `COGNITO_AWS_ACCESS_KEY_ID` — (previously named `AWS_ACCESS_KEY_ID_CONNECT_PLAYGROUND`)
- `COGNITO_AWS_SECRET_ACCESS_KEY` — (previously named `AWS_SECRET_ACCESS_KEY_CONNECT_PLAYGROUND`)
- `AWS_REGION` — needed by the Connect playground's Cognito SDK at runtime

**Variables:**
- `NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID` — stored as an environment **variable** (not secret)

No protection rules (no required reviewers, no branch restrictions).

### Repo-level secrets that can be removed after migration

- `AWS_ACCESS_KEY_ID` — renamed to `CLOUDWATCH_AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY` — renamed to `CLOUDWATCH_AWS_SECRET_ACCESS_KEY`
- `AWS_ACCESS_KEY_ID_CONNECT_PLAYGROUND` — renamed to `COGNITO_AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY_CONNECT_PLAYGROUND` — renamed to `COGNITO_AWS_SECRET_ACCESS_KEY`
- `PLAYWRIGHT_TEST_URL` — now hardcoded in `.env.*.ci` files
- All per-test-type secrets that have been moved into their respective environments

## Generating JWT Token

The following script generates the JWT token used for `PLAYWRIGHT_JWT_TOKEN`:

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
