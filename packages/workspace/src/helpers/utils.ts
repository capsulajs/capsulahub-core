import { ConfigurationService, ConfigurationServiceHttp } from '@capsulajs/capsulajs-configuration-service';
import WorkspaceConfig from '../api/WorkspaceConfig';
import Component from '../api/Component';
import { Workspace as IWorkspace, Workspace } from '../api/Workspace';
import { ComponentsMap, ComponentType } from '../api/methods/components';
import Service from '../api/Service';
import { bootstrapComponentError, bootstrapServiceError } from './const';
import { FullWorkspace } from './types';

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
  workspace: FullWorkspace,
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

export const bootstrapServices = (workspace: FullWorkspace, servicesConfig: Service[]): Promise<any[]> => {
  return Promise.all(
    servicesConfig.map((service) => {
      return getModuleDynamically(service.path).then(
        (bootstrap: (workspace: IWorkspace, service: Service) => Promise<object>) => bootstrap(workspace, service)
      );
    })
  ).catch(() => {
    throw new Error(bootstrapServiceError);
  });
};

export const initComponents = (
  workspace: FullWorkspace,
  componentsConfig: { [nodeId: string]: Component },
  type: ComponentType
) => {
  return Promise.all(
    Object.keys(componentsConfig).map((nodeId: string) => initComponent(nodeId, componentsConfig, workspace, type))
  ).catch((error) => {
    throw new Error(bootstrapComponentError);
  });
};
