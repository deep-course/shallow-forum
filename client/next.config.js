// const withLess = require('@zeit/next-less');
// const withCss = require('@zeit/next-css');
// const path = require('path');
// const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')
// const _ = require('lodash')

// // fix: prevents error when .less files are required by node
// if (typeof require !== 'undefined') {
//   require.extensions['.less'] = file => {}
// }
// // fix: prevents error when .css files are required by node
// if (typeof require !== 'undefined') {
//   require.extensions['.css'] = file => {}
// }

// module.exports = {
//   generateBuildId: async () => {
//     // For example get the latest git commit hash here
//     return 'deephub'
//   },
//   ...withCss(withLess({
//     webpack: config => {
//       config.node = {
//         fs: 'empty'
//       }

//       // less-load 开启javascriptEnabled 并定义antd主题色
//       config.module.rules[2].use.push({
//         loader: 'less-loader',
//         options: {
//           javascriptEnabled: true,
//           modifyVars: { '@primary-color': '#426799' }, 
//         }
//       })

//       // 添加全局less样式  scss也可以
//       config.module.rules[2].use.push({
//         loader: 'sass-resources-loader',
//         options: {
//           resources: [
//             path.resolve(__dirname, './assets/global.less'),
//           ]
//         }
//       })

//       config.module.rules[2].exclude = [/zhujin/]

//       const cloneRulesTwo = _.cloneDeep(config.module.rules[2].use)

//       config.module.rules.push({
//         test: /\.less$/,
//         use: [ ...cloneRulesTwo ],
//         include: /zhujin/
//       })
      
//       config.module.rules[3].use = [
//         ...config.module.rules[3].use.map(v => {
//           if (v.loader && v.loader === 'css-loader') {
//             v = {
//               loader: 'css-loader',
//               options: {
//                 modules: true,
//                 minimize: false,
//                 sourceMap: true,
//                 importLoaders: 1,
//                 localIdentName: '[local]___[hash:base64:5]',
//               } 
//             }
//           }
//           return v
//         })
//       ]

//       // antd 按需加载样式报错解决
//       config.plugins.push(
//         new FilterWarningsPlugin({
//           exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
//         })
//       )

//       // 解决antd 按需加载loader问题解决
//       if(config.externals){
//         const includes = [/antd/];
//         config.externals = config.externals.map(external => {
//           if (typeof external !== 'function') return external;
//           return (ctx, req, cb) => {
//             return includes.find(include =>
//               req.startsWith('.')
//                 ? include.test(path.resolve(ctx, req))
//                 : include.test(req)
//             )
//               ? cb()
//               : external(ctx, req, cb);
//           };
//         });
//       }

//       return config
//     }
//   }))
// }

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