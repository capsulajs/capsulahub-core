import { ServiceDefinition } from '@scalecube/scalecube-microservice/dist/esm/api/public';

export default interface Service {
  serviceName: string;
  path: string;
  definition: ServiceDefinition;
  config: { [key: string]: any };
}
