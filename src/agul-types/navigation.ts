import { CSSProperties, ReactNode } from "react";
export type RouterProps = Array<{ name: string; path: string }>;
export type NavigationProps = {
  routes: RouterProps;
  style?: CSSProperties;
  prefix?: ReactNode;
};
