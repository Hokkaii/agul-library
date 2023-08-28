import { ReactNode, ComponentType, CSSProperties } from "react";
import type { Options } from "scroll-into-view-if-needed";
import type { ConfigProviderProps } from "antd/es/config-provider";

export interface ListOperate {
  btnType: "text" | "icon";
  hideMove: boolean;
}
export interface GlobalConfig {
  listOperate: ListOperate;
  /** 列表校验气泡模式*/
  listValidatePopover: boolean;
  mustacheDisabled: boolean;
}

export type NewFormProps = {
  schema: any;
  disabled?: boolean;
  forwordRef?: any;
  formData?: Record<string, any>;
  submitText?: ReactNode;
  cancelText?: ReactNode;
  extraButtons?: ReactNode[];
  widgets?: Record<string, ComponentType<any> | string>;
  watch?: Record<
    string,
    (val: any) => void | { handler: (val: any) => void; immediate?: boolean }
  >;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  onChange?: (data: any) => void;
  onMount?: () => void;
  displayType?: "column" | "row" | "inline";
  labelAlign?: "left" | "right";
  colon?: boolean;
  globalConfig?: GlobalConfig;
  globalProps?: Record<string, any>;
  removeHiddenData?: boolean;
  readOnly?: boolean;
  classNames?: string;
  style?: CSSProperties;
  column?: number;
  scrollToFirstError?: Options | boolean;
  locale?: "zh-CN" | "en-US";
  configProvider?: ConfigProviderProps;
  validateMessages?: Record<string, string>;
  id?: string;
};
export type ModalFormProps = {
  width?: string | number;
  height?: string | number;
  title: ReactNode | null | string;
  open: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  disabled?: boolean;
  schema: any;
  widgets?: Record<string, ComponentType<any> | string>;
  formData?: Record<string, any>;
  forwordRef?: any;
};
