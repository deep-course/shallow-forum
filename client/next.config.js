const cssLoaderConfig = require('@zeit/next-css/css-loader-config')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')
var loaderUtils = require("loader-utils");
var path = require("path");

/**** 手动配置区 start */


// antd 主题色
const antdThemeColor = '#426799'

// 全局公用less路径
const globalLessPath = [
  path.resolve(__dirname, './assets/global.less')
]

// cssModule文件名正则定义
const cssModuleRegex = /\.module\.less/

// 打包固定buildId
const buildId = 'deephub'


/**** 手动配置区 end   */

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

if (typeof require !== 'undefined') {
  require.extensions['.less'] = (file) => {}
} 

module.exports = {
  // 固定BuildId
  generateBuildId: async () => {
    return buildId
  },

  webpack: (config, options) => {
    if (!options.defaultLoaders) {
      throw new Error(
        'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
      )
    }
    const { dev, isServer } = options
    // cssModule解析
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
            options: {
              javascriptEnabled: true,
              modifyVars: { '@primary-color': antdThemeColor }
            }
          }
        ],
      })
    })

    // 添加全局less样式
    config.module.rules[config.module.rules.length - 1].use.push({
      loader: 'sass-resources-loader',
      options: {
        resources: [
          ...globalLessPath
        ]
      }
    })

    // antd 按需加载样式报错解决 order between
    config.plugins.push(
      new FilterWarningsPlugin({
        exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
      })
    )
    
    // 解决antd 服务端按需加载引用报错
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
      
    config.resolve.alias = {
      ...config.resolve.alias,
      '@utils': path.join(__dirname, "./utils")
    }

    return config
  }

}
