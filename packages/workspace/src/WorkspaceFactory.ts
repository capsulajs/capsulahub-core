import { WorkspaceFactory as IWorkspaceFactory } from './api/WorkspaceFactory';
import { Workspace as IWorkspace } from './api/Workspace';

export class WorkspaceFactory implements IWorkspaceFactory {
  createWorkspace(createWorkspaceRequest) {
    return Promise.resolve({} as IWorkspace);
  }
}
