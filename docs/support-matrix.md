# Support matrix: what this family adds

Story 1.6. This is a delta on Fire Temple's [support matrix](../../firetemple/docs/support-matrix.md), which covers WebGPU itself, the browsers that ship it, `rgba16float` targets, timestamp queries and the HDR canvas. This page covers only what The Hero's Journey leans on beyond that.

**Checked so far:** Chrome 152 on an Apple M1 Max (Metal 3), on a display that reports P3 and high dynamic range, probed on 2026-10-28 from the dev server, plus Dawn under Node for the tests. Safari, Firefox, Windows, Android and an integrated GPU are not checked yet; they belong to the device matrix (story 12.2). Spec facts below are from the WebGPU specification, not measured.

| What                                                          | Needed by                                           | Spec                                                        | Chrome 152, M1 Max                                         |
| ------------------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------- |
| `display-p3` canvas, `toneMapping: 'standard'`                | 3.3 wide gamut, opt-in                              | Core                                                        | Configures, and `getConfiguration()` reports it            |
| `rgba16float` canvas, `display-p3`, `toneMapping: 'extended'` | 3.3 with HDR highlights                             | Core (`toneMapping` is newer; check before relying on it)   | Configures and reports `display-p3 extended`               |
| Texture arrays for a ring of past frames                      | 5.2 discrete echoes                                 | 256 layers by default, more on request                      | Adapter offers 2 048; 8 to 16 layers are enough            |
| `rgba16float` storage writes                                  | Feedback in compute (5.6, 6.4)                      | Core, write-only storage format                             | Not probed separately; the fragment path needs only render |
| `float32-filterable`                                          | 8.1 deep-zoom data in `r32float`                    | Optional feature                                            | Offered                                                    |
| Storage atomics (`atomic<u32>`)                               | 8.2 fractal flame histogram                         | Core; no float atomics, so the histogram counts in integers | Core                                                       |
| `shader-f16`                                                  | Optional speed-up for fields and fluids             | Optional feature                                            | Offered                                                    |
| `subgroups`                                                   | Optional, for reductions in the analysers' GPU path | Optional feature                                            | Offered                                                    |
| `maxComputeWorkgroupStorageSize`                              | Tile reductions                                     | 16 384 bytes by default                                     | 32 768 available on request                                |
| `prefers-reduced-motion`, `(color-gamut: p3)`, `(dynamic-range: high)` | Safety (Epic 2), 3.3                        | CSS media queries                                           | All available; this display matches p3 and high            |

## What it means for the plan

- **Wide gamut needs no feature request.** A P3 canvas is core, so story 3.3 is a question of how it looks against an sRGB page, not of whether it runs. That needs a P3 display and a person looking, and Safari's and Firefox's answers.
- **Nothing in M0 to M2 needs an optional feature.** The fractal flame's histogram uses integer atomics, which are core, and the deep zoom can fall back to `rgba16float` or unfiltered `r32float` where `float32-filterable` is missing. Every optional feature above is an improvement, declared per effect in its scorecard, never a requirement.
- **Echo rings are cheap in layers and dear in memory.** The adapter allows far more layers than story 5.2 needs; texture memory is what limits it (16 full-resolution `rgba16float` layers at 1080p are about 265 MB). Half resolution or storing only the moving layer is the plan.
