'use client';

import { useState } from 'react';
import type { PreconditionType } from '../types';
import type { useUsersManager } from '../hooks/useUsersManager';

interface UsersToolsTabProps {
  usersManager: ReturnType<typeof useUsersManager>;
}

const preconditions: PreconditionType[] = [
  'confirmed_user_with_pk',
  'confirmed_user_with_server_deleted_pk',
  'confirmed_user_with_social_google_ok',
  'confirmed_user_with_social_google_cancel',
  'confirmed_user_with_social_google_back',
  'confirmed_user_without_pk',
  'unconfirmed_user_without_pk',
];

export function UsersToolsTab({ usersManager }: UsersToolsTabProps) {
  const [selected, setSelected] = useState<PreconditionType>('confirmed_user_with_pk');

  return (
    <div className='test-section'>
      <div className='test-row'>
        <select
          data-testid='tooling-users-precondition'
          value={selected}
          onChange={e => setSelected(e.target.value as PreconditionType)}
        >
          {preconditions.map(precondition => (
            <option
              key={precondition}
              value={precondition}
            >
              {precondition}
            </option>
          ))}
        </select>
        <button
          data-testid='tooling-users-create'
          onClick={() => usersManager.createUser(selected)}
          disabled={usersManager.isLoading}
        >
          Create
        </button>
      </div>

      <div className='test-user-list'>
        {usersManager.users.map(user => (
          <div
            key={user.userID}
            className='test-user'
            data-testid='tooling-user-card'
          >
            <p>{user.email}</p>
            <p>{user.userID}</p>
            <p>{user.credentials.length} passkeys</p>
            <div className='test-row'>
              <button onClick={() => usersManager.addPasskey(user.userID)}>+ Passkey</button>
              <button onClick={() => usersManager.deleteUser(user.userID)}>Delete User</button>
            </div>
            {user.credentials.map(credential => (
              <div
                key={credential.credentialID}
                className='test-row'
              >
                <span className='test-credential'>{credential.id}</span>
                <span>{credential.status || 'unknown'}</span>
                <button onClick={() => usersManager.deletePasskey(user.userID, credential.id)}>Delete</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
