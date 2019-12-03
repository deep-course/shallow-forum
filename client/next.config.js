const withLessExcludeAntd = require("./next-less.config.js")

if (typeof require !== 'undefined') {
  require.extensions['.less'] = (file) => {}
} 

module.exports = withLessExcludeAntd({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]",
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#426799' }
  }
})