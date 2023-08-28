import React, { useContext, createElement, CSSProperties } from "react";
import _ from "lodash";
import { WidgetsContext } from "@/agul-utils/context";
import "./common.less";
const CustomCard: React.FC<{
  data: any;
  style: CSSProperties;
}> = ({ data, style }) => {
  const Widgets = useContext(WidgetsContext);
  const Com = data?.component?.widget;
  const props = data?.component?.props || {};
  return (
    <div className="agul-custom-card" style={style}>
      {typeof Com === "string"
        ? Widgets && Widgets[Com]
          ? createElement(Widgets[Com], props)
          : Com
        : typeof Com === "function"
        ? createElement(Com, props)
        : null}
    </div>
  );
};

export default CustomCard;
