<div align="center">

<img src=".github/assets/readme-header.svg" alt="GaugeVLM: Structuring Spatial Supervision with Measured Geometric Interventions" width="100%">

<br>

**Hongbo Wang · Zihan Lin · Wenkui Yang · Yuang Ai**<br>
**Shiran Ge · Jie Cao · Huaibo Huang · Ran He**

Institute of Automation, Chinese Academy of Sciences · UCAS<br>
The Chinese University of Hong Kong

<a href="https://wafer-bob.github.io/GaugeVLM/"><img src=".github/assets/project-page.svg" alt="Project Page" height="40"></a>
&nbsp;
<a href="https://wafer-bob.github.io/GaugeVLM/assets/GaugeVLM.pdf"><img src=".github/assets/paper.svg" alt="Read the paper PDF" height="40"></a>
&nbsp;
<img src=".github/assets/code-soon.svg" alt="Research code coming soon" height="40">

<br><br>

**Measured errors. Shared truths. Better spatial reasoning.**

</div>

GaugeVLM teaches vision-language models to **measure spatial errors**, **stay correct across camera views**, and **respond to geometric changes**. It makes spatial supervision explicit through controlled object and camera interventions in 3D scenes.

<p align="center">
  <a href="https://wafer-bob.github.io/GaugeVLM/">
    <img src="assets/images/teaser.webp" alt="GaugeVLM overview: measured errors in street scenes, consistent spatial relations across views, and spatial benchmark gains." width="100%">
  </a>
</p>

<p align="center"><a href="https://wafer-bob.github.io/GaugeVLM/#playground"><strong>Explore the interactive demo →</strong></a></p>

## Highlights

<img src=".github/assets/highlights.svg" alt="+15.0 pp MSMU distance and +18.9 pp QSpatial+ over GaugeSFT on Qwen2.5-VL-7B; all 30 spatial metric/backbone comparisons improve." width="100%">

- **GaugeDPO** combines measured preference margins, direct supervision of correct relations across views, and intervention-based constraints.
- **Gauge-50K** contains **50,436 spatial preference pairs** across five task families, with 30,000 pairs in the training pool.
- **Constancy-Bench** evaluates distance ranking, photometric consistency at a fixed camera, and correct responses to object relocation.

## Method

<img src="assets/images/pipeline.webp" alt="GaugeDPO pipeline: measured preference margins, correct canonical rankings across views, and intervention profiles." width="100%">

**Measure the error.** Convert geometric distance and direction errors into preference margins.<br>
**Preserve the truth.** Rank the correct canonical relation above incorrect candidates in each view.<br>
**Learn the change.** Connect intervention-induced answer-odds contrasts to measured relation changes.

## Citation

If you find GaugeVLM useful for your research, please consider citing our work.

<details>
<summary>BibTeX</summary>

```bibtex
@misc{wang2026gaugevlm,
  title   = {GaugeVLM: Structuring Spatial Supervision
             with Measured Geometric Interventions},
  author  = {Hongbo Wang and Zihan Lin and Wenkui Yang
             and Yuang Ai and Shiran Ge and Jie Cao
             and Huaibo Huang and Ran He},
  year    = {2026},
  url     = {https://github.com/wafer-bob/GaugeVLM},
  note    = {Preprint}
}
```

</details>
