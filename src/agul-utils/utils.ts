import _, { cloneDeep } from 'lodash';
import moment from 'moment';
import React from 'react';
import { FORMAT_DATETIME } from './constant';
const utcOffset: number = 8;

// 一般解法，维护一个数组，数组元素为key-value键值对对象，每次获取需要遍历数组
// 工厂函数，具有两个属性 capacity 保存限量，cache 保存缓存
export const LRUCache = function (capacity: any) {
  this.capacity = capacity;
  this.cache = [];
};

// 实现 get 方法
LRUCache.prototype.get = function (key: any) {
  let index = this.cache.findIndex((item: any) => item.key === key);
  if (index === -1) {
    return -1;
  }
  // 删除此元素后插入到数组第一项
  let value = this.cache[index].value;
  this.cache.splice(index, 1);
  this.cache.unshift({
    key,
    value,
  });
  return value;
};

// 实现 put 方法
LRUCache.prototype.put = function (key: any, value: any) {
  let index = this.cache.findIndex((item: any) => item.key === key);
  // 想要插入的数据已经存在了，那么直接提升它就可以
  if (index > -1) {
    this.cache.splice(index, 1);
  } else if (this.cache.length >= this.capacity) {
    // 若已经到达最大限制，先淘汰一个最久没有使用的
    this.cache.pop();
  }
  this.cache.unshift({ key, value });
};

export const SessionStorage = {
  set: (key: string, value: string) => {
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      return false;
    }
    return true;
  },
  get: (key: string) => {
    sessionStorage.getItem(key);
  },
  remove: (key: string) => {
    sessionStorage.removeItem(key);
  },
  clear: () => {
    sessionStorage.clear();
  },
};
// UTC +8时区
export const timeUtcOffect = (time: any): any => {
  if (!time) {
    return '';
  }
  return moment(time).utcOffset(utcOffset);
};

/**
 * @description 展示分页总数
 * @param total
 * @returns
 */
export const showTotal = (total: number) => `总共 ${total} 个项目`;

// 清除空对象
export const clearParams = function (obj: any) {
  const copy = JSON.parse(JSON.stringify(obj));
  for (const key of Object.keys(copy)) {
    if (copy[key] === null || copy[key] === '') {
      delete copy[key];
    }
  }
  return copy;
};

// 组合成树
export const flatListToTree = (arr: any) => {
  const map: Record<string, any> = {};
  arr.forEach((i: any) => {
    map[i.id] = i;
  });
  const treeData: any = [];
  arr.forEach((child: any) => {
    const mapItem = map[child.parentId];
    if (mapItem) {
      (mapItem.children || (mapItem.children = [])).push(child);
      mapItem.count = (mapItem.count || (mapItem.count = 0)) + 1;
    } else {
      treeData.push(child);
    }
  });
  return treeData;
};

/**
 * @description 把数组处理成树
 * @param listParam 数组
 * @param root 根节点
 * @returns
 */
export const transListToTreeData = (listParam: any[], root: number) => {
  const list = cloneDeep(listParam);
  const arr: any[] = [];

  list.forEach((item: any) => {
    item.key = item.id;

    if (item.parentId === root) {
      const children = transListToTreeData(list, item.id);
      if (children.length) {
        item.children = children;
      }
      arr.push(item);
    }
  });

  return arr;
};

/**
 * @description 把数组处理成树 同时增加level
 * @param listParam 数组
 * @param root 根节点
 * @param level 等级
 * @returns
 */
export const treeAddLevel = (listParam: any[], root: number, level: number) => {
  const list = cloneDeep(listParam);
  const arr: any[] = [];
  const newLevel = level + 1;
  // level++;
  list.forEach((item: any) => {
    item.key = item.id;
    item.level = newLevel;
    if (item.parentId === root) {
      const children = treeAddLevel(list, item.id, newLevel);
      if (children.length) {
        item.children = children;
      }
      arr.push(item);
    }
  });
  return arr;
};

/**
 * @description 根节点处理特殊处理
 * @param 传入的node数组
 * @returns 返回处理后的全部node数组
 */
export const toTreeAddLevel = (listParam: any[]) => {
  const list = cloneDeep(listParam);
  const obj: any[] = [];
  const arr = treeAddLevel(list, -1, 1);
  list.forEach((item) => {
    if (item.parentId === -2) {
      obj.push({ ...item, key: item.id, children: arr, level: 1 });
    }
  });

  return obj;
};

/**
 * @description 树转成数组
 * @param tree 树
 * @param array 返回数组
 */
export const treeToArray = (tree: any[], array: any[]) => {
  tree.forEach((item) => {
    array.push(item);
    if (!item.children) {
    } else {
      treeToArray(item.children, array);
    }
  });
};

/**
 * @description 获取格式化时间
 * @param param 时间
 * @param format 格式
 * @return 格式化后的时间 默认到时分秒
 */
export const getDateTime = (
  param: string | number | Date | undefined,
  format = FORMAT_DATETIME,
): string => {
  if (moment(param).isValid()) {
    return moment(timeUtcOffect(param)).format(format);
  }
  return '';
};
export const formmaterTostring = (value: any) => {
  return value !== undefined ? value.toString() : '';
};
export function getTreeData(data: any, labelField: string, valueField: string) {
  return _.map(data, (item) => {
    if (item?.children) {
      item.title = item[labelField];
      item.key = item[valueField];
      item.children = getTreeData(item.children, labelField, valueField);
    } else {
      item.title = item[labelField];
      item.key = item[valueField];
    }
    return item;
  });
}
export function getQuerys(e: string) {
  if (!e) return '';
  let t: any = {},
    r = [],
    n = '',
    a = '';
  try {
    let i: any = [];
    if (
      (e.indexOf('?') >= 0 &&
        (i = e.substring(e.indexOf('?') + 1, e.length).split('&')),
      i.length > 0)
    )
      // eslint-disable-next-line guard-for-in, @typescript-eslint/no-unused-expressions
      for (let o in i) (n = (r = i[o].split('='))[0]), (a = r[1]), (t[n] = a);
  } catch (s) {
    t = {};
  }
  return t;
}

export function filterFormData(data: Record<string, any>) {
  // delete data["___agul_ui_time____"];
  _.forEach(data, (item, key) => {
    if (_.isNil(item) || item === '' || _.isNaN(item)) {
      delete data[key];
    }
  });
}

export function isObject(data: any) {
  return Object.prototype.toString.call(data) === '[object Object]';
}
export const isDOM =
  typeof HTMLElement === 'object'
    ? function (obj: any) {
        return obj instanceof HTMLElement;
      }
    : function (obj: any) {
        return (
          obj &&
          typeof obj === 'object' &&
          obj.nodeType === 1 &&
          typeof obj.nodeName === 'string'
        );
      };
export function isValidElement(object: any) {
  return React.isValidElement(object);
}
