const fs = require('fs');
const { spawnSync } = require('child_process');

function requireText(path) {
  if (!fs.existsSync(path)) throw new Error(`Missing required file: ${path}`);
  return fs.readFileSync(path, 'utf8');
}

const index = requireText('index.html');
const main = requireText('src/main.js');
const styles = requireText('src/styles.css');

function requireIncludes(text, needle, context) {
  if (!text.includes(needle)) throw new Error(`${context} missing required text: ${needle}`);
}

requireIncludes(index, 'id="app"', 'index.html');
requireIncludes(index, 'id="nav"', 'index.html');
requireIncludes(index, 'type="module"', 'index.html');
requireIncludes(index, 'src="src/main.js"', 'index.html');
requireIncludes(index, 'href="src/styles.css"', 'index.html');

requireIncludes(main, "fetch('./data/game_data.json')", 'src/main.js');
requireIncludes(main, "fetch('./data/greyhook_v08.json')", 'src/main.js');
requireIncludes(main, 'greyhookAlertBand', 'src/main.js');
requireIncludes(main, 'greyhookAlertText', 'src/main.js');
requireIncludes(main, 'raiseGreyhookAlert', 'src/main.js');
requireIncludes(main, 'isGreyhookLockdown', 'src/main.js');
requireIncludes(main, 'canUseExit', 'src/main.js');
requireIncludes(main, 'function board()', 'src/main.js');
requireIncludes(main, 'function prisonerChoice', 'src/main.js');
requireIncludes(main, 'function escapeOrCapture', 'src/main.js');

requireIncludes(styles, '.panel', 'src/styles.css');
requireIncludes(styles, '.btn', 'src/styles.css');
requireIncludes(styles, '.card', 'src/styles.css');

const syntax = spawnSync(process.execPath, ['--check', '--input-type=module'], {
  input: main,
  encoding: 'utf8'
});

if (syntax.status !== 0) {
  process.stderr.write(syntax.stderr || syntax.stdout || 'Unknown JavaScript syntax failure.');
  throw new Error('src/main.js failed browser-module syntax validation');
}

console.log('Web runtime wiring validated.');
console.log('src/main.js passed module syntax check.');
