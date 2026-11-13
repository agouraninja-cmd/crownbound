// Wind: one shared clock, and a small vertex-shader patch that lets grass,
// flowers and tree crowns lean with it. world.update advances windTime.
//
// A swaying geometry carries a per-vertex `sway` weight (0 rooted … 1 free),
// so a blade bends from its base and a tree from its foot.

export const windTime = { value: 0 };

const WIND_PARS = `
attribute float sway;
uniform float uWindTime;
uniform float uWindAmp;
`;

// three's own project_vertex with one addition: after the instance transform
// (scenery sits at the origin, so that is already world space) each vertex is
// pushed downwind by a few overlapping gust waves, scaled by its sway weight.
const WIND_PROJECT = `
vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
{
	float gust = sin( uWindTime * 1.6 + mvPosition.x * 0.31 + mvPosition.z * 0.23 ) * 0.55
		+ sin( uWindTime * 2.9 + mvPosition.x * 0.83 - mvPosition.z * 0.57 ) * 0.25
		+ sin( uWindTime * 0.6 + mvPosition.x * 0.05 + mvPosition.z * 0.07 ) * 0.45;
	float push = gust * sway * uWindAmp;
	mvPosition.x += push;
	mvPosition.z += push * 0.55;
}
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;
`;

// amp        how far (world units) a fully free vertex travels in a gust
// upNormals  for thin blades: light every vertex as if it faced straight up,
//            on both faces — grass should shade like the ground it grows
//            from, whichever side the camera sees. The geometry then needs
//            no normals at all.
export function withWind(material, amp, { upNormals = false } = {}) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uWindTime = windTime;
    shader.uniforms.uWindAmp = { value: amp };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>' + WIND_PARS)
      .replace('#include <project_vertex>', WIND_PROJECT);
    if (upNormals) {
      shader.vertexShader = shader.vertexShader.replace('#include <beginnormal_vertex>', 'vec3 objectNormal = vec3( 0.0, 1.0, 0.0 );');
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <normal_fragment_maps>',
        '#include <normal_fragment_maps>\n\tnormal = normalize( vNormal );'
      );
    }
  };
  // the patch changes the program, so it must not share one with unpatched twins
  material.customProgramCacheKey = () => `wind:${upNormals}`;
  return material;
}
