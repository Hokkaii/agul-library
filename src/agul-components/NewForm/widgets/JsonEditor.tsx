import CodeMirror from "@uiw/react-codemirror";
// import { json } from "@codemirror/lang-json";
import _ from "lodash";
import { useEffect } from "react";
import "./CodeEditor.less";

const JsonEditor = (props: any) => {
  const {
    disabled,
    readOnly,
    value,
    onChange,
    addons: { schemaPath, setSchemaByPath },
    schema,
  } = props;
  const placeholder = _.get(
    props,
    "schema.props.placeholder",
    "请填入JSON格式的数据"
  );
  console.log(props);
  useEffect(() => {
    setSchemaByPath(schemaPath, () => ({
      ...schema,
      rules: [
        {
          validator: (options: any, value: string) => {
            if (!value) return true;
            try {
              JSON.stringify(JSON.parse(value), null, "\t");
              return true;
            } catch (error) {
              return false;
            }
          },
          message: "请填入JSON格式的数据",
        },
      ],
    }));
  }, []);
  const handleChange = (value: string) => {
    onChange(value);
  };
  return (
    <div className="agul-ui-newform-widget-code-editor">
      <CodeMirror
        value={_.isString(value) ? value : ""}
        readOnly={!!disabled || !!readOnly}
        height="200px"
        maxHeight="400px"
        width="100%"
        className="code-editor-content"
        placeholder={placeholder}
        onChange={handleChange}
      />
    </div>
  );
};
export default JsonEditor;
