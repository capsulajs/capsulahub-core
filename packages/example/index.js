import('http://localhost:3000/components/Grid.js')
  .then((data) => {
    console.log('data', data);

    return data.default({}, { nodeId: 'root' });
  })
  .then((WebComponent) => {
    customElements.define('web-grid', WebComponent);
    const webComponent = new WebComponent();
    document.getElementById('root').appendChild(webComponent);
    // typeof webComponent.setProps === 'function' && webComponent.setProps();
  })
  .catch((error) => console.log('error', error));
