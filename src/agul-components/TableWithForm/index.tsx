import ModalWithForm from '@/agul-components/ModalWithForm';
import NewForm from '@/agul-components/NewForm';
import NewTable from '@/agul-components/NewTable';
import useHistory from '@/agul-hooks/useHistory';
import useNewRequest from '@/agul-hooks/useNewRequest';
import GloablLoading from '@/agul-methods/Loading';
import Message from '@/agul-methods/Message';
import { TableWithFormWProps } from '@/agul-types/newTable';
import { isValidElement } from '@/agul-utils/utils';
import { Button } from 'antd';
import _ from 'lodash';
import {
  ComponentType,
  ReactNode,
  // CSSProperties,
  createElement,
  useMemo,
  useRef,
  useState,
} from 'react';
import './styles.less';

const DefaultModalConfig = {
  title: '',
  open: false,
  onSuccess: () => {},
  onCancel: () => {},
  readonly: false,
  schema: {},
  formData: {},
  widgets: {},
};
const TableWithForm: React.FC<TableWithFormWProps> = ({
  url,
  method = 'get',
  path = 'data',
  pagePath = 'pageable',
  columns = [],
  childTable,
  rowSelect = false,
  schema,
  style,
  widgets,
  addBtn,
  extraBtns = [],
  tableOperate,
  colConfig,
  exportBtn,
  needOrder = false,
  tableHeight,
  params = {},
  tableRef,
}) => {
  const formRef = useRef<any>(null);
  const modalFormRef = useRef<any>(null);
  const [modalConfig, setModalConfig] = useState<any>(DefaultModalConfig);
  const [extraParams, setExtraParams] = useState<any>({});
  const toSubmit = () => {
    formRef?.current
      ?.validate()
      .then((res: any) => {
        if (!res?.errors || !res?.errors?.length) {
          setExtraParams(_.pickBy(res, (item) => !_.isNil(item)));
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  const showTableRef = useRef<boolean>(false);
  const onMount = () => {
    toSubmit();
    showTableRef.current = true;
  };
  const history = useHistory();
  const request = useNewRequest();

  const reset = () => {
    formRef?.current?.resetFields();
    setExtraParams({});
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
              console.error('缺失新增url');
              return;
            }
            GloablLoading.show();
            request(addBtn?.url, {
              method: addBtn?.method ? addBtn?.method : 'post',
              data: res,
            })
              .then(() => {
                GloablLoading.hide();
                Message.success({
                  title: '操作成功',
                });
                setModalConfig(DefaultModalConfig);
                reset();
              })
              .catch((err) => {
                GloablLoading.hide();
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
      width: addBtn?.width,
      height: addBtn?.height,
      open: true,
      schema: addBtn?.schema,
      widgets: addBtn?.widgets,
      onSuccess: callback,
      onCancel: () => setModalConfig(DefaultModalConfig),
      readonly: false,
    });
  };
  const configBox = useRef(null);
  const currentParams = useMemo(() => {
    return { ...params, ...extraParams };
  }, [extraParams]);
  const paramsRef = useRef({});
  const onChange = (data: any) => {
    paramsRef.current = { ...params, ...data };
  };
  const getParams = () => paramsRef.current;
  return (
    <div className="agul-table-with-form-container" style={style}>
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
        <div className="agul-table-with-operate-box" ref={configBox}>
          <Button onClick={() => toSubmit()}>查询</Button>
          {addBtn ? (
            <Button type="primary" onClick={toAdd} {...addBtn?.props}>
              {addBtn?.text || '新建'}
            </Button>
          ) : null}
          {_.map(extraBtns, (com) =>
            typeof com === 'function'
              ? createElement(com as ComponentType<any>, {
                  reset,
                  update: toSubmit,
                  getParams,
                })
              : isValidElement(com) || _.isString(com) || _.isNumber(com)
              ? (com as ReactNode)
              : null,
          )}
        </div>
      </div>
      {showTableRef?.current ? (
        <NewTable
          rowKey="id"
          url={url}
          params={currentParams}
          columns={columns}
          operate={tableOperate}
          colConfig={colConfig}
          path={path}
          pagePath={pagePath}
          rowSelect={rowSelect}
          exportBtn={exportBtn}
          childTable={childTable}
          needOrder={needOrder}
          method={method}
          colConfigBox={configBox.current as any}
          exportBox={configBox.current as any}
          height={tableHeight}
          ref={tableRef}
        />
      ) : null}

      <ModalWithForm {...modalConfig} ref={modalFormRef} />
    </div>
  );
};
export default TableWithForm;
