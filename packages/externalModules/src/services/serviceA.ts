export default (WORKSPACE: any, SERVICE_CONFIG: any) => {
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
    await WORKSPACE.registerService({
      serviceName: SERVICE_CONFIG.serviceName,
      definition: SERVICE_CONFIG.definition,
      reference: serviceA,
    });
    resolve();
  });
};