const bootstrap = () => {
  return new Promise((resolve) => {
    class Grid extends HTMLElement {
      constructor() {
        super();
        this.innerHTML =
          '<div style="display: flex; padding: 30px;" id="grid">' +
          '<div style="width: 45%; margin-right: 20px" class="left-part">' +
          '<div id="env-dropdown" style="margin-bottom: 10px;"></div>' +
          '<div id="catalog" style="margin-bottom: 10px;"></div>' +
          '<div id="request-form" style="margin-bottom: 10px;"></div>' +
          '</div>' +
          '<div class="right-part" id="logger"></div>' +
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
