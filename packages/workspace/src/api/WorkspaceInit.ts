import { Workspace } from './Workspace';
import { RegisterComponent } from '.';

type WorkspaceInit = (workspace: Workspace, registerComponent: RegisterComponent) => Promise<any>;

export default WorkspaceInit;
