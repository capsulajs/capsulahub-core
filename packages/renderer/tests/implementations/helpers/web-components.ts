const template = document.createElement('template');

template.innerHTML = `
  <div id="item-a"></div>
  <div id="item-b"></div>
  <div id="item-c"></div>
`;

export class LayoutA extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('layout-a', LayoutA);
