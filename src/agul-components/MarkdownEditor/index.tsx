import ReactMarkdown from "react-markdown";
import CodeMirror from "@uiw/react-codemirror";
import _ from "lodash";
import { ayuLight } from "thememirror";
import gfm from "remark-gfm";
import { MarkdownEditorProps } from "@/agul-types/markdown";
import "./index.less";
export default ({
  value,
  onChange,
  height,
}: MarkdownEditorProps) => {
  return (
    <div className="agul-markdown-editor-container">
      <div className="agul-markdown-editor-code-box">
        <CodeMirror
          value={value || ""}
          placeholder="请输入markdown格式的文本"
          width="100%"
          height={height}
          onChange={onChange}
          className="code-editor-content"
          extensions={[ayuLight]}
        />
      </div>
      <div className="agul-markdown-editor-preview">
        <ReactMarkdown children={value} rehypePlugins={[gfm]} />
      </div>
    </div>
  );
};
