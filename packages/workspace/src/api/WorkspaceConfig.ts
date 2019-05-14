import Service from './Service';
import Component from './Component';

// @ts-ignore
interface WorkspaceConfig {
  name: string;
  services: Service[];
  components: {
    layouts: { [nodeId: string]: Component };
    items: { [nodeId: string]: Component };
  };
}
