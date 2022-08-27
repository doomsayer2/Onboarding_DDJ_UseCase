import { rgbToHex, toast } from './utils/utils';
import {
  createBasicOnboardingMessage,
  createBasicOnboardingStage,
  deleteOnboardingStage,
  getOnboardingStages,
  setOnboardingStage,
} from '../static/lib/bundle.js';
import { onboarding } from './utils/store';
import { state } from './index';
import * as d3 from 'd3';

// All the elements of the dialog and others
// Elements for the first tab
let select = null;
let btnInspect = null;
let overlay = null;
let modalEl = null;
let xEl = null;
let yEl = null;
let modal = null;

// Elements for the second tab
// let sortList = null;
// let formStageEdit = null;
// let stageEditBtn = null;
// let cancelEditBtn = null;
// let editIdInput = null;
// let editTitleInput = null;
// let editColorInput = null;
// let editIconInput = null;

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
    fillDropdown(); // Refill the dropdown if something changed
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

  // sortList = document.getElementById('sortableList');
  // formStageEdit = document.getElementById('formStageEdit');
  // stageEditBtn = document.getElementById('btnEditStage');
  // cancelEditBtn = document.getElementById('btnEditCancel');
  // editIdInput = document.getElementById('editId');
  // editTitleInput = document.getElementById('editTitle');
  // editColorInput = document.getElementById('editColor');
  // editIconInput = document.getElementById('editIcon');

  // 2. Fill the dropdown with the stages and also the edit tab
  fillDropdown();
  // fillStageEditList();

  // 3. Add the form validation
  formValidation();
  // formValidationTab2Edit();

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

  // // 5. Bring functions to window scope for them to be used dynamically
  // window.editListItem = editListItem;
  // window.deleteListItem = deleteListItem;

  // 6. Show the modal now
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

// ============================================================
//                          ADD TAB
// ============================================================
/**
 * This function initializes the listeners for the form validation in the ADD tab
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
        // fillStageEditList(); // Fill also the stages edit tab again.
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
      onboardingMessages: state.messages,
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

// ============================================================
//                          EDIT TAB
// ============================================================

// /**
//  * This function is used to fill the stage edit list with all the stages available.
//  */
// function fillStageEditList() {
//   // Clear the old ones first
//   sortList.innerHTML = '';

//   // Fill the list with the stages
//   state.stages.forEach((stage) =>
//     sortList.insertAdjacentHTML('afterbegin', createListItem(stage))
//   );
// }

// /**
//  * This function creates a list item with the given object.
//  * @param {*} item The object holding the information of a list item
//  * @returns The html string for the list item
//  */
// function createListItem(item) {
//   return `<li data-id="${item.id}" class="list-group-item d-flex justify-content-between align-items-center">
//   <div class="col-3">
//     <span class="listDescription">Title:</span>
//     <span>${item.title}</span>
//   </div>  
//   <div class="col-3 d-inline-flex align-items-center">
//       <span class="listDescription">Color: </span>
//       <div style="width: 30px; height: 30px; background-color: ${item.backgroundColor}" class="rounded-circle"></div>
//     </div>
//     <div class="col-3">
//       <span class="listDescription">Icon:</span>
//       <i class="${item.iconClass}"></i>
//     </div>
//     <div class="col-3">
//       <span class="listDescription">Actions:</span>
//       <a class="listMenuIcon" title="Edit Stage" onclick="editListItem(this, '${item.id}')"><i class="fas fa-edit"></i></a>
//       <a class="listMenuIcon" title="Delete Stage" onclick="deleteListItem(this, '${item.id}')"><i class="fas fa-trash-alt" style="color: #ef475f;"></i></a>
//     </div>
//   </li>`;
// }

// /**
//  * This function is called whenever a list item is edited. It fills the form with the respective data
//  * and requires the id of the stage to be edited.
//  * @param {string} id The id as string of the stage to be edited.
//  */
// function fillFormTab2Stages(id) {

// }

// /**
//  * This function initializes the form validation for the second tab. More precisely the form validation for 
//  * the edit tab form.
//  */
// function formValidationTab2Edit() {
//   // Listener for Stage Edit form button
//   stageEditBtn.addEventListener(
//     'click',
//     (event) => {
//       if (!formStageEdit.checkValidity()) {
//         event.preventDefault();
//         event.stopPropagation();

//         formStageEdit.classList.add('was-validated');
//       } else {
//         event.preventDefault();

//         // Get the values out
//         const elements = formStageEdit.elements;
//         const { id, title, backgroundColor, iconClass } = getFormVals(elements);

//         // Update the stage and everything else
//         updateStageInformation();
//         setOnboardingStage({
//           id,
//           title,
//           backgroundColor,
//           iconClass,
//           hoverBackgroundColor: backgroundColor,
//           activeBackgroundColor: backgroundColor,
//         });

//         // Reset the form to previous state
//         formStageEdit.classList.remove('was-validated');
//         formStageEdit.reset();

//         // Hide the form
//         d3.select('#formStageEdit')
//           .transition()
//           .duration(200)
//           .style('opacity', 0);
//       }
//     },
//     false
//   );

//   // Listener for Cancel button
//   cancelEditBtn.addEventListener('click', (event) => {
//     event.preventDefault();
//     event.stopPropagation();

//     d3.select('#formStageEdit').transition().duration(200).style('opacity', 0);
//   });
// }

// /**
//  * This function deletes a onbaording stage from the onboarding and also from the list it will be removed
//  * @param {*} elm The current list element
//  * @param {*} id The id of the onboarding stage to be removed
//  */
// function deleteListItem(elm, id) {
//   // Remove the stage itself
//   deleteOnboardingStage(id);
//   // Update the state
//   state.stages = getOnboardingStages();
//   // Remove the element itself
//   elm.parentElement.parentElement.remove();
//   // Update the other forms dropdown
//   fillDropdown();
// }

// /**
//  * This function fills the form with the current stage and shows it
//  * @param {*} elm The current list element
//  * @param {*} id The id of the onboarding stage to be edited
//  */
// function editListItem(elm, id) {
//   const currentStage = state.stages.find((e) => e.id === id);

//   editIdInput.value = id;
//   editTitleInput.value = currentStage.title;
//   editColorInput.value =
//     rgbToHex(currentStage.backgroundColor) || currentStage.backgroundColor;
//   editIconInput.value = currentStage.iconClass;

//   d3.select('#formStageEdit').transition().duration(200).style('opacity', 1);
// }

// /**
//  * This function updates the stage information everywhere whenever
//  * we change one stage.
//  */
// function updateStageInformation() {
//   state.stages = getOnboardingStages();

//   // Just wait for the other changes to take effect
//   setTimeout(() => {
//     fillStageEditList();
//     fillDropdown();
//   }, 1);
// }
