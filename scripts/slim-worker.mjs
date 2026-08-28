/**
 * Post-OpenNext-build slim/fixer for the Cloudflare Workers bundle.
 *
 * 1. Prisma's WASM query engine ends up referenced from THREE places in the
 *    bundled handler (Turbopack emits one copy per server runtime chunk, plus
 *    the nft-traced node_modules original). The loader inside the bundle
 *    resolves whichever chunk-local copy, so ALL must be valid — tripling
 *    ~2.1 MB of wasm and blowing the 3 MiB free-plan limit.
 *    Fix: rewrite every chunk-asset import of `query_engine_bg.wasm` in
 *    handler.mjs to the single node_modules copy. wrangler then bundles one
 *    wasm module and every loader path gets the real engine.
 * 2. `next/og`'s resvg/yoga wasm are pulled in by the middleware bundle but
 *    never used here; they are replaced with a minimal valid wasm module.
 *    (Lives in node_modules, so npm reinstall restores them — this script
 *    re-applies the stub idempotently.)
 *
 * Run AFTER `opennextjs-cloudflare build`, BEFORE `wrangler deploy`.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SERVER_FN = ".open-next/server-functions/default";
const HANDLER = join(SERVER_FN, "handler.mjs");
// Minimal valid wasm module: magic + version, no sections.
const MIN_WASM = Buffer.from([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]);

// --- 1. Single Prisma engine wasm -----------------------------------------
let handler = readFileSync(HANDLER, "utf8");
const chunkWasm =
	/(D:\/[^"]*?\.open-next\/server-functions\/default\/)\.next\/server\/chunks\/(?:ssr\/)?node_modules__prisma_client_query_engine_bg_[a-z0-9_-]+\.wasm/g;
const matches = handler.match(chunkWasm) ?? [];
if (matches.length === 0) {
	console.log("[slim-worker] no prisma chunk wasm references found (ok)");
} else {
	handler = handler.replace(
		chunkWasm,
		"$1node_modules/.prisma/client/query_engine_bg.wasm"
	);
	writeFileSync(HANDLER, handler);
	console.log(`[slim-worker] rewrote ${matches.length} chunk wasm import(s)`);
}

// --- 2. Stub unused next/og wasm in node_modules ---------------------------
const OG_DIR = "node_modules/next/dist/compiled/@vercel/og";
for (const name of ["resvg.wasm", "yoga.wasm"]) {
	try {
		writeFileSync(join(OG_DIR, name), MIN_WASM);
		console.log(`[slim-worker] stubbed ${name}`);
	} catch {
		console.log(`[slim-worker] ${name} not present, skipped`);
	}
}

// Report remaining wasm references for sanity.
const left = handler.match(/import\("D:[^"]*\.wasm[^"]*"\)/g) ?? [];
console.log(`[slim-worker] wasm imports in handler: ${left.length}`);
for (const l of new Set(left)) console.log("  " + l);
