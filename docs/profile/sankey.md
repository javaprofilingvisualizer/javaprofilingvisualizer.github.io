# Sankey Diagram

The Sankey diagram shows **how cost flows through call paths**: nodes are stack frames, links carry samples from caller to callee, and link width is proportional to sample volume. Where the treemap answers *which* components are expensive, the Sankey answers *through which paths* they are reached.

<figure class="jpv-figure">
  <img src="/sankey-illustration.png" alt="Sankey diagram: frames as nodes with left-to-right flow ribbons" />
  <figcaption><span class="jpv-fig-label">Figure — Sankey.</span> Samples flow left to right along caller → callee edges; ribbon width tracks sample volume. </figcaption>
</figure>

Built on **D3 v7** as a self-contained HTML template.

## The cycle problem {#cycles}

`d3-sankey` computes a layered left-to-right layout and **rejects cyclic graphs** — but real call graphs are full of cycles: recursion, mutual recursion, callbacks. Back-edges are found with a depth-first traversal (a link into a node still on the current DFS stack closes a cycle), then **unfolded**: instead of deleting the edge, each of its two endpoints gets a dedicated replica, and the edge is rerouted through them.

```
   before (cycle B → C → B):     after unfolding:
        B ──▶ C                 C'──▶ B ──▶ C ──▶ B′
        ▲     │                    
        └─────┘                   
```

At most **two replicas exist per node** — one for the *source* side of a back-edge, one for the *target* side — reused across every back-edge touching that node in that role. A source-side replica only ever has outgoing links and a target-side replica only ever has incoming ones, so neither can itself close a cycle, even when the same node is both the source of one back-edge and the target of another.

## Terminal samples: self-time nodes

The graph materializes terminal samples explicitly: every node with samples
of its own (the frame was at the top of the stack) is given a **synthetic
terminal node**, carrying the same displayed name as its parent and linked
to it by a flow equal to its self-sample count. Because these terminal
nodes have no outgoing link, `d3-sankey`'s default layout pushes them to the
**far right** of the diagram, isolating terminal consumption so it stays
visible instead of being lost among the call flows — rendered as a narrow,
solid bar (see the legend) to stay visually distinct from a node's relayed
flow. A node folded by low-flow grouping (below) keeps its own aggregated
self-time bar rather than losing it.

## Interactive filters

Dense traces produce unreadable diagrams; four controls restore legibility:

| Control | Effect |
|---|---|
| **Granularity** | Switch between **package** view and **class** view |
| **Package depth** | Truncate names to their first *k* package segments, merging all nodes and links sharing the truncated prefix |
| **Minimum link threshold** | Hide links below a sample-count floor |
| **Low-flow grouping** | Nodes whose total flow (in + out) falls below the threshold are folded into a per-root aggregate node |

plus **focus mode** (click a node to isolate its upstream/downstream paths), **drag-and-drop** node repositioning, and tooltips with exact sample counts.