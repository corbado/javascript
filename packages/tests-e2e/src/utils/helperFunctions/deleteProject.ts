import { expect } from '@playwright/test';

import StateManager from '../StateManager';

export async function deleteProject(id: string, playwrightProjectName: string) {
  const deleteRes = await fetch(`${process.env.DEVELOPERPANEL_API_URL}/v1/projects`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.PLAYWRIGHT_JWT_TOKEN}`,
    },
    body: JSON.stringify({
      projectId: id,
    }),
  });
  expect(deleteRes.ok).toBeTruthy();

  StateManager.deleteProjectId(playwrightProjectName);
}
