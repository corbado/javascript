'use client';

import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTestSession } from './hooks/useTestSession';
import { AuthToolsTab } from './tabs/AuthToolsTab';
import { UsersToolsTab } from './tabs/UsersToolsTab';
import { useMockAuthenticator } from './hooks/useMockAuthenticator';
import { useMockOidc } from './hooks/useMockOidc';
import { useUsersManager } from './hooks/useUsersManager';

export function TestSidebar() {
  const pathname = usePathname();
  const { sessionId } = useTestSession();
  const isVisible = useMemo(() => Boolean(pathname), [pathname]);
  const [activeTab, setActiveTab] = useState<'users' | 'auth'>('users');

  const mockAuthenticator = useMockAuthenticator(sessionId);
  const mockOidc = useMockOidc(sessionId);
  const usersManager = useUsersManager(sessionId);

  if (!isVisible || !sessionId) {
    return null;
  }

  return (
    <aside className='test-sidebar'>
      <h3>Tooling</h3>
      <div className='test-tabs'>
        <div role='tablist' className='test-row'>
          <button
            data-testid='tooling-tab-users'
            role='tab'
            aria-selected={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            data-testid='tooling-tab-auth'
            role='tab'
            aria-selected={activeTab === 'auth'}
            onClick={() => setActiveTab('auth')}
          >
            Auth
          </button>
        </div>
        {activeTab === 'users' ? (
          <UsersToolsTab usersManager={usersManager} />
        ) : (
          <AuthToolsTab
            mockAuthenticator={mockAuthenticator}
            mockOidc={mockOidc}
            users={usersManager.users}
          />
        )}
      </div>
    </aside>
  );
}
