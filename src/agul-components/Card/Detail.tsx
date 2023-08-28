import React, {
  CSSProperties,
  useContext,
  createElement,
  useState,
  useEffect,
} from "react";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import Detail from "@/agul-components/Detail";
import { WidgetsContext } from "@/agul-utils/context";
import GloablLoading from "@/agul-methods/Loading";
import useNewRequest from "@/agul-hooks/useNewRequest";
import "./common.less";

const DetailCard: React.FC<{
  data: any;
  style: CSSProperties;
}> = ({ data, style }) => {
  const Widgets = useContext(WidgetsContext);
  const [detailData, setData] = useState({});
  const url = data?.component?.url;
  const path = data?.component?.path;
  const field = data?.component?.field;
  const init = data?.component?.value?.init;
  const method = data?.component?.method;
  const params = data?.component?.params;

  const location = useLocation();
  const request = useNewRequest();
  const paramObj = _.get(location, ["query"]);
  const extraButtons = [
    ..._.map(data?.component?.value?.extraBtns || [], (com) =>
      typeof com === "string"
        ? Widgets && Widgets[com]
          ? createElement(Widgets[com] as any, { data: detailData })
          : com
        : typeof com === "function"
        ? createElement(com as any, { data: detailData })
        : null
    ),
  ];
  const getData = () => {
    if (!url) {
      return;
    }
    GloablLoading.show();
    const reqData = {
      method: method || "get",
    };
    const data = { ...params };
    if (method === "post") {
      _.set(reqData, "data", data);
    } else {
      _.set(reqData, "params", data);
    }
    request(url, reqData)
      .then((res: any) => {
        GloablLoading.hide();
        const newDetail = _.get(res, path as string);
        if (newDetail) {
          if (_.isFunction(init)) {
            init(newDetail);
          }
          setData(newDetail);
        }
      })
      .catch((err) => {
        GloablLoading.hide();
        setData({});
        console.error(err.message);
      });
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="agul-detail-card" style={style}>
      <Detail
        names={data?.component?.value?.names}
        enums={data?.component?.value?.enums}
        tableConfig={data?.component?.value?.tableConfig}
        objectConfig={data?.component?.value?.objectConfig}
        extraButtons={extraButtons}
      />
    </div>
  );
};

export default DetailCard;
