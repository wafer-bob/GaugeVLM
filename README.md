# GaugeVLM Project Page

[Project website](https://wafer-bob.github.io/GaugeVLM/) · [Paper](assets/GaugeVLM.pdf)

The project website for **GaugeVLM: Structuring Spatial Supervision with Measured Geometric Interventions**.

This repository contains the website source and paper display assets only. **The research implementation release is pending.**

The site includes the paper, method overview, interactive spatial and geometric-error demonstrations, benchmark result comparisons, and citation downloads. The demonstrations illustrate the method's concepts; they do not run a vision-language model.

## Local preview

From the repository root, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000). The site is static and requires no build step or package installation.

## GitHub Pages

In the repository's **Settings → Pages**, select **Deploy from a branch**, choose **main** and **/ (root)**, then save. Keep the `assets/` directory and `.nojekyll` file in the repository root alongside `index.html`.

All site assets use relative paths, so the site can be hosted at a repository subpath or a custom domain.

## Files

- `index.html`: page content, authors, navigation, and citation.
- `assets/styles.css`, `assets/labs.css`, `assets/results-interactive.css`: visual design and responsive layouts.
- `assets/site.js`: navigation, figure viewer, and citation controls.
- `assets/geometry.js`, `assets/labs.js`: interactive spatial and error demonstrations.
- `assets/results.js`, `assets/results.csv`: benchmark explorer and downloadable results.
- `assets/GaugeVLM.pdf`, `assets/figures/`, `assets/images/`: manuscript and paper figures.
- `assets/gaugevlm.bib`: downloadable citation.

Results are transcribed from the supplied manuscript; displayed gains are calculated from its rounded scores.

## Citation

The following is a provisional manuscript citation. Update it and `assets/gaugevlm.bib` when the final publication or arXiv record is available.

```bibtex
@misc{wang2026gaugevlm,
  title   = {GaugeVLM: Structuring Spatial Supervision
             with Measured Geometric Interventions},
  author  = {Hongbo Wang and Zihan Lin and Wenkui Yang
             and Yuang Ai and Shiran Ge and Jie Cao
             and Huaibo Huang and Ran He},
  year    = {2026},
  note    = {Preprint}
}
```
