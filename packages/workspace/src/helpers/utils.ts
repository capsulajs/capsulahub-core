import { ConfigurationService, ConfigurationServiceHttp } from '@capsulajs/capsulajs-configuration-service';
import { API } from '..';
import * as INTERNAL_TYPES from './types';
import {
  getLoadingServiceError,
  getLoadingComponentError,
  getBootstrapServiceError,
  getInitComponentError,
  getBootstrapComponentError,
} from './const';

export const getConfigurationService = (token: string): ConfigurationService<API.WorkspaceConfig> =>
  new ConfigurationServiceHttp(token);

export const dynamicImport = (path: string) => import(path).then((module) => module.default);

export const getModuleDynamically = <BootstrapResponse>(
  path: string,
  type: 'service' | 'component',
  itemName: string
): Promise<API.ModuleBootstrap<BootstrapResponse>> =>
  dynamicImport(path).catch((error) => {
    if (type === 'service') {
      throw new Error(getLoadingServiceError(error, itemName));
    } else {
      throw new Error(getLoadingComponentError(error, itemName));
    }
  });

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

  return getModuleDynamically<INTERNAL_TYPES.CustomWebComponentClass>(
    componentData.path,
    'component',
    componentData.componentName
  )
    .then((bootstrap) =>
      bootstrap(workspace, componentData.config).catch((error) => {
        throw new Error(getBootstrapComponentError(error.message, componentData.componentName));
      })
    )
    .then((WebComponent) => {
      let webComponent;
      try {
        webComponent = bootstrapComponent(componentData.componentName, WebComponent);
      } catch (error) {
        throw new Error(getInitComponentError(error, componentData.componentName));
      }
      workspace.registerComponent({
        nodeId,
        type,
        componentName: componentData.componentName,
        reference: webComponent,
      });
    });
};

export const bootstrapServices = (workspace: API.Workspace, servicesConfig: API.ServiceConfig[]): Promise<any[]> => {
  return Promise.all(
    servicesConfig.map((serviceConfig) => {
      return getModuleDynamically<void>(serviceConfig.path, 'service', serviceConfig.serviceName).then((bootstrap) =>
        bootstrap(workspace, serviceConfig.config).catch((error) => {
          throw new Error(getBootstrapServiceError(error, serviceConfig.serviceName));
        })
      );
    })
  );
};

export const initComponents = (
  workspace: INTERNAL_TYPES.Workspace,
  componentsConfig: INTERNAL_TYPES.ComponentsConfig,
  type: API.ComponentType
) => {
  return Promise.all(
    Object.keys(componentsConfig).map((nodeId: string) => initComponent(nodeId, componentsConfig, workspace, type))
  );
};
