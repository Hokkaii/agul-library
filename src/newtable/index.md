---
toc: content
---

# NewTable

## 基本使用

示例使用模拟接口进行数据请求简单的展示效果。

```jsx
import { NewTable } from "agul-ui";
import { Select } from "antd";
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
      male: "男性",
      female: "女性",
    },
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];
export default () => (
  <NewTable
    url="https://randomuser.me/api?pagination[total]=200&results=10&pageSize=8&pageNumber=1"
    columns={columns}
    path="results"
  />
);
```

## 枚举映射

使用`columns`中的`enums`字段规定好映射关系，显示既定的数据，可以与`tagType`一起使用。

```jsx
import { NewTable } from "agul-ui";

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
      male: "男性",
      female: "女性",
    },
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];
export default () => (
  <NewTable
    url="https://randomuser.me/api?pagination[total]=200&results=10&pageSize=8&pageNumber=1"
    columns={columns}
    path="results"
  />
);
```

## Tag 显示

使用`columns`中的`tagType`字段规定`tag`类型与行数据字段的对应关系，以`tag`形式显示数据，可以与`enums`一起使用。

```jsx
import { NewTable } from "agul-ui";

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
    tagType: {
      male: "success",
      female: "error",
    },
  },
  {
    title: "Gender",
    dataIndex: "gender",
    tagType: {
      male: "default",
      female: "process",
    },
  },
  {
    title: "Gender",
    dataIndex: "gender",
    tagType: {
      male: "default",
      female: "process",
    },
    enums: {
      male: "男性",
      female: "女性",
    },
  },
];
export default () => (
  <NewTable
    url="https://randomuser.me/api?pagination[total]=200&results=10&pageSize=8&pageNumber=1"
    columns={columns}
    path="results"
  />
);
```

## 操作栏配置

示例使用模拟接口进行数据请求简单的展示效果。

### 增删改查

```jsx
import { NewTable } from "agul-ui";
import { Divider } from "antd";
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
      male: "男性",
      female: "女性",
    },
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];

const schema = {
  type: "object",
  properties: {
    phone: {
      title: "Phone",
      type: "string",
      required: true,
    },
    gender: {
      title: "Gender",
      type: "string",
      enum: ["male", "female"],
      enumNames: ["male", "female"],
    },
  },
  displayType: "row",
};
const operate = {
  buttons: [
    { type: "add", text: "新增", schema },
    { type: "edit", text: "编辑", schema },
    {
      type: "detail",
      text: "详情",
      routerPath: "/components/global-config",
      field: "phone",
    },
    { type: "delete", text: "删除", field: "id.value", url: "/delete" },
  ],
};
export default () => (
  <NewTable
    url="https://randomuser.me/api?pagination[total]=200&results=10&pageSize=8&pageNumber=1"
    columns={columns}
    path="results"
    operate={operate}
  />
);
```

### 下载操作 & 自定义按钮

下载按钮的实际效果会有偏差，以控制台的传参和请求方式为准。
如果已有的按钮类型不能满足业务需求，可以使用一个`React`组件作为自定义按钮，组件可以从`props`中取到`row(行数据)`、`reload(重置页码刷新表格)` 和 `update(当前页码刷新表格)`以及 `checkedData(行选择数据)`。

