import { Component, ComponentType } from '@capsulajs/capsulahub-core-workspace/lib/api/methods/components';
import { Renderer, RenderItemRequest } from './api';

export default class RendererService implements Renderer {
  async renderLayouts() {
    (await this.components('layout')).forEach((component: Component) => {
      const node = document.getElementById(component.nodeId);

      if (node) {
        node.appendChild(component.reference);
      }
    });
  }

  async renderItems() {
    (await this.components('item')).forEach((component: Component) => {
      const node = document.getElementById(component.nodeId);

      if (node) {
        node.appendChild(component.reference);
      }
    });
  }

  async renderItem(renderItemRequest: RenderItemRequest) {
    if (!renderItemRequest.nodeId) {
      return Promise.reject(new Error('Invalid node Id'));
    }

    const components = await this.components();
    const component = components.find((component: Component) => component.nodeId === renderItemRequest.nodeId);

    if (component) {
      const node = document.getElementById(component.nodeId);

      if (node) {
        node.innerHTML = component.reference;
      }
    }
  }

  private async components(type?: ComponentType) {
    const componentsMap = await CAPSULAHUB_WORKSPACE.components({});
    const components = await Promise.all(Object.keys(componentsMap).map((key) => componentsMap[key]));
    return type ? components.filter((component: Component) => component.type === type) : components;
  }
}
