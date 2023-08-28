import CodeMirror from "@uiw/react-codemirror";
import { useEffect, useState } from "react";
import _ from "lodash";
import Loading from "@/agul-methods/Loading";
import useNewRequest from "@/agul-hooks/useNewRequest";
import { FileParseProps } from "@/agul-types/fileParse";

const FileParse: React.FC<FileParseProps> = ({
  url,
  method,
  params = {},
  dataSource = "",
  width = "100%",
  height,
  autoUpdate = false,
  ...otherProps
}) => {
  const [data, setData] = useState<string>(dataSource);
  const request = useNewRequest();
  useEffect(() => {
    if (url) {
      const reqData: any = {
        method: method || "get",
        responseType: "text",
      };
      if (method === "post") {
        reqData.data = params;
      } else {
        reqData.params = params;
      }
      Loading.show();
      request(url, reqData)
        .then((res: any) => {
          setData(res);
          Loading.hide();
        })
        .catch(() => {
          Loading.hide();
        });
    }
  }, [url]);
  return (
    <div className="agul-file-container">
      <CodeMirror
        value={data}
        editable={false}
        height={height}
        placeholder="暂无数据"
        width={width}
        className="code-editor-content"
        {...otherProps}
      />
    </div>
  );
};

export default FileParse;
