# `tests-e2e`

This package currently contains all the end-to-end tests for testing the React package. We plan to extend the tests for other packages of Corbado JavaScript Library.

## Running Tests Locally

Playground is locally run within Playwright for both Complete and Connect tests. For reference look at `utils/playground.ts`.

This means that tests can simply be run with a single command. The command depends on whether you want to run it headless or with UI.

### Headless

```
cd packages/tests-e2e
npm run e2e:complete
npm run e2e:connect
```

### With UI

```
cd packages/tests-e2e
npm run e2e:complete:ui
npm run e2e:connect:ui
```

## Generating JWT Token

The following is the script used to generate the JWT token.

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

The first segment of the script contains all the information that must be extracted from the backend deployment.

As evident in the script, the token is valid for around 34 days. The token is intended to be renewed monthly using this script. For rewnewal, it is not necessary to extract all the information in the first segment.

## Authoring rules (connect2)

- Knowledge about page structure lives in `/models` only. Scenarios call model methods, not raw selectors.
- All passkey authenticator interactions flow through `VirtualAuthenticator`.
- All TOTP authenticator interactions flow through `AuthenticatorApp`.
- Scenarios set up app state via navigation helpers and avoid duplicating UI logic.
- Prefer explicit `awaitPage/visible` checks when changing screens.
