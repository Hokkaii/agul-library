import { RequestOptionsInit } from "umi-request";
export type RequestParamsProps = {
  needSign?: boolean;
  requestOptions?: RequestOptionsInit;
};
export type RequestTypes = "get" | "post" | "delete" | "put";
