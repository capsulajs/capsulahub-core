import { WorkspaceFactory as IWorkspaceFactory } from './api/WorkspaceFactory';
import { Workspace as IWorkspace } from './api/Workspace';
import { getConfigurationService } from './helpers/utils';

export class WorkspaceFactory implements IWorkspaceFactory {
  createWorkspace(createWorkspaceRequest) {
    return new Promise(async (resolve, reject) => {
      try {
        const configurationService = await getConfigurationService(createWorkspaceRequest.token);
        const configuration = await configurationService.entries({ repository: 'test' });
      } catch (error) {
        return reject(error);
      }

      resolve({} as IWorkspace);
    });
  }
}
