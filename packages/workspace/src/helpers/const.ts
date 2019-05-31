import { ConfigurationType } from '../api';

export const configRepositoryName = 'workspace';

export const configWrongFormatError = 'Workspace configuration does not have the correct format';

export const configNotLoadedError = 'Workspace configuration can not be loaded';

export const createWorkspaceWrongRequestError = 'createWorkspace has been called with invalid token';

export const getLoadingServiceError = (error: Error, serviceName: string) =>
  `Error while loading service "${serviceName}": ${error.message}`;

export const getBootstrapServiceError = (error: Error, serviceName: string) =>
  `Error while bootstrapping service "${serviceName}": ${error.message}`;

export const getLoadingComponentError = (error: Error, componentName: string) =>
  `Error while loading component "${componentName}": ${error.message}`;

export const getBootstrapComponentError = (error: Error, componentName: string) =>
  `Error while bootstrapping component "${componentName}": ${error.message}`;

export const getInitComponentError = (error: Error, componentName: string) =>
  `Error while initialization component "${componentName}": ${error.message}`;

export const getScalecubeCreationError = (error: Error, serviceName: string) =>
  `Error in serviceRegister has happened for "${serviceName}" while creating Scalecube microservice: ${error.message}`;

export const serviceAlreadyRegisteredError = 'Service has been already registered';

export const componentAlreadyRegisteredError = 'Component has been already registered';

export const invalidRegisterServiceRequestError = 'registerService has been called with invalid request';

export const serviceToRegisterMissingInConfigurationError =
  'Service that should be registered does not exist in the Workspace config';

export const componentToRegisterMissingInConfigurationError =
  'Component that should be registered does not exist in the Workspace config';

export const componentsRequestInvalidError = 'Components request is invalid';

export const servicesRequestInvalidError = 'Services request is invalid';

export const configurationTypes = {
  localFile: 'localFile' as ConfigurationType,
  hardcoreServer: 'hardcoreServer' as ConfigurationType,
  httpFile: 'httpFile' as ConfigurationType,
  httpServer: 'httpServer' as ConfigurationType,
  localStorage: 'localStorage' as ConfigurationType,
};
