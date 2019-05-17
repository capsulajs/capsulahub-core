import omit from 'lodash/omit';

import { WorkspaceFactory as IWorkspaceFactory } from './api/WorkspaceFactory';
import { Workspace } from './Workspace';
import { Workspace as IWorkspace } from './api/Workspace';
import {
  bootstrapServices,
  getConfigurationService,
  getModuleDynamically,
  initComponent,
  initComponents,
} from './helpers/utils';
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
import { Microservices, Api } from '@scalecube/scalecube-microservice';
import { FullWorkspace } from './helpers/types';

export class WorkspaceFactory implements IWorkspaceFactory {
  createWorkspace(createWorkspaceRequest: CreateWorkspaceRequest): Promise<Workspace> {
    return new Promise((resolve, reject) => {
      // createWorkspaceRequest validation
      if (!validateCreateWorkspaceRequest(createWorkspaceRequest)) {
        return reject(new Error(createWorkspaceWrongRequestError));
      }

      // Getting configurationService
      let configurationService;
      try {
        configurationService = getConfigurationService(createWorkspaceRequest.token);
      } catch (error) {
        return reject(new Error(bootstrapServiceError));
      }

      // Getting configuration and initializing Workspace
      let formattedConfiguration: WorkspaceConfig;
      let workspace: Workspace;
      return configurationService
        .entries({ repository: configRepositoryName })
        .then(
          (configuration: any): any => {
            // Preparing and validating formattedConfiguration
            formattedConfiguration = configuration.entries.reduce(
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

            let initPromise: Promise<{ workspace: IWorkspace; microservice: Api.Microservice }>;

            const createInitPromise = (workspace: FullWorkspace) => {
              initPromise = new Promise((resolve, reject) => {
                let microservice: Api.Microservice;

                bootstrapServices(workspace, formattedConfiguration.services)
                  .then((services: any[]) => {
                    microservice = Microservices.create({
                      services,
                    });
                    return initComponents(workspace, formattedConfiguration.components.layouts, 'layout');
                  })
                  .then(() => {
                    return initComponents(workspace, formattedConfiguration.components.items, 'item');
                  })
                  .then(() => {
                    return resolve({ workspace: workspace, microservice });
                  })
                  .catch((error) => reject(error));
              });

              return initPromise;
            };

            const init = (
              workspace: FullWorkspace
            ): Promise<{ workspace: IWorkspace; microservice: Api.Microservice }> => {
              return createInitPromise(workspace);
            };

            workspace = new Workspace(formattedConfiguration, init);

            return initPromise!.then((data: any) => resolve(data.workspace));
          }
        )
        .catch((error) => reject(error));
    });
  }
}
