## How it works

Palette cycling, from Eightfold Path's effect (after Mark Ferrari's colour-cycled pixel art), on generated images instead of indexed pixels. One fragment pass (`cycle.wgsl`) computes an index for each pixel, then reads a palette at that index minus a phase that advances with time. Colour flows through the image while nothing in it moves. There are three index fields:

- **Rings:** distance from the centre.
- **Rosette:** rings whose radius wobbles a chosen number of times a turn, so they read as petals.
- **Truchet:** a random tiling of quarter-arc tiles; the index is the distance from the nearer arc, so the bands run along the arcs and join across tiles.

The palette is a `palette` parameter (story 3.2): OKLCH stops, evenly spaced and interpolated in OKLab, edited in the controls and carried in links. It is baked on the CPU into a 256-texel texture, every texel gamut-mapped and red-capped, so the shader does one texture read per pixel.

## Held under the limits, whatever the palette

A visitor can make any palette in the editor, so the effect does not trust the palette to be calm. Each time the palette or `dose` changes, it does three things on the CPU:

- **Contrast.** It draws the stops' luminances towards their mean, each stop keeping its chroma and hue and taking the lightness that gives its new luminance. It stops when the baked palette's light–dark step is under 90% of the step at which stripes become clearly discernible (story 2.2): 0.045 at the default, 0.09 at the strong dose, then rising to 0.6 at 1. Rings, petals and arcs are regular patterns by construction, and this keeps them under the rule without the effect having to know the palette. Narrowing lightness alone would not do it, since equal lightness is not equal luminance (3.1). The output skips the tonemap, which would widen the step by about a third, so the step set is the step on screen.
- **Speed.** The cycle is never faster than the hue cap (0.5 turns a second, story 2.3), or than the palette's own lightness flashes allow (at most two a second over a large area, `safePaletteSpeed`).
- **Apparent motion.** Cycling a palette through rings makes them appear to expand, and the motion check read that as a whole-field zoom: 0.113 doublings a second at `dose` 0.7 in a first version, over the 0.1 cap. So the bands may not travel faster than 0.12 half-heights a second at full dose (`BAND_SPEED`), and the cycle speed scales with the number of repeats to keep that. Now 0.065 doublings a second at 0.7.

## Cost

On an Apple M1 Max on Dawn ([docs/studies/epic-3.md](../../../docs/studies/epic-3.md)), 0.1 ms per frame at 1080p for every field: one texture read per pixel, no bloom, and an output pass. In Chrome, 0.68 ms for a frame on a 1920 × 1080 canvas, most of it the browser's timing floor. Tier A. The palette is re-baked on the CPU only when the palette, the `dose` or the exposure changes. Download: 1.7 kB gzipped of its own, 30 kB with the shared chunks.

## Pitfalls

- Luminance contrast is limited, not colour contrast. The pattern analyser sees luminance only, so a palette of equally light, strongly different hues (`one lightness`) passes it however regular the rings. Strongly coloured isoluminant stripes are less studied than luminance stripes, and this is a known gap in the checks, not a finding that they are safe.
- The narrowing is by luminance about the palette's mean. A palette that is all light or all dark keeps its tone; one that spans dark to light is flattened most, and at the default reads as hue on one lightness.
- `full contrast` (`dose` 0.9) goes over the pattern rule and the zoom cap (0.113 doublings a second), and starts behind the gate.

## Safety

Flash `none` at the default and every preset. Pattern `none` up to the strong dose; at `dose` 1 every field fails the rule, as it should. Motion inside the caps up to 0.7.

## When to use it

A loader, a badge, a small section background on a music or festival site: the cheapest moving psychedelic image there is. As a full-page background, prefer the Truchet field, which has no centre to pull the eye.

## CSS

A `repeating-radial-gradient` whose colour stops are animated through a registered custom property does the rings for a few stops, at the price of a style recalculation every frame, and has no Truchet field. It cycles in sRGB unless the gradient is given `in oklch`. Measured against this effect in story 12.4.

## References

- The Hero's Journey [plan.md](../../../plan.md), stories 2.2, 2.3, 3.2 and 3.5.
- Eightfold Path, `palette-cycling`.
- Mark Ferrari's colour-cycling art; Joseph Huckaby's canvas port, _Old School Color Cycling with HTML5_ (2010).
- Iñigo Quílez, [Palettes](https://iquilezles.org/articles/palettes/) (cosine palettes).
