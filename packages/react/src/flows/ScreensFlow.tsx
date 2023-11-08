import { useCorbadoFlowHandler } from "@corbado/react-sdk";

import { flows } from "./flows-screens-aggregator";

export const ScreensFlow = () => {
    const { currentFlowName, currentScreenName } = useCorbadoFlowHandler();

    if (!currentFlowName || !currentScreenName) { return null; }

    const Screen = flows[currentFlowName]?.[currentScreenName]?.();
    return(Screen)
}