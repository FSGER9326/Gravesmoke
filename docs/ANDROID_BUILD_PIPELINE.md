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

The app then loads:

```text
file:///android_asset/index.html
```

The WebView enables JavaScript, DOM storage, database storage, file access, content access, and file-URL access so local save data and local JSON fetches have the best chance to work.

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

- WebView local module and JSON loading must be tested on device.
- If the APK opens blank, the likely cause remains `file://` + ES module/fetch restrictions.
- If asset loading fails, switch from direct `file:///android_asset/index.html` loading to a safer local asset-loading strategy before adding release signing.
- Once debug builds work reliably, add a release workflow.

## Near-term Android tasks

1. Verify `npm run validate` passes on main.
2. Run GitHub Actions debug APK output.
3. Install generated APK on phone.
4. Confirm localStorage save persistence.
5. Confirm `data/game_data.json` and `data/greyhook_v08.json` load correctly inside WebView.
6. Confirm update install over the existing package.
7. Add release workflow only after debug APK is stable.
