import * as d3 from 'd3';

export const populateHtml = (selector, html) => {
  d3.select(selector).html(html);
};

export const convertToObject = (jsonString) => {
 return Function('"use strict";return (' + jsonString + ')')();
};
