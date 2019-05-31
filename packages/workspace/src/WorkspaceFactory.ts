import { Entity } from '@capsulajs/capsulajs-configuration-service/lib/api/Entity';
import { API } from './';
import * as EXTERNAL_API from './helpers/types';
import { Workspace } from './Workspace';
import {
  bootstrapServices,
  getConfigurationServiceClass,
  getConfigurationService,
  initComponents,
} from './helpers/utils';
import {
  configNotLoadedError,
  configRepositoryName,
  configWrongFormatError,
  createWorkspaceWrongRequestError,
} from './helpers/const';
import { validateCreateWorkspaceRequest, validateWorkspaceConfig } from './helpers/validators';

export default class WorkspaceFactory implements API.WorkspaceFactory {
  public createWorkspace(createWorkspaceRequest: API.CreateWorkspaceRequest): Promise<API.Workspace> {
    return new Promise((resolve, reject) => {
      // createWorkspaceRequest validation
      if (!validateCreateWorkspaceRequest(createWorkspaceRequest)) {
        return reject(new Error(createWorkspaceWrongRequestError));
      }

      // Getting configurationService
      let configurationService;
      try {
        configurationService = getConfigurationService(createWorkspaceRequest.token, getConfigurationServiceClass(
          createWorkspaceRequest.configurationType
        ) as EXTERNAL_API.ConfigurationServiceClass);
      } catch (error) {
        return reject(new Error(configNotLoadedError));
      }

      // Getting configuration and initializing Workspace
      return configurationService
        .entries({ repository: configRepositoryName })
        .then((configuration: { entries: Entity[] }) => {
          // Preparing and validating formattedConfiguration
          const formattedConfiguration = configuration.entries.reduce(
            (acc: API.WorkspaceConfig, configEntity: Entity) => {
              return {
                ...acc,
                [configEntity.key]: configEntity.value,
              };
            },
            {} as API.WorkspaceConfig
          );
          if (!validateWorkspaceConfig(formattedConfiguration)) {
            return reject(new Error(configWrongFormatError));
          }

          const workspace = new Workspace(formattedConfiguration);
          return bootstrapServices(workspace, formattedConfiguration.services)
            .then(() => {
              return initComponents(workspace, formattedConfiguration.components.layouts, 'layout');
            })
            .then(() => {
              return initComponents(workspace, formattedConfiguration.components.items, 'item');
            })
            .then(() => {
              return resolve({
                services: workspace.services.bind(workspace),
                components: workspace.components.bind(workspace),
                registerService: workspace.registerService.bind(workspace),
              } as Workspace);
            })
            .catch((error) => {
              reject(error);
              workspace.cleanEventListeners();
            });
        })
        .catch((error) => reject(error));
    });
  }
}
