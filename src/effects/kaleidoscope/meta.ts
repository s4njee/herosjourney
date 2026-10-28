import type { EffectMeta } from '../types.ts';

export const meta: EffectMeta = {
  id: 'kaleidoscope',
  title: 'Kaleidoscope',
  epic: '4',
  tier: 'A',
  tags: ['symmetry', 'kaleidoscope', 'colour'],
  summary:
    'Drifting coloured glass seen through mirrors: two mirrors at an angle (a rosette), or the four mirror shapes that tile the plane (a square, and the 45-45-90, 60-60-60 and 30-60-90 triangles). Every pixel is folded into the mirrors’ fundamental domain and reads the glass there, so the mirrors meet without a seam.',
  scorecard: {
    compute: false,
    mobile: 'untested',
    flash: 'low',
    lightPage: 'no',
    features: { required: [] },
    fallback:
      'A still of the kaleidoscope; a conic-gradient wedge repeated by rotation for 6 to 12 wedges.',
    useCases: ['A hero or section background on a music, festival or art site', 'A loader, small'],
  },
};
