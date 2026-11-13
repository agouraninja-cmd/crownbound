// Dev server config. The save-mirror plugin gives the game a dev-only
// /__save endpoint: POST writes the save to saves/crownbound-save.json,
// GET reads it back. One file on disk, always current — the browser's
// localStorage remains the live save; the file is its shadow (and the way
// back when a browser starts empty). See src/state/mirror.js for the client.
import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SAVE_FILE = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'saves',
  'crownbound-save.json'
);

// The same shape check the Scribe uses: don't let garbage clobber a good file.
function looksLikeSave(text) {
  try {
    const s = JSON.parse(text);
    return !!(s && typeof s === 'object' && typeof s.saveVersion === 'number' && s.stats && s.quests);
  } catch {
    return false;
  }
}

function saveMirror() {
  return {
    name: 'crownbound-save-mirror',
    configureServer(server) {
      server.middlewares.use('/__save', (req, res) => {
        if (req.method === 'GET') {
          if (fs.existsSync(SAVE_FILE)) {
            res.setHeader('Content-Type', 'application/json');
            res.end(fs.readFileSync(SAVE_FILE));
          } else {
            res.statusCode = 404;
            res.end('no mirror yet');
          }
        } else if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => (body += chunk));
          req.on('end', () => {
            if (!looksLikeSave(body)) {
              res.statusCode = 400;
              res.end('not a save');
              return;
            }
            fs.mkdirSync(path.dirname(SAVE_FILE), { recursive: true });
            fs.writeFileSync(SAVE_FILE, body);
            res.end('ok');
          });
        } else {
          res.statusCode = 405;
          res.end();
        }
      });
    },
  };
}

export default defineConfig({
  // relative asset paths: the build works at a domain root (vite preview) and
  // under a sub-path alike (GitHub Pages serves it from /crownbound/)
  base: './',
  plugins: [saveMirror()],
});
