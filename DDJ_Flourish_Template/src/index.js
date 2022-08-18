import Treemap from './treemap.js';
import initLayout from '@flourish/layout';
import { moveOnboardigBtn, toggleSettingsMenu, initSettingsMenu, initSaveMenu } from './ui';
import Swal from 'sweetalert2';
import { equals } from './utils/utils.js';

let plotlyTreemap = null;
let layout = null;

export const data = {};
// If your template includes data tables, use this variable to access the data.
// Each of the 'datasets' in data.json file will be available as properties of the data.

export const state = {
  // The current state of template. You can make some or all of the properties
  // of the state object available to the user as settings in settings.js.
  fixed_height: true,
  height: 650,
  change_layout: false,
  layout: {},

  showOnboarding: false,
  toggleEditMode: false,
  rightOffset: 100,
  bottomOffset: 20,

  messageStore: '',
  stageStore: '',

  messages: [],
  stages: [],
  dataObj: null,
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

  // Update the data
  plotlyTreemap.updatePlotlyData(data.data);

  // Should we show the onboarding or not
  state.showOnboarding
    ? await plotlyTreemap.treemap()
    : plotlyTreemap.removeOnboarding();

  // Move the onboarding button if necessary
  state.showOnboarding
    ? moveOnboardigBtn(state.rightOffset, state.bottomOffset)
    : null;

  // Show the settings menu if we are in onboarding mode and its not live
  if (
    !(Flourish.environment === 'live' || Flourish.environment === 'preview')
  ) {
    state.toggleEditMode ? toggleSettingsMenu(true) : toggleSettingsMenu(false);
  }

  // Only show the dialog if we are in onboarding mode and clean it
  state.showOnboarding ? null : cleanState();

  // Check if the data has changed and therefore we need to reload
  if (!equals(state.dataObj, data.data[0])) {
    Swal.fire({
      title: 'Changes',
      html: `We have detected some changes to your data. Please reload the entire page by pressing the <i class="fa-solid fa-arrow-rotate-right"></i> 
      in your browser or use a shortcut. This is necessary in order for the changes to take effect!`,
      iconHtml: '<i class="fas fa-exclamation-triangle"></i>',
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: 'Understood',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-lg btn-dark',
      },
      backdrop: false,
    });
  }

  console.log('THE STATE at ' + new Date().toTimeString() + ': ', state);
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
  Flourish.environment === 'live' || Flourish.environment === 'preview'
    ? toggleSettingsMenu(false)
    : null;

  // ===================
  //  📊 Visualization
  // ===================

  // Initialize the defaultTreemap
  plotlyTreemap = new Treemap('fl-layout-primary', data);

  // Initialize the menu
  initSettingsMenu(plotlyTreemap);    // Settings
  initSaveMenu();                     // Save

  // Initialize the data change detection
  state.dataObj = data.data[0];

  // ===================
  //   ⚡ Finally ⚡
  // ===================
  // Always call the update() after the initial draw
  update();
}

/**
 * HELPERS
 */
const cleanState = () => {
  if (state.messages.length > 0 && state.stages.length > 0) {
    state.messages = [];
    state.stages = [];
  }
};
