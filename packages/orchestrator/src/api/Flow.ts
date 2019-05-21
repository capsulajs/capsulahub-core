export interface Flow {
  name: string;
  id: string;
  execute: () => Promise<void>;
}
