import { it } from 'vitest';
import { limitPaletteStep, namedPalette, PALETTE_NAMES, paletteStep } from '../src/gpu/colour/palette.ts';

// Scratch: each named palette's step, and its floor when every stop has one luminance.
it('floor', () => {
  for (const name of PALETTE_NAMES) {
    const stops = namedPalette(name);
    console.log(name, paletteStep(stops).toFixed(4), paletteStep(limitPaletteStep(stops, 0)).toFixed(4), paletteStep(limitPaletteStep(stops, 0.02)).toFixed(4));
  }
});
