import { createFullscreenPipeline, renderFullscreen } from '../../gpu/fullscreen.ts';
import { createHdrTail, TAIL_PARAMS } from '../../gpu/post/index.ts';
import { DOSE_PARAMS, dosed } from '../../gpu/safety/dose.ts';
import { withChunks } from '../../gpu/shader.ts';
import { createUniformBuffer, defineUniformStruct } from '../../gpu/uniforms.ts';
import { defineEffect } from '../types.ts';
import { meta } from './meta.ts';
import shader from './rosette.wgsl';

const Params = defineUniformStruct('Params', {
  aspect: 'f32',
  time: 'f32',
  spin: 'f32',
  order: 'f32',
  chroma: 'f32',
  hue: 'f32',
  hue_speed: 'f32',
});

export const effect = defineEffect({
  meta,
  params: {
    ...DOSE_PARAMS,
    order: { type: 'number', default: 6, min: 2, max: 16, step: 1, label: 'mirrors' },
    hue: { type: 'number', default: 5.2, min: 0, max: 6.28, step: 0.01 },
    speed: { type: 'number', default: 1, min: 0, max: 3, step: 0.05 },
    ...TAIL_PARAMS,
    bloom: { ...TAIL_PARAMS.bloom, default: 0 },
  },
  presets: {
    calm: {},
    'nearly still': { dose: 0.1 },
    eight: { order: 8, hue: 2.4 },
  },

  async create({ device, format, hdr, params, profiler }) {
    const tail = createHdrTail(device, { format, hdr, label: 'hello' });
    const uniforms = createUniformBuffer(device, Params, 'hello params');
    const pipeline = createFullscreenPipeline(device, {
      fragment: withChunks(shader, { 'params.wgsl': Params.wgsl }),
      entryPoint: 'rosette',
      format: tail.scene.format,
    });
    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniforms.buffer } }],
    });
    let aspect = 1;
    let clock = 0;
    let spin = 0;

    return {
      resize(w, h) {
        aspect = w / h;
        tail.resize(w, h);
      },
      frame(time, encoder, target) {
        const dt = time.delta * params.speed;
        clock += dt;
        // Radians a second: a full turn takes about three and a half minutes at the default.
        spin += dt * dosed(params.dose, 0, 0.03, 0.12);
        uniforms.set({
          aspect,
          time: clock,
          spin,
          order: params.order,
          chroma: dosed(params.dose, 0.01, 0.07, 0.16),
          hue: params.hue,
          hue_speed: dosed(params.dose, 0, 0.04, 0.15),
        });
        uniforms.upload();
        renderFullscreen(encoder, tail.scene.view, pipeline, [bindGroup], {
          timestampWrites: profiler.pass('rosette'),
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
