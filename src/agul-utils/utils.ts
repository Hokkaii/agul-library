import _, { cloneDeep } from "lodash";
import React from "react";
import moment from "moment";
import XLSX from "xlsx";
import { FORMAT_DATETIME } from "./constant";
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
    return "";
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
    if (copy[key] === null || copy[key] === "") {
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
  format = FORMAT_DATETIME
): string => {
  if (moment(param).isValid()) {
    return moment(timeUtcOffect(param)).format(format);
  }
  return "";
};
const formmaterTostring = (value: any) => {
  return value !== undefined ? value.toString() : "";
};
export const getSoaFileJSON = (_file: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!_file) {
      reject(new Error());
    }
    const array: any = {
      serviceInterface_definition: [],
      dataType_definition: [],
      service_deployment: [],
      sd_parameters: [],
    };
    const fields = [
      "server_name",
      "server_id",
      "server_description",
      "service_name_space",
      "service_major_version",
      "service_minor_version",
      "interface_major_version",
      "interface_minor_version",
      "api_name",
      "api_description",
      "service_interface_element_type",
      "service_Interface_element_id",
      "event_group",
      "L4_Protocol",
      "parameter_name",
      "parameter_description",
      "parameter_direction",
      "data_type_reference",
      "remark",
    ];
    const server = [
      "data_type_name",
      "data_type_description",
      "data_type_name_space",
      "data_type_category",
      "struct_union_member_position",
      "struct_union_member_name",
      "struct_union_member_description",
      "struct_union_member_data_type_reference",
      "array_element_data_type_reference",
      "string_array_length_type",
      "string_array_length_min",
      "string_array_length_max",
      "base_type",
      "min_value_physical",
      "max_value_physical",
      "initial_value",
      "invalid_value",
      "unit",
      "table_value",
      "remark",
    ];
    const service = [
      "paticipant",
      "ipv_4",
      "ip_subnet_mask",
      "vlan_id",
      "service_name",
      "service_id",
      "provided_service_instance_id",
      "consumed_service_instance_id",
      "l_4_protocol",
      "port",
      "eventgroups",
      "multicast_ip_port",
      "sd_parameter_configuration",
    ];
    const sd = [
      "sd_parameters_name",
      "type",
      "initial_delay_min",
      "initial_delay_max",
      "repetitions_base_delay",
      "reperirions_max",
      "request_response_delay",
      "cyclic_offer_delay",
      "sd_port",
      "sd_multicast_ip",
      "ttl",
    ];
    const fileReader = new FileReader();
    fileReader.onload = (ev) => {
      try {
        const data = ev?.target?.result;
        const workbook = XLSX.read(data, {
          type: "binary",
        });
        let SheetArray = [];
        let privateArray = [
          "ServiceInterface Definition",
          "DataType Definition",
          "Service Deployment",
          "SD Parameters",
        ];
        SheetArray = workbook.SheetNames;
        if (!SheetArray.toString().includes(privateArray.toString())) {
          reject(new Error("文件数据格式不正确,请检查文件!"));
        } else {
          for (let sheet in workbook.Sheets) {
            if (sheet === "ServiceInterface Definition") {
              //循环读取每个文件
              const sheetArray = XLSX.utils.sheet_to_json(
                workbook.Sheets["ServiceInterface Definition"],
                {
                  header: fields,
                }
              );
              const exceldata = sheetArray.splice(1);
              exceldata.map((item: any) => {
                item.service_major_version = formmaterTostring(
                  item.service_major_version
                );
                item.service_minor_version = formmaterTostring(
                  item.service_minor_version
                );
                item.interface_major_version = formmaterTostring(
                  item.interface_major_version
                );
                item.interface_minor_version = formmaterTostring(
                  item.interface_minor_version
                );
              });
              array.serviceInterface_definition = exceldata;
            }
            if (sheet === "DataType Definition") {
              //循环读取每个文件
              const sheetDatatype = XLSX.utils.sheet_to_json(
                workbook.Sheets["DataType Definition"],
                {
                  header: server,
                }
              );
              const exceldata = sheetDatatype.splice(1);
              array.dataType_definition = exceldata;
            }

            if (sheet === "Service Deployment") {
              //循环读取每个文件
              const sheetService = XLSX.utils.sheet_to_json(
                workbook.Sheets["Service Deployment"],
                {
                  header: service,
                }
              );
              const exceldata = sheetService.splice(1);
              exceldata.map((item: any) => {
                item.provided_service_instance_id = formmaterTostring(
                  item.provided_service_instance_id
                );
                item.port = formmaterTostring(item.port);
              });
              array.service_deployment = exceldata;
            }
            if (sheet === "SD Parameters") {
              //循环读取每个文件
              const sheetSD = XLSX.utils.sheet_to_json(
                workbook.Sheets["SD Parameters"],
                {
                  header: sd,
                }
              );
              const exceldata = sheetSD.splice(1);
              exceldata.map((item: any) => {
                item.initial_delay_min = formmaterTostring(
                  item.initial_delay_min
                );
                item.initial_delay_max = formmaterTostring(
                  item.initial_delay_max
                );
                item.repetitions_base_delay = formmaterTostring(
                  item.repetitions_base_delay
                );
                item.cyclic_offer_delay = formmaterTostring(
                  item.cyclic_offer_delay
                );
                item.sd_port = formmaterTostring(item.sd_port);
                item.reperirions_max = formmaterTostring(item.reperirions_max);
                item.ttl = formmaterTostring(item.ttl);
              });
              array.sd_parameters = exceldata;
            }
          }
          resolve(array);
        }
        // console.log(SheetArray, privateArray);
      } catch (e) {
        console.log(e);
        reject(new Error("文件类型不正确！"));
      }
    };
    fileReader.readAsBinaryString(_file);
  });
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
  if (!e) return "";
  var t: any = {},
    r = [],
    n = "",
    a = "";
  try {
    var i: any = [];
    if (
      (e.indexOf("?") >= 0 &&
        (i = e.substring(e.indexOf("?") + 1, e.length).split("&")),
      i.length > 0)
    )
      for (var o in i) (n = (r = i[o].split("="))[0]), (a = r[1]), (t[n] = a);
  } catch (s) {
    t = {};
  }
  return t;
}

export function filterFormData(data: Record<string, any>) {
  // delete data["___agul_ui_time____"];
  _.forEach(data, (item, key) => {
    if (_.isNil(item) || item === "" || _.isNaN(item)) {
      delete data[key];
    }
  });
}

export function isObject(data: any) {
  return Object.prototype.toString.call(data) === "[object Object]";
}
export const isDOM =
  typeof HTMLElement === "object"
    ? function (obj: any) {
        return obj instanceof HTMLElement;
      }
    : function (obj: any) {
        return (
          obj &&
          typeof obj === "object" &&
          obj.nodeType === 1 &&
          typeof obj.nodeName === "string"
        );
      };
export function isValidElement(object: any) {
  return React.isValidElement(object);
}
