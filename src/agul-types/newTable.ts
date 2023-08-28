import type { PaginationProps } from "antd";
import { ReactNode, ComponentType, Ref, CSSProperties } from "react";
import { DetailProps } from "./detail";
export type Params = Record<string, any>;
export type AddButtonProps = {
  type: "add";
  routerPath?: string;
  field?: string;
  url?: string;
  method?: "put" | "post";
  text?: ReactNode;
  reset?: boolean;
  width?: string | number;
  height?: string | number;
  schema?: any;
  widgets?: Record<string, ComponentType<any>>;
  condition?: "string";
  props?: Record<string, any>;
};
export type EditButtonProps = {
  type: "edit";
  routerPath?: string;
  field?: string;
  url?: string;
  method?: "put" | "post";
  detailUrl?: string;
  detailMethod?: "get" | "post";
  detailPath?: string;
  text?: ReactNode;
  reset?: boolean;
  width?: string | number;
  height?: string | number;
  schema?: any;
  widgets?: Record<string, ComponentType<any>>;
  condition?: "string";
  props?: Record<string, any>;
};
export type ShowButtonProps = {
  type: "detail";
  routerPath?: string;
  field?: string;
  url?: string;
  path?: string;
  method?: "get" | "post";
  text?: ReactNode;
  width?: string | number;
  height?: string | number;
  condition?: "string";
  props?: Record<string, any>;
  detailConfig?: DetailProps;
};
export type DeleteButtonProps = {
  type: "delete";
  url: string;
  field: string;
  msg?: ReactNode;
  method?: "get" | "post" | "delete" | "put";
  reset?: boolean;
  text?: ReactNode;
  condition?: "string";
  props?: Record<string, any>;
};
export type DownloadButtonProps = {
  type: "download";
  headers?: Record<string, any>;
  url?: string;
  field?: string;
  filename?: string;
  text?: ReactNode;
  method?: "get" | "post";
  condition?: "string";
  props?: Record<string, any>;
};
export type CustomButtonProps = {
  type: "custom";
  widget: ComponentType<any> | ReactNode;
  condition?: "string";
};
export type OperateProps = {
  mode?: "icon" | "text";
  conditionStyle?: "gap" | "all";
  buttons: Array<
    | AddButtonProps
    | EditButtonProps
    | ShowButtonProps
    | DeleteButtonProps
    | DownloadButtonProps
    | CustomButtonProps
  >;
};
export type ChidTableProps = {
  columns: any[];
  field: string;
};
type WidthProp = { width: "string" | "number" };
export type NewTableProps = {
  url: string;
  path?: string;
  pagePath?: string;
  params?: Params;
  method?: "get" | "post";
  columns: any[];
  rowSelect?: boolean | WidthProp;
  operate?: OperateProps;
  forwordRef?: Ref<unknown>;
  needOrder?: boolean;
  childTable?: ChidTableProps;
  height?: number;
  rowKey?: string | ((row: any) => string);
  colConfig?: any[];
  colConfigBox?: string | HTMLElement;
  exportBtn?: any;
  exportBox?: string | HTMLElement;
  extraPagination?: PaginationProps;
  bordered?: boolean;
  footer?: () => ReactNode;
  title?: () => ReactNode;
  summary?: (row: any) => ReactNode;
  showHeader?: boolean;
  size?: "large" | "middle" | "small";
  style?: CSSProperties;
};
export type AddBtnProps = {
  routerPath?: string;
  url?: string;
  method?: "put" | "delete" | "get" | "post";
  text?: ReactNode;
  width?: string | number;
  height?: string | number;
  schema?: any;
  widgets?: Record<string, ComponentType<any>>;
  props?: Record<string, any>;
};
export type TableWithFormWProps = {
  url: string;
  method?: "get" | "post";
  path?: string;
  pagePath?: string;
  columns: any;
  childTable?: any;
  style?: CSSProperties;
  rowSelect?: boolean;
  schema: any;
  widgets?: any;
  addBtn?: AddBtnProps;
  extraBtns?: Array<ComponentType<any> | ReactNode>;
  tableOperate?: OperateProps;
  colConfig?: any;
  exportBtn?: any;
  needOrder?: boolean;
  tableHeight?: number;
  params?: Record<string, any>;
  tableRef?: any;
};
