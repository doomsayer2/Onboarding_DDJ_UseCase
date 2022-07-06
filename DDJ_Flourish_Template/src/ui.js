import * as d3 from 'd3';
import { setOnboardingState, attachClickListener } from './onboardingDialog';

/**
 * Sets the font of the whole page. Provide the name of the font and the url to it.
 * @param {Object} param0 Object with keys name and url
 */
export const setFont = ({name, url}) => {
    const font_link = document.createElement('link');
    font_link.setAttribute('rel', 'stylesheet');
    font_link.setAttribute('type', 'text/css');
    
    document.body.appendChild(font_link);

    font_link.setAttribute('href', url);
    document.body.style.fontFamily = name;
}

/**
 * Initializes the settings menu for the onboaring. It is hidden by default and gets the functionality
 * only if we use the onboarding. It provides a reference to the treemap as well
 * @param {Object} treemap Reference to the treemap class instance
 */
export const initSettingsMenu = (treemap = null) => {
    const settingsBtn = d3.select('#btnOnboardingSettings');    // Grab the settings button

    toggleSettingsMenu(false);                                  // Hide the whole menu initially
    setOnboardingState({ treemap, settingsBtn });               // Pass the information to the dialog
    attachClickListener();                  // Attach the click listener for the onboarding menu button
}

/**
 * Toogles the onboarding additional menu.
 * @param {boolean} hide Whether to hide it or not
 */
export const toggleSettingsMenu = (hide) => {
    const settingsMenu = d3.select('#onboardingSettings');

    hide ? settingsMenu.classed('beGone', false) : settingsMenu.classed('beGone', true);
}

/**
 * This method moves the onboarding button after it was created to reposition it
 * @param {number} right Positive or Negative number to move along x axis
 * @param {*} bottom Positive or Negative number to move along y axis
 */
export const moveOnboardigBtn = (right, bottom) => {
    d3.select('.visahoi-navigation-container')
        .style('right', right + 'px')
        .style('bottom', bottom + 'px')
} 