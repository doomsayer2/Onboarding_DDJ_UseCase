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

  // Other
  storeMessages(msg) {
    msg.forEach(e => {
      if (e.anchor.hasOwnProperty('element')) {
        e.anchor.element = e.anchor.element.outerHTML;
      }
    })
    // localStorage.setItem('visaohi-onboarding-messages', JSON.stringify(serialize(msg, true)));
  },

  retrieveMessages() {
    // const msg = serialize(JSON.parse(localStorage.getItem('visahoi-onboarding-messages')), false);
    // console.log('RETRIEVED', msg);
  },
};

/**
 * This function allows us to add a new state dynamically without overriding the previous one.
 * @param {*} newState
 */
export const setOnboardingState = (newState) => {
  onboarding = { ...onboarding, ...newState };
};