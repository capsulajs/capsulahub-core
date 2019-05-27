import { EnvRegistry } from '@capsulajs/environment-registry';
import { envs } from './envRegistryData';

const bootstrap = (WORKSPACE: any, CONFIG: any) => {
  return new Promise(async (resolve) => {
    localStorage.setItem('environmentRegistry', JSON.stringify(envs));
    const envRegistry = new EnvRegistry(CONFIG.token);

    const registerServiceData = {
      serviceName: 'EnvRegistry',
      reference: envRegistry,
    };
    WORKSPACE.registerService(registerServiceData);
    resolve();
  });
};

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  publicExports = bootstrap;
}

export default bootstrap;
