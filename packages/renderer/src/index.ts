import bootstrap from './RendererService';
import * as API from './api';

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  publicExports = bootstrap;
}

export { API };
export default bootstrap;
