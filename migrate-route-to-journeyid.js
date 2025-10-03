// Migration script to convert route names to journeyId in destinations.json
const fs = require('fs');
const path = require('path');

// Read the journeys data
const journeysPath = path.join(__dirname, 'src/data/journeys.js');
const journeysContent = fs.readFileSync(journeysPath, 'utf-8');

// Extract journey name to ID mapping
const journeyMapping = {};

// Parse journeys to create mapping
const journeyMatches = journeysContent.matchAll(/{\s*id:\s*"([^"]+)",\s*slug:\s*"[^"]+",\s*name:\s*"([^"]+)"/g);
for (const match of journeyMatches) {
  const [, id, name] = match;
  journeyMapping[name] = id;
}

console.log('Journey Mapping:');
console.log(journeyMapping);
console.log('');

// Read destinations.json
const destinationsPath = path.join(__dirname, 'src/data/destinations.json');
const destinations = JSON.parse(fs.readFileSync(destinationsPath, 'utf-8'));

// Update each destination
let updatedCount = 0;
let unmappedRoutes = new Set();

const updatedDestinations = destinations.map(dest => {
  const routeName = dest.route;
  const journeyId = journeyMapping[routeName];

  if (journeyId) {
    updatedCount++;
    return {
      ...dest,
      journeyId: journeyId,
      journeyName: routeName,
      journeyNameCN: dest.routeCN || routeName,
      // Remove old route fields
      route: undefined,
      routeCN: undefined
    };
  } else {
    // No matching journey - keep as standalone destination
    unmappedRoutes.add(routeName);
    return {
      ...dest,
      journeyId: null,
      journeyName: routeName,
      journeyNameCN: dest.routeCN || routeName,
      // Remove old route fields
      route: undefined,
      routeCN: undefined
    };
  }
});

// Remove undefined fields
const cleanedDestinations = updatedDestinations.map(dest => {
  const cleaned = {};
  for (const [key, value] of Object.entries(dest)) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }
  return cleaned;
});

console.log(`Updated ${updatedCount} destinations with journeyId`);
console.log(`${destinations.length - updatedCount} destinations without matching journey`);
console.log('');
console.log('Unmapped routes (destinations without journeys):');
console.log([...unmappedRoutes].sort());
console.log('');

// Backup original file
const backupPath = destinationsPath + '.backup';
fs.copyFileSync(destinationsPath, backupPath);
console.log(`Backup created at: ${backupPath}`);

// Write updated destinations
fs.writeFileSync(destinationsPath, JSON.stringify(cleanedDestinations, null, 2));
console.log(`Updated destinations.json written successfully`);
