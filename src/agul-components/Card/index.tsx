import React from "react";
import {
  CloseCircleOutlined,
  MinusCircleOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { RGL_LAYOUT_TYPE } from "@/agul-utils/constant";
import RenderCard from "./RenderCard";
import "./common.less";

const CommonCard: React.FC<{
  data: any;
  layoutType: string;
}> = ({ data, layoutType }) => {
  const contentRef = React.useRef<any>();
  const [boxStyle, setBoxStyle] = React.useState({
    min: false,
    style: { borderWidth: data.border + "px" },
  });
  // console.log(boxStyle);
  const [show, setShow] = React.useState(true);
  return show ? (
    <div className="agul-card-wrapper">
      {boxStyle.min ? (
        <Button
          onClick={() => {
            setBoxStyle((state) => {
              return {
                ...state,
                min: false,
                style: {
                  ...state.style,
                  transform: "scale(1)",
                },
              };
            });
          }}
        >
          show
        </Button>
      ) : (
        <div className="agul-card-operation">
          {data.close ? (
            <CloseCircleOutlined onClick={() => setShow(false)} />
          ) : null}
          {data.max ? (
            <FullscreenOutlined
              onClick={() => {
                contentRef.current.requestFullscreen();
              }}
            />
          ) : null}
          {data.min ? (
            <MinusCircleOutlined
              onClick={() => {
                setBoxStyle((state) => {
                  return {
                    ...state,
                    min: true,
                    style: {
                      ...state.style,
                      transform: "scale(0)",
                    },
                  };
                });
              }}
            />
          ) : null}
        </div>
      )}
      <div
        className="agul-card-content"
        style={{
          ...boxStyle.style,
          position: layoutType === RGL_LAYOUT_TYPE ? "absolute" : "static",
          height: layoutType === RGL_LAYOUT_TYPE ? "100%" : "auto",
        }}
        ref={contentRef}
      >
        {RenderCard(data, layoutType)}
      </div>
    </div>
  ) : null;
};

export default CommonCard;
