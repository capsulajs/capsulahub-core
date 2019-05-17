import { Workspace } from '@capsulajs/capsulahub-core-workspace/lib/api';
import { RendererConfig } from './api';
import RendererService from './RendererService';
import * as api from './api';

interface Global extends NodeJS.Global {
  CAPSULAHUB_WORKSPACE: Workspace;
  SERVICE_CONFIG: RendererConfig;
}

export { api, RendererService, Global };
