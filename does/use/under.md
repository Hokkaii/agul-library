## x-render

这里主要使用 [x-render(1.x)](https://x-render.oschina.io/)下的 [form-render(1.x)](https://xrender.fun/form-render)实现相关的表单组件的封装。

## umi-request

相关组件使用 [umi-request](https://github.com/umijs/umi-request) 进行数据请求。

## antd

大多数组件的底层封装都依赖了[antd](https://4x.ant.design/components/overview-cn/)。

## @uiw/react-codemirror

配置化表单 NewForm)的底层依赖了 [form-xrender](https://xrender.fun/form-render)，[form-xrender](https://xrender.fun/form-render) 允许开发者通过[自定义控件(widget)](https://x-render.oschina.io/form-render/advanced/widget)的方式对表单控件类型进行拓展。NewForm 使用 [@uiw/react-codemirror](https://github.com/uiwjs/react-codemirror) 实现了对`代码编辑器控件`的封装。

## echarts && echarts-for-react

Chart 组件底层依赖于 [echarts-for-react](https://github.com/hustcc/echarts-for-react) 和 [echarts(5.x)](https://echarts.apache.org/zh/index.html)。这里在引入了 [echarts-for-react](https://github.com/hustcc/echarts-for-react)又额外引入[echarts(5.x)](https://echarts.apache.org/zh/index.html)的目的是实现 [echarts 相关的地图业务](https://echarts.apache.org/examples/zh/index.html#chart-type-map)。

## lodash

组件底层大量使用 [lodash](https://www.lodashjs.com/) 进行逻辑操作。

## ahooks

组件底层大量使用 [ahooks](https://ahooks.js.org/zh-CN) 实现相关的 React 逻辑目的。

## react-router-dom

使用了[react-router-dom(6.x)](https://reactrouter.com/en/main)内置的 [useLocation](https://reactrouter.com/en/main/hooks/use-location) 和 [useNavigate](https://reactrouter.com/en/main/hooks/use-navigate) 进行路由操作。

## 注意

这里仅列举几个几个比较重要且有代表性的底层依赖，具体依赖列表见`package.json`文件。另外，组件库通过`dependencies`的方式对相关的包进行依赖，因此在可兼容的情况下，相关的包会安装到宿主项目的依赖中，因此开发者可以直接在宿主项目中使用`agul-ui`的底层依赖包。
关于各类`dependencies`的介绍，见：[「完全理解」各种 dependencies](https://zhuanlan.zhihu.com/p/390218026)。
