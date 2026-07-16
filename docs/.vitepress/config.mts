import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Java Profiling Visualizer',
  description:
    'A profiling and visualization pipeline for analyzing Java performance within a version and across versions — treemaps, Sankey diagrams and differential streamgraphs built from async-profiler JFR execution traces.',
  lang: 'en-US',
  lastUpdated: true,
  cleanUrls: true,
  base: '/',

  head: [
    ['meta', { name: 'theme-color', content: '#e8590c' }]
  ],

  themeConfig: {

    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Single version visuals', link: '/profile/overview' },
      { text: 'Across versions comparison', link: '/differential/overview' },
      { text: 'Methodology', link: '/methodology/temporal-weighting' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Getting Started', link: '/guide/getting-started' }
          ]
        }
      ],
      '/profile/': [
        {
          text: 'Single version visuals',
          items: [
            { text: 'Overview', link: '/profile/overview' },
            { text: 'Parsing JFR Recordings', link: '/profile/jfr-parsing' },
            { text: 'Treemap Visualization', link: '/profile/treemap' },
            { text: 'Sankey Diagram', link: '/profile/sankey' }
          ]
        }
      ],
      '/differential/': [
        {
          text: 'Across versions comparison',
          items: [
            { text: 'Overview', link: '/differential/overview' },
            { text: 'Similarity-based Flexible Tree Matching', link: '/differential/sftm' },
            { text: 'Streamgraph Visualization', link: '/differential/streamgraph' }
          ]
        }
      ],
      '/methodology/': [
        {
          text: 'Methodology',
          items: [
            { text: 'Temporal Weighting', link: '/methodology/temporal-weighting' },
            { text: 'Profiling Modes', link: '/methodology/profiling-modes' },
            { text: 'Scope & Limitations', link: '/methodology/scope' }
          ]
        }
      ]
    },

    outline: { level: [2, 3], label: 'On this page' },

    search: { provider: 'local' },

  },

  markdown: {
    math: true,
    theme: { light: 'github-light', dark: 'github-dark' }
  }
})
