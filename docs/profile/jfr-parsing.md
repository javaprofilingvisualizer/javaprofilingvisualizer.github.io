# Parsing JFR Recordings

The parsing stage converts a binary JFR recording into the data structures
consumed by the visualizations. It is implemented in plain Java on the JDK's
**native JFR consumer API** . 

## Sampling events

A JFR recording is a stream of typed events, which the readers load and sort
chronologically. Only the **sampling events** are aggregated; every other
event type is ignored. Several sample types are accepted, because the event
type depends on the sampling mode and on where the sample landed:

| Event type | Emitted for |
|---|---|
| `jdk.ExecutionSample` | Standard samples — async-profiler's `cpu` mode and the JVM's own sampler |
| `jdk.NativeMethodSample` | Samples caught inside native code |
| `jdk.CPUTimeSample` | JFR CPU-time profiling (JEP 509, JDK 25+), driven by the Linux kernel's CPU timer |
| `profiler.WallClockSample` | async-profiler's wall-clock mode (`event=wall`) |

Accepting the whole family keeps the pipeline correct whatever capture mode
the profiling script selects (`-e cpu`, `-e wall`, `-e itimer`, `--jfrsync`, …).

## Frame filtering and normalization

Before a frame contributes to either construction below, it goes through a
few passes that keep both graphs readable and comparable:

- **JDK/system frames are excluded** — `java.lang`, `javax.`, `jdk`, `sun.`,
  `com.sun.`, `org.xml.`, `org.w3c.` packages, and native-library frames
  (`lib*.so`, unresolved `jvm` frames), are dropped: none of these are
  decisions the profiled application controls.
- **Inner and anonymous classes collapse into their enclosing class** —
  `Outer$Inner` is attributed to `Outer`, since JDK-generated inner classes
  multiply quickly without adding value at this granularity.
- **Consecutive duplicate frames are merged**, so a chain of same-class calls
  (e.g. recursive helpers) does not inflate the branch with repeated nodes.

The treemap goes one level further, since it descends to individual
**methods**: `lambda$…` / `$anonfun$…` method names are normalized back to
the method that declares the lambda, and compiler-generated `access$…`
accessor frames are filtered out entirely — otherwise a single lambda body
would fragment into several visually distinct leaves. The Sankey stops at
class granularity, so this last step does not apply to it.

## Two constructions from the same samples

### Hierarchical cost tree (treemap)

Each branch descends the tree along the path **package segments → class →
method**, creating nodes on first encounter; the sample's weight is credited
to the **leaf frame only**, since it's the method actually executing at that instant.
Parent costs are then obtained by summation.

### Flow graph (Sankey)

Each pair of consecutive classes in a branch produces or reinforces a
**directed link** caller → callee, and the sample's weight is credited to the
branch's **leaf node**.
