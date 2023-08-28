// ** 红旗专用组件 **
import { message, Alert } from "antd";
import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { CSSProperties } from "react";
import { MsgProps } from "@/agul-types/message";
import "./index.less";

const TitleStyle: CSSProperties = {
  fontWeight: 700,
  color: "#000",
  textAlign: "left",
  fontSize: 14,
  width: "100%",
};
const SubTitleStyle: CSSProperties = {
  color: "#888",
  textAlign: "left",
  fontSize: 14,
  width: "100%",
};
const TextEllipsisStyle: CSSProperties = {
  width: 600,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};
const SuccessAlertStyle: CSSProperties = {
  width: 700,
  backgroundColor: "#f1fbf8",
  borderColor: "#17b88c",
  borderRadius: 0,
  borderWidth: 1,
  borderStyle: "solid",
  padding: "10px 16px",
};
const ErrorAlertStyle: CSSProperties = {
  width: 700,
  backgroundColor: "#fef0f1",
  borderColor: "#e60012",
  borderRadius: 0,
  borderWidth: 1,
  borderStyle: "solid",
  padding: "10px 16px",
};
const SuccessIconStyle: CSSProperties = {
  color: "#17b88c",
  fontSize: 45,
  marginRight: 20,
};
const ErrorIconStyle: CSSProperties = {
  color: "#e60012",
  fontSize: 45,
  marginRight: 20,
};
const AlertContentStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
};

export default {
  error({ title, subTitle, duration = 1 }: MsgProps) {
    message.open({
      icon: null,
      duration,
      className: "agul-message-content",
      content: (
        <Alert
          style={ErrorAlertStyle}
          closable
          description={
            <div style={AlertContentStyle}>
              <ExclamationCircleFilled style={ErrorIconStyle} />
              <div>
                <div
                  style={{
                    ...TitleStyle,
                    ...TextEllipsisStyle,
                  }}
                >
                  {title}
                </div>
                {subTitle ? (
                  <div
                    style={{
                      ...SubTitleStyle,
                      ...TextEllipsisStyle,
                    }}
                  >
                    {subTitle}
                  </div>
                ) : null}
              </div>
            </div>
          }
        />
      ),
    });
  },
  success({ title, subTitle, duration = 1 }: MsgProps) {
    message.open({
      icon: null,
      duration,
      className: "agul-message-content",
      content: (
        <Alert
          style={SuccessAlertStyle}
          description={
            <div style={AlertContentStyle}>
              <CheckCircleFilled style={SuccessIconStyle} />
              <div>
                <div
                  style={{
                    ...TitleStyle,
                    ...TextEllipsisStyle,
                  }}
                >
                  {title}
                </div>
                {subTitle ? (
                  <div
                    style={{
                      ...SubTitleStyle,
                      ...TextEllipsisStyle,
                    }}
                  >
                    {subTitle}
                  </div>
                ) : null}
              </div>
            </div>
          }
        />
      ),
    });
  },
};
