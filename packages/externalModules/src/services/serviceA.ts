const bootstrap = (WORKSPACE: any, SERVICE_CONFIG: any) => {
  return new Promise(async (resolve) => {
    class ServiceA {
      private message: string;
      constructor(message: string) {
        this.message = message;
      }

      public greet(name: string) {
        return new Promise((greetResolve, reject) => {
          if (!name) {
            reject('No name to greet has been provided :-(');
          }
          greetResolve(`Dear ${name}, ${this.message}`);
        });
      }
    }

    const serviceA = new ServiceA(SERVICE_CONFIG.config.message);

    const registerServiceData = {
      serviceName: SERVICE_CONFIG.serviceName,
      reference: serviceA,
    };

    WORKSPACE.registerService(registerServiceData);
    resolve(serviceA);
  });
};

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  publicExports = bootstrap;
}

export default bootstrap;
