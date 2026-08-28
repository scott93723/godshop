import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
	// 瘦身 worker bundle(64 MiB 上限):排除不會在 runtime 用到的原生/WASM 引擎
	outputFileTracingExcludes: {
		"*": [
			"./node_modules/prisma/**",
			"./node_modules/@prisma/engines/**",
			"./node_modules/@mediapipe/**",
			"./node_modules/@dimforge/**",
			"./node_modules/@types/**",
			"./node_modules/draco3d/**",
			"./node_modules/three/examples/jsm/libs/**",
			"./node_modules/next/dist/compiled/@vercel/og/**",
			"./node_modules/.prisma/client/*.dll.node",
			"./node_modules/.prisma/client/*.tmp*",
			"./node_modules/@prisma/client/*.dll.node",
		],
	},
};

export default nextConfig;

// Enable Cloudflare bindings (D1, R2, ...) in `next dev` via wrangler emulation.
// No-ops outside local development.
initOpenNextCloudflareForDev();
