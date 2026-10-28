import { it } from 'vitest';
import { cssFilter } from '../src/gpu/colour/css-filter.ts';
import { gamutMapOklch, linearToOklab, oklchToLinear, type Vec3 } from '../src/gpu/colour/oklab.ts';

// Scratch: how far CSS saturate() and hue-rotate() move OKLab lightness, by chroma.
it('lightness', () => {
  for (const C of [0.03, 0.08, 0.15]) {
    for (const [s, turn] of [[2.6, 0], [1, Math.PI / 2], [2.6, Math.PI / 2], [1, Math.PI]] as const) {
      let worst = 0;
      let mean = 0;
      let n = 0;
      for (let i = 0; i < 36; i++) {
        for (const L of [0.3, 0.5, 0.7]) {
          const lch: Vec3 = [L, C, (i / 36) * 2 * Math.PI];
          const mapped = gamutMapOklch(lch);
          const d = Math.abs(linearToOklab(cssFilter(oklchToLinear(mapped), s, turn))[0] - mapped[0]);
          worst = Math.max(worst, d);
          mean += d;
          n++;
        }
      }
      console.log(`C ${C} saturate ${s} hue-rotate ${(turn * 180 / Math.PI).toFixed(0)}°: worst ΔL ${worst.toFixed(3)} mean ${(mean / n).toFixed(3)}`);
    }
  }
});
