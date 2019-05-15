import { WorkspaceFactory } from '../../src/WorkspaceFactory';
import {
  bootstrapServiceError,
  configRepositoryName,
  configWrongFormatError,
  createWorkspaceWrongRequestError,
} from '../../src/helpers/const';
import { mockConfigurationService, mockGetModuleDynamically } from '../helpers/mocks';
import baseConfigEntries from '../helpers/baseConfigEntries';
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
    ]);

    const workspaceFactory = new WorkspaceFactory();
    return expect(workspaceFactory.createWorkspace({ token: '123' })).rejects.toEqual(new Error(bootstrapServiceError));
  });

  // TODO
  it('An error with importing a component occurs after calling createWorkspace', async () => {
    expect.assertions(1);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.reject('Module can not be found'),
      Promise.resolve((): any => Promise.resolve({})),
    ]);

    const workspaceFactory = new WorkspaceFactory();
    return expect(workspaceFactory.createWorkspace({ token: '123' })).rejects.toEqual(new Error(bootstrapServiceError));
  });

  // TODO
  it('An error with registering a component occurs after calling createWorkspace', async () => {
    expect.assertions(1);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.reject('Module can not be found'),
      Promise.resolve((): any => Promise.resolve({})),
    ]);

    const workspaceFactory = new WorkspaceFactory();
    return expect(workspaceFactory.createWorkspace({ token: '123' })).rejects.toEqual(new Error(bootstrapServiceError));
  });

  it('Call services method returns a map of promises to each service loaded in Workspace', async () => {
    expect.assertions(1);
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: baseConfigEntries }),
    };
    mockConfigurationService(configurationServiceMock);
    mockGetModuleDynamically([
      Promise.reject('Module can not be found'),
      Promise.resolve((): any => Promise.resolve({})),
    ]);

    const workspaceFactory = new WorkspaceFactory();
    return expect(workspaceFactory.createWorkspace({ token: '123' })).rejects.toEqual(new Error(bootstrapServiceError));
  });
});
