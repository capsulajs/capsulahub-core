export default interface Component {
  componentName: string;
  path: string;
  config: { [key: string]: any };
};
