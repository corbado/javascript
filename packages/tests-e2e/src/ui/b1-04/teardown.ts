import { test as teardown } from '../../fixtures/UISignupTest';
import { deleteProject } from '../../utils/helperFunctions/deleteProject';

teardown('delete b1.4 project', async ({ signupFlow }, testInfo) => {
  await deleteProject(signupFlow.projectId, testInfo.project.name);
});
