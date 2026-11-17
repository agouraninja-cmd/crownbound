// `npm run guide`: runs scripts/build-guide.py with whichever Python this
// machine has. Windows often has only the `py` launcher (`python` there can be
// the Microsoft Store alias, which runs nothing); Linux and macOS have python3.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./build-guide.py', import.meta.url));
const CANDIDATES = [
  ['py', ['-3']],
  ['python3', []],
  ['python', []],
];

for (const [cmd, pre] of CANDIDATES) {
  // a real Python answers this; a missing one or the Store alias does not
  const probe = spawnSync(cmd, [...pre, '-c', 'import sys; print(sys.version_info[0])'], { encoding: 'utf8' });
  if (probe.status !== 0 || probe.stdout.trim() !== '3') continue;
  const run = spawnSync(cmd, [...pre, script], { stdio: 'inherit' });
  process.exit(run.status ?? 1);
}

console.error('No Python 3 found (tried py -3, python3, python). Install Python, then: pip install python-docx');
process.exit(1);
