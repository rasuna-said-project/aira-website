import { statSync } from "node:fs";
import { dirname, resolve as resolvePath } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const akar = resolvePath(dirname(fileURLToPath(import.meta.url)), "..");
const adaFile = (p) => {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
};

// "@/services/x" -> <akar>/services/x.js (Next.js menerima impor tanpa ekstensi; Node ESM tidak).
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const dasar = resolvePath(akar, specifier.slice(2));
    for (const kandidat of [`${dasar}.js`, dasar, `${dasar}/index.js`]) {
      if (adaFile(kandidat)) return nextResolve(pathToFileURL(kandidat).href, context);
    }
  }
  return nextResolve(specifier, context);
}

// File .js proyek memakai sintaks ESM tanpa "type": "module"; perlakukan sebagai module saat tes.
export async function load(url, context, nextLoad) {
  if (url.startsWith("file://") && url.endsWith(".js") && !url.includes("/node_modules/")) {
    return nextLoad(url, { ...context, format: "module" });
  }
  return nextLoad(url, context);
}
