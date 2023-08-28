---
toc: content
---

# Chart

## 基本使用

```jsx
import { Chart } from "agul-ui";

export default () => (
  <div style={{ width: "100%", height: 500 }}>
    {/* params={{}} */}
    <Chart
      url="https://randomuser.me/api?pagination[total]=200&results=10&pageSize=8&pageNumber=1"
      path="results"
      method="get"
      formConfig={{
        schema: {
          type: "object",
          properties: {
            input1: {
              title: "输入",
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
          column: 2,
          labelWidth: 70,
        },
        style: { width: 400 },
      }}
      getOption={(data) => {
        console.log(data);
        return {
          grid: { width: "90%", height: "80%" },
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
        };
      }}
    />
  </div>
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
