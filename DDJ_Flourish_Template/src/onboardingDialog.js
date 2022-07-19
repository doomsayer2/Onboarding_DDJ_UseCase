import { toast } from './utils/utils';
import * as d3 from 'd3';
import {
  createBasicOnboardingMessage,
  createBasicOnboardingStage,
  getOnboardingStages,
} from '../static/lib/bundle.js';

// The store here for all the information
let onboarding = {
  isShown: false, // Whether or not the onboarding is shown anyway

  treemap: null, // Reference to the treemap object
  settingsBtn: null, // Reference to the button as d3 selection which should open the menu

  stages: [], // Keep track of the current stages
};

// All the elements of the dialog and others
let select = null;
let btnInspect = null;
let overlay = null;
let modalEl = null;
let xEl = null;
let yEl = null;
let modal = null;

// Other things
let isInitialized = false;

export const attachClickListener = () => {
  if (onboarding.treemap !== null && onboarding.settingsBtn !== null) {
    onboarding.settingsBtn.on('click', toggleModal);
  } else {
    toast(
      'Treemap or Button still uninitialized. Try to reload the page please!',
      2000,
      'error',
      'top-end'
    );
  }
};

export const setOnboardingState = (newState) => {
  onboarding = { ...onboarding, ...newState };
};

function toggleModal() {
  if (!isInitialized) {
    initDialog();
    isInitialized = true;
  } else {
    modal.toggle();
  }
}

function initDialog() {
  /**
   * 1. Grab references to elements
   */

  modalEl = document.getElementById('onboardingSettings');
  select = document.getElementById('addSelectMsg');
  btnInspect = document.getElementById('btnInspect');
  overlay = document.getElementById('overlay');
  xEl = document.getElementById('addXMsg');
  yEl = document.getElementById('addYMsg');
  modal = bootstrap.Modal.getOrCreateInstance(modalEl);

  /**
   * 2. Fill the dropdown with the stages
   */

  fillDropdown();

  /**
   * 3. Add the form validation
   */

  formValidation();

  /**
   * 4. Add general listeners
   */

  // Overlay related
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      overlay.style.display = 'none';
    }
  });

  overlay.addEventListener('click', (e) => {
    const { x, y } = e;
    xEl.value = x;
    yEl.value = y;

    overlay.style.display = 'none';
    modal.show();

    // Simple hack to stcroll to the input field
    setTimeout(() => {
      xEl.scrollIntoView();
    }, 200);
  });

  btnInspect.addEventListener('click', (e) => {
    e.preventDefault();

    modal.hide();
    overlay.style.display = 'block';
  });

  /**
   * Show the modal now
   */

  modal.show();
}

function fillDropdown() {
  // Clear old ones first
  document
    .querySelectorAll('#addSelectMsg option')
    .forEach((option) => option.remove());

  // Grab current ones
  const stages = getOnboardingStages();

  stages.forEach((e) => {
    const option = new Option(e.title, e.title);
    select.add(option, undefined);
  });
}

function formValidation() {
  const formStage = document.getElementById('formStage');
  const stageBtn = document.getElementById('btnStage');

  const formMessage = document.getElementById('formMessage');
  const messageBtn = document.getElementById('btnMessage');

  // Listener for Stage form
  stageBtn.addEventListener(
    'click',
    (event) => {
      if (!formStage.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();

        formStage.classList.add('was-validated');
      } else {
        event.preventDefault();

        // Get the values out and add them
        const elements = formStage.elements;
        const { title, iconClass, backgroundColor } = getFormVals(elements);

        const newOnboardingStage = createBasicOnboardingStage({
          title,
          iconClass,
          backgroundColor,
        });
        onboarding.stages.push(newOnboardingStage);   // Keep track of the current stages
        fillDropdown();   // Fill the dropdown again with new stage
        toast('Success: The stage was added!', 1200);

        // Reset the form to previous state
        formStage.classList.remove('was-validated');
        formStage.reset();
      }
    },
    false
  );

  // Listener for Message form
  messageBtn.addEventListener(
    'click',
    (event) => {
      if (!formMessage.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();

        formMessage.classList.add('was-validated');
      } else {
        // Get the values out and add them
        event.preventDefault();

        const elements = formMessage.elements;
        const msg = getFormVals(elements);
        console.log('MESSAGE:', msg);

        // Reset the form to previous state
        formMessage.classList.remove('was-validated');
        formMessage.reset();
      }
    },
    false
  );
}

/**
 * This function extracts all the form values from any element that has a data-visahoi-name attribute.
 * It returns an object whichs keys are the data-visahoi-name attributes and the values of the respective form element.
 * @param {*} formElements The elements of which the value should be read
 * @returns An object with the values of the form elements
 */
function getFormVals(formElements) {
  const obj = {};
  for (let i = 0; i < formElements.length; i++) {
    const item = formElements.item(i);
    if (item.dataset.visahoiName) {
      obj[item.dataset.visahoiName] = item.value;
    }
  }
  return obj;
}
