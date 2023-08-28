export type FileParseProps = {
  url?: string;
  method?: "get" | "post";
  params?: Record<string, any>;
  dataSource?: string;
  width?: string;
  height?: string;
  autoUpdate?: boolean;
};
