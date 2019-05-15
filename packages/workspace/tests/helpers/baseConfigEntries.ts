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
        path: 'localhost:8000/serviceA',
        definition: {
          serviceName: 'ServiceA',
          methods: {
            input: { asyncModel: 'RequestResponse' },
            output$: { asyncModel: 'RequestStream' },
            select: { asyncModel: 'RequestResponse' },
            selected$: { asyncModel: 'RequestStream' },
          },
        },
        config: { name: 'serviceA' },
      },
      {
        serviceName: 'ServiceB',
        path: 'localhost:8000/serviceB',
        definition: {
          serviceName: 'ServiceB',
          methods: {
            input: { asyncModel: 'RequestResponse' },
            output$: { asyncModel: 'RequestStream' },
            select: { asyncModel: 'RequestResponse' },
            selected$: { asyncModel: 'RequestStream' },
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
