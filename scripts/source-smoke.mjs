#!/usr/bin/env node
// Live smoke probes for every public online data host used by everquest1-mcp.
// Does not require EQ_GAME_PATH. Writes source-smoke-report.json and exits:
//   0 — at least one online source responded OK
//   1 — every online probe failed

import { writeFileSync } from "node:fs";

const USER_AGENT = "everquest1-mcp/source-smoke (+https://github.com/ArtSabintsev/everquest1-mcp)";
const TIMEOUT_MS = 20_000;

/** Public hosts only — local game files are out of scope for CI. */
const PROBES = [
  { id: "allakhazam", url: "https://everquest.allakhazam.com/" },
  { id: "almars", url: "https://www.almarsguides.com/eq/" },
  { id: "eq-traders", url: "https://www.eqtraders.com/" },
  { id: "eqarchives", url: "https://search.eqarchives.org/" },
  { id: "eqinterface", url: "https://www.eqinterface.com/" },
  { id: "eqresource", url: "https://eqresource.com/" },
  { id: "fanra", url: "https://everquest.fanra.info/" },
  { id: "fvproject-lore", url: "https://fvproject.com/index.php/Category:Lore" },
  { id: "lucy", url: "https://lucy.allakhazam.com/" },
  { id: "official-history-wayback", url: "https://web.archive.org/web/19990910004532/http://everquest.station.sony.com/e_history.html" },
  { id: "raidloot", url: "https://raidloot.com/EQ" },
  { id: "zliz", url: "https://www.zlizeq.com/" }
];

async function probe(entry) {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(entry.url, {
      method: "GET",
      headers: { "User-Agent": USER_AGENT, Accept: "text/html,*/*" },
      redirect: "follow",
      signal: controller.signal
    });
    clearTimeout(timer);
    const ok = res.status >= 200 && res.status < 400;
    return {
      id: entry.id,
      url: entry.url,
      ok,
      status: res.status,
      ms: Date.now() - started,
      error: ok ? null : `HTTP ${res.status}`
    };
  } catch (error) {
    clearTimeout(timer);
    return {
      id: entry.id,
      url: entry.url,
      ok: false,
      status: null,
      ms: Date.now() - started,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

const results = [];
for (const entry of PROBES) {
  // Sequential to stay polite on shared hosts.
  results.push(await probe(entry));
}

const report = {
  checkedAt: new Date().toISOString(),
  total: results.length,
  ok: results.filter((r) => r.ok).length,
  failed: results.filter((r) => !r.ok).length,
  results
};

writeFileSync("source-smoke-report.json", `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));

if (report.ok === 0) {
  console.error("All online source probes failed.");
  process.exit(1);
}

if (report.failed > 0) {
  console.error(`${report.failed} of ${report.total} source(s) failed (job stays green).`);
}

process.exit(0);
