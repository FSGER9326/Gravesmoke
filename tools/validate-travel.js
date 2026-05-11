const fs = require('fs');

function readJson(path) {
  if (!fs.existsSync(path)) return null;
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function fail(message) {
  throw new Error(`Travel validation failed: ${message}`);
}

function warn(message) {
  console.warn(`Travel warning: ${message}`);
}

const data = readJson('data/game_data.json');
const travel = readJson('data/travel.json');
const main = fs.readFileSync('src/main.js', 'utf8');

if (!travel) fail('data/travel.json missing');

const nodes = data?.nodes || {};
const nodeMeta = travel.nodeMeta || {};
const roadEvents = travel.roadEvents || [];

for (const nodeId of Object.keys(nodes)) {
  if (!nodeMeta[nodeId]) warn(`node ${nodeId} has no travel metadata`);
}

for (const [nodeId, meta] of Object.entries(nodeMeta)) {
  if (!nodes[nodeId]) fail(`travel meta references missing node: ${nodeId}`);
  if (meta.danger === undefined || meta.restSafety === undefined) fail(`node ${nodeId} missing danger/restSafety`);
  if (meta.settlementId && !fs.existsSync('data/settlements.json')) warn(`node ${nodeId} references settlement ${meta.settlementId} but settlements.json not found`);
}

if (roadEvents.length < 8) fail(`only ${roadEvents.length} road events (need at least 8)`);

const knownTriggerTags = new Set();
for (const [nodeId, meta] of Object.entries(nodeMeta)) {
  if (meta.terrain) knownTriggerTags.add(meta.terrain);
  if (meta.factionOwner && meta.factionOwner !== 'none') knownTriggerTags.add(meta.factionOwner);
}
knownTriggerTags.add('road');
knownTriggerTags.add('wilderness');

for (const ev of roadEvents) {
  if (!ev.id || !ev.title || !ev.text) fail(`road event missing id/title/text`);
  if (!Array.isArray(ev.choices) || ev.choices.length === 0) fail(`road event ${ev.id} has no choices`);
  if (!Array.isArray(ev.triggerTags) || ev.triggerTags.length === 0) warn(`road event ${ev.id} has no trigger tags`);

  for (const choice of ev.choices) {
    if (!choice.label) fail(`road event ${ev.id} choice missing label`);
    if (!choice.consequence) fail(`road event ${ev.id} choice missing consequence`);
    if (choice.cost) {
      for (const key of Object.keys(choice.cost)) {
        if (!['coin', 'food', 'medicine', 'wits', 'body', 'guile', 'presence', 'resolve'].includes(key)) {
          warn(`road event ${ev.id} choice has unknown cost key: ${key}`);
        }
      }
    }
  }
}

const requiredKeys = ['roadEventsSeen', 'routeHistory'];
for (const key of requiredKeys) {
  if (!new RegExp(`\\b${key}\\s*:`).test(main.match(/const blank=\(\)=>\(([\s\S]+?)\n\}\);/)?.[1] || '')) {
    fail(`blank() missing travel key: ${key}`);
  }
}

console.log('World travel data validated.');
console.log(`${Object.keys(nodeMeta).length}/${Object.keys(nodes).length} nodes have metadata, ${roadEvents.length} road events.`);
