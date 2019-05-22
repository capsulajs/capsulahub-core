import { ConfigurationService } from '@capsulajs/capsulajs-configuration-service/lib/api';
import {
  ConfigurationServiceHardcoreRemote,
  ConfigurationServiceLocalStorage,
  ConfigurationServiceFile,
  ConfigurationServiceHttp,
} from '@capsulajs/capsulajs-configuration-service/lib';
// @ts-ignore
import { ConfigurationConfig } from './api';

// @ts-ignore
export default (WORKSPACE: Workspace, SERVICE_COMNFIG: ConfigurationConfig) => {
  return new Promise(async (resolve) => {
    const { token, provider, dispatcher } = SERVICE_COMNFIG;

    let configurationService: ConfigurationService;

    switch (provider) {
      case 'remote':
        return (configurationService = new ConfigurationServiceHardcoreRemote(token, dispatcher));
      case 'local':
        return (configurationService = new ConfigurationServiceLocalStorage(token));
      case 'file':
        return (configurationService = new ConfigurationServiceFile(token));
      case 'http':
        return (configurationService = new ConfigurationServiceHttp(token));
      default:
        configurationService = new ConfigurationServiceFile(token);
    }

    WORKSPACE.registerService({
      serviceName: 'ConfigurationService',
      reference: configurationService,
    });

    resolve();
  });
};
