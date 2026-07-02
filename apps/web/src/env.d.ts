/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly GA_MEASUREMENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<
    Record<string, never>,
    Record<string, never>,
    unknown
  >;
  export default component;
}

declare module "*.css" {}
declare module "*.scss" {}
declare module "*.less" {}
declare module "*.styl" {}
