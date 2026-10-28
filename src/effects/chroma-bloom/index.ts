import { createFullscreenPipeline, renderFullscreen } from '../../gpu/fullscreen.ts';
import { COLOUR_PARAMS, createHdrTail, TAIL_PARAMS } from '../../gpu/post/index.ts';
import { hueAt } from '../../gpu/safety/colour-caps.ts';
import { DOSE_PARAMS, dosed, heldDose } from '../../gpu/safety/dose.ts';
import { withChunks } from '../../gpu/shader.ts';
import { createUniformBuffer, defineUniformStruct } from '../../gpu/uniforms.ts';
import { defineEffect } from '../types.ts';
import shader from './bloom.wgsl';
import { meta } from './meta.ts';

const Params = defineUniformStruct('Params', {
  aspect: 'f32',
  width: 'f32',
  time: 'f32',
  gain: 'f32',
  lift: 'f32',
  spread: 'f32',
  turn: 'f32',
  drift: 'f32',
  method: 'u32',
  p3: 'u32',
});

const METHODS = ['oklch', 'css', 'split'] as const;

export const effect = defineEffect({
  meta,
  wideGamut: true,
  params: {
    ...DOSE_PARAMS,
    method: { type: 'select', default: 'oklch', options: METHODS },
    speed: { type: 'number', default: 1, min: 0, max: 3, step: 0.05 },
    ...COLOUR_PARAMS,
    ...TAIL_PARAMS,
    bloom: { ...TAIL_PARAMS.bloom, default: 0 },
  },
  presets: {
    calm: {},
    'against CSS': { method: 'split', dose: 0.6 },
    painted: { dose: 0.55, bleed: 0.6 },
    'oil sheen': { dose: 0.3, iridescence: 0.7 },
    'barely there': { dose: 0.15 },
  },

  async create({ device, format, hdr, gamut, params, profiler }) {
    const tail = createHdrTail(device, { format, hdr, gamut, colour: true, label: 'chroma-bloom' });
    const uniforms = createUniformBuffer(device, Params, 'chroma-bloom params');
    const pipeline = createFullscreenPipeline(device, {
      fragment: withChunks(shader, { 'params.wgsl': Params.wgsl }),
      entryPoint: 'bloom',
      format: tail.scene.format,
    });
    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniforms.buffer } }],
    });
    let aspect = 1;
    let width = 1;
    let clock = 0;

    return {
      resize(w, h) {
        aspect = w / h;
        width = w;
        tail.resize(w, h);
      },
      frame(time, encoder, target) {
        clock += time.delta * params.speed;
        // A held frame is drawn at no more than the default dose (story 2.6).
        const look = time.still ? heldDose(params.dose) : params.dose;
        // The whole picture's hue drifts too, slowly and inside the hue caps (story 2.3).
        const turn = hueAt(clock, 3, {
          speed: dosed(params.dose, 0, 0.004, 0.02),
          wobble: 0,
          wobbleRate: 0,
        });
        uniforms.set({
          aspect,
          width,
          time: clock,
          // Chroma multiplied, then lifted: grey stays nearly grey, colour blooms.
          gain: dosed(look, 1, 2.6, 4.5),
          lift: dosed(look, 0, 0.02, 0.06),
          // Radians of hue between regions, either way.
          spread: dosed(look, 0, 0.7, 1.8),
          turn,
          drift: dosed(params.dose, 0, 0.025, 0.06),
          method: Math.max(0, METHODS.indexOf(params.method as (typeof METHODS)[number])),
          p3: gamut === 'p3' ? 1 : 0,
        });
        uniforms.upload();
        renderFullscreen(encoder, tail.scene.view, pipeline, [bindGroup], {
          timestampWrites: profiler.pass('bloom'),
        });
        tail.encode(encoder, target, time, params, profiler);
      },
      destroy() {
        uniforms.destroy();
        tail.destroy();
      },
    };
  },
});
