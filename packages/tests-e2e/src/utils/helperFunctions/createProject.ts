import { expect } from '@playwright/test';

import StateManager from '../StateManager';

function generateProjectName(prefix: string) {
  let suffix;
  if (process.env.CI) {
    if (!process.env.GITHUB_RUN_NUMBER) {
      throw new Error('GITHUB_RUN_NUMBER is not defined');
    }
    suffix = 'github' + process.env.GITHUB_RUN_NUMBER;
  } else {
    suffix = 'local' + String(Math.floor(Math.random() * 10000));
  }

  return `${prefix}-${suffix}`;
}

export async function createProject(namePrefix: string, playwrightProjectName: string) {
  const name = generateProjectName(namePrefix);

  const createRes = await fetch(`${process.env.CORE_API_URL}/v1/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `cbo_short_session=${process.env.PLAYWRIGHT_JWT_TOKEN}`,
    },
    body: JSON.stringify({
      name,
    }),
  });
  console.log(createRes);
  expect(createRes.ok).toBeTruthy();

  const projectId = (await createRes.json()).data.project.id;
  StateManager.setProjectId(playwrightProjectName, projectId);

  const configureRes = await fetch(`${process.env.BACKEND_API_URL}/v1/projectConfig`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `cbo_short_session=${process.env.PLAYWRIGHT_JWT_TOKEN}`,
      'X-Corbado-ProjectID': projectId,
    },
    body: JSON.stringify({
      frontendFramework: 'react',
      allowStaticChallenges: true,
      webauthnRPID: process.env.CI ? 'playground.corbado.io' : 'localhost',
    }),
  });
  expect(configureRes.ok).toBeTruthy();

  const activateRes = await fetch(`${process.env.BACKEND_API_URL}/v1/projects/activate`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `cbo_short_session=${process.env.PLAYWRIGHT_JWT_TOKEN}`,
      'X-Corbado-ProjectID': projectId,
    },
  });
  expect(activateRes.ok).toBeTruthy();

  return projectId;
}
