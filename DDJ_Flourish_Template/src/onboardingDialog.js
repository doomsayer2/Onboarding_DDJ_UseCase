import { toast } from './utils/utils';
import {
  createBasicOnboardingMessage,
  createBasicOnboardingStage,
  getOnboardingStages,
} from '../static/lib/bundle.js';
import { onboarding } from './utils/store';
import { state } from './index';

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

/**
 * This funciton is used in order to attach the click listener to the button.
 * It makes sure however everything necessary is there before this is done.
 */
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

/**
 * This function opens or closes the dialog. It makes sure that the initialization and event listener binding
 * is only happening on the first time.
 */
function toggleModal() {
  if (!isInitialized) {
    initDialog();
    isInitialized = true;
  } else {
    modal.toggle();
  }
}

/**
 * This function initializes the dialog. It is only done once when it is first created with the onboarding.
 */
function initDialog() {
  // 1. Grab references to elements
  modalEl = document.getElementById('onboardingSettings');
  select = document.getElementById('addSelectMsg');
  btnInspect = document.getElementById('btnInspect');
  overlay = document.getElementById('overlay');
  xEl = document.getElementById('addXMsg');
  yEl = document.getElementById('addYMsg');
  modal = bootstrap.Modal.getOrCreateInstance(modalEl);

  // 2. Fill the dropdown with the stages
  fillDropdown();

  // 3. Add the form validation
  formValidation();

  // 4. Add general listeners and other
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

  // 5. Show the modal now
  modal.show();
}

/**
 * This function clears the dropdown options in the form first and then populates it with the
 * current stages that are available in the onboarding.
 */
function fillDropdown() {
  // Clear old ones first
  document
    .querySelectorAll('#addSelectMsg option')
    .forEach((option) => option.remove());

  state.stages.forEach((e) => {
    const option = new Option(e.title, e.title);
    select.add(option, undefined);
  });
}

/**
 * This function initializes the listeners for the form validation
 */
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
        state.stages = [...state.stages, newOnboardingStage];

        fillDropdown(); // Fill the dropdown again with new stage
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
        const { onboardingStage, ...msg } = getFormVals(elements);
        msg.anchor = {
          coords: {
            x: +xEl.value,
            y: +yEl.value,
          },
        };

        addMsgToStage(msg, onboardingStage);

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
 * Also from those who have the data-visahoi-id attribute.
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

/**
 * This function adds a message to the given stage in the onboarding interface.
 * @param {Object} msg To be added to the interface
 * @param {string} stage To add the message into
 */
function addMsgToStage(msg, stage) {
  if (state.stages.length > 0) {
    const stageObj = state.stages.filter((e) => e.title === stage)[0];
    state.messages.push(
      createBasicOnboardingMessage({
        title: msg.title,
        text: msg.text,
        onboardingStage: stageObj,
        anchor: msg.anchor,
      })
    );

    // Update the onboarding
    onboarding.treemap.onboardingUI?.updateOnboarding({
      onboardingMessages: state.messages
    });

    toast('Success: The message was added!', 1200); // Show success message also
  } else {
    toast(
      'There are no stages available. Add a stage first please.',
      2000,
      'error',
      'top-end'
    );
  }
}
