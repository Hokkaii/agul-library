---
toc: content
---

# Wrapper

## 基本使用

```jsx
import { Wrapper } from "agul-ui";
import { Button } from "antd";

export default () => {
  const routes = [
    { path: "/", name: "首页" },
    { path: "/components/wrapper1", name: "容器" },
  ];
  return (
    <Wrapper
      className="demo-wrapper"
      style={{ padding: 0 }}
      navigation={{
        prefix: "$$$",
        routes,
      }}
    >
      content
    </Wrapper>
  );
};
```

## API

##### Wrapper

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
  </tr>
  <tr>
    <td>children</td>
    <td>子节点</td>
    <td>ReactNode</td>
    <td>-</td>
  </tr>
  <tr>
    <td>style</td>
    <td>容器元素样式</td>
    <td>CSSProperties</td>
    <td>-</td>
  </tr>
  <tr>
    <td>className</td>
    <td>容器元素额外类名</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>navigation</td>
    <td>面包屑配置</td>
    <td><a href="/components/navigation1#navigation-1">NavigationProps</a></td>
    <td>-</td>
  </tr>
</table>
