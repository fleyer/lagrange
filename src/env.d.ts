/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    paraglide: {
      lang: string;
      dir: "ltr" | "rtl";
    };
  }
}
