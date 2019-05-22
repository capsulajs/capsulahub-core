import { RegisteredService, Component, Workspace } from '../api';

export interface ServiceRegistry {
  [serviceName: string]: RegisteredService;
}

export interface ComponentRegistry {
  [nodeId: string]: Component;
}

export interface InternalWorkspace extends Workspace {
  registerComponent(registerComponentRequest: Component): Promise<void>;
}

type EventHandler = (event: Event) => any;

export interface EventListeners {
  [eventType: string]: EventHandler[];
}
