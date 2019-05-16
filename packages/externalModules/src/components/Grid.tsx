const bootstrap = () => {
  return new Promise((resolve) => {
    class Grid extends HTMLElement {
      constructor() {
        super();
        this.innerHTML = '<div id="grid"><div id="request-form"></div></div>';
      }

      public connectedCallback() {
        console.log('grid connected');
      }
    }

    resolve(Grid);
  });
};

publicExports = bootstrap;

export default bootstrap;
