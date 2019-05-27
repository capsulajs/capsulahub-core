import { EnvRegistry } from '@capsulajs/environment-registry';
import { envs } from './envRegistryData';

const bootstrap = (WORKSPACE: any, CONFIG: any) => {
  return new Promise(async (resolve) => {
    localStorage.setItem(`${CONFIG.token}.environmentRegistry`, JSON.stringify(envs));

    let envRegistry: any;
    try {
      envRegistry = new EnvRegistry(CONFIG.token);
    } catch (error) {
      console.log('error', error);
    }

    console.log('envRegistry', envRegistry);

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
