import { RegisteredService } from '../api/methods/registerService';
import { Component } from '../api/methods/components';
import { Workspace } from '../api/Workspace';

export interface ServiceRegistry {
  [serviceName: string]: RegisteredService;
}

export interface ComponentRegistry {
  [nodeId: string]: Component;
}

export interface FullWorkspace extends Workspace {
  registerComponent(registerComponentRequest: Component): Promise<void>;
}

type EventHandler = (event: Event) => any;

export interface EventListeners {
  [eventType: string]: EventHandler[];
}
