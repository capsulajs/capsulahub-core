import Service from './Service';
import Component from './Component';

export default interface WorkspaceConfig {
  name: string;
  services: Service[];
  components: {
    layouts: { [nodeId: string]: Component };
    items: { [nodeId: string]: Component };
  };
}
