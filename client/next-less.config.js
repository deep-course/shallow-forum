const cssLoaderConfig = require('@zeit/next-css/css-loader-config')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')
var loaderUtils = require("loader-utils");
var path = require("path");

// cssModule hash问题解决
function cssLoaderGetLocalIdent(loaderContext, localIdentName, localName, options) {
	if(!options.context) {
		if (loaderContext.rootContext) {
			options.context = loaderContext.rootContext;
		} else if (loaderContext.options && typeof loaderContext.options.context === "string") {
			options.context = loaderContext.options.context;
		} else {
			options.context = loaderContext.context;
		}
	}
	var request = path.relative(options.context, loaderContext.resourcePath);
	options.content = options.hashPrefix + request + "+" + localName;
	localIdentName = localIdentName.replace(/\[local\]/gi, localName);
	var hash = loaderUtils.interpolateName(loaderContext, localIdentName, options);
	return hash.replace(new RegExp("[^a-zA-Z0-9\\-_\u00A0-\uFFFF]", "g"), "-").replace(/^((-?[0-9])|--)/, "_$1");
};

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
      // cssModule解析
      const cssModuleRegex = /\.module\.less/
      config.module.rules.push({
        test: /\.less$/,
        use: cssLoaderConfig(config, {
          extensions: ['less'],
          modules: true,
          cssModules: true,
          cssLoaderOptions:{
            localIdentName: '[path][name]__[local]--[hash:base64:5]',
            getLocalIdent: (loaderContext, _, localName, options) => {
              const fileName = path.basename(loaderContext.resourcePath);
              if (cssModuleRegex.test(fileName)) {
                return cssLoaderGetLocalIdent(
                  loaderContext,
                  _,
                  localName,
                  options
                );
              }
              return localName;
            },
          },
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

      // 添加全局less样式
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

      // antd 按需加载样式报错解决
      config.plugins.push(
        new FilterWarningsPlugin({
          exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
        })
      )

      // 过滤antd build按需引用
      if(config.externals){
        const includes = [/antd/];
        config.externals = config.externals.map(external => {
          if (typeof external !== 'function') return external;
          return (ctx, req, cb) => {
            return includes.find(include =>
              req.startsWith('.')
                ? include.test(path.resolve(ctx, req))
                : include.test(req)
            )
              ? cb()
              : external(ctx, req, cb);
          };
        });
      }
        
      return config
    }
  })

}