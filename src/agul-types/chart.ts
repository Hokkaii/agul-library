import { CSSProperties, ComponentType } from "react";

export type FormConfigProps = {
  schema: any;
  widgets?: Record<string, ComponentType<any> | string>;
  style?: CSSProperties;
};
export type ChartProps = {
  multipleConfig?: Record<string, any>[];
  option?: any;
  getOption?: any;
  url?: string;
  path?: string;
  method?: "get" | "post";
  params?: Record<string, any>;
  formConfig?: FormConfigProps;
};
