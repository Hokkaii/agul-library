---
toc: content
---

# Message

## 基本使用

```jsx
import { Message } from "agul-ui";
import { Button } from "antd";

export default () => (
  <div>
    <Button
      onClick={() => {
        Message.success({
          title: "主标题",
          subTitle:
            "副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题",
        });
      }}
    >
      click me show success message
    </Button>
    <br />
    <br />
    <Button
      onClick={() => {
        Message.error({
          title:
            "主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题",
          subTitle: "副标题",
        });
      }}
    >
      click me show error message
    </Button>
  </div>
);
```

## API

### Message

<table>
  <tr>
    <th><div style="white-space:nowrap;">对象方法</div></th>
    <th>说明</th>
    <th>参数类型</th>
  </tr>
  <tr>
    <td><div style="white-space:nowrap;">success</div></td>
    <td>成功提示</td>
    <td>MsgProps</td>
  </tr>
  <tr>
    <td>error</td>
    <td>错误提示</td>
    <td>MsgProps</td>
  </tr>
</table>

### MsgProps

<table>
  <tr>
    <th><div style="white-space:nowrap;">属性</div></th>
    <th>说明</th>
    <th>类型</th>
  </tr>
  <tr>
    <td>title</td>
    <td>主标题</td>
    <td>ReactNode</td>
  </tr>
  <tr>
    <td>subTitle</td>
    <td>副标题</td>
    <td>ReactNode | undefined</td>
  </tr>
  <tr>
    <td>duration</td>
    <td>显示时间(s)，默认1</td>
    <td>number | undefined</td>
  </tr>
</table>
