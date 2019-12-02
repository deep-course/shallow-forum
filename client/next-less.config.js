const cssLoaderConfig = require('@zeit/next-css/css-loader-config')
const path = require('path')
module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
        )
      }
      const { dev, isServer } = options
      const {
        cssModules,
        cssLoaderOptions,
        postcssLoaderOptions,
        lessLoaderOptions = {}
      } = nextConfig
      options.defaultLoaders.less = cssLoaderConfig(config, {
        extensions: ['less'],
        cssModules,
        cssLoaderOptions,
        postcssLoaderOptions,
        dev,
        isServer,
        loaders: [
          {
            loader: 'less-loader',
            options: lessLoaderOptions
          }
        ]
      })
      config.module.rules.push({
        test: /\.less$/,
        exclude: [/node_modules/, /assets/, /components/],
        use: options.defaultLoaders.less
      })
    
      // 我们禁用了antd的cssModules
      config.module.rules.push({
        test: /\.less$/,
        include: [/node_modules/, /assets/, /components/],
        use: cssLoaderConfig(config, {
          extensions: ['less'],
          cssModules:false,
          cssLoaderOptions:{},
          dev,
          isServer,
          loaders: [
            {
              loader: 'less-loader',
              options: lessLoaderOptions
            }
          ],
        })
      })
      config.module.rules[config.module.rules.length - 1].use.push({
        loader: 'sass-resources-loader',
        options: {
          resources: [
            path.resolve(__dirname, './assets/global.less'),
          ]
        }
      })
      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }
      return config
    }
  })

}