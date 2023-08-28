import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";
import _ from "lodash";
import { Spin } from "antd";
import useNewRequest from "@/agul-hooks/useNewRequest";
import NewForm from "@/agul-components/NewForm";
import { ChartProps } from "@/agul-types/chart";

const Content: React.FC<ChartProps> = ({
  option,
  getOption,
  url = "",
  path = "data",
  method = "get",
  params = {},
  formConfig,
}) => {
  const [currentOption, setOption] = useState(option || {});
  const [loading, setLoading] = useState<boolean>(false);
  const request = useNewRequest();
  const getData = async (value: any) => {
    const data =
      method === "get"
        ? {
            params: value,
          }
        : {
            data: value,
          };
    try {
      setLoading(true);
      if (!url) {
        console.error("缺失图表url");
        return;
      }
      const res = await request(url, {
        method,
        ...data,
      });
      setLoading(false);
      setTimeout(() => {
        const source = _.get(res, path, []);
        if (_.isEmpty(source)) {
          let text = _.get(getOption(source), "title.text") || "";
          const title = {
            text,
            subtext: "暂无数据",
            subtextStyle: {
              fontSize: 16,
              align: "cenetr",
              verticalAlign: "middle",
            },
          };
          setOption({
            title,
            grid: {
              width: "100%",
              height: "100%",
            },
          });
        } else {
          setOption(getOption(source));
        }
      }, 0);
    } catch (error) {
      setLoading(false);
      console.error((error as any).message);
    }
  };
  useEffect(() => {
    if (url) {
      getData(params);
    }
  }, [url]);
  const schema = formConfig?.schema;
  const widgets = formConfig?.widgets;
  const formStyle = formConfig?.style;
  const onChange = (formData: any) => {
    getData({ ...params, ..._.pickBy(formData, (item) => !_.isNil(item)) });
  };
  return (
    <div style={{ height: "100%", position: "relative" }}>
      {schema ? (
        <div
          style={{
            width: 300,
            position: "absolute",
            top: 14,
            right: 14,
            zIndex: 10,
            ...formStyle,
          }}
        >
          <NewForm
            schema={schema}
            widgets={widgets}
            onChange={_.debounce(onChange, 200)}
          />
        </div>
      ) : null}
      {loading ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin></Spin>
        </div>
      ) : (
        <ReactECharts option={currentOption} notMerge />
      )}
    </div>
  );
};
export default Content;
