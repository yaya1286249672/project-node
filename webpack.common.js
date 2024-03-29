const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const dev = process.env.NODE_ENV !== "production";
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");

//引入
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");

console.log("process.env.NODE_ENV=======>", process.env.NODE_ENV);
console.log("dev=============================》", dev);
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  entry: {
    app: "./src/index.js"
  },
  resolveLoader: {
    modules: ["node_modules", "./loaders"]
  },
  //关闭 webpack 的性能提示(文件大小超出提示)
  performance: {
    hints: false
  },
  resolve: {
    modules: [path.resolve(__dirname, "node_modules")],
    extensions: [".js", ".css", "vue", ".ts", ".json", ".wasm", ".mjs"], //扩展名文件配置
    mainFiles: ["index"],
    mainFields: ["main"], //由于大多数第三方模块都使用main字段描述入口文件的位置，所以可以设置单独一个main值，减少搜索
    alias: {
      src: resolve("src"),
      plugin: resolve("src/plugin"),
      vue$: "vue/dist/vue.esm.js",
      "@": resolve("src"),
      scss_vars: "@/styles/vars.scss"
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Output Management",
      filename: "index.html",
      inject: "body",
      template: "./index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
    // 告诉 Webpack 使用动态链接库
    new webpack.DllReferencePlugin({
      // 描述动态链接库的文件内容
      manifest: require("./public/dll/vendor.manifest.json")
    }),
    new AddAssetHtmlPlugin([
      {
        // 要添加到编译中的文件的绝对路径由于含有hash值所以引入所有js
        filepath: path.resolve(__dirname, "./public/dll/*.js"),
        outputPath: "dll",
        publicPath: "dll",
        includeSourcemap: false
      }
    ]),
    new VueLoaderPlugin()
  ],
  // output: {
  //     filename: "[name].[chunkhash:8].bundle.js",
  //     path: path.resolve(__dirname, "dist")
  // },
  module: {
    // noParse: [/react\.min\.js$/],
    rules: [
      {
        test: /\.(sa|c)ss$/,
        use: [
          {
            loader: dev ? "style-loader" : MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === "development"
            }
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: [
                require("precss")(), //sass解析
                require("cssnano")(), //相同css合并（例：.a{width:100px},.b{width:100px} => .a,.b{width:100px}）
                // require("autoprefixer")()
                require("postcss-preset-env")
              ],
              sourceMap: true,
              config: {
                path: "postcss.config.js"
              }
            }
          }
        ]
      },
      {
        test: /\.scss$/, // 将 JS 字符串生成为 style 节点
        use: [
          {
            loader: dev ? "style-loader" : MiniCssExtractPlugin.loader,
            options: {
              // publicPath: './dist',
              hmr: process.env.NODE_ENV === "development"
            }
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 2 // 将 CSS 转化成 CommonJS 模块
            }
          },
          {
            loader: "postcss-loader"
            // options: {
            //   plugins: [
            //     //   require("precss")(), //sass解析
            //     //   require("cssnano")(), //相同css合并（例：.a{width:100px},.b{width:100px} => .a,.b{width:100px}）
            //     //    require("autoprefixer")(),
            //     require("postcss-preset-env")
            //   ],
            //   sourceMap: true,
            //   config: {
            //     path: "postcss.config.js"
            //   }
            // }
          },
          {
            loader: "sass-loader" // 将 Sass 编译成 CSS
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            scss: "style-loader!css-loader!sass-loader"
          }
        }
      },
      {
        test: /\.(m?js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        include: path.resolve(__dirname, "src"),
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"], //es6-->es5的预设
            plugins: [
              ["@babel/plugin-proposal-object-rest-spread"],
              ["@babel/plugin-transform-runtime"],
              ["import", { libraryName: "antd-mobile", style: "css" }]
            ]
          }
        }
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            // loader: "url-loader",
            loader: "url-loader",
            options: {
              limit: 81920,
              name: "img/[name].[hash:8].[ext]",
              publicPath: "./"
            }
          }
        ]
      },
      {
        test: /\.(ts|tsx)$/,
        use: ["babel-loader", "awesome-typescript-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "fonts/[name].[hash:7].[ext]"
        }
      }
    ]
  },
  optimization: {}
};
