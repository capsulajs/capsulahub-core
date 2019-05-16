import { ComponentType } from './components';

export interface RegisterComponentRequest {
  componentName: string;
  nodeId: string;
  type: ComponentType;
  reference: HTMLElement;
}
