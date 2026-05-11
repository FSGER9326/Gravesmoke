const fs = require('fs');

const raw = fs.readFileSync('data/game_data.json', 'utf8');
const data = JSON.parse(raw);

const requiredTop = ['version', 'nodes', 'leads', 'items', 'companions', 'factions'];
for (const key of requiredTop) {
  if (!data[key]) throw new Error(`Missing required top-level key: ${key}`);
}

for (const [id, node] of Object.entries(data.nodes)) {
  if (!node.name || !node.desc || !Array.isArray(node.exits)) throw new Error(`Invalid node: ${id}`);
  for (const exit of node.exits) {
    if (!data.nodes[exit]) throw new Error(`Node ${id} exits to missing node: ${exit}`);
  }
}

for (const [id, lead] of Object.entries(data.leads)) {
  for (const key of ['name', 'node', 'solution', 'stat', 'dc', 'text', 'softFail']) {
    if (!(key in lead)) throw new Error(`Lead ${id} missing ${key}`);
  }
  if (!data.nodes[lead.node]) throw new Error(`Lead ${id} points to missing node: ${lead.node}`);
  if (lead.item && !data.items[lead.item]) throw new Error(`Lead ${id} rewards missing item: ${lead.item}`);
}

console.log(`Gravesmoke data ${data.version} validated.`);
console.log(`${Object.keys(data.nodes).length} nodes, ${Object.keys(data.leads).length} leads, ${Object.keys(data.items).length} items.`);
