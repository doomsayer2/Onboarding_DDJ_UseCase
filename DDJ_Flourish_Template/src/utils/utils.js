import * as d3 from 'd3';

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
