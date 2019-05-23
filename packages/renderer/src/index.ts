import bootstrap from './RendererService';
import * as api from './api';

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  publicExports = bootstrap;
}

export { api };
export default bootstrap;
