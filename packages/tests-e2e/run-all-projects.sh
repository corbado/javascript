#!/bin/bash

project_names=(
  "b1-1-chromium"
  "b1-2-chromium"
  "b1-3-all-browsers"
)

for project_name in "${project_names[@]}"; do
  PW_TEST_HTML_REPORT_OPEN='never' PLAYWRIGHT_PROJECT_NAME=$project_name playwright test --config=playwright.config.ui.ts --project=$project_name || EXIT=$?
  mv playwright-report/$project_name/* playwright-report/
done

playwright merge-reports --reporter html playwright-report/

exit $EXIT
