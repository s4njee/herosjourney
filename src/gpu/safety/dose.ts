import type { ParamSchema } from '../../effects/types.ts';

/*
 * Story 2.5: `dose`, the one intensity control every effect has.
 *
 * 0 is still and nearly plain; the default is calm enough to sit behind text and passes every
 * analyser and cap; 1 is the effect fully on. Each effect maps it onto its own amplitudes (warp
 * distance, saturation, symmetry order, trail length, rotation speed, pattern contrast) with
 * `dosed`, so turning one slider turns all of them together. A page can set it through the
 * library like any other parameter.
 *
 * Above `STRONG_DOSE` an effect may go over a cap, but only in a declared preset, which starts
 * behind the click-to-start notice (story 2.6). `tests/dose.test.ts` checks every effect has the
 * control at its default.
 */

export const DEFAULT_DOSE = 0.35;
/** Past this a preset may exceed a cap, and must be declared. */
export const STRONG_DOSE = 0.7;

/** Spread into an effect's `params`, as `TAIL_PARAMS` is. */
export const DOSE_PARAMS = {
  dose: { type: 'number', default: DEFAULT_DOSE, min: 0, max: 1, step: 0.01 },
} as const satisfies ParamSchema;

/**
 * A parameter at `dose`: `still` at 0, `calm` at the default, `full` at 1, linear between. The
 * default is pinned to `calm`, so an effect's tuned default never moves when its range does.
 */
export function dosed(dose: number, still: number, calm: number, full: number): number {
  const d = Math.min(1, Math.max(0, dose));
  if (d <= DEFAULT_DOSE) return still + (calm - still) * (d / DEFAULT_DOSE);
  return calm + (full - calm) * ((d - DEFAULT_DOSE) / (1 - DEFAULT_DOSE));
}
