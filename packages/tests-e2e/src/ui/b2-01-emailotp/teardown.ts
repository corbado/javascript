import { test as teardown } from '../../fixtures/UISignupTest';
import { deleteProject } from '../../utils/helperFunctions/deleteProject';

teardown('delete b2.1 project', async ({ signupFlow }, testInfo) => {
  await deleteProject(signupFlow.projectId, testInfo.project.name);
});
