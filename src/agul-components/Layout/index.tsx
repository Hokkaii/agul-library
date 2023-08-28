import React, { useEffect, useRef } from "react";
import { Row, Col } from "antd";
// import GridLayout from "react-grid-layout";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import _ from "lodash";
import { useGlobalDispatch } from "@/agul-utils/context";
import { RGL_LAYOUT_TYPE } from "@/agul-utils/constant";
import Card from "../Card";

const ResponsiveGridLayout = WidthProvider(Responsive) as any;
const Layout: React.FC<{
  data: any;
  hasGlobalSize: boolean;
}> = ({ data, hasGlobalSize }) => {
  const contentRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dispath = useGlobalDispatch();
  useEffect(() => {
    // 父容器尺寸变更时,ResponsiveGridLayout 组件尺寸跟随变更
    const objResizeObserver = new ResizeObserver(
      _.debounce(() => {
        contentRef?.current?.onWindowResize();
        // hasGlobalSize: 菜单收起时,页面 content 尺寸变更导致 ResponsiveGridLayout 尺寸变更, 变更后改变 pageData 中的 SIZE(在一些组件例如图表card依据尺寸变更样式)
        if (hasGlobalSize) {
          dispath((state: any) => {
            return { ...state, SIZE: {} };
          });
        }
      }, 50)
    );
    objResizeObserver.observe(containerRef?.current as Element);
  }, []);
  const layoutType = data?.layout?.type || RGL_LAYOUT_TYPE;
  const layout = _.map(data?.layout?.value, (item, index) => {
    _.set(item, "i", String(index));
    return item;
  });
  const layouts = {
    lg: layout,
    md: layout,
    sm: layout,
    xs: layout,
    xxs: layout,
  };
  const currenValues = _.map(data?.values || [], (item, index) => {
    _.set(item, "key", _.get(layout, [index, "i"]));
    return item;
  });
  return (
    <div ref={containerRef}>
      {layoutType === RGL_LAYOUT_TYPE ? (
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          isDraggable={false}
          isResizable={false}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 24, md: 24, sm: 24, xs: 24, xxs: 24 }}
          rowHeight={50}
          ref={contentRef}
        >
          {_.map(currenValues, (item: any) => (
            <div key={item.key}>
              <Card data={item} key={item.key} layoutType={layoutType} />
            </div>
          ))}
        </ResponsiveGridLayout>
      ) : (
        <div>
          <Row gutter={[10, 10]} style={{ width: "100%" }}>
            {_.map(data?.values || [], (item, index) => (
              <Col {..._.get(data?.layout?.value, [index], {})}>
                <Card data={item} key={item.key} layoutType={layoutType}></Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default Layout;
