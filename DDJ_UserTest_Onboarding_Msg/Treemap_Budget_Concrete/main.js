import { createTreemap, clearTreemap } from './src/treemap';
import { type } from '@antv/dw-analyzer';
// import data from './src/data/sample.json';
import dataBudget from './src/data/budgetFinance.json';

import './style.css';

/**
 * Treemaps
 */

const charts = () => {
    // Chart width and heights
    const width = (window.innerWidth / 2) - 20;
    const height = (window.innerHeight * 0.9);
    
    // Budget Treemap
    createTreemap('#chart', dataBudget, undefined, { width, height });
};

charts();

window.onresize = () => {
    clearTreemap('#chart');
    charts();
};

/**
 * Data Analysis
 */
console.log('DataWizard- AntV', type([dataBudget]));
