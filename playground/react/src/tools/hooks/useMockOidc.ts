'use client';

import { useCallback, useEffect, useState } from 'react';
import type { MockOidcBehavior, MockOidcUser } from '../types';

export function useMockOidc(sessionId: string) {
  const [user, setUser] = useState<MockOidcUser | null>(null);

  const refresh = useCallback(async () => {
    if (!sessionId) {
      return;
    }

    const response = await fetch(`/api/test/mock-oidc/users?devSessionId=${sessionId}`);
    if (!response.ok) {
      return;
    }

    const users = (await response.json()) as MockOidcUser[];
    setUser(users[0] ?? null);
  }, [sessionId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setMockUser = useCallback(
    async (email: string) => {
      if (!sessionId) {
        return;
      }

      await fetch('/api/test/mock-oidc/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cbo_dev_session_id: sessionId,
        },
        body: JSON.stringify({ email }),
      });
      await refresh();
    },
    [refresh, sessionId],
  );

  const updateBehavior = useCallback(
    async (behavior: MockOidcBehavior) => {
      if (!user) {
        return;
      }

      await fetch('/api/test/mock-oidc/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, behavior }),
      });
      await refresh();
    },
    [refresh, user],
  );

  const clearUser = useCallback(async () => {
    await fetch(`/api/test/mock-oidc/users?devSessionId=${sessionId}`, {
      method: 'DELETE',
    });
    await refresh();
  }, [refresh, sessionId]);

  return {
    user,
    refresh,
    setMockUser,
    updateBehavior,
    clearUser,
  };
}
