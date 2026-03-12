#!/usr/bin/env bash
#
# Parses Playwright JUnit XML results and sends a summary to AWS CloudWatch Logs.
#
# Usage: bash scripts/cloudwatch-log.sh <application> <platform> <run_type>
#
# Expects:
#   - packages/tests-e2e/test-results/results.xml to exist
#   - AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION set in env
#   - LOG_STREAM_NAME set in env (created by an earlier workflow step)
#   - GITHUB_RUN_ID set in env (provided by GitHub Actions)

set -euo pipefail

APPLICATION="$1"
PLATFORM="$2"
RUN_TYPE="$3"

RESULTS_XML="packages/tests-e2e/test-results/results.xml"

if [ ! -f "$RESULTS_XML" ]; then
  echo "Warning: $RESULTS_XML not found, skipping CloudWatch log."
  exit 0
fi

TESTS=$(xmllint --xpath 'string(/testsuites/@tests)' "$RESULTS_XML")
FAILURES=$(xmllint --xpath 'string(/testsuites/@failures)' "$RESULTS_XML")
SKIPPED=$(xmllint --xpath 'string(/testsuites/@skipped)' "$RESULTS_XML")
ERRORS=$(xmllint --xpath 'string(/testsuites/@errors)' "$RESULTS_XML")
TIME=$(xmllint --xpath 'string(/testsuites/@time)' "$RESULTS_XML")

PASSED=$((TESTS - FAILURES - ERRORS - SKIPPED))
FAILED=$((FAILURES + ERRORS))
TIMESTAMP=$(date +%s000)

LINK="https://github.com/corbado/javascript/actions/runs/${GITHUB_RUN_ID}"

LOG_EVENT_JSON="[{\"timestamp\":$TIMESTAMP,\"message\":\"{\\\"application\\\":\\\"$APPLICATION\\\",\\\"platform\\\":\\\"$PLATFORM\\\",\\\"run_type\\\":\\\"$RUN_TYPE\\\",\\\"execution_time\\\":$TIME,\\\"passed\\\":$PASSED,\\\"failed\\\":$FAILED,\\\"link\\\":\\\"$LINK\\\"}\"}]"

aws logs put-log-events \
  --log-group-name "test-results-board" \
  --log-stream-name "$LOG_STREAM_NAME" \
  --log-events "$LOG_EVENT_JSON"

echo "CloudWatch log sent: application=$APPLICATION platform=$PLATFORM passed=$PASSED failed=$FAILED"
