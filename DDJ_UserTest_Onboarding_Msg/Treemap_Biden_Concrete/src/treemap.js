import * as d3 from 'd3';
// import { textwrap } from 'd3-textwrap';
import { tip as d3tip } from 'd3-v6-tip';
import { wrapTextInRect } from './util.js';

export const createTreemap = (
  elm,
  data,
  colorRange = [
    '#FFDAA3',
    '#FFAA91',
    '#BD7DA9',
    '#69659B',
    '#819ED1',
    '#B9DFDC',
  ],
  dimensions = {
    width: window.innerWidth * 0.8,
    height: window.innerHeight * 0.7,
  }
) => {
  // Set the dimensions and margins of the graph
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };
  const width = dimensions.width - margin.left - margin.right;
  const height = dimensions.height - margin.top - margin.bottom;

  // Color Scale
  const color = d3.scaleOrdinal().range(colorRange);

  // Opacity based on value
  const opacity = d3.scaleLinear().range([0.2, 1]);

  // Append the svg object to the body of the page
  const svg = d3
    .select(elm)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Give the data to this cluster layout
  // Here the size of each leave is given in the 'value' field in input data
  const root = d3.hierarchy(data).sum((d) => d.value);

  // Get the categories for the different colors
  const categories = root.data.children.map((e) => e.name);
  const categoryColors = root.data.children.map((e) => e.color);
  color.domain(categories);

  if (categoryColors !== []) {
    color.range(categoryColors);
  }

  // Get the min and max values
  const result = root.leaves().map((e) => e.value);
  opacity.domain(d3.extent(result));

  // Then d3.treemap computes the position of each element of the hierarchy
  d3
    .treemap()
    .size([width, height])
    .paddingTop(28)
    .paddingRight(7)
    .paddingInner(3)(root);

  // Add Rectangles
  const rects = svg
    .selectAll('rect')
    .data(root.leaves())
    .join('rect')
    .attr('x', (d) => d.x0)
    .attr('y', (d) => d.y0)
    .attr('width', (d) => d.x1 - d.x0)
    .attr('height', (d) => d.y1 - d.y0)
    .attr('title', (d) => `The value: ${d.data.value}`)
    .style('stroke', 'black')
    .style('fill', (d) => color(d.parent.data.name))
    // .style('opacity', (d) => opacity(d.data.value));
    .style('opacity', 0.5);

  // Add Textlabels
  svg
    .selectAll('text')
    .data(root.leaves())
    .join('text')
    .attr('class', 'info')
    .attr('x', (d) => d.x0 + 5) // +5 to adjust position (more right)
    .attr('y', (d) => d.y0 + 20) // +20 to adjust position (lower)
    .text((d) => d.data.name)
    .call(wrapTextInRect, 5)
    .attr('font-size', '9px')
    .attr('fill', '#2c3e50')
    .style('opacity', 0.7);

  // Add title for the 3 groups
  svg
    .selectAll('titles')
    .data(root.descendants().filter((d) => d.depth == 1))
    .enter()
    .append('text')
    .attr('x', (d) => d.x0)
    .attr('y', (d) => d.y0 + 21)
    .attr('font-size', '12px')
    .attr('fill', '#2c3e50')
    .append('tspan')
    .text((d) => d.data.name)
    .append('tspan')
    .text((d) => {
      return ` ${d.data.total}B`;
    })
    .attr('fill', '#c70000');

  // Text wrapping -- OLD
  // const wrap = textwrap().bounds({ height: 30, width: 40 }).method('tspans');
  // d3.select(elm).selectAll('.info').call(wrap);

  // Tooltips
  const tip = d3tip()
    .attr('class', 'd3-tip')
    .html(
      (EVENT, d) =>
        `<p><u>Description</u>: ${d.data.desc}</p><p><u>Value</u>: $${d.data.value}B</p>`
    );
  svg.call(tip);
  rects.on('mouseover', tip.show).on('mouseout', tip.hide);
};
