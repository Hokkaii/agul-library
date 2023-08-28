---
toc: content
---

# ConfigProvider

## 基本使用

由于组件库的一些组件代理了开发者的某些`敏感交互行为`，例如`NewTable`代理了数据请求，而如果开发者希望数据请求时添加请求头，则该组件将不能被正常使用。这就需要提供一个入口用于配置一些全局信息的入口来配置例如请求头等`环境信息`或者其他后续的`全局配置信息`。
`ConfigProvider`使用 `React` 的 [context](https://zh-hans.react.dev/reference/react/createContext) 特性，只需在应用外围包裹一次即可全局生效。

```
import React from "react";
import { ConfigProvider } from "agul-ui";
export function rootContainer(container: any) {
  return React.createElement(
    ConfigProvider,
    {
      reqOptions: {
        credentials: "same-origin",
        prefix:'/api'
      },
      needReqSign: fasle,
      loadingContainerId: "root"
    },
    container
  );
}
```

上述配置为组件库的组件请求行为以及`useNewRequest`添加初始化配置项`credentials`以及`prefix`并配置`needReqSign`为 false 去除签名,同时配置`loadingContainerId`提供了`Loading`方法的默认父容器的元素 id。
需要注意，全局配置参数的优先级低于 hooks 或方法入参。
