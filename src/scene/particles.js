import * as THREE from 'three';
import { softDotTexture } from './sprites.js';

// A small pool of soft round puffs drawn as ONE Points object. Every puff has
// its own place, size, colour and opacity over its life — the same pool makes
// woodsmoke (normal blending) or sparks (additive). Sizes are in world units.

const VERT = `
attribute float size;
attribute float alpha;
attribute vec3 tint;
uniform float uPx; // half the drawing-buffer height: world size → pixels
varying float vAlpha;
varying vec3 vTint;
void main() {
	vAlpha = alpha;
	vTint = tint;
	vec4 mv = modelViewMatrix * vec4( position, 1.0 );
	gl_Position = projectionMatrix * mv;
	gl_PointSize = size * uPx * projectionMatrix[ 1 ][ 1 ] / max( 0.1, - mv.z );
}
`;

const FRAG = `
uniform sampler2D uMap;
varying float vAlpha;
varying vec3 vTint;
void main() {
	float a = texture2D( uMap, gl_PointCoord ).a * vAlpha;
	if ( a < 0.004 ) discard;
	gl_FragColor = vec4( vTint, a );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}
`;

const _size = new THREE.Vector2();

// max       how many puffs can be alive at once
// additive  true for things that glow (sparks), false for things that veil (smoke)
// Returns { points, spawn(p), update(dt) }.
export function createPuffs({ max, additive = false }) {
  const position = new Float32Array(max * 3);
  const size = new Float32Array(max);
  const alpha = new Float32Array(max);
  const tint = new Float32Array(max * 3);
  const state = [];
  for (let i = 0; i < max; i++) {
    state.push({ alive: false });
    position[i * 3 + 1] = -999;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(position, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(size, 1));
  geo.setAttribute('alpha', new THREE.BufferAttribute(alpha, 1));
  geo.setAttribute('tint', new THREE.BufferAttribute(tint, 3));

  const material = new THREE.ShaderMaterial({
    uniforms: { uMap: { value: softDotTexture() }, uPx: { value: 400 } },
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
  });

  const points = new THREE.Points(geo, material);
  points.frustumCulled = false; // the puffs wander; the pool is tiny either way
  points.onBeforeRender = (renderer) => {
    material.uniforms.uPx.value = renderer.getDrawingBufferSize(_size).y * 0.5;
  };

  let next = 0;

  // p: { x, y, z, vx, vy, vz, life, size0, size1, alpha, from: Color, to: Color, rise?, drag? }
  // rise accelerates the puff upward; drag (per second) slows its drift.
  function spawn(p) {
    // take the next slot round-robin — if the pool is full the oldest goes
    const s = state[next];
    next = (next + 1) % max;
    Object.assign(s, { rise: 0, drag: 0 }, p, { alive: true, age: 0 });
  }

  function update(dt) {
    for (let i = 0; i < max; i++) {
      const s = state[i];
      if (!s.alive) continue;
      s.age += dt;
      const k = s.age / s.life;
      if (k >= 1) {
        s.alive = false;
        alpha[i] = 0;
        position[i * 3 + 1] = -999;
        continue;
      }
      s.vy += s.rise * dt;
      const slow = Math.max(0, 1 - s.drag * dt);
      s.vx *= slow;
      s.vz *= slow;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.z += s.vz * dt;
      position[i * 3] = s.x;
      position[i * 3 + 1] = s.y;
      position[i * 3 + 2] = s.z;
      size[i] = s.size0 + (s.size1 - s.size0) * k;
      // quick fade in, long fade out
      alpha[i] = s.alpha * Math.min(1, k / 0.12) * (1 - Math.max(0, (k - 0.45) / 0.55));
      tint[i * 3] = s.from.r + (s.to.r - s.from.r) * k;
      tint[i * 3 + 1] = s.from.g + (s.to.g - s.from.g) * k;
      tint[i * 3 + 2] = s.from.b + (s.to.b - s.from.b) * k;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.size.needsUpdate = true;
    geo.attributes.alpha.needsUpdate = true;
    geo.attributes.tint.needsUpdate = true;
  }

  return { points, spawn, update };
}
