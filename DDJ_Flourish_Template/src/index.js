import { populateHtml, convertToObject } from './utils/utils';
import * as d3 from 'd3';

const initialValues = {
  headline: 'Onboarding & Visualization Template',
  subheader: 'This is a possible subheadline.',
  intro:
    'Use this template in order to create your own visualization in vega-lite and use our awesome onbaording from <b>VisAhoi</b>!',
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
  showText: false,
  background_color: '#F4F4F4',
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
}

export function draw() {
  // Set the default height of the flourish visualization to 70% of available screen height
  Flourish.setHeight(window.screen.availHeight * 0.7);

  // The draw function is called when the template first loads
  populateHtml('#headline', initialValues.headline);
  populateHtml('#subheader', initialValues.subheader);
  populateHtml('#intro', initialValues.intro);

  // Always call the update() after the initial draw
  update();
}
