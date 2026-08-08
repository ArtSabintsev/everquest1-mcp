# Backlog

Prioritized follow-ups for **everquest1-mcp**. Not a commitment schedule — pick from the top of a section when you have a spare cycle.

## P0 — keep the lights on

- [x] Semver tags + GitHub Releases on every substantive `main` push (`VERSIONING.md`, Release workflow).
- [x] **Keepalive workflow** (empty commit when main is quiet >45 days) so scheduled jobs are not disabled by GitHub’s 60-day inactivity rule (#5).
- [ ] **Conventional-commit hygiene on Dependabot**: ensure squash/merge subjects stay conventional so auto-releases stay meaningful (`chore(deps): …`).
- [ ] Pin release validation to Node 22 only (match Release runner); keep CI matrix on 20/22/24.

## P1 — continuous health

- [x] **Source smoke workflow** (scheduled): probe each public online host with a bounded timeout; report per-source status; fail only if every host is down (#6).
- [ ] **Structured smoke alert** (optional GitHub issue) when a source is red for N consecutive runs.
- [ ] Document expected rate limits / User-Agent policy per source in `docs/` (Allakhazam, Lucy, Fanra, etc.).

## P2 — data coverage

- [ ] Audit online sources vs README table: drop dead hosts, add any new public EQ1 community DBs that are scrape-friendly.
- [ ] **EQ Resource / modern expansion** depth: progression flags, current-tier raid notes if still HTML-stable.
- [ ] **Tradeskill** coverage pass (EQ Traders recipes) — search quality + tool descriptions.
- [ ] Optional: lightweight **snapshot/diff job** for local-game parsers when `EQ_GAME_PATH` is available on a self-hosted runner (not required for public CI).
- [ ] Map / Brewall POI refresh notes when the local install path is present.

## P3 — agent experience

- [x] Tool groups via `[group]` description prefixes + `list_tool_groups` (IDs unchanged) (#7).
- [x] `eq1_sources` / `list_sources` provenance: local vs online, last-success health (#7).
- [ ] Era/advisory notes when results mix classic vs current Live expansion content.
- [ ] README install recipes for common MCP clients (`npx github:ArtSabintsev/everquest1-mcp`, Claude, Codex, Grok).

## P4 — packaging & ops

- [ ] Publish to npm under `everquest1-mcp` *or* document GitHub-only install as canonical.
- [ ] Dockerfile healthcheck + sample compose for long-running stdio/http bridge if used.
- [ ] Dependabot auto-merge: confirm non-major updates actually merge after CI.

## Done recently

- [x] Alphabetize online database table in README.
- [x] Merge Dependabot setup-node v7 + fetch-metadata v3.
- [x] Delete stale `website` branch.
- [x] Baseline `v1.0.0` tag + GitHub Release; automation live from **v1.1.0**.
- [x] Issues #5, #6, #7 implemented.
