export type ComponentType = 'layout' | 'item';

export interface ComponentsRequest {}

export interface Component {
  componentName: string;
  nodeId: string;
  reference: any;
  type: ComponentType;
}

export interface ComponentsMap {
  /** Each promise will be resolved when the corresponding component will be registered */
  [nodeId: string]: Promise<Component>;
}
