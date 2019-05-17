import { LayoutA } from './web-components';

export const components = {
  LayoutA: Promise.resolve({
    nodeId: 'LayoutA',
    type: 'layout',
    componentName: 'layout-a',
    reference: LayoutA,
  }),
  // ItemA: {
  //   nodeId: 'ItemA'
  //   type: 'item',
  //   componentName: 'item-a',
  //   path: 'http://cdn.components/ItemA',
  //   config: {},
  // },
  // ItemB: {
  //   type: 'item',
  //   componentName: 'item-b',
  //   path: 'http://cdn.components/ItemB',
  //   config: {},
  // },
  // ItemC: {
  //   type: 'item',
  //   componentName: 'item-c',
  //   path: 'http://cdn.components/ItemC',
  //   config: {},
  // },
};
