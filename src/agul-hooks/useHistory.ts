import _ from "lodash";
import * as ReactRouterDom from "react-router-dom";

export default () => {
  const history = _.get(ReactRouterDom as any, "useNavigate")
    ? _.get(ReactRouterDom as any, "useNavigate")()
    : _.get(ReactRouterDom as any, "useHistory")();
  return (ReactRouterDom as any)?.useNavigate
    ? {
        push(path: string) {
          history(path);
        },
        replace(path: string) {
          history(path, { replace: true });
        },
        goBack() {
          history(-1);
        },
      }
    : {
        push(path: string) {
          history.push(path);
        },
        replace(path: string) {
          history.replace(path);
        },
        goBack() {
          history.goBack();
        },
      };
};
