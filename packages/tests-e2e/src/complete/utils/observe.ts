export function getObserveProjectId(): string {
  const projectId = process.env.PLAYWRIGHT_COMPLETE_OBSERVE_PROJECT_ID;
  if (!projectId) {
    throw new Error('PLAYWRIGHT_COMPLETE_OBSERVE_PROJECT_ID is not configured');
  }
  return projectId;
}

