import { ServiceDefinition } from '@scalecube/scalecube-microservice/lib/api';

export interface RegisterServiceRequest {
  serviceName: string;
  definition: ServiceDefinition;
  reference: any;
}

export interface RegisteredService extends RegisterServiceRequest {}
