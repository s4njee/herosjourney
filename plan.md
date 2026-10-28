# The Hero's Journey — WebGPU psychedelic visuals research site

A research site that implements, measures and documents psychedelic visuals: kaleidoscopes and symmetry, tracers and afterimages, breathing and drifting surfaces, the geometric hallucination patterns of the visual cortex, fractals, liquid light shows and saturated, shifting colour. It asks one question of each: **would you actually ship this on a website?** Every effect gets a live demo, readable source, a write-up and a practicality scorecard. Sibling of [Fire Temple](../firetemple/plan.md), [Storm Temple](../stormtemple/plan.md) and [Moon Temple](../moontemple/plan.md), on the same page structure and the shared temple core.

The name is Terence McKenna's "heroic dose" of psilocybin mushrooms, and it doubles as Joseph Campbell's hero's journey: departure, ordeal, return. The site borrows the arc of an experience (onset, come-up, peak, plateau, return) as the shape of its showpiece (Epic 13). It does not borrow anything else: it is about images, and gives no information about drugs.

What separates this family from a 1990s screensaver is grounding. Many of these images have a known mechanism: the four form constants Klüver catalogued are what simple patterns of activity in the primary visual cortex look like once mapped back through the eye's log-polar projection. Tracers are visual persistence and adaptation. Kaleidoscopes are symmetry groups, which are finite and can be enumerated. Each effect starts from its mechanism, and the look follows.

## Goals

- Cover the main kinds of psychedelic visual, each from its mechanism:
  - symmetry: rosettes, the 17 wallpaper groups, mirror kaleidoscopes, hyperbolic tilings and the Droste spiral;
  - persistence: trails, discrete echoes, negative afterimages and motion smear;
  - the form constants: tunnels, spirals, lattices and cobwebs from patterns in the cortex;
  - surfaces that breathe and textures that crawl;
  - fractals;
  - the oil-and-water liquid light show;
  - colour: saturated, wide-gamut and cycling hue at constant lightness.
- Make the family safe by construction. Photosensitive epilepsy and vestibular discomfort are real risks here. Every effect passes the flash analyser and a new spatial pattern analyser at its defaults. Whole-field motion and colour change are capped. One shared intensity control, `dose`, scales every effect from barely there to fully on.
- Ship effects shaped like website parts, not only full-screen trips: a hero background, a kaleidoscope of the page's own image, a tracer cursor, a tunnel loader, a Droste transition between sections, breathing type, and a music visualiser.
- Say plainly when CSS does the job, or a looped video, or nothing at all. CSS has `conic-gradient`, `filter: hue-rotate()` and a few keyframes.
- Build the reusable parts once, shaped to move into `@mk7s/hologpu-temple-core`: the symmetry folds, the history buffer for tracers, the OKLab colour operators and the pattern analyser. The pattern analyser should serve every temple, not only this one.

## Non-goals

