export type CodeLang = "java" | "ts" | "tsx" | "yaml" | "proto" | "docker";

export type KeyFile = {
  /** Tab label */
  name: string;
  /** Path inside the source repository, shown in the viewer header */
  path: string;
  /** One sentence on why this file matters */
  note: string;
  /** Excerpt file under content/code/ */
  source: string;
  lang: CodeLang;
  /** Not written yet (Overex is still in progress) */
  planned?: boolean;
};

export type Project = {
  id: string;
  no: string;
  name: string;
  kind: string;
  /** Repository name under github.com/Umex10, empty when there is none yet */
  repo: string;
  live: string;
  urlText?: string;
  tagline: string;
  overview: string;
  highlights: string[];
  arch: string[];
  stack: string[];
  files: KeyFile[];
  /** Has screenshots under public/work/<id>/ */
  shots: boolean;
};

export type PipelineStage = {
  n: string;
  sub: string;
  t: string;
};

export type ToolGroup = {
  label: string;
  items: string[];
};
