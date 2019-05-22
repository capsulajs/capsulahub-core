import { ConfigurationService, ConfigurationServiceHttp } from '@capsulajs/capsulajs-configuration-service';
import { WorkspaceConfig, ComponentConfig, Workspace as IWorkspace, ComponentType } from '../api';
import ServiceConfig from '../api/ServiceConfig';
import { bootstrapComponentError, bootstrapServiceError } from './const';
import { InternalWorkspace } from './types';

export const getConfigurationService = (token: string): ConfigurationService<WorkspaceConfig> =>
  new ConfigurationServiceHttp(token);

export const getModuleDynamically = (path: string): Promise<any> => import(path).then((module) => module.default);

export const bootstrapComponent = (componentName: string, WebComponent: any) => {
  customElements.define(componentName, WebComponent);
  const webComponent = new WebComponent();
  typeof webComponent.setProps === 'function' && webComponent.setProps();
  return webComponent;
};

export const initComponent = (
  nodeId: string,
  componentsConfig: { [nodeId: string]: ComponentConfig },
  workspace: InternalWorkspace,
  type: ComponentType
): Promise<void> => {
  const componentData = componentsConfig[nodeId];

  return getModuleDynamically(componentData.path)
    .then((bootstrap: any) => bootstrap(workspace, componentData))
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

export const bootstrapServices = (workspace: IWorkspace, servicesConfig: ServiceConfig[]): Promise<any[]> => {
  return Promise.all(
    servicesConfig.map((serviceConfig) => {
      /// <reference path="node.d.ts"/>
      return getModuleDynamically(serviceConfig.path).then(
        (bootstrap: (workspace: IWorkspace, service: ServiceConfig) => Promise<object>) =>
          bootstrap(workspace, serviceConfig)
      );
    })
  ).catch((error) => {
    throw new Error(`${bootstrapServiceError}:${error.message}`);
  });
};

export const initComponents = (
  workspace: InternalWorkspace,
  componentsConfig: { [nodeId: string]: ComponentConfig },
  type: ComponentType
) => {
  return Promise.all(
    Object.keys(componentsConfig).map((nodeId: string) => initComponent(nodeId, componentsConfig, workspace, type))
  ).catch((error) => {
    throw new Error(bootstrapComponentError);
  });
};
