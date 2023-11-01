import useNewRequest from '@/agul-hooks/useNewRequest';
import GloablLoading from '@/agul-methods/Loading';
import { DetailProps } from '@/agul-types/detail';
import { isObject } from '@/agul-utils/utils';
import { Descriptions, Table } from 'antd';
import _ from 'lodash';
import { CSSProperties, useEffect, useState } from 'react';
import './index.less';

const DetailStyle: CSSProperties = {
  whiteSpace: 'pre-wrap',
};
const { Item } = Descriptions;
function Detail(props: DetailProps) {
  const { dataSource = {}, url, path = 'data', method, params } = props;
  const {
    names,
    enums,
    tableConfig,
    objectConfig = {},
    init = () => {},
    extraButtons = [],
    getDetail,
  } = props;
  const [currentData, setCurrentData] = useState<any>(dataSource || {});
  const RenderContent = (
    value: any,
    key: any,
    tableConfig: any,
    enums: any,
  ) => {
    if (_.isArray(value)) {
      const childTable = _.get(tableConfig, [key, 'childTable']);
      const expandedRowRender = (record: any) => {
        return (
          <div style={{ paddingLeft: 70 }}>
            <Table
              dataSource={record[childTable?.field] || []}
              columns={
                _.isArray(childTable?.columns) ? [...childTable?.columns] : []
              }
              pagination={false}
              size="small"
            />
          </div>
        );
      };

      const expandable = {
        expandedRowRender,
        defaultExpandedRowKeys: ['0'],
      };
      if (childTable) {
        _.forEach(currentData, (item, index) => {
          item.key = index.toString();
        });
      }
      const columns = _.get(tableConfig, [key, 'columns']);
      return _.isArray(columns) ? (
        <Table
          scroll={{ x: 'max-content', y: 400 }}
          dataSource={value}
          columns={columns}
          expandable={childTable ? expandable : undefined}
        />
      ) : null;
    } else if (isObject(value)) {
      return (
        <div>
          <Descriptions column={1}>
            {_.map(value, (item, y) => {
              return objectConfig[key]?.names[y] ? (
                <Item label={<div>{objectConfig[key]?.names[y]}</div>}>
                  {RenderContent(
                    item,
                    y,
                    objectConfig[key]?.tableConfig,
                    objectConfig[key]?.enums,
                  )}
                </Item>
              ) : null;
            })}
          </Descriptions>
        </div>
      );
    } else {
      return (
        <div style={DetailStyle}>
          {_.get(enums, [key]) ? _.get(enums, [key, value]) : value}
        </div>
      );
    }
  };
  useEffect(() => {
    if (_.isFunction(getDetail)) {
      getDetail(currentData);
    }
  }, [currentData]);

  const request = useNewRequest();
  const getData = () => {
    if (!url) {
      return;
    }
    GloablLoading.show();
    const reqData = {
      method: method || 'get',
    };
    const data = { ...params };
    if (method === 'post') {
      _.set(reqData, 'data', data);
    } else {
      _.set(reqData, 'params', data);
    }
    request(url, reqData)
      .then((res: any) => {
        GloablLoading.hide();
        const newDetail = _.get(res, path as string);
        if (newDetail) {
          if (_.isFunction(init)) {
            init(newDetail);
          }
          setCurrentData(newDetail);
        }
      })
      .catch((err) => {
        GloablLoading.hide();
        setCurrentData({});
        console.error(err.message);
      });
  };
  useEffect(() => {
    if (url) {
      getData();
    }
  }, [url]);
  return (
    <div className="agul-new-detail">
      <Descriptions column={1}>
        {_.map(names, (item, key) => (
          <Item label={<div>{item}</div>}>
            {RenderContent(currentData[key], key, tableConfig, enums)}
          </Item>
        ))}
      </Descriptions>
      <div className="agul-detail-btn-box">
        {_.isArray(extraButtons) ? extraButtons : null}
      </div>
    </div>
  );
}

export default Detail;
