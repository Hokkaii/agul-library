/**
   * @description 此签名规则针对以下几类请求：
                  GET请求
                  content-type为application/json、application/x-www-form-urlencoded或multipart/form-data的POST请求
                  注：处理multipart/form-data的时候，剔除文件后,进行签名生成
                  POST、PUT、DELETE请求无需处理URL中的查询参数
                  调用方与网关的时间误差不得超过60秒，同一个签名后的请求无法重复发送

                  生成最终请求
                  POST http://www.xxx.com/update
                  access-token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9 //无须身份认证的接口不需要此参数
                  content-type: application/x-www-form-urlencoded
                  *-timestamp: 1628678302623
                  *-nonce: g45215g63665459855kl
                  *-sign: c23891c3ee516c0751898158396a5366dbde2311ed6104a486a600be3331432c
                  *-sign-type: 0 //固定为0

                  key3: value3
                  key1: value1
                  key2: value2
                  key4:

   *
   */

import Cookie from "js-cookie";
import crypto from "crypto-js";
import { decode } from "jsonwebtoken";
import { useridCookie, xsrfHeaderName } from "./constant";
const HmacSHA256 = crypto.HmacSHA256;
/**
 * @description 获取20位随机字符串 nonce
 * @example "g45215g63665459855kl"
 * @returns 字符串
 */
export const randomStr = () => {
  const array = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  let arrlength = array.length;
  let str = "";
  let count = 0;
  let item;
  while (arrlength) {
    //保证均匀分布
    item = Math.floor(Math.random() * arrlength--);
    str += array.splice(item, 1)[0];
    if (count == 19) {
      break;
    }
    count++;
  }
  return str;
};

/**
 * @description 获取当前毫秒级时间戳 timestamp 13位
 * @example "1628678302623"
 * @returns 字符串
 */
export const getTimeStamp = () => new Date().getTime();

/**
 * @description 通过cookie 获取用户ID user-id，若无用户登录，则值为"null"
 * @example "1019676"
 * @returns userid字符串
 */
export const getUserIdByCookie = () => Cookie.get(useridCookie);

/**
 * @description 获取用户ID uuid，若无用户登录，则值为"null"
 * @example "1019676"
 * @returns 字符串
 */
export const getUserIdByJwtToken = () => {
  const token = sessionStorage.getItem(xsrfHeaderName);

  if (!token) {
    return "null";
  }

  const userid = (decode(token) as any)?.[useridCookie];
  if (!userid) {
    return "null";
  }
  return userid;
};

/**
 * @description 参数名升序排列 GET
 * @params params 请求的参数
 * @example 得到param值为"param={key0=&key1=value1&key2=value2}"
 * @returns 字符串
 */
export const getParamsToSortStr = (params: URLSearchParams) => {
  if (!params) {
    return "param={}";
  }
  const obj: any = {};

  // 过滤参数中的undefined
  Object.keys(params).forEach((key) => {
    if ((params as any)[key] !== undefined) {
      obj[key] = (params as any)[key];
    }
  });

  const tmp = Object.keys(obj)
    .sort()
    .map((value) => {
      return value + "=" + obj[value];
    });
  const result = "param={" + tmp.join("&") + "}";
  console.log("param:", result);
  return result;
};

/**
 * @description 参数名升序排列 POST
 * @params requestType get 请求还是 form
 * @example 得到param值为"param={key0=&key1=value1&key2=value2}"
 * @returns 字符串
 */
export const paramsToSortStr = (params?: URLSearchParams | FormData) => {
  if (!params) {
    return "param={}";
  }
  const obj: any = {};

  // 过滤参数中的undefined
  // Object.keys(params).forEach((key) => {
  //   if (params[key] !== undefined) {
  //     obj[key] = params[key];
  //   }
  // });

  // if (requestType === 'form') {
  //   if (params instanceof FormData) {
  //     obj = {};
  //
  //   }
  // }

  for (const key of (params as any).keys()) {
    const item = params.get(key);
    // 因为是formdata 所以除了文件类型以外都是string
    if (typeof item === "string") {
      obj[key] = item;
    }
  }

  const tmp = Object.keys(obj)
    .sort()
    .map((value) => {
      return value + "=" + obj[value];
    });
  const result = "param={" + tmp.join("&") + "}";
  console.log("param:", result);
  return result;
};

/**
 * @description  POST请求（application/json） 将整个json请求体body data进行拼接，保留换行缩进等字符，得到param的值为"param=<body data>"
 * @params params  POST请求的参数
 * @example  body data:{\"key1\":\"value1\",\"key2\":\"value2\",\"key4\":{\"key3\":\"value3\",\"key5\":\"value5\",\"key0\":null}}
 * @returns 字符串
 */
export const postParamToShaStr = (params?: object) => {
  if (!params) {
    return "param={}";
  }
  const obj: any = {};
  // 过滤参数中的undefined
  Object.keys(params).forEach((key) => {
    if ((params as any)[key] !== undefined) {
      obj[key] = (params as any)[key];
    }
  });

  const result = "param=" + JSON.stringify(obj);
  // console.log('param:', result);
  return result;
};

/**
 * @description 拼接param、timestamp、nonce，各项使用&分隔）
 * @params param 参数字符串
 * @params timestamp 时间戳
 * @params nonce 随机字符串
 * @example  sign_tmp值为"param={key1=value1&key2=value2&key3=value3&key4=}&timestamp=1628678302623&nonce=g45215g63665459855kl"
 * @returns 字符串
 */
export const signTmp = (param: string, timestamp: number, nonce: string) => {
  // console.log(
  //   'signTmp:' + param + '&timestamp=' + timestamp + '&nonce=' + nonce,
  // );
  return param + "&x-daq-timestamp=" + timestamp + "&x-daq-nonce=" + nonce;
};

/**
 * @description 使用user-id作为密钥，将sign_tmp进行HMAC-SHA256算法加密，并将结果转为小写，得到sign
 * @params str 拼接后的字符串
 * @params userid 用户id
 * @example  c23891c3ee516c0751898158396a5366dbde2311ed6104a486a600be3331432c
 * @returns 字符串
 */
export const SHA = (str: string, userid = "null") => {
  const result = HmacSHA256(str, userid);
  // console.log("str:"+str)
  // console.log("userid:"+userid)
  return result.toString().toLowerCase();
};

/**
 * @description 使用user-id作为密钥，将sign_tmp进行HMAC-SHA256算法加密，并将结果转为小写，得到sign
 * @params timestamp 时间戳
 * @params nonce 随机字符串
 * @params signType 固定为0
 * @params sign 加密后的字符串
 * @example  c23891c3ee516c0751898158396a5366dbde2311ed6104a486a600be3331432c
 * @returns 字符串
 */
export const genHeader = (
  timestamp: number,
  nonce: string,
  signType: 0,
  sign: string
) => {
  return {
    "x-daq-timestamp": timestamp,
    "x-daq-nonce": nonce,
    "x-daq-sign-type": signType,
    "x-daq-sign": sign,
  };
};
