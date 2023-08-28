import { useEffect, useState, useContext } from "react";
import _ from "lodash";
import { Cascader } from "antd";
import useNewRequest from "@/agul-hooks/useNewRequest";

const BoxStyle = { width: "100%", display: "flex" };
const CascaderStyle = { flexGrow: "1" };
function getCascaderData(
  data: any,
  labelFields: string[],
  valueFields: string[],
  childrenField: string,
  level: number = 0
) {
  _.forEach(labelFields, () => {
    for (let z = 0; z < data.length; z++) {
      const y = data[z];
      y.label = _.get(y, labelFields[level]);
      y.value = _.get(y, valueFields[level]);
      if (level < labelFields.length - 1 && !_.isEmpty(y[childrenField])) {
        y.children = getCascaderData(
          y[childrenField],
          labelFields,
          valueFields,
          childrenField,
          level + 1
        );
      } else {
        delete y[childrenField];
      }
    }
  });
  return data;
}

const CustomCascader = (props: any) => {
  const {
    addons: { getFieldError },
    schema: { treeData },
    id,
    disabled,
    onChange,
    value,
    placeholder,
  } = props;
  const [cascaderOptions, setCascaderOptions] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const request = useNewRequest();
  useEffect(() => {
    setLoading(true);
    request(treeData?.url, {
      method: "get",
    })
      .then((res) => {
        setLoading(false);
        const treeValue = _.get(res, treeData?.path || "data", []);
        if (treeValue) {
          setCascaderOptions(
            getCascaderData(
              treeValue,
              treeData?.labelFields,
              treeData?.valueFields,
              treeData?.childrenField || "children"
            )
          );
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });
  }, []);
  const toChange = (value: string[]): void => {
    if (value) {
      onChange(value);
    } else {
      onChange(undefined);
    }
  };
  return (
    <div id="agul-ui-newform-cascader-container" style={BoxStyle}>
      <Cascader
        status={!_.isEmpty(getFieldError(id)) ? "error" : ""}
        options={cascaderOptions}
        value={value}
        onChange={toChange as any}
        style={CascaderStyle}
        disabled={disabled}
        placeholder={placeholder}
        loading={loading}
      />
    </div>
  );
};
export default CustomCascader;
