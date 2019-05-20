// @ts-ignore
export const mockWorkspace = (components) => {
  const mock = jest.fn();
  // @ts-ignore
  const WORKSPACE = {
    components: mock,
  };
  mock.mockResolvedValueOnce(components);
  return WORKSPACE;
};
