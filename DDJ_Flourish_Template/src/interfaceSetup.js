import * as d3 from 'd3';

export const setFont = ({name, url}) => {
    const font_link = document.createElement('link');
    font_link.setAttribute('rel', 'stylesheet');
    font_link.setAttribute('type', 'text/css');
    
    document.body.appendChild(font_link);

    font_link.setAttribute('href', url);
    document.body.style.fontFamily = name;
}