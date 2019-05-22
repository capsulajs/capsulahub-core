import * as api from './api';
import WorkspaceFactory from './WorkspaceFactory';

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  publicExports = WorkspaceFactory;
}

export { api, WorkspaceFactory };