```jsx
import { NewTable } from "agul-ui";
import { Divider } from "antd";
import _ from "lodash";
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
      male: "男性",
      female: "女性",
    },
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];

const schema = {
  type: "object",
  properties: {
    phone: {
      title: "Phone",
      type: "string",
      required: true,
    },
    gender: {
      title: "Gender",
      type: "string",
      enum: ["male", "female"],
      enumNames: ["male", "female"],
    },
  },
  displayType: "row",
};
const CustomBtn = (props) => {
  const callback = () => {
    console.log(props);
    window.open(_.get(props, "row.picture.large"));
  };
  return <a onClick={callback}>查看头像</a>;
};
const operate = {
  buttons: [
    {
      type: "download",
      text: "get 下载",
      url:
        "https://github.com/sensorsdata/sa-sdk-javascript/archive/refs/tags/v1.25.2.zip?id=${id}",
      field: "id.value",
      url: "/delete",
    },
    {
      type: "download",
      text: "post 下载",
      headers: { a: 1 },
      method: "post",
      url:
        "https://github.com/sensorsdata/sa-sdk-javascript/archive/refs/tags/v1.25.2.zip",
      field: "phone",
      url: "/delete",
    },
    {
      type: "custom",
      widget: CustomBtn,
    },
  ],
};
export default () => (
  <NewTable
    url="https://randomuser.me/api?pagination[total]=200&results=10&pageSize=8&pageNumber=1"
    path="results"
    columns={columns}
    operate={operate}
  />
);
```

## 排序

这里的排序指的是后端排序。

#### 多字段排序

配置`columns`的`sorter.multuple`自动开启多字段排序，具体参数见控制台。

```jsx
import { NewTable } from "agul-ui";
import { Button } from "antd";

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
      male: "男性",
      female: "女性",
    },
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];

export default () => (
  <NewTable
    url="https://randomuser.me/api?pagination[total]=200&results=10&pageSize=8&pageNumber=1"
    path="results"
    columns={columns}
  />
);
```

#### 单字段排序

配置`columns`的`sorter.multuple`自动开启多字段排序，具体请求参数见控制台。

```jsx
import { NewTable } from "agul-ui";
import { Button } from "antd";

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
      male: "男性",
      female: "女性",
    },
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];

export default () => (
  <NewTable
    url="https://randomuser.me/api?pagination[total]=200&results=10&pageSize=8&pageNumber=1"
    path="results"
    columns={columns}
  />
);
```

## 自定义筛选

这里的筛选指的是后端筛选。

配置`columns`的`otherFilters`自动开启列筛选功能，具体请求参数见控制台。
`注意`： `type`为 `checkbox`时，会以数组形式传递参数，具体效果见`post`请求时的请求参数，而例中使用接口为 `get`请求。

```jsx
import { NewTable } from "agul-ui";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    otherFilters: {
      type: "input",
    },
  },
  {
    title: "Gender",
    dataIndex: "gender",
    otherFilters: {
      type: "checkbox",
      field: "custom",
      treeData: [
        { label: "A", value: "a" },
        { label: "B", value: "b" },
        { label: "C", value: "c" },
      ],
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    otherFilters: {
      type: "select",
      treeData: [
        { label: "A", value: "a" },
        { label: "B", value: "b" },
        { label: "C", value: "c" },
      ],
    },
  },
  {
    title: "Nat",
    dataIndex: "nat",
    otherFilters: {
      type: "dateRange",
      field: ["start", "end"],
    },
  },
];

export default () => (
  <NewTable
    url="https://randomuser.me/api?pagination[total]=200&results=10&pageSize=8&pageNumber=1"
    path="results"
    columns={columns}
  />
);
```

## 行选择

配置 `rowSelect` 项开启行选择，通过 `ref` 引用获取已选数据，控制台查看打印数据。

```jsx
import { NewTable } from "agul-ui";
import { Button } from "antd";
import { useRef } from "react";

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
      male: "男性",
      female: "女性",
    },
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];
export default () => {
  const ref = useRef(null);
  const show = () => {
    console.log(ref?.current?.checkedData);
  };
  return (
    <>
      <NewTable
        url="https://randomuser.me/api?pagination[total]=200&results=10&pageSize=8&pageNumber=1"
        path="results"
        columns={columns}
        rowSelect
        ref={ref}
      />
      <Button onClick={() => show()}>click me show the selected data</Button>
    </>
  );
};
```

## 首栏添加序号

添加`needOrder`属性为表格自动添加编号。

