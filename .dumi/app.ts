import React from "react";
import { ConfigProvider } from "agul-ui";
export function rootContainer(container: any) {
  return React.createElement(
    ConfigProvider,
    {
      needReqSign: false,
      loadingContainerId: "agul-ui-root",
      reqOptions: {
        credentials: "omit",
      },
    },
    React.createElement(
      "div",
      {
        id: "agul-ui-root",
        // style: { padding: 20 },
      },
      container
    )
  );
}
