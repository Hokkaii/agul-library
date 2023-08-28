import {
  useState,
  useRef,
  useMemo,
  useContext,
  createElement,
  CSSProperties,
} from "react";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import useHistory from "@/agul-hooks/useHistory";
import { Button } from "antd";
import Message from "@/agul-methods/Message";
import { v4 as uuid } from "uuid";
import NewForm from "@/agul-components/NewForm";
import NewTable from "@/agul-components/NewTable";
import ModalWithForm from "@/agul-components/ModalWithForm";
import GloablLoading from "@/agul-methods/Loading";
import { WidgetsContext } from "@/agul-utils/context";
import { RegOfUrl } from "@/agul-utils/constant";
import useNewRequest from "@/agul-hooks/useNewRequest";
import "./common.less";

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
function uploadFile(event: any, url: string, reset: () => void) {
  const file =
    event.target.files[0] || event.dataTransfer.files[0] || this.file.files[0];
  // 使用FormData方式上传，并设置相应的参数
  const fData = new FormData();
  const request = useNewRequest();
  fData.set("file", file); // 设置上传属性
  GloablLoading.show();
  if (!url) {
    console.error("缺失上传url");
    return;
  }
  request(url, {
    method: "post",
    data: fData,
  })
    .then(() => {
      Message.success({
        title: "操作成功",
      });
      reset();
      GloablLoading.hide();
    })
    .catch((err) => {
      console.error(err.message);
      GloablLoading.hide();
    });
}
const TableWithForm: React.FC<{
  data: any;
  style: CSSProperties;
}> = ({ data, style }) => {
  const location = useLocation();
  const paramObj = _.get(location, ["query"]);
  const fileRef = useRef<any>(null);
  const formRef = useRef<any>(null);
  const modalFormRef = useRef<any>(null);
  const [modalConfig, setModalConfig] = useState<any>(DefaultModalConfig);
  const [params, setParams] = useState<any>({});
  const showTableRef = useRef<boolean>(false);
  const onMount = () => {
    toSubmit();
    showTableRef.current = true;
  };
  const field = data?.component?.field;
  const url = data?.component?.url!.replaceAll(
    RegOfUrl,
    _.get(paramObj, [field])
  ) as string;
  const path = data?.component?.path;
  const pagePath = data?.component?.pagePath;
  const method = data?.component?.method;
  const columns = data?.component?.value?.tableConfig?.columns;
  const extraPagination = data?.component?.value?.tableConfig?.extraPagination;
  const childTable = data?.component?.value?.tableConfig?.childTable;
  const height = data?.component?.value?.tableConfig?.height;
  const rowKey = data?.component?.value?.tableConfig?.rowKey;
  const rowSelect = data?.component?.value?.tableConfig?.rowSelect;
  const schema = data?.component?.value?.formConfig?.schema;
  const widgets = data?.component?.value?.formConfig?.widgets;
  const addBtn = data?.component?.value?.formConfig?.addBtn;
  const exportBtn = data?.component?.value?.formConfig?.exportBtn;
  const importBtn = data?.component?.value?.formConfig?.importBtn;
  const Widgets = useContext(WidgetsContext);
  const extraBtns = data?.component?.value?.formConfig?.extraBtns || [];
  const tableOperate = data?.component?.value?.tableConfig?.operate;
  const colConfig = data?.component?.value?.tableConfig?.colConfig;
  const needOrder = data?.component?.value?.tableConfig?.needOrder;
  const request = useNewRequest();
  const history = useHistory();
  const toSubmit = () => {
    formRef?.current
      ?.validate()
      .then((res: any) => {
        if (!res?.errors || !res?.errors?.length) {
          // _.set(res, "___agul_ui_time____", new Date().getTime());
          setParams(_.pickBy(res, (item) => !_.isNil(item)));
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const reset = () => {
    formRef?.current?.resetFields();
    // setParams({ ___agul_ui_time____: new Date().getTime() });
    setParams({});
  };
  const toAdd = () => {
    if (addBtn?.routerPath) {
      history.push(addBtn?.routerPath);
      return;
    }
    const callback = () => {
      modalFormRef?.current
        ?.validate()
        .then((res: any) => {
          if (res instanceof FormData || !res?.errors || !res?.errors?.length) {
            if (!addBtn?.url) {
              console.error("缺失新增url");
              return;
            }
            request(addBtn?.url, {
              method: addBtn?.method ? addBtn?.method : "post",
              data: res,
            })
              .then(() => {
                Message.success({
                  title: "操作成功",
                });
                setModalConfig(DefaultModalConfig);
                reset();
              })
              .catch((err) => {
                console.error(err.message);
              });
          }
        })
        .catch((err: any) => {
          console.error(err.message);
        });
    };
    setModalConfig({
      title: addBtn?.text,
      open: true,
      schema: addBtn?.schema,
      widgets: addBtn?.widgets,
      onSuccess: callback,
      onCancel: () => setModalConfig(DefaultModalConfig),
      readonly: false,
    });
  };
  const toImport = () => {
    fileRef?.current?.click();
  };
  const currentParams = useMemo(() => {
    return data?.component?.params
      ? { ...data?.component?.params, ...params }
      : params;
  }, [params]);
  const paramsRef = useRef({});
  const onChange = (data: any) => {
    paramsRef.current = data?.component?.params
      ? { ...data?.component?.params, ...data }
      : data;
  };
  const getParams = () => paramsRef.current;
  const colConfigBox = uuid();
  return (
    <div className="agul-table-with-form-card" style={style}>
      {schema ? (
        <div className="agul-table-with-form-box">
          <div className="agul-table-form">
            <NewForm
              schema={schema}
              widgets={widgets}
              ref={formRef}
              onMount={onMount}
              onChange={onChange}
            />
          </div>
          <div className="agul-table-with-operate-box" id={colConfigBox}>
            <Button onClick={() => toSubmit()}>查询</Button>
            {addBtn ? (
              <Button type="primary" onClick={toAdd} {...addBtn?.props}>
                {addBtn?.text || "新建"}
              </Button>
            ) : null}
            {importBtn ? (
              <Button
                type="primary"
                onClick={() => toImport()}
                {...importBtn?.props}
              >
                {importBtn?.text || "导入"}
              </Button>
            ) : null}
            {_.map(extraBtns, (com) =>
              typeof com === "string"
                ? Widgets && Widgets[com]
                  ? createElement(Widgets[com] as any, {
                      reset,
                      update: toSubmit,
                      getParams,
                    })
                  : com
                : typeof com === "function"
                ? createElement(com as any, { reset, update: toSubmit })
                : null
            )}
          </div>
        </div>
      ) : null}
      {showTableRef.current ? (
        <NewTable
          rowKey={rowKey || "id"}
          url={url}
          params={currentParams}
          columns={columns}
          operate={tableOperate}
          colConfig={colConfig}
          path={path}
          pagePath={pagePath}
          rowSelect={rowSelect}
          childTable={childTable}
          needOrder={needOrder}
          method={method}
          colConfigBox={colConfigBox}
          exportBox={colConfigBox}
          exportBtn={exportBtn}
          extraPagination={extraPagination}
          height={height}
        />
      ) : null}
      <ModalWithForm {...modalConfig} ref={modalFormRef} />
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileRef}
        onChange={(event) => uploadFile(event, importBtn?.url, reset)}
      />
    </div>
  );
};
export default TableWithForm;
