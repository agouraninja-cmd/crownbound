// Device preferences: how this hand and this mouse like the game to feel.
// They live in their own localStorage slot OUTSIDE the save (the sage-key
// pattern) — the Scribe carries the chronicle between machines, not one
// machine's mouse. Unknown or missing values fall back to the config default.
import { CONFIG } from './config.js';

const FEEL_STORAGE = 'crownbound_mouse_feel';

function feelById(id) {
  return CONFIG.mouse.feels.find((f) => f.id === id);
}

let feel = feelById(localStorage.getItem(FEEL_STORAGE)) ?? feelById(CONFIG.mouse.defaultFeel);

export function mouseFeelId() {
  return feel.id;
}

// cached so the camera can ask on every mousemove without touching storage
export function mouseSens() {
  return feel.sens;
}

export function setMouseFeel(id) {
  const next = feelById(id);
  if (!next) return;
  feel = next;
  localStorage.setItem(FEEL_STORAGE, id);
}
