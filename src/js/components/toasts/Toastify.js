import {isElement, isNode} from "../../helpers/_utilities";
import {$dom} from "../../helpers/dom";
import is from 'is_js';
import {$style} from "../../helpers/style";
import variables from "../../variables";

const {
  createElementFromString
} = $dom;

(function(root, factory) {
    if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        root.Toastify = factory();
    }

})(window, function() {
    const
        Toastify = options => new Toastify.lib.init(options),
        rootClassName = 'toast',
        activeClassName = variables.classNames.active
    ;

    let adaptiveBreakpoint = null;

    Toastify.defaults = {
        oldestFirst: true,
        text: 'Текст уведомления по умолчанию',
        node: undefined,
        duration: 3000,
        selector: undefined,
        onDismiss: Function.prototype,
        destination: undefined,
        newWindow: false,
        close: false,
        gravity: `${rootClassName}-top`,
        position: '',
        icon: '',
        className: '',
        stopOnFocus: true,
        onClick: Function.prototype,
        offset: {x: 0, y: 0},
        escapeMarkup: true,
        style: {background: ''},
        breakpoint: variables.breakpoints.m
    };

    Toastify.lib = Toastify.prototype = {
        constructor: Toastify,
        init: function(options) {
            if (!options) options = {};

            this.options = {};
            this.toastElement = null;

            this.options.text = options.text || Toastify.defaults.text;
            this.options.node = options.node || Toastify.defaults.node;
            this.options.duration = options.duration === 0 ? 0 : options.duration || Toastify.defaults.duration;
            this.options.selector = options.selector || Toastify.defaults.selector;
            this.options.onDismiss = options.onDismiss || Toastify.defaults.onDismiss;
            this.options.destination = options.destination || Toastify.defaults.destination;
            this.options.newWindow = options.newWindow || Toastify.defaults.newWindow;
            this.options.close = options.close || Toastify.defaults.close;
            this.options.gravity = options.gravity === 'bottom' ? `${rootClassName}-bottom` : Toastify.defaults.gravity;
            this.options.position = options.position || Toastify.defaults.position;
            this.options.icon = options.icon || Toastify.defaults.icon;
            this.options.className = options.className || Toastify.defaults.className;
            this.options.stopOnFocus = options.stopOnFocus === undefined ? Toastify.defaults.stopOnFocus : options.stopOnFocus;
            this.options.onClick = options.onClick || Toastify.defaults.onClick;
            this.options.offset = options.offset || Toastify.defaults.offset;
            this.options.escapeMarkup = options.escapeMarkup !== undefined ? options.escapeMarkup : Toastify.defaults.escapeMarkup;
            this.options.style = options.style || Toastify.defaults.style;
            this.options.style.background = '' || options.backgroundColor;
            this.options.breakpoint = options.breakpoint || Toastify.defaults.breakpoint;

            adaptiveBreakpoint = this.options.breakpoint;

            return this;
        },


        buildToast: function() {
            if (!this.options) throw "Toastify is not initialized";
            const divElement = document.createElement('div');
            divElement.className = `${rootClassName} ${activeClassName} ` + this.options.className;

            if (Boolean(this.options.position)) {
                divElement.className += ` ${rootClassName}-` + this.options.position;
            }

            divElement.className += ' ' + this.options.gravity;

            for (let property in this.options.style) {
                if (this.options.style.hasOwnProperty(property)) {
                    divElement.style[property] = this.options.style[property];
                }
            }

            if (this.options.node && isNode(this.options.node)) {
                divElement.appendChild(this.options.node)
            } else {
                if (this.options.escapeMarkup) {
                    divElement.innerText = this.options.text;
                } else {
                    divElement.innerHTML = `<p class="${rootClassName}-text">${this.options.text}</p>`;
                }

                if (this.options.icon !== '') {

                    let iconElement = createElementFromString(this.options.icon);

                    if (!isElement(iconElement)) {
                        iconElement = document.createElement('img');
                        iconElement.src = this.options.icon;
                    }

                    iconElement.classList.add(`${rootClassName}-icon`);

                    divElement.insertAdjacentElement(
                        this.options.position === 'left' ? 'beforeend' : 'afterbegin',
                        iconElement
                    );
                }
            }

            if (this.options.close === true) {
                const closeElement = $dom.createElement('button', {
                    type: 'button',
                    class: `${rootClassName}-close`
                });

                closeElement.innerHTML = '<svg class="svg-icon"><use xlink:href="img/sprite.svg#close"></use></svg>';

                closeElement.addEventListener(
                    'click',
                    function(event) {
                        event.stopPropagation();
                        this.removeElement(this.toastElement);
                        window.clearTimeout(this.toastElement.timeOutValue);
                    }.bind(this)
                );


                const width = window.innerWidth > 0 ? window.innerWidth : screen.width;

                divElement.insertAdjacentElement(
                    this.options.position === 'left' && width > this.options.breakpoint
                        ? 'afterbegin'
                        : 'beforeend',
                    closeElement
                );
            }


            if (this.options.stopOnFocus && this.options.duration > 0) {
                const self = this;

                divElement.addEventListener(
                    'mouseover',
                    function() {window.clearTimeout(divElement.timeOutValue)}
                )

                divElement.addEventListener(
                    'mouseleave',
                    function() {
                        divElement.timeOutValue = window.setTimeout(
                            function() {self.removeElement(divElement)},
                            self.options.duration
                        )
                    }
                )
            }

            if (is.not.undefined(this.options.destination) && is.string(this.options.destination)) {
                divElement.addEventListener(
                    'click',
                    function(event) {
                        event.stopPropagation();
                        if (this.options.newWindow === true) {
                            window.open(this.options.destination, '_blank');
                        } else {
                            window.location = this.options.destination;
                        }
                    }.bind(this)
                );
            }

            if (is.function(this.options.onClick) && is.undefined(this.options.destination)) {
                divElement.addEventListener(
                    'click',
                    function(event) {
                        event.stopPropagation();
                        this.options.onClick();
                    }.bind(this)
                );
            }

            if(is.object(this.options.offset)) {

                const
                    x = getAxisOffsetAValue("x", this.options),
                    y = getAxisOffsetAValue("y", this.options),
                    xOffset = this.options.position === 'left' ? x : '-' + x,
                    yOffset = this.options.gravity === `${rootClassName}-top` ? y : '-' + y
                ;

                divElement.style.transform = `translate(${xOffset}, ${yOffset})`
            }


            return divElement;
        },


        showToast: function() {
            this.toastElement = this.buildToast();


            let rootElement;

            if (is.string(this.options.selector)) {
                rootElement = document.querySelector(this.options.selector);
            } else if (this.options.selector instanceof HTMLElement || this.options.selector instanceof ShadowRoot) {
                rootElement = this.options.selector;
            } else {
                rootElement = document.body;
            }

            if (!rootElement) throw 'Root element is not defined';

            const elementToInsert = Toastify.defaults.oldestFirst ? rootElement.firstChild : rootElement.lastChild;
            rootElement.insertBefore(this.toastElement, elementToInsert);

            Toastify.reposition();

            if (this.options.duration > 0) {
                this.toastElement.timeOutValue = window.setTimeout(
                    function() {this.removeElement(this.toastElement)}.bind(this),
                    this.options.duration
                );
            }

            return this;
        },

        hideToast: function() {
            if (this.toastElement.timeOutValue) {
                clearTimeout(this.toastElement.timeOutValue);
            }
            this.removeElement(this.toastElement);
        },


        removeElement: function(toastElement) {
            toastElement.className = toastElement.className.replace(` ${activeClassName}`, '');

            window.setTimeout(
                function() {
                    if (this.options.node && this.options.node.parentNode) {
                        this.options.node.parentNode.removeChild(this.options.node);
                    }

                    if (toastElement.parentNode) {
                        toastElement.parentNode.removeChild(toastElement);
                    }

                    this.options.onDismiss.call(toastElement);

                    Toastify.reposition();
                }.bind(this),
                ($style.get(toastElement, 'transition-duration', true) * 1000) || 0
            );
        },
    };

    Toastify.reposition = function() {

        const topLeftOffsetSize = {
            top: 15,
            bottom: 15,
        };
        const topRightOffsetSize = {
            top: 15,
            bottom: 15,
        };
        const offsetSize = {
            top: 15,
            bottom: 15,
        };

        const allToasts = document.getElementsByClassName(rootClassName);

        let classUsed;

        for (let i = 0; i < allToasts.length; i++) {

            if (containsClass(allToasts[i], `${rootClassName}-top`) === true) {
                classUsed = `${rootClassName}-top`;
            } else {
                classUsed = `${rootClassName}-bottom`;
            }

            const height = allToasts[i].offsetHeight;

            classUsed = classUsed.substr(rootClassName.length + 1, classUsed.length-1) // 9 - обрезает toastify-


            const
                toastsBetweenOffset = 15,
                width = window.innerWidth > 0 ? window.innerWidth : screen.width
            ;

            if (width <= adaptiveBreakpoint) {
                allToasts[i].style[classUsed] = offsetSize[classUsed] + 'px';
                offsetSize[classUsed] += height + toastsBetweenOffset;
            } else {
                if (containsClass(allToasts[i], `${rootClassName}-left`) === true) {
                    allToasts[i].style[classUsed] = topLeftOffsetSize[classUsed] + 'px';
                    topLeftOffsetSize[classUsed] += height + toastsBetweenOffset;
                } else {
                    allToasts[i].style[classUsed] = topRightOffsetSize[classUsed] + 'px';
                    topRightOffsetSize[classUsed] += height + toastsBetweenOffset;
                }
            }
        }

        return this;
    };

    function getAxisOffsetAValue(axis, options) {

        if(options.offset[axis]) {
            if(isNaN(options.offset[axis])) {
                return options.offset[axis];
            }
            else {
                return options.offset[axis] + 'px';
            }
        }

        return '0px';

    }

    function containsClass(elem, yourClass) {
        if (!elem || typeof yourClass !== 'string') {
            return false;
        } else return elem.className &&
            elem.className
                .trim()
                .split(/\s+/gi)
                .indexOf(yourClass) > -1;
    }

    Toastify.lib.init.prototype = Toastify.lib;

    return Toastify;
});
