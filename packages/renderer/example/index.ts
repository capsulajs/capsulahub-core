import { bootstrap } from '../src/index';
import mocks from './mocks';

// @ts-ignore
const componentsMap = (window.mockComponents || []).reduce((acc, curr) => ({ ...acc, [curr]: mocks[curr] }), {});
const componentsResponse = Promise.resolve({ ...componentsMap });
// @ts-ignore
const registerService = ({ reference }) => (window.rendererService = reference);
const workspace = {
  registerService,
  components: () => componentsResponse,
};
// @ts-ignore
const config = {
  serviceName: 'RendererService',
};

// @ts-ignore
bootstrap(workspace, config);
