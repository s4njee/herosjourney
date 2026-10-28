import {
  formatPalette,
  limitPaletteStep,
  namedPalette,
  parsePalette,
  safePaletteSpeed,
  type PaletteStop,
} from '../../gpu/colour/palette.ts';
import { createPaletteTexture } from '../../gpu/colour/palette-texture.ts';
import { createFullscreenPipeline, renderFullscreen } from '../../gpu/fullscreen.ts';
import { createHdrTail, TAIL_PARAMS } from '../../gpu/post/index.ts';
import { HUE_SAFE_MAX_SPEED } from '../../gpu/safety/colour-caps.ts';
import { DOSE_PARAMS, dosed, heldDose } from '../../gpu/safety/dose.ts';
import { patternStepAt } from '../../gpu/safety/pattern.ts';
import { withChunks } from '../../gpu/shader.ts';
import { createUniformBuffer, defineUniformStruct } from '../../gpu/uniforms.ts';
import { defineEffect } from '../types.ts';
import shader from './cycle.wgsl';
import { meta } from './meta.ts';

const Params = defineUniformStruct('Params', {
  aspect: 'f32',
  phase: 'f32',
  density: 'f32',
  petals: 'f32',
  field: 'u32',
});

const FIELDS = ['rings', 'rosette', 'truchet'] as const;

const NO_TONEMAP = { output: { tonemap: 'none' } } as const;

/**
 * Fastest the bands may travel across the view, in half-heights a second, at full dose. Cycling
 * a palette through rings makes them appear to expand, which the motion check reads as a
 * whole-field zoom (story 2.4); this holds it under the zoom cap up to the strong dose.
 */
const BAND_SPEED = 0.12;

export const effect = defineEffect({
  meta,
  params: {
    ...DOSE_PARAMS,
    field: { type: 'select', default: 'rings', options: FIELDS },
    palette: { type: 'palette', default: formatPalette(namedPalette('journey')) },
    density: { type: 'number', default: 3, min: 1, max: 12, step: 0.5, label: 'repeats' },
    petals: { type: 'number', default: 6, min: 2, max: 16, step: 1 },
    speed: { type: 'number', default: 1, min: 0, max: 3, step: 0.05 },
    ...TAIL_PARAMS,
    bloom: { ...TAIL_PARAMS.bloom, default: 0 },
  },
  presets: {
    rings: {},
    rosette: { field: 'rosette', palette: formatPalette(namedPalette('aurora')) },
    truchet: { field: 'truchet', density: 6, palette: formatPalette(namedPalette('mycelium')) },
    'one lightness': { palette: formatPalette(namedPalette('spectrum')), dose: 0.5 },
    'full contrast': { field: 'rosette', dose: 0.9, palette: formatPalette(namedPalette('candy')) },
  },

  async create({ device, format, hdr, params, profiler }) {
    const tail = createHdrTail(device, { format, hdr, label: 'hue-cycle' });
    const uniforms = createUniformBuffer(device, Params, 'hue-cycle params');
    const pipeline = createFullscreenPipeline(device, {
      fragment: withChunks(shader, { 'params.wgsl': Params.wgsl }),
      entryPoint: 'cycle',
      format: tail.scene.format,
    });
    const palette = createPaletteTexture(device, params.palette, { label: 'hue-cycle palette' });
    const sampler = device.createSampler({
      magFilter: 'linear',
      minFilter: 'linear',
      addressModeU: 'repeat',
    });
    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uniforms.buffer } },
        { binding: 1, resource: palette.view },
        { binding: 2, resource: sampler },
      ],
    });
    let aspect = 1;
    let phase = 0;
    // The narrowed palette and its safe speed, recomputed only when the palette or dose moves.
    let key = '';
    let speedCap = HUE_SAFE_MAX_SPEED;
    let source: PaletteStop[] = namedPalette('journey');

    return {
      resize(w, h) {
        aspect = w / h;
        tail.resize(w, h);
      },
      frame(time, encoder, target) {
        // A held frame is drawn at no more than the default dose (story 2.6).
        const look = time.still ? heldDose(params.dose) : params.dose;
        const next = `${params.palette}|${look.toFixed(3)}|${params.exposure}`;
        if (next !== key) {
          key = next;
          source = parsePalette(params.palette) ?? source;
          // Shown untonemapped (below), so the step on screen is the palette's times exposure.
          const narrowed = limitPaletteStep(
            source,
            patternStepAt(look) / Math.max(params.exposure, 1e-3),
          );
          palette.bake(narrowed);
          // Never faster than the hue cap, or than the palette's own lightness flashes allow.
          speedCap = Math.min(HUE_SAFE_MAX_SPEED, safePaletteSpeed(narrowed));
        }
        // Nor faster than the bands may appear to travel: one palette turn crosses 1 / density
        // half-heights (the Truchet arcs do not travel outwards, but take the same limit).
        const cap = Math.min(speedCap, BAND_SPEED * params.density);
        phase += time.delta * params.speed * cap * dosed(params.dose, 0, 0.1, 1);
        phase %= 1;
        uniforms.set({
          aspect,
          phase,
          density: params.density,
          petals: params.petals,
          field: Math.max(0, FIELDS.indexOf(params.field as (typeof FIELDS)[number])),
        });
        uniforms.upload();
        renderFullscreen(encoder, tail.scene.view, pipeline, [bindGroup], {
          timestampWrites: profiler.pass('cycle'),
        });
        // A palette is display colour already: no tonemap curve, which would also widen its step.
        tail.encode(encoder, target, time, params, profiler, NO_TONEMAP);
      },
      destroy() {
        uniforms.destroy();
        palette.destroy();
        tail.destroy();
      },
    };
  },
});
