export function getObserveProjectId(): string {
  const projectId = process.env.DEFAULT_CORBADO_PROJECT_ID;
  if (!projectId) {
    throw new Error('DEFAULT_CORBADO_PROJECT_ID is not configured');
  }
  return projectId;
}
