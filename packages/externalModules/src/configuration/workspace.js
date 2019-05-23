module.exports = {
  name: 'baseWorkspace',
  services: [
    {
      serviceName: 'ServiceA',
      path: 'http://localhost:3000/serviceA.js',
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
      path: 'http://localhost:3000/serviceB.js',
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
      grid: {
        componentName: 'web-grid',
        nodeId: 'root',
        path: 'http://localhost:3000/Grid.js',
        config: { title: 'Base Grid' },
      },
    },
    items: {
      'request-form': {
        componentName: 'web-request-form',
        nodeId: 'request-form',
        path: 'http://localhost:3000/RequestForm.js',
        config: { title: 'Base Request Form' },
      },
    },
  },
};
