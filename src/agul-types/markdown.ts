import { CSSProperties, ComponentType } from "react";

export type MarkdownEditorProps = {
  value: string;
  onChange: (data: string) => void;
  height?: string;
};
