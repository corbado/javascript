#!/bin/bash

project_names=(
  "b1-01-emailotp-teardown"
  "b1-01-phoneotp-teardown"
  "b1-01-emaillink-teardown"
  "b1-02-teardown"
  "b1-03-teardown"
  "b1-11-teardown"
  "b2-01-emailotp-teardown"
  "b2-01-phoneotp-teardown"
  "b2-01-emaillink-teardown"
  "b2-03-teardown"
)

mkdir all-blob-reports
for project_name in "${project_names[@]}"; do
  PW_TEST_HTML_REPORT_OPEN='never' PLAYWRIGHT_PROJECT_NAME=$project_name playwright test --config=playwright.config.ui.ts --project=$project_name || EXIT=$?
  cp blob-report/$project_name/* all-blob-reports/
done

playwright merge-reports --reporter html all-blob-reports/

exit $EXIT
