const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");
module.exports = merge(common, {
    output: {
        filename: "js/[name].bundle.js",
        chunkFilename: 'js/[name].js',
        path: path.resolve(__dirname, "dist")
    },
    mode: "development",
    devtool: "cheap-module-eval-source-map", //original source (lines only)
    devServer: {
        contentBase: "./dist",
        hot: true,
        port: 5000,
        open: true,
        host: '127.0.0.1',
        proxy: {
            "/api": {
                target: "http://127.0.0.1:3030",
                changeOrigin: true,
                // pathRewrite: {                
                //     '^/api': ''
                // }
            }
        }
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
});