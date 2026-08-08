# Backlog

Prioritized follow-ups for **everquest1-mcp**. Not a commitment schedule — pick from the top of a section when you have a spare cycle.

## P0 — platform parity (keep the lights on)

- [x] Semver tags + GitHub Releases on every substantive `main` push (`VERSIONING.md`, Release workflow).
- [ ] **Keepalive workflow** (empty commit when main is quiet >45 days) so scheduled jobs cannot be disabled by GitHub’s 60-day inactivity rule — same pattern as `guildwars-reforged-mcp`.
- [ ] **Conventional-commit hygiene on Dependabot**: ensure squash/merge subjects stay conventional so auto-releases stay meaningful (`chore(deps): …`).
- [ ] Pin release validation to Node 22 only (match Release runner); keep CI matrix on 20/22/24.

## P1 — continuous health / “always on”

- [ ] **Source smoke workflow** (scheduled): hit each online DB homepage or a cheap search with a bounded timeout; report per-source up/down without failing the whole suite on one flaky host (mirror GW `source-smoke.yml`).
- [ ] **Structured smoke report artifact** + optional Slack/GitHub issue when a source is red for N consecutive runs.
- [ ] Document expected rate limits / User-Agent policy per source in `docs/` (Allakhazam, Lucy, Fanra, etc.).

## P2 — data coverage

- [ ] Audit online sources vs README table: drop dead hosts, add any post-2025 EQ1 community DBs that are public and scrape-friendly.
- [ ] **EQ Resource / modern expansion** depth: progression flags, current-tier raid notes if still HTML-stable.
- [ ] **Tradeskill** coverage pass (EQ Traders recipes) — search quality + tool descriptions.
- [ ] Optional: lightweight **snapshot/diff job** for local-game parsers when `EQ_GAME_PATH` is available on a self-hosted runner (not required for public CI).
- [ ] Map / Brewall POI refresh notes when the local install path is present.

## P3 — agent experience

- [ ] Collapse or namespace the 412-tool surface into clearer groups in the tool list (spells / items / zones / online / lore) without breaking tool names.
- [ ] Add `eq1_sources` / provenance-style tools for “what am I querying?” (local vs online, last successful fetch).
- [ ] Era/advisory notes when results mix classic vs current Live expansion content (similar spirit to EQL era advisories).
- [ ] README install recipes for Codex / Claude Code / Grok that match the other MCP repos (`npx github:…` if published that way).

## P4 — packaging & ops

- [ ] Publish to npm under `everquest1-mcp` *or* document GitHub-only install as canonical.
- [ ] Dockerfile healthcheck + sample compose for long-running stdio/http bridge if used.
- [ ] Dependabot auto-merge: confirm `fetch-metadata@v3` + non-major actions actually merge (EQ1 historically skipped Wait-for-CI when update-type looked major).

## Done recently

- [x] Alphabetize online database table in README.
- [x] Merge Dependabot setup-node v7 + fetch-metadata v3.
- [x] Delete stale `website` branch.
- [x] Baseline `v1.0.0` tag + GitHub Release.
