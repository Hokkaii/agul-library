/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { HttpMethodEnum, requestTypeEnum } from '@/agul-enums/http';
import Message from '@/agul-methods/Message';
import { RequestParamsProps } from '@/agul-types/request';
import { signType } from '@/agul-utils/constant';
import { AgulWrapperConfigContext } from '@/agul-utils/context';
import {
  SHA,
  genHeader,
  getParamsToSortStr,
  getTimeStamp,
  getUserIdByJwtToken,
  paramsToSortStr,
  postParamToShaStr,
  randomStr,
  signTmp,
} from '@/agul-utils/rules';
import { getQuerys } from '@/agul-utils/utils';
import _ from 'lodash';
import { useContext } from 'react';
import { extend } from 'umi-request';

const notice = (status: number, url: string, errorText: string) => {
  if (process.env.NODE_ENV === 'development') {
    Message.error({
      title: `${status}:${url}`,
      subTitle: errorText,
    });
  } else {
    if (errorText) {
      Message.error({ title: errorText });
    }
  }
};

/**
 * @description 业务异常和服务器异常处理程序
 * @returns 错误
 */
export default ({ needSign, requestOptions }: RequestParamsProps = {}) => {
  const errorHandler = async (error: any) => {
    const { response } = error;
    if (response) {
      const { status, url } = response;
      let body: any;
      let errorText: string = '';
      try {
        body = await response.json();
      } catch {
        body = response;
      }
      errorText =
        body?.error?.message ||
        error?.response?.statusText ||
        body?.error?.error ||
        body?.error;
      notice(status, url, errorText);
    } else {
      Message.error({ title: '服务器异常' });
    }
    return Promise.reject(error);
  };
  // 全局配置,优先级低于入参
  const Wrapper = useContext(AgulWrapperConfigContext) as any;
  const reqOptions = _.get(Wrapper, 'reqOptions');
  const needReqSign = _.get(Wrapper, 'needReqSign');
  if (_.isNil(needSign)) {
    if (_.isBoolean(needReqSign)) {
      // eslint-disable-next-line no-param-reassign
      needSign = needReqSign;
    } else {
      // eslint-disable-next-line no-param-reassign
      needSign = true;
    }
  }
  /**
   * 配置request请求时的默认参数
   */
  const request = extend({
    errorHandler, // 默认错误处理
    credentials: 'include', // 默认请求是否带上cookie
    ...reqOptions,
    ...requestOptions,
  });
  /**
   * request 拦截器
   * options: RequestOptionsInit
   */
  request.interceptors.request.use(
    (url, options) => {
      const userid = getUserIdByJwtToken(); //
      const { method, headers, requestType, data } = options;
      let { params } = options;
      params = { ...getQuerys(url), ...params };
      let encryptionHeaders = {};
      if (needSign) {
        const timestamp = getTimeStamp();
        const nonce = randomStr();
        let paramsStr = 'param={}';
        if (method === HttpMethodEnum.get) {
          paramsStr = getParamsToSortStr(params as URLSearchParams);
        }
        if (
          method === HttpMethodEnum.post ||
          method === HttpMethodEnum.put ||
          method === HttpMethodEnum.delete
        ) {
          paramsStr =
            requestType === requestTypeEnum.form
              ? paramsToSortStr(data)
              : postParamToShaStr(data);
        }
        const result = signTmp(paramsStr, timestamp, nonce);
        encryptionHeaders = genHeader(
          timestamp,
          nonce,
          signType,
          SHA(result, userid),
        );
      }
      options.headers = {
        ...headers,
        ...encryptionHeaders,
      };
      return {
        url,
        options: { ...options, interceptors: true },
      };
    },
    { global: false },
  );
  /**
   * response拦截器
   * options: RequestOptionsInit
   */
  request.interceptors.response.use(
    async (response: Response) => {
      return response;
    },
    { global: false },
  );
  return request;
};
