import { take } from 'rxjs/operators';
import { configurationTypes } from '@capsulajs/capsulajs-configuration-service/lib/utils';
import * as configurationServiceItems from '@capsulajs/capsulajs-configuration-service';
// @ts-ignore
import serviceABootstrap from '@capsulajs/capsulahub-core-external-modules/src/services/serviceA';
// @ts-ignore
import serviceBBootstrap from '@capsulajs/capsulahub-core-external-modules/src/services/serviceB';
// @ts-ignore
import serviceCBootstrap, { ServiceC } from '@capsulajs/capsulahub-core-external-modules/src/services/serviceC';
// @ts-ignore
import serviceDBootstrap from '@capsulajs/capsulahub-core-external-modules/src/services/serviceD';
// @ts-ignore
import gridComponentBootstrap from '@capsulajs/capsulahub-core-external-modules/src/components/Grid';
// // @ts-ignore
import requestFormComponentBootstrap from '@capsulajs/capsulahub-core-external-modules/src/components/RequestForm';
import WorkspaceFactory from '../../src/WorkspaceFactory';
import {
  configRepositoryName,
  configWrongFormatError,
  createWorkspaceWrongRequestError,
  getBootstrapComponentError,
  getLoadingServiceError,
  getInitComponentError,
  getLoadingComponentError,
  invalidRegisterServiceRequestError,
  serviceAlreadyRegisteredError,
  serviceToRegisterMissingInConfigurationError,
  getBootstrapServiceError,
  getScalecubeCreationError,
  configurationTypeDoesNotExist,
  configNotLoadedError,
} from '../../src/helpers/const';
import { mockBootstrapComponent, mockConfigurationService, mockGetModuleDynamically } from '../helpers/mocks';
import baseConfigEntries, {
  configEntriesWithIncorrectDefinitionService,
  configEntriesWithUnregisteredService,
  serviceAConfig,
  serviceCConfig,
} from '../helpers/baseConfigEntries';
import { applyPostMessagePolyfill } from '../helpers/polyfills/PostMessageWithTransferPolyfill';
import { applyMessageChannelPolyfill } from '../helpers/polyfills/MessageChannelPolyfill';

const repositoryNotFoundError = `Configuration repository ${configRepositoryName} not found`;

