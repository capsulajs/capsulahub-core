import { ConfigurationService, ConfigurationServiceHttp } from '@capsulajs/capsulajs-configuration-service';
import WorkspaceConfig from '../api/WorkspaceConfig';
import Component from '../api/Component';
import { Workspace } from '../api/Workspace';
import { ComponentType } from '../api/methods/components';

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
  workspace: Workspace,
  type: ComponentType
): Promise<void> => {
  const componentData = componentsConfig[nodeId];

  console.log('componentData', componentData);

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
    });
};
