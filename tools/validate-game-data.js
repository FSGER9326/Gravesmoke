const fs = require('fs');

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

const data = readJson('data/game_data.json');
const greyhook = fs.existsSync('data/greyhook_v08.json') ? readJson('data/greyhook_v08.json') : null;

const requiredTop = ['version', 'nodes', 'leads', 'items', 'companions', 'factions'];
for (const key of requiredTop) {
  if (!data[key]) throw new Error(`Missing required top-level key: ${key}`);
}

function requireNode(id, context) {
  if (!data.nodes[id]) throw new Error(`${context} references missing node: ${id}`);
}

function requireItem(id, context) {
  if (id && !data.items[id]) throw new Error(`${context} references missing item: ${id}`);
}

function requireLead(id, context) {
  if (id && !data.leads[id]) throw new Error(`${context} references missing lead: ${id}`);
}

function requireCompanion(id, context) {
  if (id && !data.companions[id]) throw new Error(`${context} references missing companion: ${id}`);
}

for (const [id, node] of Object.entries(data.nodes)) {
  if (!node.name || !node.desc || !Array.isArray(node.exits)) throw new Error(`Invalid node: ${id}`);
  for (const exit of node.exits) requireNode(exit, `Node ${id} exit`);
}

for (const [id, lead] of Object.entries(data.leads)) {
  for (const key of ['name', 'node', 'solution', 'stat', 'dc', 'text', 'softFail']) {
    if (!(key in lead)) throw new Error(`Lead ${id} missing ${key}`);
  }
  requireNode(lead.node, `Lead ${id}`);
  requireItem(lead.item, `Lead ${id}`);
  for (const transformed of lead.transformsTo || []) requireLead(transformed, `Lead ${id} transformed lead`);
}

if (greyhook) {
  if (!greyhook.version) throw new Error('greyhook_v08.json missing version');
  for (const [id, chapter] of Object.entries(greyhook.chapters || {})) {
    if (!chapter.title || !chapter.objective) throw new Error(`Greyhook chapter ${id} missing title/objective`);
    if (chapter.entryNode) requireNode(chapter.entryNode, `Chapter ${id}`);
    if (chapter.climaxNode) requireNode(chapter.climaxNode, `Chapter ${id}`);
  }

  for (const [chapterId, approaches] of Object.entries(greyhook.approaches || {})) {
    for (const [id, approach] of Object.entries(approaches)) {
      if (!approach.label || !approach.entryNode) throw new Error(`Approach ${chapterId}.${id} missing label/entryNode`);
      requireNode(approach.entryNode, `Approach ${chapterId}.${id}`);
      for (const solution of approach.requiresAnySolution || []) {
        const exists = Object.values(data.leads).some((lead) => lead.solution === solution) || solution === 'violent_distraction';
        if (!exists) throw new Error(`Approach ${chapterId}.${id} requires unknown solution: ${solution}`);
      }
      if (approach.failureRoute && !approaches[approach.failureRoute]) {
        throw new Error(`Approach ${chapterId}.${id} has missing failure route: ${approach.failureRoute}`);
      }
    }
  }

  for (const [id, scene] of Object.entries(greyhook.scenes || {})) {
    requireNode(scene.node, `Scene ${id}`);
    requireItem(scene.item, `Scene ${id}`);
    for (const item of scene.requiresAnyItem || []) requireItem(item, `Scene ${id} requirement`);
    for (const solution of scene.requiresAnySolution || []) {
      const exists = Object.values(data.leads).some((lead) => lead.solution === solution) || solution === 'violent_distraction';
      if (!exists) throw new Error(`Scene ${id} requires unknown solution: ${solution}`);
    }
  }

  for (const [id, choice] of Object.entries(greyhook.prisonerChoices || {})) {
    if (!choice.label || !choice.outcome) throw new Error(`Prisoner choice ${id} missing label/outcome`);
    requireItem(choice.item, `Prisoner choice ${id}`);
    for (const faction of Object.keys(choice.factionDeltas || {})) {
      if (!data.factions[faction]) throw new Error(`Prisoner choice ${id} references missing faction: ${faction}`);
    }
  }

  for (const [choice, reactions] of Object.entries(greyhook.companionReactions || {})) {
    if (!greyhook.prisonerChoices[choice]) throw new Error(`Companion reactions reference missing prisoner choice: ${choice}`);
    for (const companionId of Object.keys(reactions)) requireCompanion(companionId, `Companion reactions ${choice}`);
  }
}

console.log(`Gravesmoke data ${data.version} validated.`);
if (greyhook) console.log(`Greyhook vertical slice ${greyhook.version} validated.`);
console.log(`${Object.keys(data.nodes).length} nodes, ${Object.keys(data.leads).length} leads, ${Object.keys(data.items).length} items.`);
