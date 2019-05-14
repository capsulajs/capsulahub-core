import { ConfigurationService, ConfigurationServiceHttp } from '@capsulajs/capsulajs-configuration-service';

export const getConfigurationService = (token: string): ConfigurationService => new ConfigurationServiceHttp(token);
