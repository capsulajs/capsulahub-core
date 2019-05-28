export const configRepositoryName = 'workspace';

export const configWrongFormatError = 'Workspace configuration does not have the correct format';

export const configNotLoadedError = 'Workspace configuration can not be loaded';

export const createWorkspaceWrongRequestError = 'createWorkspace has been called with invalid token';

export const getLoadingServiceError = (error: Error, serviceMame: string) =>
  `Error while loading service ${serviceMame}: ${error.message}`;

export const getBootstrapServiceError = (error: Error, serviceMame: string) =>
  `Error while bootstrapping service ${serviceMame}: ${error.message}`;

export const getLoadingComponentError = (error: Error, componentMame: string) =>
  `Error while loading component ${componentMame}: ${error.message}`;

export const getBootstrapComponentError = (error: Error, componentMame: string) =>
  `Error while bootstrapping component ${componentMame}: ${error.message}`;

export const getInitComponentError = (error: Error, componentMame: string) =>
  `Error while initialization component ${componentMame}: ${error.message}`;

export const serviceAlreadyRegisteredError = 'Service has been already registered';

export const componentAlreadyRegisteredError = 'Component has been already registered';

export const invalidRegisterServiceRequestError = 'registerService has been called with invalid request';

export const serviceToRegisterMissingInConfigurationError =
  'Service that should be registered does not exist in the Workspace config';

export const componentToRegisterMissingInConfigurationError =
  'Component that should be registered does not exist in the Workspace config';

export const componentsRequestInvalidError = 'Components request is invalid';

export const servicesRequestInvalidError = 'Services request is invalid';
