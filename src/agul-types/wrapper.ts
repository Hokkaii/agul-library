import { CSSProperties } from "react";
import { NavigationProps } from "@/agul-types/navigation";

export type WrapperProps = {
  children: any;
  style?: CSSProperties;
  className?: string;
  navigation?: NavigationProps;
};
