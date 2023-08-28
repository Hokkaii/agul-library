import React, {
  Suspense,
  useEffect,
  useRef,
  ComponentType,
  useState,
} from "react";
import _ from "lodash";
import {
  GlobalProvider,
  useGlobalDispatch,
  WidgetsContext,
} from "@/agul-utils/context";
import LayoutComponent from "@/agul-components/Layout";
import Navigation from "@/agul-components/Navigation";
import "./index.less";

// 这里使用懒加载，避免react-grid组件的宽度计算错误。
const PageContent: React.FC<{
  cards: any[];
  routes?: Array<{ name: string; path: string }>;
  hasGlobalTime: boolean;
  hasGlobalSize: boolean;
}> = ({ cards = [], routes, hasGlobalTime, hasGlobalSize }) => {
  const dispath = useGlobalDispatch();
  // 全局时间戳的实时变动
  const timeRef = useRef<any>(0);
  useEffect(() => {
    if (hasGlobalTime) {
      timeRef.current = setInterval(() => {
        dispath((state: any) => {
          return { ...state, TIME: new Date().getTime() };
        });
      }, 2000);
    }
    return () => {
      clearInterval(timeRef.current);
    };
  }, []);
  const [show, setShow] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    });
  }, []);
  // hasGlobalSize: 菜单收起时,页面 content 尺寸变更时,LayoutComponent组件改变 pageData 中的 SIZE
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="agul-page-container-content">
        {_.isEmpty(routes) ? null : <Navigation routes={routes || []} />}
        {show ? (
          <LayoutComponent data={cards} hasGlobalSize={hasGlobalSize} />
        ) : null}
      </div>
    </Suspense>
  );
};
const PageContainer: React.FC<{
  data: any;
  widgets?: Record<string, ComponentType<any>>;
  buttonCodes?: Array<string>;
}> = ({ data, widgets }) => {
  return (
    <div className="agul-page-container">
      <GlobalProvider data={data?.pageData}>
        <WidgetsContext.Provider value={widgets}>
          <PageContent
            cards={data?.cards}
            routes={data?.routes}
            hasGlobalTime={!!data?.pageData?.TIME}
            hasGlobalSize={!!data?.pageData?.SIZE}
          />
        </WidgetsContext.Provider>
      </GlobalProvider>
    </div>
  );
};
export default PageContainer;
