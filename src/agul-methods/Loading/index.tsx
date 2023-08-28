import ReactDOM from "react-dom";
import { Spin } from "antd";
import _ from "lodash";
import { isDOM } from "@/agul-utils/utils";
import { LoadingContainerId, LoadingBoxId } from "@/agul-utils/constant";
import "./index.less";

export default {
  show(container?: string | HTMLElement) {
    if (isDOM(document.getElementById(LoadingBoxId))) {
      return;
    }
    const loadingContainer = document.createElement("div");
    loadingContainer.id = LoadingBoxId;
    if (container || _.get(window, LoadingContainerId)) {
      loadingContainer.className = "agul_loading_wrap";
      this.container = container || _.get(window, LoadingContainerId);
      if (typeof this.container === "string") {
        if (isDOM(document.getElementById(this.container))) {
          (document.getElementById(
            this.container
          ) as HTMLElement).classList.add("agul_loading_wrap_parent");
          (document.getElementById(this.container) as HTMLElement).append(
            loadingContainer
          );
        } else {
          console.error(this.container + "元素不存在，无法显示loading！");
        }
      } else {
        (this.container as HTMLElement).classList.add(
          "agul_loading_wrap_parent"
        );
        (this.container as HTMLElement).append(loadingContainer);
      }
    } else {
      loadingContainer.className = "agul_loading_fixed_wrap";
      document.body.append(loadingContainer);
    }
    ReactDOM.render(<Spin size="large" />, loadingContainer);
  },
  hide() {
    if (document.getElementById(LoadingBoxId)) {
      if (this.container) {
        if (typeof this.container === "string") {
          if (isDOM(document.getElementById(this.container))) {
            (document.getElementById(
              this.container
            ) as HTMLElement).classList.remove("agul_loading_wrap_parent");
            (document.getElementById(
              this.container
            ) as HTMLElement).removeChild(
              document.getElementById(LoadingBoxId) as HTMLElement
            );
          }
        } else {
          (this.container as HTMLElement).classList.remove(
            "agul_loading_wrap_parent"
          );
          (this.container as HTMLElement).removeChild(
            document.getElementById(LoadingBoxId) as HTMLElement
          );
        }
        this.container = null;
      } else {
        document.body.removeChild(
          document.getElementById(LoadingBoxId) as HTMLElement
        );
      }
    }
  },
};
