# react16.4+webpack4项目模板

## 目录

* [babel-loader](#babel-loader)
* [html模块](#html模块)
* [nodemon监听配置文件更改](#nodemon监听配置文件更改)
* [多端同步](#多端同步)
* [设置环境变量](#设置环境变量)
* [happypack多线程打包](#happypack多线程打包)
* [DLL](#DLL)
* [glob读取文件并进行循环操作](#glob读取文件并进行循环操作)

### babel-loader

```git
    npm install --save-dev babel-core           核心库,将ES6转换成ES5代码
    npm install --save-dev babel-loader webpack 转换器，通过babel转换依赖项
    npm install --save-dev babel-preset-env     想要支持的浏览器矩阵
    npm install --save-dev babel-preset-react
```

### html模块

```git
    html-webpack-plugin
    favicons-webpack-plugin能够生成图标
    html-webpack-template
    html-webpack-template-pug
```

### nodemon监听配置文件更改

```git
    nodemon --watch webpack.config.js --exec \"webpack-dev-server --mode development\"
```

### 多端同步

```git
    const BrowserSyncPlugin = require('browser-sync-webpack-plugin');//多端同步
    new BrowserSyncPlugin({
            host: 'localhost',
            port: 5000,
            // server: {            // 独立服务器模式, 这里我使用的代理模式, 注释掉了
            //   baseDir: ['dist']  // 监视的目录, 其中如果文件发生变化, 刷新页面
            // },
            proxy: 'http://localhost:9000/'
        }, {
            name: 'dev',
            reload: false // 不让 BrowerSync 刷新页面, 让 webpack-dev-server 管理页面是否需要刷新.
        })
```

### 设置环境变量

```git
    "scripts": {
        "publish-mac": "export NODE_ENV=prod&&webpack -p --progress --colors",mac
        "publish-win":  "set NODE_ENV=prod&&webpack -p --progress --colors" wind
    }
```

### happypack多线程打包

> 利用node提供的多线程服务，happypack可以实现多线程打包

[网址](<http://taobaofed.org/blog/2016/12/08/happypack-source-code-analysis//>)

### DLL

* 引入方式一：

```git
    const AssetsPlugin = require('assets-webpack-plugin');
    new AssetsPlugin({
        filename: 'bundle-config.json',
        path: path.resolve(__dirname)
    })
    const bundleConfig = require("./bundle-config.json");
    new HtmlWebpackPlugin({vendorJsName: bundleConfig.vendors.js});
    <script src="./static/<%= htmlWebpackPlugin.options.vendorJsName %>"></script>
```

* 引入方式二：

```git
    const AssetsPlugin = require('assets-webpack-plugin');
    new AssetsPlugin({
        filename: 'bundle-config.json',
        path: path.resolve(__dirname)
    })
    new AddAssetHtmlPlugin({
        filepath: require.resolve('./dll/' + bundleConfig.vendors.js),
        includeSourcemap: false
    })
```

* 引入方式三

```git
    new AddAssetHtmlPlugin({
        filepath:require.resolve(glob.sync('./dll/dll.*.js')[0]),
        includeSourcemap: false
    })
```

### glob读取文件并进行循环操作

```javascript
    var glob=require("glob");
    //  同步读取src目录下所有的html文件
    var files=glob.sync("./src/*.html");
    files.forEach(function(item,i){
        //item类似：./src/index.html
        var htmlName=item.slice(item.lastIndexOf("/")+1);
        //最后生成的文件名只需要最后面的名字index.html
        var name=htmlName.split(".")[0];
        //添加到entry入口，并制定生成文件的目录
        entry["page/"+name+"/"+name]='./src/js/'+name+'.js'
        //生成htmlWebpackPlugin实例
        plugins.push(
            new htmlWebpackPlugin({
                template:item,
                filename:htmlName,
                chunks:["page/"+name+"/"+name]
            })
        )
    });
```
