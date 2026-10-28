import type { EffectMeta } from '../types.ts';

export const meta: EffectMeta = {
  id: 'hue-cycle',
  title: 'Hue cycle',
  epic: '3',
  tier: 'A',
  tags: ['colour', 'palette', 'OKLCH'],
  summary:
    'Palette cycling, the cheapest moving psychedelic image there is: rings, a rosette or a Truchet tiling, coloured by a palette that slides through them, so colour flows while nothing moves. The palette is OKLCH stops you can edit, and its contrast and speed are held under the pattern and flash limits whatever it is.',
  scorecard: {
    compute: false,
    mobile: 'untested',
    flash: 'none',
    pattern: 'none',
    patternPresets: ['full contrast'],
    motionPresets: ['full contrast'],
    lightPage: 'no',
    features: { required: [] },
    fallback: 'A still; or a repeating-radial-gradient with an animated custom property.',
    useCases: ['A loader or a small badge', 'A section background on a music or festival site'],
  },
};
