import { ConfigurationType } from '.';

export default interface CreateWorkspaceRequest {
  /** Token used to get workspace configuration */
  token: string;
  /**
   * The type of configuration provider, that will be used to get configuration
   * @default "httpFile"
   */
  configurationType?: ConfigurationType;
}
