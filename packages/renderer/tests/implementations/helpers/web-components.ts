export class LayoutABC extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div id="layout-abc">
      <div id="item-a"></div>
      <div id="item-b"></div>
      <div id="item-c"></div>
    </div>`;
  }
}

export class ItemA extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `Item A`;
  }
}

export class ItemB extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `Item B`;
  }
}

export class ItemC extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `Item C`;
  }
}

customElements.define('layout-a', LayoutABC);
customElements.define('item-a', ItemA);
customElements.define('item-b', ItemB);
customElements.define('item-c', ItemC);
