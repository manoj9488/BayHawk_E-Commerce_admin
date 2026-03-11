import fs from 'node:fs';
import path from 'node:path';

const appPath = path.resolve(process.cwd(), 'src/App.tsx');
const source = fs.readFileSync(appPath, 'utf8');

const routePathRegex = /<Route\s+path="([^"]+)"/g;
const pathCounts = new Map();

for (const match of source.matchAll(routePathRegex)) {
  const routePath = match[1];
  pathCounts.set(routePath, (pathCounts.get(routePath) || 0) + 1);
}

const duplicates = [...pathCounts.entries()].filter(([, count]) => count > 1);

if (duplicates.length > 0) {
  console.error('Duplicate route paths found in src/App.tsx:');
  for (const [routePath, count] of duplicates) {
    console.error(`- ${routePath} (${count} occurrences)`);
  }
  process.exit(1);
}

console.log(`Route duplicate check passed (${pathCounts.size} unique paths).`);