- **Drug content.** The site has no dosing, no effects-of-substances copy and no advocacy. The name and the arc of the showpiece are the only references.
- **Neural-network hallucination** (DeepDream, generative models). It needs a trained network and model weights in the page. The cortex models in Epic 6 are small enough to run as shaders, and stay in scope.
- **Clinical or scientific claims about perception.** The cortex model is used because it generates the right images cheaply. The notes cite the papers, and do not claim the site shows what anyone saw.
- **Effects over live page pixels.** A canvas cannot read the page (Fire Temple's [backdrop strategy](../firetemple/docs/backdrop-strategy.md)). Kaleidoscopes and tracers of page content work on geometry, on content redrawn by the effect, or on an image the page hands over.
- **Strobe.** Rhythmic flashing is the classic light-show effect and the classic seizure trigger. It is not built, not even as a declared preset.

## Decisions

These are defaults chosen so work can start. Each is cheap to revisit before Epic 1 is finished.

| Decision            | Default                                                                                                                                                    | Why                                                                                                                                                                                                               |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Foundation          | Moon Temple's shell (from Storm Temple via The Bazaar and Fire Temple) on `@mk7s/hologpu-temple-core`                                                      | It is the newest copy. It has the study harness, browser check, posters, image comparison, the flash and held-frame tests (red flash included), adaptive quality and CSS fallbacks.                               |
| Build tooling       | Vite + TypeScript (strict), with WGSL `#include` resolved per effect at build time                                                                         | Same as every temple, so shader text never reaches the first load.                                                                                                                                                |
| Rendering API       | Raw WebGPU + WGSL, thin helpers                                                                                                                            | The research subject is WebGPU itself.                                                                                                                                                                            |
| Colour pipeline     | Linear HDR `rgba16float` scene → tonemap → sRGB, with colour operations (hue rotation, saturation, palettes) in OKLab / OKLCH                              | A hue turned in OKLCH keeps its lightness, so a cycling colour does not change brightness (story 3.1). A hue turned in RGB or HSV does change it, and the analyser counts the change.                             |
| Wide gamut          | sRGB by default. A `display-p3` canvas with extended tone mapping is opt-in per effect where the device supports it (story 3.3)                            | Saturated colour is the subject, and P3 adds about a quarter more of it. It is opt-in because the page around the canvas stays sRGB, and the edge between them shows.                                             |
| Intensity           | A shared `dose` parameter, 0 to 1, on every effect. It scales amplitude, saturation, symmetry order, trail length and motion together. Default 0.35        | One control a page can turn down. Default settings should be calm enough to sit behind text, and the strong end is declared (story 2.5).                                                                          |
| Flash and pattern   | The temporal flash and red-flash analyser over every preset, plus a new spatial pattern analyser (story 2.2), both in `npm test`                           | Regular high-contrast stripes, checks and spirals are a recognised seizure trigger even when nothing flashes, and they are this family's vocabulary. Nothing in the shell checks for them yet.                    |
| Motion caps         | Whole-field rotation, zoom and drift capped in degrees and in zoom-doublings per second (story 2.4). Everything holds still under `prefers-reduced-motion` | Tunnels and spirals moving the whole field are the vestibular risk (WCAG 2.3.3), and a spinning spiral leaves a motion aftereffect once it stops.                                                                 |
| Strong presets      | Presets over the default `dose` or a cap start paused behind a click-to-start notice, never autoplaying                                                    | A visitor should choose an intense image, not land on one.                                                                                                                                                        |
| Accent              | Hot magenta (`#ff4fd8` dark, `#b0168f` light). The tier colours are checked against it in story 1.1                                                        | No reference picture was given. Magenta is the one hue the other temples have not taken (orange, cyan, violet-blue, indigo), and it reads as psychedelic without the full rainbow. Revisit if the user names one. |
| Neutrals            | Dark first, a little violet                                                                                                                                | Most of these images are light on black. The light theme is still real, because a light page is the hard test (story 11.5).                                                                                       |
| CSS prefix, port    | `hj-`, dev port 5460, launch config `herosjourney`                                                                                                         | 5373, 5390 and 5410 to 5450 are taken by the other holofx projects.                                                                                                                                               |
| Hosting             | Cloudflare Pages (classic) project `herosjourney`, direct upload                                                                                           | No server needed. Create the project with `wrangler pages project create --force`, or wrangler converts the repo to Workers.                                                                                      |
| No-WebGPU behaviour | A poster per effect, and a CSS version where one is honest (story 11.4)                                                                                    | Conic-gradient kaleidoscopes and hue-rotate filters are good fallbacks for a few effects and useless for the rest.                                                                                                |

## Carried over from the other temples

These findings shape this plan, so they need not be rediscovered.

- **Per-pass GPU timings are indicative only** (Fire Temple). Passes overlap on tile-based GPUs, and the browser floor is about 1 ms on the development machine. Effects under about 2 ms cannot be ranked against each other. Cost studies run on Dawn under Node, and Chrome's own frame reading decides the tier.
- **A canvas cannot read the page** (Water and Fire Temple). Element geometry is available every frame (`src/gpu/dom-rects.ts`). Element pixels are not, except an image or canvas the page owns, uploaded with `copyExternalImageToTexture`.
- **Half-float writes truncate on Apple GPUs** (Fire Temple 5.6). A feedback buffer decayed by multiplying in `rgba16float` stalls: below a certain level, `x × 0.98` rounds back to `x`, and the trail never fades to black. Fire Temple fixed this with stochastic rounding in the shader. Every tracer in Epic 5 needs the fix, and a test that a trail reaches zero.
- **Trails: ribbons against accumulation** (Fire Temple 7.7). Ribbons are sharp and belong to their particle, but cost vertices. An accumulation buffer, decayed by `exp(-dt/τ)` with deposits weighted for frame rate, costs a fixed amount of memory, but smears under camera motion and is cleared on resize. Story 5.1 starts from it.
- **Envelopes that dip are extra flashes** (Storm Temple and Eightfold Path, 2026-10-28). A strike pulse that dropped to dark for one frame between two phases counted as a second flash, depending on where the frames landed. Pulsing, breathing and beat-driven envelopes here must be tested at many frame phases, not only at whole frames.
- **A frozen frame can be the hazard** (Storm Temple 6.2). A paused effect shows one frame for as long as the visitor looks at it. The held frame here is a calm moment, never the peak of a pattern.
- **Flicker caps by construction** (Fire Temple `flicker.wgsl`, ported to Moon Temple). Band-limited variation with frequency and amplitude caps keeps a field under the flash threshold however it is seeded. The same idea extends to hue (story 2.3).
- **A baked noise texture beats procedural noise per pixel** (Fire Temple Epic 4). Domain warping and breathing surfaces are noise-heavy.
- **Uniforms written between passes in one command buffer all arrive with the last value** (Moon Temple). Multi-step feedback encoded before one submit needs its per-step values in a buffer, not in `queue.writeBuffer` between passes.
- **A dozen elements is a CSS job; hundreds is the shader's** (Moon Temple 4.1, 7.4). CSS animation's main-thread cost grows with the number of animated elements.
- **Palette cycling** (Eightfold Path `palette-cycling`, after Mark Ferrari). Colour cycling through an indexed palette is the cheapest way to get motion out of a still image, and the original psychedelic computer graphic.
- **Spectral and thin-film chunks exist** (Light Temple `holo-card`, Moon Temple `spectral.wgsl`, `thinfilm.wgsl`). The oil-film colour of story 9.3 and the iridescence of 3.6 reuse them.
- **Scratch work needs a home.** Long sweeps and probes go in `experiments/`, outside test, typecheck and lint.

## Findings so far

- **Only the reflection groups make a seamless kaleidoscope of any motif.** A motif folded through a group is continuous only where every edge of the fundamental domain is a mirror. That leaves the dihedral rosettes and the four wallpaper groups generated by reflections: *2222, *442, *333 and *632. Every other group has an edge where a turn, a glide or a translation meets, and an unsymmetric motif jumps there. `kaleidoscope` offers only the reflection groups; the others need motifs made for them (4.3).
- **Mirrors need no help with mip levels; jumps do.** A reflection keeps a derivative's length, so the GPU's own derivatives pick the right mip on both sides of a mirror. The error at mirror seams measured the same with and without the fold's Jacobian. Where the folded coordinate jumps (a translation wrap or a turn), the GPU differentiates across the jump and samples the coarsest mip, a grey line: the error there was 0.21 to 0.23 with hardware derivatives, against 0.004 with the Jacobian (`tests/fold-seams.test.ts`).
- **Folding is free.** `kaleidoscope` costs the same with 3, 6, 12 or 24 mirrors (1.05 to 1.27 ms at 1080p on Dawn, within noise). The cost is what is drawn in the domain, and the tail.
- **Fixed OKLCH lightness is not fixed luminance.** Turning the hue at fixed L and C moves relative luminance by about 110% of the chroma over a full turn: 11% at chroma 0.1, already over WCAG's 10% step. `rotateHueAtLuminance` re-solves L after the turn and holds luminance to within 10⁻⁴. A large area cycling hue should use it.

## Overlaps and who owns what

| Nearby work                                             | Where                     | The Hero's Journey's part                                                                                                  |
| ------------------------------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `fractal`: Julia and Mandelbrot with smooth colouring   | hologpu                   | 8.1 is the deep zoom (perturbation, emulated precision) and orbit-trap colour; the basic set stays hologpu's.              |
| `reaction-diffusion`, `lenia`, `physarum`               | hologpu                   | 6.4 runs pattern formation in cortical coordinates and maps it back. The simulations are reused, not rebuilt.              |
| `slit-scan` (frame echo), `glitch` (datamosh smear)     | hologpu (stretch)         | Epic 5 owns trails and echoes as perception: persistence, adaptation, afterimage. Glitch stays hologpu's and The Bazaar's. |
| `gradient-oklch`, `noise-lab` (domain warping)          | hologpu                   | Epic 3 and 7 use the same maths for hue cycling and breathing. The labs stay hologpu's.                                    |
| `fluid-dye`, `fluid-warp`, `ink-water`, `neon-mycelium` | Water Temple              | Epic 9 adds a second, immiscible phase and the projector's optics to the dye fluid.                                        |
| `palette-cycling`                                       | Eightfold Path            | 3.5 cycles a palette in OKLCH over generated images. Eightfold Path keeps indexed pixel art.                               |
| `digital-glitch`, `vhs`, `analog-signal`                | The Bazaar                | Not rebuilt. Video feedback (5.6) is the analogue loop of a camera filming its own monitor, not signal damage.             |
| `particle-trails`                                       | Fire Temple               | 5.1 starts from its accumulation buffer.                                                                                   |
| `holo-card` thin film; spectral optics                  | Light Temple; Moon Temple | 3.6 and 9.3 reuse the chunks.                                                                                              |
| `audio-spectrum`                                        | hologpu                   | 10.7 takes its audio input texture and adds beat-safe envelopes.                                                           |
| Flash analyser                                          | every temple              | 2.2's pattern analyser is new and goes to the temple core (11.6), so every temple gets it.                                 |

## Practicality tiers

Every effect is tagged with a tier. Budgets are starting targets, to be validated in Epic 12.

| Tier            | Meaning                                             | Shape                                                  | GPU budget @1080p                   |
| --------------- | --------------------------------------------------- | ------------------------------------------------------ | ----------------------------------- |
| **A** Drop-in   | Safe as ambient decoration, including mobile        | One or two fragment passes, no compute, no history     | ≤ 2 ms on integrated GPU            |
| **B** Feature   | Hero sections and interactive set pieces            | Multi-pass, a history buffer, a small simulation       | ≤ 6 ms on integrated GPU            |
| **C** Showpiece | Dedicated page or landing experience, desktop-first | Ray-marched fractals, a fractal flame, two-phase fluid | ≤ 12 ms on discrete / Apple Silicon |

Budgets include the HDR tail. A tracer's history buffer is the stage most likely to push an effect up a tier, in memory as much as in time, so every study reports texture memory beside milliseconds.

## Architecture sketch

```
herosjourney/
  index.html
  vite.config.ts
  src/
    main.ts            bootstrap: one shared GPU session, mounts an effect
    gpu/               device, canvas, frame loop, shaders, uniforms, targets, passes, post/
                       (bloom, tonemap), dom-rects, pointer, scroll, plus
                       colour/ (OKLab operators, palettes, gamut mapping, wide-gamut canvas),
                       symmetry/ (rosette and wallpaper folds, mirror triangles, hyperbolic
                       and Möbius maps, Droste), history/ (accumulation, ring of past frames,
                       adaptation), cortex/ (log-polar map, planforms, neural field),
                       fractal/ (deep zoom, flame, KIFS), fluid/ (two-phase dye fluid) and
                       safety/ (dose, motion caps, the start gate)
    wgsl/              shared chunks: hash, noise, sdf, colour, plus oklab, palette, fold,
                       complex (Möbius, log, exp), logpolar and stochastic rounding
    effects/<id>/      meta.ts (eager), index.ts + *.wgsl (lazy chunk), notes.md, poster.webp
    shell/             app frame, gallery, effect page, contexts, controls, notes, scorecard, HUD
    lib/               the library entry: mount an effect on a caller's canvas
  tests/               vitest on Dawn's Node bindings: real WebGPU, no browser
                       (flash.ts, pattern.ts, motion.ts run over every effect and preset)
  experiments/         scratch sweeps and probes; not part of the test run
  docs/                research output: safety, support matrix delta, cost studies, findings
```

The effect contract is unchanged from Moon Temple, so effects and shell code move between the temples. There is one addition, `dose`: every effect spreads `DOSE_PARAMS` into its params, as it spreads `TAIL_PARAMS`, and `tests/dose.test.ts` fails an effect that does not:

```ts
// src/effects/<id>/index.ts exports `effect`; meta.ts exports `meta`.
export interface EffectModule<S extends ParamSchema> {
  meta: EffectMeta; // id, title, epic, tier, tags, summary, scorecard, layout
  hdr?: boolean; // asks for the extended-range canvas where allowed
  params: S; // drives controls, docs table, URL state; includes ...DOSE_PARAMS
  presets?: Record<string, Partial<ParamValues<S>>>;
  create(ctx: EffectContext<S>): Promise<EffectInstance>;
}

export interface EffectInstance {
  resize(width: number, height: number, dpr: number): void;
  frame(time: FrameTime, encoder: GPUCommandEncoder, target: GPUTextureView): void; // time.still: the held frame
  stats?(): Record<string, string | number>;
  destroy(): void;
}
```

`tests/flash.test.ts`, `tests/pattern.test.ts`, `tests/motion.test.ts` and `tests/still.test.ts` run over every registered effect and preset. A new effect is covered as soon as its directory exists.

## Definition of done (per effect story)

1. **Budget.** It runs inside its tier budget on the reference devices, with the numbers recorded. Until the device matrix exists (12.2), the only reference device is the development machine, an M1 Max. It is measured per frame on Dawn and as one frame in Chrome, and gets the lowest tier whose budget neither number exceeds. An A or B label is provisional until 12.2, and the scorecard says so.
2. **Parameters.** They are exposed through the schema with `dose` honoured, and there are at least two presets.
3. **Lifecycle.** It handles resize, DPR changes, device loss, offscreen pause and `prefers-reduced-motion`. The held frame shows a calm moment of the effect, never a peak (`tests/still.test.ts`).
4. **Flash, red flash and pattern.** It stays under all three thresholds at its defaults, and in every preset not declared in `scorecard.flashPresets` or `scorecard.patternPresets`. Pulsing envelopes are also tested at many frame phases.
5. **Motion.** It stays inside the whole-field motion caps at its defaults (`tests/motion.test.ts`). A preset over them is declared and starts behind the gate.
6. **History.** Where it keeps history, a trail decays to exactly zero, and nothing is left after resize, pause or a parameter change.
7. **Contexts.** It is shown in at least one realistic web context, over a dark and a light page and at phone size, and its screenshots have been looked at.
8. **Notes.** `notes.md` is written: how it works and what the mechanism is, cost, pitfalls, safety, when to use it, and references. Where a CSS version exists, the notes say how close it gets.
9. **Release.** The scorecard is filled in and the fallback poster captured.

## Milestones

| Milestone                | Scope                                   | Proves                                                                     |
| ------------------------ | --------------------------------------- | -------------------------------------------------------------------------- |
| **M0** Vertical slice    | Epic 1, stories 2.1, 2.5, 3.1, 4.1, 4.2 | Tooling → dose → OKLCH colour → a folded kaleidoscope → deploy             |
| **M1** Safety and colour | Rest of Epics 2 and 3                   | The pattern analyser and motion caps exist before the patterns do          |
| **M2** Symmetry          | Rest of Epic 4                          | Every symmetry group, seamless, on generated scenes and handed-over images |
| **M3** Tracers           | Epic 5                                  | Persistence and afterimages that fade cleanly, priced in memory            |
| **M4** The cortex        | Epics 6 and 7                           | Form constants from their mechanism; surfaces that breathe                 |
| **M5** Deep end          | Epics 8 and 9                           | Fractals and the liquid light show, at Tier C                              |
| **M6** On the page       | Epic 10, stories 11.1–11.5, 12.2        | Web-native usefulness, on more than one device                             |
| **M7** The journey       | Epic 13, rest of Epics 11 and 12        | The showpiece, published findings, shared pieces moved into the core       |

M1 comes before the pattern-heavy epics on purpose: an analyser written after the effects tends to be tuned to pass them. M5 depends only on Epics 2 and 3, so it can run alongside M3 and M4.

Story format: `ID Title [tier] (size)`. Sizes: S ≈ a day or less, M ≈ a few days, L ≈ a week or more.

---

## Epic 1 — Foundation and tooling

This is mostly done by copying Moon Temple's shell. What is left is what every temple needed before its first measured effect.

- [x] **1.1 Scaffold** (S) — Moon Temple's committed tree copied (`git archive HEAD`). Its effects, demo pages and optics-only GPU code are removed (`optics/`, `dof/`, `points`, `glare/`, `glass/`, `wire/`). The `mt-` prefix is renamed `hj-`; watch template literals such as `` `--mt-${string}` ``. Magenta accent, with the tier colours checked against it. Dev port 5460, launch config `herosjourney`. Kept: the HDR tail, DOM rects, pointer and scroll, library host, registry and catalogue scripts, study harness, browser check, posters, image comparison, adaptive quality, CSS fallbacks, and the flash and held-frame tests. _Done from Moon Temple's commit cf2b7a5. Removed with the optics: Moon Temple's demo pages and their build entries, night vision, halation and spectral bloom from the tail, the bokeh CSS fallbacks (11.4 starts again), its experiments and studies. `flicker.ts` moved out of `optics/` to `src/gpu/flicker.ts`; the image comparison to `src/gpu/compare.ts`. The shell's visitor brightness cap was relabelled "Brightness" so it is not mistaken for `dose`. Accent `#ff4fd8` dark and `#b0168f` light; the tier colours (green, teal, amber) were already clear of it, and `tests/contrast.test.ts` passes._
- [x] **1.2 `hello`** [A] (S) — the smallest effect: a slowly turning six-fold rosette of soft colour, one fragment pass through the tail, with `dose` wired from the start. _`hello`: a six-mirror rosette folded by 4.1, two octaves of simplex noise in the wedge, coloured in OKLCH with only the hue drifting. `dose` sets the turn, chroma and hue drift together. 0.3 to 0.7 ms on Dawn at 1080p, 0.78 ms in Chrome; flash `none` at every preset. Tier A on this machine._
- [ ] **1.3 Repository and CI** (S) — its own git repository and GitHub remote, and the CI workflow on software Vulkan (lint, format, typecheck, tests, build), green once. _Repository `s4njee/herosjourney`, private for now. CI has not run: on a private repository GitHub would not start the job for a billing reason. It goes green once the repository is public, as the other temples are, or Actions billing is fixed._
- [x] **1.4 Deploy** (S) — Cloudflare Pages project `herosjourney` (classic, created with `--force`), and an `npm run deploy` that builds, checks the bundle and uploads `dist`. _Live at <https://herosjourney.pages.dev>, deployed from f99f8b1._
- [ ] **1.5 Posters, catalogue and the holofx site** (S) — posters from held frames, `catalogue.json`, and The Hero's Journey in the holofx site's dropdown, lab and effect pages. _Posters (14 and 35 kB) and `catalogue.json` done. Still to do: the holofx site, whose catalogue files have other sessions' uncommitted work in them._
- [x] **1.6 Support matrix delta** (S) — re-check what this family leans on beyond Fire Temple's [support matrix](../firetemple/docs/support-matrix.md):
  - `display-p3` canvases with `toneMapping: { mode: 'extended' }`, and how each browser composites them against an sRGB page;
  - texture arrays deep enough for a ring of past frames;
  - `rgba16float` storage writes for feedback;
  - `float32-filterable` for deep-zoom data;
  - storage atomics for the fractal flame's histogram;
  - `shader-f16`.

  _[docs/support-matrix.md](docs/support-matrix.md), from Chrome 152 on the M1 Max and the spec. A P3 canvas, with standard or extended tone mapping, configures and reports itself. The adapter offers `float32-filterable`, `shader-f16` and `subgroups`, 2 048 array layers and 32 kB of workgroup storage. Nothing in M0 to M2 needs an optional feature. Safari, Firefox and other GPUs are not checked: that is 12.2._

## Epic 2 — Safety first

This family's images are, almost by definition, the ones photosensitivity guidance warns about: high-contrast regular patterns, saturated colour changing fast, and the whole field rotating or zooming. This epic makes the checks and the caps before any pattern effect exists. Each check is a test over every effect and preset, as the flash test already is.

- [x] **2.1 Hazard review** (S) — `docs/safety.md`, written from the sources:
  - WCAG 2.3.1 and its general and red flash thresholds, which are already in the analyser;
  - Ofcom's and ITU-R BT.1702's guidance on regular patterns;
  - Harding and Jeavons on pattern-sensitive epilepsy;
  - Wilkins on visual stress and the most aversive stripe frequencies;
  - WCAG 2.3.3 and vestibular triggers (rotation, zoom, parallax);
  - motion aftereffects.

  The review turns each into a measurable rule for 2.2 to 2.4. It says what our analysers approximate, and that they are not a certification: Harding's analyser is proprietary.

  _[docs/safety.md](docs/safety.md): flashes (already checked), patterns, colour change and motion, each with what the guidance says and a starting rule for 2.2 to 2.4, plus `dose`, the gate and the held frame. The thresholds are from memory of the sources and marked to be confirmed against each source's text when its story is built. Starting motion caps: 5° a second of whole-field rotation, 0.1 zoom doublings a second, 0.05 screen widths a second of drift. Both current effects turn at under 2.5° a second._

- [ ] **2.2 Pattern analyser** [—] (M) — a spatial check beside the flash analyser, run over rendered frames. It finds regions with a regular pattern: dominant orientation and frequency from a local Fourier or Gabor bank, with high Michelson contrast and more than about five light–dark pairs. It flags a region covering more than about a quarter of the screen. Movement makes it worse: a pattern that drifts, rotates or flickers counts at a lower area. Angular frequency counts too, since spirals and pinwheels are patterns in polar coordinates.

  Known positive cases come from the guidance: gratings, checkerboards, dartboards and spirals at the guidance's thresholds. Known negatives are soft rosettes, noise and photographs. `tests/pattern.ts` and a pattern test over every effect and preset follow. The analyser is written to move into the temple core.

- [ ] **2.3 Colour change caps** [—] (S) — hue cycling at constant OKLCH lightness causes no luminance flash, but it can still cause a red flash: a saturated red alternating with blue or green counts under WCAG. The caps cover hue speed in turns per second, by chroma, near red, plus a band limit like `flicker.wgsl`'s. Both have TypeScript twins and seeded tests that the worst allowed settings stay under three red flashes a second.
- [ ] **2.4 Motion caps** [—] (S) — whole-field motion measured from the effect's own transform where it has one, and from optical flow on rendered frames where it does not. That covers rotation in degrees per second, zoom in doublings per second and drift in screen widths per second. Defaults are set from the review, and `tests/motion.test.ts` checks them.

  A motion-aftereffect rule for spirals and tunnels: they slow to a stop over a second or more rather than halting, because adaptation to a sudden halt is what makes the still page appear to move. That is a design rule; the analyser cannot measure perception.

- [x] **2.5 `dose`** [—] (S) — the shared intensity control. It is defined once in `src/gpu/safety/dose.ts`, and each effect maps it onto its own amplitudes: warp distance, saturation, symmetry order, trail length, rotation speed, pattern contrast. The rules:
  - 0 is still and nearly plain.
  - The default (0.35) passes every analyser and cap.
  - Above about 0.7 an effect may exceed a cap only if the preset is declared.

  The shell shows it as one slider on every effect page, and a page can set it through the library.

  _`src/gpu/safety/dose.ts`: `DOSE_PARAMS` (default 0.35), `STRONG_DOSE` (0.7) and `dosed(dose, still, calm, full)`, which pins an effect's tuned value to the default dose. Every effect spreads `DOSE_PARAMS`, which is what puts the slider on its page and makes `&p.dose=` work. `tests/dose.test.ts` fails an effect without it, and a preset above 0.7, until the gate exists (2.6)._

- [ ] **2.6 Start gate and held frames** [—] (S) — presets declared over a cap start paused, behind a click-to-start notice that says what to expect. The notice is never automatic, and it remembers the choice for the session only. Held frames for every effect show a calm moment, with `dose` scaled down if needed. `tests/still.test.ts` checks that the held frame passes the pattern analyser on its own.

## Epic 3 — Colour

Saturated colour that moves without changing brightness, and the wider gamut to put it in. Shared WGSL and TypeScript, each with numeric tests.

- [x] **3.1 OKLab operators** [—] (S) — conversions between linear sRGB, OKLab and OKLCH (Ottosson). Hue rotation and saturation at constant lightness. Gamut mapping that reduces chroma at constant lightness and hue rather than clipping channels. Tests:
  - every operator round-trips;
  - a full hue turn at fixed L and C keeps relative luminance within 2% wherever the colour is in gamut;
  - the gamut mapper never changes lightness.

  _`src/gpu/colour/oklab.ts` and `src/wgsl/oklab.wgsl`, checked against each other on Dawn. The second test was wrong as planned: fixed L and C keep perceived lightness, not relative luminance. A full turn moves luminance by about 110% of the chroma (at L 0.7: 3.3% at chroma 0.03, 11% at 0.1). So there is a second operator, `rotateHueAtLuminance`, which re-solves L by bisection after the turn and holds luminance within 10⁻⁴; the tests check both behaviours. The gamut map bisects chroma (16 steps) at fixed L and hue, and the tests check it finds the largest chroma that fits._

- [ ] **3.2 Palettes** [—] (S) — Quílez's cosine palettes, gradient palettes defined as OKLCH stops, and a palette editor in the shell's controls. Palettes are checked against 2.3's caps when they are animated.
- [ ] **3.3 Wide gamut** [—] (M) — a `display-p3` canvas with extended tone mapping as an opt-in. The tail encodes to P3 when asked, and there is a measured answer to whether the canvas's edge shows against an sRGB page in Chrome and Safari on a P3 display. A colour that is legal in P3 but not in sRGB is mapped by 3.1 on sRGB displays, not clipped.
- [ ] **3.4 `chroma-bloom`** [A] (S) — colour enhancement, the first and gentlest visual: an image the page hands over, or a generated scene, whose chroma rises and whose hues drift slowly apart by region. Lightness is held, so nothing flashes. Compared with CSS `filter: saturate() hue-rotate()`, which turns hue in a space that changes lightness.
- [ ] **3.5 `hue-cycle`** [A] (S) — palette cycling, from Eightfold Path's effect, over generated images (rings, a rosette, a Truchet field), in OKLCH and capped by 2.3. The cheapest moving psychedelic image there is.
- [ ] **3.6 Iridescence and colour bleed** [—] (S) — thin-film iridescence from Light Temple's chunk as a surface option, and colour bleeding: chroma spreading past the edges of its shape while lightness stays sharp, as in a chroma-subsampled or painted image. Both are tail options.

## Epic 4 — Symmetry and kaleidoscopes

Kaleidoscopes are symmetry groups, and these are finite. There are cyclic and dihedral rosettes, 17 wallpaper groups, three mirror triangles that tile the plane, and infinitely many hyperbolic ones. Each is a fold of the plane into a fundamental domain, followed by drawing that domain.

- [x] **4.1 Fold library** [—] (M) — `src/wgsl/fold.wgsl`, with a TypeScript twin, covering:
  - rosettes Cₙ and Dₙ;
  - all 17 wallpaper groups in Conway's orbifold notation, each as a sequence of folds;
  - the three triangle kaleidoscopes (60-60-60, 45-45-90, 30-60-90);
  - a fold count per pixel, for colouring by depth of reflection.

  **The seam problem:** derivatives jump at a mirror, so a texture sampled through a fold picks the wrong mip level along every seam. The fix is to pass unfolded gradients to `textureSampleGrad`, and it is tested on a checker texture's seam. Tests: every group's folds map a random point to the same orbit as its generators, and its fundamental domain is covered exactly once.

  _`src/gpu/symmetry/fold.ts` and `src/wgsl/fold.wgsl`: all 17 groups and Cn, Dn, each returning the folded point, the Jacobian of the isometry applied and a fold count. The triangle kaleidoscopes are p3m1, p4m and p6m. `tests/fold.test.ts` checks each fold against generators written from the group's definition (invariant, idempotent, Jacobian by finite differences), and the domain's area against the cell's divided by the point group's order, within 6%. Moving pmg's mirror from 1/4 to 0.3 fails two of them, as it should. `tests/fold-gpu.test.ts` checks the WGSL against the TypeScript for every group. The seam problem was not what this story said: see Findings. Mirrors keep the mip level right on their own, and the Jacobian matters at translation wraps and turns (`tests/fold-seams.test.ts`)._

- [x] **4.2 `kaleidoscope`** [A] (S) — the M0 effect: a generated scene (drifting coloured noise and shapes) seen through a dihedral rosette whose order and rotation follow `dose`. The fold library's first customer. Compared with a CSS version: a conic-gradient wedge repeated by rotation, which works for 6 to 12 wedges and has no mirror. _`kaleidoscope`, built as a real one: an object cell of beads and thin shards drawn into a mipmapped 512² texture each frame, and mirrors that fold every pixel into it. It has the rosette and the four mirror shapes that tile the plane, and only those (see Findings). `dose` sets the turn, how far the domain wanders over the cell, and the drift and chroma of the glass. 1.1 to 1.3 ms on Dawn at 1080p for every arrangement and mirror count, 1.56 ms in Chrome: Tier A on this machine. Flash `low`, and `low` still at `dose` 1. The CSS version is described in the notes, not built (11.4)._
- [ ] **4.3 `wallpaper-lab`** [—] (S) — one motif through all 17 wallpaper groups and the rosettes side by side, labelled in orbifold and crystallographic notation. The page to link from every symmetry notes file.
- [ ] **4.4 `bead-kaleidoscope`** [B] (M) — a real kaleidoscope. An object cell of translucent coloured beads and glass chips tumbles under gravity as the visitor turns it (pointer or device orientation), in a small 2D rigid-body simulation. It is seen through a two- or three-mirror tube, with light losses at each reflection, so deeper images are dimmer. Compared with 4.2: the beads' physics is what reads as real.
- [ ] **4.5 `image-kaleidoscope`** [A] (S) — the page's hero image, handed over the stable way (`createImageBitmap`, `copyExternalImageToTexture`, mipmapped), through a chosen group, with the fundamental domain panning slowly across the image. The web motif: a kaleidoscope of the page's own content.
- [ ] **4.6 Hyperbolic tilings** [B] (M) — `hyperbolic-tiling`: {p, q} tilings of the Poincaré disk by folding into the fundamental triangle, with reflections in circles. The tiling moves by Möbius transformations (elliptic, parabolic and hyperbolic), so it flows without ever breaking. Coloured by fold count, with an image or pattern drawn in the triangle. After Escher's _Circle Limit_ prints. Includes anti-aliasing near the rim, where tiles get smaller than a pixel.
- [ ] **4.7 `droste`** [A] (M) — the Droste effect and Escher's _Print Gallery_ spiral: an image recursing into itself, by the log-polar map z ↦ exp(((2πi + ln s) / 2πi) · log z) after de Smit and Lenstra. Zooming in forever without a seam. Its zoom speed is capped by 2.4.
- [ ] **4.8 Study** [—] (S) — the cost of folding (it should be close to nothing) against the cost of what is drawn in the domain. Seam error with and without unfolded gradients. Which groups the pattern analyser flags at which `dose`: high-order rosettes with high contrast are pinwheels.

## Epic 5 — Tracers and afterimages

Tracers are visual persistence: a moving object leaves a smeared or stepped trail of copies, sometimes in shifting colours. This shows as streaks or as a stepped series of copies behind a moving hand. Afterimages are adaptation: after staring, the complement of what was seen appears on a plain surface. Each is a way of keeping history, and history costs memory.

- [ ] **5.1 Accumulation trails** [—] (S) — a persistent HDR target decayed by `exp(-dt/τ)`, deposits weighted so the light per second is independent of frame rate (Fire Temple 7.7), with stochastic rounding so the decay reaches zero on Apple GPUs. The test renders one frame of light, decays it for 10τ at 30, 60 and 120 fps, and expects exact zero and the same total light at every frame rate.
- [ ] **5.2 Discrete echoes** [—] (M) — a ring of past frames in a texture array, at a stride of N frames. It draws K copies behind the present, each fainter and optionally hue-shifted in OKLCH, which gives a stepped series of copies rather than a smear. Its own memory row in every study: K full-resolution copies is expensive, so test half resolution and storing only the moving layer.
- [ ] **5.3 Adaptation and negative afterimages** [—] (M) — a per-pixel adaptation state: a slow low-pass of the image in opponent colour (L, M, S or OKLab's a and b). The shown image has the adapted state subtracted. Staring at a coloured shape and then looking at a plain field shows its complement, fading over seconds. Tested numerically: a red patch held 5 s then removed leaves a cyan afterimage that decays with the set time constant. A tail option, `afterimage`, for any effect.
- [ ] **5.4 Motion smear** [—] (S) — smear along each pixel's motion, from the effect's own velocities where it has them. Compared with 5.1, which smears everything alike, and 5.2, which steps.
- [ ] **5.5 `tracer-cursor`** [A] (S) — the pointer leaving a trail of hue-shifted echoes that fade cleanly. On a page with no pointer, a slow wander. The web motif, and Tier A because it only draws near the path.
- [ ] **5.6 `video-feedback`** [B] (M) — the analogue loop of a camera filming its own monitor: last frame zoomed, rotated and colour-shifted, plus a seed. It falls into spirals, rings and travelling waves, depending on zoom and angle (Crutchfield 1984). Also the MilkDrop variant: a per-vertex warp mesh with per-frame equations. The decay must reach zero (5.1), and the feedback gain is held below 1 so it can never run away to white, which would be a flash.
- [ ] **5.7 `tracer-figure`** [B] (M) — a moving figure the effect draws itself (a dancer's silhouette, a hand, a swinging pendulum): echoes, colour trails and afterimages on it. This is the clearest demonstration of the three methods against each other, in a split view.
- [ ] **5.8 `tracer-elements`** [A] (S) — page elements (cards, buttons) leaving echoes of their outlines as they move or scroll, from DOM rects, since pixels are out of reach. The outline is redrawn, not captured.
- [ ] **5.9 Study** [—] (S) — cost and texture memory of each history method at 1080p and phone size. Which survive camera motion and resize. Whether hue-shifted echoes pass 2.3. Which method suits which job.

## Epic 6 — Form constants and the visual cortex

The scientific core. Klüver found four recurring geometric forms in hallucinations, the form constants: tunnels and funnels, spirals, lattices (honeycombs, checkerboards, triangles), and cobwebs. Ermentrout and Cowan (1979), and later Bressloff, Cowan and colleagues (2001), showed what they are: the eye maps onto the primary visual cortex by an approximately log-polar map. Plain stripes and hexagons of activity across the cortex, the patterns any simple excitable medium forms, look like exactly these four forms once mapped back to the visual field. Stripes at different angles in the cortex become rings (tunnels), rays (funnels) and spirals. Hexagonal activity becomes honeycombs and checkerboards. Patterns in orientation-tuned cells become cobwebs and lattices of lines.

- [ ] **6.1 Retino-cortical map** [—] (S) — `src/wgsl/logpolar.wgsl` with a TypeScript twin: the visual field to cortical coordinates (Schwartz's complex log, with a foveal offset so the centre is finite) and back. The visual field is drawn by sampling any cortical pattern through the inverse map. Tests: round trips, and that horizontal stripes come back as rings and vertical as rays.
- [ ] **6.2 Planforms** [—] (M) — the Bressloff–Cowan planforms in cortical coordinates (stripes at any angle, squares, hexagons, rolls and their contoured, orientation-tuned versions) mapped back. That gives every form constant from a handful of plane waves. The effect `form-constants` is the lab: a cortical view beside the visual-field view, and the planform's wave vectors under the pointer.
- [ ] **6.3 `cortical-tunnel`** [A] (S) — a tunnel and a spiral from drifting stripes in the cortex: stripes drifting along the cortex become a tunnel flowing outwards, stripes at an angle a turning spiral. A loader or a hero. Its motion and contrast are capped by 2.2 and 2.4; at default `dose` it is soft-edged and low contrast.
- [ ] **6.4 `cortex-patterns`** [B] (M) — pattern formation, not plane waves. A neural field or Swift–Hohenberg equation runs on a grid in cortical coordinates and forms its own stripes and hexagons, which change and break as its parameters drift. It is mapped back to the visual field, so form constants grow, melt into each other and re-form. hologpu's `reaction-diffusion` is the same machinery on another equation: compare the two.
- [ ] **6.5 `cobweb`** [B] (M) — the fourth form constant, which needs orientation: a field of short oriented line elements whose orientations follow a cortical pattern, as orientation-tuned cells would, drawn as fine strokes. It gives cobwebs and lattices of lines that plain intensity patterns cannot.
- [ ] **6.6 Colour and depth on the form constants** [—] (S) — colour by cortical position, through 3.1's operators, plus slow drift and the soft fading at the edges that descriptions keep reporting. Judged by the pattern analyser at each `dose`.
- [ ] **6.7 Study** [—] (S) — cost of planforms against the simulation, and which form constants the pattern analyser flags at which contrast and size. Lattices at full contrast are checkerboards, the hazard case. The doc says which form constants a website can use at all.

## Epic 7 — Surfaces that breathe

Commonly described and harder to show: walls that slowly breathe, textures that crawl along their own grain, patterns drifting over surfaces. They are subtle, slow distortions of a real image, so these effects work on an image the page hands over or on one they draw.

- [ ] **7.1 Breathing** [A] (S) — a low-frequency, mostly isotropic scale pulsation in regions of the image, at 0.1 to 0.3 Hz (about a breath), its amplitude from `dose` and its regions from baked noise. Tested at many frame phases, per the strike-pulse finding, so the envelope cannot dip into a flash.
- [ ] **7.2 Texture crawl** [B] (M) — the image's texture flowing along its own edges. A structure tensor gives the local edge direction, and a slow advection or line-integral convolution along it makes grain crawl the way wood grain or carpet does. After Kyprianidis's flow-based image abstraction and Cabral and Leedom's LIC.
- [ ] **7.3 Drifting overlays** [B] (M) — a faint pattern (a Truchet field, a fractal, a form constant) drifting across an image's surfaces, aligned to its edges and depth where a depth map is handed over (Moon Temple's `photo-focus` sample format).
- [ ] **7.4 `breathing-wall`** [B] (S) — 7.1 to 7.3 on one photograph: a room, a wall or a forest floor, dropped or sampled. The `dose` slider walks through them, from breathing alone to crawling and drifting.
- [ ] **7.5 `melting-type`** [A] (M) — a headline that breathes, drips and ripples, redrawn from the page's own type position (Moon Temple's `halation-text` approach, MSDF atlas from Fire Temple). The real text stays selectable and readable underneath; the effect is decoration only.
- [ ] **7.6 Study** [—] (S) — cost, and how far an image can be warped before it stops reading as the same image. Judged by eye on the samples and recorded as the default `dose` mapping.

## Epic 8 — Fractals

Self-similar images that zoom forever. The research is precision (WGSL has no 64-bit floats) and colour.

- [ ] **8.1 `deep-zoom`** [B] (L) — Mandelbrot and Julia deep zoom past `f32`'s limit by perturbation theory: one reference orbit computed on the CPU in high precision, and per-pixel deltas in `f32`. Float-float emulation is the fallback. Colouring by smooth iteration count, orbit traps and distance estimation, through 3.2's palettes. It finds and zooms into a sequence of interesting locations on a loop. hologpu's `fractal` is the baseline.
- [ ] **8.2 `fractal-flame`** [C] (L) — Draves's fractal flame: an iterated function system with non-linear variations, run as a chaos game in compute. Millions of points a frame land in an atomic histogram, displayed with log density, gamma and colour by function. It animates by interpolating between flames. Electric Sheep's look. It is a Tier C showpiece, and the study says what a Tier B version keeps.
- [ ] **8.3 `kifs-tunnel`** [C] (M) — a ray-marched 3D kaleidoscopic IFS (Knighty) or Mandelbox (Lowe), flown through as a tunnel. Fold library 4.1 in three dimensions, with a camera path and fog. Whole-field motion is capped by 2.4.
- [ ] **8.4 `apollonian`** [A] (S) — an Apollonian gasket and Kleinian limit sets by circle inversion, with a seamless loop of zoom into a self-similar point. Tier A as a loader or a hero.
- [ ] **8.5 Infinite zoom loops** [—] (S) — the general method behind 4.7, 8.1 and 8.4 as page parts: a zoom that loops seamlessly at a self-similar point, so a loader or hero can run forever on a fixed budget.
- [ ] **8.6 Study** [—] (S) — cost, the precision limit of each method (the deepest zoom before pixels block up), and the pattern analyser's verdict on each fractal at full contrast.

## Epic 9 — The liquid light show

The 1960s light show: coloured oil, water and dye pressed between clock-face glass dishes on an overhead projector, swirled and heated by hand, thrown huge behind a band. It is two immiscible liquids with surface tension, dyes that stay in their phase, heat-driven flow, and projector optics.

- [ ] **9.1 Two-phase fluid** [—] (L) — Water Temple's stable-fluids dye solver with a second, immiscible phase, tracked by a phase field (Cahn–Hilliard) or a level set, with surface tension so blobs round up, merge and pinch off. There are dyes per phase, and buoyancy from a temperature field the visitor heats with the pointer. Tested: a blob's area is conserved within 2% over a minute, and a stretched blob rounds up.
- [ ] **9.2 Projector optics** [—] (S) — the look of light through the dish: dyes absorbing per channel (Beer–Lambert, so overlapping colours subtract), a hot centre with vignetting, the lens's soft focus and chromatic fringe, and the projected image's huge scale.
- [ ] **9.3 Oil film** [—] (S) — thin-film interference where a phase is thin (Light Temple's chunk), the rainbow sheen of oil on water.
- [ ] **9.4 `liquid-light`** [C] (M) — the showpiece: 9.1 to 9.3 together, the dish turned by dragging, heated where pressed, with an "operator" mode that swirls it on its own to music or a slow clock.
- [ ] **9.5 `oil-wheel`** [A] (S) — the cheaper prop of the same shows: a rotating colour wheel or liquid wheel projected over a scene. Pre-baked dye textures turning and overlapping, no simulation. Tier A.
- [ ] **9.6 Study** [—] (S) — cost of the two-phase solver against Water Temple's one-phase dye, at a grid size that still reads as liquid, and what the Tier B version drops.

## Epic 10 — On the page

Effects shaped like website parts, with the safety caps applied at their defaults. The most directly useful group, and the one where "would you ship this?" will most often be answered "only on a music, festival or art site, and only at low `dose`."

- [ ] **10.1 `trip-hero`** [A] (S) — a calm hero background: a slow kaleidoscope or form constant at low contrast and low `dose`, behind real text on its plate. The default for the family on a landing page.
- [ ] **10.2 `kaleido-hover`** [A] (S) — cards and images that fold into a kaleidoscope of themselves on hover and unfold on leave, from the image the card shows (4.5). Short, triggered by the visitor, and still under reduced motion.
- [ ] **10.3 `tunnel-loader`** [A] (S) — a loader from 6.3 or 8.4, small, low contrast, and looped seamlessly.
- [ ] **10.4 `droste-transition`** [B] (M) — a transition between sections or routes: the outgoing view spirals into a Droste recursion and the incoming one emerges from it, on what the effect can draw (two images, or two views it renders). Measured against a CSS-only version using scale and rotate.
- [ ] **10.5 `scroll-journey`** [B] (M) — a long page whose sections take the visitor deeper, from colour (3.4) to breathing (7.1), tracers (5.x), kaleidoscope (4.x), form constants (6.x) and back, all from one scroll value. Each stage is capped. Under reduced motion each section shows its held frame.
- [ ] **10.6 `trip-toggle`** [A] (S) — a switch, like a theme toggle, that turns a page's decoration psychedelic. Hue drift on accents, gentle breathing on images, tracers on the cursor, all at low `dose`, and all off again instantly. It goes through the start gate, and is the honest version of the easter egg every music site wants.
- [ ] **10.7 `visualiser`** [B] (M) — a music visualiser, a natural home for this family. Audio comes from a dropped file or a bundled track, with no microphone by default, through hologpu's audio input texture. Bands drive symmetry order, warp and hue. The finding to test is that beats are a flash risk: beat envelopes are smoothed so they never pass the flash or red-flash thresholds, and are tested at many frame phases on the loudest tracks.
- [ ] **10.8 `psychedelic-404`** [A] (S) — a not-found page whose content slowly folds into a kaleidoscope as you look, unfolding when you move. A small joke that has to be safe.

## Epic 11 — Production readiness

What it takes to move an effect from demo to a real site. Kept short where the shell already has it.

- [ ] **11.1 Embed API** (S) — every effect usable as `mount(canvas, effect, options)` from the library build, `dose` included, with per-effect gzip size reported. Mostly there from the shell.
- [ ] **11.2 Adaptive quality** (M) — a ladder per effect: fewer echoes, a lower-resolution history, fewer fractal iterations, a smaller fluid grid, then three-quarter and half resolution, then the CSS version or the poster.
- [ ] **11.3 Accessibility** (M) — `docs/accessibility.md`, building on Epic 2:
  - flash, red flash and pattern over every preset;
  - the start gate;
  - held frames;
  - every motion stopping under reduced motion;
  - text contrast over saturated moving colour, with the scrim the contexts provide (moving colour behind text is worse than moving brightness for readability);
  - the `dose` control exposed to the page so a site can offer it to visitors.
- [ ] **11.4 CSS fallbacks** (S) — for each Tier A effect, the best CSS version shown side by side with its cost and what it cannot do. That means conic and repeating gradients, `filter: hue-rotate()` and `saturate()`, mirrored backgrounds and a few keyframes. CSS hue rotation changes lightness (3.4), so each fallback is run through the flash analyser too.
- [ ] **11.5 Light pages** (S) — psychedelic colour on a white page: multiplied dye colours, as on a projector screen; colour that darkens rather than adds; or dark sections only. Decided per effect.
- [ ] **11.6 Into the temple core** (M) — move the pattern analyser, motion checks and `dose` contract (Epic 2), the fold library (4.1), the history buffer with stochastic rounding (5.1), the OKLab operators (3.1) and the log-polar map (6.1) into `@mk7s/hologpu-temple-core`. Tell the other temples the pattern analyser exists, and run it over their effects once.

## Epic 12 — Measurement and findings

Turn the demos into conclusions.

- [ ] **12.1 Cost studies** (M) — one study per effect epic from the shell's harness, with texture memory beside milliseconds, collected into one results page.
- [ ] **12.2 Device matrix** (M) — an integrated-GPU laptop, Apple Silicon, a mid-range Android phone and an iPhone, plus a P3 display for 3.3. Scheduled in M6, so the tiers stop resting on one machine.
- [ ] **12.3 Live against baked** (S) — `kaleidoscope`, `cortical-tunnel` and `liquid-light` as looped videos and as the shader: bytes, GPU and decode cost, and what is lost (interaction, resolution, `dose`, the seamless loop). Psychedelic loops are usually shipped as video, so this is the comparison that matters most.
- [ ] **12.4 CSS against WebGPU** (M) — 11.4's pairs measured on the same devices: frame time, main-thread time, and where each breaks.
- [ ] **12.5 Decision guide** (S) — "which effect for which job" and "what dose for which page", with budgets, safety caveats and the cases where the answer is "don't".
- [ ] **12.6 Visual regression** (M) — screenshot tests with a fixed time seed, using the shell's image comparison.

## Epic 13 — The journey

- [ ] **13.1 `heros-journey`** [C] (L) — the showpiece: one page that follows the arc of an experience through the family's effects, driven by scroll or by a slow clock over a few minutes. The stages:
  1. **Onset:** colour enhancement (3.4) and gentle breathing (7.1).
  2. **Come-up:** tracers on anything that moves (Epic 5) and textures that crawl (7.2).
  3. **Peak:** form constants growing out of the cortex (6.4), a kaleidoscopic tunnel (8.3) and a fractal flame (8.2).
  4. **Plateau:** the liquid light show (9.4).
  5. **Return:** afterimages fading (5.3), colour draining back, the page as it was.

  The whole page goes through the start gate, its peak is held under every cap at the declared `dose`, and reduced motion gives a still for each stage. It is judged by whether each stage reads as its mechanism, not by intensity.

- [ ] **13.2 Write-up** (S) — the journey's notes: what each stage is drawn from (the mechanism and the paper), what it costs, what was capped for safety and by how much, and what a website can take from it.

---

## Risks and open questions

- **Photosensitivity.** This is the family's defining risk, and the reason Epic 2 comes first. Regular patterns, saturated red changes and whole-field motion are the vocabulary of psychedelic art. Some classic images (the high-contrast spiral, the op-art checkerboard, the strobe) cannot be made safe at full strength, and are either built capped and declared, or not built.
- **The pattern analyser's validity.** There is no open reference implementation of pattern-sensitivity analysis, and Harding's tool is proprietary. 2.2 approximates published guidance and is tested on constructed cases. It can say "this is risky"; it cannot certify "this is safe". The docs say so.
- **Motion and vestibular comfort.** Tunnels and zooms are as hard on vestibular disorders as on the eye. The caps in 2.4 are a starting point from guidance, not measurement on people.
- **Taste.** Psychedelic graphics have a cheap register: rainbow gradients, 1990s screensavers, festival flyers. The value here is in the mechanisms and the measurements. An effect that only looks like a screensaver has not earned its story.
- **Association.** Some sites will not want anything that reads as drug culture, whatever its basis. The decision guide (12.5) should be candid that most of this family belongs on music, art, festival and game sites. The site's copy stays on images (Non-goals).
- **Feedback precision.** Half-float feedback stalls on Apple GPUs (carried over), and slow decays are exactly where it shows. Every history buffer has a test that it reaches zero.
- **Memory.** Echo rings, adaptation state, fluid grids and fractal histograms are all full-resolution buffers. A Tier A effect may be cheap in time and heavy in memory, and the scorecard has to show both.
- **Seams.** Folds and log-polar maps break derivatives, and seams show at every mirror and at the fovea unless gradients are handled (4.1, 6.1).
- **Fractal precision.** `f32` limits a direct zoom to about 10⁵. Perturbation needs a CPU reference orbit in high precision, and glitch detection where the reference fails.
- **CSS is a rival for the simple cases.** Conic gradients and `hue-rotate` do a passable six-fold kaleidoscope and colour cycle for almost nothing. Several Tier A effects may end with "use the CSS".
- **Measurement.** The same as every temple: one machine, a 1 ms browser floor, and effects under about 2 ms that cannot be ranked. The tiers stay provisional until 12.2.
- **Open questions:**
  - Does constant-lightness hue cycling ever pass the red-flash test at a speed that still reads as cycling?
  - How much `dose` can a hero carry behind body text before reading suffers?
  - Is the cortical simulation (6.4) visibly better than plane-wave planforms (6.2), enough to justify its cost?
  - Do discrete echoes (5.2) read as "tracers" to people who have seen them, more than smooth trails (5.1) do?
  - Does a P3 canvas's edge show against an sRGB page?

## Starting references

These come from memory, not from a literature search in this session, as research.md warns for its own list. Confirm each before citing it in a notes file.

- Heinrich Klüver, _Mescal and Mechanisms of Hallucinations_ (University of Chicago Press, 1966; first published 1928 as _Mescal_) — the form constants.
- G. Bard Ermentrout and Jack D. Cowan, _A Mathematical Theory of Visual Hallucination Patterns_ (Biological Cybernetics, 1979).
- Paul C. Bressloff, Jack D. Cowan, Martin Golubitsky, Peter J. Thomas and Matthew C. Wiener, _Geometric Visual Hallucinations, Euclidean Symmetry and the Functional Architecture of Striate Cortex_ (Philosophical Transactions of the Royal Society B, 2001).
- Eric L. Schwartz, _Spatial Mapping in the Primate Sensory Projection: Analytic Structure and Relevance to Perception_ (Biological Cybernetics, 1977) — the log-polar retino-cortical map.
- Arnold Wilkins, _Visual Stress_ (Oxford University Press, 1995) — aversive stripes and pattern glare.
- Graham Harding and Peter Jeavons, _Photosensitive Epilepsy_ (Mac Keith Press) — flash and pattern sensitivity.
- ITU-R Recommendation BT.1702, _Guidance for the reduction of photosensitive epileptic seizures caused by television_.
- Ofcom, _Guidance Note on Flashing Images and Regular Patterns in Television_ (Broadcasting Code, section 2).
- WCAG 2.2, Success Criteria 2.3.1 _Three Flashes or Below Threshold_ and 2.3.3 _Animation from Interactions_.
- James P. Crutchfield, _Space-Time Dynamics in Video Feedback_ (Physica D, 1984).
- Scott Draves and Erik Reckase, _The Fractal Flame Algorithm_ (2003; revised 2008); Scott Draves, _Electric Sheep_.
- John H. Conway, Heidi Burgiel and Chaim Goodman-Strauss, _The Symmetries of Things_ (A K Peters, 2008) — orbifold notation and the 17 groups.
- B. de Smit and H. W. Lenstra Jr., _The Mathematical Structure of Escher's Print Gallery_ (Notices of the AMS, 2003) — the Droste map.
- Douglas Dunham's papers on generating Escher-like hyperbolic patterns, and Escher's _Circle Limit_ prints.
- David Mumford, Caroline Series and David Wright, _Indra's Pearls_ (Cambridge University Press, 2002) — Kleinian groups and limit sets.
- Knighty, kaleidoscopic IFS (Fractal Forums, 2010); Tom Lowe, the Mandelbox (2010).
- K. I. Martin, _Superfractalthing_ (2013) — perturbation for deep Mandelbrot zooms.
- Björn Ottosson, _A Perceptual Color Space for Image Processing_ (2020) — OKLab.
- Íñigo Quílez's articles on cosine palettes and domain warping.
- Brian Cabral and Leith Leedom, _Imaging Vector Fields Using Line Integral Convolution_ (SIGGRAPH 1993); Jan Eric Kyprianidis and Jürgen Döllner on flow-based image abstraction (2008–2009).
- J. W. Cahn and J. E. Hilliard, _Free Energy of a Nonuniform System_ (1958) — the phase field for two liquids.
- Ryan Geiss, _MilkDrop_ — warp-mesh feedback visualisation.
- Histories of the 1960s liquid light shows (the Joshua Light Show; Glenn McKay; Bill Ham) — for the method, not the images.
- Joseph Campbell, _The Hero with a Thousand Faces_ (1949) — the name's other half.
- The other temples: [Fire Temple plan](../firetemple/plan.md), [Moon Temple plan](../moontemple/plan.md), [Eightfold Path plan](../eightfoldpath/plan.md), [hologpu plan](../hologpu/plan.md), [research.md](../research.md) §6 shared pieces.
