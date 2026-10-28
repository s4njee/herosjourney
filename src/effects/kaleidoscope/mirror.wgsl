#include "fullscreen.wgsl"
#include "fold.wgsl"
#include "params.wgsl"

// The mirrors: every pixel is folded into the group's fundamental domain (fold.wgsl) and reads
// the object cell there. Only reflection groups are used, and a reflection keeps a derivative's
// length, so the GPU's own mip selection is right on both sides of every mirror (story 4.1's
// measurement). The texture is still sampled with the unfolded gradients, which costs nothing and
// keeps the shader correct if a group with turns or glides is ever passed in.

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var cell: texture_2d<f32>;
@group(0) @binding(2) var cell_sampler: sampler;

@fragment fn mirror(in: FullscreenVarying) -> @location(0) vec4f {
  let q = vec2f((in.uv.x - 0.5) * params.aspect, 0.5 - in.uv.y);
  let c = cos(params.spin);
  let s = sin(params.spin);
  let p = (mat2x2f(c, s, -s, c) * q) * params.cells;
  let dx = dpdx(p);
  let dy = dpdy(p);

  let f = fold_point(u32(params.group_id), p, params.order);
  let uv = (f.p - params.centre) * params.span + params.pan;
  let color = textureSampleGrad(cell, cell_sampler, uv, f.j * dx * params.span, f.j * dy * params.span);
  return vec4f(color.rgb, 1.0);
}
