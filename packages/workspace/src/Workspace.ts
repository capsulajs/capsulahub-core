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
  ComponentConfig,
} from './api';
import { ComponentRegistry, EventListeners, ServiceRegistry } from './helpers/types';
import {
  componentAlreadyRegisteredError,
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

const eventsTypes = {
  registered: 'registered',
  registrationFailed: 'registration_failed',
};

export class Workspace implements IWorkspace {
  private configuration: WorkspaceConfig;
  private serviceRegistry: ServiceRegistry;
  private componentRegistry: ComponentRegistry;
  private microservice?: ScalecubeApi.Microservice;
  private servicesMap: ServicesMap;
  private componentsMap: ComponentsMap;
  private listeners: EventListeners;
  private id: string;

  constructor(configuration: WorkspaceConfig) {
    this.id = uuidv4();
    this.configuration = configuration;
    this.serviceRegistry = {} as ServiceRegistry;
    this.componentRegistry = {} as ComponentRegistry;
    this.listeners = {};
    this.servicesMap = this.createServiceMap();
    this.componentsMap = this.createComponentMap();
  }

  public services(servicesRequest: ServicesRequest): Promise<ServicesMap> {
    return new Promise((resolve) => {
      return resolve(this.servicesMap);
    });
  }

  public components(componentsRequest: ComponentsRequest): Promise<ComponentsMap> {
    return new Promise((resolve) => {
      return resolve(this.componentsMap);
    });
  }

  public registerService(registerServiceRequest: RegisterServiceRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('registerService', registerServiceRequest);

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
          new CustomEvent(this.generateServiceEventType(registerServiceRequest.serviceName, eventsTypes.registered))
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
        document.dispatchEvent(
          new CustomEvent(
            this.generateComponentEventType(registerComponentRequest.nodeId, eventsTypes.registrationFailed)
          )
        );
        reject(new Error(componentAlreadyRegisteredError));
      } else {
        this.componentRegistry[registerComponentRequest.nodeId] = { ...registerComponentRequest };
        document.dispatchEvent(
          new CustomEvent(this.generateComponentEventType(registerComponentRequest.nodeId, eventsTypes.registered))
        );
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

  private generateServiceEventType(serviceName: any, type: string) {
    return `${typeof serviceName === 'string' ? serviceName.toUpperCase() : 'UNKNOWN_SERVICE'}_${type.toUpperCase()}_${
      this.id
    }`;
  }

  private generateComponentEventType(nodeId: string, type: string) {
    return `COMPONENT_FOR_${nodeId.toUpperCase()}_${type.toUpperCase()}_${this.id}`;
  }

  private emitServiceRegistrationFailedEvent(serviceName: string, error: string) {
    document.dispatchEvent(
      new CustomEvent(this.generateServiceEventType(serviceName, eventsTypes.registrationFailed), { detail: error })
    );
  }

  private createServiceMap() {
    return this.configuration.services.reduce((servicesMap, serviceConfig) => {
      const servicePromise = new Promise((resolve, reject) => {
        const observeEvent = (type: string) => {
          const listenerHandler = (event: CustomEvent) =>
            type === eventsTypes.registered
              ? resolve({
                  serviceName: serviceConfig.serviceName,
                  proxy: this.microservice!.createProxy({ serviceDefinition: serviceConfig.definition }),
                })
              : reject(new Error(event.detail));
          const eventType = this.generateServiceEventType(serviceConfig.serviceName, type);
          document.addEventListener(eventType, listenerHandler as EventListener, { once: true });
          this.listeners[eventType] = (this.listeners[eventType] || []).concat(listenerHandler as EventListener);
        };
        Object.values(eventsTypes).forEach(observeEvent);
      });
      return {
        ...servicesMap,
        [serviceConfig.serviceName]: servicePromise,
      };
    }, {});
  }

  private createComponentMap() {
    const componentsMap = { ...(this.componentsMap || {}) };
    const fulfillComponentsMap = (componentsConfig: { [nodeId: string]: ComponentConfig }) => {
      Object.keys(componentsConfig).forEach((nodeId) => {
        componentsMap[nodeId] = new Promise((resolve, reject) => {
          const observeEvent = (type: string) => {
            const listenerHandler = (event: CustomEvent) =>
              type === eventsTypes.registered
                ? resolve(this.componentRegistry[nodeId])
                : reject(new Error(event.detail));

            const eventType = this.generateComponentEventType(nodeId, type);
            document.addEventListener(eventType, listenerHandler as EventListener, { once: true });
            this.listeners[eventType] = (this.listeners[eventType] || []).concat(listenerHandler as EventListener);
          };

          Object.values(eventsTypes).forEach(observeEvent);
        });
      });
    };

    Object.values(this.configuration.components).forEach(fulfillComponentsMap);

    return componentsMap;
  }
}
