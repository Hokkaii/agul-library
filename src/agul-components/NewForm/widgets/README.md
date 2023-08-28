## 一些新增业务组件说明和 schema 新增字段说明

NewForm 在 FormRender 基础上提供或重写了 upload，json，select，cascader，treeSelect 几种自定义组件，使用时将其加入到 format 字段中即可

### upload

文件上传

### json

通过 codemirror 对 json 数据进行编辑

### select & treeSelect &cascader

FormRender 仅支持通过 enum 和 enumNames 在 schema 中进行配置，动态加载 options 需要动态变更 schema，这里新增了自定义的 select 组件，直接通过 format:select 便可使用 treeData 动态配置数据源

### treeData

formRender 本身提供的下拉框、树形选择框或级联选择框在动态渲染 options 需要动态修改 schema，不太灵活。NewForm 支持通过 treeData 为以上几种表单属性配置动态数据源，treeData 属性：

##### format:cascader：

| 属性        | 描述                                                      |
| ----------- | --------------------------------------------------------- |
| url(string)         | 数据源（这里数据源必须是 基于 children 的子父级数据结构） |
| path(string)        | 资源路径                                                  |
| labelFields(string[]) | 每级级联选择框的 label，数组长度对应着几级级联选择框              |
| valueFields(string[]) | 每级级联选择框的 value，数组长度对应着几级级联选择框              |

##### format:select & format:treeSelect：

| 属性       | 描述                                                                                                                                                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| url(string)        | 数据源（这里数据源应该是数组结构）                                                                                                                                                                                    |
| path(string)       | 资源路径                                                                                                                                                                                                              |
| labelField(string) | select 的 label                                                                                                                                                                                                       |
| valueField(string) | select 的 value，如果需要绑定多个值则用成数组， 会被用 JSON.stringify 处理成字符串，在数据 change 时不会再对该数据进行整形改到 formData，而是需要在 action 字段的 submit 钩子函数中将该字段解析成需要的格式并进行赋值 |

### action:{ callback(formdata) { xxx } }

NewForm 会收集 schema 中各个属性的 action 字段中的回调函数，分别在表单提交时、数据变更时和初始化时顺序触发这些函数，目的是在不同的阶段从表单中取得或给与表单合适的数据格式

| 参数   | 说明                                                                                                       |
| ------ | ---------------------------------------------------------------------------------------------------------- |
| submit(function) | 表单提交时的钩子函数，钩子函数提供一个参数为表单值 formData，在原对象基础上变更 formData 即可，无需 return |
| change(function) | 表单数据变更时的钩子函数，其余同上                                                                         |
| init(function)   | 表单数据初始化时的钩子函数，其余同上                                                                       |
