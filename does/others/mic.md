---
toc: content
---

## 选型

项目中目前仅使用 [qiankun](https://qiankun.umijs.org/zh) 微前端框架，react 项目多使用 [umi](https://v3.umijs.org/zh-CN)，在 umi 中注册使用 qiankun 更方便，具体见 [@umijs/plugin-qiankun](https://v3.umijs.org/zh-CN/plugins/plugin-qiankun)。

## 配置方式

由于基本的配置方式和流程在上述的相关文档中已经比较完整，但是具体到相关项目中还是有一些细节需要说明，这里以 umi 为前端框架为例子、介绍一个唯一 id 为 equipment-ms 的微前端子应用注册到主应用的配置流程。

### 子应用在父应用中的注册

主应用在`config/config.ts`或 `.umirc.ts`文件中进行注册：

```
export default {
  qiankun: {
    master: {
      // 注册子应用信息
      apps: [
        {
          name: 'equipment-ms', // 唯一 id
          entry: 子应用本地服务地址, // 开发环境
          entry: 主应用域名 + 'equipment-ms', // 正式环境，添加equipment-ms是为了在nginx中匹配转发
        },
      ],
    },
  },
};
```

子应用在`config/config.ts`或 `.umirc.ts`文件中进行注册：

```
export default {
  qiankun: {
    slave: {},
  },
};
```

### 子应用 webpack 相关配置

子应用在`config/config.ts`或 `.umirc.ts`文件中进行注册：

```
export default {
  // 指定子应用的资源的基础路径
  publicPath:'/equipment-ms/',
  chainWebpack: function (config, { webpack, env, createCSSRule }) {
    if (env === "production") {
      // 关闭代码拆分，防止子应用资源加载失败
      config
        .plugin("limitChunkCountPlugin")
        .use(webpack.optimize.LimitChunkCountPlugin, [{ maxChunks: 1 }]);
    }
  },
};
```

### nginx 配置

[Nginx 修饰符 location 详解](https://www.cnblogs.com/yxhblogs/p/12906046.html)
[Nginx 配置中 alias 和 root 区别](https://developer.aliyun.com/article/603563)
主应用：

```
// ...

// 转发对于子应用的静态资源请求到子应用域名
location ^~ /equipment-ms {
    proxy_pass 子应用域名;  // 可以是集群内域名

    // ...

}

// ...
```

子应用：

```

// ...

// 请求子应用资源跨域处理
add_header Access-Control-Allow-Origin *;
add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';

// 优先匹配子应用静态资源后，不再匹配其他路径
location ^~ /equipment-ms {
    alias 服务器上的前端资源文件夹路径;  // 一般是 /usr/src/app
    try_files $uri $uri/ /index.html;
}

// ...
```

## 全局样式

<b>目的是通过在主应用中修改样式文件，可以同时改变主应用和子应用的样式。</b>

在主应用中使用`less`工具编译样式 less 文件为 css 文件后将该文件塞入打包文件夹中（通常是项目根目录下的 dist 文件夹）。

### 修改打包命令

首先安装 `less`，安装后在 `package.json`的 `scripts` 的打包命令（通常是 build）中加入 less 文件编译命令，这里以 umi 的全局样式文件`gloabl.less`编译为例:

```
"scripts":{
    "build": "umi build && lessc ./src/global.less global.css --js"
}

```

这样在根目录就有一个`global.css`的样式文件，然后要把该 css 文件加入到打包文件夹并删除它，这就需要在根目录下新增一个脚本文件`move-global-css.js`：

```
const fs = require("fs");
fs.readFile("./global.css", "utf8", function (error, data) {
  if (error) {
    console.log(error);
    return;
  }
  fs.writeFile("./dist/global-less.css", data, "utf8", function (error) {
    if (error) {
      console.log(error);
      return;
    }
    console.log('全局样式文件创建成功！')
    fs.unlink('./global.css',function (error) {
      if (error) {
        console.log(error);
        return;
      }
      console.log('临时文件已删除！')
    })
  });
});

```

再次修改打包命令：

```
"scripts":{
    "build": "umi build && lessc ./src/global.less global.css --js && node move-global-css.js"
}

```

这样就成功把全局样式文件加入到了 dist 文件夹中并不产生垃圾文件，给子应用可以消费的样式文件。

### 子应用引用全局样式文件

子应用需要在 html 文件中加入以下内容：

```
<link rel="stylesheet" href="/global-less.css">

```

注意，要保证这个 css 文件是最后被引入的，以保证它可以覆盖其它样式文件。
在 umi 中，需要在 `pages` 文件夹中新建`document.ejs`文件，然后在该文件中加入上述标签内容即可。如果此方法不能保证该样式文件是最后被引入的，可以考虑使用[配置额外的 link 标签](https://v3.umijs.org/zh-CN/config#links)的方式加入标签。
