/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    paraglide: {
      lang: string;
      dir: "ltr" | "rtl";
    };
  }
}
