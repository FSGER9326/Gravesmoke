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
  if (!id || !data.nodes[id]) throw new Error(`${context} references missing node: ${id}`);
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

function requireFaction(id, context) {
  if (id && !data.factions[id]) throw new Error(`${context} references missing faction: ${id}`);
}

function knownSolutions(extra = []) {
  return new Set([...Object.values(data.leads).map((lead) => lead.solution), ...extra]);
}

function requireSolution(id, context, solutions) {
  if (id && !solutions.has(id)) throw new Error(`${context} references unknown solution: ${id}`);
}

for (const [id, node] of Object.entries(data.nodes)) {
  if (!node.name || !node.desc || !Array.isArray(node.exits)) throw new Error(`Invalid node: ${id}`);
  for (const exit of node.exits) requireNode(exit, `Node ${id} exit`);
}

for (const [id, item] of Object.entries(data.items)) {
  if (!item.name || !item.type || !item.text) throw new Error(`Invalid item: ${id}`);
  if (!Array.isArray(item.tags)) throw new Error(`Item ${id} missing tags array`);
}

for (const [id, companion] of Object.entries(data.companions)) {
  for (const key of ['name', 'role', 'ability', 'effect', 'text']) {
    if (!companion[key]) throw new Error(`Companion ${id} missing ${key}`);
  }
  if (!Array.isArray(companion.tags)) throw new Error(`Companion ${id} missing tags array`);
}

for (const [id, lead] of Object.entries(data.leads)) {
  for (const key of ['name', 'node', 'solution', 'stat', 'dc', 'text', 'softFail', 'chapter']) {
    if (!(key in lead)) throw new Error(`Lead ${id} missing ${key}`);
  }
  requireNode(lead.node, `Lead ${id}`);
  requireItem(lead.item, `Lead ${id}`);
  for (const transformed of lead.transformsTo || []) requireLead(transformed, `Lead ${id} transformed lead`);
}

if (greyhook) {
  const requiredGreyhookTop = ['version', 'chapters', 'approaches', 'scenes', 'prisonerChoices', 'companionReactions', 'enemyInterference'];
  for (const key of requiredGreyhookTop) {
    if (!greyhook[key]) throw new Error(`greyhook_v08.json missing ${key}`);
  }

  const chapterIds = new Set(Object.keys(greyhook.chapters || {}));
  for (const [id, lead] of Object.entries(data.leads)) {
    if (!chapterIds.has(lead.chapter)) throw new Error(`Lead ${id} references missing chapter: ${lead.chapter}`);
  }

  const solutions = knownSolutions(['violent_distraction', 'captured_inside_route']);

  for (const [id, chapter] of Object.entries(greyhook.chapters || {})) {
    if (!chapter.title || !chapter.objective) throw new Error(`Greyhook chapter ${id} missing title/objective`);
    if (chapter.entryNode) requireNode(chapter.entryNode, `Chapter ${id}`);
    if (chapter.climaxNode) requireNode(chapter.climaxNode, `Chapter ${id}`);
  }

  for (const [chapterId, approaches] of Object.entries(greyhook.approaches || {})) {
    if (!chapterIds.has(`${chapterId}_fortress`) && chapterId !== 'greyhook') {
      throw new Error(`Approach group ${chapterId} has no matching chapter`);
    }
    for (const [id, approach] of Object.entries(approaches)) {
      if (!approach.label || !approach.entryNode || !approach.text) {
        throw new Error(`Approach ${chapterId}.${id} missing label/entryNode/text`);
      }
      requireNode(approach.entryNode, `Approach ${chapterId}.${id}`);
      for (const solution of approach.requiresAnySolution || []) requireSolution(solution, `Approach ${chapterId}.${id}`, solutions);
      for (const item of approach.requiresAnyItem || []) requireItem(item, `Approach ${chapterId}.${id} requirement`);
      if (approach.failureRoute && !approaches[approach.failureRoute]) {
        throw new Error(`Approach ${chapterId}.${id} has missing failure route: ${approach.failureRoute}`);
      }
    }
  }

  for (const [id, scene] of Object.entries(greyhook.scenes || {})) {
    if (!scene.label || !scene.clue) throw new Error(`Scene ${id} missing label/clue`);
    requireNode(scene.node, `Scene ${id}`);
    requireItem(scene.item, `Scene ${id}`);
    if (scene.solution) requireSolution(scene.solution, `Scene ${id}`, solutions);
    for (const item of scene.requiresAnyItem || []) requireItem(item, `Scene ${id} requirement`);
    for (const solution of scene.requiresAnySolution || []) requireSolution(solution, `Scene ${id}`, solutions);
  }

  for (const [id, choice] of Object.entries(greyhook.prisonerChoices || {})) {
    if (!choice.label || !choice.outcome || !choice.nextHook) throw new Error(`Prisoner choice ${id} missing label/outcome/nextHook`);
    requireItem(choice.item, `Prisoner choice ${id}`);
    for (const faction of Object.keys(choice.factionDeltas || {})) requireFaction(faction, `Prisoner choice ${id}`);
  }

  for (const [choice, reactions] of Object.entries(greyhook.companionReactions || {})) {
    if (!greyhook.prisonerChoices[choice]) throw new Error(`Companion reactions reference missing prisoner choice: ${choice}`);
    for (const companionId of Object.keys(reactions)) requireCompanion(companionId, `Companion reactions ${choice}`);
  }

  for (const choice of Object.keys(greyhook.prisonerChoices || {})) {
    if (!greyhook.companionReactions[choice]) throw new Error(`Missing companion reaction set for prisoner choice: ${choice}`);
  }

  const recursiveEnemyTriggers = new Set(['lockdown']);
  for (const [id, enemy] of Object.entries(greyhook.enemyInterference || {})) {
    if (!enemy.name || !enemy.effect || !Array.isArray(enemy.triggers) || enemy.triggers.length === 0) {
      throw new Error(`Enemy interference ${id} missing name/effect/triggers`);
    }
    for (const trigger of enemy.triggers) {
      if (recursiveEnemyTriggers.has(trigger)) {
        throw new Error(`Enemy interference ${id} uses recursive trigger: ${trigger}`);
      }
    }
  }

  const greyhookApproaches = greyhook.approaches.greyhook || {};
  if (Object.keys(greyhookApproaches).length < 6) throw new Error('Greyhook needs six route families');
  for (const required of ['supply', 'blackmail', 'infirmary', 'forgery', 'captured', 'escape']) {
    if (!greyhookApproaches[required]) throw new Error(`Greyhook missing route family: ${required}`);
  }
}

console.log(`Gravesmoke data ${data.version} validated.`);
if (greyhook) console.log(`Greyhook vertical slice ${greyhook.version} validated.`);
console.log(`${Object.keys(data.nodes).length} nodes, ${Object.keys(data.leads).length} leads, ${Object.keys(data.items).length} items.`);