```jsx
import { NewTable } from "agul-ui";
import { Button } from "antd";

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
      male: "男性",
      female: "女性",
    },
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];

export default () => (
  <NewTable
    url="https://randomuser.me/api?pagination[total]=200&results=10&pageSize=8&pageNumber=1"
    path="results"
    columns={columns}
    needOrder
  />
);
```

## 配置列

添加`colConfig`为表格添加`动态配置列`功能。

```jsx
import { NewTable } from "agul-ui";
import { Button } from "antd";
import { useRef } from "react";

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
      male: "男性",
      female: "女性",
    },
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];
const colConfig = [
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
      male: "男性",
      female: "女性",
    },
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];
export default () => {
  const boxRef = useRef(null);
  return (
    <div>
      <div id="colConfigBox" ref={boxRef}></div>
      <NewTable
        url="https://randomuser.me/api?pagination[total]=200&results=10&pageSize=8&pageNumber=1"
        path="results"
        columns={columns}
        colConfig={colConfig}
        colConfigBox={boxRef.current}
      />
    </div>
  );
};
```

## 导出

添加`colConfig`为表格添加`动态配置列`功能。

```jsx
import { NewTable } from "agul-ui";
import { Button } from "antd";
import { useRef } from "react";

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
      male: "男性",
      female: "女性",
    },
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];
export default () => {
  const boxRef = useRef(null);
  const exportBtn = {
    url: "/*abc*",
  };
  return (
    <div>
      <div id="colConfigBox" ref={boxRef}></div>
      <NewTable
        url="https://randomuser.me/api?pagination[total]=200&results=10&pageSize=8&pageNumber=1"
        path="results"
        columns={columns}
        exportBox={boxRef.current}
        exportBtn={exportBtn}
      />
    </div>
  );
};
```

## API

### NewTable

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
  </tr>
  <tr>
    <td>url</td>
    <td>必填，资源接口地址</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>path</td>
    <td>资源在接口出参中的路径</td>
    <td>string</td>
    <td>'data'</td>
  </tr>
  <tr>
    <td>pagePath</td>
    <td>分页数据在接口出参中的路径</td>
    <td>string</td>
    <td>'pageable'</td>
  </tr>
  <tr>
    <td>method</td>
    <td>请求方式</td>
    <td>'get' | 'post'</td>
    <td>'get'</td>
  </tr>
  <tr>
    <td>params</td>
    <td>额外的请求的参数</td>
    <td>Record&lt;string, any&gt; | undefined</td>
    <td>-</td>
  </tr>
   <tr>
    <td><div style="white-space:nowrap;">extraPagination</div></td>
    <td>额外的分页器配置项，参考 <a href="https://4x.ant.design/components/table-cn/#pagination">antd分页器</a></td>
    <td>object | undefined</td>
    <td>
      <div style="white-space:nowrap;">
      {</br>
        &nbsp;showSizeChanger: true, </br>
        &nbsp;showQuickJumper: true, </br>
        &nbsp;position: ['bottomRight'], </br>
        &nbsp;showTotal: (total)=>`共${total}条`, </br>
        &nbsp;pageSize: 8, </br>
        &nbsp;locale: {jump_to:'前往'},</br>
        &nbsp;pageSizeOptions: [8,16,40,80]</br>
      }
      </div>
    </td>
  </tr>
  <tr>
    <td>columns</td>
    <td>表格列的配置描述</td>
    <td>ColumnsType[]</td>
    <td>-</td>
  </tr>
   <tr>
    <td>operate</td>
    <td>操作栏配置，添加操作列</td>
    <td>OperateProps</td>
    <td>-</td>
  </tr>
  <tr>
    <td>rowSelect</td>
    <td>是否开启行选择</td>
    <td>boolean</td>
    <td>false</td>
  </tr>
  <tr>
    <td>colConfig</td>
    <td>允许对列表列进行配置，值类型同 columns，额外添加 disabled 字段用于控制配置列按钮是否可用</td>
    <td><div style="white-space:nowrap;">ColumnsType[]</div></td>
    <td>-</td>
  </tr>
  <tr>
    <td><div style="white-space:nowrap;">colConfigBox</div></td>
    <td>若 colConfig 存在，则为配置列功能按钮选定一个父容器，可以是父容器的 dom 对象也可以是父容器的 id，不填则绝对定位放置至表格右上方</td>
    <td>string | HTMLElement</td>
    <td>-</td>
  </tr>
  <tr>
    <td>needOrder</td>
    <td>首栏是否添加序号</td>
    <td>boolean</td>
    <td>false</td>
  </tr>
  <tr>
    <td>childTable</td>
    <td>子表格配置</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>height</td>
    <td>表格高度，超出 scrol</td>
    <td>number</td>
    <td>-</td>
  </tr>
  <tr>
    <td>rowKey</td>
    <td>同antd-rowKey，表格行 key 的取值，可以是字符串或一个函数</td>
    <td><div style="white-space:nowrap;">string | function(record): string</div></td>
    <td>'id'</td>
  </tr>
  <tr>
    <td>ref</td>
    <td>组件引用，可以调用 reset(重置页码刷新) 和 update(当前页码刷新) 两个方法刷新表格，也可以通过 checkedData 拿到行选择数据</td>
    <td>useRef</td>
    <td>-</td>
  </tr>
  <tr>
    <td>exportBtn</td>
    <td>导出按钮</td>
    <td>ExportBtnProps</td>
    <td>-</td>
  </tr>
  </tr>
  <tr>
    <td>exportBox</td>
    <td>若 exportBtn 项存在，则为配置列功能按钮选定一个父容器，可以是父容器的 dom 对象也可以是父容器的 id，不填则绝对定位放置至表格右上方</td>
    <td>string</td>
    <td>-</td>
  </tr>

