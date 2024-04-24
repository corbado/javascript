import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';

class StateManager {
  public static setProjectId(playwrightProjectName: string, projectId: string) {
    if (!existsSync(__dirname + '/../../test-states')) {
      mkdirSync(__dirname + '/../../test-states');
    }
    const key = playwrightProjectName.split('-').slice(0, -1).join('-');
    writeFileSync(__dirname + `/../../test-states/${key}.txt`, projectId, { encoding: 'utf-8', flag: 'w' });
  }

  public static getProjectId(playwrightProjectName: string) {
    const key = playwrightProjectName.split('-').slice(0, -1).join('-');
    return readFileSync(__dirname + `/../../test-states/${key}.txt`, { encoding: 'utf-8', flag: 'r+' });
  }

  public static deleteProjectId(playwrightProjectName: string) {
    const key = playwrightProjectName.split('-').slice(0, -1).join('-');
    rmSync(__dirname + `/../../test-states/${key}.txt`);
  }
}

export default StateManager;
