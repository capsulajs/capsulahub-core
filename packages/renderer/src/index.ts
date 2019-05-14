import { Workspace } from '@capsulajs/capsulahub-core-workspace/lib/api';
import { RendererConfig } from './api';
import * as api from './api';

declare global {
  interface Window {
    CAPSULAHUB_WORKSPACE: Workspace;
    CAPSULAHUB_CONFIG: RendererConfig;
  }
}

export default {
  api,
};
