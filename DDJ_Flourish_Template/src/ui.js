import * as d3 from 'd3';

export const setFont = ({name, url}) => {
    const font_link = document.createElement('link');
    font_link.setAttribute('rel', 'stylesheet');
    font_link.setAttribute('type', 'text/css');
    
    document.body.appendChild(font_link);

    font_link.setAttribute('href', url);
    document.body.style.fontFamily = name;
}

export const setUpBasicSettings = () => {
    // Set the min height of the textare
    d3.select('#setting-introText').style('height', '180px');
}

export const moveOnboardigBtn = (right, bottom) => {
    d3.select('.visahoi-navigation-container')
        .style('right', right + 'px')
        .style('bottom', bottom + 'px')
} 