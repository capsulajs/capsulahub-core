import { Component, ComponentType } from '@capsulajs/capsulahub-core-workspace/lib/api/methods/components';
import { Renderer, RenderItemRequest } from './api';

export default class RendererService implements Renderer {
  async renderLayouts() {
    const layouts = await this.components('layout');

    layouts.forEach((layout: Component) => {
      const node = document.getElementById(layout.nodeId);

      if (node) {
        console.log('INSERT');

        node.appendChild(layout.reference);
      }
    });
  }

  renderItems() {
    return Promise.resolve();
  }

  renderItem(renderItemRequest: RenderItemRequest) {
    if (!renderItemRequest.nodeId) {
      return Promise.reject(new Error('Invalid node Id'));
    }

    return Promise.resolve();
  }

  private async components(type: ComponentType) {
    const componentsMap = await CAPSULAHUB_WORKSPACE.components({});
    const components = await Promise.all(Object.keys(componentsMap).map((key) => componentsMap[key]));
    return components.filter((component: Component) => component.type === type);
  }
}
