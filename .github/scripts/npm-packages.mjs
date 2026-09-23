import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
import path from 'node:path';

const [version, directory] = process.argv.slice(2);
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version ?? '') || !directory) {
  throw new Error('Usage: npm-packages.mjs <version> <tarball-directory>');
}
const wrapper = `tryterra-cli-${version}.tgz`;
const registry = JSON.parse(execFileSync('tar', [
  '-xOf', path.join(directory, wrapper), 'package/platforms.json',
], { encoding: 'utf8' }));
const names = Object.values(registry).map(platform => platform.pkg);
if (!names.length || new Set(names).size !== names.length ||
    names.some(name => typeof name !== 'string' || !/^@tryterra\/cli-[a-z0-9-]+$/.test(name))) {
  throw new Error('Wrapper platform registry must contain distinct Terra package names');
}
// The wrapper pins native package versions, so publishing it first breaks installs.
names.push('@tryterra/cli');
const packages = names.map(name => {
  const archive = `${name.slice(1).replace('/', '-')}-${version}.tgz`;
  if (!statSync(path.join(directory, archive)).isFile()) {
    throw new Error(`Missing package archive: ${archive}`);
  }
  return `${name}\t${archive}`;
});
process.stdout.write(packages.join('\n') + '\n');
