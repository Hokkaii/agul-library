/**
 * @author: hujunlei
 * @desc: 此组件在antd-table基础上集成一些常用功能进行了二次封装，只需传入url、path等必要参数即可实现整个table业务。主要功能有：分页、排序、文本超出省略号、hover显示、checked（开发者在外部需要使用ref来获取checked数据）、定制化操作栏等。
 * @params data:固定数据,url:请求地址 columns:antd表格配置项  path:数据在服务器出参中的路径   pagePath:分页数据在服务器出参中的路径 rowSelect:是否可以check选择数据  params请求参数(get请求) operate:最右侧操作栏,needOrder:是否需要编号列,childTable:子表格字段名
 */
import {
  FC,
  CSSProperties,
  useEffect,
  useMemo,
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  useContext,
  createElement,
} from "react";
import { createPortal } from "react-dom";
import _ from "lodash";
import useHistory from "@/agul-hooks/useHistory";
import {
  Table,
  Checkbox,
  Divider,
  message,
  Input,
  Select,
  Button,
  Modal,
  Space,
  Row,
  Col,
  DatePicker,
} from "antd";
import Message from "@/agul-methods/Message";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useUpdateEffect } from "ahooks";
import ModalWithForm from "@/agul-components/ModalWithForm";
import ModalDetail from "@/agul-components/ModalWithDetail";
import {
  timeUtcOffect,
  filterFormData,
  isObject,
  isDOM,
  isValidElement,
} from "@/agul-utils/utils";
import useNewRequest from "@/agul-hooks/useNewRequest";
import { WidgetsContext } from "@/agul-utils/context";
import moment from "moment";
import EmptyImg from "../../agul-assets/imgs/empty.png";
import {
  NewTableProps,
  Params,
  AddButtonProps,
  EditButtonProps,
  ShowButtonProps,
  DeleteButtonProps,
  DownloadButtonProps,
} from "@/agul-types/newTable";
import GloablLoading from "@/agul-methods/Loading";
import { RegOfUrl } from "@/agul-utils/constant";
import "./index.less";

