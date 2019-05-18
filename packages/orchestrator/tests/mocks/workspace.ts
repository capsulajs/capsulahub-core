import { ServiceA } from '../helpers/serviceA';
import { ServiceB } from '../helpers/serviceB';

export const WORKSPACE = {
  services: (serviceName: string): Promise<any> => {
    return new Promise((resolve) => {
      switch (serviceName) {
        case 'serviceA':
          resolve(new ServiceA());
          break;
        case 'serviceB':
          resolve(new ServiceB());
          break;
      }
    });
  },
};
