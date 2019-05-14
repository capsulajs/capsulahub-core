import { Workspace as IWorkspace } from './api/Workspace';
import { ServicesMap, ServicesRequest } from './api/methods/services';
import { ComponentsMap, ComponentsRequest } from './api/methods/components';
import { WorkspaceConfig } from './api/WorkspaceConfig';
import { RegisterServiceRequest } from './api/methods/registerService';

export class Workspace implements IWorkspace {
  private configuration: WorkspaceConfig;
  constructor(configuration: WorkspaceConfig) {
    this.configuration = configuration;
    console.log('this.configuration', this.configuration);
  }

  services(servicesRequest: ServicesRequest) {
    console.log('servicesRequest', servicesRequest);
    return Promise.resolve({} as ServicesMap);
  }

  components(componentsRequest: ComponentsRequest) {
    console.log('componentsRequest', componentsRequest);
    return Promise.resolve({} as ComponentsMap);
  }

  registerService(registerServiceRequest: RegisterServiceRequest) {
    console.log('registerServiceRequest', registerServiceRequest);
    return Promise.resolve();
  }
}
