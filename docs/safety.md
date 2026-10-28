# Safety: the hazards of psychedelic visuals

Story 2.1. Psychedelic imagery is built from the things photosensitivity guidance warns about:
- high-contrast regular patterns;
- saturated colour changing fast;
- the whole field rotating or zooming.

This page sets out each hazard, what the guidance says, and the rule this site checks it with. It is written before the pattern-heavy effects, so the rules are not tuned to pass them.

**What the checks are not.** They approximate published guidance. They are not certification. The reference analyser for broadcast, Harding's, is proprietary, and there is no open reference implementation of pattern analysis to compare against. A pass here means "under the thresholds as we measure them", not "safe for everyone". People with photosensitive epilepsy, migraine or vestibular disorders vary, and the site's defaults sit well under every threshold for that reason.

M0 wrote the thresholds below from memory of the sources. M1 checked the pattern rule against the source text it could reach and corrected it (section 2); the motion caps have no published numbers to check against and remain this site's own starting values.

## 1. Flashes

**Guidance.** WCAG 2.3.1, _Three Flashes or Below Threshold_: nothing flashes more than three times in any one second, unless the flash is below the general and red flash thresholds.
- **A general flash** is a pair of opposing changes in relative luminance of 10% or more of the maximum, where the darker state is below 0.8. It counts only when the flashing area exceeds a quarter of any 10° field of view, which WCAG takes as 341 × 256 px at typical viewing.
- **A red flash** is a pair of opposing transitions involving a saturated red, R / (R + G + B) ≥ 0.8.

**Our check.** Already in the shell (`tests/flash.ts`, from Fire and Storm Temple). It renders every effect and preset on Dawn for seconds at 60 fps, follows each cell's mean luminance and red signal, and counts flashes per cell and over the frame. It fails a preset that measures over the threshold unless the scorecard declares it.

**This family's cases:**
- Hue cycling at constant lightness makes no luminance flash, but can make a red flash as it passes through saturated red.
- Beat-driven pulses in a visualiser (10.7).
- A feedback loop running away to white (5.6).
- Strobe, which is not built (plan, Non-goals).

**Lesson carried over.** An envelope that dips for a frame between two phases is a second flash. Storm Temple's strike pulse did this. So pulsing and breathing envelopes are tested at many frame phases, not only on whole frames.

## 2. Patterns

**Guidance.** Regular patterns can trigger seizures in pattern-sensitive people without anything flashing. Harding and Jeavons describe the sensitivity clinically; Wilkins adds that discomfort peaks for stripes at about 3 cycles per degree, and rises with contrast and the number of stripes, even for people with no epilepsy.

The numbers come from the ITC's _Guidance Note for Licensees on Flashing Images and Regular Patterns in Television_ (now Ofcom's), as the WCAG working group converted it for screens in a 2004 draft of guideline 2.3 (the pattern rule did not survive into WCAG 2.0):
- **Clearly discernible stripes:** the darker bars below 160 cd/m², differing from the lighter bars by 20 cd/m² or more. In relative luminance, as WCAG's flash thresholds convert the same figures: darker below 0.8, a step of 0.1.
- **Number:** more than five light–dark pairs, in any orientation. The ITC note counts radial and curved stripes, and rows of repetitive elements such as polka dots.
- **Area:** more than 40% of any 355 × 268 pixel rectangle (a 10° field) for a stationary pattern; more than 25% for one that changes direction, oscillates, flashes or reverses in contrast.

M0's version of this rule, written from memory, asked for a Michelson contrast above 0.5 and measured area against the whole frame. Both were wrong, and M1's first analyser copied them. The two contrast rules disagree both ways: a dim pattern on black has a Michelson contrast near 1 but a small step, and a bright pattern of middling contrast has a large step. A 10° field is about a twentieth of a 1080p view, so the area rule is far stricter than M0's. The sources were reached second-hand: Ofcom's own PDF refused the fetch, so the wording above is the 2004 W3C draft's quotation of it. It should be checked against Ofcom's current text before it is relied on.

