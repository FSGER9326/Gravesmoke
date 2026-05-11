# Gravesmoke Road Project State

Updated: 2026-05-11

## Current prototype

**v0.8.0-dev1 — Greyhook Complete Flow Pass**

This is a playable HTML prototype moving toward the first stable Android-debug vertical slice. It is not yet a polished or verified Android APK.

## Game identity

Gravesmoke Road is an Android-first dark fantasy RPG with:

- gamebook-style presentation
- node travel
- light supplies and fatigue
- detailed character identity and starting personal enemy pressure
- identity-driven companions
- named factions
- papers, warrants, legal access, and crime records
- investigation-led quests
- Case Board route guidance
- failed-forward leads
- access-barrier main story chapters
- tactical card combat planned after the Greyhook flow is stable

## Current playable loop

```text
starting enemy / companion draft
→ node travel
→ Case Board
→ leads and clues
→ papers / reputation / route solutions
→ Greyhook approach choice
→ fortress interior scenes
→ alert / escape / capture pressure
→ sealed-prisoner choice
→ companion reactions and chapter consequence
→ Synod Archive next hook
```

## Current milestone

The project is implementing **v0.8 — Greyhook Fortress vertical slice**.

v0.8.0-dev1 currently includes:

- `data/greyhook_v08.json` structured chapter data
- Greyhook route families: supply escort, quartermaster blackmail, infirmary route, forged transfer, captured-inside route, escape route
- dev-only Greyhook jump state
- first Greyhook interior node and scene structure
- sealed prisoner contact and fate choices
- Greyhook alert ladder with lockdown and forced escape/capture pressure
- companion reaction cards and morale changes
- faction, legal/crime, and next-hook consequences
- expanded Case Board sections in progress
- current-objective guidance across the main screens
- direct route travel from Case Board and objective buttons
- scrollable centered map layout for manual testing
- camp save export/import/reset tools
- validation for Greyhook data references
- Greyhook topology validation for route reachability, lower-cell access, escape providers, prisoner choices, companion reactions, and acceptance criteria
- Android WebView wrapper scaffold at versionCode 80 / versionName 0.8.0-dev1

## Current validation commands

```bash
npm run validate
npm run validate:greyhook
npm run android:debug
```

`npm run validate` now runs data validation, runtime wiring validation, and Greyhook flow topology validation.

## Known risks / next checks

- The web flow now has a browser-smoked path from party start through Greyhook prisoner resolution and Synod Archive hook; more prisoner-fate variants still need manual passes.
- `src/main.js` still contains some hardcoded Greyhook flow logic and should be the next runtime stabilization target.
- Android WebView loading must be verified on device through the generated debug APK.
- Android debug workflow should be run only after `npm run validate` passes.
- Visual polish, combat expansion, release signing, and new chapters should wait until the Greyhook web flow is stable.
