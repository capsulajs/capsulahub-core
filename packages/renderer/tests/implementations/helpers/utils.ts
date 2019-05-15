const importFake = (modules, path) => Promise.resolve({ default: modules[path] });
const prepareWebComponent = ({ name, path, componentModules }) => {
  return importFake(componentModules, path)
    .then((module) => module.default)
    .then((WebComponent) => {
      customElements.define(name, WebComponent);
      const webComponent = new WebComponent();
      typeof webComponent.setProps === 'function' && webComponent.setProps();
      return webComponent;
    });
};

export const registerComponent = async ({ nodeId, type, name, module }) => {
  const path = `http://cdn.components/${nodeId}`;
  const componentModules = {
    [path]: module,
  };
  const webComponent = await prepareWebComponent({ name, path, componentModules });

  return {
    nodeId,
    type,
    componentName: name,
    reference: webComponent,
  };
};
