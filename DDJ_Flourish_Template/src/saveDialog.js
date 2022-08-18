import { onboarding } from './utils/store';
import { state } from './index';
import { toast } from './utils/utils';

// All the elements of the dialog
let modalEl = null;
let modal = null;

// Other things
let isInitialized = false;

export const attachClickListenerSave = () => {
  if (onboarding.treemap !== null && onboarding.saveBtn !== null) {
    onboarding.saveBtn.on('click', toggleModal);
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

function initDialog() {
  // 1. Grab references to elements
  modalEl = document.getElementById('onboardingSave');
  modal = bootstrap.Modal.getOrCreateInstance(modalEl);

  // 2. Show the modal now
  modal.show();
}
