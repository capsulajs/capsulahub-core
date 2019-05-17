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
  serviceAlreadyRegisteredError,
} from '../../src/helpers/const';
import { mockBootstrapComponent, mockConfigurationService, mockGetModuleDynamically } from '../helpers/mocks';
import baseConfigEntries, { serviceAConfig } from '../helpers/baseConfigEntries';
import { Workspace } from '../../src/Workspace';

const repositoryNotFoundError = `Configuration repository ${configRepositoryName} not found`;

describe('Workspace tests', () => {
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

  it('Call createWorkspace when a Workspace is created creates new instance of Workspace', async () => {
    expect.assertions(3);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.resolve(serviceABootstrap),
      Promise.resolve(serviceBBootstrap),
      Promise.resolve(gridComponentBootstrap),
      Promise.resolve(requestFormComponentBootstrap),
      Promise.resolve(serviceABootstrap),
      Promise.resolve(serviceBBootstrap),
      Promise.resolve(gridComponentBootstrap),
      Promise.resolve(requestFormComponentBootstrap),
    ]);
    mockBootstrapComponent();

    const workspaceFactory = new WorkspaceFactory();
    const workspace1 = await workspaceFactory.createWorkspace({ token: '123' });
    const workspace2 = await workspaceFactory.createWorkspace({ token: '123' });
    expect(workspace1 instanceof Workspace).toBeTruthy();
    expect(workspace2 instanceof Workspace).toBeTruthy();
    expect(workspace1 !== workspace2).toBeTruthy();
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
    expect.assertions(3);
    const serviceCConfig = {
      serviceName: 'ServiceC',
      path: 'http://localhost:3000/services/serviceC.js',
      definition: {
        serviceName: 'ServiceC',
        methods: {
          hello: { asyncModel: 'requestResponse' as Api.AsyncModel },
        },
      },
      config: {},
    };

    const configurationMock = [
      baseConfigEntries[0],
      {
        key: 'services',
        value: [...(baseConfigEntries[1] as any).value, serviceCConfig],
      },
      baseConfigEntries[2],
    ];

    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: configurationMock }),
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
    expect(services.ServiceC).toBeUndefined();

    const serviceCReference = await serviceCBootstrap(workspace, serviceCConfig);

    await workspace.registerService({
      serviceName: serviceCConfig.serviceName,
      definition: serviceCConfig.definition,
      reference: serviceCReference,
    });
    const updatedServices = await workspace.services({});
    const serviceC = await updatedServices.ServiceC;
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
        definition: serviceAConfig.definition,
        reference: {},
      })
    ).rejects.toEqual(new Error(serviceAlreadyRegisteredError));
  });
});
