'use client';

import { useCallback, useEffect, useState } from 'react';
import { disableMockAuthenticator, enableMockAuthenticator } from '../mock-authenticator';

export interface MockLoginBehaviour {
  withIdentifier: 'complete' | 'cancel' | 'error' | 'not-started';
  withIdentifierCompleteWithCredentialId?: string;
  withoutIdentifier: 'complete' | 'cancel' | 'error' | 'not-started';
  withoutIdentifierCompleteWithCredentialId?: string;
}

export interface MockCreateBehaviour {
  action: 'complete' | 'cancel' | 'error' | 'not-started';
}

interface StoredMockAuthState {
  login: MockLoginBehaviour;
  create: MockCreateBehaviour;
  enabled: boolean;
}

function storageKey(sessionId: string) {
  return `mock-auth-behavior:${sessionId}`;
}

export function useMockAuthenticator(sessionId: string) {
  const [authenticatorControlActive, setAuthenticatorControlActive] = useState(false);
  const [mockLoginBehaviour, setMockLoginBehaviour] = useState<MockLoginBehaviour>({
    withIdentifier: 'complete',
    withoutIdentifier: 'not-started',
  });
  const [mockCreateBehaviour, setMockCreateBehaviour] = useState<MockCreateBehaviour>({
    action: 'complete',
  });

  const refreshBehavior = useCallback(() => {
    if (!sessionId) {
      return;
    }

    const raw = localStorage.getItem(storageKey(sessionId));
    if (!raw) {
      return;
    }
    try {
      const parsed = JSON.parse(raw) as StoredMockAuthState;
      setMockLoginBehaviour(parsed.login);
      setMockCreateBehaviour(parsed.create);
      setAuthenticatorControlActive(Boolean(parsed.enabled));
    } catch {
      localStorage.removeItem(storageKey(sessionId));
    }
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) {
      return;
    }
    if (authenticatorControlActive) {
      enableMockAuthenticator(sessionId);
      return;
    }
    disableMockAuthenticator();
  }, [authenticatorControlActive, sessionId]);

  useEffect(() => {
    refreshBehavior();
  }, [refreshBehavior]);

  const updateMockBehavior = useCallback(async () => {
    if (!sessionId) {
      return;
    }
    const state: StoredMockAuthState = {
      enabled: authenticatorControlActive,
      login: mockLoginBehaviour,
      create: mockCreateBehaviour,
    };
    localStorage.setItem(storageKey(sessionId), JSON.stringify(state));
  }, [authenticatorControlActive, mockCreateBehaviour, mockLoginBehaviour, sessionId]);

  return {
    authenticatorControlActive,
    setAuthenticatorControlActive,
    mockLoginBehaviour,
    setMockLoginBehaviour,
    mockCreateBehaviour,
    setMockCreateBehaviour,
    updateMockBehavior,
    refreshBehavior,
  };
}
