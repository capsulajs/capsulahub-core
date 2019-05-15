import * as utils from '../../src/helpers/utils';

export const mockConfigurationService = (configurationServiceMock: any) => {
  (utils as any).getConfigurationService = jest.fn(() => {
    return configurationServiceMock;
  });
};
