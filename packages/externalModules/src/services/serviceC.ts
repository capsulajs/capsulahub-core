const bootstrap = (WORKSPACE: any, SERVICE_CONFIG: any) => {
  return new Promise(async (resolve) => {
    class ServiceC {
      hello(name: string) {
        return new Promise((resolve, reject) => {
          if (!name) {
            reject('No name to greet has been provided :-(');
          }
          resolve(`Hello, ${name}`);
        });
      }
    }

    const serviceC = new ServiceC();

    resolve({
      serviceName: SERVICE_CONFIG.serviceName,
      definition: SERVICE_CONFIG.definition,
      reference: serviceC,
    });
  });
};

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  publicExports = bootstrap;
}

export default bootstrap;
