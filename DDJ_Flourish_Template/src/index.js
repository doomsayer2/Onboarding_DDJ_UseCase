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
import { equals, logger } from './utils/utils.js';
import {
  getOnboardingMessages,
  getOnboardingStages,
  setEditMode,
} from '../static/lib/bundle.js';

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

  showOnboarding: true,
  toggleEditMode: true,
  rightOffset: 100,
  bottomOffset: 20,

  messageStore: `[{"anchor":{"findDomNodeByValue":true,"offset":{"left":-20,"top":20},"sel":"[data-unformatted='Tax\\\\ cuts\\\\ and\\\\ credits']"},"requires":["desc"],"text":"The treemap visualization shows the breakdown of hierarchical data level by level.The size of each rectangle represents a quantitative value associated with each element in the hierarchy.","title":"Reading the chart","onboardingStage":{"id":"reading-the-chart","title":"Reading","iconClass":"fas fa-glasses","hoverBackgroundColor":"rgb(92, 59, 112)","backgroundColor":"rgb(123, 80, 150)","activeBackgroundColor":"rgb(76, 46, 94)","order":1},"marker":{"id":"unique-marker-id-2"}},{"anchor":{"findDomNodeByValue":true,"offset":{"left":-40,"top":-30},"sel":"[data-unformatted='Child\\\\ Tax\\\\ Credit\\\\ expansions\\\\<br\\\\>450'] [dy='\\\\30 em']"},"requires":["subDesc"],"text":"The area covered by the whole treemap is subdivided recursively into sub-categories according to their quantitative values, level by level.","title":"Reading the chart","onboardingStage":{"id":"reading-the-chart","title":"Reading","iconClass":"fas fa-glasses","hoverBackgroundColor":"rgb(92, 59, 112)","backgroundColor":"rgb(123, 80, 150)","activeBackgroundColor":"rgb(76, 46, 94)","order":1},"marker":{"id":"unique-marker-id-3"}},{"anchor":{"findDomNodeByValue":true,"offset":{"left":-80,"top":-30},"sel":"[data-unformatted='Extend\\\\ ACA\\\\ tax\\\\ credit\\\\<br\\\\>200'] [dy='\\\\30 em']"},"requires":["otherDesc"],"text":"Items on the bottom level that belong to the same sub-category are visually represented by using the same color.","title":"Reading the chart","onboardingStage":{"id":"reading-the-chart","title":"Reading","iconClass":"fas fa-glasses","hoverBackgroundColor":"rgb(92, 59, 112)","backgroundColor":"rgb(123, 80, 150)","activeBackgroundColor":"rgb(76, 46, 94)","order":1},"marker":{"id":"unique-marker-id-4"}},{"anchor":{"findDomNodeByValue":true,"offset":{"left":-40,"top":-60},"sel":"[data-unformatted='EITC\\\\ permanent\\\\<br\\\\>125'] [dy='\\\\30 em']"},"requires":["gapDesc"],"text":"Items within a sub-category are represented by rectangles that are closely packed together with increasingly larger gaps to the neighboring categories.","title":"Reading the chart","onboardingStage":{"id":"reading-the-chart","title":"Reading","iconClass":"fas fa-glasses","hoverBackgroundColor":"rgb(92, 59, 112)","backgroundColor":"rgb(123, 80, 150)","activeBackgroundColor":"rgb(76, 46, 94)","order":1},"marker":{"id":"unique-marker-id-5"}},{"anchor":{"findDomNodeByValue":true,"offset":{"left":-20,"top":-30},"sel":"[data-unformatted='Tax\\\\ cuts\\\\ and\\\\ credits']"},"requires":["interactingDesc"],"text":"Hover over the rectangles to get the dedicated value of the sub-category and further information.","title":"Interacting with the chart","onboardingStage":{"id":"using-the-chart","title":"Interacting","iconClass":"fas fa-hand-point-up","backgroundColor":"rgb(0, 61, 92)","order":2},"marker":{"id":"unique-marker-id-6"}},{"anchor":{"findDomNodeByValue":true,"offset":{"left":-20,"top":-30},"sel":"[data-unformatted='Child\\\\ Tax\\\\ Credit\\\\ expansions\\\\<br\\\\>450'] [dy='\\\\30 em']"},"requires":["maxValueDesc","maxValue"],"text":"The largest rectangle holds the maximum value in the sub-category. In this sub-category 450 is the maximum value.","title":"Analyzing the chart","onboardingStage":{"id":"analyze-the-chart","title":"Analyzing","iconClass":"fas fa-lightbulb","backgroundColor":"rgb(254, 128, 41)","order":3},"marker":{"id":"unique-marker-id-7"}},{"anchor":{"findDomNodeByValue":true,"offset":{"left":-20,"top":-20},"sel":"[data-unformatted='CDCTC\\\\ permanent\\\\<br\\\\>80'] [dy='\\\\30 em']"},"requires":["minValueDesc","minValue"],"text":" The smallest rectangle holds the minimum value in the sub-category. In this sub-category 80 is the minimum value.","title":"Analyzing the chart","onboardingStage":{"id":"analyze-the-chart","title":"Analyzing","iconClass":"fas fa-lightbulb","backgroundColor":"rgb(254, 128, 41)","order":3},"marker":{"id":"unique-marker-id-8"}},{"marker":{"id":"visahoi-marker-c78dcad1-afdf-4087-9ef3-9477d70b220d"},"title":"test","text":"test","onboardingStage":{"title":"Example","iconClass":"fa fa-thumbs-up","backgroundColor":"#0fff63","id":"visahoi-stage-16f37305-b85b-43b5-870b-86c7faaf21c1"},"anchor":{"coords":{"x":431,"y":523}}},{"marker":{"id":"visahoi-marker-d27c6d69-62f6-430b-986a-ad0025d7989d"},"title":"test2","text":"test2","onboardingStage":{"title":"Example","iconClass":"fa fa-thumbs-up","backgroundColor":"#0fff63","id":"visahoi-stage-16f37305-b85b-43b5-870b-86c7faaf21c1"},"anchor":{"coords":{"x":823,"y":417}}}]`,
  stageStore: '[{"id":"reading-the-chart","title":"Reading","iconClass":"fas fa-glasses","hoverBackgroundColor":"rgb(92, 59, 112)","backgroundColor":"rgb(123, 80, 150)","activeBackgroundColor":"rgb(76, 46, 94)","order":1},{"id":"using-the-chart","title":"Interacting","iconClass":"fas fa-hand-point-up","backgroundColor":"rgb(0, 61, 92)","order":2},{"id":"analyze-the-chart","title":"Analyzing","iconClass":"fas fa-lightbulb","backgroundColor":"rgb(254, 128, 41)","order":3},{"title":"Example","iconClass":"fa fa-thumbs-up","backgroundColor":"#0fff63","id":"visahoi-stage-16f37305-b85b-43b5-870b-86c7faaf21c1"}]',

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
  console.count('update() called...');

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
  console.count('draw() called...');
  layout = initLayout(state.layout);

  // ===================
  //   ⚙️ Settings
  // ===================
  Flourish.environment === 'live' || Flourish.environment === 'preview'
    ? toggleSettingsMenu(false)
    : dialogSave();

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
const cleanState = () => {
  if (state.messages.length > 0 && state.stages.length > 0) {
    state.messages = [];
    state.stages = [];
  }
};

const observer = new MutationObserver((mutations, observer) => {
  console.log('Save would happen...');
});
