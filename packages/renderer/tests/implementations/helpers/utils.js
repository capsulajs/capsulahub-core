export const importFake = (modules, path) => Promise.resolve({ default: modules[path] });
export const prepareWebComponent = ({ name, path, componentModules }) => {
  return importFake(componentModules, path)
    .then((module) => module.default)
    .then((WebComponent) => {
      customElements.define(name, WebComponent);
      const webComponent = new WebComponent();
      typeof webComponent.setProps === 'function' && webComponent.setProps();
      return webComponent;
    });
};

export const mountWebComponent = ({ name, path, componentModules, querySelector }) =>
  prepareWebComponent({ name, path, componentModules }).then((webComponent) =>
    document.querySelector(querySelector).appendChild(webComponent)
  );