</table>

### ExportBtnProps

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
  </tr>
  <tr>
    <td>text</td>
    <td>导出按钮文案</td>
    <td>ReactNode</td>
    <td>'导出'</td>
  </tr>
  <tr>
    <td>url</td>
    <td>导出的接口地址</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>params</td>
    <td>导出时额外的请求的参数</td>
    <td>object</td>
    <td>-</td>
  </tr>
  <tr>
    <td>method</td>
    <td>导出时的请求方式</td>
    <td>'get'|'post'</td>
    <td>'get'</td>
  </tr>
  <tr>
    <td>headers</td>
    <td>导出时额外的请求头</td>
    <td>object</td>
    <td>-</td>
  </tr>
   <tr>
    <td>filename</td>
    <td>文件名，从响应头中取不到文件名时会使用该字段作为文件名</td>
    <td>string</td>
    <td>-</td>
  </tr>
  
</table>

### OperateProps

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
  </tr>
  <tr>
    <td>mode</td>
    <td>以文字/icon形式显示按钮</td>
    <td>'icon' | 'text'</td>
    <td>'text'</td>
  </tr>
  <tr>
    <td>conditionStyle</td>
    <td>条件判断不显示该按钮时,缺省样式,为'gap'则不显示该按钮,为'all'则缺省按钮以'-'形式展示</td>
    <td>'gap' | 'all'</td>
    <td>'gap'</td>
  </tr>
  <tr>
    <td>buttons</td>
    <td>按钮组</td>
    <td>(AddButtonProps | EditButtonProps | ShowButtonProps | DeleteButtonProps | DownloadButtonProps | CustomButtonProps)[]</td>
    <td>'gap'</td>
  </tr>
</table>

