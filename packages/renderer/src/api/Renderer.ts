import { RenderLayoutsRequest, RenderItemsRequest, RenderItemRequest } from './methods';

export default interface Renderer {
  renderLayouts(renderLayoutsRequest: RenderLayoutsRequest): Promise<void>;
  renderItems(renderItemsRequest: RenderItemsRequest): Promise<void>;
  renderItem(renderItemRequest: RenderItemRequest): Promise<void>;
}
