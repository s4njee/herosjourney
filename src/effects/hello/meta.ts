import type { EffectMeta } from '../types.ts';

export const meta: EffectMeta = {
  id: 'hello',
  title: 'Hello',
  epic: '1',
  tier: 'A',
  tags: ['scaffold', 'symmetry', 'colour'],
  summary:
    'The smallest effect: soft colour turning slowly in a six-fold mirrored rosette, folded by the symmetry library and coloured in OKLCH, in one fragment pass through the HDR tail. Every later effect starts from this shape.',
  scorecard: {
    compute: false,
    mobile: 'untested',
    flash: 'none',
    pattern: 'none',
    patternPresets: ['full contrast'],
    motionPresets: ['full contrast'],
    lightPage: 'no',
    features: { required: [] },
    fallback: 'A still of the rosette.',
    useCases: ['The template for new effects; a calm dark hero at a pinch'],
  },
};
