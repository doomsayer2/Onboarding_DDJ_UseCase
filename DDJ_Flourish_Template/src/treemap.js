import {
  EVisualizationType,
  ahoi,
  generateBasicAnnotations,
} from '../static/lib/bundle.js';
import { onboarding  } from './utils/store';
import { state } from './index';

// Static variables for onboarding
let chart = null;

export default class Treemap {
  /**
   * Creates a treemap object an initializes it with the given data.
   * Also stores a reference to the tremmap and creates the onboarding.
   * @param {string} container The id of the container
   * @param {*} jobsData
   * @param {*} familiesData
   */
  constructor(container, data) {
    this.container = container;
    this.data = data.data;

    this.onboardingUI = null;
    this.createdOnboarding = false;

    this.graphDiv = document.getElementById(container);

    this.createTreemap();
  }

  /**
   * The method rerenders the visualization and creates the onboarding for it
   */
  async treemap() {
    if (!this.createdOnboarding) {
      await this.createTreemap();

      // Create the onboarding
      this.onboardingUI = await ahoi(
        EVisualizationType.TREEMAP,
        chart,
        Treemap.getAhoiConfig()
      );
      this.createdOnboarding = true;

      // Resize logic for the onboaridng
      const debounceResize = _.debounce((event) => {
        this.onboardingUI?.updateOnboarding({
          onboardingMessages: state.messages,
        });
      }, 250);

      window.addEventListener('resize', debounceResize);
    }
  }

  /**
   * This method just creates the plotly treemap.
   */
  async createTreemap(state = {}) {
    const data = [
      {
        type: 'treemap',
        labels: Treemap.unpack(this.data, 'labels'),
        parents: Treemap.unpack(this.data, 'parents'),
        values: Treemap.unpack(this.data, 'values'),
        marker: {
          colors: Treemap.unpack(this.data, 'colors'),
        },
        textinfo: 'label+value',
        hoverinfo: 'label+value',
        branchvalues: 'total',
        outsidetextfont: { size: 20, color: '#222531' },
      },
    ];
    const layout = {
      title: 'Treemap',
    };
    const config = {
      responsive: true,
    };

    chart = await Plotly.react(this.container, data, layout, config); // Plotly.react() is more efficient that Plotly.newPlot() for recreation
  }

  updatePlotlyData(data_update) {
    this.data = data_update;
    this.createTreemap();

    this.onboardingUI?.updateOnboarding(Treemap.getAhoiConfig()); // Update the onboarding
  }

  updatePlotlyLayout(layout_update) {
    if (!layout_update) {
      return;
    }

    Plotly.relayout(this.graphDiv, layout_update); // Update plotly layout
    this.onboardingUI?.updateOnboarding(Treemap.getAhoiConfig()); // Update the onboarding
  }

  /**
   * The method removes the onboarding if needed
   */
  removeOnboarding() {
    this.onboardingUI?.removeOnboarding();

    this.createdOnboarding = false;
  }

  /**
   * This method generates the onboarding messages based on the visualization type.
   * @returns The configuration object for the visahoi library
   */
  static getAhoiConfig() {
    let onboardingMsgs = null;

    if (state.messages.length === 0) {
      onboardingMsgs = generateBasicAnnotations(
        EVisualizationType.TREEMAP,
        chart
      );

      // ⚠️ Custom Messages ⚠️
      // ...
      state.messages = onboardingMsgs;
    } else {
      onboardingMsgs = state.messages;
    }

    return {
      onboardingMessages: onboardingMsgs,
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
