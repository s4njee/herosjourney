#include "fullscreen.wgsl"
#include "hash.wgsl"
#include "oklab.wgsl"
#include "colour-caps.wgsl"
#include "palette.wgsl"
#include "params.wgsl"

// Hue cycle: palette cycling over generated images (story 3.5). An index field (rings, a
// rosette, a Truchet tiling of quarter arcs) is drawn once per pixel, and the colour is a
// palette read at the index minus a phase that advances with time, so colour flows through the
// image while nothing in it moves. The palette is baked on the CPU (palette.ts) with its
// lightness range already narrowed to the contrast `dose` allows and every texel made safe, so
// the shader is one texture read.

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var palette: texture_2d<f32>;
@group(0) @binding(2) var samp: sampler;

const TAU: f32 = 6.28318530718;

fn rings(p: vec2f) -> f32 {
  return length(p) * params.density;
}

fn rosette(p: vec2f) -> f32 {
  let r = length(p);
  let a = atan2(p.y, p.x);
  // Petal-shaped rings: the radius wobbles `petals` times a turn, less towards the centre.
  return (r + 0.12 * r * cos(params.petals * a)) * params.density;
}

fn truchet(p: vec2f) -> f32 {
  let g = p * params.density * 0.5;
  let cell = floor(g);
  var f = fract(g);
  if (ihash_2to1(vec2i(cell)) > 0.5) {
    f.x = 1.0 - f.x;
  }
  // Two quarter arcs per tile, about opposite corners; the index is the distance from the
  // nearer arc's centre line, so bands run along the arcs and join across tiles.
  let d = min(abs(length(f) - 0.5), abs(length(f - vec2f(1.0)) - 0.5));
  return d * 2.0;
}

@fragment fn cycle(in: FullscreenVarying) -> @location(0) vec4f {
  // Centred, in heights of the view, y up.
  let p = vec2f((in.uv.x - 0.5) * params.aspect, 0.5 - in.uv.y) * 2.0;
  var index = rings(p);
  if (params.field == 1u) {
    index = rosette(p);
  } else if (params.field == 2u) {
    index = truchet(p);
  }
  return vec4f(palette_at(palette, samp, index - params.phase), 1.0);
}
