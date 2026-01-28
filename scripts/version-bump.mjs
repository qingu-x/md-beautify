import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const APPS_MAP = {
  web: '@mdb/web',
  electron: 'md-beautify-electron',
  server: '@mdb/server',
  obsidian: 'md-beautify-obsidian',
  core: "@mdb/core"
};

const args = process.argv.slice(2);
const type = args[0]; // major, minor, patch
const targets = args.slice(1); // web, electron, server, etc.

if (!type || !['major', 'minor', 'patch'].includes(type)) {
  console.error('Usage: node version-bump.mjs <major|minor|patch> [target1 target2 ...]');
  process.exit(1);
}

const appsToBump = targets.length > 0 ? targets : Object.keys(APPS_MAP);

console.log(`🚀 Bumping ${type} version for: ${appsToBump.join(', ')}...`);

for (const target of appsToBump) {
  const pkgName = APPS_MAP[target];
  if (!pkgName) {
    console.warn(`⚠️  Unknown target: ${target}, skipping.`);
    continue;
  }

  try {
    console.log(`\n📦 Bumping ${pkgName}...`);
    // 使用 pnpm --filter <pkg> exec pnpm version <type> --no-git-tag-version
    // 这样可以确保触发包内的 version 钩子（如果有的话），且不重复创建 git tag
    const command = `pnpm --filter ${pkgName} exec pnpm version ${type} --no-git-tag-version`;
    execSync(command, { stdio: 'inherit', cwd: rootDir });
    console.log(`✅ ${pkgName} bumped successfully.`);
  } catch (error) {
    console.error(`❌ Failed to bump version for ${pkgName}:`, error.message);
  }
}

console.log('\n✨ All done!');
