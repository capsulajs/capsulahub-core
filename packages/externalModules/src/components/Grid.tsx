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

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  publicExports = bootstrap;
}

export default bootstrap;
