import WorkspaceFactory from './WorkspaceFactory';
import * as api from './api';

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  publicExports = WorkspaceFactory;
}

export { api };
export default WorkspaceFactory;
