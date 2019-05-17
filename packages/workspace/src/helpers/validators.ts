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
