---
toc: content
---

# useNewRequest

## 基本使用

底层的`fetch`请求插件是[umi-reuqest](https://github.com/umijs/umi-request/blob/master/README_zh-CN.md)，这个`react-hook`底层使用`umi-request`的`extend`方法`创建并返回了实例`，在使用该`hook`时允许配置额外请求头和是否添加签名，默认的请求前缀是`/api`，`credentials`为`include`（带 cookie），修改方式见[umi-request-options](https://github.com/umijs/umi-request/blob/master/README_zh-CN.md#umi-request-api)，下列 demo 可以在控制台查看具体请求参数。

默认添加签名：

```jsx
import { useNewRequest } from "agul-ui";
import { useState, useEffect } from "react";
import { Table } from "antd";
import _ from "lodash";
const columns = [
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
];
export default () => {
  const request = useNewRequest();
  const [data, setData] = useState([]);
  useEffect(() => {
    request("/api/vehicle-model-ms/v1/model", {
      prefix: "",
      credentials: "",
    }).then((res) => {
      setData(_.get(res, "data", []));
    });
  }, []);
  return (
    <Table
      columns={columns}
      dataSource={data}
      scroll={{ x: "max-content", y: 300 }}
    />
  );
};
```

## 不添加签名并添加其他请求头

```jsx
import { useNewRequest } from "agul-ui";
import { useState, useEffect } from "react";
import { Table } from "antd";
import _ from "lodash";
const columns = [
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
];
export default () => {
  const request = useNewRequest({
    extraHeaders: { someheader: 1 },
    needSignature: false,
  });
  const [data, setData] = useState([]);
  useEffect(() => {
    request("/api/vehicle-model-ms/v1/model", {
      prefix: "",
      credentials: "omit",
    }).then((res) => {
      setData(_.get(res, "data", []));
    });
  }, []);
  return (
    <Table
      columns={columns}
      dataSource={data}
      scroll={{ x: "max-content", y: 300 }}
    />
  );
};
```

## API

入参对象属性：

<table>
  <tr>
    <th><div style="white-space:nowrap;">属性</div></th>
    <th>说明</th>
    <th>参数类型</th>
  </tr>
  <tr>
    <td><div style="white-space:nowrap;">requestOptions</div></td>
    <td><a href="https://github.com/umijs/umi-request/blob/master/README_zh-CN.md#%E5%88%9B%E5%BB%BA%E5%AE%9E%E4%BE%8B">umi-request 实例初始化参数</a>,默认存在 errorHandle 错误处理函数以及 credentials 为"include"</td>
    <td>Record&lt;string, any&gt; | undefined</td>
  </tr>
  <tr>
    <td>needSign</td>
    <td>是否需要签名，默认需要</td>
    <td>boolean |   undefined</td>
  </tr>
</table>
