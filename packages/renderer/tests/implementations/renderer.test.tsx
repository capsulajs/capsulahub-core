import React from 'react';
import { mount } from 'enzyme';
import { RendererService } from '../../src';
import { LayoutA } from './helpers/web-components';

class Page extends React.Component {
  render() {
    return <div id="LayoutA">Loading...</div>;
  }
}

const mock = jest.fn();
// @ts-ignore
global.CAPSULAHUB_WORKSPACE = {
  components: mock,
};

mock.mockResolvedValueOnce({
  LayoutA: Promise.resolve({
    nodeId: 'LayoutA',
    type: 'layout',
    componentName: 'layout-a',
    reference: LayoutA,
  }),
});

test('Calling renderLayouts renders the layouts from configuration', async () => {
  const page = mount(<Page />);
  const renderService = new RendererService();

  console.log(page.html());
  await renderService.renderLayouts();
  console.log(page.html());

  page.unmount();
});
