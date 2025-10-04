const fs = require('fs');
const path = require('path');

// Read the routes data
const routesPath = path.join(__dirname, '../src/data/routes.js');
const routesContent = fs.readFileSync(routesPath, 'utf8');

// Read the journeys data
const journeysPath = path.join(__dirname, '../src/data/journeys.json');
const journeys = JSON.parse(fs.readFileSync(journeysPath, 'utf8'));

// Extract routes object from routes.js
// This is a bit hacky but works for our case
const routesMatch = routesContent.match(/export const routes = ({[\s\S]+?^})/m);
if (!routesMatch) {
  console.error('Could not extract routes object');
  process.exit(1);
}

// Use eval to parse the routes object (not ideal but works for migration)
// We need to convert the JS object to JSON
const routesStr = routesMatch[1]
  .replace(/(\w+):/g, '"$1":')  // Quote keys
  .replace(/'/g, '"')           // Replace single quotes with double quotes

let routes;
try {
  routes = eval('(' + routesStr + ')');
} catch (e) {
  console.error('Failed to parse routes:', e);
  process.exit(1);
}

// Migrate segments from routes to journeys
let migratedCount = 0;
journeys.forEach(journey => {
  const route = routes[journey.id];
  if (route && route.segments) {
    journey.segments = route.segments;
    migratedCount++;
    console.log(`✓ Migrated ${route.segments.length} segments for ${journey.name}`);
  } else {
    console.log(`✗ No route data found for ${journey.name} (${journey.id})`);
  }
});

// Write updated journeys back to file
fs.writeFileSync(journeysPath, JSON.stringify(journeys, null, 2));

console.log(`\nMigration complete! Migrated ${migratedCount} out of ${journeys.length} journeys.`);
console.log(`Updated file: ${journeysPath}`);
