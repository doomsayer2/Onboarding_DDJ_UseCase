export let onboarding = {
  isShown: false, // Whether or not the onboarding is shown anyway

  treemap: null, // Reference to the treemap object
  settingsBtn: null, // Reference to the button as d3 selection which should open the menu

  _stages: [], // Keep track of the current stages
  _messages: [], // Keep track of the current messages

  // Getter & Setters
  get stages() {
    return this._stages;
  },
  set stages(val) {
    this._stages = val;
  },

  get messages() {
    return this._messages;
  },
  set messages(val) {
    this._messages = val;
  },
};

/**
 * This function allows us to add a new state dynamically without overriding the previous one.
 * @param {*} newState
 */
export const setOnboardingState = (newState) => {
  onboarding = { ...onboarding, ...newState };
};