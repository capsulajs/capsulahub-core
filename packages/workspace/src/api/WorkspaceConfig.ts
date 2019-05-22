import { ServiceConfig, ComponentConfig } from '.';

export default interface WorkspaceConfig {
  name: string;
  services: ServiceConfig[];
  components: {
    layouts: { [nodeId: string]: ComponentConfig };
    items: { [nodeId: string]: ComponentConfig };
  };
}
