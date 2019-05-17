const bootstrap = (WORKSPACE: any, SERVICE_CONFIG: any) => {
  return new Promise(async (resolve) => {
    class ServiceA {
      private message: string;
      constructor(message: string) {
        this.message = message;
      }

      greet(name: string) {
        return new Promise((resolve, reject) => {
          if (!name) {
            reject('No name to greet has been provided :-(');
          }
          resolve(`Dear ${name}, ${this.message}`);
        });
      }
    }

    const serviceA = new ServiceA(SERVICE_CONFIG.config.message);

    const registerServiceData = {
      serviceName: SERVICE_CONFIG.serviceName,
      definition: SERVICE_CONFIG.definition,
      reference: serviceA,
    };

    await WORKSPACE.registerService(registerServiceData);
    resolve(registerServiceData);
  });
};

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  publicExports = bootstrap;
}

export default bootstrap;
