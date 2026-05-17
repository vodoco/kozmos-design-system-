import '@figma/code-connect';

declare module '@figma/code-connect' {
  export interface FigmaConnectAPI<InstanceChildrenT, ChildrenT> {
    number(figmaPropName: string): number;
  }
}
