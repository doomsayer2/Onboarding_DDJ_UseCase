import * as d3 from 'd3';
import { toggleOnboarding, treemap } from './treemap.js';
import { setUpBasicSettings, setFont } from './interfaceSetup.js';
import { populateHtml, loadData, showEnvironment} from './utils/utils';

const initialValues = {
  headline: 'Onboarding & Visualization Template',
  subheader: 'This is a possible subheadline.',
  intro:
    'Use this template in order to create your own visualization in vega-lite and use our awesome onbaording from <b>VisAhoi</b>!',
};

const dataUrls = ['/usaJobsPlan.csv', '/usaFamiliesPlan.csv'];

export const data = {};
// If your template includes data tables, use this variable to access the data.
// Each of the 'datasets' in data.json file will be available as properties of the data.

export const state = {
  // The current state of template. You can make some or all of the properties
  // of the state object available to the user as settings in settings.js.
  headlineText: initialValues.headline,
  subheaderText: initialValues.subheader,
  introText: initialValues.intro,
  fontChoice: null,
  showText: false,
  showOnboarding: false,
  background_color: '#F4F4F4',
};

export function update() {
  // The update function is called whenever the user changes a data table or settings
  // in the visualisation editor, or when changing slides in the story editor.

  // Tip: to make your template work nicely in the story editor, ensure that all user
  // interface controls such as buttons and sliders update the state and then call update.

  // ===================
  //    🔥 Basics
  // ===================
  document.body.style.backgroundColor = state.background_color;
  d3.select('#textWrapper').classed('hide', !state.showText);

  if (state.fontChoice !== null) {
    setFont(state.fontChoice); // Update the font if picked
  }

  populateHtml('#headline', state.headlineText);
  populateHtml('#subheader', state.subheaderText);
  populateHtml('#intro', state.introText);

  // ===================
  //  📊 Visualization
  // ===================
  toggleOnboarding(state.showOnboarding);
}

export async function draw() {
  // The draw function is called when the template first loads
  // ===================
  //    🔥 Basics
  // ===================

  // Flourish.setHeight(window.screen.availHeight * 0.7);  // Set the default height of the flourish visualization to 70% of available screen height

  populateHtml('#headline', initialValues.headline);
  populateHtml('#subheader', initialValues.subheader);
  populateHtml('#intro', initialValues.intro);

  // ===================
  //   ⚙️ Settings
  // ===================
  showEnvironment();

  // ===================
  //  📊 Visualization
  // ===================

  // Initialize the Treemap
  await treemap(
    'vis',
    await loadData(dataUrls[0]),
    await loadData(dataUrls[1])
  );

  // ===================
  //   ⚡ Finally ⚡
  // ===================
  // Always call the update() after the initial draw
  update();
}
