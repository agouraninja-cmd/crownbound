import * as THREE from 'three';

// A soft round blob drawn at load — the one "texture" in the game, and still
// procedural. stops: [[0..1, cssColor], …] from the centre outward.
export function radialTexture(stops, size = 128) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const half = size / 2;
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  for (const [t, color] of stops) grad.addColorStop(t, color);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

let softDot = null;
// white core fading to nothing — sparks, motes, smoke puffs, glows
export function softDotTexture() {
  if (!softDot) {
    softDot = radialTexture([
      [0, 'rgba(255,255,255,1)'],
      [0.35, 'rgba(255,255,255,0.55)'],
      [0.7, 'rgba(255,255,255,0.12)'],
      [1, 'rgba(255,255,255,0)'],
    ]);
  }
  return softDot;
}

// An additive glow billboard: sells a light source without any post-processing.
export function glowSprite(color, size, opacity = 1) {
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: softDotTexture(),
      color,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      fog: false,
    })
  );
  sprite.scale.set(size, size, 1);
  return sprite;
}
