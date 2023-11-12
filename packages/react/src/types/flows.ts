import type { ScreenNames } from "@corbado/web-core";

export type ScreensList = {
  [key in ScreenNames]?: React.FC;
}