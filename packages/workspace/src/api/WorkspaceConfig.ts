import { ServiceDefinition } from '@scalecube/scalecube-microservice/dist/esm/api/public';

interface Service {
  serviceName: string;
  path: string;
  definition: ServiceDefinition;
  config: { [key: string]: any };
}

interface Component {
  componentName: string;
  path: string;
  config: { [key: string]: any };
}

// @ts-ignore
interface WorkspaceConfig {
  name: string;
  services: Service[];
  components: {
    layouts: { [nodeId: string]: Component };
    items: { [nodeId: string]: Component };
  };
}
