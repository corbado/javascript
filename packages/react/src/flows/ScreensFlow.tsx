import { useCorbadoFlowHandler } from "@corbado/react-sdk";
import React from "react";

import { flows } from "./flows-screens-aggregator";

export const ScreensFlow = () => {
    const { currentFlowName, currentScreenName } = useCorbadoFlowHandler();

    if (!currentFlowName || !currentScreenName) { return null; }

    const Screen = flows[currentFlowName]?.[currentScreenName] as React.FC;
    return(<Screen />)
}