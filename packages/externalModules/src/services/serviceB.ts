import '@babel/polyfill';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

export default (WORKSPACE: any, SERVICE_CONFIG: any) => {
  return new Promise(async (resolve) => {
    class ServiceB {
      getRandomNumbers() {
        return timer(0, 1000).pipe(map(() => Math.round(Math.random() * 1000)));
      }
    }

    const serviceB = new ServiceB();
    await WORKSPACE.registerService({
      serviceName: SERVICE_CONFIG.serviceName,
      definition: SERVICE_CONFIG.definition,
      reference: serviceB,
    });
    resolve();
  });
};