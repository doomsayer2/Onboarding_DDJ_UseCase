import { createTreemap } from './src/treemap';
import { type } from '@antv/dw-analyzer';
// import data from './src/data/sample.json';
import dataJobs from './src/data/usaJobsPlan.json';
import dataFamilies from './src/data/usaFamiliesPlan.json';

import './style.css';

/**
 * Treemaps
 */

// Sample Treemap
// createTreemap('#chart', data);

// Jobs Plan Treemap
const colors = ['#e63946', '#f1faee', '#a8dadc', '#457b9d', '#ade8f4'];
createTreemap('#chart', dataJobs, colors);

// Families Plan Treemap
createTreemap('#chart2', dataFamilies);

/**
 * Data Analysis
 */
console.log('DataWizard- AntV', type([dataJobs]));
