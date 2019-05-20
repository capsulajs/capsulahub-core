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
        (await this.components('layout')).forEach((component: Component) => {
          try {
            this.renderComponent(component);
          } catch (error) {
            return Promise.reject(error);
          }
        });
      }

      async renderItems() {
        if (!this.renderedLayouts) {
          return Promise.reject(new Error(callRenderLayoutsBefore));
        }

        (await this.components('item')).forEach((component: Component) => {
          try {
            this.renderComponent(component);
          } catch (error) {
            return Promise.reject(error);
          }
        });
      }

      async renderItem(renderItemRequest: RenderItemRequest) {
        if (!this.renderedLayouts) {
          return Promise.reject(new Error(callRenderLayoutsBefore));
        }

        if (typeof renderItemRequest.nodeId !== 'string') {
          return Promise.reject(new Error(invalidNodeId));
        }

        const component = (await this.components()).find(
          (component: Component) => component.nodeId === renderItemRequest.nodeId
        );
        if (!component) {
          return Promise.reject(new Error(notFoundComponent));
        }

        try {
          this.renderComponent(component);
        } catch (error) {
          return Promise.reject(error);
        }
      }

      private renderComponent(component: Component) {
        const node = document.getElementById(component.nodeId);
        if (!node) {
          throw new Error(notFoundNode);
        }
        node.innerHTML = component.reference;
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
