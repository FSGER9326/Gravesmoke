#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "Validating game data..."
node tools/validate-game-data.js

echo "Building Android debug APK..."
gradle -p android assembleDebug

echo "Built APK(s):"
ls -lh android/app/build/outputs/apk/debug/*.apk
