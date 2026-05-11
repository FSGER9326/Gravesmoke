# Gravesmoke Road

Android-first dark fantasy RPG project.

Current prototype: **v0.8.0-dev1 — Greyhook Complete Flow Pass**.

## Current design

Gravesmoke Road is a nonlinear mobile CRPG with gamebook-style presentation, node travel, light supplies and fatigue, detailed character identity, named factions, party management, papers/warrants, investigation-led quests, tactical card combat, access-barrier main story chapters, starting personal enemy pressure, and a Case Board that keeps route logic visible.

## Current repository status

The repo contains a modular prototype layout:

```text
/
  index.html
  src/main.js
  src/styles.css
  data/game_data.json
  data/greyhook_v08.json
  tools/validate-game-data.js
  android/
  docs/
  .github/workflows/
```

The web prototype is playable from `index.html`. The Android wrapper scaffold exists under `/android` and copies the same static prototype into WebView assets before the Gradle debug build.

## Android status

The Android project uses:

```text
package: com.gravesmoke.road
versionCode: 80
versionName: 0.8.0-dev1
minSdk: 23
targetSdk: 35
compileSdk: 35
```

A debug APK workflow exists at:

```text
.github/workflows/android-debug.yml
```

The Android wrapper is scaffolded, but gameplay stability and data validation remain the priority before treating APK output as install-ready.

## v0.8.0-dev1 focus

- Greyhook Fortress complete-flow pass
- structured `data/greyhook_v08.json` for chapter metadata, approaches, scenes, prisoner choices, companion reactions, enemy interference, and acceptance criteria
- dev-only “Jump to Greyhook test state” helper
- Greyhook route families: supply escort, quartermaster blackmail, infirmary, forged transfer, captured-inside, escape
- Greyhook alert ladder: routine, tightened searches, lockdown, forced escape/capture
- sealed-prisoner choices: question, extract, silence, trade
- visible Case Board sections for objective, routes, interior status, prisoner fate, alert, reactions, consequences, and next step
- faction, morale, crime, and next-hook consequences
- validator coverage for Greyhook v0.8 data references

## Core loop

```text
character identity / starting enemy
→ companion draft
→ node travel
→ Case Board
→ leads and clues
→ papers / warrants / reputation
→ approach choice
→ fortress interior scenes
→ alert / escape / capture pressure
→ sealed-prisoner choice
→ companion reactions and chapter consequence
```

## Local commands

```bash
npm run validate
npm run dev
npm run sync
./scripts/build-android-debug.sh
```

For the local test server and GitHub sync workflow, see `docs/LOCAL_DEV_SYNC.md`.

## Next milestone

**v0.8 — Greyhook Fortress vertical slice stabilization**

Goals:

- manually play the web flow from new game to Greyhook aftermath
- fix any stuck states found during playthrough
- verify the Android debug APK workflow and fix build issues found by CI
- install APK on device and confirm WebView asset loading plus localStorage persistence
