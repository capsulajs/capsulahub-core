module.exports = {
  name: 'baseWorkspace',
  services: [
    {
      serviceName: 'RendererService',
      path: 'https://s3-eu-west-1.amazonaws.com/capsulajs/core/capsulahub-core-renderer/PR/deploy-renderer/index.js',
      definition: {
        serviceName: 'RendererService',
        methods: {
          renderLayouts: { asyncModel: 'requestResponse' },
          renderItems: { asyncModel: 'requestResponse' },
          renderItem: { asyncModel: 'requestResponse' },
        },
      },
      config: {},
    },
    {
      serviceName: 'EnvRegistry',
      path: 'http://localhost:3001/services/EnvRegistry.js',
      definition: {
        serviceName: 'EnvRegistry',
        methods: {
          methods$: { asyncModel: 'requestStream' },
        },
      },
      config: {},
    },
    {
      serviceName: 'ServiceA',
      path: 'http://localhost:3001/services/serviceA.js',
      definition: {
        serviceName: 'ServiceA',
        methods: {
          greet: { asyncModel: 'requestResponse' },
        },
      },
      config: { name: 'serviceA', message: 'what pill would you choose: red or blue?' },
    },
    {
      serviceName: 'ServiceB',
      path: 'http://localhost:3001/services/serviceB.js',
      definition: {
        serviceName: 'ServiceB',
        methods: {
          getRandomNumbers: { asyncModel: 'requestStream' },
        },
      },
      config: { name: 'serviceB' },
    },
  ],
  components: {
    layouts: {
      root: {
        componentName: 'web-grid',
        path: 'http://localhost:3001/components/Grid.js',
        config: { title: 'Base Grid' },
      },
    },
    items: {
      'request-form': {
        componentName: 'web-request-form',
        path: 'http://localhost:3001/components/RequestForm.js',
        config: { title: 'Base Request Form' },
      },
      catalog: {
        componentName: 'web-catalog',
        path: 'http://localhost:3001/components/Catalog.js',
        config: {},
      },
    },
  },
};
