# Cost study: Epic 3

Measured 2026-10-28 on **Metal driver on macOS Version 26.6.2 (Build 25G83)** (unclassified), Dawn (node webgpu bindings).

Method: GPU timestamps: frame span (first pass start to last pass end) and marginal cost per extra frame. 12 warm-up frames, then the median of 11 rounds; each round encodes the frame once and 4 times in one command buffer.

- **span** is one frame alone, first pass start to last pass end. It includes the timing floor of this adapter (the `(floor)` row).
- **per frame** is the cost of one more frame of the same work (the slope). It is the number to compare effects by, and the one the Scorecard shows.
- `(tail)` is the HDR tail alone at its default settings. Every effect below includes it.

Only this adapter was measured. spanMs includes the timing floor (see the "(floor)" rows); slopeMs is the cost of one more frame of the same work and is the number to compare by. A slope at or below zero means the work is below what this method can resolve.

Two limits on reading these numbers. Repeated runs of a light effect differ by up to about half a millisecond (see the Range column), and a GPU's clock follows its load, so a light effect can read slower per unit of work than a heavy one: differences under about half a millisecond mean nothing. And the Tier A and B budgets are set for an integrated GPU; a time measured on a faster one can show an effect is over budget but cannot show that it fits.

## 1920 × 1080

| Effect | Configuration | Passes | Span (ms) | Per frame (ms) | Range (ms) |
| --- | --- | ---: | ---: | ---: | --- |
| (floor) | one constant-colour pass | 1 | 0.07 | 0.07 | 0.04 to 0.70 |
| (tail) | constant scene + bloom + output | 11 | 0.59 | 0.37 | -0.09 to 0.83 |
| chroma-bloom | default | 3 | 1.97 | 1.68 | 1.11 to 2.05 |
| chroma-bloom | preset calm | 3 | 1.51 | 1.46 | 1.38 to 2.32 |
| chroma-bloom | preset against CSS | 3 | 1.38 | 1.49 | 0.81 to 2.05 |
| chroma-bloom | preset painted | 3 | 2.36 | 1.92 | 1.20 to 2.80 |
| chroma-bloom | preset oil sheen | 3 | 2.16 | 1.92 | 1.16 to 2.77 |
| chroma-bloom | preset barely there | 3 | 1.57 | 1.53 | 0.96 to 2.03 |
| hue-cycle | default | 2 | 0.13 | 0.11 | 0.04 to 0.48 |
| hue-cycle | preset rings | 2 | 0.20 | 0.09 | -0.04 to 0.59 |
| hue-cycle | preset rosette | 2 | 0.20 | 0.09 | 0.07 to 0.17 |
| hue-cycle | preset truchet | 2 | 0.20 | 0.11 | -0.17 to 0.52 |
| hue-cycle | preset one lightness | 2 | 0.13 | 0.11 | -0.24 to 0.61 |
| hue-cycle | preset full contrast | 2 | 0.20 | 0.09 | -0.28 to 0.11 |
| chroma-bloom | bleed=0 | 3 | 1.51 | 1.77 | 0.74 to 2.67 |
| chroma-bloom | bleed=0.5 | 3 | 2.49 | 1.97 | 0.76 to 2.38 |
| chroma-bloom | bleed=1 | 3 | 1.64 | 1.57 | 0.72 to 2.23 |
| chroma-bloom | iridescence=1 | 3 | 2.16 | 2.40 | 1.79 to 3.52 |
| chroma-bloom | method=css | 3 | 0.98 | 1.22 | 0.83 to 1.59 |
| chroma-bloom | gamut=p3 | 3 | 2.16 | 1.68 | 1.05 to 2.10 |
| hue-cycle | field=rings | 2 | 0.13 | 0.09 | 0.02 to 0.20 |
| hue-cycle | field=rosette | 2 | 0.13 | 0.11 | 0.02 to 0.66 |
| hue-cycle | field=truchet | 2 | 0.20 | 0.09 | 0.07 to 0.33 |

## 960 × 540

| Effect | Configuration | Passes | Span (ms) | Per frame (ms) | Range (ms) |
| --- | --- | ---: | ---: | ---: | --- |
| (floor) | one constant-colour pass | 1 | 0.07 | 0.07 | -0.15 to 0.52 |
| (tail) | constant scene + bloom + output | 9 | 0.46 | 0.28 | -0.35 to 0.50 |
| chroma-bloom | default | 3 | 0.59 | 0.37 | -0.31 to 1.05 |
| chroma-bloom | preset calm | 3 | 0.52 | 0.39 | 0.07 to 1.16 |
| chroma-bloom | preset against CSS | 3 | 0.46 | 0.37 | 0.02 to 0.76 |
| chroma-bloom | preset painted | 3 | 0.59 | 0.46 | 0.17 to 1.14 |
| chroma-bloom | preset oil sheen | 3 | 0.59 | 0.55 | 0.04 to 1.07 |
| chroma-bloom | preset barely there | 3 | 0.52 | 0.37 | -0.09 to 0.52 |
| hue-cycle | default | 2 | 0.13 | 0.09 | 0.07 to 0.39 |
| hue-cycle | preset rings | 2 | 0.13 | 0.09 | 0.04 to 0.48 |
| hue-cycle | preset rosette | 2 | 0.13 | 0.11 | 0.07 to 0.39 |
| hue-cycle | preset truchet | 2 | 0.13 | 0.11 | 0.07 to 0.70 |
| hue-cycle | preset one lightness | 2 | 0.13 | 0.09 | -0.35 to 0.87 |
| hue-cycle | preset full contrast | 2 | 0.20 | 0.11 | 0.04 to 0.85 |
| chroma-bloom | bleed=0 | 3 | 0.52 | 0.44 | -0.09 to 0.92 |
| chroma-bloom | bleed=0.5 | 3 | 0.52 | 0.55 | 0.15 to 1.03 |
| chroma-bloom | bleed=1 | 3 | 0.66 | 0.46 | -0.11 to 1.11 |
| chroma-bloom | iridescence=1 | 3 | 0.72 | 0.52 | 0.17 to 1.16 |
| chroma-bloom | method=css | 3 | 0.39 | 0.26 | -0.24 to 0.57 |
| chroma-bloom | gamut=p3 | 3 | 0.46 | 0.39 | 0.09 to 1.05 |
| hue-cycle | field=rings | 2 | 0.13 | 0.11 | -0.17 to 0.31 |
| hue-cycle | field=rosette | 2 | 0.13 | 0.09 | -0.22 to 0.11 |
| hue-cycle | field=truchet | 2 | 0.13 | 0.11 | 0.02 to 0.87 |

## Download size

What the page fetches to show the effect, beyond the first-load bundle (7.5 kB gzipped, no shaders).

| Effect | Chunks | Own chunk (kB gzip) | Total (kB gzip) |
| --- | ---: | ---: | ---: |
| chroma-bloom | 16 | 1.1 | 29.8 |
| hue-cycle | 18 | 1.7 | 30.0 |
