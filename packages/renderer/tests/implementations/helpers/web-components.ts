const template = document.createElement('template');

template.innerHTML = `
  <div id="item-a"></div>
  <div id="item-b"></div>
  <div id="item-c"></div>
`;

export class LayoutA extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

window.customElements.define('layout-a', LayoutA);
