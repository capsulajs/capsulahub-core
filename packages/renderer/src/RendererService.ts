import { Component, ComponentType } from '@capsulajs/capsulahub-core-workspace/lib/api/methods/components';
import { Renderer, RenderItemRequest } from './api';
import {
  noLayoutsAvailable,
  noItemsAvailable,
  callRenderLayoutsBefore,
  invalidNodeId,
  notFoundNodeId,
} from './helpers/const';

export default class RendererService implements Renderer {
  private renderedLayouts: boolean = false;

  async renderLayouts() {
    const components = await this.components('layout');
    if (!components.length) {
      return Promise.reject(new Error(noLayoutsAvailable));
    }

    components.forEach((component: Component) => {
      const node = document.getElementById(component.nodeId);

      if (node) {
        node.appendChild(component.reference);
      }
    });
  }

  async renderItems() {
    if (!this.renderedLayouts) {
      return Promise.reject(new Error(callRenderLayoutsBefore));
    }

    const components = await this.components('item');
    if (!components.length) {
      return Promise.reject(new Error(noItemsAvailable));
    }

    components.forEach((component: Component) => {
      const node = document.getElementById(component.nodeId);
      if (!node) {
        return Promise.reject(new Error(notFoundNodeId));
      }

      node.appendChild(component.reference);
    });
  }

  async renderItem(renderItemRequest: RenderItemRequest) {
    if (!this.renderedLayouts) {
      return Promise.reject(new Error(callRenderLayoutsBefore));
    }

    if (typeof renderItemRequest.nodeId !== 'string') {
      return Promise.reject(new Error(invalidNodeId));
    }

    const components = await this.components();
    const component = components.find((component: Component) => component.nodeId === renderItemRequest.nodeId);

    if (component) {
      const node = document.getElementById(component.nodeId);
      if (!node) {
        return Promise.reject(new Error(notFoundNodeId));
      }

      node.innerHTML = component.reference;
    }
  }

  private async components(type?: ComponentType) {
    const componentsMap = await CAPSULAHUB_WORKSPACE.components({});
    const components = await Promise.all(Object.keys(componentsMap).map((key) => componentsMap[key]));
    return type ? components.filter((component: Component) => component.type === type) : components;
  }
}
