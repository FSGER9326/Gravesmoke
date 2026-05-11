const fs = require('fs');

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function fail(message) {
  throw new Error(`Greyhook flow validation failed: ${message}`);
}

function requireArray(value, context) {
  if (!Array.isArray(value)) fail(`${context} must be an array`);
  return value;
}

const data = readJson('data/game_data.json');
const greyhook = readJson('data/greyhook_v08.json');

const nodes = data.nodes || {};
const leads = data.leads || {};
const companions = data.companions || {};
const approaches = greyhook.approaches?.greyhook || {};
const scenes = greyhook.scenes || {};
const choices = greyhook.prisonerChoices || {};
const reactions = greyhook.companionReactions || {};

const requiredNodes = [
  'greyhook_gate',
  'greyhook_outer_yard',
  'fortress_infirmary',
  'lower_cells',
  'sealed_prisoner_cell',
  'grey_road',
  'synod_archive'
];

for (const nodeId of requiredNodes) {
  if (!nodes[nodeId]) fail(`missing required Greyhook node: ${nodeId}`);
}

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

const cleanEntryRoutes = Object.entries(approaches).filter(([, approach]) => {
  return approach.entryNode && approach.entryNode !== 'grey_road' && approach.entryNode !== 'lower_cells';
});

if (Object.keys(approaches).length < 6) fail('Greyhook must keep six route families');
if (cleanEntryRoutes.length < 3) fail('Greyhook needs at least three clean entry route families before failed-forward/captured routes');

for (const [routeId, approach] of Object.entries(approaches)) {
  if (!approach.label || !approach.entryNode || !approach.text) fail(`approach ${routeId} missing label, entryNode, or text`);
  if (!nodes[approach.entryNode]) fail(`approach ${routeId} enters missing node ${approach.entryNode}`);
  if (routeId !== 'escape' && !canReach(approach.entryNode, 'sealed_prisoner_cell')) {
    fail(`approach ${routeId} cannot reach sealed_prisoner_cell from ${approach.entryNode}`);
  }
}

const greyhookLeads = Object.entries(leads).filter(([, lead]) => lead.chapter === 'greyhook_fortress');
const routeSolutionsFromLeads = new Set(greyhookLeads.map(([, lead]) => lead.solution));
for (const [routeId, approach] of Object.entries(approaches)) {
  if (routeId === 'captured') continue;
  for (const solution of approach.requiresAnySolution || []) {
    if (!routeSolutionsFromLeads.has(solution) && solution !== 'greyhook_escape') {
      fail(`approach ${routeId} requires solution not produced by Greyhook leads: ${solution}`);
    }
  }
}

const lowerCellEntryScenes = Object.entries(scenes).filter(([, scene]) => {
  return scene.node === 'lower_cells' && /sealed row|sealed prisoner|sealed/i.test(scene.clue || '');
});
if (lowerCellEntryScenes.length < 3) fail('lower_cells needs multiple ways into the sealed-prisoner climax');

const escapeProviders = Object.entries(scenes).filter(([, scene]) => scene.solution === 'greyhook_escape' || scene.item === 'greyhook_escape_mark');
if (escapeProviders.length < 1) fail('no scene grants the Greyhook escape route or escape mark');

for (const requiredChoice of ['question', 'extract', 'silence', 'trade']) {
  if (!choices[requiredChoice]) fail(`missing prisoner choice: ${requiredChoice}`);
  if (!reactions[requiredChoice]) fail(`missing companion reactions for prisoner choice: ${requiredChoice}`);
}

for (const [choiceId, choice] of Object.entries(choices)) {
  if (!choice.outcome || !choice.nextHook) fail(`choice ${choiceId} missing outcome or nextHook`);
  const reactionSet = reactions[choiceId] || {};
  for (const companionId of Object.keys(companions)) {
    if (!reactionSet[companionId]) fail(`choice ${choiceId} missing reaction for companion ${companionId}`);
  }
}

if (!choices.extract.requiresEscape) fail('extract choice must require escape/capture pressure');
if (!approaches.captured) fail('captured-inside route must exist as failed-forward fallback');
if (!approaches.escape) fail('escape route must exist as high-alert recovery route');

const acceptance = requireArray(greyhook.acceptance, 'greyhook acceptance criteria');
for (const expected of [
  'New game can reach Greyhook naturally.',
  'Failed entry can open captured-inside route.',
  'Alert 4+ creates lockdown pressure.',
  'Alert 5+ creates escape/capture pressure.',
  'The prisoner can be questioned, extracted, silenced, or traded.',
  'A Greyhook outcome and next chapter hook appear on the Case Board.'
]) {
  if (!acceptance.includes(expected)) fail(`missing acceptance criterion: ${expected}`);
}

if (!greyhook.chapters?.greyhook_fortress?.nextHook) fail('Greyhook chapter needs a nextHook');

console.log('Greyhook flow topology validated.');
console.log(`${Object.keys(approaches).length} approaches, ${greyhookLeads.length} Greyhook leads, ${Object.keys(choices).length} prisoner choices.`);
console.log(`${lowerCellEntryScenes.length} lower-cell climax entry scenes, ${escapeProviders.length} escape providers.`);
