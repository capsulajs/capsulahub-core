import uuidv4 from 'uuid/v4';
import { Api as ScalecubeApi, Microservices } from '@scalecube/scalecube-microservice';

import {
  ComponentsMap,
  ComponentsRequest,
  Component,
  ServicesMap,
  ServicesRequest,
  Workspace as IWorkspace,
  WorkspaceConfig,
  RegisterServiceRequest,
} from './api';
import { ComponentRegistry, EventListeners, ServiceRegistry } from './helpers/types';
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

const serviceEventsTypes = {
  registered: 'registered',
  registrationFailed: 'registration_failed',
};

export class Workspace implements IWorkspace {
  private configuration: WorkspaceConfig;
  private serviceRegistry: ServiceRegistry;
  private componentRegistry: ComponentRegistry;
  private microservice?: ScalecubeApi.Microservice;
  private servicesMap: ServicesMap;
  private listeners: EventListeners;
  private id: string;

  constructor(configuration: WorkspaceConfig) {
    this.id = uuidv4();
    this.configuration = configuration;
    this.serviceRegistry = {} as ServiceRegistry;
    this.componentRegistry = {} as ComponentRegistry;
    this.listeners = {};
    this.servicesMap = this.configuration.services.reduce((servicesMap, serviceConfig) => {
      const servicePromise = new Promise((resolve, reject) => {
        const observeEvent = (type: string) => {
          const listenerHandler = (event: CustomEvent) =>
            type === serviceEventsTypes.registered
              ? resolve({
                  serviceName: serviceConfig.serviceName,
                  proxy: this.microservice!.createProxy({ serviceDefinition: serviceConfig.definition }),
                })
              : reject(new Error(event.detail));
          const eventType = this.generateEventType(serviceConfig.serviceName, type);
          document.addEventListener(eventType, listenerHandler as EventListener, { once: true });
          this.listeners[eventType] = (this.listeners[eventType] || []).concat(listenerHandler as EventListener);
        };
        Object.values(serviceEventsTypes).forEach(observeEvent);
      });
      return {
        ...servicesMap,
        [serviceConfig.serviceName]: servicePromise,
      };
    }, {});
  }

  public services(servicesRequest: ServicesRequest): Promise<ServicesMap> {
    return new Promise((resolve) => {
      return resolve(this.servicesMap);
    });
  }

  public components(componentsRequest: ComponentsRequest): Promise<ComponentsMap> {
    return Promise.resolve(
      Object.values(this.componentRegistry).reduce((componentsMap, component) => {
        return {
          ...componentsMap,
          [component.nodeId]: Promise.resolve(component),
        };
      }, {})
    );
  }

  public registerService(registerServiceRequest: RegisterServiceRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!validateRegisterServiceRequest(registerServiceRequest)) {
        this.emitServiceRegistrationFailedEvent(registerServiceRequest.serviceName, invalidRegisterServiceRequestError);
        return reject(new Error(invalidRegisterServiceRequestError));
      }

      if (!validateServiceInConfig(this.configuration, registerServiceRequest)) {
        this.emitServiceRegistrationFailedEvent(
          registerServiceRequest.serviceName,
          serviceToRegisterMissingInConfigurationError
        );
        return reject(new Error(serviceToRegisterMissingInConfigurationError));
      }

      const service = this.serviceRegistry[registerServiceRequest.serviceName];

      if (!!service) {
        this.emitServiceRegistrationFailedEvent(registerServiceRequest.serviceName, serviceAlreadyRegisteredError);
        return reject(new Error(serviceAlreadyRegisteredError));
      } else {
        const serviceConfig = this.configuration.services.find(
          (serviceConfiguration) => serviceConfiguration.serviceName === registerServiceRequest.serviceName
        );
        try {
          this.microservice = Microservices.create({
            services: [{ definition: serviceConfig!.definition, reference: registerServiceRequest.reference }],
            seedAddress: this.id,
          });
        } catch (error) {
          reject(
            new Error(
              `Error while serviceRegister has happened while creating scalecube microservice: ${error.message}`
            )
          );
        }

        this.serviceRegistry[registerServiceRequest.serviceName] = { ...registerServiceRequest };
        document.dispatchEvent(
          new CustomEvent(this.generateEventType(registerServiceRequest.serviceName, serviceEventsTypes.registered))
        );
        return resolve();
      }
    });
  }

  public registerComponent(registerComponentRequest: Component): Promise<void> {
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

  public cleanEventListeners(): void {
    Object.keys(this.listeners).forEach((eventType) => {
      this.listeners[eventType].forEach((eventCallback) => document.removeEventListener(eventType, eventCallback));
    });
    this.listeners = {};
  }

  private generateEventType(serviceName: any, type: string) {
    return `${typeof serviceName === 'string' ? serviceName.toUpperCase() : 'UNKNOWN_SERVICE'}_${type.toUpperCase()}_${
      this.id
    }`;
  }

  private emitServiceRegistrationFailedEvent(serviceName: string, error: string) {
    document.dispatchEvent(
      new CustomEvent(this.generateEventType(serviceName, serviceEventsTypes.registrationFailed), { detail: error })
    );
  }
}
