import {warn, toDashesCase, isElement, isNode, filterStringArgs, optimizeTarget} from "./_utilities";
import is from "is_js";

export const $dom = (function () {

  const
    localAPIs = {},
    defineContext = context => {

      let value = null;

      if (is.string(context)) {
        value = document.querySelector(context);
      } else if (is.domNode(context)) {
        value = context
      } else if (is.undefined(context) || is.null(context)) {

        value = document
      }

      if (value === null) warn(`The DOM-context for finding an element is not defined, context is specified as "${context}"`, '$dom-helper');

      return value;
    },
    doWithClass = (target, className, action = '') => {

      className = filterStringArgs(className);

      localAPIs.each(className, name => localAPIs.callAll(target, el => el.classList[action](name)));

      return optimizeTarget(target)
    },
    doWithInnerContent = (target, options) => {
      let results = [], setMode = is.not.null(options.newContent);

      localAPIs.callAll(target, element => {

        if (is.null(options.newContent)) {
          results.push({ element, [options.resultKey]: element[options.resultMethod]});
        } else {
          element[options.resultMethod] = options.newContent;
        }
      });

      if (results.length === 0) {
        results = null
      } else if (results.length === 1) {
        results = results[0][options.resultKey]
      }



      return setMode ? optimizeTarget(target) : results;
    },
    doWithInsert = (element, insertTarget, position) => {

      if (!element || !insertTarget) return;

      if (is.string(element)) element = localAPIs.get(element);
      if (is.string(insertTarget)) insertTarget = localAPIs.get(insertTarget);

      let insertTargetElement;

      switch (position) {
        case 'after':
          insertTargetElement = insertTarget.nextSibling;
          break;
        case 'before':
          insertTargetElement = insertTarget;
          break;
      }

      insertTarget.parentNode.insertBefore(element, insertTargetElement);
      return element;
    },
    doWithAppend = (target, element, position) => {

      if (!element || !target) return;

      if (is.string(element)) element = localAPIs.get(element);
      if (is.string(target)) target = localAPIs.get(target);

      switch (position) {
        case 'start':
          target.insertBefore(element, target.childNodes[0] || null);
          break;
        case 'end':
          target.insertBefore(element, null);
          break;
      }
      return element;
    }
  ;

  localAPIs.get = function (selector, context) {

    context = defineContext(context);

    let target = null;

    try {
      target = context.querySelector(selector);
    } catch (e) {
      warn(`Could not find element by selector "${selector}" within context "${context}". A description of the original error follows`, e);
    }

    if (!isElement(target)) warn(`Method "get" - element by selector "${selector}" not found`, '$dom-helper');

    return target;
  };

  localAPIs.getAll = function (selector, context) {

    context = defineContext(context);

    let target = [];

    try {
      target = Array.prototype.slice.call(context.querySelectorAll(selector))
    } catch (e) {
      warn(`Failed to execute array of elements by selector "${selector}" within context "${context}"". A description of the original error follows`, e);
    }

    if (target.length === 0) warn(`Method "getAll" - array of elements by selector "${selector}" is empty`, '$dom-helper');

    return target;
  };

  localAPIs.each = function(collection, callback) {

    if (is.not.array(collection) || collection.length === 0) {
      warn('Method each - collection is not a array or array is empty', '$dom-helper');
      return;
    }

    if (is.not.function(callback)) {
      warn('Method each - callback is not a function', '$dom-helper');
      return;
    }

    let l = collection.length;
    for (let i = 0; i < l; i++) callback.call(collection[i], collection[i], i);

    return collection;
  };

  localAPIs.callAll = function(target, callback, context = document) {


    if (isElement(target) || isNode(target) || target === window) {
      callback(target);

      return target
    }

    if (is.string(target)) target = localAPIs.getAll(target, defineContext(context));

    if (is.array(target) && target.length > 0) {
      localAPIs.each(target, callback);

      return target;
    }


    return null;
  };

  localAPIs.addClass = (target, className) => doWithClass(target, className, 'add');

  localAPIs.removeClass = (target, className) => doWithClass(target, className, 'remove');

  localAPIs.hasClass = (element, className) => element.classList.contains(className);

  localAPIs.toggleClass = (target, className) => doWithClass(target, className, 'toggle');

  localAPIs.getParent = function(element, selector = null) {

    if (is.not.null(selector)) {
      do {
        if (element.matches(selector)) return element;
        element = element.parentElement || element.parentNode;
      } while (element !== null && element.nodeType === 1);

    } else {
      return element.parentNode
    }

    return null;
  };

  localAPIs.attr = function(target, property, value = null) {
    let results = [], setMode = (is.string(property) && is.string(value)) || (is.object(property) && is.not.function(property));

    localAPIs.callAll(target, element => {

      if (is.string(property)) {

        if (is.null(value)) {
          results.push({ element, value: element.getAttribute(property)});
        } else if (is.string(value) || is.number(value)) {
          element.setAttribute(toDashesCase(property), value);
        }

      } else if (is.object(property) && is.not.function(property)) {
        for (let [key, value] of Object.entries(property)) element.setAttribute(toDashesCase(key), value);
      }

    });

    if (results.length === 0) {
      results = null
    } else if (results.length === 1) {
      results = results[0].value
    }

    return setMode ? optimizeTarget(target) : results;

  };

  localAPIs.html = (target, newHtml = null) => doWithInnerContent(target, {
    newContent: newHtml,
    resultKey: 'html',
    resultMethod: 'innerHTML'
  });

  localAPIs.text = (target, newText = null) => doWithInnerContent(target, {
    newContent: newText,
    resultKey: 'text',
    resultMethod: 'textContent'
  });

  localAPIs.createElement = function(tagName, attrs = null, isSVG = false) {
    if (is.not.string(tagName)) return;

    const el = isSVG
      ? document.createElementNS('http://www.w3.org/2000/svg', tagName)
      : document.createElement(tagName)
    ;

    if (attrs !== null && is.object(attrs) && is.not.array(attrs)) {
      for (let key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          el.setAttribute(isSVG ? key : toDashesCase(key), attrs[key])
        }
      }
    }
    return el
  };

  localAPIs.createElementFromString = function(string) {
    const div = document.createElement('div');
    div.innerHTML = string.trim();
    return div.firstChild;
  };

  localAPIs.replace = function(element, newElement) {
    element.parentNode.replaceChild(newElement, element);

    return newElement
  };

  localAPIs.wrap = function(element, wrapperElement) {
    element.parentNode.insertBefore(wrapperElement, element);
    wrapperElement.appendChild(element);
    return wrapperElement
  };

  localAPIs.remove = target => localAPIs.callAll(target, element => element.parentNode.removeChild(element));

  localAPIs.insertAfter = (element, insertTarget) => doWithInsert(element, insertTarget, 'after');

  localAPIs.insertBefore = (element, insertTarget) => doWithInsert(element, insertTarget, 'before');

  localAPIs.append = (appendTarget, element) => doWithAppend(appendTarget, element, 'end');

  localAPIs.prepend = (prependTarget, element) => doWithAppend(prependTarget, element, 'start');

  localAPIs.clone = element => element.cloneNode(true);

  localAPIs.ready = callback => {

    if (is.not.function(callback)) {
      warn('$dom.ready callback is not a function', '$dom-helper');
      return;
    }

    if (document.readyState === 'complete' ) callback.call(window);

    document.addEventListener( 'DOMContentLoaded', callback.bind(window), {once: true});
  };

  localAPIs.exist = (target, context = document) => {

    if (is.null(target)) return false;

    if (Boolean(context)) {

      if(is.string(context)) {
        context = document.querySelector(context)
      }

      const elToBool = t => Boolean(isElement(context.querySelector(t)));

      if (isElement(context) || isNode(context)) {
        if (is.string(target)) return elToBool(target);

        if (is.array(target) && target.length > 0) {
          return target.every(t => elToBool(t))
        }
      }

      return false;
    } else {
      warn('Context for exist-method is not defined', '$dom.exist')
    }

    return false
  };

  return localAPIs;
})();
