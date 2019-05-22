import bootstrap from './ConfigurationService';
import * as apiMap from '@capsulajs/capsulajs-configuration-service/lib/api';

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  API = apiMap;
  // @ts-ignore
  publicExports = bootstrap;
}

export const api = apiMap;
export default bootstrap;
