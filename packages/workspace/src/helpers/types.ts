import { API } from '..';
import { ConfigurationService } from '@capsulajs/capsulajs-configuration-service';

export interface ServiceRegistry {
  [serviceName: string]: API.RegisteredService;
}

export interface ComponentRegistry {
  [nodeId: string]: API.Component;
}

export interface Workspace extends API.Workspace {
  registerComponent(registerComponentRequest: API.Component): Promise<void>;
}

type EventHandler = (event: Event) => any;

export interface EventListeners {
  [eventType: string]: EventHandler[];
}

type CustomWebComponentClass = new () => API.CustomWebComponent;
export { CustomWebComponentClass };

export interface ComponentsConfig {
  [nodeId: string]: API.ComponentConfig;
}

export type ConfigurationServiceClass = new (token: string) => ConfigurationService;
