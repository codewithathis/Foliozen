import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { normalizeStaticSegments } from "../scripts/normalize-static-segments.mjs";

test("serves Windows-exported route segments at the router's dotted URLs", async () => {
  const root = await mkdtemp(join(tmpdir(), "foliozen-static-"));
  try {
    const segment = join(root, "build", "__next.build", "__PAGE__.txt");
    await mkdir(join(root, "build", "__next.build"), { recursive: true });
    await writeFile(segment, "flight payload");
    await writeFile(join(root, "build", "__next._tree.txt"), "tree payload");
    await mkdir(join(root, "fonts"));
    await writeFile(join(root, "fonts", "license.txt"), "license");
    assert.equal(await normalizeStaticSegments(root), 1);
    assert.equal(await readFile(join(root, "build", "__next.build.__PAGE__.txt"), "utf8"), "flight payload");
    assert.equal(await readFile(segment, "utf8"), "flight payload");
    assert.equal(await readFile(join(root, "build", "__next._tree.txt"), "utf8"), "tree payload");
    assert.equal(await readFile(join(root, "fonts", "license.txt"), "utf8"), "license");
    await normalizeStaticSegments(root);
    assert.equal(await readFile(join(root, "build", "__next.build.__PAGE__.txt"), "utf8"), "flight payload");
  } finally {
    assert.ok(root.startsWith(join(tmpdir(), "foliozen-static-")));
    await rm(root, { recursive: true, force: true });
  }
});
