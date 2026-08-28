/**
 * Generates d1/seed.sql from the same product data as prisma/seed.ts.
 * Run: npx tsx prisma/seed-sql.ts > d1/seed.sql
 */
import { products } from "./seed";

const q = (s: string) => "'" + s.replace(/'/g, "''") + "'";

const lines = products.map((p) => {
  const { colors, specs, ...rest } = p;
  const cols =
    "id, slug, name, nameEn, price, description, category, model3d, colors, specs, featured";
  const vals = [
    q(`p_${p.slug}`),
    q(rest.slug),
    q(rest.name),
    q(rest.nameEn),
    String(rest.price),
    q(rest.description),
    q(rest.category),
    q(rest.model3d),
    q(JSON.stringify(colors)),
    q(JSON.stringify(specs)),
    rest.featured ? "1" : "0",
  ].join(", ");
  return `INSERT OR IGNORE INTO "Product" (${cols}) VALUES (${vals});`;
});

console.log(lines.join("\n"));
