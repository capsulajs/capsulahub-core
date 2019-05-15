import { registerComponent } from './utils';
import { LayoutA } from './web-components';

//document.getElementById(name)!.appendChild(webComponent);

export const components = {
  LayoutA: registerComponent({
    nodeId: 'LayoutA',
    type: 'layout',
    name: 'layout-a',
    module: LayoutA,
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
