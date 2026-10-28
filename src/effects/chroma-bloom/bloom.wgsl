#include "fullscreen.wgsl"
#include "oklab.wgsl"
#include "colour-caps.wgsl"
#include "gamut.wgsl"
#include "simplex.wgsl"
#include "params.wgsl"

// Chroma bloom: colour enhancement at constant lightness (story 3.4). A muted generated scene
// (sky, sun, three rolling hills, soft cloud) is drawn in OKLCH; its chroma is raised and its hues
// pushed apart by region, by a slowly evolving low-frequency field, while lightness is left
// exactly as it was. Nothing gets brighter or darker, so nothing can flash. Every colour goes
// through `safe_colour_in`: into sRGB (or P3) by chroma, then red-capped.
//
// `method` 1 shows what CSS does instead: `saturate()` and `hue-rotate()` matrices applied to the
// sRGB-encoded scene, as Chrome applies them (measured), with one hue turn for the whole element.
// `method` 2 splits the view, CSS on the left.

@group(0) @binding(0) var<uniform> params: Params;

// Smooth 1D value noise for the hill lines.
fn hill_noise(x: f32) -> f32 {
  return 0.6 * snoise_2d(vec2f(x, 0.37)) + 0.4 * snoise_2d(vec2f(x * 2.3, 4.1));
}

// Blends two OKLCH colours through OKLab, so an edge between hues does not sweep the hues
// between them (a linear mix of hue angles rings a warm sun with green).
fn blend(a: vec3f, b: vec3f, t: f32) -> vec3f {
  return oklab_to_oklch(mix(oklch_to_oklab(a), oklch_to_oklab(b), t));
}

// The scene, in OKLCH: muted and soft, the "before".
fn scene(p: vec2f) -> vec3f {
  // Sky: lighter at the horizon, blue-grey.
  var lch = vec3f(mix(0.62, 0.36, smoothstep(0.0, 1.0, p.y)), 0.025, 4.3);
  // Clouds: soft bands that drift very slowly.
  let cloud = smoothstep(0.1, 0.7, snoise_2d(vec2f(p.x * 1.4 + params.time * 0.01, p.y * 4.0)));
  lch.x += 0.07 * cloud * smoothstep(0.2, 0.5, p.y);
  // The sun, low and warm, in the middle, where the split view divides it.
  let sun = 1.0 - smoothstep(0.07, 0.11, length(p - vec2f(0.5 * params.aspect, 0.5)));
  lch = blend(lch, vec3f(0.86, 0.05, 1.35), sun);
  // Three hills, back to front: darker, warmer, nearer, with a little texture.
  let tones = array(vec3f(0.5, 0.03, 2.6), vec3f(0.38, 0.035, 2.1), vec3f(0.24, 0.03, 1.0));
  for (var i = 0; i < 3; i++) {
    let fi = f32(i);
    let line = 0.42 - 0.12 * fi + 0.07 * hill_noise(p.x * (0.9 + 0.5 * fi) + fi * 7.0);
    let inside = 1.0 - smoothstep(line - 0.004, line + 0.004, p.y);
    let texture = 0.035 * snoise_2d(p * vec2f(5.0, 11.0) + fi * 3.0);
    lch = blend(lch, tones[i] + vec3f(texture, 0.0, 0.0), inside);
  }
  return lch;
}

// CSS filter matrices (Filter Effects 1), on sRGB-encoded values. Twin: src/gpu/colour/css-filter.ts.
fn css_saturate(c: vec3f, s: f32) -> vec3f {
  let m = mat3x3f(
    vec3f(0.213 + 0.787 * s, 0.213 - 0.213 * s, 0.213 - 0.213 * s),
    vec3f(0.715 - 0.715 * s, 0.715 + 0.285 * s, 0.715 - 0.715 * s),
    vec3f(0.072 - 0.072 * s, 0.072 - 0.072 * s, 0.072 + 0.928 * s),
  );
  return clamp(m * c, vec3f(0.0), vec3f(1.0));
}

fn css_hue_rotate(c: vec3f, r: f32) -> vec3f {
  let k = cos(r);
  let s = sin(r);
  let m = mat3x3f(
    vec3f(0.213 + k * 0.787 - s * 0.213, 0.213 - k * 0.213 + s * 0.143, 0.213 - k * 0.213 - s * 0.787),
    vec3f(0.715 - k * 0.715 - s * 0.715, 0.715 + k * 0.285 + s * 0.14, 0.715 - k * 0.715 + s * 0.715),
    vec3f(0.072 - k * 0.072 + s * 0.928, 0.072 - k * 0.072 - s * 0.283, 0.072 + k * 0.928 + s * 0.072),
  );
  return clamp(m * c, vec3f(0.0), vec3f(1.0));
}

fn encode(c: vec3f) -> vec3f {
  return select(1.055 * pow(c, vec3f(1.0 / 2.4)) - 0.055, c * 12.92, c <= vec3f(0.0031308));
}

fn decode(c: vec3f) -> vec3f {
  return select(pow((c + 0.055) / 1.055, vec3f(2.4)), c / 12.92, c <= vec3f(0.04045));
}

@fragment fn bloom(in: FullscreenVarying) -> @location(0) vec4f {
  let p = vec2f(in.uv.x * params.aspect, 1.0 - in.uv.y);
  let base = scene(p);
  let p3 = params.p3 == 1u;

  var css = params.method == 1u;
  if (params.method == 2u) {
    css = in.uv.x < 0.5;
    // The divide, one pixel of mid grey.
    if (abs(in.uv.x - 0.5) * params.width < 0.75) {
      return vec4f(vec3f(0.18), 1.0);
    }
  }

  if (css) {
    let rgb = clamp(oklch_to_linear(gamut_map_oklch(base, 1.0)), vec3f(0.0), vec3f(1.0));
    let filtered = css_hue_rotate(css_saturate(encode(rgb), params.gain), params.turn);
    return vec4f(decode(filtered), 1.0);
  }

  // The region field: two octaves of slow noise, one hue offset per region.
  let q = p * 1.3;
  let field = 0.7 * snoise_3d(vec3f(q, params.time * params.drift))
    + 0.3 * snoise_3d(vec3f(q * 2.1 + 5.0, params.time * params.drift * 1.3));
  let lch = vec3f(
    base.x,
    base.y * params.gain + params.lift,
    base.z + params.turn + params.spread * field,
  );
  return vec4f(oklch_to_linear(safe_colour_in(lch, p3, 1.0)), 1.0);
}
