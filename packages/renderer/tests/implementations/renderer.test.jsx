import React from 'react';
import { mount } from 'enzyme';

class Page extends React.Component {
  render() {
    return <div id="root">Loading...</div>;
  }
}

test('Calling renderLayouts renders the layouts from configuration', () => {
  const component = mount(<Page />);

  console.log(component);

  component.unmount();
});
