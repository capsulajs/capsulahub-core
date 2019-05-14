export default interface Renderer {
  randomPrefix: string;

  renderLayouts(): void;
  renderItems(): void;
  renderItem(nodeId: string): void;
}
