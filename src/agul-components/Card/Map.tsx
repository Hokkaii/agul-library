import React, { CSSProperties } from "react";
import { useGlobalState, useGlobalDispatch } from "@/agul-utils/context";
import "./common.less";

const Amap = Map as any;
const AMap: React.FC<{
  data: any;
  style: CSSProperties;
}> = ({ data, style }) => {
  const state = useGlobalState();
  const { timestamp } = state;
  const params = data?.component || {};
  const {
    center = [121.46393964202484, 31.21852413639573],
    value = {},
  } = params;
  return (
    <div style={style} className="agul-map-card">
      map
    </div>
  );
};

export default AMap;
