---name: gravesmoke-rulesdescription: Gravesmoke Road game design rules and constraints. Load before implementing new features, adding content, or making architectural decisions.compatibility: opencodemetadata:  audience: developers  workflow: gravesmoke-road---
## Game Design Rules

### Non-Goals (DO NOT DO)
- Do not add a new chapter after Synod Archive.
- Do not implement full tactical combat yet.
- Do not rewrite the whole game engine.
- Do not introduce a frontend framework (React, Vue, etc.).
- Do not change Android package name (`com.gravesmoke.road`).
- Do not remove or break Greyhook content.
- Do not break Android asset loading.
- Do not claim Android APK verification unless actually installed and tested.
- Do not add paid or external online dependencies.

### Design Priorities
- Mobile-first UI: thumb-friendly, readable on small screens, progressive disclosure.
- Data-driven: prefer adding to data/*.json files over hardcoding in main.js.
- Two linked play scales: World/Road Travel Layer + Settlement/Hub Layer.
- Travel should cost resources (food, fatigue, heat), not just be a button press.
- Settlements should feel different from road nodes: services, districts, local actions.
- Companions should have personality: loyalty, stress, reactions to player choices.
- Greyhook vertical slice must remain stable through all changes.

### File Changes Convention
- Small, localized edits. Prefer local patches over broad rewrites.
- Treat assets and generated art cautiously: verify file existence before wiring paths.
- Always run `npm run validate` after changes.
- Run `git status` and `git diff --stat` before committing.
- Commit messages should describe the "why" not just the "what".

### Content Pipeline
When adding new content:
1. Define in the appropriate data/*.json file
2. Wire in src/main.js if runtime logic is needed
3. Add a constant outside blank() if it's a data reference
4. Add to validator if it has cross-references
5. Run `npm run validate`
6. Commit

## When to use me

Load this skill when:
- Planning a new feature
- Making architectural decisions
- Adding content or mechanics
- Reviewing changes for compliance with game design rules
