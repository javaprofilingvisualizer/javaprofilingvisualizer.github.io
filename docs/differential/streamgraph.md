# Streamgraph Visualization

The streamgraph represents the differential view: **one band per class** (or package, or method), the horizontal axis is the version sequence, and band thickness at each version is that entity's cost. Widening bands are regressions, while narrowing bands are improvements. 

<figure class="jpv-figure">
  <img src="/streamgraph-illustration.png" alt="Streamgraph: stacked silhouette bands across versions" />
  <figcaption><span class="jpv-fig-label">Figure — Streamgraph.</span> Each band is one class tracked across versions. Band thickness is its cost : widening signals a regression, narrowing an improvement.</figcaption>
</figure>

Built on **D3 v7** as a self-contained HTML template.

## Two units: Time vs Samples

A toggle switches the vertical unit:

| Mode | Value shown | Valid comparison |
|---|---|---|
| **Time** | $\tau = \frac{s}{N}\times T$ — ms per operation | **across versions** |
| **Samples** | raw sample proportions | within one version only |

 Raw samples are proxies for proportions *within* a version only; comparing them across versions is meaningless when total run time differs. Full derivation: [Temporal Weighting](/methodology/temporal-weighting).

## Granularity

Three aggregation levels: **package**, **class** and **method**.

## Interaction

- **Focus mode** — click a band to isolate it and see the evolution in consumption of that particular node;
- **Tooltips** — they show the full name history (so renames stay visible), the raw samples and the τ value;
- **Labels** — positioned at each band's **thickest point**;
- **Filter panel** — controls the granularity and groups small bands.
