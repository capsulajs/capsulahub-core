export interface RegisteredService {
  serviceName: string;
  displayName: string;
  definition: any;
}

export type EventType = 'request' | 'response';
export interface LoggerEvent {
  timestamp: number;
  correlationId: string;
  type: string;
  serviceName: string;
  methodName: string;
  request: any;
  data: any;
}