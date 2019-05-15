export default (WORKSPACE, SERVICE_CONFIG) => {
  return new Promise(async (resolve, reject) => {
    class ServiceA {
      constructor(message = 'Nice to meet you') {
        this.message = name;
      }

      greet(name) {
        return new Promise((resolve, reject) => {
          if (!name) {
            reject('No name to greet has been provided :-(');
          }
          resolve(`${this.message}, dear ${name}`);
        });
      }
    }

    const serviceA = new ServiceA(SERVICE_CONFIG.config.message);
    await WORKSPACE.registerService({}).then(() => resolve(serviceA));
  });
};
