import type { ScreenNames } from "@corbado/react-sdk";

export type ScreensList = {
  [key in ScreenNames]?: React.FC;
};
