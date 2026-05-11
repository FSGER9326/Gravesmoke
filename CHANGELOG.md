# Changelog

## v0.8.0-dev1 — Greyhook Complete Flow Pass

- Added `data/greyhook_v08.json` as a structured vertical-slice data file.
- Added Greyhook chapter metadata, approaches, scenes, prisoner choices, companion reactions, enemy interference, and acceptance criteria.
- Updated `src/main.js` to load v0.8 Greyhook data alongside base game data.
- Added a development Greyhook jump state for faster testing.
- Implemented centralized helper logic for flags, clues, items, solutions, faction deltas, alert bands, alert text, and alert increases.
- Implemented Greyhook route families:
  - supply escort
  - quartermaster blackmail
  - infirmary route
  - forged transfer
  - captured-inside route
  - escape route
- Implemented Greyhook scenes:
  - gate search pattern
  - yard patrols
  - quartermaster lockbox
  - infirmary records
  - lower-cell access
  - archive hook
- Implemented sealed-prisoner choices:
  - question
  - extract
  - silence
  - trade
- Added prisoner-choice faction consequences, morale changes, item rewards, crimes, next hooks, and companion reactions.
- Added Greyhook aftermath resolution and Synod Archive hook.
- Expanded validator to check the v0.8 Greyhook data file.
- Added `tools/validate-greyhook-flow.js` to validate Greyhook route topology, climax reachability, lower-cell entry routes, escape-route providers, prisoner choice coverage, companion reactions, and acceptance criteria.
- Wired the Greyhook flow validator into `npm run validate` and exposed it as `npm run validate:greyhook`.
- Updated Android wrapper versionCode/versionName to `80` / `0.8.0-dev1`.

## v0.7.8 — Greyhook Alert Consequence Slice

- Added Greyhook alert ladder: routine, tightened searches, lockdown, forced escape/capture.
- Added alert-driven Greyhook consequences: patrol confrontation, escape mark, forced escape, deliberate capture route.
- Added companion reactions to prisoner fate.
- Added party morale tracking.
- Added camp actions tied to Greyhook: plan escape / reduce alert, debrief prisoner choice.
- Added Greyhook chapter resolution card.
- Added support items and leads: Greyhook Escape Mark, Companion Objection Note, Greyhook Escape Route.

## v0.7.7 — Greyhook Prisoner Choice Slice

- Added sealed-prisoner fate choices: question, extract, silence, or trade.
- Added companion-specific Greyhook scenes.
- Added starting enemy escalation inside Greyhook.
- Added capture-route soft failure for failed extraction.
- Added Greyhook prisoner outcome tracking.

## v0.7.6 — Greyhook Interior Slice

- Added first playable Greyhook interior nodes: Greyhook Outer Yard, Lower Cells, Sealed Prisoner Cell.
- Greyhook approach choices now move the player inside the fortress.
- Added gate search, yard patrol, quartermaster, infirmary, lower-cell, and sealed prisoner scenes.

## v0.7.5 — Road to v0.8

- Added transformed failed-forward leads.
- Added Greyhook Fortress chapter scaffold.
- Added Greyhook access papers.
- Added chapter-aware Case Board route cards.

## v0.7.4 — Case Board Foundation

- Added bottom navigation: Map, Board, Company, Pack, Camp.
- Consolidated Access Dossier, Clue Board, Papers, Pressure, and route guidance into a central Case Board.
- Added next-step guidance and lead route graph.

## v0.7.3 and earlier

- Added origin scene, starting enemy, papers/items, access checks, legal record, faction clocks, wounds, camp, clue board, enemy intent, and reputation titles.
- Added character creation, companion draft, Gallowsford node map, The Sealed Ledger, first combat skeleton, and local save.
