import { ConfigurationService, ConfigurationServiceHttp } from '@capsulajs/capsulajs-configuration-service';
import WorkspaceConfig from '../api/WorkspaceConfig';

export const getConfigurationService = (token: string): ConfigurationService<WorkspaceConfig> =>
  new ConfigurationServiceHttp(token);

export const getModuleDynamically = (path: string): Promise<any> => import(path).then((module) => module.default);

export const bootstrapComponent = (componentName: string, WebComponent: any) => {
  customElements.define(componentName, WebComponent);
  const webComponent = new WebComponent();
  typeof webComponent.setProps === 'function' && webComponent.setProps();
  return webComponent;
};
