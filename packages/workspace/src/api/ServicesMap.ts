import { Service } from '.';

export default interface ServicesMap {
  /** Each promise will be resolved when the corresponding service will be registered */
  [serviceName: string]: Promise<Service>;
}
