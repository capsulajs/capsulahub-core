import { bootstrap } from '../../src';
import Renderer from '../../src/api/Renderer';
// @ts-ignore
import { callRenderLayoutsBefore, invalidNodeId, notFoundComponent, notFoundNode } from '../../src/helpers/const';

// @ts-ignore
const workspace = {
  components: () => Promise.resolve({}),
  registerService: () => {},
};

let renderService: Renderer;

beforeEach(async () => {
  // @ts-ignore
  const { reference } = await bootstrap(workspace, {});
  renderService = reference;
});

test('Call renderItems when layout is not rendered  is rejected with error', () => {
  expect(renderService.renderItems({})).rejects.toEqual(new Error(callRenderLayoutsBefore));
});

test('Call renderItem when layout is not rendered is rejected with error', () => {
  expect(renderService.renderItem({ nodeId: 'item-a' })).rejects.toEqual(new Error(callRenderLayoutsBefore));
});

test('Call renderItem with invalid nodeId is rejected with error', () => {
  // @ts-ignore
  [{}, { test: 'test' }, [], ['test'], null, undefined, true, false, 0, -1].forEach((nodeId) => {
    // @ts-ignore
    expect(renderService.renderItem({ nodeId })).rejects.toEqual(new Error(invalidNodeId));
  });
});

test('Call renderItem with an nodeId which does not exist in configuration is rejected with error', async () => {
  await renderService.renderLayouts({});
  expect(renderService.renderItem({ nodeId: 'not-found' })).rejects.toThrow(notFoundComponent);
});

test('Call renderItem with an nodeId which does not exist in configuration is rejected with error', async () => {
  // @ts-ignore
  const customWorkspace = {
    components: () =>
      Promise.resolve({
        ItemA: Promise.resolve({
          nodeId: 'item-a',
          type: 'item',
          componentName: 'item-a',
          reference: null,
        }),
      }),
    registerService: () => {},
  };
  // @ts-ignore
  const { reference } = await bootstrap(customWorkspace, {});
  renderService = reference;
  await renderService.renderLayouts({});
  expect(renderService.renderItem({ nodeId: 'item-a' })).rejects.toThrow(notFoundNode);
});
