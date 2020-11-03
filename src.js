
const domtosvg = require('dom-to-svg')

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(() => {
    let element = document.querySelector('#root')
    const svgDocument = domtosvg.elementToSVG(element);
    console.log(svgDocument)
})
