import { Microservices, Api } from '@scalecube/scalecube-microservice';

import { Workspace as IWorkspace } from './api/Workspace';
import { ServicesMap, ServicesRequest } from './api/methods/services';
import { ComponentsMap, ComponentsRequest } from './api/methods/components';
import WorkspaceConfig from './api/WorkspaceConfig';
import { RegisteredService, RegisterServiceRequest } from './api/methods/registerService';
import { ComponentRegistry, ServiceRegistry } from './helpers/types';
import { RegisterComponentRequest } from './api/methods/registerComponent';

export class Workspace implements IWorkspace {
  private configuration: WorkspaceConfig;
  private serviceRegistry: ServiceRegistry;
  private componentRegistry: ComponentRegistry;
  private microservice?: Api.Microservice;
  constructor(configuration: WorkspaceConfig) {
    this.configuration = configuration;
    this.serviceRegistry = {} as ServiceRegistry;
    this.componentRegistry = {} as ComponentRegistry;
    console.log('this.configuration', this.configuration);
  }

  services(servicesRequest: ServicesRequest): Promise<ServicesMap> {
    console.log('servicesRequest', servicesRequest);
    const services = Object.values(this.serviceRegistry);
    if (!this.microservice) {
      this.microservice = Microservices.create({
        services: Object.values(this.serviceRegistry),
      });
    }

    return Promise.resolve(
      services.reduce(
        (servicesMap: ServicesMap, service: RegisteredService) => {
          return {
            ...servicesMap,
            [service.serviceName]: Promise.resolve({
              serviceName: service.serviceName,
              proxy: this.microservice!.createProxy({ serviceDefinition: service.definition }),
            }),
          };
        },
        {} as ServicesMap
      )
    );
  }

  components(componentsRequest: ComponentsRequest) {
    console.log('componentsRequest', componentsRequest);
    return Promise.resolve({} as ComponentsMap);
  }

  registerService(registerServiceRequest: RegisterServiceRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      const service = this.serviceRegistry[registerServiceRequest.serviceName];

      if (!!service) {
        reject('Service already registered');
      } else {
        this.serviceRegistry[registerServiceRequest.serviceName] = { ...registerServiceRequest };
        resolve();
      }
    });
  }

  registerComponent(registerComponentRequest: RegisterComponentRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      const component = this.componentRegistry[registerComponentRequest.nodeId];

      if (!!component) {
        reject('Component already registered');
      } else {
        this.componentRegistry[registerComponentRequest.nodeId] = { ...registerComponentRequest };
        resolve();
      }
    });
  }
}
