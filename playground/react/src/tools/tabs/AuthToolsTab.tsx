'use client';

import { useState } from 'react';
import type { MockOidcBehavior, ToolUser } from '../types';
import type { useMockAuthenticator } from '../hooks/useMockAuthenticator';
import type { useMockOidc } from '../hooks/useMockOidc';

interface AuthToolsTabProps {
  mockAuthenticator: ReturnType<typeof useMockAuthenticator>;
  mockOidc: ReturnType<typeof useMockOidc>;
  users: ToolUser[];
}

export function AuthToolsTab({ mockAuthenticator, mockOidc, users }: AuthToolsTabProps) {
  const [oidcEmail, setOidcEmail] = useState('');

  return (
    <div className='test-section'>
      <label className='test-row'>
        <input
          data-testid='tooling-auth-enabled'
          type='checkbox'
          checked={mockAuthenticator.authenticatorControlActive}
          onChange={e => mockAuthenticator.setAuthenticatorControlActive(e.target.checked)}
        />
        Mock authenticator enabled
      </label>

      <label>Passkey login (with identifier)</label>
      <select
        data-testid='tooling-auth-login-with-identifier'
        value={mockAuthenticator.mockLoginBehaviour.withIdentifier}
        onChange={e =>
          mockAuthenticator.setMockLoginBehaviour({
            ...mockAuthenticator.mockLoginBehaviour,
            withIdentifier: e.target.value as 'complete' | 'cancel' | 'error' | 'not-started',
          })
        }
      >
        <option value='complete'>complete</option>
        <option value='cancel'>cancel</option>
        <option value='error'>error</option>
        <option value='not-started'>not-started</option>
      </select>

      <label>Passkey login (without identifier)</label>
      <select
        data-testid='tooling-auth-login-without-identifier'
        value={mockAuthenticator.mockLoginBehaviour.withoutIdentifier}
        onChange={e =>
          mockAuthenticator.setMockLoginBehaviour({
            ...mockAuthenticator.mockLoginBehaviour,
            withoutIdentifier: e.target.value as 'complete' | 'cancel' | 'error' | 'not-started',
          })
        }
      >
        <option value='complete'>complete</option>
        <option value='cancel'>cancel</option>
        <option value='error'>error</option>
        <option value='not-started'>not-started</option>
      </select>

      <label>Passkey create</label>
      <select
        data-testid='tooling-auth-create'
        value={mockAuthenticator.mockCreateBehaviour.action}
        onChange={e =>
          mockAuthenticator.setMockCreateBehaviour({
            action: e.target.value as 'complete' | 'cancel' | 'error' | 'not-started',
          })
        }
      >
        <option value='complete'>complete</option>
        <option value='cancel'>cancel</option>
        <option value='error'>error</option>
        <option value='not-started'>not-started</option>
      </select>

      <label>Credential for complete actions</label>
      <select
        data-testid='tooling-auth-credential'
        value={mockAuthenticator.mockLoginBehaviour.withIdentifierCompleteWithCredentialId || ''}
        onChange={e =>
          mockAuthenticator.setMockLoginBehaviour({
            ...mockAuthenticator.mockLoginBehaviour,
            withIdentifierCompleteWithCredentialId: e.target.value || undefined,
            withoutIdentifierCompleteWithCredentialId: e.target.value || undefined,
          })
        }
      >
        <option value=''>latest available</option>
        {users
          .flatMap(user => user.credentials)
          .map(credential => (
            <option
              key={credential.id}
              value={credential.id}
            >
              {credential.id}
            </option>
          ))}
      </select>

      <button
        data-testid='tooling-auth-apply'
        onClick={() => mockAuthenticator.updateMockBehavior()}
      >
        Apply authenticator settings
      </button>

      <hr />

      <label>Mock social user email</label>
      <div className='test-row'>
        <input
          data-testid='tooling-social-email'
          type='email'
          value={oidcEmail}
          onChange={e => setOidcEmail(e.target.value)}
          placeholder='integration-test+social@corbado.com'
        />
        <button
          data-testid='tooling-social-set'
          onClick={async () => {
            await mockOidc.setMockUser(oidcEmail);
            setOidcEmail('');
          }}
        >
          Set
        </button>
      </div>
      <div className='test-row'>
        <select
          data-testid='tooling-social-behavior'
          value={mockOidc.user?.behavior || 'success'}
          onChange={e => mockOidc.updateBehavior(e.target.value as MockOidcBehavior)}
          disabled={!mockOidc.user}
        >
          <option value='success'>success</option>
          <option value='cancel'>cancel</option>
          <option value='error'>error</option>
          <option value='navigate_back'>navigate_back</option>
        </select>
        <button
          data-testid='tooling-social-clear'
          onClick={() => mockOidc.clearUser()}
        >
          Clear
        </button>
      </div>
      {mockOidc.user ? <p>Active social user: {mockOidc.user.email}</p> : <p>No social user configured.</p>}
    </div>
  );
}
