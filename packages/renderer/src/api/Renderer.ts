import { RenderLayoutsRequest, RenderItemsRequest, RenderItemRequest } from './methods';

/**
 * Renderer is the core service of Capsula Hub, it is responsible for :
 * - Rendering layouts according to the configuration (CONFIG)
 * - Rendering items according to the configuration (CONFIG)
 * - Rendering item according to the nodeId correlative with (CONFIG)
 */
export default interface Renderer {
  renderLayouts(renderLayoutsRequest: RenderLayoutsRequest): Promise<void>;
  renderItems(renderItemsRequest: RenderItemsRequest): Promise<void>;
  /**
   * Rerender item accoarding to the nodeId
   * Reject in case :
   * - Invalid request
   * @param renderItemRequest
   */
  renderItem(renderItemRequest: RenderItemRequest): Promise<void>;
}
