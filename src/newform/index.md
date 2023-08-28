---
toc: content
---

# NewForm

## 基本使用

通过`schema`来描述表单的基本信息、结构和校验， `NewForm`底层基于`XRender`的`FormRender`，具体`schema`的配置见[schema 规范](https://x-render.oschina.io/form-render/schema/schema/)。

```jsx
import { NewForm } from "agul-ui";

const schema = {
  type: "object",
  properties: {
    input1: {
      title: "简单输入框",
      type: "string",
      required: true,
    },
    select1: {
      title: "单选",
      type: "string",
      enum: ["a", "b", "c"],
      enumNames: ["早", "中", "晚"],
    },
  },
  displayType: "row",
};
export default () => {
  const onSubmit = (data, errors) => {
    if (!errors || !errors.length) {
      console.log(data);
    }
  };
  return <NewForm schema={schema} onSubmit={onSubmit} />;
};
```

## XRender-FormRender 基础上新增功能

基于`XRender-FormRender`的[自定义组件](https://x-render.oschina.io/form-render/advanced/widget)功能，`NewForm`在`XRender-FormRender`已有功能基础上进行了拓展，以便更简易对更多常用表单控件进行配置。

## 文件上传

配置`schema`的字段`widget`为`CustomUpload`，可以实现对`文件上传`控件的配置。注意，`form-render`存在自带的`upload`内置控件，但是只支持自动上传，这里新增的`CustomUpload`可以把`file`文件对象注入到`formData`中，实现手动上传。

```jsx
import { NewForm } from "agul-ui";
// https://xrender.fun/form-render/advanced-validate#%E4%B8%80%E5%86%85%E7%BD%AE%E6%A0%A1%E9%AA%8C
// 已有widget则type不需要，format是对type的转化处理方式
const schema = {
  type: "object",
  properties: {
    file: {
      title: "文件上传",
      type: "string",
      widget: "CustomUpload",
    },
  },
  displayType: "row",
};
export default () => {
  const onSubmit = (data) => {
    console.log("submit", data);
  };
  return <NewForm schema={schema} onSubmit={onSubmit} />;
};
```

## 代码编辑器

配置`schema`的字段`widget`为`CodeEditor`，可以实现对`代码编辑器`控件的配置。
支持关键词联想，通过`completions`配置，具体参数见代码中的 `Completion`或 [Example: Autocompletion](https://codemirror.net/examples/autocompletion/)

```jsx
import { NewForm } from "agul-ui";
import { Completion } from "@codemirror/autocomplete";
const completions: Array<Completion> = [
  { label: "match", type: "keyword" },
  { label: "hello", type: "variable", info: "(World)" },
  { label: "magic", type: "text" },
];
const schema = {
  type: "object",
  properties: {
    input: {
      title: "公式",
      widget: "CodeEditor",
      props: {
        completions,
      },
    },
  },
  displayType: "row",
};
export default () => {
  const onSubmit = (data, errors) => {
    if (!errors || !errors.length) {
      console.log(data);
    }
  };
  return <NewForm schema={schema} onSubmit={onSubmit} />;
};
```

## JSON 编辑器

配置`schema`的字段`widget`为`JsonEditor`，可以实现对`JSON编辑器`控件的配置并对输入的数据进行`JSON`格式的校验。

```jsx
import { NewForm } from "agul-ui";

const schema = {
  type: "object",
  properties: {
    input: {
      title: "json",
      widget: "JsonEditor",
      required: true,
    },
  },
  displayType: "row",
};
export default () => {
  const onSubmit = (data, errors) => {
    if (!errors || !errors.length) {
      console.log(data);
    }
  };
  return <NewForm schema={schema} onSubmit={onSubmit} />;
};
```

## 级联选择框

配置`schema`的字段`widget`为`CustomCascader`，然后对`treeData`进行远程数据源的配置就可以实现对`级联选择框`控件的配置。

```jsx
import { NewForm } from "agul-ui";

const schema = {
  type: "object",
  properties: {
    input: {
      title: "简单级联选择框",
      type: "array",
      widget: "CustomCascader",
      treeData: {
        url:
          "https://yapi.ci.iauto.com/mock/730/api/daq-collectable-ms/v1/admin/datatype:tree",
        path: "data",
        labelFields: ["name", "name"],
        valueFields: ["uid", "uid"],
      },
    },
  },
  displayType: "row",
};
export default () => {
  const onSubmit = (data, errors) => {
    if (!errors || !errors.length) {
      console.log(data);
    }
  };
  return <NewForm schema={schema} onSubmit={onSubmit} />;
};
```

## 下拉框

配置`schema`的字段`widget`为`CustomNumberSelect`或`CustomStringSelect`，然后对`treeData`进行远程数据源的配置就可以实现对`下拉框`控件的配置。

```jsx
import { NewForm } from "agul-ui";

const schema = {
  type: "object",
  properties: {
    input: {
      title: "简单下拉框",
      type: "string",
      widget: "CustomStringSelect",
      required: true,
      treeData: {
        url:
          "https://yapi.ci.iauto.com/mock/730/api/daq-collecttable-ms/v1/admin/datatype:list",
        path: "data",
        labelField: "name",
        valueField: "uid",
      },
    },
  },
  displayType: "row",
};
export default () => {
  const onSubmit = (data, errors) => {
    if (!errors || !errors.length) {
      console.log(data);
    }
  };
  return <NewForm schema={schema} onSubmit={onSubmit} />;
};
```

## 树状选择

配置`schema`的字段`widget`为`CustomTreeSelect`，然后对`treeData`进行远程数据源的配置就可以实现对`树状选择`控件的配置，注意该控件只会存储数据源最子一级的数据的`valueField`字段的取值，具体查看控制台。

```jsx
import { NewForm } from "agul-ui";

const schema = {
  type: "object",
  properties: {
    input: {
      title: "简单树状选择",
      type: "array",
      widget: "CustomTreeSelect",
      treeData: {
        url:
          "https://yapi.ci.iauto.com/mock/730/api/daq-collectable-ms/v1/admin/datatype:tree",
        path: "data",
        labelField: "name",
        valueField: "uid",
      },
    },
  },
  displayType: "row",
};
export default () => {
  const onSubmit = (data, errors) => {
    if (!errors || !errors.length) {
      console.log(data);
    }
  };
  return <NewForm schema={schema} onSubmit={onSubmit} />;
};
```

## 模糊搜索

配置`schema`的字段`widget`为`AsyncSelect`，然后对`treeData`进行远程数据源的配置就可以实现对`模糊搜索`控件的配置，具体传参查看控制台。

```jsx
import { NewForm } from "agul-ui";

const schema = {
  type: "object",
  properties: {
    input: {
      title: "简单树状选择",
      type: "array",
      widget: "AsyncSelect",
      treeData: {
        url:
          "https://yapi.ci.iauto.com/mock/730/api/daq-collectable-ms/v1/admin/datatype:tree",
        path: "data",
        keywordField: "name",
        params: { a: 1 },
        labelField: "name",
        valueField: "uid",
      },
    },
  },
  displayType: "row",
};
export default () => {
  const onSubmit = (data, errors) => {
    if (!errors || !errors.length) {
      console.log(data);
    }
  };
  return <NewForm schema={schema} onSubmit={onSubmit} />;
};
```

## 受控的表单组件

以上例子都是通过非受控组件的形式展示的，开发者只配置`schema`对表单项进行描述。然后通过`onSubmit`或者其他方式拿到最后的产出的`formData`，整个状态由`NewForm`自身进行管理。除此之外，`NewForm`支持通过`formData`和`onChange`这两个`props`配合实现一个[受控的 react 表单组件](https://segmentfault.com/a/1190000040308582)。

```jsx
import { NewForm } from "agul-ui";
import { useState } from "react";
import { Input } from "antd";
import _ from "lodash";

const schema = {
  type: "object",
  properties: {
    input1: {
      title: "初始化",
      type: "string",
      default: "no",
    },
    input2: {
      title: "响应外部变更",
      type: "string",
    },
  },
  displayType: "row",
};
export default () => {
  const [formData, setData] = useState({ input1: "default" });
  const onChange = (data: any) => {
    setData(data);
  };
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <span
          style={{
            width: "20.8%",
            display: "inline-block",
            textAlign: "right",
          }}
        >
          外部数据源：
        </span>
        <Input
          style={{ width: 200 }}
          onChange={(e: any) => {
            console.log(e.target.value);
            setData({ input2: e.target.value });
          }}
        />
      </div>

      <NewForm schema={schema} onChange={onChange} formData={formData} />
    </div>
  );
};
```

## 表单数据整形（不重要 ）

对`schema`对象的属性`action`配置`init`、`change`、`submit`三种函数，对应着在`初始化(Newform存在formData属性时)`、`值变更(Newform存在onChange属性时)`、`校验透过后的提交(Newform存在onSubmit属性或使用ref.current.validate方法时)`三个时间点对表单数据进行变更。
注意：函数不需要`return`，仅改变入参的值即可。

```jsx
import { NewForm } from "agul-ui";
import { useState } from "react";
import _ from "lodash";

const schema = {
  type: "object",
  properties: {
    input1: {
      title: "初始值",
      type: "string",
    },
    input2: {
      title: "整形值",
      type: "string",
    },
  },
  action: {
    // init(data) {
    //   data.input2 = data.input1 + "$$$";
    // },
    change(data) {
      data.input2 = "CHANGE VALUE";
    },
    submit(data) {
      data.input2 = data.input1;
    },
  },
  displayType: "row",
};
export default () => {
  const [formData, setData] = useState({ input1: "default" });
  const onChange = (data: any) => {
    console.log(data);
    setData({ ...data });
  };
  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <NewForm
      schema={schema}
      onChange={onChange}
      formData={formData}
      onSubmit={onSubmit}
    />
  );
};
```

## API

### NewForm

<b>这里介绍常用的 props。同时也支持 <a href="https://xrender.fun/form-render/api-props" >form-render</a> 的其他大部分 props ，除 watch 不再支持 "#" 配置， onFinish 不支持。</b>

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th><div style="white-space:nowrap;">默认值</div></th>
  </tr>
  <tr>
    <td>schema</td>
    <td>必填，描述表单的 schema</td>
    <td><a href="https://github.com/alibaba/x-render/blob/e2feff8fdb3bef5537b92a2157dbbf40b9d4eb17/packages/form-render/src/type.ts#L32">SchemaBase</a></td>
    <td>-</td>
  </tr>
  <tr>
    <td>disabled</td>
    <td>禁用全部表单项</td>
    <td>boolean</td>
    <td>false</td>
  </tr>
  <tr>
    <td>ref</td>
    <td>组件引用，可以调用 validate（返回一个promise）方法拿到通过校验的数据，也可以调用其他的 <a href="https://xrender.fun/form-render/api-props#forminstance">form-render的组件方法</a></td>
    <td>useRef</td>
    <td>-</td>
  </tr>
  <tr>
    <td>formData</td>
    <td>表单值，赋值优先级高于 schema 的 default</td>
    <td>object</td>
    <td>-</td>
  </tr>
  <tr>
    <td>onChange</td>
    <td>表单值变更后的回调，因为有此配置项，所以不再支持 form-render 中的 watch 的 "#" 配置</td>
    <td>(formData)=>void</td>
    <td>-</td>
  </tr>
  <tr>
    <td>onSubmit</td>
    <td>显示提交按钮，点击后表单校验通过会触发该函数并返回 formData</td>
    <td><div style="white-space:nowrap;">(formData)=>void</div></td>
    <td>-</td>
  </tr>
   <tr>
    <td>submitText</td>
    <td>提交按钮文案</td>
    <td>ReactNode</td>
    <td><div style="white-space:nowrap;">"提交"</div></td>
  </tr>
   <tr>
    <td>onCancel</td>
    <td>显示取消按钮，点击后触发该函数</td>
    <td><div style="white-space:nowrap;">()=>void</div></td>
    <td>-</td>
  </tr>
   <tr>
    <td>cancelText</td>
    <td>取消按钮文案</td>
    <td>ReactNode</td>
    <td>"取消"</td>
  </tr>
  <tr>
    <td><div id="widgets">widgets</div></td>
    <td>自定义组件，当内置组件无法满足时使用，详见<a href="https://xrender.fun/form-render/advanced-widget"> 自定义组件</a>。<br/>注意，在NewForm中内置了 CustomUpload、CustomStringSelect、
CustomNumberSelect、CustomTreeSelect、CustomCascader、JsonEditor、CodeEditor、AsyncSelect几种自定义组件，新增组件名称冲突则会覆盖已有组件</td>
    <td>Record&lt;string, ReactNode&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td><div style="white-space:nowrap;">extraButtons</div></td>
    <td>其他按钮</td>
    <td>ReactNode[]</td>
    <td>-</td>
  </tr>
</table>
