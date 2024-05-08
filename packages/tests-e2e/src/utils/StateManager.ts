import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';

class StateManager {
  private static makeKey(playwrightProjectName: string) {
    if (playwrightProjectName.includes('setup') || playwrightProjectName.includes('teardown')) {
      return playwrightProjectName.split('-').slice(0, -1).join('-');
    } else {
      return playwrightProjectName.split('-').slice(0, -2).join('-');
    }
  }

  public static setProjectId(playwrightProjectName: string, projectId: string) {
    if (!existsSync(__dirname + '/../../test-states')) {
      mkdirSync(__dirname + '/../../test-states');
    }
    writeFileSync(__dirname + `/../../test-states/${StateManager.makeKey(playwrightProjectName)}.txt`, projectId, { encoding: 'utf-8', flag: 'w' });
  }

  public static getProjectId(playwrightProjectName: string) {
    return readFileSync(__dirname + `/../../test-states/${StateManager.makeKey(playwrightProjectName)}.txt`, { encoding: 'utf-8', flag: 'r+' });
  }

  public static deleteProjectId(playwrightProjectName: string) {
    rmSync(__dirname + `/../../test-states/${StateManager.makeKey(playwrightProjectName)}.txt`);
  }
}

export default StateManager;
