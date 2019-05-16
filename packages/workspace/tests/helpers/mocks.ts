import * as utils from '../../src/helpers/utils';

const utilsToMock: any = utils;

export const mockConfigurationService = (configurationServiceMock: any) => {
  utilsToMock.getConfigurationService = jest.fn(() => {
    return configurationServiceMock;
  });
};

export const mockGetModuleDynamically = (modulePromises: Promise<any>[]) => {
  const getModuleDynamicallyMock = jest.fn();
  modulePromises.forEach((modulePromise) => {
    getModuleDynamicallyMock.mockReturnValueOnce(modulePromise);
  });

  utilsToMock.getModuleDynamically = getModuleDynamicallyMock;
};

export const mockBootstrapComponent = (throwsError = false) => {
  utilsToMock.bootstrapComponent = jest.fn(() => {
    if (throwsError) {
      throw new Error('Error while defining custom element');
    }
    return {};
  });
};
