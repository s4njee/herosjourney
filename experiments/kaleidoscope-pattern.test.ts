import { it, vi } from 'vitest';
import { measurePatterns } from '../tests/pattern.ts';

vi.setConfig({ testTimeout: 1_200_000 });

// Scratch: the kaleidoscope's rosette against the pattern rule by mirror count, sampled densely
// (4 frames a second for 8 seconds), with how often a frame fails.
it('by order', async () => {
  for (const order of [3, 4, 5, 6, 8]) {
    let fails = 0;
    let worst = 0;
    const runs = 4;
    for (let i = 0; i < runs; i++) {
      const r = await measurePatterns('kaleidoscope', { params: { order }, settle: 0.5 + i * 2, seconds: 2, rate: 4 });
      if (r.verdict === 'high') fails++;
      worst = Math.max(worst, r.area);
    }
    console.log(`order ${order}: ${fails}/${runs} two-second runs fail, worst field share ${worst.toFixed(3)}`);
  }
});
