import '@babel/polyfill';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

const bootstrap = (WORKSPACE, SERVICE_CONFIG) => {
  console.log('running bootstrap');

  return new Promise(async (resolve, reject) => {
    class ServiceB {
      getRandomNumbers() {
        return timer(0, 1000).pipe(map(() => Math.round(Math.random() * 1000)));
      }
    }

    const serviceB = new ServiceB();
    if (WORKSPACE) {
      await WORKSPACE.registerService({}).then(() => resolve(serviceB));
    } else {
      resolve(serviceB);
    }
  });
};

publicExports = bootstrap;

export default bootstrap;
