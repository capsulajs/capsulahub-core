export default (WORKSPACE: any, SERVICE_CONFIG: any) => {
  return new Promise(async (resolve) => {
    class ServiceA {
      greet(name: string) {
        return new Promise((resolve, reject) => {
          if (!name) {
            reject('No name to greet has been provided :-(');
          }
          resolve(`dear ${name}`);
        });
      }
    }

    const serviceA = new ServiceA();

    console.log('serviceA', serviceA.greet);

    await WORKSPACE.registerService({
      serviceName: SERVICE_CONFIG.serviceName,
      definition: SERVICE_CONFIG.definition,
      reference: serviceA,
    });
    resolve();
  });
};
