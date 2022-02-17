export default class Treemap {
  constructor(container) {
    this.container = container;
    this.createTreemap();
  }

  createTreemap() {
    const labels = [
      'Cain',
      'Seth',
      'Enos',
      'Noam',
      'Abel',
      'Awan',
      'Enoch',
      'Azura',
    ];
    const parents = [
      '',
      '',
      'Seth',
      'Seth',
      '',
      '',
      'Awan',
      '',
    ];
    const data = [
      {
        type: 'treemap',
        labels: labels,
        parents: parents,
        domain: { x: [0, 0.5] },
        values: [10, 14, 12, 10, 2, 6, 6, 1, 4],
        textinfo: 'label+value',
        hoverinfo: 'label+value',
        outsidetextfont: { size: 20, color: '#222531' },
      },
      {
        type: 'treemap',
        labels: labels,
        parents: parents,
        domain: { x: [0.5, 1] },
        values: [65, 14, 12, 10, 2, 6, 6, 1, 4],
        textinfo: 'label+value',
        hoverinfo: 'label+value',
        outsidetextfont: { size: 20, color: '#222531' },
      },
    ];
    const layout = {
      title: {
        text: `Biden's tax overhaul`
      },
      height: window.innerHeight,
      paper_bgcolor: '#F4F4F4',
      annotations: [
        {
          showarrow: false,
          text: 'Jobs Plan <span style="color: #c70000;">~2.31T</span>',
          x: 0.25,
          xanchor: 'center',
          y: 1.0,
          yanchor: 'bottom',
        },
        {
          showarrow: false,
          text: 'Families Plan <span style="color: #c70000;">~1.9T</span>',
          x: 0.75,
          xanchor: 'center',
          y: 1.0,
          yanchor: 'bottom',
        },
      ],
    };

    Plotly.newPlot(this.container, data, layout);
  }
}
