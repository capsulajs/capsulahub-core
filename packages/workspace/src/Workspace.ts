import { Microservices, Api } from '@scalecube/scalecube-microservice';

import { Workspace as IWorkspace } from './api/Workspace';
import { ServicesMap, ServicesRequest } from './api/methods/services';
import { ComponentsMap, ComponentsRequest } from './api/methods/components';
import WorkspaceConfig from './api/WorkspaceConfig';
import { RegisteredService, RegisterServiceRequest } from './api/methods/registerService';
import { ComponentRegistry, ServiceRegistry } from './helpers/types';
import { RegisterComponentRequest } from './api/methods/registerComponent';
import { serviceAlreadyRegisteredError } from './helpers/const';

export class Workspace implements IWorkspace {
  private configuration: WorkspaceConfig;
  private serviceRegistry: ServiceRegistry;
  private componentRegistry: ComponentRegistry;
  private microservice?: Api.Microservice;

  constructor(configuration: WorkspaceConfig, init: (arg: any) => Promise<any>) {
    this.configuration = configuration;
    this.serviceRegistry = {} as ServiceRegistry;
    this.componentRegistry = {} as ComponentRegistry;

    init(this)
      .then((data) => {
        this.microservice = data.microservice;
      })
      .catch(() => {});
  }

  services(servicesRequest: ServicesRequest): Promise<ServicesMap> {
    const services = Object.values(this.serviceRegistry);

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

  components(componentsRequest: ComponentsRequest): Promise<ComponentsMap> {
    return Promise.resolve(
      Object.values(this.componentRegistry).reduce((componentsMap, component) => {
        return {
          ...componentsMap,
          [component.nodeId]: Promise.resolve(component),
        };
      }, {})
    );
  }

  registerService(registerServiceRequest: RegisterServiceRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      const service = this.serviceRegistry[registerServiceRequest.serviceName];

      if (!!service) {
        reject(new Error(serviceAlreadyRegisteredError));
      } else {
        this.serviceRegistry[registerServiceRequest.serviceName] = { ...registerServiceRequest };
        resolve();
      }
    });
  }

  private registerComponent(registerComponentRequest: RegisterComponentRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      const component = this.componentRegistry[registerComponentRequest.nodeId];

      if (!!component) {
        reject(new Error('Component already registered'));
      } else {
        this.componentRegistry[registerComponentRequest.nodeId] = { ...registerComponentRequest };
        resolve();
      }
    });
  }
}
