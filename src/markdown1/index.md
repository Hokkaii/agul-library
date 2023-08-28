---
toc: content
---

# MarkdownEditor

注意，此组件始终为`受控组件`。

## 基本使用

```jsx
import { MarkdownEditor } from "agul-ui";
import { useState } from "react";

export default () => {
  const [data, setData] = useState("");
  return <MarkdownEditor value={data} onChange={setData} />;
};
```

## API

### MarkdownEditor

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th><div style="white-space:nowrap;">默认值</div></th>
  </tr>
  <tr>
    <td>value</td>
    <td>文本值</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
   <td>onChange</td>
    <td>文本值变化的回调函数</td>
    <td>(data:string)=>void</td>
    <td>-</td>
  </tr>
   <tr>
   <td>height</td>
    <td>容器高度</td>
    <td>string</td>
    <td>-</td>
  </tr>
</table>

### LoadingParameter

`show`方法的`入参类型`有三种情况：

- `string`：参数为则会以这个参数为 `id 选择器`的参数去匹配元素作为`loading`的父容器。
- `HTMLElement`： 参数是一个`dom`元素则会以这个`dom`作为`loading`的父容器。
- `undefined`： 无参数则会以`document.body`作为`loading`的父元素。
