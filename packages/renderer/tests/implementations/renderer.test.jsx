import React from 'react';
import { mount } from 'enzyme';
import { layouts, items } from './helpers/mocks';

class Page extends React.Component {
  render() {
    return <div id="LayoutA">Loading...</div>;
  }
}

const mock = jest.fn();
CAPSULAHUB_WORKSPACE.components = mock;
mock.mockResolvedValueOnce({ layouts, items });

test('Calling renderLayouts renders the layouts from configuration', () => {
  const component = mount(<Page />);

  console.log(component);

  component.unmount();
});