describe('Workspace tests', () => {
  applyPostMessagePolyfill();
  applyMessageChannelPolyfill();
  const getConfigurationServiceClassSpy = jest.spyOn(configurationServiceItems, 'getProvider');

  beforeEach(() => {
    getConfigurationServiceClassSpy.mockClear();
  });

  it('Call createWorkspace with a token with no configuration available is rejected with error', () => {
    expect.assertions(1);
    const configurationServiceMock = {
      entries: () => Promise.reject(new Error(repositoryNotFoundError)),
    };
    mockConfigurationService(configurationServiceMock);

    const workspaceFactory = new WorkspaceFactory();
    return expect(workspaceFactory.createWorkspace({ token: '123' })).rejects.toEqual(
      new Error(repositoryNotFoundError)
    );
  });

  it('Call createWorkspace with a token with invalid configuration is rejected with error', () => {
    expect.assertions(1);
    const invalidConfigEntries = [{ key: 'name', value: 'workspaceConfig' }, { key: 'services', value: [] }];
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: invalidConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);

    const workspaceFactory = new WorkspaceFactory();
    return expect(workspaceFactory.createWorkspace({ token: '123' })).rejects.toEqual(
      new Error(configWrongFormatError)
    );
  });

  const invalidCreateWorkspaceRequest = [' ', {}, { test: 'test' }, [], ['test'], null, undefined, true, false, 0, -1];

  test.each(invalidCreateWorkspaceRequest)(
    'Call createWorkspace with a token with invalid format is rejected with error (%s)',
    (invalidToken) => {
      expect.assertions(1);
      const workspaceFactory = new WorkspaceFactory();
      // @ts-ignore
      return expect(workspaceFactory.createWorkspace({ token: invalidToken })).rejects.toEqual(
        new Error(createWorkspaceWrongRequestError)
      );
    }
  );

  const invalidConfigurationTypes = [' ', {}, { test: 'test' }, [], ['test'], null, true, false, 0, -1];
  test.each(invalidConfigurationTypes)(
    'Call createWorkspace with an invalid configProvider is rejected with error (%s)',
    (invalidConfigProvider) => {
      expect.assertions(1);
      const configurationServiceMock = {
        entries: () => Promise.resolve({ entries: baseConfigEntries }),
      };
      mockConfigurationService(configurationServiceMock);
      const workspaceFactory = new WorkspaceFactory();
      const errorMessageFromConfigurationService = invalidConfigProvider
        ? configurationServiceItems.messages.configProviderDoesNotExist
        : configurationServiceItems.messages.getProviderInvalidRequest;
      return expect(
        // @ts-ignore
        workspaceFactory.createWorkspace({ token: '123', configProvider: invalidConfigProvider })
      ).rejects.toEqual(new Error(configNotLoadedError(new Error(errorMessageFromConfigurationService))));
    }
  );

  it('Call createWorkspace when a Workspace is created creates new instance of Workspace', async (done) => {
    expect.assertions(2);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: configEntriesWithUnregisteredService }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap),
      Promise.resolve(serviceBBootstrap),
      Promise.resolve(serviceCBootstrap),
      Promise.resolve(gridComponentBootstrap),
      Promise.resolve(requestFormComponentBootstrap),
      Promise.resolve(serviceABootstrap),
      Promise.resolve(serviceBBootstrap),
      Promise.resolve(serviceCBootstrap),
      Promise.resolve(gridComponentBootstrap),
      Promise.resolve(requestFormComponentBootstrap),
    ]);
    mockBootstrapComponent();

    const workspaceFactory = new WorkspaceFactory();
    const workspace1 = await workspaceFactory.createWorkspace({ token: '123' });

    const workspace2 = await workspaceFactory.createWorkspace({ token: '123' });

    const servicesForWorkspace1 = await workspace1.services({});
    const servicesForWorkspace2 = await workspace2.services({});

    let unregisteredServiceFromWorkspace1Received = false;
    let unregisteredServiceFromWorkspace2Received = false;

    servicesForWorkspace1.ServiceC.then(() => {
      unregisteredServiceFromWorkspace1Received = true;
    });
    servicesForWorkspace2.ServiceC.then(() => {
      unregisteredServiceFromWorkspace2Received = true;
    });

    await workspace2.registerService({
      serviceName: serviceCConfig.serviceName,
      reference: new ServiceC(),
    });

    setTimeout(() => {
      expect(unregisteredServiceFromWorkspace1Received).toBeFalsy();
      expect(unregisteredServiceFromWorkspace2Received).toBeTruthy();
      done();
    }, 1000);
  });

  it('An error with importing a service occurs after calling createWorkspace', async () => {
    expect.assertions(1);
    const error = new Error('Module can not be found');
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.reject(error),
      Promise.resolve(serviceBBootstrap),
      Promise.resolve(gridComponentBootstrap),
      Promise.resolve(requestFormComponentBootstrap),
    ]);

    const workspaceFactory = new WorkspaceFactory();
    return expect(workspaceFactory.createWorkspace({ token: '123' })).rejects.toEqual(
      new Error(getLoadingServiceError(error, 'ServiceA'))
    );
  });

  it('An error with bootstrapping a service occurs after calling createWorkspace', async () => {
    expect.assertions(1);
    const bootstrapError = new Error('Type error: logic is undefined');
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap),
      Promise.resolve(() => {
        return new Promise(() => {
          throw bootstrapError;
        });
      }),
      Promise.resolve(gridComponentBootstrap),
      Promise.resolve(requestFormComponentBootstrap),
    ]);

    const workspaceFactory = new WorkspaceFactory();
    return expect(workspaceFactory.createWorkspace({ token: '123' })).rejects.toEqual(
      new Error(getBootstrapServiceError(bootstrapError, 'ServiceB'))
    );
  });

  it('An error with importing a component occurs after calling createWorkspace', async () => {
    expect.assertions(1);
    const error = new Error('Module can not be found');
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap),
      Promise.resolve(serviceBBootstrap),
      Promise.reject(error),
      Promise.resolve(requestFormComponentBootstrap),
    ]);

    const workspaceFactory = new WorkspaceFactory();

    return expect(workspaceFactory.createWorkspace({ token: '123' })).rejects.toEqual(
      new Error(getLoadingComponentError(error, 'web-grid'))
    );
  });

  it('An error with bootstrapping a component occurs after calling createWorkspace', async () => {
    expect.assertions(1);
    const bootstrapError = new Error('TypeError: stream$ is not a function');
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap),
      Promise.resolve(serviceBBootstrap),
      Promise.resolve(gridComponentBootstrap),
      Promise.resolve(() => {
        return new Promise(() => {
          throw bootstrapError;
        });
      }),
    ]);
    mockBootstrapComponent();

    const workspaceFactory = new WorkspaceFactory();

    return expect(workspaceFactory.createWorkspace({ token: '123' })).rejects.toEqual(
      new Error(getBootstrapComponentError(bootstrapError, 'web-request-form'))
    );
  });

  it('An error with registering a component occurs after calling createWorkspace', async () => {
    expect.assertions(1);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap),
      Promise.resolve(serviceBBootstrap),
      Promise.resolve(gridComponentBootstrap),
      Promise.resolve(requestFormComponentBootstrap),
    ]);
    mockBootstrapComponent(true);

    const workspaceFactory = new WorkspaceFactory();
    return expect(workspaceFactory.createWorkspace({ token: '123' })).rejects.toEqual(
      new Error(getInitComponentError(new Error('Error while defining custom element'), 'web-grid'))
    );
  });

  it('Call services method returns a map of promises to each service loaded in Workspace', async (done) => {
    expect.assertions(6);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap),
      Promise.resolve(serviceBBootstrap),
      Promise.resolve(gridComponentBootstrap),
      Promise.resolve(requestFormComponentBootstrap),
    ]);
    mockBootstrapComponent();

    const workspaceFactory = new WorkspaceFactory();
    const workspace = await workspaceFactory.createWorkspace({ token: '123' });
    const services = await workspace.services({});
    expect(Object.keys(services)).toEqual(['ServiceA', 'ServiceB']);

    const serviceA = await services.ServiceA;
    expect(serviceA.serviceName).toEqual('ServiceA');
    const greetRes = await serviceA.proxy.greet('Stephane');
    expect(greetRes).toEqual('Dear Stephane, what pill would you choose: red or blue?');
    const serviceB = await services.ServiceB;
    expect(serviceB.serviceName).toEqual('ServiceB');

    let updates = 0;
    serviceB.proxy
      .getRandomNumbers()
      .pipe(take(2))
      .subscribe((num: number) => {
        expect(typeof num === 'number').toBeTruthy();
        updates++;
        if (updates === 2) {
          done();
        }
      });
  });

  it('Call components method returns a map of promises to each component loaded in Workspace', async () => {
    expect.assertions(9);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap),
      Promise.resolve(serviceBBootstrap),
      Promise.resolve(gridComponentBootstrap),
      Promise.resolve(requestFormComponentBootstrap),
    ]);
    mockBootstrapComponent();

    const workspaceFactory = new WorkspaceFactory();
    const workspace = await workspaceFactory.createWorkspace({ token: '123' });
    const components = await workspace.components({});
    expect(Object.keys(components)).toEqual(['grid', 'request-form']);
    const gridComponentData = await components.grid;
    expect(gridComponentData.componentName).toEqual('web-grid');
    expect(gridComponentData.nodeId).toEqual('grid');
    // Jest limitation of using HTMLElement
    expect(gridComponentData.reference).toEqual({});
    expect(gridComponentData.type).toEqual('layout');

    const requestFormComponentData = await components['request-form'];
    expect(requestFormComponentData.componentName).toEqual('web-request-form');
    expect(requestFormComponentData.nodeId).toEqual('request-form');
    // Jest limitation of using HTMLElement
    expect(requestFormComponentData.reference).toEqual({});
    expect(requestFormComponentData.type).toEqual('item');
  });

  it('Call registerService method with a service already registered is rejected with error', async () => {
    expect.assertions(1);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap),
      Promise.resolve(serviceBBootstrap),
      Promise.resolve(gridComponentBootstrap),
      Promise.resolve(requestFormComponentBootstrap),
    ]);
    mockBootstrapComponent();

    const workspaceFactory = new WorkspaceFactory();
    const workspace = await workspaceFactory.createWorkspace({ token: '123' });
    return expect(
      workspace.registerService({
        serviceName: serviceAConfig.serviceName,
        reference: {},
      })
    ).rejects.toEqual(new Error(serviceAlreadyRegisteredError));
  });

  const invalidServiceNames = [' ', {}, { test: 'test' }, [], ['test'], null, undefined, true, false, 0, -1];
  test.each(invalidServiceNames)(
    'Call registerService method with an invalid serviceName is rejected with error',
    async (invalidServiceName) => {
      expect.assertions(1);
      const configurationServiceMock = {
        entries: () => Promise.resolve({ entries: baseConfigEntries }),
      };
      mockConfigurationService(configurationServiceMock);
      mockGetModuleDynamically([
        Promise.resolve(serviceABootstrap),
        Promise.resolve(serviceBBootstrap),
        Promise.resolve(gridComponentBootstrap),
        Promise.resolve(requestFormComponentBootstrap),
      ]);
      mockBootstrapComponent();

      const workspaceFactory = new WorkspaceFactory();
      const workspace = await workspaceFactory.createWorkspace({ token: '123' });
      return expect(
        workspace.registerService({
          // @ts-ignore
          serviceName: invalidServiceName,
          reference: {},
        })
      ).rejects.toEqual(new Error(invalidRegisterServiceRequestError));
    }
  );

  it("Call registerService method with a service that doesnt's exist in configuration is rejected with error", async () => {
    expect.assertions(1);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap),
      Promise.resolve(serviceBBootstrap),
      Promise.resolve(gridComponentBootstrap),
      Promise.resolve(requestFormComponentBootstrap),
    ]);
    mockBootstrapComponent();

    const workspaceFactory = new WorkspaceFactory();
    const workspace = await workspaceFactory.createWorkspace({ token: '123' });
    return expect(
      workspace.registerService({
        serviceName: 'MissingService',
        reference: {},
      })
    ).rejects.toEqual(new Error(serviceToRegisterMissingInConfigurationError));
  });

  it('Call registerService method with invalid reference rejects servicePromise in ServicesMap', async (done) => {
    expect.assertions(2);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: configEntriesWithUnregisteredService }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap),
      Promise.resolve(serviceBBootstrap),
      Promise.resolve(serviceCBootstrap),
      Promise.resolve(gridComponentBootstrap),
      Promise.resolve(requestFormComponentBootstrap),
    ]);
    mockBootstrapComponent();

    const workspaceFactory = new WorkspaceFactory();
    const workspace = await workspaceFactory.createWorkspace({ token: '123' });
    const services = await workspace.services({});

    services.ServiceC.catch((error) => {
      expect(error).toEqual(new Error(invalidRegisterServiceRequestError));
      done();
    });

    try {
      await workspace.registerService({
        serviceName: serviceCConfig.serviceName,
        reference: 'invalid reference',
      });
    } catch (error) {
      expect(error).toEqual(new Error(invalidRegisterServiceRequestError));
    }
  });

  it(
    'If scalecube error happens while registering a service, the promise for this service should be rejected with' +
      ' an error',
    async () => {
      expect.assertions(1);
      const configurationServiceMock = {
        entries: () => Promise.resolve({ entries: configEntriesWithIncorrectDefinitionService }),
      };
      mockConfigurationService(configurationServiceMock);
      mockGetModuleDynamically([
        Promise.resolve(serviceABootstrap),
        Promise.resolve(serviceBBootstrap),
        Promise.resolve(serviceDBootstrap),
        Promise.resolve(gridComponentBootstrap),
        Promise.resolve(requestFormComponentBootstrap),
      ]);
      mockBootstrapComponent();

      const workspaceFactory = new WorkspaceFactory();
      const workspace = await workspaceFactory.createWorkspace({ token: '123' });
      const services = await workspace.services({});
      return expect(services.ServiceD).rejects.toEqual(
        new Error(getScalecubeCreationError(new Error('Invalid method reference for ServiceD/world'), 'ServiceD'))
      );
    }
  );

  test.each`
    configProvider                          | configurationServiceClassName
    ${`${configurationTypes.localStorage}`} | ${'ConfigurationServiceLocalStorage'}
    ${`${configurationTypes.localFile}`}    | ${'ConfigurationServiceFile'}
    ${`${configurationTypes.httpFile}`}     | ${'ConfigurationServiceHttpFile'}
    ${`${configurationTypes.scalecube}`}    | ${'ConfigurationServiceScalecube'}
    ${`${configurationTypes.httpServer}`}   | ${'ConfigurationServiceHttp'}
  `(
    'Workspace is created with the correct configurationType: $configurationType: $configurationServiceClassName',
    async ({ configProvider, configurationServiceClassName }) => {
      expect.assertions(1);
      const configurationServiceMock = {
        entries: () => Promise.resolve({ entries: baseConfigEntries }),
      };
      mockConfigurationService(configurationServiceMock);
      mockGetModuleDynamically([
        Promise.resolve(serviceABootstrap),
        Promise.resolve(serviceBBootstrap),
        Promise.resolve(gridComponentBootstrap),
        Promise.resolve(requestFormComponentBootstrap),
      ]);
      mockBootstrapComponent();
      const workspaceFactory = new WorkspaceFactory();
      await workspaceFactory.createWorkspace({ token: '123', configProvider });
      return expect(getConfigurationServiceClassSpy.mock.results[0].value.name).toBe(configurationServiceClassName);
    }
  );

  it('Call createWorkspace without providing configurationType should create workspace with default type of configuration provider', async () => {
    expect.assertions(1);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap),
      Promise.resolve(serviceBBootstrap),
      Promise.resolve(gridComponentBootstrap),
      Promise.resolve(requestFormComponentBootstrap),
    ]);
    mockBootstrapComponent();

    const workspaceFactory = new WorkspaceFactory();
    await workspaceFactory.createWorkspace({ token: '123' });
    return expect(getConfigurationServiceClassSpy.mock.results[0].value.name).toBe('ConfigurationServiceHttpFile');
  });

  it.skip('Call createWorkspace with providing non-existing configurationType is rejected with error', async () => {
    expect.assertions(1);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap),
      Promise.resolve(serviceBBootstrap),
      Promise.resolve(gridComponentBootstrap),
      Promise.resolve(requestFormComponentBootstrap),
    ]);
    mockBootstrapComponent();

    const wrongConfigurationType = 'wrongConfigurationType';
    const workspaceFactory = new WorkspaceFactory();
    return expect(
      // @ts-ignore
      workspaceFactory.createWorkspace({ token: '123', configurationType: wrongConfigurationType })
    ).rejects.toEqual(new Error(configurationTypeDoesNotExist(wrongConfigurationType)));
  });
});