#### AddButtonProps

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
  </tr>
  <tr>
    <td>type</td>
    <td>新增按钮类型值</td>
    <td>"add"</td>
    <td>"add"</td>
  </tr>
  <tr>
    <td>text</td>
    <td>按钮文案</td>
   <td>ReactNode</td>
    <td>"新增"</td>
  </tr>
  <tr>
    <td>field</td>
    <td>传递字段值(通常是id)</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>routerPath</td>
    <td>跳转路由,field 会与 row[field](row 指行数据)组成键值对，这个键值对作为路由参数传递,routerPath存在时则除type,text,field外其它字段无意义</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>url</td>
    <td>模态窗打开窗口进行新增提交的接口地址,若url中存在'{xxx}'字符串,那么'{xxx}'会被替换为row[field](row 指行数据)取到的值</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>method</td>
    <td>模态窗打开窗口进行新增提交的方式,若url中不存在'{xxx}'字符串,那么field与row[field]组成的键值对会被注入新增操作的至请求体body中</td>
    <td>"put" | "post"</td>
    <td>-</td>
  </tr>
  <tr>
    <td>reset</td>
    <td>新增操作请求成功回调后是否重置页码刷新(否则按当前页码刷新)</td>
    <td>boolean</td>
    <td>false</td>
  </tr>
  <tr>
    <td>width</td>
    <td>模态窗content宽度</td>
    <td>string | number</td>
    <td>"40vw"</td>
  </tr>
  <tr>
    <td>height</td>
    <td>模态窗高度</td>
    <td>string | number</td>
    <td>"45vh"</td>
  </tr>
  <tr>
    <td>schema</td>
    <td>schema表示对表单的描述</td>
    <td><a href="/components/newform#newform-1">schema</a></td>
    <td>-</td>
  </tr>
  <tr>   
    <td>widgets</td>
    <td>自定义组件，当模态窗表单的内置组件无法满足时使用</td>
    <td><a href="/components/newform#newform-1">widgets</a></td>
    <td>-</td>
  </tr>
  <tr>   
    <td>condition</td>
    <td>函数表达式,决定当前按钮是否展示,row表示当前行的值,例子:"row.status===1",表示当当前行的id为1则展示,不配置该项则常显</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>   
    <td>props</td>
    <td>透传给a标签(OperateProps.mode==='text')或Icon(OperateProps.mode==='icon')的额外属性值</td>
    <td>Record&lt;string, any&gt;</td>
    <td>-</td>
  </tr>
 </table>

#### EditButtonProps

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
  </tr>
  <tr>
    <td>type</td>
    <td>编辑按钮类型值</td>
    <td>"edit"</td>
    <td>"edit"</td>
  </tr>
  <tr>
    <td>text</td>
    <td>按钮文案</td>
   <td>ReactNode</td>
    <td>"编辑"</td>
  </tr>
  <tr>
    <td>field</td>
    <td>传递字段值(通常是id)</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>routerPath</td>
    <td>跳转路由,field 会与 row[field](row 指行数据)组成键值对，这个键值对作为路由参数传递,routerPath存在时则除type,text,field外其它字段无意义</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>url</td>
    <td>模态窗打开窗口进行编辑提交的接口地址,若url中存在'{xxx}'字符串,那么'{xxx}'会被替换为row[field](row 指行数据)取到的值</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>method</td>
     <td>模态窗打开窗口进行编辑提交的方式,若url中不存在'{xxx}'字符串,那么field与row[field]组成的键值对会被注入至编辑操作的请求体body中</td>
    <td>"put" | "post"</td>
    <td>-</td>
  </tr>
  <tr>
    <td>detailUrl</td>
    <td>模态窗打开窗口进行编辑的详情接口地址,若detailUrl中存在'{xxx}'字符串,那么'{xxx}'会被替换为row[field](row 指行数据)取到的值</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>detailPath</td>
    <td>详情在详情接口出参中的路径</td>
    <td>string</td>
    <td>"data"</td>
  </tr>
  <tr>
    <td>detailMethod</td>
    <td>详情接口的请求方式,若detailUrl中不存在'{xxx}'字符串且detailMethod为'post',那么field与row[field]组成的键值对会被注入至请求详情的请求体body中</td>
    <td>"get" | "post"</td>
    <td>"get"</td>
  </tr>
  <tr>
    <td>reset</td>
    <td>编辑操作请求成功回调后是否重置页码刷新(否则按当前页码刷新)</td>
    <td>boolean</td>
    <td>false</td>
  </tr>
  <tr>
    <td>width</td>
    <td>模态窗content宽度</td>
    <td>string | number</td>
    <td>"40vw"</td>
  </tr>
  <tr>
    <td>height</td>
    <td>模态窗高度</td>
    <td>string | number</td>
    <td>"45vh"</td>
  </tr>
  <tr>
    <td>schema</td>
    <td>schema表示对表单的描述</td>
    <td><a href="/components/newform#newform-1">schema</a></td>
    <td>-</td>
  </tr>
  <tr>   
    <td>widgets</td>
    <td>自定义组件，当模态窗表单的内置组件无法满足时使用</td>
    <td><a href="/components/newform#newform-1">widgets</a></td>
    <td>-</td>
  </tr>
  <tr>   
    <td>condition</td>
    <td>函数表达式,决定当前按钮是否展示,row表示当前行的值,例子:"row.status===1",表示当当前行的id为1则展示,不配置该项则常显</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>   
    <td>props</td>
    <td>透传给a标签(OperateProps.mode==='text')或Icon(OperateProps.mode==='icon')的额外属性值</td>
    <td>Record&lt;string, any&gt;</td>
    <td>-</td>
  </tr>
 </table>

