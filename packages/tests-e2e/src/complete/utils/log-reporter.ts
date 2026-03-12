import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

class LogReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult) {
    const duration = (result.duration / 1000).toFixed(1);
    const status = result.status.toUpperCase();
    const retry = result.retry > 0 ? ` (retry ${result.retry})` : '';
    const title = test.titlePath().slice(1).join(' > ');
    console.log(`[${status}] ${title} (${duration}s)${retry}`);
  }

  onEnd(result: { status: string }) {
    console.log(`\nTest run finished: ${result.status}`);
  }
}

export default LogReporter;
