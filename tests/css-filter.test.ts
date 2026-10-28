import { describe, expect, it } from 'vitest';
import { cssFilter } from '../src/gpu/colour/css-filter.ts';
import { gamutMapOklch, linearToOklab, oklchToLinear, type Vec3 } from '../src/gpu/colour/oklab.ts';

// Story 3.4's comparison. The matrices reproduce what Chrome 152 returned for `hue-rotate()` on a
// 2D canvas (measured 2026-10-28: sRGB-encoded values, all three exactly), and CSS's saturate and
// hue-rotate move OKLab lightness where chroma-bloom, by construction, does not.

const decode = (byte: number) => {
  const c = byte / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const encode = (v: number) =>
  Math.round(255 * (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055));

describe('CSS filter matrices', () => {
  it.each([
    [[200, 60, 40], 90, [40, 114, 0]],
    [[40, 160, 200], 150, [253, 103, 132]],
    [[180, 180, 60], 240, [255, 138, 235]],
  ] as const)('hue-rotate of %j by %i° matches Chrome', (rgb, degrees, chrome) => {
    const linear = rgb.map(decode) as Vec3;
    const out = cssFilter(linear, 1, (degrees * Math.PI) / 180, 'encoded').map(encode);
    expect(out).toEqual([...chrome]);
    // In linear light the answer is different, so the space was measured, not assumed.
    const inLinear = cssFilter(linear, 1, (degrees * Math.PI) / 180, 'linear').map(encode);
    expect(inLinear).not.toEqual([...chrome]);
  });

  // The largest OKLab lightness change the filter makes over hues and lightnesses at one chroma.
  const worstShift = (C: number, saturation: number, radians: number) => {
    let worst = 0;
    for (let i = 0; i < 36; i++) {
      for (const L of [0.3, 0.5, 0.7]) {
        const lch = gamutMapOklch([L, C, (i / 36) * 2 * Math.PI]);
        const out = cssFilter(oklchToLinear(lch), saturation, radians);
        worst = Math.max(worst, Math.abs(linearToOklab(out)[0] - lch[0]));
      }
    }
    return worst;
  };

  it('moves lightness, more as chroma rises; chroma-bloom does not by construction', () => {
    // Measured: 0.024 at chroma 0.03, 0.116 at 0.08, 0.235 at 0.15, for saturate(2.6).
    expect(worstShift(0.03, 2.6, 0)).toBeGreaterThan(0.02);
    expect(worstShift(0.08, 2.6, 0)).toBeGreaterThan(0.1);
    expect(worstShift(0.15, 2.6, 0)).toBeGreaterThan(0.2);
    // hue-rotate alone, a quarter turn: 0.032 at chroma 0.08, 0.088 at 0.15.
    expect(worstShift(0.08, 1, Math.PI / 2)).toBeGreaterThan(0.03);
    expect(worstShift(0.15, 1, Math.PI / 2)).toBeGreaterThan(0.08);
  });
});
