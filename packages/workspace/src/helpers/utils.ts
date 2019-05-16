import { ConfigurationService, ConfigurationServiceHttp } from '@capsulajs/capsulajs-configuration-service';
import { WorkspaceConfig } from '../api/WorkspaceConfig';

export const getConfigurationService = (token: string): ConfigurationService<WorkspaceConfig> =>
  new ConfigurationServiceHttp(token);

export const getModuleDynamically = (path: string): Promise<any> => import(path).then((module) => module.default);