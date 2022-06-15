import {
  EVisualizationType,
  ahoi,
  generateBasicAnnotations,
  createBasicOnboardingMessage,
  createBasicOnboardingStage,
  getOnboardingStages
} from '../static/lib/bundle.js';
import * as d3 from 'd3';

// Static variables for onboarding
let chart = null;
let onboardingUI = null;

export default class Treemap {
  /**
   * Creates a treemap object an initializes it with the given data. 
   * Also stores a reference to the tremmap and creates the onboarding.
   * @param {string} container The id of the container
   * @param {*} jobsData 
   * @param {*} familiesData 
   */
  constructor(container, jobsData, familiesData) {
    this.container = container;
    this.jobsData = jobsData;
    this.familiesData = familiesData;

    this.graphDiv = document.getElementById(container);

    this.createTreemap();
  }

  async treemap() {
    this.createTreemap();
    
    // Create the onboarding
    onboardingUI = await ahoi(EVisualizationType.TREEMAP, chart, Treemap.getAhoiConfig());
  }

  /**
   * This method just creates the plotly treemap.
   */
  async createTreemap() {
    const data = [
      {
        type: 'treemap',
        labels: Treemap.unpack(this.jobsData, 'Label'),
        parents: Treemap.unpack(this.jobsData, 'Parent'),
        values: Treemap.unpack(this.jobsData, 'Value'),
        marker: {
          colors: Treemap.unpack(this.jobsData, 'ColorToned50')
        },
        domain: { x: [0, 0.5] },
        textinfo: 'label+value',
        hoverinfo: 'label+value',
        outsidetextfont: { size: 20, color: '#222531' },
      },
      {
        type: 'treemap',
        labels: Treemap.unpack(this.familiesData, 'Label'),
        parents: Treemap.unpack(this.familiesData, 'Parent'),
        values: Treemap.unpack(this.familiesData, 'Value'),
        marker: {
          colors: Treemap.unpack(this.familiesData, 'ColorToned50')
        },
        domain: { x: [0.5, 1] },
        textinfo: 'label+value',
        hoverinfo: 'label+value',
        outsidetextfont: { size: 20, color: '#222531' },
      },
    ];
    const layout = {
      title: {
        text: `Biden's tax overhaul`,
      },
      height: window.innerHeight * 0.9,
      paper_bgcolor: 'transparent',
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
    const config = {
      responsive: true
    };

    chart = await Plotly.react(this.container, data, layout, config);   // Plotly.react() is more efficient that Plotly.newPlot() for recreation
  }

  /**
   * This method generates the onboarding messages based on the visualization type.
   * @returns The configuration object for the visahoi library
   */
  static getAhoiConfig() {
    const defaultOnboardingMessages = generateBasicAnnotations(EVisualizationType.TREEMAP, chart);

    // ⚠️ Custom Messages ⚠️
    // ...

    return {
      onboardingMessages: defaultOnboardingMessages
    };
  }

  /**
   * Method reutrns a single property as array from an array of objects with several or one property. 
   * E.g. the "name" property of a data array of objects with the value of "name" from each object.
   * @param {*} rows The whole array of objects
   * @param {*} key The key to extract from those objects
   * @returns An array of the extracted "key" values
   */
  static unpack(rows, key) {
    return rows.map((row) => row[key]);
  }
}
