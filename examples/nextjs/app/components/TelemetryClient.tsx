'use client';

import { sendEvent, TelemetryEventType } from '@corbado/shared-util';
import { useEffect, useRef } from 'react';

export function TelemetryClient() {
  const hasSentTelemetry = useRef(false);

  useEffect(() => {
    if (hasSentTelemetry.current) return;

    void sendEvent({
      type: TelemetryEventType.EXAMPLE_APPLICATION_OPENED,
      payload: {
        exampleName: 'corbado/javascript/examples/nextjs',
      },
      sdkVersion: '3.1.0',
      sdkName: 'React SDK',
      identifier: process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID!,
    });

    hasSentTelemetry.current = true;
  }, []);

  return null;
}
