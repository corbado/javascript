import { sendEvent, TelemetryEventType } from '@corbado/shared-util';
import { useCallback, useContext, useRef } from 'react';

import { TelemetryContext } from '../contexts/TelemetryContext';

const SDK_VERSION = '3.1.1';
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
  const { projectId, disabled, isDebugMode } = telemetryConfig;
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
        debugMode: isDebugMode,
      });
    },
    [projectId, isDebugMode, disabled],
  );

  const logComponentMounted = useCallback(() => {
    if (disabled || packageMetadataSent.current) {
      return;
    }

    const payload: Record<string, unknown> = {};

    if (telemetryConfig.hasCustomerSupportEmail !== undefined) {
      payload.hasCustomerSupportEmail = telemetryConfig.hasCustomerSupportEmail;
    }
    if (telemetryConfig.darkMode !== undefined) {
      payload.darkMode = telemetryConfig.darkMode;
    }
    if (telemetryConfig.isAutoDetectLanguageEnabled !== undefined) {
      payload.isAutoDetectLanguageEnabled = telemetryConfig.isAutoDetectLanguageEnabled;
    }
    if (telemetryConfig.defaultLanguage !== undefined) {
      payload.defaultLanguage = telemetryConfig.defaultLanguage;
    }
    if (telemetryConfig.isDevMode !== undefined) {
      payload.isDevMode = telemetryConfig.isDevMode;
    }
    if (telemetryConfig.isPreviewMode !== undefined) {
      payload.isPreviewMode = telemetryConfig.isPreviewMode;
    }

    if (telemetryConfig.isDefaultTheme !== undefined) {
      payload.isDefaultTheme = telemetryConfig.isDefaultTheme;
    }

    void sendEvent({
      type: TelemetryEventType.COMPONENT_MOUNTED,
      ...(Object.keys(payload).length > 0 && { payload }),
      sdkVersion: SDK_VERSION,
      sdkName: SDK_NAME,
      identifier: projectId,
      debugMode: isDebugMode,
    });

    packageMetadataSent.current = true;
  }, [projectId, isDebugMode, disabled, telemetryConfig]);

  return {
    disableTelemetry,
    logMethodCalled,
    logComponentMounted,
  };
}
