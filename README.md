# The Hero's Journey

A research gallery of WebGPU psychedelic visuals: kaleidoscopes and symmetry, tracers and afterimages, the geometry of the visual cortex, fractals, liquid light shows and saturated, shifting colour. Each effect is built from its mechanism, and comes with a live demo, readable source, a write-up and a practicality scorecard. It is judged the way the temples judge theirs: **would you actually ship this on a website?**

The name is Terence McKenna's "heroic dose", and Joseph Campbell's hero's journey. The site is about images only, and has no drug content.

These images are what photosensitivity guidance warns about, so safety comes first. Every effect has a `dose` control from 0 to 1, calm by default. Every effect and preset runs through the WCAG 2.3.1 flash and red-flash analyser in `npm test`, and through a pattern analyser once story 2.2 lands. See [docs/safety.md](docs/safety.md).

It is built on Fire Temple's page structure and the shared temple core (`@mk7s/hologpu-temple-core`), from Moon Temple's copy of the shell. The accent is magenta. See [plan.md](./plan.md) for the roadmap.

## Getting started

```sh
npm install
npm run dev        # http://localhost:5460
npm test           # fold, colour and dose tests, the WCAG 2.3.1 flash analyser and the held-frame audit
npm run build      # registry, typecheck, static build to dist/ and the bundle check
npm run study -- --epic 4   # cost study on Dawn: docs/studies/epic-4.md and the Scorecard numbers
npm run shot -- kaleidoscope --times 2   # render an effect headlessly to PNG (output/shots)
npm run browser-check -- --report docs/studies/browser-check.md   # every effect in headless Chrome (dev server running)
npm run posters -- --force   # fallback posters from held frames, as WebP
npm run deploy     # build and upload dist/ to Cloudflare Pages (project herosjourney)
```

`?effect=<id>` opens an effect, `&hud=1` the performance HUD, and `&p.<param>=<value>` sets a parameter, `&p.dose=0.6` included.

## Effects

| Id             | What                                                                                                             | Tier |
| -------------- | ---------------------------------------------------------------------------------------------------------------- | ---- |
| `hello`        | The smallest effect: soft colour turning slowly in a six-fold mirrored rosette, coloured in OKLCH                | A    |
| `kaleidoscope` | Drifting coloured glass through mirrors: a rosette, or the square and three triangles of mirrors that tile the plane | A    |

## Layout

```
src/gpu/safety/dose.ts      the shared intensity control every effect spreads into its params
src/gpu/colour/oklab.ts     OKLab and OKLCH: conversions, gamut mapping, hue turns at fixed lightness or luminance
src/gpu/symmetry/fold.ts    the 17 wallpaper groups and the rosettes as folds, with each fold's Jacobian
src/wgsl/oklab.wgsl, fold.wgsl   their shader twins, checked against the TypeScript in tests/
src/effects/<id>/           meta.ts, index.ts, shaders, notes.md, poster.webp
docs/safety.md              the hazards, what the guidance says, and the rules the tests check
```

## License

MIT.
