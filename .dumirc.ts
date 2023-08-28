import { defineConfig } from "dumi";
export default defineConfig({
  resolve: {
    docDirs: ["does"],
  },
  outputPath: "docs",
  hash: true,
  // 使用 webpack 5进行构建。
  themeConfig: {
    name: "agul-ui",
    logo: false,
    nav: [
      { title: "介绍", link: "/use/design" },
      { title: "组件", link: "/components/newtable" },
      { title: "其他", link: "/others/mic#配置方式" },
    ],
    sidebar: {
      "/use": [
        {
          title: "介绍",
          children: [
            {
              title: "设计思路",
              link: "/use/design",
            },
            {
              title: "底层应用",
              link: "/use/under",
            },
            {
              title: "安装使用",
              link: "/use/install",
            },
          ],
        },
      ],
      "/components": [
        {
          title: "组件",
          children: [
            {
              title: "多功能表格",
              link: "/components/newtable",
            },
            {
              title: "配置化表单",
              link: "/components/newform",
            },
            {
              title: "表单表格",
              link: "/components/form-table",
            },
            {
              title: "弹窗表单",
              link: "/components/modal-form",
            },
            {
              title: "详情",
              link: "/components/detail1",
            },
            {
              title: "图表",
              link: "/components/chartx",
            },
            {
              title: "网络请求",
              link: "/components/request",
            },
            {
              title: "全局提示",
              link: "/components/message",
            },
            {
              title: "Loading",
              link: "/components/loading",
            },
            {
              title: "面包屑",
              link: "/components/navigation1",
            },
            {
              title: "容器",
              link: "/components/wrapper1",
            },
            {
              title: "markdown编辑器",
              link: "/components/markdown1",
            },
            {
              title: "配置化页面",
              link: "/components/page-container1",
            },
            {
              title: "全局化配置",
              link: "/components/global-config",
            },
          ],
        },
      ],
      "/others": [
        {
          title: "其他",
          children: [
            {
              title: "微前端配置说明",
              link: "/others/mic#配置方式",
            },
          ],
        },
      ],
    },
  },
  styles: [
    ".dumi-default-header-left {width:fit-content !important;margin-right:30px }  .dumi-default-previewer-actions>.dumi-default-previewer-action-btn:nth-child(1) {display:none}  .dumi-default-previewer-actions>.dumi-default-previewer-action-btn:nth-child(2) {display:none} .dumi-default-doc-layout-toc-wrapper>h4{display:none} .dumi-default-table-content td{font-size:13px;} .dumi-default-table-content th{font-size:14px;} .echarts-for-react,.echarts-for-react>div{height:100% !important}",
  ],
});
