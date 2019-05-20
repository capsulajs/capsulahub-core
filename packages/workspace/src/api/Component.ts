import { ComponentType } from './index';

export default interface Component {
  componentName: string;
  nodeId: string;
  reference: any;
  type: ComponentType;
}
