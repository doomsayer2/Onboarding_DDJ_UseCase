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
 * This function is used to compare two objects by their values and also if they
 * are deep nested they are compared.
 * @param {Object} a First object to compare
 * @param {Object} b Second object to compare
 * @returns true if objects are equals - false otherwise
 */
export const equals = (a, b) => {
  if (a === b) return true;
  if (a instanceof Date && b instanceof Date)
    return a.getTime() === b.getTime();
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object'))
    return a === b;
  if (a.prototype !== b.prototype) return false;
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((k) => equals(a[k], b[k]));
};

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
};

/**
 * Creates a toast message. If it is just called without any parameters it shows a default message of
 * "Hello World!" which lasts for 3000ms and is at the top-end of the screen with a success icon.
 * @param {string} msg Message to show in the toast
 * @param {number} timer Time in ms to show the mssage
 * @param {string} icon Icon of the toast. Available are: 'success', 'error', 'waring', 'info', 'question'
 * @param {string} position Position of the toast. Available are: 'top', 'top-start', 'top-end', 'center', 'center-start', 'center-end', 'bottom', 'bottom-start', 'bottom-end'
 */
export const toast = (
  msg = 'Hello World!',
  timer = 3000,
  icon = 'success',
  position = 'top-end'
) => {
  const Toast = Swal.mixin({
    toast: true,
    position,
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon,
    text: msg,
  });
};

/**
 * This function is used to check the provided object for the list of properties provided. If
 * it contains all of them it is returning true otherwise false.
 * @param {Object} obj The object to check if it has the list of properties
 * @param {Array} props The properties that should be in the object
 * @returns true if all properties are in the object otherwise false
 */
export const checkObjectProps = (obj, props = []) => {
  // Doesn't need to check anything if the props array is empty or the object is not passed
  if (props.length === 0 || obj === null || !isLiteralObject(obj)) {
    return false;
  }

  return props.reduce((i, j) => i && j in obj, true); // Basically a nice reduce combined with the in functionality of objects
};

/**
 * Little helper function to check if an object is a literal object
 * @param {*} o Is the object to be checked
 * @returns true if it's a literal object, otherwise false
 */
const isLiteralObject = (o) => {
  return !!o && o.constructor === Object;
};
