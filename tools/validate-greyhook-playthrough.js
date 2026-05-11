const fs = require('fs');

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function fail(message) {
  throw new Error(`Greyhook playthrough validation failed: ${message}`);
}

function warn(message) {
  console.warn(`Playthrough warning: ${message}`);
}

const data = readJson('data/game_data.json');
const greyhook = readJson('data/greyhook_v08.json');
const main = fs.readFileSync('src/main.js', 'utf8');

const nodes = data.nodes || {};
const leads = data.leads || {};
const approaches = greyhook.approaches?.greyhook || {};
const choices = greyhook.prisonerChoices || {};
const scenes = greyhook.scenes || {};

function canReach(start, target, blocked = new Set()) {
  const queue = [start];
  const seen = new Set();
  while (queue.length) {
    const nodeId = queue.shift();
    if (nodeId === target) return true;
    if (seen.has(nodeId) || blocked.has(nodeId)) continue;
    seen.add(nodeId);
    for (const exit of nodes[nodeId]?.exits || []) {
      if (!seen.has(exit) && !blocked.has(exit)) queue.push(exit);
    }
  }
  return false;
}

const reachable = (from) => {
  const set = new Set();
  const queue = [from];
  const seen = new Set();
  while (queue.length) {
    const nodeId = queue.shift();
    if (seen.has(nodeId)) continue;
    seen.add(nodeId);
    set.add(nodeId);
    for (const exit of nodes[nodeId]?.exits || []) {
      if (!seen.has(exit)) queue.push(exit);
    }
  }
  return set;
};

// 1. Natural start path
const gateReachable = reachable('gate');
const ledgerLeadNodes = Object.values(leads)
  .filter(l => l.chapter === 'sealed_ledger')
  .map(l => l.node);

for (const node of ledgerLeadNodes) {
  if (!gateReachable.has(node)) fail(`Sealed Ledger lead node ${node} not reachable from gate`);
}

if (!gateReachable.has('tower')) fail('Old Watchtower not reachable from gate');

const towerReachable = reachable('tower');
const greyhookLeadNodes = Object.values(leads)
  .filter(l => l.chapter === 'greyhook_fortress')
  .map(l => l.node);

for (const node of greyhookLeadNodes) {
  const fromGateOrTower = gateReachable.has(node) || towerReachable.has(node);
  if (!fromGateOrTower) warn(`Greyhook lead node ${node} may not be reachable from gate/tower`);
}

// 2. Route solutions coverage
const greyhookLeads = Object.entries(leads).filter(([, l]) => l.chapter === 'greyhook_fortress');
const routeSolutions = new Set(greyhookLeads.map(([, l]) => l.solution));
const requiredSolutionPrefixes = ['supply', 'blackmail', 'infirmary', 'forgery', 'escape'];
let solutionCount = 0;
for (const prefix of requiredSolutionPrefixes) {
  const found = [...routeSolutions].some(s => s.includes(prefix));
  if (found) solutionCount++;
  if (!found) warn(`No Greyhook lead produces ${prefix} route solution`);
}
if (solutionCount < 4) fail(`Only ${solutionCount}/5 route solution families found (need at least 4)`);

// 3. Approach reachability to sealed prisoner
for (const [routeId, approach] of Object.entries(approaches)) {
  if (routeId === 'escape') continue;
  if (!nodes[approach.entryNode]) fail(`approach ${routeId} entryNode ${approach.entryNode} missing`);
  if (!canReach(approach.entryNode, 'sealed_prisoner_cell')) {
    fail(`approach ${routeId} cannot reach sealed_prisoner_cell from ${approach.entryNode}`);
  }
}

// 4. Prisoner aftermath paths
for (const [choiceId, choice] of Object.entries(choices)) {
  // All choices must produce an outcome and nextHook
  if (!choice.outcome) fail(`prisoner choice ${choiceId} has no outcome`);
  if (!choice.nextHook) fail(`prisoner choice ${choiceId} has no nextHook`);

  // question must NOT require escape
  if (choiceId === 'question' && choice.requiresEscape) fail('question choice should not require escape pressure');

  // silence must create crime or morale consequence
  if (choiceId === 'silence') {
    if (!choice.crime && (choice.morale || 0) >= 0) fail('silence must create crime or negative morale');
  }

  // trade must create crime or faction deltas
  if (choiceId === 'trade') {
    if (!choice.crime) warn('trade choice has no crime entry');
    if (!choice.factionDeltas || Object.keys(choice.factionDeltas).length === 0) warn('trade choice has no faction deltas');
  }

  // extract must require escape
  if (choiceId === 'extract' && !choice.requiresEscape) fail('extract choice must require escape/capture pressure');
}

// 5. Synod Archive hook
if (!nodes.synod_archive) fail('synod_archive node missing');
if (!greyhook.chapters?.greyhook_fortress?.nextHook) fail('Greyhook chapter has no nextHook');

const synodScenes = Object.entries(scenes).filter(([, sc]) => sc.node === 'synod_archive');
if (synodScenes.length === 0) fail('no Synod Archive scenes defined');

const synodItemScenes = synodScenes.filter(([, sc]) => sc.item === 'dead_name_index_scrap');
if (synodItemScenes.length === 0) warn('no Synod Archive scene grants dead_name_index_scrap');

// 6. Save/debug-critical keys in blank()
const requiredSaveKeys = [
  'saveVersion',
  'screen', 'node', 'log', 'party', 'pool', 'stats', 'res', 'fac',
  'crimes', 'leads', 'solutions', 'items', 'clues', 'flags',
  'greyhook', 'greyhookInside', 'greyhookRoute', 'greyhookAlert',
  'prisonerContact', 'prisonerChoice', 'prisonerOutcome',
  'morale', 'reactions', 'aftermath',
  'enemyType', 'enemyPressure', 'routeHistory', 'consequenceLog'
];

const blankMatch = main.match(/const blank=\(\)=>\(([\s\S]+?)\n\}\);/);
if (!blankMatch) fail('cannot find blank() definition in main.js');

const blankBody = blankMatch[1];
for (const key of requiredSaveKeys) {
  if (!new RegExp(`\\b${key}\\s*:`).test(blankBody)) {
    fail(`blank() missing required key: ${key}`);
  }
}

console.log('Greyhook playthrough paths validated.');
console.log(`${Object.keys(approaches).length} approaches reachable, ${Object.keys(choices).length} prisoner choices with aftermath paths.`);
console.log(`${synodScenes.length} Synod Archive scenes, ${requiredSaveKeys.length}/${requiredSaveKeys.length} save keys verified.`);
