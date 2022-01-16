import { createTreemap, clearTreemap } from './src/treemap';
import { type } from '@antv/dw-analyzer';
// import data from './src/data/sample.json';
import dataJobs from './src/data/usaJobsPlan.json';
import dataFamilies from './src/data/usaFamiliesPlan.json';

import './style.css';

/**
 * Treemaps
 */

const charts = () => {
    // Chart width and heights
    const width = (window.innerWidth / 2) - 20;
    const height = (window.innerHeight * 0.9);
    
    // Jobs Plan Treemap
    createTreemap('#chart', dataJobs, undefined, { width, height });
    
    // Families Plan Treemap
    createTreemap('#chart2', dataFamilies, undefined, { width, height });
};

charts();

window.onresize = () => {
    clearTreemap('#chart');
    clearTreemap('#chart2');
    charts();
};

/**
 * Data Analysis
 */
console.log('DataWizard- AntV', type([dataJobs]));
