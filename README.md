# Gravesmoke Road

Android-first dark fantasy RPG project.

Current prototype: **v0.7.7 — Greyhook Prisoner Choice Slice**.

## Current design

Gravesmoke Road is a nonlinear mobile CRPG with gamebook-style presentation, node travel, light supplies, deep character creation, named factions, party management, papers/warrants, investigation-led quests, tactical card combat, and access-barrier main story chapters.

## Current prototype status

v0.7.7 is a playable HTML prototype. It is not yet a stable Android APK. The prototype is being used to mature the RPG systems before wrapping them in a reliable Android build pipeline.

## v0.7.7 focus

- sealed-prisoner fate choices: question, extract, silence, or trade
- companion-specific Greyhook scenes in the outer yard
- starting enemy escalation inside Greyhook
- capture-route soft failure for failed extraction
- Greyhook prisoner outcome tracking in the Case Board and Company screen
- new prisoner-related papers, clues, blackmail, and trade items

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
→ sealed-prisoner choice
→ faction and world consequences
```

## Next milestone

**v0.8 — Greyhook Fortress vertical slice**

Goals:

- make Greyhook alert dynamically change scenes and exits
- expand consequences of prisoner choice
- add stronger companion reactions to prisoner fate
- add camp investigation scenes tied to Greyhook clues
- add full failure-forward routes for capture, exposure, and escape
- prepare Android wrapper work after the gameplay slice is stable
