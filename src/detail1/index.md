---
toc: content
---

# Detail

## 基本使用

```jsx
import { Detail } from "agul-ui";

export default () => (
  <Detail
    url="https://randomuser.me/api?pagination[total]=200&results=10&pageSize=8&pageNumber=1"
    path="results[0]"
    field=""
    method="get"
    params={{}}
    names={{
      name: "姓名",
      cell: "座机",
      phone: "手机",
      email: "邮箱",
      gender: "性别",
      nat: "民族",
      location: "地址",
      logins: "登录历史",
    }}
    enums={{
      gender: {
        male: "男",
        female: "女",
      },
    }}
    tableConfig={{
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
    }}
    objectConfig={{
      location: {
        names: {
          country: "国家",
          city: "城市",
          postcode: "邮编",
        },
      },
    }}
    init={(formData) => {
      _.set(
        formData,
        "name",
        `${_.get(formData, "name.first")}·${_.get(formData, "name.last")}`
      );
      _.set(formData, "logins", [_.get(formData, "login")]);
    }}
  />
);
```

## API

<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>
    <th><div style="white-space:nowrap;">默认值</div></th>
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
      如果field不存在则直接使用url进行请求。</br>如果 field 存在且 url 中存在 {xxx} 字符串则 {xxx} 字符串会被替换为 params[field] 值。</br>如果url中不存在 {xxx} 字符串且请求类型(method)为 post 则 field 与 params[field] 值组成的键值对会被加入到 body 中然后进行请求。</br></br>
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
    <td>names</td>
    <td>在names中规定要显示哪些字段并确定字段 key 与 label 的对应关系</td>
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
    <td><div style="white-space:nowrap;">objectConfig</div></td>
    <td>某些字段的出参值是一个对象类型，需要以对象展开的形式展示该字段值</td>
    <td><div style="white-space:nowrap;">Record&lt;string, { names: Record&lt;string, ReactNode&gt;,enums?: Record&lt;string, ReactNode&gt;tableConfig?:tableConfig }&gt;</div></td>
    <td>-</td>
  </tr>
  <tr>
    <td><div style="white-space:nowrap;">tableConfig</div></td>
    <td>某些字段的出参值需要以表格形式展示，需要在 tableConfig 提供该字段的 columns，如果需要配置子表格则还需要提供 childTable， childTable 需要提供 field 指定 tableConfig-columns中哪个字段需要以子表格形式展示并提供它的 columns 。</td>
    <td>Record&lt;string, { columns: object[], childTable?: { field: string, columns：object[]} }&gt;</td>
    <td>-</td>
  </tr>
  
</table>
