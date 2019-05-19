// import { ServiceDefinition } from '@scalecube/scalecube-microservice/lib/api';

export interface RegisterServiceRequest {
  serviceName: string;
  reference: any;
}

export interface RegisteredService extends RegisterServiceRequest {}
