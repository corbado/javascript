#!/bin/bash

project_names=(
  "b1-01-emailotp-chromium"
  "b1-01-phoneotp-chromium"
  # "b1-01-emaillink-chromium"
  # "b1-02-chromium"
  # "b1-03-all-browsers"
  # "b1-11-chromium"
  # "b2-01-emailotp-chromium"
  # "b2-01-phoneotp-chromium"
  # "b2-01-emaillink-chromium"
  # "b2-03-all-browsers"
)

mkdir all-blob-reports
for project_name in "${project_names[@]}"; do
  PW_TEST_HTML_REPORT_OPEN='never' PLAYWRIGHT_PROJECT_NAME=$project_name playwright test --config=playwright.config.ui.ts --project=$project_name || EXIT=$?
  cp blob-report/$project_name/* all-blob-reports/
done

playwright merge-reports --reporter html all-blob-reports/

exit $EXIT
