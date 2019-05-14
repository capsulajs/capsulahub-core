import Component from './Component';
import ComponentsMap from './ComponentsMap';

export default interface Renderer {
  randomPrefix: string;

  renderLayouts(componentsMap: ComponentsMap): void;
  renderItems(componentsMap: ComponentsMap): void;
  renderItem(nodeId: string, component: Component): void;
}
