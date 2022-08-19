import { onboarding } from './utils/store';
import { state } from './index';
import { toast } from './utils/utils';
import ClipboardJS from 'clipboard';
import { getOnboardingMessages, getOnboardingStages } from '../static/lib/bundle';

// All the elements of the dialog
let modalEl = null;
let modal = null;
let stageInput = null;
let messageInput = null;
let stageBtnCopy = null;
let messageBtnCopy = null;

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
    updateDataInputs();    // Always grab the latest data
  }
}

function initDialog() {
  // 1. Grab references to elements
  modalEl = document.getElementById('onboardingSave');
  modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  stageInput = document.getElementById('stageInput');
  stageBtnCopy = stageInput.nextElementSibling;
  messageInput = document.getElementById('messageInput');
  messageBtnCopy = messageInput.nextElementSibling;

  // 2. Prefill the inputs with the right strings
  updateDataInputs();

  // 3. Attach copy to clipboard listeners
  const clipboardStage = new ClipboardJS(stageBtnCopy, {
    container: document.getElementById('onboardingSave'),
    target: stageInput,
    text: function() {
      return JSON.stringify(stageInput.value)
    }
  });


  clipboardStage.on('success', () => {
    const currentLabel = stageBtnCopy.innerHTML;
    stageBtnCopy.classList.remove('btn-warning');
    stageBtnCopy.classList.add('btn-dark');

    // Exit label update when already in progress
    if(stageBtnCopy.innerHTML === 'Copied!'){
        return;
    }

    // Update button label
    stageBtnCopy.innerHTML = 'Copied!';

    // Revert button label after 2 seconds
    setTimeout(function(){
        stageBtnCopy.innerHTML = currentLabel;
        stageBtnCopy.classList.add('btn-warning');
        stageBtnCopy.classList.remove('btn-dark');
    }, 2000)
  })

  const clipboardMessage = new ClipboardJS(messageBtnCopy, {
    container: document.getElementById('onboardingSave'),
    target: messageInput,
    text: function() {
      return JSON.stringify(messageInput.value)
    }
  });

  clipboardMessage.on('success', () => {
    const currentLabel = messageBtnCopy.innerHTML;
    messageBtnCopy.classList.remove('btn-warning');
    messageBtnCopy.classList.add('btn-dark');

    // Exit label update when already in progress
    if(messageBtnCopy.innerHTML === 'Copied!'){
        return;
    }

    // Update button label
    messageBtnCopy.innerHTML = 'Copied!';

    // Revert button label after 2 seconds
    setTimeout(function(){
        messageBtnCopy.innerHTML = currentLabel;
        messageBtnCopy.classList.add('btn-warning');
        messageBtnCopy.classList.remove('btn-dark');
    }, 2000)
  })

  // X. Show the modal now
  modal.show();
}

/**
 * This method gets the current messages and stages from the onboarding
 * and fills in the input fields
 */
function updateDataInputs() {
  const stages = getOnboardingStages();
  const messages = getOnboardingMessages();

  stageInput.value = JSON.stringify(stages);
  messageInput.value = JSON.stringify(messages);

  console.log("CURRENTLY SAVED WOULD BE: ", { stages, messages });
}