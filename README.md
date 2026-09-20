<div align="center">

# GaugeVLM

### Structuring Spatial Supervision with Measured Geometric Interventions

Hongbo Wang · Zihan Lin · Wenkui Yang · Yuang Ai<br>
Shiran Ge · Jie Cao · Huaibo Huang · Ran He

**[Project Homepage](https://wafer-bob.github.io/GaugeVLM/) · [Paper](assets/GaugeVLM.pdf)**

Research code coming soon.

</div>

<br>

[![GaugeVLM: measured spatial errors, consistent relations across views, and controlled geometric interventions.](assets/images/teaser.webp)](https://wafer-bob.github.io/GaugeVLM/)

## Overview

**GaugeVLM** improves spatial reasoning in vision-language models by making geometric structure explicit in supervision. Controlled object and camera interventions produce linked observations with measured errors, shared spatial truths across views, and known changes in object relations.

Its learning objective, **GaugeDPO**, combines measured preference margins, direct supervision of correct relations across views, and intervention-based constraints. GaugeVLM improves all 10 established spatial metrics over supervised fine-tuning across three model backbones. On Qwen2.5-VL-7B, it improves MSMU distance by **15.0 percentage points** and QSpatial+ by **18.9 percentage points** over GaugeSFT.

Visit the **[project homepage](https://wafer-bob.github.io/GaugeVLM/)** for the method, interactive illustrations, and results.

## Code

The research implementation is being prepared for release. Updates will be posted here.

## Citation

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
