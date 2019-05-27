import { from } from 'rxjs';

const bootstrap = (WORKSPACE: any) => {
  return new Promise(async (resolve) => {
    class EnvRegistry {
      public methods$() {
        return from([
          {
            methods: [
              {
                serviceName: 'service1',
                url: 'http://accessPoint/dev/service1',
                methods: {
                  myTestMethod1: {
                    asyncModel: 'RequestResponse',
                  },
                },
              },
              {
                serviceName: 'service2',
                url: 'http://accessPoint/dev/service2',
                methods: {
                  myTestMethod1: {
                    asyncModel: 'RequestResponse',
                  },
                  myTestMethod2: {
                    asyncModel: 'RequestStream',
                  },
                  myTestMethod3: {
                    asyncModel: 'RequestStream',
                  },
                },
              },
            ],
          },
        ] as any);
      }
    }

    const envRegistry = new EnvRegistry();

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
