import { copyFile, readdir } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

// Next's static exporter can retain Windows separators in segment filenames.
// Keep the originals and provide the dotted URLs requested by the router.
export async function normalizeStaticSegments(outputRoot) {
  let copied = 0;
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const source = join(directory, entry.name);
      if (entry.isDirectory()) { await visit(source); continue; }
      if (!entry.isFile() || !entry.name.endsWith(".txt")) continue;
      const parts = relative(outputRoot, source).split(sep);
      const segment = parts.findIndex((part) => part.startsWith("__next."));
      if (segment < 0 || segment === parts.length - 1) continue;
      const target = join(outputRoot, ...parts.slice(0, segment), parts.slice(segment).join("."));
      // The target's parent already exists: it owns the original segment folder.
      await copyFile(source, target);
      copied++;
    }
  }
  await visit(outputRoot);
  return copied;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  normalizeStaticSegments(resolve("out")).then((count) => {
    console.log(`Static navigation: ${count} segment file aliases added.`);
  }).catch((error) => { console.error(error); process.exitCode = 1; });
}
