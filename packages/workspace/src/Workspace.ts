import { Api, Microservices } from '@scalecube/scalecube-microservice';

import { Workspace as IWorkspace } from './api/Workspace';
import { ServicesMap, ServicesRequest } from './api/methods/services';
import { ComponentsMap, ComponentsRequest, Component } from './api/methods/components';
import WorkspaceConfig from './api/WorkspaceConfig';
import { RegisterServiceRequest } from './api/methods/registerService';
import { ComponentRegistry, EventListeners, FullWorkspace, ServiceRegistry } from './helpers/types';
import {
  componentToRegisterMissingInConfigurationError,
  invalidRegisterServiceRequestError,
  serviceAlreadyRegisteredError,
  serviceToRegisterMissingInConfigurationError,
} from './helpers/const';
import {
  validateComponentInConfig,
  validateRegisterServiceRequest,
  validateServiceInConfig,
} from './helpers/validators';

export class Workspace implements IWorkspace {
  private configuration: WorkspaceConfig;
  private serviceRegistry: ServiceRegistry;
  private componentRegistry: ComponentRegistry;
  private microservice?: Api.Microservice;
  private servicesMap: ServicesMap;
  private listeners: EventListeners;

  constructor(configuration: WorkspaceConfig, init: (arg: any) => Promise<IWorkspace>) {
    this.configuration = configuration;
    this.serviceRegistry = {} as ServiceRegistry;
    this.componentRegistry = {} as ComponentRegistry;
    this.listeners = {};
    this.servicesMap = this.configuration.services.reduce((servicesMap, serviceConfig) => {
      const servicePromise = new Promise((resolve) => {
        const listenerHandler = () => {
          resolve({
            serviceName: serviceConfig.serviceName,
            proxy: this.microservice!.createProxy({ serviceDefinition: serviceConfig.definition }),
          });
        };
        const eventType = `${serviceConfig.serviceName}Registered`;
        document.addEventListener(eventType, listenerHandler, { once: true });
        this.listeners[eventType] = (this.listeners[eventType] || []).concat(listenerHandler);
      });
      return {
        ...servicesMap,
        [serviceConfig.serviceName]: servicePromise,
      };
    }, {});

    init(this).catch(() => {
      this.cleanEventListeners();
    });
  }

  services(servicesRequest: ServicesRequest): Promise<ServicesMap> {
    return new Promise((resolve) => {
      return resolve(this.servicesMap);
    });
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
      if (!validateRegisterServiceRequest(registerServiceRequest)) {
        return reject(new Error(invalidRegisterServiceRequestError));
      }

      if (!validateServiceInConfig(this.configuration, registerServiceRequest)) {
        return reject(new Error(serviceToRegisterMissingInConfigurationError));
      }

      const service = this.serviceRegistry[registerServiceRequest.serviceName];

      if (!!service) {
        return reject(new Error(serviceAlreadyRegisteredError));
      } else {
        const serviceConfig = this.configuration.services.find(
          (service) => service.serviceName === registerServiceRequest.serviceName
        );
        try {
          this.microservice = Microservices.create({
            services: [{ definition: serviceConfig!.definition, reference: registerServiceRequest.reference }],
            seedAddress: 'testCluster',
          });
        } catch (error) {
          console.log('error', error);
        }

        this.serviceRegistry[registerServiceRequest.serviceName] = { ...registerServiceRequest };
        document.dispatchEvent(new CustomEvent(`${registerServiceRequest.serviceName}Registered`));
        return resolve();
      }
    });
  }

  private registerComponent(registerComponentRequest: Component): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!validateComponentInConfig(this.configuration, registerComponentRequest)) {
        reject(new Error(componentToRegisterMissingInConfigurationError));
      }
      const component = this.componentRegistry[registerComponentRequest.nodeId];

      if (!!component) {
        reject(new Error('Component already registered'));
      } else {
        this.componentRegistry[registerComponentRequest.nodeId] = { ...registerComponentRequest };
        resolve();
      }
    });
  }

  private cleanEventListeners(): void {
    Object.keys(this.listeners).forEach((eventType) => {
      this.listeners[eventType].forEach((eventCallback) => document.removeEventListener(eventType, eventCallback));
    });
    this.listeners = {};
  }
}
