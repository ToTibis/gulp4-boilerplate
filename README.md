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
 $ gulp
 ```
For **production** mode run command:
 ```sh
 $ gulp build
 ```

## In this boilerplate you can use:

### HTML:
Processing using [Pug.js](https://github.com/pugjs/pug):
- components - for static (in which the data does not change) reusable components;
- layout - reusable layouts. [See more](https://pugjs.org/language/inheritance.html);
- mixins - reusable components that take some parameters. [See more](https://pugjs.org/language/mixins.html);
- pages - all pages of project - home, about, contacts e.t.c.


### CSS:
Processing using [Sass](https://sass-lang.com/), syntax is scss.
- animations - css animations based on [Animate.css](https://animate.style/);
- bootstrap - used just grid and reboot. Also used set of utilities - text, spacing, display, flex;
- components - for ui-elements like modal, tooltips, select e.t.c.
- utilities - some utilities like variables, mixins e.t.c.
- common and libs - for custom styles and import libraries.

### Javascript:
You can use Javascript ES6 modules as template uses [Webpack 4](https://webpack.js.org/) to handle Javascript.
I stopped using jquery because this tool is cumbersome, outdated and part of the functionality is already implemented native.

I wrote my own "bicycle" :) - a library of helpers for working with DOM, events, styles. It works in all modern browsers and IE10+. 
The helper library is written in a functional style and uses revealing module pattern.

####The following sources were used to write it:
- [The Vanilla JS Toolkit](https://vanillajstoolkit.com/) - A collection of JavaScript methods, helper functions, plugins, boilerplates, polyfills, and learning resources;
- [plain.js](https://plainjs.com/javascript/) - Vanilla JavaScript for building powerful web applications;
- [Events](https://github.com/cferdinandi/events) - Event delegation helper library;
- [Tocca.js](https://github.com/GianlucaGuarini/Tocca.js/) - Script to detect via Javascript events like 'tap' 'longtap' 'dbltap' 'swipeup' 'swipedown' 'swipeleft' 'swiperight' on any kind of device.

####The following plugins are used in the js-component of the boilerplate:
- [is.js](https://github.com/arasatasaygin/is.js) - multi-purpose check library.
- [svgxuse](https://github.com/Keyamoon/svgxuse) - simple polyfill that fetches external SVGs referenced in <use> elements when the browser itself fails to do so.

*Of course, you can remove my "bicycle", include jQuery and use it as you like.*

### All helpers are divided into the following modules:

#### **$data**:
- deepAssign(Object, Object, ....) - deep merge two or more objects into the first. Returns Object.

#### **$dom**:
- **get(selector: String; context: String or Element or undefined)** - search of Element by provided selector in a given context. Returns Element;
- **getAll(selector: String; context: String or Element or undefined)** - search of Elements by provided selector in a given context. Returns array of Elements;
- **each(collection: Array of Elements; callback: Function)** - at each iteration supplies a separate item and item index to callback. Returns provided collection;
- **callAll(target: Array of Elements or String or Element; callback: Function, context: String, Element - by default is document)** - similar to "each" method, but this method can accept as first argument almost any value - like as String (method convert String to Array of Elements with used method "getAll"), Element, Array of Elements, Document. If the argument "target" is a String, then the third argument can be used as the context for searching elements by provided selector (target in that case). At each iteration this method supplies a separate item to callback. Returns target;
- **addClass(target: Array of Elements or String or Element; className: String)** - add the class to specified target, under-the-hood works "callAll" method. "className" can be transmitted in the following ways - `'newClassName newClassName'` or `'newClassName, newClassName'` or `["newClassName", "newClassName"]`. Returns target;
- **removeClass(target: Array of Elements or String or Element; className: String)** - similar to "addClass" method, but the class is removed. Returns target;
- **hasClass(element: Element; className: String)** - checks if an element has the specified class. Returns Boolean;
- **toggleClass(target: Array of Elements or String or Element; className: String)** - if the specified class (classes) is present - removes them, otherwise - adds. "className" can be transmitted in the following ways - `'newClassName newClassName'` or `'newClassName, newClassName'` or `["newClassName", "newClassName"]`. Returns target;
- **getParent(element: Element, selector: String - by default is null)** - returns the parent of the specified element. If selector provided, then method returns parent which matches the specified selector, otherwise method returns closest parent `(element.parentNode)`. Returns Element or null;
- **attr(target: Array of Elements or String or Element; property: String or Object; value: String - by default is null)** - if the second argument (property) is passed and it is a String and the third argument (value) is null, then method will return the value of the passed attribute;
    if the property is an object and value is null, then method will set each attribute and its value passed by a key-value pair, for example:

    ```$dom.attr('.section', {dataCounter: '1', title: 'Example title'})```
 
    if value argument passed, then method set property and value, example:

    ```$dom.attr('.section', 'data-counter', '1')```

    if method set property, then method will return target, otherwise: if target is single element - method will return property value, if target is Array - method will return an Array with objects, each object has two elements - an element and the value of the required attribute;
- **html(target: Array of Elements or String or Element; newHtml: content that should be parsed as html)** - if no second argument(newHtml) is passed, the method will return target.innerHTML, if target it is Array - the method will return an Array with objects, each object has two elements - element and html; if the second argument is passed, the method will set a new innerHTML to each target. If newHTML passed method will return target, otherwise method will return innerHTML or Array of results;
- **text(target: Array of Elements or String or Element; newText: content that should be parsed as text)** - similar to html method, but works with textContent;
- **createElement(tagName: String; attrs: Object - by default is null; isSVG: Boolean - by default is false)** - create new Element. If an "attrs" is passed, the method sets the specified attributes and their values to the created Element. If isSVG is true, then will be created SVG Element. Returns Element;
- **replace(element: Element; newElement: Element)** - remove an element from the DOM tree and insert a new one in its place. Returns new Element;
- **wrap(element: Element; wrapperElement: Element)** - wrap a given element in a new container element. Returns wrapper Element;
- **remove(target: Array of Elements or String or Element)** - remove an element from the DOM tree;
- **insertAfter(element: Element or String; insertTarget: Element or String)** - insert an element after an insertTarget in the DOM tree. Returns Element;
- **insertBefore(element: Element or String; insertTarget: Element or String)** - insert an element before an insertTarget in the DOM tree. Returns Element;
- **append(appendTarget: Element or String; element: Element or String)** - append an element to the end of appendTarget content. Returns Element;
- **prepend(prependTarget: Element or String; element: Element or String)** - append an element to the beginning of prependTarget content. Returns Element;
- **clone(element: Element)** - create a deep copy of an element. Returns Element;
- **ready(callback: Function)** - is the equivalent of jQuery's `$(document).ready()` method.
- **onResize(callback: Function)** - an optimized version of the resize event. Depending on the device: on mobile - the callback is called after changing the screen orientation, on others - after changing the window size. The default callback debounce is 100 milliseconds (can be changed in the `js/variables.js`);
- **touchConfigure(Object or undefined)** - configure the touch support. If undefined - returns defaults options.
    Defaults options: 
    ```
    {
        swipeThreshold:   100,
        tapThreshold:     150,   // range of time where a tap event could be detected
        dbltapThreshold:  200,   // delay needed to detect a double tap
        longtapThreshold: 1000,  // delay needed to detect a long tap
        tapPrecision:     30,    // touch events boundaries
    }
    ```

#### **$events**:
- **add(types: String or Array; target: Array of Elements or String or Element; callback: Function; options: Object)** - add event listeners to target. "Types" can be transmitted in the following ways - `'click touch'` or `'click, touch, mouseenter'` or `["mouseenter", "swipeLeft"]`. `this` in callback is target element(if you don't use arrow function). This method delivers to the callback event. "Options" - is a native addEventListener options object(like capture, once, passive); that is, if you want to call the listener once - you must specify it like this `$events.add('tap click swipeRight', 'h1', log, {once: true});`;
- **remove(types: String or Array; target: Array of Elements or String or Element; callback: Function)** - removes event handlers of the specified types;
- **emit(type: String; element: Element, by default is Window; detail: Object)** - emit a custom event, example `$events.emit('resize-done', document.body, {originalEvent: event});`
##### **$events.delegate**:
Event bubbling is an approach to listening for events that’s better for performance and gives you a bit more flexibility.
Instead of adding event listeners to specific elements, you listen to all events on a parent element (often the document or window). Events within that element “bubble up,” and you can check to see if the element that triggered the event (the event.target) matches the selector you really care about.

**Attention!** Using the following methods does not work with the following events: *blur, error, focus, mouseenter, mouseleave, scroll* - to handle these events use "add" and "remove" methods.
- **on(types: String or Array; target: String or Element; callback: Function)** - add event listeners to target, target can be only String or Element. "Types" can be transmitted in the following ways - `'click touch'` or `'click, touch, mouseenter'` or `["mouseenter", "swipeLeft"]`. `this` in callback is target element(if you don't use arrow function);
- **off(types: String or Array; target: String or Element; callback: Function)** - removes event handlers of the specified types;
- **once(types: String or Array; target: String or Element; callback: Function)** - adds an event handler, which is removed after one trigger;
- **list** - getter, get an immutable copy of all active event listeners;

#### **$style**:
- **get(element: String or Element; property: String - by default is undefined; clean: Boolean - by default is false)** - if property is undefined method will return `getComputedStyle` of element, otherwise method will return value  of the specified property. If "clean" is true - method will return clean number, example `$style.get('h1', 'font-size', true)` will return 22.755, but not '22.755px'. Returns String or Number;
- **set(target: Array of Elements or String or Element; property: String or Object; value: String - by default is null)** - sets the specified styles. If the property is an object and value is null, then method will set each property and its value passed by a key-value pair, for example `$style.set('h1', {fontSize: '50px', color: 'red'})`; if value argument passed, then method set property and value, example `$style.set('h1', 'font-size', '50px')`. Return Element or Array of Elements;
- **remove(target: Array of Elements or String or Element; property: String or Array)** - removes the specified properties from the element. Properties can be transmitted in the following ways - `'font-size color'` or `'font-size, color'` or `["font-size", "color"]`. Example `$style.remove('.section', 'font-size, color')`. Return Element or Array of Elements;
- **animate(element: Element or String; animationName: String; options: Object)** - method for animation uses css-animations(`@keyframes`) respectively as "animationName" parameter can be use classes such as `fadeIn, fadeOut, zoomIn` e.t.c. The default options object looks like this `{onComplete: null, animateInitClassName: 'animated', hideOnEnd: false}` - onComplete is Function - provide target element as argument, animateInitClassName is String - default is `animated`, hideOnEnd is Boolean - hide element after animation end;
- **animateChain(animationsArray: Array; options: Object)** - execution of animations sequentially, in a chain. Target for this method is Array with objects inside, object looks like this - `{element: $dom.get('#wrapper'), animationName: 'fadeIn', callback: elem => console.log(elem)}`; The default options object looks like this `{onComplete: null, hideOnStart: true}` - onComplete is Function - provide target Array of elements as argument, hideOnStart - is Boolean, true by default - hide element before separate animation start;
- **slideUp(target: Array of Elements or String or Element; options: Object)** - is the equivalent of jQuery's `.slideUp()` method. Hide the target with a sliding motion. The default options object looks like this `{duration: 500, callback: null}` - duration - animation duration in milliseconds, callback is Function - provide target element as argument;
- **slideDown(target: Array of Elements or String or Element; options: Object)** - is the equivalent of jQuery's `.slideDown()`method. Similar to "slideUp" method, but displays an element;
- **slideToggle(target: Array of Elements or String or Element; options: Object)** - toggles the visibility of an element. The default options object looks like this `{duration: 500, onDown: null, onUp: null}` - duration - animation duration in milliseconds, onDown - Function - called when the element is shown, onUp - Function - called when the element is hide;
- **offset(element: Element or String; relativeTo: String - can be only two values: "document"(by default) or "parent" )** - is the equivalent of jQuery's `.offset()`. Returns Object, example `{left: number, top: number}`. If "relativeTo" parameter not provide - returns coordinates relative to the document, If "relativeTo" equal "parent", then returns coordinates relative to the `offsetParent`;


    






