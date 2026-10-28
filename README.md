# The Hero's Journey

A research gallery of WebGPU psychedelic visuals: kaleidoscopes and symmetry, tracers and afterimages, the geometry of the visual cortex, fractals, liquid light shows and saturated, shifting colour. Each effect is built from its mechanism, and comes with a live demo, readable source, a write-up and a practicality scorecard. It is judged the way the temples judge theirs: **would you actually ship this on a website?**

The name is Terence McKenna's "heroic dose", and Joseph Campbell's hero's journey. The site is about images only, and has no drug content.

These images are what photosensitivity guidance warns about, so safety comes first. Every effect has a `dose` control from 0 to 1, calm by default. Every effect and preset runs in `npm test` through three checks, at the default and at the strong dose (0.7): the WCAG 2.3.1 flash and red-flash analyser, a regular-pattern analyser after the broadcast guidance, and caps on whole-field rotation, zoom and drift. Colour that animates is red-capped by construction. Presets past the limits start paused behind a click-to-start notice. See [docs/safety.md](docs/safety.md).

It is built on Fire Temple's page structure and the shared temple core (`@mk7s/hologpu-temple-core`), from Moon Temple's copy of the shell. The accent is magenta. See [plan.md](./plan.md) for the roadmap.

## Getting started

```sh
npm install
npm run dev        # http://localhost:5460
npm test           # unit tests, plus the flash, pattern and motion checks and the held-frame audit over every effect
npm run build      # registry, typecheck, static build to dist/ and the bundle check
npm run study -- --epic 4   # cost study on Dawn: docs/studies/epic-4.md and the Scorecard numbers
npm run shot -- kaleidoscope --times 2   # render an effect headlessly to PNG (output/shots)
npm run browser-check -- --report docs/studies/browser-check.md   # every effect in headless Chrome (dev server running)
npm run posters -- --force   # fallback posters from held frames, as WebP
npm run deploy     # build and upload dist/ to Cloudflare Pages (project herosjourney)
```

`?effect=<id>` opens an effect, `&hud=1` the performance HUD, `&p3=1` a display-p3 canvas for effects that offer one, and `&p.<param>=<value>` sets a parameter, `&p.dose=0.6` included.

## Effects

| Id             | What                                                                                                                 | Tier |
| -------------- | -------------------------------------------------------------------------------------------------------------------- | ---- |
| `hello`        | The smallest effect: soft colour turning slowly in a six-fold mirrored rosette, coloured in OKLCH                    | A    |
| `kaleidoscope` | Drifting coloured glass through mirrors: a rosette, or the square and three triangles of mirrors that tile the plane | A    |
| `chroma-bloom` | A muted landscape whose colour rises and whose hues drift apart by region, at fixed lightness; against CSS filters   | B    |
| `hue-cycle`    | Palette cycling over rings, a rosette or a Truchet tiling, with an editable OKLCH palette held under the limits      | A    |

## Layout

```
src/gpu/safety/            dose, the pattern analyser, motion estimate, colour caps and the start gate's rules
src/gpu/colour/             OKLab and OKLCH, palettes, Display P3, and the CSS filter matrices for comparison
src/gpu/post/colour-stage.ts  the tail's colour stage: bleed, iridescence, conversion to P3
src/gpu/symmetry/fold.ts    the 17 wallpaper groups and the rosettes as folds, with each fold's Jacobian
src/wgsl/oklab.wgsl, fold.wgsl   their shader twins, checked against the TypeScript in tests/
src/effects/<id>/           meta.ts, index.ts, shaders, notes.md, poster.webp
docs/safety.md              the hazards, what the guidance says, and the rules the tests check
```

## License

MIT.
