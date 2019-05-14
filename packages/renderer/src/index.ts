import * as api from './api';

declare global {
  interface Window {
    CAPSULAHUB_WORKSPACE: any;
    CAPSULAHUB_CONFIG: any;
  }
}

export default {
  api,
};
