import { expect } from '@playwright/test';

import StateManager from '../StateManager';

export async function deleteProject(id: string, playwrightProjectName: string) {
  const deleteRes = await fetch(
    `${process.env.CORE_API_URL}/v1/projects`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `cbo_short_session=${process.env.PLAYWRIGHT_JWT_TOKEN}`,
      },
      body: JSON.stringify({
        id,
      }),
    },
  );
  expect(deleteRes.ok).toBeTruthy();

  StateManager.deleteProjectId(playwrightProjectName);
}
