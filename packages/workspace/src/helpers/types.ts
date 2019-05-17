import { RegisteredService } from '../api/methods/registerService';
import { Component } from '../api/methods/components';
import { Workspace } from '../api/Workspace';
import { RegisterComponentRequest } from '../api/methods/registerComponent';

export interface ServiceRegistry {
  [serviceName: string]: RegisteredService;
}

export interface ComponentRegistry {
  [nodeId: string]: Component;
}

export interface FullWorkspace extends Workspace {
  registerComponent(registerComponentRequest: RegisterComponentRequest): Promise<void>;
}
