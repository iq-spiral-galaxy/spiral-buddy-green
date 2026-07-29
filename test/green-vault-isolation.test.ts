import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, routes, mcp, vault] = await Promise.all([
  readFile(new URL("../client/app.js", import.meta.url), "utf8"),
  readFile(new URL("../src/routes.ts", import.meta.url), "utf8"),
  readFile(new URL("../src/mcp.ts", import.meta.url), "utf8"),
  readFile(new URL("../src/vault.ts", import.meta.url), "utf8"),
]);

test("all Green note-path consumers share the Green default and honor explicit workspace values", () => {
  assert.match(
    vault,
    /DEFAULT_SPIRAL_VAULT_SUBDIR = "spiral-buddy-green"/,
  );
  assert.match(
    vault,
    /process\.env\.SPIRAL_VAULT_SUBDIR\?\.trim\(\) \|\| DEFAULT_SPIRAL_VAULT_SUBDIR/,
  );

  assert.match(routes, /const vaultSubDir = getSpiralVaultSubDir\(\);/);
  assert.doesNotMatch(
    routes,
    /SPIRAL_VAULT_SUBDIR\?\.trim\(\) \|\| "spiral-buddy"/,
  );

  assert.match(mcp, /const vaultSubDir = getSpiralVaultSubDir\(\);/);
  assert.ok(
    (mcp.match(/path\.join\(vaultPath, vaultSubDir,/g) ?? []).length >= 2,
    "MCP read and related-note paths must both use the resolved Green sub-dir",
  );
  assert.doesNotMatch(
    mcp,
    /path\.join\(vaultPath,\s*"spiral-buddy",/,
  );

  assert.match(
    app,
    /const DEFAULT_VAULT_SUBDIR = "spiral-buddy-green";/,
  );
  assert.match(
    app,
    /return explicit \|\| DEFAULT_VAULT_SUBDIR;/,
  );
  assert.ok(
    (app.match(/workspaceVaultSubDir\(/g) ?? []).length >= 4,
    "settings rows, removal help and active-workspace help should share one resolver",
  );
  assert.doesNotMatch(app, /vaultSubDir \?\? "spiral-buddy"/);
});
