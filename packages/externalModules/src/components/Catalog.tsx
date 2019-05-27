const bootstrap = (workspace) => {
  return new Promise((resolve) => {
    class Catalog extends HTMLElement {
      constructor() {
        super();
        workspace.services({}).then(({ EnvRegistry }) => {
          EnvRegistry.then(({ proxy }) => {
            proxy.methods$().subscribe((methods) => console.log(methods));
          });
        });
        this.innerHTML = '<div>I am the catalog</div>';
      }
    }

    resolve(Catalog);
  });
};

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  publicExports = bootstrap;
}

export default bootstrap;
