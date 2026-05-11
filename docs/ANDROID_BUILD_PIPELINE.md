# Android Build Pipeline

## Current state

The project has an Android wrapper scaffold under `/android`.

The current Android wrapper is a native Android WebView app that loads the same local static prototype used by the browser build.

Earlier hand-built APK attempts were unreliable. This repo now moves toward a repeatable Gradle and CI build pipeline instead.

## Current Android identity

```text
package: com.gravesmoke.road
versionCode: 80
versionName: 0.8.0-dev1
minSdk: 23
targetSdk: 35
compileSdk: 35
```

## Current Android files

```text
android/settings.gradle
android/build.gradle
android/gradle.properties
android/app/build.gradle
android/app/src/main/AndroidManifest.xml
android/app/src/main/java/com/gravesmoke/road/MainActivity.java
android/app/src/main/res/values/styles.xml
android/app/src/main/res/values/strings.xml
```

## Asset sync model

The Android app copies these web files into Android assets before build:

```text
index.html
src/**
data/**
```

The app now serves those copied files through AndroidX `WebViewAssetLoader` instead of loading them directly through `file://`.

The app entrypoint is:

```text
https://appassets.androidplatform.net/assets/index.html
```

The `/assets/` path is mapped to the Android app asset directory, so relative browser paths such as `src/main.js`, `src/styles.css`, `data/game_data.json`, and `data/greyhook_v08.json` resolve under the same origin.

This is intended to reduce the previous blank-screen risk from `file://` + ES module/fetch restrictions while keeping the prototype fully offline and bundled inside the APK.

The WebView enables JavaScript, DOM storage, and database storage for the prototype. Direct file/content access and file-URL cross access are deliberately disabled because the asset loader provides the local HTTPS-like origin.

## Runtime validation

`npm run validate` now checks both the web runtime and Android wrapper wiring:

- `index.html` still exposes the expected app/nav roots and module script.
- `src/main.js` still loads both game data files and passes module syntax validation.
- `MainActivity.java` still uses `WebViewAssetLoader`.
- `MainActivity.java` still loads `https://appassets.androidplatform.net/assets/index.html`.
- `MainActivity.java` must not regress to `file:///android_asset/index.html`.

## CI workflow

The debug APK workflow exists here:

```text
.github/workflows/android-debug.yml
```

It validates the game data, sets up Java and Android tooling, runs the Gradle debug build, and uploads the debug APK artifact.

## Local build command

```bash
./scripts/build-android-debug.sh
```

Or manually:

```bash
npm run validate
gradle -p android assembleDebug
```

## Remaining risks

- WebView local module and JSON loading must still be tested on device.
- If the APK opens blank after the asset-loader change, inspect Android logcat for JavaScript module, fetch, CSP, or missing-asset errors.
- Confirm localStorage save persistence under the asset-loader origin before treating APK output as stable.
- Once debug builds work reliably, add a release workflow.

## Near-term Android tasks

1. Verify `npm run validate` passes on main.
2. Run GitHub Actions debug APK output.
3. Install generated APK on phone.
4. Confirm localStorage save persistence.
5. Confirm `data/game_data.json` and `data/greyhook_v08.json` load correctly inside WebView.
6. Confirm update install over the existing package.
7. Add release workflow only after debug APK is stable.
