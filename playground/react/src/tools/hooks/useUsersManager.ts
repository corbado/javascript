'use client';

import { useCallback, useEffect, useState } from 'react';
import { createMockAttestationResponse } from '../mock-authenticator';
import type { PreconditionType, ToolUser } from '../types';

export function useUsersManager(sessionId: string) {
  const [users, setUsers] = useState<ToolUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshUsers = useCallback(async () => {
    if (!sessionId) {
      return;
    }

    const response = await fetch(`/api/test/users?devSessionId=${sessionId}`);
    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as { users: ToolUser[] };
    setUsers(data.users);
  }, [sessionId]);

  useEffect(() => {
    void refreshUsers();
  }, [refreshUsers]);

  const appendPasskeyWithMock = useCallback(
    async (userID: string) => {
      const startResponse = await fetch('/api/test/users/passkeys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cbo_dev_session_id: sessionId,
        },
        body: JSON.stringify({ userID }),
      });
      if (!startResponse.ok) {
        throw new Error('Failed to start passkey append');
      }
      const startData = (await startResponse.json()) as {
        processID: string;
        trackingID: string;
        attestationOptions: string;
      };

      const attestationResponse = await createMockAttestationResponse(startData.attestationOptions, sessionId);

      const finishResponse = await fetch('/api/test/users/passkeys', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          cbo_dev_session_id: sessionId,
        },
        body: JSON.stringify({
          userID,
          processID: startData.processID,
          trackingID: startData.trackingID,
          attestationResponse,
        }),
      });
      if (!finishResponse.ok) {
        throw new Error('Failed to finish passkey append');
      }
    },
    [sessionId],
  );

  const createUser = useCallback(
    async (precondition: PreconditionType) => {
      if (!sessionId) {
        return;
      }
      setIsLoading(true);
      try {
        const createResponse = await fetch('/api/test/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            cbo_dev_session_id: sessionId,
          },
          body: JSON.stringify({ precondition }),
        });

        if (!createResponse.ok) {
          throw new Error('Failed to create user');
        }
        const { userID } = (await createResponse.json()) as { userID: string };

        if (precondition === 'confirmed_user_with_pk' || precondition === 'confirmed_user_with_server_deleted_pk') {
          await appendPasskeyWithMock(userID);
        }

        await refreshUsers();

        if (precondition === 'confirmed_user_with_server_deleted_pk') {
          const latestUsersResponse = await fetch(`/api/test/users?devSessionId=${sessionId}`);
          const latestUsersData = latestUsersResponse.ok
            ? ((await latestUsersResponse.json()) as { users: ToolUser[] })
            : { users: [] };
          const createdUser = latestUsersData.users.find(user => user.userID === userID);
          const activeCredential = createdUser?.credentials.find(credential => credential.status !== 'deleted');
          if (activeCredential) {
            await fetch('/api/test/users/passkeys', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                cbo_dev_session_id: sessionId,
              },
              body: JSON.stringify({ userID, credentialID: activeCredential.id }),
            });
          }
        }
        await refreshUsers();
      } finally {
        setIsLoading(false);
      }
    },
    [appendPasskeyWithMock, refreshUsers, sessionId],
  );

  const deleteUser = useCallback(
    async (userID: string) => {
      await fetch(`/api/test/users?devSessionId=${sessionId}&userID=${encodeURIComponent(userID)}`, {
        method: 'DELETE',
      });
      await refreshUsers();
    },
    [refreshUsers, sessionId],
  );

  const addPasskey = useCallback(
    async (userID: string) => {
      await appendPasskeyWithMock(userID);
      await refreshUsers();
    },
    [appendPasskeyWithMock, refreshUsers],
  );

  const deletePasskey = useCallback(
    async (userID: string, credentialID: string) => {
      await fetch('/api/test/users/passkeys', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          cbo_dev_session_id: sessionId,
        },
        body: JSON.stringify({ userID, credentialID }),
      });
      await refreshUsers();
    },
    [refreshUsers, sessionId],
  );

  return {
    users,
    isLoading,
    refreshUsers,
    createUser,
    deleteUser,
    addPasskey,
    deletePasskey,
  };
}
