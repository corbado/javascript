export function getObserveProjectId(): string {
  const projectId = process.env.NEXT_PUBLIC_DEFAULT_CORBADO_PROJECT_ID;
  if (!projectId) {
    throw new Error('NEXT_PUBLIC_DEFAULT_CORBADO_PROJECT_ID is not configured');
  }
  return projectId;
}
