import { ReactNode } from "react";
export type DetailProps = {
  dataSource?: Record<string, any>;
  url?: string;
  field?: string;
  path?: string;
  method?: "get" | "post";
  params?: Record<string, any>;
  names: Record<string, ReactNode>;
  enums?: Record<string, ReactNode>;
  tableConfig?: Record<
    string,
    { columns: any[]; childTable?: { field: string; columns: any[] } }
  >;
  objectConfig?: Record<
    string,
    {
      names: Record<string, ReactNode>;
      tableConfig?: Record<
        string,
        { columns: any[]; childTable?: { field: string; columns: any[] } }
      >;
      enums?: Record<string, ReactNode>;
    }
  >;
  init?: (data: any) => void;
  extraButtons?: ReactNode[];
  getDetail?: (data: any) => void;
};
export type CommonProps = {
  names: Record<string, ReactNode>;
  enums?: Record<string, ReactNode>;
  tableConfig?: Record<string, any>;
  objectConfig?: Record<string, any>;
  init?: (data: any) => void;
  extraButtons?: ReactNode[];
  getDetail?: (data: any) => void;
};
export type UrlDetailProps = {
  url: string;
  field?: string;
  path?: string;
  method?: "get" | "post";
  params?: Record<string, any>;
} & CommonProps;
export type DataDetailProps = {
  url?: never;
  dataSource: Record<string, any>;
} & CommonProps;
export type ModalDetailProps = {
  width?: string | number;
  height?: string | number;
  title?: ReactNode;
  open: boolean;
  onCancel: () => void;
  detail: DetailProps;
};
