import React, { CSSProperties } from "react";
import "./common.less";
const VideoCard: React.FC<{
  data: any;
  style: CSSProperties;
}> = ({ data, style }) => {
  const params = data?.component || {};
  const { url, value = {} } = params;
  return (
    <div className="agul-video-card" style={style}>
      <video
        controls
        style={style}
        className="agul-video-card"
        src={url}
        {...value}
      ></video>
    </div>
  );
};

export default VideoCard;
