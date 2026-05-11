# Repository Structure

## Current layout

```text
/
  index.html                    Static web prototype entrypoint
  src/main.js                   Prototype game logic
  src/styles.css                Mobile-first dark fantasy UI styling
  data/game_data.json           Game content and systems data
  tools/validate-game-data.js   Data integrity validator
  scripts/serve-web.sh          Local web prototype runner
  scripts/build-android-debug.sh Local Android debug build helper
  android/                      Native Android WebView wrapper
  docs/                         Design and build documentation
  .github/workflows/            CI, Pages, and Android debug APK workflows
```

## Prototype layers

### Web layer

The playable prototype is static and intentionally simple:

```text
index.html
src/main.js
src/styles.css
data/game_data.json
```

This makes it easy to test in a browser and easy to package into an Android WebView.

### Data layer

`data/game_data.json` owns the content surface:

- nodes
- exits
- leads
- failed-forward routes
- items and papers
- companions
- factions

Before changing game systems, run:

```bash
npm run validate
```

### Android layer

The Android wrapper lives under `/android` and uses package name:

```text
com.gravesmoke.road
```

The Gradle app copies the web prototype into Android assets before building.

## Development rule

Keep gameplay/content changes in the web prototype first. Only modify Android wrapper code when packaging or device behavior requires it.

## Current Android goal

The current Android goal is not feature expansion; it is reliable build/install/update behavior.

The debug APK workflow should become the source of truth for whether an APK is install-ready.
