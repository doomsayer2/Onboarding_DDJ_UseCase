import * as d3 from 'd3';
import { attachClickListener } from './onboardingDialog';
import { attachClickListenerSave } from './saveDialog';
import { setOnboardingState } from './utils/store';
import Swal from 'sweetalert2';

/**
 * Sets the font of the whole page. Provide the name of the font and the url to it.
 * @param {Object} param0 Object with keys name and url
 */
export const setFont = ({ name, url }) => {
  const font_link = document.createElement('link');
  font_link.setAttribute('rel', 'stylesheet');
  font_link.setAttribute('type', 'text/css');

  document.body.appendChild(font_link);

  font_link.setAttribute('href', url);
  document.body.style.fontFamily = name;
};

/**
 * Initializes the save menu for the onboarding. It is hidden by default.
 */
export const initSaveMenu = () => {
  const saveBtn = d3.select('#btnSave'); // Grab the save button

  setOnboardingState({ saveBtn }); // Pass the information to the dialog
  attachClickListenerSave(); // Attach the click listener for the onboarding menu button
};

/**
 * Initializes the settings menu for the onboaring. It is hidden by default and gets the functionality
 * only if we use the onboarding. It provides a reference to the treemap as well
 * @param {Object} treemap Reference to the treemap class instance
 */
export const initSettingsMenu = (treemap = null) => {
  const settingsBtn = d3.select('#btnOnboardingSettings'); // Grab the settings button

  toggleSettingsMenu(false); // Hide the whole menu initially
  setOnboardingState({ treemap, settingsBtn }); // Pass the information to the dialog
  attachClickListener(); // Attach the click listener for the onboarding menu button
};

/**
 * Toogles the onboarding additional menu.
 * @param {boolean} show Whether to show it or not
 */
export const toggleSettingsMenu = (show) => {
  const settingsMenu = d3.select('#onboardingSettingsBtn');

  show
    ? settingsMenu.classed('beGone', false)
    : settingsMenu.classed('beGone', true);
};

/**
 * This function moves the onboarding button after it was created to reposition it
 * @param {number} right Positive or Negative number to move along x axis
 * @param {*} bottom Positive or Negative number to move along y axis
 */
export const moveOnboardigBtn = (right, bottom) => {
  d3.select('.visahoi-navigation-container')
    .style('right', right + 'px')
    .style('bottom', bottom + 'px');
};

/**
 * This function shows the dialog for the changes. It is necessary as we need to reload the page. It can't
 * be done programmatically as the user has to do it. We just show the message and inform the user.
 */
export const dialogChanges = () => {
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
};

export const dialogSave = () => {
    Swal.fire({
      title: 'Saving Process',
      html: `
        <div class="saveDialogText">
            <h4>Important Information regarding saving</h4>

            <div class="mt-3 mb-3 text-center">
            Before you publish the visualization or leave the page save your adaptions by using the button in the top right corner. 
            You have to copy and paste two <strong>“Strings”</strong> into the respective field in the setting panel <strong>“Onboarding”</strong>
            of the Flourish template (see GIF) below!
            </div>

            <div class="mt-3 mb-3 text-center">
              <img id="saveImg" src="${Flourish.static_prefix}/media/onboarding-save-flourish.gif" class="rounded" alt="Dialog img...">
            </div>
        </div>
      `,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: 'Understood',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-lg btn-dark',
      },
      backdrop: "#efefefe",
      width: '56em',
      allowOutsideClick: false
    });
  };