# Getting Started

This page walks you through a first run.

## Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| JDK | 11+ (21 recommended) | Running targets and the JFR parser |
| async-profiler | 4.4 | Sample capture  |
| Node.js | 18+ | SFTM module and visualization templates |
| Maven | 3.8+ | Building profile project |
| GNU Make | — | Automating the workflow |


## 1. Profiling with async-profiler

### With a standalone program / benchmark

Attach async-profiler directly to the forked JVM with `-agentpath`:

```bash
java -agentpath:/path/to/libasyncProfiler.so=start,event=wall,file=profile.jfr \
     -jar my-app.jar 
```

### With a running application

async-profiler can also attach to an already-running JVM by PID, using the `asprof` launcher:

```bash
asprof start -e wall -f profile.jfr <pid>  
# ... exercise the application ...
asprof stop <pid>                        
```

Since attach mode records a time window rather than a complete execution, drive a **fixed, known load** during the window and compute `T = elapsed / N` to keep the [time formula](/methodology/temporal-weighting) for the streamgraph valid.

## 2. Parse and visualize

### Cloning the project repository

```bash
git clone https://gitlab.univ-lille.fr/malak.touat.etu/java-profiling-visualizer
```

### Single version — Profile module

From the `.jfr` recording, you can produce the treemap and Sankey diagram by running:

```bash
cd profile
make run FILE=profile.jfr
```

### Restricting to a time window

`FROM` and `TO` are seconds relative to the first execution sample, and only apply to `.jfr` recordings — collapsed CSV traces don't support them:

```bash
make run FILE=profile.jfr FROM=5 TO=12
```

`make log` prints (and writes to `<file>-phases.log`) the leaf class running at each point in time, merging consecutive samples that share the same leaf, so you can read off the exact bounds to pass to `FROM` / `TO`:

```bash
make log FILE=profile.jfr
```

`TIME`, in seconds, overrides the duration used to normalize the treemap — but only takes effect when neither `FROM` nor `TO` is set; pass all three together and `TIME` is silently ignored:

```bash
make run FILE=profile.jfr TIME=30
```

### Across versions — Differential module

From the JSON files produced by the Profile module, you can produce the streamgraph by running:

```bash
cd differential
npx tsx src/main.ts v1.json v2.json v3.json -o stream.json --html stream.html
```

## 3. Read the results

- **Treemap** — rectangle area ≈ cost share. See [Treemap](/profile/treemap).
- **Sankey** — left-to-right flow of samples through call frames. See [Sankey Diagram](/profile/sankey).
- **Streamgraph** — one band per class. See [Streamgraph](/differential/streamgraph).