---
toc: content
---

# TableWithForm

## 基本使用

因`表单+表格`类页面常见于项目中，所以将`NewTable`与`NewForm`两个组件组合为`TableWithForm`达到此目的：使用`NewForm`产出的数据变更`NewTable`的`params`属性达到重新请求数据并刷新表格的逻辑目的。

```jsx
import { TableWithForm } from "agul-ui";

const schema = {
  type: "object",
  properties: {
    input1: {
      title: "简单输入框",
      type: "string",
      required: true,
      default: "123",
    },
    select1: {
      title: "单选",
      type: "string",
      enum: ["a", "b", "c"],
      enumNames: ["早", "中", "晚"],
    },
  },
  displayType: "row",
  column: 2,
  labelWidth: 100,
};
const tableSchema = {
  type: "object",
  properties: {
    phone: {
      title: "电话",
      type: "string",
      required: true,
    },
    gender: {
      title: "性别",
      type: "string",
      enum: ["female", "male"],
      enumNames: ["男", "女"],
    },
  },
  displayType: "row",
  column: 1,
  labelWidth: 100,
};
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render(text) {
      return text?.first;
    },
  },
  {
    title: "Gender",
    dataIndex: "gender",
    enums: {
      male: "女",
      female: "男",
    },
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];

const operate = {
  buttons: [
    { type: "add", text: "新增", schema: tableSchema },
    { type: "edit", text: "编辑", schema: tableSchema },
    { type: "delete", text: "删除", field: "id.value", url: "/delete" },
  ],
};
export default () => {
  return (
    <TableWithForm
      schema={schema}
      url="https://randomuser.me/api"
      params={{ "pagination[total]": 200, results: 10 }}
      columns={columns}
      tableOperate={operate}
      path="results"
    />
  );
};
```

## API

### TableWithForm

`TableWithForm`的配置参数基本是`NewTable`的所有参数（NewTable 的`operate`改为[tableOperate](/components/newtable#operateprops)、NewTable 的`ref`改为`tableRef`）加上`NewForm`的`schema`与`widgets`，因此此类参数不再具体展开说明，这里着重介绍`TableWithForm`的一些特有配置参数。

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
  </tr>
  <tr>
    <td>addBtn</td>
    <td>新增按钮，置于表单查询按钮之后，无此项则不显示该按钮</td>
    <td>AddBtnProps</td>
    <td>-</td>
  </tr>
 
   <tr>
    <td>extraBtns</td>
    <td>除查询按钮和新增按钮之外其它的按钮</td>
    <td>ReactNode[]</td>
    <td>-</td>
  </tr>
  
</table>

### AddBtnProps

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th><div style="white-space:nowrap;">默认值</div></th>
  </tr>
  <tr>
    <td><div style="white-space:nowrap;">text</div></td>
    <td>按钮文案</td>
    <td>ReactNode</td>
    <td>"新建"</td>
  </tr>
  <tr>
    <td><div style="white-space:nowrap;">routerPath</div></td>
    <td>跳转至新页面新增，这里指跳转路由path，有此项则url、method、schema、widgets和props等均无效</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>url</td>
    <td>弹窗新增，新增接口地址</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>method</td>
    <td>弹窗新增，新增接口请求方式</td>
    <td>string</td>
    <td>'post'</td>
  </tr>
  <tr>
    <td>schema</td>
    <td>弹窗新增，表单描述</td>
    <td>object</td>
    <td>-</td>
  </tr>
  <tr>
    <td>widgets</td>
    <td>弹窗新增，表单自定义组件</td>
    <td>object</td>
    <td>-</td>
  </tr>
   <tr>
    <td>props</td>
    <td>新增按钮属性，透传给 <a href="https://4x.ant.design/components/button-cn/#API">antd-buttton</a></td>
    <td><div style="white-space:nowrap;">object</div></td>
    <td>-</td>
  </tr>
</table>
