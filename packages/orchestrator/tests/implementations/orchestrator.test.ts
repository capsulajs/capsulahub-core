import { Orchestrator as OrchestratorInterface } from '../../src/api';

describe('Orchestrator test suite', () => {
  let orchestrator: OrchestratorInterface;

  beforeEach(() => {
    orchestrator = new Orchestrator();
  });

  it('Orchestrator is initiated with configuration with one valid flow - flow is executed', () => {
    expect.assertions(1);
    orchestrator = new Orchestrator();
    orchestrator.init({});
  });

  it('Orchestrator is initiated with configuration with two or more valid flows - flows are executed', () => {});

  it('Initiating Orchestrator with no configuration returns error', () => {});

  const invalidConfig = [
    null,
    undefined,
    'test',
    123,
    true,
    [],
    ['test'],
    {},
    { test: 'test' },
    { flows: [], test: [] },
  ];

  it.each(invalidConfig)('Orchestrator is initiated with an invalid config (%j) - an error is returned', () => {});

  const invalidFlows = [null, undefined, 'test', 123, true, ['test'], {}];

  it.each(invalidFlows)(
    "Orchestrator is initiated with a config with a flows that doesn't match the pattern (%j) - an error is returned",
    () => {}
  );

  it('Orchestrator is initiated with a configuration with empty flows', () => {});

  it('The function of one of the flows returns error', () => {});

  it('Orchestrator is initiated with a flow containing a non existing service', () => {});
});
