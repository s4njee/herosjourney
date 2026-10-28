import { it } from 'vitest';
import { readWindow } from '../src/gpu/safety/pattern.ts';

// Scratch: the regularity a window reads for the guidance's patterns, and for things that are not.
const sq = (p: number) => (((p % 1) + 1) % 1 < 0.5 ? 1 : 0);
const sine = (p: number) => 0.5 + 0.5 * Math.cos(2 * Math.PI * p);
const hash = (i: number, j: number) => { const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return s - Math.floor(s); };
const cases: Record<string, (x: number, y: number) => number> = {
  'sine grating p8': (x) => sine(x / 8),
  'square grating p8': (x) => sq(x / 8),
  'square grating p5.3 oblique': (x, y) => sq((0.8 * x + 0.6 * y) / 5.3),
  'checkerboard p10': (x, y) => sq(x / 10) ^ sq(y / 10),
  'dots lattice p8 (small dots)': (x, y) => (Math.hypot(((x % 8) + 8) % 8 - 4, ((y % 8) + 8) % 8 - 4) < 1.5 ? 1 : 0),
  'dots lattice p10 (big dots)': (x, y) => (Math.hypot(((x % 10) + 10) % 10 - 5, ((y % 10) + 10) % 10 - 5) < 3 ? 1 : 0),
  'hex dots p9': (x, y) => { const a = (x / 9); const b = (y / (9 * 0.866)); const row = Math.floor(b); const off = row % 2 ? 0.5 : 0; return Math.hypot(((a + off) % 1) - 0.5, (b % 1) - 0.5) < 0.25 ? 1 : 0; },
  'dartboard section': (x, y) => sq(Math.hypot(x + 60, y + 60) / 7) ^ sq((Math.atan2(y + 60, x + 60) / (2 * Math.PI)) * 64),
  'two random blobs': (x, y) => (Math.hypot(x - 10, y - 12) < 6 || Math.hypot(x - 24, y - 20) < 4 ? 1 : 0),
  'white noise': (x, y) => hash(x, y),
  'random dots': (x, y) => (hash(Math.floor(x / 4), Math.floor(y / 4)) > 0.8 ? 1 : 0),
};
it('regularity', () => {
  for (const [name, f] of Object.entries(cases)) {
    const r = readWindow((x, y) => 0.02 + 0.6 * f(x, y));
    console.log(`${name.padEnd(32)} regularity ${r.regularity.toFixed(2)} contrast ${r.contrast.toFixed(2)} period ${r.period.toFixed(1)}`);
  }
});
