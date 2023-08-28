---
toc: content
---

# PageContainer

## 基本使用

使用`js对象`或者`json数据`对页面的内容和布局进行描述，进而渲染出完整页面；
目前已有`Form`、`TableWithForm`、`StepsForm`、`Detail`、`Tabs`、`Chart`、`CustomCard`等几种`可配置 Card`，可以使用 [antd 栅格布局](https://4x.ant.design/components/grid-cn/) 或 [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout) 对已存的 Card 进行布局。通常的页面使用`antd 栅格布局`即可，一些对布局要求比较高的页面（例如 dashboard 多图表页面）可以考虑使用 `rgl`进行布局配置。 `antd栅格`和`rgl`两种布局方式的主要差异是在于：antd 的布局元素不定高、rgl 的布局元素定高，antd 使用浮动（flex）布局、rgl 使用绝对定位布局。cards.layout.value 的布局项与 cards.values 的卡片项一一对应控制布局。</br>
每一种 Card 类型都有其独特的配置，因此在每一种 Card 例子配置后会单独介绍它的配置方案。

## 单个表单表格卡片

表单表格卡片`cardType` 为 `"form-table"`

```jsx
import { PageContainer } from "agul-ui";
const initData = {
  cards: {
    layout: {
      type: "antd",
      value: [{ span: 24 }],
    },
    values: [
      {
        cardType: "form-table",
        component: {
          url: "/api/vehicle-model-ms/v1/model",
          path: "data",
          pagePath: "pageable",
          value: {
            formConfig: {
              schema: {
                type: "object",
                properties: {
                  name: {
                    title: "名称",
                    type: "string",
                    props: {
                      allowClear: true,
                    },
                  },
                  priority: {
                    labelWidth: 80,
                    title: "优先级",
                    type: "number",
                    enum: [2, 1, 0],
                    enumNames: ["高", "中", "低"],
                    props: {
                      allowClear: true,
                    },
                  },
                },
                column: 2,
                labelWidth: 50,
                displayType: "row",
              },
            },
            tableConfig: {
              operate: {
                mode: "text",
                buttons: [
                  {
                    type: "detail",
                    text: "查看",
                    routerPath: "/strategy/strategyManage/detail",
                    field: "id",
                  },
                  {
                    type: "edit",
                    text: "编辑",
                    routerPath: "/strategy/strategyManage/edit",
                    field: "id",
                    condition: "[0,3].includes(row.status)",
                  },
                  {
                    type: "delete",
                    text: "删除",
                    url: "/strategy-ms/v2/admin/strategy/{id}",
                    field: "id",
                  },
                ],
              },
              columns: [
                {
                  title: "车型名",
                  dataIndex: "brandName",
                },
                {
                  title: "车型 CODE",
                  dataIndex: "code",
                },
                {
                  title: "更新时间",
                  dataIndex: "updateTime",
                  format: "YYYY-MM-DD HH:mm:ss",
                },
              ],
            },
          },
        },
      },
    ],
  },
};
export default () => <PageContainer data={initData} />;
```

### 表单表格卡片 API

`cardType` 为 `"form-table"`，然后是`component`：

#### component

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
  </tr>
  <tr>
    <td>url</td>
    <td>必填，表格资源接口地址</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>path</td>
    <td>表格资源在接口出参中的路径</td>
   <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>pagePath</td>
    <td>表格分页数据在接口出参中的路径</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>method</td>
    <td>表格数据请求方式</td>
    <td><div style="white-space:nowrap;">'get' | 'post'</div></td>
    <td>'get'</td>
  </tr>
  <tr>
    <td>params</td>
    <td>额外配置参数，会加到请求参数中</td>
    <td>object</td>
    <td>-</td>
  </tr>
   <tr>
    <td>value</td>
    <td>表单表格的详细配置，详细见下文</td>
    <td>object</td>
    <td>-</td>
  </tr>
</table>

`component`中的`value`:

#### value

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th><div style="white-space:nowrap;">默认值</div></th>
  </tr>
  <tr>
    <td>formConfig</td>
    <td>表格表单的顶部表单栏的配置项</td>
    <td><div style="white-space:nowrap;"><a href="#formconfigprops">object</a></div></td>
    <td>-</td>
  </tr>
  <tr>
    <td><div style="white-space:nowrap;">tableConfig</div></td>
    <td>表格的配置项，基本同 NewTable 的 配置在，除url、path、pagePath、method、params要配置在`component`（value的父级）项中</td>
    <td><a href="/components/newtable#newtable-1">object</a></td>
    <td>-</td>
  </tr>
</table>

`value`中的`formConfig`:

#### formConfig

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th><div style="white-space:nowrap;">默认值</div></th>
  </tr>
  <tr>
    <td>schema</td>
    <td>表格表单的顶部表单的描述表单的 schema</td>
    <td><div style="white-space:nowrap;"><a href="https://github.com/alibaba/x-render/blob/e2feff8fdb3bef5537b92a2157dbbf40b9d4eb17/packages/form-render/src/type.ts#L32">SchemaBase</a></div></td>
    <td>-</td>
  </tr>
  <tr>
    <td>widgets</td>
    <td>自定义组件，当内置组件无法满足时使用，详见<a href="https://xrender.fun/form-render/advanced-widget"> 自定义组件</a></td>
    <td>Record&lt;string, ReactNode&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td>addBtn</td>
    <td>表格表单的顶部表单栏的新增按钮，没有该配置项则按钮不显示。已经存在表单的一个查询按钮，后续其他按钮依次排列</td>
    <td><a href="#addbtnprops">object</a></td>
    <td>-</td>
  </tr>
  <tr>
    <td>exportBtn</td>
    <td></td>
    <td></td>
    <td>-</td>
  </tr>
  <tr>
    <td><div style="white-space:nowrap;">importBtn</div></td>
    <td>导入按钮，以给定的 url 为上传地址进行导入，成功后刷新页面；同时也支持以 text 配置文案，props 透传给 antd-button</td>
    <td>{ url:string; text:ReactNode; props:object }</td>
    <td>-</td>
  </tr>
  <tr>
    <td><div style="white-space:nowrap;">extraBtns</div></td>
    <td>除新增、导出、导入按钮以外，可以添加其他自定义按钮。</br>
    如果数组项值的类型是 string ，先会在 PageContainer 的 widgets 配置中寻找相关的映射组件然后进行渲染，会给组件的 props 注入 reset（重置表单刷新）和 update（当前筛选条件查询）两个方法然后渲染组件，找不到映射组件则会直接渲染字符串。</br>
    如果数组项值的类型是 function ，会给组件函数（类）的 props 注入 reset（重置表单刷新）和 update（当前筛选条件查询）两个方法然后渲染组件。</br>
    </td>
    <td>Array&lt;ReactNode | string&gt;</td>
    <td>-</td>
  </tr>
</table>

`formConfig`中的`addBtn`:

#### addBtn

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
  </tr>
  <tr>
    <td>text</td>
    <td>按钮文案</td>
    <td>ReactNode</td>
    <td>-</td>
  </tr>
  <tr>
    <td>routerPath</td>
    <td>跳转至新页面进行新增，有此项则>url、method、schema、widgets均失效</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>url</td>
    <td>模态窗方式新增操作提交的接口地址</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>method</td>
    <td>模态窗方式新增操作提交的请求方式</td>
    <td>'put'|'post'</td>
    <td>'post'</td>
  </tr>
  <tr>
    <td>schema</td>
    <td>模态窗方式新增操作描述表单的 schema</td>
    <td><div style="white-space:nowrap;"><a href="https://github.com/alibaba/x-render/blob/e2feff8fdb3bef5537b92a2157dbbf40b9d4eb17/packages/form-render/src/type.ts#L32">SchemaBase</a></div></td>
    <td>-</td>
  </tr>
  <tr>
    <td>widgets</td>
    <td>模态窗方式新增操作表单的自定义组件</td>
    <td>Record&lt;string, ReactNode&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td>props</td>
    <td>新增按钮的其他props，透传给antd-button</td>
    <td>object</td>
    <td>-</td>
  </tr>
</table>

## 单个表单卡片

表单卡片`cardType` 为 `"detail"`

```jsx
import { PageContainer } from "agul-ui";
const initData = {
  cards: {
    layout: {
      type: "antd",
      value: [{ span: 24 }],
    },
    values: [
      {
        cardType: "form",
        component: {
          url: "/strategy-ms/v2/admin/strategy/{id}:edit",
          method: "put",
          field: "id",
          path: "data",
          detailUrl: "/strategy-ms/v2/admin/strategy/{id}",
          value: {
            schema: {
              type: "object",
              properties: {
                name: {
                  title: "策略名称",
                  type: "string",
                  required: true,
                },
                version: {
                  title: "策略版本",
                  type: "string",
                  required: true,
                },
                description: {
                  title: "描述信息",
                  type: "string",
                  format: "textarea",
                  required: true,
                  max: 500,
                  props: {
                    showCount: true,
                    maxLength: 500,
                    style: {
                      width: "100%",
                    },
                  },
                },
                uploadType: {
                  title: "上传方式",
                  type: "number",
                  enum: [0, 1, 2],
                  enumNames: ["实时上传", "条件上传", "立即上传"],
                  required: true,
                },
                upload: {
                  title: "上传配置",
                  type: "object",
                  properties: {
                    interval: {
                      hidden: "{{formData.uploadType === 0}}",
                      required: true,
                      title: "间隔时间",
                      type: "number",
                      default: 10000,
                      min: 10000,
                      max: 500000,
                      props: {
                        addonAfter: "ms",
                      },
                    },
                    maxSize: {
                      title: "最大存储",
                      type: "number",
                      props: {
                        addonAfter: "KB",
                      },
                    },
                    condition: {
                      type: "string",
                      title: "触发条件",
                      widget: "CodeEditor",
                    },
                    partition: {
                      title: "分片大小",
                      type: "number",
                      props: {
                        addonAfter: "KB",
                      },
                    },
                  },
                },
              },
              column: 1,
              labelWidth: 100,
              displayType: "row",
            },
          },
        },
      },
    ],
  },
};
export default () => <PageContainer data={initData} />;
```

`cardType` 为 `"form-table"`，然后是`component`：

### 表单卡片 API

`cardType` 为 `"form"`，然后是`component`：

#### component

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
  </tr>
  <tr>
    <td>url</td>
    <td>表单提交地址</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>method</td>
    <td>表格数据请求方式</td>
    <td><div style="white-space:nowrap;">'get' | 'post'</div></td>
    <td>'get'</td>
  </tr>
  <tr>
    <td>detailUrl</td>
    <td>详情请求地址，用于初始化表单，多用于编辑页</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td><div style="white-space:nowrap;">detailMethod</div></td>
    <td>详情数据请求方式</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>field</td>
    <td>
      如果 field 不存在则直接使用detailUrl / url进行请求/提交。</br>如果 field 存在且 detailUrl / url 中存在 {xxx} 字符串则 {xxx} 字符串会被替换为 params[field] 值。</br>如果detailUrl/url中不存在 {xxx} 字符串且请求/提交类型(method/detailMethod)为 post 或 put 则 field 与 params[field] 值组成的键值对会被加入到 body 中然后进行请求/提交。</br></br>
      注：params 指路由参数。xxx 指可以是任何字符串，例如一个 url 是 '/api/getData:{id}' 且 params[field] 为 1，则最后实际请求的地址为 '/api/getData:10'
    </td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>path</td>
    <td>详情资源在接口出参中的路径</td>
    <td>string</td>
    <td>-</td>
  </tr>
   <tr>
    <td>value</td>
    <td>表单的详细配置，详细见下文</td>
    <td>object</td>
    <td>-</td>
  </tr>
</table>

`component`中的`value`:

#### value

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th><div style="white-space:nowrap;">默认值</div></th>
  </tr>
  <tr>
    <td>schema</td>
    <td>表单的描述表单的 schema</td>
    <td><div style="white-space:nowrap;"><a href="https://github.com/alibaba/x-render/blob/e2feff8fdb3bef5537b92a2157dbbf40b9d4eb17/packages/form-render/src/type.ts#L32">SchemaBase</a></div></td>
    <td>-</td>
  </tr>
  <tr>
    <td>widgets</td>
    <td>自定义组件，当内置组件无法满足时使用，详见<a href="https://xrender.fun/form-render/advanced-widget"> 自定义组件</a></td>
    <td>Record&lt;string, ReactNode&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td><div style="white-space:nowrap;">disabled</div></td>
    <td>表单是否不可编辑</td>
    <td>boolean</td>
    <td>false</td>
  </tr>
   <tr>
    <td><div style="white-space:nowrap;">extraBtns</div></td>
    <td>
      在 Form 卡片中，表单底部默认存在提交(提交成功后路由后退)和取消两个按钮(路由后退)，通过 extraBtns 可以配置其他按钮。</br>
      如果数组项值的类型是 string ，先会在 PageContainer 的 widgets 配置中寻找相关的映射组件然后进行渲染，会给组件的 props 注入 reset（重置表单刷新）和 update（当前筛选条件查询）两个方法然后渲染组件，找不到映射组件则会直接渲染字符串。</br>
      如果数组项值的类型是 function ，会给组件函数（类）的 props 注入 reset（重置表单刷新）和 update（当前筛选条件查询）两个方法然后渲染组件。</br>
    </td>
    <td><a href="/components/newtable#newtable-1">object</a></td>
    <td>-</td>
  </tr>
  
</table>

## 单个多步骤表单卡片

多步骤表单卡片`cardType` 为 `"form"`

```jsx
import { PageContainer } from "agul-ui";
const initData = {
  cards: {
    layout: {
      type: "antd",
      value: [{ span: 24 }],
    },
    values: [
      {
        cardType: "steps-form",
        component: {
          url: "/strategy-ms/v2/admin/strategy/{id}:edit",
          method: "put",
          field: "id",
          path: "data",
          detailUrl: "/strategy-ms/v2/admin/strategy/{id}",
          value: {
            widgets: { StrategyScopes: "strategyScopes" },
            schemas: [
              {
                type: "object",
                properties: {
                  name: {
                    title: "策略名称",
                    type: "string",
                    required: true,
                  },
                  version: {
                    title: "策略版本",
                    type: "string",
                    required: true,
                  },
                  description: {
                    title: "描述信息",
                    type: "string",
                    format: "textarea",
                    required: true,
                    max: 500,
                    props: {
                      showCount: true,
                      maxLength: 500,
                      style: {
                        width: "100%",
                      },
                    },
                  },
                },
                column: 1,
                labelWidth: 100,
                displayType: "row",
              },
              {
                type: "object",
                properties: {
                  uploadType: {
                    title: "上传方式",
                    type: "number",
                    enum: [0, 1, 2],
                    enumNames: ["实时上传", "条件上传", "立即上传"],
                    required: true,
                  },
                  upload: {
                    title: "上传配置",
                    type: "object",
                    properties: {
                      interval: {
                        hidden: "{{formData.uploadType === 0}}",
                        required: true,
                        title: "间隔时间",
                        type: "number",
                        default: 10000,
                        min: 10000,
                        max: 500000,
                        props: {
                          addonAfter: "ms",
                        },
                      },
                      maxSize: {
                        title: "最大存储",
                        type: "number",
                        props: {
                          addonAfter: "KB",
                        },
                      },
                      condition: {
                        type: "string",
                        title: "触发条件",
                        widget: "CodeEditor",
                      },
                      partition: {
                        title: "分片大小",
                        type: "number",
                        props: {
                          addonAfter: "KB",
                        },
                      },
                    },
                  },
                },
                column: 1,
                labelWidth: 100,
                displayType: "row",
              },
            ],
          },
        },
      },
    ],
  },
};
export default () => <PageContainer data={initData} />;
```

### 多步骤表单卡片 API

`cardType` 为 `"steps-form"`，然后是`component`：

#### component

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th><div style="white-space:nowrap;">默认值</div></th>
  </tr>
  <tr>
    <td>url</td>
    <td>表单提交地址</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>method</td>
    <td>表格数据请求方式</td>
    <td><div style="white-space:nowrap;">'get' | 'post'</div></td>
    <td>'get'</td>
  </tr>
  <tr>
    <td>detailUrl</td>
    <td>详情请求地址，用于初始化表单，多用于编辑页</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td><div style="white-space:nowrap;">detailMethod</div></td>
    <td>详情数据请求方式</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>field</td>
    <td>
      如果 field 不存在则直接使用detailUrl / url进行请求/提交。</br>如果 field 存在且 detailUrl / url 中存在 {xxx} 字符串则 {xxx} 字符串会被替换为 params[field] 值。</br>如果detailUrl/url中不存在 {xxx} 字符串且请求/提交类型(method/detailMethod)为 post 或 put 则 field 与 params[field] 值组成的键值对会被加入到 body 中然后进行请求/提交。</br></br>
      注：params 指路由参数。xxx 指可以是任何字符串，例如一个 url 是 '/api/getData:{id}' 且 params[field] 为 1，则最后实际请求的地址为 '/api/getData:10'
    </td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>path</td>
    <td>详情资源在接口出参中的路径</td>
    <td>string</td>
    <td>-</td>
  </tr>
   <tr>
    <td>value</td>
    <td>表单的详细配置，详细见下文</td>
    <td>object</td>
    <td>-</td>
  </tr>
</table>

`component`中的`value`:

#### value

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th><div style="white-space:nowrap;">默认值</div></th>
  </tr>
  <tr>
    <td>schemas</td>
    <td>多步骤表单的描述表单的 多个schema</td>
    <td><div style="white-space:nowrap;">Array&lt;SchemaBase&gt;，<a href="https://github.com/alibaba/x-render/blob/e2feff8fdb3bef5537b92a2157dbbf40b9d4eb17/packages/form-render/src/type.ts#L32">SchemaBase</a></div></td>
    <td>-</td>
  </tr>
  <tr>
    <td>widgets</td>
    <td>自定义组件，当内置组件无法满足时使用，详见<a href="https://xrender.fun/form-render/advanced-widget"> 自定义组件</a></td>
    <td>Record&lt;string, ReactNode&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td><div style="white-space:nowrap;">disabled</div></td>
    <td>表单是否不可编辑</td>
    <td>boolean</td>
    <td>false</td>
  </tr>
   <tr>
    <td><div style="white-space:nowrap;">extraBtns</div></td>
    <td>
      在多步骤表单卡片中，表单底部默认存在提交(提交成功后路由后退)、取消和上一步三个按钮(路由后退)，通过 extraBtns 可以配置其他按钮。</br>
      如果数组项值的类型是 string ，先会在 PageContainer 的 widgets 配置中寻找相关的映射组件然后进行渲染，会给组件的 props 注入 reset（重置表单刷新）和 update（当前筛选条件查询）两个方法然后渲染组件，找不到映射组件则会直接渲染字符串。</br>
      如果数组项值的类型是 function ，会给组件函数（类）的 props 注入 reset（重置表单刷新）和 update（当前筛选条件查询）两个方法然后渲染组件。</br>
    </td>
    <td><a href="/components/newtable#newtable-1">object</a></td>
    <td>-</td>
  </tr>
  
</table>

## 单个详情卡片

详情卡片`cardType` 为 `"form"`

```jsx
import { PageContainer } from "agul-ui";
import _ from "lodash";
const initData = {
  cards: {
    layout: {
      type: "antd",
      value: [{ span: 24 }],
    },
    values: [
      {
        cardType: "detail",
        component: {
          url:
            "https://randomuser.me/api?pagination[total]=200&results=10&pageSize=8&pageNumber=1",
          path: "results[0]",
          field: "",
          value: {
            init(formData) {
              _.set(
                formData,
                "name",
                `${_.get(formData, "name.first")}·${_.get(
                  formData,
                  "name.last"
                )}`
              );
              _.set(formData, "logins", [_.get(formData, "login")]);
            },
            tableConfig: {
              logins: {
                columns: [
                  {
                    title: "用户名",
                    dataIndex: "username",
                  },
                  {
                    title: "平台",
                    dataIndex: "salt",
                  },
                  {
                    title: "密码",
                    dataIndex: "password",
                  },
                ],
              },
            },
            dataSource: {},
            names: {
              name: "姓名",
              cell: "座机",
              phone: "手机",
              email: "邮箱",
              gender: "性别",
              nat: "民族",
              location: "地址",
              logins: "登录历史",
            },
            enums: {
              gender: {
                male: "男",
                female: "女",
              },
            },
            objectConfig: {
              location: {
                names: {
                  country: "国家",
                  city: "城市",
                  postcode: "邮编",
                },
              },
            },
          },
        },
      },
    ],
  },
};
export default () => <PageContainer data={initData} />;
```

### 详情卡片 API

`cardType` 为 `"detail"`，然后是`component`：

#### component

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
  </tr>
  <tr>
    <td>url</td>
    <td>详情资源接口地址</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>path</td>
    <td>详情资源在接口出参中的路径</td>
   <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>method</td>
    <td>请求方式</td>
    <td>'get'|'post'</td>
    <td>'get'</td>
  </tr>
  <tr>
    <td>field</td>
    <td>
      如果 field 不存在则直接使用url进行请求。</br>如果 field 存在且 url 中存在 {xxx} 字符串则 {xxx} 字符串会被替换为 params[field] 值。</br>如果url中不存在 {xxx} 字符串且请求类型(method)为 post 则 field 与 params[field] 值组成的键值对会被加入到 body 中然后进行请求。</br></br>
      注：params 指路由参数。xxx 指可以是任何字符串，例如一个 url 是 '/api/getData:{id}' 且 params[field] 为 1，则最后实际请求的地址为 '/api/getData:10'
    </td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td><div style="white-space:nowrap;">params</div></td>
    <td>额外配置参数，会加到请求参数中</td>
    <td>object</td>
    <td>-</td>
  </tr>
  <tr>
    <td>value</td>
    <td>详情卡片的详细配置，详细见下文</td>
    <td>object</td>
    <td>-</td>
  </tr>
</table>

`component`中的`value`:

#### value

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th><div style="white-space:nowrap;">默认值</div></th>
  </tr>
  <tr>
    <td>names</td>
    <td>详情条目名称与出参字段的映射关系</td>
    <td>Record&lt;string, string&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td>enums</td>
    <td>某些字段的出参值无法满足要求需要映射时，使用 enums 提供相应的映射关系</td>
    <td>Record&lt;string, Record&lt;string, string&gt;&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td><div style="white-space:nowrap;">tableConfig</div></td>
    <td>某些字段的出参值需要以表格形式展示，需要在 tableConfig 提供该字段的 columns，如果需要配置子表格则还需要提供 childTable， childTable 需要提供 field 指定 tableConfig-columns中哪个字段需要以子表格形式展示并提供它的 columns 。</td>
    <td>Record&lt;string, { columns: object[], childTable?: { field: string, columns：object[]} }&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td><div style="white-space:nowrap;">objectConfig</div></td>
    <td>某些字段的出参值是一个对象类型，需要以对象展开的形式展示该字段值</td>
    <td><div style="white-space:nowrap;">Record&lt;string, { names: Record&lt;string, string&gt; }&gt;</div></td>
    <td>-</td>
  </tr>
</table>

## 单个 Tabs 卡片

Tabs 卡片`cardType` 为 `"tabs"`

```jsx
import { PageContainer } from "agul-ui";
const initData = {
  cards: {
    layout: {
      type: "antd",
      value: [{ span: 24 }],
    },
    values: [
      {
        cardType: "tabs",
        component: {
          value: [
            {
              cardType: "form-table",
              title: "form-table-card",
              component: {
                url: "/api/vehicle-model-ms/v1/model",
                path: "data",
                pagePath: "pageable",
                value: {
                  dataSource: [],
                  formConfig: {
                    schema: {
                      type: "object",
                      properties: {
                        name: {
                          title: "名称",
                          type: "string",
                          props: {
                            allowClear: true,
                          },
                        },
                        priority: {
                          labelWidth: 80,
                          title: "优先级",
                          type: "number",
                          enum: [2, 1, 0],
                          enumNames: ["高", "中", "低"],
                          props: {
                            allowClear: true,
                          },
                        },
                      },
                      column: 2,
                      labelWidth: 50,
                      displayType: "row",
                    },
                  },
                  tableConfig: {
                    operate: {
                      mode: "text",
                      buttons: [
                        {
                          type: "detail",
                          text: "查看",
                          routerPath: "/strategy/strategyManage/detail",
                          field: "id",
                        },
                        {
                          type: "edit",
                          text: "编辑",
                          routerPath: "/strategy/strategyManage/edit",
                          field: "id",
                          condition: "[0,3].includes(row.status)",
                        },
                        {
                          type: "delete",
                          text: "删除",
                          url: "/strategy-ms/v2/admin/strategy/{id}",
                          field: "id",
                        },
                      ],
                    },
                    columns: [
                      {
                        title: "车型名",
                        dataIndex: "brandName",
                      },
                      {
                        title: "车型 CODE",
                        dataIndex: "code",
                      },
                      {
                        title: "更新时间",
                        dataIndex: "updateTime",
                        format: "YYYY-MM-DD HH:mm:ss",
                      },
                    ],
                  },
                },
              },
            },
            {
              cardType: "detail",
              title: "detail-card",
              component: {
                url:
                  "https://randomuser.me/api?pagination[total]=200&results=10&pageSize=8&pageNumber=1",
                path: "info",
                field: "",
                value: {
                  init(formData) {},
                  tableConfig: {},
                  dataSource: {},
                  names: {
                    page: "页面信息",
                    results: "结果信息",
                    seed: "来源",
                    version: "版本",
                  },
                  enums: {
                    // status: StatusEnum,
                    // triggerType: triggerTypeEnum,
                    // uploadType: uploadTypeEnum,
                    // type: storageTypeEnum,
                  },
                  objectConfig: {},
                },
              },
            },
          ],
        },
      },
    ],
  },
};
export default () => <PageContainer data={initData} />;
```

### Tabs 卡片 API

`cardType` 为 `"tabs"`，`Tabs`卡片的 `component`只有一个`value`属性。

#### value

`类型`：`Array<{cardType: string, component: object}>`
多个卡片的配置数据组成一个`Tabs`卡片。

## 多图表卡片

图表卡片 `cardType` 为 `"form"`

```jsx
import { PageContainer } from "agul-ui";
const initData = {
  cards: {
    layout: {
      type: "rgl",
      value: [
        { w: 15, h: 13, x: 0, y: 0 },
        { w: 8, h: 9, x: 16, y: 0, static: true },
        { w: 15, h: 4, x: 0, y: 13, static: true },
        { w: 8, h: 8, x: 16, y: 9, static: true },
        { w: 7.5, h: 6, x: 0, y: 17, static: true },
        { w: 7.5, h: 6, x: 8, y: 17, static: true },
        { w: 8, h: 6, x: 16, y: 17, static: true },
      ],
    },
    values: [
      {
        cardType: "chart",
        component: {
          value: {
            option: {
              grid: { width: "90%", height: "88%" },
              xAxis: {
                type: "category",
                boundaryGap: false,
                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              },
              yAxis: {
                type: "value",
              },
              series: [
                {
                  data: [820, 932, 901, 934, 1290, 1330, 1320],
                  type: "line",
                  areaStyle: {},
                },
              ],
            },
          },
        },
      },
      {
        cardType: "chart",
        component: {
          value: {
            option: {
              grid: { width: "90%", height: "80%" },
              xAxis: {},
              yAxis: {},
              series: [
                {
                  data: [
                    [10, 40],
                    [50, 100],
                    [40, 20],
                  ],
                  type: "line",
                },
              ],
            },
          },
        },
      },
      {
        cardType: "chart",
        component: {
          value: {
            option: {
              grid: { width: "90%", height: "60%" },
              xAxis: {
                type: "category",
                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              },
              yAxis: {
                type: "value",
              },
              series: [
                {
                  data: [120, 200, 150, 80, 70, 110, 130],
                  type: "bar",
                  showBackground: true,
                  backgroundStyle: {
                    color: "rgba(180, 180, 180, 0.2)",
                  },
                },
              ],
            },
          },
        },
      },
      {
        cardType: "chart",
        component: {
          value: {
            option: {
              grid: { width: "90%", height: "80%" },
              xAxis: {
                type: "category",
                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              },
              yAxis: {
                type: "value",
              },
              series: [
                {
                  data: [150, 230, 224, 218, 135, 147, 260],
                  type: "line",
                },
              ],
            },
          },
        },
      },
      {
        cardType: "chart",
        component: {
          value: {
            option: {
              grid: { width: "90%", height: "75%" },
              xAxis: {
                type: "category",
                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              },
              yAxis: {
                type: "value",
              },
              series: [
                {
                  data: [150, 230, 224, 218, 135, 147, 260],
                  type: "line",
                },
              ],
            },
          },
        },
      },
      {
        cardType: "chart",
        component: {
          value: {
            option: {
              xAxis: {},
              yAxis: {},
              grid: { width: "90%", height: "75%" },
              series: [
                {
                  symbolSize: 20,
                  data: [
                    [10.0, 8.04],
                    [8.07, 6.95],
                    [13.0, 7.58],
                    [9.05, 8.81],
                    [11.0, 8.33],
                    [14.0, 7.66],
                    [13.4, 6.81],
                    [10.0, 6.33],
                    [14.0, 8.96],
                    [12.5, 6.82],
                    [9.15, 7.2],
                    [11.5, 7.2],
                    [3.03, 4.23],
                    [12.2, 7.83],
                    [2.02, 4.47],
                    [1.05, 3.33],
                    [4.05, 4.96],
                    [6.03, 7.24],
                    [12.0, 6.26],
                    [12.0, 8.84],
                    [7.08, 5.82],
                    [5.02, 5.68],
                  ],
                  type: "scatter",
                },
              ],
            },
          },
        },
      },
      {
        cardType: "chart",
        component: {
          value: {
            option: {
              grid: { width: "90%", height: "75%" },
              radar: {
                indicator: [
                  { name: "Sales", max: 6500 },
                  { name: "Administration", max: 16000 },
                  { name: "Information Technology", max: 30000 },
                  { name: "Customer Support", max: 38000 },
                  { name: "Development", max: 52000 },
                  { name: "Marketing", max: 25000 },
                ],
              },
              series: [
                {
                  name: "Budget vs spending",
                  type: "radar",
                  data: [
                    {
                      value: [4200, 3000, 20000, 35000, 50000, 18000],
                      name: "Allocated Budget",
                    },
                    {
                      value: [5000, 14000, 28000, 26000, 42000, 21000],
                      name: "Actual Spending",
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    ],
  },
};
export default () => <PageContainer data={initData} />;
```

### 图表卡片 API

`cardType` 为 `"chart"`，然后是`component`：

#### component

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
  </tr>
  <tr>
    <td>url</td>
    <td>图表资源接口地址</td>
    <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>path</td>
    <td>图表资源在接口出参中的路径</td>
   <td>string</td>
    <td>-</td>
  </tr>
  <tr>
    <td>method</td>
    <td>请求方式</td>
    <td>'get'|'post'</td>
    <td>'get'</td>
  </tr>
  <tr>
    <td><div style="white-space:nowrap;">params</div></td>
    <td>额外配置参数，会加到请求参数中</td>
    <td>object</td>
    <td>-</td>
  </tr>
  <tr>
    <td>value</td>
    <td>详情卡片的详细配置，详细见下文</td>
    <td>object</td>
    <td>-</td>
  </tr>
</table>

`component`中的`value`:

#### value

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th><div style="white-space:nowrap;">默认值</div></th>
  </tr>
  <tr>
    <td>option</td>
    <td>Echarts配置项，会被getOption的返回值覆盖</td>
    <td><a href="https://echarts.apache.org/zh/option.html#title">EchartsOptions</a></td>
    <td>-</td>
  </tr>
  <tr>
    <td>formConfig</td>
    <td>图表的筛选栏表单配置项，schema为表单描述、widgets为自定义组件、style控制筛选栏样式</td>
    <td>Record&lt;string, { schema: object, widgets?: Record&lt;string, ReactNode&gt;,style?:CSSProperties }&gt;</td>
    <td>-</td>
  </tr>
  <tr>
    <td>getOption</td>
    <td>请求远程资源后生成 <a href="https://echarts.apache.org/zh/option.html#title">EchartsOptions</a>，会覆盖 option</td>
    <td>(data)=> <a href="https://echarts.apache.org/zh/option.html#title">EchartsOptions</a></td>
    <td>-</td>
  </tr>
  <tr>
    <td><div style="white-space:nowrap;">multipleConfig</div></td>
    <td>以 Tabs 展示多个图表</td>
    <td>Array&lt;option?: <a href="https://echarts.apache.org/zh/option.html#title">EchartsOptions</a>, getOption: (data)=> <a href="https://echarts.apache.org/zh/option.html#title">EchartsOptions</a>, url?: string, path?: string, method?: string,params?: object,formConfig?: Record&lt;string, { schema: object, widgets?: Record&lt;string, ReactNode&gt;,style?:CSSProperties }&gt;&gt;</td>
    <td>-</td>
  </tr>
</table>
