const bootstrap = () => {
  return new Promise((resolve) => {
    class Grid extends HTMLElement {
      constructor() {
        super();
        this.innerHTML = '<div id="grid"><div id="request-form"></div></div>';
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
