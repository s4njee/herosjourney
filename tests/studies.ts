// Extra configurations for the cost studies, beyond "every effect at its defaults and at each
// preset", which `tests/study.test.ts` runs anyway. Keyed by epic. Use these for sweeps that
// answer a research question (how cost grows with a parameter).

export interface StudyConfig {
  effect: string;
  /** Shown in the report, e.g. "count=220". */
  name: string;
  preset?: string;
  params?: Readonly<Record<string, unknown>>;
}

const sweep = (
  effect: string,
  key: string,
  values: readonly (string | number)[],
  fixed: Readonly<Record<string, unknown>> = {},
): StudyConfig[] =>
  values.map((value) => ({
    effect,
    name: [...Object.entries(fixed), [key, value]].map(([k, v]) => `${k}=${String(v)}`).join(' '),
    params: { ...fixed, [key]: value },
  }));

export const STUDY_SWEEPS: Readonly<Record<string, readonly StudyConfig[]>> = {
  '4': [
    // 4.2: folding should cost close to nothing; the scene in the wedge is the cost.
    ...sweep('kaleidoscope', 'order', [3, 6, 12, 24]),
  ],
};
