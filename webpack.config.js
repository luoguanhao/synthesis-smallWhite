const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const resolve = dir => path.join(__dirname, dir);
const CopyPlugin = require('copy-webpack-plugin');

// // 在 plugin 中 添加以下代码
// new copyWebpackPlugin([{
//   from:path.resolve(__dirname+'/static'),// 打包的静态资源目录地址
//   to:'static' // 打包到dist下面的static
// }])
module.exports = {
  mode: "development",
  context: resolve(""),
  node: {
    setImmediate: false,
    process: "mock",
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty"
  },
  entry: {
    app: ["@babel/polyfill", resolve("/src/main.js")]
  },
  
  output: {
    filename: "static/js/[name].[hash:8].js",
    path: resolve("dist")
  },
  resolve: {
    // 扩展名:配置之后引用文件可以省略
    extensions: [" ", ".js", ".jsx", ".vue", ".json", ".css"],
    alias: {
      "@": resolve("src")
    }
  },
  devtool: "eval-source-map",
  devServer: {
    clientLogLevel: "warning",
    historyApiFallback: {
      rewrites: [
        {
          from: /.*/,
          to: path.posix.join(__dirname, "public/index.html")
        }
      ]
    },
    hot: true,
    contentBase: "./dist",
    compress: true,
    host: "localhost",
    port: 9999,
    open: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader"
      },
      {
        test: /\.(css|scss|sass)$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          {
            loader: "sass-loader"
          },
          {
            loader: "postcss-loader"
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 4096,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "static/img/[name].[hash:8].[ext]"
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 4096,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "static/media/[name].[hash:8].[ext]"
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(svg)(\?.*)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "static/fonts/[name].[hash:8].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 4096,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "static/fonts/[name].[hash:8].[ext]"
                }
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./public/index.html",
      inject: true
    }),
    new CopyPlugin([
      {
        from: path.resolve(__dirname + "/static/src"), to: "src"
      },{
        from: path.resolve(__dirname + "/static/res"), to: "res"
      }
    ]),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};
