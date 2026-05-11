const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function requireText(path) {
  if (!fs.existsSync(path)) throw new Error(`Missing required file: ${path}`);
  return fs.readFileSync(path, 'utf8');
}

const index = requireText('index.html');
const main = requireText('src/main.js');
const styles = requireText('src/styles.css');
const uiAssetsText = requireText('data/ui_assets.json');
const androidGradle = requireText('android/app/build.gradle');
const androidMain = requireText('android/app/src/main/java/com/gravesmoke/road/MainActivity.java');
const uiAssets = JSON.parse(uiAssetsText);

function requireIncludes(text, needle, context) {
  if (!text.includes(needle)) throw new Error(`${context} missing required text: ${needle}`);
}

function requireExcludes(text, needle, context) {
  if (text.includes(needle)) throw new Error(`${context} contains forbidden legacy text: ${needle}`);
}

requireIncludes(index, 'id="app"', 'index.html');
requireIncludes(index, 'id="nav"', 'index.html');
requireIncludes(index, 'type="module"', 'index.html');
requireIncludes(index, 'src="src/main.js"', 'index.html');
requireIncludes(index, 'href="src/styles.css"', 'index.html');

requireIncludes(main, "fetch('./data/game_data.json')", 'src/main.js');
requireIncludes(main, "fetch('./data/greyhook_v08.json')", 'src/main.js');
requireIncludes(main, "fetch('./data/ui_assets.json')", 'src/main.js');
requireIncludes(main, 'function nodeArt', 'src/main.js');
requireIncludes(main, 'function companionPortrait', 'src/main.js');
requireIncludes(main, 'function itemIcon', 'src/main.js');
requireIncludes(main, 'function factionMark', 'src/main.js');
requireIncludes(main, 'greyhookAlertBand', 'src/main.js');
requireIncludes(main, 'greyhookAlertText', 'src/main.js');
requireIncludes(main, 'raiseGreyhookAlert', 'src/main.js');
requireIncludes(main, 'isGreyhookLockdown', 'src/main.js');
requireIncludes(main, 'canUseExit', 'src/main.js');
requireIncludes(main, 'function board()', 'src/main.js');
requireIncludes(main, 'function prisonerChoice', 'src/main.js');
requireIncludes(main, 'function escapeOrCapture', 'src/main.js');

requireIncludes(main, 'function showRuntimeError', 'src/main.js');
requireIncludes(main, 'function escapeHtml', 'src/main.js');
requireIncludes(main, "window.addEventListener('error'", 'src/main.js');
requireIncludes(main, "window.addEventListener('unhandledrejection'", 'src/main.js');
requireIncludes(main, 'Runtime Error', 'src/main.js');
requireIncludes(main, 'function debugStatePanel', 'src/main.js');
requireIncludes(main, 'Debug State', 'src/main.js');
requireIncludes(main, 'debugStateText', 'src/main.js');
requireIncludes(styles, '.debugPanel', 'src/styles.css');

requireIncludes(styles, '.panel', 'src/styles.css');
requireIncludes(styles, '.btn', 'src/styles.css');
requireIncludes(styles, '.card', 'src/styles.css');
requireIncludes(styles, '.sceneArt', 'src/styles.css');
requireIncludes(styles, '.portrait', 'src/styles.css');
requireIncludes(styles, '.itemIcon', 'src/styles.css');
requireIncludes(styles, '.factionMark', 'src/styles.css');
requireIncludes(styles, '.actionGroup', 'src/styles.css');
requireIncludes(styles, '.navIcon', 'src/styles.css');

requireIncludes(androidGradle, "include 'assets/**'", 'android/app/build.gradle');

requireIncludes(androidMain, 'androidx.webkit.WebViewAssetLoader', 'MainActivity.java');
requireIncludes(androidMain, 'new WebViewAssetLoader.Builder()', 'MainActivity.java');
requireIncludes(androidMain, 'addPathHandler("/assets/"', 'MainActivity.java');
requireIncludes(androidMain, 'https://appassets.androidplatform.net/assets/index.html', 'MainActivity.java');
requireIncludes(androidMain, 'shouldInterceptRequest', 'MainActivity.java');
requireIncludes(androidMain, 'settings.setAllowFileAccess(false)', 'MainActivity.java');
requireIncludes(androidMain, 'settings.setAllowFileAccessFromFileURLs(false)', 'MainActivity.java');
requireIncludes(androidMain, 'settings.setAllowUniversalAccessFromFileURLs(false)', 'MainActivity.java');
requireExcludes(androidMain, 'file:///android_asset/index.html', 'MainActivity.java');

function requireKeys(object, keys, context) {
  for (const key of keys) {
    if (!object || !Object.prototype.hasOwnProperty.call(object, key)) {
      throw new Error(`${context} missing required key: ${key}`);
    }
  }
}

function requireAssetPath(relPath, context) {
  if (typeof relPath !== 'string' || !relPath) throw new Error(`${context} has an empty asset path`);
  const resolved = path.join(process.cwd(), relPath);
  if (!fs.existsSync(resolved)) throw new Error(`${context} points to missing asset: ${relPath}`);
}

function validateManifestAssets(value, context = 'data/ui_assets.json') {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => validateManifestAssets(entry, `${context}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (typeof value.src === 'string') requireAssetPath(value.src, `${context}.src`);
  if (typeof value.spriteSheet === 'string') requireAssetPath(value.spriteSheet, `${context}.spriteSheet`);
  for (const [key, entry] of Object.entries(value)) validateManifestAssets(entry, `${context}.${key}`);
}

requireKeys(uiAssets.nodes, ['gate', 'tower', 'greyhook_gate', 'fortress_infirmary', 'lower_cells', 'synod_archive'], 'ui_assets.nodes');
requireKeys(uiAssets.companions, ['mara', 'hadrik', 'nell', 'sarn', 'ilyra', 'cael', 'brig', 'miren'], 'ui_assets.companions');
requireKeys(uiAssets.itemTypes, ['paper', 'key', 'blackmail', 'clue', 'lead', 'company', 'unknown'], 'ui_assets.itemTypes');
requireKeys(uiAssets.factions, ['iron', 'rook', 'synod', 'free', 'hearth', 'veil', 'red'], 'ui_assets.factions');
requireKeys(uiAssets.nav, ['map', 'board', 'company', 'pack', 'camp'], 'ui_assets.nav');
requireKeys(uiAssets.actions, ['travel', 'investigate', 'speak', 'resolve', 'danger', 'camp', 'action', 'warning'], 'ui_assets.actions');
validateManifestAssets(uiAssets);

const syntax = spawnSync(process.execPath, ['--check', '--input-type=module'], {
  input: main,
  encoding: 'utf8'
});

if (syntax.status !== 0) {
  process.stderr.write(syntax.stderr || syntax.stdout || 'Unknown JavaScript syntax failure.');
  throw new Error('src/main.js failed browser-module syntax validation');
}

console.log('Web runtime wiring validated.');
console.log('Android WebView asset-loader wiring validated.');
console.log('UI asset manifest and Android asset sync validated.');
console.log('src/main.js passed module syntax check.');
