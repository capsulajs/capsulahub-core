import { WorkspaceFactory as IWorkspaceFactory } from './api/WorkspaceFactory';
import { Workspace } from './Workspace';
import { getConfigurationService, getModuleDynamically } from './helpers/utils';
import { CreateWorkspaceRequest } from './api/methods/createWorkspace';
import {
  bootstrapComponentError,
  bootstrapServiceError,
  configRepositoryName,
  configWrongFormatError,
  createWorkspaceWrongRequestError,
} from './helpers/const';
import WorkspaceConfig from './api/WorkspaceConfig';
import Service from './api/Service';
import { Entity } from '@capsulajs/capsulajs-configuration-service/lib/api/Entity';
import { validateCreateWorkspaceRequest, validateWorkspaceConfig } from './helpers/validators';

export class WorkspaceFactory implements IWorkspaceFactory {
  createWorkspace(createWorkspaceRequest: CreateWorkspaceRequest): Promise<Workspace> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!validateCreateWorkspaceRequest(createWorkspaceRequest)) {
          return reject(new Error(createWorkspaceWrongRequestError));
        }

        const configurationService = getConfigurationService(createWorkspaceRequest.token);
        const configuration = await configurationService.entries({ repository: configRepositoryName });
        const formattedConfiguration = configuration.entries.reduce(
          (acc: WorkspaceConfig, configEntity: Entity) => {
            return {
              ...acc,
              [configEntity.key]: configEntity.value,
            };
          },
          {} as WorkspaceConfig
        );

        if (!validateWorkspaceConfig(formattedConfiguration)) {
          return reject(new Error(configWrongFormatError));
        }

        const workspace = new Workspace(formattedConfiguration);

        const servicesPromises = formattedConfiguration.services.map((service) => {
          return getModuleDynamically(service.path).then(
            (bootstrap: (workspace: Workspace, service: Service) => Promise<object>) => bootstrap(workspace, service)
          );
          // .then((serviceInstance) => ({
          //   reference: serviceInstance,
          //   definition: service.definition,
          // }));
        });

        try {
          await Promise.all(servicesPromises);
        } catch (error) {
          return reject(error);
        }
        console.log('GOOD SCENARIO services');

        const bootstrapComponent = (nodeId: string, type: 'layouts' | 'items'): Promise<void> => {
          const componentData = formattedConfiguration.components[type][nodeId];
          return getModuleDynamically(componentData.path)
            .then((bootstrap: any) => bootstrap(workspace, componentData))
            .then((WebComponent) => {
              customElements.define(componentData.componentName, WebComponent);
              const webComponent = new WebComponent();
              typeof webComponent.setProps === 'function' && webComponent.setProps();
              return webComponent;
            })
            .then((webComponent) => {
              return workspace.registerComponent({
                nodeId,
                componentName: componentData.componentName,
                reference: webComponent,
              });
            });
        };

        // Bootstrap components
        console.log('formattedConfiguration.components', formattedConfiguration.components);
        const layoutComponentsPromises = Object.keys(formattedConfiguration.components.layouts).map((nodeId: string) =>
          bootstrapComponent(nodeId, 'layouts')
        );
        try {
          await Promise.all(layoutComponentsPromises);
        } catch (error) {
          return reject(new Error(bootstrapComponentError));
        }
        const itemsComponentsPromises = Object.keys(formattedConfiguration.components.items).map((nodeId: string) =>
          bootstrapComponent(nodeId, 'items')
        );
        try {
          await Promise.all(itemsComponentsPromises);
        } catch (error) {
          return reject(new Error(bootstrapComponentError));
        }

        resolve(workspace);
      } catch (error) {
        console.log('services ERROR', error);
        return reject(new Error(bootstrapServiceError));
      }
    });
  }
}
