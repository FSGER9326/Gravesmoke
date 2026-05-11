---name: gravesmoke-datadescription: Gravesmoke Road data model, validation commands, and project conventions. Load when modifying data files, adding content, or debugging validation failures.compatibility: opencodemetadata:  audience: developers  workflow: gravesmoke-road---
## Project Identity

Gravesmoke Road is an Android-first dark fantasy RPG with gamebook-style mobile UI, node travel, supplies/fatigue, character identity, companions, named factions, and a Case Board investigation UI.

## Data Files

| File | Structure |
|---|---|
| `data/game_data.json` | Nodes, leads, items, companions, factions. Central data store. |
| `data/greyhook_v08.json` | Greyhook chapter data: scenes, approaches, prisoner choices, reactions. |
| `data/ui_assets.json` | UI asset manifest: nav, actions, factions, itemTypes, companions, nodes. Maps icon names to file paths. |
| `data/origins.json` | 8 character origins with stats, items, faction deltas, enemy bindings. |
| `data/progression.json` | XP thresholds (6 levels), 10 perks with mechanical bonuses, XP award config. |
| `data/travel.json` | 19 node metadata entries (danger, restSafety, factionOwner, terrain), 11 road events with choices/consequences. |
| `data/settlements.json` | Gallowsford, Greyhook Fortress, Synod Archive with districts and services. |

## Validation Commands

```bash
npm run validate              # All 7 validators
npm run validate:data         # game_data.json
npm run validate:runtime      # Wiring + syntax
npm run validate:greyhook     # Greyhook topology
npm run validate:playthrough  # Greyhook paths
npm run validate:progression  # Origins, perks, XP
npm run validate:travel       # Node metadata, events
npm run validate:settlements  # Settlement data
```

## Codebase Conventions

- `src/main.js`: Single 300+ line ES module. No frameworks. Top-level await loads data files. Functions are densely packed, often redefined later in the file (last definition wins).
- `blank()`: Returns default game state with `saveVersion:2`. When adding new state, always add to `blank()` and update `hydrate()`.
- `hydrate()`: Backfills missing fields from `blank()`. Array fields listed in the `for...of` loop.
- UI helpers: `btn()`, `tag()`, `card()`, `assetImg()`, all template literal builders.
- Screen functions: `title()`, `map()`, `board()`, `company()`, `pack()`, `camp()`, `party()`, `nodeScreen()`, `originScreen()`, `settlementScreen()`.
- NEVER add comments to code.
- Follow existing patterns when adding new screens: render via `go()`, use `btn()`/`card()`/`tag()` helpers.

## When to use me

Load this skill when:
- Adding or modifying data in `data/*.json` files
- Debugging validation failures
- Understanding the data model
- Adding new game state fields
