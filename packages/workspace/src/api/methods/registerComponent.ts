export interface RegisterComponentRequest {
  componentName: string;
  nodeId: string;
  reference: HTMLElement;
}

export interface RegisteredComponent extends RegisterComponentRequest {}
