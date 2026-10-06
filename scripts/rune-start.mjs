import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..');

const realLocalAppData =
  process.env.LOCALAPPDATA ||
  (process.platform === 'win32'
    ? path.join(os.homedir(), 'AppData', 'Local')
    : (process.env.XDG_DATA_HOME || path.join(os.homedir(), '.local', 'share')));

const profileRoot = path.resolve(
  process.env.RUNEOS_PROFILE_ROOT || path.join(realLocalAppData, 'RuneOS')
);

const workspaces = path.join(profileRoot, 'workspaces');
const home = path.join(profileRoot, 'profile', 'Home');
const local = path.join(profileRoot, 'profile', 'Local');
const roaming = path.join(profileRoot, 'profile', 'Roaming');
const xdg = path.join(profileRoot, 'profile', 'Xdg');

for (const dir of [profileRoot, workspaces, home, local, roaming, xdg]) {
  mkdirSync(dir, { recursive: true });
}

const runePort = String(process.env.RUNEOS_PORT || '8790');

const env = {
  ...process.env,

  // RUNE must never read or write the installed StarNet station.
  STARNET_WORKSPACES: workspaces,
  SKYNET_WORKSPACES: workspaces,

  // StarNet recovery scans known OS data roots. Give RUNE its own OS-data
  // namespace as well so legacy StarNet saves are invisible to this dev build.
  HOME: home,
  USERPROFILE: home,
  LOCALAPPDATA: local,
  APPDATA: roaming,
  XDG_DATA_HOME: xdg,

  RUNEOS_PROFILE_ROOT: profileRoot,

  // A separate browser origin keeps RUNE's localStorage away from StarNet/dev
  // sessions that use the upstream default port 8787.
  STARNET_PORT: runePort,
  SKYNET_PORT: runePort,
};

console.log('[RUNE OS] isolated profile:', profileRoot);
console.log('[RUNE OS] workspaces:', workspaces);
console.log('[RUNE OS] installed StarNet data is not used by this launch.');
console.log('[RUNE OS] open: http://127.0.0.1:' + runePort);

const child = spawn(process.execPath, [path.join(repoRoot, 'sidecar', 'index.js')], {
  cwd: repoRoot,
  env,
  stdio: 'inherit',
  windowsHide: false,
});

const relay = (signal) => {
  if (!child.killed) {
    try { child.kill(signal); } catch (_) {}
  }
};

process.on('SIGINT', () => relay('SIGINT'));
process.on('SIGTERM', () => relay('SIGTERM'));

child.on('exit', (code, signal) => {
  if (signal) process.exit(1);
  process.exit(code == null ? 1 : code);
});
