import bootstrap from './RendererService';
import * as apiMap from './api';

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  API = apiMap;
  // @ts-ignore
  publicExports = bootstrap;
}

export const api = apiMap;
export default bootstrap;
