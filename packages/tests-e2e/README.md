# `tests-e2e`

This package currently contains all the end-to-end tests for testing the React package. We plan to extend the tests for other packages of Corbado JavaScript Library.

## Running Tests Locally

This package is intended to test the local Playground React deployment connected to the staging backend deployment.

### Setup

Copy the contents of .env.example into .env.local.
For `PLAYWRIGHT_JWT_TOKEN` environment variable, request the JWT token from Martin or Stefan.
For `PLAYWRIGHT_MICROSOFT_EMAIL` and `PLAYWRIGHT_MICROSOFT_PASSWORD` environment variables, request the credentials from Anders or Martin. You can also create your own Microsoft account for testing.

Make sure that the local Playground React deployment is configured to connect to the staging frontend API endpoints in `playground/react/.env`.

```
REACT_APP_CORBADO_FRONTEND_API_URL_SUFFIX=frontendapi.cloud.corbado-staging.io
```

Run the Playground React project locally.

```console
$ cd playground/react
$ npm start
```

Now Playwright is ready to test the local Playground deployment.

### With UI

```console
$ cd packages/tests-e2e
$ npx playwright test --config=playwright.config.ui.ts --ui --project=nightly
```

### From CLI

```console
npx playwright test --config=playwright.config.ui.ts --project=nightly
```

Alternatively, you can do:

```console
npm run e2e:ui:nightly
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
