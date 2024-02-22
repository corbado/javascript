#!/bin/bash

PW_TEST_HTML_REPORT_OPEN='never' playwright test --config=playwright.config.ui.ts --project=b1-1-chromium || EXIT=$?
PW_TEST_HTML_REPORT_OPEN='never' playwright test --config=playwright.config.ui.ts --project=b1-2-chromium || EXIT=$?
PW_TEST_HTML_REPORT_OPEN='never' playwright test --config=playwright.config.ui.ts --project=b1-3-chromium || EXIT=$?
echo $EXIT
exit $EXIT
