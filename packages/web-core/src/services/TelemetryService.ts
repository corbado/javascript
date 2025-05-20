import { sendEvent, TelemetryEventType } from '@corbado/shared-util';

const SDK_VERSION = '1.0.0';
const SDK_NAME = 'Web SDK';

// The TelemetryService manages the collection of telemetry events and
// is enabled by default. It can be disabled by setting isEnabled=false
// during initialization (see init() method).
//
// For more details, please refer to our telemetry documentation
// at https://docs.corbado.com/corbado-complete/other/telemetry.

export class TelemetryService {
  private static instance: TelemetryService | null = null;
  private static packageMetadataSent = false;

  private readonly sdkVersion: string;
  private readonly sdkName: string;
  private readonly projectId: string;
  private readonly debugMode: boolean;
  private isEnabled: boolean;

  private constructor({
    projectId,
    isEnabled = true,
    debugMode = false,
  }: {
    projectId: string;
    isEnabled?: boolean;
    debugMode?: boolean;
  }) {
    this.projectId = projectId;
    this.sdkVersion = SDK_VERSION;
    this.sdkName = SDK_NAME;
    this.debugMode = debugMode;
    this.isEnabled = isEnabled;
  }

  static init({
    projectId,
    isEnabled = true,
    debugMode = false,
  }: {
    projectId: string;
    isEnabled?: boolean;
    debugMode?: boolean;
  }): void {
    if (TelemetryService.instance !== null) {
      throw new Error('TelemetryService.init() was already called.');
    }

    TelemetryService.instance = new TelemetryService({
      projectId,
      isEnabled,
      debugMode,
    });
  }

  static getInstance(): TelemetryService {
    if (TelemetryService.instance === null) {
      throw new Error('TelemetryService.init() must be called first.');
    }
    return TelemetryService.instance;
  }

  disableTelemetry(): void {
    this.isEnabled = false;
  }

  logMethodCalled(methodName: string, visitorId?: string): void {
    if (!this.isEnabled) {
      return;
    }

    const payload = {
      methodName,
      visitorId,
    };

    void sendEvent({
      type: TelemetryEventType.METHOD_CALLED,
      payload,
      sdkVersion: this.sdkVersion,
      sdkName: this.sdkName,
      identifier: this.projectId,
      debugMode: this.debugMode,
    });
  }

  logPackageMetadata(): void {
    if (!this.isEnabled || TelemetryService.packageMetadataSent) {
      return;
    }

    const payload = {
      browserInfo: this.getBrowserInfo(),
    };

    void sendEvent({
      type: TelemetryEventType.PACKAGE_METADATA,
      payload,
      sdkVersion: this.sdkVersion,
      sdkName: this.sdkName,
      identifier: this.projectId,
      debugMode: this.debugMode,
    });

    TelemetryService.packageMetadataSent = true;
  }

  private getBrowserInfo(): string {
    const userAgent = navigator.userAgent;
    const browserMatch = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    return browserMatch[1] ? `${browserMatch[1]} ${browserMatch[2]}` : 'Unknown Browser';
  }
}
