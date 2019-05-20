import { take } from 'rxjs/operators';
import { Api } from '@scalecube/scalecube-microservice';

// @ts-ignore
import serviceABootstrap from '@capsulajs/capsulahub-core-external-modules/src/services/serviceA';
// @ts-ignore
import serviceBBootstrap from '@capsulajs/capsulahub-core-external-modules/src/services/serviceB';
// @ts-ignore
import serviceCBootstrap from '@capsulajs/capsulahub-core-external-modules/src/services/serviceC';
// @ts-ignore
import gridComponentBootstrap from '@capsulajs/capsulahub-core-external-modules/src/components/Grid';
// // @ts-ignore
import requestFormComponentBootstrap from '@capsulajs/capsulahub-core-external-modules/src/components/RequestForm';
import { WorkspaceFactory } from '../../src/WorkspaceFactory';
import {
  bootstrapComponentError,
  bootstrapServiceError,
  configRepositoryName,
  configWrongFormatError,
  createWorkspaceWrongRequestError,
  invalidRegisterServiceRequestError,
  serviceAlreadyRegisteredError,
  serviceToRegisterMissingInConfigurationError,
} from '../../src/helpers/const';
import { mockBootstrapComponent, mockConfigurationService, mockGetModuleDynamically } from '../helpers/mocks';
import baseConfigEntries, {
  configEntriesWithUnregisteredService,
  serviceAConfig,
  serviceCConfig,
} from '../helpers/baseConfigEntries';
import { Workspace } from '../../src/Workspace';
import { applyPostMessagePolyfill } from '../helpers/polyfills/PostMessageWithTransferPolyfill';
import { applyMessageChannelPolyfill } from '../helpers/polyfills/MessageChannelPolyfill';

const repositoryNotFoundError = `Configuration repository ${configRepositoryName} not found`;

describe('Workspace tests', () => {
  applyPostMessagePolyfill();
  applyMessageChannelPolyfill();

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
    'Call createWorkspace with a token with invalid format is rejected with error',
    (invalidToken) => {
      expect.assertions(1);
      const workspaceFactory = new WorkspaceFactory();
      // @ts-ignore
      return expect(workspaceFactory.createWorkspace({ token: invalidToken })).rejects.toEqual(
        new Error(createWorkspaceWrongRequestError)
      );
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
    const serviceCData = await serviceCBootstrap(workspace2, serviceCConfig);

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
      reference: (serviceCData as any).reference,
    });

    setTimeout(() => {
      expect(unregisteredServiceFromWorkspace1Received).toBeFalsy();
      expect(unregisteredServiceFromWorkspace2Received).toBeTruthy();
      done();
    }, 1000);
  });

  it('An error with importing a service occurs after calling createWorkspace', async () => {
    expect.assertions(1);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.reject('Module can not be found'),
      Promise.resolve((): any => Promise.resolve({})),
      Promise.resolve(gridComponentBootstrap),
      Promise.resolve(requestFormComponentBootstrap),
    ]);

    const workspaceFactory = new WorkspaceFactory();
    return expect(workspaceFactory.createWorkspace({ token: '123' })).rejects.toEqual(new Error(bootstrapServiceError));
  });

  it('An error with importing a component occurs after calling createWorkspace', async () => {
    expect.assertions(1);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap),
      Promise.resolve(serviceBBootstrap),
      Promise.reject('Module can not be found'),
      Promise.resolve(requestFormComponentBootstrap),
    ]);

    const workspaceFactory = new WorkspaceFactory();

    return expect(workspaceFactory.createWorkspace({ token: '123' })).rejects.toEqual(
      new Error(bootstrapComponentError)
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
      new Error(bootstrapComponentError)
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

  it('Call registerService method registers the provided service in the Workspace', async () => {
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

    const serviceCData = await serviceCBootstrap(workspace, serviceCConfig);

    await workspace.registerService({
      serviceName: serviceCConfig.serviceName,
      reference: (serviceCData as any).reference,
    });
    const serviceC = await services.ServiceC;
    expect(serviceC.serviceName).toEqual('ServiceC');
    return expect(serviceC.proxy.hello('Stephane')).resolves.toEqual('Hello, Stephane');
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

  const invalidServiceName = [' ', {}, { test: 'test' }, [], ['test'], null, undefined, true, false, 0, -1];
  test.each(invalidServiceName)(
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
});
