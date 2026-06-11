import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = path.resolve(__dirname, "../client/src/locales");
const LOCALES = ["en", "es", "ca", "fr", "nl"];
const NAMESPACES = ["common"];

function flatten(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    return v && typeof v === "object" ? flatten(v as Record<string, unknown>, key) : [key];
  });
}

let failed = false;
for (const ns of NAMESPACES) {
  const base = new Set(
    flatten(JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, "en", `${ns}.json`), "utf8"))),
  );
  for (const locale of LOCALES) {
    if (locale === "en") continue;
    const file = path.join(LOCALES_DIR, locale, `${ns}.json`);
    const keys = new Set(flatten(JSON.parse(fs.readFileSync(file, "utf8"))));
    const missing = [...base].filter((k) => !keys.has(k));
    const extra = [...keys].filter((k) => !base.has(k));
    if (missing.length || extra.length) {
      failed = true;
      console.error(`\n[${locale}/${ns}]`);
      if (missing.length) console.error("  missing:", missing.join(", "));
      if (extra.length) console.error("  extra:", extra.join(", "));
    }
  }
}

if (failed) {
  console.error("\n❌ i18n validation failed");
  process.exit(1);
}
console.log("✅ i18n keys consistent across all locales");
