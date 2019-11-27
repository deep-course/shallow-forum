// module.exports = {
//   webpack: config => {
//     // Fixes npm packages that depend on `fs` module
//     config.node = {
//       fs: 'empty'
//     }
//     return config
//   }
// }
/* eslint-disable */
const withLess = require('@zeit/next-less');
const withCss = require('@zeit/next-css');
const lessToJS = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');

// Where your antd-custom.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './assets/theme.less'), 'utf8')
)

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = file => {}
}
// fix: prevents error when .css files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.css'] = file => {}
}

module.exports = withCss(withLess({
  webpack: config => {
    config.node = {
      fs: 'empty'
    }
    if (config.module.rules[2].use.length > 1) {
      config.module.rules[2].use[4].options = {
        javascriptEnabled: true,
        modifyVars: themeVariables, // make your antd custom effective
      }
      config.module.rules[2].use[5] = {
        loader: 'sass-resources-loader',
        options: {
          resources: [
            path.resolve(__dirname, './assets/global.less'),
          ]
        }
      }
    }
    return config
  }
  // lessLoaderOptions: {
  //   javascriptEnabled: true,
  //   modifyVars: themeVariables, // make your antd custom effective
  //   resources: [
  //     path.resolve(__dirname, './assets/global.less'),
  //   ]
  // }
}));
