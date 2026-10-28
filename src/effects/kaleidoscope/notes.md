## How it works

Two passes, then the shared tail. A real kaleidoscope has two parts: an object cell of coloured glass, and mirrors that repeat it. This one has both.

1. **The object cell** (`glass.wgsl`): eleven soft beads with brighter rims and five thin curved shards drift over a dark ground. They are drawn into a 512 × 512 `rgba16float` texture every frame, which is then mipmapped. Their colours are chosen on the CPU in OKLCH (`oklab.ts`): golden-angle hues, chroma from `dose`, and gamut-mapped there, so the shader only places them.
2. **The mirrors** (`mirror.wgsl`): every pixel is folded into the fundamental domain of a reflection group (`fold.wgsl`) and reads the cell at that point. The cell is sampled with mirror-repeat addressing, so the domain may run off the cell's edge without a seam. The whole picture turns slowly, and the domain wanders over the cell, as when a kaleidoscope's tube is turned.

The mirror arrangements are the ones a real kaleidoscope can have:

- **Rosette:** two mirrors at 180°/n, the dihedral group Dn.
- **The four mirror shapes that tile the plane:** a square (pmm, *2222), and the 45-45-90 (p4m, *442), 60-60-60 (p3m1, *333) and 30-60-90 (p6m, *632) triangles.

These are the only groups offered, for a reason worth knowing: folding an arbitrary motif is seamless only when every edge of the fundamental domain is a mirror. In any other wallpaper group, some edge is a turn, a glide or a translation, and there an unsymmetric motif jumps. Those groups are for story 4.3's lab, with motifs made for them.

`dose` sets the turn (0 to 0.12 rad/s, 0.04 at the default), how far the domain wanders over the cell, how fast the glass drifts, and how fast its hues drift. Chroma comes from `dose` too (0.02 to 0.2, 0.11 at the default), and so does how bright the glass is against its ground.

**Why the default glass is dim.** A kaleidoscope is the archetypal regular pattern, and the pattern check (story 2.2) says so. With six or more mirrors, the rosette repeats the same number of times a turn at every radius. With beads at full brightness on a dark ground, M0's default failed the guidance's rule in every run: a radial pattern of six pairs over 68% of a 10° field, turning, against a limit of 25%. So up to the strong dose, each bead's and shard's luminance is placed within a step of the ground (`patternStepAt`, under 0.09 on screen at 0.7, 0.045 at the default), with its lightness solved for that luminance and its chroma kept. The output skips the tonemap so the step is exact. The default is deep, dim stained glass on a plum ground. `bright glass` (`dose` 0.9) is the old brightness, and starts behind the gate.

## Cost

On an Apple M1 Max on Dawn ([docs/studies/epic-4.md](../../../docs/studies/epic-4.md)): 1.1 to 1.3 ms per frame at 1080p for every arrangement, and 0.6 to 0.9 ms at 960 × 540, the tail included (0.44 ms alone). In Chrome, one frame on a 1920 × 1080 canvas reads 1.74 ms (1.50 to 1.74 over three loads, `npm run browser-check`): inside Tier A's 2 ms on this machine, with less to spare than in M0 (1.56 ms), since every bead's colour is now red-capped and solved for its luminance on the CPU. The number of rosette mirrors makes no difference: 3, 6, 12 and 24 all measure 1.05 to 1.27 ms, within noise. The fold is close to free, and the cost is the cell, its mips and the tail. Texture memory: 2.8 MB for the cell and its mips, plus the tail. 3.2 kB gzipped of its own, 33 kB with the shared chunks.

Flash `low` (single transitions in single cells). Pattern `none` up to the strong dose; `bright glass` and the rosette at `dose` 1 fail it. Motion: 2.4° a second at the default, 4.8° at 0.7. `bright glass` goes over the pattern rule and the 5° turn cap, and is gated.

## Pitfalls

- **Seams and mip levels.** Measured in `tests/fold-seams.test.ts`: mirrors need no special sampling, because a reflection keeps a derivative's length and the GPU picks the same mip level on both sides. Where the folded coordinate jumps (a translation wrap or a turn, in the non-reflection groups), the GPU differentiates across the jump and samples the coarsest mip, which draws a grey line along the edge. The error there was 0.22 with the hardware's derivatives against 0.004 with the fold's Jacobian. This effect samples with the Jacobian anyway (`textureSampleGrad`), which costs nothing.
- **A rosette's wedge is thin.** Six mirrors show a 30° sliver of the cell. If the sliver sits at the cell's centre it sees little glass, so the wedge's middle is placed on the cell's centre instead.
- **Light pages.** The glass is lit on black, as a kaleidoscope is held up to light; on a light page it is a dark block.

## When to use it

As a hero or section background on a music, festival or art site, at the default `dose`, behind text on a plate. Tier A on the development machine, provisional until the device matrix (story 12.2).

For 6 to 12 wedges of flat colour, a CSS conic gradient repeated by rotation comes close for almost nothing. It has no mirror, so each wedge is a copy, not a reflection, and the glass cannot move between wedges.

## References

- John H. Conway, Heidi Burgiel and Chaim Goodman-Strauss, _The Symmetries of Things_ (A K Peters, 2008): orbifold notation, and why the reflection groups are the kaleidoscopes.
- David Brewster, _A Treatise on the Kaleidoscope_ (1819): the instrument, and why only mirror angles of 180°/n give a closed picture.
- The Hero's Journey [plan.md](../../../plan.md), Epic 4.
