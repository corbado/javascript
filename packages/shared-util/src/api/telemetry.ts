import type { TelemetryEventType } from '../types/telemetry';
import { TelemetryEventRequest } from '../types/telemetry';

const BASE_PATH = 'https://telemetry.cloud.corbado.io/v1/';
const ENDPOINT = 'telemetryEvents';
const TIMEOUT = 500; // milliseconds

export async function sendEvent({
  type,
  payload,
  sdkVersion,
  sdkName,
  identifier,
  debugMode = false,
}: {
  type: TelemetryEventType;
  payload?: Record<string, unknown>;
  sdkVersion: string;
  sdkName: string;
  identifier: string;
  debugMode?: boolean;
}): Promise<void> {
  const request = new TelemetryEventRequest({
    type,
    sdkVersion,
    sdkName,
    identifier,
    payload,
  });

  if (debugMode) {
    console.log('Telemetry event:', request.toJsonString());
    return;
  }

  const uri = `${BASE_PATH}${ENDPOINT}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: request.toJsonString(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
  } catch (error) {
    // Silently handle errors
  }
}
