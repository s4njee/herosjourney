#include "fullscreen.wgsl"
#include "simplex.wgsl"
#include "scene-params.wgsl"

// The object cell: what the mirrors look at. Soft coloured glass drifting over a dark ground,
// each piece a disc with a brighter rim, plus thin curved shards so there is fine detail for the
// mip levels to filter. Drawn into a square texture every frame; colours come from the CPU,
// already gamut-mapped in OKLCH (oklab.ts), so the shader only places them.

@group(0) @binding(0) var<uniform> scene: SceneParams;

@fragment fn glass(in: FullscreenVarying) -> @location(0) vec4f {
  let p = in.uv;
  // A dark ground with a little low-frequency colour in it.
  let g = snoise_2d(p * 2.3 + vec2f(scene.time * 0.03, 0.0));
  var color = scene.ground.rgb * (0.7 + 0.3 * g);
  let px = 1.0 / scene.size;
  for (var i = 0u; i < u32(scene.count); i++) {
    let shape = scene.shapes[i];
    let d = length(p - shape.xy);
    if (shape.w > 0.5) {
      // A shard: a thin arc of a circle, two texels wide.
      let ring = abs(d - shape.z);
      let a = 1.0 - smoothstep(px, 2.0 * px, ring);
      let arc = smoothstep(0.2, 0.6, snoise_2d(p * 9.0 + f32(i) * 3.1) + 0.5);
      color = mix(color, scene.colors[i].rgb * 1.3, a * arc);
    } else {
      // A bead: a soft disc, a little brighter at its rim, laid over what is below it.
      let inside = 1.0 - smoothstep(shape.z - 2.0 * px, shape.z, d);
      let rim = smoothstep(shape.z * 0.6, shape.z, d);
      color = mix(color, scene.colors[i].rgb * (0.85 + 0.35 * rim), inside * 0.85);
    }
  }
  return vec4f(color, 1.0);
}
