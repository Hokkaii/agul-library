import React from "react";
import _ from "lodash";
import { Breadcrumb } from "antd";
import { NavigationProps } from "@/agul-types/navigation";
import "./index.less";
const { Item } = Breadcrumb;

const Navigation: React.FC<NavigationProps> = ({ routes, style, prefix }) => {
  return (
    <Breadcrumb style={style} className="agul-ui-navigation-container">
      <div className="agul-ui-navigation-prefix">{prefix}</div>
      {_.map(routes, (item) => (
        <Item>
          <a href={item.path ? item.path : "javascript:void(0)"}>{item.name}</a>
        </Item>
      ))}
    </Breadcrumb>
  );
};

export default Navigation;
