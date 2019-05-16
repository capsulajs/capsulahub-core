import { RegisteredService } from '../api/methods/registerService';
import { RegisteredComponent } from '../api/methods/registerComponent';

export interface ServiceRegistry {
  [serviceName: string]: RegisteredService;
}

export interface ComponentRegistry {
  [nodeId: string]: RegisteredComponent;
}