#### ShowButtonProps

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
  </tr>
  <tr>
    <td>type</td>
    <td>详情按钮类型值</td>
    <td>"detail"</td>
    <td>"detail"</td>
  </tr>
  <tr>
    <td>text</td>
    <td>按钮文案</td>
   <td>ReactNode</td>
    <td>"详情"</td>
  </tr>
  <tr>
    <td>field</td>
    <td>传递字段值(通常是id)</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>routerPath</td>
    <td>跳转路由,field 会与 row[field](row 指行数据)组成键值对，这个键值对作为路由参数传递,routerPath存在时则除type,text,field外其它字段无意义</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>url</td>
    <td>模态窗打开窗口查看详情的接口地址,若url中存在'{xxx}'字符串,那么'{xxx}'会被替换为row[field](row 指行数据)取到的值</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>method</td>
    <td>模态窗打开窗口查看详情的请求方式,若url中不存在'{xxx}'字符串且method为'post',那么field与row[field]组成的键值对会被注入至请求详情的请求体body中</td>
    <td>"get" | "post"</td>
    <td>"get"</td>
  </tr>
  <tr>
    <td>path</td>
    <td>详情在接口中出参的路径</td>
    <td>boolean</td>
    <td>false</td>
  </tr>
  <tr>
    <td>width</td>
    <td>模态窗content宽度</td>
    <td>string | number</td>
    <td>"40vw"</td>
  </tr>
  <tr>
    <td>height</td>
    <td>模态窗高度</td>
    <td>string | number</td>
    <td>"45vh"</td>
  </tr>
  <tr>
    <td>detailConfig</td>
    <td>详情配置</td>
    <td><a href="/components/detail1#api">DetailProps</a></td>
    <td>-</td>
  </tr>
  <tr>   
    <td>condition</td>
    <td>函数表达式,决定当前按钮是否展示,row表示当前行的值,例子:"row.status===1",表示当当前行的id为1则展示,不配置该项则常显</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>   
    <td>props</td>
    <td>透传给a标签(OperateProps.mode==='text')或Icon(OperateProps.mode==='icon')的额外属性值</td>
    <td>Record&lt;string, any&gt;</td>
    <td>-</td>
  </tr>
 </table>

