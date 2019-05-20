import { WorkspaceFactory as IWorkspaceFactory } from './api';
import { Workspace } from './Workspace';
import { bootstrapServices, getConfigurationService, initComponents } from './helpers/utils';
import { CreateWorkspaceRequest } from './api/methods/createWorkspace';
import {
  bootstrapServiceError,
  configRepositoryName,
  configWrongFormatError,
  createWorkspaceWrongRequestError,
} from './helpers/const';
import WorkspaceConfig from './api/WorkspaceConfig';
import { Entity } from '@capsulajs/capsulajs-configuration-service/lib/api/Entity';
import { validateCreateWorkspaceRequest, validateWorkspaceConfig } from './helpers/validators';

export class WorkspaceFactory implements IWorkspaceFactory {
  public createWorkspace(createWorkspaceRequest: CreateWorkspaceRequest): Promise<Workspace> {
    return new Promise((resolve, reject) => {
      // createWorkspaceRequest validation
      if (!validateCreateWorkspaceRequest(createWorkspaceRequest)) {
        return reject(new Error(createWorkspaceWrongRequestError));
      }

      // Getting configurationService
      let configurationService;
      try {
        configurationService = getConfigurationService(createWorkspaceRequest.token);
      } catch (error) {
        return reject(new Error(bootstrapServiceError));
      }

      // Getting configuration and initializing Workspace
      return configurationService
        .entries({ repository: configRepositoryName })
        .then(
          (configuration: any): any => {
            // Preparing and validating formattedConfiguration
            const formattedConfiguration = configuration.entries.reduce(
              (acc: WorkspaceConfig, configEntity: Entity) => {
                return {
                  ...acc,
                  [configEntity.key]: configEntity.value,
                };
              },
              {} as WorkspaceConfig
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
          }
        )
        .catch((error) => reject(error));
    });
  }
}
