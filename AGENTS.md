# Gravesmoke Road — AI Agent Rules

Dark fantasy RPG prototype. Android-first, gamebook-style mobile UI, node travel, settlement hubs, Case Board investigation, companion party management.

## Commands

```bash
npm run validate              # All 7 validators (MUST PASS before commit)
npm run start                 # Dev server at http://127.0.0.1:8080
npm run dev                   # Validate then start server
npm run android:debug         # Build Android debug APK (pending env)
```

## Project Structure

```
Gravesmoke/
  index.html                  # Single HTML shell: #app, #nav, module script
  src/main.js                 # ~340-line ES module, no frameworks
  src/styles.css              # Dark fantasy themed CSS
  data/game_data.json         # Nodes, leads, items, companions, factions
  data/greyhook_v08.json      # Greyhook chapter: scenes, approaches, choices
  data/ui_assets.json         # UI manifest: nav, actions, itemTypes, companions, nodes
  data/origins.json           # 8 character origins
  data/progression.json       # XP thresholds, 10 perks, XP awards
  data/travel.json            # Node metadata, 11 road events
  data/settlements.json       # 3 settlement hubs with districts/services
  tools/validate-*.js         # 7 validators
  android/                    # Android WebView wrapper scaffold
  assets/art/portraits/       # 8 companion portraits
  assets/art/scenes/          # 6 location scene images
  assets/ui/                  # 30+ icon PNGs + sprite sheet
  .opencode/skills/           # 3 project-specific agent skills
  .opencode/plugins/          # Local memory plugin
```

## Code Conventions

- Single-file ES module architecture. No frameworks, no build step.
- `blank()` returns default game state. Add new state here first.
- `hydrate()` backfills missing fields for save compatibility.
- Functions are often redefined - last definition wins (clobber pattern).
- All rendering goes through `app.innerHTML`. Template literals everywhere.
- Global functions exposed via `window.fnName = fnName` for onclick handlers.
- No comments unless explicitly requested.
- Keep diffs small and localized. Prefer data-driven additions.

## When Making Changes

1. Read relevant data files and src/main.js first.
2. If adding state: add to `blank()`, update `hydrate()` array list, update `validate-greyhook-playthrough.js` required keys.
3. If adding data file: add fetch in boot try/catch, create validator, add to package.json scripts.
4. After changes: `npm run validate` MUST PASS.
5. Run `git diff --stat` to review before committing.
6. NEVER commit without validation passing.

## Key Implementation Details

- `blank()` currently has saveVersion:2 with ~45 fields.
- Game state `S` is the single source of truth, synced to localStorage.
- Screens: title, origin, party, map, board, company, pack, camp, node, settlement.
- Bottom nav: Map, Board, Company, Pack, Camp.
- Travel: `spendTravel(steps)` deducts food, adds fatigue. `travel()` and `routeTo()` both trigger `maybeRoadEvent()`.
- Greyhook: 6 route families, alert ladder (0-5+), 4 prisoner choices, Synod Archive hook.
- Origins: 8 origins with stat mods, items, faction deltas, enemy bindings, check bonuses, drawbacks.
- XP: Awarded via `awardXp(amount, reason)` — uses flags to prevent farming. `checkLevelUp()` auto-called.
- Perks: Learned via `learnPerk(id)` — deducts points, prevents duplicates, 10 perks available.
- Settlements: Entered via "Enter Settlement" button on node screen when at a settlement node.
