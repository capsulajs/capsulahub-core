import '@babel/polyfill';
import { Workspace } from '@capsulajs/capsulahub-core-workspace/lib/api/Workspace';
import { Component, ComponentType } from '@capsulajs/capsulahub-core-workspace/lib/api/methods/components';
import RendererConfig from './api/RendererConfig';
import { Renderer, RenderItemRequest } from './api';
import { callRenderLayoutsBefore, invalidNodeId, notFoundComponent, notFoundNode } from './helpers/const';

const bootstrap = (WORKSPACE: Workspace, SERVICE_CONFIG: RendererConfig) => {
  return new Promise(async (resolve) => {
    class RendererService implements Renderer {
      private renderedLayouts: boolean = false;

      async renderLayouts() {
        this.renderedLayouts = true;

        (await this.components('layout')).forEach((component: Component) => {
          this.renderComponent(component);
        });
      }

      async renderItems() {
        if (!this.renderedLayouts) {
          throw new Error(callRenderLayoutsBefore);
        }

        (await this.components('item')).forEach((component: Component) => {
          this.renderComponent(component);
        });
      }

      async renderItem(renderItemRequest: RenderItemRequest) {
        if (!this.renderedLayouts) {
          throw new Error(callRenderLayoutsBefore);
        }

        if (typeof renderItemRequest.nodeId !== 'string') {
          throw new Error(invalidNodeId);
        }

        const component = (await this.components()).find(
          (component: Component) => component.nodeId === renderItemRequest.nodeId
        );
        if (!component) {
          throw new Error(notFoundComponent);
        }

        this.renderComponent(component);
      }

      private renderComponent(component: Component) {
        const node = document.getElementById(component.nodeId);
        if (!node) {
          throw new Error(notFoundNode);
        }
        node.innerHTML = '';
        node.appendChild(component.reference);
      }

      private async components(type?: ComponentType) {
        const componentsMap = await WORKSPACE.components({});
        const components = await Promise.all(Object.keys(componentsMap).map((key) => componentsMap[key]));
        return type ? components.filter((component: Component) => component.type === type) : components;
      }
    }

    const rendererService = new RendererService();
    const registerServiceData = {
      serviceName: SERVICE_CONFIG.serviceName,
      reference: SERVICE_CONFIG.reference,
    };
    await WORKSPACE.registerService(registerServiceData);
    resolve({ ...registerServiceData, reference: rendererService });
  });
};

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  publicExports = bootstrap;
}

export default bootstrap;
