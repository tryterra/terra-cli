import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import test from 'node:test';

const script = fileURLToPath(new URL('./npm-packages.mjs', import.meta.url));
for (const platforms of [['win32-x64'], ['win32-x64', 'win32-arm64', 'linux-riscv64']]) {
  test(`publishes every registry package before wrapper: ${platforms.join(', ')}`, t => {
    const root = mkdtempSync(path.join(os.tmpdir(), 'terra-npm-publisher-'));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    mkdirSync(path.join(root, 'package'));
    const registry = Object.fromEntries(platforms.map(platform => [platform, { pkg: `@tryterra/cli-${platform}` }]));
    writeFileSync(path.join(root, 'package/platforms.json'), JSON.stringify(registry));
    execFileSync('tar', ['-czf', path.join(root, 'tryterra-cli-1.2.3.tgz'), '-C', root, 'package']);
    for (const platform of platforms) {
      writeFileSync(path.join(root, `tryterra-cli-${platform}-1.2.3.tgz`), 'fixture');
    }
    const run = () => spawnSync(process.execPath, [script, '1.2.3', root], { encoding: 'utf8' });
    const result = run();
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(result.stdout.trim().split('\n'), [
      ...platforms.map(platform => `@tryterra/cli-${platform}\ttryterra-cli-${platform}-1.2.3.tgz`),
      '@tryterra/cli\ttryterra-cli-1.2.3.tgz',
    ]);
    rmSync(path.join(root, `tryterra-cli-${platforms.at(-1)}-1.2.3.tgz`));
    const missing = run();
    assert.notEqual(missing.status, 0);
    assert.equal(missing.stdout, '', 'no partial publish list when an archive is missing');
    assert.match(missing.stderr, new RegExp(`tryterra-cli-${platforms.at(-1)}-1.2.3`));
  });
}
