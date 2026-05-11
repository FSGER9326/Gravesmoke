#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
node tools/validate-game-data.js
python3 -m http.server 8080
