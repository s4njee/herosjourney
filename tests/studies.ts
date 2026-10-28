// Extra configurations for the cost studies, beyond "every effect at its defaults and at each
// preset", which `tests/study.test.ts` runs anyway. Keyed by epic. Use these for sweeps that
// answer a research question (how cost grows with a parameter).

export interface StudyConfig {
  effect: string;
  /** Shown in the report, e.g. "count=220". */
  name: string;
  preset?: string;
  params?: Readonly<Record<string, unknown>>;
  /** What `ctx.gamut` says (story 3.3). Default sRGB. */
  gamut?: 'srgb' | 'p3';
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
  '3': [
    // 3.6: what the colour stage's options cost on top of the scene, and the wide-gamut path.
    ...sweep('chroma-bloom', 'bleed', [0, 0.5, 1]),
    ...sweep('chroma-bloom', 'iridescence', [1]),
    ...sweep('chroma-bloom', 'method', ['css']),
    { effect: 'chroma-bloom', name: 'gamut=p3', gamut: 'p3' },
    // 3.5: the fields differ in shader cost; the palette is one texture read for all of them.
    ...sweep('hue-cycle', 'field', ['rings', 'rosette', 'truchet']),
  ],
  '4': [
    // 4.2: folding should cost close to nothing; the scene in the wedge is the cost.
    ...sweep('kaleidoscope', 'order', [3, 6, 12, 24]),
  ],
};
