import { RenderLayoutsRequest, RenderItemsRequest } from './methods';

export default interface Renderer {
  renderLayouts(renderLayoutsRequest: RenderLayoutsRequest): void;
  renderItems(renderItemsRequest: RenderItemsRequest): void;
  renderItem(nodeId: string): void;
}
