import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { routes } from '../src/data/routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the journeys data
const journeysPath = path.join(__dirname, '../src/data/journeys.json');
const journeys = JSON.parse(fs.readFileSync(journeysPath, 'utf8'));

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
