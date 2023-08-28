import { useState } from "react";
import { Select } from "antd";
import { SelectMultipleMode } from "@/agul-utils/constant";
import useNewRequest from "@/agul-hooks/useNewRequest";
import _ from "lodash";

function getStr(data: any, fields: any[]) {
  const obj: any = {};
  _.forEach(fields, (item) => {
    obj[item] = data[item];
  });
  return JSON.stringify(obj);
}
const SearchInput = (props: any) => {
  const {
    onChange,
    value,
    disabled,
    schema: { treeData, dependencies },
    addons: { dataPath, getFieldError, dependValues },
    allowClear,
    placeholder,
    mode,
  } = props;
  const [dataSource, setDataSource] = useState<any[]>([]);
  const request = useNewRequest();
  const fetch = (keyword: string) => {
    const params = treeData?.params ? treeData?.params : {};
    _.forEach(dependencies, (item, index) => {
      if (dependValues[index]) {
        _.set(params, _.last(item.split(".")) as string, dependValues[index]);
      }
    });
    _.set(
      params,
      treeData?.keywordField ? treeData?.keywordField : "keyword",
      keyword
    );
    request(treeData?.url, {
      method: "get",
      params,
    })
      .then((res) => {
        const data = _.map(_.get(res, treeData?.path || "data", []), (x) => ({
          label: String(_.get(x, treeData?.labelField || "name")),
          value: String(_.get(x, treeData?.valueField || "id")),
        }));
        setDataSource(data);
      })
      .catch(() => {
        setDataSource([]);
      });
  };
  const handleSearch = (newValue: string) => {
    if (newValue) {
      fetch(newValue);
    } else {
      setDataSource([]);
    }
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);
  };

  return (
    <Select
      mode={mode === SelectMultipleMode ? mode : undefined}
      status={!_.isEmpty(getFieldError(dataPath)) ? "error" : ""}
      showSearch
      style={{ width: "100%" }}
      value={value}
      placeholder={placeholder}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={_.debounce(handleSearch, 200)}
      onChange={handleChange}
      notFoundContent={null}
      options={dataSource}
      disabled={disabled}
      allowClear={allowClear}
    />
  );
};

export default SearchInput;
