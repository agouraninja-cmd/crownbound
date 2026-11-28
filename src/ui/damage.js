import * as THREE from 'three';

// Damage numbers: each blow on the dummy throws up how hard it struck — a
// number in ink-ringed gold that pops, rises and fades over the spot it was
// struck. DOM, like the prompt tag: a world point projected through the camera
// every frame, so it stays over the dummy as the camera turns.
//
// Looks only. The number is the blow's damage (the weapon in hand), not XP.

const LIFE = 0.95; // seconds a number hangs in the air
const RISE = 0.9; // world units it climbs over that time

let layer = null;
const live = []; // { el, x, y, z, age }
const v = new THREE.Vector3();
// a player who asked for less motion gets the number held still, fading only
const calm = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

export function initDamage() {
  layer = document.createElement('div');
  layer.id = 'damage-numbers';
  document.getElementById('hud').appendChild(layer);
}

// A blow landed at world (x, y, z) for `amount` damage.
export function showDamage(x, y, z, amount) {
  if (!layer) return;
  const el = document.createElement('div');
  el.className = 'dmg';
  el.dataset.tier = String(Math.min(amount, 3)); // heavier weapons, bigger numbers
  el.textContent = String(amount);
  el.style.visibility = 'hidden'; // until the next frame places it
  layer.appendChild(el);
  // a little scatter so a flurry doesn't stack every number on one spot
  live.push({ el, x: x + (Math.random() - 0.5) * 0.5, y, z: z + (Math.random() - 0.5) * 0.5, age: 0 });
}

// Every frame, after the camera settles (main.js tick).
export function updateDamage(dt, camera) {
  if (!live.length) return;
  camera.updateMatrixWorld();
  for (let i = live.length - 1; i >= 0; i--) {
    const n = live[i];
    n.age += dt;
    const k = n.age / LIFE;
    if (k >= 1) {
      n.el.remove();
      live.splice(i, 1);
      continue;
    }
    // eased climb: quick off the strike, slowing as it fades
    v.set(n.x, n.y + (calm ? 0 : RISE * (1 - (1 - k) * (1 - k))), n.z).project(camera);
    if (v.z > 1) {
      n.el.style.visibility = 'hidden';
      continue;
    }
    const px = (v.x * 0.5 + 0.5) * window.innerWidth;
    const py = (-v.y * 0.5 + 0.5) * window.innerHeight;
    // pops in a touch large, settles, then fades out over the last 40%
    const scale = !calm && k < 0.12 ? 1.5 - (k / 0.12) * 0.5 : 1;
    const fade = k < 0.6 ? 1 : 1 - (k - 0.6) / 0.4;
    n.el.style.visibility = '';
    n.el.style.opacity = fade.toFixed(3);
    n.el.style.transform = `translate(-50%, -50%) translate(${Math.round(px)}px, ${Math.round(py)}px) scale(${scale.toFixed(3)})`;
  }
}

// how many numbers are in the air (the smoke suite reads this)
export function damageShown() {
  return live.map((n) => Number(n.el.textContent));
}
