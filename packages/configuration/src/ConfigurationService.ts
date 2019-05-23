import { Workspace } from '@capsulajs/capsulahub-core-workspace/src/api';
import { ConfigurationService } from '@capsulajs/capsulajs-configuration-service/lib/api';
import {
  ConfigurationServiceHardcoreRemote,
  ConfigurationServiceLocalStorage,
  ConfigurationServiceFile,
  ConfigurationServiceHttp,
} from '@capsulajs/capsulajs-configuration-service/lib';
// @ts-ignore
import { ConfigurationConfig } from './api';

export default (workspace: Workspace, serviceConfig: ConfigurationConfig) => {
  return new Promise((resolve) => {
    const { token, provider, dispatcher } = serviceConfig;

    let configurationService: ConfigurationService;

    switch (provider) {
      case 'remote':
        configurationService = new ConfigurationServiceHardcoreRemote(token, dispatcher);
        break;
      case 'local':
        configurationService = new ConfigurationServiceLocalStorage(token);
        break;
      case 'file':
        configurationService = new ConfigurationServiceFile(token);
        break;
      case 'http':
        configurationService = new ConfigurationServiceHttp(token);
        break;
      default:
        configurationService = new ConfigurationServiceFile(token);
    }

    workspace.registerService({
      serviceName: 'ConfigurationService',
      reference: configurationService,
    });

    resolve();
  });
};
