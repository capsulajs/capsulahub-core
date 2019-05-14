import { WorkspaceFactory } from '../../src/WorkspaceFactory';
import { configRepositoryName } from '../../src/helpers/const';
import { getConfigurationServiceMock } from '../helpers/mocks';

const repositoryNotFoundError = `Configuration repository ${configRepositoryName} not found`;

describe('Workspace tests', () => {
  it('Call createWorkspace with a token with no configuration available is rejected with error', () => {
    const configurationServiceMock = {
      entries: () => Promise.reject(new Error(repositoryNotFoundError)),
    };
    getConfigurationServiceMock(configurationServiceMock);

    const workspaceFactory = new WorkspaceFactory();
    return expect(workspaceFactory.createWorkspace({ token: '123' })).rejects.toEqual(
      new Error(repositoryNotFoundError)
    );
  });

  it('Call createWorkspace with a token with invalid configuration is rejected with error', () => {
    const invalidConfigEntries = [
      { key: 'name', value: 'workspaceConfig' },
      { key: 'services', value: 'invalidConfigValue' },
    ];
    const configurationServiceMock = {
      entries: () => Promise.resolve({ entries: invalidConfigEntries }),
    };
    getConfigurationServiceMock(configurationServiceMock);

    const workspaceFactory = new WorkspaceFactory();
    return expect(workspaceFactory.createWorkspace({ token: '123' })).rejects.toEqual(
      new Error(repositoryNotFoundError)
    );
  });
});
