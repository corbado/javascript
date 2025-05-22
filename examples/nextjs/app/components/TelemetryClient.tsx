'use client';

import { sendEvent, TelemetryEventType } from '@corbado/shared-util';
import { useEffect, useRef } from 'react';

export function TelemetryClient() {
  const hasSentTelemetry = useRef(false);

  useEffect(() => {
    if (hasSentTelemetry.current) return;

    sendEvent({
      type: TelemetryEventType.EXAMPLE_APPLICATION_OPENED,
      payload: {
        exampleName: 'corbado/javascript/examples/nextjs',
      },
      sdkVersion: '3.1.0',
      sdkName: 'React SDK',
      identifier: process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID!,
    })
      .then(res => console.log('Telemetry sent:', res))
      .catch(err => console.error('Failed to send telemetry:', err));

    hasSentTelemetry.current = true;
  }, []);

  return null;
}
