## How it works

One fragment pass (`bloom.wgsl`) draws a muted landscape (sky, a low sun, three rolling hills, soft cloud) directly in OKLCH, then changes its colour and nothing else:

- **Chroma rises.** Each pixel's chroma is multiplied (2.6 times at the default `dose`) and lifted a little, so grey stays nearly grey and colour blooms.
- **Hues drift apart by region.** A slowly evolving low-frequency noise field turns each region's hue its own way, by up to 0.7 radians either side at the default. The whole picture's hue also drifts, at 0.004 turns a second, through `hueAt` (story 2.3).
- **Lightness is untouched.** OKLab L comes straight from the scene. Nothing gets brighter or darker, so the flash analyser has nothing to count: the frame's mean luminance moves by under 0.1% over a run, at every preset.

Every colour goes through `safe_colour_in`: into the gamut by chroma at fixed lightness and hue (story 3.1), then red-capped (story 2.3). It is the family's first wide-gamut effect (story 3.3). With `?p3=1` on a P3 display the canvas is `display-p3`, the colours are mapped into P3 instead of sRGB, and the tail converts the scene to P3 primaries.

It also carries the tail's colour stage (story 3.6). **Colour bleed** takes chroma from a blurred quarter-size copy and lightness from the sharp frame, so colour runs past the hills' edges while the edges stay sharp, like a chroma-subsampled frame or wet watercolour. **Iridescence** lays a thin-film sheen over the scene's own lightness.

## Against CSS

`method: css` shows what `filter: saturate() hue-rotate()` does instead, and `split` puts the two side by side, CSS on the left. The matrices are the Filter Effects definitions. Chrome applies them to **sRGB-encoded** values: measured on a 2D canvas filter, three colours matched the encoded-space result exactly and none matched linear light (`tests/css-filter.test.ts` keeps the three).

They keep the Rec. 709 luma of the encoded values, which is neither luminance nor perceived lightness, so CSS saturation moves lightness, and more as chroma rises. At `saturate(2.6)` (this effect's default gain), the largest OKLab lightness change is 0.024 at chroma 0.03, 0.12 at 0.08 and 0.24 at 0.15. A quarter turn of `hue-rotate()` alone changes it by up to 0.03 at chroma 0.08 and 0.09 at 0.15. In the split view, the sun turns from pale gold to saturated yellow under CSS. Under the OKLCH version it keeps its brightness.

CSS also has one filter for the whole element: no region gets its own hue. For an image a page already has, `saturate(1.3)` is the honest cheap version of a gentle bloom. Past that, the lightness shift shows.

## Cost

On an Apple M1 Max on Dawn ([docs/studies/epic-3.md](../../../docs/studies/epic-3.md)), 1.7 ms per frame at 1080p at the default, 1.5 to 1.9 ms across presets. In Chrome, one frame on a 1920 × 1080 canvas reads 2.8 ms (`npm run browser-check`). That is over Tier A's 2 ms, so it is **Tier B** on this machine. Most of the cost is the per-pixel gamut map and red cap, up to 32 colour conversions a pixel. A cheaper version would compute colour at half resolution, or bake the scene's few base colours.

The colour stage costs little: bleed's blur runs at quarter size and does not show above the noise, and iridescence adds about 0.7 ms. The P3 path costs nothing measurable, and the CSS comparison is cheaper at 1.2 ms. Download: 1.1 kB gzipped of its own, 30 kB with the shared chunks.

## Pitfalls

- Gamut mapping and the red cap run per pixel: up to 32 colour conversions back. That is fine for one full-screen pass on this machine, but it is the effect's main cost. An effect that colours many layers should bake its colours instead.
- The red cap takes chroma out of reds that are only slightly orange. The low sun is capped a little at higher doses, which is the price of a guarantee against red flashes at any hue speed.
- On a P3 canvas a red beyond sRGB counts as fully red and is capped (WCAG defines red only in sRGB). P3 therefore adds greens, cyans and oranges here more than reds.
- An image handed over by the page (rather than the generated scene) is story 4.5's plumbing and is not done yet.

## Safety

Flash `none` at every preset and at `dose` 0.7. Pattern `none`. The only motion is cloud drifting at 0.01 of the view a second and hue, under 0.1° a second of measured rotation.

## When to use it

A hero image or section background that should feel alive without moving: a landscape or a product shot blooming into colour. It is the gentlest effect in the family, and the default is calm enough to sit behind text.

## References

- The Hero's Journey [plan.md](../../../plan.md), stories 3.1 to 3.4 and 3.6.
- Björn Ottosson, [A perceptual color space for image processing](https://bottosson.github.io/posts/oklab/) (2020).
- W3C, _Filter Effects Module Level 1_, the `saturate()` and `hue-rotate()` filter functions and their `feColorMatrix` equivalents.
