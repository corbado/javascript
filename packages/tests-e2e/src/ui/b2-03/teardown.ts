import { test as teardown } from '../../fixtures/UILoginTest';
import { deleteProject } from '../../utils/helperFunctions/deleteProject';

teardown('delete b2.3 project', async ({ loginFlow }, testInfo) => {
  await deleteProject(loginFlow.projectId, testInfo.project.name);
});
