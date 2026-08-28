// OpenNext config for Cloudflare Workers.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
	// No ISR in this app (all DB pages are force-dynamic); prerendered pages
	// are served from static assets, so no extra cache binding (R2/KV) needed.
	incrementalCache: staticAssetsIncrementalCache,
});
