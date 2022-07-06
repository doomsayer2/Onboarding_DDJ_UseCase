import { toast } from './utils/utils';
import * as d3 from 'd3';

// The store here for all the information
let onboarding = {
    isShown: false,     // Whether or not the onboarding is shown anyway

    treemap: null,      // Reference to the treemap object
    settingsBtn: null,  // Reference to the button as d3 selection which should open the menu
};

export const attachClickListener = () => {
    if (onboarding.treemap !== null && onboarding.settingsBtn !== null) {
        onboarding.settingsBtn.on('click', createDialog);
    } else {
        toast('Treemap or Button still uninitialized. Try to reload the page please!', 2000, 'error', 'top-end');
    }
};

export const setOnboardingState = (newState) => {
    onboarding = {...onboarding, ...newState};
};

function createDialog() {
    console.log('The button works!');
}