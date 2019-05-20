import { ConfigurationService, ConfigurationServiceHttp } from '@capsulajs/capsulajs-configuration-service';
import WorkspaceConfig from '../api/WorkspaceConfig';
import Component from '../api/Component';
import { Component as RegisteredComponent } from '../api/methods/components';
import { Workspace as IWorkspace } from '../api/Workspace';
import { ComponentType } from '../api/methods/components';
import Service from '../api/Service';
import { bootstrapComponentError, bootstrapServiceError } from './const';

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
  componentsConfig: { [nodeId: string]: Component },
  workspace: IWorkspace,
  registerComponent: (registerComponent: RegisteredComponent) => Promise<void>,
  type: ComponentType
): Promise<void> => {
  const componentData = componentsConfig[nodeId];

  return getModuleDynamically(componentData.path)
    .then((bootstrap: any) => bootstrap(workspace, componentData))
    .then((WebComponent) => {
      return bootstrapComponent(componentData.componentName, WebComponent);
    })
    .then((webComponent) => {
      return registerComponent({
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

export const bootstrapServices = (workspace: IWorkspace, servicesConfig: Service[]): Promise<any[]> => {
  return Promise.all(
    servicesConfig.map((serviceConfig) => {
      return getModuleDynamically(serviceConfig.path).then(
        (bootstrap: (workspace: IWorkspace, service: Service) => Promise<object>) => bootstrap(workspace, serviceConfig)
      );
    })
  ).catch(() => {
    throw new Error(bootstrapServiceError);
  });
};

export const initComponents = (
  workspace: IWorkspace,
  registerComponent: (registerComponent: RegisteredComponent) => Promise<void>,
  componentsConfig: { [nodeId: string]: Component },
  type: ComponentType
) => {
  return Promise.all(
    Object.keys(componentsConfig).map((nodeId: string) =>
      initComponent(nodeId, componentsConfig, workspace, registerComponent, type)
    )
  ).catch((error) => {
    throw new Error(bootstrapComponentError);
  });
};
