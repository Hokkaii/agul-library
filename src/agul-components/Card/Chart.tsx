import React, { CSSProperties } from "react";
import Chart from "@/agul-components/Chart";
import "./common.less";
const ChartlCard: React.FC<{
  data: any;
  style: CSSProperties;
}> = ({ data, style }) => {
  return (
    <div className="agul-chart-card" style={style}>
      <Chart
        url={data?.component?.url}
        method={data?.component?.method}
        params={data?.component?.params}
        path={data?.component?.path}
        multipleConfig={data?.component?.value?.multipleConfig}
        option={data?.component?.value?.option}
        formConfig={data?.component?.value?.formConfig}
        getOption={data?.component?.value?.getOption}
      />
    </div>
  );
};

export default ChartlCard;
