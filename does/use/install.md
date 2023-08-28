<!-- ## npm 代理配置

由于`agul-ui`目前是私有库，需要对`npm`进行相关的配置。具体做法是在`.npmrc`文件中加入下配置：

```
@iauto:registry=http://192.168.2.203:4873
noproxy:192.168.2.203
``` -->

## 安装方式

```
npm install agul-ui

```

或

```
yarn add agul-ui

```

由于版本更新比较频繁，建议加入`@latest`字段。

## 安装要求

`react17.x`、`react-dom17.x`
