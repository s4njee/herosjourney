import type { EffectMeta } from '../types.ts';

export const meta: EffectMeta = {
  id: 'chroma-bloom',
  title: 'Chroma bloom',
  epic: '3',
  tier: 'B',
  tags: ['colour', 'OKLCH', 'wide gamut'],
  summary:
    'Colour enhancement, the first and gentlest visual: a muted landscape whose colour rises and whose hues drift slowly apart, region by region, while every pixel keeps its lightness exactly. Nothing gets brighter or darker, so nothing flashes. Beside it, what CSS saturate() and hue-rotate() do to the same scene.',
  scorecard: {
    compute: false,
    mobile: 'untested',
    flash: 'none',
    pattern: 'none',
    lightPage: 'no',
    features: { required: [] },
    fallback: 'A still; or the page’s own image with CSS saturate(), which changes lightness.',
    useCases: ['A hero image that blooms into colour', 'A gentle background behind text'],
  },
};
