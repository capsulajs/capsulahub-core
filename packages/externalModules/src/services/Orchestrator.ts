import { from } from 'rxjs';
import { toArray } from 'rxjs/operators';

const bootstrap = (WORKSPACE: any) => {
  return new Promise(async (resolve) => {
    const init = async () => {
      const services = await WORKSPACE.services({});
      const envRegistry = await services.EnvRegistryService;
      const envSelector = await services.EnvSelectorService;
      const methodSelector = await services.MethodSelectorService;

      envRegistry.proxy
        .environments$({})
        .pipe(toArray())
        .subscribe(async (envs: any) => {
          await envSelector.proxy.input({ data: from([envs]) });
          envSelector.proxy.select({ key: { envKey: 'develop' } });
        });

      envSelector.proxy.selected$({}).subscribe((item: any) => {
        console.log('selected$');
        if (item && Object.keys(item).length) {
          const methods: any = []; // define interface
          item.env.services.forEach((service) => {
            Object.keys(service.methods).forEach((key) => {
              methods.push({ serviceName: service.serviceName, methodName: key });
            });
          });
          methodSelector.proxy.input({ data: from([methods]) });
        }
      });
    };

    init();
    resolve();
  });
};

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  publicExports = bootstrap;
}

export default bootstrap;
