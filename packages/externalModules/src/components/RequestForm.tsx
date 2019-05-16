const bootstrap = () => {
  return new Promise((resolve) => {
    class RequestForm extends HTMLElement {
      constructor() {
        super();
        this.innerHTML = '<div><h1>Hello from request form</h1></div>';
      }

      public connectedCallback() {
        console.log('RequestForm mounted');
      }
    }

    resolve(RequestForm);
  });
};

publicExports = bootstrap;

export default bootstrap;
