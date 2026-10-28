# Safety: the hazards of psychedelic visuals

Story 2.1. Psychedelic imagery is built from the things photosensitivity guidance warns about:
- high-contrast regular patterns;
- saturated colour changing fast;
- the whole field rotating or zooming.

This page sets out each hazard, what the guidance says, and the rule this site checks it with. It is written before the pattern-heavy effects, so the rules are not tuned to pass them.

**What the checks are not.** They approximate published guidance. They are not certification. The reference analyser for broadcast, Harding's, is proprietary, and there is no open reference implementation of pattern analysis to compare against. A pass here means "under the thresholds as we measure them", not "safe for everyone". People with photosensitive epilepsy, migraine or vestibular disorders vary, and the site's defaults sit well under every threshold for that reason.

The thresholds below are from memory of the sources listed at the end, as the plan warns. Each number is to be confirmed against the source's own text when its story is built (2.2 to 2.4), and corrected here if it differs.

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

**Guidance.** Regular patterns can trigger seizures in pattern-sensitive people without anything flashing. Ofcom's guidance and ITU-R BT.1702 treat as potentially harmful a regular pattern of clearly discernible stripes, with these factors:
- **Number:** more than about five light–dark pairs, in any orientation.
- **Contrast:** high.
- **Area:** a large share of the screen, about a quarter.
- **Motion:** worse when the pattern drifts, flickers, reverses or changes direction.

Harding and Jeavons describe the same sensitivity clinically. Checks, dartboards and spirals are stripes in other coordinates.

Wilkins' work on visual stress adds two things. Discomfort peaks for stripes at about 3 cycles per degree. And it rises with contrast and with the number of stripes, even for people with no epilepsy.

**Our rule (story 2.2), starting values:**
- **What it flags:** a region whose dominant spatial frequency is regular (a narrow peak in a local Fourier or Gabor analysis), where:
  - Michelson contrast is above 0.5;
  - there are more than five light–dark pairs across the region;
  - the region covers more than 25% of the frame.
- **Moving patterns:** a region moving or changing counts at half that area.
- **Polar patterns:** spirals, pinwheels and rings, the form constants, are measured in polar as well as Cartesian frequency.
- **Results:** defaults must pass. Presets that fail are declared in `scorecard.patternPresets` and start behind the gate (2.6).

**This family's cases:**
- Form constants: tunnels, spirals, lattices and cobwebs (Epic 6).
- High-order rosettes at full contrast.
- Op-art moiré.
- Kaleidoscopes of high-contrast motifs.

The current effects (`hello`, `kaleidoscope`) draw soft, low-contrast fields and are unlikely to trip the rule. It will be run over them once it exists.

## 3. Colour change

**Guidance.** WCAG's red flash, above. Saturated red alternating with another saturated colour counts even at constant luminance.

**Our rule (story 2.3).** A cap on hue speed in turns per second, as a function of chroma, tighter where the hue passes through red, with a band limit like Fire Temple's `flicker.wgsl`. Both get TypeScript twins, and a seeded test that the worst allowed settings stay under three red flashes a second.

**What story 3.1 found.** A hue turned at fixed OKLCH lightness keeps perceived lightness, not relative luminance. Luminance moves by about 110% of the chroma over a turn (11% at chroma 0.1). That is close to WCAG's 10% step at the chroma this family uses, so a large area cycling hue uses `rotateHueAtLuminance`, which holds relative luminance exactly (`src/gpu/colour/oklab.ts`).

## 4. Motion

**Guidance.** WCAG 2.3.3, _Animation from Interactions_: motion triggered by interaction can be turned off. `prefers-reduced-motion` is the browser's version. The motions most reported as triggering vestibular symptoms are large-scale ones: a whole background rotating, zooming, or moving in parallax against the page.

**Our rule (story 2.4), starting values for the default `dose`:**

| Motion                 | Starting cap                   | Current effects at their default              |
| ---------------------- | ------------------------------ | --------------------------------------------- |
| Whole-field rotation   | 5° a second                    | `hello` 1.7°/s, `kaleidoscope` 2.3°/s         |
| Whole-field zoom       | 0.1 doublings a second         | none zoom                                     |
| Whole-field drift      | 0.05 screen widths a second    | `kaleidoscope`'s domain drifts over its cell; measured in 2.4 |

Under `prefers-reduced-motion` every effect holds still. The shell pauses the frame loop, and the held frame is a calm moment (`tests/still.test.ts`).

**Motion aftereffect.** After watching a spiral turn, or a tunnel flow, the still page appears to move the other way: the waterfall illusion, and Plateau's spiral. A sudden halt makes it worse. So spirals and tunnels ease to a stop over a second or more. This is a design rule: no analyser measures perception.

## 5. `dose`, the gate and the held frame

- **`dose`** (story 2.5, `src/gpu/safety/dose.ts`) is one 0-to-1 control on every effect. Each effect maps it onto its own amplitudes with `dosed(dose, still, calm, full)`. The default, 0.35, must pass every check. `tests/dose.test.ts` checks every effect has the control at that default.
- **The gate** (story 2.6). Until it exists, no preset may set `dose` above 0.7, the strong end (`tests/dose.test.ts`). Once it exists, presets over a cap start paused, behind a click-to-start notice that says what to expect.
- **The held frame.** A paused effect shows one frame for as long as the visitor looks. It must be calm, never the peak of a pattern.

## Sources

- W3C, _Web Content Accessibility Guidelines 2.2_: 2.3.1 and its understanding document (general and red flash thresholds), 2.3.3 _Animation from Interactions_.
- ITU-R Recommendation BT.1702, _Guidance for the reduction of photosensitive epileptic seizures caused by television_.
- Ofcom, _Guidance Note on Flashing Images and Regular Patterns in Television_ (the Broadcasting Code's guidance, section 2).
- Graham Harding and Peter Jeavons, _Photosensitive Epilepsy_ (Mac Keith Press).
- Arnold Wilkins, _Visual Stress_ (Oxford University Press, 1995).
- On the motion aftereffect: George Mather, Frans Verstraten and Stuart Anstis (eds.), _The Motion Aftereffect: A Modern Perspective_ (MIT Press, 1998).
