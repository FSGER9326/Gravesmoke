# Android Build Pipeline

## Current state

The project now has an Android wrapper scaffold under `/android`.

The current Android wrapper is a native Android WebView app that loads the same local static prototype used by the browser build.

Earlier hand-built APK attempts were unreliable. This repo now moves toward a repeatable Gradle and CI build pipeline instead.

## Current Android identity

```text
package: com.gravesmoke.road
versionCode: 78
versionName: 0.7.8
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

The WebView enables JavaScript and DOM storage so local save data can work.

## CI workflow

The debug APK workflow exists here:

```text
.github/workflows/android-debug.yml
```

It should validate the game data, set up Java and Android tooling, run the Gradle debug build, and upload the debug APK artifact.

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

- The Android workflow still needs CI confirmation.
- WebView local module and data loading must be tested on device.
- If asset loading fails, switch to a safer local asset-serving approach.
- Once debug builds work, add a release workflow.

## Near-term Android tasks

1. Verify GitHub Actions debug APK output.
2. Install generated APK on phone.
3. Confirm localStorage save persistence.
4. Confirm `data/game_data.json` loads correctly inside WebView.
5. Confirm upgrade install over the existing package.
6. Add release workflow only after debug APK is stable.
