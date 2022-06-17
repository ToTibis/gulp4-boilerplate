# About
This boilerplate is intended for a quick start of work for classic front-end websites. Created, maintained and used by me for over four years. Ready structure of files and directories.

Glad to save your time, enjoy!

## Usage
> Note: latest versions of **[node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/)** must be installed!
```sh
$ git clone https://github.com/ToTibis/gulp4template FOLDER_NAME
```
```sh
$ cd FOLDER_NAME
```
 ```sh
 $ npm i
 ```

For **development** mode run command:
 ```sh
 $ npm run start
 ```
For **production** mode run command:
 ```sh
 $ npm run build
 ```
And others:

|       Command     |        Description|
|:----------         |:-------------|
| $ npm run pug       |    generate html |
| $ npm run clear     |    delete public directory   |
| $ npm run scss      |    generate production version of css   |
| $ npm run js        |    generate production version of js bundle   |
| $ npm run img       |    minified images   |
| $ npm run font      |    convert fonts to popular formats   |
| $ npm run sprite    |    generate sprite of svg icons   |


## In this boilerplate you can use:

### HTML:
Processing using [Pug.js](https://github.com/pugjs/pug):
- components - for static (in which the data does not change) reusable components;
- layout - reusable layouts. [See more](https://pugjs.org/language/inheritance.html);
- mixins - reusable components that take some parameters. [See more](https://pugjs.org/language/mixins.html);
- pages - all pages of project - home, about, contacts e.t.c.


### CSS:
Processing using [Sass](https://github.com/sass/sass), scss syntax.
- base - setting root css-variables and reset default browser styles;
- components - for ui-elements like form, button, select e.t.c.
- pages - styles for different pages
- utilities - some utilities like variables, mixins, including fonts e.t.c.
- common and libs - imported there custom styles and libraries.

### Javascript:
You can use Javascript ES6 modules - Javascript is processing by [Webpack 5](https://github.com/webpack/webpack) to handle Javascript.
Everything is built on the interaction of two entities - Page and Component.

Example Component:

  ```javascript
  export default function() {
    // here your code, context is Page
    // from the context you can get, for example, Page.spritePath or Page.bootstrap.Modal

    // Be sure to return an instance of the Component class
    return new Component({
      name: 'lazyLoad', // required field

      requiredTargets: '.js-lazy-image', // required field
      // may be string 'STAND_ALONE' - if the logic of the component does not depend on DOM elements
      // or selector
      // or array of selectors

      onCreate() { 
        // here your code, context is Component, for example - 
        this.lazyInstance = null
      },
      // is always called

      onInit() {
        // here your code, context is Component, for example -
        this.lazyInstance = new LazyLoad()
      },
      // called if 'requiredTargets' is valid

      onDestroy() {
        // here your code, context is Component, for example -
        if (this.lazyInstance instanceof LazyLoad) {
            this.lazyInstance.destroy();
            this.lazyInstance = null
        }
      }
      // called if we call, for example, currentPage.components.lazyLoad.destroy()
    })
  }
  ```

Example Page:

  ```javascript

  const resizeCallback = event => {
    console.log('hello, i\'am resizeCallback, event is ', event)
  };

  const resizeRepeatCallback = event => {
    console.log('hello, i\'am resizeRepeatCallback, event is ', event)
  };

  const homePage = new Page({
    name: 'home',
    rootElementId: 'js-page-home', // required field
    onCreate() {
      // here your code, context is Page
      this.someField = null;
    },
    // is always called

    onInit() {
      // here your code, context is Page, example -

      this
          .addResizeDependentMethod(resizeCallback)
          .addResizeDependentMethod(resizeRepeatCallback)
      ;

      this.addComponent(lazyLoad); // Component lazyLoad

      setTimeout(() => {
        this
          .removeComponents('lazyLoad')
          .removeResizeDependentMethod(resizeRepeatCallback)
      }, 1000);
    },
    // called if 'rootElementId' is provided and root element found

    onDestroy() {
      // here your code, context is Page

      console.log('HomePage destroy')
    },
    // called if we call, for example, currentPage.destroy() - destroyed and all associated components!
  });
  
  export default homePage;
  ```

 

#### The following sources were used to write it:
- [The Vanilla JS Toolkit](https://vanillajstoolkit.com/) - A collection of JavaScript methods, helper functions, plugins, boilerplates, polyfills, and learning resources;
- [plain.js](https://plainjs.com/javascript/) - Vanilla JavaScript for building powerful web applications;
- [Events](https://github.com/cferdinandi/events) - Event delegation helper library;

#### The following plugins are used in the js-side of the boilerplate:
- [is.js](https://github.com/arasatasaygin/is.js) - multi-purpose check library.
- [svgxuse](https://github.com/Keyamoon/svgxuse) - simple polyfill that fetches external SVGs referenced in <use> elements when the browser itself fails to do so.
- [validator](https://github.com/yairEO/validator) - forms validation.
- [deepmerge](https://github.com/TehShrike/deepmerge) - merges the enumerable properties of two or more objects deeply.
- [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) - load images, videos and iframes to when they will enter the viewport.

*Of course, you can change the template however you like.*

### All helpers are divided into the following modules:

#### **$data**:
- merge(Object, Object, ....) - Merges the enumerable properties of two or more objects deeply. [See more]('https://github.com/TehShrike/deepmerge');
- cloneObject(Object) - clone object. Returns new Object.

#### **$dom**:
- **get(selector: String; context: String or Element or undefined)** - search of Element by provided selector in a given context. Returns Element;

  ```javascript
  const {get} = $dom;
  
  get('div'); // will return the first div on page
  get('span.error__output', '.page__wrapper') // will return the first span-element with class error__output of the parent with the selector '.page__wrapper'
  ```
  
- **getAll(selector: String; context: String or Element or undefined)** - search of Elements by provided selector in a given context. Returns array of Elements;

  ```javascript
  const {getAll} = $dom;
  
  getAll('div'); // will return all div's on page as an array
  getAll('li.list__item', 'ul.list') // will return all li-elements in ul-element with class 'list'
  ```
  
- **each(collection: Array of Elements; callback: Function)** - at each iteration supplies a separate item and item index to callback. Returns provided collection;

  ```javascript
  const {each, getAll} = $dom;
  
  each(getAll('li'), (liElem, index) => {
    // liElem - item of array
    // index - current index of loop
    // if use 'function' keyword as callback this will be item of array
  })
  ```
  
- **callAll(target: Array of Elements or String or Element; callback: Function, context: String, Element - by default is document)** - similar to "each" method, but this method can accept as first argument almost any value - like as String (method convert String to Array of Elements with used method "getAll"), Element, Array of Elements, Document. If the argument "target" is a String, then the third argument can be used as the context for searching elements by provided selector (target in that case). At each iteration this method supplies a separate item to callback. Returns target;

  ```javascript
  const {callAll} = $dom;
  
  callAll('li', liElem => {
    // liElem - item of array
  }, 'ul.list') // search an element in ul-element with class 'list'
  ```
  
- **addClass(target: Array of Elements or String or Element; className: String)** - add the class to specified target, under-the-hood works "callAll" method. "className" can be transmitted in the following ways - `'newClassName newClassName'` or `'newClassName, newClassName'` or `["newClassName", "newClassName"]`. Returns target;

  ```javascript
  const {addClass} = $dom;
  
  addClass('.title', 'is-active');
  // or
  addClass(get('.title'), 'is-active');
  // or
  addClass(getAll('li', '.list'), 'is-active');
  ```
  
- **removeClass(target: Array of Elements or String or Element; className: String)** - similar to "addClass" method, but the class is removed. Returns target;

    ```javascript
    const {removeClass} = $dom;
    
    removeClass('.title', 'is-active');
    // or
    removeClass(get('.title'), 'is-active');
    // or
    removeClass(getAll('li', '.list'), 'is-active');
    ```
  
- **hasClass(element: Element; className: String)** - checks if an element has the specified class. Returns Boolean;

  ```javascript
  const {hasClass} = $dom;
  
  hasClass(get('.list'), 'is-active')
  ```
  
- **toggleClass(target: Array of Elements or String or Element; className: String)** - if the specified class (classes) is present - removes them, otherwise - adds. "className" can be transmitted in the following ways - `'newClassName newClassName'` or `'newClassName, newClassName'` or `["newClassName", "newClassName"]`. Returns target;

  ```javascript
  const {toggleClass} = $dom;
    
  toggleClass('.title', 'is-active');
  // or
  toggleClass(get('.title'), 'is-active');
  // or
  toggleClass(getAll('li', '.list'), 'is-active');
   ```
  
- **getParent(element: Element, selector: String - by default is null)** - returns the parent of the specified element. If selector provided, then method returns parent which matches the specified selector, otherwise method returns closest parent `(element.parentNode)`. Returns Element or null;

  ```javascript
  const {getParent} = $dom;
  
  getParent(get('.title'))
  ```
     
- **attr(target: Array of Elements or String or Element; property: String or Object; value: String - by default is null)** - if the second argument (property) is passed and it is a String and the third argument (value) is null, then method will return the value of the passed attribute;
    if the property is an object and value is null, then method will set each attribute and its value passed by a key-value pair, for example:
    ```javascript
    const {attr} = $dom;
  
    attr('.section', {dataCounter: '1', title: 'Example title'})
    ```
    
    if value argument passed, then method set property and value, example:
   
    ```javascript      
    attr('.section', 'data-counter', '1')
    ```

    if method set property, then method will return target, otherwise: if target is single element - method will return property value, if target is Array - method will return an Array with objects, each object has two elements - an element and the value of the required attribute;
- **html(target: Array of Elements or String or Element; newHtml: content that should be parsed as html)** - if no second argument(newHtml) is passed, the method will return target.innerHTML, if target it is Array - the method will return an Array with objects, each object has two elements - element and html; if the second argument is passed, the method will set a new innerHTML to each target. If newHTML passed method will return target, otherwise method will return innerHTML or Array of results;

  ```javascript
  const {html} = $dom;
  
  html('.title', '<p>Text paragraph</p>');
  // or
  html(get('.title'), '<p>Text paragraph</p>');
  // or
  html(getAll('li', '.list'), '<p>Text paragraph</p>');
  ```
  
- **text(target: Array of Elements or String or Element; newText: content that should be parsed as text)** - similar to html method, but works with textContent;
  
  ```javascript
  const {text} = $dom;
    
  text('.title', 'Text example');
  // or
  text(get('.title'), 'Text example');
  // or
  text(getAll('li', '.list'), 'Text example');
  ```
  
- **createElement(tagName: String; attrs: Object - by default is null; isSVG: Boolean - by default is false)** - create new Element. If an "attrs" is passed, the method sets the specified attributes and their values to the created Element. If isSVG is true, then will be created SVG Element. Returns Element;

  ```javascript
  const {createElement} = $dom;
    
  createElement('img', {
    class: 'user__image',
    alt: 'Alternate description'
  })
  ```

- **replace(element: Element; newElement: Element)** - remove an element from the DOM tree and insert a new one in its place. Returns new Element;

  ```javascript
  const {createElement, replace, get} = $dom;
      
  replace(get('ul'), createElement('div')) // the newly created item will be replace first ul on page
  ```

- **wrap(element: Element; wrapperElement: Element)** - wrap a given element in a new container element. Returns wrapper Element;
  
  ```javascript
  const {wrap, createElement, get} = $dom;
  
  wrap(get('ul'), createElement('div', {class: 'py-5'}));
  ```
  
- **remove(target: Element or String or Array)** - remove an element from the DOM tree;
  
  ```javascript
  const {remove, get, getAll} = $dom;
  
  remove('.title');
  // or
  remove(get('.title'));
  // or
  remove(getAll('li', 'ul'));
  ```

- **insertAfter(element: Element or String; insertTarget: Element or String)** - insert an element after an insertTarget in the DOM tree. Returns Element;
  
  ```javascript
  const {insertAfter, text, createElement, get} = $dom;
  
  insertAfter(text(createElement('p'), 'Paragraph'), 'ul.row');
  // or
  insertAfter(text(createElement('p'), 'Paragraph'), get('ul.row'))
  ```

- **insertBefore(element: Element or String; insertTarget: Element or String)** - insert an element before an insertTarget in the DOM tree. Returns Element;
  
  ```javascript
  const {insertBefore, text, createElement, get} = $dom;
    
  insertBefore(text(createElement('p'), 'Paragraph'), 'ul.row');
  // or
  insertBefore(text(createElement('p'), 'Paragraph'), get('ul.row'))
  ```

- **append(appendTarget: Element or String; element: Element or String)** - append an element to the end of appendTarget content. Returns Element;
  
  ```javascript
  const {append, text, createElement, get} = $dom;
  
  append('section', text(createElement('p'), 'Paragraph'))
  ```

- **prepend(prependTarget: Element or String; element: Element or String)** - append an element to the beginning of prependTarget content. Returns Element;
  
  ```javascript
  const {prepend, text, createElement, get} = $dom;
  
  prepend('section', text(createElement('p'), 'Paragraph'))
  ```

- **clone(element: Element)** - create a deep copy of an element. Returns Element;
  
  ```javascript
  const {clone, get} = $dom;
  
  clone(get('ul'))
  ```

- **ready(callback: Function)** - is the equivalent of jQuery's `$(document).ready()` method.
  
  ```javascript
  const {ready} = $dom;
  
  ready(() => {
    // do stuff when document is ready
    // if use 'function' keyword as callback this will be 'document'
  })
  ```

#### **$events**:
- **add(types: String or Array; target: Array of Elements or String or Element; callback: Function; options: Object)** - add event listeners to target. "Types" can be transmitted in the following ways - `'click touch'` or `'click, touch, mouseenter'` or `["mouseenter", "swipeLeft"]`. `this` in callback is target element(if you don't use arrow function). This method delivers to the callback event. "Options" - is a native addEventListener options object(like capture, once, passive); that is, if you want to call the listener once - you must specify it like this `$events.add('tap click swipeRight', 'h1', log, {once: true});`;

  ```javascript
  const {add} = $events;
  const {getAll, get} = $dom;
  
  add('click', getAll('ul li'), event => {
    // event.target is current element
  });
  // or
  add('click', 'ul li', function() {
    // this is current element
  });
  // or
  add('click', get('ul li'), function() {
    // this is current element
  })
  ```
  
- **remove(types: String or Array; target: Array of Elements or String or Element; callback: Function)** - removes event handlers of the specified types;

  ```javascript
  const {remove} = $events;
  const {getAll, get} = $dom;
    
  remove('click', getAll('ul li'), event => {
    // event.target is current element
  });
  // or
  remove('click', 'ul li', function() {
    // this is current element
  });
  // or
  remove('click', get('ul li'), function() {
    // this is current element
  })
  ```
  
- **emit(type: String; detail: Object; element: Element, by default is Window;)** - emit a custom event, example `$events.emit('resize-done', document.body, {originalEvent: event});`
  
  ```javascript
  const {emit, delegate} = $events;
  
  delegate.on('some-custom-event-name', document, ({detail}) => {
    // detail.payload is a payload
  });
  
  emit('some-custom-event-name', {
    payload: 'some-payload'
  }, document)
  ```
- **resize(action: String - can be only two values: "on" or "off"; callback: Function)** an optimized version of the resize event. Depending on the device: on mobile - the callback is called after changing the screen orientation, on others - after changing the window size. The default callback debounce is 100 milliseconds (can be changed in the `js/variables.js`). Example:
  
    ```javascript
    const {resize} = $events;
  
    function byResize() {
        // do something by resize
    }
            
    resize('on', byResize);
        
    // some code ....
    
    resize('off', byResize)
    ```

#### **$events.delegate**:
Event bubbling is an approach to listening for events that’s better for performance and gives you a bit more flexibility.
Instead of adding event listeners to specific elements, you listen to all events on a parent element (often the document or window). Events within that element “bubble up,” and you can check to see if the element that triggered the event (the event.target) matches the selector you really care about.

**Attention!** Using the following methods does not work with the following events: *blur, error, focus, mouseenter, mouseleave, scroll* - to handle these events use "add" and "remove" methods.
- **on(types: String or Array; target: String or Element; callback: Function)** - add event listeners to target, target can be only String or Element. "Types" can be transmitted in the following ways - `'click touch'` or `'click, touch, mouseenter'` or `["mouseenter", "swipeLeft"]`. `this` in callback is target element(if you don't use arrow function);

  ```javascript
  const {delegate} = $events;
  const {get} = $dom;
  
  delegate.on('click', '.some-selector', event => {
    if (event.target.closest('.some-selector')) {
      // do stuff with event.target
    }
  });
  // or
  delegate.on('click', 'ul', function() {
    // if use 'function' keyword as callback this will be ul-element
  });
  //or
  delegate.on('click', get('ul'), function() {
    // if use 'function' keyword as callback this will be ul-element
  })
  ```

- **off(types: String or Array; target: String or Element; callback: Function)** - removes event handlers of the specified types;

  ```javascript
  const {delegate} = $events;
  const {get} = $dom;
    
  delegate.off('click', '.some-selector', event => {
    if (event.target.closest('.some-selector')) {
      // do stuff with event.target
    }
  });
  // or
  delegate.off('click', 'ul', function() {
    // if use 'function' keyword as callback this will be ul-element
  });
  //or
  delegate.off('click', get('ul'), function() {
    // if use 'function' keyword as callback this will be ul-element
  })
  ```

- **once(types: String or Array; target: String or Element; callback: Function)** - adds an event handler, which is removed after one trigger;

  ```javascript
  const {delegate} = $events;
  const {get} = $dom;
    
  delegate.once('click', '.some-selector', event => {
    if (event.target.closest('.some-selector')) {
      // do stuff with event.target
    }
  });
  // or
  delegate.once('click', 'ul', function() {
    // if use 'function' keyword as callback this will be ul-element
  });
  //or
  delegate.once('click', get('ul'), function() {
    // if use 'function' keyword as callback this will be ul-element
  })
  ```

- **list** - getter, get an immutable copy of all active event listeners;

  ```javascript
  const {delegate} = $events;
  
  console.log(delegate.list) // {resize: Array(1), hidden.bs.modal: Array(1), click: Array(1)}
  ```

if you need to use preventDefault - use the following to get the original event `(event.originalEvent || event).preventDefault();` or `preventDefault(event)` helper;

#### **$style**:
- **get(element: String or Element; property: String - by default is undefined; clean: Boolean - by default is false)** - if property is undefined method will return `getComputedStyle` of element, otherwise method will return value  of the specified property. If "clean" is true - method will return clean number, example `$style.get('h1', 'font-size', true)` will return `22.755`, but not `'22.755px'`. Returns String or Number;
  
  ```javascript
  const {get: domGet} = $dom;
  const {get} = $style;
  
  get(domGet('ul'));
  //or
  get('ul');
  // or
  get('ul', 'padding');
  // or
  get(domGet('ul'), 'padding'); // '0px'
  //or 
  get('ul', 'padding', true) // 0
  ```
  
- **set(target: Array of Elements or String or Element; property: String or Object; value: String - by default is null)** - sets the specified styles. If the property is an object and value is null, then method will set each property and its value passed by a key-value pair, for example `$style.set('h1', {fontSize: '50px', color: 'red'})`; if value argument passed, then method set property and value, example `$style.set('h1', 'font-size', '50px')`. Return Element or Array of Elements;

  ```javascript
  const {get: domGet, getAll: domGetAll} = $dom;
  const {set} = $style;
  
  set(domGet('ul'), 'padding-right', '15px');
  // or
  set(domGetAll('li'), 'padding-right', '15px');
  // or
  set('ul', {
    paddingRight: '15px'
  })
  ```

- **remove(target: Array of Elements or String or Element; property: String or Array)** - removes the specified properties from the element. Properties can be transmitted in the following ways - `'font-size color'` or `'font-size, color'` or `["font-size", "color"]`. Example `$style.remove('.section', 'font-size, color')`. Return Element or Array of Elements;

  ```javascript
  const {get: domGet, getAll: domGetAll} = $dom;
  const {remove} = $style;
  
  remove(domGet('ul'), 'padding-right');
  // or
  remove(domGetAll('li'), 'padding-right', '15px');
  // or
  remove('ul', ['padding-right', 'padding-left']);
  ```

- **offset(element: Element or String; relativeTo: String - can be only two values: "document"(by default) or "parent")** - is the equivalent of jQuery's `.offset()`. Returns Object, example `{left: number, top: number}`. If "relativeTo" parameter not provide - returns coordinates relative to the document, If "relativeTo" equal "parent", then returns coordinates relative to the `offsetParent`;

  ```javascript
  const {get} = $dom;
  const {offset} = $style;
  
  console.log(offset(get('ul'))) // {left: 637.5, top: 312}
  ```

#### **$ui**:
- **blockScroll(action: String)** - the action argument can be 'enable' or 'disable'. Blocks scrolling of the document.

  ```javascript
  const {blockScroll} = $ui;
  
  blockScroll('enable');
  // some code
  blockScroll('disable');
  ```






