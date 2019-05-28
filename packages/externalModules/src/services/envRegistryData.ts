export const envs = {
  'http://localhost:55555': {
    develop: {
      services: [
        {
          serviceName: 'GreetingService',
          url: 'http://accessPoint/dev/service1',
          methods: {
            getHelloFromLegacy: {
              asyncModel: 'RequestResponse',
            },
          },
        },
        {
          serviceName: 'NewInDevelopService',
          url: 'http://accessPoint/dev/service1',
          methods: {
            greetLegacy: {
              asyncModel: 'RequestResponse',
            },
          },
        },
        {
          serviceName: 'DemoService',
          url: 'http://accessPoint/dev/service2',
          methods: {
            loginInLegacy: {
              asyncModel: 'RequestResponse',
            },
            randomNumberFromLegacy$: {
              asyncModel: 'RequestStream',
            },
            getRangeFromLegacy$: {
              asyncModel: 'RequestStream',
            },
          },
        },
      ],
    },
    master: {
      services: [
        {
          serviceName: 'GreetingService',
          url: 'http://accessPoint/dev/service1',
          methods: {
            getHelloFromLegacy: {
              asyncModel: 'RequestResponse',
            },
          },
        },
        {
          serviceName: 'DemoService',
          url: 'http://accessPoint/dev/service2',
          methods: {
            loginInLegacy: {
              asyncModel: 'RequestResponse',
            },
            randomNumberFromLegacy$: {
              asyncModel: 'RequestStream',
            },
            getRangeFromLegacy$: {
              asyncModel: 'RequestStream',
            },
          },
        },
      ],
    },
  },
  'http://localhost:7777': {
    develop: {
      services: [
        {
          serviceName: 'AuthService',
          url: 'http://accessPoint/dev/service1',
          methods: {
            login$: {
              asyncModel: 'RequestResponse',
            },
          },
        },
        {
          serviceName: 'TradeService',
          url: 'http://accessPoint/dev/service2',
          methods: {
            invest: {
              asyncModel: 'RequestResponse',
            },
            tradeBoxes$: {
              asyncModel: 'RequestStream',
            },
            slimTradeBox$: {
              asyncModel: 'RequestStream',
            },
          },
        },
      ],
    },
    master: {
      services: [
        {
          serviceName: 'AuthService',
          url: 'http://accessPoint/dev/service1',
          methods: {
            login$: {
              asyncModel: 'RequestResponse',
            },
          },
        },
        {
          serviceName: 'TradeService',
          url: 'http://accessPoint/dev/service2',
          methods: {
            invest: {
              asyncModel: 'RequestResponse',
            },
            tradeBoxes$: {
              asyncModel: 'RequestStream',
            },
          },
        },
      ],
    },
  },
  'http://localhost:4444': {
    'feature/new-awesome-functionality': {
      services: [
        {
          serviceName: 'MoneyMakerService',
          url: 'http://accessPoint/dev/service1',
          methods: {
            generateMoney: {
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
    master: {
      services: [
        {
          serviceName: 'service1',
          url: 'http://accessPoint/master/service1',
          methods: {
            myTestMethod1: {
              asyncModel: 'RequestResponse',
            },
          },
        },
        {
          serviceName: 'service2',
          url: 'http://accessPoint/master/service2',
          methods: {
            myTestMethod1: {
              asyncModel: 'RequestResponse',
            },
            myTestMethod2: {
              asyncModel: 'RequestStream',
            },
          },
        },
      ],
    },
  },
  'http://localhost:8888': {
    develop: {
      services: [
        {
          serviceName: 'Deployer',
          url: 'http://accessPoint/dev/service1',
          methods: {
            deploy: {
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
    master: {
      services: [
        {
          serviceName: 'Deployer',
          url: 'http://accessPoint/dev/service1',
          methods: {
            deploy: {
              asyncModel: 'RequestResponse',
            },
          },
        },
        {
          serviceName: 'service2',
          url: 'http://accessPoint/master/service2',
          methods: {
            myTestMethod1: {
              asyncModel: 'RequestResponse',
            },
            myTestMethod2: {
              asyncModel: 'RequestStream',
            },
          },
        },
      ],
    },
  },
};
