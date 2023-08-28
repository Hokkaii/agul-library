/**
 * @param phone 手机号
 */
export function phoneNumberCheck(phone: string) {
  return /^1[3-9]\d{9}$/.test(phone);
}

/**
 * @param name 姓名
 */
export function usernameCheck(name: string) {
  return /^[\u4E00-\u9FA5·A-Za-z0-9]{2,20}$/.test(name);
}

/**
 * @param email 邮箱
 */
export function emailCheck(email: string) {
  const regMail = /^[A-Za-z0-9]+([_.][A-Za-z0-9]+)*@([A-Za-z0-9-]+\.)+[A-Za-z]{1,50}$/;
  return regMail.test(email);
}

/**
 * @param password 密码
 */
export function passwordCheck(password: string) {
  return /^[A-Za-z0-9]{8,32}$/.test(password);
}

/**
 * @param id 身份证
 */
export function identityCardCheck(id: string) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(id);
}

/**
 * @param name 企业名称
 */
export function enterpriseNameCheck(name: string) {
  return /^[/s/S]{2,200}$/.test(name);
}

/**
 * @param name 文档标题
 */
export function documentTitleCheck(name: string) {
  return /^[a-zA-Z\u4e00-\u9fa5]([\s\S]){2,31}$/.test(name);
}

/**
 * @description 只验证第一个字符串
 * @param name 目录标题
 */
export function conntentTitleCheck(name: string) {
  return /^[\u4E00-\u9FA5A-Za-z]/.test(name);
}

/**
 * @description 匹配字节数
 * @param name 目录标题
 */
export function byteCheck(name: string) {
  return /^[\u0000-\u00ff]$/.test(name);
}
