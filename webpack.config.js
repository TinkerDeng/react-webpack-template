const webpack = require("webpack");
const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin"); //删除之前的打包文件
const HappyPack = require("happypack"); //多进程，让webpack把任务分配给子进程去并发的执行
const os = require("os");
const ErrorOverlayPlugin = require("error-overlay-webpack-plugin"); //更好的错误提醒
const HtmlWebPackPlugin = require("html-webpack-plugin");//打包html
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//单独打包css
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin"); //优化webpack输出信息
const ModuleConcatenationPlugin = require("webpack/lib/optimize/ModuleConcatenationPlugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const manifest = require("./dll/manifest.json");
const bundleConfig = require("./bundle-config.json");
const PORT = 8001;
const host = "http://10.0.118.16:9390";
const config = {
    devtool: "inline-source-map", //明确指示错误的地址,利于debug
    devServer: {
        overlay: {
            warnings: true,
            errors: true
        }, //在页面上全屏输出警告和错误的覆盖
        compress: false, //一切服务器都使用gzip压缩
        progress: false, //显示webpack构建进度
        historyApiFallback: true, //启用html5 history route
        disableHostCheck: true,
        port: PORT,
        hot: true,
        open: false,//自动打开浏览器
        inline: true,
        host: "0.0.0.0",
        proxy: {
            "/app/*": {
                target: host,
                secure: false,
                changeOrigin: true
            },
            "/api/*": {
                target: host,
                secure: false,
                changeOrigin: true
            },
            "/loan/*": {
                target: host,
                secure: false,
                changeOrigin: true
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader"
                    }, {
                        loader: "happypack/loader?id=happybabel"
                    }
                ]
            }, {
                test: /\.html$/,
                exclude: /node_modules/,
                use: {
                    loader: "html-loader",
                    options: {
                        minimize: true
                    }
                }
            }, {
                test: /\.(css|scss|less)$/,
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }
                ]
            }, {
                test: /\.(png|jpg|svg|gif)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 500,
                            //publicPath: 'dfc',//文件引入路径
                            //outputPath: "asdasd",//打包文件路径
                            name: "[path]/[hash].[name].[ext]"
                        }
                    }
                ]
            }, {
                test: /\.(woff|woff2|eot|ttr|otf|ttf|svg)/,
                use: ["url-loader"]
            }
        ]
    },
    resolve: {
        extensions: ["*", ".js", ".jsx", ".css", ".scss", ".sass", ".less"],
        modules: [path.join(__dirname, "src"), "node_modules"],
        alias: {
            src: path.resolve(__dirname, "src"),
            css: path.resolve(__dirname, "src/asserts/css"),
            com: path.resolve(__dirname, "src/components")
        }
    },
    plugins: [
        new CleanWebpackPlugin(["dist"]),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new ModuleConcatenationPlugin(), //作用于提升
        new webpack.DllReferencePlugin({
            context: path.resolve(__dirname),
            manifest: manifest
        }),
        new HappyPack({
            id: "happybabel",
            loaders: ["babel-loader"],
            threadPool: happyThreadPool
        }),
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        }),
        new AddAssetHtmlPlugin({
            filepath: require.resolve("./dll/" + bundleConfig.vendors.js),
            includeSourcemap: false
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].[hash:7].css",
            chunkFilename: "[id].[hash].css"
        }),
        new ErrorOverlayPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new FriendlyErrorsPlugin()
    ]
};
module.exports = config;
