import { PrismaClient } from "@prisma/client";
// The generated WASM client: its query engine is a WASM module loaded via
// wrangler's wasm-module support, so workerd needs neither the native engine
// binary (what the default node-condition import resolves to) nor filesystem
// access.
// Deep relative import because `@prisma/client/wasm`'s "import" condition
// points at a wasm.mjs that Prisma does not emit for CJS projects.
import { PrismaClient as PrismaClientWasm } from "../node_modules/.prisma/client/wasm.js";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Returns a PrismaClient bound to the Cloudflare D1 `DB` binding when running
 * in a Workers context (production / opennext preview / next dev with the
 * OpenNext local init). Falls back to the local SQLite file otherwise
 * (plain `next dev` / build time).
 *
 * The D1 branch uses the `@prisma/client/wasm` runtime: its query engine is
 * a base64-inlined WASM module, so workerd needs neither the native engine
 * binary (library runtime) nor filesystem access. A fresh client is created
 * per call — with driver adapters there is no engine to reuse, and the D1
 * binding is request-scoped.
 */
export async function getDb(): Promise<PrismaClient> {
  let d1: D1Database | undefined;
  try {
    const { env } = await getCloudflareContext({ async: true });
    d1 = (env as { DB?: D1Database }).DB;
  } catch {
    // Not inside a Cloudflare request context — use the local file database.
  }
  if (d1) {
    // Let construction errors surface — silently falling back to the local
    // engine client would mask the real problem inside Workers.
    return new PrismaClientWasm({
      adapter: new PrismaD1(d1),
    }) as unknown as PrismaClient;
  }
  return (globalForPrisma.prisma ??= new PrismaClient());
}

