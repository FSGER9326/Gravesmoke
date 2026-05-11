# Gravesmoke Road

Android-first dark fantasy RPG project.

Current prototype: **v0.7.8 — Greyhook Alert Consequence Slice**.

## Current design

Gravesmoke Road is a nonlinear mobile CRPG with gamebook-style presentation, node travel, light supplies, deep character creation, named factions, party management, papers/warrants, investigation-led quests, tactical card combat, and access-barrier main story chapters.

## Current repository status

The repo now contains a proper modular prototype layout:

```text
/
  index.html
  src/main.js
  src/styles.css
  data/game_data.json
  tools/validate-game-data.js
  android/
  docs/
  .github/workflows/
```

The web prototype is playable from `index.html`. The Android wrapper scaffold exists under `/android` and loads the same local web prototype through a WebView.

## Android status

The Android project uses:

```text
package: com.gravesmoke.road
versionCode: 78
versionName: 0.7.8
minSdk: 23
targetSdk: 35
compileSdk: 35
```

A debug APK workflow exists at:

```text
.github/workflows/android-debug.yml
```

The Android wrapper is now scaffolded, but still needs real CI verification before treating the APK as install-ready.

## v0.7.8 focus

- Greyhook alert ladder: routine, tightened searches, lockdown, forced escape/capture
- alert-driven Greyhook consequences: patrol confrontation, escape mark, forced escape, deliberate capture route
- companion reactions to prisoner fate
- party morale tracking
- camp actions tied to Greyhook: plan escape / reduce alert, debrief prisoner choice
- Greyhook chapter resolution card
- new support items and leads: Greyhook Escape Mark, Companion Objection Note, Greyhook Escape Route

## Core loop

```text
character origin
→ companion draft
→ node travel
→ case board
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
python3 -m http.server 8080
./scripts/build-android-debug.sh
```

## Next milestone

**v0.8 — Greyhook Fortress vertical slice**

Goals:

- complete Greyhook as a proper vertical slice chapter
- make alert change exits, patrols, dialogue, and route availability throughout Greyhook
- deepen companion reactions and loyalty/morale consequences
- expand aftermath of prisoner choice across factions and starting enemy pressure
- verify the Android debug APK workflow and fix build issues found by CI
