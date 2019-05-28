import { EnvRegistry } from '@capsulajs/environment-registry';
import { envs } from './envRegistryData';

const bootstrap = (WORKSPACE: any, CONFIG: any) => {
  return new Promise(async (resolve) => {
    console.log('bootstrapping REGISTRY!', CONFIG.token);
    localStorage.setItem(`${CONFIG.token}.environmentRegistry`, JSON.stringify(envs[CONFIG.token]));

    let envRegistry: any;
    try {
      envRegistry = new EnvRegistry(CONFIG.token);
    } catch (error) {
      console.log('error', error);
    }

    const registerServiceData = {
      serviceName: 'EnvRegistryService',
      reference: envRegistry,
    };

    WORKSPACE.registerService.call(WORKSPACE, registerServiceData);
    resolve();
  });
};

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  publicExports = bootstrap;
}

export default bootstrap;
