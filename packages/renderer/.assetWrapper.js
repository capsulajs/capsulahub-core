const path = require('path');

const CWD = process.cwd();
const PACKAGE = require(path.join(CWD, 'package.json'));

const varRequire = async ({ name, bundler }) => {
  if (name.split('.').pop() === 'js' && bundler.options.production) {
    return {
      header: `var require = window.require = false; var publicExports={}; var API = {}; (function(){"use strict";var parcelRequire=undefined;`,
      footer: `})();export API; export default publicExports;`,
    };
  }
};

module.exports = varRequire;
