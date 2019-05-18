import { Api } from '@scalecube/scalecube-microservice';

export const serviceAConfig = {
  serviceName: 'ServiceA',
  path: 'http://localhost:3000/services/serviceA.js',
  definition: {
    serviceName: 'ServiceA',
    methods: {
      greet: { asyncModel: 'requestResponse' as Api.AsyncModel },
    },
  },
  config: { name: 'serviceA', message: 'what pill would you choose: red or blue?' },
};

export default [
  {
    key: 'name',
    value: 'baseWorkspace',
  },
  {
    key: 'services',
    value: [
      serviceAConfig,
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
      layouts: {
        grid: {
          componentName: 'web-grid',
          nodeId: 'root',
          path: 'http://localhost:3000/components/Grid',
          config: { title: 'Base Grid' },
        },
      },
      items: {
        ['request-form']: {
          componentName: 'web-request-form',
          nodeId: 'request-form',
          path: 'http://localhost:3000/components/RequestForm',
          config: { title: 'Base Request Form' },
        },
      },
    },
  },
];
