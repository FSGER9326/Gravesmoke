# Gravesmoke Road Project State

Updated: 2026-05-11

## Current prototype

**v0.8.2-dev1 — RPG Foundation Pass**

This is a playable HTML prototype with character origins, XP/progression, road travel pressure, settlement hubs, companion depth, and item systems built on the stable Greyhook vertical slice. It is not yet a polished or verified Android APK.

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

The project is implementing **v0.8.2 — RPG Foundation**.

v0.8.2-dev1 currently includes:

- persistent player character identity: name, origin, background title, stats
- 8 origins with stat mods, starting items, faction deltas, enemy bindings, check bonuses, and drawbacks
- origin picker screen with name entry/randomize
- XP, level progression (1-5), unspent perk points
- 10 starter perks with implemented mechanical effects (travel, paper, social, mercy, healing, scout, blackmail, occult, supply, leadership)
- Company character sheet screen: character card with XP bar, stats, wounds, fatigue; available perk list
- Vagrus-style road travel: node metadata (danger, rest safety, faction owner, terrain), travel fatigue, hostile terrain heat, exhaustion warnings
- 11 road events with stat checks, choice/consequence flow, failed-forward outcomes
- settlement/hub play: Gallowsford, Greyhook Fortress, Synod Archive with districts and services
- companion loyalty/stress tracking updated by prisoner fate choices
- companion state displayed on Company companion cards
- fatigue recovery during rest, Camp Surgeon perk effect
- data-driven origin items and new item categories (token, occult, debt, contraband)
- `data/origins.json`, `data/progression.json`, `data/travel.json`, `data/settlements.json`
- validators: `validate:progression`, `validate:travel`, `validate:settlements`

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
- generated first-batch scene panels and companion portraits under `assets/art/**`
- generated and cropped UI icon sprite assets under `assets/ui/**`
- manifest-backed UI art helpers in `data/ui_assets.json` and `src/main.js`
- illustrated main play UI with scene art, portrait cards, item icons, faction marks, grouped actions, and icon-led bottom navigation
- scrollable centered map layout for manual testing
- camp save export/import/reset tools
- validation for Greyhook data references
- Greyhook topology validation for route reachability, lower-cell access, escape providers, prisoner choices, companion reactions, and acceptance criteria
- Android WebView wrapper scaffold at versionCode 81 / versionName 0.8.1-dev1

## Current validation commands

```bash
npm run validate
npm run validate:playthrough
npm run validate:greyhook
npm run android:debug
```

`npm run validate` now runs data validation, runtime wiring validation, Greyhook flow topology validation, and Greyhook playthrough path validation.

## Known risks / next checks

- The web flow now has a browser-smoked path from party start through Greyhook prisoner resolution and Synod Archive hook; more prisoner-fate variants still need manual passes.
- The runtime error panel catches boot failures, unhandled exceptions, and render errors, making Android blank screens diagnosable.
- The Camp Debug State panel provides in-game state inspection for QA and Android bug reports.
- Android WebView loading must be verified on device through the generated debug APK (see `docs/ANDROID_BUILD_PIPELINE.md` for verification checklist).
- `src/main.js` still contains some hardcoded Greyhook flow logic and should be the next runtime stabilization target.
- Visual polish, combat expansion, release signing, and new chapters should wait until the Greyhook web flow is stable.
