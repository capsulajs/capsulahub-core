import * as utils from '../../src/helpers/utils';

export const getConfigurationServiceMock = (configurationServiceMock: any) => {
  (utils as any).getConfigurationService = jest.fn(() => {
    return configurationServiceMock;
  });
};
