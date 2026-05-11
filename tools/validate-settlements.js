const fs = require('fs');

function readJson(path) {
  if (!fs.existsSync(path)) return null;
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function fail(message) {
  throw new Error(`Settlement validation failed: ${message}`);
}

function warn(message) {
  console.warn(`Settlement warning: ${message}`);
}

const data = readJson('data/game_data.json');
const settlements = readJson('data/settlements.json');
const main = fs.readFileSync('src/main.js', 'utf8');

if (!settlements) fail('data/settlements.json missing');

const nodes = data?.nodes || {};

for (const [id, settlement] of Object.entries(settlements.settlements || {})) {
  if (!settlement.name || !settlement.desc) fail(`settlement ${id} missing name/desc`);
  if (!Array.isArray(settlement.districts) || settlement.districts.length === 0) fail(`settlement ${id} has no districts`);
  if (!Array.isArray(settlement.services)) warn(`settlement ${id} has no services`);

  for (const districtId of settlement.districts) {
    if (!nodes[districtId]) fail(`settlement ${id} district ${districtId} not in nodes`);
  }

  for (const service of settlement.services) {
    if (!service.id || !service.label) fail(`settlement ${id} service missing id/label`);
    if (!service.effect || typeof service.effect !== 'object') fail(`settlement ${id} service ${service.id} missing effect`);

    const effect = service.effect;
    const knownEffects = ['coin', 'food', 'medicine', 'fatigue', 'wounds', 'heat', 'fac', 'clue', 'item', 'action'];
    for (const key of Object.keys(effect)) {
      if (!knownEffects.includes(key)) warn(`settlement ${id} service ${service.id} has unknown effect key: ${key}`);
    }

    if (service.cost !== undefined && typeof service.cost !== 'number') warn(`settlement ${id} service ${service.id} cost is not a number`);
  }
}

const requiredKeys = ['settlement', 'district', 'settlementVisited'];
for (const key of requiredKeys) {
  if (!new RegExp(`\\b${key}\\s*:`).test(main.match(/const blank=\(\)=>\(([\s\S]+?)\n\}\);/)?.[1] || '')) {
    fail(`blank() missing settlement key: ${key}`);
  }
}

console.log('Settlement data validated.');
console.log(`${Object.keys(settlements.settlements || {}).length} settlements validated.`);
