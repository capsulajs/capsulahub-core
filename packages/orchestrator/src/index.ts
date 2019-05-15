import { Workspace } from '@capsulajs/capsulahub-core-workspace/api';
import { OrchestratorConfig } from './api';
import * as api from './api';

declare var CAPSULAHUB_WORKSPACE: Workspace;
declare var SERVICE_CONFIG: OrchestratorConfig;

export { api };
