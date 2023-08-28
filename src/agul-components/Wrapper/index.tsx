import classnames from "classnames";
import { WrapperProps } from "@/agul-types/wrapper";
import Navigation from "@/agul-components/Navigation";
export default ({ children, style, className, navigation }: WrapperProps) => {
  return (
    <div
      className={classnames("agul-wrapper-container", className)}
      style={style}
    >
      {navigation ? <Navigation {...navigation} /> : null}
      {children}
    </div>
  );
};
