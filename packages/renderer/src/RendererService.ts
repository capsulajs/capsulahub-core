import { Renderer, RenderItemRequest } from './api';
import { Global } from './index';

const globalNode: Global = {
  ...global,
};

export default class RendererService implements Renderer {
  async renderLayouts() {
    const components = await globalNode.CAPSULAHUB_WORKSPACE.components({});

    console.log(components);

    return Promise.resolve();
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
}
