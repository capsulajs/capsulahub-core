import '@babel/polyfill';
import { Workspace } from '@capsulajs/capsulahub-core-workspace/lib/api/Workspace';
import { Component, ComponentType } from '@capsulajs/capsulahub-core-workspace/lib/api/methods/components';
import RendererConfig from './api/RendererConfig';
import { Renderer, RenderItemRequest } from './api';
// @ts-ignore
import { callRenderLayoutsBefore, invalidNodeId, notFoundComponent, notFoundNode } from './helpers/const';

const bootstrap = (WORKSPACE: Workspace, CONFIG: RendererConfig) => {
  return new Promise(async (resolve) => {
    class RendererService implements Renderer {
      private renderedLayouts: boolean = false;

      public async renderLayouts() {
        this.renderedLayouts = true;

        (await this.components('layout')).forEach((component: Component) => {
          this.renderComponent(component);
        });
      }

      public async renderItems() {
        if (!this.renderedLayouts) {
          throw new Error(callRenderLayoutsBefore);
        }

        (await this.components('item')).forEach((component: Component) => {
          this.renderComponent(component);
        });
      }

      public async renderItem(renderItemRequest: RenderItemRequest) {
        if (typeof renderItemRequest.nodeId !== 'string') {
          throw new Error(invalidNodeId);
        }

        const component = (await this.components()).find((c: Component) => c.nodeId === renderItemRequest.nodeId);
        if (!component) {
          throw new Error(notFoundComponent);
        }

        this.renderComponent(component);
      }

      private renderComponent(component: Component) {
        const node = document && document.getElementById(component.nodeId);
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

    await WORKSPACE.registerService({
      serviceName: CONFIG.serviceName,
      reference: rendererService,
    });

    if (process.env.NODE_ENV !== 'test') {
      await rendererService.renderLayouts();
      await rendererService.renderItems();
    }

    resolve();
  });
};

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  publicExports = bootstrap;
}

export default bootstrap;
