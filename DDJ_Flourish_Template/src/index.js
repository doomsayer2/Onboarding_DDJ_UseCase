import { populateHtml, convertToObject } from './utils/utils';
import * as d3 from 'd3';

const initialValues = {
  headline: 'Onboarding & Visualization Template',
  subheader: 'This is a possible subheadline.',
  intro: 'Use this template in order to create your own visualization in vega-lite and use our awesome onbaording from <b>VisAhoi</b>!'
};

export const data = {};
// If your template includes data tables, use this variable to access the data.
// Each of the 'datasets' in data.json file will be available as properties of the data.

export const state = {
  // The current state of template. You can make some or all of the properties
  // of the state object available to the user as settings in settings.js.
  example_state_property: 25,
  headlineText: initialValues.headline,
  subheaderText: initialValues.subheader,
  introText: initialValues.intro,
  showText: true,
  vegaLiteScheme: `{
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    description: 'A simple bar chart with embedded data.',
    data: {
      values: [
        {a: 'A', b: 28},
        {a: 'B', b: 55},
        {a: 'C', b: 43},
        {a: 'D', b: 91},
        {a: 'E', b: 81},
        {a: 'F', b: 53},
        {a: 'G', b: 19},
        {a: 'H', b: 87},
        {a: 'I', b: 52}
      ]
    },
    mark: 'bar',
    encoding: {
      x: {field: 'a', type: 'ordinal'},
      y: {field: 'b', type: 'quantitative'}
    }
  }`,
  background_color: "#F4F4F4"
};

export function update() {
  // The update function is called whenever the user changes a data table or settings
  // in the visualisation editor, or when changing slides in the story editor.

  // Tip: to make your template work nicely in the story editor, ensure that all user
  // interface controls such as buttons and sliders update the state and then call update.

  // Basics
  document.body.style.backgroundColor = state.background_color;
  d3.select('#textWrapper').classed('hide', !state.showText);

  populateHtml('#headline', state.headlineText);
  populateHtml('#subheader', state.subheaderText);
  populateHtml('#intro', state.introText);

  // Vega-Lite
  const vegaSpec = convertToObject(state.vegaLiteScheme);
  vegaEmbed('#vis', vegaSpec);
}

export function draw() {
  // The draw function is called when the template first loads
  populateHtml('#headline', initialValues.headline);
  populateHtml('#subheader', initialValues.subheader);
  populateHtml('#intro', initialValues.intro);

  // Always call the update() after the initial draw
  update();
}
