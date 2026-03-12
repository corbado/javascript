'use client';

import { useEffect, useState } from 'react';

export function useTestSession() {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    const key = 'cbo_dev_session_id';
    let sid = localStorage.getItem(key);

    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem(key, sid);
    }

    document.cookie = `mock_oidc_dev_session=${sid}; path=/; max-age=300`;
    setSessionId(sid);
  }, []);

  return { sessionId };
}
