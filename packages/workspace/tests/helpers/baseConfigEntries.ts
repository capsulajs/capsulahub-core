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
        config: { name: 'serviceA' },
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
      layout: [
        {
          grid: {
            componentName: 'grid',
            path: 'localhost:8000/grid-component',
            config: { title: 'Base Grid' },
          },
        },
      ],
      items: [
        {
          ['request-form']: {
            componentName: 'request-form',
            path: 'localhost:8000/request-form-component',
            config: { title: 'Base Request Form' },
          },
        },
      ],
    },
  },
];
