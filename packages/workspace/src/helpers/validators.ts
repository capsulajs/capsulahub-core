import WorkspaceConfig from '../api/WorkspaceConfig';
import { RegisterServiceRequest } from '../api/methods/registerService';
import { RegisterComponentRequest } from '../api/methods/registerComponent';

export const validateWorkspaceConfig = (workspaceConfig: any) => {
  const requiredKeys = ['name', 'services', 'components'];
  const configKeys = Object.keys(workspaceConfig);
  return !requiredKeys.find((requiredKey) => !configKeys.includes(requiredKey));
};

export const validateCreateWorkspaceRequest = (createWorkspaceRequest: any) => {
  return !(
    !createWorkspaceRequest.token ||
    typeof createWorkspaceRequest.token !== 'string' ||
    !createWorkspaceRequest.token.trim()
  );
};

export const validateRegisterServiceRequest = (registerServiceRequest: any) => {
  return !(
    !registerServiceRequest.serviceName ||
    typeof registerServiceRequest.serviceName !== 'string' ||
    !registerServiceRequest.serviceName.trim()
  );
};

export const validateServiceInConfig = (
  workspaceConfig: WorkspaceConfig,
  registerServiceRequest: RegisterServiceRequest
): boolean => {
  return !!workspaceConfig.services.find((service) => service.serviceName === registerServiceRequest.serviceName);
};

export const validateComponentInConfig = (
  workspaceConfig: WorkspaceConfig,
  registerComponentRequest: RegisterComponentRequest
): boolean => {
  return !!workspaceConfig.components[registerComponentRequest.type === 'layout' ? 'layouts' : 'items'][
    registerComponentRequest.nodeId
  ];
};
