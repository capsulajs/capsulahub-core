export const validConfigNoFlows = {
  flows: [],
};

export const validConfigOneFlow = {
  flows: [
    {
      name: 'flow1',
      id: '1',
      execute: () => {},
    },
  ],
};

export const validConfigSomeFlows = {
  flows: [
    {
      name: 'flow1',
      id: '1',
      execute: () => {},
    },
    {
      name: 'flow2',
      id: '2',
      execute: () => {},
    },
    {
      name: 'flow3',
      id: '3',
      execute: () => {},
    },
  ],
};

export const invalidConfigFlowPattern = (flows: any) => {
  return { flows };
};

export const validConfigWithThrowingErrorService = {
  flows: [
    {
      name: 'flow1',
      id: '1',
      execute: () => {},
    },
    {
      name: 'flow2',
      id: '2',
      execute: () => {}, // Put some error here
    },
    {
      name: 'flow3',
      id: '3',
      execute: () => {},
    },
  ],
};

export const validConfigWithMissingService = {
  flows: [
    {
      name: 'flow1',
      id: '1',
      execute: () => {}, // Use a non existing service here
    },
    {
      name: 'flow2',
      id: '2',
      execute: () => {},
    },
    {
      name: 'flow3',
      id: '3',
      execute: () => {},
    },
  ],
};
