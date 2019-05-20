import React from 'react';
import { mount, ShallowWrapper } from 'enzyme';
import { bootstrap } from '../../src';
// import {
//   callRenderLayoutsBefore,
//   invalidNodeId,
//   notFoundNode,
// } from '../../src/helpers/const';
import { mockWorkspace } from './helpers/utils';
import { LayoutABC } from './helpers/web-components';
// ItemA, ItemB, ItemC

class App extends React.Component {
  render() {
    return <div id="LayoutABC">Loading...</div>;
  }
}

let app: ShallowWrapper;
// @ts-ignore
beforeEach(() => (app = mount(<App />)));
// @ts-ignore
afterEach(() => app && app.unmount());

test('Calling renderLayouts renders the layouts from configuration', async () => {
  const WORKSPACE = mockWorkspace({
    LayoutABC: Promise.resolve({
      nodeId: 'layout-abc',
      type: 'layout',
      componentName: 'layout-abc',
      reference: new LayoutABC(),
    }),
  });
  // @ts-ignore
  const { reference: renderService } = await bootstrap(WORKSPACE, {});
  await renderService.renderLayouts();
  expect(app.find('#item-a').exists()).toBe(true);
  expect(app.find('#item-b').exists()).toBe(true);
  expect(app.find('#item-c').exists()).toBe(true);
});

// test('Calling renderItems renders items from configuration', async () => {
//   mockWorkspaceComponents({
//     LayoutABC: Promise.resolve({
//       nodeId: 'layout-abc',
//       type: 'layout',
//       componentName: 'layout-abc',
//       reference: new LayoutABC(),
//     }),
//     ItemA: Promise.resolve({
//       nodeId: 'item-a',
//       type: 'item',
//       componentName: 'item-a',
//       reference: new ItemA(),
//     }),
//     ItemB: Promise.resolve({
//       nodeId: 'item-b',
//       type: 'item',
//       componentName: 'item-b',
//       reference: new ItemB(),
//     }),
//     ItemC: Promise.resolve({
//       nodeId: 'item-c',
//       type: 'item',
//       componentName: 'item-c',
//       reference: new ItemC(),
//     }),
//   });
//   const renderService = new RendererService();
//   await renderService.renderLayouts();
//   await renderService.renderItems();
//   expect(app.find('#item-a').text()).toBe('Item A');
//   expect(app.find('#item-b').text()).toBe('Item B');
//   expect(app.find('#item-c').text()).toBe('Item C');
// });

// test('Calling renderItems when no items available in configuration is rejected with error', async () => {
//   mockWorkspaceComponents({
//     LayoutABC: Promise.resolve({
//       nodeId: 'layout-abc',
//       type: 'layout',
//       componentName: 'layout-abc',
//       reference: new LayoutABC(),
//     }),
//   });
//   const renderService = new RendererService();
//   await renderService.renderLayouts();
//   return expect(renderService.renderItems()).rejects.toThrow(noItemsAvailable);
// });

// test('Call renderItems when layout is not rendered  is rejected with error', async () => {
//   mockWorkspaceComponents({
//     LayoutABC: Promise.resolve({
//       nodeId: 'layout-abc',
//       type: 'layout',
//       componentName: 'layout-abc',
//       reference: new LayoutABC(),
//     }),
//     ItemA: Promise.resolve({
//       nodeId: 'item-a',
//       type: 'item',
//       componentName: 'item-a',
//       reference: new ItemA(),
//     }),
//     ItemB: Promise.resolve({
//       nodeId: 'item-b',
//       type: 'item',
//       componentName: 'item-b',
//       reference: new ItemB(),
//     }),
//     ItemC: Promise.resolve({
//       nodeId: 'item-c',
//       type: 'item',
//       componentName: 'item-c',
//       reference: new ItemC(),
//     }),
//   });
//   const renderService = new RendererService();
//   return expect(renderService.renderItems()).rejects.toThrow(callRenderLayoutsBefore);
// });

// test('Calling renderItem with nodeId renders the relevant item', async () => {
//   mockWorkspaceComponents({
//     LayoutABC: Promise.resolve({
//       nodeId: 'layout-abc',
//       type: 'layout',
//       componentName: 'layout-abc',
//       reference: new LayoutABC(),
//     }),
//     ItemA: Promise.resolve({
//       nodeId: 'item-a',
//       type: 'item',
//       componentName: 'item-a',
//       reference: new ItemA(),
//     }),
//     ItemB: Promise.resolve({
//       nodeId: 'item-b',
//       type: 'item',
//       componentName: 'item-b',
//       reference: new ItemB(),
//     }),
//     ItemC: Promise.resolve({
//       nodeId: 'item-c',
//       type: 'item',
//       componentName: 'item-c',
//       reference: new ItemC(),
//     }),
//   });
//   const renderService = new RendererService();
//   await renderService.renderLayouts();
//   await renderService.renderItem({ nodeId: 'item-a' });
//   expect(app.find('#item-a').text()).toBe('Item A');
//   expect(app.find('#item-b').text()).toBe('');
//   expect(app.find('#item-c').text()).toBe('');
// });

// test('Call renderItem when layout is not rendered is rejected with error', async () => {
//   mockWorkspaceComponents({
//     LayoutABC: Promise.resolve({
//       nodeId: 'layout-abc',
//       type: 'layout',
//       componentName: 'layout-abc',
//       reference: new LayoutABC(),
//     }),
//     ItemA: Promise.resolve({
//       nodeId: 'item-a',
//       type: 'item',
//       componentName: 'item-a',
//       reference: new ItemA(),
//     }),
//     ItemB: Promise.resolve({
//       nodeId: 'item-b',
//       type: 'item',
//       componentName: 'item-b',
//       reference: new ItemB(),
//     }),
//     ItemC: Promise.resolve({
//       nodeId: 'item-c',
//       type: 'item',
//       componentName: 'item-c',
//       reference: new ItemC(),
//     }),
//   });
//   const renderService = new RendererService();
//   return expect(renderService.renderItem({ nodeId: 'item-a' })).rejects.toThrow(callRenderLayoutsBefore);
// });

// test('Call renderItem with invalid nodeId is rejected with error', async () => {
//   mockWorkspaceComponents({
//     LayoutABC: Promise.resolve({
//       nodeId: 'layout-abc',
//       type: 'layout',
//       componentName: 'layout-abc',
//       reference: new LayoutABC(),
//     }),
//     ItemA: Promise.resolve({
//       nodeId: 'item-a',
//       type: 'item',
//       componentName: 'item-a',
//       reference: new ItemA(),
//     }),
//   });
//   const renderService = new RendererService();

//   [{}, { test: 'test' }, [], ['test'], null, undefined, true, false, 0, -1].forEach((nodeId) => {
//     // @ts-ignore
//     expect(renderService.renderItem({ nodeId })).rejects.toThrow(invalidNodeId);
//   });
// });

// test('Call renderItem with an nodeId which does not exist in configuration is rejected with error', async () => {
//   mockWorkspaceComponents({
//     LayoutABC: Promise.resolve({
//       nodeId: 'layout-abc',
//       type: 'layout',
//       componentName: 'layout-abc',
//       reference: new LayoutABC(),
//     }),
//     ItemA: Promise.resolve({
//       nodeId: 'item-a',
//       type: 'item',
//       componentName: 'item-a',
//       reference: new ItemA(),
//     }),
//   });
//   const renderService = new RendererService();
//   await renderService.renderLayouts();
//   await renderService.renderItems();
//   return expect(renderService.renderItem({ nodeId: 'item-none' })).rejects.toThrow(notFoundNodeId);
// });