**Our check (story 2.2, `src/gpu/safety/pattern.ts`).** Rendered frames go through three analyses, and their counted pixels are measured against the area rule:
- **Windows:** 32 × 32 windows at three scales, Fourier transformed. A window is regular when its two strongest peaks hold 60% of its energy. Neighbouring regular windows that agree on period and direction form a region, and the region's extent along the stripes over their period is its number of pairs.
- **Log-polar windows** about the centre, which see rings, spokes and spirals as straight stripes. The map is conformal, so its windows are not stretched. An equal-angle, equal-radius map was tried first: it stretched windows into lines and read noise as regular.
- **Whole rings** of the log-polar plane, for spokes and petals that repeat fewer times a turn than a window can see. A band of at least six rings with the same angular frequency (more than five) counts.

The regularity threshold, 0.6, was set from synthetic cases before any effect was measured against it. Gratings read 0.82 to 1, a checkerboard 0.70 and a dartboard 0.67. Two isolated blobs read 0.41 and white noise 0.09. `tests/pattern.test.ts` holds the cases: gratings, checks, rings, six and twenty-four spokes, a dartboard, a spiral and an eight-petal rosette must fail. Value and spectral noise, a soft rosette, a step under 0.1, light bars above 0.8, five spokes, three pairs and scattered blobs must pass.

**What it found.** Every rosette in the family failed at first. A dihedral rosette repeats exactly `order` times a turn at every radius, so with six or more mirrors and a step over 0.1 it is a radial pattern of more than five pairs, and at hero size it fills far more than a quarter of a 10° field. `hello` and `kaleidoscope` at their M0 defaults, and `hue-cycle`'s rings, all counted. So an effect whose image is a pattern by construction holds its luminance step under 90% of the rule's step up to the strong dose (`patternStepAt`): 0.045 at the default, 0.09 at 0.7. Each such effect draws without a tonemap, so the step it sets is the step on screen. A full-contrast rosette is a preset past the strong dose, declared in `scorecard.patternPresets`, and starts behind the gate.

**Known gaps.**
- Luminance only: an isoluminant colour grating passes.
- Dot lattices read 0.42 to 0.55 for regularity, between blobs and stripes, so they are not flagged, though the ITC note counts rows of dots.
- Spokes are found about the frame's centre only.
- A pattern near the threshold is found in some frames and not others. The test samples two frames a second for three seconds, and the experiments sample more densely.

## 3. Colour change

**Guidance.** WCAG's red flash, above. Saturated red alternating with another saturated colour counts even at constant luminance.

**What story 3.1 found, corrected in M1.** A hue turned at fixed OKLCH lightness keeps perceived lightness, not relative luminance: luminance moves by about 110% of the chroma _as a share of its mean_ (11% at L 0.7, chroma 0.1). M0 read that against WCAG's 10%, which is a step of a tenth of full white, not a share. In absolute terms the swing is much smaller: 3.8% at L 0.7, chroma 0.1, and at most 9.75% anywhere in the sRGB gamut (L 0.85, chroma 0.3). So hue turning alone does not make a general flash in sRGB, though at high lightness and chroma it has little margin.

**Our caps (story 2.3, `src/gpu/safety/colour-caps.ts` and `colour-caps.wgsl`).**
- **Red, by construction.** Every animated colour goes through `capRed`, which takes chroma away at fixed lightness and hue until R / (R + G + B) is at most 0.75. WCAG's red flash needs 0.8, so a capped colour cannot take part in one at any hue speed. That is a stronger guarantee than a speed limit near red. On a P3 canvas the red share is still taken in sRGB primaries, which caps reds beyond sRGB.
- **Luminance.** Under chroma 0.08, a full hue turn at fixed lightness moves luminance by under 5%, half the flash step, at every lightness. Above it, hue should turn at fixed luminance (`rotateHueAtLuminance`).
- **Speed.** A whole field's hue turns at most 0.5 times a second (`HUE_SAFE_MAX_SPEED`). A back-and-forth wobble is band limited like Fire Temple's flicker, at most four reversals a second (`hueAt`).

`tests/colour-caps.test.ts` runs the worst settings the caps allow as a full-screen colour through the flash analyser, for eight seeds at several lightnesses and luminances: no red flash, never `high`. The same field uncapped, four times as fast, fails, so the test can see what it guards against. Palettes are held to the same caps (story 3.2): every texel is red-capped, and a palette cycles no faster than its own lightness flashes allow (at most two a second over a large area, `safePaletteSpeed`).

## 4. Motion

**Guidance.** WCAG 2.3.3, _Animation from Interactions_: motion triggered by interaction can be turned off. `prefers-reduced-motion` is the browser's version. The motions most reported as triggering vestibular symptoms are large-scale ones: a whole background rotating, zooming, or moving in parallax against the page. No source gives numbers, so the caps are this site's own.

