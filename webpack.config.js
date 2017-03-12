const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({size: 15});
const ExtractTextPlugin = require("extract-text-webpack-plugin");//css样式提取插件
const TransferWebpackPlugin = require('transfer-webpack-plugin'); // 引入插件管理
const HtmlWebpackPlugin = require('html-webpack-plugin');//生成一个html文件
const NyanProgressPlugin = require('nyan-progress-webpack-plugin'); //进度条

var buildPath = path.resolve(__dirname, 'build'); // 打包之后文件存放的目录
var SRC_PATH = path.resolve(__dirname, 'src');
var nodeModulesPath = path.resolve(__dirname, 'node_modules'); // node 的包存放的目录

module.exports  = {
    context: __dirname,
    entry: {
        main: "./src/main.js"
    },
    output: {
          path: buildPath,
          filename: "js/[name].js",
          chunkFilename: "js/[name].chunk.js"
    },
    module: {
        rules : [
            {
                  test: /\.js$/,
                  include: [
                    path.resolve(__dirname, "src")
                  ],
                  exclude: [
                    path.resolve(__dirname, "node_modules")
                  ],
                  loaders: ['happypack/loader?id=js']
            },
            {
                  test: /\.vue$/,
                  use:[
                      {
                          loader: 'vue-loader'
                      }
                  ]
            },
            {
                  test: /\.html$/,
                  use:[
                      {
                          loader: 'vue-html-loader'
                      }
                  ]
            },
            {
                  test:/\.css$/, //文件名测试正则表达式
                  use: [
                      { 
                          loader: "style-loader"
                      },
                      {
                           loader: "css-loader"
                      },
                      {
                          loader:'postcss-loader',
                          options:{
                              plugins:() => {
                                  return [
                                      require('precss'),
                                      require('autoprefixer')
                                  ]
                              }
                          }
                      }
                  ]
            },
            {
                test: /\.scss$/,
                    use: [
                            {
                                loader: "style-loader" // creates style nodes from JS strings 
                            }, 
                            {
                                loader: "css-loader" // translates CSS into CommonJS 
                            }, 
                            {
                                loader: "sass-loader" // compiles Sass to CSS 
                            }
                    ]
            },
            {
                  test:/\.(png|jpg|gif|eot|woff|woff2|ttf|svg)(\?.*)?$/,
                  use:[
                      {
                          loader:'url-loader', 
                          options:{
                              limit:10000,
                              name:'[name].[ext]?[hash]'
                          }
                      }
                  ]
            }
        ]
    },
    resolve: {
          modules: [
                "node_modules",
                path.resolve(__dirname, "src")
          ],
          extensions: [".js", ".json", ".jsx", ".css",".vue"],
          alias: {
                vue: 'vue/dist/vue.js',
                vueRouter: 'vue-router/dist/vue-router.js'
          } 
    },
    externals: {
          jquery: 'window.$'
    },
    devServer: {
            // contentBase: 'src', // 服务器的相对根目录
            port: 3000,
            host: 'localhost',
            inline: true
    },
    devtool: 'eval',
    plugins:[
          new HappyPack({
              id: 'js',
              threadPool: happyThreadPool,
              loaders: ['babel-loader?cacheDirectory=true']
          }),
          // 默认加载的包声明
          new webpack.ProvidePlugin({
              _: 'lodash'
          }),
          //加载jQuery
          new webpack.ProvidePlugin({
              $: 'jquery'
          }),
          new ExtractTextPlugin("css/[name].css"), //单独使用style标签加载css并设置其路径
          // new NyanProgressPlugin(), // 进度条
          // new TransferWebpackPlugin([
          //     {from: 'img', to: 'img'},
          //     {from: 'fonts', to: 'fonts'},
          //     {from: 'css', to: 'css'}
          // ], path.join(__dirname, 'src')),

          new HtmlWebpackPlugin({
              filename:"index.html",
              template:"index.html",
              inject:"body",
              title:"webpack  demo",
              minify:{
                removeComments:true,//删除注释
                collapseWhitespace:true//删除空格
              },
              chunks:['main'],
              hash: true  //为静态资源生成hash值

          })
    ]
}


if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ])
}
