## How it works

One fragment pass (`rosette.wgsl`) into the HDR scene, then the shared tail. Each pixel is folded into one wedge of a dihedral rosette by the symmetry library (`fold.wgsl`, group 18, six mirrors by default), and the wedge holds two octaves of simplex noise drifting slowly outwards. Mirrors meet without a seam, because the folded point is continuous across every mirror.

Colour is set in OKLCH (`oklab.wgsl`): lightness comes from the noise, chroma from `dose`, and only the hue drifts with time, so the picture changes colour without changing brightness much. Each pixel's colour is brought into the sRGB gamut by reducing chroma at fixed lightness and hue, never by clipping channels, and red-capped, so no hue it drifts through can make a red flash (story 2.3).

The noise's lightness range is held down on purpose. A rosette repeats exactly `order` times a turn at every radius, so the pattern check (story 2.2) counts any rosette of six or more mirrors as a radial pattern once its light–dark step reaches 0.1. M0's hello did, over 89% of a 10° field. Up to the strong dose the range is now set so the step on screen stays under 0.09 (`patternStepAt`), and the output skips the tonemap so that is exact. At the default it is a dim, soft rosette. `full contrast` (`dose` 0.9) is the old brightness, and starts behind the gate.

`dose` sets four things together: the turn (0 to 0.12 rad/s, 0.03 at the default), the chroma (0.01 to 0.16, 0.07 at the default), the hue drift (0 to 0.15 rad/s) and the lightness range. Nothing is stored between frames: the picture is a pure function of time, so a held frame and a poster are the same rosette.

## Cost

On an Apple M1 Max on Dawn ([docs/studies/epic-1.md](../../../docs/studies/epic-1.md)): 0.3 to 0.7 ms per frame at 1080p across presets. In Chrome, one frame on a 1920 × 1080 canvas reads 1.37 ms (`npm run browser-check`), up from 0.78 in M0: the red cap is up to 16 more colour conversions a pixel. Tier A on this machine. Bloom is off by default, so the tail is only the output pass. 1.0 kB gzipped of its own, 29 kB with the shared chunks.

Flash `none` at every preset. Pattern `none` up to the strong dose. Motion: 1.7° a second at the default, 4.5° at 0.7. `full contrast` goes over the pattern rule and the 5° turn cap, and is gated.

## Pitfalls

- The colour is additive light on an opaque dark scene: on a light page this is a dark block.
- Held under the pattern step, the default is dim. A brighter rosette that still passes has to be small: under a quarter of a 10° field, about 180 × 135 CSS pixels at typical viewing.
- A hue turned at fixed OKLCH lightness still changes relative luminance a little: by 3.8% of full white at chroma 0.1, at most 9.75% anywhere in sRGB. That is under WCAG's 10% step, and the default chroma (0.07) keeps it far under. A large, bright, saturated area cycling hue has little margin and should use `rotate_hue_at_luminance` (stories 2.3 and 3.1).

## When to use it

As the template for a new effect. As decoration, a calm dark hero where soft slow colour will do; `kaleidoscope` is the one to ship.

## References

- The Hero's Journey [plan.md](../../../plan.md), Epics 1, 3 and 4.
- Björn Ottosson, [A perceptual color space for image processing](https://bottosson.github.io/posts/oklab/) (2020).
