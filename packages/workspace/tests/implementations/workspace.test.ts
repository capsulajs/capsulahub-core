import { WorkspaceFactory } from '../../src/WorkspaceFactory';

describe('Workspace tests', () => {
  it('Call createWorkspace with a token with no configuration available is rejected with error', () => {
    const workspaceFactory = new WorkspaceFactory();

    return expect(workspaceFactory.createWorkspace({ token: '123' })).rejects.toEqual(new Error('test'));
  });
});
