import { Modal } from 'antd';
import React, { CSSProperties, forwardRef } from 'react';
// import _ from "lodash";
import NewForm from '@/agul-components/NewForm';
import { ModalFormProps } from '@/agul-types/form';

const modalContentStyle: CSSProperties = {
  overflowY: 'auto',
  padding: '14px',
};

const ModalWithForm: React.FC<ModalFormProps> = ({
  width = '40vw',
  height = '45vh',
  title,
  onSuccess,
  onCancel,
  schema,
  widgets,
  disabled = false,
  open,
  formData,
  forwordRef,
}) => {
  return (
    <Modal
      width={width}
      open={open}
      title={title}
      onOk={onSuccess}
      onCancel={onCancel}
      destroyOnClose
      centered
    >
      <div style={{ ...modalContentStyle, height }}>
        <NewForm
          schema={schema}
          disabled={disabled}
          ref={forwordRef}
          formData={formData}
          widgets={widgets}
        />
      </div>
    </Modal>
  );
};

export default forwardRef((props: ModalFormProps, ref: any) => (
  <ModalWithForm {...props} forwordRef={ref} />
));
