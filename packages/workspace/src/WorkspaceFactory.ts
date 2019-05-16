import { WorkspaceFactory as IWorkspaceFactory } from './api/WorkspaceFactory';
import { Workspace } from './Workspace';
import { getConfigurationService, getModuleDynamically, initComponent } from './helpers/utils';
import { CreateWorkspaceRequest } from './api/methods/createWorkspace';
import {
  bootstrapComponentError,
  bootstrapServiceError,
  configRepositoryName,
  configWrongFormatError,
  createWorkspaceWrongRequestError,
} from './helpers/const';
import WorkspaceConfig from './api/WorkspaceConfig';
import Service from './api/Service';
import { Entity } from '@capsulajs/capsulajs-configuration-service/lib/api/Entity';
import { validateCreateWorkspaceRequest, validateWorkspaceConfig } from './helpers/validators';

export class WorkspaceFactory implements IWorkspaceFactory {
  createWorkspace(createWorkspaceRequest: CreateWorkspaceRequest): Promise<Workspace> {
    return new Promise((resolve, reject) => {
      if (!validateCreateWorkspaceRequest(createWorkspaceRequest)) {
        return reject(new Error(createWorkspaceWrongRequestError));
      }

      let configurationService;
      try {
        configurationService = getConfigurationService(createWorkspaceRequest.token);
      } catch (error) {
        return reject(new Error(bootstrapServiceError));
      }

      let formattedConfiguration: WorkspaceConfig;
      let workspace: Workspace;
      return configurationService
        .entries({ repository: configRepositoryName })
        .then(
          (configuration: any): any => {
            formattedConfiguration = configuration.entries.reduce(
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

            workspace = new Workspace(formattedConfiguration);

            const servicesPromises = formattedConfiguration.services.map((service) => {
              return getModuleDynamically(service.path).then(
                (bootstrap: (workspace: Workspace, service: Service) => Promise<object>) =>
                  bootstrap(workspace, service)
              );
            });

            return Promise.all(servicesPromises).catch(() => {
              reject(new Error(bootstrapServiceError));
            });
          }
        )
        .then(() => {
          const layoutComponentsPromises = Object.keys(formattedConfiguration.components.layouts).map(
            (nodeId: string) => initComponent(nodeId, formattedConfiguration.components.layouts, workspace)
          );
          return Promise.all(layoutComponentsPromises).catch(() => {
            reject(new Error(bootstrapComponentError));
          });
        })
        .then(() => {
          const itemsComponentsPromises = Object.keys(formattedConfiguration.components.items).map((nodeId: string) =>
            initComponent(nodeId, formattedConfiguration.components.items, workspace)
          );
          return Promise.all(itemsComponentsPromises).catch(() => {
            reject(new Error(bootstrapComponentError));
          });
        })
        .then(() => {
          return resolve(workspace);
        })
        .catch((error) => reject(error));
    });
  }
}
