# Roadmap

## v0.8 — Greyhook Fortress Vertical Slice

Goal: make Greyhook Fortress the first full chapter that proves the whole design loop.

### Required

- Complete Greyhook route progression:
  - supply escort
  - quartermaster blackmail
  - infirmary route
  - forged prisoner transfer
  - captured-inside route
  - escape route
- Expand Greyhook alert consequences:
  - patrol schedules
  - locked exits
  - search scenes
  - forced negotiation
  - capture and escape branches
- Expand sealed-prisoner consequences:
  - question
  - extract
  - silence
  - trade
- Add companion loyalty/morale effects from prisoner fate.
- Add starting enemy escalation scene tied to the player's flaw.
- Add first aftermath node after leaving Greyhook.

## v0.8.2 — RPG Foundation

Goal: build character, progression, travel, and settlement systems on the stable Greyhook vertical slice.

### Implemented (v0.8.2-dev1)

- 8 character origins with stat mods, items, factions
- Origin picker and character name flow
- XP, level progression (1-5), 10 learnable perks
- Road travel pressure: fatigue, node danger, terrain
- 11 road events with choice/consequence flow
- Settlement/hub play: Gallowsford, Greyhook Fortress, Synod Archive
- Companion loyalty/stress tracking
- Character sheet and perk system on Company screen
- Data files: origins.json, progression.json, travel.json, settlements.json
- Validators: progression, travel, settlements

### Next

- Playtest and balance loop
- Stabilize any stuck states
- Android verification
- Combat skeleton (v0.9)

## v0.8.1 — Runtime Stabilization (Completed)

- Visible runtime error diagnostics panel
- In-game debug state panel
- Playthrough validator
- Save import/export/reset hardening
- Android CI PR trigger

## v0.9 — Android Wrapper

- Use a proper Android build pipeline.
- Keep stable package name: `com.gravesmoke.road`.
- Add stable signing strategy.
- Add versionCode/versionName policy.
- Add local save storage.
- Avoid hand-built APK packaging.

## v1.0 Candidate

- First complete act:
  - Gallowsford
  - Old Watchtower
  - Greyhook Fortress
  - Synod Archive hook
- Save compatibility.
- Proper APK release artifact.
