import * as THREE from 'three';

const ZENITH = new THREE.Color(0x86a6c4);
const HORIZON = new THREE.Color(0xf2d6a4);
const BELOW = new THREE.Color(0xe0b585);

export function buildSky() {
  const geo = new THREE.SphereGeometry(380, 24, 14);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();

  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) / 380; // -1..1
    if (y >= 0) {
      // painterly: warm band hugs the horizon, dusty blue above
      c.copy(HORIZON).lerp(ZENITH, Math.pow(y, 0.55));
    } else {
      c.copy(HORIZON).lerp(BELOW, Math.min(1, -y * 3));
    }
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false });
  return new THREE.Mesh(geo, mat);
}

export function addLighting(scene) {
  scene.fog = new THREE.Fog(0xe9d2a6, 75, 230);

  const hemi = new THREE.HemisphereLight(0xf5e2bb, 0x66743f, 0.95);
  scene.add(hemi);

  // fixed warm late-afternoon sun
  const sun = new THREE.DirectionalLight(0xffe0ae, 2.4);
  sun.position.set(38, 30, -22);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -45;
  sun.shadow.camera.right = 45;
  sun.shadow.camera.top = 45;
  sun.shadow.camera.bottom = -45;
  sun.shadow.camera.near = 5;
  sun.shadow.camera.far = 130;
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.03;
  scene.add(sun);
  scene.add(sun.target);

  return { sun, hemi };
}
