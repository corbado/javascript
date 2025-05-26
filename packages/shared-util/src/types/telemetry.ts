export enum TelemetryEventType {
  EXAMPLE_APPLICATION_OPENED = 'EXAMPLE_APPLICATION_OPENED',
  PACKAGE_METADATA = 'PACKAGE_METADATA',
  METHOD_CALLED = 'METHOD_CALLED',
  COMPONENT_MOUNTED = 'COMPONENT_MOUNTED',
}

export interface TelemetryEventRequestData {
  payload?: Record<string, unknown>;
  sdkVersion?: string;
  sdkName?: string;
  identifier: string;
  type: TelemetryEventType;
}

export class TelemetryEventRequest {
  payload?: Record<string, unknown>;
  sdkVersion?: string;
  sdkName?: string;
  identifier: string;
  type: TelemetryEventType;

  constructor(data: TelemetryEventRequestData) {
    this.payload = data.payload;
    this.sdkVersion = data.sdkVersion;
    this.sdkName = data.sdkName;
    this.identifier = data.identifier;
    this.type = data.type;
  }

  toJson(): Record<string, unknown> {
    const map: Record<string, unknown> = {
      identifier: this.identifier,
      type: this.type.toString(),
    };

    if (this.payload != null) {
      map['payload'] = JSON.stringify(this.payload);
    }
    if (this.sdkVersion != null) {
      map['sdk_version'] = this.sdkVersion;
    }
    if (this.sdkName != null) {
      map['sdk'] = this.sdkName;
    }

    return map;
  }

  toJsonString(): string {
    return JSON.stringify(this.toJson());
  }
}
