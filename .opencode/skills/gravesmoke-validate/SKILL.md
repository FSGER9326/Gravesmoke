---name: gravesmoke-validatedescription: Gravesmoke Road validation workflow. Load when validation fails or when adding new data files, validators, or package scripts.compatibility: opencodemetadata:  audience: developers  workflow: gravesmoke-road---
## Validation Workflow

Always run validation after making changes:

```bash
npm run validate
```

If validation fails:
1. Read the error message carefully — it names the exact file, line, and missing key/reference.
2. Fix the referenced issue (missing item, missing node reference, missing save key, etc.).
3. If adding new data files, ensure `validate-runtime.js` checks they are loaded in `main.js`.
4. If adding new state to `blank()`, also update the `requiredSaveKeys` array in `validate-greyhook-playthrough.js`.
5. Re-run `npm run validate` after fixing.

## Validator Files

| Validator | What it checks |
|---|---|
| `validate-game-data.js` | nodes, leads, items, companions, factions integrity; greyhook data cross-references |
| `validate-runtime.js` | File existence, main.js wiring, CSS classes, Android asset sync, UI manifest paths, module syntax |
| `validate-greyhook-flow.js` | Greyhook topology: approaches, scene reachability, prisoner choice coverage, companion reactions |
| `validate-greyhook-playthrough.js` | Natural start path, route solutions, approach→climax reachability, prisoner aftermath, Synod hook, save keys in `blank()` |
| `validate-progression.js` | Origins (8+ with required fields), perks (8+), XP thresholds (5+), XP awards (6+), blank() keys |
| `validate-travel.js` | Node metadata coverage, road events (8+ with choices/consequences), blank() keys |
| `validate-settlements.js` | Settlement districts, services, effects, blank() keys |

## Common Validation Fixes

| Error | Fix |
|---|---|
| "missing required key: X" | Add `X` to the corresponding section in `ui_assets.json` or `blank()` |
| "references missing node: X" | Add node to `data/game_data.json` OR fix the reference |
| "references missing item: X" | Add item to `data/game_data.json` |
| "cannot find blank() definition" | The multiline regex failed; verify `blank()` function structure |
| "module syntax validation" | Fix JS syntax error in `src/main.js` shown in the error output |

## When to use me

Load this skill when:
- Running validation
- Debugging validation failures
- Adding new validators
- Updating package.json scripts
- Understanding what each validator checks
