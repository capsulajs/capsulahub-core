import { RegisteredService } from '../api/methods/registerService';
import { Component } from '../api/methods/components';

export interface ServiceRegistry {
  [serviceName: string]: RegisteredService;
}

export interface ComponentRegistry {
  [nodeId: string]: Component;
}
