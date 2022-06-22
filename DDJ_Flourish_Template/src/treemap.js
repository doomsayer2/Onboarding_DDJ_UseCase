import {
  EVisualizationType,
  ahoi,
  generateBasicAnnotations,
  createBasicOnboardingMessage,
  createBasicOnboardingStage,
  getOnboardingStages,
} from '../static/lib/bundle.js';
import * as d3 from 'd3';

/**
 * ==================================
 *            VARIABLES
 * ==================================
 */
// Static variables for onboarding
let chart = null;
let onboardingUI = null;

let container = null;
let data1 = null;
let data2 = null;
let graphDiv = null;
let onboardingEl = null;

/**
 * ==================================
 *            FUNCTIONS
 * ==================================
 */
// Resize logic for the onboaridng
const debounceResize = _.debounce((event) => {
  onboardingUI?.updateOnboarding(getAhoiConfig());
}, 250);

window.addEventListener('resize', debounceResize);

/**
 * The method rerenders the visualization and creates the onboarding for it
 */
const treemap = async (c, d1, d2) => {
  // Set necessary variables
  container = c;
  graphDiv = document.getElementById(container);
  data1 = d1;
  data2 = d2;

  // Create the visualization
  await createTreemap();

  // Create onboarding
  await createOnboarding();
  onboardingEl = d3.select('.visahoi-onboarding-ui');
  toggleOnboarding(false);
};

/**
 * This method just creates the plotly treemap.
 */
const createTreemap = async () => {
  const data = [
    {
      type: 'treemap',
      labels: unpack(data1, 'Label'),
      parents: unpack(data1, 'Parent'),
      values: unpack(data1, 'Value'),
      marker: {
        colors: unpack(data1, 'ColorToned50'),
      },
      domain: { x: [0, 0.5] },
      textinfo: 'label+value',
      hoverinfo: 'label+value',
      outsidetextfont: { size: 20, color: '#222531' },
    },
    {
      type: 'treemap',
      labels: unpack(data2, 'Label'),
      parents: unpack(data2, 'Parent'),
      values: unpack(data2, 'Value'),
      marker: {
        colors: unpack(data2, 'ColorToned50'),
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
    responsive: true,
  };

  chart = await Plotly.react(container, data, layout, config); // Plotly.react() is more efficient that Plotly.newPlot() for recreation
};

const createOnboarding = async () => {
  onboardingUI = await ahoi(EVisualizationType.TREEMAP, chart, getAhoiConfig());
};

const toggleOnboarding = (show) => {
  show
    ? onboardingEl?.style('display', 'inline')
    : onboardingEl?.style('display', 'none');
};

/**
 * This method generates the onboarding messages based on the visualization type.
 * @returns The configuration object for the visahoi library
 */
const getAhoiConfig = () => {
  const defaultOnboardingMessages = generateBasicAnnotations(
    EVisualizationType.TREEMAP,
    chart
  );

  // ⚠️ Custom Messages ⚠️
  // ...

  return {
    onboardingMessages: defaultOnboardingMessages,
  };
};

/**
 * Method reutrns a single property as array from an array of objects with several or one property.
 * E.g. the "name" property of a data array of objects with the value of "name" from each object.
 * @param {*} rows The whole array of objects
 * @param {*} key The key to extract from those objects
 * @returns An array of the extracted "key" values
 */
const unpack = (rows, key) => {
  return rows.map((row) => row[key]);
};

export { treemap, toggleOnboarding };
