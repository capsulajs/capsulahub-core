import { InitRequest } from './methods/init';

/**
 * The Orchestrator service is responsible for creating flows between different services available in the Workspace.
 * It defines the logic behavior of an application by creating specific interactions between the available services.
 */
export interface Orchestrator {
  /**
   * Init method run all the flows including in Orchestrator configuration
   * @param initRequest
   */
  init(initRequest: InitRequest): Promise<void>;
}