const PAGE_SIZE_OPTIONS = [8, 16, 40, 80];
const showTotal = (total: number) => `共${total}条`;
const getTag = (val: any, enums: any, tagType: any): any => {
  if (isObject(tagType)) {
    return getTag(val, enums, tagType[val]);
  } else if (_.isString(tagType)) {
    switch (tagType) {
      case "default":
        return _.isNil(val) ? null : (
          <div className="agul-newtable-defaulttag">
            {isObject(enums) ? enums[val] : val}
          </div>
        );
      case "success":
        return _.isNil(val) ? null : (
          <div className="agul-newtable-successtag">
            {isObject(enums) ? enums[val] : val}
          </div>
        );
      case "process":
        return _.isNil(val) ? null : (
          <div className="agul-newtable-processtag">
            {isObject(enums) ? enums[val] : val}
          </div>
        );
      case "error":
        return _.isNil(val) ? null : (
          <div className="agul-newtable-errortag">
            {isObject(enums) ? enums[val] : val}
          </div>
        );
      default:
        return _.isNil(val) ? null : val;
    }
  } else {
    return _.isNil(val) ? null : val;
  }
};
const { RangePicker } = DatePicker;
const getBtnText = (item: any) => {
  if (item?.text) {
    return item?.text;
  } else {
    switch (item?.type) {
      case "add":
        return "新增";
      case "edit":
        return "编辑";
      case "detail":
        return "详情";
      case "delete":
        return "删除";
      case "download":
        return "下载";
      default:
        return null;
    }
  }
};
const FooterStyle: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
};
const DeleteMessageStyle: CSSProperties = {
  fontSize: 13,
  color: "#575757",
  textAlign: "center",
};
const DeleteFooterStyle: CSSProperties = {
  margin: "30px auto 14px",
  width: 200,
  display: "flex",
  justifyContent: "space-between",
};
const evil = (data: any, strFn: string) => {
  const Fn = Function;
  return new Fn("row", "return " + strFn)(data);
};
const DefaultMsgConfig = {
  open: false,
  onOk() {},
  onCancel() {},
  msg: "",
};
const SortEnum: any = {
  descend: "desc",
  ascend: "asc",
};
const CommonColorStyle: any = {
  color: "#00b4e1",
};
const DefaultPage: any = {
  showSizeChanger: true,
  showQuickJumper: true,
  position: ["bottomRight"],
  showTotal,
  current: 1,
  pageSize: 8,
  total: 0,
  locale: {
    jump_to: "前往",
  },
  pageSizeOptions: PAGE_SIZE_OPTIONS,
};
const DefaultModalConfig = {
  title: "",
  open: false,
  onSuccess: () => {},
  onCancel: () => {},
  readonly: false,
  schema: {},
  formData: {},
  widgets: {},
};
const DefaultDetailConfig = {
  title: "",
  open: false,
  onSuccess: () => {},
  onCancel: () => {},
  detail: {},
};
const NewTable: FC<NewTableProps> = (props) => {
  const {
    url,
    method = "get",
    path = "data",
    pagePath = "pageable",
    params,
    columns = [],
    rowSelect = false,
    operate,
    forwordRef = null,
    needOrder = false,
    childTable,
    height,
    rowKey = "id",
    exportBtn,
    exportBox,
    colConfig,
    colConfigBox,
    extraPagination,
    style,
    ...otherProps
  } = props;
  const request = useNewRequest();
  const getCurrentIcon = (item: any, callback: any) => {
    const commonProps = {
      style: CommonColorStyle,
      onClick: callback,
      ...item?.props,
    };
    switch (item?.type) {
      case "add":
        return <PlusOutlined {...commonProps} />;
      case "edit":
        return <EditOutlined {...commonProps} />;
      case "detail":
        return <SearchOutlined {...commonProps} />;
      case "delete":
        return <DeleteOutlined {...commonProps} />;
      case "download":
        return <DownloadOutlined {...commonProps} />;
      default:
        return null;
    }
  };
  // 自定义列表单项信息
  const [customFilterValues, setCustomFilterValues] = useState<any>({});
  // 请求额外参数
  const [currentParams, setCurrentParams] = useState<Params | undefined>(
    params
  );
  useEffect(() => {
    setCurrentParams({ ...params, ...customFilterValues });
  }, [params]);
  // 表单弹窗
  const [modalConfig, setModalConfig] = useState<any>(DefaultModalConfig);
  // detail弹窗
  const [detailConfig, setDetailConfig] = useState<any>(DefaultDetailConfig);
  // 数据源
  const [currentData, setCurrentData] = useState<any>([]);
  // 表单引用（校验）
  const formRef = useRef<any>();
  const [pagination, setPagination] = useState({
    ...DefaultPage,
    ...extraPagination,
  });
  const paginationRef = useRef<any>({
    ...DefaultPage,
    ...extraPagination,
  });
  const reset = () => getData(DefaultPage, currentParams);
  const update = () => getData(paginationRef.current, currentParams);
  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);
  // 数据请求
  const sortValue = useRef<string>("");
  const getData = (page: any, paramsValue: any) => {
    if (!url) {
      console.warn("请给NewTable组件正确的url属性");
      return;
    }
    const { pageSize, current } = page;
    filterFormData(paramsValue);
    const currentParams = {
      ...paramsValue,
      pageSize,
      pageNumber: current,
    };
    if (sortValue.current) {
      _.set(currentParams, "sort", sortValue.current);
    }
    const params =
      method === "get"
        ? {
            params: currentParams,
          }
        : {
            data: currentParams,
          };
    if (!url) {
      console.error("缺失表格url");
      return;
    }
    GloablLoading.show();
    request(url, {
      method,
      ...params,
    })
      .then((res: any) => {
        GloablLoading.hide();
        if (needOrder) {
          setCurrentData(
            _.map(_.get(res, path, []), (item, index) => ({
              ...item,
              $order: index + 1 + (current - 1) * pageSize,
            }))
          );
        } else {
          setCurrentData(_.get(res, path, []));
        }
        setPagination((state: any) => ({
          ...state,
          pageSize: _.get(res, [pagePath, "pageSize"], 8),
          current: _.get(res, [pagePath, "pageNumber"], 1),
          total: _.get(res, [pagePath, "total"], 0),
        }));
      })
      .catch((err) => {
        console.error(err.message);
        setCurrentData([]);
        setPagination(DefaultPage);
        GloablLoading.hide();
      });
  };
  // params发生变更则立即刷新并重置页码以及排序信息
  useUpdateEffect(() => {
    getData(DefaultPage, currentParams);
    setPagination(DefaultPage);
  }, [currentParams, url]);
  // 分页逻辑

  const onChange = (page: any, filters: any, sorter: any) => {
    let sort = "";
    if (_.isArray(sorter)) {
      _.forEach(sorter, (item) => {
        sort += `${_.get(item, "field")}:${SortEnum[_.get(item, "order")]};`;
      });
    } else if (_.get(sorter, "order")) {
      sort = `${_.get(sorter, "field")}:${SortEnum[_.get(sorter, "order")]};`;
    }
    sortValue.current = sort;
    getData(page, currentParams);
  };
  // 维护checked的数据源及其变更
  const [allChecked, setAllChecked] = useState(false);
  useEffect(() => {
    const chekedAll =
      _.every(currentData, (item) => !!item.checked) && !_.isEmpty(currentData);
    setAllChecked(chekedAll);
  }, [currentData]);
  const changeChecked = (sort: any, checked: any) => {
    setCurrentData((state: any) => {
      const newState = state.map((item: any, index: number) => {
        if (index === sort) {
          return { ...item, checked };
        }
        return item;
      });
      return newState;
    });
  };
  const allChangeChecked = ({
    target: { checked },
  }: {
    target: { checked: boolean };
  }) => {
    setAllChecked(checked);
    setCurrentData((state: any) => {
      const newState = state.map((item: any) => {
        return { ...item, checked };
      });
      return newState;
    });
  };

  const history = useHistory();
  const toAdd = (operate: AddButtonProps, row: any) => {
    if (!isObject(row)) {
      row = {};
    }
    if (operate?.routerPath) {
      const url = operate?.field
        ? `${operate?.routerPath}?${operate?.field}=${_.get(
            row,
            operate?.field
          )}`
        : operate?.routerPath;
      history.push(url);
      return;
    }
    const callback = () => {
      formRef?.current
        ?.validate()
        .then((res: any) => {
          if (!res?.errors || !res?.errors?.length) {
            if (!operate?.url) {
              console.error("缺失新增url");
              return;
            }
            const url = operate?.field
              ? operate?.url.replaceAll(RegOfUrl, _.get(row, operate?.field))
              : operate?.url;
            const reqData = {
              method: operate?.method || "post",
              data: res,
            };
            if (!RegOfUrl.test(operate?.url) && operate?.field) {
              _.set(
                reqData,
                `data.${operate?.field}`,
                _.get(row, operate?.field)
              );
            }
            GloablLoading.show();
            request(url, reqData)
              .then(() => {
                GloablLoading.hide();
                Message.success({
                  title: "操作成功",
                });
                setModalConfig(DefaultModalConfig);
                operate.reset ? reset() : update();
              })
              .catch((err) => {
                GloablLoading.hide();
                console.error(err.message);
              });
          }
        })
        .catch((err: any) => {});
    };
    setModalConfig({
      title: operate?.text,
      width: operate?.width,
      height: operate?.height,
      open: true,
      onSuccess: callback,
      onCancel: () => setModalConfig(DefaultModalConfig),
      readonly: false,
      schema: operate?.schema,
      widgets: operate?.widgets,
    });
  };
  const toEdit = (operate: EditButtonProps, row: any) => {
    if (!isObject(row)) {
      row = {};
    }
    if (operate?.routerPath) {
      const url = operate?.field
        ? `${operate?.routerPath}?${operate?.field}=${_.get(
            row,
            operate?.field
          )}`
        : operate?.routerPath;
      history.push(url);
      return;
    }
    const callback = () => {
      formRef?.current
        ?.validate()
        .then((res: any) => {
          if (!res?.errors || !res?.errors?.length) {
            if (!operate?.url) {
              console.error("缺失编辑url");
              return;
            }
            const currentUrl = operate?.field
              ? operate?.url.replaceAll(RegOfUrl, _.get(row, operate?.field))
              : operate?.url;
            const reqData = {
              method: operate?.method || "put",
              data: res,
            };
            if (!RegOfUrl.test(operate?.url) && operate?.field) {
              _.set(
                reqData,
                `data.${operate?.field}`,
                _.get(row, operate?.field)
              );
            }
            GloablLoading.show();
            request(currentUrl, reqData)
              .then(() => {
                GloablLoading.hide();
                Message.success({
                  title: "操作成功",
                });
                setModalConfig(DefaultModalConfig);
                operate.reset ? reset() : update();
              })
              .catch((err) => {
                GloablLoading.hide();
                console.error(err.message);
              });
          }
        })
        .catch((err: any) => {});
    };
    if (operate?.detailUrl) {
      const detailUrl = operate?.field
        ? operate?.detailUrl!.replaceAll(RegOfUrl, _.get(row, operate?.field))
        : operate?.detailUrl;
      const reqData = {
        method: operate?.detailMethod || "get",
      };
      if (
        operate?.detailMethod === "post" &&
        !RegOfUrl.test(operate?.detailUrl) &&
        operate?.field
      ) {
        _.set(reqData, "data", {
          [operate?.field]: _.get(row, operate?.field),
        });
      }
      GloablLoading.show();
      request(detailUrl as string, reqData)
        .then((res) => {
          GloablLoading.hide();
          let data = _.get(res, operate?.detailPath || "data");
          if (!data) {
            data = {};
          }
          setModalConfig({
            title: operate?.text,
            width: operate?.width,
            height: operate?.height,
            open: true,
            onSuccess: callback,
            onCancel: () => setModalConfig(DefaultModalConfig),
            readonly: false,
            schema: operate?.schema,
            widgets: operate?.widgets,
            formData: data,
          });
        })
        .catch((err) => {
          GloablLoading.hide();
          console.error(err.message);
        });
    } else {
      setModalConfig({
        title: operate?.text,
        width: operate?.width,
        height: operate?.height,
        open: true,
        onSuccess: callback,
        onCancel: () => setModalConfig(DefaultModalConfig),
        readonly: false,
        schema: operate?.schema,
        widgets: operate?.widgets,
        formData: row,
      });
    }
  };
  const toShow = (operate: ShowButtonProps, row: any) => {
    if (!isObject(row)) {
      row = {};
    }
    if (operate?.routerPath) {
      const url = operate?.field
        ? `${operate?.routerPath}?${operate?.field}=${_.get(
            row,
            operate?.field
          )}`
        : operate?.routerPath;
      history.push(url);
      return;
    }
    if (operate?.url) {
      const detailUrl = operate?.field
        ? operate?.url!.replaceAll(RegOfUrl, _.get(row, operate?.field))
        : operate?.url;
      const reqData = {
        method: operate?.method || "get",
      };
      if (
        operate?.method === "post" &&
        !RegOfUrl.test(operate?.url) &&
        operate?.field
      ) {
        _.set(reqData, "data", {
          [operate?.field]: _.get(row, operate?.field),
        });
      }
      GloablLoading.show();
      request(detailUrl, reqData)
        .then((res: any) => {
          GloablLoading.hide();
          const detail = {
            ...operate.detailConfig,
            dataSource: _.get(res, operate?.path || "data"),
          };
          delete detail.url;
          setDetailConfig({
            title: operate?.text,
            open: true,
            width: operate?.width,
            height: operate?.height,
            onSuccess: () => setDetailConfig(DefaultDetailConfig),
            onCancel: () => setDetailConfig(DefaultDetailConfig),
            detail,
          });
        })
        .catch((err) => {
          GloablLoading.hide();
          setDetailConfig(DefaultDetailConfig);
          console.error(err.message);
        });
    } else {
      setDetailConfig({
        title: operate?.text,
        width: operate?.width,
        height: operate?.height,
        open: true,
        onSuccess: () => setDetailConfig(DefaultDetailConfig),
        onCancel: () => setDetailConfig(DefaultDetailConfig),
        detail: { ...operate, dataSource: row },
      });
    }
  };
  const [msgModalConfig, setMsgModalConfig] = useState<any>(DefaultMsgConfig);
  const toDelete = (operate: DeleteButtonProps, row: any) => {
    if (!isObject(row)) {
      row = {};
    }
    setMsgModalConfig({
      msg: operate?.msg || `确定要${operate?.text}该项吗？`,
      open: true,
      onOk() {
        if (!operate?.url) {
          console.error("缺失删除url");
          return;
        }
        const deleteUrl = operate?.url.replaceAll(
          RegOfUrl,
          _.get(row, operate?.field)
        );
        const reqData = {
          method: operate?.method || "delete",
        };
        if (
          (["put", "post"] as any).includes(operate?.method) &&
          !RegOfUrl.test(operate?.url) &&
          operate?.field
        ) {
          _.set(reqData, "data", {
            [operate?.field]: _.get(row, operate?.field),
          });
        }
        GloablLoading.show();
        request(deleteUrl as string, reqData)
          .then(() => {
            GloablLoading.hide();
            Message.success({
              title: "操作成功",
            });
            setMsgModalConfig(DefaultMsgConfig);
            operate.reset ? reset() : update();
          })
          .catch((err) => {
            GloablLoading.hide();
            console.error(err.message);
          });
      },
      onCancel: () => setMsgModalConfig(DefaultMsgConfig),
    });
  };
  const toDownload = (operate: DownloadButtonProps, row: any) => {
    if (!isObject(row)) {
      row = {};
    }
    let downloadUrl;
    const options: any = {
      getResponse: true,
      responseType: "blob",
      prefix: "",
      headers: {
        ...operate?.headers,
      },
    };
    if (operate?.url) {
      if (operate?.field) {
        if (RegOfUrl.test(operate?.url)) {
          downloadUrl = operate?.url.replaceAll(
            RegOfUrl,
            _.get(row, operate?.field)
          );
        } else if (operate?.method === "post") {
          options.method = "post";
          options.data = {
            [operate?.field]: _.get(row, operate?.field),
          };
        }
      } else {
        downloadUrl = operate?.url;
      }
    } else if (operate?.field) {
      downloadUrl = _.get(row, operate?.field);
    }
    if (!downloadUrl) {
      console.error("缺失下载地址");
      message.warn("该资源地址无效!");
      return;
    }
    let download: string;
    GloablLoading.show();
    request(downloadUrl as string, options)
      .then((res) => {
        GloablLoading.hide();
        const { data, response } = res;
        const disposition = response.headers.get("Content-Disposition");
        let str =
          typeof disposition === "string"
            ? disposition.split(";")[1]
            : row?.filename;
        let filename = "";
        if (str) {
          filename = !str.split("fileName=")[1]
            ? str.split("filename=")[1]
            : str.split("fileName=")[1];
        }
        filename =
          filename || row?.filename || row?.fileName || operate?.filename;
        download = decodeURIComponent(filename);
        if (!download) {
          Message.error({
            title: "下载错误，请联系开发人员！",
          });
          return;
        }
        const a = document.createElement("a");
        const url = window.URL.createObjectURL(data);
        a.href = url;
        a.download = download;
        a.target = "_blank";
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        GloablLoading.hide();
        console.error(err.message);
      });
  };
  // operate逻辑
  const toOperate = (item: any, row: any) => {
    switch (item?.type) {
      case "add":
        toAdd(item, row);
        return;
      case "edit":
        toEdit(item, row);
        return;
      case "detail":
        toShow(item, row);
        return;
      case "delete":
        toDelete(item, row);
        return;
      case "download":
        toDownload(item, row);
        return;
      default:
        return;
    }
  };
  //  嵌套子表格逻辑
  const expandable = useMemo(() => {
    const expandedRowRender = (record: any) => {
      _.forEach(
        _.isArray(childTable?.columns) ? [...(childTable?.columns as any)] : [],
        (item) => {
          const { render, format } = item;
          if (format) {
            item.render = render
              ? render
              : (val: any) =>
                  !_.isNil(val) ? timeUtcOffect(val).format(format) : null;
          }
        }
      );
      return (
        <div className="agul-newtbale-childtable-box">
          <Table
            dataSource={_.get(record, childTable?.field as string, [])}
            columns={
              _.isArray(childTable?.columns)
                ? [...(childTable?.columns as any)]
                : []
            }
            pagination={false}
            size="small"
          />
        </div>
      );
    };
    return {
      expandedRowRender,
      defaultExpandedRowKeys: ["0"],
    };
  }, [childTable]);
  if (childTable) {
    _.forEach(currentData, (item, index) => {
      item.key = index.toString();
    });
  }

  useImperativeHandle(forwordRef, () => exportProps, [currentData, forwordRef]);
  // 自定义列选择框确认回调
  const fitersOnchange = () => {
    setCurrentParams({ ...params, ...customFilterValues });
  };
  // 自定义列的下拉框筛选
  const getColumnsFilterDropdown = (filterProps: any, key: string) => {
    const { type, field, treeData, props } = filterProps;
    const currentField = field || key;
    switch (type) {
      case "input":
        return ({ close }: any) => (
          <div className="agul-newtable-filter-input-box">
            <Input
              allowClear
              className="agul-newtable-filter-input"
              value={customFilterValues[currentField]}
              onChange={(e) =>
                setCustomFilterValues((state: any) => ({
                  ...state,
                  [currentField]: e.target.value,
                }))
              }
              {...props}
            />
            <Button
              type="primary"
              size="small"
              onClick={() => {
                fitersOnchange();
                close();
              }}
              className="agul-newtable-filter-btn"
            >
              确认
            </Button>
          </div>
        );
      case "select":
        return ({ close }: any) => (
          <div className="agul-newtable-filter-select-box">
            <Select
              allowClear
              className="agul-newtable-filter-select"
              value={customFilterValues[currentField]}
              onChange={(value) =>
                setCustomFilterValues((state: any) => ({
                  ...state,
                  [currentField]: value,
                }))
              }
              options={treeData}
              {...props}
            />
            <Button
              type="primary"
              size="small"
              onClick={() => {
                fitersOnchange();
                close();
              }}
              className="agul-newtable-filter-btn"
            >
              确认
            </Button>
          </div>
        );
      case "checkbox":
        return ({ close }: any) => (
          <div className="agul-newtable-filter-checkbox-box">
            <Checkbox.Group
              className="agul-newtable-filter-checkbox"
              options={treeData}
              value={customFilterValues[currentField]}
              onChange={(value) =>
                setCustomFilterValues((state: any) => ({
                  ...state,
                  [currentField]: value,
                }))
              }
              {...props}
            />
            <Button
              type="primary"
              size="small"
              onClick={() => {
                fitersOnchange();
                close();
              }}
              className="agul-newtable-filter-btn"
            >
              确认
            </Button>
          </div>
        );
      case "dateRange":
        const currentValue =
          customFilterValues[
            _.get(field, [0]) ? _.get(field, [0]) : "startTime"
          ] &&
          customFilterValues[_.get(field, [1]) ? _.get(field, [1]) : "endTime"]
            ? [
                moment(
                  customFilterValues[
                    _.get(field, [0]) ? _.get(field, [0]) : "startTime"
                  ]
                ),
                moment(
                  customFilterValues[
                    _.get(field, [1]) ? _.get(field, [1]) : "endTime"
                  ]
                ),
              ]
            : [];
        return ({ close }: any) => (
          <div className="agul-newtable-filter-dateRange-box">
            <RangePicker
              allowClear
              className="agul-newtable-filter-dateRange"
              value={currentValue}
              onChange={(date: any, dateStrings: string) => {
                if (_.isEmpty(_.pickBy(dateStrings))) {
                  setCustomFilterValues((state: any) => {
                    delete state[
                      _.get(field, [0]) ? _.get(field, [0]) : "startTime"
                    ];
                    delete state[
                      _.get(field, [1]) ? _.get(field, [1]) : "endTime"
                    ];
                    return { ...state };
                  });
                } else {
                  setCustomFilterValues((state: any) => ({
                    ...state,
                    [_.get(field, [0])
                      ? _.get(field, [0])
                      : "startTime"]: moment(dateStrings[0])
                      .utcOffset(8)
                      .format(),
                    [_.get(field, [1]) ? _.get(field, [1]) : "endTime"]: moment(
                      dateStrings[1]
                    )
                      .utcOffset(8)
                      .format(),
                  }));
                }
              }}
              {...props}
            />
            <Button
              type="primary"
              size="small"
              onClick={() => {
                fitersOnchange();
                close();
              }}
              className="agul-newtable-filter-btn"
            >
              确认
            </Button>
          </div>
        );
      default:
        return ({ close }: any) => (
          <div className="agul-newtable-filter-input-box">
            <Input
              allowClear
              className="agul-newtable-filter-input"
              value={customFilterValues[currentField]}
              onChange={(e) =>
                setCustomFilterValues((state: any) => ({
                  ...state,
                  [currentField]: e.target.value,
                }))
              }
              {...props}
            />
            <Button
              type="primary"
              size="small"
              onClick={() => {
                fitersOnchange();
                close();
              }}
              className="agul-newtable-filter-btn"
            >
              确认
            </Button>
          </div>
        );
    }
  };
  // 依据配置项整形columns
  const [rowSelectShow, setRowSelectShow] = useState<boolean>(false);
  const [rowSelectItems, setRowSelectItems] = useState<any>({
    old: _.map(
      _.isArray(columns) ? [...columns] : [],
      (item) => item.dataIndex || item.key
    ),
    new: _.map(
      _.isArray(columns) ? [...columns] : [],
      (item) => item.dataIndex || item.key
    ),
  });
  const onRowConfirm = () => {
    setRowSelectItems((state: any) => ({ ...state, old: state.new || [] }));
    setRowSelectShow(false);
  };
  const onRowCancel = () => {
    setRowSelectItems((state: any) => ({ ...state, new: state.old || [] }));
    setRowSelectShow(false);
  };
  const extraColumnKeys = useMemo(() => {
    return _.map(
      _.filter(colConfig || [], (item) =>
        _.includes(rowSelectItems.old || [], item?.dataIndex || item?.key)
      ),
      (item) => item.dataIndex || item.key
    );
  }, [rowSelectItems.old]);
  const totalColumns = colConfig
    ? _.filter(_.isArray(columns) ? [...columns] : [], (item) =>
        _.includes(extraColumnKeys, item?.dataIndex || item?.key)
      )
    : _.isArray(columns)
    ? [...columns]
    : [];
  if (needOrder && !_.some(totalColumns, { dataIndex: "$order" })) {
    totalColumns.unshift({
      title: "编号",
      dataIndex: "$order",
    });
  }

  // 父组件通过ref和自定义操作栏按钮可以获取的组件组件属性，这里严格规定为checked的data和立即刷新list的方法
  const checkedData = _.filter(currentData, { checked: true });
  // ref以及自定义按钮暴露的属性
  const exportProps = {
    checkedData,
    reset,
    update,
  };
  if (rowSelect && !_.some(totalColumns, { dataIndex: "$rowSelect" })) {
    totalColumns.unshift({
      title: (
        <Checkbox
          checked={allChecked}
          onChange={allChangeChecked}
          indeterminate={!_.isEmpty(checkedData) && !allChecked}
        />
      ),
      width: _.get(rowSelect, "width", 100),
      fixed: "left",
      dataIndex: "$rowSelect",
      render: (__: any, row: any, index: number) => {
        return (
          <Checkbox
            checked={row.checked}
            onChange={({ target: { checked: value } }) =>
              changeChecked(index, value)
            }
          />
        );
      },
    });
  }
  const Widgets = useContext(WidgetsContext) as any;
  if (operate && !_.some(totalColumns, { dataIndex: "$operate" })) {
    totalColumns.push({
      title: "操作",
      dataIndex: "$operate",
      fixed: "right",
      // width:
      //   operate?.mode === "icon"
      //     ? _.get(operate, "buttons.length", 0) * 20
      //     : _.reduce(
      //         _.get(operate, "buttons"),
      //         (sum, n) =>
      //           sum +
      //           (_.get(n, "text.length")
      //             ? _.get(n, "text.length", 0) * 14
      //             : 60) +
      //           16,
      //         0
      //       ) + 32,

      render: (__: any, row: any) => {
        const currentButtons = _.filter(operate?.buttons || [], (item) => {
          if (!operate.conditionStyle || operate.conditionStyle === "gap") {
            return !item?.condition || evil(row, item.condition);
          }
          return item.condition;
        });
        return row ? (
          <div className="agul-newtable-operate-box">
            {_.map(currentButtons, (item: any, index: number) => {
              return (
                <>
                  {item?.condition && !evil(row, item.condition) ? (
                    <a
                      className="agul-ui-newtable-operate-disabled-btn"
                      href="javascript:void(0)"
                    >
                      -
                    </a>
                  ) : item?.type === "custom" ? (
                    typeof item?.widget === "string" ? (
                      Widgets && Widgets[item?.widget] ? (
                        createElement(Widgets[item?.widget], {
                          ...exportProps,
                          row,
                        })
                      ) : (
                        item?.widget
                      )
                    ) : typeof item?.widget === "function" ? (
                      createElement(item?.widget, {
                        ...exportProps,
                        row,
                      })
                    ) : isValidElement(item?.widget) ||
                      _.isString(item?.widget) ||
                      _.isNumber(item?.widget) ? (
                      item?.widget
                    ) : null
                  ) : operate?.mode === "icon" ? (
                    getCurrentIcon(
                      item,
                      _.debounce(() => toOperate(item, row), 200)
                    )
                  ) : (
                    <a
                      href="javascript:void(0)"
                      onClick={_.debounce(() => toOperate(item, row), 200)}
                      className="agul-ui-newtable-operate-btn"
                      {...item?.props}
                    >
                      {getBtnText(item)}
                    </a>
                  )}
                  {index === _.get(currentButtons, "length", 0) - 1 ? null : (
                    <Divider
                      type="vertical"
                      className={
                        item?.condition && !evil(row, item.condition)
                          ? "agul-ui-newtable-operate-disabled-divider"
                          : undefined
                      }
                    />
                  )}
                </>
              );
            })}
          </div>
        ) : null;
      },
    });
  }
  const currentColumns = _.map(totalColumns, (item) => {
    const { render, format, enums, tagType, otherFilters } = item;
    if (otherFilters) {
      item.filterDropdown = getColumnsFilterDropdown(
        otherFilters,
        item?.dataIndex || item?.key
      );
    }
    if (format) {
      return {
        ...item,
        render: render
          ? render
          : (val: any) =>
              !_.isNil(val) ? timeUtcOffect(val).format(format) : null,
      };
    }
    if (tagType) {
      return {
        ...item,
        render: render ? render : (val: any) => getTag(val, enums, tagType),
      };
    }
    if (isObject(enums)) {
      return {
        ...item,
        render: render
          ? render
          : (val: any) => (!_.isNil(val) ? enums[val] : null),
      };
    }
    return {
      ...item,
    };
  });
  const toExport = () => {
    if (!exportBtn?.url) {
      console.error("缺失导出url");
      return;
    }
    const options: any = {
      getResponse: true,
      responseType: "blob",
      prefix: "",
      headers: {
        ...exportBtn?.headers,
      },
    };
    let params = isObject(exportBtn?.params) ? exportBtn?.params : {};
    params = { ...params, ...currentParams };
    if (exportBtn?.method === "get" || !exportBtn?.method) {
      options.params = params;
    } else {
      options.method = "post";
      options.data = params;
    }
    let download: any;
    GloablLoading.show();
    request(exportBtn?.url, options)
      .then((res) => {
        GloablLoading.hide();
        const { data, response } = res;
        const disposition = response.headers.get("Content-Disposition");
        let str =
          typeof disposition === "string"
            ? disposition.split(";")[1]
            : exportBtn?.filename;
        let filename = "";
        if (str) {
          filename = !str.split("fileName=")[1]
            ? str.split("filename=")[1]
            : str.split("fileName=")[1];
        }
        filename = filename || exportBtn?.filename || exportBtn?.fileName;
        download = decodeURIComponent(filename);
        if (!download) {
          Message.error({
            title: "下载错误，请联系开发人员！",
          });
          return;
        }
        const a = document.createElement("a");
        const url = window.URL.createObjectURL(data);
        a.href = url;
        a.download = download;
        a.target = "_blank";
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        GloablLoading.hide();
        console.error(err.message);
      });
  };
  const boxRef = useRef<any>();
  const RendercolConfigBox = () => {
    if (!colConfig) {
      return null;
    } else if (isDOM(colConfigBox)) {
      return createPortal(
        <Button
          type="primary"
          onClick={() => {
            setRowSelectShow(true);
          }}
          className="agul_newtable_row_config_btn"
        >
          配置列
        </Button>,
        colConfigBox as HTMLElement
      );
    } else if (
      _.isString(colConfigBox) &&
      !!document.getElementById(colConfigBox)
    ) {
      return createPortal(
        <Button
          type="primary"
          onClick={() => {
            setRowSelectShow(true);
          }}
          className="agul_newtable_row_config_btn"
        >
          配置列
        </Button>,
        document.getElementById(colConfigBox) as HTMLElement
      );
    } else {
      return boxRef.current
        ? createPortal(
            <Button
              type="primary"
              onClick={() => {
                setRowSelectShow(true);
              }}
              className="agul_newtable_row_config_btn"
              style={{
                marginLeft: exportBtn && !exportBox ? 14 : 0,
              }}
            >
              配置列
            </Button>,
            boxRef.current
          )
        : null;
    }
  };
  const RenderExportBox = () => {
    if (!exportBtn) {
      return null;
    } else if (isDOM(exportBox)) {
      return createPortal(
        <Button
          type="primary"
          onClick={() => toExport()}
          className="agul_newtable_export_btn"
        >
          {exportBtn?.text || "导出"}
        </Button>,
        exportBox as HTMLElement
      );
    } else if (_.isString(exportBox) && !!document.getElementById(exportBox)) {
      createPortal(
        <Button
          type="primary"
          onClick={() => toExport()}
          className="agul_newtable_export_btn"
        >
          {exportBtn?.text || "导出"}
        </Button>,
        document.getElementById(exportBox) as HTMLElement
      );
    } else {
      return boxRef.current
        ? createPortal(
            <Button
              type="primary"
              onClick={() => toExport()}
              className="agul_newtable_export_btn"
            >
              {exportBtn?.text || "导出"}
            </Button>,
            boxRef.current
          )
        : null;
    }
  };
  return (
    <div className="agul-newtable-container" style={style}>
      <Modal
        width="40vw"
        open={rowSelectShow}
        title="自定义列表字段"
        onCancel={onRowCancel}
        destroyOnClose
        footer={
          <div style={FooterStyle}>
            <Space>
              <Button onClick={onRowCancel}>取消</Button>
              <Button type="primary" onClick={onRowConfirm}>
                确认
              </Button>
            </Space>
          </div>
        }
      >
        <Checkbox.Group
          value={rowSelectItems.new || []}
          onChange={(values: any) =>
            setRowSelectItems((state: any) => ({ ...state, new: values }))
          }
        >
          <Row>
            {_.map(colConfig, (item) => (
              <Col span={24}>
                <Checkbox
                  value={item?.dataIndex || item?.key}
                  style={{ marginBottom: 14 }}
                  disabled={!!item?.disabled}
                >
                  {item?.title}
                </Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Modal>
      <div
        className="agul-newtable-operate-and-export-btn-box"
        ref={boxRef}
      ></div>
      {RenderExportBox()}
      {RendercolConfigBox()}
      <Table
        scroll={{ x: "max-content", y: height }}
        dataSource={currentData}
        columns={currentColumns}
        pagination={url ? (pagination as any) : false}
        onChange={url ? onChange : () => {}}
        expandable={childTable ? expandable : undefined}
        rowKey={rowKey}
        locale={{
          emptyText: (
            <div className="agul-ui-newtable-empty">
              <img
                className="agul-ui-newtable-empty-img"
                src={EmptyImg}
                alt=""
              />
              <div className="agul-ui-newtable-empty-text">暂无数据</div>
            </div>
          ),
        }}
        {...otherProps}
      />
      <ModalWithForm {...modalConfig} ref={formRef} />
      <ModalDetail {...detailConfig} />
      <Modal
        destroyOnClose
        width="40vw"
        title="温馨提示"
        footer={null}
        {...msgModalConfig}
      >
        <div
          style={DeleteMessageStyle}
          className="agul-ui-newtable-delete-message"
        >
          {msgModalConfig?.msg}
        </div>
        <div
          className="agul-ui-newtable-delete-footer"
          style={DeleteFooterStyle}
        >
          <Button onClick={() => msgModalConfig.onCancel()}>取消</Button>
          <Button onClick={() => msgModalConfig.onOk()} type="primary">
            确认
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default forwardRef((props: NewTableProps, ref: any) => (
  <NewTable {...props} forwordRef={ref} />
));
