import { WorkspaceFactory as IWorkspaceFactory } from './api/WorkspaceFactory';
import { Workspace } from './Workspace';
import { getConfigurationService, getModuleDynamically } from './helpers/utils';
import { CreateWorkspaceRequest } from './api/methods/createWorkspace';
import {
  bootstrapServiceError,
  configRepositoryName,
  configWrongFormatError,
  createWorkspaceWrongRequestError,
} from './helpers/const';
import { Service, WorkspaceConfig } from './api/WorkspaceConfig';
import { Entity } from '@capsulajs/capsulajs-configuration-service/lib/api/Entity';
import { validateCreateWorkspaceRequest, validateWorkspaceConfig } from './helpers/validators';

export class WorkspaceFactory implements IWorkspaceFactory {
  createWorkspace(createWorkspaceRequest: CreateWorkspaceRequest): Promise<Workspace> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!validateCreateWorkspaceRequest(createWorkspaceRequest)) {
          return reject(new Error(createWorkspaceWrongRequestError));
        }

        const configurationService = getConfigurationService(createWorkspaceRequest.token);
        const configuration = await configurationService.entries({ repository: configRepositoryName });
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

        const servicesPromises = formattedConfiguration.services.map((service) => {
          return getModuleDynamically(service.path).then(
            (bootstrap: (workspace: Workspace, service: Service) => Promise<object>) => bootstrap(workspace, service)
          );
          // .then((serviceInstance) => ({
          //   reference: serviceInstance,
          //   definition: service.definition,
          // }));
        });

        try {
          await Promise.all(servicesPromises);
          console.log('GOOD SCENARIO services');
          resolve(workspace);
        } catch (error) {
          console.log('services ERROR', error);
          return reject(new Error(bootstrapServiceError));
        }
      } catch (error) {
        return reject(error);
      }
    });
  }
}
