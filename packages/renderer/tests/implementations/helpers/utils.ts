// @ts-ignore
export const mockWorkspaceComponents = (components) => {
  const mock = jest.fn();
  // @ts-ignore
  global.CAPSULAHUB_WORKSPACE = {
    components: mock,
  };

  mock.mockResolvedValueOnce(components);
};
