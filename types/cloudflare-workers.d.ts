/// <reference types="@cloudflare/workers-types" />

declare global {
  interface Env {
    DB?: D1Database;
  }
}

declare module "cloudflare:workers" {
  export const env: Env;
}

export {};
