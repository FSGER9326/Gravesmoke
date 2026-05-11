# Android Build Pipeline

## Current state

The project currently ships as a playable HTML prototype. Earlier hand-built APK attempts were unreliable. The next Android milestone should use a proper, repeatable Android build system.

## Recommended route

Use a stable WebView wrapper or Capacitor-style wrapper around the current HTML prototype until the game needs engine-level rendering.

## Requirements

- Stable package name: `com.gravesmoke.road`
- Stable signing key
- Incrementing `versionCode`
- Human-readable `versionName`
- Local save compatibility
- No hand-written binary Android manifest
- No ad-hoc APK zipping
- Proper debug/release build scripts

## Suggested repository structure

```text
/
  index.html
  data/game_data.json
  src/main.js
  src/styles.css
  docs/
  android/
  tools/
```

## Near-term Android tasks

1. Create Android project wrapper.
2. Load `index.html` from local assets.
3. Enable localStorage/save persistence.
4. Build debug APK.
5. Test install/update behavior.
6. Only then create a release APK flow.
