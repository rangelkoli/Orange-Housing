import type { Config } from "@react-router/dev/config";

export default {
  // Disable SSR for Cloudflare Pages (static site deployment)
  ssr: true,
} satisfies Config;
