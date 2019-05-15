import { Workspace } from '@capsulajs/capsulahub-core-workspace/lib/api';
import { RendererConfig } from './api';
import * as api from './api';

declare global {
  interface Window {
    CAPSULAHUB_WORKSPACE: Workspace;
    SERVICE_CONFIG: RendererConfig;
  }
}

export default {
  api,
};
