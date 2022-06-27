import Treemap from './treemap.js';
import { loadData } from './utils/utils';
import initLayout from "@flourish/layout";


const dataUrls = ['/usaJobsPlan.csv', '/usaFamiliesPlan.csv'];
let plotlyTreemap = null;
let layout = null;

export const data = {};
// If your template includes data tables, use this variable to access the data.
// Each of the 'datasets' in data.json file will be available as properties of the data.

export const state = {
  // The current state of template. You can make some or all of the properties
  // of the state object available to the user as settings in settings.js.
  fixed_height: false,
  height: 650,
  change_layout: false,
  layout: {},

  showOnboarding: false,
};

export async function update() {
  // The update function is called whenever the user changes a data table or settings
  // in the visualisation editor, or when changing slides in the story editor.

  // Tip: to make your template work nicely in the story editor, ensure that all user
  // interface controls such as buttons and sliders update the state and then call update.

  // ===================
  //    🔥 Basics
  // ===================
  
  // Update the layout
  layout.update();

  // Update the height
  if (state.fixed_height) {
    layout.setHeight(state.height);
  } else {
    layout.setHeight(layout.getDefaultPrimaryHeight());
  }

  // ===================
  //  📊 Visualization
  // ===================

  // Should we show the onboarding or not
  state.showOnboarding
    ? await plotlyTreemap.treemap()
    : plotlyTreemap.removeOnboarding();
}

export async function draw() {
  // The draw function is called when the template first loads
  // ===================
  //    🔥 Basics
  // ===================

  layout = initLayout(state.layout);

  // ===================
  //   ⚙️ Settings
  // ===================
  console.log(layout.getOverlay());


  // ===================
  //  📊 Visualization
  // ===================

  // Initialize the Treemap
  plotlyTreemap = new Treemap(
    'fl-layout-primary',
    await loadData(dataUrls[0]),
    await loadData(dataUrls[1])
  );

  // ===================
  //   ⚡ Finally ⚡
  // ===================
  // Always call the update() after the initial draw
  update();
}
