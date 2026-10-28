#include "fullscreen.wgsl"
#include "fold.wgsl"
#include "oklab.wgsl"
#include "simplex.wgsl"
#include "params.wgsl"

// Hello: soft colour in a mirrored rosette. The plane is folded into one wedge of a dihedral
// rosette (fold.wgsl), and the wedge holds slowly drifting noise, coloured in OKLCH so that
// lightness comes from the noise and only the hue drifts with time. Mirrors meet without a seam
// because the folded point is continuous across every mirror. No textures and no state: the
// picture is a pure function of time, so a held frame and a poster are the same rosette.

@group(0) @binding(0) var<uniform> params: Params;

@fragment fn rosette(in: FullscreenVarying) -> @location(0) vec4f {
  // Centred, in heights of the view, y up.
  let q = vec2f((in.uv.x - 0.5) * params.aspect, 0.5 - in.uv.y) * 2.0;
  let c = cos(params.spin);
  let s = sin(params.spin);
  let p = mat2x2f(c, s, -s, c) * q;
  let f = fold_point(18u, p, params.order);

  // Noise in the wedge, drifting outwards; two octaves, soft.
  let r = length(f.p);
  let drift = vec2f(-params.time * 0.05, params.time * 0.02);
  let n1 = snoise_2d(f.p * 1.6 + drift);
  let n2 = snoise_2d(f.p * 3.7 - drift * 1.7 + 11.0);
  let field = clamp(0.5 + 0.35 * n1 + 0.15 * n2, 0.0, 1.0);

  // Lightness from the field, hue from the field and the clock, chroma from the dose.
  let L = mix(0.18, 0.72, field) * (1.0 - smoothstep(0.9, 1.9, r) * 0.7);
  let h = params.hue + 1.2 * n1 + params.time * params.hue_speed;
  let lch = gamut_map_oklch(vec3f(L, params.chroma, h), 1.0);
  return vec4f(oklch_to_linear(lch), 1.0);
}
