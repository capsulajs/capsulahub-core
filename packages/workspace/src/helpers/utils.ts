import { ConfigurationService, ConfigurationServiceHttp } from '@capsulajs/capsulajs-configuration-service';
import { API } from '..';
import * as INTERNAL_TYPES from './types';
import { bootstrapComponentError, bootstrapServiceError } from './const';

export const getConfigurationService = (token: string): ConfigurationService<API.WorkspaceConfig> =>
  new ConfigurationServiceHttp(token);

export const getModuleDynamically = <BootstrapResponse>(
  path: string
): Promise<API.ModuleBootstrap<BootstrapResponse>> => import(path).then((module) => module.default);

export const bootstrapComponent = (componentName: string, WebComponent: INTERNAL_TYPES.CustomWebComponentClass) => {
  customElements.define(componentName, WebComponent);
  const webComponent = new WebComponent();
  typeof webComponent.setProps === 'function' && webComponent.setProps();
  return webComponent;
};

export const initComponent = (
  nodeId: string,
  componentsConfig: INTERNAL_TYPES.ComponentsConfig,
  workspace: INTERNAL_TYPES.Workspace,
  type: API.ComponentType
): Promise<void> => {
  const componentData = componentsConfig[nodeId];

  return getModuleDynamically<INTERNAL_TYPES.CustomWebComponentClass>(componentData.path)
    .then((bootstrap) => bootstrap(workspace, componentData.config))
    .then((WebComponent) => {
      return bootstrapComponent(componentData.componentName, WebComponent);
    })
    .then((webComponent) => {
      return workspace.registerComponent({
        nodeId,
        type,
        componentName: componentData.componentName,
        reference: webComponent,
      });
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const bootstrapServices = (workspace: API.Workspace, servicesConfig: API.ServiceConfig[]): Promise<any[]> => {
  return Promise.all(
    servicesConfig.map((serviceConfig) => {
      return getModuleDynamically<void>(serviceConfig.path).then((bootstrap) =>
        bootstrap(workspace, serviceConfig.config)
      );
    })
  ).catch(() => {
    throw new Error(bootstrapServiceError);
  });
};

export const initComponents = (
  workspace: INTERNAL_TYPES.Workspace,
  componentsConfig: INTERNAL_TYPES.ComponentsConfig,
  type: API.ComponentType
) => {
  return Promise.all(
    Object.keys(componentsConfig).map((nodeId: string) => initComponent(nodeId, componentsConfig, workspace, type))
  ).catch(() => {
    throw new Error(bootstrapComponentError);
  });
};
