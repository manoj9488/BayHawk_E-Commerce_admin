import fs from 'node:fs';
import path from 'node:path';

const appPath = path.resolve(process.cwd(), 'src/App.tsx');
const source = fs.readFileSync(appPath, 'utf8');

const requiredGuards = [
  { path: 'hub/procurement/purchases', guard: 'MultiRoleRoute' },
  { path: 'store/procurement/purchases', guard: 'MultiRoleRoute' },
  { path: 'hub/orders/*', guard: 'MultiRoleRoute' },
  { path: 'store/orders/*', guard: 'MultiRoleRoute' },
  { path: 'hub/team/*', guard: 'ProtectedRouteComponent' },
  { path: 'store/team/*', guard: 'ProtectedRouteComponent' },
  { path: 'hub/settings/*', guard: 'ProtectedRouteComponent' },
  { path: 'store/settings/*', guard: 'ProtectedRouteComponent' },
  { path: 'store/marketing/referral', guard: 'MultiRoleRoute' },
];

const failures = [];

for (const { path: routePath, guard } of requiredGuards) {
  const pattern = new RegExp(
    `<Route\\s+path="${routePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s+element=\\{<${guard}(\\s|>)`,
  );

  if (!pattern.test(source)) {
    failures.push(`${routePath} is not wrapped with ${guard}`);
  }
}

if (failures.length > 0) {
  console.error('Route guard check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Route guard check passed (${requiredGuards.length} guarded paths verified).`);
