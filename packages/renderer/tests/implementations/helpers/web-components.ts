export class LayoutA extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = `<div id="layout-a">
      <div id="item-a"></div>
      <div id="item-b"></div>
      <div id="item-c"></div>
    </div>`;
  }
}

customElements.define('layout-a', LayoutA);
