import { Workspace } from '@capsulajs/capsulahub-core-workspace/lib/api';
import RendererConfig from './api/RendererConfig';
import RendererService from './RendererService';
import * as api from './api';

declare global {
  let CAPSULAHUB_WORKSPACE: Workspace;
  let SERVICE_CONFIG: RendererConfig;
}

export { api, RendererService };
