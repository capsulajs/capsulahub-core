const bootstrap = () => {
  return new Promise((resolve) => {
    class Grid extends HTMLElement {
      constructor() {
        super();
        this.innerHTML =
          '<div id="grid"><h1>Hello from CapsulaHub!</h1>' +
          '<div id="catalog"></div>' +
          '<div id="request-form"></div>' +
          '<div id="logger"></div>' +
          '</div>';
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
