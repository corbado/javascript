import { sendEvent, TelemetryEventType } from '@corbado/shared-util';
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

  const { telemetryConfig, setTelemetryConfig } = context;
  const { projectId, disabled, mode } = telemetryConfig;
  const packageMetadataSent = useRef(false);

  const disableTelemetry = useCallback(() => {
    setTelemetryConfig(prev => ({ ...prev, disabled: true }));
  }, [setTelemetryConfig]);

  const logMethodCalled = useCallback(
    (methodName: string, screenName?: string) => {
      if (disabled) {
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
    [projectId, mode, disabled],
  );

  const logPackageMetadata = useCallback(
    ({ isDevMode, isPreviewMode }: { isDevMode?: boolean; isPreviewMode?: boolean }) => {
      if (disabled || packageMetadataSent.current) {
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
        ...(Object.keys(payload).length > 0 && { payload }),
        sdkVersion: SDK_VERSION,
        sdkName: SDK_NAME,
        identifier: projectId,
        debugMode: mode === 'debug',
      });

      packageMetadataSent.current = true;
    },
    [projectId, mode, disabled],
  );

  return {
    disableTelemetry,
    logMethodCalled,
    logPackageMetadata,
  };
}
