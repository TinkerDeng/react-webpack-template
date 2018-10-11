const webpack = require("webpack");
const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin"); //删除之前的打包文件
const HappyPack = require("happypack"); //多进程，让webpack把任务分配给子进程去并发的执行
const os = require("os");
const HtmlWebPackPlugin = require("html-webpack-plugin");//打包html
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//单独打包css
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const ModuleConcatenationPlugin = require("webpack/lib/optimize/ModuleConcatenationPlugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const QiniuPlugin = require("qn-webpack");
const manifest = require("./dll/manifest.json");
const bundleConfig = require("./bundle-config.json");
const PublicPath = "";
const config = {
    output: {
        filename: "js/[name].[hash:7].js",
        publicPath: PublicPath
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: [{
                loader: "babel-loader"
            },
                {
                    loader: "happypack/loader?id=happybabel"
                }]
        },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: {
                    loader: "html-loader",
                    options: {
                        minimize: true
                    }
                }
            },
            {
                test: /\.(css|scss|less)$/,
                use: [{
                    loader: "style-loader"
                },
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader"
                    }]
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 500,
                        publicPath: PublicPath + "/image",//文件引入路径
                        outputPath: "image",//打包文件路径
                        name: "[name].[ext]"
                    }
                }]
            }, {
                test: /\.(woff|woff2|eot|ttr|otf|ttf|svg)/,
                use: ["url-loader"]
            }]
    },
    optimization: {
        //优化，代码拆分，分离公共文件和业务文件
        minimize: true,
        splitChunks: {
            chunks: "all",//Webpack 4 只会对按需加载的代码做分割,如果我们需要配置初始加载的代码也加入到代码分割中，可以设置 splitChunks.chunks 为 'all'
            cacheGroups: {
                //  提取node_modules中代码
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all", //显示块的范围，initial(初始块)、async(按需加载块)、all(全部块)
                    priority: 10,
                    enforce: true
                },
                commons: {
                    // async 设置提取异步代码中的公用代码
                    chunks: "all",
                    name: "common",// 拆分出来的块的名字
                    priority: 10,
                    minSize: 0,// 表示压缩前的最小模块的大侠，默认1
                    minChunks: 2,// 表示被引用次数，至少为两个 chunks 的公用代码
                    maxAsyncRequests: 1,// 最大的按需异步加载次数，默认为1
                    maxInitialRequests: 1// 最大的初始化加载次数
                    /*  cacheGroups: {
                     priority: 1,//缓存的优先级
                     test: '', //缓存组的规则，表示符合条件的放入当前缓存组，值可以是function，boolean，string，regext，默认为null
                     reuseExistingChunk:"",//表示已经使用
                     }, // 缓存组 参数chunks，minSize，minChunks，maxAsyncRequests，maxInitialRequests，name, */
                }
                /*styles: {
                 name: "styles",
                 test: /.(scss|css)$/,
                 chunks: "all",
                 minChunks: 1,
                 reuseExistingChunk: true,
                 enforce: true
                 }*/
            }
        }
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
        new CleanWebpackPlugin(["dist"]), // 打包前先清除dist文件
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
            outputPath: "dll",
            publicPath: PublicPath + "dll",
            filepath: require.resolve("./dll/" + bundleConfig.vendors.js),
            includeSourcemap: false
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].[hash:7].css",
            chunkFilename: "[id].[hash].css"
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require("cssnano"),
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true
        })
    ]
};
module.exports = config;
