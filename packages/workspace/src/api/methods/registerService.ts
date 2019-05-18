import { ServiceDefinition } from '@scalecube/scalecube-microservice/lib/api';

export interface RegisterServiceRequest {
  serviceName: string;
  definition: ServiceDefinition;
}

export interface RegisteredService extends RegisterServiceRequest {}
