# Cost study: Epic 4

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
| (floor) | one constant-colour pass | 1 | 0.07 | 0.04 | -0.31 to 0.28 |
| (tail) | constant scene + bloom + output | 11 | 0.59 | 0.44 | -0.57 to 0.92 |
| kaleidoscope | default | 12 | 0.85 | 1.27 | 1.18 to 1.81 |
| kaleidoscope | preset rosette | 12 | 0.85 | 1.22 | 0.48 to 1.94 |
| kaleidoscope | preset square mirrors | 12 | 0.85 | 1.14 | 0.26 to 1.92 |
| kaleidoscope | preset triangle of 60° | 12 | 0.79 | 1.20 | 1.03 to 1.57 |
| kaleidoscope | preset thirty-sixty-ninety | 12 | 0.85 | 1.22 | 1.09 to 1.70 |
| kaleidoscope | preset eight mirrors, slow | 12 | 0.85 | 1.09 | 0.66 to 1.99 |
| kaleidoscope | order=3 | 12 | 1.44 | 1.05 | 0.79 to 1.79 |
| kaleidoscope | order=6 | 12 | 0.85 | 1.18 | 0.87 to 1.73 |
| kaleidoscope | order=12 | 12 | 1.11 | 1.16 | 0.42 to 1.57 |
| kaleidoscope | order=24 | 12 | 0.85 | 1.27 | 0.44 to 1.66 |

## 960 × 540

| Effect | Configuration | Passes | Span (ms) | Per frame (ms) | Range (ms) |
| --- | --- | ---: | ---: | ---: | --- |
| (floor) | one constant-colour pass | 1 | 0.07 | 0.07 | -0.31 to 0.15 |
| (tail) | constant scene + bloom + output | 9 | 0.39 | 0.37 | -0.66 to 0.63 |
| kaleidoscope | default | 10 | 0.79 | 0.70 | 0.28 to 0.94 |
| kaleidoscope | preset rosette | 10 | 0.98 | 0.66 | 0.46 to 1.09 |
| kaleidoscope | preset square mirrors | 10 | 0.72 | 0.92 | 0.72 to 1.62 |
| kaleidoscope | preset triangle of 60° | 10 | 0.98 | 0.63 | 0.11 to 0.92 |
| kaleidoscope | preset thirty-sixty-ninety | 10 | 1.25 | 0.76 | 0.20 to 1.00 |
| kaleidoscope | preset eight mirrors, slow | 10 | 1.18 | 0.55 | 0.24 to 1.40 |
| kaleidoscope | order=3 | 10 | 1.31 | 0.68 | 0.24 to 0.98 |
| kaleidoscope | order=6 | 10 | 1.70 | 0.63 | -0.02 to 0.96 |
| kaleidoscope | order=12 | 10 | 1.44 | 0.70 | 0.13 to 1.18 |
| kaleidoscope | order=24 | 10 | 0.92 | 0.72 | 0.31 to 0.98 |

## Download size

What the page fetches to show the effect, beyond the first-load bundle (6.5 kB gzipped, no shaders).

| Effect | Chunks | Own chunk (kB gzip) | Total (kB gzip) |
| --- | ---: | ---: | ---: |
| kaleidoscope | 11 | 3.6 | 25.1 |
