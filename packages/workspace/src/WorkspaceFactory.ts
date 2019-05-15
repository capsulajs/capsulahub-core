import { WorkspaceFactory as IWorkspaceFactory } from './api/WorkspaceFactory';
import { Workspace } from './Workspace';
import { getConfigurationService } from './helpers/utils';
import { CreateWorkspaceRequest } from './api/methods/createWorkspace';
import { configRepositoryName, configWrongFormatError, createWorkspaceWrongRequestError } from './helpers/const';
import { WorkspaceConfig } from './api/WorkspaceConfig';
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

        resolve(new Workspace(formattedConfiguration));
      } catch (error) {
        return reject(error);
      }

      resolve({} as Workspace);

      // resolve(new Workspace(configuration.entries));
    });
  }
}
