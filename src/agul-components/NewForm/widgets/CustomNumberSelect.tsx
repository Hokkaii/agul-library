import { useState, useEffect } from "react";
import { useUpdateEffect } from "ahooks";
import { Select } from "antd";
import _ from "lodash";
import useNewRequest from "@/agul-hooks/useNewRequest";
import { SelectMultipleMode } from "@/agul-utils/constant";

const CustomNumberSelect = (props: any) => {
  const {
    onChange,
    value,
    disabled,
    schema: { treeData, dependencies },
    addons: { dataPath, getFieldError, dependValues = [], isFieldsTouched },
    allowClear,
    placeholder,
    mode,
  } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const request = useNewRequest();
  const getData = () => {
    const params = treeData?.params ? treeData?.params : {};
    _.forEach(dependencies, (item, index) => {
      if (dependValues[index]) {
        _.set(params, _.last(item.split(".")) as string, dependValues[index]);
      }
    });
    setLoading(true);
    request(treeData?.url, {
      method: "get",
      params,
    })
      .then((res) => {
        const data = _.map(_.get(res, treeData?.path || "data", []), (x) => ({
          label: String(_.get(x, treeData?.labelField || "name")),
          value: Number(_.get(x, treeData?.valueField || "id")),
        }));
        setDataSource(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setDataSource([]);
        setLoading(false);
      });
  };
  useEffect(() => {
    getData();
  }, []);
  useUpdateEffect(() => {
    if (isFieldsTouched()) {
      onChange(undefined);
    }
    getData();
  }, dependValues);
  return (
    <Select
      mode={mode === SelectMultipleMode ? mode : undefined}
      status={!_.isEmpty(getFieldError(dataPath)) ? "error" : ""}
      style={{ width: "100%" }}
      value={value}
      onChange={onChange}
      disabled={disabled}
      options={dataSource}
      allowClear={!!allowClear}
      placeholder={placeholder}
      loading={loading}
    />
  );
};
export default CustomNumberSelect;
