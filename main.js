(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAccessibilityAttributes = getAccessibilityAttributes;

var _dom = require("./dom");

const isStandaloneFooter = element => !element.closest('article, aside, main, nav, section, [role="article"], [role="complementary"], [role="main"], [role="navigation"], [role="region"]');

function getAccessibilityAttributes(element, {
  labels,
  getUniqueId
}) {
  var _element$parentElemen, _element$parentElemen2, _element$parentElemen3;

  // https://www.w3.org/TR/html-aria/
  const attributes = new Map();

  switch (element.tagName) {
    case 'A':
      attributes.set('role', 'link');
      break;

    case 'ARTICLE':
      attributes.set('role', 'article');
      break;

    case 'ASIDE':
      attributes.set('role', 'complementary');
      break;

    case 'BODY':
      attributes.set('role', 'document');
      break;

    case 'BUTTON':
    case 'SUMMARY':
      attributes.set('role', 'button');
      break;

    case 'DD':
      attributes.set('role', 'definition');
      break;

    case 'DETAILS':
      attributes.set('role', 'group');
      break;

    case 'DFN':
      attributes.set('role', 'term');
      break;

    case 'DIALOG':
      attributes.set('role', 'dialog');
      break;

    case 'DT':
      attributes.set('role', 'term');
      break;

    case 'FIELDSET':
      attributes.set('role', 'group');
      break;

    case 'FIGURE':
      attributes.set('role', 'figure');
      break;

    case 'FOOTER':
      if (isStandaloneFooter(element)) {
        attributes.set('role', 'contentinfo');
      }

      break;

    case 'FORM':
      attributes.set('role', 'form');
      break;

    case 'H1':
    case 'H2':
    case 'H3':
    case 'H4':
    case 'H5':
    case 'H6':
      attributes.set('role', 'heading');
      attributes.set('aria-level', element.tagName.slice(1));
      break;

    case 'HEADER':
      if (isStandaloneFooter(element)) {
        attributes.set('role', 'banner');
      }

      break;

    case 'HR':
      attributes.set('role', 'separator');
      break;

    case 'IMG':
      {
        const alt = element.getAttribute('alt');

        if (alt === null || alt !== '') {
          attributes.set('role', 'img');

          if (alt) {
            attributes.set('aria-label', alt);
          }
        }

        break;
      }

    case 'INPUT':
      switch (element.type) {
        case 'button':
        case 'image':
        case 'reset':
        case 'submit':
          attributes.set('role', 'button');
          break;

        case 'number':
          attributes.set('role', 'spinbutton');
          break;

        case 'range':
          attributes.set('role', 'slider');
          break;

        case 'checkbox':
          attributes.set('role', 'checkbox');
          break;

        case 'radio':
          attributes.set('role', 'radio');
          break;

        case 'email':
        case 'tel':
          if (!element.hasAttribute('list')) {
            attributes.set('role', 'textbox');
          }

          break;
      }

      break;

    case 'LI':
      if (((_element$parentElemen = element.parentElement) === null || _element$parentElemen === void 0 ? void 0 : _element$parentElemen.tagName) === 'OL' || ((_element$parentElemen2 = element.parentElement) === null || _element$parentElemen2 === void 0 ? void 0 : _element$parentElemen2.tagName) === 'UL' || ((_element$parentElemen3 = element.parentElement) === null || _element$parentElemen3 === void 0 ? void 0 : _element$parentElemen3.tagName) === 'MENU') {
        attributes.set('role', 'listitem');
      }

      break;

    case 'LINK':
      if (element.href) {
        attributes.set('role', 'link');
      }

      break;

    case 'MAIN':
      attributes.set('role', 'main');
      break;

    case 'MATH':
      attributes.set('role', 'math');
      break;

    case 'OL':
    case 'UL':
    case 'MENU':
      attributes.set('role', 'list');
      break;

    case 'NAV':
      attributes.set('role', 'navigation');
      break;

    case 'OPTION':
      attributes.set('role', 'option');
      break;

    case 'PROGRESS':
      attributes.set('role', 'progressbar');
      break;

    case 'SECTION':
      attributes.set('role', 'region');
      break;

    case 'SELECT':
      attributes.set('role', !element.hasAttribute('multiple') && element.size <= 1 ? 'combobox' : 'listbox');
      break;

    case 'TABLE':
      attributes.set('role', 'table');
      break;

    case 'THEAD':
    case 'TBODY':
    case 'TFOOT':
      attributes.set('role', 'rowgroup');
      break;

    case 'TEXTAREA':
      attributes.set('role', 'textbox');
      break;

    case 'TD':
      attributes.set('role', 'cell');
      break;

    case 'TH':
      attributes.set('role', element.closest('thead') ? 'columnheader' : 'rowheader');
      break;

    case 'TR':
      attributes.set('role', 'tablerow');
      break;
  }

  if (element.hasAttribute('disabled')) {
    attributes.set('aria-disabled', 'true');
  }

  if (element.hasAttribute('placeholder')) {
    attributes.set('aria-placeholder', element.getAttribute('placeholder') || '');
  }

  const tabIndex = element.getAttribute('tabindex');

  if (tabIndex) {
    attributes.set('tabindex', tabIndex);
  }

  if ((0, _dom.isHTMLElement)(element) && (0, _dom.hasLabels)(element) && element.labels) {
    // Need to invert the label[for] / [aria-labelledby] relationship
    attributes.set('aria-labelledby', [...element.labels].map(label => {
      let labelId = label.id || labels.get(label);

      if (!labelId) {
        labelId = 'label' + getUniqueId();
        labels.set(label, labelId);
      }

      return labelId;
    }).join(' '));
  }

  for (const attribute of element.attributes) {
    if (attribute.name.startsWith('aria-')) {
      attributes.set(attribute.name, attribute.value);
    }
  }

  const customRole = element.getAttribute('role');

  if (customRole) {
    attributes.set('role', customRole);
  }

  return attributes;
}

},{"./dom":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseFontFaceSourceUrls = parseFontFaceSourceUrls;
exports.parseCSSLength = parseCSSLength;
exports.parseCssString = parseCssString;
exports.parseUrlReference = parseUrlReference;
exports.parseFormatSpecifier = parseFormatSpecifier;
exports.parseLocalReference = parseLocalReference;
exports.copyCssStyles = copyCssStyles;
exports.isVisible = exports.hasUniformBorderRadius = exports.hasUniformBorder = exports.isTransparent = exports.isInFlow = exports.isPositioned = exports.isInline = exports.isCSSFontFaceRule = void 0;

var _util = require("./util");

const isCSSFontFaceRule = rule => rule.type === CSSRule.FONT_FACE_RULE;

exports.isCSSFontFaceRule = isCSSFontFaceRule;

function parseFontFaceSourceUrls(source) {
  const fonts = source.split(/,\s*/);
  return fonts.map(font => {
    const tokens = {};

    for (const token of font.trim().split(/\s+/)) {
      if (token.startsWith('local(')) {
        tokens.local = parseLocalReference(token);
      }

      if (token.startsWith('url(')) {
        tokens.url = parseUrlReference(token);
      }

      if (token.startsWith('format(')) {
        tokens.format = parseFormatSpecifier(token);
      }
    }

    if (tokens.url) {
      return {
        url: tokens.url,
        format: tokens.format
      };
    }

    if (tokens.local) {
      return {
        local: tokens.local
      };
    }
  }).filter(_util.isDefined);
}

const isInline = styles => styles.displayOutside === 'inline' || styles.display.startsWith('inline-');

exports.isInline = isInline;

const isPositioned = styles => styles.position !== 'static';

exports.isPositioned = isPositioned;

const isInFlow = styles => styles.float !== 'none' && styles.position !== 'absolute' && styles.position !== 'fixed';

exports.isInFlow = isInFlow;

const isTransparent = color => color === 'transparent' || color === 'rgba(0, 0, 0, 0)';

exports.isTransparent = isTransparent;

const hasUniformBorder = styles => parseInt(styles.borderTopWidth, 10) !== 10 && styles.borderTopStyle !== 'none' && styles.borderTopStyle !== 'inset' && styles.borderTopStyle !== 'outset' && !isTransparent(styles.borderTopColor) && styles.borderTop === styles.borderLeft && styles.borderTop === styles.borderRight && styles.borderTop === styles.borderBottom;

exports.hasUniformBorder = hasUniformBorder;

const hasUniformBorderRadius = styles => styles.borderTopLeftRadius === styles.borderTopRightRadius && styles.borderTopLeftRadius === styles.borderBottomLeftRadius && styles.borderTopLeftRadius === styles.borderBottomRightRadius;

exports.hasUniformBorderRadius = hasUniformBorderRadius;

const isVisible = styles => styles.displayOutside !== 'none' && styles.display !== 'none' && styles.visibility !== 'hidden' && styles.opacity !== '0';

exports.isVisible = isVisible;

function parseCSSLength(length, containerLength) {
  if (length.endsWith('px')) {
    return parseFloat(length);
  }

  if (length.endsWith('%')) {
    return parseFloat(length) / 100 * containerLength;
  }

  return undefined;
}

function parseCssString(value) {
  const match = value.match(/^\s*(?:'(.*)'|"(.*)")\s*$/);

  if (!match) {
    throw new Error(`Invalid CSS string: ${value}`);
  }

  return (match[1] || match[2]).replace(/\\(.)/g, '$1');
}

function parseUrlReference(reference) {
  var _ref, _match$;

  const match = reference.match(/url\((?:'(.*)'|"(.*)"|(.*))\)/);

  if (!match) {
    throw new URIError('Invalid URL ' + JSON.stringify(reference));
  }

  return ((_ref = (_match$ = match[1]) !== null && _match$ !== void 0 ? _match$ : match[2]) !== null && _ref !== void 0 ? _ref : match[3]).replace(/\\(.)/g, '$1');
}

function parseFormatSpecifier(format) {
  var _ref2, _match$2;

  const match = format.match(/format\((?:'(.*)'|"(.*)"|(.*))\)/);

  if (!match) {
    throw new Error('Invalid format() ' + JSON.stringify(format));
  }

  return ((_ref2 = (_match$2 = match[1]) !== null && _match$2 !== void 0 ? _match$2 : match[2]) !== null && _ref2 !== void 0 ? _ref2 : match[3]).replace(/\\(.)/g, '$1');
}

function parseLocalReference(format) {
  var _ref3, _match$3;

  const match = format.match(/local\((?:'(.*)'|"(.*)"|(.*))\)/);

  if (!match) {
    throw new Error('Invalid local() ' + JSON.stringify(format));
  }

  return ((_ref3 = (_match$3 = match[1]) !== null && _match$3 !== void 0 ? _match$3 : match[2]) !== null && _ref3 !== void 0 ? _ref3 : match[3]).replace(/\\(.)/g, '$1');
}

function copyCssStyles(from, to) {
  for (const property of from) {
    to.setProperty(property, to.getPropertyValue(property), to.getPropertyPriority(property));
  }
}

},{"./util":11}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.traverseDOM = traverseDOM;
exports.hasLabels = exports.isSVGStyleElement = exports.isSVGImageElement = exports.isHTMLInputElement = exports.isHTMLImageElement = exports.isHTMLLabelElement = exports.isHTMLAnchorElement = exports.isCommentNode = exports.isTextNode = exports.isSVGElement = exports.isHTMLElement = exports.isElement = exports.xhtmlNamespace = exports.xlinkNamespace = exports.svgNamespace = void 0;
const svgNamespace = 'http://www.w3.org/2000/svg';
exports.svgNamespace = svgNamespace;
const xlinkNamespace = 'http://www.w3.org/1999/xlink';
exports.xlinkNamespace = xlinkNamespace;
const xhtmlNamespace = 'http://www.w3.org/1999/xhtml';
exports.xhtmlNamespace = xhtmlNamespace;

const isElement = node => node.nodeType === Node.ELEMENT_NODE;

exports.isElement = isElement;

const isHTMLElement = element => element.namespaceURI === xhtmlNamespace;

exports.isHTMLElement = isHTMLElement;

const isSVGElement = element => element.namespaceURI === svgNamespace;

exports.isSVGElement = isSVGElement;

const isTextNode = node => node.nodeType === Node.TEXT_NODE;

exports.isTextNode = isTextNode;

const isCommentNode = node => node.nodeType === Node.COMMENT_NODE;

exports.isCommentNode = isCommentNode;

const isHTMLAnchorElement = element => element.tagName === 'A' && isHTMLElement(element);

exports.isHTMLAnchorElement = isHTMLAnchorElement;

const isHTMLLabelElement = element => element.tagName === 'LABEL' && isHTMLElement(element);

exports.isHTMLLabelElement = isHTMLLabelElement;

const isHTMLImageElement = element => element.tagName === 'IMG' && isHTMLElement(element);

exports.isHTMLImageElement = isHTMLImageElement;

const isHTMLInputElement = element => element.tagName === 'INPUT' && isHTMLElement(element);

exports.isHTMLInputElement = isHTMLInputElement;

const isSVGImageElement = element => element.tagName === 'image' && isSVGElement(element);

exports.isSVGImageElement = isSVGImageElement;

const isSVGStyleElement = element => element.tagName === 'style' && isSVGElement(element);

exports.isSVGStyleElement = isSVGStyleElement;

const hasLabels = element => 'labels' in element;

exports.hasLabels = hasLabels;

function* traverseDOM(node, shouldEnter = () => true) {
  yield node;

  if (shouldEnter(node)) {
    for (const childNode of node.childNodes) {
      yield* traverseDOM(childNode);
    }
  }
}

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleElement = handleElement;

var _dom = require("./dom");

var _accessibility = require("./accessibility");

var _traversal = require("./traversal");

var _stacking = require("./stacking");

var _css = require("./css");

var _text = require("./text");

var _util = require("./util");

function handleElement(element, context) {
  const cleanupFunctions = [];

  try {
    const window = element.ownerDocument.defaultView;

    if (!window) {
      throw new Error("Element's ownerDocument has no defaultView");
    }

    const bounds = element.getBoundingClientRect(); // Includes borders

    if (!(0, _util.doRectanglesIntersect)(bounds, context.captureArea)) {
      return;
    }

    const styles = window.getComputedStyle(element);
    const parentStyles = element.parentElement && window.getComputedStyle(element.parentElement);
    const svgContainer = (0, _dom.isHTMLAnchorElement)(element) ? createSvgAnchor(element, context) : context.svgDocument.createElementNS(_dom.svgNamespace, 'g'); // Add IDs, classes, debug info

    svgContainer.dataset.tag = element.tagName.toLowerCase();
    const id = element.id || (element.classList[0] || element.tagName.toLowerCase()) + context.getUniqueId();
    svgContainer.id = id;
    const className = element.getAttribute('class');

    if (className) {
      svgContainer.setAttribute('class', className);
    } // Which parent should the container itself be appended to?


    const stackingLayerName = (0, _stacking.determineStackingLayer)(styles, parentStyles);
    const stackingLayer = stackingLayerName ? context.stackingLayers[stackingLayerName] : context.parentStackingLayer;

    if (stackingLayer) {
      context.currentSvgParent.setAttribute('aria-owns', [context.currentSvgParent.getAttribute('aria-owns'), svgContainer.id].filter(Boolean).join(' '));
    } // If the parent is within the same stacking layer, append to the parent.
    // Otherwise append to the right stacking layer.


    const elementToAppendTo = context.parentStackingLayer === stackingLayer ? context.currentSvgParent : stackingLayer;
    svgContainer.dataset.zIndex = styles.zIndex; // Used for sorting

    elementToAppendTo.append(svgContainer); // If the element establishes a stacking context, create subgroups for each stacking layer.

    let childContext;
    let backgroundContainer;
    let ownStackingLayers;

    if ((0, _stacking.establishesStackingContext)(styles, parentStyles)) {
      ownStackingLayers = (0, _stacking.createStackingLayers)(svgContainer);
      backgroundContainer = ownStackingLayers.rootBackgroundAndBorders;
      childContext = { ...context,
        currentSvgParent: svgContainer,
        stackingLayers: ownStackingLayers,
        parentStackingLayer: stackingLayer
      };
    } else {
      backgroundContainer = svgContainer;
      childContext = { ...context,
        currentSvgParent: svgContainer,
        parentStackingLayer: stackingLayer
      };
    } // Accessibility


    for (const [name, value] of (0, _accessibility.getAccessibilityAttributes)(element, context)) {
      svgContainer.setAttribute(name, value);
    }

    const handlePseudoElement = (pseudoSelector, position) => {
      const pseudoElementStyles = window.getComputedStyle(element, pseudoSelector);

      if (pseudoElementStyles.content !== 'none') {
        // Pseudo elements are inline by default (like a span)
        const span = element.ownerDocument.createElement('span');
        (0, _css.copyCssStyles)(pseudoElementStyles, span.style);
        span.textContent = (0, _css.parseCssString)(pseudoElementStyles.content);
        const style = element.ownerDocument.createElement('style');
        style.innerHTML = `#${id}${pseudoSelector} { display: none; }`;
        element.before(style);
        cleanupFunctions.push(() => style.remove());
        element[position](span);
        cleanupFunctions.push(() => span.remove());
      }
    };

    handlePseudoElement('::before', 'prepend');
    handlePseudoElement('::after', 'append'); // TODO handle ::marker etc

    addBackgroundAndBorders(styles, bounds, backgroundContainer, window, context); // If element is overflow: hidden, create a clipping rectangle to hide any overflowing content of any descendants

    let clipPath;

    if (styles.overflow !== 'visible') {
      clipPath = context.svgDocument.createElementNS(_dom.svgNamespace, 'clipPath');
      clipPath.id = 'clipPath' + context.getUniqueId();
      clipPath.append(createBox(bounds, context));
      svgContainer.before(clipPath);
      svgContainer.setAttribute('clip-path', `url(#${clipPath.id})`);
    }

    if ((0, _dom.isHTMLImageElement)(element)) {
      var _parseCSSLength, _parseCSSLength2, _parseCSSLength3, _parseCSSLength4;

      const svgImage = context.svgDocument.createElementNS(_dom.svgNamespace, 'image');
      svgImage.setAttribute('href', element.src);
      const paddingLeft = (_parseCSSLength = (0, _css.parseCSSLength)(styles.paddingLeft, bounds.width)) !== null && _parseCSSLength !== void 0 ? _parseCSSLength : 0;
      const paddingRight = (_parseCSSLength2 = (0, _css.parseCSSLength)(styles.paddingRight, bounds.width)) !== null && _parseCSSLength2 !== void 0 ? _parseCSSLength2 : 0;
      const paddingTop = (_parseCSSLength3 = (0, _css.parseCSSLength)(styles.paddingTop, bounds.height)) !== null && _parseCSSLength3 !== void 0 ? _parseCSSLength3 : 0;
      const paddingBottom = (_parseCSSLength4 = (0, _css.parseCSSLength)(styles.paddingBottom, bounds.height)) !== null && _parseCSSLength4 !== void 0 ? _parseCSSLength4 : 0;
      svgImage.setAttribute('x', (bounds.x + paddingLeft).toString());
      svgImage.setAttribute('y', (bounds.y + paddingTop).toString());
      svgImage.setAttribute('width', (bounds.width - paddingLeft - paddingRight).toString());
      svgImage.setAttribute('height', (bounds.height - paddingTop - paddingBottom).toString());

      if (element.alt) {
        svgImage.setAttribute('aria-label', element.alt);
      }

      svgContainer.append(svgImage);
    } else if ((0, _dom.isHTMLInputElement)(element) && bounds.width > 0 && bounds.height > 0) {
      // Handle button labels or input field content
      if (element.value) {
        var _parseCSSLength5, _parseCSSLength6, _parseCSSLength7;

        const svgTextElement = context.svgDocument.createElementNS(_dom.svgNamespace, 'text');
        svgTextElement.setAttribute('dominant-baseline', 'central');
        svgTextElement.setAttribute('xml:space', 'preserve');
        svgTextElement.setAttribute('x', (bounds.x + ((_parseCSSLength5 = (0, _css.parseCSSLength)(styles.paddingLeft, bounds.width)) !== null && _parseCSSLength5 !== void 0 ? _parseCSSLength5 : 0)).toString());
        const top = bounds.top + ((_parseCSSLength6 = (0, _css.parseCSSLength)(styles.paddingTop, bounds.height)) !== null && _parseCSSLength6 !== void 0 ? _parseCSSLength6 : 0);
        const bottom = bounds.bottom + ((_parseCSSLength7 = (0, _css.parseCSSLength)(styles.paddingBottom, bounds.height)) !== null && _parseCSSLength7 !== void 0 ? _parseCSSLength7 : 0);
        const middle = (top + bottom) / 2;
        svgTextElement.setAttribute('y', middle.toString());
        svgTextElement.textContent = element.value;
        (0, _text.assignTextStyles)(styles, svgTextElement);
        childContext.stackingLayers.inFlowInlineLevelNonPositionedDescendants.append(svgTextElement);
      }
    } else if (element.tagName === 'svg') {
      // Embed SVG, don't traverse contents
      // TODO walk contents to inline resources
      const clonedSvg = element.cloneNode(true);
      clonedSvg.setAttribute('x', bounds.x.toString());
      clonedSvg.setAttribute('y', bounds.y.toString());
      clonedSvg.setAttribute('width', bounds.width.toString());
      clonedSvg.setAttribute('height', bounds.height.toString());
      clonedSvg.style.color = styles.color; // handle fill or stroke referencing currentColor keyword

      elementToAppendTo.append(clonedSvg);
    } else if (element.tagName !== 'IFRAME') {
      for (const child of element.childNodes) {
        (0, _traversal.walkNode)(child, childContext);
      }

      if (ownStackingLayers) {
        (0, _stacking.sortStackingLayerChildren)(ownStackingLayers);
      }
    }
  } finally {
    for (const cleanup of cleanupFunctions) {
      cleanup();
    }
  }
}

function addBackgroundAndBorders(styles, bounds, backgroundAndBordersContainer, window, context) {
  if ((0, _css.isVisible)(styles)) {
    if (bounds.width > 0 && bounds.height > 0 && (!(0, _css.isTransparent)(styles.backgroundColor) || (0, _css.hasUniformBorder)(styles) || styles.backgroundImage !== 'none')) {
      const box = createBackgroundAndBorderBox(bounds, styles, context);
      backgroundAndBordersContainer.append(box); // TODO handle linear-gradient() and multiple (stacked) backgrounds

      if (styles.backgroundImage !== 'none' && styles.backgroundImage.trim().startsWith('url(')) {
        const image = context.svgDocument.createElementNS(_dom.svgNamespace, 'image');
        const [width, height = 'auto'] = styles.backgroundSize.split(' ');
        image.setAttribute('x', bounds.x.toString());
        image.setAttribute('y', bounds.y.toString());
        image.setAttribute('width', getBackgroundSizeDimension(width, bounds.width).toString());
        image.setAttribute('height', getBackgroundSizeDimension(height, bounds.height).toString());

        if (width !== 'auto' && height !== 'auto') {
          image.setAttribute('preserveAspectRatio', 'none');
        } else if (styles.backgroundSize === 'contain') {
          image.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        } else if (styles.backgroundSize === 'cover') {
          image.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        } // Technically not correct, because relative URLs should be resolved relative to the stylesheet,
        // not the page. But we have no means to know what stylesheet the style came from.


        const url = new URL((0, _css.parseUrlReference)(styles.backgroundImage), window.location.href);
        image.setAttribute('href', url.href);

        if (styles.backgroundRepeat === 'no-repeat') {
          backgroundAndBordersContainer.append(image);
        } else {
          const pattern = context.svgDocument.createElementNS(_dom.svgNamespace, 'pattern');
          pattern.setAttribute('patternUnits', 'userSpaceOnUse');
          pattern.id = 'pattern' + context.getUniqueId();
          pattern.append(image);
          box.before(pattern);
          box.setAttribute('fill', `url(#${pattern.id})`);
        }
      }
    }

    if (!(0, _css.hasUniformBorder)(styles)) {
      // Draw lines for each border
      for (const borderLine of createBorders(styles, bounds, context)) {
        backgroundAndBordersContainer.append(borderLine);
      }
    }
  }
}

function getBackgroundSizeDimension(size, elementSize) {
  if (size === 'auto') {
    // Let preserveAspectRatio handle scaling
    return elementSize;
  }

  if (size.endsWith('px')) {
    return parseFloat(size);
  }

  if (size.endsWith('%')) {
    // TODO this needs to account for padding (except if background-origin is set)
    return parseFloat(size) / 100 * elementSize;
  } // Fallback


  console.warn('Unknown background-size value', size);
  return elementSize;
}

function createBox(bounds, context) {
  const box = context.svgDocument.createElementNS(_dom.svgNamespace, 'rect'); // TODO consider rotation

  box.setAttribute('width', bounds.width.toString());
  box.setAttribute('height', bounds.height.toString());
  box.setAttribute('x', bounds.x.toString());
  box.setAttribute('y', bounds.y.toString());
  return box;
}

function createBackgroundAndBorderBox(bounds, styles, context) {
  const background = createBox(bounds, context); // TODO handle background image and other properties

  if (styles.backgroundColor) {
    background.setAttribute('fill', styles.backgroundColor);
  }

  if ((0, _css.hasUniformBorder)(styles)) {
    // Uniform border, use stroke
    background.setAttribute('stroke', styles.borderColor);
    background.setAttribute('stroke-width', styles.borderWidth);

    if (styles.borderStyle === 'dashed') {
      // > Displays a series of short square-ended dashes or line segments.
      // > The exact size and length of the segments are not defined by the specification and are implementation-specific.
      background.setAttribute('stroke-dasharray', '1');
    }
  }

  if ((0, _css.hasUniformBorderRadius)(styles)) {
    background.setAttribute('rx', styles.borderRadius);
    background.setAttribute('ry', styles.borderRadius);
  }

  return background;
}

function* createBorders(styles, bounds, context) {
  for (const side of ['top', 'bottom', 'right', 'left']) {
    if (hasBorder(styles, side)) {
      yield createBorder(styles, bounds, side, context);
    }
  }
}

function hasBorder(styles, side) {
  return !!styles.getPropertyValue(`border-${side}-color`) && !(0, _css.isTransparent)(styles.getPropertyValue(`border-${side}-color`)) && styles.getPropertyValue(`border-${side}-width`) !== '0px';
}

function createBorder(styles, bounds, side, context) {
  // TODO handle border-radius for non-uniform borders
  const border = context.svgDocument.createElementNS(_dom.svgNamespace, 'line');
  border.setAttribute('stroke-linecap', 'square');
  const color = styles.getPropertyValue(`border-${side}-color`);
  border.setAttribute('stroke', color);
  border.setAttribute('stroke-width', styles.getPropertyValue(`border-${side}-width`)); // Handle inset/outset borders

  const borderStyle = styles.getPropertyValue(`border-${side}-style`);

  if (borderStyle === 'inset' && (side === 'top' || side === 'left') || borderStyle === 'outset' && (side === 'right' || side === 'bottom')) {
    const match = color.match(/rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/);

    if (!match) {
      throw new Error(`Unexpected color: ${color}`);
    }

    const components = match.slice(1, 4).map(value => parseInt(value, 10) * 0.3);

    if (match[4]) {
      components.push(parseFloat(match[4]));
    } // Low-light border
    // https://stackoverflow.com/questions/4147940/how-do-browsers-determine-which-exact-colors-to-use-for-border-inset-or-outset


    border.setAttribute('stroke', `rgba(${components.join(', ')})`);
  }

  if (side === 'top') {
    border.setAttribute('x1', bounds.left.toString());
    border.setAttribute('x2', bounds.right.toString());
    border.setAttribute('y1', bounds.top.toString());
    border.setAttribute('y2', bounds.top.toString());
  } else if (side === 'left') {
    border.setAttribute('x1', bounds.left.toString());
    border.setAttribute('x2', bounds.left.toString());
    border.setAttribute('y1', bounds.top.toString());
    border.setAttribute('y2', bounds.bottom.toString());
  } else if (side === 'right') {
    border.setAttribute('x1', bounds.right.toString());
    border.setAttribute('x2', bounds.right.toString());
    border.setAttribute('y1', bounds.top.toString());
    border.setAttribute('y2', bounds.bottom.toString());
  } else if (side === 'bottom') {
    border.setAttribute('x1', bounds.left.toString());
    border.setAttribute('x2', bounds.right.toString());
    border.setAttribute('y1', bounds.bottom.toString());
    border.setAttribute('y2', bounds.bottom.toString());
  }

  return border;
}

function createSvgAnchor(element, context) {
  const svgAnchor = context.svgDocument.createElementNS(_dom.svgNamespace, 'a');

  if (element.href && !element.href.startsWith('javascript:')) {
    svgAnchor.setAttribute('href', element.href);
  }

  if (element.rel) {
    svgAnchor.setAttribute('rel', element.rel);
  }

  if (element.target) {
    svgAnchor.setAttribute('target', element.target);
  }

  if (element.download) {
    svgAnchor.setAttribute('download', element.download);
  }

  return svgAnchor;
}

},{"./accessibility":1,"./css":2,"./dom":3,"./stacking":8,"./text":9,"./traversal":10,"./util":11}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  documentToSVG: true,
  elementToSVG: true,
  inlineResources: true,
  fetchAsDataURL: true
};
exports.documentToSVG = documentToSVG;
exports.elementToSVG = elementToSVG;
exports.inlineResources = inlineResources;
Object.defineProperty(exports, "fetchAsDataURL", {
  enumerable: true,
  get: function () {
    return _inline.fetchAsDataURL;
  }
});

var _dom = require("./dom.js");

var _inline = require("./inline");

var _traversal = require("./traversal.js");

var _stacking = require("./stacking.js");

var _util = require("./util.js");

var _css = require("./css.js");

var _serialize = require("./serialize.js");

Object.keys(_serialize).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _serialize[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _serialize[key];
    }
  });
});

function documentToSVG(document, options) {
  return elementToSVG(document.documentElement, options);
}

function elementToSVG(element, options) {
  var _options$captureArea, _options$captureArea2;

  const svgDocument = element.ownerDocument.implementation.createDocument(_dom.svgNamespace, 'svg', null);
  const svgElement = svgDocument.documentElement;
  svgElement.setAttribute('xmlns', _dom.svgNamespace);
  svgElement.setAttribute('xmlns:xlink', _dom.xlinkNamespace);
  svgElement.append(svgDocument.createComment(` Generated by dom-to-svg from ${element.ownerDocument.location.href} `)); // Copy @font-face rules

  const styleElement = svgDocument.createElementNS(_dom.svgNamespace, 'style');

  for (const styleSheet of element.ownerDocument.styleSheets) {
    let rules;

    try {
      rules = styleSheet.rules;
    } catch (error) {
      console.error('Could not access rules of styleSheet', styleSheet, error);
    }

    for (const rule of (_rules = rules) !== null && _rules !== void 0 ? _rules : []) {
      var _rules;

      if ((0, _css.isCSSFontFaceRule)(rule)) {
        var _rule$parentStyleShee;

        const styleSheetHref = (_rule$parentStyleShee = rule.parentStyleSheet) === null || _rule$parentStyleShee === void 0 ? void 0 : _rule$parentStyleShee.href;

        if (styleSheetHref) {
          rule.style.src = (0, _css.parseFontFaceSourceUrls)(rule.style.src).map(source => 'url' in source ? { ...source,
            url: new URL(source.url, styleSheetHref)
          } : source).map(source => {
            if ('url' in source) {
              return `url(${source.url.href})` + (source.format ? ` format(${source.format})` : '');
            }

            return `local(${source.local})`;
          }).join(', ');
        }

        styleElement.append(rule.cssText, '\n');
      }
    }
  }

  svgElement.append(styleElement);
  (0, _traversal.walkNode)(element, {
    svgDocument,
    currentSvgParent: svgElement,
    stackingLayers: (0, _stacking.createStackingLayers)(svgElement),
    parentStackingLayer: svgElement,
    getUniqueId: (0, _util.createCounter)(),
    labels: new Map(),
    captureArea: (_options$captureArea = options === null || options === void 0 ? void 0 : options.captureArea) !== null && _options$captureArea !== void 0 ? _options$captureArea : element.getBoundingClientRect()
  });
  const bounds = (_options$captureArea2 = options === null || options === void 0 ? void 0 : options.captureArea) !== null && _options$captureArea2 !== void 0 ? _options$captureArea2 : element.getBoundingClientRect();
  svgElement.setAttribute('width', bounds.width.toString());
  svgElement.setAttribute('height', bounds.height.toString());
  svgElement.setAttribute('viewBox', `${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`);
  return svgDocument;
}

async function inlineResources(element, options = {}) {
  const {
    fetchAsDataURL = _inline.fetchAsDataURL
  } = options;

  if ((0, _dom.isSVGImageElement)(element)) {
    const dataURL = await fetchAsDataURL(element.href.baseVal);
    element.dataset.src = element.href.baseVal;
    element.setAttribute('href', dataURL.href);
  } else if ((0, _dom.isSVGStyleElement)(element) && element.sheet) {
    try {
      const rules = element.sheet.cssRules;

      for (const rule of rules) {
        if ((0, _css.isCSSFontFaceRule)(rule)) {
          const sources = (0, _css.parseFontFaceSourceUrls)(rule.style.src);
          const resolvedSources = await Promise.all(sources.map(async source => {
            if (!('url' in source)) {
              return source;
            }

            const dataUrl = await fetchAsDataURL(source.url);
            return { ...source,
              url: dataUrl
            };
          }));
          rule.style.src = resolvedSources.map(source => {
            if ('local' in source) {
              return source.local;
            }

            return [`url(${source.url.href})`, source.format && `format(${source.format})`].filter(Boolean).join(' ');
          }).join(', ');
        }
      }
    } catch (error) {
      console.error('Error inlining stylesheet', element.sheet, error);
    }
  }

  await Promise.all([...element.children].map(element => inlineResources(element, options)));
}

},{"./css.js":2,"./dom.js":3,"./inline":6,"./serialize.js":7,"./stacking.js":8,"./traversal.js":10,"./util.js":11}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchAsDataURL = fetchAsDataURL;

var _typeIs = require("type-is");

async function fetchAsDataURL(url, options = {}) {
  if (!url) {
    throw new Error('No URL passed');
  }

  const headers = new Headers();

  if (options.accept) {
    headers.set('Accept', options.accept.join(', '));
  }

  const response = await fetch(url, {
    headers
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const contentType = response.headers.get('Content-Type'); // Do an additional client-side check, in case the server does not handle the Accept header.

  if (options.accept && (!contentType || !(0, _typeIs.is)(contentType, options.accept))) {
    throw new Error(`Content-Type not accepted: ${String(contentType)}`);
  }

  const blob = await response.blob();
  const reader = new FileReader();
  await new Promise((resolve, reject) => {
    reader.addEventListener('error', () => reject(new Error('Error loading image')));
    reader.addEventListener('load', () => resolve());
    reader.readAsDataURL(blob);
  });
  return new URL(reader.result);
}

},{"type-is":16}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatXML = formatXML;

function formatXML(xmlDocument) {
  // describes how we want to modify the XML - indent everything
  // change to just text() to strip space in text nodes
  const xsltTextDocument = new DOMParser().parseFromString(`
			<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
			<xsl:strip-space elements="*"/>
			<xsl:template match="para[content-style][not(text())]">'
				<xsl:value-of select="normalize-space(.)"/>
			</xsl:template>
			<xsl:template match="node()|@*">
				<xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>
			</xsl:template>
			<xsl:output indent="yes"/>
			</xsl:stylesheet>
		`, 'application/xml');
  const xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xsltTextDocument);
  const formattedDocument = xsltProcessor.transformToDocument(xmlDocument);
  return formattedDocument;
}

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.establishesStackingContext = establishesStackingContext;
exports.createStackingLayers = createStackingLayers;
exports.determineStackingLayer = determineStackingLayer;
exports.sortChildrenByZIndex = sortChildrenByZIndex;
exports.sortStackingLayerChildren = sortStackingLayerChildren;

var _dom = require("./dom");

var _css = require("./css");

const stackingContextEstablishingProperties = new Set(['clipPath', 'contain', 'filter', 'isolation', 'mask', 'maskBorder', 'maskImage', 'mixBlendMode', 'opacity', 'perspective', 'position', 'transform', 'webkitOverflowScrolling', 'zIndex']);

function establishesStackingContext(styles, parentStyles) {
  // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
  return !!((styles.position === 'absolute' || styles.position === 'relative') && styles.zIndex !== 'auto' || styles.position === 'fixed' || styles.position === 'sticky' || parentStyles && (parentStyles.display === 'flex' || parentStyles.display === 'grid') && styles.zIndex !== 'auto' || parseFloat(styles.opacity) !== 1 || styles.mixBlendMode !== 'normal' || styles.transform !== 'none' || styles.filter !== 'none' || styles.perspective !== 'none' || styles.clipPath !== 'none' || styles.mask !== 'none' || styles.maskImage !== 'none' || styles.maskBorder !== 'none' || styles.isolation === 'isolate' || styles.webkitOverflowScrolling === 'touch' || styles.contain === 'layout' || styles.contain === 'paint' || styles.contain === 'strict' || styles.contain === 'content' || styles.willChange && styles.willChange.split(',').some(property => stackingContextEstablishingProperties.has(property.trim())));
}

function createStackingLayer(parent, layerName) {
  const layer = parent.ownerDocument.createElementNS(_dom.svgNamespace, 'g');
  layer.dataset.stackingLayer = layerName;
  parent.append(layer);
  return layer;
}

function createStackingLayers(container) {
  container.dataset.stackingContext = 'true';
  return {
    rootBackgroundAndBorders: createStackingLayer(container, 'rootBackgroundAndBorders'),
    childStackingContextsWithNegativeStackLevels: createStackingLayer(container, 'childStackingContextsWithNegativeStackLevels'),
    inFlowNonInlineNonPositionedDescendants: createStackingLayer(container, 'inFlowNonInlineNonPositionedDescendants'),
    nonPositionedFloats: createStackingLayer(container, 'nonPositionedFloats'),
    inFlowInlineLevelNonPositionedDescendants: createStackingLayer(container, 'inFlowInlineLevelNonPositionedDescendants'),
    childStackingContextsWithStackLevelZeroAndPositionedDescendantsWithStackLevelZero: createStackingLayer(container, 'childStackingContextsWithStackLevelZeroAndPositionedDescendantsWithStackLevelZero'),
    childStackingContextsWithPositiveStackLevels: createStackingLayer(container, 'childStackingContextsWithPositiveStackLevels')
  };
}

function determineStackingLayer(styles, parentStyles) {
  // https://www.w3.org/TR/CSS22/visuren.html#layers
  // https://www.w3.org/TR/CSS22/zindex.html
  // Note: the root element is not handled here, but in handleElement().
  const zIndex = styles.zIndex !== 'auto' ? parseInt(styles.zIndex, 10) : undefined;

  if (zIndex !== undefined && zIndex < 0 && establishesStackingContext(styles, parentStyles)) {
    return 'childStackingContextsWithNegativeStackLevels';
  }

  if ((0, _css.isInFlow)(styles) && !(0, _css.isInline)(styles) && !(0, _css.isPositioned)(styles)) {
    return 'inFlowNonInlineNonPositionedDescendants';
  }

  if (!(0, _css.isPositioned)(styles) && styles.float !== 'none') {
    return 'nonPositionedFloats';
  }

  if ((0, _css.isInFlow)(styles) && (0, _css.isInline)(styles) && !(0, _css.isPositioned)(styles)) {
    return 'inFlowInlineLevelNonPositionedDescendants';
  }

  if (zIndex === 0 && ((0, _css.isPositioned)(styles) || establishesStackingContext(styles, parentStyles))) {
    return 'childStackingContextsWithStackLevelZeroAndPositionedDescendantsWithStackLevelZero';
  }

  if (zIndex !== undefined && zIndex > 0 && establishesStackingContext(styles, parentStyles)) {
    return 'childStackingContextsWithPositiveStackLevels';
  }

  return undefined;
}

function sortChildrenByZIndex(parent) {
  const sorted = [...parent.children].sort((a, b) => {
    const zIndexA = a.dataset.zIndex;
    const zIndexB = b.dataset.zIndex;

    if (!zIndexA || !zIndexB) {
      throw new Error('Expected node to have data-z-index attribute');
    }

    return parseInt(zIndexA, 10) - parseInt(zIndexB, 10);
  });

  for (const child of sorted) {
    parent.append(child);
  }
}

function sortStackingLayerChildren(stackingLayers) {
  sortChildrenByZIndex(stackingLayers.childStackingContextsWithNegativeStackLevels);
  sortChildrenByZIndex(stackingLayers.childStackingContextsWithPositiveStackLevels);
}

},{"./css":2,"./dom":3}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleTextNode = handleTextNode;
exports.assignTextStyles = assignTextStyles;

var _dom = require("./dom");

var _util = require("./util");

function handleTextNode(textNode, context) {
  if (!textNode.ownerDocument.defaultView) {
    throw new Error("Element's ownerDocument has no defaultView");
  }

  const window = textNode.ownerDocument.defaultView;
  const parentElement = textNode.parentElement;
  const styles = window.getComputedStyle(parentElement);
  const {
    whiteSpace
  } = styles;
  const svgTextElement = context.svgDocument.createElementNS(_dom.svgNamespace, 'text'); // Make sure the y attribute is the bottom of the box, not the baseline

  svgTextElement.setAttribute('dominant-baseline', 'text-after-edge');
  const lineRange = textNode.ownerDocument.createRange();
  lineRange.setStart(textNode, 0);
  lineRange.setEnd(textNode, 0);

  while (true) {
    const addTextSpanForLineRange = () => {
      if (lineRange.collapsed) {
        return;
      }

      const lineRectangle = lineRange.getClientRects()[0];

      if (!(0, _util.doRectanglesIntersect)(lineRectangle, context.captureArea)) {
        return;
      }

      const textSpan = context.svgDocument.createElementNS(_dom.svgNamespace, 'tspan');
      textSpan.setAttribute('xml:space', 'preserve');
      let text = lineRange.toString();

      if (whiteSpace !== 'pre' && whiteSpace !== 'pre-wrap') {
        // Collapse whitespace within the text node
        text = text.replace(/\s+/, ' '); // Check if previous siblings had trailing whitespace.
        // If so, trim beginning of the text content to collapse whitespace across nodes.

        if (lineRange.startOffset === 0) {
          for (let node = textNode.previousSibling; node; node = node.previousSibling) {
            var _node$textContent;

            if (node.textContent && /\s+$/.test(node.textContent)) {
              text = text.trimStart();
              break;
            } else if ((_node$textContent = node.textContent) === null || _node$textContent === void 0 ? void 0 : _node$textContent.trim()) {
              break;
            }
          }
        }
      }

      textSpan.textContent = text;
      textSpan.setAttribute('x', lineRectangle.x.toString());
      textSpan.setAttribute('y', lineRectangle.bottom.toString());
      textSpan.setAttribute('textLength', lineRectangle.width.toString());
      textSpan.setAttribute('lengthAdjust', 'spacingAndGlyphs');
      svgTextElement.append(textSpan);
    };

    try {
      lineRange.setEnd(textNode, lineRange.endOffset + 1);
    } catch (error) {
      if (error.code === DOMException.INDEX_SIZE_ERR) {
        // Reached the end
        addTextSpanForLineRange();
        break;
      }

      throw error;
    } // getClientRects() returns one rectangle for each line of a text node.


    const lineRectangles = lineRange.getClientRects();

    if (lineRectangles.length === 0) {
      // Pure whitespace text nodes are collapsed and not rendered.
      return;
    }

    if (lineRectangles.length > 1) {
      // Crossed a line break.
      lineRange.setEnd(textNode, lineRange.endOffset - 1);
      addTextSpanForLineRange();
      lineRange.setStart(textNode, lineRange.endOffset);
    }
  } // Copy text styles
  // https://css-tricks.com/svg-properties-and-css


  assignTextStyles(styles, svgTextElement);
  context.currentSvgParent.append(svgTextElement);
}

function assignTextStyles(styles, svgElement) {
  const {
    color,
    fontFamily,
    fontSize,
    fontSizeAdjust,
    fontStretch,
    fontStyle,
    fontVariant,
    fontWeight,
    direction,
    letterSpacing,
    textDecoration,
    unicodeBidi,
    wordSpacing,
    writingMode,
    userSelect
  } = styles;
  Object.assign(svgElement.style, {
    fill: color,
    fontFamily,
    fontSize,
    fontSizeAdjust,
    fontStretch,
    fontStyle,
    fontVariant,
    fontWeight,
    direction,
    letterSpacing,
    textDecoration,
    unicodeBidi,
    wordSpacing,
    writingMode,
    userSelect
  });
}

},{"./dom":3,"./util":11}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.walkNode = walkNode;

var _dom = require("./dom");

var _element = require("./element");

var _text = require("./text");

function walkNode(node, context) {
  if ((0, _dom.isElement)(node)) {
    (0, _element.handleElement)(node, context);
  } else if ((0, _dom.isTextNode)(node)) {
    (0, _text.handleTextNode)(node, context);
  }
}

},{"./dom":3,"./element":4,"./text":9}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doRectanglesIntersect = exports.isDefined = exports.createCounter = void 0;

const createCounter = () => {
  let count = 0;
  return () => ++count;
};

exports.createCounter = createCounter;

const isDefined = value => value !== null && value !== undefined;
/**
 * Check if two rectangles (e.g. an element and the capture area) intersect.
 */


exports.isDefined = isDefined;

const doRectanglesIntersect = (a, b) => !(a.bottom < b.top || // A is above B
a.top > b.bottom || // A is below B
a.right < b.left || // A is left of B
// A is right of B
a.left > b.right);

exports.doRectanglesIntersect = doRectanglesIntersect;

},{}],12:[function(require,module,exports){
"use strict";

/*!
 * media-typer
 * Copyright(c) 2014 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * RegExp to match *( ";" parameter ) in RFC 2616 sec 3.7
 *
 * parameter     = token "=" ( token | quoted-string )
 * token         = 1*<any CHAR except CTLs or separators>
 * separators    = "(" | ")" | "<" | ">" | "@"
 *               | "," | ";" | ":" | "\" | <">
 *               | "/" | "[" | "]" | "?" | "="
 *               | "{" | "}" | SP | HT
 * quoted-string = ( <"> *(qdtext | quoted-pair ) <"> )
 * qdtext        = <any TEXT except <">>
 * quoted-pair   = "\" CHAR
 * CHAR          = <any US-ASCII character (octets 0 - 127)>
 * TEXT          = <any OCTET except CTLs, but including LWS>
 * LWS           = [CRLF] 1*( SP | HT )
 * CRLF          = CR LF
 * CR            = <US-ASCII CR, carriage return (13)>
 * LF            = <US-ASCII LF, linefeed (10)>
 * SP            = <US-ASCII SP, space (32)>
 * SHT           = <US-ASCII HT, horizontal-tab (9)>
 * CTL           = <any US-ASCII control character (octets 0 - 31) and DEL (127)>
 * OCTET         = <any 8-bit sequence of data>
 */
var paramRegExp = /; *([!#$%&'\*\+\-\.0-9A-Z\^_`a-z\|~]+) *= *("(?:[ !\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u0020-\u007e])*"|[!#$%&'\*\+\-\.0-9A-Z\^_`a-z\|~]+) */g;
var textRegExp = /^[\u0020-\u007e\u0080-\u00ff]+$/;
var tokenRegExp = /^[!#$%&'\*\+\-\.0-9A-Z\^_`a-z\|~]+$/;
/**
 * RegExp to match quoted-pair in RFC 2616
 *
 * quoted-pair = "\" CHAR
 * CHAR        = <any US-ASCII character (octets 0 - 127)>
 */

var qescRegExp = /\\([\u0000-\u007f])/g;
/**
 * RegExp to match chars that must be quoted-pair in RFC 2616
 */

var quoteRegExp = /([\\"])/g;
/**
 * RegExp to match type in RFC 6838
 *
 * type-name = restricted-name
 * subtype-name = restricted-name
 * restricted-name = restricted-name-first *126restricted-name-chars
 * restricted-name-first  = ALPHA / DIGIT
 * restricted-name-chars  = ALPHA / DIGIT / "!" / "#" /
 *                          "$" / "&" / "-" / "^" / "_"
 * restricted-name-chars =/ "." ; Characters before first dot always
 *                              ; specify a facet name
 * restricted-name-chars =/ "+" ; Characters after last plus always
 *                              ; specify a structured syntax suffix
 * ALPHA =  %x41-5A / %x61-7A   ; A-Z / a-z
 * DIGIT =  %x30-39             ; 0-9
 */

var subtypeNameRegExp = /^[A-Za-z0-9][A-Za-z0-9!#$&^_.-]{0,126}$/;
var typeNameRegExp = /^[A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126}$/;
var typeRegExp = /^ *([A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}) *$/;
/**
 * Module exports.
 */

exports.format = format;
exports.parse = parse;
/**
 * Format object to media type.
 *
 * @param {object} obj
 * @return {string}
 * @api public
 */

function format(obj) {
  if (!obj || typeof obj !== 'object') {
    throw new TypeError('argument obj is required');
  }

  var parameters = obj.parameters;
  var subtype = obj.subtype;
  var suffix = obj.suffix;
  var type = obj.type;

  if (!type || !typeNameRegExp.test(type)) {
    throw new TypeError('invalid type');
  }

  if (!subtype || !subtypeNameRegExp.test(subtype)) {
    throw new TypeError('invalid subtype');
  } // format as type/subtype


  var string = type + '/' + subtype; // append +suffix

  if (suffix) {
    if (!typeNameRegExp.test(suffix)) {
      throw new TypeError('invalid suffix');
    }

    string += '+' + suffix;
  } // append parameters


  if (parameters && typeof parameters === 'object') {
    var param;
    var params = Object.keys(parameters).sort();

    for (var i = 0; i < params.length; i++) {
      param = params[i];

      if (!tokenRegExp.test(param)) {
        throw new TypeError('invalid parameter name');
      }

      string += '; ' + param + '=' + qstring(parameters[param]);
    }
  }

  return string;
}
/**
 * Parse media type to object.
 *
 * @param {string|object} string
 * @return {Object}
 * @api public
 */


function parse(string) {
  if (!string) {
    throw new TypeError('argument string is required');
  } // support req/res-like objects as argument


  if (typeof string === 'object') {
    string = getcontenttype(string);
  }

  if (typeof string !== 'string') {
    throw new TypeError('argument string is required to be a string');
  }

  var index = string.indexOf(';');
  var type = index !== -1 ? string.substr(0, index) : string;
  var key;
  var match;
  var obj = splitType(type);
  var params = {};
  var value;
  paramRegExp.lastIndex = index;

  while (match = paramRegExp.exec(string)) {
    if (match.index !== index) {
      throw new TypeError('invalid parameter format');
    }

    index += match[0].length;
    key = match[1].toLowerCase();
    value = match[2];

    if (value[0] === '"') {
      // remove quotes and escapes
      value = value.substr(1, value.length - 2).replace(qescRegExp, '$1');
    }

    params[key] = value;
  }

  if (index !== -1 && index !== string.length) {
    throw new TypeError('invalid parameter format');
  }

  obj.parameters = params;
  return obj;
}
/**
 * Get content-type from req/res objects.
 *
 * @param {object}
 * @return {Object}
 * @api private
 */


function getcontenttype(obj) {
  if (typeof obj.getHeader === 'function') {
    // res-like
    return obj.getHeader('content-type');
  }

  if (typeof obj.headers === 'object') {
    // req-like
    return obj.headers && obj.headers['content-type'];
  }
}
/**
 * Quote a string if necessary.
 *
 * @param {string} val
 * @return {string}
 * @api private
 */


function qstring(val) {
  var str = String(val); // no need to quote tokens

  if (tokenRegExp.test(str)) {
    return str;
  }

  if (str.length > 0 && !textRegExp.test(str)) {
    throw new TypeError('invalid parameter value');
  }

  return '"' + str.replace(quoteRegExp, '\\$1') + '"';
}
/**
 * Simply "type/subtype+siffx" into parts.
 *
 * @param {string} string
 * @return {Object}
 * @api private
 */


function splitType(string) {
  var match = typeRegExp.exec(string.toLowerCase());

  if (!match) {
    throw new TypeError('invalid media type');
  }

  var type = match[1];
  var subtype = match[2];
  var suffix; // suffix after last +

  var index = subtype.lastIndexOf('+');

  if (index !== -1) {
    suffix = subtype.substr(index + 1);
    subtype = subtype.substr(0, index);
  }

  var obj = {
    type: type,
    subtype: subtype,
    suffix: suffix
  };
  return obj;
}

},{}],13:[function(require,module,exports){
module.exports={
  "application/1d-interleaved-parityfec": {
    "source": "iana"
  },
  "application/3gpdash-qoe-report+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/3gpp-ims+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/a2l": {
    "source": "iana"
  },
  "application/activemessage": {
    "source": "iana"
  },
  "application/activity+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-costmap+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-costmapfilter+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-directory+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-endpointcost+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-endpointcostparams+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-endpointprop+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-endpointpropparams+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-error+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-networkmap+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-networkmapfilter+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-updatestreamcontrol+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-updatestreamparams+json": {
    "source": "iana",
    "compressible": true
  },
  "application/aml": {
    "source": "iana"
  },
  "application/andrew-inset": {
    "source": "iana",
    "extensions": ["ez"]
  },
  "application/applefile": {
    "source": "iana"
  },
  "application/applixware": {
    "source": "apache",
    "extensions": ["aw"]
  },
  "application/atf": {
    "source": "iana"
  },
  "application/atfx": {
    "source": "iana"
  },
  "application/atom+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["atom"]
  },
  "application/atomcat+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["atomcat"]
  },
  "application/atomdeleted+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["atomdeleted"]
  },
  "application/atomicmail": {
    "source": "iana"
  },
  "application/atomsvc+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["atomsvc"]
  },
  "application/atsc-dwd+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["dwd"]
  },
  "application/atsc-dynamic-event-message": {
    "source": "iana"
  },
  "application/atsc-held+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["held"]
  },
  "application/atsc-rdt+json": {
    "source": "iana",
    "compressible": true
  },
  "application/atsc-rsat+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rsat"]
  },
  "application/atxml": {
    "source": "iana"
  },
  "application/auth-policy+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/bacnet-xdd+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/batch-smtp": {
    "source": "iana"
  },
  "application/bdoc": {
    "compressible": false,
    "extensions": ["bdoc"]
  },
  "application/beep+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/calendar+json": {
    "source": "iana",
    "compressible": true
  },
  "application/calendar+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xcs"]
  },
  "application/call-completion": {
    "source": "iana"
  },
  "application/cals-1840": {
    "source": "iana"
  },
  "application/cap+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/cbor": {
    "source": "iana"
  },
  "application/cbor-seq": {
    "source": "iana"
  },
  "application/cccex": {
    "source": "iana"
  },
  "application/ccmp+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/ccxml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["ccxml"]
  },
  "application/cdfx+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["cdfx"]
  },
  "application/cdmi-capability": {
    "source": "iana",
    "extensions": ["cdmia"]
  },
  "application/cdmi-container": {
    "source": "iana",
    "extensions": ["cdmic"]
  },
  "application/cdmi-domain": {
    "source": "iana",
    "extensions": ["cdmid"]
  },
  "application/cdmi-object": {
    "source": "iana",
    "extensions": ["cdmio"]
  },
  "application/cdmi-queue": {
    "source": "iana",
    "extensions": ["cdmiq"]
  },
  "application/cdni": {
    "source": "iana"
  },
  "application/cea": {
    "source": "iana"
  },
  "application/cea-2018+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/cellml+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/cfw": {
    "source": "iana"
  },
  "application/clue+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/clue_info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/cms": {
    "source": "iana"
  },
  "application/cnrp+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/coap-group+json": {
    "source": "iana",
    "compressible": true
  },
  "application/coap-payload": {
    "source": "iana"
  },
  "application/commonground": {
    "source": "iana"
  },
  "application/conference-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/cose": {
    "source": "iana"
  },
  "application/cose-key": {
    "source": "iana"
  },
  "application/cose-key-set": {
    "source": "iana"
  },
  "application/cpl+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/csrattrs": {
    "source": "iana"
  },
  "application/csta+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/cstadata+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/csvm+json": {
    "source": "iana",
    "compressible": true
  },
  "application/cu-seeme": {
    "source": "apache",
    "extensions": ["cu"]
  },
  "application/cwt": {
    "source": "iana"
  },
  "application/cybercash": {
    "source": "iana"
  },
  "application/dart": {
    "compressible": true
  },
  "application/dash+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["mpd"]
  },
  "application/dashdelta": {
    "source": "iana"
  },
  "application/davmount+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["davmount"]
  },
  "application/dca-rft": {
    "source": "iana"
  },
  "application/dcd": {
    "source": "iana"
  },
  "application/dec-dx": {
    "source": "iana"
  },
  "application/dialog-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/dicom": {
    "source": "iana"
  },
  "application/dicom+json": {
    "source": "iana",
    "compressible": true
  },
  "application/dicom+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/dii": {
    "source": "iana"
  },
  "application/dit": {
    "source": "iana"
  },
  "application/dns": {
    "source": "iana"
  },
  "application/dns+json": {
    "source": "iana",
    "compressible": true
  },
  "application/dns-message": {
    "source": "iana"
  },
  "application/docbook+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["dbk"]
  },
  "application/dots+cbor": {
    "source": "iana"
  },
  "application/dskpp+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/dssc+der": {
    "source": "iana",
    "extensions": ["dssc"]
  },
  "application/dssc+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xdssc"]
  },
  "application/dvcs": {
    "source": "iana"
  },
  "application/ecmascript": {
    "source": "iana",
    "compressible": true,
    "extensions": ["ecma","es"]
  },
  "application/edi-consent": {
    "source": "iana"
  },
  "application/edi-x12": {
    "source": "iana",
    "compressible": false
  },
  "application/edifact": {
    "source": "iana",
    "compressible": false
  },
  "application/efi": {
    "source": "iana"
  },
  "application/emergencycalldata.comment+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/emergencycalldata.control+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/emergencycalldata.deviceinfo+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/emergencycalldata.ecall.msd": {
    "source": "iana"
  },
  "application/emergencycalldata.providerinfo+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/emergencycalldata.serviceinfo+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/emergencycalldata.subscriberinfo+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/emergencycalldata.veds+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/emma+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["emma"]
  },
  "application/emotionml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["emotionml"]
  },
  "application/encaprtp": {
    "source": "iana"
  },
  "application/epp+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/epub+zip": {
    "source": "iana",
    "compressible": false,
    "extensions": ["epub"]
  },
  "application/eshop": {
    "source": "iana"
  },
  "application/exi": {
    "source": "iana",
    "extensions": ["exi"]
  },
  "application/expect-ct-report+json": {
    "source": "iana",
    "compressible": true
  },
  "application/fastinfoset": {
    "source": "iana"
  },
  "application/fastsoap": {
    "source": "iana"
  },
  "application/fdt+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["fdt"]
  },
  "application/fhir+json": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/fhir+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/fido.trusted-apps+json": {
    "compressible": true
  },
  "application/fits": {
    "source": "iana"
  },
  "application/flexfec": {
    "source": "iana"
  },
  "application/font-sfnt": {
    "source": "iana"
  },
  "application/font-tdpfr": {
    "source": "iana",
    "extensions": ["pfr"]
  },
  "application/font-woff": {
    "source": "iana",
    "compressible": false
  },
  "application/framework-attributes+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/geo+json": {
    "source": "iana",
    "compressible": true,
    "extensions": ["geojson"]
  },
  "application/geo+json-seq": {
    "source": "iana"
  },
  "application/geopackage+sqlite3": {
    "source": "iana"
  },
  "application/geoxacml+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/gltf-buffer": {
    "source": "iana"
  },
  "application/gml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["gml"]
  },
  "application/gpx+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["gpx"]
  },
  "application/gxf": {
    "source": "apache",
    "extensions": ["gxf"]
  },
  "application/gzip": {
    "source": "iana",
    "compressible": false,
    "extensions": ["gz"]
  },
  "application/h224": {
    "source": "iana"
  },
  "application/held+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/hjson": {
    "extensions": ["hjson"]
  },
  "application/http": {
    "source": "iana"
  },
  "application/hyperstudio": {
    "source": "iana",
    "extensions": ["stk"]
  },
  "application/ibe-key-request+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/ibe-pkg-reply+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/ibe-pp-data": {
    "source": "iana"
  },
  "application/iges": {
    "source": "iana"
  },
  "application/im-iscomposing+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/index": {
    "source": "iana"
  },
  "application/index.cmd": {
    "source": "iana"
  },
  "application/index.obj": {
    "source": "iana"
  },
  "application/index.response": {
    "source": "iana"
  },
  "application/index.vnd": {
    "source": "iana"
  },
  "application/inkml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["ink","inkml"]
  },
  "application/iotp": {
    "source": "iana"
  },
  "application/ipfix": {
    "source": "iana",
    "extensions": ["ipfix"]
  },
  "application/ipp": {
    "source": "iana"
  },
  "application/isup": {
    "source": "iana"
  },
  "application/its+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["its"]
  },
  "application/java-archive": {
    "source": "apache",
    "compressible": false,
    "extensions": ["jar","war","ear"]
  },
  "application/java-serialized-object": {
    "source": "apache",
    "compressible": false,
    "extensions": ["ser"]
  },
  "application/java-vm": {
    "source": "apache",
    "compressible": false,
    "extensions": ["class"]
  },
  "application/javascript": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true,
    "extensions": ["js","mjs"]
  },
  "application/jf2feed+json": {
    "source": "iana",
    "compressible": true
  },
  "application/jose": {
    "source": "iana"
  },
  "application/jose+json": {
    "source": "iana",
    "compressible": true
  },
  "application/jrd+json": {
    "source": "iana",
    "compressible": true
  },
  "application/json": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true,
    "extensions": ["json","map"]
  },
  "application/json-patch+json": {
    "source": "iana",
    "compressible": true
  },
  "application/json-seq": {
    "source": "iana"
  },
  "application/json5": {
    "extensions": ["json5"]
  },
  "application/jsonml+json": {
    "source": "apache",
    "compressible": true,
    "extensions": ["jsonml"]
  },
  "application/jwk+json": {
    "source": "iana",
    "compressible": true
  },
  "application/jwk-set+json": {
    "source": "iana",
    "compressible": true
  },
  "application/jwt": {
    "source": "iana"
  },
  "application/kpml-request+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/kpml-response+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/ld+json": {
    "source": "iana",
    "compressible": true,
    "extensions": ["jsonld"]
  },
  "application/lgr+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["lgr"]
  },
  "application/link-format": {
    "source": "iana"
  },
  "application/load-control+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/lost+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["lostxml"]
  },
  "application/lostsync+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/lpf+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/lxf": {
    "source": "iana"
  },
  "application/mac-binhex40": {
    "source": "iana",
    "extensions": ["hqx"]
  },
  "application/mac-compactpro": {
    "source": "apache",
    "extensions": ["cpt"]
  },
  "application/macwriteii": {
    "source": "iana"
  },
  "application/mads+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["mads"]
  },
  "application/manifest+json": {
    "charset": "UTF-8",
    "compressible": true,
    "extensions": ["webmanifest"]
  },
  "application/marc": {
    "source": "iana",
    "extensions": ["mrc"]
  },
  "application/marcxml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["mrcx"]
  },
  "application/mathematica": {
    "source": "iana",
    "extensions": ["ma","nb","mb"]
  },
  "application/mathml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["mathml"]
  },
  "application/mathml-content+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mathml-presentation+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbms-associated-procedure-description+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbms-deregister+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbms-envelope+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbms-msk+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbms-msk-response+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbms-protection-description+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbms-reception-report+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbms-register+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbms-register-response+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbms-schedule+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbms-user-service-description+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbox": {
    "source": "iana",
    "extensions": ["mbox"]
  },
  "application/media-policy-dataset+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/media_control+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mediaservercontrol+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["mscml"]
  },
  "application/merge-patch+json": {
    "source": "iana",
    "compressible": true
  },
  "application/metalink+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["metalink"]
  },
  "application/metalink4+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["meta4"]
  },
  "application/mets+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["mets"]
  },
  "application/mf4": {
    "source": "iana"
  },
  "application/mikey": {
    "source": "iana"
  },
  "application/mipc": {
    "source": "iana"
  },
  "application/mmt-aei+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["maei"]
  },
  "application/mmt-usd+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["musd"]
  },
  "application/mods+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["mods"]
  },
  "application/moss-keys": {
    "source": "iana"
  },
  "application/moss-signature": {
    "source": "iana"
  },
  "application/mosskey-data": {
    "source": "iana"
  },
  "application/mosskey-request": {
    "source": "iana"
  },
  "application/mp21": {
    "source": "iana",
    "extensions": ["m21","mp21"]
  },
  "application/mp4": {
    "source": "iana",
    "extensions": ["mp4s","m4p"]
  },
  "application/mpeg4-generic": {
    "source": "iana"
  },
  "application/mpeg4-iod": {
    "source": "iana"
  },
  "application/mpeg4-iod-xmt": {
    "source": "iana"
  },
  "application/mrb-consumer+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xdf"]
  },
  "application/mrb-publish+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xdf"]
  },
  "application/msc-ivr+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/msc-mixer+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/msword": {
    "source": "iana",
    "compressible": false,
    "extensions": ["doc","dot"]
  },
  "application/mud+json": {
    "source": "iana",
    "compressible": true
  },
  "application/multipart-core": {
    "source": "iana"
  },
  "application/mxf": {
    "source": "iana",
    "extensions": ["mxf"]
  },
  "application/n-quads": {
    "source": "iana",
    "extensions": ["nq"]
  },
  "application/n-triples": {
    "source": "iana",
    "extensions": ["nt"]
  },
  "application/nasdata": {
    "source": "iana"
  },
  "application/news-checkgroups": {
    "source": "iana",
    "charset": "US-ASCII"
  },
  "application/news-groupinfo": {
    "source": "iana",
    "charset": "US-ASCII"
  },
  "application/news-transmission": {
    "source": "iana"
  },
  "application/nlsml+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/node": {
    "source": "iana",
    "extensions": ["cjs"]
  },
  "application/nss": {
    "source": "iana"
  },
  "application/ocsp-request": {
    "source": "iana"
  },
  "application/ocsp-response": {
    "source": "iana"
  },
  "application/octet-stream": {
    "source": "iana",
    "compressible": false,
    "extensions": ["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"]
  },
  "application/oda": {
    "source": "iana",
    "extensions": ["oda"]
  },
  "application/odm+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/odx": {
    "source": "iana"
  },
  "application/oebps-package+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["opf"]
  },
  "application/ogg": {
    "source": "iana",
    "compressible": false,
    "extensions": ["ogx"]
  },
  "application/omdoc+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["omdoc"]
  },
  "application/onenote": {
    "source": "apache",
    "extensions": ["onetoc","onetoc2","onetmp","onepkg"]
  },
  "application/oscore": {
    "source": "iana"
  },
  "application/oxps": {
    "source": "iana",
    "extensions": ["oxps"]
  },
  "application/p2p-overlay+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["relo"]
  },
  "application/parityfec": {
    "source": "iana"
  },
  "application/passport": {
    "source": "iana"
  },
  "application/patch-ops-error+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xer"]
  },
  "application/pdf": {
    "source": "iana",
    "compressible": false,
    "extensions": ["pdf"]
  },
  "application/pdx": {
    "source": "iana"
  },
  "application/pem-certificate-chain": {
    "source": "iana"
  },
  "application/pgp-encrypted": {
    "source": "iana",
    "compressible": false,
    "extensions": ["pgp"]
  },
  "application/pgp-keys": {
    "source": "iana"
  },
  "application/pgp-signature": {
    "source": "iana",
    "extensions": ["asc","sig"]
  },
  "application/pics-rules": {
    "source": "apache",
    "extensions": ["prf"]
  },
  "application/pidf+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/pidf-diff+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/pkcs10": {
    "source": "iana",
    "extensions": ["p10"]
  },
  "application/pkcs12": {
    "source": "iana"
  },
  "application/pkcs7-mime": {
    "source": "iana",
    "extensions": ["p7m","p7c"]
  },
  "application/pkcs7-signature": {
    "source": "iana",
    "extensions": ["p7s"]
  },
  "application/pkcs8": {
    "source": "iana",
    "extensions": ["p8"]
  },
  "application/pkcs8-encrypted": {
    "source": "iana"
  },
  "application/pkix-attr-cert": {
    "source": "iana",
    "extensions": ["ac"]
  },
  "application/pkix-cert": {
    "source": "iana",
    "extensions": ["cer"]
  },
  "application/pkix-crl": {
    "source": "iana",
    "extensions": ["crl"]
  },
  "application/pkix-pkipath": {
    "source": "iana",
    "extensions": ["pkipath"]
  },
  "application/pkixcmp": {
    "source": "iana",
    "extensions": ["pki"]
  },
  "application/pls+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["pls"]
  },
  "application/poc-settings+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/postscript": {
    "source": "iana",
    "compressible": true,
    "extensions": ["ai","eps","ps"]
  },
  "application/ppsp-tracker+json": {
    "source": "iana",
    "compressible": true
  },
  "application/problem+json": {
    "source": "iana",
    "compressible": true
  },
  "application/problem+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/provenance+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["provx"]
  },
  "application/prs.alvestrand.titrax-sheet": {
    "source": "iana"
  },
  "application/prs.cww": {
    "source": "iana",
    "extensions": ["cww"]
  },
  "application/prs.hpub+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/prs.nprend": {
    "source": "iana"
  },
  "application/prs.plucker": {
    "source": "iana"
  },
  "application/prs.rdf-xml-crypt": {
    "source": "iana"
  },
  "application/prs.xsf+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/pskc+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["pskcxml"]
  },
  "application/pvd+json": {
    "source": "iana",
    "compressible": true
  },
  "application/qsig": {
    "source": "iana"
  },
  "application/raml+yaml": {
    "compressible": true,
    "extensions": ["raml"]
  },
  "application/raptorfec": {
    "source": "iana"
  },
  "application/rdap+json": {
    "source": "iana",
    "compressible": true
  },
  "application/rdf+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rdf","owl"]
  },
  "application/reginfo+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rif"]
  },
  "application/relax-ng-compact-syntax": {
    "source": "iana",
    "extensions": ["rnc"]
  },
  "application/remote-printing": {
    "source": "iana"
  },
  "application/reputon+json": {
    "source": "iana",
    "compressible": true
  },
  "application/resource-lists+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rl"]
  },
  "application/resource-lists-diff+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rld"]
  },
  "application/rfc+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/riscos": {
    "source": "iana"
  },
  "application/rlmi+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/rls-services+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rs"]
  },
  "application/route-apd+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rapd"]
  },
  "application/route-s-tsid+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["sls"]
  },
  "application/route-usd+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rusd"]
  },
  "application/rpki-ghostbusters": {
    "source": "iana",
    "extensions": ["gbr"]
  },
  "application/rpki-manifest": {
    "source": "iana",
    "extensions": ["mft"]
  },
  "application/rpki-publication": {
    "source": "iana"
  },
  "application/rpki-roa": {
    "source": "iana",
    "extensions": ["roa"]
  },
  "application/rpki-updown": {
    "source": "iana"
  },
  "application/rsd+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["rsd"]
  },
  "application/rss+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["rss"]
  },
  "application/rtf": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rtf"]
  },
  "application/rtploopback": {
    "source": "iana"
  },
  "application/rtx": {
    "source": "iana"
  },
  "application/samlassertion+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/samlmetadata+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/sbe": {
    "source": "iana"
  },
  "application/sbml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["sbml"]
  },
  "application/scaip+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/scim+json": {
    "source": "iana",
    "compressible": true
  },
  "application/scvp-cv-request": {
    "source": "iana",
    "extensions": ["scq"]
  },
  "application/scvp-cv-response": {
    "source": "iana",
    "extensions": ["scs"]
  },
  "application/scvp-vp-request": {
    "source": "iana",
    "extensions": ["spq"]
  },
  "application/scvp-vp-response": {
    "source": "iana",
    "extensions": ["spp"]
  },
  "application/sdp": {
    "source": "iana",
    "extensions": ["sdp"]
  },
  "application/secevent+jwt": {
    "source": "iana"
  },
  "application/senml+cbor": {
    "source": "iana"
  },
  "application/senml+json": {
    "source": "iana",
    "compressible": true
  },
  "application/senml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["senmlx"]
  },
  "application/senml-etch+cbor": {
    "source": "iana"
  },
  "application/senml-etch+json": {
    "source": "iana",
    "compressible": true
  },
  "application/senml-exi": {
    "source": "iana"
  },
  "application/sensml+cbor": {
    "source": "iana"
  },
  "application/sensml+json": {
    "source": "iana",
    "compressible": true
  },
  "application/sensml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["sensmlx"]
  },
  "application/sensml-exi": {
    "source": "iana"
  },
  "application/sep+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/sep-exi": {
    "source": "iana"
  },
  "application/session-info": {
    "source": "iana"
  },
  "application/set-payment": {
    "source": "iana"
  },
  "application/set-payment-initiation": {
    "source": "iana",
    "extensions": ["setpay"]
  },
  "application/set-registration": {
    "source": "iana"
  },
  "application/set-registration-initiation": {
    "source": "iana",
    "extensions": ["setreg"]
  },
  "application/sgml": {
    "source": "iana"
  },
  "application/sgml-open-catalog": {
    "source": "iana"
  },
  "application/shf+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["shf"]
  },
  "application/sieve": {
    "source": "iana",
    "extensions": ["siv","sieve"]
  },
  "application/simple-filter+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/simple-message-summary": {
    "source": "iana"
  },
  "application/simplesymbolcontainer": {
    "source": "iana"
  },
  "application/sipc": {
    "source": "iana"
  },
  "application/slate": {
    "source": "iana"
  },
  "application/smil": {
    "source": "iana"
  },
  "application/smil+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["smi","smil"]
  },
  "application/smpte336m": {
    "source": "iana"
  },
  "application/soap+fastinfoset": {
    "source": "iana"
  },
  "application/soap+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/sparql-query": {
    "source": "iana",
    "extensions": ["rq"]
  },
  "application/sparql-results+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["srx"]
  },
  "application/spirits-event+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/sql": {
    "source": "iana"
  },
  "application/srgs": {
    "source": "iana",
    "extensions": ["gram"]
  },
  "application/srgs+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["grxml"]
  },
  "application/sru+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["sru"]
  },
  "application/ssdl+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["ssdl"]
  },
  "application/ssml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["ssml"]
  },
  "application/stix+json": {
    "source": "iana",
    "compressible": true
  },
  "application/swid+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["swidtag"]
  },
  "application/tamp-apex-update": {
    "source": "iana"
  },
  "application/tamp-apex-update-confirm": {
    "source": "iana"
  },
  "application/tamp-community-update": {
    "source": "iana"
  },
  "application/tamp-community-update-confirm": {
    "source": "iana"
  },
  "application/tamp-error": {
    "source": "iana"
  },
  "application/tamp-sequence-adjust": {
    "source": "iana"
  },
  "application/tamp-sequence-adjust-confirm": {
    "source": "iana"
  },
  "application/tamp-status-query": {
    "source": "iana"
  },
  "application/tamp-status-response": {
    "source": "iana"
  },
  "application/tamp-update": {
    "source": "iana"
  },
  "application/tamp-update-confirm": {
    "source": "iana"
  },
  "application/tar": {
    "compressible": true
  },
  "application/taxii+json": {
    "source": "iana",
    "compressible": true
  },
  "application/td+json": {
    "source": "iana",
    "compressible": true
  },
  "application/tei+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["tei","teicorpus"]
  },
  "application/tetra_isi": {
    "source": "iana"
  },
  "application/thraud+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["tfi"]
  },
  "application/timestamp-query": {
    "source": "iana"
  },
  "application/timestamp-reply": {
    "source": "iana"
  },
  "application/timestamped-data": {
    "source": "iana",
    "extensions": ["tsd"]
  },
  "application/tlsrpt+gzip": {
    "source": "iana"
  },
  "application/tlsrpt+json": {
    "source": "iana",
    "compressible": true
  },
  "application/tnauthlist": {
    "source": "iana"
  },
  "application/toml": {
    "compressible": true,
    "extensions": ["toml"]
  },
  "application/trickle-ice-sdpfrag": {
    "source": "iana"
  },
  "application/trig": {
    "source": "iana"
  },
  "application/ttml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["ttml"]
  },
  "application/tve-trigger": {
    "source": "iana"
  },
  "application/tzif": {
    "source": "iana"
  },
  "application/tzif-leap": {
    "source": "iana"
  },
  "application/ulpfec": {
    "source": "iana"
  },
  "application/urc-grpsheet+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/urc-ressheet+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rsheet"]
  },
  "application/urc-targetdesc+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/urc-uisocketdesc+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vcard+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vcard+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vemmi": {
    "source": "iana"
  },
  "application/vividence.scriptfile": {
    "source": "apache"
  },
  "application/vnd.1000minds.decision-model+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["1km"]
  },
  "application/vnd.3gpp-prose+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp-prose-pc3ch+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp-v2x-local-service-information": {
    "source": "iana"
  },
  "application/vnd.3gpp.access-transfer-events+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.bsf+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.gmop+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mc-signalling-ear": {
    "source": "iana"
  },
  "application/vnd.3gpp.mcdata-affiliation-command+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcdata-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcdata-payload": {
    "source": "iana"
  },
  "application/vnd.3gpp.mcdata-service-config+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcdata-signalling": {
    "source": "iana"
  },
  "application/vnd.3gpp.mcdata-ue-config+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcdata-user-profile+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcptt-affiliation-command+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcptt-floor-request+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcptt-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcptt-location-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcptt-service-config+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcptt-signed+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcptt-ue-config+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcptt-ue-init-config+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcptt-user-profile+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcvideo-affiliation-command+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcvideo-affiliation-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcvideo-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcvideo-location-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcvideo-service-config+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcvideo-transmission-request+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcvideo-ue-config+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcvideo-user-profile+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mid-call+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.pic-bw-large": {
    "source": "iana",
    "extensions": ["plb"]
  },
  "application/vnd.3gpp.pic-bw-small": {
    "source": "iana",
    "extensions": ["psb"]
  },
  "application/vnd.3gpp.pic-bw-var": {
    "source": "iana",
    "extensions": ["pvb"]
  },
  "application/vnd.3gpp.sms": {
    "source": "iana"
  },
  "application/vnd.3gpp.sms+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.srvcc-ext+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.srvcc-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.state-and-event-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.ussd+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp2.bcmcsinfo+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp2.sms": {
    "source": "iana"
  },
  "application/vnd.3gpp2.tcap": {
    "source": "iana",
    "extensions": ["tcap"]
  },
  "application/vnd.3lightssoftware.imagescal": {
    "source": "iana"
  },
  "application/vnd.3m.post-it-notes": {
    "source": "iana",
    "extensions": ["pwn"]
  },
  "application/vnd.accpac.simply.aso": {
    "source": "iana",
    "extensions": ["aso"]
  },
  "application/vnd.accpac.simply.imp": {
    "source": "iana",
    "extensions": ["imp"]
  },
  "application/vnd.acucobol": {
    "source": "iana",
    "extensions": ["acu"]
  },
  "application/vnd.acucorp": {
    "source": "iana",
    "extensions": ["atc","acutc"]
  },
  "application/vnd.adobe.air-application-installer-package+zip": {
    "source": "apache",
    "compressible": false,
    "extensions": ["air"]
  },
  "application/vnd.adobe.flash.movie": {
    "source": "iana"
  },
  "application/vnd.adobe.formscentral.fcdt": {
    "source": "iana",
    "extensions": ["fcdt"]
  },
  "application/vnd.adobe.fxp": {
    "source": "iana",
    "extensions": ["fxp","fxpl"]
  },
  "application/vnd.adobe.partial-upload": {
    "source": "iana"
  },
  "application/vnd.adobe.xdp+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xdp"]
  },
  "application/vnd.adobe.xfdf": {
    "source": "iana",
    "extensions": ["xfdf"]
  },
  "application/vnd.aether.imp": {
    "source": "iana"
  },
  "application/vnd.afpc.afplinedata": {
    "source": "iana"
  },
  "application/vnd.afpc.afplinedata-pagedef": {
    "source": "iana"
  },
  "application/vnd.afpc.foca-charset": {
    "source": "iana"
  },
  "application/vnd.afpc.foca-codedfont": {
    "source": "iana"
  },
  "application/vnd.afpc.foca-codepage": {
    "source": "iana"
  },
  "application/vnd.afpc.modca": {
    "source": "iana"
  },
  "application/vnd.afpc.modca-formdef": {
    "source": "iana"
  },
  "application/vnd.afpc.modca-mediummap": {
    "source": "iana"
  },
  "application/vnd.afpc.modca-objectcontainer": {
    "source": "iana"
  },
  "application/vnd.afpc.modca-overlay": {
    "source": "iana"
  },
  "application/vnd.afpc.modca-pagesegment": {
    "source": "iana"
  },
  "application/vnd.ah-barcode": {
    "source": "iana"
  },
  "application/vnd.ahead.space": {
    "source": "iana",
    "extensions": ["ahead"]
  },
  "application/vnd.airzip.filesecure.azf": {
    "source": "iana",
    "extensions": ["azf"]
  },
  "application/vnd.airzip.filesecure.azs": {
    "source": "iana",
    "extensions": ["azs"]
  },
  "application/vnd.amadeus+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.amazon.ebook": {
    "source": "apache",
    "extensions": ["azw"]
  },
  "application/vnd.amazon.mobi8-ebook": {
    "source": "iana"
  },
  "application/vnd.americandynamics.acc": {
    "source": "iana",
    "extensions": ["acc"]
  },
  "application/vnd.amiga.ami": {
    "source": "iana",
    "extensions": ["ami"]
  },
  "application/vnd.amundsen.maze+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.android.ota": {
    "source": "iana"
  },
  "application/vnd.android.package-archive": {
    "source": "apache",
    "compressible": false,
    "extensions": ["apk"]
  },
  "application/vnd.anki": {
    "source": "iana"
  },
  "application/vnd.anser-web-certificate-issue-initiation": {
    "source": "iana",
    "extensions": ["cii"]
  },
  "application/vnd.anser-web-funds-transfer-initiation": {
    "source": "apache",
    "extensions": ["fti"]
  },
  "application/vnd.antix.game-component": {
    "source": "iana",
    "extensions": ["atx"]
  },
  "application/vnd.apache.thrift.binary": {
    "source": "iana"
  },
  "application/vnd.apache.thrift.compact": {
    "source": "iana"
  },
  "application/vnd.apache.thrift.json": {
    "source": "iana"
  },
  "application/vnd.api+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.aplextor.warrp+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.apothekende.reservation+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.apple.installer+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["mpkg"]
  },
  "application/vnd.apple.keynote": {
    "source": "iana",
    "extensions": ["keynote"]
  },
  "application/vnd.apple.mpegurl": {
    "source": "iana",
    "extensions": ["m3u8"]
  },
  "application/vnd.apple.numbers": {
    "source": "iana",
    "extensions": ["numbers"]
  },
  "application/vnd.apple.pages": {
    "source": "iana",
    "extensions": ["pages"]
  },
  "application/vnd.apple.pkpass": {
    "compressible": false,
    "extensions": ["pkpass"]
  },
  "application/vnd.arastra.swi": {
    "source": "iana"
  },
  "application/vnd.aristanetworks.swi": {
    "source": "iana",
    "extensions": ["swi"]
  },
  "application/vnd.artisan+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.artsquare": {
    "source": "iana"
  },
  "application/vnd.astraea-software.iota": {
    "source": "iana",
    "extensions": ["iota"]
  },
  "application/vnd.audiograph": {
    "source": "iana",
    "extensions": ["aep"]
  },
  "application/vnd.autopackage": {
    "source": "iana"
  },
  "application/vnd.avalon+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.avistar+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.balsamiq.bmml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["bmml"]
  },
  "application/vnd.balsamiq.bmpr": {
    "source": "iana"
  },
  "application/vnd.banana-accounting": {
    "source": "iana"
  },
  "application/vnd.bbf.usp.error": {
    "source": "iana"
  },
  "application/vnd.bbf.usp.msg": {
    "source": "iana"
  },
  "application/vnd.bbf.usp.msg+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.bekitzur-stech+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.bint.med-content": {
    "source": "iana"
  },
  "application/vnd.biopax.rdf+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.blink-idb-value-wrapper": {
    "source": "iana"
  },
  "application/vnd.blueice.multipass": {
    "source": "iana",
    "extensions": ["mpm"]
  },
  "application/vnd.bluetooth.ep.oob": {
    "source": "iana"
  },
  "application/vnd.bluetooth.le.oob": {
    "source": "iana"
  },
  "application/vnd.bmi": {
    "source": "iana",
    "extensions": ["bmi"]
  },
  "application/vnd.bpf": {
    "source": "iana"
  },
  "application/vnd.bpf3": {
    "source": "iana"
  },
  "application/vnd.businessobjects": {
    "source": "iana",
    "extensions": ["rep"]
  },
  "application/vnd.byu.uapi+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.cab-jscript": {
    "source": "iana"
  },
  "application/vnd.canon-cpdl": {
    "source": "iana"
  },
  "application/vnd.canon-lips": {
    "source": "iana"
  },
  "application/vnd.capasystems-pg+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.cendio.thinlinc.clientconf": {
    "source": "iana"
  },
  "application/vnd.century-systems.tcp_stream": {
    "source": "iana"
  },
  "application/vnd.chemdraw+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["cdxml"]
  },
  "application/vnd.chess-pgn": {
    "source": "iana"
  },
  "application/vnd.chipnuts.karaoke-mmd": {
    "source": "iana",
    "extensions": ["mmd"]
  },
  "application/vnd.ciedi": {
    "source": "iana"
  },
  "application/vnd.cinderella": {
    "source": "iana",
    "extensions": ["cdy"]
  },
  "application/vnd.cirpack.isdn-ext": {
    "source": "iana"
  },
  "application/vnd.citationstyles.style+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["csl"]
  },
  "application/vnd.claymore": {
    "source": "iana",
    "extensions": ["cla"]
  },
  "application/vnd.cloanto.rp9": {
    "source": "iana",
    "extensions": ["rp9"]
  },
  "application/vnd.clonk.c4group": {
    "source": "iana",
    "extensions": ["c4g","c4d","c4f","c4p","c4u"]
  },
  "application/vnd.cluetrust.cartomobile-config": {
    "source": "iana",
    "extensions": ["c11amc"]
  },
  "application/vnd.cluetrust.cartomobile-config-pkg": {
    "source": "iana",
    "extensions": ["c11amz"]
  },
  "application/vnd.coffeescript": {
    "source": "iana"
  },
  "application/vnd.collabio.xodocuments.document": {
    "source": "iana"
  },
  "application/vnd.collabio.xodocuments.document-template": {
    "source": "iana"
  },
  "application/vnd.collabio.xodocuments.presentation": {
    "source": "iana"
  },
  "application/vnd.collabio.xodocuments.presentation-template": {
    "source": "iana"
  },
  "application/vnd.collabio.xodocuments.spreadsheet": {
    "source": "iana"
  },
  "application/vnd.collabio.xodocuments.spreadsheet-template": {
    "source": "iana"
  },
  "application/vnd.collection+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.collection.doc+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.collection.next+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.comicbook+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.comicbook-rar": {
    "source": "iana"
  },
  "application/vnd.commerce-battelle": {
    "source": "iana"
  },
  "application/vnd.commonspace": {
    "source": "iana",
    "extensions": ["csp"]
  },
  "application/vnd.contact.cmsg": {
    "source": "iana",
    "extensions": ["cdbcmsg"]
  },
  "application/vnd.coreos.ignition+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.cosmocaller": {
    "source": "iana",
    "extensions": ["cmc"]
  },
  "application/vnd.crick.clicker": {
    "source": "iana",
    "extensions": ["clkx"]
  },
  "application/vnd.crick.clicker.keyboard": {
    "source": "iana",
    "extensions": ["clkk"]
  },
  "application/vnd.crick.clicker.palette": {
    "source": "iana",
    "extensions": ["clkp"]
  },
  "application/vnd.crick.clicker.template": {
    "source": "iana",
    "extensions": ["clkt"]
  },
  "application/vnd.crick.clicker.wordbank": {
    "source": "iana",
    "extensions": ["clkw"]
  },
  "application/vnd.criticaltools.wbs+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["wbs"]
  },
  "application/vnd.cryptii.pipe+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.crypto-shade-file": {
    "source": "iana"
  },
  "application/vnd.ctc-posml": {
    "source": "iana",
    "extensions": ["pml"]
  },
  "application/vnd.ctct.ws+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.cups-pdf": {
    "source": "iana"
  },
  "application/vnd.cups-postscript": {
    "source": "iana"
  },
  "application/vnd.cups-ppd": {
    "source": "iana",
    "extensions": ["ppd"]
  },
  "application/vnd.cups-raster": {
    "source": "iana"
  },
  "application/vnd.cups-raw": {
    "source": "iana"
  },
  "application/vnd.curl": {
    "source": "iana"
  },
  "application/vnd.curl.car": {
    "source": "apache",
    "extensions": ["car"]
  },
  "application/vnd.curl.pcurl": {
    "source": "apache",
    "extensions": ["pcurl"]
  },
  "application/vnd.cyan.dean.root+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.cybank": {
    "source": "iana"
  },
  "application/vnd.d2l.coursepackage1p0+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.dart": {
    "source": "iana",
    "compressible": true,
    "extensions": ["dart"]
  },
  "application/vnd.data-vision.rdz": {
    "source": "iana",
    "extensions": ["rdz"]
  },
  "application/vnd.datapackage+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dataresource+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dbf": {
    "source": "iana"
  },
  "application/vnd.debian.binary-package": {
    "source": "iana"
  },
  "application/vnd.dece.data": {
    "source": "iana",
    "extensions": ["uvf","uvvf","uvd","uvvd"]
  },
  "application/vnd.dece.ttml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["uvt","uvvt"]
  },
  "application/vnd.dece.unspecified": {
    "source": "iana",
    "extensions": ["uvx","uvvx"]
  },
  "application/vnd.dece.zip": {
    "source": "iana",
    "extensions": ["uvz","uvvz"]
  },
  "application/vnd.denovo.fcselayout-link": {
    "source": "iana",
    "extensions": ["fe_launch"]
  },
  "application/vnd.desmume.movie": {
    "source": "iana"
  },
  "application/vnd.dir-bi.plate-dl-nosuffix": {
    "source": "iana"
  },
  "application/vnd.dm.delegation+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dna": {
    "source": "iana",
    "extensions": ["dna"]
  },
  "application/vnd.document+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dolby.mlp": {
    "source": "apache",
    "extensions": ["mlp"]
  },
  "application/vnd.dolby.mobile.1": {
    "source": "iana"
  },
  "application/vnd.dolby.mobile.2": {
    "source": "iana"
  },
  "application/vnd.doremir.scorecloud-binary-document": {
    "source": "iana"
  },
  "application/vnd.dpgraph": {
    "source": "iana",
    "extensions": ["dpg"]
  },
  "application/vnd.dreamfactory": {
    "source": "iana",
    "extensions": ["dfac"]
  },
  "application/vnd.drive+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ds-keypoint": {
    "source": "apache",
    "extensions": ["kpxx"]
  },
  "application/vnd.dtg.local": {
    "source": "iana"
  },
  "application/vnd.dtg.local.flash": {
    "source": "iana"
  },
  "application/vnd.dtg.local.html": {
    "source": "iana"
  },
  "application/vnd.dvb.ait": {
    "source": "iana",
    "extensions": ["ait"]
  },
  "application/vnd.dvb.dvbisl+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dvb.dvbj": {
    "source": "iana"
  },
  "application/vnd.dvb.esgcontainer": {
    "source": "iana"
  },
  "application/vnd.dvb.ipdcdftnotifaccess": {
    "source": "iana"
  },
  "application/vnd.dvb.ipdcesgaccess": {
    "source": "iana"
  },
  "application/vnd.dvb.ipdcesgaccess2": {
    "source": "iana"
  },
  "application/vnd.dvb.ipdcesgpdd": {
    "source": "iana"
  },
  "application/vnd.dvb.ipdcroaming": {
    "source": "iana"
  },
  "application/vnd.dvb.iptv.alfec-base": {
    "source": "iana"
  },
  "application/vnd.dvb.iptv.alfec-enhancement": {
    "source": "iana"
  },
  "application/vnd.dvb.notif-aggregate-root+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dvb.notif-container+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dvb.notif-generic+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dvb.notif-ia-msglist+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dvb.notif-ia-registration-request+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dvb.notif-ia-registration-response+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dvb.notif-init+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dvb.pfr": {
    "source": "iana"
  },
  "application/vnd.dvb.service": {
    "source": "iana",
    "extensions": ["svc"]
  },
  "application/vnd.dxr": {
    "source": "iana"
  },
  "application/vnd.dynageo": {
    "source": "iana",
    "extensions": ["geo"]
  },
  "application/vnd.dzr": {
    "source": "iana"
  },
  "application/vnd.easykaraoke.cdgdownload": {
    "source": "iana"
  },
  "application/vnd.ecdis-update": {
    "source": "iana"
  },
  "application/vnd.ecip.rlp": {
    "source": "iana"
  },
  "application/vnd.ecowin.chart": {
    "source": "iana",
    "extensions": ["mag"]
  },
  "application/vnd.ecowin.filerequest": {
    "source": "iana"
  },
  "application/vnd.ecowin.fileupdate": {
    "source": "iana"
  },
  "application/vnd.ecowin.series": {
    "source": "iana"
  },
  "application/vnd.ecowin.seriesrequest": {
    "source": "iana"
  },
  "application/vnd.ecowin.seriesupdate": {
    "source": "iana"
  },
  "application/vnd.efi.img": {
    "source": "iana"
  },
  "application/vnd.efi.iso": {
    "source": "iana"
  },
  "application/vnd.emclient.accessrequest+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.enliven": {
    "source": "iana",
    "extensions": ["nml"]
  },
  "application/vnd.enphase.envoy": {
    "source": "iana"
  },
  "application/vnd.eprints.data+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.epson.esf": {
    "source": "iana",
    "extensions": ["esf"]
  },
  "application/vnd.epson.msf": {
    "source": "iana",
    "extensions": ["msf"]
  },
  "application/vnd.epson.quickanime": {
    "source": "iana",
    "extensions": ["qam"]
  },
  "application/vnd.epson.salt": {
    "source": "iana",
    "extensions": ["slt"]
  },
  "application/vnd.epson.ssf": {
    "source": "iana",
    "extensions": ["ssf"]
  },
  "application/vnd.ericsson.quickcall": {
    "source": "iana"
  },
  "application/vnd.espass-espass+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.eszigno3+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["es3","et3"]
  },
  "application/vnd.etsi.aoc+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.asic-e+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.etsi.asic-s+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.etsi.cug+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.iptvcommand+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.iptvdiscovery+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.iptvprofile+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.iptvsad-bc+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.iptvsad-cod+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.iptvsad-npvr+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.iptvservice+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.iptvsync+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.iptvueprofile+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.mcid+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.mheg5": {
    "source": "iana"
  },
  "application/vnd.etsi.overload-control-policy-dataset+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.pstn+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.sci+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.simservs+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.timestamp-token": {
    "source": "iana"
  },
  "application/vnd.etsi.tsl+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.tsl.der": {
    "source": "iana"
  },
  "application/vnd.eudora.data": {
    "source": "iana"
  },
  "application/vnd.evolv.ecig.profile": {
    "source": "iana"
  },
  "application/vnd.evolv.ecig.settings": {
    "source": "iana"
  },
  "application/vnd.evolv.ecig.theme": {
    "source": "iana"
  },
  "application/vnd.exstream-empower+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.exstream-package": {
    "source": "iana"
  },
  "application/vnd.ezpix-album": {
    "source": "iana",
    "extensions": ["ez2"]
  },
  "application/vnd.ezpix-package": {
    "source": "iana",
    "extensions": ["ez3"]
  },
  "application/vnd.f-secure.mobile": {
    "source": "iana"
  },
  "application/vnd.fastcopy-disk-image": {
    "source": "iana"
  },
  "application/vnd.fdf": {
    "source": "iana",
    "extensions": ["fdf"]
  },
  "application/vnd.fdsn.mseed": {
    "source": "iana",
    "extensions": ["mseed"]
  },
  "application/vnd.fdsn.seed": {
    "source": "iana",
    "extensions": ["seed","dataless"]
  },
  "application/vnd.ffsns": {
    "source": "iana"
  },
  "application/vnd.ficlab.flb+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.filmit.zfc": {
    "source": "iana"
  },
  "application/vnd.fints": {
    "source": "iana"
  },
  "application/vnd.firemonkeys.cloudcell": {
    "source": "iana"
  },
  "application/vnd.flographit": {
    "source": "iana",
    "extensions": ["gph"]
  },
  "application/vnd.fluxtime.clip": {
    "source": "iana",
    "extensions": ["ftc"]
  },
  "application/vnd.font-fontforge-sfd": {
    "source": "iana"
  },
  "application/vnd.framemaker": {
    "source": "iana",
    "extensions": ["fm","frame","maker","book"]
  },
  "application/vnd.frogans.fnc": {
    "source": "iana",
    "extensions": ["fnc"]
  },
  "application/vnd.frogans.ltf": {
    "source": "iana",
    "extensions": ["ltf"]
  },
  "application/vnd.fsc.weblaunch": {
    "source": "iana",
    "extensions": ["fsc"]
  },
  "application/vnd.fujitsu.oasys": {
    "source": "iana",
    "extensions": ["oas"]
  },
  "application/vnd.fujitsu.oasys2": {
    "source": "iana",
    "extensions": ["oa2"]
  },
  "application/vnd.fujitsu.oasys3": {
    "source": "iana",
    "extensions": ["oa3"]
  },
  "application/vnd.fujitsu.oasysgp": {
    "source": "iana",
    "extensions": ["fg5"]
  },
  "application/vnd.fujitsu.oasysprs": {
    "source": "iana",
    "extensions": ["bh2"]
  },
  "application/vnd.fujixerox.art-ex": {
    "source": "iana"
  },
  "application/vnd.fujixerox.art4": {
    "source": "iana"
  },
  "application/vnd.fujixerox.ddd": {
    "source": "iana",
    "extensions": ["ddd"]
  },
  "application/vnd.fujixerox.docuworks": {
    "source": "iana",
    "extensions": ["xdw"]
  },
  "application/vnd.fujixerox.docuworks.binder": {
    "source": "iana",
    "extensions": ["xbd"]
  },
  "application/vnd.fujixerox.docuworks.container": {
    "source": "iana"
  },
  "application/vnd.fujixerox.hbpl": {
    "source": "iana"
  },
  "application/vnd.fut-misnet": {
    "source": "iana"
  },
  "application/vnd.futoin+cbor": {
    "source": "iana"
  },
  "application/vnd.futoin+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.fuzzysheet": {
    "source": "iana",
    "extensions": ["fzs"]
  },
  "application/vnd.genomatix.tuxedo": {
    "source": "iana",
    "extensions": ["txd"]
  },
  "application/vnd.gentics.grd+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.geo+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.geocube+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.geogebra.file": {
    "source": "iana",
    "extensions": ["ggb"]
  },
  "application/vnd.geogebra.tool": {
    "source": "iana",
    "extensions": ["ggt"]
  },
  "application/vnd.geometry-explorer": {
    "source": "iana",
    "extensions": ["gex","gre"]
  },
  "application/vnd.geonext": {
    "source": "iana",
    "extensions": ["gxt"]
  },
  "application/vnd.geoplan": {
    "source": "iana",
    "extensions": ["g2w"]
  },
  "application/vnd.geospace": {
    "source": "iana",
    "extensions": ["g3w"]
  },
  "application/vnd.gerber": {
    "source": "iana"
  },
  "application/vnd.globalplatform.card-content-mgt": {
    "source": "iana"
  },
  "application/vnd.globalplatform.card-content-mgt-response": {
    "source": "iana"
  },
  "application/vnd.gmx": {
    "source": "iana",
    "extensions": ["gmx"]
  },
  "application/vnd.google-apps.document": {
    "compressible": false,
    "extensions": ["gdoc"]
  },
  "application/vnd.google-apps.presentation": {
    "compressible": false,
    "extensions": ["gslides"]
  },
  "application/vnd.google-apps.spreadsheet": {
    "compressible": false,
    "extensions": ["gsheet"]
  },
  "application/vnd.google-earth.kml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["kml"]
  },
  "application/vnd.google-earth.kmz": {
    "source": "iana",
    "compressible": false,
    "extensions": ["kmz"]
  },
  "application/vnd.gov.sk.e-form+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.gov.sk.e-form+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.gov.sk.xmldatacontainer+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.grafeq": {
    "source": "iana",
    "extensions": ["gqf","gqs"]
  },
  "application/vnd.gridmp": {
    "source": "iana"
  },
  "application/vnd.groove-account": {
    "source": "iana",
    "extensions": ["gac"]
  },
  "application/vnd.groove-help": {
    "source": "iana",
    "extensions": ["ghf"]
  },
  "application/vnd.groove-identity-message": {
    "source": "iana",
    "extensions": ["gim"]
  },
  "application/vnd.groove-injector": {
    "source": "iana",
    "extensions": ["grv"]
  },
  "application/vnd.groove-tool-message": {
    "source": "iana",
    "extensions": ["gtm"]
  },
  "application/vnd.groove-tool-template": {
    "source": "iana",
    "extensions": ["tpl"]
  },
  "application/vnd.groove-vcard": {
    "source": "iana",
    "extensions": ["vcg"]
  },
  "application/vnd.hal+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.hal+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["hal"]
  },
  "application/vnd.handheld-entertainment+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["zmm"]
  },
  "application/vnd.hbci": {
    "source": "iana",
    "extensions": ["hbci"]
  },
  "application/vnd.hc+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.hcl-bireports": {
    "source": "iana"
  },
  "application/vnd.hdt": {
    "source": "iana"
  },
  "application/vnd.heroku+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.hhe.lesson-player": {
    "source": "iana",
    "extensions": ["les"]
  },
  "application/vnd.hp-hpgl": {
    "source": "iana",
    "extensions": ["hpgl"]
  },
  "application/vnd.hp-hpid": {
    "source": "iana",
    "extensions": ["hpid"]
  },
  "application/vnd.hp-hps": {
    "source": "iana",
    "extensions": ["hps"]
  },
  "application/vnd.hp-jlyt": {
    "source": "iana",
    "extensions": ["jlt"]
  },
  "application/vnd.hp-pcl": {
    "source": "iana",
    "extensions": ["pcl"]
  },
  "application/vnd.hp-pclxl": {
    "source": "iana",
    "extensions": ["pclxl"]
  },
  "application/vnd.httphone": {
    "source": "iana"
  },
  "application/vnd.hydrostatix.sof-data": {
    "source": "iana",
    "extensions": ["sfd-hdstx"]
  },
  "application/vnd.hyper+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.hyper-item+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.hyperdrive+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.hzn-3d-crossword": {
    "source": "iana"
  },
  "application/vnd.ibm.afplinedata": {
    "source": "iana"
  },
  "application/vnd.ibm.electronic-media": {
    "source": "iana"
  },
  "application/vnd.ibm.minipay": {
    "source": "iana",
    "extensions": ["mpy"]
  },
  "application/vnd.ibm.modcap": {
    "source": "iana",
    "extensions": ["afp","listafp","list3820"]
  },
  "application/vnd.ibm.rights-management": {
    "source": "iana",
    "extensions": ["irm"]
  },
  "application/vnd.ibm.secure-container": {
    "source": "iana",
    "extensions": ["sc"]
  },
  "application/vnd.iccprofile": {
    "source": "iana",
    "extensions": ["icc","icm"]
  },
  "application/vnd.ieee.1905": {
    "source": "iana"
  },
  "application/vnd.igloader": {
    "source": "iana",
    "extensions": ["igl"]
  },
  "application/vnd.imagemeter.folder+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.imagemeter.image+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.immervision-ivp": {
    "source": "iana",
    "extensions": ["ivp"]
  },
  "application/vnd.immervision-ivu": {
    "source": "iana",
    "extensions": ["ivu"]
  },
  "application/vnd.ims.imsccv1p1": {
    "source": "iana"
  },
  "application/vnd.ims.imsccv1p2": {
    "source": "iana"
  },
  "application/vnd.ims.imsccv1p3": {
    "source": "iana"
  },
  "application/vnd.ims.lis.v2.result+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ims.lti.v2.toolproxy+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ims.lti.v2.toolproxy.id+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ims.lti.v2.toolsettings+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ims.lti.v2.toolsettings.simple+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.informedcontrol.rms+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.informix-visionary": {
    "source": "iana"
  },
  "application/vnd.infotech.project": {
    "source": "iana"
  },
  "application/vnd.infotech.project+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.innopath.wamp.notification": {
    "source": "iana"
  },
  "application/vnd.insors.igm": {
    "source": "iana",
    "extensions": ["igm"]
  },
  "application/vnd.intercon.formnet": {
    "source": "iana",
    "extensions": ["xpw","xpx"]
  },
  "application/vnd.intergeo": {
    "source": "iana",
    "extensions": ["i2g"]
  },
  "application/vnd.intertrust.digibox": {
    "source": "iana"
  },
  "application/vnd.intertrust.nncp": {
    "source": "iana"
  },
  "application/vnd.intu.qbo": {
    "source": "iana",
    "extensions": ["qbo"]
  },
  "application/vnd.intu.qfx": {
    "source": "iana",
    "extensions": ["qfx"]
  },
  "application/vnd.iptc.g2.catalogitem+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.iptc.g2.conceptitem+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.iptc.g2.knowledgeitem+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.iptc.g2.newsitem+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.iptc.g2.newsmessage+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.iptc.g2.packageitem+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.iptc.g2.planningitem+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ipunplugged.rcprofile": {
    "source": "iana",
    "extensions": ["rcprofile"]
  },
  "application/vnd.irepository.package+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["irp"]
  },
  "application/vnd.is-xpr": {
    "source": "iana",
    "extensions": ["xpr"]
  },
  "application/vnd.isac.fcs": {
    "source": "iana",
    "extensions": ["fcs"]
  },
  "application/vnd.iso11783-10+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.jam": {
    "source": "iana",
    "extensions": ["jam"]
  },
  "application/vnd.japannet-directory-service": {
    "source": "iana"
  },
  "application/vnd.japannet-jpnstore-wakeup": {
    "source": "iana"
  },
  "application/vnd.japannet-payment-wakeup": {
    "source": "iana"
  },
  "application/vnd.japannet-registration": {
    "source": "iana"
  },
  "application/vnd.japannet-registration-wakeup": {
    "source": "iana"
  },
  "application/vnd.japannet-setstore-wakeup": {
    "source": "iana"
  },
  "application/vnd.japannet-verification": {
    "source": "iana"
  },
  "application/vnd.japannet-verification-wakeup": {
    "source": "iana"
  },
  "application/vnd.jcp.javame.midlet-rms": {
    "source": "iana",
    "extensions": ["rms"]
  },
  "application/vnd.jisp": {
    "source": "iana",
    "extensions": ["jisp"]
  },
  "application/vnd.joost.joda-archive": {
    "source": "iana",
    "extensions": ["joda"]
  },
  "application/vnd.jsk.isdn-ngn": {
    "source": "iana"
  },
  "application/vnd.kahootz": {
    "source": "iana",
    "extensions": ["ktz","ktr"]
  },
  "application/vnd.kde.karbon": {
    "source": "iana",
    "extensions": ["karbon"]
  },
  "application/vnd.kde.kchart": {
    "source": "iana",
    "extensions": ["chrt"]
  },
  "application/vnd.kde.kformula": {
    "source": "iana",
    "extensions": ["kfo"]
  },
  "application/vnd.kde.kivio": {
    "source": "iana",
    "extensions": ["flw"]
  },
  "application/vnd.kde.kontour": {
    "source": "iana",
    "extensions": ["kon"]
  },
  "application/vnd.kde.kpresenter": {
    "source": "iana",
    "extensions": ["kpr","kpt"]
  },
  "application/vnd.kde.kspread": {
    "source": "iana",
    "extensions": ["ksp"]
  },
  "application/vnd.kde.kword": {
    "source": "iana",
    "extensions": ["kwd","kwt"]
  },
  "application/vnd.kenameaapp": {
    "source": "iana",
    "extensions": ["htke"]
  },
  "application/vnd.kidspiration": {
    "source": "iana",
    "extensions": ["kia"]
  },
  "application/vnd.kinar": {
    "source": "iana",
    "extensions": ["kne","knp"]
  },
  "application/vnd.koan": {
    "source": "iana",
    "extensions": ["skp","skd","skt","skm"]
  },
  "application/vnd.kodak-descriptor": {
    "source": "iana",
    "extensions": ["sse"]
  },
  "application/vnd.las": {
    "source": "iana"
  },
  "application/vnd.las.las+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.las.las+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["lasxml"]
  },
  "application/vnd.laszip": {
    "source": "iana"
  },
  "application/vnd.leap+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.liberty-request+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.llamagraphics.life-balance.desktop": {
    "source": "iana",
    "extensions": ["lbd"]
  },
  "application/vnd.llamagraphics.life-balance.exchange+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["lbe"]
  },
  "application/vnd.logipipe.circuit+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.loom": {
    "source": "iana"
  },
  "application/vnd.lotus-1-2-3": {
    "source": "iana",
    "extensions": ["123"]
  },
  "application/vnd.lotus-approach": {
    "source": "iana",
    "extensions": ["apr"]
  },
  "application/vnd.lotus-freelance": {
    "source": "iana",
    "extensions": ["pre"]
  },
  "application/vnd.lotus-notes": {
    "source": "iana",
    "extensions": ["nsf"]
  },
  "application/vnd.lotus-organizer": {
    "source": "iana",
    "extensions": ["org"]
  },
  "application/vnd.lotus-screencam": {
    "source": "iana",
    "extensions": ["scm"]
  },
  "application/vnd.lotus-wordpro": {
    "source": "iana",
    "extensions": ["lwp"]
  },
  "application/vnd.macports.portpkg": {
    "source": "iana",
    "extensions": ["portpkg"]
  },
  "application/vnd.mapbox-vector-tile": {
    "source": "iana"
  },
  "application/vnd.marlin.drm.actiontoken+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.marlin.drm.conftoken+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.marlin.drm.license+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.marlin.drm.mdcf": {
    "source": "iana"
  },
  "application/vnd.mason+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.maxmind.maxmind-db": {
    "source": "iana"
  },
  "application/vnd.mcd": {
    "source": "iana",
    "extensions": ["mcd"]
  },
  "application/vnd.medcalcdata": {
    "source": "iana",
    "extensions": ["mc1"]
  },
  "application/vnd.mediastation.cdkey": {
    "source": "iana",
    "extensions": ["cdkey"]
  },
  "application/vnd.meridian-slingshot": {
    "source": "iana"
  },
  "application/vnd.mfer": {
    "source": "iana",
    "extensions": ["mwf"]
  },
  "application/vnd.mfmp": {
    "source": "iana",
    "extensions": ["mfm"]
  },
  "application/vnd.micro+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.micrografx.flo": {
    "source": "iana",
    "extensions": ["flo"]
  },
  "application/vnd.micrografx.igx": {
    "source": "iana",
    "extensions": ["igx"]
  },
  "application/vnd.microsoft.portable-executable": {
    "source": "iana"
  },
  "application/vnd.microsoft.windows.thumbnail-cache": {
    "source": "iana"
  },
  "application/vnd.miele+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.mif": {
    "source": "iana",
    "extensions": ["mif"]
  },
  "application/vnd.minisoft-hp3000-save": {
    "source": "iana"
  },
  "application/vnd.mitsubishi.misty-guard.trustweb": {
    "source": "iana"
  },
  "application/vnd.mobius.daf": {
    "source": "iana",
    "extensions": ["daf"]
  },
  "application/vnd.mobius.dis": {
    "source": "iana",
    "extensions": ["dis"]
  },
  "application/vnd.mobius.mbk": {
    "source": "iana",
    "extensions": ["mbk"]
  },
  "application/vnd.mobius.mqy": {
    "source": "iana",
    "extensions": ["mqy"]
  },
  "application/vnd.mobius.msl": {
    "source": "iana",
    "extensions": ["msl"]
  },
  "application/vnd.mobius.plc": {
    "source": "iana",
    "extensions": ["plc"]
  },
  "application/vnd.mobius.txf": {
    "source": "iana",
    "extensions": ["txf"]
  },
  "application/vnd.mophun.application": {
    "source": "iana",
    "extensions": ["mpn"]
  },
  "application/vnd.mophun.certificate": {
    "source": "iana",
    "extensions": ["mpc"]
  },
  "application/vnd.motorola.flexsuite": {
    "source": "iana"
  },
  "application/vnd.motorola.flexsuite.adsi": {
    "source": "iana"
  },
  "application/vnd.motorola.flexsuite.fis": {
    "source": "iana"
  },
  "application/vnd.motorola.flexsuite.gotap": {
    "source": "iana"
  },
  "application/vnd.motorola.flexsuite.kmr": {
    "source": "iana"
  },
  "application/vnd.motorola.flexsuite.ttc": {
    "source": "iana"
  },
  "application/vnd.motorola.flexsuite.wem": {
    "source": "iana"
  },
  "application/vnd.motorola.iprm": {
    "source": "iana"
  },
  "application/vnd.mozilla.xul+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xul"]
  },
  "application/vnd.ms-3mfdocument": {
    "source": "iana"
  },
  "application/vnd.ms-artgalry": {
    "source": "iana",
    "extensions": ["cil"]
  },
  "application/vnd.ms-asf": {
    "source": "iana"
  },
  "application/vnd.ms-cab-compressed": {
    "source": "iana",
    "extensions": ["cab"]
  },
  "application/vnd.ms-color.iccprofile": {
    "source": "apache"
  },
  "application/vnd.ms-excel": {
    "source": "iana",
    "compressible": false,
    "extensions": ["xls","xlm","xla","xlc","xlt","xlw"]
  },
  "application/vnd.ms-excel.addin.macroenabled.12": {
    "source": "iana",
    "extensions": ["xlam"]
  },
  "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
    "source": "iana",
    "extensions": ["xlsb"]
  },
  "application/vnd.ms-excel.sheet.macroenabled.12": {
    "source": "iana",
    "extensions": ["xlsm"]
  },
  "application/vnd.ms-excel.template.macroenabled.12": {
    "source": "iana",
    "extensions": ["xltm"]
  },
  "application/vnd.ms-fontobject": {
    "source": "iana",
    "compressible": true,
    "extensions": ["eot"]
  },
  "application/vnd.ms-htmlhelp": {
    "source": "iana",
    "extensions": ["chm"]
  },
  "application/vnd.ms-ims": {
    "source": "iana",
    "extensions": ["ims"]
  },
  "application/vnd.ms-lrm": {
    "source": "iana",
    "extensions": ["lrm"]
  },
  "application/vnd.ms-office.activex+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ms-officetheme": {
    "source": "iana",
    "extensions": ["thmx"]
  },
  "application/vnd.ms-opentype": {
    "source": "apache",
    "compressible": true
  },
  "application/vnd.ms-outlook": {
    "compressible": false,
    "extensions": ["msg"]
  },
  "application/vnd.ms-package.obfuscated-opentype": {
    "source": "apache"
  },
  "application/vnd.ms-pki.seccat": {
    "source": "apache",
    "extensions": ["cat"]
  },
  "application/vnd.ms-pki.stl": {
    "source": "apache",
    "extensions": ["stl"]
  },
  "application/vnd.ms-playready.initiator+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ms-powerpoint": {
    "source": "iana",
    "compressible": false,
    "extensions": ["ppt","pps","pot"]
  },
  "application/vnd.ms-powerpoint.addin.macroenabled.12": {
    "source": "iana",
    "extensions": ["ppam"]
  },
  "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
    "source": "iana",
    "extensions": ["pptm"]
  },
  "application/vnd.ms-powerpoint.slide.macroenabled.12": {
    "source": "iana",
    "extensions": ["sldm"]
  },
  "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
    "source": "iana",
    "extensions": ["ppsm"]
  },
  "application/vnd.ms-powerpoint.template.macroenabled.12": {
    "source": "iana",
    "extensions": ["potm"]
  },
  "application/vnd.ms-printdevicecapabilities+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ms-printing.printticket+xml": {
    "source": "apache",
    "compressible": true
  },
  "application/vnd.ms-printschematicket+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ms-project": {
    "source": "iana",
    "extensions": ["mpp","mpt"]
  },
  "application/vnd.ms-tnef": {
    "source": "iana"
  },
  "application/vnd.ms-windows.devicepairing": {
    "source": "iana"
  },
  "application/vnd.ms-windows.nwprinting.oob": {
    "source": "iana"
  },
  "application/vnd.ms-windows.printerpairing": {
    "source": "iana"
  },
  "application/vnd.ms-windows.wsd.oob": {
    "source": "iana"
  },
  "application/vnd.ms-wmdrm.lic-chlg-req": {
    "source": "iana"
  },
  "application/vnd.ms-wmdrm.lic-resp": {
    "source": "iana"
  },
  "application/vnd.ms-wmdrm.meter-chlg-req": {
    "source": "iana"
  },
  "application/vnd.ms-wmdrm.meter-resp": {
    "source": "iana"
  },
  "application/vnd.ms-word.document.macroenabled.12": {
    "source": "iana",
    "extensions": ["docm"]
  },
  "application/vnd.ms-word.template.macroenabled.12": {
    "source": "iana",
    "extensions": ["dotm"]
  },
  "application/vnd.ms-works": {
    "source": "iana",
    "extensions": ["wps","wks","wcm","wdb"]
  },
  "application/vnd.ms-wpl": {
    "source": "iana",
    "extensions": ["wpl"]
  },
  "application/vnd.ms-xpsdocument": {
    "source": "iana",
    "compressible": false,
    "extensions": ["xps"]
  },
  "application/vnd.msa-disk-image": {
    "source": "iana"
  },
  "application/vnd.mseq": {
    "source": "iana",
    "extensions": ["mseq"]
  },
  "application/vnd.msign": {
    "source": "iana"
  },
  "application/vnd.multiad.creator": {
    "source": "iana"
  },
  "application/vnd.multiad.creator.cif": {
    "source": "iana"
  },
  "application/vnd.music-niff": {
    "source": "iana"
  },
  "application/vnd.musician": {
    "source": "iana",
    "extensions": ["mus"]
  },
  "application/vnd.muvee.style": {
    "source": "iana",
    "extensions": ["msty"]
  },
  "application/vnd.mynfc": {
    "source": "iana",
    "extensions": ["taglet"]
  },
  "application/vnd.ncd.control": {
    "source": "iana"
  },
  "application/vnd.ncd.reference": {
    "source": "iana"
  },
  "application/vnd.nearst.inv+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.nervana": {
    "source": "iana"
  },
  "application/vnd.netfpx": {
    "source": "iana"
  },
  "application/vnd.neurolanguage.nlu": {
    "source": "iana",
    "extensions": ["nlu"]
  },
  "application/vnd.nimn": {
    "source": "iana"
  },
  "application/vnd.nintendo.nitro.rom": {
    "source": "iana"
  },
  "application/vnd.nintendo.snes.rom": {
    "source": "iana"
  },
  "application/vnd.nitf": {
    "source": "iana",
    "extensions": ["ntf","nitf"]
  },
  "application/vnd.noblenet-directory": {
    "source": "iana",
    "extensions": ["nnd"]
  },
  "application/vnd.noblenet-sealer": {
    "source": "iana",
    "extensions": ["nns"]
  },
  "application/vnd.noblenet-web": {
    "source": "iana",
    "extensions": ["nnw"]
  },
  "application/vnd.nokia.catalogs": {
    "source": "iana"
  },
  "application/vnd.nokia.conml+wbxml": {
    "source": "iana"
  },
  "application/vnd.nokia.conml+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.nokia.iptv.config+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.nokia.isds-radio-presets": {
    "source": "iana"
  },
  "application/vnd.nokia.landmark+wbxml": {
    "source": "iana"
  },
  "application/vnd.nokia.landmark+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.nokia.landmarkcollection+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.nokia.n-gage.ac+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["ac"]
  },
  "application/vnd.nokia.n-gage.data": {
    "source": "iana",
    "extensions": ["ngdat"]
  },
  "application/vnd.nokia.n-gage.symbian.install": {
    "source": "iana",
    "extensions": ["n-gage"]
  },
  "application/vnd.nokia.ncd": {
    "source": "iana"
  },
  "application/vnd.nokia.pcd+wbxml": {
    "source": "iana"
  },
  "application/vnd.nokia.pcd+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.nokia.radio-preset": {
    "source": "iana",
    "extensions": ["rpst"]
  },
  "application/vnd.nokia.radio-presets": {
    "source": "iana",
    "extensions": ["rpss"]
  },
  "application/vnd.novadigm.edm": {
    "source": "iana",
    "extensions": ["edm"]
  },
  "application/vnd.novadigm.edx": {
    "source": "iana",
    "extensions": ["edx"]
  },
  "application/vnd.novadigm.ext": {
    "source": "iana",
    "extensions": ["ext"]
  },
  "application/vnd.ntt-local.content-share": {
    "source": "iana"
  },
  "application/vnd.ntt-local.file-transfer": {
    "source": "iana"
  },
  "application/vnd.ntt-local.ogw_remote-access": {
    "source": "iana"
  },
  "application/vnd.ntt-local.sip-ta_remote": {
    "source": "iana"
  },
  "application/vnd.ntt-local.sip-ta_tcp_stream": {
    "source": "iana"
  },
  "application/vnd.oasis.opendocument.chart": {
    "source": "iana",
    "extensions": ["odc"]
  },
  "application/vnd.oasis.opendocument.chart-template": {
    "source": "iana",
    "extensions": ["otc"]
  },
  "application/vnd.oasis.opendocument.database": {
    "source": "iana",
    "extensions": ["odb"]
  },
  "application/vnd.oasis.opendocument.formula": {
    "source": "iana",
    "extensions": ["odf"]
  },
  "application/vnd.oasis.opendocument.formula-template": {
    "source": "iana",
    "extensions": ["odft"]
  },
  "application/vnd.oasis.opendocument.graphics": {
    "source": "iana",
    "compressible": false,
    "extensions": ["odg"]
  },
  "application/vnd.oasis.opendocument.graphics-template": {
    "source": "iana",
    "extensions": ["otg"]
  },
  "application/vnd.oasis.opendocument.image": {
    "source": "iana",
    "extensions": ["odi"]
  },
  "application/vnd.oasis.opendocument.image-template": {
    "source": "iana",
    "extensions": ["oti"]
  },
  "application/vnd.oasis.opendocument.presentation": {
    "source": "iana",
    "compressible": false,
    "extensions": ["odp"]
  },
  "application/vnd.oasis.opendocument.presentation-template": {
    "source": "iana",
    "extensions": ["otp"]
  },
  "application/vnd.oasis.opendocument.spreadsheet": {
    "source": "iana",
    "compressible": false,
    "extensions": ["ods"]
  },
  "application/vnd.oasis.opendocument.spreadsheet-template": {
    "source": "iana",
    "extensions": ["ots"]
  },
  "application/vnd.oasis.opendocument.text": {
    "source": "iana",
    "compressible": false,
    "extensions": ["odt"]
  },
  "application/vnd.oasis.opendocument.text-master": {
    "source": "iana",
    "extensions": ["odm"]
  },
  "application/vnd.oasis.opendocument.text-template": {
    "source": "iana",
    "extensions": ["ott"]
  },
  "application/vnd.oasis.opendocument.text-web": {
    "source": "iana",
    "extensions": ["oth"]
  },
  "application/vnd.obn": {
    "source": "iana"
  },
  "application/vnd.ocf+cbor": {
    "source": "iana"
  },
  "application/vnd.oci.image.manifest.v1+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oftn.l10n+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oipf.contentaccessdownload+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oipf.contentaccessstreaming+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oipf.cspg-hexbinary": {
    "source": "iana"
  },
  "application/vnd.oipf.dae.svg+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oipf.dae.xhtml+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oipf.mippvcontrolmessage+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oipf.pae.gem": {
    "source": "iana"
  },
  "application/vnd.oipf.spdiscovery+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oipf.spdlist+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oipf.ueprofile+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oipf.userprofile+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.olpc-sugar": {
    "source": "iana",
    "extensions": ["xo"]
  },
  "application/vnd.oma-scws-config": {
    "source": "iana"
  },
  "application/vnd.oma-scws-http-request": {
    "source": "iana"
  },
  "application/vnd.oma-scws-http-response": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.bcast.drm-trigger+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.bcast.imd+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.bcast.ltkm": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.notification+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.bcast.provisioningtrigger": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.sgboot": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.sgdd+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.bcast.sgdu": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.simple-symbol-container": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.smartcard-trigger+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.bcast.sprov+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.bcast.stkm": {
    "source": "iana"
  },
  "application/vnd.oma.cab-address-book+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.cab-feature-handler+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.cab-pcc+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.cab-subs-invite+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.cab-user-prefs+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.dcd": {
    "source": "iana"
  },
  "application/vnd.oma.dcdc": {
    "source": "iana"
  },
  "application/vnd.oma.dd2+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["dd2"]
  },
  "application/vnd.oma.drm.risd+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.group-usage-list+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.lwm2m+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.lwm2m+tlv": {
    "source": "iana"
  },
  "application/vnd.oma.pal+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.poc.detailed-progress-report+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.poc.final-report+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.poc.groups+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.poc.invocation-descriptor+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.poc.optimized-progress-report+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.push": {
    "source": "iana"
  },
  "application/vnd.oma.scidm.messages+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.xcap-directory+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.omads-email+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/vnd.omads-file+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/vnd.omads-folder+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/vnd.omaloc-supl-init": {
    "source": "iana"
  },
  "application/vnd.onepager": {
    "source": "iana"
  },
  "application/vnd.onepagertamp": {
    "source": "iana"
  },
  "application/vnd.onepagertamx": {
    "source": "iana"
  },
  "application/vnd.onepagertat": {
    "source": "iana"
  },
  "application/vnd.onepagertatp": {
    "source": "iana"
  },
  "application/vnd.onepagertatx": {
    "source": "iana"
  },
  "application/vnd.openblox.game+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["obgx"]
  },
  "application/vnd.openblox.game-binary": {
    "source": "iana"
  },
  "application/vnd.openeye.oeb": {
    "source": "iana"
  },
  "application/vnd.openofficeorg.extension": {
    "source": "apache",
    "extensions": ["oxt"]
  },
  "application/vnd.openstreetmap.data+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["osm"]
  },
  "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.drawing+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    "source": "iana",
    "compressible": false,
    "extensions": ["pptx"]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slide": {
    "source": "iana",
    "extensions": ["sldx"]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
    "source": "iana",
    "extensions": ["ppsx"]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.template": {
    "source": "iana",
    "extensions": ["potx"]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    "source": "iana",
    "compressible": false,
    "extensions": ["xlsx"]
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
    "source": "iana",
    "extensions": ["xltx"]
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.theme+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.vmldrawing": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    "source": "iana",
    "compressible": false,
    "extensions": ["docx"]
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
    "source": "iana",
    "extensions": ["dotx"]
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-package.core-properties+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-package.relationships+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oracle.resource+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.orange.indata": {
    "source": "iana"
  },
  "application/vnd.osa.netdeploy": {
    "source": "iana"
  },
  "application/vnd.osgeo.mapguide.package": {
    "source": "iana",
    "extensions": ["mgp"]
  },
  "application/vnd.osgi.bundle": {
    "source": "iana"
  },
  "application/vnd.osgi.dp": {
    "source": "iana",
    "extensions": ["dp"]
  },
  "application/vnd.osgi.subsystem": {
    "source": "iana",
    "extensions": ["esa"]
  },
  "application/vnd.otps.ct-kip+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oxli.countgraph": {
    "source": "iana"
  },
  "application/vnd.pagerduty+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.palm": {
    "source": "iana",
    "extensions": ["pdb","pqa","oprc"]
  },
  "application/vnd.panoply": {
    "source": "iana"
  },
  "application/vnd.paos.xml": {
    "source": "iana"
  },
  "application/vnd.patentdive": {
    "source": "iana"
  },
  "application/vnd.patientecommsdoc": {
    "source": "iana"
  },
  "application/vnd.pawaafile": {
    "source": "iana",
    "extensions": ["paw"]
  },
  "application/vnd.pcos": {
    "source": "iana"
  },
  "application/vnd.pg.format": {
    "source": "iana",
    "extensions": ["str"]
  },
  "application/vnd.pg.osasli": {
    "source": "iana",
    "extensions": ["ei6"]
  },
  "application/vnd.piaccess.application-licence": {
    "source": "iana"
  },
  "application/vnd.picsel": {
    "source": "iana",
    "extensions": ["efif"]
  },
  "application/vnd.pmi.widget": {
    "source": "iana",
    "extensions": ["wg"]
  },
  "application/vnd.poc.group-advertisement+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.pocketlearn": {
    "source": "iana",
    "extensions": ["plf"]
  },
  "application/vnd.powerbuilder6": {
    "source": "iana",
    "extensions": ["pbd"]
  },
  "application/vnd.powerbuilder6-s": {
    "source": "iana"
  },
  "application/vnd.powerbuilder7": {
    "source": "iana"
  },
  "application/vnd.powerbuilder7-s": {
    "source": "iana"
  },
  "application/vnd.powerbuilder75": {
    "source": "iana"
  },
  "application/vnd.powerbuilder75-s": {
    "source": "iana"
  },
  "application/vnd.preminet": {
    "source": "iana"
  },
  "application/vnd.previewsystems.box": {
    "source": "iana",
    "extensions": ["box"]
  },
  "application/vnd.proteus.magazine": {
    "source": "iana",
    "extensions": ["mgz"]
  },
  "application/vnd.psfs": {
    "source": "iana"
  },
  "application/vnd.publishare-delta-tree": {
    "source": "iana",
    "extensions": ["qps"]
  },
  "application/vnd.pvi.ptid1": {
    "source": "iana",
    "extensions": ["ptid"]
  },
  "application/vnd.pwg-multiplexed": {
    "source": "iana"
  },
  "application/vnd.pwg-xhtml-print+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.qualcomm.brew-app-res": {
    "source": "iana"
  },
  "application/vnd.quarantainenet": {
    "source": "iana"
  },
  "application/vnd.quark.quarkxpress": {
    "source": "iana",
    "extensions": ["qxd","qxt","qwd","qwt","qxl","qxb"]
  },
  "application/vnd.quobject-quoxdocument": {
    "source": "iana"
  },
  "application/vnd.radisys.moml+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-audit+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-audit-conf+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-audit-conn+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-audit-dialog+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-audit-stream+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-conf+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-dialog+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-dialog-base+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-dialog-fax-detect+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-dialog-group+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-dialog-speech+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-dialog-transform+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.rainstor.data": {
    "source": "iana"
  },
  "application/vnd.rapid": {
    "source": "iana"
  },
  "application/vnd.rar": {
    "source": "iana"
  },
  "application/vnd.realvnc.bed": {
    "source": "iana",
    "extensions": ["bed"]
  },
  "application/vnd.recordare.musicxml": {
    "source": "iana",
    "extensions": ["mxl"]
  },
  "application/vnd.recordare.musicxml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["musicxml"]
  },
  "application/vnd.renlearn.rlprint": {
    "source": "iana"
  },
  "application/vnd.restful+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.rig.cryptonote": {
    "source": "iana",
    "extensions": ["cryptonote"]
  },
  "application/vnd.rim.cod": {
    "source": "apache",
    "extensions": ["cod"]
  },
  "application/vnd.rn-realmedia": {
    "source": "apache",
    "extensions": ["rm"]
  },
  "application/vnd.rn-realmedia-vbr": {
    "source": "apache",
    "extensions": ["rmvb"]
  },
  "application/vnd.route66.link66+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["link66"]
  },
  "application/vnd.rs-274x": {
    "source": "iana"
  },
  "application/vnd.ruckus.download": {
    "source": "iana"
  },
  "application/vnd.s3sms": {
    "source": "iana"
  },
  "application/vnd.sailingtracker.track": {
    "source": "iana",
    "extensions": ["st"]
  },
  "application/vnd.sar": {
    "source": "iana"
  },
  "application/vnd.sbm.cid": {
    "source": "iana"
  },
  "application/vnd.sbm.mid2": {
    "source": "iana"
  },
  "application/vnd.scribus": {
    "source": "iana"
  },
  "application/vnd.sealed.3df": {
    "source": "iana"
  },
  "application/vnd.sealed.csf": {
    "source": "iana"
  },
  "application/vnd.sealed.doc": {
    "source": "iana"
  },
  "application/vnd.sealed.eml": {
    "source": "iana"
  },
  "application/vnd.sealed.mht": {
    "source": "iana"
  },
  "application/vnd.sealed.net": {
    "source": "iana"
  },
  "application/vnd.sealed.ppt": {
    "source": "iana"
  },
  "application/vnd.sealed.tiff": {
    "source": "iana"
  },
  "application/vnd.sealed.xls": {
    "source": "iana"
  },
  "application/vnd.sealedmedia.softseal.html": {
    "source": "iana"
  },
  "application/vnd.sealedmedia.softseal.pdf": {
    "source": "iana"
  },
  "application/vnd.seemail": {
    "source": "iana",
    "extensions": ["see"]
  },
  "application/vnd.sema": {
    "source": "iana",
    "extensions": ["sema"]
  },
  "application/vnd.semd": {
    "source": "iana",
    "extensions": ["semd"]
  },
  "application/vnd.semf": {
    "source": "iana",
    "extensions": ["semf"]
  },
  "application/vnd.shade-save-file": {
    "source": "iana"
  },
  "application/vnd.shana.informed.formdata": {
    "source": "iana",
    "extensions": ["ifm"]
  },
  "application/vnd.shana.informed.formtemplate": {
    "source": "iana",
    "extensions": ["itp"]
  },
  "application/vnd.shana.informed.interchange": {
    "source": "iana",
    "extensions": ["iif"]
  },
  "application/vnd.shana.informed.package": {
    "source": "iana",
    "extensions": ["ipk"]
  },
  "application/vnd.shootproof+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.shopkick+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.shp": {
    "source": "iana"
  },
  "application/vnd.shx": {
    "source": "iana"
  },
  "application/vnd.sigrok.session": {
    "source": "iana"
  },
  "application/vnd.simtech-mindmapper": {
    "source": "iana",
    "extensions": ["twd","twds"]
  },
  "application/vnd.siren+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.smaf": {
    "source": "iana",
    "extensions": ["mmf"]
  },
  "application/vnd.smart.notebook": {
    "source": "iana"
  },
  "application/vnd.smart.teacher": {
    "source": "iana",
    "extensions": ["teacher"]
  },
  "application/vnd.snesdev-page-table": {
    "source": "iana"
  },
  "application/vnd.software602.filler.form+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["fo"]
  },
  "application/vnd.software602.filler.form-xml-zip": {
    "source": "iana"
  },
  "application/vnd.solent.sdkm+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["sdkm","sdkd"]
  },
  "application/vnd.spotfire.dxp": {
    "source": "iana",
    "extensions": ["dxp"]
  },
  "application/vnd.spotfire.sfs": {
    "source": "iana",
    "extensions": ["sfs"]
  },
  "application/vnd.sqlite3": {
    "source": "iana"
  },
  "application/vnd.sss-cod": {
    "source": "iana"
  },
  "application/vnd.sss-dtf": {
    "source": "iana"
  },
  "application/vnd.sss-ntf": {
    "source": "iana"
  },
  "application/vnd.stardivision.calc": {
    "source": "apache",
    "extensions": ["sdc"]
  },
  "application/vnd.stardivision.draw": {
    "source": "apache",
    "extensions": ["sda"]
  },
  "application/vnd.stardivision.impress": {
    "source": "apache",
    "extensions": ["sdd"]
  },
  "application/vnd.stardivision.math": {
    "source": "apache",
    "extensions": ["smf"]
  },
  "application/vnd.stardivision.writer": {
    "source": "apache",
    "extensions": ["sdw","vor"]
  },
  "application/vnd.stardivision.writer-global": {
    "source": "apache",
    "extensions": ["sgl"]
  },
  "application/vnd.stepmania.package": {
    "source": "iana",
    "extensions": ["smzip"]
  },
  "application/vnd.stepmania.stepchart": {
    "source": "iana",
    "extensions": ["sm"]
  },
  "application/vnd.street-stream": {
    "source": "iana"
  },
  "application/vnd.sun.wadl+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["wadl"]
  },
  "application/vnd.sun.xml.calc": {
    "source": "apache",
    "extensions": ["sxc"]
  },
  "application/vnd.sun.xml.calc.template": {
    "source": "apache",
    "extensions": ["stc"]
  },
  "application/vnd.sun.xml.draw": {
    "source": "apache",
    "extensions": ["sxd"]
  },
  "application/vnd.sun.xml.draw.template": {
    "source": "apache",
    "extensions": ["std"]
  },
  "application/vnd.sun.xml.impress": {
    "source": "apache",
    "extensions": ["sxi"]
  },
  "application/vnd.sun.xml.impress.template": {
    "source": "apache",
    "extensions": ["sti"]
  },
  "application/vnd.sun.xml.math": {
    "source": "apache",
    "extensions": ["sxm"]
  },
  "application/vnd.sun.xml.writer": {
    "source": "apache",
    "extensions": ["sxw"]
  },
  "application/vnd.sun.xml.writer.global": {
    "source": "apache",
    "extensions": ["sxg"]
  },
  "application/vnd.sun.xml.writer.template": {
    "source": "apache",
    "extensions": ["stw"]
  },
  "application/vnd.sus-calendar": {
    "source": "iana",
    "extensions": ["sus","susp"]
  },
  "application/vnd.svd": {
    "source": "iana",
    "extensions": ["svd"]
  },
  "application/vnd.swiftview-ics": {
    "source": "iana"
  },
  "application/vnd.symbian.install": {
    "source": "apache",
    "extensions": ["sis","sisx"]
  },
  "application/vnd.syncml+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true,
    "extensions": ["xsm"]
  },
  "application/vnd.syncml.dm+wbxml": {
    "source": "iana",
    "charset": "UTF-8",
    "extensions": ["bdm"]
  },
  "application/vnd.syncml.dm+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true,
    "extensions": ["xdm"]
  },
  "application/vnd.syncml.dm.notification": {
    "source": "iana"
  },
  "application/vnd.syncml.dmddf+wbxml": {
    "source": "iana"
  },
  "application/vnd.syncml.dmddf+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true,
    "extensions": ["ddf"]
  },
  "application/vnd.syncml.dmtnds+wbxml": {
    "source": "iana"
  },
  "application/vnd.syncml.dmtnds+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/vnd.syncml.ds.notification": {
    "source": "iana"
  },
  "application/vnd.tableschema+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.tao.intent-module-archive": {
    "source": "iana",
    "extensions": ["tao"]
  },
  "application/vnd.tcpdump.pcap": {
    "source": "iana",
    "extensions": ["pcap","cap","dmp"]
  },
  "application/vnd.think-cell.ppttc+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.tmd.mediaflex.api+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.tml": {
    "source": "iana"
  },
  "application/vnd.tmobile-livetv": {
    "source": "iana",
    "extensions": ["tmo"]
  },
  "application/vnd.tri.onesource": {
    "source": "iana"
  },
  "application/vnd.trid.tpt": {
    "source": "iana",
    "extensions": ["tpt"]
  },
  "application/vnd.triscape.mxs": {
    "source": "iana",
    "extensions": ["mxs"]
  },
  "application/vnd.trueapp": {
    "source": "iana",
    "extensions": ["tra"]
  },
  "application/vnd.truedoc": {
    "source": "iana"
  },
  "application/vnd.ubisoft.webplayer": {
    "source": "iana"
  },
  "application/vnd.ufdl": {
    "source": "iana",
    "extensions": ["ufd","ufdl"]
  },
  "application/vnd.uiq.theme": {
    "source": "iana",
    "extensions": ["utz"]
  },
  "application/vnd.umajin": {
    "source": "iana",
    "extensions": ["umj"]
  },
  "application/vnd.unity": {
    "source": "iana",
    "extensions": ["unityweb"]
  },
  "application/vnd.uoml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["uoml"]
  },
  "application/vnd.uplanet.alert": {
    "source": "iana"
  },
  "application/vnd.uplanet.alert-wbxml": {
    "source": "iana"
  },
  "application/vnd.uplanet.bearer-choice": {
    "source": "iana"
  },
  "application/vnd.uplanet.bearer-choice-wbxml": {
    "source": "iana"
  },
  "application/vnd.uplanet.cacheop": {
    "source": "iana"
  },
  "application/vnd.uplanet.cacheop-wbxml": {
    "source": "iana"
  },
  "application/vnd.uplanet.channel": {
    "source": "iana"
  },
  "application/vnd.uplanet.channel-wbxml": {
    "source": "iana"
  },
  "application/vnd.uplanet.list": {
    "source": "iana"
  },
  "application/vnd.uplanet.list-wbxml": {
    "source": "iana"
  },
  "application/vnd.uplanet.listcmd": {
    "source": "iana"
  },
  "application/vnd.uplanet.listcmd-wbxml": {
    "source": "iana"
  },
  "application/vnd.uplanet.signal": {
    "source": "iana"
  },
  "application/vnd.uri-map": {
    "source": "iana"
  },
  "application/vnd.valve.source.material": {
    "source": "iana"
  },
  "application/vnd.vcx": {
    "source": "iana",
    "extensions": ["vcx"]
  },
  "application/vnd.vd-study": {
    "source": "iana"
  },
  "application/vnd.vectorworks": {
    "source": "iana"
  },
  "application/vnd.vel+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.verimatrix.vcas": {
    "source": "iana"
  },
  "application/vnd.veryant.thin": {
    "source": "iana"
  },
  "application/vnd.ves.encrypted": {
    "source": "iana"
  },
  "application/vnd.vidsoft.vidconference": {
    "source": "iana"
  },
  "application/vnd.visio": {
    "source": "iana",
    "extensions": ["vsd","vst","vss","vsw"]
  },
  "application/vnd.visionary": {
    "source": "iana",
    "extensions": ["vis"]
  },
  "application/vnd.vividence.scriptfile": {
    "source": "iana"
  },
  "application/vnd.vsf": {
    "source": "iana",
    "extensions": ["vsf"]
  },
  "application/vnd.wap.sic": {
    "source": "iana"
  },
  "application/vnd.wap.slc": {
    "source": "iana"
  },
  "application/vnd.wap.wbxml": {
    "source": "iana",
    "charset": "UTF-8",
    "extensions": ["wbxml"]
  },
  "application/vnd.wap.wmlc": {
    "source": "iana",
    "extensions": ["wmlc"]
  },
  "application/vnd.wap.wmlscriptc": {
    "source": "iana",
    "extensions": ["wmlsc"]
  },
  "application/vnd.webturbo": {
    "source": "iana",
    "extensions": ["wtb"]
  },
  "application/vnd.wfa.p2p": {
    "source": "iana"
  },
  "application/vnd.wfa.wsc": {
    "source": "iana"
  },
  "application/vnd.windows.devicepairing": {
    "source": "iana"
  },
  "application/vnd.wmc": {
    "source": "iana"
  },
  "application/vnd.wmf.bootstrap": {
    "source": "iana"
  },
  "application/vnd.wolfram.mathematica": {
    "source": "iana"
  },
  "application/vnd.wolfram.mathematica.package": {
    "source": "iana"
  },
  "application/vnd.wolfram.player": {
    "source": "iana",
    "extensions": ["nbp"]
  },
  "application/vnd.wordperfect": {
    "source": "iana",
    "extensions": ["wpd"]
  },
  "application/vnd.wqd": {
    "source": "iana",
    "extensions": ["wqd"]
  },
  "application/vnd.wrq-hp3000-labelled": {
    "source": "iana"
  },
  "application/vnd.wt.stf": {
    "source": "iana",
    "extensions": ["stf"]
  },
  "application/vnd.wv.csp+wbxml": {
    "source": "iana"
  },
  "application/vnd.wv.csp+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.wv.ssp+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.xacml+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.xara": {
    "source": "iana",
    "extensions": ["xar"]
  },
  "application/vnd.xfdl": {
    "source": "iana",
    "extensions": ["xfdl"]
  },
  "application/vnd.xfdl.webform": {
    "source": "iana"
  },
  "application/vnd.xmi+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.xmpie.cpkg": {
    "source": "iana"
  },
  "application/vnd.xmpie.dpkg": {
    "source": "iana"
  },
  "application/vnd.xmpie.plan": {
    "source": "iana"
  },
  "application/vnd.xmpie.ppkg": {
    "source": "iana"
  },
  "application/vnd.xmpie.xlim": {
    "source": "iana"
  },
  "application/vnd.yamaha.hv-dic": {
    "source": "iana",
    "extensions": ["hvd"]
  },
  "application/vnd.yamaha.hv-script": {
    "source": "iana",
    "extensions": ["hvs"]
  },
  "application/vnd.yamaha.hv-voice": {
    "source": "iana",
    "extensions": ["hvp"]
  },
  "application/vnd.yamaha.openscoreformat": {
    "source": "iana",
    "extensions": ["osf"]
  },
  "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["osfpvg"]
  },
  "application/vnd.yamaha.remote-setup": {
    "source": "iana"
  },
  "application/vnd.yamaha.smaf-audio": {
    "source": "iana",
    "extensions": ["saf"]
  },
  "application/vnd.yamaha.smaf-phrase": {
    "source": "iana",
    "extensions": ["spf"]
  },
  "application/vnd.yamaha.through-ngn": {
    "source": "iana"
  },
  "application/vnd.yamaha.tunnel-udpencap": {
    "source": "iana"
  },
  "application/vnd.yaoweme": {
    "source": "iana"
  },
  "application/vnd.yellowriver-custom-menu": {
    "source": "iana",
    "extensions": ["cmp"]
  },
  "application/vnd.youtube.yt": {
    "source": "iana"
  },
  "application/vnd.zul": {
    "source": "iana",
    "extensions": ["zir","zirz"]
  },
  "application/vnd.zzazz.deck+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["zaz"]
  },
  "application/voicexml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["vxml"]
  },
  "application/voucher-cms+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vq-rtcpxr": {
    "source": "iana"
  },
  "application/wasm": {
    "compressible": true,
    "extensions": ["wasm"]
  },
  "application/watcherinfo+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/webpush-options+json": {
    "source": "iana",
    "compressible": true
  },
  "application/whoispp-query": {
    "source": "iana"
  },
  "application/whoispp-response": {
    "source": "iana"
  },
  "application/widget": {
    "source": "iana",
    "extensions": ["wgt"]
  },
  "application/winhlp": {
    "source": "apache",
    "extensions": ["hlp"]
  },
  "application/wita": {
    "source": "iana"
  },
  "application/wordperfect5.1": {
    "source": "iana"
  },
  "application/wsdl+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["wsdl"]
  },
  "application/wspolicy+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["wspolicy"]
  },
  "application/x-7z-compressed": {
    "source": "apache",
    "compressible": false,
    "extensions": ["7z"]
  },
  "application/x-abiword": {
    "source": "apache",
    "extensions": ["abw"]
  },
  "application/x-ace-compressed": {
    "source": "apache",
    "extensions": ["ace"]
  },
  "application/x-amf": {
    "source": "apache"
  },
  "application/x-apple-diskimage": {
    "source": "apache",
    "extensions": ["dmg"]
  },
  "application/x-arj": {
    "compressible": false,
    "extensions": ["arj"]
  },
  "application/x-authorware-bin": {
    "source": "apache",
    "extensions": ["aab","x32","u32","vox"]
  },
  "application/x-authorware-map": {
    "source": "apache",
    "extensions": ["aam"]
  },
  "application/x-authorware-seg": {
    "source": "apache",
    "extensions": ["aas"]
  },
  "application/x-bcpio": {
    "source": "apache",
    "extensions": ["bcpio"]
  },
  "application/x-bdoc": {
    "compressible": false,
    "extensions": ["bdoc"]
  },
  "application/x-bittorrent": {
    "source": "apache",
    "extensions": ["torrent"]
  },
  "application/x-blorb": {
    "source": "apache",
    "extensions": ["blb","blorb"]
  },
  "application/x-bzip": {
    "source": "apache",
    "compressible": false,
    "extensions": ["bz"]
  },
  "application/x-bzip2": {
    "source": "apache",
    "compressible": false,
    "extensions": ["bz2","boz"]
  },
  "application/x-cbr": {
    "source": "apache",
    "extensions": ["cbr","cba","cbt","cbz","cb7"]
  },
  "application/x-cdlink": {
    "source": "apache",
    "extensions": ["vcd"]
  },
  "application/x-cfs-compressed": {
    "source": "apache",
    "extensions": ["cfs"]
  },
  "application/x-chat": {
    "source": "apache",
    "extensions": ["chat"]
  },
  "application/x-chess-pgn": {
    "source": "apache",
    "extensions": ["pgn"]
  },
  "application/x-chrome-extension": {
    "extensions": ["crx"]
  },
  "application/x-cocoa": {
    "source": "nginx",
    "extensions": ["cco"]
  },
  "application/x-compress": {
    "source": "apache"
  },
  "application/x-conference": {
    "source": "apache",
    "extensions": ["nsc"]
  },
  "application/x-cpio": {
    "source": "apache",
    "extensions": ["cpio"]
  },
  "application/x-csh": {
    "source": "apache",
    "extensions": ["csh"]
  },
  "application/x-deb": {
    "compressible": false
  },
  "application/x-debian-package": {
    "source": "apache",
    "extensions": ["deb","udeb"]
  },
  "application/x-dgc-compressed": {
    "source": "apache",
    "extensions": ["dgc"]
  },
  "application/x-director": {
    "source": "apache",
    "extensions": ["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"]
  },
  "application/x-doom": {
    "source": "apache",
    "extensions": ["wad"]
  },
  "application/x-dtbncx+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["ncx"]
  },
  "application/x-dtbook+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["dtb"]
  },
  "application/x-dtbresource+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["res"]
  },
  "application/x-dvi": {
    "source": "apache",
    "compressible": false,
    "extensions": ["dvi"]
  },
  "application/x-envoy": {
    "source": "apache",
    "extensions": ["evy"]
  },
  "application/x-eva": {
    "source": "apache",
    "extensions": ["eva"]
  },
  "application/x-font-bdf": {
    "source": "apache",
    "extensions": ["bdf"]
  },
  "application/x-font-dos": {
    "source": "apache"
  },
  "application/x-font-framemaker": {
    "source": "apache"
  },
  "application/x-font-ghostscript": {
    "source": "apache",
    "extensions": ["gsf"]
  },
  "application/x-font-libgrx": {
    "source": "apache"
  },
  "application/x-font-linux-psf": {
    "source": "apache",
    "extensions": ["psf"]
  },
  "application/x-font-pcf": {
    "source": "apache",
    "extensions": ["pcf"]
  },
  "application/x-font-snf": {
    "source": "apache",
    "extensions": ["snf"]
  },
  "application/x-font-speedo": {
    "source": "apache"
  },
  "application/x-font-sunos-news": {
    "source": "apache"
  },
  "application/x-font-type1": {
    "source": "apache",
    "extensions": ["pfa","pfb","pfm","afm"]
  },
  "application/x-font-vfont": {
    "source": "apache"
  },
  "application/x-freearc": {
    "source": "apache",
    "extensions": ["arc"]
  },
  "application/x-futuresplash": {
    "source": "apache",
    "extensions": ["spl"]
  },
  "application/x-gca-compressed": {
    "source": "apache",
    "extensions": ["gca"]
  },
  "application/x-glulx": {
    "source": "apache",
    "extensions": ["ulx"]
  },
  "application/x-gnumeric": {
    "source": "apache",
    "extensions": ["gnumeric"]
  },
  "application/x-gramps-xml": {
    "source": "apache",
    "extensions": ["gramps"]
  },
  "application/x-gtar": {
    "source": "apache",
    "extensions": ["gtar"]
  },
  "application/x-gzip": {
    "source": "apache"
  },
  "application/x-hdf": {
    "source": "apache",
    "extensions": ["hdf"]
  },
  "application/x-httpd-php": {
    "compressible": true,
    "extensions": ["php"]
  },
  "application/x-install-instructions": {
    "source": "apache",
    "extensions": ["install"]
  },
  "application/x-iso9660-image": {
    "source": "apache",
    "extensions": ["iso"]
  },
  "application/x-java-archive-diff": {
    "source": "nginx",
    "extensions": ["jardiff"]
  },
  "application/x-java-jnlp-file": {
    "source": "apache",
    "compressible": false,
    "extensions": ["jnlp"]
  },
  "application/x-javascript": {
    "compressible": true
  },
  "application/x-keepass2": {
    "extensions": ["kdbx"]
  },
  "application/x-latex": {
    "source": "apache",
    "compressible": false,
    "extensions": ["latex"]
  },
  "application/x-lua-bytecode": {
    "extensions": ["luac"]
  },
  "application/x-lzh-compressed": {
    "source": "apache",
    "extensions": ["lzh","lha"]
  },
  "application/x-makeself": {
    "source": "nginx",
    "extensions": ["run"]
  },
  "application/x-mie": {
    "source": "apache",
    "extensions": ["mie"]
  },
  "application/x-mobipocket-ebook": {
    "source": "apache",
    "extensions": ["prc","mobi"]
  },
  "application/x-mpegurl": {
    "compressible": false
  },
  "application/x-ms-application": {
    "source": "apache",
    "extensions": ["application"]
  },
  "application/x-ms-shortcut": {
    "source": "apache",
    "extensions": ["lnk"]
  },
  "application/x-ms-wmd": {
    "source": "apache",
    "extensions": ["wmd"]
  },
  "application/x-ms-wmz": {
    "source": "apache",
    "extensions": ["wmz"]
  },
  "application/x-ms-xbap": {
    "source": "apache",
    "extensions": ["xbap"]
  },
  "application/x-msaccess": {
    "source": "apache",
    "extensions": ["mdb"]
  },
  "application/x-msbinder": {
    "source": "apache",
    "extensions": ["obd"]
  },
  "application/x-mscardfile": {
    "source": "apache",
    "extensions": ["crd"]
  },
  "application/x-msclip": {
    "source": "apache",
    "extensions": ["clp"]
  },
  "application/x-msdos-program": {
    "extensions": ["exe"]
  },
  "application/x-msdownload": {
    "source": "apache",
    "extensions": ["exe","dll","com","bat","msi"]
  },
  "application/x-msmediaview": {
    "source": "apache",
    "extensions": ["mvb","m13","m14"]
  },
  "application/x-msmetafile": {
    "source": "apache",
    "extensions": ["wmf","wmz","emf","emz"]
  },
  "application/x-msmoney": {
    "source": "apache",
    "extensions": ["mny"]
  },
  "application/x-mspublisher": {
    "source": "apache",
    "extensions": ["pub"]
  },
  "application/x-msschedule": {
    "source": "apache",
    "extensions": ["scd"]
  },
  "application/x-msterminal": {
    "source": "apache",
    "extensions": ["trm"]
  },
  "application/x-mswrite": {
    "source": "apache",
    "extensions": ["wri"]
  },
  "application/x-netcdf": {
    "source": "apache",
    "extensions": ["nc","cdf"]
  },
  "application/x-ns-proxy-autoconfig": {
    "compressible": true,
    "extensions": ["pac"]
  },
  "application/x-nzb": {
    "source": "apache",
    "extensions": ["nzb"]
  },
  "application/x-perl": {
    "source": "nginx",
    "extensions": ["pl","pm"]
  },
  "application/x-pilot": {
    "source": "nginx",
    "extensions": ["prc","pdb"]
  },
  "application/x-pkcs12": {
    "source": "apache",
    "compressible": false,
    "extensions": ["p12","pfx"]
  },
  "application/x-pkcs7-certificates": {
    "source": "apache",
    "extensions": ["p7b","spc"]
  },
  "application/x-pkcs7-certreqresp": {
    "source": "apache",
    "extensions": ["p7r"]
  },
  "application/x-pki-message": {
    "source": "iana"
  },
  "application/x-rar-compressed": {
    "source": "apache",
    "compressible": false,
    "extensions": ["rar"]
  },
  "application/x-redhat-package-manager": {
    "source": "nginx",
    "extensions": ["rpm"]
  },
  "application/x-research-info-systems": {
    "source": "apache",
    "extensions": ["ris"]
  },
  "application/x-sea": {
    "source": "nginx",
    "extensions": ["sea"]
  },
  "application/x-sh": {
    "source": "apache",
    "compressible": true,
    "extensions": ["sh"]
  },
  "application/x-shar": {
    "source": "apache",
    "extensions": ["shar"]
  },
  "application/x-shockwave-flash": {
    "source": "apache",
    "compressible": false,
    "extensions": ["swf"]
  },
  "application/x-silverlight-app": {
    "source": "apache",
    "extensions": ["xap"]
  },
  "application/x-sql": {
    "source": "apache",
    "extensions": ["sql"]
  },
  "application/x-stuffit": {
    "source": "apache",
    "compressible": false,
    "extensions": ["sit"]
  },
  "application/x-stuffitx": {
    "source": "apache",
    "extensions": ["sitx"]
  },
  "application/x-subrip": {
    "source": "apache",
    "extensions": ["srt"]
  },
  "application/x-sv4cpio": {
    "source": "apache",
    "extensions": ["sv4cpio"]
  },
  "application/x-sv4crc": {
    "source": "apache",
    "extensions": ["sv4crc"]
  },
  "application/x-t3vm-image": {
    "source": "apache",
    "extensions": ["t3"]
  },
  "application/x-tads": {
    "source": "apache",
    "extensions": ["gam"]
  },
  "application/x-tar": {
    "source": "apache",
    "compressible": true,
    "extensions": ["tar"]
  },
  "application/x-tcl": {
    "source": "apache",
    "extensions": ["tcl","tk"]
  },
  "application/x-tex": {
    "source": "apache",
    "extensions": ["tex"]
  },
  "application/x-tex-tfm": {
    "source": "apache",
    "extensions": ["tfm"]
  },
  "application/x-texinfo": {
    "source": "apache",
    "extensions": ["texinfo","texi"]
  },
  "application/x-tgif": {
    "source": "apache",
    "extensions": ["obj"]
  },
  "application/x-ustar": {
    "source": "apache",
    "extensions": ["ustar"]
  },
  "application/x-virtualbox-hdd": {
    "compressible": true,
    "extensions": ["hdd"]
  },
  "application/x-virtualbox-ova": {
    "compressible": true,
    "extensions": ["ova"]
  },
  "application/x-virtualbox-ovf": {
    "compressible": true,
    "extensions": ["ovf"]
  },
  "application/x-virtualbox-vbox": {
    "compressible": true,
    "extensions": ["vbox"]
  },
  "application/x-virtualbox-vbox-extpack": {
    "compressible": false,
    "extensions": ["vbox-extpack"]
  },
  "application/x-virtualbox-vdi": {
    "compressible": true,
    "extensions": ["vdi"]
  },
  "application/x-virtualbox-vhd": {
    "compressible": true,
    "extensions": ["vhd"]
  },
  "application/x-virtualbox-vmdk": {
    "compressible": true,
    "extensions": ["vmdk"]
  },
  "application/x-wais-source": {
    "source": "apache",
    "extensions": ["src"]
  },
  "application/x-web-app-manifest+json": {
    "compressible": true,
    "extensions": ["webapp"]
  },
  "application/x-www-form-urlencoded": {
    "source": "iana",
    "compressible": true
  },
  "application/x-x509-ca-cert": {
    "source": "iana",
    "extensions": ["der","crt","pem"]
  },
  "application/x-x509-ca-ra-cert": {
    "source": "iana"
  },
  "application/x-x509-next-ca-cert": {
    "source": "iana"
  },
  "application/x-xfig": {
    "source": "apache",
    "extensions": ["fig"]
  },
  "application/x-xliff+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["xlf"]
  },
  "application/x-xpinstall": {
    "source": "apache",
    "compressible": false,
    "extensions": ["xpi"]
  },
  "application/x-xz": {
    "source": "apache",
    "extensions": ["xz"]
  },
  "application/x-zmachine": {
    "source": "apache",
    "extensions": ["z1","z2","z3","z4","z5","z6","z7","z8"]
  },
  "application/x400-bp": {
    "source": "iana"
  },
  "application/xacml+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/xaml+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["xaml"]
  },
  "application/xcap-att+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xav"]
  },
  "application/xcap-caps+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xca"]
  },
  "application/xcap-diff+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xdf"]
  },
  "application/xcap-el+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xel"]
  },
  "application/xcap-error+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xer"]
  },
  "application/xcap-ns+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xns"]
  },
  "application/xcon-conference-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/xcon-conference-info-diff+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/xenc+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xenc"]
  },
  "application/xhtml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xhtml","xht"]
  },
  "application/xhtml-voice+xml": {
    "source": "apache",
    "compressible": true
  },
  "application/xliff+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xlf"]
  },
  "application/xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xml","xsl","xsd","rng"]
  },
  "application/xml-dtd": {
    "source": "iana",
    "compressible": true,
    "extensions": ["dtd"]
  },
  "application/xml-external-parsed-entity": {
    "source": "iana"
  },
  "application/xml-patch+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/xmpp+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/xop+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xop"]
  },
  "application/xproc+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["xpl"]
  },
  "application/xslt+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xslt"]
  },
  "application/xspf+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["xspf"]
  },
  "application/xv+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["mxml","xhvml","xvml","xvm"]
  },
  "application/yang": {
    "source": "iana",
    "extensions": ["yang"]
  },
  "application/yang-data+json": {
    "source": "iana",
    "compressible": true
  },
  "application/yang-data+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/yang-patch+json": {
    "source": "iana",
    "compressible": true
  },
  "application/yang-patch+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/yin+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["yin"]
  },
  "application/zip": {
    "source": "iana",
    "compressible": false,
    "extensions": ["zip"]
  },
  "application/zlib": {
    "source": "iana"
  },
  "application/zstd": {
    "source": "iana"
  },
  "audio/1d-interleaved-parityfec": {
    "source": "iana"
  },
  "audio/32kadpcm": {
    "source": "iana"
  },
  "audio/3gpp": {
    "source": "iana",
    "compressible": false,
    "extensions": ["3gpp"]
  },
  "audio/3gpp2": {
    "source": "iana"
  },
  "audio/aac": {
    "source": "iana"
  },
  "audio/ac3": {
    "source": "iana"
  },
  "audio/adpcm": {
    "source": "apache",
    "extensions": ["adp"]
  },
  "audio/amr": {
    "source": "iana"
  },
  "audio/amr-wb": {
    "source": "iana"
  },
  "audio/amr-wb+": {
    "source": "iana"
  },
  "audio/aptx": {
    "source": "iana"
  },
  "audio/asc": {
    "source": "iana"
  },
  "audio/atrac-advanced-lossless": {
    "source": "iana"
  },
  "audio/atrac-x": {
    "source": "iana"
  },
  "audio/atrac3": {
    "source": "iana"
  },
  "audio/basic": {
    "source": "iana",
    "compressible": false,
    "extensions": ["au","snd"]
  },
  "audio/bv16": {
    "source": "iana"
  },
  "audio/bv32": {
    "source": "iana"
  },
  "audio/clearmode": {
    "source": "iana"
  },
  "audio/cn": {
    "source": "iana"
  },
  "audio/dat12": {
    "source": "iana"
  },
  "audio/dls": {
    "source": "iana"
  },
  "audio/dsr-es201108": {
    "source": "iana"
  },
  "audio/dsr-es202050": {
    "source": "iana"
  },
  "audio/dsr-es202211": {
    "source": "iana"
  },
  "audio/dsr-es202212": {
    "source": "iana"
  },
  "audio/dv": {
    "source": "iana"
  },
  "audio/dvi4": {
    "source": "iana"
  },
  "audio/eac3": {
    "source": "iana"
  },
  "audio/encaprtp": {
    "source": "iana"
  },
  "audio/evrc": {
    "source": "iana"
  },
  "audio/evrc-qcp": {
    "source": "iana"
  },
  "audio/evrc0": {
    "source": "iana"
  },
  "audio/evrc1": {
    "source": "iana"
  },
  "audio/evrcb": {
    "source": "iana"
  },
  "audio/evrcb0": {
    "source": "iana"
  },
  "audio/evrcb1": {
    "source": "iana"
  },
  "audio/evrcnw": {
    "source": "iana"
  },
  "audio/evrcnw0": {
    "source": "iana"
  },
  "audio/evrcnw1": {
    "source": "iana"
  },
  "audio/evrcwb": {
    "source": "iana"
  },
  "audio/evrcwb0": {
    "source": "iana"
  },
  "audio/evrcwb1": {
    "source": "iana"
  },
  "audio/evs": {
    "source": "iana"
  },
  "audio/flexfec": {
    "source": "iana"
  },
  "audio/fwdred": {
    "source": "iana"
  },
  "audio/g711-0": {
    "source": "iana"
  },
  "audio/g719": {
    "source": "iana"
  },
  "audio/g722": {
    "source": "iana"
  },
  "audio/g7221": {
    "source": "iana"
  },
  "audio/g723": {
    "source": "iana"
  },
  "audio/g726-16": {
    "source": "iana"
  },
  "audio/g726-24": {
    "source": "iana"
  },
  "audio/g726-32": {
    "source": "iana"
  },
  "audio/g726-40": {
    "source": "iana"
  },
  "audio/g728": {
    "source": "iana"
  },
  "audio/g729": {
    "source": "iana"
  },
  "audio/g7291": {
    "source": "iana"
  },
  "audio/g729d": {
    "source": "iana"
  },
  "audio/g729e": {
    "source": "iana"
  },
  "audio/gsm": {
    "source": "iana"
  },
  "audio/gsm-efr": {
    "source": "iana"
  },
  "audio/gsm-hr-08": {
    "source": "iana"
  },
  "audio/ilbc": {
    "source": "iana"
  },
  "audio/ip-mr_v2.5": {
    "source": "iana"
  },
  "audio/isac": {
    "source": "apache"
  },
  "audio/l16": {
    "source": "iana"
  },
  "audio/l20": {
    "source": "iana"
  },
  "audio/l24": {
    "source": "iana",
    "compressible": false
  },
  "audio/l8": {
    "source": "iana"
  },
  "audio/lpc": {
    "source": "iana"
  },
  "audio/melp": {
    "source": "iana"
  },
  "audio/melp1200": {
    "source": "iana"
  },
  "audio/melp2400": {
    "source": "iana"
  },
  "audio/melp600": {
    "source": "iana"
  },
  "audio/mhas": {
    "source": "iana"
  },
  "audio/midi": {
    "source": "apache",
    "extensions": ["mid","midi","kar","rmi"]
  },
  "audio/mobile-xmf": {
    "source": "iana",
    "extensions": ["mxmf"]
  },
  "audio/mp3": {
    "compressible": false,
    "extensions": ["mp3"]
  },
  "audio/mp4": {
    "source": "iana",
    "compressible": false,
    "extensions": ["m4a","mp4a"]
  },
  "audio/mp4a-latm": {
    "source": "iana"
  },
  "audio/mpa": {
    "source": "iana"
  },
  "audio/mpa-robust": {
    "source": "iana"
  },
  "audio/mpeg": {
    "source": "iana",
    "compressible": false,
    "extensions": ["mpga","mp2","mp2a","mp3","m2a","m3a"]
  },
  "audio/mpeg4-generic": {
    "source": "iana"
  },
  "audio/musepack": {
    "source": "apache"
  },
  "audio/ogg": {
    "source": "iana",
    "compressible": false,
    "extensions": ["oga","ogg","spx"]
  },
  "audio/opus": {
    "source": "iana"
  },
  "audio/parityfec": {
    "source": "iana"
  },
  "audio/pcma": {
    "source": "iana"
  },
  "audio/pcma-wb": {
    "source": "iana"
  },
  "audio/pcmu": {
    "source": "iana"
  },
  "audio/pcmu-wb": {
    "source": "iana"
  },
  "audio/prs.sid": {
    "source": "iana"
  },
  "audio/qcelp": {
    "source": "iana"
  },
  "audio/raptorfec": {
    "source": "iana"
  },
  "audio/red": {
    "source": "iana"
  },
  "audio/rtp-enc-aescm128": {
    "source": "iana"
  },
  "audio/rtp-midi": {
    "source": "iana"
  },
  "audio/rtploopback": {
    "source": "iana"
  },
  "audio/rtx": {
    "source": "iana"
  },
  "audio/s3m": {
    "source": "apache",
    "extensions": ["s3m"]
  },
  "audio/silk": {
    "source": "apache",
    "extensions": ["sil"]
  },
  "audio/smv": {
    "source": "iana"
  },
  "audio/smv-qcp": {
    "source": "iana"
  },
  "audio/smv0": {
    "source": "iana"
  },
  "audio/sp-midi": {
    "source": "iana"
  },
  "audio/speex": {
    "source": "iana"
  },
  "audio/t140c": {
    "source": "iana"
  },
  "audio/t38": {
    "source": "iana"
  },
  "audio/telephone-event": {
    "source": "iana"
  },
  "audio/tetra_acelp": {
    "source": "iana"
  },
  "audio/tetra_acelp_bb": {
    "source": "iana"
  },
  "audio/tone": {
    "source": "iana"
  },
  "audio/uemclip": {
    "source": "iana"
  },
  "audio/ulpfec": {
    "source": "iana"
  },
  "audio/usac": {
    "source": "iana"
  },
  "audio/vdvi": {
    "source": "iana"
  },
  "audio/vmr-wb": {
    "source": "iana"
  },
  "audio/vnd.3gpp.iufp": {
    "source": "iana"
  },
  "audio/vnd.4sb": {
    "source": "iana"
  },
  "audio/vnd.audiokoz": {
    "source": "iana"
  },
  "audio/vnd.celp": {
    "source": "iana"
  },
  "audio/vnd.cisco.nse": {
    "source": "iana"
  },
  "audio/vnd.cmles.radio-events": {
    "source": "iana"
  },
  "audio/vnd.cns.anp1": {
    "source": "iana"
  },
  "audio/vnd.cns.inf1": {
    "source": "iana"
  },
  "audio/vnd.dece.audio": {
    "source": "iana",
    "extensions": ["uva","uvva"]
  },
  "audio/vnd.digital-winds": {
    "source": "iana",
    "extensions": ["eol"]
  },
  "audio/vnd.dlna.adts": {
    "source": "iana"
  },
  "audio/vnd.dolby.heaac.1": {
    "source": "iana"
  },
  "audio/vnd.dolby.heaac.2": {
    "source": "iana"
  },
  "audio/vnd.dolby.mlp": {
    "source": "iana"
  },
  "audio/vnd.dolby.mps": {
    "source": "iana"
  },
  "audio/vnd.dolby.pl2": {
    "source": "iana"
  },
  "audio/vnd.dolby.pl2x": {
    "source": "iana"
  },
  "audio/vnd.dolby.pl2z": {
    "source": "iana"
  },
  "audio/vnd.dolby.pulse.1": {
    "source": "iana"
  },
  "audio/vnd.dra": {
    "source": "iana",
    "extensions": ["dra"]
  },
  "audio/vnd.dts": {
    "source": "iana",
    "extensions": ["dts"]
  },
  "audio/vnd.dts.hd": {
    "source": "iana",
    "extensions": ["dtshd"]
  },
  "audio/vnd.dts.uhd": {
    "source": "iana"
  },
  "audio/vnd.dvb.file": {
    "source": "iana"
  },
  "audio/vnd.everad.plj": {
    "source": "iana"
  },
  "audio/vnd.hns.audio": {
    "source": "iana"
  },
  "audio/vnd.lucent.voice": {
    "source": "iana",
    "extensions": ["lvp"]
  },
  "audio/vnd.ms-playready.media.pya": {
    "source": "iana",
    "extensions": ["pya"]
  },
  "audio/vnd.nokia.mobile-xmf": {
    "source": "iana"
  },
  "audio/vnd.nortel.vbk": {
    "source": "iana"
  },
  "audio/vnd.nuera.ecelp4800": {
    "source": "iana",
    "extensions": ["ecelp4800"]
  },
  "audio/vnd.nuera.ecelp7470": {
    "source": "iana",
    "extensions": ["ecelp7470"]
  },
  "audio/vnd.nuera.ecelp9600": {
    "source": "iana",
    "extensions": ["ecelp9600"]
  },
  "audio/vnd.octel.sbc": {
    "source": "iana"
  },
  "audio/vnd.presonus.multitrack": {
    "source": "iana"
  },
  "audio/vnd.qcelp": {
    "source": "iana"
  },
  "audio/vnd.rhetorex.32kadpcm": {
    "source": "iana"
  },
  "audio/vnd.rip": {
    "source": "iana",
    "extensions": ["rip"]
  },
  "audio/vnd.rn-realaudio": {
    "compressible": false
  },
  "audio/vnd.sealedmedia.softseal.mpeg": {
    "source": "iana"
  },
  "audio/vnd.vmx.cvsd": {
    "source": "iana"
  },
  "audio/vnd.wave": {
    "compressible": false
  },
  "audio/vorbis": {
    "source": "iana",
    "compressible": false
  },
  "audio/vorbis-config": {
    "source": "iana"
  },
  "audio/wav": {
    "compressible": false,
    "extensions": ["wav"]
  },
  "audio/wave": {
    "compressible": false,
    "extensions": ["wav"]
  },
  "audio/webm": {
    "source": "apache",
    "compressible": false,
    "extensions": ["weba"]
  },
  "audio/x-aac": {
    "source": "apache",
    "compressible": false,
    "extensions": ["aac"]
  },
  "audio/x-aiff": {
    "source": "apache",
    "extensions": ["aif","aiff","aifc"]
  },
  "audio/x-caf": {
    "source": "apache",
    "compressible": false,
    "extensions": ["caf"]
  },
  "audio/x-flac": {
    "source": "apache",
    "extensions": ["flac"]
  },
  "audio/x-m4a": {
    "source": "nginx",
    "extensions": ["m4a"]
  },
  "audio/x-matroska": {
    "source": "apache",
    "extensions": ["mka"]
  },
  "audio/x-mpegurl": {
    "source": "apache",
    "extensions": ["m3u"]
  },
  "audio/x-ms-wax": {
    "source": "apache",
    "extensions": ["wax"]
  },
  "audio/x-ms-wma": {
    "source": "apache",
    "extensions": ["wma"]
  },
  "audio/x-pn-realaudio": {
    "source": "apache",
    "extensions": ["ram","ra"]
  },
  "audio/x-pn-realaudio-plugin": {
    "source": "apache",
    "extensions": ["rmp"]
  },
  "audio/x-realaudio": {
    "source": "nginx",
    "extensions": ["ra"]
  },
  "audio/x-tta": {
    "source": "apache"
  },
  "audio/x-wav": {
    "source": "apache",
    "extensions": ["wav"]
  },
  "audio/xm": {
    "source": "apache",
    "extensions": ["xm"]
  },
  "chemical/x-cdx": {
    "source": "apache",
    "extensions": ["cdx"]
  },
  "chemical/x-cif": {
    "source": "apache",
    "extensions": ["cif"]
  },
  "chemical/x-cmdf": {
    "source": "apache",
    "extensions": ["cmdf"]
  },
  "chemical/x-cml": {
    "source": "apache",
    "extensions": ["cml"]
  },
  "chemical/x-csml": {
    "source": "apache",
    "extensions": ["csml"]
  },
  "chemical/x-pdb": {
    "source": "apache"
  },
  "chemical/x-xyz": {
    "source": "apache",
    "extensions": ["xyz"]
  },
  "font/collection": {
    "source": "iana",
    "extensions": ["ttc"]
  },
  "font/otf": {
    "source": "iana",
    "compressible": true,
    "extensions": ["otf"]
  },
  "font/sfnt": {
    "source": "iana"
  },
  "font/ttf": {
    "source": "iana",
    "compressible": true,
    "extensions": ["ttf"]
  },
  "font/woff": {
    "source": "iana",
    "extensions": ["woff"]
  },
  "font/woff2": {
    "source": "iana",
    "extensions": ["woff2"]
  },
  "image/aces": {
    "source": "iana",
    "extensions": ["exr"]
  },
  "image/apng": {
    "compressible": false,
    "extensions": ["apng"]
  },
  "image/avci": {
    "source": "iana"
  },
  "image/avcs": {
    "source": "iana"
  },
  "image/bmp": {
    "source": "iana",
    "compressible": true,
    "extensions": ["bmp"]
  },
  "image/cgm": {
    "source": "iana",
    "extensions": ["cgm"]
  },
  "image/dicom-rle": {
    "source": "iana",
    "extensions": ["drle"]
  },
  "image/emf": {
    "source": "iana",
    "extensions": ["emf"]
  },
  "image/fits": {
    "source": "iana",
    "extensions": ["fits"]
  },
  "image/g3fax": {
    "source": "iana",
    "extensions": ["g3"]
  },
  "image/gif": {
    "source": "iana",
    "compressible": false,
    "extensions": ["gif"]
  },
  "image/heic": {
    "source": "iana",
    "extensions": ["heic"]
  },
  "image/heic-sequence": {
    "source": "iana",
    "extensions": ["heics"]
  },
  "image/heif": {
    "source": "iana",
    "extensions": ["heif"]
  },
  "image/heif-sequence": {
    "source": "iana",
    "extensions": ["heifs"]
  },
  "image/hej2k": {
    "source": "iana",
    "extensions": ["hej2"]
  },
  "image/hsj2": {
    "source": "iana",
    "extensions": ["hsj2"]
  },
  "image/ief": {
    "source": "iana",
    "extensions": ["ief"]
  },
  "image/jls": {
    "source": "iana",
    "extensions": ["jls"]
  },
  "image/jp2": {
    "source": "iana",
    "compressible": false,
    "extensions": ["jp2","jpg2"]
  },
  "image/jpeg": {
    "source": "iana",
    "compressible": false,
    "extensions": ["jpeg","jpg","jpe"]
  },
  "image/jph": {
    "source": "iana",
    "extensions": ["jph"]
  },
  "image/jphc": {
    "source": "iana",
    "extensions": ["jhc"]
  },
  "image/jpm": {
    "source": "iana",
    "compressible": false,
    "extensions": ["jpm"]
  },
  "image/jpx": {
    "source": "iana",
    "compressible": false,
    "extensions": ["jpx","jpf"]
  },
  "image/jxr": {
    "source": "iana",
    "extensions": ["jxr"]
  },
  "image/jxra": {
    "source": "iana",
    "extensions": ["jxra"]
  },
  "image/jxrs": {
    "source": "iana",
    "extensions": ["jxrs"]
  },
  "image/jxs": {
    "source": "iana",
    "extensions": ["jxs"]
  },
  "image/jxsc": {
    "source": "iana",
    "extensions": ["jxsc"]
  },
  "image/jxsi": {
    "source": "iana",
    "extensions": ["jxsi"]
  },
  "image/jxss": {
    "source": "iana",
    "extensions": ["jxss"]
  },
  "image/ktx": {
    "source": "iana",
    "extensions": ["ktx"]
  },
  "image/naplps": {
    "source": "iana"
  },
  "image/pjpeg": {
    "compressible": false
  },
  "image/png": {
    "source": "iana",
    "compressible": false,
    "extensions": ["png"]
  },
  "image/prs.btif": {
    "source": "iana",
    "extensions": ["btif"]
  },
  "image/prs.pti": {
    "source": "iana",
    "extensions": ["pti"]
  },
  "image/pwg-raster": {
    "source": "iana"
  },
  "image/sgi": {
    "source": "apache",
    "extensions": ["sgi"]
  },
  "image/svg+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["svg","svgz"]
  },
  "image/t38": {
    "source": "iana",
    "extensions": ["t38"]
  },
  "image/tiff": {
    "source": "iana",
    "compressible": false,
    "extensions": ["tif","tiff"]
  },
  "image/tiff-fx": {
    "source": "iana",
    "extensions": ["tfx"]
  },
  "image/vnd.adobe.photoshop": {
    "source": "iana",
    "compressible": true,
    "extensions": ["psd"]
  },
  "image/vnd.airzip.accelerator.azv": {
    "source": "iana",
    "extensions": ["azv"]
  },
  "image/vnd.cns.inf2": {
    "source": "iana"
  },
  "image/vnd.dece.graphic": {
    "source": "iana",
    "extensions": ["uvi","uvvi","uvg","uvvg"]
  },
  "image/vnd.djvu": {
    "source": "iana",
    "extensions": ["djvu","djv"]
  },
  "image/vnd.dvb.subtitle": {
    "source": "iana",
    "extensions": ["sub"]
  },
  "image/vnd.dwg": {
    "source": "iana",
    "extensions": ["dwg"]
  },
  "image/vnd.dxf": {
    "source": "iana",
    "extensions": ["dxf"]
  },
  "image/vnd.fastbidsheet": {
    "source": "iana",
    "extensions": ["fbs"]
  },
  "image/vnd.fpx": {
    "source": "iana",
    "extensions": ["fpx"]
  },
  "image/vnd.fst": {
    "source": "iana",
    "extensions": ["fst"]
  },
  "image/vnd.fujixerox.edmics-mmr": {
    "source": "iana",
    "extensions": ["mmr"]
  },
  "image/vnd.fujixerox.edmics-rlc": {
    "source": "iana",
    "extensions": ["rlc"]
  },
  "image/vnd.globalgraphics.pgb": {
    "source": "iana"
  },
  "image/vnd.microsoft.icon": {
    "source": "iana",
    "extensions": ["ico"]
  },
  "image/vnd.mix": {
    "source": "iana"
  },
  "image/vnd.mozilla.apng": {
    "source": "iana"
  },
  "image/vnd.ms-dds": {
    "extensions": ["dds"]
  },
  "image/vnd.ms-modi": {
    "source": "iana",
    "extensions": ["mdi"]
  },
  "image/vnd.ms-photo": {
    "source": "apache",
    "extensions": ["wdp"]
  },
  "image/vnd.net-fpx": {
    "source": "iana",
    "extensions": ["npx"]
  },
  "image/vnd.radiance": {
    "source": "iana"
  },
  "image/vnd.sealed.png": {
    "source": "iana"
  },
  "image/vnd.sealedmedia.softseal.gif": {
    "source": "iana"
  },
  "image/vnd.sealedmedia.softseal.jpg": {
    "source": "iana"
  },
  "image/vnd.svf": {
    "source": "iana"
  },
  "image/vnd.tencent.tap": {
    "source": "iana",
    "extensions": ["tap"]
  },
  "image/vnd.valve.source.texture": {
    "source": "iana",
    "extensions": ["vtf"]
  },
  "image/vnd.wap.wbmp": {
    "source": "iana",
    "extensions": ["wbmp"]
  },
  "image/vnd.xiff": {
    "source": "iana",
    "extensions": ["xif"]
  },
  "image/vnd.zbrush.pcx": {
    "source": "iana",
    "extensions": ["pcx"]
  },
  "image/webp": {
    "source": "apache",
    "extensions": ["webp"]
  },
  "image/wmf": {
    "source": "iana",
    "extensions": ["wmf"]
  },
  "image/x-3ds": {
    "source": "apache",
    "extensions": ["3ds"]
  },
  "image/x-cmu-raster": {
    "source": "apache",
    "extensions": ["ras"]
  },
  "image/x-cmx": {
    "source": "apache",
    "extensions": ["cmx"]
  },
  "image/x-freehand": {
    "source": "apache",
    "extensions": ["fh","fhc","fh4","fh5","fh7"]
  },
  "image/x-icon": {
    "source": "apache",
    "compressible": true,
    "extensions": ["ico"]
  },
  "image/x-jng": {
    "source": "nginx",
    "extensions": ["jng"]
  },
  "image/x-mrsid-image": {
    "source": "apache",
    "extensions": ["sid"]
  },
  "image/x-ms-bmp": {
    "source": "nginx",
    "compressible": true,
    "extensions": ["bmp"]
  },
  "image/x-pcx": {
    "source": "apache",
    "extensions": ["pcx"]
  },
  "image/x-pict": {
    "source": "apache",
    "extensions": ["pic","pct"]
  },
  "image/x-portable-anymap": {
    "source": "apache",
    "extensions": ["pnm"]
  },
  "image/x-portable-bitmap": {
    "source": "apache",
    "extensions": ["pbm"]
  },
  "image/x-portable-graymap": {
    "source": "apache",
    "extensions": ["pgm"]
  },
  "image/x-portable-pixmap": {
    "source": "apache",
    "extensions": ["ppm"]
  },
  "image/x-rgb": {
    "source": "apache",
    "extensions": ["rgb"]
  },
  "image/x-tga": {
    "source": "apache",
    "extensions": ["tga"]
  },
  "image/x-xbitmap": {
    "source": "apache",
    "extensions": ["xbm"]
  },
  "image/x-xcf": {
    "compressible": false
  },
  "image/x-xpixmap": {
    "source": "apache",
    "extensions": ["xpm"]
  },
  "image/x-xwindowdump": {
    "source": "apache",
    "extensions": ["xwd"]
  },
  "message/cpim": {
    "source": "iana"
  },
  "message/delivery-status": {
    "source": "iana"
  },
  "message/disposition-notification": {
    "source": "iana",
    "extensions": [
      "disposition-notification"
    ]
  },
  "message/external-body": {
    "source": "iana"
  },
  "message/feedback-report": {
    "source": "iana"
  },
  "message/global": {
    "source": "iana",
    "extensions": ["u8msg"]
  },
  "message/global-delivery-status": {
    "source": "iana",
    "extensions": ["u8dsn"]
  },
  "message/global-disposition-notification": {
    "source": "iana",
    "extensions": ["u8mdn"]
  },
  "message/global-headers": {
    "source": "iana",
    "extensions": ["u8hdr"]
  },
  "message/http": {
    "source": "iana",
    "compressible": false
  },
  "message/imdn+xml": {
    "source": "iana",
    "compressible": true
  },
  "message/news": {
    "source": "iana"
  },
  "message/partial": {
    "source": "iana",
    "compressible": false
  },
  "message/rfc822": {
    "source": "iana",
    "compressible": true,
    "extensions": ["eml","mime"]
  },
  "message/s-http": {
    "source": "iana"
  },
  "message/sip": {
    "source": "iana"
  },
  "message/sipfrag": {
    "source": "iana"
  },
  "message/tracking-status": {
    "source": "iana"
  },
  "message/vnd.si.simp": {
    "source": "iana"
  },
  "message/vnd.wfa.wsc": {
    "source": "iana",
    "extensions": ["wsc"]
  },
  "model/3mf": {
    "source": "iana",
    "extensions": ["3mf"]
  },
  "model/gltf+json": {
    "source": "iana",
    "compressible": true,
    "extensions": ["gltf"]
  },
  "model/gltf-binary": {
    "source": "iana",
    "compressible": true,
    "extensions": ["glb"]
  },
  "model/iges": {
    "source": "iana",
    "compressible": false,
    "extensions": ["igs","iges"]
  },
  "model/mesh": {
    "source": "iana",
    "compressible": false,
    "extensions": ["msh","mesh","silo"]
  },
  "model/mtl": {
    "source": "iana",
    "extensions": ["mtl"]
  },
  "model/obj": {
    "source": "iana",
    "extensions": ["obj"]
  },
  "model/stl": {
    "source": "iana",
    "extensions": ["stl"]
  },
  "model/vnd.collada+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["dae"]
  },
  "model/vnd.dwf": {
    "source": "iana",
    "extensions": ["dwf"]
  },
  "model/vnd.flatland.3dml": {
    "source": "iana"
  },
  "model/vnd.gdl": {
    "source": "iana",
    "extensions": ["gdl"]
  },
  "model/vnd.gs-gdl": {
    "source": "apache"
  },
  "model/vnd.gs.gdl": {
    "source": "iana"
  },
  "model/vnd.gtw": {
    "source": "iana",
    "extensions": ["gtw"]
  },
  "model/vnd.moml+xml": {
    "source": "iana",
    "compressible": true
  },
  "model/vnd.mts": {
    "source": "iana",
    "extensions": ["mts"]
  },
  "model/vnd.opengex": {
    "source": "iana",
    "extensions": ["ogex"]
  },
  "model/vnd.parasolid.transmit.binary": {
    "source": "iana",
    "extensions": ["x_b"]
  },
  "model/vnd.parasolid.transmit.text": {
    "source": "iana",
    "extensions": ["x_t"]
  },
  "model/vnd.rosette.annotated-data-model": {
    "source": "iana"
  },
  "model/vnd.usdz+zip": {
    "source": "iana",
    "compressible": false,
    "extensions": ["usdz"]
  },
  "model/vnd.valve.source.compiled-map": {
    "source": "iana",
    "extensions": ["bsp"]
  },
  "model/vnd.vtu": {
    "source": "iana",
    "extensions": ["vtu"]
  },
  "model/vrml": {
    "source": "iana",
    "compressible": false,
    "extensions": ["wrl","vrml"]
  },
  "model/x3d+binary": {
    "source": "apache",
    "compressible": false,
    "extensions": ["x3db","x3dbz"]
  },
  "model/x3d+fastinfoset": {
    "source": "iana",
    "extensions": ["x3db"]
  },
  "model/x3d+vrml": {
    "source": "apache",
    "compressible": false,
    "extensions": ["x3dv","x3dvz"]
  },
  "model/x3d+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["x3d","x3dz"]
  },
  "model/x3d-vrml": {
    "source": "iana",
    "extensions": ["x3dv"]
  },
  "multipart/alternative": {
    "source": "iana",
    "compressible": false
  },
  "multipart/appledouble": {
    "source": "iana"
  },
  "multipart/byteranges": {
    "source": "iana"
  },
  "multipart/digest": {
    "source": "iana"
  },
  "multipart/encrypted": {
    "source": "iana",
    "compressible": false
  },
  "multipart/form-data": {
    "source": "iana",
    "compressible": false
  },
  "multipart/header-set": {
    "source": "iana"
  },
  "multipart/mixed": {
    "source": "iana"
  },
  "multipart/multilingual": {
    "source": "iana"
  },
  "multipart/parallel": {
    "source": "iana"
  },
  "multipart/related": {
    "source": "iana",
    "compressible": false
  },
  "multipart/report": {
    "source": "iana"
  },
  "multipart/signed": {
    "source": "iana",
    "compressible": false
  },
  "multipart/vnd.bint.med-plus": {
    "source": "iana"
  },
  "multipart/voice-message": {
    "source": "iana"
  },
  "multipart/x-mixed-replace": {
    "source": "iana"
  },
  "text/1d-interleaved-parityfec": {
    "source": "iana"
  },
  "text/cache-manifest": {
    "source": "iana",
    "compressible": true,
    "extensions": ["appcache","manifest"]
  },
  "text/calendar": {
    "source": "iana",
    "extensions": ["ics","ifb"]
  },
  "text/calender": {
    "compressible": true
  },
  "text/cmd": {
    "compressible": true
  },
  "text/coffeescript": {
    "extensions": ["coffee","litcoffee"]
  },
  "text/css": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true,
    "extensions": ["css"]
  },
  "text/csv": {
    "source": "iana",
    "compressible": true,
    "extensions": ["csv"]
  },
  "text/csv-schema": {
    "source": "iana"
  },
  "text/directory": {
    "source": "iana"
  },
  "text/dns": {
    "source": "iana"
  },
  "text/ecmascript": {
    "source": "iana"
  },
  "text/encaprtp": {
    "source": "iana"
  },
  "text/enriched": {
    "source": "iana"
  },
  "text/flexfec": {
    "source": "iana"
  },
  "text/fwdred": {
    "source": "iana"
  },
  "text/grammar-ref-list": {
    "source": "iana"
  },
  "text/html": {
    "source": "iana",
    "compressible": true,
    "extensions": ["html","htm","shtml"]
  },
  "text/jade": {
    "extensions": ["jade"]
  },
  "text/javascript": {
    "source": "iana",
    "compressible": true
  },
  "text/jcr-cnd": {
    "source": "iana"
  },
  "text/jsx": {
    "compressible": true,
    "extensions": ["jsx"]
  },
  "text/less": {
    "compressible": true,
    "extensions": ["less"]
  },
  "text/markdown": {
    "source": "iana",
    "compressible": true,
    "extensions": ["markdown","md"]
  },
  "text/mathml": {
    "source": "nginx",
    "extensions": ["mml"]
  },
  "text/mdx": {
    "compressible": true,
    "extensions": ["mdx"]
  },
  "text/mizar": {
    "source": "iana"
  },
  "text/n3": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true,
    "extensions": ["n3"]
  },
  "text/parameters": {
    "source": "iana",
    "charset": "UTF-8"
  },
  "text/parityfec": {
    "source": "iana"
  },
  "text/plain": {
    "source": "iana",
    "compressible": true,
    "extensions": ["txt","text","conf","def","list","log","in","ini"]
  },
  "text/provenance-notation": {
    "source": "iana",
    "charset": "UTF-8"
  },
  "text/prs.fallenstein.rst": {
    "source": "iana"
  },
  "text/prs.lines.tag": {
    "source": "iana",
    "extensions": ["dsc"]
  },
  "text/prs.prop.logic": {
    "source": "iana"
  },
  "text/raptorfec": {
    "source": "iana"
  },
  "text/red": {
    "source": "iana"
  },
  "text/rfc822-headers": {
    "source": "iana"
  },
  "text/richtext": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rtx"]
  },
  "text/rtf": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rtf"]
  },
  "text/rtp-enc-aescm128": {
    "source": "iana"
  },
  "text/rtploopback": {
    "source": "iana"
  },
  "text/rtx": {
    "source": "iana"
  },
  "text/sgml": {
    "source": "iana",
    "extensions": ["sgml","sgm"]
  },
  "text/shex": {
    "extensions": ["shex"]
  },
  "text/slim": {
    "extensions": ["slim","slm"]
  },
  "text/strings": {
    "source": "iana"
  },
  "text/stylus": {
    "extensions": ["stylus","styl"]
  },
  "text/t140": {
    "source": "iana"
  },
  "text/tab-separated-values": {
    "source": "iana",
    "compressible": true,
    "extensions": ["tsv"]
  },
  "text/troff": {
    "source": "iana",
    "extensions": ["t","tr","roff","man","me","ms"]
  },
  "text/turtle": {
    "source": "iana",
    "charset": "UTF-8",
    "extensions": ["ttl"]
  },
  "text/ulpfec": {
    "source": "iana"
  },
  "text/uri-list": {
    "source": "iana",
    "compressible": true,
    "extensions": ["uri","uris","urls"]
  },
  "text/vcard": {
    "source": "iana",
    "compressible": true,
    "extensions": ["vcard"]
  },
  "text/vnd.a": {
    "source": "iana"
  },
  "text/vnd.abc": {
    "source": "iana"
  },
  "text/vnd.ascii-art": {
    "source": "iana"
  },
  "text/vnd.curl": {
    "source": "iana",
    "extensions": ["curl"]
  },
  "text/vnd.curl.dcurl": {
    "source": "apache",
    "extensions": ["dcurl"]
  },
  "text/vnd.curl.mcurl": {
    "source": "apache",
    "extensions": ["mcurl"]
  },
  "text/vnd.curl.scurl": {
    "source": "apache",
    "extensions": ["scurl"]
  },
  "text/vnd.debian.copyright": {
    "source": "iana",
    "charset": "UTF-8"
  },
  "text/vnd.dmclientscript": {
    "source": "iana"
  },
  "text/vnd.dvb.subtitle": {
    "source": "iana",
    "extensions": ["sub"]
  },
  "text/vnd.esmertec.theme-descriptor": {
    "source": "iana",
    "charset": "UTF-8"
  },
  "text/vnd.ficlab.flt": {
    "source": "iana"
  },
  "text/vnd.fly": {
    "source": "iana",
    "extensions": ["fly"]
  },
  "text/vnd.fmi.flexstor": {
    "source": "iana",
    "extensions": ["flx"]
  },
  "text/vnd.gml": {
    "source": "iana"
  },
  "text/vnd.graphviz": {
    "source": "iana",
    "extensions": ["gv"]
  },
  "text/vnd.hgl": {
    "source": "iana"
  },
  "text/vnd.in3d.3dml": {
    "source": "iana",
    "extensions": ["3dml"]
  },
  "text/vnd.in3d.spot": {
    "source": "iana",
    "extensions": ["spot"]
  },
  "text/vnd.iptc.newsml": {
    "source": "iana"
  },
  "text/vnd.iptc.nitf": {
    "source": "iana"
  },
  "text/vnd.latex-z": {
    "source": "iana"
  },
  "text/vnd.motorola.reflex": {
    "source": "iana"
  },
  "text/vnd.ms-mediapackage": {
    "source": "iana"
  },
  "text/vnd.net2phone.commcenter.command": {
    "source": "iana"
  },
  "text/vnd.radisys.msml-basic-layout": {
    "source": "iana"
  },
  "text/vnd.senx.warpscript": {
    "source": "iana"
  },
  "text/vnd.si.uricatalogue": {
    "source": "iana"
  },
  "text/vnd.sosi": {
    "source": "iana"
  },
  "text/vnd.sun.j2me.app-descriptor": {
    "source": "iana",
    "charset": "UTF-8",
    "extensions": ["jad"]
  },
  "text/vnd.trolltech.linguist": {
    "source": "iana",
    "charset": "UTF-8"
  },
  "text/vnd.wap.si": {
    "source": "iana"
  },
  "text/vnd.wap.sl": {
    "source": "iana"
  },
  "text/vnd.wap.wml": {
    "source": "iana",
    "extensions": ["wml"]
  },
  "text/vnd.wap.wmlscript": {
    "source": "iana",
    "extensions": ["wmls"]
  },
  "text/vtt": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true,
    "extensions": ["vtt"]
  },
  "text/x-asm": {
    "source": "apache",
    "extensions": ["s","asm"]
  },
  "text/x-c": {
    "source": "apache",
    "extensions": ["c","cc","cxx","cpp","h","hh","dic"]
  },
  "text/x-component": {
    "source": "nginx",
    "extensions": ["htc"]
  },
  "text/x-fortran": {
    "source": "apache",
    "extensions": ["f","for","f77","f90"]
  },
  "text/x-gwt-rpc": {
    "compressible": true
  },
  "text/x-handlebars-template": {
    "extensions": ["hbs"]
  },
  "text/x-java-source": {
    "source": "apache",
    "extensions": ["java"]
  },
  "text/x-jquery-tmpl": {
    "compressible": true
  },
  "text/x-lua": {
    "extensions": ["lua"]
  },
  "text/x-markdown": {
    "compressible": true,
    "extensions": ["mkd"]
  },
  "text/x-nfo": {
    "source": "apache",
    "extensions": ["nfo"]
  },
  "text/x-opml": {
    "source": "apache",
    "extensions": ["opml"]
  },
  "text/x-org": {
    "compressible": true,
    "extensions": ["org"]
  },
  "text/x-pascal": {
    "source": "apache",
    "extensions": ["p","pas"]
  },
  "text/x-processing": {
    "compressible": true,
    "extensions": ["pde"]
  },
  "text/x-sass": {
    "extensions": ["sass"]
  },
  "text/x-scss": {
    "extensions": ["scss"]
  },
  "text/x-setext": {
    "source": "apache",
    "extensions": ["etx"]
  },
  "text/x-sfv": {
    "source": "apache",
    "extensions": ["sfv"]
  },
  "text/x-suse-ymp": {
    "compressible": true,
    "extensions": ["ymp"]
  },
  "text/x-uuencode": {
    "source": "apache",
    "extensions": ["uu"]
  },
  "text/x-vcalendar": {
    "source": "apache",
    "extensions": ["vcs"]
  },
  "text/x-vcard": {
    "source": "apache",
    "extensions": ["vcf"]
  },
  "text/xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xml"]
  },
  "text/xml-external-parsed-entity": {
    "source": "iana"
  },
  "text/yaml": {
    "extensions": ["yaml","yml"]
  },
  "video/1d-interleaved-parityfec": {
    "source": "iana"
  },
  "video/3gpp": {
    "source": "iana",
    "extensions": ["3gp","3gpp"]
  },
  "video/3gpp-tt": {
    "source": "iana"
  },
  "video/3gpp2": {
    "source": "iana",
    "extensions": ["3g2"]
  },
  "video/bmpeg": {
    "source": "iana"
  },
  "video/bt656": {
    "source": "iana"
  },
  "video/celb": {
    "source": "iana"
  },
  "video/dv": {
    "source": "iana"
  },
  "video/encaprtp": {
    "source": "iana"
  },
  "video/flexfec": {
    "source": "iana"
  },
  "video/h261": {
    "source": "iana",
    "extensions": ["h261"]
  },
  "video/h263": {
    "source": "iana",
    "extensions": ["h263"]
  },
  "video/h263-1998": {
    "source": "iana"
  },
  "video/h263-2000": {
    "source": "iana"
  },
  "video/h264": {
    "source": "iana",
    "extensions": ["h264"]
  },
  "video/h264-rcdo": {
    "source": "iana"
  },
  "video/h264-svc": {
    "source": "iana"
  },
  "video/h265": {
    "source": "iana"
  },
  "video/iso.segment": {
    "source": "iana"
  },
  "video/jpeg": {
    "source": "iana",
    "extensions": ["jpgv"]
  },
  "video/jpeg2000": {
    "source": "iana"
  },
  "video/jpm": {
    "source": "apache",
    "extensions": ["jpm","jpgm"]
  },
  "video/mj2": {
    "source": "iana",
    "extensions": ["mj2","mjp2"]
  },
  "video/mp1s": {
    "source": "iana"
  },
  "video/mp2p": {
    "source": "iana"
  },
  "video/mp2t": {
    "source": "iana",
    "extensions": ["ts"]
  },
  "video/mp4": {
    "source": "iana",
    "compressible": false,
    "extensions": ["mp4","mp4v","mpg4"]
  },
  "video/mp4v-es": {
    "source": "iana"
  },
  "video/mpeg": {
    "source": "iana",
    "compressible": false,
    "extensions": ["mpeg","mpg","mpe","m1v","m2v"]
  },
  "video/mpeg4-generic": {
    "source": "iana"
  },
  "video/mpv": {
    "source": "iana"
  },
  "video/nv": {
    "source": "iana"
  },
  "video/ogg": {
    "source": "iana",
    "compressible": false,
    "extensions": ["ogv"]
  },
  "video/parityfec": {
    "source": "iana"
  },
  "video/pointer": {
    "source": "iana"
  },
  "video/quicktime": {
    "source": "iana",
    "compressible": false,
    "extensions": ["qt","mov"]
  },
  "video/raptorfec": {
    "source": "iana"
  },
  "video/raw": {
    "source": "iana"
  },
  "video/rtp-enc-aescm128": {
    "source": "iana"
  },
  "video/rtploopback": {
    "source": "iana"
  },
  "video/rtx": {
    "source": "iana"
  },
  "video/smpte291": {
    "source": "iana"
  },
  "video/smpte292m": {
    "source": "iana"
  },
  "video/ulpfec": {
    "source": "iana"
  },
  "video/vc1": {
    "source": "iana"
  },
  "video/vc2": {
    "source": "iana"
  },
  "video/vnd.cctv": {
    "source": "iana"
  },
  "video/vnd.dece.hd": {
    "source": "iana",
    "extensions": ["uvh","uvvh"]
  },
  "video/vnd.dece.mobile": {
    "source": "iana",
    "extensions": ["uvm","uvvm"]
  },
  "video/vnd.dece.mp4": {
    "source": "iana"
  },
  "video/vnd.dece.pd": {
    "source": "iana",
    "extensions": ["uvp","uvvp"]
  },
  "video/vnd.dece.sd": {
    "source": "iana",
    "extensions": ["uvs","uvvs"]
  },
  "video/vnd.dece.video": {
    "source": "iana",
    "extensions": ["uvv","uvvv"]
  },
  "video/vnd.directv.mpeg": {
    "source": "iana"
  },
  "video/vnd.directv.mpeg-tts": {
    "source": "iana"
  },
  "video/vnd.dlna.mpeg-tts": {
    "source": "iana"
  },
  "video/vnd.dvb.file": {
    "source": "iana",
    "extensions": ["dvb"]
  },
  "video/vnd.fvt": {
    "source": "iana",
    "extensions": ["fvt"]
  },
  "video/vnd.hns.video": {
    "source": "iana"
  },
  "video/vnd.iptvforum.1dparityfec-1010": {
    "source": "iana"
  },
  "video/vnd.iptvforum.1dparityfec-2005": {
    "source": "iana"
  },
  "video/vnd.iptvforum.2dparityfec-1010": {
    "source": "iana"
  },
  "video/vnd.iptvforum.2dparityfec-2005": {
    "source": "iana"
  },
  "video/vnd.iptvforum.ttsavc": {
    "source": "iana"
  },
  "video/vnd.iptvforum.ttsmpeg2": {
    "source": "iana"
  },
  "video/vnd.motorola.video": {
    "source": "iana"
  },
  "video/vnd.motorola.videop": {
    "source": "iana"
  },
  "video/vnd.mpegurl": {
    "source": "iana",
    "extensions": ["mxu","m4u"]
  },
  "video/vnd.ms-playready.media.pyv": {
    "source": "iana",
    "extensions": ["pyv"]
  },
  "video/vnd.nokia.interleaved-multimedia": {
    "source": "iana"
  },
  "video/vnd.nokia.mp4vr": {
    "source": "iana"
  },
  "video/vnd.nokia.videovoip": {
    "source": "iana"
  },
  "video/vnd.objectvideo": {
    "source": "iana"
  },
  "video/vnd.radgamettools.bink": {
    "source": "iana"
  },
  "video/vnd.radgamettools.smacker": {
    "source": "iana"
  },
  "video/vnd.sealed.mpeg1": {
    "source": "iana"
  },
  "video/vnd.sealed.mpeg4": {
    "source": "iana"
  },
  "video/vnd.sealed.swf": {
    "source": "iana"
  },
  "video/vnd.sealedmedia.softseal.mov": {
    "source": "iana"
  },
  "video/vnd.uvvu.mp4": {
    "source": "iana",
    "extensions": ["uvu","uvvu"]
  },
  "video/vnd.vivo": {
    "source": "iana",
    "extensions": ["viv"]
  },
  "video/vnd.youtube.yt": {
    "source": "iana"
  },
  "video/vp8": {
    "source": "iana"
  },
  "video/webm": {
    "source": "apache",
    "compressible": false,
    "extensions": ["webm"]
  },
  "video/x-f4v": {
    "source": "apache",
    "extensions": ["f4v"]
  },
  "video/x-fli": {
    "source": "apache",
    "extensions": ["fli"]
  },
  "video/x-flv": {
    "source": "apache",
    "compressible": false,
    "extensions": ["flv"]
  },
  "video/x-m4v": {
    "source": "apache",
    "extensions": ["m4v"]
  },
  "video/x-matroska": {
    "source": "apache",
    "compressible": false,
    "extensions": ["mkv","mk3d","mks"]
  },
  "video/x-mng": {
    "source": "apache",
    "extensions": ["mng"]
  },
  "video/x-ms-asf": {
    "source": "apache",
    "extensions": ["asf","asx"]
  },
  "video/x-ms-vob": {
    "source": "apache",
    "extensions": ["vob"]
  },
  "video/x-ms-wm": {
    "source": "apache",
    "extensions": ["wm"]
  },
  "video/x-ms-wmv": {
    "source": "apache",
    "compressible": false,
    "extensions": ["wmv"]
  },
  "video/x-ms-wmx": {
    "source": "apache",
    "extensions": ["wmx"]
  },
  "video/x-ms-wvx": {
    "source": "apache",
    "extensions": ["wvx"]
  },
  "video/x-msvideo": {
    "source": "apache",
    "extensions": ["avi"]
  },
  "video/x-sgi-movie": {
    "source": "apache",
    "extensions": ["movie"]
  },
  "video/x-smv": {
    "source": "apache",
    "extensions": ["smv"]
  },
  "x-conference/x-cooltalk": {
    "source": "apache",
    "extensions": ["ice"]
  },
  "x-shader/x-fragment": {
    "compressible": true
  },
  "x-shader/x-vertex": {
    "compressible": true
  }
}

},{}],14:[function(require,module,exports){
"use strict";

/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * MIT Licensed
 */

/**
 * Module exports.
 */
module.exports = require('./db.json');

},{"./db.json":13}],15:[function(require,module,exports){
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
'use strict';
/**
 * Module dependencies.
 * @private
 */

var db = require('mime-db');

var extname = require('path').extname;
/**
 * Module variables.
 * @private
 */


var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
var TEXT_TYPE_REGEXP = /^text\//i;
/**
 * Module exports.
 * @public
 */

exports.charset = charset;
exports.charsets = {
  lookup: charset
};
exports.contentType = contentType;
exports.extension = extension;
exports.extensions = Object.create(null);
exports.lookup = lookup;
exports.types = Object.create(null); // Populate the extensions/types maps

populateMaps(exports.extensions, exports.types);
/**
 * Get the default charset for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function charset(type) {
  if (!type || typeof type !== 'string') {
    return false;
  } // TODO: use media-typer


  var match = EXTRACT_TYPE_REGEXP.exec(type);
  var mime = match && db[match[1].toLowerCase()];

  if (mime && mime.charset) {
    return mime.charset;
  } // default text/* to utf-8


  if (match && TEXT_TYPE_REGEXP.test(match[1])) {
    return 'UTF-8';
  }

  return false;
}
/**
 * Create a full Content-Type header given a MIME type or extension.
 *
 * @param {string} str
 * @return {boolean|string}
 */


function contentType(str) {
  // TODO: should this even be in this module?
  if (!str || typeof str !== 'string') {
    return false;
  }

  var mime = str.indexOf('/') === -1 ? exports.lookup(str) : str;

  if (!mime) {
    return false;
  } // TODO: use content-type or other module


  if (mime.indexOf('charset') === -1) {
    var charset = exports.charset(mime);
    if (charset) mime += '; charset=' + charset.toLowerCase();
  }

  return mime;
}
/**
 * Get the default extension for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */


function extension(type) {
  if (!type || typeof type !== 'string') {
    return false;
  } // TODO: use media-typer


  var match = EXTRACT_TYPE_REGEXP.exec(type); // get extensions

  var exts = match && exports.extensions[match[1].toLowerCase()];

  if (!exts || !exts.length) {
    return false;
  }

  return exts[0];
}
/**
 * Lookup the MIME type for a file path/extension.
 *
 * @param {string} path
 * @return {boolean|string}
 */


function lookup(path) {
  if (!path || typeof path !== 'string') {
    return false;
  } // get the extension ("ext" or ".ext" or full path)


  var extension = extname('x.' + path).toLowerCase().substr(1);

  if (!extension) {
    return false;
  }

  return exports.types[extension] || false;
}
/**
 * Populate the extensions and types maps.
 * @private
 */


function populateMaps(extensions, types) {
  // source preference (least -> most)
  var preference = ['nginx', 'apache', undefined, 'iana'];
  Object.keys(db).forEach(function forEachMimeType(type) {
    var mime = db[type];
    var exts = mime.extensions;

    if (!exts || !exts.length) {
      return;
    } // mime -> extensions


    extensions[type] = exts; // extension -> mime

    for (var i = 0; i < exts.length; i++) {
      var extension = exts[i];

      if (types[extension]) {
        var from = preference.indexOf(db[types[extension]].source);
        var to = preference.indexOf(mime.source);

        if (types[extension] !== 'application/octet-stream' && (from > to || from === to && types[extension].substr(0, 12) === 'application/')) {
          // skip the remapping
          continue;
        }
      } // set the extension -> mime


      types[extension] = type;
    }
  });
}

},{"mime-db":14,"path":18}],16:[function(require,module,exports){
/*!
 * type-is
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */
'use strict';
/**
 * Module dependencies.
 * @private
 */

var typer = require('media-typer');

var mime = require('mime-types');
/**
 * Module exports.
 * @public
 */


module.exports = typeofrequest;
module.exports.is = typeis;
module.exports.hasBody = hasbody;
module.exports.normalize = normalize;
module.exports.match = mimeMatch;
/**
 * Compare a `value` content-type with `types`.
 * Each `type` can be an extension like `html`,
 * a special shortcut like `multipart` or `urlencoded`,
 * or a mime type.
 *
 * If no types match, `false` is returned.
 * Otherwise, the first `type` that matches is returned.
 *
 * @param {String} value
 * @param {Array} types
 * @public
 */

function typeis(value, types_) {
  var i;
  var types = types_; // remove parameters and normalize

  var val = tryNormalizeType(value); // no type or invalid

  if (!val) {
    return false;
  } // support flattened arguments


  if (types && !Array.isArray(types)) {
    types = new Array(arguments.length - 1);

    for (i = 0; i < types.length; i++) {
      types[i] = arguments[i + 1];
    }
  } // no types, return the content type


  if (!types || !types.length) {
    return val;
  }

  var type;

  for (i = 0; i < types.length; i++) {
    if (mimeMatch(normalize(type = types[i]), val)) {
      return type[0] === '+' || type.indexOf('*') !== -1 ? val : type;
    }
  } // no matches


  return false;
}
/**
 * Check if a request has a request body.
 * A request with a body __must__ either have `transfer-encoding`
 * or `content-length` headers set.
 * http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.3
 *
 * @param {Object} request
 * @return {Boolean}
 * @public
 */


function hasbody(req) {
  return req.headers['transfer-encoding'] !== undefined || !isNaN(req.headers['content-length']);
}
/**
 * Check if the incoming request contains the "Content-Type"
 * header field, and it contains any of the give mime `type`s.
 * If there is no request body, `null` is returned.
 * If there is no content type, `false` is returned.
 * Otherwise, it returns the first `type` that matches.
 *
 * Examples:
 *
 *     // With Content-Type: text/html; charset=utf-8
 *     this.is('html'); // => 'html'
 *     this.is('text/html'); // => 'text/html'
 *     this.is('text/*', 'application/json'); // => 'text/html'
 *
 *     // When Content-Type is application/json
 *     this.is('json', 'urlencoded'); // => 'json'
 *     this.is('application/json'); // => 'application/json'
 *     this.is('html', 'application/*'); // => 'application/json'
 *
 *     this.is('html'); // => false
 *
 * @param {String|Array} types...
 * @return {String|false|null}
 * @public
 */


function typeofrequest(req, types_) {
  var types = types_; // no body

  if (!hasbody(req)) {
    return null;
  } // support flattened arguments


  if (arguments.length > 2) {
    types = new Array(arguments.length - 1);

    for (var i = 0; i < types.length; i++) {
      types[i] = arguments[i + 1];
    }
  } // request content type


  var value = req.headers['content-type'];
  return typeis(value, types);
}
/**
 * Normalize a mime type.
 * If it's a shorthand, expand it to a valid mime type.
 *
 * In general, you probably want:
 *
 *   var type = is(req, ['urlencoded', 'json', 'multipart']);
 *
 * Then use the appropriate body parsers.
 * These three are the most common request body types
 * and are thus ensured to work.
 *
 * @param {String} type
 * @private
 */


function normalize(type) {
  if (typeof type !== 'string') {
    // invalid type
    return false;
  }

  switch (type) {
    case 'urlencoded':
      return 'application/x-www-form-urlencoded';

    case 'multipart':
      return 'multipart/*';
  }

  if (type[0] === '+') {
    // "+json" -> "*/*+json" expando
    return '*/*' + type;
  }

  return type.indexOf('/') === -1 ? mime.lookup(type) : type;
}
/**
 * Check if `expected` mime type
 * matches `actual` mime type with
 * wildcard and +suffix support.
 *
 * @param {String} expected
 * @param {String} actual
 * @return {Boolean}
 * @private
 */


function mimeMatch(expected, actual) {
  // invalid type
  if (expected === false) {
    return false;
  } // split types


  var actualParts = actual.split('/');
  var expectedParts = expected.split('/'); // invalid format

  if (actualParts.length !== 2 || expectedParts.length !== 2) {
    return false;
  } // validate type


  if (expectedParts[0] !== '*' && expectedParts[0] !== actualParts[0]) {
    return false;
  } // validate suffix wildcard


  if (expectedParts[1].substr(0, 2) === '*+') {
    return expectedParts[1].length <= actualParts[1].length + 1 && expectedParts[1].substr(1) === actualParts[1].substr(1 - expectedParts[1].length);
  } // validate subtype


  if (expectedParts[1] !== '*' && expectedParts[1] !== actualParts[1]) {
    return false;
  }

  return true;
}
/**
 * Normalize a type and remove parameters.
 *
 * @param {string} value
 * @return {string}
 * @private
 */


function normalizeType(value) {
  // parse the type
  var type = typer.parse(value); // remove the parameters

  type.parameters = undefined; // reformat it

  return typer.format(type);
}
/**
 * Try to normalize a type and remove parameters.
 *
 * @param {string} value
 * @return {string}
 * @private
 */


function tryNormalizeType(value) {
  if (!value) {
    return null;
  }

  try {
    return normalizeType(value);
  } catch (err) {
    return null;
  }
}

},{"media-typer":12,"mime-types":15}],17:[function(require,module,exports){
"use strict";

const domtosvg = require('dom-to-svg');

function ready(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(() => {
  let element = document.querySelector('#root');
  const svgDocument = domtosvg.elementToSVG(element);
  console.log(svgDocument);
});

},{"dom-to-svg":5}],18:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
} // Resolves . and .. elements in a path with directory names


function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;

  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length) code = path.charCodeAt(i);else if (code === 47
    /*/*/
    ) break;else code = 47
    /*/*/
    ;

    if (code === 47
    /*/*/
    ) {
        if (lastSlash === i - 1 || dots === 1) {// NOOP
        } else if (lastSlash !== i - 1 && dots === 2) {
          if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46
          /*.*/
          || res.charCodeAt(res.length - 2) !== 46
          /*.*/
          ) {
              if (res.length > 2) {
                var lastSlashIndex = res.lastIndexOf('/');

                if (lastSlashIndex !== res.length - 1) {
                  if (lastSlashIndex === -1) {
                    res = '';
                    lastSegmentLength = 0;
                  } else {
                    res = res.slice(0, lastSlashIndex);
                    lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
                  }

                  lastSlash = i;
                  dots = 0;
                  continue;
                }
              } else if (res.length === 2 || res.length === 1) {
                res = '';
                lastSegmentLength = 0;
                lastSlash = i;
                dots = 0;
                continue;
              }
            }

          if (allowAboveRoot) {
            if (res.length > 0) res += '/..';else res = '..';
            lastSegmentLength = 2;
          }
        } else {
          if (res.length > 0) res += '/' + path.slice(lastSlash + 1, i);else res = path.slice(lastSlash + 1, i);
          lastSegmentLength = i - lastSlash - 1;
        }

        lastSlash = i;
        dots = 0;
      } else if (code === 46
    /*.*/
    && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }

  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');

  if (!dir) {
    return base;
  }

  if (dir === pathObject.root) {
    return dir + base;
  }

  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0) path = arguments[i];else {
        if (cwd === undefined) cwd = process.cwd();
        path = cwd;
      }
      assertPath(path); // Skip empty entries

      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47
      /*/*/
      ;
    } // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)
    // Normalize the path


    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0) return '/' + resolvedPath;else return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },
  normalize: function normalize(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var isAbsolute = path.charCodeAt(0) === 47
    /*/*/
    ;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47
    /*/*/
    ; // Normalize the path

    path = normalizeStringPosix(path, !isAbsolute);
    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';
    if (isAbsolute) return '/' + path;
    return path;
  },
  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47
    /*/*/
    ;
  },
  join: function join() {
    if (arguments.length === 0) return '.';
    var joined;

    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);

      if (arg.length > 0) {
        if (joined === undefined) joined = arg;else joined += '/' + arg;
      }
    }

    if (joined === undefined) return '.';
    return posix.normalize(joined);
  },
  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);
    if (from === to) return '';
    from = posix.resolve(from);
    to = posix.resolve(to);
    if (from === to) return ''; // Trim any leading backslashes

    var fromStart = 1;

    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47
      /*/*/
      ) break;
    }

    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart; // Trim any leading backslashes

    var toStart = 1;

    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47
      /*/*/
      ) break;
    }

    var toEnd = to.length;
    var toLen = toEnd - toStart; // Compare paths to find the longest common path from root

    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;

    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47
          /*/*/
          ) {
              // We get here if `from` is the exact base path for `to`.
              // For example: from='/foo/bar'; to='/foo/bar/baz'
              return to.slice(toStart + i + 1);
            } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47
          /*/*/
          ) {
              // We get here if `to` is the exact base path for `from`.
              // For example: from='/foo/bar/baz'; to='/foo/bar'
              lastCommonSep = i;
            } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }

        break;
      }

      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode) break;else if (fromCode === 47
      /*/*/
      ) lastCommonSep = i;
    }

    var out = ''; // Generate the relative path based on the path difference between `to`
    // and `from`

    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47
      /*/*/
      ) {
          if (out.length === 0) out += '..';else out += '/..';
        }
    } // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts


    if (out.length > 0) return out + to.slice(toStart + lastCommonSep);else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47
      /*/*/
      ) ++toStart;
      return to.slice(toStart);
    }
  },
  _makeLong: function _makeLong(path) {
    return path;
  },
  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47
    /*/*/
    ;
    var end = -1;
    var matchedSlash = true;

    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);

      if (code === 47
      /*/*/
      ) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },
  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);
    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;

      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);

        if (code === 47
        /*/*/
        ) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }

          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47
        /*/*/
        ) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },
  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true; // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find

    var preDotState = 0;

    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);

      if (code === 47
      /*/*/
      ) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }

          continue;
        }

      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }

      if (code === 46
      /*.*/
      ) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
    preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }

    return path.slice(startDot, end);
  },
  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }

    return _format('/', pathObject);
  },
  parse: function parse(path) {
    assertPath(path);
    var ret = {
      root: '',
      dir: '',
      base: '',
      ext: '',
      name: ''
    };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47
    /*/*/
    ;
    var start;

    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }

    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1; // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find

    var preDotState = 0; // Get non-dir info

    for (; i >= start; --i) {
      code = path.charCodeAt(i);

      if (code === 47
      /*/*/
      ) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }

          continue;
        }

      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }

      if (code === 46
      /*.*/
      ) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
    preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }

      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';
    return ret;
  },
  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};
posix.posix = posix;
module.exports = posix;

}).call(this)}).call(this,require('_process'))

},{"_process":19}],19:[function(require,module,exports){
"use strict";

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};

},{}]},{},[17])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy9kb20tdG8tc3ZnL2xpYi9hY2Nlc3NpYmlsaXR5LmpzIiwibm9kZV9tb2R1bGVzL2RvbS10by1zdmcvbGliL2Nzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20tdG8tc3ZnL2xpYi9kb20uanMiLCJub2RlX21vZHVsZXMvZG9tLXRvLXN2Zy9saWIvZWxlbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9kb20tdG8tc3ZnL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb20tdG8tc3ZnL2xpYi9pbmxpbmUuanMiLCJub2RlX21vZHVsZXMvZG9tLXRvLXN2Zy9saWIvc2VyaWFsaXplLmpzIiwibm9kZV9tb2R1bGVzL2RvbS10by1zdmcvbGliL3N0YWNraW5nLmpzIiwibm9kZV9tb2R1bGVzL2RvbS10by1zdmcvbGliL3RleHQuanMiLCJub2RlX21vZHVsZXMvZG9tLXRvLXN2Zy9saWIvdHJhdmVyc2FsLmpzIiwibm9kZV9tb2R1bGVzL2RvbS10by1zdmcvbGliL3V0aWwuanMiLCJub2RlX21vZHVsZXMvbWVkaWEtdHlwZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbWltZS1kYi9kYi5qc29uIiwibm9kZV9tb2R1bGVzL21pbWUtZGIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbWltZS10eXBlcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90eXBlLWlzL2luZGV4LmpzIiwic3JjLmpzIiwiLi4vLi4vLi4vLi4vLi4vdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcGF0aC1icm93c2VyaWZ5L2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vLi4vdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFdBQVcsR0FBRyx3SkFBbEI7QUFDQSxJQUFJLFVBQVUsR0FBRyxpQ0FBakI7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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TyxDQUFDLEdBQVIsR0FBYyxZQUFZO0FBQUUsU0FBTyxHQUFQO0FBQVksQ0FBeEM7O0FBQ0EsT0FBTyxDQUFDLEtBQVIsR0FBZ0IsVUFBVSxHQUFWLEVBQWU7QUFDM0IsUUFBTSxJQUFJLEtBQUosQ0FBVSxnQ0FBVixDQUFOO0FBQ0gsQ0FGRDs7QUFHQSxPQUFPLENBQUMsS0FBUixHQUFnQixZQUFXO0FBQUUsU0FBTyxDQUFQO0FBQVcsQ0FBeEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZ2V0QWNjZXNzaWJpbGl0eUF0dHJpYnV0ZXMgPSBnZXRBY2Nlc3NpYmlsaXR5QXR0cmlidXRlcztcblxudmFyIF9kb20gPSByZXF1aXJlKFwiLi9kb21cIik7XG5cbmNvbnN0IGlzU3RhbmRhbG9uZUZvb3RlciA9IGVsZW1lbnQgPT4gIWVsZW1lbnQuY2xvc2VzdCgnYXJ0aWNsZSwgYXNpZGUsIG1haW4sIG5hdiwgc2VjdGlvbiwgW3JvbGU9XCJhcnRpY2xlXCJdLCBbcm9sZT1cImNvbXBsZW1lbnRhcnlcIl0sIFtyb2xlPVwibWFpblwiXSwgW3JvbGU9XCJuYXZpZ2F0aW9uXCJdLCBbcm9sZT1cInJlZ2lvblwiXScpO1xuXG5mdW5jdGlvbiBnZXRBY2Nlc3NpYmlsaXR5QXR0cmlidXRlcyhlbGVtZW50LCB7XG4gIGxhYmVscyxcbiAgZ2V0VW5pcXVlSWRcbn0pIHtcbiAgdmFyIF9lbGVtZW50JHBhcmVudEVsZW1lbiwgX2VsZW1lbnQkcGFyZW50RWxlbWVuMiwgX2VsZW1lbnQkcGFyZW50RWxlbWVuMztcblxuICAvLyBodHRwczovL3d3dy53My5vcmcvVFIvaHRtbC1hcmlhL1xuICBjb25zdCBhdHRyaWJ1dGVzID0gbmV3IE1hcCgpO1xuXG4gIHN3aXRjaCAoZWxlbWVudC50YWdOYW1lKSB7XG4gICAgY2FzZSAnQSc6XG4gICAgICBhdHRyaWJ1dGVzLnNldCgncm9sZScsICdsaW5rJyk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ0FSVElDTEUnOlxuICAgICAgYXR0cmlidXRlcy5zZXQoJ3JvbGUnLCAnYXJ0aWNsZScpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdBU0lERSc6XG4gICAgICBhdHRyaWJ1dGVzLnNldCgncm9sZScsICdjb21wbGVtZW50YXJ5Jyk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ0JPRFknOlxuICAgICAgYXR0cmlidXRlcy5zZXQoJ3JvbGUnLCAnZG9jdW1lbnQnKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnQlVUVE9OJzpcbiAgICBjYXNlICdTVU1NQVJZJzpcbiAgICAgIGF0dHJpYnV0ZXMuc2V0KCdyb2xlJywgJ2J1dHRvbicpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdERCc6XG4gICAgICBhdHRyaWJ1dGVzLnNldCgncm9sZScsICdkZWZpbml0aW9uJyk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ0RFVEFJTFMnOlxuICAgICAgYXR0cmlidXRlcy5zZXQoJ3JvbGUnLCAnZ3JvdXAnKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnREZOJzpcbiAgICAgIGF0dHJpYnV0ZXMuc2V0KCdyb2xlJywgJ3Rlcm0nKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnRElBTE9HJzpcbiAgICAgIGF0dHJpYnV0ZXMuc2V0KCdyb2xlJywgJ2RpYWxvZycpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdEVCc6XG4gICAgICBhdHRyaWJ1dGVzLnNldCgncm9sZScsICd0ZXJtJyk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ0ZJRUxEU0VUJzpcbiAgICAgIGF0dHJpYnV0ZXMuc2V0KCdyb2xlJywgJ2dyb3VwJyk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ0ZJR1VSRSc6XG4gICAgICBhdHRyaWJ1dGVzLnNldCgncm9sZScsICdmaWd1cmUnKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnRk9PVEVSJzpcbiAgICAgIGlmIChpc1N0YW5kYWxvbmVGb290ZXIoZWxlbWVudCkpIHtcbiAgICAgICAgYXR0cmlidXRlcy5zZXQoJ3JvbGUnLCAnY29udGVudGluZm8nKTtcbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdGT1JNJzpcbiAgICAgIGF0dHJpYnV0ZXMuc2V0KCdyb2xlJywgJ2Zvcm0nKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnSDEnOlxuICAgIGNhc2UgJ0gyJzpcbiAgICBjYXNlICdIMyc6XG4gICAgY2FzZSAnSDQnOlxuICAgIGNhc2UgJ0g1JzpcbiAgICBjYXNlICdINic6XG4gICAgICBhdHRyaWJ1dGVzLnNldCgncm9sZScsICdoZWFkaW5nJyk7XG4gICAgICBhdHRyaWJ1dGVzLnNldCgnYXJpYS1sZXZlbCcsIGVsZW1lbnQudGFnTmFtZS5zbGljZSgxKSk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ0hFQURFUic6XG4gICAgICBpZiAoaXNTdGFuZGFsb25lRm9vdGVyKGVsZW1lbnQpKSB7XG4gICAgICAgIGF0dHJpYnV0ZXMuc2V0KCdyb2xlJywgJ2Jhbm5lcicpO1xuICAgICAgfVxuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ0hSJzpcbiAgICAgIGF0dHJpYnV0ZXMuc2V0KCdyb2xlJywgJ3NlcGFyYXRvcicpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdJTUcnOlxuICAgICAge1xuICAgICAgICBjb25zdCBhbHQgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnYWx0Jyk7XG5cbiAgICAgICAgaWYgKGFsdCA9PT0gbnVsbCB8fCBhbHQgIT09ICcnKSB7XG4gICAgICAgICAgYXR0cmlidXRlcy5zZXQoJ3JvbGUnLCAnaW1nJyk7XG5cbiAgICAgICAgICBpZiAoYWx0KSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLnNldCgnYXJpYS1sYWJlbCcsIGFsdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICBjYXNlICdJTlBVVCc6XG4gICAgICBzd2l0Y2ggKGVsZW1lbnQudHlwZSkge1xuICAgICAgICBjYXNlICdidXR0b24nOlxuICAgICAgICBjYXNlICdpbWFnZSc6XG4gICAgICAgIGNhc2UgJ3Jlc2V0JzpcbiAgICAgICAgY2FzZSAnc3VibWl0JzpcbiAgICAgICAgICBhdHRyaWJ1dGVzLnNldCgncm9sZScsICdidXR0b24nKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgIGF0dHJpYnV0ZXMuc2V0KCdyb2xlJywgJ3NwaW5idXR0b24nKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdyYW5nZSc6XG4gICAgICAgICAgYXR0cmlidXRlcy5zZXQoJ3JvbGUnLCAnc2xpZGVyJyk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnY2hlY2tib3gnOlxuICAgICAgICAgIGF0dHJpYnV0ZXMuc2V0KCdyb2xlJywgJ2NoZWNrYm94Jyk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAncmFkaW8nOlxuICAgICAgICAgIGF0dHJpYnV0ZXMuc2V0KCdyb2xlJywgJ3JhZGlvJyk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnZW1haWwnOlxuICAgICAgICBjYXNlICd0ZWwnOlxuICAgICAgICAgIGlmICghZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2xpc3QnKSkge1xuICAgICAgICAgICAgYXR0cmlidXRlcy5zZXQoJ3JvbGUnLCAndGV4dGJveCcpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ0xJJzpcbiAgICAgIGlmICgoKF9lbGVtZW50JHBhcmVudEVsZW1lbiA9IGVsZW1lbnQucGFyZW50RWxlbWVudCkgPT09IG51bGwgfHwgX2VsZW1lbnQkcGFyZW50RWxlbWVuID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZWxlbWVudCRwYXJlbnRFbGVtZW4udGFnTmFtZSkgPT09ICdPTCcgfHwgKChfZWxlbWVudCRwYXJlbnRFbGVtZW4yID0gZWxlbWVudC5wYXJlbnRFbGVtZW50KSA9PT0gbnVsbCB8fCBfZWxlbWVudCRwYXJlbnRFbGVtZW4yID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZWxlbWVudCRwYXJlbnRFbGVtZW4yLnRhZ05hbWUpID09PSAnVUwnIHx8ICgoX2VsZW1lbnQkcGFyZW50RWxlbWVuMyA9IGVsZW1lbnQucGFyZW50RWxlbWVudCkgPT09IG51bGwgfHwgX2VsZW1lbnQkcGFyZW50RWxlbWVuMyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2VsZW1lbnQkcGFyZW50RWxlbWVuMy50YWdOYW1lKSA9PT0gJ01FTlUnKSB7XG4gICAgICAgIGF0dHJpYnV0ZXMuc2V0KCdyb2xlJywgJ2xpc3RpdGVtJyk7XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnTElOSyc6XG4gICAgICBpZiAoZWxlbWVudC5ocmVmKSB7XG4gICAgICAgIGF0dHJpYnV0ZXMuc2V0KCdyb2xlJywgJ2xpbmsnKTtcbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdNQUlOJzpcbiAgICAgIGF0dHJpYnV0ZXMuc2V0KCdyb2xlJywgJ21haW4nKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnTUFUSCc6XG4gICAgICBhdHRyaWJ1dGVzLnNldCgncm9sZScsICdtYXRoJyk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ09MJzpcbiAgICBjYXNlICdVTCc6XG4gICAgY2FzZSAnTUVOVSc6XG4gICAgICBhdHRyaWJ1dGVzLnNldCgncm9sZScsICdsaXN0Jyk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ05BVic6XG4gICAgICBhdHRyaWJ1dGVzLnNldCgncm9sZScsICduYXZpZ2F0aW9uJyk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ09QVElPTic6XG4gICAgICBhdHRyaWJ1dGVzLnNldCgncm9sZScsICdvcHRpb24nKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnUFJPR1JFU1MnOlxuICAgICAgYXR0cmlidXRlcy5zZXQoJ3JvbGUnLCAncHJvZ3Jlc3NiYXInKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnU0VDVElPTic6XG4gICAgICBhdHRyaWJ1dGVzLnNldCgncm9sZScsICdyZWdpb24nKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnU0VMRUNUJzpcbiAgICAgIGF0dHJpYnV0ZXMuc2V0KCdyb2xlJywgIWVsZW1lbnQuaGFzQXR0cmlidXRlKCdtdWx0aXBsZScpICYmIGVsZW1lbnQuc2l6ZSA8PSAxID8gJ2NvbWJvYm94JyA6ICdsaXN0Ym94Jyk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ1RBQkxFJzpcbiAgICAgIGF0dHJpYnV0ZXMuc2V0KCdyb2xlJywgJ3RhYmxlJyk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ1RIRUFEJzpcbiAgICBjYXNlICdUQk9EWSc6XG4gICAgY2FzZSAnVEZPT1QnOlxuICAgICAgYXR0cmlidXRlcy5zZXQoJ3JvbGUnLCAncm93Z3JvdXAnKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnVEVYVEFSRUEnOlxuICAgICAgYXR0cmlidXRlcy5zZXQoJ3JvbGUnLCAndGV4dGJveCcpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdURCc6XG4gICAgICBhdHRyaWJ1dGVzLnNldCgncm9sZScsICdjZWxsJyk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ1RIJzpcbiAgICAgIGF0dHJpYnV0ZXMuc2V0KCdyb2xlJywgZWxlbWVudC5jbG9zZXN0KCd0aGVhZCcpID8gJ2NvbHVtbmhlYWRlcicgOiAncm93aGVhZGVyJyk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ1RSJzpcbiAgICAgIGF0dHJpYnV0ZXMuc2V0KCdyb2xlJywgJ3RhYmxlcm93Jyk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSkge1xuICAgIGF0dHJpYnV0ZXMuc2V0KCdhcmlhLWRpc2FibGVkJywgJ3RydWUnKTtcbiAgfVxuXG4gIGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZSgncGxhY2Vob2xkZXInKSkge1xuICAgIGF0dHJpYnV0ZXMuc2V0KCdhcmlhLXBsYWNlaG9sZGVyJywgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJykgfHwgJycpO1xuICB9XG5cbiAgY29uc3QgdGFiSW5kZXggPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcblxuICBpZiAodGFiSW5kZXgpIHtcbiAgICBhdHRyaWJ1dGVzLnNldCgndGFiaW5kZXgnLCB0YWJJbmRleCk7XG4gIH1cblxuICBpZiAoKDAsIF9kb20uaXNIVE1MRWxlbWVudCkoZWxlbWVudCkgJiYgKDAsIF9kb20uaGFzTGFiZWxzKShlbGVtZW50KSAmJiBlbGVtZW50LmxhYmVscykge1xuICAgIC8vIE5lZWQgdG8gaW52ZXJ0IHRoZSBsYWJlbFtmb3JdIC8gW2FyaWEtbGFiZWxsZWRieV0gcmVsYXRpb25zaGlwXG4gICAgYXR0cmlidXRlcy5zZXQoJ2FyaWEtbGFiZWxsZWRieScsIFsuLi5lbGVtZW50LmxhYmVsc10ubWFwKGxhYmVsID0+IHtcbiAgICAgIGxldCBsYWJlbElkID0gbGFiZWwuaWQgfHwgbGFiZWxzLmdldChsYWJlbCk7XG5cbiAgICAgIGlmICghbGFiZWxJZCkge1xuICAgICAgICBsYWJlbElkID0gJ2xhYmVsJyArIGdldFVuaXF1ZUlkKCk7XG4gICAgICAgIGxhYmVscy5zZXQobGFiZWwsIGxhYmVsSWQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbGFiZWxJZDtcbiAgICB9KS5qb2luKCcgJykpO1xuICB9XG5cbiAgZm9yIChjb25zdCBhdHRyaWJ1dGUgb2YgZWxlbWVudC5hdHRyaWJ1dGVzKSB7XG4gICAgaWYgKGF0dHJpYnV0ZS5uYW1lLnN0YXJ0c1dpdGgoJ2FyaWEtJykpIHtcbiAgICAgIGF0dHJpYnV0ZXMuc2V0KGF0dHJpYnV0ZS5uYW1lLCBhdHRyaWJ1dGUudmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGN1c3RvbVJvbGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgncm9sZScpO1xuXG4gIGlmIChjdXN0b21Sb2xlKSB7XG4gICAgYXR0cmlidXRlcy5zZXQoJ3JvbGUnLCBjdXN0b21Sb2xlKTtcbiAgfVxuXG4gIHJldHVybiBhdHRyaWJ1dGVzO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUwzTnlZeTloWTJObGMzTnBZbWxzYVhSNUxuUnpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3T3pzN1FVRkRRVHM3UVVGRlFTeE5RVUZOTEd0Q1FVRnJRaXhIUVVGSkxFOUJRVVFzU1VGRE1VSXNRMEZCUXl4UFFVRlBMRU5CUVVNc1QwRkJVaXhEUVVOQkxHMUpRVVJCTEVOQlJFWTdPMEZCUzAwc1UwRkJWU3d3UWtGQlZpeERRVU5NTEU5QlJFc3NSVUZGVER0QlFVRkZMRVZCUVVFc1RVRkJSanRCUVVGVkxFVkJRVUU3UVVGQlZpeERRVVpMTEVWQlJXOUZPMEZCUVVFN08wRkJSWHBGTzBGQlEwRXNVVUZCVFN4VlFVRlZMRWRCUVVjc1NVRkJTU3hIUVVGS0xFVkJRVzVDT3p0QlFVTkJMRlZCUVZFc1QwRkJUeXhEUVVGRExFOUJRV2hDTzBGQlEwTXNVMEZCU3l4SFFVRk1PMEZCUTBNc1RVRkJRU3hWUVVGVkxFTkJRVU1zUjBGQldDeERRVUZsTEUxQlFXWXNSVUZCZFVJc1RVRkJka0k3UVVGRFFUczdRVUZEUkN4VFFVRkxMRk5CUVV3N1FVRkRReXhOUVVGQkxGVkJRVlVzUTBGQlF5eEhRVUZZTEVOQlFXVXNUVUZCWml4RlFVRjFRaXhUUVVGMlFqdEJRVU5CT3p0QlFVTkVMRk5CUVVzc1QwRkJURHRCUVVORExFMUJRVUVzVlVGQlZTeERRVUZETEVkQlFWZ3NRMEZCWlN4TlFVRm1MRVZCUVhWQ0xHVkJRWFpDTzBGQlEwRTdPMEZCUTBRc1UwRkJTeXhOUVVGTU8wRkJRME1zVFVGQlFTeFZRVUZWTEVOQlFVTXNSMEZCV0N4RFFVRmxMRTFCUVdZc1JVRkJkVUlzVlVGQmRrSTdRVUZEUVRzN1FVRkRSQ3hUUVVGTExGRkJRVXc3UVVGRFFTeFRRVUZMTEZOQlFVdzdRVUZEUXl4TlFVRkJMRlZCUVZVc1EwRkJReXhIUVVGWUxFTkJRV1VzVFVGQlppeEZRVUYxUWl4UlFVRjJRanRCUVVOQk96dEJRVU5FTEZOQlFVc3NTVUZCVER0QlFVTkRMRTFCUVVFc1ZVRkJWU3hEUVVGRExFZEJRVmdzUTBGQlpTeE5RVUZtTEVWQlFYVkNMRmxCUVhaQ08wRkJRMEU3TzBGQlEwUXNVMEZCU3l4VFFVRk1PMEZCUTBNc1RVRkJRU3hWUVVGVkxFTkJRVU1zUjBGQldDeERRVUZsTEUxQlFXWXNSVUZCZFVJc1QwRkJka0k3UVVGRFFUczdRVUZEUkN4VFFVRkxMRXRCUVV3N1FVRkRReXhOUVVGQkxGVkJRVlVzUTBGQlF5eEhRVUZZTEVOQlFXVXNUVUZCWml4RlFVRjFRaXhOUVVGMlFqdEJRVU5CT3p0QlFVTkVMRk5CUVVzc1VVRkJURHRCUVVORExFMUJRVUVzVlVGQlZTeERRVUZETEVkQlFWZ3NRMEZCWlN4TlFVRm1MRVZCUVhWQ0xGRkJRWFpDTzBGQlEwRTdPMEZCUTBRc1UwRkJTeXhKUVVGTU8wRkJRME1zVFVGQlFTeFZRVUZWTEVOQlFVTXNSMEZCV0N4RFFVRmxMRTFCUVdZc1JVRkJkVUlzVFVGQmRrSTdRVUZEUVRzN1FVRkRSQ3hUUVVGTExGVkJRVXc3UVVGRFF5eE5RVUZCTEZWQlFWVXNRMEZCUXl4SFFVRllMRU5CUVdVc1RVRkJaaXhGUVVGMVFpeFBRVUYyUWp0QlFVTkJPenRCUVVORUxGTkJRVXNzVVVGQlREdEJRVU5ETEUxQlFVRXNWVUZCVlN4RFFVRkRMRWRCUVZnc1EwRkJaU3hOUVVGbUxFVkJRWFZDTEZGQlFYWkNPMEZCUTBFN08wRkJRMFFzVTBGQlN5eFJRVUZNTzBGQlEwTXNWVUZCU1N4clFrRkJhMElzUTBGQlF5eFBRVUZFTEVOQlFYUkNMRVZCUVdsRE8wRkJRMmhETEZGQlFVRXNWVUZCVlN4RFFVRkRMRWRCUVZnc1EwRkJaU3hOUVVGbUxFVkJRWFZDTEdGQlFYWkNPMEZCUTBFN08wRkJRMFE3TzBGQlEwUXNVMEZCU3l4TlFVRk1PMEZCUTBNc1RVRkJRU3hWUVVGVkxFTkJRVU1zUjBGQldDeERRVUZsTEUxQlFXWXNSVUZCZFVJc1RVRkJka0k3UVVGRFFUczdRVUZEUkN4VFFVRkxMRWxCUVV3N1FVRkRRU3hUUVVGTExFbEJRVXc3UVVGRFFTeFRRVUZMTEVsQlFVdzdRVUZEUVN4VFFVRkxMRWxCUVV3N1FVRkRRU3hUUVVGTExFbEJRVXc3UVVGRFFTeFRRVUZMTEVsQlFVdzdRVUZEUXl4TlFVRkJMRlZCUVZVc1EwRkJReXhIUVVGWUxFTkJRV1VzVFVGQlppeEZRVUYxUWl4VFFVRjJRanRCUVVOQkxFMUJRVUVzVlVGQlZTeERRVUZETEVkQlFWZ3NRMEZCWlN4WlFVRm1MRVZCUVRaQ0xFOUJRVThzUTBGQlF5eFBRVUZTTEVOQlFXZENMRXRCUVdoQ0xFTkJRWE5DTEVOQlFYUkNMRU5CUVRkQ08wRkJRMEU3TzBGQlEwUXNVMEZCU3l4UlFVRk1PMEZCUTBNc1ZVRkJTU3hyUWtGQmEwSXNRMEZCUXl4UFFVRkVMRU5CUVhSQ0xFVkJRV2xETzBGQlEyaERMRkZCUVVFc1ZVRkJWU3hEUVVGRExFZEJRVmdzUTBGQlpTeE5RVUZtTEVWQlFYVkNMRkZCUVhaQ08wRkJRMEU3TzBGQlEwUTdPMEZCUTBRc1UwRkJTeXhKUVVGTU8wRkJRME1zVFVGQlFTeFZRVUZWTEVOQlFVTXNSMEZCV0N4RFFVRmxMRTFCUVdZc1JVRkJkVUlzVjBGQmRrSTdRVUZEUVRzN1FVRkRSQ3hUUVVGTExFdEJRVXc3UVVGQldUdEJRVU5ZTEdOQlFVMHNSMEZCUnl4SFFVRkhMRTlCUVU4c1EwRkJReXhaUVVGU0xFTkJRWEZDTEV0QlFYSkNMRU5CUVZvN08wRkJRMEVzV1VGQlNTeEhRVUZITEV0QlFVc3NTVUZCVWl4SlFVRm5RaXhIUVVGSExFdEJRVXNzUlVGQk5VSXNSVUZCWjBNN1FVRkRMMElzVlVGQlFTeFZRVUZWTEVOQlFVTXNSMEZCV0N4RFFVRmxMRTFCUVdZc1JVRkJkVUlzUzBGQmRrSTdPMEZCUTBFc1kwRkJTU3hIUVVGS0xFVkJRVk03UVVGRFVpeFpRVUZCTEZWQlFWVXNRMEZCUXl4SFFVRllMRU5CUVdVc1dVRkJaaXhGUVVFMlFpeEhRVUUzUWp0QlFVTkJPMEZCUTBRN08wRkJRMFE3UVVGRFFUczdRVUZEUkN4VFFVRkxMRTlCUVV3N1FVRkRReXhqUVVGVExFOUJRVFJDTEVOQlFVTXNTVUZCZEVNN1FVRkRReXhoUVVGTExGRkJRVXc3UVVGRFFTeGhRVUZMTEU5QlFVdzdRVUZEUVN4aFFVRkxMRTlCUVV3N1FVRkRRU3hoUVVGTExGRkJRVXc3UVVGRFF5eFZRVUZCTEZWQlFWVXNRMEZCUXl4SFFVRllMRU5CUVdVc1RVRkJaaXhGUVVGMVFpeFJRVUYyUWp0QlFVTkJPenRCUVVORUxHRkJRVXNzVVVGQlREdEJRVU5ETEZWQlFVRXNWVUZCVlN4RFFVRkRMRWRCUVZnc1EwRkJaU3hOUVVGbUxFVkJRWFZDTEZsQlFYWkNPMEZCUTBFN08wRkJRMFFzWVVGQlN5eFBRVUZNTzBGQlEwTXNWVUZCUVN4VlFVRlZMRU5CUVVNc1IwRkJXQ3hEUVVGbExFMUJRV1lzUlVGQmRVSXNVVUZCZGtJN1FVRkRRVHM3UVVGRFJDeGhRVUZMTEZWQlFVdzdRVUZEUXl4VlFVRkJMRlZCUVZVc1EwRkJReXhIUVVGWUxFTkJRV1VzVFVGQlppeEZRVUYxUWl4VlFVRjJRanRCUVVOQk96dEJRVU5FTEdGQlFVc3NUMEZCVER0QlFVTkRMRlZCUVVFc1ZVRkJWU3hEUVVGRExFZEJRVmdzUTBGQlpTeE5RVUZtTEVWQlFYVkNMRTlCUVhaQ08wRkJRMEU3TzBGQlEwUXNZVUZCU3l4UFFVRk1PMEZCUTBFc1lVRkJTeXhMUVVGTU8wRkJRME1zWTBGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4WlFVRlNMRU5CUVhGQ0xFMUJRWEpDTEVOQlFVd3NSVUZCYlVNN1FVRkRiRU1zV1VGQlFTeFZRVUZWTEVOQlFVTXNSMEZCV0N4RFFVRmxMRTFCUVdZc1JVRkJkVUlzVTBGQmRrSTdRVUZEUVRzN1FVRkRSRHRCUVhoQ1JqczdRVUV3UWtFN08wRkJRMFFzVTBGQlN5eEpRVUZNTzBGQlEwTXNWVUZEUXl3d1FrRkJRU3hQUVVGUExFTkJRVU1zWVVGQlVpeG5Sa0ZCZFVJc1QwRkJka0lzVFVGQmJVTXNTVUZCYmtNc1NVRkRRU3d5UWtGQlFTeFBRVUZQTEVOQlFVTXNZVUZCVWl4clJrRkJkVUlzVDBGQmRrSXNUVUZCYlVNc1NVRkVia01zU1VGRlFTd3lRa0ZCUVN4UFFVRlBMRU5CUVVNc1lVRkJVaXhyUmtGQmRVSXNUMEZCZGtJc1RVRkJiVU1zVFVGSWNFTXNSVUZKUlR0QlFVTkVMRkZCUVVFc1ZVRkJWU3hEUVVGRExFZEJRVmdzUTBGQlpTeE5RVUZtTEVWQlFYVkNMRlZCUVhaQ08wRkJRMEU3TzBGQlEwUTdPMEZCUTBRc1UwRkJTeXhOUVVGTU8wRkJRME1zVlVGQlN5eFBRVUV5UWl4RFFVRkRMRWxCUVdwRExFVkJRWFZETzBGQlEzUkRMRkZCUVVFc1ZVRkJWU3hEUVVGRExFZEJRVmdzUTBGQlpTeE5RVUZtTEVWQlFYVkNMRTFCUVhaQ08wRkJRMEU3TzBGQlEwUTdPMEZCUTBRc1UwRkJTeXhOUVVGTU8wRkJRME1zVFVGQlFTeFZRVUZWTEVOQlFVTXNSMEZCV0N4RFFVRmxMRTFCUVdZc1JVRkJkVUlzVFVGQmRrSTdRVUZEUVRzN1FVRkRSQ3hUUVVGTExFMUJRVXc3UVVGRFF5eE5RVUZCTEZWQlFWVXNRMEZCUXl4SFFVRllMRU5CUVdVc1RVRkJaaXhGUVVGMVFpeE5RVUYyUWp0QlFVTkJPenRCUVVORUxGTkJRVXNzU1VGQlREdEJRVU5CTEZOQlFVc3NTVUZCVER0QlFVTkJMRk5CUVVzc1RVRkJURHRCUVVORExFMUJRVUVzVlVGQlZTeERRVUZETEVkQlFWZ3NRMEZCWlN4TlFVRm1MRVZCUVhWQ0xFMUJRWFpDTzBGQlEwRTdPMEZCUTBRc1UwRkJTeXhMUVVGTU8wRkJRME1zVFVGQlFTeFZRVUZWTEVOQlFVTXNSMEZCV0N4RFFVRmxMRTFCUVdZc1JVRkJkVUlzV1VGQmRrSTdRVUZEUVRzN1FVRkRSQ3hUUVVGTExGRkJRVXc3UVVGRFF5eE5RVUZCTEZWQlFWVXNRMEZCUXl4SFFVRllMRU5CUVdVc1RVRkJaaXhGUVVGMVFpeFJRVUYyUWp0QlFVTkJPenRCUVVORUxGTkJRVXNzVlVGQlREdEJRVU5ETEUxQlFVRXNWVUZCVlN4RFFVRkRMRWRCUVZnc1EwRkJaU3hOUVVGbUxFVkJRWFZDTEdGQlFYWkNPMEZCUTBFN08wRkJRMFFzVTBGQlN5eFRRVUZNTzBGQlEwTXNUVUZCUVN4VlFVRlZMRU5CUVVNc1IwRkJXQ3hEUVVGbExFMUJRV1lzUlVGQmRVSXNVVUZCZGtJN1FVRkRRVHM3UVVGRFJDeFRRVUZMTEZGQlFVdzdRVUZEUXl4TlFVRkJMRlZCUVZVc1EwRkJReXhIUVVGWUxFTkJRME1zVFVGRVJDeEZRVVZETEVOQlFVTXNUMEZCVHl4RFFVRkRMRmxCUVZJc1EwRkJjVUlzVlVGQmNrSXNRMEZCUkN4SlFVRnpReXhQUVVFMlFpeERRVUZETEVsQlFUbENMRWxCUVhORExFTkJRVFZGTEVkQlFXZEdMRlZCUVdoR0xFZEJRVFpHTEZOQlJqbEdPMEZCU1VFN08wRkJRMFFzVTBGQlN5eFBRVUZNTzBGQlEwTXNUVUZCUVN4VlFVRlZMRU5CUVVNc1IwRkJXQ3hEUVVGbExFMUJRV1lzUlVGQmRVSXNUMEZCZGtJN1FVRkRRVHM3UVVGRFJDeFRRVUZMTEU5QlFVdzdRVUZEUVN4VFFVRkxMRTlCUVV3N1FVRkRRU3hUUVVGTExFOUJRVXc3UVVGRFF5eE5RVUZCTEZWQlFWVXNRMEZCUXl4SFFVRllMRU5CUVdVc1RVRkJaaXhGUVVGMVFpeFZRVUYyUWp0QlFVTkJPenRCUVVORUxGTkJRVXNzVlVGQlREdEJRVU5ETEUxQlFVRXNWVUZCVlN4RFFVRkRMRWRCUVZnc1EwRkJaU3hOUVVGbUxFVkJRWFZDTEZOQlFYWkNPMEZCUTBFN08wRkJRMFFzVTBGQlN5eEpRVUZNTzBGQlEwTXNUVUZCUVN4VlFVRlZMRU5CUVVNc1IwRkJXQ3hEUVVGbExFMUJRV1lzUlVGQmRVSXNUVUZCZGtJN1FVRkRRVHM3UVVGRFJDeFRRVUZMTEVsQlFVdzdRVUZEUXl4TlFVRkJMRlZCUVZVc1EwRkJReXhIUVVGWUxFTkJRV1VzVFVGQlppeEZRVUYxUWl4UFFVRlBMRU5CUVVNc1QwRkJVaXhEUVVGblFpeFBRVUZvUWl4SlFVRXlRaXhqUVVFelFpeEhRVUUwUXl4WFFVRnVSVHRCUVVOQk96dEJRVU5FTEZOQlFVc3NTVUZCVER0QlFVTkRMRTFCUVVFc1ZVRkJWU3hEUVVGRExFZEJRVmdzUTBGQlpTeE5RVUZtTEVWQlFYVkNMRlZCUVhaQ08wRkJRMEU3UVVGdVMwWTdPMEZCY1V0QkxFMUJRVWtzVDBGQlR5eERRVUZETEZsQlFWSXNRMEZCY1VJc1ZVRkJja0lzUTBGQlNpeEZRVUZ6UXp0QlFVTnlReXhKUVVGQkxGVkJRVlVzUTBGQlF5eEhRVUZZTEVOQlFXVXNaVUZCWml4RlFVRm5ReXhOUVVGb1F6dEJRVU5CT3p0QlFVTkVMRTFCUVVrc1QwRkJUeXhEUVVGRExGbEJRVklzUTBGQmNVSXNZVUZCY2tJc1EwRkJTaXhGUVVGNVF6dEJRVU40UXl4SlFVRkJMRlZCUVZVc1EwRkJReXhIUVVGWUxFTkJRV1VzYTBKQlFXWXNSVUZCYlVNc1QwRkJUeXhEUVVGRExGbEJRVklzUTBGQmNVSXNZVUZCY2tJc1MwRkJkVU1zUlVGQk1VVTdRVUZEUVRzN1FVRkRSQ3hSUVVGTkxGRkJRVkVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNXVUZCVWl4RFFVRnhRaXhWUVVGeVFpeERRVUZxUWpzN1FVRkRRU3hOUVVGSkxGRkJRVW9zUlVGQll6dEJRVU5pTEVsQlFVRXNWVUZCVlN4RFFVRkRMRWRCUVZnc1EwRkJaU3hWUVVGbUxFVkJRVEpDTEZGQlFUTkNPMEZCUTBFN08wRkJRMFFzVFVGQlNTeDNRa0ZCWXl4UFFVRmtMRXRCUVRCQ0xHOUNRVUZWTEU5QlFWWXNRMEZCTVVJc1NVRkJaMFFzVDBGQlR5eERRVUZETEUxQlFUVkVMRVZCUVc5Rk8wRkJRMjVGTzBGQlEwRXNTVUZCUVN4VlFVRlZMRU5CUVVNc1IwRkJXQ3hEUVVORExHbENRVVJFTEVWQlJVTXNRMEZCUXl4SFFVRkhMRTlCUVU4c1EwRkJReXhOUVVGYUxFVkJRMFVzUjBGRVJpeERRVU5OTEV0QlFVc3NTVUZCUnp0QlFVTmFMRlZCUVVrc1QwRkJUeXhIUVVGSExFdEJRVXNzUTBGQlF5eEZRVUZPTEVsQlFWa3NUVUZCVFN4RFFVRkRMRWRCUVZBc1EwRkJWeXhMUVVGWUxFTkJRVEZDT3p0QlFVTkJMRlZCUVVrc1EwRkJReXhQUVVGTUxFVkJRV003UVVGRFlpeFJRVUZCTEU5QlFVOHNSMEZCUnl4VlFVRlZMRmRCUVZjc1JVRkJMMEk3UVVGRFFTeFJRVUZCTEUxQlFVMHNRMEZCUXl4SFFVRlFMRU5CUVZjc1MwRkJXQ3hGUVVGclFpeFBRVUZzUWp0QlFVTkJPenRCUVVORUxHRkJRVThzVDBGQlVEdEJRVU5CTEV0QlVrWXNSVUZUUlN4SlFWUkdMRU5CVTA4c1IwRlVVQ3hEUVVaRU8wRkJZVUU3TzBGQlJVUXNUMEZCU3l4TlFVRk5MRk5CUVZnc1NVRkJkMElzVDBGQlR5eERRVUZETEZWQlFXaERMRVZCUVRSRE8wRkJRek5ETEZGQlFVa3NVMEZCVXl4RFFVRkRMRWxCUVZZc1EwRkJaU3hWUVVGbUxFTkJRVEJDTEU5QlFURkNMRU5CUVVvc1JVRkJkME03UVVGRGRrTXNUVUZCUVN4VlFVRlZMRU5CUVVNc1IwRkJXQ3hEUVVGbExGTkJRVk1zUTBGQlF5eEpRVUY2UWl4RlFVRXJRaXhUUVVGVExFTkJRVU1zUzBGQmVrTTdRVUZEUVR0QlFVTkVPenRCUVVORUxGRkJRVTBzVlVGQlZTeEhRVUZITEU5QlFVOHNRMEZCUXl4WlFVRlNMRU5CUVhGQ0xFMUJRWEpDTEVOQlFXNUNPenRCUVVOQkxFMUJRVWtzVlVGQlNpeEZRVUZuUWp0QlFVTm1MRWxCUVVFc1ZVRkJWU3hEUVVGRExFZEJRVmdzUTBGQlpTeE5RVUZtTEVWQlFYVkNMRlZCUVhaQ08wRkJRMEU3TzBGQlEwUXNVMEZCVHl4VlFVRlFPMEZCUTBFaUxDSnpiM1Z5WTJWU2IyOTBJam9pSW4wPSIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5wYXJzZUZvbnRGYWNlU291cmNlVXJscyA9IHBhcnNlRm9udEZhY2VTb3VyY2VVcmxzO1xuZXhwb3J0cy5wYXJzZUNTU0xlbmd0aCA9IHBhcnNlQ1NTTGVuZ3RoO1xuZXhwb3J0cy5wYXJzZUNzc1N0cmluZyA9IHBhcnNlQ3NzU3RyaW5nO1xuZXhwb3J0cy5wYXJzZVVybFJlZmVyZW5jZSA9IHBhcnNlVXJsUmVmZXJlbmNlO1xuZXhwb3J0cy5wYXJzZUZvcm1hdFNwZWNpZmllciA9IHBhcnNlRm9ybWF0U3BlY2lmaWVyO1xuZXhwb3J0cy5wYXJzZUxvY2FsUmVmZXJlbmNlID0gcGFyc2VMb2NhbFJlZmVyZW5jZTtcbmV4cG9ydHMuY29weUNzc1N0eWxlcyA9IGNvcHlDc3NTdHlsZXM7XG5leHBvcnRzLmlzVmlzaWJsZSA9IGV4cG9ydHMuaGFzVW5pZm9ybUJvcmRlclJhZGl1cyA9IGV4cG9ydHMuaGFzVW5pZm9ybUJvcmRlciA9IGV4cG9ydHMuaXNUcmFuc3BhcmVudCA9IGV4cG9ydHMuaXNJbkZsb3cgPSBleHBvcnRzLmlzUG9zaXRpb25lZCA9IGV4cG9ydHMuaXNJbmxpbmUgPSBleHBvcnRzLmlzQ1NTRm9udEZhY2VSdWxlID0gdm9pZCAwO1xuXG52YXIgX3V0aWwgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xuXG5jb25zdCBpc0NTU0ZvbnRGYWNlUnVsZSA9IHJ1bGUgPT4gcnVsZS50eXBlID09PSBDU1NSdWxlLkZPTlRfRkFDRV9SVUxFO1xuXG5leHBvcnRzLmlzQ1NTRm9udEZhY2VSdWxlID0gaXNDU1NGb250RmFjZVJ1bGU7XG5cbmZ1bmN0aW9uIHBhcnNlRm9udEZhY2VTb3VyY2VVcmxzKHNvdXJjZSkge1xuICBjb25zdCBmb250cyA9IHNvdXJjZS5zcGxpdCgvLFxccyovKTtcbiAgcmV0dXJuIGZvbnRzLm1hcChmb250ID0+IHtcbiAgICBjb25zdCB0b2tlbnMgPSB7fTtcblxuICAgIGZvciAoY29uc3QgdG9rZW4gb2YgZm9udC50cmltKCkuc3BsaXQoL1xccysvKSkge1xuICAgICAgaWYgKHRva2VuLnN0YXJ0c1dpdGgoJ2xvY2FsKCcpKSB7XG4gICAgICAgIHRva2Vucy5sb2NhbCA9IHBhcnNlTG9jYWxSZWZlcmVuY2UodG9rZW4pO1xuICAgICAgfVxuXG4gICAgICBpZiAodG9rZW4uc3RhcnRzV2l0aCgndXJsKCcpKSB7XG4gICAgICAgIHRva2Vucy51cmwgPSBwYXJzZVVybFJlZmVyZW5jZSh0b2tlbik7XG4gICAgICB9XG5cbiAgICAgIGlmICh0b2tlbi5zdGFydHNXaXRoKCdmb3JtYXQoJykpIHtcbiAgICAgICAgdG9rZW5zLmZvcm1hdCA9IHBhcnNlRm9ybWF0U3BlY2lmaWVyKHRva2VuKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodG9rZW5zLnVybCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdXJsOiB0b2tlbnMudXJsLFxuICAgICAgICBmb3JtYXQ6IHRva2Vucy5mb3JtYXRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKHRva2Vucy5sb2NhbCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbG9jYWw6IHRva2Vucy5sb2NhbFxuICAgICAgfTtcbiAgICB9XG4gIH0pLmZpbHRlcihfdXRpbC5pc0RlZmluZWQpO1xufVxuXG5jb25zdCBpc0lubGluZSA9IHN0eWxlcyA9PiBzdHlsZXMuZGlzcGxheU91dHNpZGUgPT09ICdpbmxpbmUnIHx8IHN0eWxlcy5kaXNwbGF5LnN0YXJ0c1dpdGgoJ2lubGluZS0nKTtcblxuZXhwb3J0cy5pc0lubGluZSA9IGlzSW5saW5lO1xuXG5jb25zdCBpc1Bvc2l0aW9uZWQgPSBzdHlsZXMgPT4gc3R5bGVzLnBvc2l0aW9uICE9PSAnc3RhdGljJztcblxuZXhwb3J0cy5pc1Bvc2l0aW9uZWQgPSBpc1Bvc2l0aW9uZWQ7XG5cbmNvbnN0IGlzSW5GbG93ID0gc3R5bGVzID0+IHN0eWxlcy5mbG9hdCAhPT0gJ25vbmUnICYmIHN0eWxlcy5wb3NpdGlvbiAhPT0gJ2Fic29sdXRlJyAmJiBzdHlsZXMucG9zaXRpb24gIT09ICdmaXhlZCc7XG5cbmV4cG9ydHMuaXNJbkZsb3cgPSBpc0luRmxvdztcblxuY29uc3QgaXNUcmFuc3BhcmVudCA9IGNvbG9yID0+IGNvbG9yID09PSAndHJhbnNwYXJlbnQnIHx8IGNvbG9yID09PSAncmdiYSgwLCAwLCAwLCAwKSc7XG5cbmV4cG9ydHMuaXNUcmFuc3BhcmVudCA9IGlzVHJhbnNwYXJlbnQ7XG5cbmNvbnN0IGhhc1VuaWZvcm1Cb3JkZXIgPSBzdHlsZXMgPT4gcGFyc2VJbnQoc3R5bGVzLmJvcmRlclRvcFdpZHRoLCAxMCkgIT09IDEwICYmIHN0eWxlcy5ib3JkZXJUb3BTdHlsZSAhPT0gJ25vbmUnICYmIHN0eWxlcy5ib3JkZXJUb3BTdHlsZSAhPT0gJ2luc2V0JyAmJiBzdHlsZXMuYm9yZGVyVG9wU3R5bGUgIT09ICdvdXRzZXQnICYmICFpc1RyYW5zcGFyZW50KHN0eWxlcy5ib3JkZXJUb3BDb2xvcikgJiYgc3R5bGVzLmJvcmRlclRvcCA9PT0gc3R5bGVzLmJvcmRlckxlZnQgJiYgc3R5bGVzLmJvcmRlclRvcCA9PT0gc3R5bGVzLmJvcmRlclJpZ2h0ICYmIHN0eWxlcy5ib3JkZXJUb3AgPT09IHN0eWxlcy5ib3JkZXJCb3R0b207XG5cbmV4cG9ydHMuaGFzVW5pZm9ybUJvcmRlciA9IGhhc1VuaWZvcm1Cb3JkZXI7XG5cbmNvbnN0IGhhc1VuaWZvcm1Cb3JkZXJSYWRpdXMgPSBzdHlsZXMgPT4gc3R5bGVzLmJvcmRlclRvcExlZnRSYWRpdXMgPT09IHN0eWxlcy5ib3JkZXJUb3BSaWdodFJhZGl1cyAmJiBzdHlsZXMuYm9yZGVyVG9wTGVmdFJhZGl1cyA9PT0gc3R5bGVzLmJvcmRlckJvdHRvbUxlZnRSYWRpdXMgJiYgc3R5bGVzLmJvcmRlclRvcExlZnRSYWRpdXMgPT09IHN0eWxlcy5ib3JkZXJCb3R0b21SaWdodFJhZGl1cztcblxuZXhwb3J0cy5oYXNVbmlmb3JtQm9yZGVyUmFkaXVzID0gaGFzVW5pZm9ybUJvcmRlclJhZGl1cztcblxuY29uc3QgaXNWaXNpYmxlID0gc3R5bGVzID0+IHN0eWxlcy5kaXNwbGF5T3V0c2lkZSAhPT0gJ25vbmUnICYmIHN0eWxlcy5kaXNwbGF5ICE9PSAnbm9uZScgJiYgc3R5bGVzLnZpc2liaWxpdHkgIT09ICdoaWRkZW4nICYmIHN0eWxlcy5vcGFjaXR5ICE9PSAnMCc7XG5cbmV4cG9ydHMuaXNWaXNpYmxlID0gaXNWaXNpYmxlO1xuXG5mdW5jdGlvbiBwYXJzZUNTU0xlbmd0aChsZW5ndGgsIGNvbnRhaW5lckxlbmd0aCkge1xuICBpZiAobGVuZ3RoLmVuZHNXaXRoKCdweCcpKSB7XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQobGVuZ3RoKTtcbiAgfVxuXG4gIGlmIChsZW5ndGguZW5kc1dpdGgoJyUnKSkge1xuICAgIHJldHVybiBwYXJzZUZsb2F0KGxlbmd0aCkgLyAxMDAgKiBjb250YWluZXJMZW5ndGg7XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBwYXJzZUNzc1N0cmluZyh2YWx1ZSkge1xuICBjb25zdCBtYXRjaCA9IHZhbHVlLm1hdGNoKC9eXFxzKig/OicoLiopJ3xcIiguKilcIilcXHMqJC8pO1xuXG4gIGlmICghbWF0Y2gpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgQ1NTIHN0cmluZzogJHt2YWx1ZX1gKTtcbiAgfVxuXG4gIHJldHVybiAobWF0Y2hbMV0gfHwgbWF0Y2hbMl0pLnJlcGxhY2UoL1xcXFwoLikvZywgJyQxJyk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVXJsUmVmZXJlbmNlKHJlZmVyZW5jZSkge1xuICB2YXIgX3JlZiwgX21hdGNoJDtcblxuICBjb25zdCBtYXRjaCA9IHJlZmVyZW5jZS5tYXRjaCgvdXJsXFwoKD86JyguKiknfFwiKC4qKVwifCguKikpXFwpLyk7XG5cbiAgaWYgKCFtYXRjaCkge1xuICAgIHRocm93IG5ldyBVUklFcnJvcignSW52YWxpZCBVUkwgJyArIEpTT04uc3RyaW5naWZ5KHJlZmVyZW5jZSkpO1xuICB9XG5cbiAgcmV0dXJuICgoX3JlZiA9IChfbWF0Y2gkID0gbWF0Y2hbMV0pICE9PSBudWxsICYmIF9tYXRjaCQgIT09IHZvaWQgMCA/IF9tYXRjaCQgOiBtYXRjaFsyXSkgIT09IG51bGwgJiYgX3JlZiAhPT0gdm9pZCAwID8gX3JlZiA6IG1hdGNoWzNdKS5yZXBsYWNlKC9cXFxcKC4pL2csICckMScpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUZvcm1hdFNwZWNpZmllcihmb3JtYXQpIHtcbiAgdmFyIF9yZWYyLCBfbWF0Y2gkMjtcblxuICBjb25zdCBtYXRjaCA9IGZvcm1hdC5tYXRjaCgvZm9ybWF0XFwoKD86JyguKiknfFwiKC4qKVwifCguKikpXFwpLyk7XG5cbiAgaWYgKCFtYXRjaCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBmb3JtYXQoKSAnICsgSlNPTi5zdHJpbmdpZnkoZm9ybWF0KSk7XG4gIH1cblxuICByZXR1cm4gKChfcmVmMiA9IChfbWF0Y2gkMiA9IG1hdGNoWzFdKSAhPT0gbnVsbCAmJiBfbWF0Y2gkMiAhPT0gdm9pZCAwID8gX21hdGNoJDIgOiBtYXRjaFsyXSkgIT09IG51bGwgJiYgX3JlZjIgIT09IHZvaWQgMCA/IF9yZWYyIDogbWF0Y2hbM10pLnJlcGxhY2UoL1xcXFwoLikvZywgJyQxJyk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlTG9jYWxSZWZlcmVuY2UoZm9ybWF0KSB7XG4gIHZhciBfcmVmMywgX21hdGNoJDM7XG5cbiAgY29uc3QgbWF0Y2ggPSBmb3JtYXQubWF0Y2goL2xvY2FsXFwoKD86JyguKiknfFwiKC4qKVwifCguKikpXFwpLyk7XG5cbiAgaWYgKCFtYXRjaCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBsb2NhbCgpICcgKyBKU09OLnN0cmluZ2lmeShmb3JtYXQpKTtcbiAgfVxuXG4gIHJldHVybiAoKF9yZWYzID0gKF9tYXRjaCQzID0gbWF0Y2hbMV0pICE9PSBudWxsICYmIF9tYXRjaCQzICE9PSB2b2lkIDAgPyBfbWF0Y2gkMyA6IG1hdGNoWzJdKSAhPT0gbnVsbCAmJiBfcmVmMyAhPT0gdm9pZCAwID8gX3JlZjMgOiBtYXRjaFszXSkucmVwbGFjZSgvXFxcXCguKS9nLCAnJDEnKTtcbn1cblxuZnVuY3Rpb24gY29weUNzc1N0eWxlcyhmcm9tLCB0bykge1xuICBmb3IgKGNvbnN0IHByb3BlcnR5IG9mIGZyb20pIHtcbiAgICB0by5zZXRQcm9wZXJ0eShwcm9wZXJ0eSwgdG8uZ2V0UHJvcGVydHlWYWx1ZShwcm9wZXJ0eSksIHRvLmdldFByb3BlcnR5UHJpb3JpdHkocHJvcGVydHkpKTtcbiAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUwzTnlZeTlqYzNNdWRITWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPenM3T3pzN096czdPenM3UVVGQlFUczdRVUZGVHl4TlFVRk5MR2xDUVVGcFFpeEhRVUZKTEVsQlFVUXNTVUZCTkVNc1NVRkJTU3hEUVVGRExFbEJRVXdzUzBGQll5eFBRVUZQTEVOQlFVTXNZMEZCTlVZN096czdRVUZGUkN4VFFVRlZMSFZDUVVGV0xFTkJRV3RETEUxQlFXeERMRVZCUVdkRU8wRkJRM0pFTEZGQlFVMHNTMEZCU3l4SFFVRkhMRTFCUVUwc1EwRkJReXhMUVVGUUxFTkJRV0VzVFVGQllpeERRVUZrTzBGQlEwRXNVMEZCVHl4TFFVRkxMRU5CUTFZc1IwRkVTeXhEUVVORUxFbEJRVWtzU1VGQlJ6dEJRVU5ZTEZWQlFVMHNUVUZCVFN4SFFVRnpSQ3hGUVVGc1JUczdRVUZEUVN4VFFVRkxMRTFCUVUwc1MwRkJXQ3hKUVVGdlFpeEpRVUZKTEVOQlFVTXNTVUZCVEN4SFFVRlpMRXRCUVZvc1EwRkJhMElzUzBGQmJFSXNRMEZCY0VJc1JVRkJPRU03UVVGRE4wTXNWVUZCU1N4TFFVRkxMRU5CUVVNc1ZVRkJUaXhEUVVGcFFpeFJRVUZxUWl4RFFVRktMRVZCUVdkRE8wRkJReTlDTEZGQlFVRXNUVUZCVFN4RFFVRkRMRXRCUVZBc1IwRkJaU3h0UWtGQmJVSXNRMEZCUXl4TFFVRkVMRU5CUVd4RE8wRkJRMEU3TzBGQlEwUXNWVUZCU1N4TFFVRkxMRU5CUVVNc1ZVRkJUaXhEUVVGcFFpeE5RVUZxUWl4RFFVRktMRVZCUVRoQ08wRkJRemRDTEZGQlFVRXNUVUZCVFN4RFFVRkRMRWRCUVZBc1IwRkJZU3hwUWtGQmFVSXNRMEZCUXl4TFFVRkVMRU5CUVRsQ08wRkJRMEU3TzBGQlEwUXNWVUZCU1N4TFFVRkxMRU5CUVVNc1ZVRkJUaXhEUVVGcFFpeFRRVUZxUWl4RFFVRktMRVZCUVdsRE8wRkJRMmhETEZGQlFVRXNUVUZCVFN4RFFVRkRMRTFCUVZBc1IwRkJaMElzYjBKQlFXOUNMRU5CUVVNc1MwRkJSQ3hEUVVGd1F6dEJRVU5CTzBGQlEwUTdPMEZCUTBRc1VVRkJTU3hOUVVGTkxFTkJRVU1zUjBGQldDeEZRVUZuUWp0QlFVTm1MR0ZCUVU4N1FVRkJSU3hSUVVGQkxFZEJRVWNzUlVGQlJTeE5RVUZOTEVOQlFVTXNSMEZCWkR0QlFVRnRRaXhSUVVGQkxFMUJRVTBzUlVGQlJTeE5RVUZOTEVOQlFVTTdRVUZCYkVNc1QwRkJVRHRCUVVOQk96dEJRVU5FTEZGQlFVa3NUVUZCVFN4RFFVRkRMRXRCUVZnc1JVRkJhMEk3UVVGRGFrSXNZVUZCVHp0QlFVRkZMRkZCUVVFc1MwRkJTeXhGUVVGRkxFMUJRVTBzUTBGQlF6dEJRVUZvUWl4UFFVRlFPMEZCUTBFN1FVRkRSQ3hIUVhCQ1N5eEZRWEZDVEN4TlFYSkNTeXhEUVhGQ1JTeGxRWEpDUml4RFFVRlFPMEZCYzBKQk96dEJRVU5OTEUxQlFVMHNVVUZCVVN4SFFVRkpMRTFCUVVRc1NVRkRka0lzVFVGQlRTeERRVUZETEdOQlFWQXNTMEZCTUVJc1VVRkJNVUlzU1VGQmMwTXNUVUZCVFN4RFFVRkRMRTlCUVZBc1EwRkJaU3hWUVVGbUxFTkJRVEJDTEZOQlFURkNMRU5CUkdoRE96czdPMEZCUjBFc1RVRkJUU3haUVVGWkxFZEJRVWtzVFVGQlJDeEpRVUV3UXl4TlFVRk5MRU5CUVVNc1VVRkJVQ3hMUVVGdlFpeFJRVUZ1UmpzN096dEJRVVZCTEUxQlFVMHNVVUZCVVN4SFFVRkpMRTFCUVVRc1NVRkRka0lzVFVGQlRTeERRVUZETEV0QlFWQXNTMEZCYVVJc1RVRkJha0lzU1VGQk1rSXNUVUZCVFN4RFFVRkRMRkZCUVZBc1MwRkJiMElzVlVGQkwwTXNTVUZCTmtRc1RVRkJUU3hEUVVGRExGRkJRVkFzUzBGQmIwSXNUMEZFTTBVN096czdRVUZIUVN4TlFVRk5MR0ZCUVdFc1IwRkJTU3hMUVVGRUxFbEJRVFJDTEV0QlFVc3NTMEZCU3l4aFFVRldMRWxCUVRKQ0xFdEJRVXNzUzBGQlN5eHJRa0ZCZGtZN096czdRVUZGUVN4TlFVRk5MR2RDUVVGblFpeEhRVUZKTEUxQlFVUXNTVUZETDBJc1VVRkJVU3hEUVVGRExFMUJRVTBzUTBGQlF5eGpRVUZTTEVWQlFYZENMRVZCUVhoQ0xFTkJRVklzUzBGQmQwTXNSVUZCZUVNc1NVRkRRU3hOUVVGTkxFTkJRVU1zWTBGQlVDeExRVUV3UWl4TlFVUXhRaXhKUVVWQkxFMUJRVTBzUTBGQlF5eGpRVUZRTEV0QlFUQkNMRTlCUmpGQ0xFbEJSMEVzVFVGQlRTeERRVUZETEdOQlFWQXNTMEZCTUVJc1VVRklNVUlzU1VGSlFTeERRVUZETEdGQlFXRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1kwRkJVaXhEUVVwa0xFbEJTMEVzVFVGQlRTeERRVUZETEZOQlFWQXNTMEZCY1VJc1RVRkJUU3hEUVVGRExGVkJURFZDTEVsQlRVRXNUVUZCVFN4RFFVRkRMRk5CUVZBc1MwRkJjVUlzVFVGQlRTeERRVUZETEZkQlRqVkNMRWxCVDBFc1RVRkJUU3hEUVVGRExGTkJRVkFzUzBGQmNVSXNUVUZCVFN4RFFVRkRMRmxCVW5SQ096czdPMEZCVlVFc1RVRkJUU3h6UWtGQmMwSXNSMEZCU1N4TlFVRkVMRWxCUTNKRExFMUJRVTBzUTBGQlF5eHRRa0ZCVUN4TFFVRXJRaXhOUVVGTkxFTkJRVU1zYjBKQlFYUkRMRWxCUTBFc1RVRkJUU3hEUVVGRExHMUNRVUZRTEV0QlFTdENMRTFCUVUwc1EwRkJReXh6UWtGRWRFTXNTVUZGUVN4TlFVRk5MRU5CUVVNc2JVSkJRVkFzUzBGQkswSXNUVUZCVFN4RFFVRkRMSFZDUVVob1F6czdPenRCUVV0QkxFMUJRVTBzVTBGQlV5eEhRVUZKTEUxQlFVUXNTVUZEZUVJc1RVRkJUU3hEUVVGRExHTkJRVkFzUzBGQk1FSXNUVUZCTVVJc1NVRkRRU3hOUVVGTkxFTkJRVU1zVDBGQlVDeExRVUZ0UWl4TlFVUnVRaXhKUVVWQkxFMUJRVTBzUTBGQlF5eFZRVUZRTEV0QlFYTkNMRkZCUm5SQ0xFbEJSMEVzVFVGQlRTeERRVUZETEU5QlFWQXNTMEZCYlVJc1IwRktZanM3T3p0QlFVMUVMRk5CUVZVc1kwRkJWaXhEUVVGNVFpeE5RVUY2UWl4RlFVRjVReXhsUVVGNlF5eEZRVUZuUlR0QlFVTnlSU3hOUVVGSkxFMUJRVTBzUTBGQlF5eFJRVUZRTEVOQlFXZENMRWxCUVdoQ0xFTkJRVW9zUlVGQk1rSTdRVUZETVVJc1YwRkJUeXhWUVVGVkxFTkJRVU1zVFVGQlJDeERRVUZxUWp0QlFVTkJPenRCUVVORUxFMUJRVWtzVFVGQlRTeERRVUZETEZGQlFWQXNRMEZCWjBJc1IwRkJhRUlzUTBGQlNpeEZRVUV3UWp0QlFVTjZRaXhYUVVGUkxGVkJRVlVzUTBGQlF5eE5RVUZFTEVOQlFWWXNSMEZCY1VJc1IwRkJkRUlzUjBGQk5rSXNaVUZCY0VNN1FVRkRRVHM3UVVGRFJDeFRRVUZQTEZOQlFWQTdRVUZEUVRzN1FVRkZTeXhUUVVGVkxHTkJRVllzUTBGQmVVSXNTMEZCZWtJc1JVRkJjME03UVVGRE0wTXNVVUZCVFN4TFFVRkxMRWRCUVVjc1MwRkJTeXhEUVVGRExFdEJRVTRzUTBGQldTd3lRa0ZCV2l4RFFVRmtPenRCUVVOQkxFMUJRVWtzUTBGQlF5eExRVUZNTEVWQlFWazdRVUZEV0N4VlFVRk5MRWxCUVVrc1MwRkJTaXhEUVVGVkxIVkNRVUYxUWl4TFFVRkxMRVZCUVhSRExFTkJRVTQ3UVVGRFFUczdRVUZEUkN4VFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVVFzUTBGQlRDeEpRVUZaTEV0QlFVc3NRMEZCUXl4RFFVRkVMRU5CUVd4Q0xFVkJRWFZDTEU5QlFYWkNMRU5CUVN0Q0xGRkJRUzlDTEVWQlFYbERMRWxCUVhwRExFTkJRVkE3UVVGRFFUczdRVUZGU3l4VFFVRlZMR2xDUVVGV0xFTkJRVFJDTEZOQlFUVkNMRVZCUVRaRE8wRkJRVUU3TzBGQlEyeEVMRkZCUVUwc1MwRkJTeXhIUVVGSExGTkJRVk1zUTBGQlF5eExRVUZXTEVOQlFXZENMQ3RDUVVGb1FpeERRVUZrT3p0QlFVTkJMRTFCUVVrc1EwRkJReXhMUVVGTUxFVkJRVms3UVVGRFdDeFZRVUZOTEVsQlFVa3NVVUZCU2l4RFFVRmhMR2xDUVVGcFFpeEpRVUZKTEVOQlFVTXNVMEZCVEN4RFFVRmxMRk5CUVdZc1EwRkJPVUlzUTBGQlRqdEJRVU5CT3p0QlFVTkVMRk5CUVU4c2IwSkJRVU1zUzBGQlN5eERRVUZETEVOQlFVUXNRMEZCVGl3MlEwRkJZU3hMUVVGTExFTkJRVU1zUTBGQlJDeERRVUZzUWl4MVEwRkJlVUlzUzBGQlN5eERRVUZETEVOQlFVUXNRMEZCT1VJc1JVRkJiVU1zVDBGQmJrTXNRMEZCTWtNc1VVRkJNME1zUlVGQmNVUXNTVUZCY2tRc1EwRkJVRHRCUVVOQk96dEJRVVZMTEZOQlFWVXNiMEpCUVZZc1EwRkJLMElzVFVGQkwwSXNSVUZCTmtNN1FVRkJRVHM3UVVGRGJFUXNVVUZCVFN4TFFVRkxMRWRCUVVjc1RVRkJUU3hEUVVGRExFdEJRVkFzUTBGQllTeHJRMEZCWWl4RFFVRmtPenRCUVVOQkxFMUJRVWtzUTBGQlF5eExRVUZNTEVWQlFWazdRVUZEV0N4VlFVRk5MRWxCUVVrc1MwRkJTaXhEUVVGVkxITkNRVUZ6UWl4SlFVRkpMRU5CUVVNc1UwRkJUQ3hEUVVGbExFMUJRV1lzUTBGQmFFTXNRMEZCVGp0QlFVTkJPenRCUVVORUxGTkJRVThzYzBKQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVRc1EwRkJUaXdyUTBGQllTeExRVUZMTEVOQlFVTXNRMEZCUkN4RFFVRnNRaXg1UTBGQmVVSXNTMEZCU3l4RFFVRkRMRU5CUVVRc1EwRkJPVUlzUlVGQmJVTXNUMEZCYmtNc1EwRkJNa01zVVVGQk0wTXNSVUZCY1VRc1NVRkJja1FzUTBGQlVEdEJRVU5CT3p0QlFVVkxMRk5CUVZVc2JVSkJRVllzUTBGQk9FSXNUVUZCT1VJc1JVRkJORU03UVVGQlFUczdRVUZEYWtRc1VVRkJUU3hMUVVGTExFZEJRVWNzVFVGQlRTeERRVUZETEV0QlFWQXNRMEZCWVN4cFEwRkJZaXhEUVVGa096dEJRVU5CTEUxQlFVa3NRMEZCUXl4TFFVRk1MRVZCUVZrN1FVRkRXQ3hWUVVGTkxFbEJRVWtzUzBGQlNpeERRVUZWTEhGQ1FVRnhRaXhKUVVGSkxFTkJRVU1zVTBGQlRDeERRVUZsTEUxQlFXWXNRMEZCTDBJc1EwRkJUanRCUVVOQk96dEJRVU5FTEZOQlFVOHNjMEpCUVVNc1MwRkJTeXhEUVVGRExFTkJRVVFzUTBGQlRpd3JRMEZCWVN4TFFVRkxMRU5CUVVNc1EwRkJSQ3hEUVVGc1FpeDVRMEZCZVVJc1MwRkJTeXhEUVVGRExFTkJRVVFzUTBGQk9VSXNSVUZCYlVNc1QwRkJia01zUTBGQk1rTXNVVUZCTTBNc1JVRkJjVVFzU1VGQmNrUXNRMEZCVUR0QlFVTkJPenRCUVVWTExGTkJRVlVzWVVGQlZpeERRVUYzUWl4SlFVRjRRaXhGUVVGdFJDeEZRVUZ1UkN4RlFVRXdSVHRCUVVNdlJTeFBRVUZMTEUxQlFVMHNVVUZCV0N4SlFVRjFRaXhKUVVGMlFpeEZRVUUyUWp0QlFVTTFRaXhKUVVGQkxFVkJRVVVzUTBGQlF5eFhRVUZJTEVOQlFXVXNVVUZCWml4RlFVRjVRaXhGUVVGRkxFTkJRVU1zWjBKQlFVZ3NRMEZCYjBJc1VVRkJjRUlzUTBGQmVrSXNSVUZCZDBRc1JVRkJSU3hEUVVGRExHMUNRVUZJTEVOQlFYVkNMRkZCUVhaQ0xFTkJRWGhFTzBGQlEwRTdRVUZEUkNJc0luTnZkWEpqWlZKdmIzUWlPaUlpZlE9PSIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy50cmF2ZXJzZURPTSA9IHRyYXZlcnNlRE9NO1xuZXhwb3J0cy5oYXNMYWJlbHMgPSBleHBvcnRzLmlzU1ZHU3R5bGVFbGVtZW50ID0gZXhwb3J0cy5pc1NWR0ltYWdlRWxlbWVudCA9IGV4cG9ydHMuaXNIVE1MSW5wdXRFbGVtZW50ID0gZXhwb3J0cy5pc0hUTUxJbWFnZUVsZW1lbnQgPSBleHBvcnRzLmlzSFRNTExhYmVsRWxlbWVudCA9IGV4cG9ydHMuaXNIVE1MQW5jaG9yRWxlbWVudCA9IGV4cG9ydHMuaXNDb21tZW50Tm9kZSA9IGV4cG9ydHMuaXNUZXh0Tm9kZSA9IGV4cG9ydHMuaXNTVkdFbGVtZW50ID0gZXhwb3J0cy5pc0hUTUxFbGVtZW50ID0gZXhwb3J0cy5pc0VsZW1lbnQgPSBleHBvcnRzLnhodG1sTmFtZXNwYWNlID0gZXhwb3J0cy54bGlua05hbWVzcGFjZSA9IGV4cG9ydHMuc3ZnTmFtZXNwYWNlID0gdm9pZCAwO1xuY29uc3Qgc3ZnTmFtZXNwYWNlID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJztcbmV4cG9ydHMuc3ZnTmFtZXNwYWNlID0gc3ZnTmFtZXNwYWNlO1xuY29uc3QgeGxpbmtOYW1lc3BhY2UgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayc7XG5leHBvcnRzLnhsaW5rTmFtZXNwYWNlID0geGxpbmtOYW1lc3BhY2U7XG5jb25zdCB4aHRtbE5hbWVzcGFjZSA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJztcbmV4cG9ydHMueGh0bWxOYW1lc3BhY2UgPSB4aHRtbE5hbWVzcGFjZTtcblxuY29uc3QgaXNFbGVtZW50ID0gbm9kZSA9PiBub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERTtcblxuZXhwb3J0cy5pc0VsZW1lbnQgPSBpc0VsZW1lbnQ7XG5cbmNvbnN0IGlzSFRNTEVsZW1lbnQgPSBlbGVtZW50ID0+IGVsZW1lbnQubmFtZXNwYWNlVVJJID09PSB4aHRtbE5hbWVzcGFjZTtcblxuZXhwb3J0cy5pc0hUTUxFbGVtZW50ID0gaXNIVE1MRWxlbWVudDtcblxuY29uc3QgaXNTVkdFbGVtZW50ID0gZWxlbWVudCA9PiBlbGVtZW50Lm5hbWVzcGFjZVVSSSA9PT0gc3ZnTmFtZXNwYWNlO1xuXG5leHBvcnRzLmlzU1ZHRWxlbWVudCA9IGlzU1ZHRWxlbWVudDtcblxuY29uc3QgaXNUZXh0Tm9kZSA9IG5vZGUgPT4gbm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREU7XG5cbmV4cG9ydHMuaXNUZXh0Tm9kZSA9IGlzVGV4dE5vZGU7XG5cbmNvbnN0IGlzQ29tbWVudE5vZGUgPSBub2RlID0+IG5vZGUubm9kZVR5cGUgPT09IE5vZGUuQ09NTUVOVF9OT0RFO1xuXG5leHBvcnRzLmlzQ29tbWVudE5vZGUgPSBpc0NvbW1lbnROb2RlO1xuXG5jb25zdCBpc0hUTUxBbmNob3JFbGVtZW50ID0gZWxlbWVudCA9PiBlbGVtZW50LnRhZ05hbWUgPT09ICdBJyAmJiBpc0hUTUxFbGVtZW50KGVsZW1lbnQpO1xuXG5leHBvcnRzLmlzSFRNTEFuY2hvckVsZW1lbnQgPSBpc0hUTUxBbmNob3JFbGVtZW50O1xuXG5jb25zdCBpc0hUTUxMYWJlbEVsZW1lbnQgPSBlbGVtZW50ID0+IGVsZW1lbnQudGFnTmFtZSA9PT0gJ0xBQkVMJyAmJiBpc0hUTUxFbGVtZW50KGVsZW1lbnQpO1xuXG5leHBvcnRzLmlzSFRNTExhYmVsRWxlbWVudCA9IGlzSFRNTExhYmVsRWxlbWVudDtcblxuY29uc3QgaXNIVE1MSW1hZ2VFbGVtZW50ID0gZWxlbWVudCA9PiBlbGVtZW50LnRhZ05hbWUgPT09ICdJTUcnICYmIGlzSFRNTEVsZW1lbnQoZWxlbWVudCk7XG5cbmV4cG9ydHMuaXNIVE1MSW1hZ2VFbGVtZW50ID0gaXNIVE1MSW1hZ2VFbGVtZW50O1xuXG5jb25zdCBpc0hUTUxJbnB1dEVsZW1lbnQgPSBlbGVtZW50ID0+IGVsZW1lbnQudGFnTmFtZSA9PT0gJ0lOUFVUJyAmJiBpc0hUTUxFbGVtZW50KGVsZW1lbnQpO1xuXG5leHBvcnRzLmlzSFRNTElucHV0RWxlbWVudCA9IGlzSFRNTElucHV0RWxlbWVudDtcblxuY29uc3QgaXNTVkdJbWFnZUVsZW1lbnQgPSBlbGVtZW50ID0+IGVsZW1lbnQudGFnTmFtZSA9PT0gJ2ltYWdlJyAmJiBpc1NWR0VsZW1lbnQoZWxlbWVudCk7XG5cbmV4cG9ydHMuaXNTVkdJbWFnZUVsZW1lbnQgPSBpc1NWR0ltYWdlRWxlbWVudDtcblxuY29uc3QgaXNTVkdTdHlsZUVsZW1lbnQgPSBlbGVtZW50ID0+IGVsZW1lbnQudGFnTmFtZSA9PT0gJ3N0eWxlJyAmJiBpc1NWR0VsZW1lbnQoZWxlbWVudCk7XG5cbmV4cG9ydHMuaXNTVkdTdHlsZUVsZW1lbnQgPSBpc1NWR1N0eWxlRWxlbWVudDtcblxuY29uc3QgaGFzTGFiZWxzID0gZWxlbWVudCA9PiAnbGFiZWxzJyBpbiBlbGVtZW50O1xuXG5leHBvcnRzLmhhc0xhYmVscyA9IGhhc0xhYmVscztcblxuZnVuY3Rpb24qIHRyYXZlcnNlRE9NKG5vZGUsIHNob3VsZEVudGVyID0gKCkgPT4gdHJ1ZSkge1xuICB5aWVsZCBub2RlO1xuXG4gIGlmIChzaG91bGRFbnRlcihub2RlKSkge1xuICAgIGZvciAoY29uc3QgY2hpbGROb2RlIG9mIG5vZGUuY2hpbGROb2Rlcykge1xuICAgICAgeWllbGQqIHRyYXZlcnNlRE9NKGNoaWxkTm9kZSk7XG4gICAgfVxuICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1TDNOeVl5OWtiMjB1ZEhNaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPenRCUVVGUExFMUJRVTBzV1VGQldTeEhRVUZITERSQ1FVRnlRanM3UVVGRFFTeE5RVUZOTEdOQlFXTXNSMEZCUnl3NFFrRkJka0k3TzBGQlEwRXNUVUZCVFN4alFVRmpMRWRCUVVjc09FSkJRWFpDT3pzN1FVRkZRU3hOUVVGTkxGTkJRVk1zUjBGQlNTeEpRVUZFTEVsQlFXbERMRWxCUVVrc1EwRkJReXhSUVVGTUxFdEJRV3RDTEVsQlFVa3NRMEZCUXl4WlFVRXhSVHM3T3p0QlFVTkJMRTFCUVUwc1lVRkJZU3hIUVVGSkxFOUJRVVFzU1VGQk9FTXNUMEZCVHl4RFFVRkRMRmxCUVZJc1MwRkJlVUlzWTBGQk4wWTdPenM3UVVGRFFTeE5RVUZOTEZsQlFWa3NSMEZCU1N4UFFVRkVMRWxCUVRaRExFOUJRVThzUTBGQlF5eFpRVUZTTEV0QlFYbENMRmxCUVROR096czdPMEZCUTBFc1RVRkJUU3hWUVVGVkxFZEJRVWtzU1VGQlJDeEpRVUU0UWl4SlFVRkpMRU5CUVVNc1VVRkJUQ3hMUVVGclFpeEpRVUZKTEVOQlFVTXNVMEZCZUVVN096czdRVUZEUVN4TlFVRk5MR0ZCUVdFc1IwRkJTU3hKUVVGRUxFbEJRV2xETEVsQlFVa3NRMEZCUXl4UlFVRk1MRXRCUVd0Q0xFbEJRVWtzUTBGQlF5eFpRVUU1UlRzN096dEJRVVZCTEUxQlFVMHNiVUpCUVcxQ0xFZEJRVWtzVDBGQlJDeEpRVU5zUXl4UFFVRlBMRU5CUVVNc1QwRkJVaXhMUVVGdlFpeEhRVUZ3UWl4SlFVRXlRaXhoUVVGaExFTkJRVU1zVDBGQlJDeERRVVJzUXpzN096dEJRVVZCTEUxQlFVMHNhMEpCUVd0Q0xFZEJRVWtzVDBGQlJDeEpRVU5xUXl4UFFVRlBMRU5CUVVNc1QwRkJVaXhMUVVGdlFpeFBRVUZ3UWl4SlFVRXJRaXhoUVVGaExFTkJRVU1zVDBGQlJDeERRVVIwUXpzN096dEJRVVZCTEUxQlFVMHNhMEpCUVd0Q0xFZEJRVWtzVDBGQlJDeEpRVU5xUXl4UFFVRlBMRU5CUVVNc1QwRkJVaXhMUVVGdlFpeExRVUZ3UWl4SlFVRTJRaXhoUVVGaExFTkJRVU1zVDBGQlJDeERRVVJ3UXpzN096dEJRVVZCTEUxQlFVMHNhMEpCUVd0Q0xFZEJRVWtzVDBGQlJDeEpRVU5xUXl4UFFVRlBMRU5CUVVNc1QwRkJVaXhMUVVGdlFpeFBRVUZ3UWl4SlFVRXJRaXhoUVVGaExFTkJRVU1zVDBGQlJDeERRVVIwUXpzN096dEJRVVZCTEUxQlFVMHNhVUpCUVdsQ0xFZEJRVWtzVDBGQlJDeEpRVU5vUXl4UFFVRlBMRU5CUVVNc1QwRkJVaXhMUVVGdlFpeFBRVUZ3UWl4SlFVRXJRaXhaUVVGWkxFTkJRVU1zVDBGQlJDeERRVVJ5UXpzN096dEJRVVZCTEUxQlFVMHNhVUpCUVdsQ0xFZEJRVWtzVDBGQlJDeEpRVU5vUXl4UFFVRlBMRU5CUVVNc1QwRkJVaXhMUVVGdlFpeFBRVUZ3UWl4SlFVRXJRaXhaUVVGWkxFTkJRVU1zVDBGQlJDeERRVVJ5UXpzN096dEJRVVZCTEUxQlFVMHNVMEZCVXl4SFFVRkpMRTlCUVVRc1NVRkRlRUlzV1VGQldTeFBRVVJPT3pzN08wRkJSMFFzVlVGQlZ5eFhRVUZZTEVOQlFYVkNMRWxCUVhaQ0xFVkJRVzFETEZkQlFVRXNSMEZCZFVNc1RVRkJUU3hKUVVGb1JpeEZRVUZ2Ump0QlFVTjZSaXhSUVVGTkxFbEJRVTQ3TzBGQlEwRXNUVUZCU1N4WFFVRlhMRU5CUVVNc1NVRkJSQ3hEUVVGbUxFVkJRWFZDTzBGQlEzUkNMRk5CUVVzc1RVRkJUU3hUUVVGWUxFbEJRWGRDTEVsQlFVa3NRMEZCUXl4VlFVRTNRaXhGUVVGNVF6dEJRVU40UXl4aFFVRlBMRmRCUVZjc1EwRkJReXhUUVVGRUxFTkJRV3hDTzBGQlEwRTdRVUZEUkR0QlFVTkVJaXdpYzI5MWNtTmxVbTl2ZENJNklpSjkiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuaGFuZGxlRWxlbWVudCA9IGhhbmRsZUVsZW1lbnQ7XG5cbnZhciBfZG9tID0gcmVxdWlyZShcIi4vZG9tXCIpO1xuXG52YXIgX2FjY2Vzc2liaWxpdHkgPSByZXF1aXJlKFwiLi9hY2Nlc3NpYmlsaXR5XCIpO1xuXG52YXIgX3RyYXZlcnNhbCA9IHJlcXVpcmUoXCIuL3RyYXZlcnNhbFwiKTtcblxudmFyIF9zdGFja2luZyA9IHJlcXVpcmUoXCIuL3N0YWNraW5nXCIpO1xuXG52YXIgX2NzcyA9IHJlcXVpcmUoXCIuL2Nzc1wiKTtcblxudmFyIF90ZXh0ID0gcmVxdWlyZShcIi4vdGV4dFwiKTtcblxudmFyIF91dGlsID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcblxuZnVuY3Rpb24gaGFuZGxlRWxlbWVudChlbGVtZW50LCBjb250ZXh0KSB7XG4gIGNvbnN0IGNsZWFudXBGdW5jdGlvbnMgPSBbXTtcblxuICB0cnkge1xuICAgIGNvbnN0IHdpbmRvdyA9IGVsZW1lbnQub3duZXJEb2N1bWVudC5kZWZhdWx0VmlldztcblxuICAgIGlmICghd2luZG93KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbGVtZW50J3Mgb3duZXJEb2N1bWVudCBoYXMgbm8gZGVmYXVsdFZpZXdcIik7XG4gICAgfVxuXG4gICAgY29uc3QgYm91bmRzID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTsgLy8gSW5jbHVkZXMgYm9yZGVyc1xuXG4gICAgaWYgKCEoMCwgX3V0aWwuZG9SZWN0YW5nbGVzSW50ZXJzZWN0KShib3VuZHMsIGNvbnRleHQuY2FwdHVyZUFyZWEpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG4gICAgY29uc3QgcGFyZW50U3R5bGVzID0gZWxlbWVudC5wYXJlbnRFbGVtZW50ICYmIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQucGFyZW50RWxlbWVudCk7XG4gICAgY29uc3Qgc3ZnQ29udGFpbmVyID0gKDAsIF9kb20uaXNIVE1MQW5jaG9yRWxlbWVudCkoZWxlbWVudCkgPyBjcmVhdGVTdmdBbmNob3IoZWxlbWVudCwgY29udGV4dCkgOiBjb250ZXh0LnN2Z0RvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhfZG9tLnN2Z05hbWVzcGFjZSwgJ2cnKTsgLy8gQWRkIElEcywgY2xhc3NlcywgZGVidWcgaW5mb1xuXG4gICAgc3ZnQ29udGFpbmVyLmRhdGFzZXQudGFnID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3QgaWQgPSBlbGVtZW50LmlkIHx8IChlbGVtZW50LmNsYXNzTGlzdFswXSB8fCBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSkgKyBjb250ZXh0LmdldFVuaXF1ZUlkKCk7XG4gICAgc3ZnQ29udGFpbmVyLmlkID0gaWQ7XG4gICAgY29uc3QgY2xhc3NOYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJyk7XG5cbiAgICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgICBzdmdDb250YWluZXIuc2V0QXR0cmlidXRlKCdjbGFzcycsIGNsYXNzTmFtZSk7XG4gICAgfSAvLyBXaGljaCBwYXJlbnQgc2hvdWxkIHRoZSBjb250YWluZXIgaXRzZWxmIGJlIGFwcGVuZGVkIHRvP1xuXG5cbiAgICBjb25zdCBzdGFja2luZ0xheWVyTmFtZSA9ICgwLCBfc3RhY2tpbmcuZGV0ZXJtaW5lU3RhY2tpbmdMYXllcikoc3R5bGVzLCBwYXJlbnRTdHlsZXMpO1xuICAgIGNvbnN0IHN0YWNraW5nTGF5ZXIgPSBzdGFja2luZ0xheWVyTmFtZSA/IGNvbnRleHQuc3RhY2tpbmdMYXllcnNbc3RhY2tpbmdMYXllck5hbWVdIDogY29udGV4dC5wYXJlbnRTdGFja2luZ0xheWVyO1xuXG4gICAgaWYgKHN0YWNraW5nTGF5ZXIpIHtcbiAgICAgIGNvbnRleHQuY3VycmVudFN2Z1BhcmVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtb3ducycsIFtjb250ZXh0LmN1cnJlbnRTdmdQYXJlbnQuZ2V0QXR0cmlidXRlKCdhcmlhLW93bnMnKSwgc3ZnQ29udGFpbmVyLmlkXS5maWx0ZXIoQm9vbGVhbikuam9pbignICcpKTtcbiAgICB9IC8vIElmIHRoZSBwYXJlbnQgaXMgd2l0aGluIHRoZSBzYW1lIHN0YWNraW5nIGxheWVyLCBhcHBlbmQgdG8gdGhlIHBhcmVudC5cbiAgICAvLyBPdGhlcndpc2UgYXBwZW5kIHRvIHRoZSByaWdodCBzdGFja2luZyBsYXllci5cblxuXG4gICAgY29uc3QgZWxlbWVudFRvQXBwZW5kVG8gPSBjb250ZXh0LnBhcmVudFN0YWNraW5nTGF5ZXIgPT09IHN0YWNraW5nTGF5ZXIgPyBjb250ZXh0LmN1cnJlbnRTdmdQYXJlbnQgOiBzdGFja2luZ0xheWVyO1xuICAgIHN2Z0NvbnRhaW5lci5kYXRhc2V0LnpJbmRleCA9IHN0eWxlcy56SW5kZXg7IC8vIFVzZWQgZm9yIHNvcnRpbmdcblxuICAgIGVsZW1lbnRUb0FwcGVuZFRvLmFwcGVuZChzdmdDb250YWluZXIpOyAvLyBJZiB0aGUgZWxlbWVudCBlc3RhYmxpc2hlcyBhIHN0YWNraW5nIGNvbnRleHQsIGNyZWF0ZSBzdWJncm91cHMgZm9yIGVhY2ggc3RhY2tpbmcgbGF5ZXIuXG5cbiAgICBsZXQgY2hpbGRDb250ZXh0O1xuICAgIGxldCBiYWNrZ3JvdW5kQ29udGFpbmVyO1xuICAgIGxldCBvd25TdGFja2luZ0xheWVycztcblxuICAgIGlmICgoMCwgX3N0YWNraW5nLmVzdGFibGlzaGVzU3RhY2tpbmdDb250ZXh0KShzdHlsZXMsIHBhcmVudFN0eWxlcykpIHtcbiAgICAgIG93blN0YWNraW5nTGF5ZXJzID0gKDAsIF9zdGFja2luZy5jcmVhdGVTdGFja2luZ0xheWVycykoc3ZnQ29udGFpbmVyKTtcbiAgICAgIGJhY2tncm91bmRDb250YWluZXIgPSBvd25TdGFja2luZ0xheWVycy5yb290QmFja2dyb3VuZEFuZEJvcmRlcnM7XG4gICAgICBjaGlsZENvbnRleHQgPSB7IC4uLmNvbnRleHQsXG4gICAgICAgIGN1cnJlbnRTdmdQYXJlbnQ6IHN2Z0NvbnRhaW5lcixcbiAgICAgICAgc3RhY2tpbmdMYXllcnM6IG93blN0YWNraW5nTGF5ZXJzLFxuICAgICAgICBwYXJlbnRTdGFja2luZ0xheWVyOiBzdGFja2luZ0xheWVyXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBiYWNrZ3JvdW5kQ29udGFpbmVyID0gc3ZnQ29udGFpbmVyO1xuICAgICAgY2hpbGRDb250ZXh0ID0geyAuLi5jb250ZXh0LFxuICAgICAgICBjdXJyZW50U3ZnUGFyZW50OiBzdmdDb250YWluZXIsXG4gICAgICAgIHBhcmVudFN0YWNraW5nTGF5ZXI6IHN0YWNraW5nTGF5ZXJcbiAgICAgIH07XG4gICAgfSAvLyBBY2Nlc3NpYmlsaXR5XG5cblxuICAgIGZvciAoY29uc3QgW25hbWUsIHZhbHVlXSBvZiAoMCwgX2FjY2Vzc2liaWxpdHkuZ2V0QWNjZXNzaWJpbGl0eUF0dHJpYnV0ZXMpKGVsZW1lbnQsIGNvbnRleHQpKSB7XG4gICAgICBzdmdDb250YWluZXIuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBjb25zdCBoYW5kbGVQc2V1ZG9FbGVtZW50ID0gKHBzZXVkb1NlbGVjdG9yLCBwb3NpdGlvbikgPT4ge1xuICAgICAgY29uc3QgcHNldWRvRWxlbWVudFN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIHBzZXVkb1NlbGVjdG9yKTtcblxuICAgICAgaWYgKHBzZXVkb0VsZW1lbnRTdHlsZXMuY29udGVudCAhPT0gJ25vbmUnKSB7XG4gICAgICAgIC8vIFBzZXVkbyBlbGVtZW50cyBhcmUgaW5saW5lIGJ5IGRlZmF1bHQgKGxpa2UgYSBzcGFuKVxuICAgICAgICBjb25zdCBzcGFuID0gZWxlbWVudC5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgKDAsIF9jc3MuY29weUNzc1N0eWxlcykocHNldWRvRWxlbWVudFN0eWxlcywgc3Bhbi5zdHlsZSk7XG4gICAgICAgIHNwYW4udGV4dENvbnRlbnQgPSAoMCwgX2Nzcy5wYXJzZUNzc1N0cmluZykocHNldWRvRWxlbWVudFN0eWxlcy5jb250ZW50KTtcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgc3R5bGUuaW5uZXJIVE1MID0gYCMke2lkfSR7cHNldWRvU2VsZWN0b3J9IHsgZGlzcGxheTogbm9uZTsgfWA7XG4gICAgICAgIGVsZW1lbnQuYmVmb3JlKHN0eWxlKTtcbiAgICAgICAgY2xlYW51cEZ1bmN0aW9ucy5wdXNoKCgpID0+IHN0eWxlLnJlbW92ZSgpKTtcbiAgICAgICAgZWxlbWVudFtwb3NpdGlvbl0oc3Bhbik7XG4gICAgICAgIGNsZWFudXBGdW5jdGlvbnMucHVzaCgoKSA9PiBzcGFuLnJlbW92ZSgpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaGFuZGxlUHNldWRvRWxlbWVudCgnOjpiZWZvcmUnLCAncHJlcGVuZCcpO1xuICAgIGhhbmRsZVBzZXVkb0VsZW1lbnQoJzo6YWZ0ZXInLCAnYXBwZW5kJyk7IC8vIFRPRE8gaGFuZGxlIDo6bWFya2VyIGV0Y1xuXG4gICAgYWRkQmFja2dyb3VuZEFuZEJvcmRlcnMoc3R5bGVzLCBib3VuZHMsIGJhY2tncm91bmRDb250YWluZXIsIHdpbmRvdywgY29udGV4dCk7IC8vIElmIGVsZW1lbnQgaXMgb3ZlcmZsb3c6IGhpZGRlbiwgY3JlYXRlIGEgY2xpcHBpbmcgcmVjdGFuZ2xlIHRvIGhpZGUgYW55IG92ZXJmbG93aW5nIGNvbnRlbnQgb2YgYW55IGRlc2NlbmRhbnRzXG5cbiAgICBsZXQgY2xpcFBhdGg7XG5cbiAgICBpZiAoc3R5bGVzLm92ZXJmbG93ICE9PSAndmlzaWJsZScpIHtcbiAgICAgIGNsaXBQYXRoID0gY29udGV4dC5zdmdEb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoX2RvbS5zdmdOYW1lc3BhY2UsICdjbGlwUGF0aCcpO1xuICAgICAgY2xpcFBhdGguaWQgPSAnY2xpcFBhdGgnICsgY29udGV4dC5nZXRVbmlxdWVJZCgpO1xuICAgICAgY2xpcFBhdGguYXBwZW5kKGNyZWF0ZUJveChib3VuZHMsIGNvbnRleHQpKTtcbiAgICAgIHN2Z0NvbnRhaW5lci5iZWZvcmUoY2xpcFBhdGgpO1xuICAgICAgc3ZnQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnY2xpcC1wYXRoJywgYHVybCgjJHtjbGlwUGF0aC5pZH0pYCk7XG4gICAgfVxuXG4gICAgaWYgKCgwLCBfZG9tLmlzSFRNTEltYWdlRWxlbWVudCkoZWxlbWVudCkpIHtcbiAgICAgIHZhciBfcGFyc2VDU1NMZW5ndGgsIF9wYXJzZUNTU0xlbmd0aDIsIF9wYXJzZUNTU0xlbmd0aDMsIF9wYXJzZUNTU0xlbmd0aDQ7XG5cbiAgICAgIGNvbnN0IHN2Z0ltYWdlID0gY29udGV4dC5zdmdEb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoX2RvbS5zdmdOYW1lc3BhY2UsICdpbWFnZScpO1xuICAgICAgc3ZnSW1hZ2Uuc2V0QXR0cmlidXRlKCdocmVmJywgZWxlbWVudC5zcmMpO1xuICAgICAgY29uc3QgcGFkZGluZ0xlZnQgPSAoX3BhcnNlQ1NTTGVuZ3RoID0gKDAsIF9jc3MucGFyc2VDU1NMZW5ndGgpKHN0eWxlcy5wYWRkaW5nTGVmdCwgYm91bmRzLndpZHRoKSkgIT09IG51bGwgJiYgX3BhcnNlQ1NTTGVuZ3RoICE9PSB2b2lkIDAgPyBfcGFyc2VDU1NMZW5ndGggOiAwO1xuICAgICAgY29uc3QgcGFkZGluZ1JpZ2h0ID0gKF9wYXJzZUNTU0xlbmd0aDIgPSAoMCwgX2Nzcy5wYXJzZUNTU0xlbmd0aCkoc3R5bGVzLnBhZGRpbmdSaWdodCwgYm91bmRzLndpZHRoKSkgIT09IG51bGwgJiYgX3BhcnNlQ1NTTGVuZ3RoMiAhPT0gdm9pZCAwID8gX3BhcnNlQ1NTTGVuZ3RoMiA6IDA7XG4gICAgICBjb25zdCBwYWRkaW5nVG9wID0gKF9wYXJzZUNTU0xlbmd0aDMgPSAoMCwgX2Nzcy5wYXJzZUNTU0xlbmd0aCkoc3R5bGVzLnBhZGRpbmdUb3AsIGJvdW5kcy5oZWlnaHQpKSAhPT0gbnVsbCAmJiBfcGFyc2VDU1NMZW5ndGgzICE9PSB2b2lkIDAgPyBfcGFyc2VDU1NMZW5ndGgzIDogMDtcbiAgICAgIGNvbnN0IHBhZGRpbmdCb3R0b20gPSAoX3BhcnNlQ1NTTGVuZ3RoNCA9ICgwLCBfY3NzLnBhcnNlQ1NTTGVuZ3RoKShzdHlsZXMucGFkZGluZ0JvdHRvbSwgYm91bmRzLmhlaWdodCkpICE9PSBudWxsICYmIF9wYXJzZUNTU0xlbmd0aDQgIT09IHZvaWQgMCA/IF9wYXJzZUNTU0xlbmd0aDQgOiAwO1xuICAgICAgc3ZnSW1hZ2Uuc2V0QXR0cmlidXRlKCd4JywgKGJvdW5kcy54ICsgcGFkZGluZ0xlZnQpLnRvU3RyaW5nKCkpO1xuICAgICAgc3ZnSW1hZ2Uuc2V0QXR0cmlidXRlKCd5JywgKGJvdW5kcy55ICsgcGFkZGluZ1RvcCkudG9TdHJpbmcoKSk7XG4gICAgICBzdmdJbWFnZS5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgKGJvdW5kcy53aWR0aCAtIHBhZGRpbmdMZWZ0IC0gcGFkZGluZ1JpZ2h0KS50b1N0cmluZygpKTtcbiAgICAgIHN2Z0ltYWdlLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgKGJvdW5kcy5oZWlnaHQgLSBwYWRkaW5nVG9wIC0gcGFkZGluZ0JvdHRvbSkudG9TdHJpbmcoKSk7XG5cbiAgICAgIGlmIChlbGVtZW50LmFsdCkge1xuICAgICAgICBzdmdJbWFnZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBlbGVtZW50LmFsdCk7XG4gICAgICB9XG5cbiAgICAgIHN2Z0NvbnRhaW5lci5hcHBlbmQoc3ZnSW1hZ2UpO1xuICAgIH0gZWxzZSBpZiAoKDAsIF9kb20uaXNIVE1MSW5wdXRFbGVtZW50KShlbGVtZW50KSAmJiBib3VuZHMud2lkdGggPiAwICYmIGJvdW5kcy5oZWlnaHQgPiAwKSB7XG4gICAgICAvLyBIYW5kbGUgYnV0dG9uIGxhYmVscyBvciBpbnB1dCBmaWVsZCBjb250ZW50XG4gICAgICBpZiAoZWxlbWVudC52YWx1ZSkge1xuICAgICAgICB2YXIgX3BhcnNlQ1NTTGVuZ3RoNSwgX3BhcnNlQ1NTTGVuZ3RoNiwgX3BhcnNlQ1NTTGVuZ3RoNztcblxuICAgICAgICBjb25zdCBzdmdUZXh0RWxlbWVudCA9IGNvbnRleHQuc3ZnRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKF9kb20uc3ZnTmFtZXNwYWNlLCAndGV4dCcpO1xuICAgICAgICBzdmdUZXh0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RvbWluYW50LWJhc2VsaW5lJywgJ2NlbnRyYWwnKTtcbiAgICAgICAgc3ZnVGV4dEVsZW1lbnQuc2V0QXR0cmlidXRlKCd4bWw6c3BhY2UnLCAncHJlc2VydmUnKTtcbiAgICAgICAgc3ZnVGV4dEVsZW1lbnQuc2V0QXR0cmlidXRlKCd4JywgKGJvdW5kcy54ICsgKChfcGFyc2VDU1NMZW5ndGg1ID0gKDAsIF9jc3MucGFyc2VDU1NMZW5ndGgpKHN0eWxlcy5wYWRkaW5nTGVmdCwgYm91bmRzLndpZHRoKSkgIT09IG51bGwgJiYgX3BhcnNlQ1NTTGVuZ3RoNSAhPT0gdm9pZCAwID8gX3BhcnNlQ1NTTGVuZ3RoNSA6IDApKS50b1N0cmluZygpKTtcbiAgICAgICAgY29uc3QgdG9wID0gYm91bmRzLnRvcCArICgoX3BhcnNlQ1NTTGVuZ3RoNiA9ICgwLCBfY3NzLnBhcnNlQ1NTTGVuZ3RoKShzdHlsZXMucGFkZGluZ1RvcCwgYm91bmRzLmhlaWdodCkpICE9PSBudWxsICYmIF9wYXJzZUNTU0xlbmd0aDYgIT09IHZvaWQgMCA/IF9wYXJzZUNTU0xlbmd0aDYgOiAwKTtcbiAgICAgICAgY29uc3QgYm90dG9tID0gYm91bmRzLmJvdHRvbSArICgoX3BhcnNlQ1NTTGVuZ3RoNyA9ICgwLCBfY3NzLnBhcnNlQ1NTTGVuZ3RoKShzdHlsZXMucGFkZGluZ0JvdHRvbSwgYm91bmRzLmhlaWdodCkpICE9PSBudWxsICYmIF9wYXJzZUNTU0xlbmd0aDcgIT09IHZvaWQgMCA/IF9wYXJzZUNTU0xlbmd0aDcgOiAwKTtcbiAgICAgICAgY29uc3QgbWlkZGxlID0gKHRvcCArIGJvdHRvbSkgLyAyO1xuICAgICAgICBzdmdUZXh0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3knLCBtaWRkbGUudG9TdHJpbmcoKSk7XG4gICAgICAgIHN2Z1RleHRFbGVtZW50LnRleHRDb250ZW50ID0gZWxlbWVudC52YWx1ZTtcbiAgICAgICAgKDAsIF90ZXh0LmFzc2lnblRleHRTdHlsZXMpKHN0eWxlcywgc3ZnVGV4dEVsZW1lbnQpO1xuICAgICAgICBjaGlsZENvbnRleHQuc3RhY2tpbmdMYXllcnMuaW5GbG93SW5saW5lTGV2ZWxOb25Qb3NpdGlvbmVkRGVzY2VuZGFudHMuYXBwZW5kKHN2Z1RleHRFbGVtZW50KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGVsZW1lbnQudGFnTmFtZSA9PT0gJ3N2ZycpIHtcbiAgICAgIC8vIEVtYmVkIFNWRywgZG9uJ3QgdHJhdmVyc2UgY29udGVudHNcbiAgICAgIC8vIFRPRE8gd2FsayBjb250ZW50cyB0byBpbmxpbmUgcmVzb3VyY2VzXG4gICAgICBjb25zdCBjbG9uZWRTdmcgPSBlbGVtZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgICAgIGNsb25lZFN2Zy5zZXRBdHRyaWJ1dGUoJ3gnLCBib3VuZHMueC50b1N0cmluZygpKTtcbiAgICAgIGNsb25lZFN2Zy5zZXRBdHRyaWJ1dGUoJ3knLCBib3VuZHMueS50b1N0cmluZygpKTtcbiAgICAgIGNsb25lZFN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgYm91bmRzLndpZHRoLnRvU3RyaW5nKCkpO1xuICAgICAgY2xvbmVkU3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgYm91bmRzLmhlaWdodC50b1N0cmluZygpKTtcbiAgICAgIGNsb25lZFN2Zy5zdHlsZS5jb2xvciA9IHN0eWxlcy5jb2xvcjsgLy8gaGFuZGxlIGZpbGwgb3Igc3Ryb2tlIHJlZmVyZW5jaW5nIGN1cnJlbnRDb2xvciBrZXl3b3JkXG5cbiAgICAgIGVsZW1lbnRUb0FwcGVuZFRvLmFwcGVuZChjbG9uZWRTdmcpO1xuICAgIH0gZWxzZSBpZiAoZWxlbWVudC50YWdOYW1lICE9PSAnSUZSQU1FJykge1xuICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBlbGVtZW50LmNoaWxkTm9kZXMpIHtcbiAgICAgICAgKDAsIF90cmF2ZXJzYWwud2Fsa05vZGUpKGNoaWxkLCBjaGlsZENvbnRleHQpO1xuICAgICAgfVxuXG4gICAgICBpZiAob3duU3RhY2tpbmdMYXllcnMpIHtcbiAgICAgICAgKDAsIF9zdGFja2luZy5zb3J0U3RhY2tpbmdMYXllckNoaWxkcmVuKShvd25TdGFja2luZ0xheWVycyk7XG4gICAgICB9XG4gICAgfVxuICB9IGZpbmFsbHkge1xuICAgIGZvciAoY29uc3QgY2xlYW51cCBvZiBjbGVhbnVwRnVuY3Rpb25zKSB7XG4gICAgICBjbGVhbnVwKCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGFkZEJhY2tncm91bmRBbmRCb3JkZXJzKHN0eWxlcywgYm91bmRzLCBiYWNrZ3JvdW5kQW5kQm9yZGVyc0NvbnRhaW5lciwgd2luZG93LCBjb250ZXh0KSB7XG4gIGlmICgoMCwgX2Nzcy5pc1Zpc2libGUpKHN0eWxlcykpIHtcbiAgICBpZiAoYm91bmRzLndpZHRoID4gMCAmJiBib3VuZHMuaGVpZ2h0ID4gMCAmJiAoISgwLCBfY3NzLmlzVHJhbnNwYXJlbnQpKHN0eWxlcy5iYWNrZ3JvdW5kQ29sb3IpIHx8ICgwLCBfY3NzLmhhc1VuaWZvcm1Cb3JkZXIpKHN0eWxlcykgfHwgc3R5bGVzLmJhY2tncm91bmRJbWFnZSAhPT0gJ25vbmUnKSkge1xuICAgICAgY29uc3QgYm94ID0gY3JlYXRlQmFja2dyb3VuZEFuZEJvcmRlckJveChib3VuZHMsIHN0eWxlcywgY29udGV4dCk7XG4gICAgICBiYWNrZ3JvdW5kQW5kQm9yZGVyc0NvbnRhaW5lci5hcHBlbmQoYm94KTsgLy8gVE9ETyBoYW5kbGUgbGluZWFyLWdyYWRpZW50KCkgYW5kIG11bHRpcGxlIChzdGFja2VkKSBiYWNrZ3JvdW5kc1xuXG4gICAgICBpZiAoc3R5bGVzLmJhY2tncm91bmRJbWFnZSAhPT0gJ25vbmUnICYmIHN0eWxlcy5iYWNrZ3JvdW5kSW1hZ2UudHJpbSgpLnN0YXJ0c1dpdGgoJ3VybCgnKSkge1xuICAgICAgICBjb25zdCBpbWFnZSA9IGNvbnRleHQuc3ZnRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKF9kb20uc3ZnTmFtZXNwYWNlLCAnaW1hZ2UnKTtcbiAgICAgICAgY29uc3QgW3dpZHRoLCBoZWlnaHQgPSAnYXV0byddID0gc3R5bGVzLmJhY2tncm91bmRTaXplLnNwbGl0KCcgJyk7XG4gICAgICAgIGltYWdlLnNldEF0dHJpYnV0ZSgneCcsIGJvdW5kcy54LnRvU3RyaW5nKCkpO1xuICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ3knLCBib3VuZHMueS50b1N0cmluZygpKTtcbiAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCd3aWR0aCcsIGdldEJhY2tncm91bmRTaXplRGltZW5zaW9uKHdpZHRoLCBib3VuZHMud2lkdGgpLnRvU3RyaW5nKCkpO1xuICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIGdldEJhY2tncm91bmRTaXplRGltZW5zaW9uKGhlaWdodCwgYm91bmRzLmhlaWdodCkudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgaWYgKHdpZHRoICE9PSAnYXV0bycgJiYgaGVpZ2h0ICE9PSAnYXV0bycpIHtcbiAgICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAnbm9uZScpO1xuICAgICAgICB9IGVsc2UgaWYgKHN0eWxlcy5iYWNrZ3JvdW5kU2l6ZSA9PT0gJ2NvbnRhaW4nKSB7XG4gICAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWlkIG1lZXQnKTtcbiAgICAgICAgfSBlbHNlIGlmIChzdHlsZXMuYmFja2dyb3VuZFNpemUgPT09ICdjb3ZlcicpIHtcbiAgICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQgc2xpY2UnKTtcbiAgICAgICAgfSAvLyBUZWNobmljYWxseSBub3QgY29ycmVjdCwgYmVjYXVzZSByZWxhdGl2ZSBVUkxzIHNob3VsZCBiZSByZXNvbHZlZCByZWxhdGl2ZSB0byB0aGUgc3R5bGVzaGVldCxcbiAgICAgICAgLy8gbm90IHRoZSBwYWdlLiBCdXQgd2UgaGF2ZSBubyBtZWFucyB0byBrbm93IHdoYXQgc3R5bGVzaGVldCB0aGUgc3R5bGUgY2FtZSBmcm9tLlxuXG5cbiAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTCgoMCwgX2Nzcy5wYXJzZVVybFJlZmVyZW5jZSkoc3R5bGVzLmJhY2tncm91bmRJbWFnZSksIHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdocmVmJywgdXJsLmhyZWYpO1xuXG4gICAgICAgIGlmIChzdHlsZXMuYmFja2dyb3VuZFJlcGVhdCA9PT0gJ25vLXJlcGVhdCcpIHtcbiAgICAgICAgICBiYWNrZ3JvdW5kQW5kQm9yZGVyc0NvbnRhaW5lci5hcHBlbmQoaW1hZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHBhdHRlcm4gPSBjb250ZXh0LnN2Z0RvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhfZG9tLnN2Z05hbWVzcGFjZSwgJ3BhdHRlcm4nKTtcbiAgICAgICAgICBwYXR0ZXJuLnNldEF0dHJpYnV0ZSgncGF0dGVyblVuaXRzJywgJ3VzZXJTcGFjZU9uVXNlJyk7XG4gICAgICAgICAgcGF0dGVybi5pZCA9ICdwYXR0ZXJuJyArIGNvbnRleHQuZ2V0VW5pcXVlSWQoKTtcbiAgICAgICAgICBwYXR0ZXJuLmFwcGVuZChpbWFnZSk7XG4gICAgICAgICAgYm94LmJlZm9yZShwYXR0ZXJuKTtcbiAgICAgICAgICBib3guc2V0QXR0cmlidXRlKCdmaWxsJywgYHVybCgjJHtwYXR0ZXJuLmlkfSlgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghKDAsIF9jc3MuaGFzVW5pZm9ybUJvcmRlcikoc3R5bGVzKSkge1xuICAgICAgLy8gRHJhdyBsaW5lcyBmb3IgZWFjaCBib3JkZXJcbiAgICAgIGZvciAoY29uc3QgYm9yZGVyTGluZSBvZiBjcmVhdGVCb3JkZXJzKHN0eWxlcywgYm91bmRzLCBjb250ZXh0KSkge1xuICAgICAgICBiYWNrZ3JvdW5kQW5kQm9yZGVyc0NvbnRhaW5lci5hcHBlbmQoYm9yZGVyTGluZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldEJhY2tncm91bmRTaXplRGltZW5zaW9uKHNpemUsIGVsZW1lbnRTaXplKSB7XG4gIGlmIChzaXplID09PSAnYXV0bycpIHtcbiAgICAvLyBMZXQgcHJlc2VydmVBc3BlY3RSYXRpbyBoYW5kbGUgc2NhbGluZ1xuICAgIHJldHVybiBlbGVtZW50U2l6ZTtcbiAgfVxuXG4gIGlmIChzaXplLmVuZHNXaXRoKCdweCcpKSB7XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQoc2l6ZSk7XG4gIH1cblxuICBpZiAoc2l6ZS5lbmRzV2l0aCgnJScpKSB7XG4gICAgLy8gVE9ETyB0aGlzIG5lZWRzIHRvIGFjY291bnQgZm9yIHBhZGRpbmcgKGV4Y2VwdCBpZiBiYWNrZ3JvdW5kLW9yaWdpbiBpcyBzZXQpXG4gICAgcmV0dXJuIHBhcnNlRmxvYXQoc2l6ZSkgLyAxMDAgKiBlbGVtZW50U2l6ZTtcbiAgfSAvLyBGYWxsYmFja1xuXG5cbiAgY29uc29sZS53YXJuKCdVbmtub3duIGJhY2tncm91bmQtc2l6ZSB2YWx1ZScsIHNpemUpO1xuICByZXR1cm4gZWxlbWVudFNpemU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJveChib3VuZHMsIGNvbnRleHQpIHtcbiAgY29uc3QgYm94ID0gY29udGV4dC5zdmdEb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoX2RvbS5zdmdOYW1lc3BhY2UsICdyZWN0Jyk7IC8vIFRPRE8gY29uc2lkZXIgcm90YXRpb25cblxuICBib3guc2V0QXR0cmlidXRlKCd3aWR0aCcsIGJvdW5kcy53aWR0aC50b1N0cmluZygpKTtcbiAgYm94LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgYm91bmRzLmhlaWdodC50b1N0cmluZygpKTtcbiAgYm94LnNldEF0dHJpYnV0ZSgneCcsIGJvdW5kcy54LnRvU3RyaW5nKCkpO1xuICBib3guc2V0QXR0cmlidXRlKCd5JywgYm91bmRzLnkudG9TdHJpbmcoKSk7XG4gIHJldHVybiBib3g7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJhY2tncm91bmRBbmRCb3JkZXJCb3goYm91bmRzLCBzdHlsZXMsIGNvbnRleHQpIHtcbiAgY29uc3QgYmFja2dyb3VuZCA9IGNyZWF0ZUJveChib3VuZHMsIGNvbnRleHQpOyAvLyBUT0RPIGhhbmRsZSBiYWNrZ3JvdW5kIGltYWdlIGFuZCBvdGhlciBwcm9wZXJ0aWVzXG5cbiAgaWYgKHN0eWxlcy5iYWNrZ3JvdW5kQ29sb3IpIHtcbiAgICBiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZSgnZmlsbCcsIHN0eWxlcy5iYWNrZ3JvdW5kQ29sb3IpO1xuICB9XG5cbiAgaWYgKCgwLCBfY3NzLmhhc1VuaWZvcm1Cb3JkZXIpKHN0eWxlcykpIHtcbiAgICAvLyBVbmlmb3JtIGJvcmRlciwgdXNlIHN0cm9rZVxuICAgIGJhY2tncm91bmQuc2V0QXR0cmlidXRlKCdzdHJva2UnLCBzdHlsZXMuYm9yZGVyQ29sb3IpO1xuICAgIGJhY2tncm91bmQuc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCBzdHlsZXMuYm9yZGVyV2lkdGgpO1xuXG4gICAgaWYgKHN0eWxlcy5ib3JkZXJTdHlsZSA9PT0gJ2Rhc2hlZCcpIHtcbiAgICAgIC8vID4gRGlzcGxheXMgYSBzZXJpZXMgb2Ygc2hvcnQgc3F1YXJlLWVuZGVkIGRhc2hlcyBvciBsaW5lIHNlZ21lbnRzLlxuICAgICAgLy8gPiBUaGUgZXhhY3Qgc2l6ZSBhbmQgbGVuZ3RoIG9mIHRoZSBzZWdtZW50cyBhcmUgbm90IGRlZmluZWQgYnkgdGhlIHNwZWNpZmljYXRpb24gYW5kIGFyZSBpbXBsZW1lbnRhdGlvbi1zcGVjaWZpYy5cbiAgICAgIGJhY2tncm91bmQuc2V0QXR0cmlidXRlKCdzdHJva2UtZGFzaGFycmF5JywgJzEnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoKDAsIF9jc3MuaGFzVW5pZm9ybUJvcmRlclJhZGl1cykoc3R5bGVzKSkge1xuICAgIGJhY2tncm91bmQuc2V0QXR0cmlidXRlKCdyeCcsIHN0eWxlcy5ib3JkZXJSYWRpdXMpO1xuICAgIGJhY2tncm91bmQuc2V0QXR0cmlidXRlKCdyeScsIHN0eWxlcy5ib3JkZXJSYWRpdXMpO1xuICB9XG5cbiAgcmV0dXJuIGJhY2tncm91bmQ7XG59XG5cbmZ1bmN0aW9uKiBjcmVhdGVCb3JkZXJzKHN0eWxlcywgYm91bmRzLCBjb250ZXh0KSB7XG4gIGZvciAoY29uc3Qgc2lkZSBvZiBbJ3RvcCcsICdib3R0b20nLCAncmlnaHQnLCAnbGVmdCddKSB7XG4gICAgaWYgKGhhc0JvcmRlcihzdHlsZXMsIHNpZGUpKSB7XG4gICAgICB5aWVsZCBjcmVhdGVCb3JkZXIoc3R5bGVzLCBib3VuZHMsIHNpZGUsIGNvbnRleHQpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBoYXNCb3JkZXIoc3R5bGVzLCBzaWRlKSB7XG4gIHJldHVybiAhIXN0eWxlcy5nZXRQcm9wZXJ0eVZhbHVlKGBib3JkZXItJHtzaWRlfS1jb2xvcmApICYmICEoMCwgX2Nzcy5pc1RyYW5zcGFyZW50KShzdHlsZXMuZ2V0UHJvcGVydHlWYWx1ZShgYm9yZGVyLSR7c2lkZX0tY29sb3JgKSkgJiYgc3R5bGVzLmdldFByb3BlcnR5VmFsdWUoYGJvcmRlci0ke3NpZGV9LXdpZHRoYCkgIT09ICcwcHgnO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVCb3JkZXIoc3R5bGVzLCBib3VuZHMsIHNpZGUsIGNvbnRleHQpIHtcbiAgLy8gVE9ETyBoYW5kbGUgYm9yZGVyLXJhZGl1cyBmb3Igbm9uLXVuaWZvcm0gYm9yZGVyc1xuICBjb25zdCBib3JkZXIgPSBjb250ZXh0LnN2Z0RvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhfZG9tLnN2Z05hbWVzcGFjZSwgJ2xpbmUnKTtcbiAgYm9yZGVyLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLWxpbmVjYXAnLCAnc3F1YXJlJyk7XG4gIGNvbnN0IGNvbG9yID0gc3R5bGVzLmdldFByb3BlcnR5VmFsdWUoYGJvcmRlci0ke3NpZGV9LWNvbG9yYCk7XG4gIGJvcmRlci5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsIGNvbG9yKTtcbiAgYm9yZGVyLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgc3R5bGVzLmdldFByb3BlcnR5VmFsdWUoYGJvcmRlci0ke3NpZGV9LXdpZHRoYCkpOyAvLyBIYW5kbGUgaW5zZXQvb3V0c2V0IGJvcmRlcnNcblxuICBjb25zdCBib3JkZXJTdHlsZSA9IHN0eWxlcy5nZXRQcm9wZXJ0eVZhbHVlKGBib3JkZXItJHtzaWRlfS1zdHlsZWApO1xuXG4gIGlmIChib3JkZXJTdHlsZSA9PT0gJ2luc2V0JyAmJiAoc2lkZSA9PT0gJ3RvcCcgfHwgc2lkZSA9PT0gJ2xlZnQnKSB8fCBib3JkZXJTdHlsZSA9PT0gJ291dHNldCcgJiYgKHNpZGUgPT09ICdyaWdodCcgfHwgc2lkZSA9PT0gJ2JvdHRvbScpKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBjb2xvci5tYXRjaCgvcmdiYT9cXCgoXFxkKyksIChcXGQrKSwgKFxcZCspKD86LCAoW1xcZC5dKykpP1xcKS8pO1xuXG4gICAgaWYgKCFtYXRjaCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmV4cGVjdGVkIGNvbG9yOiAke2NvbG9yfWApO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbXBvbmVudHMgPSBtYXRjaC5zbGljZSgxLCA0KS5tYXAodmFsdWUgPT4gcGFyc2VJbnQodmFsdWUsIDEwKSAqIDAuMyk7XG5cbiAgICBpZiAobWF0Y2hbNF0pIHtcbiAgICAgIGNvbXBvbmVudHMucHVzaChwYXJzZUZsb2F0KG1hdGNoWzRdKSk7XG4gICAgfSAvLyBMb3ctbGlnaHQgYm9yZGVyXG4gICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDE0Nzk0MC9ob3ctZG8tYnJvd3NlcnMtZGV0ZXJtaW5lLXdoaWNoLWV4YWN0LWNvbG9ycy10by11c2UtZm9yLWJvcmRlci1pbnNldC1vci1vdXRzZXRcblxuXG4gICAgYm9yZGVyLnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgYHJnYmEoJHtjb21wb25lbnRzLmpvaW4oJywgJyl9KWApO1xuICB9XG5cbiAgaWYgKHNpZGUgPT09ICd0b3AnKSB7XG4gICAgYm9yZGVyLnNldEF0dHJpYnV0ZSgneDEnLCBib3VuZHMubGVmdC50b1N0cmluZygpKTtcbiAgICBib3JkZXIuc2V0QXR0cmlidXRlKCd4MicsIGJvdW5kcy5yaWdodC50b1N0cmluZygpKTtcbiAgICBib3JkZXIuc2V0QXR0cmlidXRlKCd5MScsIGJvdW5kcy50b3AudG9TdHJpbmcoKSk7XG4gICAgYm9yZGVyLnNldEF0dHJpYnV0ZSgneTInLCBib3VuZHMudG9wLnRvU3RyaW5nKCkpO1xuICB9IGVsc2UgaWYgKHNpZGUgPT09ICdsZWZ0Jykge1xuICAgIGJvcmRlci5zZXRBdHRyaWJ1dGUoJ3gxJywgYm91bmRzLmxlZnQudG9TdHJpbmcoKSk7XG4gICAgYm9yZGVyLnNldEF0dHJpYnV0ZSgneDInLCBib3VuZHMubGVmdC50b1N0cmluZygpKTtcbiAgICBib3JkZXIuc2V0QXR0cmlidXRlKCd5MScsIGJvdW5kcy50b3AudG9TdHJpbmcoKSk7XG4gICAgYm9yZGVyLnNldEF0dHJpYnV0ZSgneTInLCBib3VuZHMuYm90dG9tLnRvU3RyaW5nKCkpO1xuICB9IGVsc2UgaWYgKHNpZGUgPT09ICdyaWdodCcpIHtcbiAgICBib3JkZXIuc2V0QXR0cmlidXRlKCd4MScsIGJvdW5kcy5yaWdodC50b1N0cmluZygpKTtcbiAgICBib3JkZXIuc2V0QXR0cmlidXRlKCd4MicsIGJvdW5kcy5yaWdodC50b1N0cmluZygpKTtcbiAgICBib3JkZXIuc2V0QXR0cmlidXRlKCd5MScsIGJvdW5kcy50b3AudG9TdHJpbmcoKSk7XG4gICAgYm9yZGVyLnNldEF0dHJpYnV0ZSgneTInLCBib3VuZHMuYm90dG9tLnRvU3RyaW5nKCkpO1xuICB9IGVsc2UgaWYgKHNpZGUgPT09ICdib3R0b20nKSB7XG4gICAgYm9yZGVyLnNldEF0dHJpYnV0ZSgneDEnLCBib3VuZHMubGVmdC50b1N0cmluZygpKTtcbiAgICBib3JkZXIuc2V0QXR0cmlidXRlKCd4MicsIGJvdW5kcy5yaWdodC50b1N0cmluZygpKTtcbiAgICBib3JkZXIuc2V0QXR0cmlidXRlKCd5MScsIGJvdW5kcy5ib3R0b20udG9TdHJpbmcoKSk7XG4gICAgYm9yZGVyLnNldEF0dHJpYnV0ZSgneTInLCBib3VuZHMuYm90dG9tLnRvU3RyaW5nKCkpO1xuICB9XG5cbiAgcmV0dXJuIGJvcmRlcjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlU3ZnQW5jaG9yKGVsZW1lbnQsIGNvbnRleHQpIHtcbiAgY29uc3Qgc3ZnQW5jaG9yID0gY29udGV4dC5zdmdEb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoX2RvbS5zdmdOYW1lc3BhY2UsICdhJyk7XG5cbiAgaWYgKGVsZW1lbnQuaHJlZiAmJiAhZWxlbWVudC5ocmVmLnN0YXJ0c1dpdGgoJ2phdmFzY3JpcHQ6JykpIHtcbiAgICBzdmdBbmNob3Iuc2V0QXR0cmlidXRlKCdocmVmJywgZWxlbWVudC5ocmVmKTtcbiAgfVxuXG4gIGlmIChlbGVtZW50LnJlbCkge1xuICAgIHN2Z0FuY2hvci5zZXRBdHRyaWJ1dGUoJ3JlbCcsIGVsZW1lbnQucmVsKTtcbiAgfVxuXG4gIGlmIChlbGVtZW50LnRhcmdldCkge1xuICAgIHN2Z0FuY2hvci5zZXRBdHRyaWJ1dGUoJ3RhcmdldCcsIGVsZW1lbnQudGFyZ2V0KTtcbiAgfVxuXG4gIGlmIChlbGVtZW50LmRvd25sb2FkKSB7XG4gICAgc3ZnQW5jaG9yLnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBlbGVtZW50LmRvd25sb2FkKTtcbiAgfVxuXG4gIHJldHVybiBzdmdBbmNob3I7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1TDNOeVl5OWxiR1Z0Wlc1MExuUnpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3T3pzN1FVRkJRVHM3UVVGRFFUczdRVUZEUVRzN1FVRkRRVHM3UVVGUFFUczdRVUZWUVRzN1FVRkRRVHM3UVVGRlRTeFRRVUZWTEdGQlFWWXNRMEZCZDBJc1QwRkJlRUlzUlVGQk1FTXNUMEZCTVVNc1JVRkJOa1U3UVVGRGJFWXNVVUZCVFN4blFrRkJaMElzUjBGQmJVSXNSVUZCZWtNN08wRkJSVUVzVFVGQlNUdEJRVU5JTEZWQlFVMHNUVUZCVFN4SFFVRkhMRTlCUVU4c1EwRkJReXhoUVVGU0xFTkJRWE5DTEZkQlFYSkRPenRCUVVOQkxGRkJRVWtzUTBGQlF5eE5RVUZNTEVWQlFXRTdRVUZEV2l4WlFVRk5MRWxCUVVrc1MwRkJTaXhEUVVGVkxEUkRRVUZXTEVOQlFVNDdRVUZEUVRzN1FVRkZSQ3hWUVVGTkxFMUJRVTBzUjBGQlJ5eFBRVUZQTEVOQlFVTXNjVUpCUVZJc1JVRkJaaXhEUVU1SExFTkJUVFJET3p0QlFVTXZReXhSUVVGSkxFTkJRVU1zYVVOQlFYTkNMRTFCUVhSQ0xFVkJRVGhDTEU5QlFVOHNRMEZCUXl4WFFVRjBReXhEUVVGTUxFVkJRWGxFTzBGQlEzaEVPMEZCUTBFN08wRkJSVVFzVlVGQlRTeE5RVUZOTEVkQlFVY3NUVUZCVFN4RFFVRkRMR2RDUVVGUUxFTkJRWGRDTEU5QlFYaENMRU5CUVdZN1FVRkRRU3hWUVVGTkxGbEJRVmtzUjBGQlJ5eFBRVUZQTEVOQlFVTXNZVUZCVWl4SlFVRjVRaXhOUVVGTkxFTkJRVU1zWjBKQlFWQXNRMEZCZDBJc1QwRkJUeXhEUVVGRExHRkJRV2hETEVOQlFUbERPMEZCUlVFc1ZVRkJUU3haUVVGWkxFZEJRVWNzT0VKQlFXOUNMRTlCUVhCQ0xFbEJRMnhDTEdWQlFXVXNRMEZCUXl4UFFVRkVMRVZCUVZVc1QwRkJWaXhEUVVSSExFZEJSV3hDTEU5QlFVOHNRMEZCUXl4WFFVRlNMRU5CUVc5Q0xHVkJRWEJDTEVOQlFXOURMR2xDUVVGd1F5eEZRVUZyUkN4SFFVRnNSQ3hEUVVaSUxFTkJaRWNzUTBGclFrZzdPMEZCUTBFc1NVRkJRU3haUVVGWkxFTkJRVU1zVDBGQllpeERRVUZ4UWl4SFFVRnlRaXhIUVVFeVFpeFBRVUZQTEVOQlFVTXNUMEZCVWl4RFFVRm5RaXhYUVVGb1FpeEZRVUV6UWp0QlFVTkJMRlZCUVUwc1JVRkJSU3hIUVVGSExFOUJRVThzUTBGQlF5eEZRVUZTTEVsQlFXTXNRMEZCUXl4UFFVRlBMRU5CUVVNc1UwRkJVaXhEUVVGclFpeERRVUZzUWl4TFFVRjNRaXhQUVVGUExFTkJRVU1zVDBGQlVpeERRVUZuUWl4WFFVRm9RaXhGUVVGNlFpeEpRVUV3UkN4UFFVRlBMRU5CUVVNc1YwRkJVaXhGUVVGdVJqdEJRVU5CTEVsQlFVRXNXVUZCV1N4RFFVRkRMRVZCUVdJc1IwRkJhMElzUlVGQmJFSTdRVUZEUVN4VlFVRk5MRk5CUVZNc1IwRkJSeXhQUVVGUExFTkJRVU1zV1VGQlVpeERRVUZ4UWl4UFFVRnlRaXhEUVVGc1FqczdRVUZEUVN4UlFVRkpMRk5CUVVvc1JVRkJaVHRCUVVOa0xFMUJRVUVzV1VGQldTeERRVUZETEZsQlFXSXNRMEZCTUVJc1QwRkJNVUlzUlVGQmJVTXNVMEZCYmtNN1FVRkRRU3hMUVhwQ1JTeERRVEpDU0RzN08wRkJRMEVzVlVGQlRTeHBRa0ZCYVVJc1IwRkJSeXh6UTBGQmRVSXNUVUZCZGtJc1JVRkJLMElzV1VGQkwwSXNRMEZCTVVJN1FVRkRRU3hWUVVGTkxHRkJRV0VzUjBGQlJ5eHBRa0ZCYVVJc1IwRkRjRU1zVDBGQlR5eERRVUZETEdOQlFWSXNRMEZCZFVJc2FVSkJRWFpDTEVOQlJHOURMRWRCUlhCRExFOUJRVThzUTBGQlF5eHRRa0ZHV0RzN1FVRkhRU3hSUVVGSkxHRkJRVW9zUlVGQmJVSTdRVUZEYkVJc1RVRkJRU3hQUVVGUExFTkJRVU1zWjBKQlFWSXNRMEZCZVVJc1dVRkJla0lzUTBGRFF5eFhRVVJFTEVWQlJVTXNRMEZCUXl4UFFVRlBMRU5CUVVNc1owSkJRVklzUTBGQmVVSXNXVUZCZWtJc1EwRkJjME1zVjBGQmRFTXNRMEZCUkN4RlFVRnhSQ3haUVVGWkxFTkJRVU1zUlVGQmJFVXNSVUZCYzBVc1RVRkJkRVVzUTBGQk5rVXNUMEZCTjBVc1JVRkJjMFlzU1VGQmRFWXNRMEZCTWtZc1IwRkJNMFlzUTBGR1JEdEJRVWxCTEV0QmNrTkZMRU5CYzBOSU8wRkJRMEU3T3p0QlFVTkJMRlZCUVUwc2FVSkJRV2xDTEVkQlEzUkNMRTlCUVU4c1EwRkJReXh0UWtGQlVpeExRVUZuUXl4aFFVRm9ReXhIUVVGblJDeFBRVUZQTEVOQlFVTXNaMEpCUVhoRUxFZEJRVEpGTEdGQlJEVkZPMEZCUlVFc1NVRkJRU3haUVVGWkxFTkJRVU1zVDBGQllpeERRVUZ4UWl4TlFVRnlRaXhIUVVFNFFpeE5RVUZOTEVOQlFVTXNUVUZCY2tNc1EwRXhRMGNzUTBFd1EzbERPenRCUVVNMVF5eEpRVUZCTEdsQ1FVRnBRaXhEUVVGRExFMUJRV3hDTEVOQlFYbENMRmxCUVhwQ0xFVkJNME5ITEVOQk5rTklPenRCUVVOQkxGRkJRVWtzV1VGQlNqdEJRVU5CTEZGQlFVa3NiVUpCUVVvN1FVRkRRU3hSUVVGSkxHbENRVUZLT3p0QlFVTkJMRkZCUVVrc01FTkJRVEpDTEUxQlFUTkNMRVZCUVcxRExGbEJRVzVETEVOQlFVb3NSVUZCYzBRN1FVRkRja1FzVFVGQlFTeHBRa0ZCYVVJc1IwRkJSeXh2UTBGQmNVSXNXVUZCY2tJc1EwRkJjRUk3UVVGRFFTeE5RVUZCTEcxQ1FVRnRRaXhIUVVGSExHbENRVUZwUWl4RFFVRkRMSGRDUVVGNFF6dEJRVU5CTEUxQlFVRXNXVUZCV1N4SFFVRkhMRVZCUTJRc1IwRkJSeXhQUVVSWE8wRkJSV1FzVVVGQlFTeG5Ra0ZCWjBJc1JVRkJSU3haUVVaS08wRkJSMlFzVVVGQlFTeGpRVUZqTEVWQlFVVXNhVUpCU0VZN1FVRkpaQ3hSUVVGQkxHMUNRVUZ0UWl4RlFVRkZPMEZCU2xBc1QwRkJaanRCUVUxQkxFdEJWRVFzVFVGVFR6dEJRVU5PTEUxQlFVRXNiVUpCUVcxQ0xFZEJRVWNzV1VGQmRFSTdRVUZEUVN4TlFVRkJMRmxCUVZrc1IwRkJSeXhGUVVOa0xFZEJRVWNzVDBGRVZ6dEJRVVZrTEZGQlFVRXNaMEpCUVdkQ0xFVkJRVVVzV1VGR1NqdEJRVWRrTEZGQlFVRXNiVUpCUVcxQ0xFVkJRVVU3UVVGSVVDeFBRVUZtTzBGQlMwRXNTMEZxUlVVc1EwRnRSVWc3T3p0QlFVTkJMRk5CUVVzc1RVRkJUU3hEUVVGRExFbEJRVVFzUlVGQlR5eExRVUZRTEVOQlFWZ3NTVUZCTkVJc0swTkJRVEpDTEU5QlFUTkNMRVZCUVc5RExFOUJRWEJETEVOQlFUVkNMRVZCUVRCRk8wRkJRM3BGTEUxQlFVRXNXVUZCV1N4RFFVRkRMRmxCUVdJc1EwRkJNRUlzU1VGQk1VSXNSVUZCWjBNc1MwRkJhRU03UVVGRFFUczdRVUZGUkN4VlFVRk5MRzFDUVVGdFFpeEhRVUZITEVOQlFVTXNZMEZCUkN4RlFVRjVReXhSUVVGNlF5eExRVUZwUmp0QlFVTTFSeXhaUVVGTkxHMUNRVUZ0UWl4SFFVRkhMRTFCUVUwc1EwRkJReXhuUWtGQlVDeERRVUYzUWl4UFFVRjRRaXhGUVVGcFF5eGpRVUZxUXl4RFFVRTFRanM3UVVGRFFTeFZRVUZKTEcxQ1FVRnRRaXhEUVVGRExFOUJRWEJDTEV0QlFXZERMRTFCUVhCRExFVkJRVFJETzBGQlF6TkRPMEZCUTBFc1kwRkJUU3hKUVVGSkxFZEJRVWNzVDBGQlR5eERRVUZETEdGQlFWSXNRMEZCYzBJc1lVRkJkRUlzUTBGQmIwTXNUVUZCY0VNc1EwRkJZanRCUVVOQkxHZERRVUZqTEcxQ1FVRmtMRVZCUVcxRExFbEJRVWtzUTBGQlF5eExRVUY0UXp0QlFVTkJMRkZCUVVFc1NVRkJTU3hEUVVGRExGZEJRVXdzUjBGQmJVSXNlVUpCUVdVc2JVSkJRVzFDTEVOQlFVTXNUMEZCYmtNc1EwRkJia0k3UVVGRFFTeGpRVUZOTEV0QlFVc3NSMEZCUnl4UFFVRlBMRU5CUVVNc1lVRkJVaXhEUVVGelFpeGhRVUYwUWl4RFFVRnZReXhQUVVGd1F5eERRVUZrTzBGQlEwRXNVVUZCUVN4TFFVRkxMRU5CUVVNc1UwRkJUaXhIUVVGclFpeEpRVUZKTEVWQlFVVXNSMEZCUnl4alFVRmpMSEZDUVVGNlF6dEJRVU5CTEZGQlFVRXNUMEZCVHl4RFFVRkRMRTFCUVZJc1EwRkJaU3hMUVVGbU8wRkJRMEVzVVVGQlFTeG5Ra0ZCWjBJc1EwRkJReXhKUVVGcVFpeERRVUZ6UWl4TlFVRk5MRXRCUVVzc1EwRkJReXhOUVVGT0xFVkJRVFZDTzBGQlEwRXNVVUZCUVN4UFFVRlBMRU5CUVVNc1VVRkJSQ3hEUVVGUUxFTkJRV3RDTEVsQlFXeENPMEZCUTBFc1VVRkJRU3huUWtGQlowSXNRMEZCUXl4SlFVRnFRaXhEUVVGelFpeE5RVUZOTEVsQlFVa3NRMEZCUXl4TlFVRk1MRVZCUVRWQ08wRkJRMEU3UVVGRFJDeExRV1JFT3p0QlFXVkJMRWxCUVVFc2JVSkJRVzFDTEVOQlFVTXNWVUZCUkN4RlFVRmhMRk5CUVdJc1EwRkJia0k3UVVGRFFTeEpRVUZCTEcxQ1FVRnRRaXhEUVVGRExGTkJRVVFzUlVGQldTeFJRVUZhTEVOQlFXNUNMRU5CZUVaSExFTkJlVVpJT3p0QlFVVkJMRWxCUVVFc2RVSkJRWFZDTEVOQlFVTXNUVUZCUkN4RlFVRlRMRTFCUVZRc1JVRkJhVUlzYlVKQlFXcENMRVZCUVhORExFMUJRWFJETEVWQlFUaERMRTlCUVRsRExFTkJRWFpDTEVOQk0wWkhMRU5CTmtaSU96dEJRVU5CTEZGQlFVa3NVVUZCU2pzN1FVRkRRU3hSUVVGSkxFMUJRVTBzUTBGQlF5eFJRVUZRTEV0QlFXOUNMRk5CUVhoQ0xFVkJRVzFETzBGQlEyeERMRTFCUVVFc1VVRkJVU3hIUVVGSExFOUJRVThzUTBGQlF5eFhRVUZTTEVOQlFXOUNMR1ZCUVhCQ0xFTkJRVzlETEdsQ1FVRndReXhGUVVGclJDeFZRVUZzUkN4RFFVRllPMEZCUTBFc1RVRkJRU3hSUVVGUkxFTkJRVU1zUlVGQlZDeEhRVUZqTEdGQlFXRXNUMEZCVHl4RFFVRkRMRmRCUVZJc1JVRkJNMEk3UVVGRFFTeE5RVUZCTEZGQlFWRXNRMEZCUXl4TlFVRlVMRU5CUVdkQ0xGTkJRVk1zUTBGQlF5eE5RVUZFTEVWQlFWTXNUMEZCVkN4RFFVRjZRanRCUVVOQkxFMUJRVUVzV1VGQldTeERRVUZETEUxQlFXSXNRMEZCYjBJc1VVRkJjRUk3UVVGRFFTeE5RVUZCTEZsQlFWa3NRMEZCUXl4WlFVRmlMRU5CUVRCQ0xGZEJRVEZDTEVWQlFYVkRMRkZCUVZFc1VVRkJVU3hEUVVGRExFVkJRVVVzUjBGQk1VUTdRVUZEUVRzN1FVRkZSQ3hSUVVGSkxEWkNRVUZ0UWl4UFFVRnVRaXhEUVVGS0xFVkJRV2xETzBGQlFVRTdPMEZCUTJoRExGbEJRVTBzVVVGQlVTeEhRVUZITEU5QlFVOHNRMEZCUXl4WFFVRlNMRU5CUVc5Q0xHVkJRWEJDTEVOQlFXOURMR2xDUVVGd1F5eEZRVUZyUkN4UFFVRnNSQ3hEUVVGcVFqdEJRVU5CTEUxQlFVRXNVVUZCVVN4RFFVRkRMRmxCUVZRc1EwRkJjMElzVFVGQmRFSXNSVUZCT0VJc1QwRkJUeXhEUVVGRExFZEJRWFJETzBGQlEwRXNXVUZCVFN4WFFVRlhMSE5DUVVGSExIbENRVUZsTEUxQlFVMHNRMEZCUXl4WFFVRjBRaXhGUVVGdFF5eE5RVUZOTEVOQlFVTXNTMEZCTVVNc1EwRkJTQ3cyUkVGQmRVUXNRMEZCZUVVN1FVRkRRU3haUVVGTkxGbEJRVmtzZFVKQlFVY3NlVUpCUVdVc1RVRkJUU3hEUVVGRExGbEJRWFJDTEVWQlFXOURMRTFCUVUwc1EwRkJReXhMUVVFelF5eERRVUZJTEN0RVFVRjNSQ3hEUVVFeFJUdEJRVU5CTEZsQlFVMHNWVUZCVlN4MVFrRkJSeXg1UWtGQlpTeE5RVUZOTEVOQlFVTXNWVUZCZEVJc1JVRkJhME1zVFVGQlRTeERRVUZETEUxQlFYcERMRU5CUVVnc0swUkJRWFZFTEVOQlFYWkZPMEZCUTBFc1dVRkJUU3hoUVVGaExIVkNRVUZITEhsQ1FVRmxMRTFCUVUwc1EwRkJReXhoUVVGMFFpeEZRVUZ4UXl4TlFVRk5MRU5CUVVNc1RVRkJOVU1zUTBGQlNDd3JSRUZCTUVRc1EwRkJOMFU3UVVGRFFTeE5RVUZCTEZGQlFWRXNRMEZCUXl4WlFVRlVMRU5CUVhOQ0xFZEJRWFJDTEVWQlFUSkNMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVkFzUjBGQlZ5eFhRVUZhTEVWQlFYbENMRkZCUVhwQ0xFVkJRVE5DTzBGQlEwRXNUVUZCUVN4UlFVRlJMRU5CUVVNc1dVRkJWQ3hEUVVGelFpeEhRVUYwUWl4RlFVRXlRaXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZRTEVkQlFWY3NWVUZCV2l4RlFVRjNRaXhSUVVGNFFpeEZRVUV6UWp0QlFVTkJMRTFCUVVFc1VVRkJVU3hEUVVGRExGbEJRVlFzUTBGQmMwSXNUMEZCZEVJc1JVRkJLMElzUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCVUN4SFFVRmxMRmRCUVdZc1IwRkJOa0lzV1VGQk9VSXNSVUZCTkVNc1VVRkJOVU1zUlVGQkwwSTdRVUZEUVN4TlFVRkJMRkZCUVZFc1EwRkJReXhaUVVGVUxFTkJRWE5DTEZGQlFYUkNMRVZCUVdkRExFTkJRVU1zVFVGQlRTeERRVUZETEUxQlFWQXNSMEZCWjBJc1ZVRkJhRUlzUjBGQk5rSXNZVUZCT1VJc1JVRkJOa01zVVVGQk4wTXNSVUZCYUVNN08wRkJRMEVzVlVGQlNTeFBRVUZQTEVOQlFVTXNSMEZCV2l4RlFVRnBRanRCUVVOb1FpeFJRVUZCTEZGQlFWRXNRMEZCUXl4WlFVRlVMRU5CUVhOQ0xGbEJRWFJDTEVWQlFXOURMRTlCUVU4c1EwRkJReXhIUVVFMVF6dEJRVU5CT3p0QlFVTkVMRTFCUVVFc1dVRkJXU3hEUVVGRExFMUJRV0lzUTBGQmIwSXNVVUZCY0VJN1FVRkRRU3hMUVdaRUxFMUJaVThzU1VGQlNTdzJRa0ZCYlVJc1QwRkJia0lzUzBGQkswSXNUVUZCVFN4RFFVRkRMRXRCUVZBc1IwRkJaU3hEUVVFNVF5eEpRVUZ0UkN4TlFVRk5MRU5CUVVNc1RVRkJVQ3hIUVVGblFpeERRVUYyUlN4RlFVRXdSVHRCUVVOb1JqdEJRVU5CTEZWQlFVa3NUMEZCVHl4RFFVRkRMRXRCUVZvc1JVRkJiVUk3UVVGQlFUczdRVUZEYkVJc1kwRkJUU3hqUVVGakxFZEJRVWNzVDBGQlR5eERRVUZETEZkQlFWSXNRMEZCYjBJc1pVRkJjRUlzUTBGQmIwTXNhVUpCUVhCRExFVkJRV3RFTEUxQlFXeEVMRU5CUVhaQ08wRkJRMEVzVVVGQlFTeGpRVUZqTEVOQlFVTXNXVUZCWml4RFFVRTBRaXh0UWtGQk5VSXNSVUZCYVVRc1UwRkJha1E3UVVGRFFTeFJRVUZCTEdOQlFXTXNRMEZCUXl4WlFVRm1MRU5CUVRSQ0xGZEJRVFZDTEVWQlFYbERMRlZCUVhwRE8wRkJRMEVzVVVGQlFTeGpRVUZqTEVOQlFVTXNXVUZCWml4RFFVTkRMRWRCUkVRc1JVRkZReXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZRTEhkQ1FVRlpMSGxDUVVGbExFMUJRVTBzUTBGQlF5eFhRVUYwUWl4RlFVRnRReXhOUVVGTkxFTkJRVU1zUzBGQk1VTXNRMEZCV2l3clJFRkJaMFVzUTBGQmFFVXNRMEZCUkN4RlFVRnhSU3hSUVVGeVJTeEZRVVpFTzBGQlNVRXNZMEZCVFN4SFFVRkhMRWRCUVVjc1RVRkJUU3hEUVVGRExFZEJRVkFzZDBKQlFXTXNlVUpCUVdVc1RVRkJUU3hEUVVGRExGVkJRWFJDTEVWQlFXdERMRTFCUVUwc1EwRkJReXhOUVVGNlF5eERRVUZrTEN0RVFVRnJSU3hEUVVGc1JTeERRVUZhTzBGQlEwRXNZMEZCVFN4TlFVRk5MRWRCUVVjc1RVRkJUU3hEUVVGRExFMUJRVkFzZDBKQlFXbENMSGxDUVVGbExFMUJRVTBzUTBGQlF5eGhRVUYwUWl4RlFVRnhReXhOUVVGTkxFTkJRVU1zVFVGQk5VTXNRMEZCYWtJc0swUkJRWGRGTEVOQlFYaEZMRU5CUVdZN1FVRkRRU3hqUVVGTkxFMUJRVTBzUjBGQlJ5eERRVUZETEVkQlFVY3NSMEZCUnl4TlFVRlFMRWxCUVdsQ0xFTkJRV2hETzBGQlEwRXNVVUZCUVN4alFVRmpMRU5CUVVNc1dVRkJaaXhEUVVFMFFpeEhRVUUxUWl4RlFVRnBReXhOUVVGTkxFTkJRVU1zVVVGQlVDeEZRVUZxUXp0QlFVTkJMRkZCUVVFc1kwRkJZeXhEUVVGRExGZEJRV1lzUjBGQk5rSXNUMEZCVHl4RFFVRkRMRXRCUVhKRE8wRkJRMEVzYjBOQlFXbENMRTFCUVdwQ0xFVkJRWGxDTEdOQlFYcENPMEZCUTBFc1VVRkJRU3haUVVGWkxFTkJRVU1zWTBGQllpeERRVUUwUWl4NVEwRkJOVUlzUTBGQmMwVXNUVUZCZEVVc1EwRkJOa1VzWTBGQk4wVTdRVUZEUVR0QlFVTkVMRXRCYkVKTkxFMUJhMEpCTEVsQlFVa3NUMEZCVHl4RFFVRkRMRTlCUVZJc1MwRkJiMElzUzBGQmVFSXNSVUZCSzBJN1FVRkRja003UVVGRFFUdEJRVU5CTEZsQlFVMHNVMEZCVXl4SFFVRkhMRTlCUVU4c1EwRkJReXhUUVVGU0xFTkJRV3RDTEVsQlFXeENMRU5CUVd4Q08wRkJRMEVzVFVGQlFTeFRRVUZUTEVOQlFVTXNXVUZCVml4RFFVRjFRaXhIUVVGMlFpeEZRVUUwUWl4TlFVRk5MRU5CUVVNc1EwRkJVQ3hEUVVGVExGRkJRVlFzUlVGQk5VSTdRVUZEUVN4TlFVRkJMRk5CUVZNc1EwRkJReXhaUVVGV0xFTkJRWFZDTEVkQlFYWkNMRVZCUVRSQ0xFMUJRVTBzUTBGQlF5eERRVUZRTEVOQlFWTXNVVUZCVkN4RlFVRTFRanRCUVVOQkxFMUJRVUVzVTBGQlV5eERRVUZETEZsQlFWWXNRMEZCZFVJc1QwRkJka0lzUlVGQlowTXNUVUZCVFN4RFFVRkRMRXRCUVZBc1EwRkJZU3hSUVVGaUxFVkJRV2hETzBGQlEwRXNUVUZCUVN4VFFVRlRMRU5CUVVNc1dVRkJWaXhEUVVGMVFpeFJRVUYyUWl4RlFVRnBReXhOUVVGTkxFTkJRVU1zVFVGQlVDeERRVUZqTEZGQlFXUXNSVUZCYWtNN1FVRkRRU3hOUVVGQkxGTkJRVk1zUTBGQlF5eExRVUZXTEVOQlFXZENMRXRCUVdoQ0xFZEJRWGRDTEUxQlFVMHNRMEZCUXl4TFFVRXZRaXhEUVZKeFF5eERRVkZCT3p0QlFVTnlReXhOUVVGQkxHbENRVUZwUWl4RFFVRkRMRTFCUVd4Q0xFTkJRWGxDTEZOQlFYcENPMEZCUTBFc1MwRldUU3hOUVZWQkxFbEJRVWtzVDBGQlR5eERRVUZETEU5QlFWSXNTMEZCYjBJc1VVRkJlRUlzUlVGQmEwTTdRVUZEZUVNc1YwRkJTeXhOUVVGTkxFdEJRVmdzU1VGQmIwSXNUMEZCVHl4RFFVRkRMRlZCUVRWQ0xFVkJRWGRETzBGQlEzWkRMR2xEUVVGVExFdEJRVlFzUlVGQlowSXNXVUZCYUVJN1FVRkRRVHM3UVVGRFJDeFZRVUZKTEdsQ1FVRktMRVZCUVhWQ08wRkJRM1JDTEdsRVFVRXdRaXhwUWtGQk1VSTdRVUZEUVR0QlFVTkVPMEZCUTBRc1IwRXhTa1FzVTBFd1NsVTdRVUZEVkN4VFFVRkxMRTFCUVUwc1QwRkJXQ3hKUVVGelFpeG5Ra0ZCZEVJc1JVRkJkME03UVVGRGRrTXNUVUZCUVN4UFFVRlBPMEZCUTFBN1FVRkRSRHRCUVVORU96dEJRVVZFTEZOQlFWTXNkVUpCUVZRc1EwRkRReXhOUVVSRUxFVkJSVU1zVFVGR1JDeEZRVWRETERaQ1FVaEVMRVZCU1VNc1RVRktSQ3hGUVV0RExFOUJURVFzUlVGTEswUTdRVUZGT1VRc1RVRkJTU3h2UWtGQlZTeE5RVUZXTEVOQlFVb3NSVUZCZFVJN1FVRkRkRUlzVVVGRFF5eE5RVUZOTEVOQlFVTXNTMEZCVUN4SFFVRmxMRU5CUVdZc1NVRkRRU3hOUVVGTkxFTkJRVU1zVFVGQlVDeEhRVUZuUWl4RFFVUm9RaXhMUVVWRExFTkJRVU1zZDBKQlFXTXNUVUZCVFN4RFFVRkRMR1ZCUVhKQ0xFTkJRVVFzU1VGQk1FTXNNa0pCUVdsQ0xFMUJRV3BDTEVOQlFURkRMRWxCUVhORkxFMUJRVTBzUTBGQlF5eGxRVUZRTEV0QlFUSkNMRTFCUm14SExFTkJSRVFzUlVGSlJUdEJRVU5FTEZsQlFVMHNSMEZCUnl4SFFVRkhMRFJDUVVFMFFpeERRVUZETEUxQlFVUXNSVUZCVXl4TlFVRlVMRVZCUVdsQ0xFOUJRV3BDTEVOQlFYaERPMEZCUTBFc1RVRkJRU3cyUWtGQk5rSXNRMEZCUXl4TlFVRTVRaXhEUVVGeFF5eEhRVUZ5UXl4RlFVWkRMRU5CUjBRN08wRkJRMEVzVlVGQlNTeE5RVUZOTEVOQlFVTXNaVUZCVUN4TFFVRXlRaXhOUVVFelFpeEpRVUZ4UXl4TlFVRk5MRU5CUVVNc1pVRkJVQ3hEUVVGMVFpeEpRVUYyUWl4SFFVRTRRaXhWUVVFNVFpeERRVUY1UXl4TlFVRjZReXhEUVVGNlF5eEZRVUV5Ump0QlFVTXhSaXhqUVVGTkxFdEJRVXNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNWMEZCVWl4RFFVRnZRaXhsUVVGd1FpeERRVUZ2UXl4cFFrRkJjRU1zUlVGQmEwUXNUMEZCYkVRc1EwRkJaRHRCUVVOQkxHTkJRVTBzUTBGQlF5eExRVUZFTEVWQlFWRXNUVUZCVFN4SFFVRkhMRTFCUVdwQ0xFbEJRVEpDTEUxQlFVMHNRMEZCUXl4alFVRlFMRU5CUVhOQ0xFdEJRWFJDTEVOQlFUUkNMRWRCUVRWQ0xFTkJRV3BETzBGQlEwRXNVVUZCUVN4TFFVRkxMRU5CUVVNc1dVRkJUaXhEUVVGdFFpeEhRVUZ1UWl4RlFVRjNRaXhOUVVGTkxFTkJRVU1zUTBGQlVDeERRVUZUTEZGQlFWUXNSVUZCZUVJN1FVRkRRU3hSUVVGQkxFdEJRVXNzUTBGQlF5eFpRVUZPTEVOQlFXMUNMRWRCUVc1Q0xFVkJRWGRDTEUxQlFVMHNRMEZCUXl4RFFVRlFMRU5CUVZNc1VVRkJWQ3hGUVVGNFFqdEJRVU5CTEZGQlFVRXNTMEZCU3l4RFFVRkRMRmxCUVU0c1EwRkJiVUlzVDBGQmJrSXNSVUZCTkVJc01FSkJRVEJDTEVOQlFVTXNTMEZCUkN4RlFVRlJMRTFCUVUwc1EwRkJReXhMUVVGbUxFTkJRVEZDTEVOQlFXZEVMRkZCUVdoRUxFVkJRVFZDTzBGQlEwRXNVVUZCUVN4TFFVRkxMRU5CUVVNc1dVRkJUaXhEUVVGdFFpeFJRVUZ1UWl4RlFVRTJRaXd3UWtGQk1FSXNRMEZCUXl4TlFVRkVMRVZCUVZNc1RVRkJUU3hEUVVGRExFMUJRV2hDTEVOQlFURkNMRU5CUVd0RUxGRkJRV3hFTEVWQlFUZENPenRCUVVOQkxGbEJRVWtzUzBGQlN5eExRVUZMTEUxQlFWWXNTVUZCYjBJc1RVRkJUU3hMUVVGTExFMUJRVzVETEVWQlFUSkRPMEZCUXpGRExGVkJRVUVzUzBGQlN5eERRVUZETEZsQlFVNHNRMEZCYlVJc2NVSkJRVzVDTEVWQlFUQkRMRTFCUVRGRE8wRkJRMEVzVTBGR1JDeE5RVVZQTEVsQlFVa3NUVUZCVFN4RFFVRkRMR05CUVZBc1MwRkJNRUlzVTBGQk9VSXNSVUZCZVVNN1FVRkRMME1zVlVGQlFTeExRVUZMTEVOQlFVTXNXVUZCVGl4RFFVRnRRaXh4UWtGQmJrSXNSVUZCTUVNc1pVRkJNVU03UVVGRFFTeFRRVVpOTEUxQlJVRXNTVUZCU1N4TlFVRk5MRU5CUVVNc1kwRkJVQ3hMUVVFd1FpeFBRVUU1UWl4RlFVRjFRenRCUVVNM1F5eFZRVUZCTEV0QlFVc3NRMEZCUXl4WlFVRk9MRU5CUVcxQ0xIRkNRVUZ1UWl4RlFVRXdReXhuUWtGQk1VTTdRVUZEUVN4VFFXSjVSaXhEUVdNeFJqdEJRVU5CT3pzN1FVRkRRU3hqUVVGTkxFZEJRVWNzUjBGQlJ5eEpRVUZKTEVkQlFVb3NRMEZCVVN3MFFrRkJhMElzVFVGQlRTeERRVUZETEdWQlFYcENMRU5CUVZJc1JVRkJiVVFzVFVGQlRTeERRVUZETEZGQlFWQXNRMEZCWjBJc1NVRkJia1VzUTBGQldqdEJRVU5CTEZGQlFVRXNTMEZCU3l4RFFVRkRMRmxCUVU0c1EwRkJiVUlzVFVGQmJrSXNSVUZCTWtJc1IwRkJSeXhEUVVGRExFbEJRUzlDT3p0QlFVTkJMRmxCUVVrc1RVRkJUU3hEUVVGRExHZENRVUZRTEV0QlFUUkNMRmRCUVdoRExFVkJRVFpETzBGQlF6VkRMRlZCUVVFc05rSkJRVFpDTEVOQlFVTXNUVUZCT1VJc1EwRkJjVU1zUzBGQmNrTTdRVUZEUVN4VFFVWkVMRTFCUlU4N1FVRkRUaXhuUWtGQlRTeFBRVUZQTEVkQlFVY3NUMEZCVHl4RFFVRkRMRmRCUVZJc1EwRkJiMElzWlVGQmNFSXNRMEZCYjBNc2FVSkJRWEJETEVWQlFXdEVMRk5CUVd4RUxFTkJRV2hDTzBGQlEwRXNWVUZCUVN4UFFVRlBMRU5CUVVNc1dVRkJVaXhEUVVGeFFpeGpRVUZ5UWl4RlFVRnhReXhuUWtGQmNrTTdRVUZEUVN4VlFVRkJMRTlCUVU4c1EwRkJReXhGUVVGU0xFZEJRV0VzV1VGQldTeFBRVUZQTEVOQlFVTXNWMEZCVWl4RlFVRjZRanRCUVVOQkxGVkJRVUVzVDBGQlR5eERRVUZETEUxQlFWSXNRMEZCWlN4TFFVRm1PMEZCUTBFc1ZVRkJRU3hIUVVGSExFTkJRVU1zVFVGQlNpeERRVUZYTEU5QlFWZzdRVUZEUVN4VlFVRkJMRWRCUVVjc1EwRkJReXhaUVVGS0xFTkJRV2xDTEUxQlFXcENMRVZCUVhsQ0xGRkJRVkVzVDBGQlR5eERRVUZETEVWQlFVVXNSMEZCTTBNN1FVRkRRVHRCUVVORU8wRkJRMFE3TzBGQlJVUXNVVUZCU1N4RFFVRkRMREpDUVVGcFFpeE5RVUZxUWl4RFFVRk1MRVZCUVN0Q08wRkJRemxDTzBGQlEwRXNWMEZCU3l4TlFVRk5MRlZCUVZnc1NVRkJlVUlzWVVGQllTeERRVUZETEUxQlFVUXNSVUZCVXl4TlFVRlVMRVZCUVdsQ0xFOUJRV3BDTEVOQlFYUkRMRVZCUVdsRk8wRkJRMmhGTEZGQlFVRXNOa0pCUVRaQ0xFTkJRVU1zVFVGQk9VSXNRMEZCY1VNc1ZVRkJja003UVVGRFFUdEJRVU5FTzBGQlEwUTdRVUZEUkRzN1FVRkZSQ3hUUVVGVExEQkNRVUZVTEVOQlFXOURMRWxCUVhCRExFVkJRV3RFTEZkQlFXeEVMRVZCUVhGRk8wRkJRM0JGTEUxQlFVa3NTVUZCU1N4TFFVRkxMRTFCUVdJc1JVRkJjVUk3UVVGRGNFSTdRVUZEUVN4WFFVRlBMRmRCUVZBN1FVRkRRVHM3UVVGRFJDeE5RVUZKTEVsQlFVa3NRMEZCUXl4UlFVRk1MRU5CUVdNc1NVRkJaQ3hEUVVGS0xFVkJRWGxDTzBGQlEzaENMRmRCUVU4c1ZVRkJWU3hEUVVGRExFbEJRVVFzUTBGQmFrSTdRVUZEUVRzN1FVRkRSQ3hOUVVGSkxFbEJRVWtzUTBGQlF5eFJRVUZNTEVOQlFXTXNSMEZCWkN4RFFVRktMRVZCUVhkQ08wRkJRM1pDTzBGQlEwRXNWMEZCVVN4VlFVRlZMRU5CUVVNc1NVRkJSQ3hEUVVGV0xFZEJRVzFDTEVkQlFYQkNMRWRCUVRKQ0xGZEJRV3hETzBGQlEwRXNSMEZZYlVVc1EwRlpjRVU3T3p0QlFVTkJMRVZCUVVFc1QwRkJUeXhEUVVGRExFbEJRVklzUTBGQllTd3JRa0ZCWWl4RlFVRTRReXhKUVVFNVF6dEJRVU5CTEZOQlFVOHNWMEZCVUR0QlFVTkJPenRCUVVWRUxGTkJRVk1zVTBGQlZDeERRVUZ0UWl4TlFVRnVRaXhGUVVFMFF5eFBRVUUxUXl4RlFVRXdSanRCUVVONlJpeFJRVUZOTEVkQlFVY3NSMEZCUnl4UFFVRlBMRU5CUVVNc1YwRkJVaXhEUVVGdlFpeGxRVUZ3UWl4RFFVRnZReXhwUWtGQmNFTXNSVUZCYTBRc1RVRkJiRVFzUTBGQldpeERRVVI1Uml4RFFVZDZSanM3UVVGRFFTeEZRVUZCTEVkQlFVY3NRMEZCUXl4WlFVRktMRU5CUVdsQ0xFOUJRV3BDTEVWQlFUQkNMRTFCUVUwc1EwRkJReXhMUVVGUUxFTkJRV0VzVVVGQllpeEZRVUV4UWp0QlFVTkJMRVZCUVVFc1IwRkJSeXhEUVVGRExGbEJRVW9zUTBGQmFVSXNVVUZCYWtJc1JVRkJNa0lzVFVGQlRTeERRVUZETEUxQlFWQXNRMEZCWXl4UlFVRmtMRVZCUVROQ08wRkJRMEVzUlVGQlFTeEhRVUZITEVOQlFVTXNXVUZCU2l4RFFVRnBRaXhIUVVGcVFpeEZRVUZ6UWl4TlFVRk5MRU5CUVVNc1EwRkJVQ3hEUVVGVExGRkJRVlFzUlVGQmRFSTdRVUZEUVN4RlFVRkJMRWRCUVVjc1EwRkJReXhaUVVGS0xFTkJRV2xDTEVkQlFXcENMRVZCUVhOQ0xFMUJRVTBzUTBGQlF5eERRVUZRTEVOQlFWTXNVVUZCVkN4RlFVRjBRanRCUVVWQkxGTkJRVThzUjBGQlVEdEJRVU5CT3p0QlFVVkVMRk5CUVZNc05FSkJRVlFzUTBGRFF5eE5RVVJFTEVWQlJVTXNUVUZHUkN4RlFVZERMRTlCU0VRc1JVRkhLME03UVVGRk9VTXNVVUZCVFN4VlFVRlZMRWRCUVVjc1UwRkJVeXhEUVVGRExFMUJRVVFzUlVGQlV5eFBRVUZVTEVOQlFUVkNMRU5CUmpoRExFTkJTVGxET3p0QlFVTkJMRTFCUVVrc1RVRkJUU3hEUVVGRExHVkJRVmdzUlVGQk5FSTdRVUZETTBJc1NVRkJRU3hWUVVGVkxFTkJRVU1zV1VGQldDeERRVUYzUWl4TlFVRjRRaXhGUVVGblF5eE5RVUZOTEVOQlFVTXNaVUZCZGtNN1FVRkRRVHM3UVVGRlJDeE5RVUZKTERKQ1FVRnBRaXhOUVVGcVFpeERRVUZLTEVWQlFUaENPMEZCUXpkQ08wRkJRMEVzU1VGQlFTeFZRVUZWTEVOQlFVTXNXVUZCV0N4RFFVRjNRaXhSUVVGNFFpeEZRVUZyUXl4TlFVRk5MRU5CUVVNc1YwRkJla003UVVGRFFTeEpRVUZCTEZWQlFWVXNRMEZCUXl4WlFVRllMRU5CUVhkQ0xHTkJRWGhDTEVWQlFYZERMRTFCUVUwc1EwRkJReXhYUVVFdlF6czdRVUZEUVN4UlFVRkpMRTFCUVUwc1EwRkJReXhYUVVGUUxFdEJRWFZDTEZGQlFUTkNMRVZCUVhGRE8wRkJRM0JETzBGQlEwRTdRVUZEUVN4TlFVRkJMRlZCUVZVc1EwRkJReXhaUVVGWUxFTkJRWGRDTEd0Q1FVRjRRaXhGUVVFMFF5eEhRVUUxUXp0QlFVTkJPMEZCUTBRN08wRkJRMFFzVFVGQlNTeHBRMEZCZFVJc1RVRkJka0lzUTBGQlNpeEZRVUZ2UXp0QlFVTnVReXhKUVVGQkxGVkJRVlVzUTBGQlF5eFpRVUZZTEVOQlFYZENMRWxCUVhoQ0xFVkJRVGhDTEUxQlFVMHNRMEZCUXl4WlFVRnlRenRCUVVOQkxFbEJRVUVzVlVGQlZTeERRVUZETEZsQlFWZ3NRMEZCZDBJc1NVRkJlRUlzUlVGQk9FSXNUVUZCVFN4RFFVRkRMRmxCUVhKRE8wRkJRMEU3TzBGQlJVUXNVMEZCVHl4VlFVRlFPMEZCUTBFN08wRkJSVVFzVlVGQlZTeGhRVUZXTEVOQlEwTXNUVUZFUkN4RlFVVkRMRTFCUmtRc1JVRkhReXhQUVVoRUxFVkJSeXRETzBGQlJUbERMRTlCUVVzc1RVRkJUU3hKUVVGWUxFbEJRVzFDTEVOQlFVTXNTMEZCUkN4RlFVRlJMRkZCUVZJc1JVRkJhMElzVDBGQmJFSXNSVUZCTWtJc1RVRkJNMElzUTBGQmJrSXNSVUZCWjBVN1FVRkRMMFFzVVVGQlNTeFRRVUZUTEVOQlFVTXNUVUZCUkN4RlFVRlRMRWxCUVZRc1EwRkJZaXhGUVVFMlFqdEJRVU0xUWl4WlFVRk5MRmxCUVZrc1EwRkJReXhOUVVGRUxFVkJRVk1zVFVGQlZDeEZRVUZwUWl4SlFVRnFRaXhGUVVGMVFpeFBRVUYyUWl4RFFVRnNRanRCUVVOQk8wRkJRMFE3UVVGRFJEczdRVUZKUkN4VFFVRlRMRk5CUVZRc1EwRkJiVUlzVFVGQmJrSXNSVUZCWjBRc1NVRkJhRVFzUlVGQk1FUTdRVUZEZWtRc1UwRkRReXhEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEdkQ1FVRlFMRU5CUVhkQ0xGVkJRVlVzU1VGQlNTeFJRVUYwUXl4RFFVRkdMRWxCUTBFc1EwRkJReXgzUWtGQll5eE5RVUZOTEVOQlFVTXNaMEpCUVZBc1EwRkJkMElzVlVGQlZTeEpRVUZKTEZGQlFYUkRMRU5CUVdRc1EwRkVSQ3hKUVVWQkxFMUJRVTBzUTBGQlF5eG5Ra0ZCVUN4RFFVRjNRaXhWUVVGVkxFbEJRVWtzVVVGQmRFTXNUVUZCYjBRc1MwRklja1E3UVVGTFFUczdRVUZGUkN4VFFVRlRMRmxCUVZRc1EwRkRReXhOUVVSRUxFVkJSVU1zVFVGR1JDeEZRVWRETEVsQlNFUXNSVUZKUXl4UFFVcEVMRVZCU1N0RE8wRkJSVGxETzBGQlEwRXNVVUZCVFN4TlFVRk5MRWRCUVVjc1QwRkJUeXhEUVVGRExGZEJRVklzUTBGQmIwSXNaVUZCY0VJc1EwRkJiME1zYVVKQlFYQkRMRVZCUVd0RUxFMUJRV3hFTEVOQlFXWTdRVUZEUVN4RlFVRkJMRTFCUVUwc1EwRkJReXhaUVVGUUxFTkJRVzlDTEdkQ1FVRndRaXhGUVVGelF5eFJRVUYwUXp0QlFVTkJMRkZCUVUwc1MwRkJTeXhIUVVGSExFMUJRVTBzUTBGQlF5eG5Ra0ZCVUN4RFFVRjNRaXhWUVVGVkxFbEJRVWtzVVVGQmRFTXNRMEZCWkR0QlFVTkJMRVZCUVVFc1RVRkJUU3hEUVVGRExGbEJRVkFzUTBGQmIwSXNVVUZCY0VJc1JVRkJPRUlzUzBGQk9VSTdRVUZEUVN4RlFVRkJMRTFCUVUwc1EwRkJReXhaUVVGUUxFTkJRVzlDTEdOQlFYQkNMRVZCUVc5RExFMUJRVTBzUTBGQlF5eG5Ra0ZCVUN4RFFVRjNRaXhWUVVGVkxFbEJRVWtzVVVGQmRFTXNRMEZCY0VNc1JVRlFPRU1zUTBGVE9VTTdPMEZCUTBFc1VVRkJUU3hYUVVGWExFZEJRVWNzVFVGQlRTeERRVUZETEdkQ1FVRlFMRU5CUVhkQ0xGVkJRVlVzU1VGQlNTeFJRVUYwUXl4RFFVRndRanM3UVVGRFFTeE5RVU5GTEZkQlFWY3NTMEZCU3l4UFFVRm9RaXhMUVVFMFFpeEpRVUZKTEV0QlFVc3NTMEZCVkN4SlFVRnJRaXhKUVVGSkxFdEJRVXNzVFVGQmRrUXNRMEZCUkN4SlFVTkRMRmRCUVZjc1MwRkJTeXhSUVVGb1FpeExRVUUyUWl4SlFVRkpMRXRCUVVzc1QwRkJWQ3hKUVVGdlFpeEpRVUZKTEV0QlFVc3NVVUZCTVVRc1EwRkdSaXhGUVVkRk8wRkJRMFFzVlVGQlRTeExRVUZMTEVkQlFVY3NTMEZCU3l4RFFVRkRMRXRCUVU0c1EwRkJXU3cyUTBGQldpeERRVUZrT3p0QlFVTkJMRkZCUVVrc1EwRkJReXhMUVVGTUxFVkJRVms3UVVGRFdDeFpRVUZOTEVsQlFVa3NTMEZCU2l4RFFVRlZMSEZDUVVGeFFpeExRVUZMTEVWQlFYQkRMRU5CUVU0N1FVRkRRVHM3UVVGRFJDeFZRVUZOTEZWQlFWVXNSMEZCUnl4TFFVRkxMRU5CUVVNc1MwRkJUaXhEUVVGWkxFTkJRVm9zUlVGQlpTeERRVUZtTEVWQlFXdENMRWRCUVd4Q0xFTkJRWE5DTEV0QlFVc3NTVUZCU1N4UlFVRlJMRU5CUVVNc1MwRkJSQ3hGUVVGUkxFVkJRVklzUTBGQlVpeEhRVUZ6UWl4SFFVRnlSQ3hEUVVGdVFqczdRVUZEUVN4UlFVRkpMRXRCUVVzc1EwRkJReXhEUVVGRUxFTkJRVlFzUlVGQll6dEJRVU5pTEUxQlFVRXNWVUZCVlN4RFFVRkRMRWxCUVZnc1EwRkJaMElzVlVGQlZTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkVMRU5CUVU0c1EwRkJNVUk3UVVGRFFTeExRVkpCTEVOQlUwUTdRVUZEUVRzN08wRkJRMEVzU1VGQlFTeE5RVUZOTEVOQlFVTXNXVUZCVUN4RFFVRnZRaXhSUVVGd1FpeEZRVUU0UWl4UlFVRlJMRlZCUVZVc1EwRkJReXhKUVVGWUxFTkJRV2RDTEVsQlFXaENMRU5CUVhGQ0xFZEJRVE5FTzBGQlEwRTdPMEZCUlVRc1RVRkJTU3hKUVVGSkxFdEJRVXNzUzBGQllpeEZRVUZ2UWp0QlFVTnVRaXhKUVVGQkxFMUJRVTBzUTBGQlF5eFpRVUZRTEVOQlFXOUNMRWxCUVhCQ0xFVkJRVEJDTEUxQlFVMHNRMEZCUXl4SlFVRlFMRU5CUVZrc1VVRkJXaXhGUVVFeFFqdEJRVU5CTEVsQlFVRXNUVUZCVFN4RFFVRkRMRmxCUVZBc1EwRkJiMElzU1VGQmNFSXNSVUZCTUVJc1RVRkJUU3hEUVVGRExFdEJRVkFzUTBGQllTeFJRVUZpTEVWQlFURkNPMEZCUTBFc1NVRkJRU3hOUVVGTkxFTkJRVU1zV1VGQlVDeERRVUZ2UWl4SlFVRndRaXhGUVVFd1FpeE5RVUZOTEVOQlFVTXNSMEZCVUN4RFFVRlhMRkZCUVZnc1JVRkJNVUk3UVVGRFFTeEpRVUZCTEUxQlFVMHNRMEZCUXl4WlFVRlFMRU5CUVc5Q0xFbEJRWEJDTEVWQlFUQkNMRTFCUVUwc1EwRkJReXhIUVVGUUxFTkJRVmNzVVVGQldDeEZRVUV4UWp0QlFVTkJMRWRCVEVRc1RVRkxUeXhKUVVGSkxFbEJRVWtzUzBGQlN5eE5RVUZpTEVWQlFYRkNPMEZCUXpOQ0xFbEJRVUVzVFVGQlRTeERRVUZETEZsQlFWQXNRMEZCYjBJc1NVRkJjRUlzUlVGQk1FSXNUVUZCVFN4RFFVRkRMRWxCUVZBc1EwRkJXU3hSUVVGYUxFVkJRVEZDTzBGQlEwRXNTVUZCUVN4TlFVRk5MRU5CUVVNc1dVRkJVQ3hEUVVGdlFpeEpRVUZ3UWl4RlFVRXdRaXhOUVVGTkxFTkJRVU1zU1VGQlVDeERRVUZaTEZGQlFWb3NSVUZCTVVJN1FVRkRRU3hKUVVGQkxFMUJRVTBzUTBGQlF5eFpRVUZRTEVOQlFXOUNMRWxCUVhCQ0xFVkJRVEJDTEUxQlFVMHNRMEZCUXl4SFFVRlFMRU5CUVZjc1VVRkJXQ3hGUVVFeFFqdEJRVU5CTEVsQlFVRXNUVUZCVFN4RFFVRkRMRmxCUVZBc1EwRkJiMElzU1VGQmNFSXNSVUZCTUVJc1RVRkJUU3hEUVVGRExFMUJRVkFzUTBGQll5eFJRVUZrTEVWQlFURkNPMEZCUTBFc1IwRk1UU3hOUVV0QkxFbEJRVWtzU1VGQlNTeExRVUZMTEU5QlFXSXNSVUZCYzBJN1FVRkROVUlzU1VGQlFTeE5RVUZOTEVOQlFVTXNXVUZCVUN4RFFVRnZRaXhKUVVGd1FpeEZRVUV3UWl4TlFVRk5MRU5CUVVNc1MwRkJVQ3hEUVVGaExGRkJRV0lzUlVGQk1VSTdRVUZEUVN4SlFVRkJMRTFCUVUwc1EwRkJReXhaUVVGUUxFTkJRVzlDTEVsQlFYQkNMRVZCUVRCQ0xFMUJRVTBzUTBGQlF5eExRVUZRTEVOQlFXRXNVVUZCWWl4RlFVRXhRanRCUVVOQkxFbEJRVUVzVFVGQlRTeERRVUZETEZsQlFWQXNRMEZCYjBJc1NVRkJjRUlzUlVGQk1FSXNUVUZCVFN4RFFVRkRMRWRCUVZBc1EwRkJWeXhSUVVGWUxFVkJRVEZDTzBGQlEwRXNTVUZCUVN4TlFVRk5MRU5CUVVNc1dVRkJVQ3hEUVVGdlFpeEpRVUZ3UWl4RlFVRXdRaXhOUVVGTkxFTkJRVU1zVFVGQlVDeERRVUZqTEZGQlFXUXNSVUZCTVVJN1FVRkRRU3hIUVV4TkxFMUJTMEVzU1VGQlNTeEpRVUZKTEV0QlFVc3NVVUZCWWl4RlFVRjFRanRCUVVNM1FpeEpRVUZCTEUxQlFVMHNRMEZCUXl4WlFVRlFMRU5CUVc5Q0xFbEJRWEJDTEVWQlFUQkNMRTFCUVUwc1EwRkJReXhKUVVGUUxFTkJRVmtzVVVGQldpeEZRVUV4UWp0QlFVTkJMRWxCUVVFc1RVRkJUU3hEUVVGRExGbEJRVkFzUTBGQmIwSXNTVUZCY0VJc1JVRkJNRUlzVFVGQlRTeERRVUZETEV0QlFWQXNRMEZCWVN4UlFVRmlMRVZCUVRGQ08wRkJRMEVzU1VGQlFTeE5RVUZOTEVOQlFVTXNXVUZCVUN4RFFVRnZRaXhKUVVGd1FpeEZRVUV3UWl4TlFVRk5MRU5CUVVNc1RVRkJVQ3hEUVVGakxGRkJRV1FzUlVGQk1VSTdRVUZEUVN4SlFVRkJMRTFCUVUwc1EwRkJReXhaUVVGUUxFTkJRVzlDTEVsQlFYQkNMRVZCUVRCQ0xFMUJRVTBzUTBGQlF5eE5RVUZRTEVOQlFXTXNVVUZCWkN4RlFVRXhRanRCUVVOQk96dEJRVU5FTEZOQlFVOHNUVUZCVUR0QlFVTkJPenRCUVVWRUxGTkJRVk1zWlVGQlZDeERRVUY1UWl4UFFVRjZRaXhGUVVGeFJDeFBRVUZ5UkN4RlFVRnRSenRCUVVOc1J5eFJRVUZOTEZOQlFWTXNSMEZCUnl4UFFVRlBMRU5CUVVNc1YwRkJVaXhEUVVGdlFpeGxRVUZ3UWl4RFFVRnZReXhwUWtGQmNFTXNSVUZCYTBRc1IwRkJiRVFzUTBGQmJFSTdPMEZCUTBFc1RVRkJTU3hQUVVGUExFTkJRVU1zU1VGQlVpeEpRVUZuUWl4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGU0xFTkJRV0VzVlVGQllpeERRVUYzUWl4aFFVRjRRaXhEUVVGeVFpeEZRVUUyUkR0QlFVTTFSQ3hKUVVGQkxGTkJRVk1zUTBGQlF5eFpRVUZXTEVOQlFYVkNMRTFCUVhaQ0xFVkJRU3RDTEU5QlFVOHNRMEZCUXl4SlFVRjJRenRCUVVOQk96dEJRVU5FTEUxQlFVa3NUMEZCVHl4RFFVRkRMRWRCUVZvc1JVRkJhVUk3UVVGRGFFSXNTVUZCUVN4VFFVRlRMRU5CUVVNc1dVRkJWaXhEUVVGMVFpeExRVUYyUWl4RlFVRTRRaXhQUVVGUExFTkJRVU1zUjBGQmRFTTdRVUZEUVRzN1FVRkRSQ3hOUVVGSkxFOUJRVThzUTBGQlF5eE5RVUZhTEVWQlFXOUNPMEZCUTI1Q0xFbEJRVUVzVTBGQlV5eERRVUZETEZsQlFWWXNRMEZCZFVJc1VVRkJka0lzUlVGQmFVTXNUMEZCVHl4RFFVRkRMRTFCUVhwRE8wRkJRMEU3TzBGQlEwUXNUVUZCU1N4UFFVRlBMRU5CUVVNc1VVRkJXaXhGUVVGelFqdEJRVU55UWl4SlFVRkJMRk5CUVZNc1EwRkJReXhaUVVGV0xFTkJRWFZDTEZWQlFYWkNMRVZCUVcxRExFOUJRVThzUTBGQlF5eFJRVUV6UXp0QlFVTkJPenRCUVVORUxGTkJRVThzVTBGQlVEdEJRVU5CSWl3aWMyOTFjbU5sVW05dmRDSTZJaUo5IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgX2V4cG9ydE5hbWVzID0ge1xuICBkb2N1bWVudFRvU1ZHOiB0cnVlLFxuICBlbGVtZW50VG9TVkc6IHRydWUsXG4gIGlubGluZVJlc291cmNlczogdHJ1ZSxcbiAgZmV0Y2hBc0RhdGFVUkw6IHRydWVcbn07XG5leHBvcnRzLmRvY3VtZW50VG9TVkcgPSBkb2N1bWVudFRvU1ZHO1xuZXhwb3J0cy5lbGVtZW50VG9TVkcgPSBlbGVtZW50VG9TVkc7XG5leHBvcnRzLmlubGluZVJlc291cmNlcyA9IGlubGluZVJlc291cmNlcztcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImZldGNoQXNEYXRhVVJMXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF9pbmxpbmUuZmV0Y2hBc0RhdGFVUkw7XG4gIH1cbn0pO1xuXG52YXIgX2RvbSA9IHJlcXVpcmUoXCIuL2RvbS5qc1wiKTtcblxudmFyIF9pbmxpbmUgPSByZXF1aXJlKFwiLi9pbmxpbmVcIik7XG5cbnZhciBfdHJhdmVyc2FsID0gcmVxdWlyZShcIi4vdHJhdmVyc2FsLmpzXCIpO1xuXG52YXIgX3N0YWNraW5nID0gcmVxdWlyZShcIi4vc3RhY2tpbmcuanNcIik7XG5cbnZhciBfdXRpbCA9IHJlcXVpcmUoXCIuL3V0aWwuanNcIik7XG5cbnZhciBfY3NzID0gcmVxdWlyZShcIi4vY3NzLmpzXCIpO1xuXG52YXIgX3NlcmlhbGl6ZSA9IHJlcXVpcmUoXCIuL3NlcmlhbGl6ZS5qc1wiKTtcblxuT2JqZWN0LmtleXMoX3NlcmlhbGl6ZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gIGlmIChrZXkgPT09IFwiZGVmYXVsdFwiIHx8IGtleSA9PT0gXCJfX2VzTW9kdWxlXCIpIHJldHVybjtcbiAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChfZXhwb3J0TmFtZXMsIGtleSkpIHJldHVybjtcbiAgaWYgKGtleSBpbiBleHBvcnRzICYmIGV4cG9ydHNba2V5XSA9PT0gX3NlcmlhbGl6ZVtrZXldKSByZXR1cm47XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIF9zZXJpYWxpemVba2V5XTtcbiAgICB9XG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIGRvY3VtZW50VG9TVkcoZG9jdW1lbnQsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGVsZW1lbnRUb1NWRyhkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIG9wdGlvbnMpO1xufVxuXG5mdW5jdGlvbiBlbGVtZW50VG9TVkcoZWxlbWVudCwgb3B0aW9ucykge1xuICB2YXIgX29wdGlvbnMkY2FwdHVyZUFyZWEsIF9vcHRpb25zJGNhcHR1cmVBcmVhMjtcblxuICBjb25zdCBzdmdEb2N1bWVudCA9IGVsZW1lbnQub3duZXJEb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVEb2N1bWVudChfZG9tLnN2Z05hbWVzcGFjZSwgJ3N2ZycsIG51bGwpO1xuICBjb25zdCBzdmdFbGVtZW50ID0gc3ZnRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICBzdmdFbGVtZW50LnNldEF0dHJpYnV0ZSgneG1sbnMnLCBfZG9tLnN2Z05hbWVzcGFjZSk7XG4gIHN2Z0VsZW1lbnQuc2V0QXR0cmlidXRlKCd4bWxuczp4bGluaycsIF9kb20ueGxpbmtOYW1lc3BhY2UpO1xuICBzdmdFbGVtZW50LmFwcGVuZChzdmdEb2N1bWVudC5jcmVhdGVDb21tZW50KGAgR2VuZXJhdGVkIGJ5IGRvbS10by1zdmcgZnJvbSAke2VsZW1lbnQub3duZXJEb2N1bWVudC5sb2NhdGlvbi5ocmVmfSBgKSk7IC8vIENvcHkgQGZvbnQtZmFjZSBydWxlc1xuXG4gIGNvbnN0IHN0eWxlRWxlbWVudCA9IHN2Z0RvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhfZG9tLnN2Z05hbWVzcGFjZSwgJ3N0eWxlJyk7XG5cbiAgZm9yIChjb25zdCBzdHlsZVNoZWV0IG9mIGVsZW1lbnQub3duZXJEb2N1bWVudC5zdHlsZVNoZWV0cykge1xuICAgIGxldCBydWxlcztcblxuICAgIHRyeSB7XG4gICAgICBydWxlcyA9IHN0eWxlU2hlZXQucnVsZXM7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvdWxkIG5vdCBhY2Nlc3MgcnVsZXMgb2Ygc3R5bGVTaGVldCcsIHN0eWxlU2hlZXQsIGVycm9yKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHJ1bGUgb2YgKF9ydWxlcyA9IHJ1bGVzKSAhPT0gbnVsbCAmJiBfcnVsZXMgIT09IHZvaWQgMCA/IF9ydWxlcyA6IFtdKSB7XG4gICAgICB2YXIgX3J1bGVzO1xuXG4gICAgICBpZiAoKDAsIF9jc3MuaXNDU1NGb250RmFjZVJ1bGUpKHJ1bGUpKSB7XG4gICAgICAgIHZhciBfcnVsZSRwYXJlbnRTdHlsZVNoZWU7XG5cbiAgICAgICAgY29uc3Qgc3R5bGVTaGVldEhyZWYgPSAoX3J1bGUkcGFyZW50U3R5bGVTaGVlID0gcnVsZS5wYXJlbnRTdHlsZVNoZWV0KSA9PT0gbnVsbCB8fCBfcnVsZSRwYXJlbnRTdHlsZVNoZWUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9ydWxlJHBhcmVudFN0eWxlU2hlZS5ocmVmO1xuXG4gICAgICAgIGlmIChzdHlsZVNoZWV0SHJlZikge1xuICAgICAgICAgIHJ1bGUuc3R5bGUuc3JjID0gKDAsIF9jc3MucGFyc2VGb250RmFjZVNvdXJjZVVybHMpKHJ1bGUuc3R5bGUuc3JjKS5tYXAoc291cmNlID0+ICd1cmwnIGluIHNvdXJjZSA/IHsgLi4uc291cmNlLFxuICAgICAgICAgICAgdXJsOiBuZXcgVVJMKHNvdXJjZS51cmwsIHN0eWxlU2hlZXRIcmVmKVxuICAgICAgICAgIH0gOiBzb3VyY2UpLm1hcChzb3VyY2UgPT4ge1xuICAgICAgICAgICAgaWYgKCd1cmwnIGluIHNvdXJjZSkge1xuICAgICAgICAgICAgICByZXR1cm4gYHVybCgke3NvdXJjZS51cmwuaHJlZn0pYCArIChzb3VyY2UuZm9ybWF0ID8gYCBmb3JtYXQoJHtzb3VyY2UuZm9ybWF0fSlgIDogJycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYGxvY2FsKCR7c291cmNlLmxvY2FsfSlgO1xuICAgICAgICAgIH0pLmpvaW4oJywgJyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdHlsZUVsZW1lbnQuYXBwZW5kKHJ1bGUuY3NzVGV4dCwgJ1xcbicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN2Z0VsZW1lbnQuYXBwZW5kKHN0eWxlRWxlbWVudCk7XG4gICgwLCBfdHJhdmVyc2FsLndhbGtOb2RlKShlbGVtZW50LCB7XG4gICAgc3ZnRG9jdW1lbnQsXG4gICAgY3VycmVudFN2Z1BhcmVudDogc3ZnRWxlbWVudCxcbiAgICBzdGFja2luZ0xheWVyczogKDAsIF9zdGFja2luZy5jcmVhdGVTdGFja2luZ0xheWVycykoc3ZnRWxlbWVudCksXG4gICAgcGFyZW50U3RhY2tpbmdMYXllcjogc3ZnRWxlbWVudCxcbiAgICBnZXRVbmlxdWVJZDogKDAsIF91dGlsLmNyZWF0ZUNvdW50ZXIpKCksXG4gICAgbGFiZWxzOiBuZXcgTWFwKCksXG4gICAgY2FwdHVyZUFyZWE6IChfb3B0aW9ucyRjYXB0dXJlQXJlYSA9IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5jYXB0dXJlQXJlYSkgIT09IG51bGwgJiYgX29wdGlvbnMkY2FwdHVyZUFyZWEgIT09IHZvaWQgMCA/IF9vcHRpb25zJGNhcHR1cmVBcmVhIDogZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICB9KTtcbiAgY29uc3QgYm91bmRzID0gKF9vcHRpb25zJGNhcHR1cmVBcmVhMiA9IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5jYXB0dXJlQXJlYSkgIT09IG51bGwgJiYgX29wdGlvbnMkY2FwdHVyZUFyZWEyICE9PSB2b2lkIDAgPyBfb3B0aW9ucyRjYXB0dXJlQXJlYTIgOiBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBzdmdFbGVtZW50LnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBib3VuZHMud2lkdGgudG9TdHJpbmcoKSk7XG4gIHN2Z0VsZW1lbnQuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBib3VuZHMuaGVpZ2h0LnRvU3RyaW5nKCkpO1xuICBzdmdFbGVtZW50LnNldEF0dHJpYnV0ZSgndmlld0JveCcsIGAke2JvdW5kcy54fSAke2JvdW5kcy55fSAke2JvdW5kcy53aWR0aH0gJHtib3VuZHMuaGVpZ2h0fWApO1xuICByZXR1cm4gc3ZnRG9jdW1lbnQ7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGlubGluZVJlc291cmNlcyhlbGVtZW50LCBvcHRpb25zID0ge30pIHtcbiAgY29uc3Qge1xuICAgIGZldGNoQXNEYXRhVVJMID0gX2lubGluZS5mZXRjaEFzRGF0YVVSTFxuICB9ID0gb3B0aW9ucztcblxuICBpZiAoKDAsIF9kb20uaXNTVkdJbWFnZUVsZW1lbnQpKGVsZW1lbnQpKSB7XG4gICAgY29uc3QgZGF0YVVSTCA9IGF3YWl0IGZldGNoQXNEYXRhVVJMKGVsZW1lbnQuaHJlZi5iYXNlVmFsKTtcbiAgICBlbGVtZW50LmRhdGFzZXQuc3JjID0gZWxlbWVudC5ocmVmLmJhc2VWYWw7XG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBkYXRhVVJMLmhyZWYpO1xuICB9IGVsc2UgaWYgKCgwLCBfZG9tLmlzU1ZHU3R5bGVFbGVtZW50KShlbGVtZW50KSAmJiBlbGVtZW50LnNoZWV0KSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJ1bGVzID0gZWxlbWVudC5zaGVldC5jc3NSdWxlcztcblxuICAgICAgZm9yIChjb25zdCBydWxlIG9mIHJ1bGVzKSB7XG4gICAgICAgIGlmICgoMCwgX2Nzcy5pc0NTU0ZvbnRGYWNlUnVsZSkocnVsZSkpIHtcbiAgICAgICAgICBjb25zdCBzb3VyY2VzID0gKDAsIF9jc3MucGFyc2VGb250RmFjZVNvdXJjZVVybHMpKHJ1bGUuc3R5bGUuc3JjKTtcbiAgICAgICAgICBjb25zdCByZXNvbHZlZFNvdXJjZXMgPSBhd2FpdCBQcm9taXNlLmFsbChzb3VyY2VzLm1hcChhc3luYyBzb3VyY2UgPT4ge1xuICAgICAgICAgICAgaWYgKCEoJ3VybCcgaW4gc291cmNlKSkge1xuICAgICAgICAgICAgICByZXR1cm4gc291cmNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBkYXRhVXJsID0gYXdhaXQgZmV0Y2hBc0RhdGFVUkwoc291cmNlLnVybCk7XG4gICAgICAgICAgICByZXR1cm4geyAuLi5zb3VyY2UsXG4gICAgICAgICAgICAgIHVybDogZGF0YVVybFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgICAgcnVsZS5zdHlsZS5zcmMgPSByZXNvbHZlZFNvdXJjZXMubWFwKHNvdXJjZSA9PiB7XG4gICAgICAgICAgICBpZiAoJ2xvY2FsJyBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZS5sb2NhbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFtgdXJsKCR7c291cmNlLnVybC5ocmVmfSlgLCBzb3VyY2UuZm9ybWF0ICYmIGBmb3JtYXQoJHtzb3VyY2UuZm9ybWF0fSlgXS5maWx0ZXIoQm9vbGVhbikuam9pbignICcpO1xuICAgICAgICAgIH0pLmpvaW4oJywgJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgaW5saW5pbmcgc3R5bGVzaGVldCcsIGVsZW1lbnQuc2hlZXQsIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBhd2FpdCBQcm9taXNlLmFsbChbLi4uZWxlbWVudC5jaGlsZHJlbl0ubWFwKGVsZW1lbnQgPT4gaW5saW5lUmVzb3VyY2VzKGVsZW1lbnQsIG9wdGlvbnMpKSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1TDNOeVl5OXBibVJsZUM1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN096czdPenM3T3pzN096czdRVUZCUVRzN1FVRkRRVHM3UVVGRFFUczdRVUZEUVRzN1FVRkRRVHM3UVVGRFFUczdRVUZGUVRzN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk96dEJRVlZOTEZOQlFWVXNZVUZCVml4RFFVRjNRaXhSUVVGNFFpeEZRVUUwUXl4UFFVRTFReXhGUVVGeFJUdEJRVU14UlN4VFFVRlBMRmxCUVZrc1EwRkJReXhSUVVGUkxFTkJRVU1zWlVGQlZpeEZRVUV5UWl4UFFVRXpRaXhEUVVGdVFqdEJRVU5CT3p0QlFVVkxMRk5CUVZVc1dVRkJWaXhEUVVGMVFpeFBRVUYyUWl4RlFVRjVReXhQUVVGNlF5eEZRVUZyUlR0QlFVRkJPenRCUVVOMlJTeFJRVUZOTEZkQlFWY3NSMEZCUnl4UFFVRlBMRU5CUVVNc1lVRkJVaXhEUVVGelFpeGpRVUYwUWl4RFFVRnhReXhqUVVGeVF5eERRVUZ2UkN4cFFrRkJjRVFzUlVGQmEwVXNTMEZCYkVVc1JVRkJlVVVzU1VGQmVrVXNRMEZCY0VJN1FVRkZRU3hSUVVGTkxGVkJRVlVzUjBGQlNTeFhRVUZYTEVOQlFVTXNaVUZCYUVNN1FVRkRRU3hGUVVGQkxGVkJRVlVzUTBGQlF5eFpRVUZZTEVOQlFYZENMRTlCUVhoQ0xFVkJRV2xETEdsQ1FVRnFRenRCUVVOQkxFVkJRVUVzVlVGQlZTeERRVUZETEZsQlFWZ3NRMEZCZDBJc1lVRkJlRUlzUlVGQmRVTXNiVUpCUVhaRE8wRkJRMEVzUlVGQlFTeFZRVUZWTEVOQlFVTXNUVUZCV0N4RFFVTkRMRmRCUVZjc1EwRkJReXhoUVVGYUxFTkJRVEJDTEdsRFFVRnBReXhQUVVGUExFTkJRVU1zWVVGQlVpeERRVUZ6UWl4UlFVRjBRaXhEUVVFclFpeEpRVUZKTEVkQlFUbEdMRU5CUkVRc1JVRk9kVVVzUTBGVmRrVTdPMEZCUTBFc1VVRkJUU3haUVVGWkxFZEJRVWNzVjBGQlZ5eERRVUZETEdWQlFWb3NRMEZCTkVJc2FVSkJRVFZDTEVWQlFUQkRMRTlCUVRGRExFTkJRWEpDT3p0QlFVTkJMRTlCUVVzc1RVRkJUU3hWUVVGWUxFbEJRWGxDTEU5QlFVOHNRMEZCUXl4aFFVRlNMRU5CUVhOQ0xGZEJRUzlETEVWQlFUUkVPMEZCUXpORUxGRkJRVWtzUzBGQlNqczdRVUZEUVN4UlFVRkpPMEZCUTBnc1RVRkJRU3hMUVVGTExFZEJRVWNzVlVGQlZTeERRVUZETEV0QlFXNUNPMEZCUTBFc1MwRkdSQ3hEUVVWRkxFOUJRVThzUzBGQlVDeEZRVUZqTzBGQlEyWXNUVUZCUVN4UFFVRlBMRU5CUVVNc1MwRkJVaXhEUVVGakxITkRRVUZrTEVWQlFYTkVMRlZCUVhSRUxFVkJRV3RGTEV0QlFXeEZPMEZCUTBFN08wRkJRMFFzVTBGQlN5eE5RVUZOTEVsQlFWZ3NZMEZCYlVJc1MwRkJia0lzTWtOQlFUUkNMRVZCUVRWQ0xFVkJRV2RETzBGQlFVRTdPMEZCUXk5Q0xGVkJRVWtzTkVKQlFXdENMRWxCUVd4Q0xFTkJRVW9zUlVGQk5rSTdRVUZCUVRzN1FVRkROVUlzWTBGQlRTeGpRVUZqTERSQ1FVRkhMRWxCUVVrc1EwRkJReXhuUWtGQlVpd3dSRUZCUnl4elFrRkJkVUlzU1VGQk9VTTdPMEZCUTBFc1dVRkJTU3hqUVVGS0xFVkJRVzlDTzBGQlEyNUNMRlZCUVVFc1NVRkJTU3hEUVVGRExFdEJRVXdzUTBGQlZ5eEhRVUZZTEVkQlFXbENMR3REUVVGM1FpeEpRVUZKTEVOQlFVTXNTMEZCVEN4RFFVRlhMRWRCUVc1RExFVkJRMllzUjBGRVpTeERRVU5ZTEUxQlFVMHNTVUZEVml4VFFVRlRMRTFCUVZRc1IwRkJhMElzUlVGQlJTeEhRVUZITEUxQlFVdzdRVUZCWVN4WlFVRkJMRWRCUVVjc1JVRkJSU3hKUVVGSkxFZEJRVW9zUTBGQlVTeE5RVUZOTEVOQlFVTXNSMEZCWml4RlFVRnZRaXhqUVVGd1FqdEJRVUZzUWl4WFFVRnNRaXhIUVVFMFJTeE5RVVkzUkN4RlFVbG1MRWRCU21Vc1EwRkpXQ3hOUVVGTkxFbEJRVWM3UVVGRFlpeG5Ra0ZCU1N4VFFVRlRMRTFCUVdJc1JVRkJjVUk3UVVGRGNFSXNjVUpCUVU4c1QwRkJUeXhOUVVGTkxFTkJRVU1zUjBGQlVDeERRVUZYTEVsQlFVa3NSMEZCZEVJc1NVRkJOa0lzVFVGQlRTeERRVUZETEUxQlFWQXNSMEZCWjBJc1YwRkJWeXhOUVVGTkxFTkJRVU1zVFVGQlRTeEhRVUY0UXl4SFFVRTRReXhGUVVFelJTeERRVUZRTzBGQlEwRTdPMEZCUTBRc2JVSkJRVThzVTBGQlV5eE5RVUZOTEVOQlFVTXNTMEZCU3l4SFFVRTFRanRCUVVOQkxGZEJWR1VzUlVGVlppeEpRVlpsTEVOQlZWWXNTVUZXVlN4RFFVRnFRanRCUVZkQk96dEJRVU5FTEZGQlFVRXNXVUZCV1N4RFFVRkRMRTFCUVdJc1EwRkJiMElzU1VGQlNTeERRVUZETEU5QlFYcENMRVZCUVd0RExFbEJRV3hETzBGQlEwRTdRVUZEUkR0QlFVTkVPenRCUVVORUxFVkJRVUVzVlVGQlZTeERRVUZETEUxQlFWZ3NRMEZCYTBJc1dVRkJiRUk3UVVGRlFTd3lRa0ZCVXl4UFFVRlVMRVZCUVd0Q08wRkJRMnBDTEVsQlFVRXNWMEZFYVVJN1FVRkZha0lzU1VGQlFTeG5Ra0ZCWjBJc1JVRkJSU3hWUVVaRU8wRkJSMnBDTEVsQlFVRXNZMEZCWXl4RlFVRkZMRzlEUVVGeFFpeFZRVUZ5UWl4RFFVaERPMEZCU1dwQ0xFbEJRVUVzYlVKQlFXMUNMRVZCUVVVc1ZVRktTanRCUVV0cVFpeEpRVUZCTEZkQlFWY3NSVUZCUlN3d1FrRk1TVHRCUVUxcVFpeEpRVUZCTEUxQlFVMHNSVUZCUlN4SlFVRkpMRWRCUVVvc1JVRk9VenRCUVU5cVFpeEpRVUZCTEZkQlFWY3NNRUpCUVVVc1QwRkJSaXhoUVVGRkxFOUJRVVlzZFVKQlFVVXNUMEZCVHl4RFFVRkZMRmRCUVZnc2RVVkJRVEJDTEU5QlFVOHNRMEZCUXl4eFFrRkJVanRCUVZCd1FpeEhRVUZzUWp0QlFWVkJMRkZCUVUwc1RVRkJUU3cwUWtGQlJ5eFBRVUZJTEdGQlFVY3NUMEZCU0N4MVFrRkJSeXhQUVVGUExFTkJRVVVzVjBGQldpeDVSVUZCTWtJc1QwRkJUeXhEUVVGRExIRkNRVUZTTEVWQlFYWkRPMEZCUTBFc1JVRkJRU3hWUVVGVkxFTkJRVU1zV1VGQldDeERRVUYzUWl4UFFVRjRRaXhGUVVGcFF5eE5RVUZOTEVOQlFVTXNTMEZCVUN4RFFVRmhMRkZCUVdJc1JVRkJha003UVVGRFFTeEZRVUZCTEZWQlFWVXNRMEZCUXl4WlFVRllMRU5CUVhkQ0xGRkJRWGhDTEVWQlFXdERMRTFCUVUwc1EwRkJReXhOUVVGUUxFTkJRV01zVVVGQlpDeEZRVUZzUXp0QlFVTkJMRVZCUVVFc1ZVRkJWU3hEUVVGRExGbEJRVmdzUTBGQmQwSXNVMEZCZUVJc1JVRkJiVU1zUjBGQlJ5eE5RVUZOTEVOQlFVTXNRMEZCUXl4SlFVRkpMRTFCUVUwc1EwRkJReXhEUVVGRExFbEJRVWtzVFVGQlRTeERRVUZETEV0QlFVc3NTVUZCU1N4TlFVRk5MRU5CUVVNc1RVRkJUU3hGUVVFelJqdEJRVVZCTEZOQlFVOHNWMEZCVUR0QlFVTkJPenRCUVZWTkxHVkJRV1VzWlVGQlppeERRVUVyUWl4UFFVRXZRaXhGUVVGcFJDeFBRVUZCTEVkQlFXdERMRVZCUVc1R0xFVkJRWEZHTzBGQlF6TkdMRkZCUVUwN1FVRkJSU3hKUVVGQkxHTkJRV01zUjBGQlJ6dEJRVUZ1UWl4TlFVRTJReXhQUVVGdVJEczdRVUZEUVN4TlFVRkpMRFJDUVVGclFpeFBRVUZzUWl4RFFVRktMRVZCUVdkRE8wRkJReTlDTEZWQlFVMHNUMEZCVHl4SFFVRkhMRTFCUVUwc1kwRkJZeXhEUVVGRExFOUJRVThzUTBGQlF5eEpRVUZTTEVOQlFXRXNUMEZCWkN4RFFVRndRenRCUVVOQkxFbEJRVUVzVDBGQlR5eERRVUZETEU5QlFWSXNRMEZCWjBJc1IwRkJhRUlzUjBGQmMwSXNUMEZCVHl4RFFVRkRMRWxCUVZJc1EwRkJZU3hQUVVGdVF6dEJRVU5CTEVsQlFVRXNUMEZCVHl4RFFVRkRMRmxCUVZJc1EwRkJjVUlzVFVGQmNrSXNSVUZCTmtJc1QwRkJUeXhEUVVGRExFbEJRWEpETzBGQlEwRXNSMEZLUkN4TlFVbFBMRWxCUVVrc05FSkJRV3RDTEU5QlFXeENMRXRCUVRoQ0xFOUJRVThzUTBGQlF5eExRVUV4UXl4RlFVRnBSRHRCUVVOMlJDeFJRVUZKTzBGQlEwZ3NXVUZCVFN4TFFVRkxMRWRCUVVjc1QwRkJUeXhEUVVGRExFdEJRVklzUTBGQll5eFJRVUUxUWpzN1FVRkRRU3hYUVVGTExFMUJRVTBzU1VGQldDeEpRVUZ0UWl4TFFVRnVRaXhGUVVFd1FqdEJRVU42UWl4WlFVRkpMRFJDUVVGclFpeEpRVUZzUWl4RFFVRktMRVZCUVRaQ08wRkJRelZDTEdkQ1FVRk5MRTlCUVU4c1IwRkJSeXhyUTBGQmQwSXNTVUZCU1N4RFFVRkRMRXRCUVV3c1EwRkJWeXhIUVVGdVF5eERRVUZvUWp0QlFVTkJMR2RDUVVGTkxHVkJRV1VzUjBGQlJ5eE5RVUZOTEU5QlFVOHNRMEZCUXl4SFFVRlNMRU5CUXpkQ0xFOUJRVThzUTBGQlF5eEhRVUZTTEVOQlFWa3NUVUZCVFN4TlFVRk9MRWxCUVdVN1FVRkRNVUlzWjBKQlFVa3NSVUZCUlN4VFFVRlRMRTFCUVZnc1EwRkJTaXhGUVVGM1FqdEJRVU4yUWl4eFFrRkJUeXhOUVVGUU8wRkJRMEU3TzBGQlEwUXNhMEpCUVUwc1QwRkJUeXhIUVVGSExFMUJRVTBzWTBGQll5eERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRlNMRU5CUVhCRE8wRkJRMEVzYlVKQlFVOHNSVUZCUlN4SFFVRkhMRTFCUVV3N1FVRkJZU3hqUVVGQkxFZEJRVWNzUlVGQlJUdEJRVUZzUWl4aFFVRlFPMEZCUTBFc1YwRk9SQ3hEUVVRMlFpeERRVUU1UWp0QlFWTkJMRlZCUVVFc1NVRkJTU3hEUVVGRExFdEJRVXdzUTBGQlZ5eEhRVUZZTEVkQlFXbENMR1ZCUVdVc1EwRkRPVUlzUjBGRVpTeERRVU5ZTEUxQlFVMHNTVUZCUnp0QlFVTmlMR2RDUVVGSkxGZEJRVmNzVFVGQlppeEZRVUYxUWp0QlFVTjBRaXh4UWtGQlR5eE5RVUZOTEVOQlFVTXNTMEZCWkR0QlFVTkJPenRCUVVORUxHMUNRVUZQTEVOQlFVTXNUMEZCVHl4TlFVRk5MRU5CUVVNc1IwRkJVQ3hEUVVGWExFbEJRVWtzUjBGQmRrSXNSVUZCTkVJc1RVRkJUU3hEUVVGRExFMUJRVkFzU1VGQmFVSXNWVUZCVlN4TlFVRk5MRU5CUVVNc1RVRkJUU3hIUVVGd1JTeEZRVU5NTEUxQlJFc3NRMEZEUlN4UFFVUkdMRVZCUlV3c1NVRkdTeXhEUVVWQkxFZEJSa0VzUTBGQlVEdEJRVWRCTEZkQlVtVXNSVUZUWml4SlFWUmxMRU5CVTFZc1NVRlVWU3hEUVVGcVFqdEJRVlZCTzBGQlEwUTdRVUZEUkN4TFFURkNSQ3hEUVRCQ1JTeFBRVUZQTEV0QlFWQXNSVUZCWXp0QlFVTm1MRTFCUVVFc1QwRkJUeXhEUVVGRExFdEJRVklzUTBGQll5d3lRa0ZCWkN4RlFVRXlReXhQUVVGUExFTkJRVU1zUzBGQmJrUXNSVUZCTUVRc1MwRkJNVVE3UVVGRFFUdEJRVU5FT3p0QlFVTkVMRkZCUVUwc1QwRkJUeXhEUVVGRExFZEJRVklzUTBGQldTeERRVUZETEVkQlFVY3NUMEZCVHl4RFFVRkRMRkZCUVZvc1JVRkJjMElzUjBGQmRFSXNRMEZCTUVJc1QwRkJUeXhKUVVGSkxHVkJRV1VzUTBGQlF5eFBRVUZFTEVWQlFWVXNUMEZCVml4RFFVRndSQ3hEUVVGYUxFTkJRVTQ3UVVGRFFTSXNJbk52ZFhKalpWSnZiM1FpT2lJaWZRPT0iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZmV0Y2hBc0RhdGFVUkwgPSBmZXRjaEFzRGF0YVVSTDtcblxudmFyIF90eXBlSXMgPSByZXF1aXJlKFwidHlwZS1pc1wiKTtcblxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hBc0RhdGFVUkwodXJsLCBvcHRpb25zID0ge30pIHtcbiAgaWYgKCF1cmwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIFVSTCBwYXNzZWQnKTtcbiAgfVxuXG4gIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuXG4gIGlmIChvcHRpb25zLmFjY2VwdCkge1xuICAgIGhlYWRlcnMuc2V0KCdBY2NlcHQnLCBvcHRpb25zLmFjY2VwdC5qb2luKCcsICcpKTtcbiAgfVxuXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgaGVhZGVyc1xuICB9KTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICB9XG5cbiAgY29uc3QgY29udGVudFR5cGUgPSByZXNwb25zZS5oZWFkZXJzLmdldCgnQ29udGVudC1UeXBlJyk7IC8vIERvIGFuIGFkZGl0aW9uYWwgY2xpZW50LXNpZGUgY2hlY2ssIGluIGNhc2UgdGhlIHNlcnZlciBkb2VzIG5vdCBoYW5kbGUgdGhlIEFjY2VwdCBoZWFkZXIuXG5cbiAgaWYgKG9wdGlvbnMuYWNjZXB0ICYmICghY29udGVudFR5cGUgfHwgISgwLCBfdHlwZUlzLmlzKShjb250ZW50VHlwZSwgb3B0aW9ucy5hY2NlcHQpKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgQ29udGVudC1UeXBlIG5vdCBhY2NlcHRlZDogJHtTdHJpbmcoY29udGVudFR5cGUpfWApO1xuICB9XG5cbiAgY29uc3QgYmxvYiA9IGF3YWl0IHJlc3BvbnNlLmJsb2IoKTtcbiAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHJlYWRlci5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsICgpID0+IHJlamVjdChuZXcgRXJyb3IoJ0Vycm9yIGxvYWRpbmcgaW1hZ2UnKSkpO1xuICAgIHJlYWRlci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4gcmVzb2x2ZSgpKTtcbiAgICByZWFkZXIucmVhZEFzRGF0YVVSTChibG9iKTtcbiAgfSk7XG4gIHJldHVybiBuZXcgVVJMKHJlYWRlci5yZXN1bHQpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUwzTnlZeTlwYm14cGJtVXVkSE1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3T3pzN096dEJRVUZCT3p0QlFVMVBMR1ZCUVdVc1kwRkJaaXhEUVVFNFFpeEhRVUU1UWl4RlFVRXlReXhQUVVGQkxFZEJRV2xETEVWQlFUVkZMRVZCUVRoRk8wRkJRM0JHTEUxQlFVa3NRMEZCUXl4SFFVRk1MRVZCUVZVN1FVRkRWQ3hWUVVGTkxFbEJRVWtzUzBGQlNpeERRVUZWTEdWQlFWWXNRMEZCVGp0QlFVTkJPenRCUVVORUxGRkJRVTBzVDBGQlR5eEhRVUZITEVsQlFVa3NUMEZCU2l4RlFVRm9RanM3UVVGRFFTeE5RVUZKTEU5QlFVOHNRMEZCUXl4TlFVRmFMRVZCUVc5Q08wRkJRMjVDTEVsQlFVRXNUMEZCVHl4RFFVRkRMRWRCUVZJc1EwRkJXU3hSUVVGYUxFVkJRWE5DTEU5QlFVOHNRMEZCUXl4TlFVRlNMRU5CUVdVc1NVRkJaaXhEUVVGdlFpeEpRVUZ3UWl4RFFVRjBRanRCUVVOQk96dEJRVU5FTEZGQlFVMHNVVUZCVVN4SFFVRkhMRTFCUVUwc1MwRkJTeXhEUVVGRExFZEJRVVFzUlVGQlRUdEJRVUZGTEVsQlFVRTdRVUZCUml4SFFVRk9MRU5CUVRWQ096dEJRVU5CTEUxQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1JVRkJaQ3hGUVVGclFqdEJRVU5xUWl4VlFVRk5MRWxCUVVrc1MwRkJTaXhEUVVGVkxGRkJRVkVzUTBGQlF5eFZRVUZ1UWl4RFFVRk9PMEZCUTBFN08wRkJRMFFzVVVGQlRTeFhRVUZYTEVkQlFVY3NVVUZCVVN4RFFVRkRMRTlCUVZRc1EwRkJhVUlzUjBGQmFrSXNRMEZCY1VJc1kwRkJja0lzUTBGQmNFSXNRMEZhYjBZc1EwRmhjRVk3TzBGQlEwRXNUVUZCU1N4UFFVRlBMRU5CUVVNc1RVRkJVaXhMUVVGdFFpeERRVUZETEZkQlFVUXNTVUZCWjBJc1EwRkJReXhuUWtGQll5eFhRVUZrTEVWQlFUSkNMRTlCUVU4c1EwRkJReXhOUVVGdVF5eERRVUZ3UXl4RFFVRktMRVZCUVhGR08wRkJRM0JHTEZWQlFVMHNTVUZCU1N4TFFVRktMRU5CUVZVc09FSkJRVGhDTEUxQlFVMHNRMEZCUXl4WFFVRkVMRU5CUVdFc1JVRkJNMFFzUTBGQlRqdEJRVU5CT3p0QlFVTkVMRkZCUVUwc1NVRkJTU3hIUVVGSExFMUJRVTBzVVVGQlVTeERRVUZETEVsQlFWUXNSVUZCYmtJN1FVRkRRU3hSUVVGTkxFMUJRVTBzUjBGQlJ5eEpRVUZKTEZWQlFVb3NSVUZCWmp0QlFVTkJMRkZCUVUwc1NVRkJTU3hQUVVGS0xFTkJRV3RDTEVOQlFVTXNUMEZCUkN4RlFVRlZMRTFCUVZZc1MwRkJiMEk3UVVGRE0wTXNTVUZCUVN4TlFVRk5MRU5CUVVNc1owSkJRVkFzUTBGQmQwSXNUMEZCZUVJc1JVRkJhVU1zVFVGQlRTeE5RVUZOTEVOQlFVTXNTVUZCU1N4TFFVRktMRU5CUVZVc2NVSkJRVllzUTBGQlJDeERRVUUzUXp0QlFVTkJMRWxCUVVFc1RVRkJUU3hEUVVGRExHZENRVUZRTEVOQlFYZENMRTFCUVhoQ0xFVkJRV2RETEUxQlFVMHNUMEZCVHl4RlFVRTNRenRCUVVOQkxFbEJRVUVzVFVGQlRTeERRVUZETEdGQlFWQXNRMEZCY1VJc1NVRkJja0k3UVVGRFFTeEhRVXBMTEVOQlFVNDdRVUZMUVN4VFFVRlBMRWxCUVVrc1IwRkJTaXhEUVVGUkxFMUJRVTBzUTBGQlF5eE5RVUZtTEVOQlFWQTdRVUZEUVNJc0luTnZkWEpqWlZKdmIzUWlPaUlpZlE9PSIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5mb3JtYXRYTUwgPSBmb3JtYXRYTUw7XG5cbmZ1bmN0aW9uIGZvcm1hdFhNTCh4bWxEb2N1bWVudCkge1xuICAvLyBkZXNjcmliZXMgaG93IHdlIHdhbnQgdG8gbW9kaWZ5IHRoZSBYTUwgLSBpbmRlbnQgZXZlcnl0aGluZ1xuICAvLyBjaGFuZ2UgdG8ganVzdCB0ZXh0KCkgdG8gc3RyaXAgc3BhY2UgaW4gdGV4dCBub2Rlc1xuICBjb25zdCB4c2x0VGV4dERvY3VtZW50ID0gbmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhgXG5cdFx0XHQ8eHNsOnN0eWxlc2hlZXQgeG1sbnM6eHNsPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS9YU0wvVHJhbnNmb3JtXCI+XG5cdFx0XHQ8eHNsOnN0cmlwLXNwYWNlIGVsZW1lbnRzPVwiKlwiLz5cblx0XHRcdDx4c2w6dGVtcGxhdGUgbWF0Y2g9XCJwYXJhW2NvbnRlbnQtc3R5bGVdW25vdCh0ZXh0KCkpXVwiPidcblx0XHRcdFx0PHhzbDp2YWx1ZS1vZiBzZWxlY3Q9XCJub3JtYWxpemUtc3BhY2UoLilcIi8+XG5cdFx0XHQ8L3hzbDp0ZW1wbGF0ZT5cblx0XHRcdDx4c2w6dGVtcGxhdGUgbWF0Y2g9XCJub2RlKCl8QCpcIj5cblx0XHRcdFx0PHhzbDpjb3B5Pjx4c2w6YXBwbHktdGVtcGxhdGVzIHNlbGVjdD1cIm5vZGUoKXxAKlwiLz48L3hzbDpjb3B5PlxuXHRcdFx0PC94c2w6dGVtcGxhdGU+XG5cdFx0XHQ8eHNsOm91dHB1dCBpbmRlbnQ9XCJ5ZXNcIi8+XG5cdFx0XHQ8L3hzbDpzdHlsZXNoZWV0PlxuXHRcdGAsICdhcHBsaWNhdGlvbi94bWwnKTtcbiAgY29uc3QgeHNsdFByb2Nlc3NvciA9IG5ldyBYU0xUUHJvY2Vzc29yKCk7XG4gIHhzbHRQcm9jZXNzb3IuaW1wb3J0U3R5bGVzaGVldCh4c2x0VGV4dERvY3VtZW50KTtcbiAgY29uc3QgZm9ybWF0dGVkRG9jdW1lbnQgPSB4c2x0UHJvY2Vzc29yLnRyYW5zZm9ybVRvRG9jdW1lbnQoeG1sRG9jdW1lbnQpO1xuICByZXR1cm4gZm9ybWF0dGVkRG9jdW1lbnQ7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1TDNOeVl5OXpaWEpwWVd4cGVtVXVkSE1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3T3pzN096dEJRVUZOTEZOQlFWVXNVMEZCVml4RFFVRnZRaXhYUVVGd1FpeEZRVUUwUXp0QlFVTnFSRHRCUVVOQk8wRkJRMEVzVVVGQlRTeG5Ra0ZCWjBJc1IwRkJSeXhKUVVGSkxGTkJRVW9zUjBGQlowSXNaVUZCYUVJc1EwRkRlRUk3T3pzN096czdPenM3TzBGQlYwTXNSMEZhZFVJc1JVRmhlRUlzYVVKQlluZENMRU5CUVhwQ08wRkJaMEpCTEZGQlFVMHNZVUZCWVN4SFFVRkhMRWxCUVVrc1lVRkJTaXhGUVVGMFFqdEJRVU5CTEVWQlFVRXNZVUZCWVN4RFFVRkRMR2RDUVVGa0xFTkJRU3RDTEdkQ1FVRXZRanRCUVVOQkxGRkJRVTBzYVVKQlFXbENMRWRCUVVjc1lVRkJZU3hEUVVGRExHMUNRVUZrTEVOQlFXdERMRmRCUVd4RExFTkJRVEZDTzBGQlEwRXNVMEZCVHl4cFFrRkJVRHRCUVVOQklpd2ljMjkxY21ObFVtOXZkQ0k2SWlKOSIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5lc3RhYmxpc2hlc1N0YWNraW5nQ29udGV4dCA9IGVzdGFibGlzaGVzU3RhY2tpbmdDb250ZXh0O1xuZXhwb3J0cy5jcmVhdGVTdGFja2luZ0xheWVycyA9IGNyZWF0ZVN0YWNraW5nTGF5ZXJzO1xuZXhwb3J0cy5kZXRlcm1pbmVTdGFja2luZ0xheWVyID0gZGV0ZXJtaW5lU3RhY2tpbmdMYXllcjtcbmV4cG9ydHMuc29ydENoaWxkcmVuQnlaSW5kZXggPSBzb3J0Q2hpbGRyZW5CeVpJbmRleDtcbmV4cG9ydHMuc29ydFN0YWNraW5nTGF5ZXJDaGlsZHJlbiA9IHNvcnRTdGFja2luZ0xheWVyQ2hpbGRyZW47XG5cbnZhciBfZG9tID0gcmVxdWlyZShcIi4vZG9tXCIpO1xuXG52YXIgX2NzcyA9IHJlcXVpcmUoXCIuL2Nzc1wiKTtcblxuY29uc3Qgc3RhY2tpbmdDb250ZXh0RXN0YWJsaXNoaW5nUHJvcGVydGllcyA9IG5ldyBTZXQoWydjbGlwUGF0aCcsICdjb250YWluJywgJ2ZpbHRlcicsICdpc29sYXRpb24nLCAnbWFzaycsICdtYXNrQm9yZGVyJywgJ21hc2tJbWFnZScsICdtaXhCbGVuZE1vZGUnLCAnb3BhY2l0eScsICdwZXJzcGVjdGl2ZScsICdwb3NpdGlvbicsICd0cmFuc2Zvcm0nLCAnd2Via2l0T3ZlcmZsb3dTY3JvbGxpbmcnLCAnekluZGV4J10pO1xuXG5mdW5jdGlvbiBlc3RhYmxpc2hlc1N0YWNraW5nQ29udGV4dChzdHlsZXMsIHBhcmVudFN0eWxlcykge1xuICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9DU1MvQ1NTX1Bvc2l0aW9uaW5nL1VuZGVyc3RhbmRpbmdfel9pbmRleC9UaGVfc3RhY2tpbmdfY29udGV4dFxuICByZXR1cm4gISEoKHN0eWxlcy5wb3NpdGlvbiA9PT0gJ2Fic29sdXRlJyB8fCBzdHlsZXMucG9zaXRpb24gPT09ICdyZWxhdGl2ZScpICYmIHN0eWxlcy56SW5kZXggIT09ICdhdXRvJyB8fCBzdHlsZXMucG9zaXRpb24gPT09ICdmaXhlZCcgfHwgc3R5bGVzLnBvc2l0aW9uID09PSAnc3RpY2t5JyB8fCBwYXJlbnRTdHlsZXMgJiYgKHBhcmVudFN0eWxlcy5kaXNwbGF5ID09PSAnZmxleCcgfHwgcGFyZW50U3R5bGVzLmRpc3BsYXkgPT09ICdncmlkJykgJiYgc3R5bGVzLnpJbmRleCAhPT0gJ2F1dG8nIHx8IHBhcnNlRmxvYXQoc3R5bGVzLm9wYWNpdHkpICE9PSAxIHx8IHN0eWxlcy5taXhCbGVuZE1vZGUgIT09ICdub3JtYWwnIHx8IHN0eWxlcy50cmFuc2Zvcm0gIT09ICdub25lJyB8fCBzdHlsZXMuZmlsdGVyICE9PSAnbm9uZScgfHwgc3R5bGVzLnBlcnNwZWN0aXZlICE9PSAnbm9uZScgfHwgc3R5bGVzLmNsaXBQYXRoICE9PSAnbm9uZScgfHwgc3R5bGVzLm1hc2sgIT09ICdub25lJyB8fCBzdHlsZXMubWFza0ltYWdlICE9PSAnbm9uZScgfHwgc3R5bGVzLm1hc2tCb3JkZXIgIT09ICdub25lJyB8fCBzdHlsZXMuaXNvbGF0aW9uID09PSAnaXNvbGF0ZScgfHwgc3R5bGVzLndlYmtpdE92ZXJmbG93U2Nyb2xsaW5nID09PSAndG91Y2gnIHx8IHN0eWxlcy5jb250YWluID09PSAnbGF5b3V0JyB8fCBzdHlsZXMuY29udGFpbiA9PT0gJ3BhaW50JyB8fCBzdHlsZXMuY29udGFpbiA9PT0gJ3N0cmljdCcgfHwgc3R5bGVzLmNvbnRhaW4gPT09ICdjb250ZW50JyB8fCBzdHlsZXMud2lsbENoYW5nZSAmJiBzdHlsZXMud2lsbENoYW5nZS5zcGxpdCgnLCcpLnNvbWUocHJvcGVydHkgPT4gc3RhY2tpbmdDb250ZXh0RXN0YWJsaXNoaW5nUHJvcGVydGllcy5oYXMocHJvcGVydHkudHJpbSgpKSkpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTdGFja2luZ0xheWVyKHBhcmVudCwgbGF5ZXJOYW1lKSB7XG4gIGNvbnN0IGxheWVyID0gcGFyZW50Lm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKF9kb20uc3ZnTmFtZXNwYWNlLCAnZycpO1xuICBsYXllci5kYXRhc2V0LnN0YWNraW5nTGF5ZXIgPSBsYXllck5hbWU7XG4gIHBhcmVudC5hcHBlbmQobGF5ZXIpO1xuICByZXR1cm4gbGF5ZXI7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0YWNraW5nTGF5ZXJzKGNvbnRhaW5lcikge1xuICBjb250YWluZXIuZGF0YXNldC5zdGFja2luZ0NvbnRleHQgPSAndHJ1ZSc7XG4gIHJldHVybiB7XG4gICAgcm9vdEJhY2tncm91bmRBbmRCb3JkZXJzOiBjcmVhdGVTdGFja2luZ0xheWVyKGNvbnRhaW5lciwgJ3Jvb3RCYWNrZ3JvdW5kQW5kQm9yZGVycycpLFxuICAgIGNoaWxkU3RhY2tpbmdDb250ZXh0c1dpdGhOZWdhdGl2ZVN0YWNrTGV2ZWxzOiBjcmVhdGVTdGFja2luZ0xheWVyKGNvbnRhaW5lciwgJ2NoaWxkU3RhY2tpbmdDb250ZXh0c1dpdGhOZWdhdGl2ZVN0YWNrTGV2ZWxzJyksXG4gICAgaW5GbG93Tm9uSW5saW5lTm9uUG9zaXRpb25lZERlc2NlbmRhbnRzOiBjcmVhdGVTdGFja2luZ0xheWVyKGNvbnRhaW5lciwgJ2luRmxvd05vbklubGluZU5vblBvc2l0aW9uZWREZXNjZW5kYW50cycpLFxuICAgIG5vblBvc2l0aW9uZWRGbG9hdHM6IGNyZWF0ZVN0YWNraW5nTGF5ZXIoY29udGFpbmVyLCAnbm9uUG9zaXRpb25lZEZsb2F0cycpLFxuICAgIGluRmxvd0lubGluZUxldmVsTm9uUG9zaXRpb25lZERlc2NlbmRhbnRzOiBjcmVhdGVTdGFja2luZ0xheWVyKGNvbnRhaW5lciwgJ2luRmxvd0lubGluZUxldmVsTm9uUG9zaXRpb25lZERlc2NlbmRhbnRzJyksXG4gICAgY2hpbGRTdGFja2luZ0NvbnRleHRzV2l0aFN0YWNrTGV2ZWxaZXJvQW5kUG9zaXRpb25lZERlc2NlbmRhbnRzV2l0aFN0YWNrTGV2ZWxaZXJvOiBjcmVhdGVTdGFja2luZ0xheWVyKGNvbnRhaW5lciwgJ2NoaWxkU3RhY2tpbmdDb250ZXh0c1dpdGhTdGFja0xldmVsWmVyb0FuZFBvc2l0aW9uZWREZXNjZW5kYW50c1dpdGhTdGFja0xldmVsWmVybycpLFxuICAgIGNoaWxkU3RhY2tpbmdDb250ZXh0c1dpdGhQb3NpdGl2ZVN0YWNrTGV2ZWxzOiBjcmVhdGVTdGFja2luZ0xheWVyKGNvbnRhaW5lciwgJ2NoaWxkU3RhY2tpbmdDb250ZXh0c1dpdGhQb3NpdGl2ZVN0YWNrTGV2ZWxzJylcbiAgfTtcbn1cblxuZnVuY3Rpb24gZGV0ZXJtaW5lU3RhY2tpbmdMYXllcihzdHlsZXMsIHBhcmVudFN0eWxlcykge1xuICAvLyBodHRwczovL3d3dy53My5vcmcvVFIvQ1NTMjIvdmlzdXJlbi5odG1sI2xheWVyc1xuICAvLyBodHRwczovL3d3dy53My5vcmcvVFIvQ1NTMjIvemluZGV4Lmh0bWxcbiAgLy8gTm90ZTogdGhlIHJvb3QgZWxlbWVudCBpcyBub3QgaGFuZGxlZCBoZXJlLCBidXQgaW4gaGFuZGxlRWxlbWVudCgpLlxuICBjb25zdCB6SW5kZXggPSBzdHlsZXMuekluZGV4ICE9PSAnYXV0bycgPyBwYXJzZUludChzdHlsZXMuekluZGV4LCAxMCkgOiB1bmRlZmluZWQ7XG5cbiAgaWYgKHpJbmRleCAhPT0gdW5kZWZpbmVkICYmIHpJbmRleCA8IDAgJiYgZXN0YWJsaXNoZXNTdGFja2luZ0NvbnRleHQoc3R5bGVzLCBwYXJlbnRTdHlsZXMpKSB7XG4gICAgcmV0dXJuICdjaGlsZFN0YWNraW5nQ29udGV4dHNXaXRoTmVnYXRpdmVTdGFja0xldmVscyc7XG4gIH1cblxuICBpZiAoKDAsIF9jc3MuaXNJbkZsb3cpKHN0eWxlcykgJiYgISgwLCBfY3NzLmlzSW5saW5lKShzdHlsZXMpICYmICEoMCwgX2Nzcy5pc1Bvc2l0aW9uZWQpKHN0eWxlcykpIHtcbiAgICByZXR1cm4gJ2luRmxvd05vbklubGluZU5vblBvc2l0aW9uZWREZXNjZW5kYW50cyc7XG4gIH1cblxuICBpZiAoISgwLCBfY3NzLmlzUG9zaXRpb25lZCkoc3R5bGVzKSAmJiBzdHlsZXMuZmxvYXQgIT09ICdub25lJykge1xuICAgIHJldHVybiAnbm9uUG9zaXRpb25lZEZsb2F0cyc7XG4gIH1cblxuICBpZiAoKDAsIF9jc3MuaXNJbkZsb3cpKHN0eWxlcykgJiYgKDAsIF9jc3MuaXNJbmxpbmUpKHN0eWxlcykgJiYgISgwLCBfY3NzLmlzUG9zaXRpb25lZCkoc3R5bGVzKSkge1xuICAgIHJldHVybiAnaW5GbG93SW5saW5lTGV2ZWxOb25Qb3NpdGlvbmVkRGVzY2VuZGFudHMnO1xuICB9XG5cbiAgaWYgKHpJbmRleCA9PT0gMCAmJiAoKDAsIF9jc3MuaXNQb3NpdGlvbmVkKShzdHlsZXMpIHx8IGVzdGFibGlzaGVzU3RhY2tpbmdDb250ZXh0KHN0eWxlcywgcGFyZW50U3R5bGVzKSkpIHtcbiAgICByZXR1cm4gJ2NoaWxkU3RhY2tpbmdDb250ZXh0c1dpdGhTdGFja0xldmVsWmVyb0FuZFBvc2l0aW9uZWREZXNjZW5kYW50c1dpdGhTdGFja0xldmVsWmVybyc7XG4gIH1cblxuICBpZiAoekluZGV4ICE9PSB1bmRlZmluZWQgJiYgekluZGV4ID4gMCAmJiBlc3RhYmxpc2hlc1N0YWNraW5nQ29udGV4dChzdHlsZXMsIHBhcmVudFN0eWxlcykpIHtcbiAgICByZXR1cm4gJ2NoaWxkU3RhY2tpbmdDb250ZXh0c1dpdGhQb3NpdGl2ZVN0YWNrTGV2ZWxzJztcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIHNvcnRDaGlsZHJlbkJ5WkluZGV4KHBhcmVudCkge1xuICBjb25zdCBzb3J0ZWQgPSBbLi4ucGFyZW50LmNoaWxkcmVuXS5zb3J0KChhLCBiKSA9PiB7XG4gICAgY29uc3QgekluZGV4QSA9IGEuZGF0YXNldC56SW5kZXg7XG4gICAgY29uc3QgekluZGV4QiA9IGIuZGF0YXNldC56SW5kZXg7XG5cbiAgICBpZiAoIXpJbmRleEEgfHwgIXpJbmRleEIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgbm9kZSB0byBoYXZlIGRhdGEtei1pbmRleCBhdHRyaWJ1dGUnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VJbnQoekluZGV4QSwgMTApIC0gcGFyc2VJbnQoekluZGV4QiwgMTApO1xuICB9KTtcblxuICBmb3IgKGNvbnN0IGNoaWxkIG9mIHNvcnRlZCkge1xuICAgIHBhcmVudC5hcHBlbmQoY2hpbGQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNvcnRTdGFja2luZ0xheWVyQ2hpbGRyZW4oc3RhY2tpbmdMYXllcnMpIHtcbiAgc29ydENoaWxkcmVuQnlaSW5kZXgoc3RhY2tpbmdMYXllcnMuY2hpbGRTdGFja2luZ0NvbnRleHRzV2l0aE5lZ2F0aXZlU3RhY2tMZXZlbHMpO1xuICBzb3J0Q2hpbGRyZW5CeVpJbmRleChzdGFja2luZ0xheWVycy5jaGlsZFN0YWNraW5nQ29udGV4dHNXaXRoUG9zaXRpdmVTdGFja0xldmVscyk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1TDNOeVl5OXpkR0ZqYTJsdVp5NTBjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenRCUVVGQk96dEJRVU5CT3p0QlFXbENRU3hOUVVGTkxIRkRRVUZ4UXl4SFFVRkhMRWxCUVVrc1IwRkJTaXhEUVVGblFpeERRVU0zUkN4VlFVUTJSQ3hGUVVVM1JDeFRRVVkyUkN4RlFVYzNSQ3hSUVVnMlJDeEZRVWszUkN4WFFVbzJSQ3hGUVVzM1JDeE5RVXcyUkN4RlFVMDNSQ3haUVU0MlJDeEZRVTgzUkN4WFFWQTJSQ3hGUVZFM1JDeGpRVkkyUkN4RlFWTTNSQ3hUUVZRMlJDeEZRVlUzUkN4aFFWWTJSQ3hGUVZjM1JDeFZRVmcyUkN4RlFWazNSQ3hYUVZvMlJDeEZRV0UzUkN4NVFrRmlOa1FzUlVGak4wUXNVVUZrTmtRc1EwRkJhRUlzUTBGQk9VTTdPMEZCYVVKTkxGTkJRVlVzTUVKQlFWWXNRMEZEVEN4TlFVUkxMRVZCUlV3c1dVRkdTeXhGUVVWdFF6dEJRVVY0UXp0QlFVTkJMRk5CUVU4c1EwRkJReXhGUVVOT0xFTkJRVU1zVFVGQlRTeERRVUZETEZGQlFWQXNTMEZCYjBJc1ZVRkJjRUlzU1VGQmEwTXNUVUZCVFN4RFFVRkRMRkZCUVZBc1MwRkJiMElzVlVGQmRrUXNTMEZCYzBVc1RVRkJUU3hEUVVGRExFMUJRVkFzUzBGQmEwSXNUVUZCZWtZc1NVRkRRU3hOUVVGTkxFTkJRVU1zVVVGQlVDeExRVUZ2UWl4UFFVUndRaXhKUVVWQkxFMUJRVTBzUTBGQlF5eFJRVUZRTEV0QlFXOUNMRkZCUm5CQ0xFbEJSME1zV1VGQldTeExRVU5ZTEZsQlFWa3NRMEZCUXl4UFFVRmlMRXRCUVhsQ0xFMUJRWHBDTEVsQlFXMURMRmxCUVZrc1EwRkJReXhQUVVGaUxFdEJRWGxDTEUxQlJHcEVMRU5CUVZvc1NVRkZRU3hOUVVGTkxFTkJRVU1zVFVGQlVDeExRVUZyUWl4TlFVeHVRaXhKUVUxQkxGVkJRVlVzUTBGQlF5eE5RVUZOTEVOQlFVTXNUMEZCVWl4RFFVRldMRXRCUVN0Q0xFTkJUaTlDTEVsQlQwRXNUVUZCVFN4RFFVRkRMRmxCUVZBc1MwRkJkMElzVVVGUWVFSXNTVUZSUVN4TlFVRk5MRU5CUVVNc1UwRkJVQ3hMUVVGeFFpeE5RVkp5UWl4SlFWTkJMRTFCUVUwc1EwRkJReXhOUVVGUUxFdEJRV3RDTEUxQlZHeENMRWxCVlVFc1RVRkJUU3hEUVVGRExGZEJRVkFzUzBGQmRVSXNUVUZXZGtJc1NVRlhRU3hOUVVGTkxFTkJRVU1zVVVGQlVDeExRVUZ2UWl4TlFWaHdRaXhKUVZsQkxFMUJRVTBzUTBGQlF5eEpRVUZRTEV0QlFXZENMRTFCV21oQ0xFbEJZVUVzVFVGQlRTeERRVUZETEZOQlFWQXNTMEZCY1VJc1RVRmlja0lzU1VGalFTeE5RVUZOTEVOQlFVTXNWVUZCVUN4TFFVRnpRaXhOUVdSMFFpeEpRV1ZCTEUxQlFVMHNRMEZCUXl4VFFVRlFMRXRCUVhGQ0xGTkJabkpDTEVsQlowSkJMRTFCUVUwc1EwRkJReXgxUWtGQlVDeExRVUZ0UXl4UFFXaENia01zU1VGcFFrRXNUVUZCVFN4RFFVRkRMRTlCUVZBc1MwRkJiVUlzVVVGcVFtNUNMRWxCYTBKQkxFMUJRVTBzUTBGQlF5eFBRVUZRTEV0QlFXMUNMRTlCYkVKdVFpeEpRVzFDUVN4TlFVRk5MRU5CUVVNc1QwRkJVQ3hMUVVGdFFpeFJRVzVDYmtJc1NVRnZRa0VzVFVGQlRTeERRVUZETEU5QlFWQXNTMEZCYlVJc1UwRndRbTVDTEVsQmNVSkRMRTFCUVUwc1EwRkJReXhWUVVGUUxFbEJRMEVzVFVGQlRTeERRVUZETEZWQlFWQXNRMEZCYTBJc1MwRkJiRUlzUTBGQmQwSXNSMEZCZUVJc1JVRkJOa0lzU1VGQk4wSXNRMEZCYTBNc1VVRkJVU3hKUVVGSkxIRkRRVUZ4UXl4RFFVRkRMRWRCUVhSRExFTkJRVEJETEZGQlFWRXNRMEZCUXl4SlFVRlVMRVZCUVRGRExFTkJRVGxETEVOQmRrSk5MRU5CUVZJN1FVRjVRa0U3TzBGQmVVSkVMRk5CUVZNc2JVSkJRVlFzUTBGQk5rSXNUVUZCTjBJc1JVRkJhVVFzVTBGQmFrUXNSVUZCWjBZN1FVRkRMMFVzVVVGQlRTeExRVUZMTEVkQlFVY3NUVUZCVFN4RFFVRkRMR0ZCUVZBc1EwRkJjVUlzWlVGQmNrSXNRMEZCY1VNc2FVSkJRWEpETEVWQlFXMUVMRWRCUVc1RUxFTkJRV1E3UVVGRFFTeEZRVUZCTEV0QlFVc3NRMEZCUXl4UFFVRk9MRU5CUVdNc1lVRkJaQ3hIUVVFNFFpeFRRVUU1UWp0QlFVTkJMRVZCUVVFc1RVRkJUU3hEUVVGRExFMUJRVkFzUTBGQll5eExRVUZrTzBGQlEwRXNVMEZCVHl4TFFVRlFPMEZCUTBFN08wRkJSVXNzVTBGQlZTeHZRa0ZCVml4RFFVRXJRaXhUUVVFdlFpeEZRVUZ2UkR0QlFVTjZSQ3hGUVVGQkxGTkJRVk1zUTBGQlF5eFBRVUZXTEVOQlFXdENMR1ZCUVd4Q0xFZEJRVzlETEUxQlFYQkRPMEZCUTBFc1UwRkJUenRCUVVOT0xFbEJRVUVzZDBKQlFYZENMRVZCUVVVc2JVSkJRVzFDTEVOQlFVTXNVMEZCUkN4RlFVRlpMREJDUVVGYUxFTkJSSFpETzBGQlJVNHNTVUZCUVN3MFEwRkJORU1zUlVGQlJTeHRRa0ZCYlVJc1EwRkRhRVVzVTBGRVowVXNSVUZGYUVVc09FTkJSbWRGTEVOQlJqTkVPMEZCVFU0c1NVRkJRU3gxUTBGQmRVTXNSVUZCUlN4dFFrRkJiVUlzUTBGRE0wUXNVMEZFTWtRc1JVRkZNMFFzZVVOQlJqSkVMRU5CVG5SRU8wRkJWVTRzU1VGQlFTeHRRa0ZCYlVJc1JVRkJSU3h0UWtGQmJVSXNRMEZCUXl4VFFVRkVMRVZCUVZrc2NVSkJRVm9zUTBGV2JFTTdRVUZYVGl4SlFVRkJMSGxEUVVGNVF5eEZRVUZGTEcxQ1FVRnRRaXhEUVVNM1JDeFRRVVEyUkN4RlFVVTNSQ3d5UTBGR05rUXNRMEZZZUVRN1FVRmxUaXhKUVVGQkxHbEdRVUZwUml4RlFVRkZMRzFDUVVGdFFpeERRVU55Unl4VFFVUnhSeXhGUVVWeVJ5eHRSa0ZHY1Vjc1EwRm1hRWM3UVVGdFFrNHNTVUZCUVN3MFEwRkJORU1zUlVGQlJTeHRRa0ZCYlVJc1EwRkRhRVVzVTBGRVowVXNSVUZGYUVVc09FTkJSbWRGTzBGQmJrSXpSQ3hIUVVGUU8wRkJkMEpCT3p0QlFVVkxMRk5CUVZVc2MwSkJRVllzUTBGRFRDeE5RVVJMTEVWQlJVd3NXVUZHU3l4RlFVVnRRenRCUVVWNFF6dEJRVU5CTzBGQlJVRTdRVUZEUVN4UlFVRk5MRTFCUVUwc1IwRkJSeXhOUVVGTkxFTkJRVU1zVFVGQlVDeExRVUZyUWl4TlFVRnNRaXhIUVVFeVFpeFJRVUZSTEVOQlFVTXNUVUZCVFN4RFFVRkRMRTFCUVZJc1JVRkJaMElzUlVGQmFFSXNRMEZCYmtNc1IwRkJlVVFzVTBGQmVFVTdPMEZCUTBFc1RVRkJTU3hOUVVGTkxFdEJRVXNzVTBGQldDeEpRVUYzUWl4TlFVRk5MRWRCUVVjc1EwRkJha01zU1VGQmMwTXNNRUpCUVRCQ0xFTkJRVU1zVFVGQlJDeEZRVUZUTEZsQlFWUXNRMEZCY0VVc1JVRkJORVk3UVVGRE0wWXNWMEZCVHl3NFEwRkJVRHRCUVVOQk96dEJRVU5FTEUxQlFVa3NiVUpCUVZNc1RVRkJWQ3hMUVVGdlFpeERRVUZETEcxQ1FVRlRMRTFCUVZRc1EwRkJja0lzU1VGQmVVTXNRMEZCUXl4MVFrRkJZU3hOUVVGaUxFTkJRVGxETEVWQlFXOUZPMEZCUTI1RkxGZEJRVThzZVVOQlFWQTdRVUZEUVRzN1FVRkRSQ3hOUVVGSkxFTkJRVU1zZFVKQlFXRXNUVUZCWWl4RFFVRkVMRWxCUVhsQ0xFMUJRVTBzUTBGQlF5eExRVUZRTEV0QlFXbENMRTFCUVRsRExFVkJRWE5FTzBGQlEzSkVMRmRCUVU4c2NVSkJRVkE3UVVGRFFUczdRVUZEUkN4TlFVRkpMRzFDUVVGVExFMUJRVlFzUzBGQmIwSXNiVUpCUVZNc1RVRkJWQ3hEUVVGd1FpeEpRVUYzUXl4RFFVRkRMSFZDUVVGaExFMUJRV0lzUTBGQk4wTXNSVUZCYlVVN1FVRkRiRVVzVjBGQlR5d3lRMEZCVUR0QlFVTkJPenRCUVVORUxFMUJRVWtzVFVGQlRTeExRVUZMTEVOQlFWZ3NTMEZCYVVJc2RVSkJRV0VzVFVGQllpeExRVUYzUWl3d1FrRkJNRUlzUTBGQlF5eE5RVUZFTEVWQlFWTXNXVUZCVkN4RFFVRnVSU3hEUVVGS0xFVkJRV2RITzBGQlF5OUdMRmRCUVU4c2JVWkJRVkE3UVVGRFFUczdRVUZEUkN4TlFVRkpMRTFCUVUwc1MwRkJTeXhUUVVGWUxFbEJRWGRDTEUxQlFVMHNSMEZCUnl4RFFVRnFReXhKUVVGelF5d3dRa0ZCTUVJc1EwRkJReXhOUVVGRUxFVkJRVk1zV1VGQlZDeERRVUZ3UlN4RlFVRTBSanRCUVVNelJpeFhRVUZQTERoRFFVRlFPMEZCUTBFN08wRkJRMFFzVTBGQlR5eFRRVUZRTzBGQlEwRTdPMEZCUlVzc1UwRkJWU3h2UWtGQlZpeERRVUVyUWl4TlFVRXZRaXhGUVVGcFJEdEJRVU4wUkN4UlFVRk5MRTFCUVUwc1IwRkJSeXhEUVVGRExFZEJRVWNzVFVGQlRTeERRVUZETEZGQlFWZ3NSVUZCY1VJc1NVRkJja0lzUTBGQk1FSXNRMEZCUXl4RFFVRkVMRVZCUVVrc1EwRkJTaXhMUVVGVE8wRkJRMnBFTEZWQlFVMHNUMEZCVHl4SFFVRkpMRU5CUVdkQ0xFTkJRVU1zVDBGQmFrSXNRMEZCZVVJc1RVRkJNVU03UVVGRFFTeFZRVUZOTEU5QlFVOHNSMEZCU1N4RFFVRm5RaXhEUVVGRExFOUJRV3BDTEVOQlFYbENMRTFCUVRGRE96dEJRVU5CTEZGQlFVa3NRMEZCUXl4UFFVRkVMRWxCUVZrc1EwRkJReXhQUVVGcVFpeEZRVUV3UWp0QlFVTjZRaXhaUVVGTkxFbEJRVWtzUzBGQlNpeERRVUZWTERoRFFVRldMRU5CUVU0N1FVRkRRVHM3UVVGRFJDeFhRVUZQTEZGQlFWRXNRMEZCUXl4UFFVRkVMRVZCUVZVc1JVRkJWaXhEUVVGU0xFZEJRWGRDTEZGQlFWRXNRMEZCUXl4UFFVRkVMRVZCUVZVc1JVRkJWaXhEUVVGMlF6dEJRVU5CTEVkQlVHTXNRMEZCWmpzN1FVRlJRU3hQUVVGTExFMUJRVTBzUzBGQldDeEpRVUZ2UWl4TlFVRndRaXhGUVVFMFFqdEJRVU16UWl4SlFVRkJMRTFCUVUwc1EwRkJReXhOUVVGUUxFTkJRV01zUzBGQlpEdEJRVU5CTzBGQlEwUTdPMEZCUlVzc1UwRkJWU3g1UWtGQlZpeERRVUZ2UXl4alFVRndReXhGUVVGclJUdEJRVU4yUlN4RlFVRkJMRzlDUVVGdlFpeERRVUZETEdOQlFXTXNRMEZCUXl3MFEwRkJhRUlzUTBGQmNFSTdRVUZEUVN4RlFVRkJMRzlDUVVGdlFpeERRVUZETEdOQlFXTXNRMEZCUXl3MFEwRkJhRUlzUTBGQmNFSTdRVUZEUVNJc0luTnZkWEpqWlZKdmIzUWlPaUlpZlE9PSIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5oYW5kbGVUZXh0Tm9kZSA9IGhhbmRsZVRleHROb2RlO1xuZXhwb3J0cy5hc3NpZ25UZXh0U3R5bGVzID0gYXNzaWduVGV4dFN0eWxlcztcblxudmFyIF9kb20gPSByZXF1aXJlKFwiLi9kb21cIik7XG5cbnZhciBfdXRpbCA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5cbmZ1bmN0aW9uIGhhbmRsZVRleHROb2RlKHRleHROb2RlLCBjb250ZXh0KSB7XG4gIGlmICghdGV4dE5vZGUub3duZXJEb2N1bWVudC5kZWZhdWx0Vmlldykge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkVsZW1lbnQncyBvd25lckRvY3VtZW50IGhhcyBubyBkZWZhdWx0Vmlld1wiKTtcbiAgfVxuXG4gIGNvbnN0IHdpbmRvdyA9IHRleHROb2RlLm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXc7XG4gIGNvbnN0IHBhcmVudEVsZW1lbnQgPSB0ZXh0Tm9kZS5wYXJlbnRFbGVtZW50O1xuICBjb25zdCBzdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShwYXJlbnRFbGVtZW50KTtcbiAgY29uc3Qge1xuICAgIHdoaXRlU3BhY2VcbiAgfSA9IHN0eWxlcztcbiAgY29uc3Qgc3ZnVGV4dEVsZW1lbnQgPSBjb250ZXh0LnN2Z0RvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhfZG9tLnN2Z05hbWVzcGFjZSwgJ3RleHQnKTsgLy8gTWFrZSBzdXJlIHRoZSB5IGF0dHJpYnV0ZSBpcyB0aGUgYm90dG9tIG9mIHRoZSBib3gsIG5vdCB0aGUgYmFzZWxpbmVcblxuICBzdmdUZXh0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RvbWluYW50LWJhc2VsaW5lJywgJ3RleHQtYWZ0ZXItZWRnZScpO1xuICBjb25zdCBsaW5lUmFuZ2UgPSB0ZXh0Tm9kZS5vd25lckRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XG4gIGxpbmVSYW5nZS5zZXRTdGFydCh0ZXh0Tm9kZSwgMCk7XG4gIGxpbmVSYW5nZS5zZXRFbmQodGV4dE5vZGUsIDApO1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgY29uc3QgYWRkVGV4dFNwYW5Gb3JMaW5lUmFuZ2UgPSAoKSA9PiB7XG4gICAgICBpZiAobGluZVJhbmdlLmNvbGxhcHNlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxpbmVSZWN0YW5nbGUgPSBsaW5lUmFuZ2UuZ2V0Q2xpZW50UmVjdHMoKVswXTtcblxuICAgICAgaWYgKCEoMCwgX3V0aWwuZG9SZWN0YW5nbGVzSW50ZXJzZWN0KShsaW5lUmVjdGFuZ2xlLCBjb250ZXh0LmNhcHR1cmVBcmVhKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRleHRTcGFuID0gY29udGV4dC5zdmdEb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoX2RvbS5zdmdOYW1lc3BhY2UsICd0c3BhbicpO1xuICAgICAgdGV4dFNwYW4uc2V0QXR0cmlidXRlKCd4bWw6c3BhY2UnLCAncHJlc2VydmUnKTtcbiAgICAgIGxldCB0ZXh0ID0gbGluZVJhbmdlLnRvU3RyaW5nKCk7XG5cbiAgICAgIGlmICh3aGl0ZVNwYWNlICE9PSAncHJlJyAmJiB3aGl0ZVNwYWNlICE9PSAncHJlLXdyYXAnKSB7XG4gICAgICAgIC8vIENvbGxhcHNlIHdoaXRlc3BhY2Ugd2l0aGluIHRoZSB0ZXh0IG5vZGVcbiAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXFxzKy8sICcgJyk7IC8vIENoZWNrIGlmIHByZXZpb3VzIHNpYmxpbmdzIGhhZCB0cmFpbGluZyB3aGl0ZXNwYWNlLlxuICAgICAgICAvLyBJZiBzbywgdHJpbSBiZWdpbm5pbmcgb2YgdGhlIHRleHQgY29udGVudCB0byBjb2xsYXBzZSB3aGl0ZXNwYWNlIGFjcm9zcyBub2Rlcy5cblxuICAgICAgICBpZiAobGluZVJhbmdlLnN0YXJ0T2Zmc2V0ID09PSAwKSB7XG4gICAgICAgICAgZm9yIChsZXQgbm9kZSA9IHRleHROb2RlLnByZXZpb3VzU2libGluZzsgbm9kZTsgbm9kZSA9IG5vZGUucHJldmlvdXNTaWJsaW5nKSB7XG4gICAgICAgICAgICB2YXIgX25vZGUkdGV4dENvbnRlbnQ7XG5cbiAgICAgICAgICAgIGlmIChub2RlLnRleHRDb250ZW50ICYmIC9cXHMrJC8udGVzdChub2RlLnRleHRDb250ZW50KSkge1xuICAgICAgICAgICAgICB0ZXh0ID0gdGV4dC50cmltU3RhcnQoKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKChfbm9kZSR0ZXh0Q29udGVudCA9IG5vZGUudGV4dENvbnRlbnQpID09PSBudWxsIHx8IF9ub2RlJHRleHRDb250ZW50ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfbm9kZSR0ZXh0Q29udGVudC50cmltKCkpIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRleHRTcGFuLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICAgIHRleHRTcGFuLnNldEF0dHJpYnV0ZSgneCcsIGxpbmVSZWN0YW5nbGUueC50b1N0cmluZygpKTtcbiAgICAgIHRleHRTcGFuLnNldEF0dHJpYnV0ZSgneScsIGxpbmVSZWN0YW5nbGUuYm90dG9tLnRvU3RyaW5nKCkpO1xuICAgICAgdGV4dFNwYW4uc2V0QXR0cmlidXRlKCd0ZXh0TGVuZ3RoJywgbGluZVJlY3RhbmdsZS53aWR0aC50b1N0cmluZygpKTtcbiAgICAgIHRleHRTcGFuLnNldEF0dHJpYnV0ZSgnbGVuZ3RoQWRqdXN0JywgJ3NwYWNpbmdBbmRHbHlwaHMnKTtcbiAgICAgIHN2Z1RleHRFbGVtZW50LmFwcGVuZCh0ZXh0U3Bhbik7XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICBsaW5lUmFuZ2Uuc2V0RW5kKHRleHROb2RlLCBsaW5lUmFuZ2UuZW5kT2Zmc2V0ICsgMSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChlcnJvci5jb2RlID09PSBET01FeGNlcHRpb24uSU5ERVhfU0laRV9FUlIpIHtcbiAgICAgICAgLy8gUmVhY2hlZCB0aGUgZW5kXG4gICAgICAgIGFkZFRleHRTcGFuRm9yTGluZVJhbmdlKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9IC8vIGdldENsaWVudFJlY3RzKCkgcmV0dXJucyBvbmUgcmVjdGFuZ2xlIGZvciBlYWNoIGxpbmUgb2YgYSB0ZXh0IG5vZGUuXG5cblxuICAgIGNvbnN0IGxpbmVSZWN0YW5nbGVzID0gbGluZVJhbmdlLmdldENsaWVudFJlY3RzKCk7XG5cbiAgICBpZiAobGluZVJlY3RhbmdsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBQdXJlIHdoaXRlc3BhY2UgdGV4dCBub2RlcyBhcmUgY29sbGFwc2VkIGFuZCBub3QgcmVuZGVyZWQuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGxpbmVSZWN0YW5nbGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgIC8vIENyb3NzZWQgYSBsaW5lIGJyZWFrLlxuICAgICAgbGluZVJhbmdlLnNldEVuZCh0ZXh0Tm9kZSwgbGluZVJhbmdlLmVuZE9mZnNldCAtIDEpO1xuICAgICAgYWRkVGV4dFNwYW5Gb3JMaW5lUmFuZ2UoKTtcbiAgICAgIGxpbmVSYW5nZS5zZXRTdGFydCh0ZXh0Tm9kZSwgbGluZVJhbmdlLmVuZE9mZnNldCk7XG4gICAgfVxuICB9IC8vIENvcHkgdGV4dCBzdHlsZXNcbiAgLy8gaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9zdmctcHJvcGVydGllcy1hbmQtY3NzXG5cblxuICBhc3NpZ25UZXh0U3R5bGVzKHN0eWxlcywgc3ZnVGV4dEVsZW1lbnQpO1xuICBjb250ZXh0LmN1cnJlbnRTdmdQYXJlbnQuYXBwZW5kKHN2Z1RleHRFbGVtZW50KTtcbn1cblxuZnVuY3Rpb24gYXNzaWduVGV4dFN0eWxlcyhzdHlsZXMsIHN2Z0VsZW1lbnQpIHtcbiAgY29uc3Qge1xuICAgIGNvbG9yLFxuICAgIGZvbnRGYW1pbHksXG4gICAgZm9udFNpemUsXG4gICAgZm9udFNpemVBZGp1c3QsXG4gICAgZm9udFN0cmV0Y2gsXG4gICAgZm9udFN0eWxlLFxuICAgIGZvbnRWYXJpYW50LFxuICAgIGZvbnRXZWlnaHQsXG4gICAgZGlyZWN0aW9uLFxuICAgIGxldHRlclNwYWNpbmcsXG4gICAgdGV4dERlY29yYXRpb24sXG4gICAgdW5pY29kZUJpZGksXG4gICAgd29yZFNwYWNpbmcsXG4gICAgd3JpdGluZ01vZGUsXG4gICAgdXNlclNlbGVjdFxuICB9ID0gc3R5bGVzO1xuICBPYmplY3QuYXNzaWduKHN2Z0VsZW1lbnQuc3R5bGUsIHtcbiAgICBmaWxsOiBjb2xvcixcbiAgICBmb250RmFtaWx5LFxuICAgIGZvbnRTaXplLFxuICAgIGZvbnRTaXplQWRqdXN0LFxuICAgIGZvbnRTdHJldGNoLFxuICAgIGZvbnRTdHlsZSxcbiAgICBmb250VmFyaWFudCxcbiAgICBmb250V2VpZ2h0LFxuICAgIGRpcmVjdGlvbixcbiAgICBsZXR0ZXJTcGFjaW5nLFxuICAgIHRleHREZWNvcmF0aW9uLFxuICAgIHVuaWNvZGVCaWRpLFxuICAgIHdvcmRTcGFjaW5nLFxuICAgIHdyaXRpbmdNb2RlLFxuICAgIHVzZXJTZWxlY3RcbiAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1TDNOeVl5OTBaWGgwTG5SeklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPenM3TzBGQlFVRTdPMEZCUlVFN08wRkJSVTBzVTBGQlZTeGpRVUZXTEVOQlFYbENMRkZCUVhwQ0xFVkJRWGxETEU5QlFYcERMRVZCUVd0Rk8wRkJRM1pGTEUxQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1lVRkJWQ3hEUVVGMVFpeFhRVUUxUWl4RlFVRjVRenRCUVVONFF5eFZRVUZOTEVsQlFVa3NTMEZCU2l4RFFVRlZMRFJEUVVGV0xFTkJRVTQ3UVVGRFFUczdRVUZEUkN4UlFVRk5MRTFCUVUwc1IwRkJSeXhSUVVGUkxFTkJRVU1zWVVGQlZDeERRVUYxUWl4WFFVRjBRenRCUVVOQkxGRkJRVTBzWVVGQllTeEhRVUZITEZGQlFWRXNRMEZCUXl4aFFVRXZRanRCUVVOQkxGRkJRVTBzVFVGQlRTeEhRVUZITEUxQlFVMHNRMEZCUXl4blFrRkJVQ3hEUVVGM1FpeGhRVUY0UWl4RFFVRm1PMEZCUTBFc1VVRkJUVHRCUVVGRkxFbEJRVUU3UVVGQlJpeE5RVUZwUWl4TlFVRjJRanRCUVVWQkxGRkJRVTBzWTBGQll5eEhRVUZITEU5QlFVOHNRMEZCUXl4WFFVRlNMRU5CUVc5Q0xHVkJRWEJDTEVOQlFXOURMR2xDUVVGd1F5eEZRVUZyUkN4TlFVRnNSQ3hEUVVGMlFpeERRVlIxUlN4RFFWZDJSVHM3UVVGRFFTeEZRVUZCTEdOQlFXTXNRMEZCUXl4WlFVRm1MRU5CUVRSQ0xHMUNRVUUxUWl4RlFVRnBSQ3hwUWtGQmFrUTdRVUZGUVN4UlFVRk5MRk5CUVZNc1IwRkJSeXhSUVVGUkxFTkJRVU1zWVVGQlZDeERRVUYxUWl4WFFVRjJRaXhGUVVGc1FqdEJRVU5CTEVWQlFVRXNVMEZCVXl4RFFVRkRMRkZCUVZZc1EwRkJiVUlzVVVGQmJrSXNSVUZCTmtJc1EwRkJOMEk3UVVGRFFTeEZRVUZCTEZOQlFWTXNRMEZCUXl4TlFVRldMRU5CUVdsQ0xGRkJRV3BDTEVWQlFUSkNMRU5CUVROQ096dEJRVU5CTEZOQlFVOHNTVUZCVUN4RlFVRmhPMEZCUTFvc1ZVRkJUU3gxUWtGQmRVSXNSMEZCUnl4TlFVRlhPMEZCUXpGRExGVkJRVWtzVTBGQlV5eERRVUZETEZOQlFXUXNSVUZCZVVJN1FVRkRlRUk3UVVGRFFUczdRVUZEUkN4WlFVRk5MR0ZCUVdFc1IwRkJSeXhUUVVGVExFTkJRVU1zWTBGQlZpeEhRVUV5UWl4RFFVRXpRaXhEUVVGMFFqczdRVUZEUVN4VlFVRkpMRU5CUVVNc2FVTkJRWE5DTEdGQlFYUkNMRVZCUVhGRExFOUJRVThzUTBGQlF5eFhRVUUzUXl4RFFVRk1MRVZCUVdkRk8wRkJReTlFTzBGQlEwRTdPMEZCUTBRc1dVRkJUU3hSUVVGUkxFZEJRVWNzVDBGQlR5eERRVUZETEZkQlFWSXNRMEZCYjBJc1pVRkJjRUlzUTBGQmIwTXNhVUpCUVhCRExFVkJRV3RFTEU5QlFXeEVMRU5CUVdwQ08wRkJRMEVzVFVGQlFTeFJRVUZSTEVOQlFVTXNXVUZCVkN4RFFVRnpRaXhYUVVGMFFpeEZRVUZ0UXl4VlFVRnVRenRCUVVWQkxGVkJRVWtzU1VGQlNTeEhRVUZITEZOQlFWTXNRMEZCUXl4UlFVRldMRVZCUVZnN08wRkJSVUVzVlVGQlNTeFZRVUZWTEV0QlFVc3NTMEZCWml4SlFVRjNRaXhWUVVGVkxFdEJRVXNzVlVGQk0wTXNSVUZCZFVRN1FVRkRkRVE3UVVGRFFTeFJRVUZCTEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1QwRkJUQ3hEUVVGaExFdEJRV0lzUlVGQmIwSXNSMEZCY0VJc1EwRkJVQ3hEUVVaelJDeERRVWwwUkR0QlFVTkJPenRCUVVOQkxGbEJRVWtzVTBGQlV5eERRVUZETEZkQlFWWXNTMEZCTUVJc1EwRkJPVUlzUlVGQmFVTTdRVUZEYUVNc1pVRkJTeXhKUVVGSkxFbEJRVWtzUjBGQlowSXNVVUZCVVN4RFFVRkRMR1ZCUVhSRExFVkJRWFZFTEVsQlFYWkVMRVZCUVRaRUxFbEJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTXNaVUZCZWtVc1JVRkJNRVk3UVVGQlFUczdRVUZEZWtZc1owSkJRVWtzU1VGQlNTeERRVUZETEZkQlFVd3NTVUZCYjBJc1QwRkJUeXhKUVVGUUxFTkJRVmtzU1VGQlNTeERRVUZETEZkQlFXcENMRU5CUVhoQ0xFVkJRWFZFTzBGQlEzUkVMR05CUVVFc1NVRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF5eFRRVUZNTEVWQlFWQTdRVUZEUVR0QlFVTkJMR0ZCU0VRc1RVRkhUeXg1UWtGQlNTeEpRVUZKTEVOQlFVTXNWMEZCVkN4elJFRkJTU3hyUWtGQmEwSXNTVUZCYkVJc1JVRkJTaXhGUVVFNFFqdEJRVU53UXp0QlFVTkJPMEZCUTBRN1FVRkRSRHRCUVVORU96dEJRVU5FTEUxQlFVRXNVVUZCVVN4RFFVRkRMRmRCUVZRc1IwRkJkVUlzU1VGQmRrSTdRVUZEUVN4TlFVRkJMRkZCUVZFc1EwRkJReXhaUVVGVUxFTkJRWE5DTEVkQlFYUkNMRVZCUVRKQ0xHRkJRV0VzUTBGQlF5eERRVUZrTEVOQlFXZENMRkZCUVdoQ0xFVkJRVE5DTzBGQlEwRXNUVUZCUVN4UlFVRlJMRU5CUVVNc1dVRkJWQ3hEUVVGelFpeEhRVUYwUWl4RlFVRXlRaXhoUVVGaExFTkJRVU1zVFVGQlpDeERRVUZ4UWl4UlFVRnlRaXhGUVVFelFqdEJRVU5CTEUxQlFVRXNVVUZCVVN4RFFVRkRMRmxCUVZRc1EwRkJjMElzV1VGQmRFSXNSVUZCYjBNc1lVRkJZU3hEUVVGRExFdEJRV1FzUTBGQmIwSXNVVUZCY0VJc1JVRkJjRU03UVVGRFFTeE5RVUZCTEZGQlFWRXNRMEZCUXl4WlFVRlVMRU5CUVhOQ0xHTkJRWFJDTEVWQlFYTkRMR3RDUVVGMFF6dEJRVU5CTEUxQlFVRXNZMEZCWXl4RFFVRkRMRTFCUVdZc1EwRkJjMElzVVVGQmRFSTdRVUZEUVN4TFFYQkRSRHM3UVVGeFEwRXNVVUZCU1R0QlFVTklMRTFCUVVFc1UwRkJVeXhEUVVGRExFMUJRVllzUTBGQmFVSXNVVUZCYWtJc1JVRkJNa0lzVTBGQlV5eERRVUZETEZOQlFWWXNSMEZCYzBJc1EwRkJha1E3UVVGRFFTeExRVVpFTEVOQlJVVXNUMEZCVHl4TFFVRlFMRVZCUVdNN1FVRkRaaXhWUVVGTExFdEJRWE5DTEVOQlFVTXNTVUZCZGtJc1MwRkJaME1zV1VGQldTeERRVUZETEdOQlFXeEVMRVZCUVd0Rk8wRkJRMnBGTzBGQlEwRXNVVUZCUVN4MVFrRkJkVUk3UVVGRGRrSTdRVUZEUVRzN1FVRkRSQ3haUVVGTkxFdEJRVTQ3UVVGRFFTeExRUzlEVnl4RFFXZEVXanM3TzBGQlEwRXNWVUZCVFN4alFVRmpMRWRCUVVjc1UwRkJVeXhEUVVGRExHTkJRVllzUlVGQmRrSTdPMEZCUTBFc1VVRkJTU3hqUVVGakxFTkJRVU1zVFVGQlppeExRVUV3UWl4RFFVRTVRaXhGUVVGcFF6dEJRVU5vUXp0QlFVTkJPMEZCUTBFN08wRkJRMFFzVVVGQlNTeGpRVUZqTEVOQlFVTXNUVUZCWml4SFFVRjNRaXhEUVVFMVFpeEZRVUVyUWp0QlFVTTVRanRCUVVOQkxFMUJRVUVzVTBGQlV5eERRVUZETEUxQlFWWXNRMEZCYVVJc1VVRkJha0lzUlVGQk1rSXNVMEZCVXl4RFFVRkRMRk5CUVZZc1IwRkJjMElzUTBGQmFrUTdRVUZEUVN4TlFVRkJMSFZDUVVGMVFqdEJRVU4yUWl4TlFVRkJMRk5CUVZNc1EwRkJReXhSUVVGV0xFTkJRVzFDTEZGQlFXNUNMRVZCUVRaQ0xGTkJRVk1zUTBGQlF5eFRRVUYyUXp0QlFVTkJPMEZCUTBRc1IwRTNSWE5GTEVOQkswVjJSVHRCUVVOQk96czdRVUZEUVN4RlFVRkJMR2RDUVVGblFpeERRVUZETEUxQlFVUXNSVUZCVXl4alFVRlVMRU5CUVdoQ08wRkJSVUVzUlVGQlFTeFBRVUZQTEVOQlFVTXNaMEpCUVZJc1EwRkJlVUlzVFVGQmVrSXNRMEZCWjBNc1kwRkJhRU03UVVGRFFUczdRVUZGU3l4VFFVRlZMR2RDUVVGV0xFTkJRVEpDTEUxQlFUTkNMRVZCUVhkRUxGVkJRWGhFTEVWQlFUaEZPMEZCUTI1R0xGRkJRVTA3UVVGRFRDeEpRVUZCTEV0QlJFczdRVUZGVEN4SlFVRkJMRlZCUmtzN1FVRkhUQ3hKUVVGQkxGRkJTRXM3UVVGSlRDeEpRVUZCTEdOQlNrczdRVUZMVEN4SlFVRkJMRmRCVEVzN1FVRk5UQ3hKUVVGQkxGTkJUa3M3UVVGUFRDeEpRVUZCTEZkQlVFczdRVUZSVEN4SlFVRkJMRlZCVWtzN1FVRlRUQ3hKUVVGQkxGTkJWRXM3UVVGVlRDeEpRVUZCTEdGQlZrczdRVUZYVEN4SlFVRkJMR05CV0VzN1FVRlpUQ3hKUVVGQkxGZEJXa3M3UVVGaFRDeEpRVUZCTEZkQllrczdRVUZqVEN4SlFVRkJMRmRCWkVzN1FVRmxUQ3hKUVVGQk8wRkJaa3NzVFVGblFrWXNUVUZvUWtvN1FVRnBRa0VzUlVGQlFTeE5RVUZOTEVOQlFVTXNUVUZCVUN4RFFVRmpMRlZCUVZVc1EwRkJReXhMUVVGNlFpeEZRVUZuUXp0QlFVTXZRaXhKUVVGQkxFbEJRVWtzUlVGQlJTeExRVVI1UWp0QlFVVXZRaXhKUVVGQkxGVkJSaXRDTzBGQlJ5OUNMRWxCUVVFc1VVRklLMEk3UVVGSkwwSXNTVUZCUVN4alFVb3JRanRCUVVzdlFpeEpRVUZCTEZkQlRDdENPMEZCVFM5Q0xFbEJRVUVzVTBGT0swSTdRVUZQTDBJc1NVRkJRU3hYUVZBclFqdEJRVkV2UWl4SlFVRkJMRlZCVWl0Q08wRkJVeTlDTEVsQlFVRXNVMEZVSzBJN1FVRlZMMElzU1VGQlFTeGhRVllyUWp0QlFWY3ZRaXhKUVVGQkxHTkJXQ3RDTzBGQldTOUNMRWxCUVVFc1YwRmFLMEk3UVVGaEwwSXNTVUZCUVN4WFFXSXJRanRCUVdNdlFpeEpRVUZCTEZkQlpDdENPMEZCWlM5Q0xFbEJRVUU3UVVGbUswSXNSMEZCYUVNN1FVRnBRa0VpTENKemIzVnlZMlZTYjI5MElqb2lJbjA9IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLndhbGtOb2RlID0gd2Fsa05vZGU7XG5cbnZhciBfZG9tID0gcmVxdWlyZShcIi4vZG9tXCIpO1xuXG52YXIgX2VsZW1lbnQgPSByZXF1aXJlKFwiLi9lbGVtZW50XCIpO1xuXG52YXIgX3RleHQgPSByZXF1aXJlKFwiLi90ZXh0XCIpO1xuXG5mdW5jdGlvbiB3YWxrTm9kZShub2RlLCBjb250ZXh0KSB7XG4gIGlmICgoMCwgX2RvbS5pc0VsZW1lbnQpKG5vZGUpKSB7XG4gICAgKDAsIF9lbGVtZW50LmhhbmRsZUVsZW1lbnQpKG5vZGUsIGNvbnRleHQpO1xuICB9IGVsc2UgaWYgKCgwLCBfZG9tLmlzVGV4dE5vZGUpKG5vZGUpKSB7XG4gICAgKDAsIF90ZXh0LmhhbmRsZVRleHROb2RlKShub2RlLCBjb250ZXh0KTtcbiAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUwzTnlZeTkwY21GMlpYSnpZV3d1ZEhNaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPenRCUVVGQk96dEJRVU5CT3p0QlFVTkJPenRCUVdGTkxGTkJRVlVzVVVGQlZpeERRVUZ0UWl4SlFVRnVRaXhGUVVFclFpeFBRVUV2UWl4RlFVRjNSRHRCUVVNM1JDeE5RVUZKTEc5Q1FVRlZMRWxCUVZZc1EwRkJTaXhGUVVGeFFqdEJRVU53UWl4blEwRkJZeXhKUVVGa0xFVkJRVzlDTEU5QlFYQkNPMEZCUTBFc1IwRkdSQ3hOUVVWUExFbEJRVWtzY1VKQlFWY3NTVUZCV0N4RFFVRktMRVZCUVhOQ08wRkJRelZDTERoQ1FVRmxMRWxCUVdZc1JVRkJjVUlzVDBGQmNrSTdRVUZEUVR0QlFVTkVJaXdpYzI5MWNtTmxVbTl2ZENJNklpSjkiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZG9SZWN0YW5nbGVzSW50ZXJzZWN0ID0gZXhwb3J0cy5pc0RlZmluZWQgPSBleHBvcnRzLmNyZWF0ZUNvdW50ZXIgPSB2b2lkIDA7XG5cbmNvbnN0IGNyZWF0ZUNvdW50ZXIgPSAoKSA9PiB7XG4gIGxldCBjb3VudCA9IDA7XG4gIHJldHVybiAoKSA9PiArK2NvdW50O1xufTtcblxuZXhwb3J0cy5jcmVhdGVDb3VudGVyID0gY3JlYXRlQ291bnRlcjtcblxuY29uc3QgaXNEZWZpbmVkID0gdmFsdWUgPT4gdmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZDtcbi8qKlxuICogQ2hlY2sgaWYgdHdvIHJlY3RhbmdsZXMgKGUuZy4gYW4gZWxlbWVudCBhbmQgdGhlIGNhcHR1cmUgYXJlYSkgaW50ZXJzZWN0LlxuICovXG5cblxuZXhwb3J0cy5pc0RlZmluZWQgPSBpc0RlZmluZWQ7XG5cbmNvbnN0IGRvUmVjdGFuZ2xlc0ludGVyc2VjdCA9IChhLCBiKSA9PiAhKGEuYm90dG9tIDwgYi50b3AgfHwgLy8gQSBpcyBhYm92ZSBCXG5hLnRvcCA+IGIuYm90dG9tIHx8IC8vIEEgaXMgYmVsb3cgQlxuYS5yaWdodCA8IGIubGVmdCB8fCAvLyBBIGlzIGxlZnQgb2YgQlxuLy8gQSBpcyByaWdodCBvZiBCXG5hLmxlZnQgPiBiLnJpZ2h0KTtcblxuZXhwb3J0cy5kb1JlY3RhbmdsZXNJbnRlcnNlY3QgPSBkb1JlY3RhbmdsZXNJbnRlcnNlY3Q7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1TDNOeVl5OTFkR2xzTG5SeklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPenM3UVVGQlR5eE5RVUZOTEdGQlFXRXNSMEZCUnl4TlFVRnhRanRCUVVOcVJDeE5RVUZKTEV0QlFVc3NSMEZCUnl4RFFVRmFPMEZCUTBFc1UwRkJUeXhOUVVGTkxFVkJRVVVzUzBGQlpqdEJRVU5CTEVOQlNFMDdPenM3UVVGTFFTeE5RVUZOTEZOQlFWTXNSMEZCVHl4TFFVRktMRWxCUVRCRExFdEJRVXNzUzBGQlN5eEpRVUZXTEVsQlFXdENMRXRCUVVzc1MwRkJTeXhUUVVGNFJqdEJRVVZRT3p0QlFVVkhPenM3T3p0QlFVTkpMRTFCUVUwc2NVSkJRWEZDTEVkQlFVY3NRMEZCUXl4RFFVRkVMRVZCUVhGQ0xFTkJRWEpDTEV0QlEzQkRMRVZCUTBNc1EwRkJReXhEUVVGRExFMUJRVVlzUjBGQlZ5eERRVUZETEVOQlFVTXNSMEZCWWl4SlFVRnZRanRCUVVOd1FpeERRVUZETEVOQlFVTXNSMEZCUml4SFFVRlJMRU5CUVVNc1EwRkJReXhOUVVSV0xFbEJRMjlDTzBGQlEzQkNMRU5CUVVNc1EwRkJReXhMUVVGR0xFZEJRVlVzUTBGQlF5eERRVUZETEVsQlJsb3NTVUZGYjBJN1FVRkRjRUk3UVVGRFFTeERRVUZETEVOQlFVTXNTVUZCUml4SFFVRlRMRU5CUVVNc1EwRkJReXhMUVV4YUxFTkJSRTBpTENKemIzVnlZMlZTYjI5MElqb2lJbjA9IiwiLyohXG4gKiBtZWRpYS10eXBlclxuICogQ29weXJpZ2h0KGMpIDIwMTQgRG91Z2xhcyBDaHJpc3RvcGhlciBXaWxzb25cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbi8qKlxuICogUmVnRXhwIHRvIG1hdGNoICooIFwiO1wiIHBhcmFtZXRlciApIGluIFJGQyAyNjE2IHNlYyAzLjdcbiAqXG4gKiBwYXJhbWV0ZXIgICAgID0gdG9rZW4gXCI9XCIgKCB0b2tlbiB8IHF1b3RlZC1zdHJpbmcgKVxuICogdG9rZW4gICAgICAgICA9IDEqPGFueSBDSEFSIGV4Y2VwdCBDVExzIG9yIHNlcGFyYXRvcnM+XG4gKiBzZXBhcmF0b3JzICAgID0gXCIoXCIgfCBcIilcIiB8IFwiPFwiIHwgXCI+XCIgfCBcIkBcIlxuICogICAgICAgICAgICAgICB8IFwiLFwiIHwgXCI7XCIgfCBcIjpcIiB8IFwiXFxcIiB8IDxcIj5cbiAqICAgICAgICAgICAgICAgfCBcIi9cIiB8IFwiW1wiIHwgXCJdXCIgfCBcIj9cIiB8IFwiPVwiXG4gKiAgICAgICAgICAgICAgIHwgXCJ7XCIgfCBcIn1cIiB8IFNQIHwgSFRcbiAqIHF1b3RlZC1zdHJpbmcgPSAoIDxcIj4gKihxZHRleHQgfCBxdW90ZWQtcGFpciApIDxcIj4gKVxuICogcWR0ZXh0ICAgICAgICA9IDxhbnkgVEVYVCBleGNlcHQgPFwiPj5cbiAqIHF1b3RlZC1wYWlyICAgPSBcIlxcXCIgQ0hBUlxuICogQ0hBUiAgICAgICAgICA9IDxhbnkgVVMtQVNDSUkgY2hhcmFjdGVyIChvY3RldHMgMCAtIDEyNyk+XG4gKiBURVhUICAgICAgICAgID0gPGFueSBPQ1RFVCBleGNlcHQgQ1RMcywgYnV0IGluY2x1ZGluZyBMV1M+XG4gKiBMV1MgICAgICAgICAgID0gW0NSTEZdIDEqKCBTUCB8IEhUIClcbiAqIENSTEYgICAgICAgICAgPSBDUiBMRlxuICogQ1IgICAgICAgICAgICA9IDxVUy1BU0NJSSBDUiwgY2FycmlhZ2UgcmV0dXJuICgxMyk+XG4gKiBMRiAgICAgICAgICAgID0gPFVTLUFTQ0lJIExGLCBsaW5lZmVlZCAoMTApPlxuICogU1AgICAgICAgICAgICA9IDxVUy1BU0NJSSBTUCwgc3BhY2UgKDMyKT5cbiAqIFNIVCAgICAgICAgICAgPSA8VVMtQVNDSUkgSFQsIGhvcml6b250YWwtdGFiICg5KT5cbiAqIENUTCAgICAgICAgICAgPSA8YW55IFVTLUFTQ0lJIGNvbnRyb2wgY2hhcmFjdGVyIChvY3RldHMgMCAtIDMxKSBhbmQgREVMICgxMjcpPlxuICogT0NURVQgICAgICAgICA9IDxhbnkgOC1iaXQgc2VxdWVuY2Ugb2YgZGF0YT5cbiAqL1xudmFyIHBhcmFtUmVnRXhwID0gLzsgKihbISMkJSYnXFwqXFwrXFwtXFwuMC05QS1aXFxeX2BhLXpcXHx+XSspICo9ICooXCIoPzpbICFcXHUwMDIzLVxcdTAwNWJcXHUwMDVkLVxcdTAwN2VcXHUwMDgwLVxcdTAwZmZdfFxcXFxbXFx1MDAyMC1cXHUwMDdlXSkqXCJ8WyEjJCUmJ1xcKlxcK1xcLVxcLjAtOUEtWlxcXl9gYS16XFx8fl0rKSAqL2c7XG52YXIgdGV4dFJlZ0V4cCA9IC9eW1xcdTAwMjAtXFx1MDA3ZVxcdTAwODAtXFx1MDBmZl0rJC9cbnZhciB0b2tlblJlZ0V4cCA9IC9eWyEjJCUmJ1xcKlxcK1xcLVxcLjAtOUEtWlxcXl9gYS16XFx8fl0rJC9cblxuLyoqXG4gKiBSZWdFeHAgdG8gbWF0Y2ggcXVvdGVkLXBhaXIgaW4gUkZDIDI2MTZcbiAqXG4gKiBxdW90ZWQtcGFpciA9IFwiXFxcIiBDSEFSXG4gKiBDSEFSICAgICAgICA9IDxhbnkgVVMtQVNDSUkgY2hhcmFjdGVyIChvY3RldHMgMCAtIDEyNyk+XG4gKi9cbnZhciBxZXNjUmVnRXhwID0gL1xcXFwoW1xcdTAwMDAtXFx1MDA3Zl0pL2c7XG5cbi8qKlxuICogUmVnRXhwIHRvIG1hdGNoIGNoYXJzIHRoYXQgbXVzdCBiZSBxdW90ZWQtcGFpciBpbiBSRkMgMjYxNlxuICovXG52YXIgcXVvdGVSZWdFeHAgPSAvKFtcXFxcXCJdKS9nO1xuXG4vKipcbiAqIFJlZ0V4cCB0byBtYXRjaCB0eXBlIGluIFJGQyA2ODM4XG4gKlxuICogdHlwZS1uYW1lID0gcmVzdHJpY3RlZC1uYW1lXG4gKiBzdWJ0eXBlLW5hbWUgPSByZXN0cmljdGVkLW5hbWVcbiAqIHJlc3RyaWN0ZWQtbmFtZSA9IHJlc3RyaWN0ZWQtbmFtZS1maXJzdCAqMTI2cmVzdHJpY3RlZC1uYW1lLWNoYXJzXG4gKiByZXN0cmljdGVkLW5hbWUtZmlyc3QgID0gQUxQSEEgLyBESUdJVFxuICogcmVzdHJpY3RlZC1uYW1lLWNoYXJzICA9IEFMUEhBIC8gRElHSVQgLyBcIiFcIiAvIFwiI1wiIC9cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICBcIiRcIiAvIFwiJlwiIC8gXCItXCIgLyBcIl5cIiAvIFwiX1wiXG4gKiByZXN0cmljdGVkLW5hbWUtY2hhcnMgPS8gXCIuXCIgOyBDaGFyYWN0ZXJzIGJlZm9yZSBmaXJzdCBkb3QgYWx3YXlzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDsgc3BlY2lmeSBhIGZhY2V0IG5hbWVcbiAqIHJlc3RyaWN0ZWQtbmFtZS1jaGFycyA9LyBcIitcIiA7IENoYXJhY3RlcnMgYWZ0ZXIgbGFzdCBwbHVzIGFsd2F5c1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICA7IHNwZWNpZnkgYSBzdHJ1Y3R1cmVkIHN5bnRheCBzdWZmaXhcbiAqIEFMUEhBID0gICV4NDEtNUEgLyAleDYxLTdBICAgOyBBLVogLyBhLXpcbiAqIERJR0lUID0gICV4MzAtMzkgICAgICAgICAgICAgOyAwLTlcbiAqL1xudmFyIHN1YnR5cGVOYW1lUmVnRXhwID0gL15bQS1aYS16MC05XVtBLVphLXowLTkhIyQmXl8uLV17MCwxMjZ9JC9cbnZhciB0eXBlTmFtZVJlZ0V4cCA9IC9eW0EtWmEtejAtOV1bQS1aYS16MC05ISMkJl5fLV17MCwxMjZ9JC9cbnZhciB0eXBlUmVnRXhwID0gL14gKihbQS1aYS16MC05XVtBLVphLXowLTkhIyQmXl8tXXswLDEyNn0pXFwvKFtBLVphLXowLTldW0EtWmEtejAtOSEjJCZeXy4rLV17MCwxMjZ9KSAqJC87XG5cbi8qKlxuICogTW9kdWxlIGV4cG9ydHMuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXQgPSBmb3JtYXRcbmV4cG9ydHMucGFyc2UgPSBwYXJzZVxuXG4vKipcbiAqIEZvcm1hdCBvYmplY3QgdG8gbWVkaWEgdHlwZS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGZvcm1hdChvYmopIHtcbiAgaWYgKCFvYmogfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhcmd1bWVudCBvYmogaXMgcmVxdWlyZWQnKVxuICB9XG5cbiAgdmFyIHBhcmFtZXRlcnMgPSBvYmoucGFyYW1ldGVyc1xuICB2YXIgc3VidHlwZSA9IG9iai5zdWJ0eXBlXG4gIHZhciBzdWZmaXggPSBvYmouc3VmZml4XG4gIHZhciB0eXBlID0gb2JqLnR5cGVcblxuICBpZiAoIXR5cGUgfHwgIXR5cGVOYW1lUmVnRXhwLnRlc3QodHlwZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdpbnZhbGlkIHR5cGUnKVxuICB9XG5cbiAgaWYgKCFzdWJ0eXBlIHx8ICFzdWJ0eXBlTmFtZVJlZ0V4cC50ZXN0KHN1YnR5cGUpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaW52YWxpZCBzdWJ0eXBlJylcbiAgfVxuXG4gIC8vIGZvcm1hdCBhcyB0eXBlL3N1YnR5cGVcbiAgdmFyIHN0cmluZyA9IHR5cGUgKyAnLycgKyBzdWJ0eXBlXG5cbiAgLy8gYXBwZW5kICtzdWZmaXhcbiAgaWYgKHN1ZmZpeCkge1xuICAgIGlmICghdHlwZU5hbWVSZWdFeHAudGVzdChzdWZmaXgpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdpbnZhbGlkIHN1ZmZpeCcpXG4gICAgfVxuXG4gICAgc3RyaW5nICs9ICcrJyArIHN1ZmZpeFxuICB9XG5cbiAgLy8gYXBwZW5kIHBhcmFtZXRlcnNcbiAgaWYgKHBhcmFtZXRlcnMgJiYgdHlwZW9mIHBhcmFtZXRlcnMgPT09ICdvYmplY3QnKSB7XG4gICAgdmFyIHBhcmFtXG4gICAgdmFyIHBhcmFtcyA9IE9iamVjdC5rZXlzKHBhcmFtZXRlcnMpLnNvcnQoKVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJhbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHBhcmFtID0gcGFyYW1zW2ldXG5cbiAgICAgIGlmICghdG9rZW5SZWdFeHAudGVzdChwYXJhbSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaW52YWxpZCBwYXJhbWV0ZXIgbmFtZScpXG4gICAgICB9XG5cbiAgICAgIHN0cmluZyArPSAnOyAnICsgcGFyYW0gKyAnPScgKyBxc3RyaW5nKHBhcmFtZXRlcnNbcGFyYW1dKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzdHJpbmdcbn1cblxuLyoqXG4gKiBQYXJzZSBtZWRpYSB0eXBlIHRvIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IHN0cmluZ1xuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBwYXJzZShzdHJpbmcpIHtcbiAgaWYgKCFzdHJpbmcpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhcmd1bWVudCBzdHJpbmcgaXMgcmVxdWlyZWQnKVxuICB9XG5cbiAgLy8gc3VwcG9ydCByZXEvcmVzLWxpa2Ugb2JqZWN0cyBhcyBhcmd1bWVudFxuICBpZiAodHlwZW9mIHN0cmluZyA9PT0gJ29iamVjdCcpIHtcbiAgICBzdHJpbmcgPSBnZXRjb250ZW50dHlwZShzdHJpbmcpXG4gIH1cblxuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhcmd1bWVudCBzdHJpbmcgaXMgcmVxdWlyZWQgdG8gYmUgYSBzdHJpbmcnKVxuICB9XG5cbiAgdmFyIGluZGV4ID0gc3RyaW5nLmluZGV4T2YoJzsnKVxuICB2YXIgdHlwZSA9IGluZGV4ICE9PSAtMVxuICAgID8gc3RyaW5nLnN1YnN0cigwLCBpbmRleClcbiAgICA6IHN0cmluZ1xuXG4gIHZhciBrZXlcbiAgdmFyIG1hdGNoXG4gIHZhciBvYmogPSBzcGxpdFR5cGUodHlwZSlcbiAgdmFyIHBhcmFtcyA9IHt9XG4gIHZhciB2YWx1ZVxuXG4gIHBhcmFtUmVnRXhwLmxhc3RJbmRleCA9IGluZGV4XG5cbiAgd2hpbGUgKG1hdGNoID0gcGFyYW1SZWdFeHAuZXhlYyhzdHJpbmcpKSB7XG4gICAgaWYgKG1hdGNoLmluZGV4ICE9PSBpbmRleCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaW52YWxpZCBwYXJhbWV0ZXIgZm9ybWF0JylcbiAgICB9XG5cbiAgICBpbmRleCArPSBtYXRjaFswXS5sZW5ndGhcbiAgICBrZXkgPSBtYXRjaFsxXS50b0xvd2VyQ2FzZSgpXG4gICAgdmFsdWUgPSBtYXRjaFsyXVxuXG4gICAgaWYgKHZhbHVlWzBdID09PSAnXCInKSB7XG4gICAgICAvLyByZW1vdmUgcXVvdGVzIGFuZCBlc2NhcGVzXG4gICAgICB2YWx1ZSA9IHZhbHVlXG4gICAgICAgIC5zdWJzdHIoMSwgdmFsdWUubGVuZ3RoIC0gMilcbiAgICAgICAgLnJlcGxhY2UocWVzY1JlZ0V4cCwgJyQxJylcbiAgICB9XG5cbiAgICBwYXJhbXNba2V5XSA9IHZhbHVlXG4gIH1cblxuICBpZiAoaW5kZXggIT09IC0xICYmIGluZGV4ICE9PSBzdHJpbmcubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaW52YWxpZCBwYXJhbWV0ZXIgZm9ybWF0JylcbiAgfVxuXG4gIG9iai5wYXJhbWV0ZXJzID0gcGFyYW1zXG5cbiAgcmV0dXJuIG9ialxufVxuXG4vKipcbiAqIEdldCBjb250ZW50LXR5cGUgZnJvbSByZXEvcmVzIG9iamVjdHMuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9XG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBnZXRjb250ZW50dHlwZShvYmopIHtcbiAgaWYgKHR5cGVvZiBvYmouZ2V0SGVhZGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gcmVzLWxpa2VcbiAgICByZXR1cm4gb2JqLmdldEhlYWRlcignY29udGVudC10eXBlJylcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb2JqLmhlYWRlcnMgPT09ICdvYmplY3QnKSB7XG4gICAgLy8gcmVxLWxpa2VcbiAgICByZXR1cm4gb2JqLmhlYWRlcnMgJiYgb2JqLmhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddXG4gIH1cbn1cblxuLyoqXG4gKiBRdW90ZSBhIHN0cmluZyBpZiBuZWNlc3NhcnkuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbFxuICogQHJldHVybiB7c3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcXN0cmluZyh2YWwpIHtcbiAgdmFyIHN0ciA9IFN0cmluZyh2YWwpXG5cbiAgLy8gbm8gbmVlZCB0byBxdW90ZSB0b2tlbnNcbiAgaWYgKHRva2VuUmVnRXhwLnRlc3Qoc3RyKSkge1xuICAgIHJldHVybiBzdHJcbiAgfVxuXG4gIGlmIChzdHIubGVuZ3RoID4gMCAmJiAhdGV4dFJlZ0V4cC50ZXN0KHN0cikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdpbnZhbGlkIHBhcmFtZXRlciB2YWx1ZScpXG4gIH1cblxuICByZXR1cm4gJ1wiJyArIHN0ci5yZXBsYWNlKHF1b3RlUmVnRXhwLCAnXFxcXCQxJykgKyAnXCInXG59XG5cbi8qKlxuICogU2ltcGx5IFwidHlwZS9zdWJ0eXBlK3NpZmZ4XCIgaW50byBwYXJ0cy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzcGxpdFR5cGUoc3RyaW5nKSB7XG4gIHZhciBtYXRjaCA9IHR5cGVSZWdFeHAuZXhlYyhzdHJpbmcudG9Mb3dlckNhc2UoKSlcblxuICBpZiAoIW1hdGNoKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaW52YWxpZCBtZWRpYSB0eXBlJylcbiAgfVxuXG4gIHZhciB0eXBlID0gbWF0Y2hbMV1cbiAgdmFyIHN1YnR5cGUgPSBtYXRjaFsyXVxuICB2YXIgc3VmZml4XG5cbiAgLy8gc3VmZml4IGFmdGVyIGxhc3QgK1xuICB2YXIgaW5kZXggPSBzdWJ0eXBlLmxhc3RJbmRleE9mKCcrJylcbiAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgIHN1ZmZpeCA9IHN1YnR5cGUuc3Vic3RyKGluZGV4ICsgMSlcbiAgICBzdWJ0eXBlID0gc3VidHlwZS5zdWJzdHIoMCwgaW5kZXgpXG4gIH1cblxuICB2YXIgb2JqID0ge1xuICAgIHR5cGU6IHR5cGUsXG4gICAgc3VidHlwZTogc3VidHlwZSxcbiAgICBzdWZmaXg6IHN1ZmZpeFxuICB9XG5cbiAgcmV0dXJuIG9ialxufVxuIiwibW9kdWxlLmV4cG9ydHM9e1xuICBcImFwcGxpY2F0aW9uLzFkLWludGVybGVhdmVkLXBhcml0eWZlY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi8zZ3BkYXNoLXFvZS1yZXBvcnQreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNoYXJzZXRcIjogXCJVVEYtOFwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi8zZ3BwLWltcyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9hMmxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vYWN0aXZlbWVzc2FnZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9hY3Rpdml0eStqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vYWx0by1jb3N0bWFwK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9hbHRvLWNvc3RtYXBmaWx0ZXIranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2FsdG8tZGlyZWN0b3J5K2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9hbHRvLWVuZHBvaW50Y29zdCtqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vYWx0by1lbmRwb2ludGNvc3RwYXJhbXMranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2FsdG8tZW5kcG9pbnRwcm9wK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9hbHRvLWVuZHBvaW50cHJvcHBhcmFtcytqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vYWx0by1lcnJvcitqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vYWx0by1uZXR3b3JrbWFwK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9hbHRvLW5ldHdvcmttYXBmaWx0ZXIranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2FsdG8tdXBkYXRlc3RyZWFtY29udHJvbCtqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vYWx0by11cGRhdGVzdHJlYW1wYXJhbXMranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2FtbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9hbmRyZXctaW5zZXRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJlelwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2FwcGxlZmlsZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9hcHBsaXh3YXJlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJhd1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2F0ZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9hdGZ4XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL2F0b20reG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJhdG9tXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vYXRvbWNhdCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImF0b21jYXRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9hdG9tZGVsZXRlZCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImF0b21kZWxldGVkXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vYXRvbWljbWFpbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9hdG9tc3ZjK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiYXRvbXN2Y1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2F0c2MtZHdkK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZHdkXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vYXRzYy1keW5hbWljLWV2ZW50LW1lc3NhZ2VcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vYXRzYy1oZWxkK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiaGVsZFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2F0c2MtcmR0K2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9hdHNjLXJzYXQreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJyc2F0XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vYXR4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vYXV0aC1wb2xpY3kreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vYmFjbmV0LXhkZCt6aXBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vYmF0Y2gtc210cFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9iZG9jXCI6IHtcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiYmRvY1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2JlZXAreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNoYXJzZXRcIjogXCJVVEYtOFwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9jYWxlbmRhcitqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vY2FsZW5kYXIreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ4Y3NcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9jYWxsLWNvbXBsZXRpb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vY2Fscy0xODQwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL2NhcCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY2hhcnNldFwiOiBcIlVURi04XCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2Nib3JcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vY2Jvci1zZXFcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vY2NjZXhcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vY2NtcCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9jY3htbCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImNjeG1sXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vY2RmeCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImNkZnhcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9jZG1pLWNhcGFiaWxpdHlcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJjZG1pYVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2NkbWktY29udGFpbmVyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiY2RtaWNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9jZG1pLWRvbWFpblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImNkbWlkXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vY2RtaS1vYmplY3RcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJjZG1pb1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2NkbWktcXVldWVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJjZG1pcVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2NkbmlcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vY2VhXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL2NlYS0yMDE4K3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2NlbGxtbCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9jZndcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vY2x1ZSt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9jbHVlX2luZm8reG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vY21zXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL2NucnAreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vY29hcC1ncm91cCtqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vY29hcC1wYXlsb2FkXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL2NvbW1vbmdyb3VuZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9jb25mZXJlbmNlLWluZm8reG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vY29zZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9jb3NlLWtleVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9jb3NlLWtleS1zZXRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vY3BsK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2NzcmF0dHJzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL2NzdGEreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vY3N0YWRhdGEreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vY3N2bStqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vY3Utc2VlbWVcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImN1XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vY3d0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL2N5YmVyY2FzaFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9kYXJ0XCI6IHtcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZGFzaCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm1wZFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2Rhc2hkZWx0YVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9kYXZtb3VudCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImRhdm1vdW50XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZGNhLXJmdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9kY2RcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZGVjLWR4XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL2RpYWxvZy1pbmZvK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2RpY29tXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL2RpY29tK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9kaWNvbSt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9kaWlcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZGl0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL2Ruc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9kbnMranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2Rucy1tZXNzYWdlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL2RvY2Jvb2sreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImRia1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2RvdHMrY2JvclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9kc2twcCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9kc3NjK2RlclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImRzc2NcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9kc3NjK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wieGRzc2NcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9kdmNzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL2VjbWFzY3JpcHRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImVjbWFcIixcImVzXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZWRpLWNvbnNlbnRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZWRpLXgxMlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2VcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9lZGlmYWN0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2VmaVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9lbWVyZ2VuY3ljYWxsZGF0YS5jb21tZW50K3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2VtZXJnZW5jeWNhbGxkYXRhLmNvbnRyb2wreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZW1lcmdlbmN5Y2FsbGRhdGEuZGV2aWNlaW5mbyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9lbWVyZ2VuY3ljYWxsZGF0YS5lY2FsbC5tc2RcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZW1lcmdlbmN5Y2FsbGRhdGEucHJvdmlkZXJpbmZvK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2VtZXJnZW5jeWNhbGxkYXRhLnNlcnZpY2VpbmZvK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2VtZXJnZW5jeWNhbGxkYXRhLnN1YnNjcmliZXJpbmZvK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2VtZXJnZW5jeWNhbGxkYXRhLnZlZHMreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZW1tYSt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImVtbWFcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9lbW90aW9ubWwreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJlbW90aW9ubWxcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9lbmNhcHJ0cFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9lcHAreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZXB1Yit6aXBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJlcHViXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZXNob3BcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZXhpXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZXhpXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZXhwZWN0LWN0LXJlcG9ydCtqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZmFzdGluZm9zZXRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZmFzdHNvYXBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZmR0K3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZmR0XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZmhpcitqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNoYXJzZXRcIjogXCJVVEYtOFwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9maGlyK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjaGFyc2V0XCI6IFwiVVRGLThcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZmlkby50cnVzdGVkLWFwcHMranNvblwiOiB7XG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2ZpdHNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZmxleGZlY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9mb250LXNmbnRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZm9udC10ZHBmclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInBmclwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2ZvbnQtd29mZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2VcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9mcmFtZXdvcmstYXR0cmlidXRlcyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9nZW8ranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZ2VvanNvblwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2dlbytqc29uLXNlcVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9nZW9wYWNrYWdlK3NxbGl0ZTNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZ2VveGFjbWwreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZ2x0Zi1idWZmZXJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZ21sK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZ21sXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vZ3B4K3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJncHhcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9neGZcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImd4ZlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2d6aXBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJnelwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2gyMjRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vaGVsZCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9oanNvblwiOiB7XG4gICAgXCJleHRlbnNpb25zXCI6IFtcImhqc29uXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vaHR0cFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9oeXBlcnN0dWRpb1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInN0a1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2liZS1rZXktcmVxdWVzdCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9pYmUtcGtnLXJlcGx5K3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2liZS1wcC1kYXRhXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL2lnZXNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vaW0taXNjb21wb3NpbmcreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNoYXJzZXRcIjogXCJVVEYtOFwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9pbmRleFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9pbmRleC5jbWRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vaW5kZXgub2JqXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL2luZGV4LnJlc3BvbnNlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL2luZGV4LnZuZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9pbmttbCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImlua1wiLFwiaW5rbWxcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9pb3RwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL2lwZml4XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiaXBmaXhcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9pcHBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vaXN1cFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9pdHMreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJpdHNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9qYXZhLWFyY2hpdmVcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImphclwiLFwid2FyXCIsXCJlYXJcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9qYXZhLXNlcmlhbGl6ZWQtb2JqZWN0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzZXJcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9qYXZhLXZtXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJjbGFzc1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2phdmFzY3JpcHRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY2hhcnNldFwiOiBcIlVURi04XCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wianNcIixcIm1qc1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2pmMmZlZWQranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2pvc2VcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vam9zZStqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vanJkK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNoYXJzZXRcIjogXCJVVEYtOFwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImpzb25cIixcIm1hcFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2pzb24tcGF0Y2granNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2pzb24tc2VxXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL2pzb241XCI6IHtcbiAgICBcImV4dGVuc2lvbnNcIjogW1wianNvbjVcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9qc29ubWwranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJqc29ubWxcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9qd2sranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2p3ay1zZXQranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2p3dFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9rcG1sLXJlcXVlc3QreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24va3BtbC1yZXNwb25zZSt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9sZCtqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJqc29ubGRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9sZ3IreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJsZ3JcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9saW5rLWZvcm1hdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9sb2FkLWNvbnRyb2wreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vbG9zdCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImxvc3R4bWxcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9sb3N0c3luYyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9scGYremlwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL2x4ZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9tYWMtYmluaGV4NDBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJocXhcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9tYWMtY29tcGFjdHByb1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiY3B0XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vbWFjd3JpdGVpaVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9tYWRzK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibWFkc1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL21hbmlmZXN0K2pzb25cIjoge1xuICAgIFwiY2hhcnNldFwiOiBcIlVURi04XCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wid2VibWFuaWZlc3RcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9tYXJjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibXJjXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vbWFyY3htbCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm1yY3hcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9tYXRoZW1hdGljYVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm1hXCIsXCJuYlwiLFwibWJcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9tYXRobWwreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJtYXRobWxcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9tYXRobWwtY29udGVudCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9tYXRobWwtcHJlc2VudGF0aW9uK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL21ibXMtYXNzb2NpYXRlZC1wcm9jZWR1cmUtZGVzY3JpcHRpb24reG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vbWJtcy1kZXJlZ2lzdGVyK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL21ibXMtZW52ZWxvcGUreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vbWJtcy1tc2sreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vbWJtcy1tc2stcmVzcG9uc2UreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vbWJtcy1wcm90ZWN0aW9uLWRlc2NyaXB0aW9uK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL21ibXMtcmVjZXB0aW9uLXJlcG9ydCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9tYm1zLXJlZ2lzdGVyK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL21ibXMtcmVnaXN0ZXItcmVzcG9uc2UreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vbWJtcy1zY2hlZHVsZSt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9tYm1zLXVzZXItc2VydmljZS1kZXNjcmlwdGlvbit4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9tYm94XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibWJveFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL21lZGlhLXBvbGljeS1kYXRhc2V0K3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL21lZGlhX2NvbnRyb2wreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vbWVkaWFzZXJ2ZXJjb250cm9sK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibXNjbWxcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9tZXJnZS1wYXRjaCtqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vbWV0YWxpbmsreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm1ldGFsaW5rXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vbWV0YWxpbms0K3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibWV0YTRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9tZXRzK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibWV0c1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL21mNFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9taWtleVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9taXBjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL21tdC1hZWkreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJtYWVpXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vbW10LXVzZCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm11c2RcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9tb2RzK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibW9kc1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL21vc3Mta2V5c1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9tb3NzLXNpZ25hdHVyZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9tb3Nza2V5LWRhdGFcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vbW9zc2tleS1yZXF1ZXN0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL21wMjFcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJtMjFcIixcIm1wMjFcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9tcDRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJtcDRzXCIsXCJtNHBcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9tcGVnNC1nZW5lcmljXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL21wZWc0LWlvZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9tcGVnNC1pb2QteG10XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL21yYi1jb25zdW1lcit4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhkZlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL21yYi1wdWJsaXNoK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wieGRmXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vbXNjLWl2cit4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY2hhcnNldFwiOiBcIlVURi04XCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL21zYy1taXhlcit4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY2hhcnNldFwiOiBcIlVURi04XCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL21zd29yZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImRvY1wiLFwiZG90XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vbXVkK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9tdWx0aXBhcnQtY29yZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9teGZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJteGZcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9uLXF1YWRzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibnFcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9uLXRyaXBsZXNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJudFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL25hc2RhdGFcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vbmV3cy1jaGVja2dyb3Vwc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjaGFyc2V0XCI6IFwiVVMtQVNDSUlcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL25ld3MtZ3JvdXBpbmZvXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNoYXJzZXRcIjogXCJVUy1BU0NJSVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vbmV3cy10cmFuc21pc3Npb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vbmxzbWwreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vbm9kZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImNqc1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL25zc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9vY3NwLXJlcXVlc3RcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vb2NzcC1yZXNwb25zZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJiaW5cIixcImRtc1wiLFwibHJmXCIsXCJtYXJcIixcInNvXCIsXCJkaXN0XCIsXCJkaXN0elwiLFwicGtnXCIsXCJicGtcIixcImR1bXBcIixcImVsY1wiLFwiZGVwbG95XCIsXCJleGVcIixcImRsbFwiLFwiZGViXCIsXCJkbWdcIixcImlzb1wiLFwiaW1nXCIsXCJtc2lcIixcIm1zcFwiLFwibXNtXCIsXCJidWZmZXJcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9vZGFcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJvZGFcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9vZG0reG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vb2R4XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL29lYnBzLXBhY2thZ2UreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJvcGZcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9vZ2dcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJvZ3hcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9vbWRvYyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wib21kb2NcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9vbmVub3RlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJvbmV0b2NcIixcIm9uZXRvYzJcIixcIm9uZXRtcFwiLFwib25lcGtnXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vb3Njb3JlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL294cHNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJveHBzXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcDJwLW92ZXJsYXkreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJyZWxvXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcGFyaXR5ZmVjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3Bhc3Nwb3J0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3BhdGNoLW9wcy1lcnJvcit4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhlclwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3BkZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInBkZlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3BkeFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9wZW0tY2VydGlmaWNhdGUtY2hhaW5cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcGdwLWVuY3J5cHRlZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInBncFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3BncC1rZXlzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3BncC1zaWduYXR1cmVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJhc2NcIixcInNpZ1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3BpY3MtcnVsZXNcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInByZlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3BpZGYreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNoYXJzZXRcIjogXCJVVEYtOFwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9waWRmLWRpZmYreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNoYXJzZXRcIjogXCJVVEYtOFwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9wa2NzMTBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJwMTBcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9wa2NzMTJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcGtjczctbWltZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInA3bVwiLFwicDdjXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcGtjczctc2lnbmF0dXJlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicDdzXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcGtjczhcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJwOFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3BrY3M4LWVuY3J5cHRlZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9wa2l4LWF0dHItY2VydFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImFjXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcGtpeC1jZXJ0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiY2VyXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcGtpeC1jcmxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJjcmxcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9wa2l4LXBraXBhdGhcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJwa2lwYXRoXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcGtpeGNtcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInBraVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3Bscyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInBsc1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3BvYy1zZXR0aW5ncyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY2hhcnNldFwiOiBcIlVURi04XCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3Bvc3RzY3JpcHRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImFpXCIsXCJlcHNcIixcInBzXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcHBzcC10cmFja2VyK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9wcm9ibGVtK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9wcm9ibGVtK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3Byb3ZlbmFuY2UreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJwcm92eFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3Bycy5hbHZlc3RyYW5kLnRpdHJheC1zaGVldFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9wcnMuY3d3XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiY3d3XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcHJzLmhwdWIremlwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3Bycy5ucHJlbmRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcHJzLnBsdWNrZXJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcHJzLnJkZi14bWwtY3J5cHRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcHJzLnhzZit4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9wc2tjK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicHNrY3htbFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3B2ZCtqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcXNpZ1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9yYW1sK3lhbWxcIjoge1xuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInJhbWxcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9yYXB0b3JmZWNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcmRhcCtqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcmRmK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicmRmXCIsXCJvd2xcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9yZWdpbmZvK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicmlmXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcmVsYXgtbmctY29tcGFjdC1zeW50YXhcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJybmNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9yZW1vdGUtcHJpbnRpbmdcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcmVwdXRvbitqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcmVzb3VyY2UtbGlzdHMreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJybFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3Jlc291cmNlLWxpc3RzLWRpZmYreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJybGRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9yZmMreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcmlzY29zXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3JsbWkreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcmxzLXNlcnZpY2VzK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicnNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9yb3V0ZS1hcGQreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJyYXBkXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcm91dGUtcy10c2lkK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic2xzXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcm91dGUtdXNkK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicnVzZFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3Jwa2ktZ2hvc3RidXN0ZXJzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZ2JyXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcnBraS1tYW5pZmVzdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm1mdFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3Jwa2ktcHVibGljYXRpb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcnBraS1yb2FcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJyb2FcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9ycGtpLXVwZG93blwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9yc2QreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInJzZFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3Jzcyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicnNzXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vcnRmXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJydGZcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9ydHBsb29wYmFja1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9ydHhcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc2FtbGFzc2VydGlvbit4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9zYW1sbWV0YWRhdGEreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc2JlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3NibWwreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzYm1sXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc2NhaXAreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc2NpbStqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc2N2cC1jdi1yZXF1ZXN0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic2NxXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc2N2cC1jdi1yZXNwb25zZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNjc1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3NjdnAtdnAtcmVxdWVzdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNwcVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3NjdnAtdnAtcmVzcG9uc2VcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzcHBcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9zZHBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzZHBcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9zZWNldmVudCtqd3RcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc2VubWwrY2JvclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9zZW5tbCtqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc2VubWwreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzZW5tbHhcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9zZW5tbC1ldGNoK2Nib3JcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc2VubWwtZXRjaCtqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc2VubWwtZXhpXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3NlbnNtbCtjYm9yXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3NlbnNtbCtqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc2Vuc21sK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic2Vuc21seFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3NlbnNtbC1leGlcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc2VwK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3NlcC1leGlcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc2Vzc2lvbi1pbmZvXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3NldC1wYXltZW50XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3NldC1wYXltZW50LWluaXRpYXRpb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzZXRwYXlcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9zZXQtcmVnaXN0cmF0aW9uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3NldC1yZWdpc3RyYXRpb24taW5pdGlhdGlvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNldHJlZ1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3NnbWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc2dtbC1vcGVuLWNhdGFsb2dcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc2hmK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic2hmXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc2lldmVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzaXZcIixcInNpZXZlXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc2ltcGxlLWZpbHRlcit4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9zaW1wbGUtbWVzc2FnZS1zdW1tYXJ5XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3NpbXBsZXN5bWJvbGNvbnRhaW5lclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9zaXBjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3NsYXRlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3NtaWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc21pbCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNtaVwiLFwic21pbFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3NtcHRlMzM2bVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9zb2FwK2Zhc3RpbmZvc2V0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3NvYXAreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc3BhcnFsLXF1ZXJ5XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicnFcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi9zcGFycWwtcmVzdWx0cyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNyeFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3NwaXJpdHMtZXZlbnQreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc3FsXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3NyZ3NcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJncmFtXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc3Jncyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImdyeG1sXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc3J1K3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic3J1XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc3NkbCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic3NkbFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3NzbWwreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzc21sXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc3RpeCtqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vc3dpZCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInN3aWR0YWdcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi90YW1wLWFwZXgtdXBkYXRlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3RhbXAtYXBleC11cGRhdGUtY29uZmlybVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi90YW1wLWNvbW11bml0eS11cGRhdGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdGFtcC1jb21tdW5pdHktdXBkYXRlLWNvbmZpcm1cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdGFtcC1lcnJvclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi90YW1wLXNlcXVlbmNlLWFkanVzdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi90YW1wLXNlcXVlbmNlLWFkanVzdC1jb25maXJtXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3RhbXAtc3RhdHVzLXF1ZXJ5XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3RhbXAtc3RhdHVzLXJlc3BvbnNlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3RhbXAtdXBkYXRlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3RhbXAtdXBkYXRlLWNvbmZpcm1cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdGFyXCI6IHtcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdGF4aWkranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3RkK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi90ZWkreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ0ZWlcIixcInRlaWNvcnB1c1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3RldHJhX2lzaVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi90aHJhdWQreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ0ZmlcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi90aW1lc3RhbXAtcXVlcnlcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdGltZXN0YW1wLXJlcGx5XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3RpbWVzdGFtcGVkLWRhdGFcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ0c2RcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi90bHNycHQrZ3ppcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi90bHNycHQranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3RuYXV0aGxpc3RcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdG9tbFwiOiB7XG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1widG9tbFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3RyaWNrbGUtaWNlLXNkcGZyYWdcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdHJpZ1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi90dG1sK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1widHRtbFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3R2ZS10cmlnZ2VyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3R6aWZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdHppZi1sZWFwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3VscGZlY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi91cmMtZ3Jwc2hlZXQreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdXJjLXJlc3NoZWV0K3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicnNoZWV0XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdXJjLXRhcmdldGRlc2MreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdXJjLXVpc29ja2V0ZGVzYyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92Y2FyZCtqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdmNhcmQreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdmVtbWlcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdml2aWRlbmNlLnNjcmlwdGZpbGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuMTAwMG1pbmRzLmRlY2lzaW9uLW1vZGVsK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiMWttXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNncHAtcHJvc2UreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNncHAtcHJvc2UtcGMzY2greG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNncHAtdjJ4LWxvY2FsLXNlcnZpY2UtaW5mb3JtYXRpb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNncHAuYWNjZXNzLXRyYW5zZmVyLWV2ZW50cyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuM2dwcC5ic2YreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNncHAuZ21vcCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuM2dwcC5tYy1zaWduYWxsaW5nLWVhclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuM2dwcC5tY2RhdGEtYWZmaWxpYXRpb24tY29tbWFuZCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuM2dwcC5tY2RhdGEtaW5mbyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuM2dwcC5tY2RhdGEtcGF5bG9hZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuM2dwcC5tY2RhdGEtc2VydmljZS1jb25maWcreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNncHAubWNkYXRhLXNpZ25hbGxpbmdcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNncHAubWNkYXRhLXVlLWNvbmZpZyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuM2dwcC5tY2RhdGEtdXNlci1wcm9maWxlK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC4zZ3BwLm1jcHR0LWFmZmlsaWF0aW9uLWNvbW1hbmQreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNncHAubWNwdHQtZmxvb3ItcmVxdWVzdCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuM2dwcC5tY3B0dC1pbmZvK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC4zZ3BwLm1jcHR0LWxvY2F0aW9uLWluZm8reG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNncHAubWNwdHQtbWJtcy11c2FnZS1pbmZvK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC4zZ3BwLm1jcHR0LXNlcnZpY2UtY29uZmlnK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC4zZ3BwLm1jcHR0LXNpZ25lZCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuM2dwcC5tY3B0dC11ZS1jb25maWcreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNncHAubWNwdHQtdWUtaW5pdC1jb25maWcreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNncHAubWNwdHQtdXNlci1wcm9maWxlK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC4zZ3BwLm1jdmlkZW8tYWZmaWxpYXRpb24tY29tbWFuZCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuM2dwcC5tY3ZpZGVvLWFmZmlsaWF0aW9uLWluZm8reG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNncHAubWN2aWRlby1pbmZvK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC4zZ3BwLm1jdmlkZW8tbG9jYXRpb24taW5mbyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuM2dwcC5tY3ZpZGVvLW1ibXMtdXNhZ2UtaW5mbyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuM2dwcC5tY3ZpZGVvLXNlcnZpY2UtY29uZmlnK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC4zZ3BwLm1jdmlkZW8tdHJhbnNtaXNzaW9uLXJlcXVlc3QreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNncHAubWN2aWRlby11ZS1jb25maWcreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNncHAubWN2aWRlby11c2VyLXByb2ZpbGUreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNncHAubWlkLWNhbGwreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNncHAucGljLWJ3LWxhcmdlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicGxiXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNncHAucGljLWJ3LXNtYWxsXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicHNiXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNncHAucGljLWJ3LXZhclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInB2YlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC4zZ3BwLnNtc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuM2dwcC5zbXMreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNncHAuc3J2Y2MtZXh0K3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC4zZ3BwLnNydmNjLWluZm8reG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNncHAuc3RhdGUtYW5kLWV2ZW50LWluZm8reG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNncHAudXNzZCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuM2dwcDIuYmNtY3NpbmZvK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC4zZ3BwMi5zbXNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNncHAyLnRjYXBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ0Y2FwXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNsaWdodHNzb2Z0d2FyZS5pbWFnZXNjYWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLjNtLnBvc3QtaXQtbm90ZXNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJwd25cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYWNjcGFjLnNpbXBseS5hc29cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJhc29cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYWNjcGFjLnNpbXBseS5pbXBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJpbXBcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYWN1Y29ib2xcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJhY3VcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYWN1Y29ycFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImF0Y1wiLFwiYWN1dGNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYWRvYmUuYWlyLWFwcGxpY2F0aW9uLWluc3RhbGxlci1wYWNrYWdlK3ppcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiYWlyXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmFkb2JlLmZsYXNoLm1vdmllXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5mb3Jtc2NlbnRyYWwuZmNkdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImZjZHRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYWRvYmUuZnhwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZnhwXCIsXCJmeHBsXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmFkb2JlLnBhcnRpYWwtdXBsb2FkXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5hZG9iZS54ZHAreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ4ZHBcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYWRvYmUueGZkZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhmZGZcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYWV0aGVyLmltcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYWZwYy5hZnBsaW5lZGF0YVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYWZwYy5hZnBsaW5lZGF0YS1wYWdlZGVmXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5hZnBjLmZvY2EtY2hhcnNldFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYWZwYy5mb2NhLWNvZGVkZm9udFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYWZwYy5mb2NhLWNvZGVwYWdlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5hZnBjLm1vZGNhXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5hZnBjLm1vZGNhLWZvcm1kZWZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmFmcGMubW9kY2EtbWVkaXVtbWFwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5hZnBjLm1vZGNhLW9iamVjdGNvbnRhaW5lclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYWZwYy5tb2RjYS1vdmVybGF5XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5hZnBjLm1vZGNhLXBhZ2VzZWdtZW50XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5haC1iYXJjb2RlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5haGVhZC5zcGFjZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImFoZWFkXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmFpcnppcC5maWxlc2VjdXJlLmF6ZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImF6ZlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5haXJ6aXAuZmlsZXNlY3VyZS5henNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJhenNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYW1hZGV1cytqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmFtYXpvbi5lYm9va1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiYXp3XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmFtYXpvbi5tb2JpOC1lYm9va1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYW1lcmljYW5keW5hbWljcy5hY2NcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJhY2NcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYW1pZ2EuYW1pXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiYW1pXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmFtdW5kc2VuLm1hemUreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmFuZHJvaWQub3RhXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5hbmRyb2lkLnBhY2thZ2UtYXJjaGl2ZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiYXBrXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmFua2lcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmFuc2VyLXdlYi1jZXJ0aWZpY2F0ZS1pc3N1ZS1pbml0aWF0aW9uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiY2lpXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmFuc2VyLXdlYi1mdW5kcy10cmFuc2Zlci1pbml0aWF0aW9uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJmdGlcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYW50aXguZ2FtZS1jb21wb25lbnRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJhdHhcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYXBhY2hlLnRocmlmdC5iaW5hcnlcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmFwYWNoZS50aHJpZnQuY29tcGFjdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYXBhY2hlLnRocmlmdC5qc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5hcGkranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5hcGxleHRvci53YXJycCtqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmFwb3RoZWtlbmRlLnJlc2VydmF0aW9uK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYXBwbGUuaW5zdGFsbGVyK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibXBrZ1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5hcHBsZS5rZXlub3RlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wia2V5bm90ZVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5hcHBsZS5tcGVndXJsXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibTN1OFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5hcHBsZS5udW1iZXJzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibnVtYmVyc1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5hcHBsZS5wYWdlc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInBhZ2VzXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmFwcGxlLnBrcGFzc1wiOiB7XG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInBrcGFzc1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5hcmFzdHJhLnN3aVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYXJpc3RhbmV0d29ya3Muc3dpXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic3dpXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmFydGlzYW4ranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5hcnRzcXVhcmVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmFzdHJhZWEtc29mdHdhcmUuaW90YVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImlvdGFcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYXVkaW9ncmFwaFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImFlcFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5hdXRvcGFja2FnZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYXZhbG9uK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYXZpc3Rhcit4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYmFsc2FtaXEuYm1tbCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImJtbWxcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYmFsc2FtaXEuYm1wclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYmFuYW5hLWFjY291bnRpbmdcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmJiZi51c3AuZXJyb3JcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmJiZi51c3AubXNnXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5iYmYudXNwLm1zZytqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmJla2l0enVyLXN0ZWNoK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYmludC5tZWQtY29udGVudFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYmlvcGF4LnJkZit4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuYmxpbmstaWRiLXZhbHVlLXdyYXBwZXJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmJsdWVpY2UubXVsdGlwYXNzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibXBtXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmJsdWV0b290aC5lcC5vb2JcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmJsdWV0b290aC5sZS5vb2JcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmJtaVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImJtaVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5icGZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmJwZjNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmJ1c2luZXNzb2JqZWN0c1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInJlcFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ieXUudWFwaStqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmNhYi1qc2NyaXB0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5jYW5vbi1jcGRsXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5jYW5vbi1saXBzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5jYXBhc3lzdGVtcy1wZytqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmNlbmRpby50aGlubGluYy5jbGllbnRjb25mXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5jZW50dXJ5LXN5c3RlbXMudGNwX3N0cmVhbVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuY2hlbWRyYXcreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJjZHhtbFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5jaGVzcy1wZ25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmNoaXBudXRzLmthcmFva2UtbW1kXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibW1kXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmNpZWRpXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5jaW5kZXJlbGxhXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiY2R5XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmNpcnBhY2suaXNkbi1leHRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmNpdGF0aW9uc3R5bGVzLnN0eWxlK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiY3NsXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmNsYXltb3JlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiY2xhXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmNsb2FudG8ucnA5XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicnA5XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmNsb25rLmM0Z3JvdXBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJjNGdcIixcImM0ZFwiLFwiYzRmXCIsXCJjNHBcIixcImM0dVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5jbHVldHJ1c3QuY2FydG9tb2JpbGUtY29uZmlnXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiYzExYW1jXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmNsdWV0cnVzdC5jYXJ0b21vYmlsZS1jb25maWctcGtnXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiYzExYW16XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmNvZmZlZXNjcmlwdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuY29sbGFiaW8ueG9kb2N1bWVudHMuZG9jdW1lbnRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmNvbGxhYmlvLnhvZG9jdW1lbnRzLmRvY3VtZW50LXRlbXBsYXRlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5jb2xsYWJpby54b2RvY3VtZW50cy5wcmVzZW50YXRpb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmNvbGxhYmlvLnhvZG9jdW1lbnRzLnByZXNlbnRhdGlvbi10ZW1wbGF0ZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuY29sbGFiaW8ueG9kb2N1bWVudHMuc3ByZWFkc2hlZXRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmNvbGxhYmlvLnhvZG9jdW1lbnRzLnNwcmVhZHNoZWV0LXRlbXBsYXRlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5jb2xsZWN0aW9uK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuY29sbGVjdGlvbi5kb2MranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5jb2xsZWN0aW9uLm5leHQranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5jb21pY2Jvb2sremlwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5jb21pY2Jvb2stcmFyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5jb21tZXJjZS1iYXR0ZWxsZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuY29tbW9uc3BhY2VcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJjc3BcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuY29udGFjdC5jbXNnXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiY2RiY21zZ1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5jb3Jlb3MuaWduaXRpb24ranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5jb3Ntb2NhbGxlclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImNtY1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5jcmljay5jbGlja2VyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiY2xreFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5jcmljay5jbGlja2VyLmtleWJvYXJkXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiY2xra1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5jcmljay5jbGlja2VyLnBhbGV0dGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJjbGtwXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmNyaWNrLmNsaWNrZXIudGVtcGxhdGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJjbGt0XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmNyaWNrLmNsaWNrZXIud29yZGJhbmtcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJjbGt3XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmNyaXRpY2FsdG9vbHMud2JzK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wid2JzXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmNyeXB0aWkucGlwZStqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmNyeXB0by1zaGFkZS1maWxlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5jdGMtcG9zbWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJwbWxcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuY3RjdC53cyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuY3Vwcy1wZGZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmN1cHMtcG9zdHNjcmlwdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuY3Vwcy1wcGRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJwcGRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuY3Vwcy1yYXN0ZXJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmN1cHMtcmF3XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5jdXJsXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5jdXJsLmNhclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiY2FyXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmN1cmwucGN1cmxcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInBjdXJsXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmN5YW4uZGVhbi5yb290K3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5jeWJhbmtcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmQybC5jb3Vyc2VwYWNrYWdlMXAwK3ppcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2VcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZGFydFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZGFydFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5kYXRhLXZpc2lvbi5yZHpcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJyZHpcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZGF0YXBhY2thZ2UranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5kYXRhcmVzb3VyY2UranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5kYmZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmRlYmlhbi5iaW5hcnktcGFja2FnZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZGVjZS5kYXRhXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1widXZmXCIsXCJ1dnZmXCIsXCJ1dmRcIixcInV2dmRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZGVjZS50dG1sK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1widXZ0XCIsXCJ1dnZ0XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmRlY2UudW5zcGVjaWZpZWRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ1dnhcIixcInV2dnhcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZGVjZS56aXBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ1dnpcIixcInV2dnpcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZGVub3ZvLmZjc2VsYXlvdXQtbGlua1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImZlX2xhdW5jaFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5kZXNtdW1lLm1vdmllXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5kaXItYmkucGxhdGUtZGwtbm9zdWZmaXhcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmRtLmRlbGVnYXRpb24reG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmRuYVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImRuYVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5kb2N1bWVudCtqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmRvbGJ5Lm1scFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibWxwXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmRvbGJ5Lm1vYmlsZS4xXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5kb2xieS5tb2JpbGUuMlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZG9yZW1pci5zY29yZWNsb3VkLWJpbmFyeS1kb2N1bWVudFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZHBncmFwaFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImRwZ1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5kcmVhbWZhY3RvcnlcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJkZmFjXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmRyaXZlK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZHMta2V5cG9pbnRcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImtweHhcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZHRnLmxvY2FsXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5kdGcubG9jYWwuZmxhc2hcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmR0Zy5sb2NhbC5odG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5kdmIuYWl0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiYWl0XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmR2Yi5kdmJpc2wreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmR2Yi5kdmJqXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5kdmIuZXNnY29udGFpbmVyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5kdmIuaXBkY2RmdG5vdGlmYWNjZXNzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5kdmIuaXBkY2VzZ2FjY2Vzc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZHZiLmlwZGNlc2dhY2Nlc3MyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5kdmIuaXBkY2VzZ3BkZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZHZiLmlwZGNyb2FtaW5nXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5kdmIuaXB0di5hbGZlYy1iYXNlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5kdmIuaXB0di5hbGZlYy1lbmhhbmNlbWVudFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZHZiLm5vdGlmLWFnZ3JlZ2F0ZS1yb290K3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5kdmIubm90aWYtY29udGFpbmVyK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5kdmIubm90aWYtZ2VuZXJpYyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZHZiLm5vdGlmLWlhLW1zZ2xpc3QreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmR2Yi5ub3RpZi1pYS1yZWdpc3RyYXRpb24tcmVxdWVzdCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZHZiLm5vdGlmLWlhLXJlZ2lzdHJhdGlvbi1yZXNwb25zZSt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZHZiLm5vdGlmLWluaXQreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmR2Yi5wZnJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmR2Yi5zZXJ2aWNlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic3ZjXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmR4clwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZHluYWdlb1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImdlb1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5kenJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmVhc3lrYXJhb2tlLmNkZ2Rvd25sb2FkXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5lY2Rpcy11cGRhdGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmVjaXAucmxwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5lY293aW4uY2hhcnRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJtYWdcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZWNvd2luLmZpbGVyZXF1ZXN0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5lY293aW4uZmlsZXVwZGF0ZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZWNvd2luLnNlcmllc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZWNvd2luLnNlcmllc3JlcXVlc3RcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmVjb3dpbi5zZXJpZXN1cGRhdGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmVmaS5pbWdcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmVmaS5pc29cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmVtY2xpZW50LmFjY2Vzc3JlcXVlc3QreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmVubGl2ZW5cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJubWxcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZW5waGFzZS5lbnZveVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZXByaW50cy5kYXRhK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5lcHNvbi5lc2ZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJlc2ZcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZXBzb24ubXNmXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibXNmXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmVwc29uLnF1aWNrYW5pbWVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJxYW1cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZXBzb24uc2FsdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNsdFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5lcHNvbi5zc2ZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzc2ZcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZXJpY3Nzb24ucXVpY2tjYWxsXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5lc3Bhc3MtZXNwYXNzK3ppcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2VcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZXN6aWdubzMreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJlczNcIixcImV0M1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ldHNpLmFvYyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZXRzaS5hc2ljLWUremlwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ldHNpLmFzaWMtcyt6aXBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmV0c2kuY3VnK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ldHNpLmlwdHZjb21tYW5kK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ldHNpLmlwdHZkaXNjb3ZlcnkreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmV0c2kuaXB0dnByb2ZpbGUreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmV0c2kuaXB0dnNhZC1iYyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZXRzaS5pcHR2c2FkLWNvZCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZXRzaS5pcHR2c2FkLW5wdnIreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmV0c2kuaXB0dnNlcnZpY2UreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmV0c2kuaXB0dnN5bmMreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmV0c2kuaXB0dnVlcHJvZmlsZSt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZXRzaS5tY2lkK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ldHNpLm1oZWc1XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ldHNpLm92ZXJsb2FkLWNvbnRyb2wtcG9saWN5LWRhdGFzZXQreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmV0c2kucHN0bit4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZXRzaS5zY2kreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmV0c2kuc2ltc2VydnMreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmV0c2kudGltZXN0YW1wLXRva2VuXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ldHNpLnRzbCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZXRzaS50c2wuZGVyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ldWRvcmEuZGF0YVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZXZvbHYuZWNpZy5wcm9maWxlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ldm9sdi5lY2lnLnNldHRpbmdzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ldm9sdi5lY2lnLnRoZW1lXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5leHN0cmVhbS1lbXBvd2VyK3ppcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2VcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZXhzdHJlYW0tcGFja2FnZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZXpwaXgtYWxidW1cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJlejJcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZXpwaXgtcGFja2FnZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImV6M1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5mLXNlY3VyZS5tb2JpbGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmZhc3Rjb3B5LWRpc2staW1hZ2VcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmZkZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImZkZlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5mZHNuLm1zZWVkXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibXNlZWRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZmRzbi5zZWVkXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic2VlZFwiLFwiZGF0YWxlc3NcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZmZzbnNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmZpY2xhYi5mbGIremlwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5maWxtaXQuemZjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5maW50c1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZmlyZW1vbmtleXMuY2xvdWRjZWxsXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5mbG9ncmFwaGl0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZ3BoXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmZsdXh0aW1lLmNsaXBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJmdGNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZm9udC1mb250Zm9yZ2Utc2ZkXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5mcmFtZW1ha2VyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZm1cIixcImZyYW1lXCIsXCJtYWtlclwiLFwiYm9va1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5mcm9nYW5zLmZuY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImZuY1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5mcm9nYW5zLmx0ZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImx0ZlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5mc2Mud2VibGF1bmNoXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZnNjXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmZ1aml0c3Uub2FzeXNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJvYXNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZnVqaXRzdS5vYXN5czJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJvYTJcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZnVqaXRzdS5vYXN5czNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJvYTNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZnVqaXRzdS5vYXN5c2dwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZmc1XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmZ1aml0c3Uub2FzeXNwcnNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJiaDJcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZnVqaXhlcm94LmFydC1leFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZnVqaXhlcm94LmFydDRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmZ1aml4ZXJveC5kZGRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJkZGRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZnVqaXhlcm94LmRvY3V3b3Jrc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhkd1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5mdWppeGVyb3guZG9jdXdvcmtzLmJpbmRlclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhiZFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5mdWppeGVyb3guZG9jdXdvcmtzLmNvbnRhaW5lclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZnVqaXhlcm94LmhicGxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmZ1dC1taXNuZXRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmZ1dG9pbitjYm9yXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5mdXRvaW4ranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5mdXp6eXNoZWV0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZnpzXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmdlbm9tYXRpeC50dXhlZG9cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ0eGRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZ2VudGljcy5ncmQranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5nZW8ranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5nZW9jdWJlK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5nZW9nZWJyYS5maWxlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZ2diXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmdlb2dlYnJhLnRvb2xcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJnZ3RcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZ2VvbWV0cnktZXhwbG9yZXJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJnZXhcIixcImdyZVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5nZW9uZXh0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZ3h0XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmdlb3BsYW5cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJnMndcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZ2Vvc3BhY2VcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJnM3dcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZ2VyYmVyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5nbG9iYWxwbGF0Zm9ybS5jYXJkLWNvbnRlbnQtbWd0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5nbG9iYWxwbGF0Zm9ybS5jYXJkLWNvbnRlbnQtbWd0LXJlc3BvbnNlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5nbXhcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJnbXhcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZ29vZ2xlLWFwcHMuZG9jdW1lbnRcIjoge1xuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJnZG9jXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmdvb2dsZS1hcHBzLnByZXNlbnRhdGlvblwiOiB7XG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImdzbGlkZXNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZ29vZ2xlLWFwcHMuc3ByZWFkc2hlZXRcIjoge1xuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJnc2hlZXRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZ29vZ2xlLWVhcnRoLmttbCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImttbFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5nb29nbGUtZWFydGgua216XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wia216XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmdvdi5zay5lLWZvcm0reG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmdvdi5zay5lLWZvcm0remlwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5nb3Yuc2sueG1sZGF0YWNvbnRhaW5lcit4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZ3JhZmVxXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZ3FmXCIsXCJncXNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZ3JpZG1wXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ncm9vdmUtYWNjb3VudFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImdhY1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ncm9vdmUtaGVscFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImdoZlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ncm9vdmUtaWRlbnRpdHktbWVzc2FnZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImdpbVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ncm9vdmUtaW5qZWN0b3JcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJncnZcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuZ3Jvb3ZlLXRvb2wtbWVzc2FnZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImd0bVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ncm9vdmUtdG9vbC10ZW1wbGF0ZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInRwbFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ncm9vdmUtdmNhcmRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ2Y2dcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuaGFsK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuaGFsK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiaGFsXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmhhbmRoZWxkLWVudGVydGFpbm1lbnQreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ6bW1cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuaGJjaVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImhiY2lcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuaGMranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5oY2wtYmlyZXBvcnRzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5oZHRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmhlcm9rdStqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmhoZS5sZXNzb24tcGxheWVyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibGVzXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmhwLWhwZ2xcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJocGdsXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmhwLWhwaWRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJocGlkXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmhwLWhwc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImhwc1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ocC1qbHl0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiamx0XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmhwLXBjbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInBjbFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ocC1wY2x4bFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInBjbHhsXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmh0dHBob25lXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5oeWRyb3N0YXRpeC5zb2YtZGF0YVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNmZC1oZHN0eFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5oeXBlcitqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmh5cGVyLWl0ZW0ranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5oeXBlcmRyaXZlK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuaHpuLTNkLWNyb3Nzd29yZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuaWJtLmFmcGxpbmVkYXRhXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5pYm0uZWxlY3Ryb25pYy1tZWRpYVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuaWJtLm1pbmlwYXlcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJtcHlcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuaWJtLm1vZGNhcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImFmcFwiLFwibGlzdGFmcFwiLFwibGlzdDM4MjBcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuaWJtLnJpZ2h0cy1tYW5hZ2VtZW50XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiaXJtXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmlibS5zZWN1cmUtY29udGFpbmVyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic2NcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuaWNjcHJvZmlsZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImljY1wiLFwiaWNtXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmllZWUuMTkwNVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuaWdsb2FkZXJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJpZ2xcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuaW1hZ2VtZXRlci5mb2xkZXIremlwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5pbWFnZW1ldGVyLmltYWdlK3ppcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2VcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuaW1tZXJ2aXNpb24taXZwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiaXZwXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmltbWVydmlzaW9uLWl2dVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIml2dVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5pbXMuaW1zY2N2MXAxXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5pbXMuaW1zY2N2MXAyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5pbXMuaW1zY2N2MXAzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5pbXMubGlzLnYyLnJlc3VsdCtqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmltcy5sdGkudjIudG9vbGNvbnN1bWVycHJvZmlsZStqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmltcy5sdGkudjIudG9vbHByb3h5K2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuaW1zLmx0aS52Mi50b29scHJveHkuaWQranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5pbXMubHRpLnYyLnRvb2xzZXR0aW5ncytqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmltcy5sdGkudjIudG9vbHNldHRpbmdzLnNpbXBsZStqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmluZm9ybWVkY29udHJvbC5ybXMreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmluZm9ybWl4LXZpc2lvbmFyeVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuaW5mb3RlY2gucHJvamVjdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuaW5mb3RlY2gucHJvamVjdCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuaW5ub3BhdGgud2FtcC5ub3RpZmljYXRpb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmluc29ycy5pZ21cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJpZ21cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuaW50ZXJjb24uZm9ybW5ldFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhwd1wiLFwieHB4XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmludGVyZ2VvXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiaTJnXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmludGVydHJ1c3QuZGlnaWJveFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuaW50ZXJ0cnVzdC5ubmNwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5pbnR1LnFib1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInFib1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5pbnR1LnFmeFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInFmeFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5pcHRjLmcyLmNhdGFsb2dpdGVtK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5pcHRjLmcyLmNvbmNlcHRpdGVtK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5pcHRjLmcyLmtub3dsZWRnZWl0ZW0reG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmlwdGMuZzIubmV3c2l0ZW0reG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmlwdGMuZzIubmV3c21lc3NhZ2UreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmlwdGMuZzIucGFja2FnZWl0ZW0reG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmlwdGMuZzIucGxhbm5pbmdpdGVtK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5pcHVucGx1Z2dlZC5yY3Byb2ZpbGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJyY3Byb2ZpbGVcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuaXJlcG9zaXRvcnkucGFja2FnZSt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImlycFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5pcy14cHJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ4cHJcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuaXNhYy5mY3NcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJmY3NcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuaXNvMTE3ODMtMTAremlwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5qYW1cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJqYW1cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuamFwYW5uZXQtZGlyZWN0b3J5LXNlcnZpY2VcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmphcGFubmV0LWpwbnN0b3JlLXdha2V1cFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuamFwYW5uZXQtcGF5bWVudC13YWtldXBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmphcGFubmV0LXJlZ2lzdHJhdGlvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuamFwYW5uZXQtcmVnaXN0cmF0aW9uLXdha2V1cFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuamFwYW5uZXQtc2V0c3RvcmUtd2FrZXVwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5qYXBhbm5ldC12ZXJpZmljYXRpb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmphcGFubmV0LXZlcmlmaWNhdGlvbi13YWtldXBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmpjcC5qYXZhbWUubWlkbGV0LXJtc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInJtc1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5qaXNwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiamlzcFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5qb29zdC5qb2RhLWFyY2hpdmVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJqb2RhXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmpzay5pc2RuLW5nblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQua2Fob290elwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImt0elwiLFwia3RyXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmtkZS5rYXJib25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJrYXJib25cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQua2RlLmtjaGFydFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImNocnRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQua2RlLmtmb3JtdWxhXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wia2ZvXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmtkZS5raXZpb1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImZsd1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5rZGUua29udG91clwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImtvblwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5rZGUua3ByZXNlbnRlclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImtwclwiLFwia3B0XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmtkZS5rc3ByZWFkXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wia3NwXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmtkZS5rd29yZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImt3ZFwiLFwia3d0XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmtlbmFtZWFhcHBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJodGtlXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmtpZHNwaXJhdGlvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImtpYVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5raW5hclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImtuZVwiLFwia25wXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmtvYW5cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJza3BcIixcInNrZFwiLFwic2t0XCIsXCJza21cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQua29kYWstZGVzY3JpcHRvclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNzZVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5sYXNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmxhcy5sYXMranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5sYXMubGFzK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibGFzeG1sXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmxhc3ppcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubGVhcCtqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmxpYmVydHktcmVxdWVzdCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubGxhbWFncmFwaGljcy5saWZlLWJhbGFuY2UuZGVza3RvcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImxiZFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5sbGFtYWdyYXBoaWNzLmxpZmUtYmFsYW5jZS5leGNoYW5nZSt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImxiZVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5sb2dpcGlwZS5jaXJjdWl0K3ppcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2VcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubG9vbVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubG90dXMtMS0yLTNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCIxMjNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubG90dXMtYXBwcm9hY2hcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJhcHJcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubG90dXMtZnJlZWxhbmNlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicHJlXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmxvdHVzLW5vdGVzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibnNmXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLmxvdHVzLW9yZ2FuaXplclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm9yZ1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5sb3R1cy1zY3JlZW5jYW1cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzY21cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubG90dXMtd29yZHByb1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImx3cFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tYWNwb3J0cy5wb3J0cGtnXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicG9ydHBrZ1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tYXBib3gtdmVjdG9yLXRpbGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1hcmxpbi5kcm0uYWN0aW9udG9rZW4reG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1hcmxpbi5kcm0uY29uZnRva2VuK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tYXJsaW4uZHJtLmxpY2Vuc2UreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1hcmxpbi5kcm0ubWRjZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubWFzb24ranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tYXhtaW5kLm1heG1pbmQtZGJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1jZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm1jZFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tZWRjYWxjZGF0YVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm1jMVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tZWRpYXN0YXRpb24uY2RrZXlcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJjZGtleVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tZXJpZGlhbi1zbGluZ3Nob3RcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1mZXJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJtd2ZcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubWZtcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm1mbVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5taWNybytqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1pY3JvZ3JhZnguZmxvXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZmxvXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1pY3JvZ3JhZnguaWd4XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiaWd4XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1pY3Jvc29mdC5wb3J0YWJsZS1leGVjdXRhYmxlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5taWNyb3NvZnQud2luZG93cy50aHVtYm5haWwtY2FjaGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1pZWxlK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubWlmXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibWlmXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1pbmlzb2Z0LWhwMzAwMC1zYXZlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5taXRzdWJpc2hpLm1pc3R5LWd1YXJkLnRydXN0d2ViXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tb2JpdXMuZGFmXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZGFmXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1vYml1cy5kaXNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJkaXNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubW9iaXVzLm1ia1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm1ia1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tb2JpdXMubXF5XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibXF5XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1vYml1cy5tc2xcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJtc2xcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubW9iaXVzLnBsY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInBsY1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tb2JpdXMudHhmXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1widHhmXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1vcGh1bi5hcHBsaWNhdGlvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm1wblwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tb3BodW4uY2VydGlmaWNhdGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJtcGNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubW90b3JvbGEuZmxleHN1aXRlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tb3Rvcm9sYS5mbGV4c3VpdGUuYWRzaVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubW90b3JvbGEuZmxleHN1aXRlLmZpc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubW90b3JvbGEuZmxleHN1aXRlLmdvdGFwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tb3Rvcm9sYS5mbGV4c3VpdGUua21yXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tb3Rvcm9sYS5mbGV4c3VpdGUudHRjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tb3Rvcm9sYS5mbGV4c3VpdGUud2VtXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tb3Rvcm9sYS5pcHJtXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tb3ppbGxhLnh1bCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInh1bFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tcy0zbWZkb2N1bWVudFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubXMtYXJ0Z2FscnlcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJjaWxcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubXMtYXNmXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tcy1jYWItY29tcHJlc3NlZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImNhYlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tcy1jb2xvci5pY2Nwcm9maWxlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wieGxzXCIsXCJ4bG1cIixcInhsYVwiLFwieGxjXCIsXCJ4bHRcIixcInhsd1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC5hZGRpbi5tYWNyb2VuYWJsZWQuMTJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ4bGFtXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLnNoZWV0LmJpbmFyeS5tYWNyb2VuYWJsZWQuMTJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ4bHNiXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLnNoZWV0Lm1hY3JvZW5hYmxlZC4xMlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhsc21cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwudGVtcGxhdGUubWFjcm9lbmFibGVkLjEyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wieGx0bVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tcy1mb250b2JqZWN0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJlb3RcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubXMtaHRtbGhlbHBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJjaG1cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubXMtaW1zXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiaW1zXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1zLWxybVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImxybVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tcy1vZmZpY2UuYWN0aXZleCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubXMtb2ZmaWNldGhlbWVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ0aG14XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1zLW9wZW50eXBlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubXMtb3V0bG9va1wiOiB7XG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm1zZ1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tcy1wYWNrYWdlLm9iZnVzY2F0ZWQtb3BlbnR5cGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubXMtcGtpLnNlY2NhdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiY2F0XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1zLXBraS5zdGxcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInN0bFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tcy1wbGF5cmVhZHkuaW5pdGlhdG9yK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicHB0XCIsXCJwcHNcIixcInBvdFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50LmFkZGluLm1hY3JvZW5hYmxlZC4xMlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInBwYW1cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludC5wcmVzZW50YXRpb24ubWFjcm9lbmFibGVkLjEyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicHB0bVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50LnNsaWRlLm1hY3JvZW5hYmxlZC4xMlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNsZG1cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludC5zbGlkZXNob3cubWFjcm9lbmFibGVkLjEyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicHBzbVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50LnRlbXBsYXRlLm1hY3JvZW5hYmxlZC4xMlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInBvdG1cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubXMtcHJpbnRkZXZpY2VjYXBhYmlsaXRpZXMreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1zLXByaW50aW5nLnByaW50dGlja2V0K3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1zLXByaW50c2NoZW1hdGlja2V0K3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tcy1wcm9qZWN0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibXBwXCIsXCJtcHRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubXMtdG5lZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubXMtd2luZG93cy5kZXZpY2VwYWlyaW5nXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tcy13aW5kb3dzLm53cHJpbnRpbmcub29iXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tcy13aW5kb3dzLnByaW50ZXJwYWlyaW5nXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tcy13aW5kb3dzLndzZC5vb2JcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1zLXdtZHJtLmxpYy1jaGxnLXJlcVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubXMtd21kcm0ubGljLXJlc3BcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1zLXdtZHJtLm1ldGVyLWNobGctcmVxXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tcy13bWRybS5tZXRlci1yZXNwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tcy13b3JkLmRvY3VtZW50Lm1hY3JvZW5hYmxlZC4xMlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImRvY21cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubXMtd29yZC50ZW1wbGF0ZS5tYWNyb2VuYWJsZWQuMTJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJkb3RtXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1zLXdvcmtzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wid3BzXCIsXCJ3a3NcIixcIndjbVwiLFwid2RiXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm1zLXdwbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIndwbFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tcy14cHNkb2N1bWVudFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhwc1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5tc2EtZGlzay1pbWFnZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubXNlcVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm1zZXFcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubXNpZ25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm11bHRpYWQuY3JlYXRvclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubXVsdGlhZC5jcmVhdG9yLmNpZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubXVzaWMtbmlmZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubXVzaWNpYW5cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJtdXNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubXV2ZWUuc3R5bGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJtc3R5XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm15bmZjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1widGFnbGV0XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm5jZC5jb250cm9sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5uY2QucmVmZXJlbmNlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5uZWFyc3QuaW52K2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubmVydmFuYVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubmV0ZnB4XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5uZXVyb2xhbmd1YWdlLm5sdVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm5sdVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5uaW1uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5uaW50ZW5kby5uaXRyby5yb21cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm5pbnRlbmRvLnNuZXMucm9tXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5uaXRmXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibnRmXCIsXCJuaXRmXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm5vYmxlbmV0LWRpcmVjdG9yeVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm5uZFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ub2JsZW5ldC1zZWFsZXJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJubnNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubm9ibGVuZXQtd2ViXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibm53XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm5va2lhLmNhdGFsb2dzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ub2tpYS5jb25tbCt3YnhtbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubm9raWEuY29ubWwreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm5va2lhLmlwdHYuY29uZmlnK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ub2tpYS5pc2RzLXJhZGlvLXByZXNldHNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm5va2lhLmxhbmRtYXJrK3dieG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ub2tpYS5sYW5kbWFyayt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubm9raWEubGFuZG1hcmtjb2xsZWN0aW9uK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ub2tpYS5uLWdhZ2UuYWMreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJhY1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ub2tpYS5uLWdhZ2UuZGF0YVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm5nZGF0XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm5va2lhLm4tZ2FnZS5zeW1iaWFuLmluc3RhbGxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJuLWdhZ2VcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubm9raWEubmNkXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ub2tpYS5wY2Qrd2J4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm5va2lhLnBjZCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubm9raWEucmFkaW8tcHJlc2V0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicnBzdFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ub2tpYS5yYWRpby1wcmVzZXRzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicnBzc1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ub3ZhZGlnbS5lZG1cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJlZG1cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubm92YWRpZ20uZWR4XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZWR4XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm5vdmFkaWdtLmV4dFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImV4dFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5udHQtbG9jYWwuY29udGVudC1zaGFyZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubnR0LWxvY2FsLmZpbGUtdHJhbnNmZXJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm50dC1sb2NhbC5vZ3dfcmVtb3RlLWFjY2Vzc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQubnR0LWxvY2FsLnNpcC10YV9yZW1vdGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm50dC1sb2NhbC5zaXAtdGFfdGNwX3N0cmVhbVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LmNoYXJ0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wib2RjXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5jaGFydC10ZW1wbGF0ZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm90Y1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuZGF0YWJhc2VcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJvZGJcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LmZvcm11bGFcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJvZGZcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LmZvcm11bGEtdGVtcGxhdGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJvZGZ0XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5ncmFwaGljc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm9kZ1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuZ3JhcGhpY3MtdGVtcGxhdGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJvdGdcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LmltYWdlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wib2RpXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5pbWFnZS10ZW1wbGF0ZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm90aVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQucHJlc2VudGF0aW9uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wib2RwXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5wcmVzZW50YXRpb24tdGVtcGxhdGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJvdHBcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnNwcmVhZHNoZWV0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wib2RzXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5zcHJlYWRzaGVldC10ZW1wbGF0ZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm90c1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQudGV4dFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm9kdFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQudGV4dC1tYXN0ZXJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJvZG1cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnRleHQtdGVtcGxhdGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJvdHRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnRleHQtd2ViXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wib3RoXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9iblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub2NmK2Nib3JcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9jaS5pbWFnZS5tYW5pZmVzdC52MStqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9mdG4ubDEwbitqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9pcGYuY29udGVudGFjY2Vzc2Rvd25sb2FkK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vaXBmLmNvbnRlbnRhY2Nlc3NzdHJlYW1pbmcreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9pcGYuY3NwZy1oZXhiaW5hcnlcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9pcGYuZGFlLnN2Zyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub2lwZi5kYWUueGh0bWwreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9pcGYubWlwcHZjb250cm9sbWVzc2FnZSt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub2lwZi5wYWUuZ2VtXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vaXBmLnNwZGlzY292ZXJ5K3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vaXBmLnNwZGxpc3QreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9pcGYudWVwcm9maWxlK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vaXBmLnVzZXJwcm9maWxlK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vbHBjLXN1Z2FyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wieG9cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub21hLXNjd3MtY29uZmlnXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vbWEtc2N3cy1odHRwLXJlcXVlc3RcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9tYS1zY3dzLWh0dHAtcmVzcG9uc2VcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9tYS5iY2FzdC5hc3NvY2lhdGVkLXByb2NlZHVyZS1wYXJhbWV0ZXIreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9tYS5iY2FzdC5kcm0tdHJpZ2dlcit4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub21hLmJjYXN0LmltZCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub21hLmJjYXN0Lmx0a21cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9tYS5iY2FzdC5ub3RpZmljYXRpb24reG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9tYS5iY2FzdC5wcm92aXNpb25pbmd0cmlnZ2VyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vbWEuYmNhc3Quc2dib290XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vbWEuYmNhc3Quc2dkZCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub21hLmJjYXN0LnNnZHVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9tYS5iY2FzdC5zaW1wbGUtc3ltYm9sLWNvbnRhaW5lclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub21hLmJjYXN0LnNtYXJ0Y2FyZC10cmlnZ2VyK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vbWEuYmNhc3Quc3Byb3YreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9tYS5iY2FzdC5zdGttXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vbWEuY2FiLWFkZHJlc3MtYm9vayt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub21hLmNhYi1mZWF0dXJlLWhhbmRsZXIreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9tYS5jYWItcGNjK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vbWEuY2FiLXN1YnMtaW52aXRlK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vbWEuY2FiLXVzZXItcHJlZnMreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9tYS5kY2RcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9tYS5kY2RjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vbWEuZGQyK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZGQyXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9tYS5kcm0ucmlzZCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub21hLmdyb3VwLXVzYWdlLWxpc3QreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9tYS5sd20ybStqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9tYS5sd20ybSt0bHZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9tYS5wYWwreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9tYS5wb2MuZGV0YWlsZWQtcHJvZ3Jlc3MtcmVwb3J0K3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vbWEucG9jLmZpbmFsLXJlcG9ydCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub21hLnBvYy5ncm91cHMreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9tYS5wb2MuaW52b2NhdGlvbi1kZXNjcmlwdG9yK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vbWEucG9jLm9wdGltaXplZC1wcm9ncmVzcy1yZXBvcnQreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9tYS5wdXNoXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vbWEuc2NpZG0ubWVzc2FnZXMreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9tYS54Y2FwLWRpcmVjdG9yeSt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub21hZHMtZW1haWwreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNoYXJzZXRcIjogXCJVVEYtOFwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub21hZHMtZmlsZSt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY2hhcnNldFwiOiBcIlVURi04XCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vbWFkcy1mb2xkZXIreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNoYXJzZXRcIjogXCJVVEYtOFwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub21hbG9jLXN1cGwtaW5pdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub25lcGFnZXJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9uZXBhZ2VydGFtcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub25lcGFnZXJ0YW14XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vbmVwYWdlcnRhdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub25lcGFnZXJ0YXRwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vbmVwYWdlcnRhdHhcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9wZW5ibG94LmdhbWUreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJvYmd4XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9wZW5ibG94LmdhbWUtYmluYXJ5XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVuZXllLm9lYlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3Blbm9mZmljZW9yZy5leHRlbnNpb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm94dFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVuc3RyZWV0bWFwLmRhdGEreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJvc21cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuY3VzdG9tLXByb3BlcnRpZXMreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LmN1c3RvbXhtbHByb3BlcnRpZXMreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LmRyYXdpbmcreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LmRyYXdpbmdtbC5jaGFydCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuZHJhd2luZ21sLmNoYXJ0c2hhcGVzK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5kcmF3aW5nbWwuZGlhZ3JhbWNvbG9ycyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuZHJhd2luZ21sLmRpYWdyYW1kYXRhK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5kcmF3aW5nbWwuZGlhZ3JhbWxheW91dCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuZHJhd2luZ21sLmRpYWdyYW1zdHlsZSt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuZXh0ZW5kZWQtcHJvcGVydGllcyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwuY29tbWVudGF1dGhvcnMreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnByZXNlbnRhdGlvbm1sLmNvbW1lbnRzK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5oYW5kb3V0bWFzdGVyK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5ub3Rlc21hc3Rlcit4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwubm90ZXNzbGlkZSt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwucHJlc2VudGF0aW9uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicHB0eFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5wcmVzZW50YXRpb24ubWFpbit4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwucHJlc3Byb3BzK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5zbGlkZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNsZHhcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwuc2xpZGUreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnByZXNlbnRhdGlvbm1sLnNsaWRlbGF5b3V0K3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5zbGlkZW1hc3Rlcit4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwuc2xpZGVzaG93XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicHBzeFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5zbGlkZXNob3cubWFpbit4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwuc2xpZGV1cGRhdGVpbmZvK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC50YWJsZXN0eWxlcyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwudGFncyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwudGVtcGxhdGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJwb3R4XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnByZXNlbnRhdGlvbm1sLnRlbXBsYXRlLm1haW4reG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnByZXNlbnRhdGlvbm1sLnZpZXdwcm9wcyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5jYWxjY2hhaW4reG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwuY2hhcnRzaGVldCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5jb21tZW50cyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5jb25uZWN0aW9ucyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5kaWFsb2dzaGVldCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5leHRlcm5hbGxpbmsreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwucGl2b3RjYWNoZWRlZmluaXRpb24reG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwucGl2b3RjYWNoZXJlY29yZHMreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwucGl2b3R0YWJsZSt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5xdWVyeXRhYmxlK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5zcHJlYWRzaGVldG1sLnJldmlzaW9uaGVhZGVycyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5yZXZpc2lvbmxvZyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5zaGFyZWRzdHJpbmdzK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5zcHJlYWRzaGVldG1sLnNoZWV0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wieGxzeFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5zcHJlYWRzaGVldG1sLnNoZWV0Lm1haW4reG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwuc2hlZXRtZXRhZGF0YSt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5zdHlsZXMreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwudGFibGUreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwudGFibGVzaW5nbGVjZWxscyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC50ZW1wbGF0ZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhsdHhcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC50ZW1wbGF0ZS5tYWluK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5zcHJlYWRzaGVldG1sLnVzZXJuYW1lcyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC52b2xhdGlsZWRlcGVuZGVuY2llcyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC53b3Jrc2hlZXQreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnRoZW1lK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC50aGVtZW92ZXJyaWRlK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC52bWxkcmF3aW5nXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLmNvbW1lbnRzK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLmRvY3VtZW50XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZG9jeFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLmRvY3VtZW50Lmdsb3NzYXJ5K3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLmRvY3VtZW50Lm1haW4reG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwuZW5kbm90ZXMreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwuZm9udHRhYmxlK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLmZvb3Rlcit4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC5mb290bm90ZXMreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwubnVtYmVyaW5nK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLnNldHRpbmdzK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLnN0eWxlcyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC50ZW1wbGF0ZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImRvdHhcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC50ZW1wbGF0ZS5tYWluK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLndlYnNldHRpbmdzK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1wYWNrYWdlLmNvcmUtcHJvcGVydGllcyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtcGFja2FnZS5kaWdpdGFsLXNpZ25hdHVyZS14bWxzaWduYXR1cmUreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLXBhY2thZ2UucmVsYXRpb25zaGlwcyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3JhY2xlLnJlc291cmNlK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3JhbmdlLmluZGF0YVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3NhLm5ldGRlcGxveVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3NnZW8ubWFwZ3VpZGUucGFja2FnZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm1ncFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5vc2dpLmJ1bmRsZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQub3NnaS5kcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImRwXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm9zZ2kuc3Vic3lzdGVtXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZXNhXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLm90cHMuY3Qta2lwK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5veGxpLmNvdW50Z3JhcGhcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnBhZ2VyZHV0eStqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnBhbG1cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJwZGJcIixcInBxYVwiLFwib3ByY1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5wYW5vcGx5XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5wYW9zLnhtbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucGF0ZW50ZGl2ZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucGF0aWVudGVjb21tc2RvY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucGF3YWFmaWxlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicGF3XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnBjb3NcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnBnLmZvcm1hdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInN0clwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5wZy5vc2FzbGlcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJlaTZcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucGlhY2Nlc3MuYXBwbGljYXRpb24tbGljZW5jZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucGljc2VsXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZWZpZlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5wbWkud2lkZ2V0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wid2dcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucG9jLmdyb3VwLWFkdmVydGlzZW1lbnQreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnBvY2tldGxlYXJuXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicGxmXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnBvd2VyYnVpbGRlcjZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJwYmRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucG93ZXJidWlsZGVyNi1zXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5wb3dlcmJ1aWxkZXI3XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5wb3dlcmJ1aWxkZXI3LXNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnBvd2VyYnVpbGRlcjc1XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5wb3dlcmJ1aWxkZXI3NS1zXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5wcmVtaW5ldFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucHJldmlld3N5c3RlbXMuYm94XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiYm94XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnByb3RldXMubWFnYXppbmVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJtZ3pcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucHNmc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucHVibGlzaGFyZS1kZWx0YS10cmVlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicXBzXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnB2aS5wdGlkMVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInB0aWRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucHdnLW11bHRpcGxleGVkXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5wd2cteGh0bWwtcHJpbnQreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnF1YWxjb21tLmJyZXctYXBwLXJlc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucXVhcmFudGFpbmVuZXRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnF1YXJrLnF1YXJreHByZXNzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicXhkXCIsXCJxeHRcIixcInF3ZFwiLFwicXd0XCIsXCJxeGxcIixcInF4YlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5xdW9iamVjdC1xdW94ZG9jdW1lbnRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnJhZGlzeXMubW9tbCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucmFkaXN5cy5tc21sK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5yYWRpc3lzLm1zbWwtYXVkaXQreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnJhZGlzeXMubXNtbC1hdWRpdC1jb25mK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5yYWRpc3lzLm1zbWwtYXVkaXQtY29ubit4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucmFkaXN5cy5tc21sLWF1ZGl0LWRpYWxvZyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucmFkaXN5cy5tc21sLWF1ZGl0LXN0cmVhbSt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucmFkaXN5cy5tc21sLWNvbmYreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnJhZGlzeXMubXNtbC1kaWFsb2creG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnJhZGlzeXMubXNtbC1kaWFsb2ctYmFzZSt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucmFkaXN5cy5tc21sLWRpYWxvZy1mYXgtZGV0ZWN0K3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5yYWRpc3lzLm1zbWwtZGlhbG9nLWZheC1zZW5kcmVjdit4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucmFkaXN5cy5tc21sLWRpYWxvZy1ncm91cCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucmFkaXN5cy5tc21sLWRpYWxvZy1zcGVlY2greG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnJhZGlzeXMubXNtbC1kaWFsb2ctdHJhbnNmb3JtK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5yYWluc3Rvci5kYXRhXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5yYXBpZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucmFyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5yZWFsdm5jLmJlZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImJlZFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5yZWNvcmRhcmUubXVzaWN4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJteGxcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucmVjb3JkYXJlLm11c2ljeG1sK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibXVzaWN4bWxcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucmVubGVhcm4ucmxwcmludFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucmVzdGZ1bCtqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnJpZy5jcnlwdG9ub3RlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiY3J5cHRvbm90ZVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5yaW0uY29kXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJjb2RcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQucm4tcmVhbG1lZGlhXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJybVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5ybi1yZWFsbWVkaWEtdmJyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJybXZiXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnJvdXRlNjYubGluazY2K3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibGluazY2XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnJzLTI3NHhcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnJ1Y2t1cy5kb3dubG9hZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuczNzbXNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnNhaWxpbmd0cmFja2VyLnRyYWNrXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic3RcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc2FyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5zYm0uY2lkXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5zYm0ubWlkMlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc2NyaWJ1c1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc2VhbGVkLjNkZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc2VhbGVkLmNzZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc2VhbGVkLmRvY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc2VhbGVkLmVtbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc2VhbGVkLm1odFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc2VhbGVkLm5ldFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc2VhbGVkLnBwdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc2VhbGVkLnRpZmZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnNlYWxlZC54bHNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnNlYWxlZG1lZGlhLnNvZnRzZWFsLmh0bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnNlYWxlZG1lZGlhLnNvZnRzZWFsLnBkZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc2VlbWFpbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNlZVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5zZW1hXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic2VtYVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5zZW1kXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic2VtZFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5zZW1mXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic2VtZlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5zaGFkZS1zYXZlLWZpbGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnNoYW5hLmluZm9ybWVkLmZvcm1kYXRhXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiaWZtXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnNoYW5hLmluZm9ybWVkLmZvcm10ZW1wbGF0ZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIml0cFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5zaGFuYS5pbmZvcm1lZC5pbnRlcmNoYW5nZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImlpZlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5zaGFuYS5pbmZvcm1lZC5wYWNrYWdlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiaXBrXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnNob290cHJvb2YranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5zaG9wa2ljaytqc29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnNocFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc2h4XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5zaWdyb2suc2Vzc2lvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc2ltdGVjaC1taW5kbWFwcGVyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1widHdkXCIsXCJ0d2RzXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnNpcmVuK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc21hZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm1tZlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5zbWFydC5ub3RlYm9va1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc21hcnQudGVhY2hlclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInRlYWNoZXJcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc25lc2Rldi1wYWdlLXRhYmxlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5zb2Z0d2FyZTYwMi5maWxsZXIuZm9ybSt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImZvXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnNvZnR3YXJlNjAyLmZpbGxlci5mb3JtLXhtbC16aXBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnNvbGVudC5zZGttK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic2RrbVwiLFwic2RrZFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5zcG90ZmlyZS5keHBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJkeHBcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc3BvdGZpcmUuc2ZzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic2ZzXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnNxbGl0ZTNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnNzcy1jb2RcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnNzcy1kdGZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnNzcy1udGZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnN0YXJkaXZpc2lvbi5jYWxjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzZGNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc3RhcmRpdmlzaW9uLmRyYXdcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNkYVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5zdGFyZGl2aXNpb24uaW1wcmVzc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic2RkXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnN0YXJkaXZpc2lvbi5tYXRoXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzbWZcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc3RhcmRpdmlzaW9uLndyaXRlclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic2R3XCIsXCJ2b3JcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc3RhcmRpdmlzaW9uLndyaXRlci1nbG9iYWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNnbFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5zdGVwbWFuaWEucGFja2FnZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNtemlwXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnN0ZXBtYW5pYS5zdGVwY2hhcnRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzbVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5zdHJlZXQtc3RyZWFtXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5zdW4ud2FkbCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIndhZGxcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC5jYWxjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzeGNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC5jYWxjLnRlbXBsYXRlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzdGNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC5kcmF3XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzeGRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC5kcmF3LnRlbXBsYXRlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzdGRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC5pbXByZXNzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzeGlcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC5pbXByZXNzLnRlbXBsYXRlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzdGlcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC5tYXRoXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzeG1cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC53cml0ZXJcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInN4d1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLndyaXRlci5nbG9iYWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInN4Z1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLndyaXRlci50ZW1wbGF0ZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic3R3XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnN1cy1jYWxlbmRhclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInN1c1wiLFwic3VzcFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5zdmRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzdmRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc3dpZnR2aWV3LWljc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc3ltYmlhbi5pbnN0YWxsXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzaXNcIixcInNpc3hcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc3luY21sK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjaGFyc2V0XCI6IFwiVVRGLThcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ4c21cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc3luY21sLmRtK3dieG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNoYXJzZXRcIjogXCJVVEYtOFwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJiZG1cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc3luY21sLmRtK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjaGFyc2V0XCI6IFwiVVRGLThcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ4ZG1cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc3luY21sLmRtLm5vdGlmaWNhdGlvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQuc3luY21sLmRtZGRmK3dieG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5zeW5jbWwuZG1kZGYreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNoYXJzZXRcIjogXCJVVEYtOFwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImRkZlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5zeW5jbWwuZG10bmRzK3dieG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC5zeW5jbWwuZG10bmRzK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjaGFyc2V0XCI6IFwiVVRGLThcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnN5bmNtbC5kcy5ub3RpZmljYXRpb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnRhYmxlc2NoZW1hK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQudGFvLmludGVudC1tb2R1bGUtYXJjaGl2ZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInRhb1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC50Y3BkdW1wLnBjYXBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJwY2FwXCIsXCJjYXBcIixcImRtcFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC50aGluay1jZWxsLnBwdHRjK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQudG1kLm1lZGlhZmxleC5hcGkreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnRtbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQudG1vYmlsZS1saXZldHZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ0bW9cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQudHJpLm9uZXNvdXJjZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQudHJpZC50cHRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ0cHRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQudHJpc2NhcGUubXhzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibXhzXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnRydWVhcHBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ0cmFcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQudHJ1ZWRvY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQudWJpc29mdC53ZWJwbGF5ZXJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnVmZGxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ1ZmRcIixcInVmZGxcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQudWlxLnRoZW1lXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1widXR6XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnVtYWppblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInVtalwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC51bml0eVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInVuaXR5d2ViXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnVvbWwreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ1b21sXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnVwbGFuZXQuYWxlcnRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnVwbGFuZXQuYWxlcnQtd2J4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnVwbGFuZXQuYmVhcmVyLWNob2ljZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQudXBsYW5ldC5iZWFyZXItY2hvaWNlLXdieG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC51cGxhbmV0LmNhY2hlb3BcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnVwbGFuZXQuY2FjaGVvcC13YnhtbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQudXBsYW5ldC5jaGFubmVsXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC51cGxhbmV0LmNoYW5uZWwtd2J4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnVwbGFuZXQubGlzdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQudXBsYW5ldC5saXN0LXdieG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC51cGxhbmV0Lmxpc3RjbWRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnVwbGFuZXQubGlzdGNtZC13YnhtbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQudXBsYW5ldC5zaWduYWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnVyaS1tYXBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnZhbHZlLnNvdXJjZS5tYXRlcmlhbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQudmN4XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1widmN4XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnZkLXN0dWR5XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC52ZWN0b3J3b3Jrc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQudmVsK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQudmVyaW1hdHJpeC52Y2FzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC52ZXJ5YW50LnRoaW5cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnZlcy5lbmNyeXB0ZWRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnZpZHNvZnQudmlkY29uZmVyZW5jZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQudmlzaW9cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ2c2RcIixcInZzdFwiLFwidnNzXCIsXCJ2c3dcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQudmlzaW9uYXJ5XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1widmlzXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnZpdmlkZW5jZS5zY3JpcHRmaWxlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC52c2ZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ2c2ZcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQud2FwLnNpY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQud2FwLnNsY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQud2FwLndieG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNoYXJzZXRcIjogXCJVVEYtOFwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ3YnhtbFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC53YXAud21sY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIndtbGNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQud2FwLndtbHNjcmlwdGNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ3bWxzY1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC53ZWJ0dXJib1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInd0YlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC53ZmEucDJwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC53ZmEud3NjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC53aW5kb3dzLmRldmljZXBhaXJpbmdcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLndtY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQud21mLmJvb3RzdHJhcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQud29sZnJhbS5tYXRoZW1hdGljYVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQud29sZnJhbS5tYXRoZW1hdGljYS5wYWNrYWdlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC53b2xmcmFtLnBsYXllclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm5icFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC53b3JkcGVyZmVjdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIndwZFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC53cWRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ3cWRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQud3JxLWhwMzAwMC1sYWJlbGxlZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQud3Quc3RmXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic3RmXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnd2LmNzcCt3YnhtbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQud3YuY3NwK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC53di5zc3AreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnhhY21sK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQueGFyYVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhhclwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC54ZmRsXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wieGZkbFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC54ZmRsLndlYmZvcm1cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnhtaSt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQueG1waWUuY3BrZ1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQueG1waWUuZHBrZ1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQueG1waWUucGxhblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQueG1waWUucHBrZ1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQueG1waWUueGxpbVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi92bmQueWFtYWhhLmh2LWRpY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImh2ZFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC55YW1haGEuaHYtc2NyaXB0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiaHZzXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnlhbWFoYS5odi12b2ljZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImh2cFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC55YW1haGEub3BlbnNjb3JlZm9ybWF0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wib3NmXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnlhbWFoYS5vcGVuc2NvcmVmb3JtYXQub3NmcHZnK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wib3NmcHZnXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnlhbWFoYS5yZW1vdGUtc2V0dXBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnlhbWFoYS5zbWFmLWF1ZGlvXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic2FmXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnlhbWFoYS5zbWFmLXBocmFzZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNwZlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC55YW1haGEudGhyb3VnaC1uZ25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnlhbWFoYS50dW5uZWwtdWRwZW5jYXBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnlhb3dlbWVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnllbGxvd3JpdmVyLWN1c3RvbS1tZW51XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiY21wXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnlvdXR1YmUueXRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm5kLnp1bFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInppclwiLFwiemlyelwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZuZC56emF6ei5kZWNrK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiemF6XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm9pY2V4bWwreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ2eG1sXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vdm91Y2hlci1jbXMranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ZxLXJ0Y3B4clwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi93YXNtXCI6IHtcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ3YXNtXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vd2F0Y2hlcmluZm8reG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vd2VicHVzaC1vcHRpb25zK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi93aG9pc3BwLXF1ZXJ5XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3dob2lzcHAtcmVzcG9uc2VcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vd2lkZ2V0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wid2d0XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vd2luaGxwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJobHBcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi93aXRhXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3dvcmRwZXJmZWN0NS4xXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3dzZGwreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ3c2RsXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24vd3Nwb2xpY3kreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ3c3BvbGljeVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtN3otY29tcHJlc3NlZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiN3pcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LWFiaXdvcmRcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImFid1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtYWNlLWNvbXByZXNzZWRcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImFjZVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtYW1mXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1hcHBsZS1kaXNraW1hZ2VcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImRtZ1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtYXJqXCI6IHtcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiYXJqXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1hdXRob3J3YXJlLWJpblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiYWFiXCIsXCJ4MzJcIixcInUzMlwiLFwidm94XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1hdXRob3J3YXJlLW1hcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiYWFtXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1hdXRob3J3YXJlLXNlZ1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiYWFzXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1iY3Bpb1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiYmNwaW9cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LWJkb2NcIjoge1xuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJiZG9jXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1iaXR0b3JyZW50XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ0b3JyZW50XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1ibG9yYlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiYmxiXCIsXCJibG9yYlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtYnppcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiYnpcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LWJ6aXAyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJiejJcIixcImJvelwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtY2JyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJjYnJcIixcImNiYVwiLFwiY2J0XCIsXCJjYnpcIixcImNiN1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtY2RsaW5rXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ2Y2RcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LWNmcy1jb21wcmVzc2VkXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJjZnNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LWNoYXRcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImNoYXRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LWNoZXNzLXBnblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicGduXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1jaHJvbWUtZXh0ZW5zaW9uXCI6IHtcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiY3J4XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1jb2NvYVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJuZ2lueFwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJjY29cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LWNvbXByZXNzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1jb25mZXJlbmNlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJuc2NcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LWNwaW9cIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImNwaW9cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LWNzaFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiY3NoXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1kZWJcIjoge1xuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1kZWJpYW4tcGFja2FnZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZGViXCIsXCJ1ZGViXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1kZ2MtY29tcHJlc3NlZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZGdjXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1kaXJlY3RvclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZGlyXCIsXCJkY3JcIixcImR4clwiLFwiY3N0XCIsXCJjY3RcIixcImN4dFwiLFwidzNkXCIsXCJmZ2RcIixcInN3YVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtZG9vbVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wid2FkXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1kdGJuY3greG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm5jeFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtZHRib29rK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJkdGJcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LWR0YnJlc291cmNlK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJyZXNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LWR2aVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZHZpXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1lbnZveVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZXZ5XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1ldmFcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImV2YVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtZm9udC1iZGZcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImJkZlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtZm9udC1kb3NcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LWZvbnQtZnJhbWVtYWtlclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtZm9udC1naG9zdHNjcmlwdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZ3NmXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1mb250LWxpYmdyeFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtZm9udC1saW51eC1wc2ZcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInBzZlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtZm9udC1wY2ZcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInBjZlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtZm9udC1zbmZcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNuZlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtZm9udC1zcGVlZG9cIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LWZvbnQtc3Vub3MtbmV3c1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtZm9udC10eXBlMVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicGZhXCIsXCJwZmJcIixcInBmbVwiLFwiYWZtXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1mb250LXZmb250XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1mcmVlYXJjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJhcmNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LWZ1dHVyZXNwbGFzaFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic3BsXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1nY2EtY29tcHJlc3NlZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZ2NhXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1nbHVseFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1widWx4XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1nbnVtZXJpY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZ251bWVyaWNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LWdyYW1wcy14bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImdyYW1wc1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtZ3RhclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZ3RhclwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtZ3ppcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtaGRmXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJoZGZcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LWh0dHBkLXBocFwiOiB7XG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicGhwXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1pbnN0YWxsLWluc3RydWN0aW9uc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiaW5zdGFsbFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtaXNvOTY2MC1pbWFnZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiaXNvXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1qYXZhLWFyY2hpdmUtZGlmZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJuZ2lueFwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJqYXJkaWZmXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1qYXZhLWpubHAtZmlsZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiam5scFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtamF2YXNjcmlwdFwiOiB7XG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gta2VlcGFzczJcIjoge1xuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJrZGJ4XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1sYXRleFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibGF0ZXhcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LWx1YS1ieXRlY29kZVwiOiB7XG4gICAgXCJleHRlbnNpb25zXCI6IFtcImx1YWNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LWx6aC1jb21wcmVzc2VkXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJsemhcIixcImxoYVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtbWFrZXNlbGZcIjoge1xuICAgIFwic291cmNlXCI6IFwibmdpbnhcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicnVuXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1taWVcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm1pZVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtbW9iaXBvY2tldC1lYm9va1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicHJjXCIsXCJtb2JpXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1tcGVndXJsXCI6IHtcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtbXMtYXBwbGljYXRpb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImFwcGxpY2F0aW9uXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1tcy1zaG9ydGN1dFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibG5rXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1tcy13bWRcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIndtZFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtbXMtd216XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ3bXpcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LW1zLXhiYXBcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhiYXBcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LW1zYWNjZXNzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJtZGJcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LW1zYmluZGVyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJvYmRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LW1zY2FyZGZpbGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImNyZFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtbXNjbGlwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJjbHBcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LW1zZG9zLXByb2dyYW1cIjoge1xuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJleGVcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LW1zZG93bmxvYWRcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImV4ZVwiLFwiZGxsXCIsXCJjb21cIixcImJhdFwiLFwibXNpXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1tc21lZGlhdmlld1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibXZiXCIsXCJtMTNcIixcIm0xNFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtbXNtZXRhZmlsZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wid21mXCIsXCJ3bXpcIixcImVtZlwiLFwiZW16XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1tc21vbmV5XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJtbnlcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LW1zcHVibGlzaGVyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJwdWJcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LW1zc2NoZWR1bGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNjZFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtbXN0ZXJtaW5hbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1widHJtXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1tc3dyaXRlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ3cmlcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LW5ldGNkZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibmNcIixcImNkZlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtbnMtcHJveHktYXV0b2NvbmZpZ1wiOiB7XG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicGFjXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1uemJcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm56YlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtcGVybFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJuZ2lueFwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJwbFwiLFwicG1cIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LXBpbG90XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcIm5naW54XCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInByY1wiLFwicGRiXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1wa2NzMTJcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInAxMlwiLFwicGZ4XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1wa2NzNy1jZXJ0aWZpY2F0ZXNcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInA3YlwiLFwic3BjXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1wa2NzNy1jZXJ0cmVxcmVzcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicDdyXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1wa2ktbWVzc2FnZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LXJhci1jb21wcmVzc2VkXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJyYXJcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LXJlZGhhdC1wYWNrYWdlLW1hbmFnZXJcIjoge1xuICAgIFwic291cmNlXCI6IFwibmdpbnhcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicnBtXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1yZXNlYXJjaC1pbmZvLXN5c3RlbXNcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInJpc1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtc2VhXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcIm5naW54XCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNlYVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtc2hcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic2hcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LXNoYXJcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNoYXJcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LXNob2Nrd2F2ZS1mbGFzaFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic3dmXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1zaWx2ZXJsaWdodC1hcHBcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhhcFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtc3FsXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzcWxcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LXN0dWZmaXRcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNpdFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtc3R1ZmZpdHhcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNpdHhcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LXN1YnJpcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic3J0XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1zdjRjcGlvXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzdjRjcGlvXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC1zdjRjcmNcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInN2NGNyY1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtdDN2bS1pbWFnZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1widDNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LXRhZHNcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImdhbVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtdGFyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInRhclwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtdGNsXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ0Y2xcIixcInRrXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC10ZXhcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInRleFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtdGV4LXRmbVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1widGZtXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC10ZXhpbmZvXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ0ZXhpbmZvXCIsXCJ0ZXhpXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC10Z2lmXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJvYmpcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LXVzdGFyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ1c3RhclwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtdmlydHVhbGJveC1oZGRcIjoge1xuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImhkZFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtdmlydHVhbGJveC1vdmFcIjoge1xuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm92YVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtdmlydHVhbGJveC1vdmZcIjoge1xuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm92ZlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtdmlydHVhbGJveC12Ym94XCI6IHtcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ2Ym94XCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC12aXJ0dWFsYm94LXZib3gtZXh0cGFja1wiOiB7XG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInZib3gtZXh0cGFja1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtdmlydHVhbGJveC12ZGlcIjoge1xuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInZkaVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtdmlydHVhbGJveC12aGRcIjoge1xuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInZoZFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtdmlydHVhbGJveC12bWRrXCI6IHtcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ2bWRrXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC13YWlzLXNvdXJjZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic3JjXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC13ZWItYXBwLW1hbmlmZXN0K2pzb25cIjoge1xuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIndlYmFwcFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gteDUwOS1jYS1jZXJ0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZGVyXCIsXCJjcnRcIixcInBlbVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gteDUwOS1jYS1yYS1jZXJ0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3gteDUwOS1uZXh0LWNhLWNlcnRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC14ZmlnXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJmaWdcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LXhsaWZmK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ4bGZcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LXhwaW5zdGFsbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wieHBpXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veC14elwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wieHpcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94LXptYWNoaW5lXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ6MVwiLFwiejJcIixcInozXCIsXCJ6NFwiLFwiejVcIixcIno2XCIsXCJ6N1wiLFwiejhcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94NDAwLWJwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImFwcGxpY2F0aW9uL3hhY21sK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3hhbWwreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhhbWxcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94Y2FwLWF0dCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhhdlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3hjYXAtY2Fwcyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhjYVwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3hjYXAtZGlmZit4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhkZlwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3hjYXAtZWwreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ4ZWxcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94Y2FwLWVycm9yK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wieGVyXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veGNhcC1ucyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhuc1wiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3hjb24tY29uZmVyZW5jZS1pbmZvK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3hjb24tY29uZmVyZW5jZS1pbmZvLWRpZmYreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veGVuYyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhlbmNcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94aHRtbCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhodG1sXCIsXCJ4aHRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94aHRtbC12b2ljZSt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3hsaWZmK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wieGxmXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ4bWxcIixcInhzbFwiLFwieHNkXCIsXCJybmdcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94bWwtZHRkXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJkdGRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94bWwtZXh0ZXJuYWwtcGFyc2VkLWVudGl0eVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94bWwtcGF0Y2greG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veG1wcCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94b3AreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ4b3BcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94cHJvYyt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wieHBsXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veHNsdCt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhzbHRcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi94c3BmK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ4c3BmXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veHYreG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJteG1sXCIsXCJ4aHZtbFwiLFwieHZtbFwiLFwieHZtXCJdXG4gIH0sXG4gIFwiYXBwbGljYXRpb24veWFuZ1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInlhbmdcIl1cbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi95YW5nLWRhdGEranNvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3lhbmctZGF0YSt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi95YW5nLXBhdGNoK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJhcHBsaWNhdGlvbi95YW5nLXBhdGNoK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3lpbit4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInlpblwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3ppcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInppcFwiXVxuICB9LFxuICBcImFwcGxpY2F0aW9uL3psaWJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXBwbGljYXRpb24venN0ZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby8xZC1pbnRlcmxlYXZlZC1wYXJpdHlmZWNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vMzJrYWRwY21cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vM2dwcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIjNncHBcIl1cbiAgfSxcbiAgXCJhdWRpby8zZ3BwMlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9hYWNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vYWMzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL2FkcGNtXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJhZHBcIl1cbiAgfSxcbiAgXCJhdWRpby9hbXJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vYW1yLXdiXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL2Ftci13YitcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vYXB0eFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9hc2NcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vYXRyYWMtYWR2YW5jZWQtbG9zc2xlc3NcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vYXRyYWMteFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9hdHJhYzNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vYmFzaWNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJhdVwiLFwic25kXCJdXG4gIH0sXG4gIFwiYXVkaW8vYnYxNlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9idjMyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL2NsZWFybW9kZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9jblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9kYXQxMlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9kbHNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vZHNyLWVzMjAxMTA4XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL2Rzci1lczIwMjA1MFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9kc3ItZXMyMDIyMTFcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vZHNyLWVzMjAyMjEyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL2R2XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL2R2aTRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vZWFjM1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9lbmNhcHJ0cFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9ldnJjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL2V2cmMtcWNwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL2V2cmMwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL2V2cmMxXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL2V2cmNiXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL2V2cmNiMFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9ldnJjYjFcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vZXZyY253XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL2V2cmNudzBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vZXZyY253MVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9ldnJjd2JcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vZXZyY3diMFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9ldnJjd2IxXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL2V2c1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9mbGV4ZmVjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL2Z3ZHJlZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9nNzExLTBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vZzcxOVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9nNzIyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL2c3MjIxXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL2c3MjNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vZzcyNi0xNlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9nNzI2LTI0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL2c3MjYtMzJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vZzcyNi00MFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9nNzI4XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL2c3MjlcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vZzcyOTFcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vZzcyOWRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vZzcyOWVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vZ3NtXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL2dzbS1lZnJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vZ3NtLWhyLTA4XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL2lsYmNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vaXAtbXJfdjIuNVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9pc2FjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiXG4gIH0sXG4gIFwiYXVkaW8vbDE2XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL2wyMFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9sMjRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlXG4gIH0sXG4gIFwiYXVkaW8vbDhcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vbHBjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL21lbHBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vbWVscDEyMDBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vbWVscDI0MDBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vbWVscDYwMFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9taGFzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL21pZGlcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm1pZFwiLFwibWlkaVwiLFwia2FyXCIsXCJybWlcIl1cbiAgfSxcbiAgXCJhdWRpby9tb2JpbGUteG1mXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibXhtZlwiXVxuICB9LFxuICBcImF1ZGlvL21wM1wiOiB7XG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm1wM1wiXVxuICB9LFxuICBcImF1ZGlvL21wNFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm00YVwiLFwibXA0YVwiXVxuICB9LFxuICBcImF1ZGlvL21wNGEtbGF0bVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9tcGFcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vbXBhLXJvYnVzdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9tcGVnXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibXBnYVwiLFwibXAyXCIsXCJtcDJhXCIsXCJtcDNcIixcIm0yYVwiLFwibTNhXCJdXG4gIH0sXG4gIFwiYXVkaW8vbXBlZzQtZ2VuZXJpY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9tdXNlcGFja1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIlxuICB9LFxuICBcImF1ZGlvL29nZ1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm9nYVwiLFwib2dnXCIsXCJzcHhcIl1cbiAgfSxcbiAgXCJhdWRpby9vcHVzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3Bhcml0eWZlY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9wY21hXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3BjbWEtd2JcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vcGNtdVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9wY211LXdiXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3Bycy5zaWRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vcWNlbHBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vcmFwdG9yZmVjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3JlZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9ydHAtZW5jLWFlc2NtMTI4XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3J0cC1taWRpXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3J0cGxvb3BiYWNrXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3J0eFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9zM21cIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInMzbVwiXVxuICB9LFxuICBcImF1ZGlvL3NpbGtcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNpbFwiXVxuICB9LFxuICBcImF1ZGlvL3NtdlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9zbXYtcWNwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3NtdjBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vc3AtbWlkaVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby9zcGVleFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby90MTQwY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby90MzhcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vdGVsZXBob25lLWV2ZW50XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3RldHJhX2FjZWxwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3RldHJhX2FjZWxwX2JiXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3RvbmVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vdWVtY2xpcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby91bHBmZWNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vdXNhY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby92ZHZpXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3Ztci13YlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby92bmQuM2dwcC5pdWZwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3ZuZC40c2JcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vdm5kLmF1ZGlva296XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3ZuZC5jZWxwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3ZuZC5jaXNjby5uc2VcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vdm5kLmNtbGVzLnJhZGlvLWV2ZW50c1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby92bmQuY25zLmFucDFcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vdm5kLmNucy5pbmYxXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3ZuZC5kZWNlLmF1ZGlvXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1widXZhXCIsXCJ1dnZhXCJdXG4gIH0sXG4gIFwiYXVkaW8vdm5kLmRpZ2l0YWwtd2luZHNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJlb2xcIl1cbiAgfSxcbiAgXCJhdWRpby92bmQuZGxuYS5hZHRzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3ZuZC5kb2xieS5oZWFhYy4xXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3ZuZC5kb2xieS5oZWFhYy4yXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3ZuZC5kb2xieS5tbHBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vdm5kLmRvbGJ5Lm1wc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby92bmQuZG9sYnkucGwyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3ZuZC5kb2xieS5wbDJ4XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3ZuZC5kb2xieS5wbDJ6XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3ZuZC5kb2xieS5wdWxzZS4xXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3ZuZC5kcmFcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJkcmFcIl1cbiAgfSxcbiAgXCJhdWRpby92bmQuZHRzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZHRzXCJdXG4gIH0sXG4gIFwiYXVkaW8vdm5kLmR0cy5oZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImR0c2hkXCJdXG4gIH0sXG4gIFwiYXVkaW8vdm5kLmR0cy51aGRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vdm5kLmR2Yi5maWxlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3ZuZC5ldmVyYWQucGxqXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3ZuZC5obnMuYXVkaW9cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vdm5kLmx1Y2VudC52b2ljZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImx2cFwiXVxuICB9LFxuICBcImF1ZGlvL3ZuZC5tcy1wbGF5cmVhZHkubWVkaWEucHlhXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicHlhXCJdXG4gIH0sXG4gIFwiYXVkaW8vdm5kLm5va2lhLm1vYmlsZS14bWZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vdm5kLm5vcnRlbC52YmtcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vdm5kLm51ZXJhLmVjZWxwNDgwMFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImVjZWxwNDgwMFwiXVxuICB9LFxuICBcImF1ZGlvL3ZuZC5udWVyYS5lY2VscDc0NzBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJlY2VscDc0NzBcIl1cbiAgfSxcbiAgXCJhdWRpby92bmQubnVlcmEuZWNlbHA5NjAwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZWNlbHA5NjAwXCJdXG4gIH0sXG4gIFwiYXVkaW8vdm5kLm9jdGVsLnNiY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby92bmQucHJlc29udXMubXVsdGl0cmFja1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby92bmQucWNlbHBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiYXVkaW8vdm5kLnJoZXRvcmV4LjMya2FkcGNtXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3ZuZC5yaXBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJyaXBcIl1cbiAgfSxcbiAgXCJhdWRpby92bmQucm4tcmVhbGF1ZGlvXCI6IHtcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZVxuICB9LFxuICBcImF1ZGlvL3ZuZC5zZWFsZWRtZWRpYS5zb2Z0c2VhbC5tcGVnXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImF1ZGlvL3ZuZC52bXguY3ZzZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby92bmQud2F2ZVwiOiB7XG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2VcbiAgfSxcbiAgXCJhdWRpby92b3JiaXNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlXG4gIH0sXG4gIFwiYXVkaW8vdm9yYmlzLWNvbmZpZ1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJhdWRpby93YXZcIjoge1xuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ3YXZcIl1cbiAgfSxcbiAgXCJhdWRpby93YXZlXCI6IHtcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wid2F2XCJdXG4gIH0sXG4gIFwiYXVkaW8vd2VibVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wid2ViYVwiXVxuICB9LFxuICBcImF1ZGlvL3gtYWFjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJhYWNcIl1cbiAgfSxcbiAgXCJhdWRpby94LWFpZmZcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImFpZlwiLFwiYWlmZlwiLFwiYWlmY1wiXVxuICB9LFxuICBcImF1ZGlvL3gtY2FmXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJjYWZcIl1cbiAgfSxcbiAgXCJhdWRpby94LWZsYWNcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImZsYWNcIl1cbiAgfSxcbiAgXCJhdWRpby94LW00YVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJuZ2lueFwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJtNGFcIl1cbiAgfSxcbiAgXCJhdWRpby94LW1hdHJvc2thXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJta2FcIl1cbiAgfSxcbiAgXCJhdWRpby94LW1wZWd1cmxcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm0zdVwiXVxuICB9LFxuICBcImF1ZGlvL3gtbXMtd2F4XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ3YXhcIl1cbiAgfSxcbiAgXCJhdWRpby94LW1zLXdtYVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wid21hXCJdXG4gIH0sXG4gIFwiYXVkaW8veC1wbi1yZWFsYXVkaW9cIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInJhbVwiLFwicmFcIl1cbiAgfSxcbiAgXCJhdWRpby94LXBuLXJlYWxhdWRpby1wbHVnaW5cIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInJtcFwiXVxuICB9LFxuICBcImF1ZGlvL3gtcmVhbGF1ZGlvXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcIm5naW54XCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInJhXCJdXG4gIH0sXG4gIFwiYXVkaW8veC10dGFcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCJcbiAgfSxcbiAgXCJhdWRpby94LXdhdlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wid2F2XCJdXG4gIH0sXG4gIFwiYXVkaW8veG1cIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhtXCJdXG4gIH0sXG4gIFwiY2hlbWljYWwveC1jZHhcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImNkeFwiXVxuICB9LFxuICBcImNoZW1pY2FsL3gtY2lmXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJjaWZcIl1cbiAgfSxcbiAgXCJjaGVtaWNhbC94LWNtZGZcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImNtZGZcIl1cbiAgfSxcbiAgXCJjaGVtaWNhbC94LWNtbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiY21sXCJdXG4gIH0sXG4gIFwiY2hlbWljYWwveC1jc21sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJjc21sXCJdXG4gIH0sXG4gIFwiY2hlbWljYWwveC1wZGJcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCJcbiAgfSxcbiAgXCJjaGVtaWNhbC94LXh5elwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wieHl6XCJdXG4gIH0sXG4gIFwiZm9udC9jb2xsZWN0aW9uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1widHRjXCJdXG4gIH0sXG4gIFwiZm9udC9vdGZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm90ZlwiXVxuICB9LFxuICBcImZvbnQvc2ZudFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJmb250L3R0ZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1widHRmXCJdXG4gIH0sXG4gIFwiZm9udC93b2ZmXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wid29mZlwiXVxuICB9LFxuICBcImZvbnQvd29mZjJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ3b2ZmMlwiXVxuICB9LFxuICBcImltYWdlL2FjZXNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJleHJcIl1cbiAgfSxcbiAgXCJpbWFnZS9hcG5nXCI6IHtcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiYXBuZ1wiXVxuICB9LFxuICBcImltYWdlL2F2Y2lcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiaW1hZ2UvYXZjc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJpbWFnZS9ibXBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImJtcFwiXVxuICB9LFxuICBcImltYWdlL2NnbVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImNnbVwiXVxuICB9LFxuICBcImltYWdlL2RpY29tLXJsZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImRybGVcIl1cbiAgfSxcbiAgXCJpbWFnZS9lbWZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJlbWZcIl1cbiAgfSxcbiAgXCJpbWFnZS9maXRzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZml0c1wiXVxuICB9LFxuICBcImltYWdlL2czZmF4XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZzNcIl1cbiAgfSxcbiAgXCJpbWFnZS9naWZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJnaWZcIl1cbiAgfSxcbiAgXCJpbWFnZS9oZWljXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiaGVpY1wiXVxuICB9LFxuICBcImltYWdlL2hlaWMtc2VxdWVuY2VcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJoZWljc1wiXVxuICB9LFxuICBcImltYWdlL2hlaWZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJoZWlmXCJdXG4gIH0sXG4gIFwiaW1hZ2UvaGVpZi1zZXF1ZW5jZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImhlaWZzXCJdXG4gIH0sXG4gIFwiaW1hZ2UvaGVqMmtcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJoZWoyXCJdXG4gIH0sXG4gIFwiaW1hZ2UvaHNqMlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImhzajJcIl1cbiAgfSxcbiAgXCJpbWFnZS9pZWZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJpZWZcIl1cbiAgfSxcbiAgXCJpbWFnZS9qbHNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJqbHNcIl1cbiAgfSxcbiAgXCJpbWFnZS9qcDJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJqcDJcIixcImpwZzJcIl1cbiAgfSxcbiAgXCJpbWFnZS9qcGVnXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wianBlZ1wiLFwianBnXCIsXCJqcGVcIl1cbiAgfSxcbiAgXCJpbWFnZS9qcGhcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJqcGhcIl1cbiAgfSxcbiAgXCJpbWFnZS9qcGhjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiamhjXCJdXG4gIH0sXG4gIFwiaW1hZ2UvanBtXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wianBtXCJdXG4gIH0sXG4gIFwiaW1hZ2UvanB4XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wianB4XCIsXCJqcGZcIl1cbiAgfSxcbiAgXCJpbWFnZS9qeHJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJqeHJcIl1cbiAgfSxcbiAgXCJpbWFnZS9qeHJhXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wianhyYVwiXVxuICB9LFxuICBcImltYWdlL2p4cnNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJqeHJzXCJdXG4gIH0sXG4gIFwiaW1hZ2UvanhzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wianhzXCJdXG4gIH0sXG4gIFwiaW1hZ2UvanhzY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImp4c2NcIl1cbiAgfSxcbiAgXCJpbWFnZS9qeHNpXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wianhzaVwiXVxuICB9LFxuICBcImltYWdlL2p4c3NcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJqeHNzXCJdXG4gIH0sXG4gIFwiaW1hZ2Uva3R4XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wia3R4XCJdXG4gIH0sXG4gIFwiaW1hZ2UvbmFwbHBzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImltYWdlL3BqcGVnXCI6IHtcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZVxuICB9LFxuICBcImltYWdlL3BuZ1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInBuZ1wiXVxuICB9LFxuICBcImltYWdlL3Bycy5idGlmXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiYnRpZlwiXVxuICB9LFxuICBcImltYWdlL3Bycy5wdGlcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJwdGlcIl1cbiAgfSxcbiAgXCJpbWFnZS9wd2ctcmFzdGVyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImltYWdlL3NnaVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic2dpXCJdXG4gIH0sXG4gIFwiaW1hZ2Uvc3ZnK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic3ZnXCIsXCJzdmd6XCJdXG4gIH0sXG4gIFwiaW1hZ2UvdDM4XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1widDM4XCJdXG4gIH0sXG4gIFwiaW1hZ2UvdGlmZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInRpZlwiLFwidGlmZlwiXVxuICB9LFxuICBcImltYWdlL3RpZmYtZnhcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ0ZnhcIl1cbiAgfSxcbiAgXCJpbWFnZS92bmQuYWRvYmUucGhvdG9zaG9wXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJwc2RcIl1cbiAgfSxcbiAgXCJpbWFnZS92bmQuYWlyemlwLmFjY2VsZXJhdG9yLmF6dlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImF6dlwiXVxuICB9LFxuICBcImltYWdlL3ZuZC5jbnMuaW5mMlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJpbWFnZS92bmQuZGVjZS5ncmFwaGljXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1widXZpXCIsXCJ1dnZpXCIsXCJ1dmdcIixcInV2dmdcIl1cbiAgfSxcbiAgXCJpbWFnZS92bmQuZGp2dVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImRqdnVcIixcImRqdlwiXVxuICB9LFxuICBcImltYWdlL3ZuZC5kdmIuc3VidGl0bGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzdWJcIl1cbiAgfSxcbiAgXCJpbWFnZS92bmQuZHdnXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZHdnXCJdXG4gIH0sXG4gIFwiaW1hZ2Uvdm5kLmR4ZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImR4ZlwiXVxuICB9LFxuICBcImltYWdlL3ZuZC5mYXN0Ymlkc2hlZXRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJmYnNcIl1cbiAgfSxcbiAgXCJpbWFnZS92bmQuZnB4XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZnB4XCJdXG4gIH0sXG4gIFwiaW1hZ2Uvdm5kLmZzdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImZzdFwiXVxuICB9LFxuICBcImltYWdlL3ZuZC5mdWppeGVyb3guZWRtaWNzLW1tclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm1tclwiXVxuICB9LFxuICBcImltYWdlL3ZuZC5mdWppeGVyb3guZWRtaWNzLXJsY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInJsY1wiXVxuICB9LFxuICBcImltYWdlL3ZuZC5nbG9iYWxncmFwaGljcy5wZ2JcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiaW1hZ2Uvdm5kLm1pY3Jvc29mdC5pY29uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiaWNvXCJdXG4gIH0sXG4gIFwiaW1hZ2Uvdm5kLm1peFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJpbWFnZS92bmQubW96aWxsYS5hcG5nXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImltYWdlL3ZuZC5tcy1kZHNcIjoge1xuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJkZHNcIl1cbiAgfSxcbiAgXCJpbWFnZS92bmQubXMtbW9kaVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm1kaVwiXVxuICB9LFxuICBcImltYWdlL3ZuZC5tcy1waG90b1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wid2RwXCJdXG4gIH0sXG4gIFwiaW1hZ2Uvdm5kLm5ldC1mcHhcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJucHhcIl1cbiAgfSxcbiAgXCJpbWFnZS92bmQucmFkaWFuY2VcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiaW1hZ2Uvdm5kLnNlYWxlZC5wbmdcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiaW1hZ2Uvdm5kLnNlYWxlZG1lZGlhLnNvZnRzZWFsLmdpZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJpbWFnZS92bmQuc2VhbGVkbWVkaWEuc29mdHNlYWwuanBnXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcImltYWdlL3ZuZC5zdmZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwiaW1hZ2Uvdm5kLnRlbmNlbnQudGFwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1widGFwXCJdXG4gIH0sXG4gIFwiaW1hZ2Uvdm5kLnZhbHZlLnNvdXJjZS50ZXh0dXJlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1widnRmXCJdXG4gIH0sXG4gIFwiaW1hZ2Uvdm5kLndhcC53Ym1wXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wid2JtcFwiXVxuICB9LFxuICBcImltYWdlL3ZuZC54aWZmXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wieGlmXCJdXG4gIH0sXG4gIFwiaW1hZ2Uvdm5kLnpicnVzaC5wY3hcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJwY3hcIl1cbiAgfSxcbiAgXCJpbWFnZS93ZWJwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ3ZWJwXCJdXG4gIH0sXG4gIFwiaW1hZ2Uvd21mXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wid21mXCJdXG4gIH0sXG4gIFwiaW1hZ2UveC0zZHNcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIjNkc1wiXVxuICB9LFxuICBcImltYWdlL3gtY211LXJhc3RlclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicmFzXCJdXG4gIH0sXG4gIFwiaW1hZ2UveC1jbXhcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImNteFwiXVxuICB9LFxuICBcImltYWdlL3gtZnJlZWhhbmRcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImZoXCIsXCJmaGNcIixcImZoNFwiLFwiZmg1XCIsXCJmaDdcIl1cbiAgfSxcbiAgXCJpbWFnZS94LWljb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiaWNvXCJdXG4gIH0sXG4gIFwiaW1hZ2UveC1qbmdcIjoge1xuICAgIFwic291cmNlXCI6IFwibmdpbnhcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiam5nXCJdXG4gIH0sXG4gIFwiaW1hZ2UveC1tcnNpZC1pbWFnZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic2lkXCJdXG4gIH0sXG4gIFwiaW1hZ2UveC1tcy1ibXBcIjoge1xuICAgIFwic291cmNlXCI6IFwibmdpbnhcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJibXBcIl1cbiAgfSxcbiAgXCJpbWFnZS94LXBjeFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicGN4XCJdXG4gIH0sXG4gIFwiaW1hZ2UveC1waWN0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJwaWNcIixcInBjdFwiXVxuICB9LFxuICBcImltYWdlL3gtcG9ydGFibGUtYW55bWFwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJwbm1cIl1cbiAgfSxcbiAgXCJpbWFnZS94LXBvcnRhYmxlLWJpdG1hcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicGJtXCJdXG4gIH0sXG4gIFwiaW1hZ2UveC1wb3J0YWJsZS1ncmF5bWFwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJwZ21cIl1cbiAgfSxcbiAgXCJpbWFnZS94LXBvcnRhYmxlLXBpeG1hcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicHBtXCJdXG4gIH0sXG4gIFwiaW1hZ2UveC1yZ2JcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInJnYlwiXVxuICB9LFxuICBcImltYWdlL3gtdGdhXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ0Z2FcIl1cbiAgfSxcbiAgXCJpbWFnZS94LXhiaXRtYXBcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhibVwiXVxuICB9LFxuICBcImltYWdlL3gteGNmXCI6IHtcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZVxuICB9LFxuICBcImltYWdlL3gteHBpeG1hcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wieHBtXCJdXG4gIH0sXG4gIFwiaW1hZ2UveC14d2luZG93ZHVtcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wieHdkXCJdXG4gIH0sXG4gIFwibWVzc2FnZS9jcGltXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcIm1lc3NhZ2UvZGVsaXZlcnktc3RhdHVzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcIm1lc3NhZ2UvZGlzcG9zaXRpb24tbm90aWZpY2F0aW9uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1xuICAgICAgXCJkaXNwb3NpdGlvbi1ub3RpZmljYXRpb25cIlxuICAgIF1cbiAgfSxcbiAgXCJtZXNzYWdlL2V4dGVybmFsLWJvZHlcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwibWVzc2FnZS9mZWVkYmFjay1yZXBvcnRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwibWVzc2FnZS9nbG9iYWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ1OG1zZ1wiXVxuICB9LFxuICBcIm1lc3NhZ2UvZ2xvYmFsLWRlbGl2ZXJ5LXN0YXR1c1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInU4ZHNuXCJdXG4gIH0sXG4gIFwibWVzc2FnZS9nbG9iYWwtZGlzcG9zaXRpb24tbm90aWZpY2F0aW9uXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1widThtZG5cIl1cbiAgfSxcbiAgXCJtZXNzYWdlL2dsb2JhbC1oZWFkZXJzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1widThoZHJcIl1cbiAgfSxcbiAgXCJtZXNzYWdlL2h0dHBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlXG4gIH0sXG4gIFwibWVzc2FnZS9pbWRuK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcIm1lc3NhZ2UvbmV3c1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJtZXNzYWdlL3BhcnRpYWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlXG4gIH0sXG4gIFwibWVzc2FnZS9yZmM4MjJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImVtbFwiLFwibWltZVwiXVxuICB9LFxuICBcIm1lc3NhZ2Uvcy1odHRwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcIm1lc3NhZ2Uvc2lwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcIm1lc3NhZ2Uvc2lwZnJhZ1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJtZXNzYWdlL3RyYWNraW5nLXN0YXR1c1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJtZXNzYWdlL3ZuZC5zaS5zaW1wXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcIm1lc3NhZ2Uvdm5kLndmYS53c2NcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ3c2NcIl1cbiAgfSxcbiAgXCJtb2RlbC8zbWZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCIzbWZcIl1cbiAgfSxcbiAgXCJtb2RlbC9nbHRmK2pzb25cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImdsdGZcIl1cbiAgfSxcbiAgXCJtb2RlbC9nbHRmLWJpbmFyeVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZ2xiXCJdXG4gIH0sXG4gIFwibW9kZWwvaWdlc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImlnc1wiLFwiaWdlc1wiXVxuICB9LFxuICBcIm1vZGVsL21lc2hcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJtc2hcIixcIm1lc2hcIixcInNpbG9cIl1cbiAgfSxcbiAgXCJtb2RlbC9tdGxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJtdGxcIl1cbiAgfSxcbiAgXCJtb2RlbC9vYmpcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJvYmpcIl1cbiAgfSxcbiAgXCJtb2RlbC9zdGxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzdGxcIl1cbiAgfSxcbiAgXCJtb2RlbC92bmQuY29sbGFkYSt4bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImRhZVwiXVxuICB9LFxuICBcIm1vZGVsL3ZuZC5kd2ZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJkd2ZcIl1cbiAgfSxcbiAgXCJtb2RlbC92bmQuZmxhdGxhbmQuM2RtbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJtb2RlbC92bmQuZ2RsXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZ2RsXCJdXG4gIH0sXG4gIFwibW9kZWwvdm5kLmdzLWdkbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIlxuICB9LFxuICBcIm1vZGVsL3ZuZC5ncy5nZGxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwibW9kZWwvdm5kLmd0d1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImd0d1wiXVxuICB9LFxuICBcIm1vZGVsL3ZuZC5tb21sK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcIm1vZGVsL3ZuZC5tdHNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJtdHNcIl1cbiAgfSxcbiAgXCJtb2RlbC92bmQub3BlbmdleFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm9nZXhcIl1cbiAgfSxcbiAgXCJtb2RlbC92bmQucGFyYXNvbGlkLnRyYW5zbWl0LmJpbmFyeVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhfYlwiXVxuICB9LFxuICBcIm1vZGVsL3ZuZC5wYXJhc29saWQudHJhbnNtaXQudGV4dFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInhfdFwiXVxuICB9LFxuICBcIm1vZGVsL3ZuZC5yb3NldHRlLmFubm90YXRlZC1kYXRhLW1vZGVsXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcIm1vZGVsL3ZuZC51c2R6K3ppcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInVzZHpcIl1cbiAgfSxcbiAgXCJtb2RlbC92bmQudmFsdmUuc291cmNlLmNvbXBpbGVkLW1hcFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImJzcFwiXVxuICB9LFxuICBcIm1vZGVsL3ZuZC52dHVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ2dHVcIl1cbiAgfSxcbiAgXCJtb2RlbC92cm1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wid3JsXCIsXCJ2cm1sXCJdXG4gIH0sXG4gIFwibW9kZWwveDNkK2JpbmFyeVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wieDNkYlwiLFwieDNkYnpcIl1cbiAgfSxcbiAgXCJtb2RlbC94M2QrZmFzdGluZm9zZXRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ4M2RiXCJdXG4gIH0sXG4gIFwibW9kZWwveDNkK3ZybWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIngzZHZcIixcIngzZHZ6XCJdXG4gIH0sXG4gIFwibW9kZWwveDNkK3htbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wieDNkXCIsXCJ4M2R6XCJdXG4gIH0sXG4gIFwibW9kZWwveDNkLXZybWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ4M2R2XCJdXG4gIH0sXG4gIFwibXVsdGlwYXJ0L2FsdGVybmF0aXZlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZVxuICB9LFxuICBcIm11bHRpcGFydC9hcHBsZWRvdWJsZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJtdWx0aXBhcnQvYnl0ZXJhbmdlc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJtdWx0aXBhcnQvZGlnZXN0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcIm11bHRpcGFydC9lbmNyeXB0ZWRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlXG4gIH0sXG4gIFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2VcbiAgfSxcbiAgXCJtdWx0aXBhcnQvaGVhZGVyLXNldFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJtdWx0aXBhcnQvbWl4ZWRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwibXVsdGlwYXJ0L211bHRpbGluZ3VhbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJtdWx0aXBhcnQvcGFyYWxsZWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwibXVsdGlwYXJ0L3JlbGF0ZWRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlXG4gIH0sXG4gIFwibXVsdGlwYXJ0L3JlcG9ydFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJtdWx0aXBhcnQvc2lnbmVkXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZVxuICB9LFxuICBcIm11bHRpcGFydC92bmQuYmludC5tZWQtcGx1c1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJtdWx0aXBhcnQvdm9pY2UtbWVzc2FnZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJtdWx0aXBhcnQveC1taXhlZC1yZXBsYWNlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInRleHQvMWQtaW50ZXJsZWF2ZWQtcGFyaXR5ZmVjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInRleHQvY2FjaGUtbWFuaWZlc3RcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImFwcGNhY2hlXCIsXCJtYW5pZmVzdFwiXVxuICB9LFxuICBcInRleHQvY2FsZW5kYXJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJpY3NcIixcImlmYlwiXVxuICB9LFxuICBcInRleHQvY2FsZW5kZXJcIjoge1xuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJ0ZXh0L2NtZFwiOiB7XG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZVxuICB9LFxuICBcInRleHQvY29mZmVlc2NyaXB0XCI6IHtcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiY29mZmVlXCIsXCJsaXRjb2ZmZWVcIl1cbiAgfSxcbiAgXCJ0ZXh0L2Nzc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjaGFyc2V0XCI6IFwiVVRGLThcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJjc3NcIl1cbiAgfSxcbiAgXCJ0ZXh0L2NzdlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiY3N2XCJdXG4gIH0sXG4gIFwidGV4dC9jc3Ytc2NoZW1hXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInRleHQvZGlyZWN0b3J5XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInRleHQvZG5zXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInRleHQvZWNtYXNjcmlwdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ0ZXh0L2VuY2FwcnRwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInRleHQvZW5yaWNoZWRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidGV4dC9mbGV4ZmVjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInRleHQvZndkcmVkXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInRleHQvZ3JhbW1hci1yZWYtbGlzdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ0ZXh0L2h0bWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImh0bWxcIixcImh0bVwiLFwic2h0bWxcIl1cbiAgfSxcbiAgXCJ0ZXh0L2phZGVcIjoge1xuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJqYWRlXCJdXG4gIH0sXG4gIFwidGV4dC9qYXZhc2NyaXB0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwidGV4dC9qY3ItY25kXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInRleHQvanN4XCI6IHtcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJqc3hcIl1cbiAgfSxcbiAgXCJ0ZXh0L2xlc3NcIjoge1xuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImxlc3NcIl1cbiAgfSxcbiAgXCJ0ZXh0L21hcmtkb3duXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJtYXJrZG93blwiLFwibWRcIl1cbiAgfSxcbiAgXCJ0ZXh0L21hdGhtbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJuZ2lueFwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJtbWxcIl1cbiAgfSxcbiAgXCJ0ZXh0L21keFwiOiB7XG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibWR4XCJdXG4gIH0sXG4gIFwidGV4dC9taXphclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ0ZXh0L24zXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNoYXJzZXRcIjogXCJVVEYtOFwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm4zXCJdXG4gIH0sXG4gIFwidGV4dC9wYXJhbWV0ZXJzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNoYXJzZXRcIjogXCJVVEYtOFwiXG4gIH0sXG4gIFwidGV4dC9wYXJpdHlmZWNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidGV4dC9wbGFpblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1widHh0XCIsXCJ0ZXh0XCIsXCJjb25mXCIsXCJkZWZcIixcImxpc3RcIixcImxvZ1wiLFwiaW5cIixcImluaVwiXVxuICB9LFxuICBcInRleHQvcHJvdmVuYW5jZS1ub3RhdGlvblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjaGFyc2V0XCI6IFwiVVRGLThcIlxuICB9LFxuICBcInRleHQvcHJzLmZhbGxlbnN0ZWluLnJzdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ0ZXh0L3Bycy5saW5lcy50YWdcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJkc2NcIl1cbiAgfSxcbiAgXCJ0ZXh0L3Bycy5wcm9wLmxvZ2ljXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInRleHQvcmFwdG9yZmVjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInRleHQvcmVkXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInRleHQvcmZjODIyLWhlYWRlcnNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidGV4dC9yaWNodGV4dFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicnR4XCJdXG4gIH0sXG4gIFwidGV4dC9ydGZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInJ0ZlwiXVxuICB9LFxuICBcInRleHQvcnRwLWVuYy1hZXNjbTEyOFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ0ZXh0L3J0cGxvb3BiYWNrXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInRleHQvcnR4XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInRleHQvc2dtbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNnbWxcIixcInNnbVwiXVxuICB9LFxuICBcInRleHQvc2hleFwiOiB7XG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNoZXhcIl1cbiAgfSxcbiAgXCJ0ZXh0L3NsaW1cIjoge1xuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzbGltXCIsXCJzbG1cIl1cbiAgfSxcbiAgXCJ0ZXh0L3N0cmluZ3NcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidGV4dC9zdHlsdXNcIjoge1xuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzdHlsdXNcIixcInN0eWxcIl1cbiAgfSxcbiAgXCJ0ZXh0L3QxNDBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidGV4dC90YWItc2VwYXJhdGVkLXZhbHVlc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogdHJ1ZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1widHN2XCJdXG4gIH0sXG4gIFwidGV4dC90cm9mZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInRcIixcInRyXCIsXCJyb2ZmXCIsXCJtYW5cIixcIm1lXCIsXCJtc1wiXVxuICB9LFxuICBcInRleHQvdHVydGxlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNoYXJzZXRcIjogXCJVVEYtOFwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ0dGxcIl1cbiAgfSxcbiAgXCJ0ZXh0L3VscGZlY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ0ZXh0L3VyaS1saXN0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ1cmlcIixcInVyaXNcIixcInVybHNcIl1cbiAgfSxcbiAgXCJ0ZXh0L3ZjYXJkXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ2Y2FyZFwiXVxuICB9LFxuICBcInRleHQvdm5kLmFcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidGV4dC92bmQuYWJjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInRleHQvdm5kLmFzY2lpLWFydFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ0ZXh0L3ZuZC5jdXJsXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiY3VybFwiXVxuICB9LFxuICBcInRleHQvdm5kLmN1cmwuZGN1cmxcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImRjdXJsXCJdXG4gIH0sXG4gIFwidGV4dC92bmQuY3VybC5tY3VybFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibWN1cmxcIl1cbiAgfSxcbiAgXCJ0ZXh0L3ZuZC5jdXJsLnNjdXJsXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzY3VybFwiXVxuICB9LFxuICBcInRleHQvdm5kLmRlYmlhbi5jb3B5cmlnaHRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiY2hhcnNldFwiOiBcIlVURi04XCJcbiAgfSxcbiAgXCJ0ZXh0L3ZuZC5kbWNsaWVudHNjcmlwdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ0ZXh0L3ZuZC5kdmIuc3VidGl0bGVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzdWJcIl1cbiAgfSxcbiAgXCJ0ZXh0L3ZuZC5lc21lcnRlYy50aGVtZS1kZXNjcmlwdG9yXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNoYXJzZXRcIjogXCJVVEYtOFwiXG4gIH0sXG4gIFwidGV4dC92bmQuZmljbGFiLmZsdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ0ZXh0L3ZuZC5mbHlcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJmbHlcIl1cbiAgfSxcbiAgXCJ0ZXh0L3ZuZC5mbWkuZmxleHN0b3JcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJmbHhcIl1cbiAgfSxcbiAgXCJ0ZXh0L3ZuZC5nbWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidGV4dC92bmQuZ3JhcGh2aXpcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJndlwiXVxuICB9LFxuICBcInRleHQvdm5kLmhnbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ0ZXh0L3ZuZC5pbjNkLjNkbWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCIzZG1sXCJdXG4gIH0sXG4gIFwidGV4dC92bmQuaW4zZC5zcG90XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wic3BvdFwiXVxuICB9LFxuICBcInRleHQvdm5kLmlwdGMubmV3c21sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInRleHQvdm5kLmlwdGMubml0ZlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ0ZXh0L3ZuZC5sYXRleC16XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInRleHQvdm5kLm1vdG9yb2xhLnJlZmxleFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ0ZXh0L3ZuZC5tcy1tZWRpYXBhY2thZ2VcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidGV4dC92bmQubmV0MnBob25lLmNvbW1jZW50ZXIuY29tbWFuZFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ0ZXh0L3ZuZC5yYWRpc3lzLm1zbWwtYmFzaWMtbGF5b3V0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInRleHQvdm5kLnNlbngud2FycHNjcmlwdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ0ZXh0L3ZuZC5zaS51cmljYXRhbG9ndWVcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidGV4dC92bmQuc29zaVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ0ZXh0L3ZuZC5zdW4uajJtZS5hcHAtZGVzY3JpcHRvclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjaGFyc2V0XCI6IFwiVVRGLThcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiamFkXCJdXG4gIH0sXG4gIFwidGV4dC92bmQudHJvbGx0ZWNoLmxpbmd1aXN0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNoYXJzZXRcIjogXCJVVEYtOFwiXG4gIH0sXG4gIFwidGV4dC92bmQud2FwLnNpXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInRleHQvdm5kLndhcC5zbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ0ZXh0L3ZuZC53YXAud21sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wid21sXCJdXG4gIH0sXG4gIFwidGV4dC92bmQud2FwLndtbHNjcmlwdFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIndtbHNcIl1cbiAgfSxcbiAgXCJ0ZXh0L3Z0dFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJjaGFyc2V0XCI6IFwiVVRGLThcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ2dHRcIl1cbiAgfSxcbiAgXCJ0ZXh0L3gtYXNtXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzXCIsXCJhc21cIl1cbiAgfSxcbiAgXCJ0ZXh0L3gtY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiY1wiLFwiY2NcIixcImN4eFwiLFwiY3BwXCIsXCJoXCIsXCJoaFwiLFwiZGljXCJdXG4gIH0sXG4gIFwidGV4dC94LWNvbXBvbmVudFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJuZ2lueFwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJodGNcIl1cbiAgfSxcbiAgXCJ0ZXh0L3gtZm9ydHJhblwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZlwiLFwiZm9yXCIsXCJmNzdcIixcImY5MFwiXVxuICB9LFxuICBcInRleHQveC1nd3QtcnBjXCI6IHtcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwidGV4dC94LWhhbmRsZWJhcnMtdGVtcGxhdGVcIjoge1xuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJoYnNcIl1cbiAgfSxcbiAgXCJ0ZXh0L3gtamF2YS1zb3VyY2VcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImphdmFcIl1cbiAgfSxcbiAgXCJ0ZXh0L3gtanF1ZXJ5LXRtcGxcIjoge1xuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfSxcbiAgXCJ0ZXh0L3gtbHVhXCI6IHtcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibHVhXCJdXG4gIH0sXG4gIFwidGV4dC94LW1hcmtkb3duXCI6IHtcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJta2RcIl1cbiAgfSxcbiAgXCJ0ZXh0L3gtbmZvXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJuZm9cIl1cbiAgfSxcbiAgXCJ0ZXh0L3gtb3BtbFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wib3BtbFwiXVxuICB9LFxuICBcInRleHQveC1vcmdcIjoge1xuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm9yZ1wiXVxuICB9LFxuICBcInRleHQveC1wYXNjYWxcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInBcIixcInBhc1wiXVxuICB9LFxuICBcInRleHQveC1wcm9jZXNzaW5nXCI6IHtcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJwZGVcIl1cbiAgfSxcbiAgXCJ0ZXh0L3gtc2Fzc1wiOiB7XG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNhc3NcIl1cbiAgfSxcbiAgXCJ0ZXh0L3gtc2Nzc1wiOiB7XG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNjc3NcIl1cbiAgfSxcbiAgXCJ0ZXh0L3gtc2V0ZXh0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJldHhcIl1cbiAgfSxcbiAgXCJ0ZXh0L3gtc2Z2XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJzZnZcIl1cbiAgfSxcbiAgXCJ0ZXh0L3gtc3VzZS15bXBcIjoge1xuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWUsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInltcFwiXVxuICB9LFxuICBcInRleHQveC11dWVuY29kZVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1widXVcIl1cbiAgfSxcbiAgXCJ0ZXh0L3gtdmNhbGVuZGFyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ2Y3NcIl1cbiAgfSxcbiAgXCJ0ZXh0L3gtdmNhcmRcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInZjZlwiXVxuICB9LFxuICBcInRleHQveG1sXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ4bWxcIl1cbiAgfSxcbiAgXCJ0ZXh0L3htbC1leHRlcm5hbC1wYXJzZWQtZW50aXR5XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInRleHQveWFtbFwiOiB7XG4gICAgXCJleHRlbnNpb25zXCI6IFtcInlhbWxcIixcInltbFwiXVxuICB9LFxuICBcInZpZGVvLzFkLWludGVybGVhdmVkLXBhcml0eWZlY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ2aWRlby8zZ3BwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiM2dwXCIsXCIzZ3BwXCJdXG4gIH0sXG4gIFwidmlkZW8vM2dwcC10dFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ2aWRlby8zZ3BwMlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIjNnMlwiXVxuICB9LFxuICBcInZpZGVvL2JtcGVnXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInZpZGVvL2J0NjU2XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInZpZGVvL2NlbGJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vZHZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vZW5jYXBydHBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vZmxleGZlY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ2aWRlby9oMjYxXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiaDI2MVwiXVxuICB9LFxuICBcInZpZGVvL2gyNjNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJoMjYzXCJdXG4gIH0sXG4gIFwidmlkZW8vaDI2My0xOTk4XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInZpZGVvL2gyNjMtMjAwMFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ2aWRlby9oMjY0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiaDI2NFwiXVxuICB9LFxuICBcInZpZGVvL2gyNjQtcmNkb1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ2aWRlby9oMjY0LXN2Y1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ2aWRlby9oMjY1XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInZpZGVvL2lzby5zZWdtZW50XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInZpZGVvL2pwZWdcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJqcGd2XCJdXG4gIH0sXG4gIFwidmlkZW8vanBlZzIwMDBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vanBtXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJqcG1cIixcImpwZ21cIl1cbiAgfSxcbiAgXCJ2aWRlby9tajJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJtajJcIixcIm1qcDJcIl1cbiAgfSxcbiAgXCJ2aWRlby9tcDFzXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInZpZGVvL21wMnBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vbXAydFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInRzXCJdXG4gIH0sXG4gIFwidmlkZW8vbXA0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibXA0XCIsXCJtcDR2XCIsXCJtcGc0XCJdXG4gIH0sXG4gIFwidmlkZW8vbXA0di1lc1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ2aWRlby9tcGVnXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wibXBlZ1wiLFwibXBnXCIsXCJtcGVcIixcIm0xdlwiLFwibTJ2XCJdXG4gIH0sXG4gIFwidmlkZW8vbXBlZzQtZ2VuZXJpY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ2aWRlby9tcHZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vbnZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vb2dnXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wib2d2XCJdXG4gIH0sXG4gIFwidmlkZW8vcGFyaXR5ZmVjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInZpZGVvL3BvaW50ZXJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vcXVpY2t0aW1lXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicXRcIixcIm1vdlwiXVxuICB9LFxuICBcInZpZGVvL3JhcHRvcmZlY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ2aWRlby9yYXdcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vcnRwLWVuYy1hZXNjbTEyOFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ2aWRlby9ydHBsb29wYmFja1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ2aWRlby9ydHhcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vc21wdGUyOTFcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vc21wdGUyOTJtXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInZpZGVvL3VscGZlY1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ2aWRlby92YzFcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vdmMyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInZpZGVvL3ZuZC5jY3R2XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInZpZGVvL3ZuZC5kZWNlLmhkXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1widXZoXCIsXCJ1dnZoXCJdXG4gIH0sXG4gIFwidmlkZW8vdm5kLmRlY2UubW9iaWxlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1widXZtXCIsXCJ1dnZtXCJdXG4gIH0sXG4gIFwidmlkZW8vdm5kLmRlY2UubXA0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInZpZGVvL3ZuZC5kZWNlLnBkXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1widXZwXCIsXCJ1dnZwXCJdXG4gIH0sXG4gIFwidmlkZW8vdm5kLmRlY2Uuc2RcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ1dnNcIixcInV2dnNcIl1cbiAgfSxcbiAgXCJ2aWRlby92bmQuZGVjZS52aWRlb1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInV2dlwiLFwidXZ2dlwiXVxuICB9LFxuICBcInZpZGVvL3ZuZC5kaXJlY3R2Lm1wZWdcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vdm5kLmRpcmVjdHYubXBlZy10dHNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vdm5kLmRsbmEubXBlZy10dHNcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vdm5kLmR2Yi5maWxlXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZHZiXCJdXG4gIH0sXG4gIFwidmlkZW8vdm5kLmZ2dFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImZ2dFwiXVxuICB9LFxuICBcInZpZGVvL3ZuZC5obnMudmlkZW9cIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vdm5kLmlwdHZmb3J1bS4xZHBhcml0eWZlYy0xMDEwXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInZpZGVvL3ZuZC5pcHR2Zm9ydW0uMWRwYXJpdHlmZWMtMjAwNVwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ2aWRlby92bmQuaXB0dmZvcnVtLjJkcGFyaXR5ZmVjLTEwMTBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vdm5kLmlwdHZmb3J1bS4yZHBhcml0eWZlYy0yMDA1XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInZpZGVvL3ZuZC5pcHR2Zm9ydW0udHRzYXZjXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInZpZGVvL3ZuZC5pcHR2Zm9ydW0udHRzbXBlZzJcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vdm5kLm1vdG9yb2xhLnZpZGVvXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInZpZGVvL3ZuZC5tb3Rvcm9sYS52aWRlb3BcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vdm5kLm1wZWd1cmxcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJteHVcIixcIm00dVwiXVxuICB9LFxuICBcInZpZGVvL3ZuZC5tcy1wbGF5cmVhZHkubWVkaWEucHl2XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wicHl2XCJdXG4gIH0sXG4gIFwidmlkZW8vdm5kLm5va2lhLmludGVybGVhdmVkLW11bHRpbWVkaWFcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vdm5kLm5va2lhLm1wNHZyXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInZpZGVvL3ZuZC5ub2tpYS52aWRlb3ZvaXBcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vdm5kLm9iamVjdHZpZGVvXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInZpZGVvL3ZuZC5yYWRnYW1ldHRvb2xzLmJpbmtcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vdm5kLnJhZGdhbWV0dG9vbHMuc21hY2tlclwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ2aWRlby92bmQuc2VhbGVkLm1wZWcxXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInZpZGVvL3ZuZC5zZWFsZWQubXBlZzRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vdm5kLnNlYWxlZC5zd2ZcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiXG4gIH0sXG4gIFwidmlkZW8vdm5kLnNlYWxlZG1lZGlhLnNvZnRzZWFsLm1vdlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ2aWRlby92bmQudXZ2dS5tcDRcIjoge1xuICAgIFwic291cmNlXCI6IFwiaWFuYVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ1dnVcIixcInV2dnVcIl1cbiAgfSxcbiAgXCJ2aWRlby92bmQudml2b1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInZpdlwiXVxuICB9LFxuICBcInZpZGVvL3ZuZC55b3V0dWJlLnl0XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImlhbmFcIlxuICB9LFxuICBcInZpZGVvL3ZwOFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJpYW5hXCJcbiAgfSxcbiAgXCJ2aWRlby93ZWJtXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ3ZWJtXCJdXG4gIH0sXG4gIFwidmlkZW8veC1mNHZcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcImY0dlwiXVxuICB9LFxuICBcInZpZGVvL3gtZmxpXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJmbGlcIl1cbiAgfSxcbiAgXCJ2aWRlby94LWZsdlwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImNvbXByZXNzaWJsZVwiOiBmYWxzZSxcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiZmx2XCJdXG4gIH0sXG4gIFwidmlkZW8veC1tNHZcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm00dlwiXVxuICB9LFxuICBcInZpZGVvL3gtbWF0cm9za2FcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJjb21wcmVzc2libGVcIjogZmFsc2UsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm1rdlwiLFwibWszZFwiLFwibWtzXCJdXG4gIH0sXG4gIFwidmlkZW8veC1tbmdcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm1uZ1wiXVxuICB9LFxuICBcInZpZGVvL3gtbXMtYXNmXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJhc2ZcIixcImFzeFwiXVxuICB9LFxuICBcInZpZGVvL3gtbXMtdm9iXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ2b2JcIl1cbiAgfSxcbiAgXCJ2aWRlby94LW1zLXdtXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ3bVwiXVxuICB9LFxuICBcInZpZGVvL3gtbXMtd212XCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiY29tcHJlc3NpYmxlXCI6IGZhbHNlLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJ3bXZcIl1cbiAgfSxcbiAgXCJ2aWRlby94LW1zLXdteFwiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wid214XCJdXG4gIH0sXG4gIFwidmlkZW8veC1tcy13dnhcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInd2eFwiXVxuICB9LFxuICBcInZpZGVvL3gtbXN2aWRlb1wiOiB7XG4gICAgXCJzb3VyY2VcIjogXCJhcGFjaGVcIixcbiAgICBcImV4dGVuc2lvbnNcIjogW1wiYXZpXCJdXG4gIH0sXG4gIFwidmlkZW8veC1zZ2ktbW92aWVcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcIm1vdmllXCJdXG4gIH0sXG4gIFwidmlkZW8veC1zbXZcIjoge1xuICAgIFwic291cmNlXCI6IFwiYXBhY2hlXCIsXG4gICAgXCJleHRlbnNpb25zXCI6IFtcInNtdlwiXVxuICB9LFxuICBcIngtY29uZmVyZW5jZS94LWNvb2x0YWxrXCI6IHtcbiAgICBcInNvdXJjZVwiOiBcImFwYWNoZVwiLFxuICAgIFwiZXh0ZW5zaW9uc1wiOiBbXCJpY2VcIl1cbiAgfSxcbiAgXCJ4LXNoYWRlci94LWZyYWdtZW50XCI6IHtcbiAgICBcImNvbXByZXNzaWJsZVwiOiB0cnVlXG4gIH0sXG4gIFwieC1zaGFkZXIveC12ZXJ0ZXhcIjoge1xuICAgIFwiY29tcHJlc3NpYmxlXCI6IHRydWVcbiAgfVxufVxuIiwiLyohXG4gKiBtaW1lLWRiXG4gKiBDb3B5cmlnaHQoYykgMjAxNCBKb25hdGhhbiBPbmdcbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbi8qKlxuICogTW9kdWxlIGV4cG9ydHMuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2RiLmpzb24nKVxuIiwiLyohXG4gKiBtaW1lLXR5cGVzXG4gKiBDb3B5cmlnaHQoYykgMjAxNCBKb25hdGhhbiBPbmdcbiAqIENvcHlyaWdodChjKSAyMDE1IERvdWdsYXMgQ2hyaXN0b3BoZXIgV2lsc29uXG4gKiBNSVQgTGljZW5zZWRcbiAqL1xuXG4ndXNlIHN0cmljdCdcblxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICogQHByaXZhdGVcbiAqL1xuXG52YXIgZGIgPSByZXF1aXJlKCdtaW1lLWRiJylcbnZhciBleHRuYW1lID0gcmVxdWlyZSgncGF0aCcpLmV4dG5hbWVcblxuLyoqXG4gKiBNb2R1bGUgdmFyaWFibGVzLlxuICogQHByaXZhdGVcbiAqL1xuXG52YXIgRVhUUkFDVF9UWVBFX1JFR0VYUCA9IC9eXFxzKihbXjtcXHNdKikoPzo7fFxcc3wkKS9cbnZhciBURVhUX1RZUEVfUkVHRVhQID0gL150ZXh0XFwvL2lcblxuLyoqXG4gKiBNb2R1bGUgZXhwb3J0cy5cbiAqIEBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLmNoYXJzZXQgPSBjaGFyc2V0XG5leHBvcnRzLmNoYXJzZXRzID0geyBsb29rdXA6IGNoYXJzZXQgfVxuZXhwb3J0cy5jb250ZW50VHlwZSA9IGNvbnRlbnRUeXBlXG5leHBvcnRzLmV4dGVuc2lvbiA9IGV4dGVuc2lvblxuZXhwb3J0cy5leHRlbnNpb25zID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuZXhwb3J0cy5sb29rdXAgPSBsb29rdXBcbmV4cG9ydHMudHlwZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbi8vIFBvcHVsYXRlIHRoZSBleHRlbnNpb25zL3R5cGVzIG1hcHNcbnBvcHVsYXRlTWFwcyhleHBvcnRzLmV4dGVuc2lvbnMsIGV4cG9ydHMudHlwZXMpXG5cbi8qKlxuICogR2V0IHRoZSBkZWZhdWx0IGNoYXJzZXQgZm9yIGEgTUlNRSB0eXBlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gKiBAcmV0dXJuIHtib29sZWFufHN0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiBjaGFyc2V0ICh0eXBlKSB7XG4gIGlmICghdHlwZSB8fCB0eXBlb2YgdHlwZSAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8vIFRPRE86IHVzZSBtZWRpYS10eXBlclxuICB2YXIgbWF0Y2ggPSBFWFRSQUNUX1RZUEVfUkVHRVhQLmV4ZWModHlwZSlcbiAgdmFyIG1pbWUgPSBtYXRjaCAmJiBkYlttYXRjaFsxXS50b0xvd2VyQ2FzZSgpXVxuXG4gIGlmIChtaW1lICYmIG1pbWUuY2hhcnNldCkge1xuICAgIHJldHVybiBtaW1lLmNoYXJzZXRcbiAgfVxuXG4gIC8vIGRlZmF1bHQgdGV4dC8qIHRvIHV0Zi04XG4gIGlmIChtYXRjaCAmJiBURVhUX1RZUEVfUkVHRVhQLnRlc3QobWF0Y2hbMV0pKSB7XG4gICAgcmV0dXJuICdVVEYtOCdcbiAgfVxuXG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIENyZWF0ZSBhIGZ1bGwgQ29udGVudC1UeXBlIGhlYWRlciBnaXZlbiBhIE1JTUUgdHlwZSBvciBleHRlbnNpb24uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICogQHJldHVybiB7Ym9vbGVhbnxzdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gY29udGVudFR5cGUgKHN0cikge1xuICAvLyBUT0RPOiBzaG91bGQgdGhpcyBldmVuIGJlIGluIHRoaXMgbW9kdWxlP1xuICBpZiAoIXN0ciB8fCB0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgdmFyIG1pbWUgPSBzdHIuaW5kZXhPZignLycpID09PSAtMVxuICAgID8gZXhwb3J0cy5sb29rdXAoc3RyKVxuICAgIDogc3RyXG5cbiAgaWYgKCFtaW1lKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvLyBUT0RPOiB1c2UgY29udGVudC10eXBlIG9yIG90aGVyIG1vZHVsZVxuICBpZiAobWltZS5pbmRleE9mKCdjaGFyc2V0JykgPT09IC0xKSB7XG4gICAgdmFyIGNoYXJzZXQgPSBleHBvcnRzLmNoYXJzZXQobWltZSlcbiAgICBpZiAoY2hhcnNldCkgbWltZSArPSAnOyBjaGFyc2V0PScgKyBjaGFyc2V0LnRvTG93ZXJDYXNlKClcbiAgfVxuXG4gIHJldHVybiBtaW1lXG59XG5cbi8qKlxuICogR2V0IHRoZSBkZWZhdWx0IGV4dGVuc2lvbiBmb3IgYSBNSU1FIHR5cGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAqIEByZXR1cm4ge2Jvb2xlYW58c3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIGV4dGVuc2lvbiAodHlwZSkge1xuICBpZiAoIXR5cGUgfHwgdHlwZW9mIHR5cGUgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvLyBUT0RPOiB1c2UgbWVkaWEtdHlwZXJcbiAgdmFyIG1hdGNoID0gRVhUUkFDVF9UWVBFX1JFR0VYUC5leGVjKHR5cGUpXG5cbiAgLy8gZ2V0IGV4dGVuc2lvbnNcbiAgdmFyIGV4dHMgPSBtYXRjaCAmJiBleHBvcnRzLmV4dGVuc2lvbnNbbWF0Y2hbMV0udG9Mb3dlckNhc2UoKV1cblxuICBpZiAoIWV4dHMgfHwgIWV4dHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gZXh0c1swXVxufVxuXG4vKipcbiAqIExvb2t1cCB0aGUgTUlNRSB0eXBlIGZvciBhIGZpbGUgcGF0aC9leHRlbnNpb24uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAqIEByZXR1cm4ge2Jvb2xlYW58c3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIGxvb2t1cCAocGF0aCkge1xuICBpZiAoIXBhdGggfHwgdHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvLyBnZXQgdGhlIGV4dGVuc2lvbiAoXCJleHRcIiBvciBcIi5leHRcIiBvciBmdWxsIHBhdGgpXG4gIHZhciBleHRlbnNpb24gPSBleHRuYW1lKCd4LicgKyBwYXRoKVxuICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgLnN1YnN0cigxKVxuXG4gIGlmICghZXh0ZW5zaW9uKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gZXhwb3J0cy50eXBlc1tleHRlbnNpb25dIHx8IGZhbHNlXG59XG5cbi8qKlxuICogUG9wdWxhdGUgdGhlIGV4dGVuc2lvbnMgYW5kIHR5cGVzIG1hcHMuXG4gKiBAcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBvcHVsYXRlTWFwcyAoZXh0ZW5zaW9ucywgdHlwZXMpIHtcbiAgLy8gc291cmNlIHByZWZlcmVuY2UgKGxlYXN0IC0+IG1vc3QpXG4gIHZhciBwcmVmZXJlbmNlID0gWyduZ2lueCcsICdhcGFjaGUnLCB1bmRlZmluZWQsICdpYW5hJ11cblxuICBPYmplY3Qua2V5cyhkYikuZm9yRWFjaChmdW5jdGlvbiBmb3JFYWNoTWltZVR5cGUgKHR5cGUpIHtcbiAgICB2YXIgbWltZSA9IGRiW3R5cGVdXG4gICAgdmFyIGV4dHMgPSBtaW1lLmV4dGVuc2lvbnNcblxuICAgIGlmICghZXh0cyB8fCAhZXh0cy5sZW5ndGgpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIG1pbWUgLT4gZXh0ZW5zaW9uc1xuICAgIGV4dGVuc2lvbnNbdHlwZV0gPSBleHRzXG5cbiAgICAvLyBleHRlbnNpb24gLT4gbWltZVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXh0cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGV4dGVuc2lvbiA9IGV4dHNbaV1cblxuICAgICAgaWYgKHR5cGVzW2V4dGVuc2lvbl0pIHtcbiAgICAgICAgdmFyIGZyb20gPSBwcmVmZXJlbmNlLmluZGV4T2YoZGJbdHlwZXNbZXh0ZW5zaW9uXV0uc291cmNlKVxuICAgICAgICB2YXIgdG8gPSBwcmVmZXJlbmNlLmluZGV4T2YobWltZS5zb3VyY2UpXG5cbiAgICAgICAgaWYgKHR5cGVzW2V4dGVuc2lvbl0gIT09ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nICYmXG4gICAgICAgICAgKGZyb20gPiB0byB8fCAoZnJvbSA9PT0gdG8gJiYgdHlwZXNbZXh0ZW5zaW9uXS5zdWJzdHIoMCwgMTIpID09PSAnYXBwbGljYXRpb24vJykpKSB7XG4gICAgICAgICAgLy8gc2tpcCB0aGUgcmVtYXBwaW5nXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBzZXQgdGhlIGV4dGVuc2lvbiAtPiBtaW1lXG4gICAgICB0eXBlc1tleHRlbnNpb25dID0gdHlwZVxuICAgIH1cbiAgfSlcbn1cbiIsIi8qIVxuICogdHlwZS1pc1xuICogQ29weXJpZ2h0KGMpIDIwMTQgSm9uYXRoYW4gT25nXG4gKiBDb3B5cmlnaHQoYykgMjAxNC0yMDE1IERvdWdsYXMgQ2hyaXN0b3BoZXIgV2lsc29uXG4gKiBNSVQgTGljZW5zZWRcbiAqL1xuXG4ndXNlIHN0cmljdCdcblxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICogQHByaXZhdGVcbiAqL1xuXG52YXIgdHlwZXIgPSByZXF1aXJlKCdtZWRpYS10eXBlcicpXG52YXIgbWltZSA9IHJlcXVpcmUoJ21pbWUtdHlwZXMnKVxuXG4vKipcbiAqIE1vZHVsZSBleHBvcnRzLlxuICogQHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gdHlwZW9mcmVxdWVzdFxubW9kdWxlLmV4cG9ydHMuaXMgPSB0eXBlaXNcbm1vZHVsZS5leHBvcnRzLmhhc0JvZHkgPSBoYXNib2R5XG5tb2R1bGUuZXhwb3J0cy5ub3JtYWxpemUgPSBub3JtYWxpemVcbm1vZHVsZS5leHBvcnRzLm1hdGNoID0gbWltZU1hdGNoXG5cbi8qKlxuICogQ29tcGFyZSBhIGB2YWx1ZWAgY29udGVudC10eXBlIHdpdGggYHR5cGVzYC5cbiAqIEVhY2ggYHR5cGVgIGNhbiBiZSBhbiBleHRlbnNpb24gbGlrZSBgaHRtbGAsXG4gKiBhIHNwZWNpYWwgc2hvcnRjdXQgbGlrZSBgbXVsdGlwYXJ0YCBvciBgdXJsZW5jb2RlZGAsXG4gKiBvciBhIG1pbWUgdHlwZS5cbiAqXG4gKiBJZiBubyB0eXBlcyBtYXRjaCwgYGZhbHNlYCBpcyByZXR1cm5lZC5cbiAqIE90aGVyd2lzZSwgdGhlIGZpcnN0IGB0eXBlYCB0aGF0IG1hdGNoZXMgaXMgcmV0dXJuZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXG4gKiBAcGFyYW0ge0FycmF5fSB0eXBlc1xuICogQHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIHR5cGVpcyAodmFsdWUsIHR5cGVzXykge1xuICB2YXIgaVxuICB2YXIgdHlwZXMgPSB0eXBlc19cblxuICAvLyByZW1vdmUgcGFyYW1ldGVycyBhbmQgbm9ybWFsaXplXG4gIHZhciB2YWwgPSB0cnlOb3JtYWxpemVUeXBlKHZhbHVlKVxuXG4gIC8vIG5vIHR5cGUgb3IgaW52YWxpZFxuICBpZiAoIXZhbCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLy8gc3VwcG9ydCBmbGF0dGVuZWQgYXJndW1lbnRzXG4gIGlmICh0eXBlcyAmJiAhQXJyYXkuaXNBcnJheSh0eXBlcykpIHtcbiAgICB0eXBlcyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSlcbiAgICBmb3IgKGkgPSAwOyBpIDwgdHlwZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHR5cGVzW2ldID0gYXJndW1lbnRzW2kgKyAxXVxuICAgIH1cbiAgfVxuXG4gIC8vIG5vIHR5cGVzLCByZXR1cm4gdGhlIGNvbnRlbnQgdHlwZVxuICBpZiAoIXR5cGVzIHx8ICF0eXBlcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gdmFsXG4gIH1cblxuICB2YXIgdHlwZVxuICBmb3IgKGkgPSAwOyBpIDwgdHlwZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAobWltZU1hdGNoKG5vcm1hbGl6ZSh0eXBlID0gdHlwZXNbaV0pLCB2YWwpKSB7XG4gICAgICByZXR1cm4gdHlwZVswXSA9PT0gJysnIHx8IHR5cGUuaW5kZXhPZignKicpICE9PSAtMVxuICAgICAgICA/IHZhbFxuICAgICAgICA6IHR5cGVcbiAgICB9XG4gIH1cblxuICAvLyBubyBtYXRjaGVzXG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIENoZWNrIGlmIGEgcmVxdWVzdCBoYXMgYSByZXF1ZXN0IGJvZHkuXG4gKiBBIHJlcXVlc3Qgd2l0aCBhIGJvZHkgX19tdXN0X18gZWl0aGVyIGhhdmUgYHRyYW5zZmVyLWVuY29kaW5nYFxuICogb3IgYGNvbnRlbnQtbGVuZ3RoYCBoZWFkZXJzIHNldC5cbiAqIGh0dHA6Ly93d3cudzMub3JnL1Byb3RvY29scy9yZmMyNjE2L3JmYzI2MTYtc2VjNC5odG1sI3NlYzQuM1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSByZXF1ZXN0XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGhhc2JvZHkgKHJlcSkge1xuICByZXR1cm4gcmVxLmhlYWRlcnNbJ3RyYW5zZmVyLWVuY29kaW5nJ10gIT09IHVuZGVmaW5lZCB8fFxuICAgICFpc05hTihyZXEuaGVhZGVyc1snY29udGVudC1sZW5ndGgnXSlcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgaW5jb21pbmcgcmVxdWVzdCBjb250YWlucyB0aGUgXCJDb250ZW50LVR5cGVcIlxuICogaGVhZGVyIGZpZWxkLCBhbmQgaXQgY29udGFpbnMgYW55IG9mIHRoZSBnaXZlIG1pbWUgYHR5cGVgcy5cbiAqIElmIHRoZXJlIGlzIG5vIHJlcXVlc3QgYm9keSwgYG51bGxgIGlzIHJldHVybmVkLlxuICogSWYgdGhlcmUgaXMgbm8gY29udGVudCB0eXBlLCBgZmFsc2VgIGlzIHJldHVybmVkLlxuICogT3RoZXJ3aXNlLCBpdCByZXR1cm5zIHRoZSBmaXJzdCBgdHlwZWAgdGhhdCBtYXRjaGVzLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAvLyBXaXRoIENvbnRlbnQtVHlwZTogdGV4dC9odG1sOyBjaGFyc2V0PXV0Zi04XG4gKiAgICAgdGhpcy5pcygnaHRtbCcpOyAvLyA9PiAnaHRtbCdcbiAqICAgICB0aGlzLmlzKCd0ZXh0L2h0bWwnKTsgLy8gPT4gJ3RleHQvaHRtbCdcbiAqICAgICB0aGlzLmlzKCd0ZXh0LyonLCAnYXBwbGljYXRpb24vanNvbicpOyAvLyA9PiAndGV4dC9odG1sJ1xuICpcbiAqICAgICAvLyBXaGVuIENvbnRlbnQtVHlwZSBpcyBhcHBsaWNhdGlvbi9qc29uXG4gKiAgICAgdGhpcy5pcygnanNvbicsICd1cmxlbmNvZGVkJyk7IC8vID0+ICdqc29uJ1xuICogICAgIHRoaXMuaXMoJ2FwcGxpY2F0aW9uL2pzb24nKTsgLy8gPT4gJ2FwcGxpY2F0aW9uL2pzb24nXG4gKiAgICAgdGhpcy5pcygnaHRtbCcsICdhcHBsaWNhdGlvbi8qJyk7IC8vID0+ICdhcHBsaWNhdGlvbi9qc29uJ1xuICpcbiAqICAgICB0aGlzLmlzKCdodG1sJyk7IC8vID0+IGZhbHNlXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHR5cGVzLi4uXG4gKiBAcmV0dXJuIHtTdHJpbmd8ZmFsc2V8bnVsbH1cbiAqIEBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiB0eXBlb2ZyZXF1ZXN0IChyZXEsIHR5cGVzXykge1xuICB2YXIgdHlwZXMgPSB0eXBlc19cblxuICAvLyBubyBib2R5XG4gIGlmICghaGFzYm9keShyZXEpKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIC8vIHN1cHBvcnQgZmxhdHRlbmVkIGFyZ3VtZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcbiAgICB0eXBlcyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSlcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHR5cGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0eXBlc1tpXSA9IGFyZ3VtZW50c1tpICsgMV1cbiAgICB9XG4gIH1cblxuICAvLyByZXF1ZXN0IGNvbnRlbnQgdHlwZVxuICB2YXIgdmFsdWUgPSByZXEuaGVhZGVyc1snY29udGVudC10eXBlJ11cblxuICByZXR1cm4gdHlwZWlzKHZhbHVlLCB0eXBlcylcbn1cblxuLyoqXG4gKiBOb3JtYWxpemUgYSBtaW1lIHR5cGUuXG4gKiBJZiBpdCdzIGEgc2hvcnRoYW5kLCBleHBhbmQgaXQgdG8gYSB2YWxpZCBtaW1lIHR5cGUuXG4gKlxuICogSW4gZ2VuZXJhbCwgeW91IHByb2JhYmx5IHdhbnQ6XG4gKlxuICogICB2YXIgdHlwZSA9IGlzKHJlcSwgWyd1cmxlbmNvZGVkJywgJ2pzb24nLCAnbXVsdGlwYXJ0J10pO1xuICpcbiAqIFRoZW4gdXNlIHRoZSBhcHByb3ByaWF0ZSBib2R5IHBhcnNlcnMuXG4gKiBUaGVzZSB0aHJlZSBhcmUgdGhlIG1vc3QgY29tbW9uIHJlcXVlc3QgYm9keSB0eXBlc1xuICogYW5kIGFyZSB0aHVzIGVuc3VyZWQgdG8gd29yay5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBub3JtYWxpemUgKHR5cGUpIHtcbiAgaWYgKHR5cGVvZiB0eXBlICE9PSAnc3RyaW5nJykge1xuICAgIC8vIGludmFsaWQgdHlwZVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAndXJsZW5jb2RlZCc6XG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICBjYXNlICdtdWx0aXBhcnQnOlxuICAgICAgcmV0dXJuICdtdWx0aXBhcnQvKidcbiAgfVxuXG4gIGlmICh0eXBlWzBdID09PSAnKycpIHtcbiAgICAvLyBcIitqc29uXCIgLT4gXCIqLyoranNvblwiIGV4cGFuZG9cbiAgICByZXR1cm4gJyovKicgKyB0eXBlXG4gIH1cblxuICByZXR1cm4gdHlwZS5pbmRleE9mKCcvJykgPT09IC0xXG4gICAgPyBtaW1lLmxvb2t1cCh0eXBlKVxuICAgIDogdHlwZVxufVxuXG4vKipcbiAqIENoZWNrIGlmIGBleHBlY3RlZGAgbWltZSB0eXBlXG4gKiBtYXRjaGVzIGBhY3R1YWxgIG1pbWUgdHlwZSB3aXRoXG4gKiB3aWxkY2FyZCBhbmQgK3N1ZmZpeCBzdXBwb3J0LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHBlY3RlZFxuICogQHBhcmFtIHtTdHJpbmd9IGFjdHVhbFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbWltZU1hdGNoIChleHBlY3RlZCwgYWN0dWFsKSB7XG4gIC8vIGludmFsaWQgdHlwZVxuICBpZiAoZXhwZWN0ZWQgPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvLyBzcGxpdCB0eXBlc1xuICB2YXIgYWN0dWFsUGFydHMgPSBhY3R1YWwuc3BsaXQoJy8nKVxuICB2YXIgZXhwZWN0ZWRQYXJ0cyA9IGV4cGVjdGVkLnNwbGl0KCcvJylcblxuICAvLyBpbnZhbGlkIGZvcm1hdFxuICBpZiAoYWN0dWFsUGFydHMubGVuZ3RoICE9PSAyIHx8IGV4cGVjdGVkUGFydHMubGVuZ3RoICE9PSAyKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvLyB2YWxpZGF0ZSB0eXBlXG4gIGlmIChleHBlY3RlZFBhcnRzWzBdICE9PSAnKicgJiYgZXhwZWN0ZWRQYXJ0c1swXSAhPT0gYWN0dWFsUGFydHNbMF0pIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8vIHZhbGlkYXRlIHN1ZmZpeCB3aWxkY2FyZFxuICBpZiAoZXhwZWN0ZWRQYXJ0c1sxXS5zdWJzdHIoMCwgMikgPT09ICcqKycpIHtcbiAgICByZXR1cm4gZXhwZWN0ZWRQYXJ0c1sxXS5sZW5ndGggPD0gYWN0dWFsUGFydHNbMV0ubGVuZ3RoICsgMSAmJlxuICAgICAgZXhwZWN0ZWRQYXJ0c1sxXS5zdWJzdHIoMSkgPT09IGFjdHVhbFBhcnRzWzFdLnN1YnN0cigxIC0gZXhwZWN0ZWRQYXJ0c1sxXS5sZW5ndGgpXG4gIH1cblxuICAvLyB2YWxpZGF0ZSBzdWJ0eXBlXG4gIGlmIChleHBlY3RlZFBhcnRzWzFdICE9PSAnKicgJiYgZXhwZWN0ZWRQYXJ0c1sxXSAhPT0gYWN0dWFsUGFydHNbMV0pIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiB0cnVlXG59XG5cbi8qKlxuICogTm9ybWFsaXplIGEgdHlwZSBhbmQgcmVtb3ZlIHBhcmFtZXRlcnMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKiBAcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVR5cGUgKHZhbHVlKSB7XG4gIC8vIHBhcnNlIHRoZSB0eXBlXG4gIHZhciB0eXBlID0gdHlwZXIucGFyc2UodmFsdWUpXG5cbiAgLy8gcmVtb3ZlIHRoZSBwYXJhbWV0ZXJzXG4gIHR5cGUucGFyYW1ldGVycyA9IHVuZGVmaW5lZFxuXG4gIC8vIHJlZm9ybWF0IGl0XG4gIHJldHVybiB0eXBlci5mb3JtYXQodHlwZSlcbn1cblxuLyoqXG4gKiBUcnkgdG8gbm9ybWFsaXplIGEgdHlwZSBhbmQgcmVtb3ZlIHBhcmFtZXRlcnMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKiBAcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHRyeU5vcm1hbGl6ZVR5cGUgKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gbm9ybWFsaXplVHlwZSh2YWx1ZSlcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxufVxuIiwiXG5jb25zdCBkb210b3N2ZyA9IHJlcXVpcmUoJ2RvbS10by1zdmcnKVxuXG5mdW5jdGlvbiByZWFkeShmbikge1xuICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPSAnbG9hZGluZycpe1xuICAgIGZuKCk7XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZuKTtcbiAgfVxufVxuXG5yZWFkeSgoKSA9PiB7XG4gICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcm9vdCcpXG4gICAgY29uc3Qgc3ZnRG9jdW1lbnQgPSBkb210b3N2Zy5lbGVtZW50VG9TVkcoZWxlbWVudCk7XG4gICAgY29uc29sZS5sb2coc3ZnRG9jdW1lbnQpXG59KVxuIiwiLy8gJ3BhdGgnIG1vZHVsZSBleHRyYWN0ZWQgZnJvbSBOb2RlLmpzIHY4LjExLjEgKG9ubHkgdGhlIHBvc2l4IHBhcnQpXG4vLyB0cmFuc3BsaXRlZCB3aXRoIEJhYmVsXG5cbi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGFzc2VydFBhdGgocGF0aCkge1xuICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUGF0aCBtdXN0IGJlIGEgc3RyaW5nLiBSZWNlaXZlZCAnICsgSlNPTi5zdHJpbmdpZnkocGF0aCkpO1xuICB9XG59XG5cbi8vIFJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCB3aXRoIGRpcmVjdG9yeSBuYW1lc1xuZnVuY3Rpb24gbm9ybWFsaXplU3RyaW5nUG9zaXgocGF0aCwgYWxsb3dBYm92ZVJvb3QpIHtcbiAgdmFyIHJlcyA9ICcnO1xuICB2YXIgbGFzdFNlZ21lbnRMZW5ndGggPSAwO1xuICB2YXIgbGFzdFNsYXNoID0gLTE7XG4gIHZhciBkb3RzID0gMDtcbiAgdmFyIGNvZGU7XG4gIGZvciAodmFyIGkgPSAwOyBpIDw9IHBhdGgubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoaSA8IHBhdGgubGVuZ3RoKVxuICAgICAgY29kZSA9IHBhdGguY2hhckNvZGVBdChpKTtcbiAgICBlbHNlIGlmIChjb2RlID09PSA0NyAvKi8qLylcbiAgICAgIGJyZWFrO1xuICAgIGVsc2VcbiAgICAgIGNvZGUgPSA0NyAvKi8qLztcbiAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcbiAgICAgIGlmIChsYXN0U2xhc2ggPT09IGkgLSAxIHx8IGRvdHMgPT09IDEpIHtcbiAgICAgICAgLy8gTk9PUFxuICAgICAgfSBlbHNlIGlmIChsYXN0U2xhc2ggIT09IGkgLSAxICYmIGRvdHMgPT09IDIpIHtcbiAgICAgICAgaWYgKHJlcy5sZW5ndGggPCAyIHx8IGxhc3RTZWdtZW50TGVuZ3RoICE9PSAyIHx8IHJlcy5jaGFyQ29kZUF0KHJlcy5sZW5ndGggLSAxKSAhPT0gNDYgLyouKi8gfHwgcmVzLmNoYXJDb2RlQXQocmVzLmxlbmd0aCAtIDIpICE9PSA0NiAvKi4qLykge1xuICAgICAgICAgIGlmIChyZXMubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgdmFyIGxhc3RTbGFzaEluZGV4ID0gcmVzLmxhc3RJbmRleE9mKCcvJyk7XG4gICAgICAgICAgICBpZiAobGFzdFNsYXNoSW5kZXggIT09IHJlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgIGlmIChsYXN0U2xhc2hJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXMgPSAnJztcbiAgICAgICAgICAgICAgICBsYXN0U2VnbWVudExlbmd0aCA9IDA7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzID0gcmVzLnNsaWNlKDAsIGxhc3RTbGFzaEluZGV4KTtcbiAgICAgICAgICAgICAgICBsYXN0U2VnbWVudExlbmd0aCA9IHJlcy5sZW5ndGggLSAxIC0gcmVzLmxhc3RJbmRleE9mKCcvJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbGFzdFNsYXNoID0gaTtcbiAgICAgICAgICAgICAgZG90cyA9IDA7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocmVzLmxlbmd0aCA9PT0gMiB8fCByZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICByZXMgPSAnJztcbiAgICAgICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gMDtcbiAgICAgICAgICAgIGxhc3RTbGFzaCA9IGk7XG4gICAgICAgICAgICBkb3RzID0gMDtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoYWxsb3dBYm92ZVJvb3QpIHtcbiAgICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICByZXMgKz0gJy8uLic7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmVzID0gJy4uJztcbiAgICAgICAgICBsYXN0U2VnbWVudExlbmd0aCA9IDI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChyZXMubGVuZ3RoID4gMClcbiAgICAgICAgICByZXMgKz0gJy8nICsgcGF0aC5zbGljZShsYXN0U2xhc2ggKyAxLCBpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJlcyA9IHBhdGguc2xpY2UobGFzdFNsYXNoICsgMSwgaSk7XG4gICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gaSAtIGxhc3RTbGFzaCAtIDE7XG4gICAgICB9XG4gICAgICBsYXN0U2xhc2ggPSBpO1xuICAgICAgZG90cyA9IDA7XG4gICAgfSBlbHNlIGlmIChjb2RlID09PSA0NiAvKi4qLyAmJiBkb3RzICE9PSAtMSkge1xuICAgICAgKytkb3RzO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb3RzID0gLTE7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIF9mb3JtYXQoc2VwLCBwYXRoT2JqZWN0KSB7XG4gIHZhciBkaXIgPSBwYXRoT2JqZWN0LmRpciB8fCBwYXRoT2JqZWN0LnJvb3Q7XG4gIHZhciBiYXNlID0gcGF0aE9iamVjdC5iYXNlIHx8IChwYXRoT2JqZWN0Lm5hbWUgfHwgJycpICsgKHBhdGhPYmplY3QuZXh0IHx8ICcnKTtcbiAgaWYgKCFkaXIpIHtcbiAgICByZXR1cm4gYmFzZTtcbiAgfVxuICBpZiAoZGlyID09PSBwYXRoT2JqZWN0LnJvb3QpIHtcbiAgICByZXR1cm4gZGlyICsgYmFzZTtcbiAgfVxuICByZXR1cm4gZGlyICsgc2VwICsgYmFzZTtcbn1cblxudmFyIHBvc2l4ID0ge1xuICAvLyBwYXRoLnJlc29sdmUoW2Zyb20gLi4uXSwgdG8pXG4gIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmUoKSB7XG4gICAgdmFyIHJlc29sdmVkUGF0aCA9ICcnO1xuICAgIHZhciByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG4gICAgdmFyIGN3ZDtcblxuICAgIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICAgICB2YXIgcGF0aDtcbiAgICAgIGlmIChpID49IDApXG4gICAgICAgIHBhdGggPSBhcmd1bWVudHNbaV07XG4gICAgICBlbHNlIHtcbiAgICAgICAgaWYgKGN3ZCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgIGN3ZCA9IHByb2Nlc3MuY3dkKCk7XG4gICAgICAgIHBhdGggPSBjd2Q7XG4gICAgICB9XG5cbiAgICAgIGFzc2VydFBhdGgocGF0aCk7XG5cbiAgICAgIC8vIFNraXAgZW1wdHkgZW50cmllc1xuICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICByZXNvbHZlZFBhdGggPSBwYXRoICsgJy8nICsgcmVzb2x2ZWRQYXRoO1xuICAgICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckNvZGVBdCgwKSA9PT0gNDcgLyovKi87XG4gICAgfVxuXG4gICAgLy8gQXQgdGhpcyBwb2ludCB0aGUgcGF0aCBzaG91bGQgYmUgcmVzb2x2ZWQgdG8gYSBmdWxsIGFic29sdXRlIHBhdGgsIGJ1dFxuICAgIC8vIGhhbmRsZSByZWxhdGl2ZSBwYXRocyB0byBiZSBzYWZlIChtaWdodCBoYXBwZW4gd2hlbiBwcm9jZXNzLmN3ZCgpIGZhaWxzKVxuXG4gICAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gICAgcmVzb2x2ZWRQYXRoID0gbm9ybWFsaXplU3RyaW5nUG9zaXgocmVzb2x2ZWRQYXRoLCAhcmVzb2x2ZWRBYnNvbHV0ZSk7XG5cbiAgICBpZiAocmVzb2x2ZWRBYnNvbHV0ZSkge1xuICAgICAgaWYgKHJlc29sdmVkUGF0aC5sZW5ndGggPiAwKVxuICAgICAgICByZXR1cm4gJy8nICsgcmVzb2x2ZWRQYXRoO1xuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gJy8nO1xuICAgIH0gZWxzZSBpZiAocmVzb2x2ZWRQYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiByZXNvbHZlZFBhdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnLic7XG4gICAgfVxuICB9LFxuXG4gIG5vcm1hbGl6ZTogZnVuY3Rpb24gbm9ybWFsaXplKHBhdGgpIHtcbiAgICBhc3NlcnRQYXRoKHBhdGgpO1xuXG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSByZXR1cm4gJy4nO1xuXG4gICAgdmFyIGlzQWJzb2x1dGUgPSBwYXRoLmNoYXJDb2RlQXQoMCkgPT09IDQ3IC8qLyovO1xuICAgIHZhciB0cmFpbGluZ1NlcGFyYXRvciA9IHBhdGguY2hhckNvZGVBdChwYXRoLmxlbmd0aCAtIDEpID09PSA0NyAvKi8qLztcblxuICAgIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICAgIHBhdGggPSBub3JtYWxpemVTdHJpbmdQb3NpeChwYXRoLCAhaXNBYnNvbHV0ZSk7XG5cbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDAgJiYgIWlzQWJzb2x1dGUpIHBhdGggPSAnLic7XG4gICAgaWYgKHBhdGgubGVuZ3RoID4gMCAmJiB0cmFpbGluZ1NlcGFyYXRvcikgcGF0aCArPSAnLyc7XG5cbiAgICBpZiAoaXNBYnNvbHV0ZSkgcmV0dXJuICcvJyArIHBhdGg7XG4gICAgcmV0dXJuIHBhdGg7XG4gIH0sXG5cbiAgaXNBYnNvbHV0ZTogZnVuY3Rpb24gaXNBYnNvbHV0ZShwYXRoKSB7XG4gICAgYXNzZXJ0UGF0aChwYXRoKTtcbiAgICByZXR1cm4gcGF0aC5sZW5ndGggPiAwICYmIHBhdGguY2hhckNvZGVBdCgwKSA9PT0gNDcgLyovKi87XG4gIH0sXG5cbiAgam9pbjogZnVuY3Rpb24gam9pbigpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiAnLic7XG4gICAgdmFyIGpvaW5lZDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIGFyZyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIGFzc2VydFBhdGgoYXJnKTtcbiAgICAgIGlmIChhcmcubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAoam9pbmVkID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgam9pbmVkID0gYXJnO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgam9pbmVkICs9ICcvJyArIGFyZztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGpvaW5lZCA9PT0gdW5kZWZpbmVkKVxuICAgICAgcmV0dXJuICcuJztcbiAgICByZXR1cm4gcG9zaXgubm9ybWFsaXplKGpvaW5lZCk7XG4gIH0sXG5cbiAgcmVsYXRpdmU6IGZ1bmN0aW9uIHJlbGF0aXZlKGZyb20sIHRvKSB7XG4gICAgYXNzZXJ0UGF0aChmcm9tKTtcbiAgICBhc3NlcnRQYXRoKHRvKTtcblxuICAgIGlmIChmcm9tID09PSB0bykgcmV0dXJuICcnO1xuXG4gICAgZnJvbSA9IHBvc2l4LnJlc29sdmUoZnJvbSk7XG4gICAgdG8gPSBwb3NpeC5yZXNvbHZlKHRvKTtcblxuICAgIGlmIChmcm9tID09PSB0bykgcmV0dXJuICcnO1xuXG4gICAgLy8gVHJpbSBhbnkgbGVhZGluZyBiYWNrc2xhc2hlc1xuICAgIHZhciBmcm9tU3RhcnQgPSAxO1xuICAgIGZvciAoOyBmcm9tU3RhcnQgPCBmcm9tLmxlbmd0aDsgKytmcm9tU3RhcnQpIHtcbiAgICAgIGlmIChmcm9tLmNoYXJDb2RlQXQoZnJvbVN0YXJ0KSAhPT0gNDcgLyovKi8pXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICB2YXIgZnJvbUVuZCA9IGZyb20ubGVuZ3RoO1xuICAgIHZhciBmcm9tTGVuID0gZnJvbUVuZCAtIGZyb21TdGFydDtcblxuICAgIC8vIFRyaW0gYW55IGxlYWRpbmcgYmFja3NsYXNoZXNcbiAgICB2YXIgdG9TdGFydCA9IDE7XG4gICAgZm9yICg7IHRvU3RhcnQgPCB0by5sZW5ndGg7ICsrdG9TdGFydCkge1xuICAgICAgaWYgKHRvLmNoYXJDb2RlQXQodG9TdGFydCkgIT09IDQ3IC8qLyovKVxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgdmFyIHRvRW5kID0gdG8ubGVuZ3RoO1xuICAgIHZhciB0b0xlbiA9IHRvRW5kIC0gdG9TdGFydDtcblxuICAgIC8vIENvbXBhcmUgcGF0aHMgdG8gZmluZCB0aGUgbG9uZ2VzdCBjb21tb24gcGF0aCBmcm9tIHJvb3RcbiAgICB2YXIgbGVuZ3RoID0gZnJvbUxlbiA8IHRvTGVuID8gZnJvbUxlbiA6IHRvTGVuO1xuICAgIHZhciBsYXN0Q29tbW9uU2VwID0gLTE7XG4gICAgdmFyIGkgPSAwO1xuICAgIGZvciAoOyBpIDw9IGxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoaSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgIGlmICh0b0xlbiA+IGxlbmd0aCkge1xuICAgICAgICAgIGlmICh0by5jaGFyQ29kZUF0KHRvU3RhcnQgKyBpKSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICAgIC8vIFdlIGdldCBoZXJlIGlmIGBmcm9tYCBpcyB0aGUgZXhhY3QgYmFzZSBwYXRoIGZvciBgdG9gLlxuICAgICAgICAgICAgLy8gRm9yIGV4YW1wbGU6IGZyb209Jy9mb28vYmFyJzsgdG89Jy9mb28vYmFyL2JheidcbiAgICAgICAgICAgIHJldHVybiB0by5zbGljZSh0b1N0YXJ0ICsgaSArIDEpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgLy8gV2UgZ2V0IGhlcmUgaWYgYGZyb21gIGlzIHRoZSByb290XG4gICAgICAgICAgICAvLyBGb3IgZXhhbXBsZTogZnJvbT0nLyc7IHRvPScvZm9vJ1xuICAgICAgICAgICAgcmV0dXJuIHRvLnNsaWNlKHRvU3RhcnQgKyBpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZnJvbUxlbiA+IGxlbmd0aCkge1xuICAgICAgICAgIGlmIChmcm9tLmNoYXJDb2RlQXQoZnJvbVN0YXJ0ICsgaSkgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgICAgICAvLyBXZSBnZXQgaGVyZSBpZiBgdG9gIGlzIHRoZSBleGFjdCBiYXNlIHBhdGggZm9yIGBmcm9tYC5cbiAgICAgICAgICAgIC8vIEZvciBleGFtcGxlOiBmcm9tPScvZm9vL2Jhci9iYXonOyB0bz0nL2Zvby9iYXInXG4gICAgICAgICAgICBsYXN0Q29tbW9uU2VwID0gaTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgIC8vIFdlIGdldCBoZXJlIGlmIGB0b2AgaXMgdGhlIHJvb3QuXG4gICAgICAgICAgICAvLyBGb3IgZXhhbXBsZTogZnJvbT0nL2Zvbyc7IHRvPScvJ1xuICAgICAgICAgICAgbGFzdENvbW1vblNlcCA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgdmFyIGZyb21Db2RlID0gZnJvbS5jaGFyQ29kZUF0KGZyb21TdGFydCArIGkpO1xuICAgICAgdmFyIHRvQ29kZSA9IHRvLmNoYXJDb2RlQXQodG9TdGFydCArIGkpO1xuICAgICAgaWYgKGZyb21Db2RlICE9PSB0b0NvZGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgZWxzZSBpZiAoZnJvbUNvZGUgPT09IDQ3IC8qLyovKVxuICAgICAgICBsYXN0Q29tbW9uU2VwID0gaTtcbiAgICB9XG5cbiAgICB2YXIgb3V0ID0gJyc7XG4gICAgLy8gR2VuZXJhdGUgdGhlIHJlbGF0aXZlIHBhdGggYmFzZWQgb24gdGhlIHBhdGggZGlmZmVyZW5jZSBiZXR3ZWVuIGB0b2BcbiAgICAvLyBhbmQgYGZyb21gXG4gICAgZm9yIChpID0gZnJvbVN0YXJ0ICsgbGFzdENvbW1vblNlcCArIDE7IGkgPD0gZnJvbUVuZDsgKytpKSB7XG4gICAgICBpZiAoaSA9PT0gZnJvbUVuZCB8fCBmcm9tLmNoYXJDb2RlQXQoaSkgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgIGlmIChvdXQubGVuZ3RoID09PSAwKVxuICAgICAgICAgIG91dCArPSAnLi4nO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgb3V0ICs9ICcvLi4nO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIExhc3RseSwgYXBwZW5kIHRoZSByZXN0IG9mIHRoZSBkZXN0aW5hdGlvbiAoYHRvYCkgcGF0aCB0aGF0IGNvbWVzIGFmdGVyXG4gICAgLy8gdGhlIGNvbW1vbiBwYXRoIHBhcnRzXG4gICAgaWYgKG91dC5sZW5ndGggPiAwKVxuICAgICAgcmV0dXJuIG91dCArIHRvLnNsaWNlKHRvU3RhcnQgKyBsYXN0Q29tbW9uU2VwKTtcbiAgICBlbHNlIHtcbiAgICAgIHRvU3RhcnQgKz0gbGFzdENvbW1vblNlcDtcbiAgICAgIGlmICh0by5jaGFyQ29kZUF0KHRvU3RhcnQpID09PSA0NyAvKi8qLylcbiAgICAgICAgKyt0b1N0YXJ0O1xuICAgICAgcmV0dXJuIHRvLnNsaWNlKHRvU3RhcnQpO1xuICAgIH1cbiAgfSxcblxuICBfbWFrZUxvbmc6IGZ1bmN0aW9uIF9tYWtlTG9uZyhwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGg7XG4gIH0sXG5cbiAgZGlybmFtZTogZnVuY3Rpb24gZGlybmFtZShwYXRoKSB7XG4gICAgYXNzZXJ0UGF0aChwYXRoKTtcbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDApIHJldHVybiAnLic7XG4gICAgdmFyIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoMCk7XG4gICAgdmFyIGhhc1Jvb3QgPSBjb2RlID09PSA0NyAvKi8qLztcbiAgICB2YXIgZW5kID0gLTE7XG4gICAgdmFyIG1hdGNoZWRTbGFzaCA9IHRydWU7XG4gICAgZm9yICh2YXIgaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAxOyAtLWkpIHtcbiAgICAgIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICBpZiAoIW1hdGNoZWRTbGFzaCkge1xuICAgICAgICAgICAgZW5kID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3JcbiAgICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGVuZCA9PT0gLTEpIHJldHVybiBoYXNSb290ID8gJy8nIDogJy4nO1xuICAgIGlmIChoYXNSb290ICYmIGVuZCA9PT0gMSkgcmV0dXJuICcvLyc7XG4gICAgcmV0dXJuIHBhdGguc2xpY2UoMCwgZW5kKTtcbiAgfSxcblxuICBiYXNlbmFtZTogZnVuY3Rpb24gYmFzZW5hbWUocGF0aCwgZXh0KSB7XG4gICAgaWYgKGV4dCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBleHQgIT09ICdzdHJpbmcnKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImV4dFwiIGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcnKTtcbiAgICBhc3NlcnRQYXRoKHBhdGgpO1xuXG4gICAgdmFyIHN0YXJ0ID0gMDtcbiAgICB2YXIgZW5kID0gLTE7XG4gICAgdmFyIG1hdGNoZWRTbGFzaCA9IHRydWU7XG4gICAgdmFyIGk7XG5cbiAgICBpZiAoZXh0ICE9PSB1bmRlZmluZWQgJiYgZXh0Lmxlbmd0aCA+IDAgJiYgZXh0Lmxlbmd0aCA8PSBwYXRoLmxlbmd0aCkge1xuICAgICAgaWYgKGV4dC5sZW5ndGggPT09IHBhdGgubGVuZ3RoICYmIGV4dCA9PT0gcGF0aCkgcmV0dXJuICcnO1xuICAgICAgdmFyIGV4dElkeCA9IGV4dC5sZW5ndGggLSAxO1xuICAgICAgdmFyIGZpcnN0Tm9uU2xhc2hFbmQgPSAtMTtcbiAgICAgIGZvciAoaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjb2RlID09PSA0NyAvKi8qLykge1xuICAgICAgICAgICAgLy8gSWYgd2UgcmVhY2hlZCBhIHBhdGggc2VwYXJhdG9yIHRoYXQgd2FzIG5vdCBwYXJ0IG9mIGEgc2V0IG9mIHBhdGhcbiAgICAgICAgICAgIC8vIHNlcGFyYXRvcnMgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLCBzdG9wIG5vd1xuICAgICAgICAgICAgaWYgKCFtYXRjaGVkU2xhc2gpIHtcbiAgICAgICAgICAgICAgc3RhcnQgPSBpICsgMTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoZmlyc3ROb25TbGFzaEVuZCA9PT0gLTEpIHtcbiAgICAgICAgICAgIC8vIFdlIHNhdyB0aGUgZmlyc3Qgbm9uLXBhdGggc2VwYXJhdG9yLCByZW1lbWJlciB0aGlzIGluZGV4IGluIGNhc2VcbiAgICAgICAgICAgIC8vIHdlIG5lZWQgaXQgaWYgdGhlIGV4dGVuc2lvbiBlbmRzIHVwIG5vdCBtYXRjaGluZ1xuICAgICAgICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICAgICAgICBmaXJzdE5vblNsYXNoRW5kID0gaSArIDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChleHRJZHggPj0gMCkge1xuICAgICAgICAgICAgLy8gVHJ5IHRvIG1hdGNoIHRoZSBleHBsaWNpdCBleHRlbnNpb25cbiAgICAgICAgICAgIGlmIChjb2RlID09PSBleHQuY2hhckNvZGVBdChleHRJZHgpKSB7XG4gICAgICAgICAgICAgIGlmICgtLWV4dElkeCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBXZSBtYXRjaGVkIHRoZSBleHRlbnNpb24sIHNvIG1hcmsgdGhpcyBhcyB0aGUgZW5kIG9mIG91ciBwYXRoXG4gICAgICAgICAgICAgICAgLy8gY29tcG9uZW50XG4gICAgICAgICAgICAgICAgZW5kID0gaTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gRXh0ZW5zaW9uIGRvZXMgbm90IG1hdGNoLCBzbyBvdXIgcmVzdWx0IGlzIHRoZSBlbnRpcmUgcGF0aFxuICAgICAgICAgICAgICAvLyBjb21wb25lbnRcbiAgICAgICAgICAgICAgZXh0SWR4ID0gLTE7XG4gICAgICAgICAgICAgIGVuZCA9IGZpcnN0Tm9uU2xhc2hFbmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGFydCA9PT0gZW5kKSBlbmQgPSBmaXJzdE5vblNsYXNoRW5kO2Vsc2UgaWYgKGVuZCA9PT0gLTEpIGVuZCA9IHBhdGgubGVuZ3RoO1xuICAgICAgcmV0dXJuIHBhdGguc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgaWYgKHBhdGguY2hhckNvZGVBdChpKSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICAgIC8vIElmIHdlIHJlYWNoZWQgYSBwYXRoIHNlcGFyYXRvciB0aGF0IHdhcyBub3QgcGFydCBvZiBhIHNldCBvZiBwYXRoXG4gICAgICAgICAgICAvLyBzZXBhcmF0b3JzIGF0IHRoZSBlbmQgb2YgdGhlIHN0cmluZywgc3RvcCBub3dcbiAgICAgICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgICAgIHN0YXJ0ID0gaSArIDE7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoZW5kID09PSAtMSkge1xuICAgICAgICAgIC8vIFdlIHNhdyB0aGUgZmlyc3Qgbm9uLXBhdGggc2VwYXJhdG9yLCBtYXJrIHRoaXMgYXMgdGhlIGVuZCBvZiBvdXJcbiAgICAgICAgICAvLyBwYXRoIGNvbXBvbmVudFxuICAgICAgICAgIG1hdGNoZWRTbGFzaCA9IGZhbHNlO1xuICAgICAgICAgIGVuZCA9IGkgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChlbmQgPT09IC0xKSByZXR1cm4gJyc7XG4gICAgICByZXR1cm4gcGF0aC5zbGljZShzdGFydCwgZW5kKTtcbiAgICB9XG4gIH0sXG5cbiAgZXh0bmFtZTogZnVuY3Rpb24gZXh0bmFtZShwYXRoKSB7XG4gICAgYXNzZXJ0UGF0aChwYXRoKTtcbiAgICB2YXIgc3RhcnREb3QgPSAtMTtcbiAgICB2YXIgc3RhcnRQYXJ0ID0gMDtcbiAgICB2YXIgZW5kID0gLTE7XG4gICAgdmFyIG1hdGNoZWRTbGFzaCA9IHRydWU7XG4gICAgLy8gVHJhY2sgdGhlIHN0YXRlIG9mIGNoYXJhY3RlcnMgKGlmIGFueSkgd2Ugc2VlIGJlZm9yZSBvdXIgZmlyc3QgZG90IGFuZFxuICAgIC8vIGFmdGVyIGFueSBwYXRoIHNlcGFyYXRvciB3ZSBmaW5kXG4gICAgdmFyIHByZURvdFN0YXRlID0gMDtcbiAgICBmb3IgKHZhciBpID0gcGF0aC5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgdmFyIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICAvLyBJZiB3ZSByZWFjaGVkIGEgcGF0aCBzZXBhcmF0b3IgdGhhdCB3YXMgbm90IHBhcnQgb2YgYSBzZXQgb2YgcGF0aFxuICAgICAgICAgIC8vIHNlcGFyYXRvcnMgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLCBzdG9wIG5vd1xuICAgICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgICBzdGFydFBhcnQgPSBpICsgMTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgaWYgKGVuZCA9PT0gLTEpIHtcbiAgICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3IsIG1hcmsgdGhpcyBhcyB0aGUgZW5kIG9mIG91clxuICAgICAgICAvLyBleHRlbnNpb25cbiAgICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICAgIGVuZCA9IGkgKyAxO1xuICAgICAgfVxuICAgICAgaWYgKGNvZGUgPT09IDQ2IC8qLiovKSB7XG4gICAgICAgICAgLy8gSWYgdGhpcyBpcyBvdXIgZmlyc3QgZG90LCBtYXJrIGl0IGFzIHRoZSBzdGFydCBvZiBvdXIgZXh0ZW5zaW9uXG4gICAgICAgICAgaWYgKHN0YXJ0RG90ID09PSAtMSlcbiAgICAgICAgICAgIHN0YXJ0RG90ID0gaTtcbiAgICAgICAgICBlbHNlIGlmIChwcmVEb3RTdGF0ZSAhPT0gMSlcbiAgICAgICAgICAgIHByZURvdFN0YXRlID0gMTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhcnREb3QgIT09IC0xKSB7XG4gICAgICAgIC8vIFdlIHNhdyBhIG5vbi1kb3QgYW5kIG5vbi1wYXRoIHNlcGFyYXRvciBiZWZvcmUgb3VyIGRvdCwgc28gd2Ugc2hvdWxkXG4gICAgICAgIC8vIGhhdmUgYSBnb29kIGNoYW5jZSBhdCBoYXZpbmcgYSBub24tZW1wdHkgZXh0ZW5zaW9uXG4gICAgICAgIHByZURvdFN0YXRlID0gLTE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0RG90ID09PSAtMSB8fCBlbmQgPT09IC0xIHx8XG4gICAgICAgIC8vIFdlIHNhdyBhIG5vbi1kb3QgY2hhcmFjdGVyIGltbWVkaWF0ZWx5IGJlZm9yZSB0aGUgZG90XG4gICAgICAgIHByZURvdFN0YXRlID09PSAwIHx8XG4gICAgICAgIC8vIFRoZSAocmlnaHQtbW9zdCkgdHJpbW1lZCBwYXRoIGNvbXBvbmVudCBpcyBleGFjdGx5ICcuLidcbiAgICAgICAgcHJlRG90U3RhdGUgPT09IDEgJiYgc3RhcnREb3QgPT09IGVuZCAtIDEgJiYgc3RhcnREb3QgPT09IHN0YXJ0UGFydCArIDEpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgcmV0dXJuIHBhdGguc2xpY2Uoc3RhcnREb3QsIGVuZCk7XG4gIH0sXG5cbiAgZm9ybWF0OiBmdW5jdGlvbiBmb3JtYXQocGF0aE9iamVjdCkge1xuICAgIGlmIChwYXRoT2JqZWN0ID09PSBudWxsIHx8IHR5cGVvZiBwYXRoT2JqZWN0ICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwicGF0aE9iamVjdFwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBPYmplY3QuIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBwYXRoT2JqZWN0KTtcbiAgICB9XG4gICAgcmV0dXJuIF9mb3JtYXQoJy8nLCBwYXRoT2JqZWN0KTtcbiAgfSxcblxuICBwYXJzZTogZnVuY3Rpb24gcGFyc2UocGF0aCkge1xuICAgIGFzc2VydFBhdGgocGF0aCk7XG5cbiAgICB2YXIgcmV0ID0geyByb290OiAnJywgZGlyOiAnJywgYmFzZTogJycsIGV4dDogJycsIG5hbWU6ICcnIH07XG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSByZXR1cm4gcmV0O1xuICAgIHZhciBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KDApO1xuICAgIHZhciBpc0Fic29sdXRlID0gY29kZSA9PT0gNDcgLyovKi87XG4gICAgdmFyIHN0YXJ0O1xuICAgIGlmIChpc0Fic29sdXRlKSB7XG4gICAgICByZXQucm9vdCA9ICcvJztcbiAgICAgIHN0YXJ0ID0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cbiAgICB2YXIgc3RhcnREb3QgPSAtMTtcbiAgICB2YXIgc3RhcnRQYXJ0ID0gMDtcbiAgICB2YXIgZW5kID0gLTE7XG4gICAgdmFyIG1hdGNoZWRTbGFzaCA9IHRydWU7XG4gICAgdmFyIGkgPSBwYXRoLmxlbmd0aCAtIDE7XG5cbiAgICAvLyBUcmFjayB0aGUgc3RhdGUgb2YgY2hhcmFjdGVycyAoaWYgYW55KSB3ZSBzZWUgYmVmb3JlIG91ciBmaXJzdCBkb3QgYW5kXG4gICAgLy8gYWZ0ZXIgYW55IHBhdGggc2VwYXJhdG9yIHdlIGZpbmRcbiAgICB2YXIgcHJlRG90U3RhdGUgPSAwO1xuXG4gICAgLy8gR2V0IG5vbi1kaXIgaW5mb1xuICAgIGZvciAoOyBpID49IHN0YXJ0OyAtLWkpIHtcbiAgICAgIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICAvLyBJZiB3ZSByZWFjaGVkIGEgcGF0aCBzZXBhcmF0b3IgdGhhdCB3YXMgbm90IHBhcnQgb2YgYSBzZXQgb2YgcGF0aFxuICAgICAgICAgIC8vIHNlcGFyYXRvcnMgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLCBzdG9wIG5vd1xuICAgICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgICBzdGFydFBhcnQgPSBpICsgMTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgaWYgKGVuZCA9PT0gLTEpIHtcbiAgICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3IsIG1hcmsgdGhpcyBhcyB0aGUgZW5kIG9mIG91clxuICAgICAgICAvLyBleHRlbnNpb25cbiAgICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICAgIGVuZCA9IGkgKyAxO1xuICAgICAgfVxuICAgICAgaWYgKGNvZGUgPT09IDQ2IC8qLiovKSB7XG4gICAgICAgICAgLy8gSWYgdGhpcyBpcyBvdXIgZmlyc3QgZG90LCBtYXJrIGl0IGFzIHRoZSBzdGFydCBvZiBvdXIgZXh0ZW5zaW9uXG4gICAgICAgICAgaWYgKHN0YXJ0RG90ID09PSAtMSkgc3RhcnREb3QgPSBpO2Vsc2UgaWYgKHByZURvdFN0YXRlICE9PSAxKSBwcmVEb3RTdGF0ZSA9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RhcnREb3QgIT09IC0xKSB7XG4gICAgICAgIC8vIFdlIHNhdyBhIG5vbi1kb3QgYW5kIG5vbi1wYXRoIHNlcGFyYXRvciBiZWZvcmUgb3VyIGRvdCwgc28gd2Ugc2hvdWxkXG4gICAgICAgIC8vIGhhdmUgYSBnb29kIGNoYW5jZSBhdCBoYXZpbmcgYSBub24tZW1wdHkgZXh0ZW5zaW9uXG4gICAgICAgIHByZURvdFN0YXRlID0gLTE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0RG90ID09PSAtMSB8fCBlbmQgPT09IC0xIHx8XG4gICAgLy8gV2Ugc2F3IGEgbm9uLWRvdCBjaGFyYWN0ZXIgaW1tZWRpYXRlbHkgYmVmb3JlIHRoZSBkb3RcbiAgICBwcmVEb3RTdGF0ZSA9PT0gMCB8fFxuICAgIC8vIFRoZSAocmlnaHQtbW9zdCkgdHJpbW1lZCBwYXRoIGNvbXBvbmVudCBpcyBleGFjdGx5ICcuLidcbiAgICBwcmVEb3RTdGF0ZSA9PT0gMSAmJiBzdGFydERvdCA9PT0gZW5kIC0gMSAmJiBzdGFydERvdCA9PT0gc3RhcnRQYXJ0ICsgMSkge1xuICAgICAgaWYgKGVuZCAhPT0gLTEpIHtcbiAgICAgICAgaWYgKHN0YXJ0UGFydCA9PT0gMCAmJiBpc0Fic29sdXRlKSByZXQuYmFzZSA9IHJldC5uYW1lID0gcGF0aC5zbGljZSgxLCBlbmQpO2Vsc2UgcmV0LmJhc2UgPSByZXQubmFtZSA9IHBhdGguc2xpY2Uoc3RhcnRQYXJ0LCBlbmQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc3RhcnRQYXJ0ID09PSAwICYmIGlzQWJzb2x1dGUpIHtcbiAgICAgICAgcmV0Lm5hbWUgPSBwYXRoLnNsaWNlKDEsIHN0YXJ0RG90KTtcbiAgICAgICAgcmV0LmJhc2UgPSBwYXRoLnNsaWNlKDEsIGVuZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXQubmFtZSA9IHBhdGguc2xpY2Uoc3RhcnRQYXJ0LCBzdGFydERvdCk7XG4gICAgICAgIHJldC5iYXNlID0gcGF0aC5zbGljZShzdGFydFBhcnQsIGVuZCk7XG4gICAgICB9XG4gICAgICByZXQuZXh0ID0gcGF0aC5zbGljZShzdGFydERvdCwgZW5kKTtcbiAgICB9XG5cbiAgICBpZiAoc3RhcnRQYXJ0ID4gMCkgcmV0LmRpciA9IHBhdGguc2xpY2UoMCwgc3RhcnRQYXJ0IC0gMSk7ZWxzZSBpZiAoaXNBYnNvbHV0ZSkgcmV0LmRpciA9ICcvJztcblxuICAgIHJldHVybiByZXQ7XG4gIH0sXG5cbiAgc2VwOiAnLycsXG4gIGRlbGltaXRlcjogJzonLFxuICB3aW4zMjogbnVsbCxcbiAgcG9zaXg6IG51bGxcbn07XG5cbnBvc2l4LnBvc2l4ID0gcG9zaXg7XG5cbm1vZHVsZS5leHBvcnRzID0gcG9zaXg7XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIl19
