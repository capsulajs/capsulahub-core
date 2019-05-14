import { Workspace, WorkspaceConfig } from '@capsulajs/capsulahub-core-workspace/lib/api';
import * as api from './api';

declare global {
  interface Window {
    CAPSULAHUB_WORKSPACE: Workspace;
    CAPSULAHUB_CONFIG: WorkspaceConfig;
  }
}

export default {
  api,
};
