# Gravesmoke Road

Android-first dark fantasy RPG project.

Current prototype: **v0.7.8 — Greyhook Alert Consequence Slice**.

## Current design

Gravesmoke Road is a nonlinear mobile CRPG with gamebook-style presentation, node travel, light supplies, deep character creation, named factions, party management, papers/warrants, investigation-led quests, tactical card combat, and access-barrier main story chapters.

## Current prototype status

v0.7.8 is a playable HTML prototype. It is not yet a stable Android APK. The prototype is being used to mature the RPG systems before wrapping them in a reliable Android build pipeline.

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

## Next milestone

**v0.8 — Greyhook Fortress vertical slice**

Goals:

- complete Greyhook as a proper vertical slice chapter
- make alert change exits, patrols, dialogue, and route availability throughout Greyhook
- deepen companion reactions and loyalty/morale consequences
- expand aftermath of prisoner choice across factions and starting enemy pressure
- add first Android wrapper pass after the gameplay slice is stable
