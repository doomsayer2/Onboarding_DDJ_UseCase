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

// Chart width and heights
const width = (window.innerWidth / 2) - 20;
const height = (window.innerHeight * 0.7);

// Jobs Plan Treemap
createTreemap('#chart', dataJobs, undefined, { width, height });

// Families Plan Treemap
createTreemap('#chart2', dataFamilies, undefined, { width, height });

/**
 * Data Analysis
 */
console.log('DataWizard- AntV', type([dataJobs]));
