const fs = require('fs');

function readJson(path) {
  if (!fs.existsSync(path)) return null;
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function fail(message) {
  throw new Error(`Progression validation failed: ${message}`);
}

const data = readJson('data/game_data.json');
const origins = readJson('data/origins.json');
const progression = readJson('data/progression.json');
const main = fs.readFileSync('src/main.js', 'utf8');

if (!origins) fail('data/origins.json missing');
if (!progression) fail('data/progression.json missing');

const factions = data?.factions || {};
const items = data?.items || {};

for (const [id, origin] of Object.entries(origins.origins || {})) {
  if (!origin.name || !origin.desc || !origin.backgroundTitle) fail(`origin ${id} missing name/desc/backgroundTitle`);
  if (!origin.stats || typeof origin.stats !== 'object') fail(`origin ${id} missing stats`);
  if (!origin.enemyType) fail(`origin ${id} missing enemyType`);
  if (!origin.checkBonus || !origin.drawback || !origin.flavor) fail(`origin ${id} missing checkBonus/drawback/flavor`);

  if (origin.item && !items[origin.item]) fail(`origin ${id} references missing item: ${origin.item}`);

  for (const faction of Object.keys(origin.factionDelta || {})) {
    if (!factions[faction]) fail(`origin ${id} references missing faction: ${faction}`);
  }
}

const originIds = Object.keys(origins.origins || {});
if (originIds.length < 8) fail(`only ${originIds.length} origins (need at least 8)`);

const perks = progression.perks || {};
if (Object.keys(perks).length < 8) fail(`only ${Object.keys(perks).length} perks (need at least 8)`);

for (const [id, perk] of Object.entries(perks)) {
  if (!perk.name || !perk.category || !perk.desc || !perk.effect) fail(`perk ${id} missing name/category/desc/effect`);
}

const xpThresholds = progression.xpThresholds || [];
if (xpThresholds.length < 5) fail(`only ${xpThresholds.length} XP thresholds (need at least 5, levels 1-5)`);

for (let i = 1; i < xpThresholds.length; i++) {
  if (xpThresholds[i] <= xpThresholds[i - 1]) fail(`XP threshold level ${i} not increasing: ${xpThresholds[i]} <= ${xpThresholds[i - 1]}`);
}

const xpAwards = progression.xpAwards || {};
if (Object.keys(xpAwards).length < 6) fail(`only ${Object.keys(xpAwards).length} XP awards (need at least 6)`);

for (const [id, award] of Object.entries(xpAwards)) {
  if (!award.amount || !award.desc) fail(`XP award ${id} missing amount/desc`);
}

const requiredKeys = ['name', 'origin', 'backgroundTitle', 'xp', 'level', 'perkPoints', 'perks', 'wounds', 'fatigue'];
for (const key of requiredKeys) {
  if (!new RegExp(`\\b${key}\\s*:`).test(main.match(/const blank=\(\)=>\(([\s\S]+?)\n\}\);/)?.[1] || '')) {
    fail(`blank() missing progression key: ${key}`);
  }
}

console.log('Progression data validated.');
console.log(`${originIds.length} origins, ${Object.keys(perks).length} perks, ${xpThresholds.length - 1} levels.`);
console.log(`${Object.keys(xpAwards).length} XP award types.`);
