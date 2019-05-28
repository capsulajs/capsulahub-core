const bootstrap = () => {
  return new Promise((resolve) => {
    class Grid extends HTMLElement {
      constructor() {
        super();
        document.body.style.backgroundColor = '#444444';
        this.innerHTML = `
          <div style="display: flex; padding: 30px;" id="grid">
            <div style="width: 300px; margin-right: 20px" class="left-part">
              <div id="env-dropdown" style="margin-bottom: 10px;"></div>
              <div id="catalog" style="margin-bottom: 10px;"></div>
            </div>
            <div class="right-part">
              <div id="request-form" style="margin-bottom: 10px;"></div>
              <div id="logger"></div>
            </div>
          </div>
        `;
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
