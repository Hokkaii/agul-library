import { useState, useEffect } from "react";
import { useUpdateEffect } from "ahooks";
import { TreeSelect } from "antd";
import useNewRequest from "@/agul-hooks/useNewRequest";
import _ from "lodash";
import { getTreeData } from "@/agul-utils/utils";
const { SHOW_CHILD } = TreeSelect;
const CustomTreeSelect = (props: any) => {
  const {
    onChange,
    value,
    disabled,
    schema: { treeData, dependencies },
    addons: { dependValues = [], isFieldsTouched },
    placeholder,
  } = props;
  const [treeDataSource, setTreeDataSource] = useState<any[]>([]);
  const request = useNewRequest();
  const getData = () => {
    const params = treeData?.params ? treeData?.params : {};
    _.forEach(dependencies, (item, index) => {
      if (dependValues[index]) {
        _.set(params, _.last(item.split(".")) as string, dependValues[index]);
      }
    });
    request(treeData?.url, {
      method: "get",
      params,
    })
      .then((res) => {
        const treeValue = _.get(res, treeData?.path, []);
        if (treeValue) {
          setTreeDataSource(
            getTreeData(treeValue, treeData?.labelField, treeData?.valueField)
          );
        }
      })
      .catch((err) => {
        console.log(err.message);
        setTreeDataSource([]);
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
    <TreeSelect
      disabled={disabled}
      treeData={treeDataSource}
      value={value}
      onChange={onChange}
      treeCheckable
      showCheckedStrategy={SHOW_CHILD}
      placeholder={placeholder}
      style={{
        width: "100%",
      }}
      treeDefaultExpandAll
    />
  );
};
export default CustomTreeSelect;
