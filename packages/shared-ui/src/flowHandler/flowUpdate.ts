import type { FlowType } from './constants';
import type { ScreenNames } from './constants';
import type { UserState } from './types';

export class FlowUpdate {
  nextFlow: FlowType | null;
  nextScreen: ScreenNames | null;
  stateUpdate: UserState | null;

  constructor(nextFlow: FlowType | null, nextScreen: ScreenNames | null, stateUpdate: UserState | null) {
    this.nextFlow = nextFlow;
    this.nextScreen = nextScreen;
    this.stateUpdate = stateUpdate;
  }

  static navigate(screen: ScreenNames, stateUpdate?: UserState): FlowUpdate {
    return new FlowUpdate(null, screen, stateUpdate ?? null);
  }

  static changeFlow(flowType: FlowType): FlowUpdate {
    return new FlowUpdate(flowType, null, null);
  }

  static state(stateUpdate: UserState): FlowUpdate {
    return new FlowUpdate(null, null, stateUpdate);
  }

  static ignore() {
    return new FlowUpdate(null, null, null);
  }
}
