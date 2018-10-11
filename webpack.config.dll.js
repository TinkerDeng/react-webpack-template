const webpack = require("webpack");
const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");//删除之前的打包文件
const packageConfig = require("./package");
const AssetsPlugin = require("assets-webpack-plugin");
module.exports = {
    entry: {
        vendors: Object.keys(packageConfig.dependencies)
    },
    output: {
        path: path.resolve(__dirname, "dll/"),
        filename: "dll.[name]_[hash:6].js",
        library: "[name]_[hash:6]"
    },
    optimization: {
        minimize: true
    },
    plugins: [
        new CleanWebpackPlugin(["dll"]),
        new webpack.DllPlugin({
            path: path.resolve(__dirname, "dll/manifest.json"),
            name: "[name]_[hash:6]"//必须和output.library一样
        }),
        new AssetsPlugin({
            filename: "bundle-config.json",
            path: path.resolve(__dirname)
        })
    ]
};
