import React, { CSSProperties } from "react";
import { Tabs } from "antd";
import _ from "lodash";
import RenderCard from "./RenderCard";
import "./common.less";

const { TabPane } = Tabs;
const TabsCard: React.FC<{
  data: any;
  style: CSSProperties;
}> = ({ data = [], style }) => {
  return (
    <div className="agul-tabs-card" style={style}>
      <Tabs defaultActiveKey="0">
        {_.map(data?.component?.value, (item, index) => (
          <TabPane tab={item?.title} key={`${index}`}>
            {RenderCard(item)}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default TabsCard;
