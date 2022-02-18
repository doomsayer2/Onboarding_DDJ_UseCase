export default class Treemap {
  constructor(container, jobsData, familiesData) {
    this.container = container;
    this.jobsData = jobsData;
    this.familiesData = familiesData;

    this.createTreemap();
  }

  createTreemap() {
    const data = [
      {
        type: 'treemap',
        labels: Treemap.unpack(this.jobsData, 'Label'),
        parents: Treemap.unpack(this.jobsData, 'Parent'),
        domain: { x: [0, 0.5] },
        values: Treemap.unpack(this.jobsData, 'Value'),
        textinfo: 'label+value',
        hoverinfo: 'label+value',
        outsidetextfont: { size: 20, color: '#222531' },
      },
      {
        type: 'treemap',
        labels: Treemap.unpack(this.familiesData, 'Label'),
        parents: Treemap.unpack(this.familiesData, 'Parent'),
        domain: { x: [0.5, 1] },
        values: Treemap.unpack(this.familiesData, 'Value'),
        textinfo: 'label+value',
        hoverinfo: 'label+value',
        outsidetextfont: { size: 20, color: '#222531' },
      },
    ];
    const layout = {
      title: {
        text: `Biden's tax overhaul`,
      },
      height: window.innerHeight,
      paper_bgcolor: '#F4F4F4',
      annotations: [
        {
          showarrow: false,
          text: 'Jobs Plan <span style="color: #c70000;">~2.31T</span>',
          x: 0.25,
          xanchor: 'center',
          y: 1.02,
          yanchor: 'bottom',
        },
        {
          showarrow: false,
          text: 'Families Plan <span style="color: #c70000;">~1.9T</span>',
          x: 0.75,
          xanchor: 'center',
          y: 1.02,
          yanchor: 'bottom',
        },
      ],
    };

    Plotly.newPlot(this.container, data, layout);
  }

  static unpack(rows, key) {
    return rows.map((row) => row[key]);
  }
}
