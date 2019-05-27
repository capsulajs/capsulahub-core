import { Selector } from './Selector';

const bootstrap = (WORKSPACE: any) => {
  return new Promise(async (resolve) => {
    const methodSelector = new Selector();

    const registerServiceData = {
      serviceName: 'MethodSelectorService',
      reference: methodSelector,
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
