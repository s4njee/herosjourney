import { it } from 'vitest';
import { gamutMapOklch, luminance, oklchToLinear, inGamut } from '../src/gpu/colour/oklab.ts';

// Scratch: how far relative luminance moves over a full hue turn at fixed OKLCH L and C,
// absolute (WCAG's 10% is of full white) and relative to the mean.
it('swing', () => {
  for (const L of [0.3, 0.5, 0.7, 0.85]) {
    for (const C of [0.03, 0.06, 0.09, 0.1, 0.15, 0.2, 0.3]) {
      const ys: number[] = [];
      let outside = 0;
      for (let i = 0; i < 360; i++) {
        const lch = [L, C, (i / 360) * 2 * Math.PI] as [number, number, number];
        if (!inGamut(oklchToLinear(lch))) outside++;
        ys.push(luminance(oklchToLinear(gamutMapOklch(lch))));
      }
      const lo = Math.min(...ys), hi = Math.max(...ys), mean = ys.reduce((a, b) => a + b) / ys.length;
      console.log(`L ${L} C ${C}: absolute ${(hi - lo).toFixed(4)} relative ${((hi - lo) / mean).toFixed(3)} mean ${mean.toFixed(3)} hues out of gamut ${outside}`);
    }
  }
});
