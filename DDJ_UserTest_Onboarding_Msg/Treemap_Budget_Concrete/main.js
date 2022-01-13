import { createTreemap } from './src/treemap';
import { type } from '@antv/dw-analyzer';
// import data from './src/data/sample.json';
import dataBudget from './src/data/budgetFinance.json';

import './style.css';

/**
 * Treemaps
 */

// Sample Treemap
// createTreemap('#chart', data);

// Chart width and heights
const width = (window.innerWidth / 2) - 20;
const height = (window.innerHeight * 0.9);

// Budget Treemap
createTreemap('#chart', dataBudget, undefined, { width, height });

/**
 * Data Analysis
 */
console.log('DataWizard- AntV', type([dataBudget]));
