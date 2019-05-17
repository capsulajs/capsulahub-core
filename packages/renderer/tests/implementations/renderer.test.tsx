import React from 'react';
import { mount } from 'enzyme';
import { RendererService } from '../../src';
import { components } from './helpers/mocks';

console.log(new RendererService());

class Page extends React.Component {
  render() {
    return <div id="LayoutA">Loading...</div>;
  }
}

const mock = jest.fn();
global.CAPSULAHUB_WORKSPACE = {
  components: mock,
};

mock.mockResolvedValueOnce(components);

test('Calling renderLayouts renders the layouts from configuration', () => {
  const component = mount(<Page />);

  console.log(component);

  component.unmount();
});
