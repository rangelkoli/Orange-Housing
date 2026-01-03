import type { Config } from "@react-router/dev/config";

export default {
  // Use pre-rendering for Cloudflare Pages (generates static HTML at build time)
  ssr: false,
  prerender: true,
} satisfies Config;