#### DeleteButtonProps

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
  </tr>
  <tr>
    <td>type</td>
    <td>删除按钮类型值</td>
    <td>"delete"</td>
    <td>"delete"</td>
  </tr>
  <tr>
    <td>text</td>
    <td>按钮文案</td>
    <td>ReactNode</td>
    <td>"删除"</td>
  </tr>
  <tr>
    <td>msg</td>
    <td>确认框的文言</td>
    <td>ReactNode</td>
    <td>"确定要"+text+"该项吗？"</td>
  </tr>
  <tr>
    <td>field</td>
    <td>传递字段值(通常是id)</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>url</td>
    <td>删除操作的请求的接口地址,若url中存在'{xxx}'字符串,那么'{xxx}'会被替换为row[field](row 指行数据)取到的值</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>method</td>
    <td>模态窗打开窗口进行删除提交的方式,若url中不存在'{xxx}'字符串且method为'post'或'put',那么field与row[field]组成的键值对会被注入至删除请求的请求体body中</td>
    <td>"get" | "post" | "delete" | "put"</td>
    <td>"delete"</td>
  </tr>
  <tr>
    <td>reset</td>
    <td>删除操作请求成功回调后是否重置页码刷新(否则按当前页码刷新)</td>
    <td>boolean</td>
    <td>false</td>
  </tr>
  <tr>   
    <td>condition</td>
    <td>函数表达式,决定当前按钮是否展示,row表示当前行的值,例子:"row.status===1",表示当当前行的id为1则展示,不配置该项则常显</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>   
    <td>props</td>
    <td>透传给a标签(OperateProps.mode==='text')或Icon(OperateProps.mode==='icon')的额外属性值</td>
    <td>Record&lt;string, any&gt;</td>
    <td>-</td>
  </tr>
 </table>

#### DownloadButtonProps

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
  </tr>
  <tr>
    <td>type</td>
    <td>下载按钮类型值</td>
    <td>"download"</td>
    <td>"download"</td>
  </tr>
  <tr>
    <td>text</td>
    <td>按钮文案</td>
    <td>ReactNode</td>
    <td>"下载"</td>
  </tr>
  <tr>
    <td>field</td>
    <td>传递字段值(通常是id)</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>url</td>
    <td>下载地址,若url中存在'{xxx}'字符串,那么'{xxx}'会被替换为row[field](row 指行数据)取到的值;若url项不存在,则以取row[field]作为下载地址;若以上两项均不存在则不允许下载</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>method</td>
    <td>模态窗打开窗口进行下载提交的方式,若url中不存在'{xxx}'字符串且method为'post',那么field与row[field]组成的键值对会被注入至下载请求的请求体body中</td>
    <td>"get" | "post"</td>
    <td>-</td>
  </tr>
  <tr>
    <td>headers</td>
    <td>额外的请求头</td>
    <td>Record&lt;string, any&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td>filename</td>
    <td>文件名,会先从响应头中取,取不到会使用该值</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>   
    <td>condition</td>
    <td>函数表达式,决定当前按钮是否展示,row表示当前行的值,例子:"row.status===1",表示当当前行的id为1则展示,不配置该项则常显</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>   
    <td>props</td>
    <td>透传给a标签(OperateProps.mode==='text')或Icon(OperateProps.mode==='icon')的额外属性值</td>
    <td>Record&lt;string, any&gt;</td>
    <td>-</td>
  </tr>
 </table>

#### CustomButtonProps

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
  </tr>
  <tr>
    <td>type</td>
    <td>自定义按钮类型值</td>
    <td>"custom"</td>
    <td>"custom"</td>
  </tr>
   <tr>
    <td>widget</td>
    <td>自定义组件的组件函数或组件类,组件props会被注入row(行数据),checkedData(开启行选择后选中的数据),reset(重置页码刷新)和update(当前页码刷新)几个属性</td>
    <td>ComponentType&lt;any&gt; | ReactNode</td>
    <td>-</td>
  </tr>
   <tr>   
    <td>condition</td>
    <td>函数表达式,决定当前按钮是否展示,row表示当前行的值,例子:"row.status===1",表示当当前行的id为1则展示,不配置该项则常显</td>
    <td>string</td>
    <td>-</td>
  </tr>
 </table>
