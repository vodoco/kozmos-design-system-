/* eslint-disable @typescript-eslint/no-unused-vars */
import "@figma/code-connect";

declare module "@figma/code-connect" {
  export interface FigmaConnectAPI<_InstanceChildrenT, _ChildrenT> {
    number(figmaPropName: string): number;
  }
}
