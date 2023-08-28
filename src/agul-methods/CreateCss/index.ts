import _ from "lodash";
export function createCSS(cssRules: string[]) {
  let styleSheet: any;
  for (let i = 0; i < document.styleSheets.length; i++) {
    const item = document.styleSheets[i] as any;
    if (item.CSSInJS) {
      styleSheet = document.styleSheets[i];
      break;
    }
  }
  if (!styleSheet) {
    const style = document.createElement("style");
    document.head.appendChild(style);
    styleSheet = style.sheet;
    styleSheet.CSSInJS = true;
  }
  _.forEach(cssRules, (css) => {
    styleSheet.insertRule(css);
  });
}
export function getCssStrByBtns(
  code_attr_name: string = "data-btn-code",
  btns: any
) {
  const rules: string[] = [];
  _.forEach(btns, (value, key) => {
    rules.push(
      `[${code_attr_name}='${key}'] {display:${
        !!value ? "block !important" : "none !important"
      }}`
    );
  });
  return rules;
}
