import { WorkspaceFactory as IWorkspaceFactory } from './api/WorkspaceFactory';
import { Workspace } from './Workspace';
import { getConfigurationService } from './helpers/utils';
import { CreateWorkspaceRequest } from './api/methods/createWorkspace';
import { configRepositoryName } from './helpers/const';
import { WorkspaceConfig } from './api/WorkspaceConfig';
import { Entity } from '@capsulajs/capsulajs-configuration-service/lib/api/Entity';

export class WorkspaceFactory implements IWorkspaceFactory {
  createWorkspace(createWorkspaceRequest: CreateWorkspaceRequest): Promise<Workspace> {
    return new Promise(async (resolve, reject) => {
      try {
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

        console.log('formattedConfiguration', formattedConfiguration);
      } catch (error) {
        return reject(error);
      }

      resolve({} as Workspace);

      // resolve(new Workspace(configuration.entries));
    });
  }
}