**Our check (story 2.4, `src/gpu/safety/motion.ts`).** Two frames a sixth of a second apart are cut into 16-pixel blocks. Each block is found again by the smallest sum of squared differences, to a fraction of a pixel. The block motions are fitted by least squares, with outliers dropped, to one turn, zoom and drift about the centre. On synthetic frames moved by known amounts it recovers each within 10%. On the effects it agrees with their own transforms: `hello` turns at 1.7° a second, `kaleidoscope` at 2.3°.

| Motion               | Cap                         | Measured at the default (and at `dose` 0.7) |
| -------------------- | --------------------------- | ------------------------------------------- |
| Whole-field rotation | 5° a second                 | `hello` 1.7 (4.5), `kaleidoscope` 2.4 (4.8) |
| Whole-field zoom     | 0.1 doublings a second      | `hue-cycle` rings 0.02 (0.065)              |
| Whole-field drift    | 0.05 screen widths a second | under 0.02 everywhere                       |

**What it found.** Apparent motion counts. Cycling a palette through rings moves no pixel, but the rings appear to expand, and the check read 0.113 zoom doublings a second at `dose` 0.7. A viewer's vestibular system reads the same thing. `hue-cycle` now limits how fast its bands may appear to travel. The kaleidoscope's full-dose spin was also lowered, so that the caps hold up to the strong dose and not just at the default.

**Motion aftereffect.** After watching a spiral turn, or a tunnel flow, the still page appears to move the other way: the waterfall illusion, and Plateau's spiral. A sudden halt makes it worse. So a stop the visitor asks for (the motion switch, or `pause()`) eases to a halt over 1.2 seconds (`EASE_OUT_SECONDS`, `src/lib/host.ts`). A stop for reduced motion, a hidden page or an effect out of view is immediate. This is a design rule: no analyser measures perception.

## 5. `dose`, the gate and the held frame

- **`dose`** (story 2.5, `src/gpu/safety/dose.ts`) is one 0-to-1 control on every effect. Each effect maps it onto its own amplitudes with `dosed(dose, still, calm, full)`. Every analyser and cap must hold from 0 up to the strong dose, 0.7, not only at the default. A visitor can drag the slider that far without warning, so `tests/flash.test.ts`, `pattern.test.ts` and `motion.test.ts` check each effect at its default and at 0.7.
- **The gate** (story 2.6, `src/gpu/safety/gate.ts`, `src/shell/gate.ts`). A preset declared over the flash, pattern or motion limit, or one past the strong dose, starts paused behind a click-to-start notice that says what to expect. That applies to a link to it as well as to choosing it in the controls. Nothing starts on its own. The notice offers the calm defaults instead, and a start is remembered for the browser session only. Dragging the slider is the visitor's own choice and is not gated.
- **The held frame.** A paused effect shows one frame for as long as the visitor looks. It draws at no more than the default dose (`heldDose`), behind the gate too. `tests/still.test.ts` checks that every held frame, every preset's included, passes the pattern rule on its own, has something to see, and is no brighter than the effect ever plays.

## Sources

- W3C, _Web Content Accessibility Guidelines 2.2_: 2.3.1 and its understanding document (general and red flash thresholds), 2.3.3 _Animation from Interactions_.
- ITU-R Recommendation BT.1702, _Guidance for the reduction of photosensitive epileptic seizures caused by television_.
- ITC, _Guidance Note for Licensees on Flashing Images and Regular Patterns in Television_ (revised 2001), now Ofcom's: [gn_flash.pdf](https://www.ofcom.org.uk/__data/assets/pdf_file/0021/16248/gn_flash.pdf). Quoted for screens in the W3C WCAG working group's draft of guideline 2.3, 24 February 2004: [lists.w3.org](https://lists.w3.org/Archives/Public/w3c-wai-gl/2004JanMar/0346.html).
- Graham Harding and Peter Jeavons, _Photosensitive Epilepsy_ (Mac Keith Press).
- Arnold Wilkins, _Visual Stress_ (Oxford University Press, 1995).
- On the motion aftereffect: George Mather, Frans Verstraten and Stuart Anstis (eds.), _The Motion Aftereffect: A Modern Perspective_ (MIT Press, 1998).
