# Gravesmoke Road

Android-first dark fantasy RPG project.

Current prototype: **v0.7.6 — Greyhook Interior Slice**.

## Current design

Gravesmoke Road is a nonlinear mobile CRPG with gamebook-style presentation, node travel, light supplies, deep character creation, named factions, party management, papers/warrants, investigation-led quests, and tactical card combat.

## Current prototype status

v0.7.6 is a playable HTML prototype. It is not yet a stable Android APK. The prototype is being used to mature the RPG systems before wrapping them in a reliable Android build pipeline.

## v0.7.6 focus

- first playable Greyhook Fortress interior slice
- Greyhook approach choices now move the player inside the fortress
- new interior nodes: Greyhook Outer Yard, Lower Cells, Sealed Prisoner Cell
- gate search pattern, patrol study, quartermaster confrontation, infirmary records, and lower-cell access scenes
- starting enemy interference inside Greyhook
- first sealed-prisoner contact
- Case Board shows Greyhook interior status

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
→ combat or non-combat resolution
→ faction and world consequences
```

## Next milestone

**v0.8 — Greyhook Fortress vertical slice**

Goals:

- expand Greyhook interior into a complete chapter
- add full sealed prisoner objective: extract, question, silence, or trade the prisoner
- add stronger starting-enemy escalation
- add companion/camp investigation scenes tied to Greyhook clues
- add more soft-failure routes inside the fortress
- prepare Android wrapper work after the gameplay slice is stable
