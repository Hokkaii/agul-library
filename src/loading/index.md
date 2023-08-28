---
toc: content
---

# Loading

## 基本使用

```jsx
import { Loading } from "agul-ui";
import { Button } from "antd";

export default () => {
  const showLoading = () => {
    Loading.show("iauto-dumi-loading-box");
    setTimeout(() => {
      Loading.hide();
    }, 2000);
  };
  const showLoadingBody = () => {
    Loading.show();
    setTimeout(() => {
      Loading.hide();
    }, 2000);
  };
  return (
    <div id="iauto-dumi-loading-box">
      <Button onClick={showLoading}>show loading in box</Button>
      <br />
      <br />
      <Button onClick={showLoadingBody}>show loading in body</Button>
    </div>
  );
};
```

## API

### Loading

<table>
  <tr>
    <th><div style="white-space:nowrap;">对象属性</div></th>
    <th>说明</th>
    <th>参数类型</th>
  </tr>
  <tr>
    <td><div style="white-space:nowrap;">show</div></td>
    <td>显示loading</td>
    <td>LoadingParameter</td>
  </tr>
  <tr>
    <td>hide</td>
    <td>消除loading</td>
    <td>-</td>
  </tr>
</table>

### LoadingParameter

`show`方法的`入参类型`有三种情况：

- `string`：参数为则会以这个参数为 `id 选择器`的参数去匹配元素作为`loading`的父容器。
- `HTMLElement`： 参数是一个`dom`元素则会以这个`dom`作为`loading`的父容器。
- `undefined`： 无参数则会以`document.body`作为`loading`的父元素。
