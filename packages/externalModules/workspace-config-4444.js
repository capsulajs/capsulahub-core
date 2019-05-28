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
      serviceName: 'EnvRegistryService',
      path: 'http://localhost:3001/services/EnvRegistry.js',
      definition: {
        serviceName: 'EnvRegistryService',
        methods: {
          register: { asyncModel: 'requestResponse' },
          environments$: { asyncModel: 'requestStream' },
        },
      },
      config: {
        token: 'http://localhost:4444',
      },
    },
    {
      serviceName: 'EnvSelectorService',
      path: 'http://localhost:3001/services/EnvSelector.js',
      definition: {
        serviceName: 'EnvSelectorService',
        methods: {
          input: { asyncModel: 'requestResponse' },
          output$: { asyncModel: 'requestStream' },
          select: { asyncModel: 'requestResponse' },
          selected$: { asyncModel: 'requestStream' },
        },
      },
      config: {},
    },
    {
      serviceName: 'MethodSelectorService',
      path: 'http://localhost:3001/services/MethodSelector.js',
      definition: {
        serviceName: 'MethodSelectorService',
        methods: {
          input: { asyncModel: 'requestResponse' },
          output$: { asyncModel: 'requestStream' },
          select: { asyncModel: 'requestResponse' },
          selected$: { asyncModel: 'requestStream' },
        },
      },
      config: {},
    },
    {
      serviceName: 'Orchestrator',
      path: 'http://localhost:3001/services/Orchestrator.js',
      definition: {
        serviceName: 'Orchestrator',
        methods: {},
      },
      config: {},
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
      logger: {
        componentName: 'web-logger',
        path: 'http://localhost:3001/components/Logger.js',
        config: { title: 'Base logger' },
      },
      catalog: {
        componentName: 'web-catalog',
        path: 'http://localhost:3001/components/Catalog.js',
        config: {},
      },
      'env-dropdown': {
        componentName: 'web-env-dropdown',
        path: 'http://localhost:3001/components/EnvDropdown.js',
        config: {},
      },
    },
  },
};
