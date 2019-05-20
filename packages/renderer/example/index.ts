import { bootstrap } from '../src/index';
import mocks from './mocks';

// @ts-ignore
const componentsMap = (window.mockComponents || []).reduce((acc, curr) => ({ ...acc, [curr]: mocks[curr] }), {});
const componentsResponse = Promise.resolve({ ...componentsMap });
const workspace = {
  components: () => componentsResponse,
  registerService: () => {},
};

// @ts-ignore
bootstrap(workspace, {}).then(({ reference }) => (window.rendererService = reference));
