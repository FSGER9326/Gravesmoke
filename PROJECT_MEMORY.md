# Gravesmoke Road — Project Memory

Auto-persisted development facts. Agent reads this on session start and appends to it.

## 2026-05-11
- v0.8.2-dev1 RPG Foundation Pass implemented on branch codex/v082-rpg-foundation.
- 8 character origins with full stat mods, items, faction deltas, and enemy bindings.
- XP/level progression (1-5) with 10 learnable perks that have mechanical effects.
- Vagrus-style road travel: node metadata (danger/rest/faction/terrain), travel fatigue, 11 road events with choice/consequence flow.
- 3 settlement hubs: Gallowsford (market town), Greyhook Fortress (restricted military), Synod Archive (occult).
- Companion loyalty/stress tracking updated by prisoner fate choices.
- Assets: scene art for 6 locations, companion portraits for 8 companions, 30+ UI icons, 1 sprite sheet.
- All 7 validators pass: data, runtime, greyhook, playthrough, progression, travel, settlements.
- `npm run validate` runs all 7 in sequence.
- `npm run start` serves locally at http://127.0.0.1:8080.
- Android wrapper at versionCode 81 / versionName 0.8.1-dev1 (not yet verified on device).
- GitHub remote: FSGER9326/Gravesmoke. Active branch: codex/v082-rpg-foundation.
- Greyhook vertical slice stable: 6 route families, 4 prisoner choices, alert ladder, companion reactions, Synod Archive hook.
- Main.js is ~340 lines single-file ES module. No frameworks.
- The game uses `app` and `nav` DOM elements from `index.html`. All rendering goes through `app.innerHTML`.
- `blank()` initializes saveVersion 2 with all RPG foundation fields.
