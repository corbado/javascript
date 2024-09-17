export class StatefulLoader {
  onLoadingStart: () => void;
  onLoadingFinish: () => void;
  onLoadingError: () => void;
  silentLoadingPeriodMs: number;
  timeoutId: NodeJS.Timeout | null = null;

  constructor(
    onLoadingStart: () => void,
    onLoadingFinish: () => void,
    onLoadingError: () => void,
    silentLoadingPeriodMs = 0,
  ) {
    this.onLoadingStart = onLoadingStart;
    this.onLoadingFinish = onLoadingFinish;
    this.onLoadingError = onLoadingError;
    this.silentLoadingPeriodMs = silentLoadingPeriodMs;
  }

  start() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.onLoadingStart();
    }, this.silentLoadingPeriodMs);
  }

  finish() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.onLoadingFinish();
  }

  finishWithError() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.onLoadingError();
  }
}
