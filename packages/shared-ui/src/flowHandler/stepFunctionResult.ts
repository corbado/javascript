import type { FlowType } from './constants';
import type { ScreenNames, UserState } from './types';

export class FlowUpdate {
  nextFlow: FlowType | null;
  nextScreen: ScreenNames | null;
  stateUpdate: UserState | null;

  constructor(nextFlow: FlowType | null, nextScreen: ScreenNames | null, stateUpdate: UserState | null) {
    this.nextFlow = nextFlow;
    this.nextScreen = nextScreen;
    this.stateUpdate = stateUpdate;
  }

  static navigate(screen: ScreenNames): FlowUpdate {
    return new FlowUpdate(null, screen, null);
  }

  static changeFlow(flowType: FlowType): FlowUpdate {
    return new FlowUpdate(flowType, null, null);
  }

  static navigateWithState(screen: ScreenNames, stateUpdate: UserState): FlowUpdate {
    return new FlowUpdate(null, screen, stateUpdate);
  }

  static state(stateUpdate: UserState): FlowUpdate {
    return new FlowUpdate(null, null, stateUpdate);
  }
}
