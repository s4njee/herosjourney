## How it works

One fragment pass (`rosette.wgsl`) into the HDR scene, then the shared tail. Each pixel is folded into one wedge of a dihedral rosette by the symmetry library (`fold.wgsl`, group 18, six mirrors by default), and the wedge holds two octaves of simplex noise drifting slowly outwards. Mirrors meet without a seam, because the folded point is continuous across every mirror.

Colour is set in OKLCH (`oklab.wgsl`): lightness comes from the noise, chroma from `dose`, and only the hue drifts with time, so the picture changes colour without changing brightness much. Each pixel's colour is brought into the sRGB gamut by reducing chroma at fixed lightness and hue, never by clipping channels.

`dose` sets three things together: the turn (0 to 0.12 rad/s, 0.03 at the default), the chroma (0.01 to 0.16, 0.07 at the default) and the hue drift (0 to 0.15 rad/s). Nothing is stored between frames: the picture is a pure function of time, so a held frame and a poster are the same rosette.

## Cost

On an Apple M1 Max on Dawn ([docs/studies/epic-1.md](../../../docs/studies/epic-1.md)): 0.3 to 0.7 ms per frame at 1080p across presets, against 0.5 ms for the HDR tail alone. In Chrome, one frame on a 1920 × 1080 canvas reads 0.78 ms (`npm run browser-check`): Tier A on this machine. Bloom is off by default, so the tail is only the output pass. 0.9 kB gzipped of its own, 23 kB with the shared chunks.

Flash: `none` at every preset (the frame's mean luminance moves by under 1%). At `dose` 1 it is `low`, with one red flash in one cell.

## Pitfalls

- The colour is additive light on an opaque dark scene: on a light page this is a dark block.
- A hue turned at fixed OKLCH lightness still changes relative luminance, by about 110% of the chroma (11% at chroma 0.1). The default chroma keeps that small. A large area cycling a saturated hue should use `rotate_hue_at_luminance` (story 3.1).

## When to use it

As the template for a new effect. As decoration, a calm dark hero where soft slow colour will do; `kaleidoscope` is the one to ship.

## References

- The Hero's Journey [plan.md](../../../plan.md), Epics 1, 3 and 4.
- Björn Ottosson, [A perceptual color space for image processing](https://bottosson.github.io/posts/oklab/) (2020).
