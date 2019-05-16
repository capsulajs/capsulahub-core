export default [
  {
    key: 'name',
    value: 'baseWorkspace',
  },
  {
    key: 'services',
    value: [
      {
        serviceName: 'ServiceA',
        path: 'http://localhost:3000/services/serviceA.js',
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
        path: 'http://localhost:3000/services/serviceB',
        definition: {
          serviceName: 'ServiceB',
          methods: {
            getRandomNumbers: { asyncModel: 'requestStream' },
          },
        },
        config: { name: 'serviceB' },
      },
    ],
  },
  {
    key: 'components',
    value: {
      layouts: [
        {
          grid: {
            componentName: 'web-grid',
            nodeId: 'root',
            path: 'http://localhost:3000/components/Grid',
            config: { title: 'Base Grid' },
          },
        },
      ],
      items: [
        {
          ['request-form']: {
            componentName: 'web-grid',
            nodeId: 'request-form',
            path: 'http://localhost:3000/components/RequestForm',
            config: { title: 'Base Request Form' },
          },
        },
      ],
    },
  },
];
