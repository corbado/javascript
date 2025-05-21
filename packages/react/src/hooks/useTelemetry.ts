import { sendEvent } from '@corbado/shared-util';
import { TelemetryEventType } from '@corbado/types';
import { useCallback, useContext, useRef } from 'react';

import { TelemetryContext } from '../contexts/TelemetryContext';

const SDK_VERSION = '3.1.0';
const SDK_NAME = 'React SDK';

// The useTelemetry hook manages the collection of telemetry events and
// is enabled by default. It can be disabled by setting disabled=true
// during initialization.
//
// For more details, please refer to our telemetry documentation
// at https://docs.corbado.com/corbado-complete/other/telemetry.

export function useTelemetry() {
  const context = useContext(TelemetryContext);

  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }

  const { telemetryConfig } = context;

  const { projectId, disabled, mode } = telemetryConfig;
  const packageMetadataSent = useRef(false);
  const isEnabledRef = useRef(!disabled);

  const disableTelemetry = useCallback(() => {
    isEnabledRef.current = false;
  }, []);

  const logMethodCalled = useCallback(
    (methodName: string, screenName?: string) => {
      if (!isEnabledRef.current) {
        return;
      }

      const payload = {
        methodName,
        screenName,
      };

      void sendEvent({
        type: TelemetryEventType.METHOD_CALLED,
        payload,
        sdkVersion: SDK_VERSION,
        sdkName: SDK_NAME,
        identifier: projectId,
        debugMode: mode === 'debug',
      });
    },
    [projectId, mode],
  );

  const logPackageMetadata = useCallback(
    ({ isDevMode, isPreviewMode }: { isDevMode?: boolean; isPreviewMode?: boolean }) => {
      if (!isEnabledRef.current || packageMetadataSent.current) {
        return;
      }

      const payload: Record<string, boolean> = {};
      if (isDevMode !== undefined) {
        payload.isDevMode = isDevMode;
      }
      if (isPreviewMode !== undefined) {
        payload.isPreviewMode = isPreviewMode;
      }

      void sendEvent({
        type: TelemetryEventType.PACKAGE_METADATA,
        payload,
        sdkVersion: SDK_VERSION,
        sdkName: SDK_NAME,
        identifier: projectId,
        debugMode: mode === 'debug',
      });

      packageMetadataSent.current = true;
    },
    [projectId, mode],
  );

  return {
    disableTelemetry,
    logMethodCalled,
    logPackageMetadata,
  };
}
