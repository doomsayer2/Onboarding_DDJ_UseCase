import Treemap from './treemap.js';
import initLayout from '@flourish/layout';
import {
  moveOnboardigBtn,
  toggleSettingsMenu,
  initSettingsMenu,
  initSaveMenu,
  dialogChanges,
  dialogSave,
} from './ui';
import { equals } from './utils/utils.js';
import { getOnboardingMessages, getOnboardingStages, setEditMode, setOnboardingStage } from '../static/lib/bundle.js';

let plotlyTreemap = null;
let layout = null;

export const data = {};
// If your template includes data tables, use this variable to access the data.
// Each of the 'datasets' in data.json file will be available as properties of the data.

export const state = {
  // The current state of template. You can make some or all of the properties
  // of the state object available to the user as settings in settings.js.
  fixed_height: true,
  height: 750,
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
  dataObj: null, // Used to check if the data changed which means a new one uploaded
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

  // Watch for changes to the onboarding ui when we are in edit mode
  if (state.toggleEditMode) {
    observer.observe(document.querySelector('.visahoi-onboarding-ui'), {
      subtree: true,
      childList: true,
    });
  }

  // Show the settings menu if we are in onboarding mode and its not live
  if (
    !(Flourish.environment === 'live' || Flourish.environment === 'preview')
  ) {
    state.toggleEditMode ? toggleSettingsMenu(true) : toggleSettingsMenu(false);
    setEditMode(state.toggleEditMode);
  } else {
    // Disable all the settings
    toggleSettingsMenu(false);
    setEditMode(false);
  }

  // Only show the dialog if we are in onboarding mode and clean it
  state.showOnboarding ? null : cleanState();

  // Check if the data has changed and therefore we need to reload
  if (!equals(state.dataObj, data.data[0])) {
    state.dataObj = data.data[0]; // Update the data object
    dialogChanges(); // Show the warning message
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
    : dialogSave();

  // document.getElementById('log').addEventListener('click', () => {
  //   console.log('Stages: ', getOnboardingStages());
  //   console.log('Messages: ', getOnboardingMessages());
  // });

  // ===================
  //  📊 Visualization
  // ===================

  // Initialize the defaultTreemap
  plotlyTreemap = new Treemap('fl-layout-primary', data);

  // Initialize the menu
  initSettingsMenu(plotlyTreemap); // Settings
  initSaveMenu(); // Save

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
/**
 * This function is used to clean the state once we disable the onboarding
 */
const cleanState = () => {
  if (state.messages.length > 0 && state.stages.length > 0) {
    state.messages = [];
    state.stages = [];
  }
};

/**
 * This function is used to update the state based on user interactions with the onboarding like deleting or adding things
 */
const observer = new MutationObserver((mutations, observer) => {
  console.log('Do nothing...');
  // state.stages = getOnboardingStages();
  // state.messages = getOnboardingMessages();
});
