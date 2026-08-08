# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2026-08-08

### Added

- Keepalive workflow so scheduled jobs survive quiet stretches on `main` (#5).
- Scheduled Source Smoke workflow + `npm run smoke:sources` probing every public online host (#6).
- `eq1_sources` / enhanced `list_sources` provenance (local vs online authority, last-success health) and `list_tool_groups`; tool descriptions prefixed with `[group]` without renaming IDs (#7).

### Changed

- Changelog and docs no longer cross-reference other game MCP packages.

## [1.1.1] - 2026-08-08

### Changed

- mark release automation done and link tracking issues (a16e881)

## [1.1.0] - 2026-08-08

### Added

- Automatic semver Release workflow (`scripts/prepare-release.mjs`, annotated `v*` tags, GitHub Releases) on every substantive push to `main`.
- `VERSIONING.md` and `BACKLOG.md`.

## [1.0.0] - 2026-08-08

### Added

- Baseline release for the existing EverQuest 1 MCP package (local game-data parsers, multi-source online search, lore/archives). Tag formalizes the pre-automation `package.json` version.
