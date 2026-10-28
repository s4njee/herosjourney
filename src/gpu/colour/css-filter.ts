import type { Vec3 } from './oklab.ts';

/*
 * The CSS `saturate()` and `hue-rotate()` filter functions as matrices (Filter Effects Level 1,
 * the feColorMatrix definitions), for comparing effects with what CSS can do (stories 3.4 and
 * 11.4). Twin of `css_saturate` and `css_hue_rotate` in src/effects/chroma-bloom/bloom.wgsl.
 *
 * The matrices are luminance-weighted rotations and scales in RGB: they keep the Rec. 709 luma of
 * the values they are applied to, but not perceived lightness or hue. Which values those are (the
 * sRGB-encoded ones or linear light) is the browser's choice; `space` selects either, and the
 * notes say which Chrome uses, as measured.
 */

export type FilterSpace = 'encoded' | 'linear';

type Mat3 = readonly number[];

export function saturateMatrix(s: number): Mat3 {
  return [
    0.213 + 0.787 * s,
    0.715 - 0.715 * s,
    0.072 - 0.072 * s,
    0.213 - 0.213 * s,
    0.715 + 0.285 * s,
    0.072 - 0.072 * s,
    0.213 - 0.213 * s,
    0.715 - 0.715 * s,
    0.072 + 0.928 * s,
  ];
}

export function hueRotateMatrix(radians: number): Mat3 {
  const c = Math.cos(radians);
  const s = Math.sin(radians);
  return [
    0.213 + c * 0.787 - s * 0.213,
    0.715 - c * 0.715 - s * 0.715,
    0.072 - c * 0.072 + s * 0.928,
    0.213 - c * 0.213 + s * 0.143,
    0.715 + c * 0.285 + s * 0.14,
    0.072 - c * 0.072 - s * 0.283,
    0.213 - c * 0.213 - s * 0.787,
    0.715 - c * 0.715 + s * 0.715,
    0.072 + c * 0.928 + s * 0.072,
  ];
}

const apply = (m: Mat3, c: Readonly<Vec3>): Vec3 => [
  m[0]! * c[0] + m[1]! * c[1] + m[2]! * c[2],
  m[3]! * c[0] + m[4]! * c[1] + m[5]! * c[2],
  m[6]! * c[0] + m[7]! * c[1] + m[8]! * c[2],
];

const encode = (v: number) => (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055);
const decode = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * `filter: saturate(s) hue-rotate(radians)` applied to a linear colour, in `space`, clamped to
 * the cube after each function as the filter chain does. Linear out.
 */
export function cssFilter(
  c: Readonly<Vec3>,
  saturation: number,
  radians: number,
  space: FilterSpace = 'encoded',
): Vec3 {
  const into = (v: Vec3) => (space === 'encoded' ? (v.map(encode) as Vec3) : v);
  const out = (v: Vec3) => (space === 'encoded' ? (v.map(decode) as Vec3) : v);
  const once = (m: Mat3, v: Vec3) => apply(m, v).map(clamp01) as Vec3;
  return out(
    once(hueRotateMatrix(radians), once(saturateMatrix(saturation), into([...c] as Vec3))),
  );
}
