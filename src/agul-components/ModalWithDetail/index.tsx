import React, { CSSProperties } from "react";
import { Modal } from "antd";
import _ from "lodash";
import Detail from "@/agul-components/Detail";
import { ModalDetailProps } from "@/agul-types/detail";

const modalContentStyle: CSSProperties = {
  height: "70vh",
  overflowY: "auto",
  padding: "14px",
};
const ModalWithDetail: React.FC<ModalDetailProps> = ({
  title,
  onCancel,
  open,
  detail,
  width = "40vw",
  height = "45vh",
}) => {
  return (
    <Modal
      width={width}
      open={open}
      title={title || "详情"}
      onCancel={onCancel}
      destroyOnClose
      footer={null}
      centered
    >
      <div style={{ ...modalContentStyle, height }}>
        <Detail {...(detail as any)} />
      </div>
    </Modal>
  );
};

export default ModalWithDetail;
