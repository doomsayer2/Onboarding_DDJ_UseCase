import * as d3 from 'd3';
import Swal from 'sweetalert2';

export const populateHtml = (selector, html) => {
  d3.select(selector).html(html);
};

export const convertToObject = (jsonString) => {
 return Function('"use strict";return (' + jsonString + ')')();
};

export const loadData = (dataURL) => {
  return d3.csv(Flourish.static_prefix + dataURL);
};

/**
 * This method creates a unique id for the given element in the given namespace if necessary.
 * Default is "visahoi". So an example would be "#isahoi-e333271d-f596-45cb-9c0f-aa2a7a14520e".
 * If the elment has already an ID it is returned by the method as we don't need to create a new one.
 * @param {*} el To attach the id to
 * @param {*} nameSpace To add to the id. Defaults to "visahoi"
 * @returns The newly created id selector string
 */
export const giveElUniqueId = (el, nameSpace = 'visahoi') => {
  const checkID = d3.select(el).attr('id');

  if (checkID) {
    return `#${checkID}`;
  } else {
    const uuid4 = `${nameSpace}-${uuidv4()}`;
    d3.select(el).attr('id', uuid4);

    return `#${uuid4}`;
  }
}

/**
 * This is just used to show the current environment of Flourish in the console.
 */
 export const showEnvironment = () => {
  const env = Flourish.environment;

  switch (env) {
    case 'sdk':
      console.log(
        `%c Current environment: ${env.toUpperCase()}`,
        'background-color: #BF616A; color: white; padding: 5px; font-size: 1.2em;'
      );
      break;
    case 'editor':
      console.log(
        `%c Current environment: ${env.toUpperCase()}`,
        'background-color: #D08770; color: white; padding: 5px; font-size: 1.2em;'
      );
      break;
    case 'story_editor':
      console.log(
        `%c Current environment: ${env.toUpperCase()}`,
        'background-color: #EBCB8B; color: white; padding: 5px; font-size: 1.2em;'
      );
      break;
    case 'live':
      console.log(
        `%c Current environment: ${env.toUpperCase()}`,
        'background-color: #A3BE8C; color: white; padding: 5px; font-size: 1.2em;'
      );
      break;
    case 'preview':
      console.log(
        `%c Current environment: ${env.toUpperCase()}`,
        'background-color: #B48EAD; color: white; padding: 5px; font-size: 1.2em;'
      );
      break;
    case 'story_player':
      console.log(
        `%c Current environment: ${env.toUpperCase()}`,
        'background-color: #5E81AC; color: white; padding: 5px; font-size: 1.2em;'
      );
      break;
    default:
      break;
  }
};

/**
 * Just a loogger for the console with some stlyes.
 * @param {*} msg Message to log to console
 * @param {*} bgColor Background color in console
 * @param {*} color Font color in console
 */
export const logger = (msg, bgColor = 'transparent', color = 'white') => {
  const styling = `background-color: ${bgColor}; color: ${color}; font-size: 1.2em; padding: 4px;`;
  console.log(`%c${JSON.stringify(msg)}`, styling);
}

/**
 * Creates a toast message. If it is just called without any parameters it shows a default message of
 * "Hello World!" which lasts for 3000ms and is at the top-end of the screen with a success icon.
 * @param {string} msg Message to show in the toast
 * @param {number} timer Time in ms to show the mssage
 * @param {string} icon Icon of the toast. Available are: 'success', 'error', 'waring', 'info', 'question'
 * @param {string} position Position of the toast. Available are: 'top', 'top-start', 'top-end', 'center', 'center-start', 'center-end', 'bottom', 'bottom-start', 'bottom-end'
 */
export const toast = (msg = 'Hello World!', timer = 3000, icon = 'success', position = 'top-end') => {
  const Toast = Swal.mixin({
    toast: true,
    position,
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  Toast.fire({
    icon,
    text: msg
  });
}