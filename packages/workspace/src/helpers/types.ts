import { RegisteredService } from '../api/methods/registerService';

export interface ServiceRegistry {
  [serviceName: string]: RegisteredService;
}
