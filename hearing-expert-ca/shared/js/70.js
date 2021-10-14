/**
 * jVectorMap version 2.0.1
 *
 * Copyright 2011-2014, Kirill Lebedev
 *
 */

(function ($) {
	var apiParams = {
		set: {
			colors: 1,
			values: 1,
			backgroundColor: 1,
			scaleColors: 1,
			normalizeFunction: 1,
			focus: 1
		},
		get: {
			selectedRegions: 1,
			selectedMarkers: 1,
			mapObject: 1,
			regionName: 1
		}
	};

	$.fn.vectorMap = function (options) {
		var map,
			methodName,
			map = this.children('.jvectormap-container').data('mapObject');

		if (options === 'addMap') {
			jvm.Map.maps[arguments[1]] = arguments[2];
		} else if ((options === 'set' || options === 'get') && apiParams[options][arguments[1]]) {
			methodName = arguments[1].charAt(0).toUpperCase() + arguments[1].substr(1);
			return map[options + methodName].apply(map, Array.prototype.slice.call(arguments, 2));
		} else {
			options = options || {};
			options.container = this;
			map = new jvm.Map(options);
		}

		return this;
	};
})(jQuery);
/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.1.9
 *
 * Requires: jQuery 1.2.2+
 */

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS style for Browserify
		module.exports = factory;
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
		toBind = ('onwheel' in document || document.documentMode >= 9) ?
			['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
		slice = Array.prototype.slice,
		nullLowestDeltaTimeout, lowestDelta;

	if ($.event.fixHooks) {
		for (var i = toFix.length; i;) {
			$.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
		}
	}

	var special = $.event.special.mousewheel = {
		version: '3.1.9',

		setup: function () {
			if (this.addEventListener) {
				for (var i = toBind.length; i;) {
					this.addEventListener(toBind[--i], handler, false);
				}
			} else {
				this.onmousewheel = handler;
			}
			// Store the line height and page height for this particular element
			$.data(this, 'mousewheel-line-height', special.getLineHeight(this));
			$.data(this, 'mousewheel-page-height', special.getPageHeight(this));
		},

		teardown: function () {
			if (this.removeEventListener) {
				for (var i = toBind.length; i;) {
					this.removeEventListener(toBind[--i], handler, false);
				}
			} else {
				this.onmousewheel = null;
			}
		},

		getLineHeight: function (elem) {
			return parseInt($(elem)['offsetParent' in $.fn ? 'offsetParent' : 'parent']().css('fontSize'), 10);
		},

		getPageHeight: function (elem) {
			return $(elem).height();
		},

		settings: {
			adjustOldDeltas: true
		}
	};

	$.fn.extend({
		mousewheel: function (fn) {
			return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
		},

		unmousewheel: function (fn) {
			return this.unbind('mousewheel', fn);
		}
	});


	function handler (event) {
		var orgEvent = event || window.event,
			args = slice.call(arguments, 1),
			delta = 0,
			deltaX = 0,
			deltaY = 0,
			absDelta = 0;
		event = $.event.fix(orgEvent);
		event.type = 'mousewheel';

		// Old school scrollwheel delta
		if ('detail' in orgEvent) { deltaY = orgEvent.detail * -1; }
		if ('wheelDelta' in orgEvent) { deltaY = orgEvent.wheelDelta; }
		if ('wheelDeltaY' in orgEvent) { deltaY = orgEvent.wheelDeltaY; }
		if ('wheelDeltaX' in orgEvent) { deltaX = orgEvent.wheelDeltaX * -1; }

		// Firefox < 17 horizontal scrolling related to DOMMouseScroll event
		if ('axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
			deltaX = deltaY * -1;
			deltaY = 0;
		}

		// Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
		delta = deltaY === 0 ? deltaX : deltaY;

		// New school wheel delta (wheel event)
		if ('deltaY' in orgEvent) {
			deltaY = orgEvent.deltaY * -1;
			delta = deltaY;
		}
		if ('deltaX' in orgEvent) {
			deltaX = orgEvent.deltaX;
			if (deltaY === 0) { delta = deltaX * -1; }
		}

		// No change actually happened, no reason to go any further
		if (deltaY === 0 && deltaX === 0) { return; }

		// Need to convert lines and pages to pixels if we aren't already in pixels
		// There are three delta modes:
		//   * deltaMode 0 is by pixels, nothing to do
		//   * deltaMode 1 is by lines
		//   * deltaMode 2 is by pages
		if (orgEvent.deltaMode === 1) {
			var lineHeight = $.data(this, 'mousewheel-line-height');
			delta *= lineHeight;
			deltaY *= lineHeight;
			deltaX *= lineHeight;
		} else if (orgEvent.deltaMode === 2) {
			var pageHeight = $.data(this, 'mousewheel-page-height');
			delta *= pageHeight;
			deltaY *= pageHeight;
			deltaX *= pageHeight;
		}

		// Store lowest absolute delta to normalize the delta values
		absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));

		if (!lowestDelta || absDelta < lowestDelta) {
			lowestDelta = absDelta;

			// Adjust older deltas if necessary
			if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
				lowestDelta /= 40;
			}
		}

		// Adjust older deltas if necessary
		if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
			// Divide all the things by 40!
			delta /= 40;
			deltaX /= 40;
			deltaY /= 40;
		}

		// Get a whole, normalized value for the deltas
		delta = Math[delta >= 1 ? 'floor' : 'ceil'](delta / lowestDelta);
		deltaX = Math[deltaX >= 1 ? 'floor' : 'ceil'](deltaX / lowestDelta);
		deltaY = Math[deltaY >= 1 ? 'floor' : 'ceil'](deltaY / lowestDelta);

		// Add information to the event object
		event.deltaX = deltaX;
		event.deltaY = deltaY;
		event.deltaFactor = lowestDelta;
		// Go ahead and set deltaMode to 0 since we converted to pixels
		// Although this is a little odd since we overwrite the deltaX/Y
		// properties with normalized deltas.
		event.deltaMode = 0;

		// Add event and delta to the front of the arguments
		args.unshift(event, delta, deltaX, deltaY);

		// Clearout lowestDelta after sometime to better
		// handle multiple device types that give different
		// a different lowestDelta
		// Ex: trackpad = 3 and mouse wheel = 120
		if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
		nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

		return ($.event.dispatch || $.event.handle).apply(this, args);
	}

	function nullLowestDelta () {
		lowestDelta = null;
	}

	function shouldAdjustOldDeltas (orgEvent, absDelta) {
		// If this is an older event and the delta is divisable by 120,
		// then we are assuming that the browser is treating this as an
		// older mouse wheel event and that we should divide the deltas
		// by 40 to try and get a more usable deltaFactor.
		// Side note, this actually impacts the reported scroll distance
		// in older browsers and can cause scrolling to be slower than native.
		// Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
		return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
	}

}));/**
   * @namespace jvm Holds core methods and classes used by jVectorMap.
   */
var jvm = {

	/**
	 * Inherits child's prototype from the parent's one.
	 * @param {Function} child
	 * @param {Function} parent
	 */
	inherits: function (child, parent) {
		function temp () { }
		temp.prototype = parent.prototype;
		child.prototype = new temp();
		child.prototype.constructor = child;
		child.parentClass = parent;
	},

	/**
	 * Mixes in methods from the source constructor to the target one.
	 * @param {Function} target
	 * @param {Function} source
	 */
	mixin: function (target, source) {
		var prop;

		for (prop in source.prototype) {
			if (source.prototype.hasOwnProperty(prop)) {
				target.prototype[prop] = source.prototype[prop];
			}
		}
	},

	min: function (values) {
		var min = Number.MAX_VALUE,
			i;

		if (values instanceof Array) {
			for (i = 0; i < values.length; i++) {
				if (values[i] < min) {
					min = values[i];
				}
			}
		} else {
			for (i in values) {
				if (values[i] < min) {
					min = values[i];
				}
			}
		}
		return min;
	},

	max: function (values) {
		var max = Number.MIN_VALUE,
			i;

		if (values instanceof Array) {
			for (i = 0; i < values.length; i++) {
				if (values[i] > max) {
					max = values[i];
				}
			}
		} else {
			for (i in values) {
				if (values[i] > max) {
					max = values[i];
				}
			}
		}
		return max;
	},

	keys: function (object) {
		var keys = [],
			key;

		for (key in object) {
			keys.push(key);
		}
		return keys;
	},

	values: function (object) {
		var values = [],
			key,
			i;

		for (i = 0; i < arguments.length; i++) {
			object = arguments[i];
			for (key in object) {
				values.push(object[key]);
			}
		}
		return values;
	},

	whenImageLoaded: function (url) {
		var deferred = new jvm.$.Deferred(),
			img = jvm.$('<img loading="lazy"/>');

		img.error(function () {
			deferred.reject();
		}).load(function () {
			deferred.resolve(img);
		});
		img.attr('src', url);

		return deferred;
	},

	isImageUrl: function (s) {
		return /\.\w{3,4}$/.test(s);
	}
};

jvm.$ = jQuery;

/**
 * indexOf polyfill for IE < 9
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
 */
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (searchElement, fromIndex) {

		var k;

		// 1. Let O be the result of calling ToObject passing
		//    the this value as the argument.
		if (this == null) {
			throw new TypeError('"this" is null or not defined');
		}

		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get
		//    internal method of O with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = O.length >>> 0;

		// 4. If len is 0, return -1.
		if (len === 0) {
			return -1;
		}

		// 5. If argument fromIndex was passed let n be
		//    ToInteger(fromIndex); else let n be 0.
		var n = +fromIndex || 0;

		if (Math.abs(n) === Infinity) {
			n = 0;
		}

		// 6. If n >= len, return -1.
		if (n >= len) {
			return -1;
		}

		// 7. If n >= 0, then Let k be n.
		// 8. Else, n<0, Let k be len - abs(n).
		//    If k is less than 0, then let k be 0.
		k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

		// 9. Repeat, while k < len
		while (k < len) {
			// a. Let Pk be ToString(k).
			//   This is implicit for LHS operands of the in operator
			// b. Let kPresent be the result of calling the
			//    HasProperty internal method of O with argument Pk.
			//   This step can be combined with c
			// c. If kPresent is true, then
			//    i.  Let elementK be the result of calling the Get
			//        internal method of O with the argument ToString(k).
			//   ii.  Let same be the result of applying the
			//        Strict Equality Comparison Algorithm to
			//        searchElement and elementK.
			//  iii.  If same is true, return k.
			if (k in O && O[k] === searchElement) {
				return k;
			}
			k++;
		}
		return -1;
	};
}/**
   * Basic wrapper for DOM element.
   * @constructor
   * @param {String} name Tag name of the element
   * @param {Object} config Set of parameters to initialize element with
   */
jvm.AbstractElement = function (name, config) {
	/**
	 * Underlying DOM element
	 * @type {DOMElement}
	 * @private
	 */
	this.node = this.createElement(name);

	/**
	 * Name of underlying element
	 * @type {String}
	 * @private
	 */
	this.name = name;

	/**
	 * Internal store of attributes
	 * @type {Object}
	 * @private
	 */
	this.properties = {};

	if (config) {
		this.set(config);
	}
};

/**
 * Set attribute of the underlying DOM element.
 * @param {String} name Name of attribute
 * @param {Number|String} config Set of parameters to initialize element with
 */
jvm.AbstractElement.prototype.set = function (property, value) {
	var key;

	if (typeof property === 'object') {
		for (key in property) {
			this.properties[key] = property[key];
			this.applyAttr(key, property[key]);
		}
	} else {
		this.properties[property] = value;
		this.applyAttr(property, value);
	}
};

/**
 * Returns value of attribute.
 * @param {String} name Name of attribute
 */
jvm.AbstractElement.prototype.get = function (property) {
	return this.properties[property];
};

/**
 * Applies attribute value to the underlying DOM element.
 * @param {String} name Name of attribute
 * @param {Number|String} config Value of attribute to apply
 * @private
 */
jvm.AbstractElement.prototype.applyAttr = function (property, value) {
	this.node.setAttribute(property, value);
};

jvm.AbstractElement.prototype.remove = function () {
	jvm.$(this.node).remove();
};/**
   * Implements abstract vector canvas.
   * @constructor
   * @param {HTMLElement} container Container to put element to.
   * @param {Number} width Width of canvas.
   * @param {Number} height Height of canvas.
   */
jvm.AbstractCanvasElement = function (container, width, height) {
	this.container = container;
	this.setSize(width, height);
	this.rootElement = new jvm[this.classPrefix + 'GroupElement']();
	this.node.appendChild(this.rootElement.node);
	this.container.appendChild(this.node);
}

/**
 * Add element to the certain group inside of the canvas.
 * @param {HTMLElement} element Element to add to canvas.
 * @param {HTMLElement} group Group to add element into or into root group if not provided.
 */
jvm.AbstractCanvasElement.prototype.add = function (element, group) {
	group = group || this.rootElement;
	group.add(element);
	element.canvas = this;
}

/**
 * Create path and add it to the canvas.
 * @param {Object} config Parameters of path to create.
 * @param {Object} style Styles of the path to create.
 * @param {HTMLElement} group Group to add path into.
 */
jvm.AbstractCanvasElement.prototype.addPath = function (config, style, group) {
	var el = new jvm[this.classPrefix + 'PathElement'](config, style);

	this.add(el, group);
	return el;
};

/**
 * Create circle and add it to the canvas.
 * @param {Object} config Parameters of path to create.
 * @param {Object} style Styles of the path to create.
 * @param {HTMLElement} group Group to add circle into.
 */
jvm.AbstractCanvasElement.prototype.addCircle = function (config, style, group) {
	var el = new jvm[this.classPrefix + 'CircleElement'](config, style);

	this.add(el, group);
	return el;
};

/**
 * Create circle and add it to the canvas.
 * @param {Object} config Parameters of path to create.
 * @param {Object} style Styles of the path to create.
 * @param {HTMLElement} group Group to add circle into.
 */
jvm.AbstractCanvasElement.prototype.addImage = function (config, style, group) {
	var el = new jvm[this.classPrefix + 'ImageElement'](config, style);

	this.add(el, group);
	return el;
};

/**
 * Create text and add it to the canvas.
 * @param {Object} config Parameters of path to create.
 * @param {Object} style Styles of the path to create.
 * @param {HTMLElement} group Group to add circle into.
 */
jvm.AbstractCanvasElement.prototype.addText = function (config, style, group) {
	var el = new jvm[this.classPrefix + 'TextElement'](config, style);

	this.add(el, group);
	return el;
};

/**
 * Add group to the another group inside of the canvas.
 * @param {HTMLElement} group Group to add circle into or root group if not provided.
 */
jvm.AbstractCanvasElement.prototype.addGroup = function (parentGroup) {
	var el = new jvm[this.classPrefix + 'GroupElement']();

	if (parentGroup) {
		parentGroup.node.appendChild(el.node);
	} else {
		this.node.appendChild(el.node);
	}
	el.canvas = this;
	return el;
};/**
   * Abstract shape element. Shape element represents some visual vector or raster object.
   * @constructor
   * @param {String} name Tag name of the element.
   * @param {Object} config Set of parameters to initialize element with.
   * @param {Object} style Object with styles to set on element initialization.
   */
jvm.AbstractShapeElement = function (name, config, style) {
	this.style = style || {};
	this.style.current = this.style.current || {};
	this.isHovered = false;
	this.isSelected = false;
	this.updateStyle();
};

/**
 * Set element's style.
 * @param {Object|String} property Could be string to set only one property or object to set several style properties at once.
 * @param {String} value Value to set in case only one property should be set.
 */
jvm.AbstractShapeElement.prototype.setStyle = function (property, value) {
	var styles = {};

	if (typeof property === 'object') {
		styles = property;
	} else {
		styles[property] = value;
	}
	jvm.$.extend(this.style.current, styles);
	this.updateStyle();
};


jvm.AbstractShapeElement.prototype.updateStyle = function () {
	var attrs = {};

	jvm.AbstractShapeElement.mergeStyles(attrs, this.style.initial);
	jvm.AbstractShapeElement.mergeStyles(attrs, this.style.current);
	if (this.isHovered) {
		jvm.AbstractShapeElement.mergeStyles(attrs, this.style.hover);
	}
	if (this.isSelected) {
		jvm.AbstractShapeElement.mergeStyles(attrs, this.style.selected);
		if (this.isHovered) {
			jvm.AbstractShapeElement.mergeStyles(attrs, this.style.selectedHover);
		}
	}
	this.set(attrs);
};

jvm.AbstractShapeElement.mergeStyles = function (styles, newStyles) {
	var key;

	newStyles = newStyles || {};
	for (key in newStyles) {
		if (newStyles[key] === null) {
			delete styles[key];
		} else {
			styles[key] = newStyles[key];
		}
	}
}/**
   * Wrapper for SVG element.
   * @constructor
   * @extends jvm.AbstractElement
   * @param {String} name Tag name of the element
   * @param {Object} config Set of parameters to initialize element with
   */

jvm.SVGElement = function (name, config) {
	jvm.SVGElement.parentClass.apply(this, arguments);
}

jvm.inherits(jvm.SVGElement, jvm.AbstractElement);

jvm.SVGElement.svgns = "http://www.w3.org/2000/svg";

/**
 * Creates DOM element.
 * @param {String} tagName Name of element
 * @private
 * @returns DOMElement
 */
jvm.SVGElement.prototype.createElement = function (tagName) {
	return document.createElementNS(jvm.SVGElement.svgns, tagName);
};

/**
 * Adds CSS class for underlying DOM element.
 * @param {String} className Name of CSS class name
 */
jvm.SVGElement.prototype.addClass = function (className) {
	this.node.setAttribute('class', className);
};

/**
 * Returns constructor for element by name prefixed with 'VML'.
 * @param {String} ctr Name of basic constructor to return
 * proper implementation for.
 * @returns Function
 * @private
 */
jvm.SVGElement.prototype.getElementCtr = function (ctr) {
	return jvm['SVG' + ctr];
};

jvm.SVGElement.prototype.getBBox = function () {
	return this.node.getBBox();
}; jvm.SVGGroupElement = function () {
	jvm.SVGGroupElement.parentClass.call(this, 'g');
}

jvm.inherits(jvm.SVGGroupElement, jvm.SVGElement);

jvm.SVGGroupElement.prototype.add = function (element) {
	this.node.appendChild(element.node);
}; jvm.SVGCanvasElement = function (container, width, height) {
	this.classPrefix = 'SVG';
	jvm.SVGCanvasElement.parentClass.call(this, 'svg');

	this.defsElement = new jvm.SVGElement('defs');
	this.node.appendChild(this.defsElement.node);

	jvm.AbstractCanvasElement.apply(this, arguments);
}

jvm.inherits(jvm.SVGCanvasElement, jvm.SVGElement);
jvm.mixin(jvm.SVGCanvasElement, jvm.AbstractCanvasElement);

jvm.SVGCanvasElement.prototype.setSize = function (width, height) {
	this.width = width;
	this.height = height;
	this.node.setAttribute('width', width);
	this.node.setAttribute('height', height);
};

jvm.SVGCanvasElement.prototype.applyTransformParams = function (scale, transX, transY) {
	this.scale = scale;
	this.transX = transX;
	this.transY = transY;
	this.rootElement.node.setAttribute('transform', 'scale(' + scale + ') translate(' + transX + ', ' + transY + ')');
}; jvm.SVGShapeElement = function (name, config, style) {
	jvm.SVGShapeElement.parentClass.call(this, name, config);
	jvm.AbstractShapeElement.apply(this, arguments);
};

jvm.inherits(jvm.SVGShapeElement, jvm.SVGElement);
jvm.mixin(jvm.SVGShapeElement, jvm.AbstractShapeElement);

jvm.SVGShapeElement.prototype.applyAttr = function (attr, value) {
	var patternEl,
		imageEl,
		that = this;

	if (attr === 'fill' && jvm.isImageUrl(value)) {
		if (!jvm.SVGShapeElement.images[value]) {
			jvm.whenImageLoaded(value).then(function (img) {
				imageEl = new jvm.SVGElement('image');
				imageEl.node.setAttributeNS('http://www.w3.org/1999/xlink', 'href', value);
				imageEl.applyAttr('x', '0');
				imageEl.applyAttr('y', '0');
				imageEl.applyAttr('width', img[0].width);
				imageEl.applyAttr('height', img[0].height);

				patternEl = new jvm.SVGElement('pattern');
				patternEl.applyAttr('id', 'image' + jvm.SVGShapeElement.imageCounter);
				patternEl.applyAttr('x', 0);
				patternEl.applyAttr('y', 0);
				patternEl.applyAttr('width', img[0].width / 2);
				patternEl.applyAttr('height', img[0].height / 2);
				patternEl.applyAttr('viewBox', '0 0 ' + img[0].width + ' ' + img[0].height);
				patternEl.applyAttr('patternUnits', 'userSpaceOnUse');
				patternEl.node.appendChild(imageEl.node);

				that.canvas.defsElement.node.appendChild(patternEl.node);

				jvm.SVGShapeElement.images[value] = jvm.SVGShapeElement.imageCounter++;

				that.applyAttr('fill', 'url(#image' + jvm.SVGShapeElement.images[value] + ')');
			});
		} else {
			this.applyAttr('fill', 'url(#image' + jvm.SVGShapeElement.images[value] + ')');
		}
	} else {
		jvm.SVGShapeElement.parentClass.prototype.applyAttr.apply(this, arguments);
	}
};

jvm.SVGShapeElement.imageCounter = 1;
jvm.SVGShapeElement.images = {}; jvm.SVGPathElement = function (config, style) {
	jvm.SVGPathElement.parentClass.call(this, 'path', config, style);
	this.node.setAttribute('fill-rule', 'evenodd');
}

jvm.inherits(jvm.SVGPathElement, jvm.SVGShapeElement); jvm.SVGCircleElement = function (config, style) {
	jvm.SVGCircleElement.parentClass.call(this, 'circle', config, style);
};

jvm.inherits(jvm.SVGCircleElement, jvm.SVGShapeElement); jvm.SVGImageElement = function (config, style) {
	jvm.SVGImageElement.parentClass.call(this, 'image', config, style);
};

jvm.inherits(jvm.SVGImageElement, jvm.SVGShapeElement);

jvm.SVGImageElement.prototype.applyAttr = function (attr, value) {
	var that = this;

	if (attr == 'image') {
		jvm.whenImageLoaded(value).then(function (img) {
			that.node.setAttributeNS('http://www.w3.org/1999/xlink', 'href', value);
			that.width = img[0].width;
			that.height = img[0].height;
			that.applyAttr('width', that.width);
			that.applyAttr('height', that.height);

			that.applyAttr('x', that.cx - that.width / 2);
			that.applyAttr('y', that.cy - that.height / 2);

			jvm.$(that.node).trigger('imageloaded', [img]);
		});
	} else if (attr == 'cx') {
		this.cx = value;
		if (this.width) {
			this.applyAttr('x', value - this.width / 2);
		}
	} else if (attr == 'cy') {
		this.cy = value;
		if (this.height) {
			this.applyAttr('y', value - this.height / 2);
		}
	} else {
		jvm.SVGImageElement.parentClass.prototype.applyAttr.apply(this, arguments);
	}
}; jvm.SVGTextElement = function (config, style) {
	jvm.SVGTextElement.parentClass.call(this, 'text', config, style);
}

jvm.inherits(jvm.SVGTextElement, jvm.SVGShapeElement);

jvm.SVGTextElement.prototype.applyAttr = function (attr, value) {
	if (attr === 'text') {
		this.node.textContent = value;
	} else {
		jvm.SVGTextElement.parentClass.prototype.applyAttr.apply(this, arguments);
	}
};/**
   * Wrapper for VML element.
   * @constructor
   * @extends jvm.AbstractElement
   * @param {String} name Tag name of the element
   * @param {Object} config Set of parameters to initialize element with
   */

jvm.VMLElement = function (name, config) {
	if (!jvm.VMLElement.VMLInitialized) {
		jvm.VMLElement.initializeVML();
	}

	jvm.VMLElement.parentClass.apply(this, arguments);
};

jvm.inherits(jvm.VMLElement, jvm.AbstractElement);

/**
 * Shows if VML was already initialized for the current document or not.
 * @static
 * @private
 * @type {Boolean}
 */
jvm.VMLElement.VMLInitialized = false;

/**
 * Initializes VML handling before creating the first element
 * (adds CSS class and creates namespace). Adds one of two forms
 * of createElement method depending of support by browser.
 * @static
 * @private
 */

// The following method of VML handling is borrowed from the
// Raphael library by Dmitry Baranovsky.

jvm.VMLElement.initializeVML = function () {
	try {
		if (!document.namespaces.rvml) {
			document.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
		}
		/**
		 * Creates DOM element.
		 * @param {String} tagName Name of element
		 * @private
		 * @returns DOMElement
		 */
		jvm.VMLElement.prototype.createElement = function (tagName) {
			return document.createElement('<rvml:' + tagName + ' class="rvml">');
		};
	} catch (e) {
		/**
		 * @private
		 */
		jvm.VMLElement.prototype.createElement = function (tagName) {
			return document.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
		};
	}
	document.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
	jvm.VMLElement.VMLInitialized = true;
};

/**
 * Returns constructor for element by name prefixed with 'VML'.
 * @param {String} ctr Name of basic constructor to return
 * proper implementation for.
 * @returns Function
 * @private
 */
jvm.VMLElement.prototype.getElementCtr = function (ctr) {
	return jvm['VML' + ctr];
};

/**
 * Adds CSS class for underlying DOM element.
 * @param {String} className Name of CSS class name
 */
jvm.VMLElement.prototype.addClass = function (className) {
	jvm.$(this.node).addClass(className);
};

/**
 * Applies attribute value to the underlying DOM element.
 * @param {String} name Name of attribute
 * @param {Number|String} config Value of attribute to apply
 * @private
 */
jvm.VMLElement.prototype.applyAttr = function (attr, value) {
	this.node[attr] = value;
};

/**
 * Returns boundary box for the element.
 * @returns {Object} Boundary box with numeric fields: x, y, width, height
 * @override
 */
jvm.VMLElement.prototype.getBBox = function () {
	var node = jvm.$(this.node);

	return {
		x: node.position().left / this.canvas.scale,
		y: node.position().top / this.canvas.scale,
		width: node.width() / this.canvas.scale,
		height: node.height() / this.canvas.scale
	};
}; jvm.VMLGroupElement = function () {
	jvm.VMLGroupElement.parentClass.call(this, 'group');

	this.node.style.left = '0px';
	this.node.style.top = '0px';
	this.node.coordorigin = "0 0";
};

jvm.inherits(jvm.VMLGroupElement, jvm.VMLElement);

jvm.VMLGroupElement.prototype.add = function (element) {
	this.node.appendChild(element.node);
}; jvm.VMLCanvasElement = function (container, width, height) {
	this.classPrefix = 'VML';
	jvm.VMLCanvasElement.parentClass.call(this, 'group');
	jvm.AbstractCanvasElement.apply(this, arguments);
	this.node.style.position = 'absolute';
};

jvm.inherits(jvm.VMLCanvasElement, jvm.VMLElement);
jvm.mixin(jvm.VMLCanvasElement, jvm.AbstractCanvasElement);

jvm.VMLCanvasElement.prototype.setSize = function (width, height) {
	var paths,
		groups,
		i,
		l;

	this.width = width;
	this.height = height;
	this.node.style.width = width + "px";
	this.node.style.height = height + "px";
	this.node.coordsize = width + ' ' + height;
	this.node.coordorigin = "0 0";
	if (this.rootElement) {
		paths = this.rootElement.node.getElementsByTagName('shape');
		for (i = 0, l = paths.length; i < l; i++) {
			paths[i].coordsize = width + ' ' + height;
			paths[i].style.width = width + 'px';
			paths[i].style.height = height + 'px';
		}
		groups = this.node.getElementsByTagName('group');
		for (i = 0, l = groups.length; i < l; i++) {
			groups[i].coordsize = width + ' ' + height;
			groups[i].style.width = width + 'px';
			groups[i].style.height = height + 'px';
		}
	}
};

jvm.VMLCanvasElement.prototype.applyTransformParams = function (scale, transX, transY) {
	this.scale = scale;
	this.transX = transX;
	this.transY = transY;
	this.rootElement.node.coordorigin = (this.width - transX - this.width / 100) + ',' + (this.height - transY - this.height / 100);
	this.rootElement.node.coordsize = this.width / scale + ',' + this.height / scale;
}; jvm.VMLShapeElement = function (name, config) {
	jvm.VMLShapeElement.parentClass.call(this, name, config);

	this.fillElement = new jvm.VMLElement('fill');
	this.strokeElement = new jvm.VMLElement('stroke');
	this.node.appendChild(this.fillElement.node);
	this.node.appendChild(this.strokeElement.node);
	this.node.stroked = false;

	jvm.AbstractShapeElement.apply(this, arguments);
};

jvm.inherits(jvm.VMLShapeElement, jvm.VMLElement);
jvm.mixin(jvm.VMLShapeElement, jvm.AbstractShapeElement);

jvm.VMLShapeElement.prototype.applyAttr = function (attr, value) {
	switch (attr) {
		case 'fill':
			this.node.fillcolor = value;
			break;
		case 'fill-opacity':
			this.fillElement.node.opacity = Math.round(value * 100) + '%';
			break;
		case 'stroke':
			if (value === 'none') {
				this.node.stroked = false;
			} else {
				this.node.stroked = true;
			}
			this.node.strokecolor = value;
			break;
		case 'stroke-opacity':
			this.strokeElement.node.opacity = Math.round(value * 100) + '%';
			break;
		case 'stroke-width':
			if (parseInt(value, 10) === 0) {
				this.node.stroked = false;
			} else {
				this.node.stroked = true;
			}
			this.node.strokeweight = value;
			break;
		case 'd':
			this.node.path = jvm.VMLPathElement.pathSvgToVml(value);
			break;
		default:
			jvm.VMLShapeElement.parentClass.prototype.applyAttr.apply(this, arguments);
	}
}; jvm.VMLPathElement = function (config, style) {
	var scale = new jvm.VMLElement('skew');

	jvm.VMLPathElement.parentClass.call(this, 'shape', config, style);

	this.node.coordorigin = "0 0";

	scale.node.on = true;
	scale.node.matrix = '0.01,0,0,0.01,0,0';
	scale.node.offset = '0,0';

	this.node.appendChild(scale.node);
};

jvm.inherits(jvm.VMLPathElement, jvm.VMLShapeElement);

jvm.VMLPathElement.prototype.applyAttr = function (attr, value) {
	if (attr === 'd') {
		this.node.path = jvm.VMLPathElement.pathSvgToVml(value);
	} else {
		jvm.VMLShapeElement.prototype.applyAttr.call(this, attr, value);
	}
};

jvm.VMLPathElement.pathSvgToVml = function (path) {
	var cx = 0, cy = 0, ctrlx, ctrly;

	path = path.replace(/(-?\d+)e(-?\d+)/g, '0');
	return path.replace(/([MmLlHhVvCcSs])\s*((?:-?\d*(?:\.\d+)?\s*,?\s*)+)/g, function (segment, letter, coords, index) {
		coords = coords.replace(/(\d)-/g, '$1,-')
			.replace(/^\s+/g, '')
			.replace(/\s+$/g, '')
			.replace(/\s+/g, ',').split(',');
		if (!coords[0]) coords.shift();
		for (var i = 0, l = coords.length; i < l; i++) {
			coords[i] = Math.round(100 * coords[i]);
		}
		switch (letter) {
			case 'm':
				cx += coords[0];
				cy += coords[1];
				return 't' + coords.join(',');
			case 'M':
				cx = coords[0];
				cy = coords[1];
				return 'm' + coords.join(',');
			case 'l':
				cx += coords[0];
				cy += coords[1];
				return 'r' + coords.join(',');
			case 'L':
				cx = coords[0];
				cy = coords[1];
				return 'l' + coords.join(',');
			case 'h':
				cx += coords[0];
				return 'r' + coords[0] + ',0';
			case 'H':
				cx = coords[0];
				return 'l' + cx + ',' + cy;
			case 'v':
				cy += coords[0];
				return 'r0,' + coords[0];
			case 'V':
				cy = coords[0];
				return 'l' + cx + ',' + cy;
			case 'c':
				ctrlx = cx + coords[coords.length - 4];
				ctrly = cy + coords[coords.length - 3];
				cx += coords[coords.length - 2];
				cy += coords[coords.length - 1];
				return 'v' + coords.join(',');
			case 'C':
				ctrlx = coords[coords.length - 4];
				ctrly = coords[coords.length - 3];
				cx = coords[coords.length - 2];
				cy = coords[coords.length - 1];
				return 'c' + coords.join(',');
			case 's':
				coords.unshift(cy - ctrly);
				coords.unshift(cx - ctrlx);
				ctrlx = cx + coords[coords.length - 4];
				ctrly = cy + coords[coords.length - 3];
				cx += coords[coords.length - 2];
				cy += coords[coords.length - 1];
				return 'v' + coords.join(',');
			case 'S':
				coords.unshift(cy + cy - ctrly);
				coords.unshift(cx + cx - ctrlx);
				ctrlx = coords[coords.length - 4];
				ctrly = coords[coords.length - 3];
				cx = coords[coords.length - 2];
				cy = coords[coords.length - 1];
				return 'c' + coords.join(',');
		}
		return '';
	}).replace(/z/g, 'e');
}; jvm.VMLCircleElement = function (config, style) {
	jvm.VMLCircleElement.parentClass.call(this, 'oval', config, style);
};

jvm.inherits(jvm.VMLCircleElement, jvm.VMLShapeElement);

jvm.VMLCircleElement.prototype.applyAttr = function (attr, value) {
	switch (attr) {
		case 'r':
			this.node.style.width = value * 2 + 'px';
			this.node.style.height = value * 2 + 'px';
			this.applyAttr('cx', this.get('cx') || 0);
			this.applyAttr('cy', this.get('cy') || 0);
			break;
		case 'cx':
			if (!value) return;
			this.node.style.left = value - (this.get('r') || 0) + 'px';
			break;
		case 'cy':
			if (!value) return;
			this.node.style.top = value - (this.get('r') || 0) + 'px';
			break;
		default:
			jvm.VMLCircleElement.parentClass.prototype.applyAttr.call(this, attr, value);
	}
};/**
   * Class for vector images manipulations.
   * @constructor
   * @param {DOMElement} container to place canvas to
   * @param {Number} width
   * @param {Number} height
   */
jvm.VectorCanvas = function (container, width, height) {
	this.mode = window.SVGAngle ? 'svg' : 'vml';

	if (this.mode == 'svg') {
		this.impl = new jvm.SVGCanvasElement(container, width, height);
	} else {
		this.impl = new jvm.VMLCanvasElement(container, width, height);
	}
	this.impl.mode = this.mode;
	return this.impl;
}; jvm.SimpleScale = function (scale) {
	this.scale = scale;
};

jvm.SimpleScale.prototype.getValue = function (value) {
	return value;
}; jvm.OrdinalScale = function (scale) {
	this.scale = scale;
};

jvm.OrdinalScale.prototype.getValue = function (value) {
	return this.scale[value];
};

jvm.OrdinalScale.prototype.getTicks = function () {
	var ticks = [],
		key;

	for (key in this.scale) {
		ticks.push({
			label: key,
			value: this.scale[key]
		});
	}

	return ticks;
}; jvm.NumericScale = function (scale, normalizeFunction, minValue, maxValue) {
	this.scale = [];

	normalizeFunction = normalizeFunction || 'linear';

	if (scale) this.setScale(scale);
	if (normalizeFunction) this.setNormalizeFunction(normalizeFunction);
	if (typeof minValue !== 'undefined') this.setMin(minValue);
	if (typeof maxValue !== 'undefined') this.setMin(maxValue);
};

jvm.NumericScale.prototype = {
	setMin: function (min) {
		this.clearMinValue = min;
		if (typeof this.normalize === 'function') {
			this.minValue = this.normalize(min);
		} else {
			this.minValue = min;
		}
	},

	setMax: function (max) {
		this.clearMaxValue = max;
		if (typeof this.normalize === 'function') {
			this.maxValue = this.normalize(max);
		} else {
			this.maxValue = max;
		}
	},

	setScale: function (scale) {
		var i;

		this.scale = [];
		for (i = 0; i < scale.length; i++) {
			this.scale[i] = [scale[i]];
		}
	},

	setNormalizeFunction: function (f) {
		if (f === 'polynomial') {
			this.normalize = function (value) {
				return Math.pow(value, 0.2);
			}
		} else if (f === 'linear') {
			delete this.normalize;
		} else {
			this.normalize = f;
		}
		this.setMin(this.clearMinValue);
		this.setMax(this.clearMaxValue);
	},

	getValue: function (value) {
		var lengthes = [],
			fullLength = 0,
			l,
			i = 0,
			c;

		if (typeof this.normalize === 'function') {
			value = this.normalize(value);
		}
		for (i = 0; i < this.scale.length - 1; i++) {
			l = this.vectorLength(this.vectorSubtract(this.scale[i + 1], this.scale[i]));
			lengthes.push(l);
			fullLength += l;
		}

		c = (this.maxValue - this.minValue) / fullLength;
		for (i = 0; i < lengthes.length; i++) {
			lengthes[i] *= c;
		}

		i = 0;
		value -= this.minValue;
		while (value - lengthes[i] >= 0) {
			value -= lengthes[i];
			i++;
		}

		if (i == this.scale.length - 1) {
			value = this.vectorToNum(this.scale[i])
		} else {
			value = (
				this.vectorToNum(
					this.vectorAdd(this.scale[i],
						this.vectorMult(
							this.vectorSubtract(this.scale[i + 1], this.scale[i]),
							(value) / (lengthes[i])
						)
					)
				)
			);
		}

		return value;
	},

	vectorToNum: function (vector) {
		var num = 0,
			i;

		for (i = 0; i < vector.length; i++) {
			num += Math.round(vector[i]) * Math.pow(256, vector.length - i - 1);
		}
		return num;
	},

	vectorSubtract: function (vector1, vector2) {
		var vector = [],
			i;

		for (i = 0; i < vector1.length; i++) {
			vector[i] = vector1[i] - vector2[i];
		}
		return vector;
	},

	vectorAdd: function (vector1, vector2) {
		var vector = [],
			i;

		for (i = 0; i < vector1.length; i++) {
			vector[i] = vector1[i] + vector2[i];
		}
		return vector;
	},

	vectorMult: function (vector, num) {
		var result = [],
			i;

		for (i = 0; i < vector.length; i++) {
			result[i] = vector[i] * num;
		}
		return result;
	},

	vectorLength: function (vector) {
		var result = 0,
			i;
		for (i = 0; i < vector.length; i++) {
			result += vector[i] * vector[i];
		}
		return Math.sqrt(result);
	},

	/* Derived from d3 implementation https://github.com/mbostock/d3/blob/master/src/scale/linear.js#L94 */
	getTicks: function () {
		var m = 5,
			extent = [this.clearMinValue, this.clearMaxValue],
			span = extent[1] - extent[0],
			step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)),
			err = m / span * step,
			ticks = [],
			tick,
			v;

		if (err <= .15) step *= 10;
		else if (err <= .35) step *= 5;
		else if (err <= .75) step *= 2;

		extent[0] = Math.floor(extent[0] / step) * step;
		extent[1] = Math.ceil(extent[1] / step) * step;

		tick = extent[0];
		while (tick <= extent[1]) {
			if (tick == extent[0]) {
				v = this.clearMinValue;
			} else if (tick == extent[1]) {
				v = this.clearMaxValue;
			} else {
				v = tick;
			}
			ticks.push({
				label: tick,
				value: this.getValue(v)
			});
			tick += step;
		}

		return ticks;
	}
};
jvm.ColorScale = function (colors, normalizeFunction, minValue, maxValue) {
	jvm.ColorScale.parentClass.apply(this, arguments);
}

jvm.inherits(jvm.ColorScale, jvm.NumericScale);

jvm.ColorScale.prototype.setScale = function (scale) {
	var i;

	for (i = 0; i < scale.length; i++) {
		this.scale[i] = jvm.ColorScale.rgbToArray(scale[i]);
	}
};

jvm.ColorScale.prototype.getValue = function (value) {
	return jvm.ColorScale.numToRgb(jvm.ColorScale.parentClass.prototype.getValue.call(this, value));
};

jvm.ColorScale.arrayToRgb = function (ar) {
	var rgb = '#',
		d,
		i;

	for (i = 0; i < ar.length; i++) {
		d = ar[i].toString(16);
		rgb += d.length == 1 ? '0' + d : d;
	}
	return rgb;
};

jvm.ColorScale.numToRgb = function (num) {
	num = num.toString(16);

	while (num.length < 6) {
		num = '0' + num;
	}

	return '#' + num;
};

jvm.ColorScale.rgbToArray = function (rgb) {
	rgb = rgb.substr(1);
	return [parseInt(rgb.substr(0, 2), 16), parseInt(rgb.substr(2, 2), 16), parseInt(rgb.substr(4, 2), 16)];
};/**
   * Represents map legend.
   * @constructor
   * @param {Object} params Configuration parameters.
   * @param {String} params.cssClass Additional CSS class to apply to legend element.
   * @param {Boolean} params.vertical If <code>true</code> legend will be rendered as vertical.
   * @param {String} params.title Legend title.
   * @param {Function} params.labelRender Method to convert series values to legend labels.
   */
jvm.Legend = function (params) {
	this.params = params || {};
	this.map = this.params.map;
	this.series = this.params.series;
	this.body = jvm.$('<div/>');
	this.body.addClass('jvectormap-legend');
	if (this.params.cssClass) {
		this.body.addClass(this.params.cssClass);
	}

	if (params.vertical) {
		this.map.legendCntVertical.append(this.body);
	} else {
		this.map.legendCntHorizontal.append(this.body);
	}

	this.render();
}

jvm.Legend.prototype.render = function () {
	var ticks = this.series.scale.getTicks(),
		i,
		inner = jvm.$('<div/>').addClass('jvectormap-legend-inner'),
		tick,
		sample,
		label;

	this.body.html('');
	if (this.params.title) {
		this.body.append(
			jvm.$('<div/>').addClass('jvectormap-legend-title').html(this.params.title)
		);
	}
	this.body.append(inner);

	for (i = 0; i < ticks.length; i++) {
		tick = jvm.$('<div/>').addClass('jvectormap-legend-tick');
		sample = jvm.$('<div/>').addClass('jvectormap-legend-tick-sample');

		switch (this.series.params.attribute) {
			case 'fill':
				if (jvm.isImageUrl(ticks[i].value)) {
					sample.css('background', 'url(' + ticks[i].value + ')');
				} else {
					sample.css('background', ticks[i].value);
				}
				break;
			case 'stroke':
				sample.css('background', ticks[i].value);
				break;
			case 'image':
				sample.css('background', 'url(' + ticks[i].value + ') no-repeat center center');
				break;
			case 'r':
				jvm.$('<div/>').css({
					'border-radius': ticks[i].value,
					border: this.map.params.markerStyle.initial['stroke-width'] + 'px ' +
						this.map.params.markerStyle.initial['stroke'] + ' solid',
					width: ticks[i].value * 2 + 'px',
					height: ticks[i].value * 2 + 'px',
					background: this.map.params.markerStyle.initial['fill']
				}).appendTo(sample);
				break;
		}
		tick.append(sample);
		label = ticks[i].label;
		if (this.params.labelRender) {
			label = this.params.labelRender(label);
		}
		tick.append(jvm.$('<div>' + label + ' </div>').addClass('jvectormap-legend-tick-text'));
		inner.append(tick);
	}
	inner.append(jvm.$('<div/>').css('clear', 'both'));
}/**
   * Creates data series.
   * @constructor
   * @param {Object} params Parameters to initialize series with.
   * @param {Array} params.values The data set to visualize.
   * @param {String} params.attribute Numberic or color attribute to use for data visualization. This could be: <code>fill</code>, <code>stroke</code>, <code>fill-opacity</code>, <code>stroke-opacity</code> for markers and regions and <code>r</code> (radius) for markers only.
   * @param {Array} params.scale Values used to map a dimension of data to a visual representation. The first value sets visualization for minimum value from the data set and the last value sets visualization for the maximum value. There also could be intermidiate values. Default value is <code>['#C8EEFF', '#0071A4']</code>
   * @param {Function|String} params.normalizeFunction The function used to map input values to the provided scale. This parameter could be provided as function or one of the strings: <code>'linear'</code> or <code>'polynomial'</code>, while <code>'linear'</code> is used by default. The function provided takes value from the data set as an input and returns corresponding value from the scale.
   * @param {Number} params.min Minimum value of the data set. Could be calculated automatically if not provided.
   * @param {Number} params.min Maximum value of the data set. Could be calculated automatically if not provided.
   */
jvm.DataSeries = function (params, elements, map) {
	var scaleConstructor;

	params = params || {};
	params.attribute = params.attribute || 'fill';

	this.elements = elements;
	this.params = params;
	this.map = map;

	if (params.attributes) {
		this.setAttributes(params.attributes);
	}

	if (jvm.$.isArray(params.scale)) {
		scaleConstructor = (params.attribute === 'fill' || params.attribute === 'stroke') ? jvm.ColorScale : jvm.NumericScale;
		this.scale = new scaleConstructor(params.scale, params.normalizeFunction, params.min, params.max);
	} else if (params.scale) {
		this.scale = new jvm.OrdinalScale(params.scale);
	} else {
		this.scale = new jvm.SimpleScale(params.scale);
	}

	this.values = params.values || {};
	this.setValues(this.values);

	if (this.params.legend) {
		this.legend = new jvm.Legend($.extend({
			map: this.map,
			series: this
		}, this.params.legend))
	}
};

jvm.DataSeries.prototype = {
	setAttributes: function (key, attr) {
		var attrs = key,
			code;

		if (typeof key == 'string') {
			if (this.elements[key]) {
				this.elements[key].setStyle(this.params.attribute, attr);
			}
		} else {
			for (code in attrs) {
				if (this.elements[code]) {
					this.elements[code].element.setStyle(this.params.attribute, attrs[code]);
				}
			}
		}
	},

	/**
	 * Set values for the data set.
	 * @param {Object} values Object which maps codes of regions or markers to values.
	 */
	setValues: function (values) {
		var max = -Number.MAX_VALUE,
			min = Number.MAX_VALUE,
			val,
			cc,
			attrs = {};

		if (!(this.scale instanceof jvm.OrdinalScale) && !(this.scale instanceof jvm.SimpleScale)) {
			// we have a color scale as an array
			if (typeof this.params.min === 'undefined' || typeof this.params.max === 'undefined') {
				// min and/or max are not defined, so calculate them
				for (cc in values) {
					val = parseFloat(values[cc]);
					if (val > max) max = val;
					if (val < min) min = val;
				}
			}

			if (typeof this.params.min === 'undefined') {
				this.scale.setMin(min);
				this.params.min = min;
			} else {
				this.scale.setMin(this.params.min);
			}

			if (typeof this.params.max === 'undefined') {
				this.scale.setMax(max);
				this.params.max = max;
			} else {
				this.scale.setMax(this.params.max);
			}

			for (cc in values) {
				if (cc != 'indexOf') {
					val = parseFloat(values[cc]);
					if (!isNaN(val)) {
						attrs[cc] = this.scale.getValue(val);
					} else {
						attrs[cc] = this.elements[cc].element.style.initial[this.params.attribute];
					}
				}
			}
		} else {
			for (cc in values) {
				if (values[cc]) {
					attrs[cc] = this.scale.getValue(values[cc]);
				} else {
					attrs[cc] = this.elements[cc].element.style.initial[this.params.attribute];
				}
			}
		}

		this.setAttributes(attrs);
		jvm.$.extend(this.values, values);
	},

	clear: function () {
		var key,
			attrs = {};

		for (key in this.values) {
			if (this.elements[key]) {
				attrs[key] = this.elements[key].element.shape.style.initial[this.params.attribute];
			}
		}
		this.setAttributes(attrs);
		this.values = {};
	},

	/**
	 * Set scale of the data series.
	 * @param {Array} scale Values representing scale.
	 */
	setScale: function (scale) {
		this.scale.setScale(scale);
		if (this.values) {
			this.setValues(this.values);
		}
	},

	/**
	 * Set normalize function of the data series.
	 * @param {Function|String} normilizeFunction.
	 */
	setNormalizeFunction: function (f) {
		this.scale.setNormalizeFunction(f);
		if (this.values) {
			this.setValues(this.values);
		}
	}
};
/**
 * Contains methods for transforming point on sphere to
 * Cartesian coordinates using various projections.
 * @class
 */
jvm.Proj = {
	degRad: 180 / Math.PI,
	radDeg: Math.PI / 180,
	radius: 6381372,

	sgn: function (n) {
		if (n > 0) {
			return 1;
		} else if (n < 0) {
			return -1;
		} else {
			return n;
		}
	},

	/**
	 * Converts point on sphere to the Cartesian coordinates using Miller projection
	 * @param {Number} lat Latitude in degrees
	 * @param {Number} lng Longitude in degrees
	 * @param {Number} c Central meridian in degrees
	 */
	mill: function (lat, lng, c) {
		return {
			x: this.radius * (lng - c) * this.radDeg,
			y: - this.radius * Math.log(Math.tan((45 + 0.4 * lat) * this.radDeg)) / 0.8
		};
	},

	/**
	 * Inverse function of mill()
	 * Converts Cartesian coordinates to point on sphere using Miller projection
	 * @param {Number} x X of point in Cartesian system as integer
	 * @param {Number} y Y of point in Cartesian system as integer
	 * @param {Number} c Central meridian in degrees
	 */
	mill_inv: function (x, y, c) {
		return {
			lat: (2.5 * Math.atan(Math.exp(0.8 * y / this.radius)) - 5 * Math.PI / 8) * this.degRad,
			lng: (c * this.radDeg + x / this.radius) * this.degRad
		};
	},

	/**
	 * Converts point on sphere to the Cartesian coordinates using Mercator projection
	 * @param {Number} lat Latitude in degrees
	 * @param {Number} lng Longitude in degrees
	 * @param {Number} c Central meridian in degrees
	 */
	merc: function (lat, lng, c) {
		return {
			x: this.radius * (lng - c) * this.radDeg,
			y: - this.radius * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360))
		};
	},

	/**
	 * Inverse function of merc()
	 * Converts Cartesian coordinates to point on sphere using Mercator projection
	 * @param {Number} x X of point in Cartesian system as integer
	 * @param {Number} y Y of point in Cartesian system as integer
	 * @param {Number} c Central meridian in degrees
	 */
	merc_inv: function (x, y, c) {
		return {
			lat: (2 * Math.atan(Math.exp(y / this.radius)) - Math.PI / 2) * this.degRad,
			lng: (c * this.radDeg + x / this.radius) * this.degRad
		};
	},

	/**
	 * Converts point on sphere to the Cartesian coordinates using Albers Equal-Area Conic
	 * projection
	 * @see <a href="http://mathworld.wolfram.com/AlbersEqual-AreaConicProjection.html">Albers Equal-Area Conic projection</a>
	 * @param {Number} lat Latitude in degrees
	 * @param {Number} lng Longitude in degrees
	 * @param {Number} c Central meridian in degrees
	 */
	aea: function (lat, lng, c) {
		var fi0 = 0,
			lambda0 = c * this.radDeg,
			fi1 = 29.5 * this.radDeg,
			fi2 = 45.5 * this.radDeg,
			fi = lat * this.radDeg,
			lambda = lng * this.radDeg,
			n = (Math.sin(fi1) + Math.sin(fi2)) / 2,
			C = Math.cos(fi1) * Math.cos(fi1) + 2 * n * Math.sin(fi1),
			theta = n * (lambda - lambda0),
			ro = Math.sqrt(C - 2 * n * Math.sin(fi)) / n,
			ro0 = Math.sqrt(C - 2 * n * Math.sin(fi0)) / n;

		return {
			x: ro * Math.sin(theta) * this.radius,
			y: - (ro0 - ro * Math.cos(theta)) * this.radius
		};
	},

	/**
	 * Converts Cartesian coordinates to the point on sphere using Albers Equal-Area Conic
	 * projection
	 * @see <a href="http://mathworld.wolfram.com/AlbersEqual-AreaConicProjection.html">Albers Equal-Area Conic projection</a>
	 * @param {Number} x X of point in Cartesian system as integer
	 * @param {Number} y Y of point in Cartesian system as integer
	 * @param {Number} c Central meridian in degrees
	 */
	aea_inv: function (xCoord, yCoord, c) {
		var x = xCoord / this.radius,
			y = yCoord / this.radius,
			fi0 = 0,
			lambda0 = c * this.radDeg,
			fi1 = 29.5 * this.radDeg,
			fi2 = 45.5 * this.radDeg,
			n = (Math.sin(fi1) + Math.sin(fi2)) / 2,
			C = Math.cos(fi1) * Math.cos(fi1) + 2 * n * Math.sin(fi1),
			ro0 = Math.sqrt(C - 2 * n * Math.sin(fi0)) / n,
			ro = Math.sqrt(x * x + (ro0 - y) * (ro0 - y)),
			theta = Math.atan(x / (ro0 - y));

		return {
			lat: (Math.asin((C - ro * ro * n * n) / (2 * n))) * this.degRad,
			lng: (lambda0 + theta / n) * this.degRad
		};
	},

	/**
	 * Converts point on sphere to the Cartesian coordinates using Lambert conformal
	 * conic projection
	 * @see <a href="http://mathworld.wolfram.com/LambertConformalConicProjection.html">Lambert Conformal Conic Projection</a>
	 * @param {Number} lat Latitude in degrees
	 * @param {Number} lng Longitude in degrees
	 * @param {Number} c Central meridian in degrees
	 */
	lcc: function (lat, lng, c) {
		var fi0 = 0,
			lambda0 = c * this.radDeg,
			lambda = lng * this.radDeg,
			fi1 = 33 * this.radDeg,
			fi2 = 45 * this.radDeg,
			fi = lat * this.radDeg,
			n = Math.log(Math.cos(fi1) * (1 / Math.cos(fi2))) / Math.log(Math.tan(Math.PI / 4 + fi2 / 2) * (1 / Math.tan(Math.PI / 4 + fi1 / 2))),
			F = (Math.cos(fi1) * Math.pow(Math.tan(Math.PI / 4 + fi1 / 2), n)) / n,
			ro = F * Math.pow(1 / Math.tan(Math.PI / 4 + fi / 2), n),
			ro0 = F * Math.pow(1 / Math.tan(Math.PI / 4 + fi0 / 2), n);

		return {
			x: ro * Math.sin(n * (lambda - lambda0)) * this.radius,
			y: - (ro0 - ro * Math.cos(n * (lambda - lambda0))) * this.radius
		};
	},

	/**
	 * Converts Cartesian coordinates to the point on sphere using Lambert conformal conic
	 * projection
	 * @see <a href="http://mathworld.wolfram.com/LambertConformalConicProjection.html">Lambert Conformal Conic Projection</a>
	 * @param {Number} x X of point in Cartesian system as integer
	 * @param {Number} y Y of point in Cartesian system as integer
	 * @param {Number} c Central meridian in degrees
	 */
	lcc_inv: function (xCoord, yCoord, c) {
		var x = xCoord / this.radius,
			y = yCoord / this.radius,
			fi0 = 0,
			lambda0 = c * this.radDeg,
			fi1 = 33 * this.radDeg,
			fi2 = 45 * this.radDeg,
			n = Math.log(Math.cos(fi1) * (1 / Math.cos(fi2))) / Math.log(Math.tan(Math.PI / 4 + fi2 / 2) * (1 / Math.tan(Math.PI / 4 + fi1 / 2))),
			F = (Math.cos(fi1) * Math.pow(Math.tan(Math.PI / 4 + fi1 / 2), n)) / n,
			ro0 = F * Math.pow(1 / Math.tan(Math.PI / 4 + fi0 / 2), n),
			ro = this.sgn(n) * Math.sqrt(x * x + (ro0 - y) * (ro0 - y)),
			theta = Math.atan(x / (ro0 - y));

		return {
			lat: (2 * Math.atan(Math.pow(F / ro, 1 / n)) - Math.PI / 2) * this.degRad,
			lng: (lambda0 + theta / n) * this.degRad
		};
	}
}; jvm.MapObject = function (config) { };

jvm.MapObject.prototype.getLabelText = function (key) {
	var text;

	if (this.config.label) {
		if (typeof this.config.label.render === 'function') {
			text = this.config.label.render(key);
		} else {
			text = key;
		}
	} else {
		text = null;
	}
	return text;
}

jvm.MapObject.prototype.getLabelOffsets = function (key) {
	var offsets;

	if (this.config.label) {
		if (typeof this.config.label.offsets === 'function') {
			offsets = this.config.label.offsets(key);
		} else if (typeof this.config.label.offsets === 'object') {
			offsets = this.config.label.offsets[key];
		}
	}
	return offsets || [0, 0];
}

/**
 * Set hovered state to the element. Hovered state means mouse cursor is over element. Styles will be updates respectively.
 * @param {Boolean} isHovered <code>true</code> to make element hovered, <code>false</code> otherwise.
 */
jvm.MapObject.prototype.setHovered = function (isHovered) {
	if (this.isHovered !== isHovered) {
		this.isHovered = isHovered;
		this.shape.isHovered = isHovered;
		this.shape.updateStyle();
		if (this.label) {
			this.label.isHovered = isHovered;
			this.label.updateStyle();
		}
	}
};

/**
 * Set selected state to the element. Styles will be updates respectively.
 * @param {Boolean} isSelected <code>true</code> to make element selected, <code>false</code> otherwise.
 */
jvm.MapObject.prototype.setSelected = function (isSelected) {
	if (this.isSelected !== isSelected) {
		this.isSelected = isSelected;
		this.shape.isSelected = isSelected;
		this.shape.updateStyle();
		if (this.label) {
			this.label.isSelected = isSelected;
			this.label.updateStyle();
		}
		jvm.$(this.shape).trigger('selected', [isSelected]);
	}
};

jvm.MapObject.prototype.setStyle = function () {
	this.shape.setStyle.apply(this.shape, arguments);
};

jvm.MapObject.prototype.remove = function () {
	this.shape.remove();
	if (this.label) {
		this.label.remove();
	}
}; jvm.Region = function (config) {
	var bbox,
		text,
		offsets,
		labelDx,
		labelDy;

	this.config = config;
	this.map = this.config.map;

	this.shape = config.canvas.addPath({
		d: config.path,
		'data-code': config.code
	}, config.style, config.canvas.rootElement);
	this.shape.addClass('jvectormap-region jvectormap-element');

	bbox = this.shape.getBBox();

	text = this.getLabelText(config.code);
	if (this.config.label && text) {
		offsets = this.getLabelOffsets(config.code);
		this.labelX = bbox.x + bbox.width / 2 + offsets[0];
		this.labelY = bbox.y + bbox.height / 2 + offsets[1];
		this.label = config.canvas.addText({
			text: text,
			'text-anchor': 'middle',
			'alignment-baseline': 'central',
			x: this.labelX,
			y: this.labelY,
			'data-code': config.code
		}, config.labelStyle, config.labelsGroup);
		this.label.addClass('jvectormap-region jvectormap-element');
	}
};

jvm.inherits(jvm.Region, jvm.MapObject);

jvm.Region.prototype.updateLabelPosition = function () {
	if (this.label) {
		this.label.set({
			x: this.labelX * this.map.scale + this.map.transX * this.map.scale,
			y: this.labelY * this.map.scale + this.map.transY * this.map.scale
		});
	}
}; jvm.Marker = function (config) {
	var text,
		offsets;

	this.config = config;
	this.map = this.config.map;

	this.isImage = !!this.config.style.initial.image;
	this.createShape();

	text = this.getLabelText(config.index);
	if (this.config.label && text) {
		this.offsets = this.getLabelOffsets(config.index);
		this.labelX = config.cx / this.map.scale - this.map.transX;
		this.labelY = config.cy / this.map.scale - this.map.transY;
		this.label = config.canvas.addText({
			text: text,
			'data-index': config.index,
			dy: "0.6ex",
			x: this.labelX,
			y: this.labelY
		}, config.labelStyle, config.labelsGroup);

		this.label.addClass('jvectormap-marker jvectormap-element');
	}
};

jvm.inherits(jvm.Marker, jvm.MapObject);

jvm.Marker.prototype.createShape = function () {
	var that = this;

	if (this.shape) {
		this.shape.remove();
	}
	this.shape = this.config.canvas[this.isImage ? 'addImage' : 'addCircle']({
		"data-index": this.config.index,
		cx: this.config.cx,
		cy: this.config.cy
	}, this.config.style, this.config.group);

	this.shape.addClass('jvectormap-marker jvectormap-element');

	if (this.isImage) {
		jvm.$(this.shape.node).on('imageloaded', function () {
			that.updateLabelPosition();
		});
	}
};

jvm.Marker.prototype.updateLabelPosition = function () {
	if (this.label) {
		this.label.set({
			x: this.labelX * this.map.scale + this.offsets[0] +
				this.map.transX * this.map.scale + 5 + (this.isImage ? (this.shape.width || 0) / 2 : this.shape.properties.r),
			y: this.labelY * this.map.scale + this.map.transY * this.map.scale + this.offsets[1]
		});
	}
};

jvm.Marker.prototype.setStyle = function (property, value) {
	var isImage;

	jvm.Marker.parentClass.prototype.setStyle.apply(this, arguments);

	if (property === 'r') {
		this.updateLabelPosition();
	}

	isImage = !!this.shape.get('image');
	if (isImage != this.isImage) {
		this.isImage = isImage;
		this.config.style = jvm.$.extend(true, {}, this.shape.style);
		this.createShape();
	}
};/**
   * Creates map, draws paths, binds events.
   * @constructor
   * @param {Object} params Parameters to initialize map with.
   * @param {String} params.map Name of the map in the format <code>territory_proj_lang</code> where <code>territory</code> is a unique code or name of the territory which the map represents (ISO 3166 standard is used where possible), <code>proj</code> is a name of projection used to generate representation of the map on the plane (projections are named according to the conventions of proj4 utility) and <code>lang</code> is a code of the language, used for the names of regions.
   * @param {String} params.backgroundColor Background color of the map in CSS format.
   * @param {Boolean} params.zoomOnScroll When set to true map could be zoomed using mouse scroll. Default value is <code>true</code>.
   * @param {Boolean} params.panOnDrag When set to true, the map pans when being dragged. Default value is <code>true</code>.
   * @param {Number} params.zoomMax Indicates the maximum zoom ratio which could be reached zooming the map. Default value is <code>8</code>.
   * @param {Number} params.zoomMin Indicates the minimum zoom ratio which could be reached zooming the map. Default value is <code>1</code>.
   * @param {Number} params.zoomStep Indicates the multiplier used to zoom map with +/- buttons. Default value is <code>1.6</code>.
   * @param {Boolean} params.zoomAnimate Indicates whether or not to animate changing of map zoom with zoom buttons.
   * @param {Boolean} params.regionsSelectable When set to true regions of the map could be selected. Default value is <code>false</code>.
   * @param {Boolean} params.regionsSelectableOne Allow only one region to be selected at the moment. Default value is <code>false</code>.
   * @param {Boolean} params.markersSelectable When set to true markers on the map could be selected. Default value is <code>false</code>.
   * @param {Boolean} params.markersSelectableOne Allow only one marker to be selected at the moment. Default value is <code>false</code>.
   * @param {Object} params.regionStyle Set the styles for the map's regions. Each region or marker has four states: <code>initial</code> (default state), <code>hover</code> (when the mouse cursor is over the region or marker), <code>selected</code> (when region or marker is selected), <code>selectedHover</code> (when the mouse cursor is over the region or marker and it's selected simultaneously). Styles could be set for each of this states. Default value for that parameter is:
  <pre>{
	initial: {
	  fill: 'white',
	  "fill-opacity": 1,
	  stroke: 'none',
	  "stroke-width": 0,
	  "stroke-opacity": 1
	},
	hover: {
	  "fill-opacity": 0.8,
	  cursor: 'pointer'
	},
	selected: {
	  fill: 'yellow'
	},
	selectedHover: {
	}
  }</pre>
  * @param {Object} params.regionLabelStyle Set the styles for the regions' labels. Each region or marker has four states: <code>initial</code> (default state), <code>hover</code> (when the mouse cursor is over the region or marker), <code>selected</code> (when region or marker is selected), <code>selectedHover</code> (when the mouse cursor is over the region or marker and it's selected simultaneously). Styles could be set for each of this states. Default value for that parameter is:
  <pre>{
	initial: {
	  'font-family': 'Verdana',
	  'font-size': '12',
	  'font-weight': 'bold',
	  cursor: 'default',
	  fill: 'black'
	},
	hover: {
	  cursor: 'pointer'
	}
  }</pre>
   * @param {Object} params.markerStyle Set the styles for the map's markers. Any parameter suitable for <code>regionStyle</code> could be used as well as numeric parameter <code>r</code> to set the marker's radius. Default value for that parameter is:
  <pre>{
	initial: {
	  fill: 'grey',
	  stroke: '#505050',
	  "fill-opacity": 1,
	  "stroke-width": 1,
	  "stroke-opacity": 1,
	  r: 5
	},
	hover: {
	  stroke: 'black',
	  "stroke-width": 2,
	  cursor: 'pointer'
	},
	selected: {
	  fill: 'blue'
	},
	selectedHover: {
	}
  }</pre>
   * @param {Object} params.markerLabelStyle Set the styles for the markers' labels. Default value for that parameter is:
  <pre>{
	initial: {
	  'font-family': 'Verdana',
	  'font-size': '12',
	  'font-weight': 'bold',
	  cursor: 'default',
	  fill: 'black'
	},
	hover: {
	  cursor: 'pointer'
	}
  }</pre>
   * @param {Object|Array} params.markers Set of markers to add to the map during initialization. In case of array is provided, codes of markers will be set as string representations of array indexes. Each marker is represented by <code>latLng</code> (array of two numeric values), <code>name</code> (string which will be show on marker's tip) and any marker styles.
   * @param {Object} params.series Object with two keys: <code>markers</code> and <code>regions</code>. Each of which is an array of series configs to be applied to the respective map elements. See <a href="jvm.DataSeries.html">DataSeries</a> description for a list of parameters available.
   * @param {Object|String} params.focusOn This parameter sets the initial position and scale of the map viewport. See <code>setFocus</code> docuemntation for possible parameters.
   * @param {Object} params.labels Defines parameters for rendering static labels. Object could contain two keys: <code>regions</code> and <code>markers</code>. Each key value defines configuration object with the following possible options:
  <ul>
	<li><code>render {Function}</code> - defines method for converting region code or marker index to actual label value.</li>
	<li><code>offsets {Object|Function}</code> - provides method or object which could be used to define label offset by region code or marker index.</li>
  </ul>
  <b>Plase note: static labels feature is not supported in Internet Explorer 8 and below.</b>
   * @param {Array|Object|String} params.selectedRegions Set initially selected regions.
   * @param {Array|Object|String} params.selectedMarkers Set initially selected markers.
   * @param {Function} params.onRegionTipShow <code>(Event e, Object tip, String code)</code> Will be called right before the region tip is going to be shown.
   * @param {Function} params.onRegionOver <code>(Event e, String code)</code> Will be called on region mouse over event.
   * @param {Function} params.onRegionOut <code>(Event e, String code)</code> Will be called on region mouse out event.
   * @param {Function} params.onRegionClick <code>(Event e, String code)</code> Will be called on region click event.
   * @param {Function} params.onRegionSelected <code>(Event e, String code, Boolean isSelected, Array selectedRegions)</code> Will be called when region is (de)selected. <code>isSelected</code> parameter of the callback indicates whether region is selected or not. <code>selectedRegions</code> contains codes of all currently selected regions.
   * @param {Function} params.onMarkerTipShow <code>(Event e, Object tip, String code)</code> Will be called right before the marker tip is going to be shown.
   * @param {Function} params.onMarkerOver <code>(Event e, String code)</code> Will be called on marker mouse over event.
   * @param {Function} params.onMarkerOut <code>(Event e, String code)</code> Will be called on marker mouse out event.
   * @param {Function} params.onMarkerClick <code>(Event e, String code)</code> Will be called on marker click event.
   * @param {Function} params.onMarkerSelected <code>(Event e, String code, Boolean isSelected, Array selectedMarkers)</code> Will be called when marker is (de)selected. <code>isSelected</code> parameter of the callback indicates whether marker is selected or not. <code>selectedMarkers</code> contains codes of all currently selected markers.
   * @param {Function} params.onViewportChange <code>(Event e, Number scale)</code> Triggered when the map's viewport is changed (map was panned or zoomed).
   */
jvm.Map = function (params) {
	var map = this,
		e;

	this.params = jvm.$.extend(true, {}, jvm.Map.defaultParams, params);

	if (!jvm.Map.maps[this.params.map]) {
		throw new Error('Attempt to use map which was not loaded: ' + this.params.map);
	}

	this.mapData = jvm.Map.maps[this.params.map];
	this.markers = {};
	this.regions = {};
	this.regionsColors = {};
	this.regionsData = {};

	this.container = jvm.$('<div>').addClass('jvectormap-container');
	if (this.params.container) {
		this.params.container.append(this.container);
	}
	this.container.data('mapObject', this);

	this.defaultWidth = this.mapData.width;
	this.defaultHeight = this.mapData.height;

	this.setBackgroundColor(this.params.backgroundColor);

	this.onResize = function () {
		map.updateSize();
	}
	jvm.$(window).resize(this.onResize);

	for (e in jvm.Map.apiEvents) {
		if (this.params[e]) {
			this.container.bind(jvm.Map.apiEvents[e] + '.jvectormap', this.params[e]);
		}
	}

	this.canvas = new jvm.VectorCanvas(this.container[0], this.width, this.height);

	if (('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch)) {
		if (this.params.bindTouchEvents) {
			this.bindContainerTouchEvents();
		}
	}
	this.bindContainerEvents();
	this.bindElementEvents();
	this.createTip();
	if (this.params.zoomButtons) {
		this.bindZoomButtons();
	}

	this.createRegions();
	this.createMarkers(this.params.markers || {});

	this.updateSize();

	if (this.params.focusOn) {
		if (typeof this.params.focusOn === 'string') {
			this.params.focusOn = { region: this.params.focusOn };
		} else if (jvm.$.isArray(this.params.focusOn)) {
			this.params.focusOn = { regions: this.params.focusOn };
		}
		this.setFocus(this.params.focusOn);
	}

	if (this.params.selectedRegions) {
		this.setSelectedRegions(this.params.selectedRegions);
	}
	if (this.params.selectedMarkers) {
		this.setSelectedMarkers(this.params.selectedMarkers);
	}

	this.legendCntHorizontal = jvm.$('<div/>').addClass('jvectormap-legend-cnt jvectormap-legend-cnt-h');
	this.legendCntVertical = jvm.$('<div/>').addClass('jvectormap-legend-cnt jvectormap-legend-cnt-v');
	this.container.append(this.legendCntHorizontal);
	this.container.append(this.legendCntVertical);

	if (this.params.series) {
		this.createSeries();
	}
};

jvm.Map.prototype = {
	transX: 0,
	transY: 0,
	scale: 1,
	baseTransX: 0,
	baseTransY: 0,
	baseScale: 1,

	width: 0,
	height: 0,

	/**
	 * Set background color of the map.
	 * @param {String} backgroundColor Background color in CSS format.
	 */
	setBackgroundColor: function (backgroundColor) {
		this.container.css('background-color', backgroundColor);
	},

	resize: function () {
		var curBaseScale = this.baseScale;
		if (this.width / this.height > this.defaultWidth / this.defaultHeight) {
			this.baseScale = this.height / this.defaultHeight;
			this.baseTransX = Math.abs(this.width - this.defaultWidth * this.baseScale) / (2 * this.baseScale);
		} else {
			this.baseScale = this.width / this.defaultWidth;
			this.baseTransY = Math.abs(this.height - this.defaultHeight * this.baseScale) / (2 * this.baseScale);
		}
		this.scale *= this.baseScale / curBaseScale;
		this.transX *= this.baseScale / curBaseScale;
		this.transY *= this.baseScale / curBaseScale;
	},

	/**
	 * Synchronize the size of the map with the size of the container. Suitable in situations where the size of the container is changed programmatically or container is shown after it became visible.
	 */
	updateSize: function () {
		this.width = this.container.width();
		this.height = this.container.height();
		this.resize();
		this.canvas.setSize(this.width, this.height);
		this.applyTransform();
	},

	/**
	 * Reset all the series and show the map with the initial zoom.
	 */
	reset: function () {
		var key,
			i;

		for (key in this.series) {
			for (i = 0; i < this.series[key].length; i++) {
				this.series[key][i].clear();
			}
		}
		this.scale = this.baseScale;
		this.transX = this.baseTransX;
		this.transY = this.baseTransY;
		this.applyTransform();
	},

	applyTransform: function () {
		var maxTransX,
			maxTransY,
			minTransX,
			minTransY;

		if (this.defaultWidth * this.scale <= this.width) {
			maxTransX = (this.width - this.defaultWidth * this.scale) / (2 * this.scale);
			minTransX = (this.width - this.defaultWidth * this.scale) / (2 * this.scale);
		} else {
			maxTransX = 0;
			minTransX = (this.width - this.defaultWidth * this.scale) / this.scale;
		}

		if (this.defaultHeight * this.scale <= this.height) {
			maxTransY = (this.height - this.defaultHeight * this.scale) / (2 * this.scale);
			minTransY = (this.height - this.defaultHeight * this.scale) / (2 * this.scale);
		} else {
			maxTransY = 0;
			minTransY = (this.height - this.defaultHeight * this.scale) / this.scale;
		}

		if (this.transY > maxTransY) {
			this.transY = maxTransY;
		} else if (this.transY < minTransY) {
			this.transY = minTransY;
		}
		if (this.transX > maxTransX) {
			this.transX = maxTransX;
		} else if (this.transX < minTransX) {
			this.transX = minTransX;
		}

		this.canvas.applyTransformParams(this.scale, this.transX, this.transY);

		if (this.markers) {
			this.repositionMarkers();
		}

		this.repositionLabels();

		this.container.trigger('viewportChange', [this.scale / this.baseScale, this.transX, this.transY]);
	},

	bindContainerEvents: function () {
		var mouseDown = false,
			oldPageX,
			oldPageY,
			map = this;

		if (this.params.panOnDrag) {
			this.container.mousemove(function (e) {
				if (mouseDown) {
					map.transX -= (oldPageX - e.pageX) / map.scale;
					map.transY -= (oldPageY - e.pageY) / map.scale;

					map.applyTransform();

					oldPageX = e.pageX;
					oldPageY = e.pageY;
				}
				return false;
			}).mousedown(function (e) {
				mouseDown = true;
				oldPageX = e.pageX;
				oldPageY = e.pageY;
				return false;
			});

			this.onContainerMouseUp = function () {
				mouseDown = false;
			};
			jvm.$('body').mouseup(this.onContainerMouseUp);
		}

		if (this.params.zoomOnScroll) {
			this.container.mousewheel(function (event, delta, deltaX, deltaY) {
				var offset = jvm.$(map.container).offset(),
					centerX = event.pageX - offset.left,
					centerY = event.pageY - offset.top,
					zoomStep = Math.pow(1.003, event.deltaY);

				map.tip.hide();

				map.setScale(map.scale * zoomStep, centerX, centerY);
				event.preventDefault();
			});
		}
	},

	bindContainerTouchEvents: function () {
		var touchStartScale,
			touchStartDistance,
			map = this,
			touchX,
			touchY,
			centerTouchX,
			centerTouchY,
			lastTouchesLength,
			handleTouchEvent = function (e) {
				var touches = e.originalEvent.touches,
					offset,
					scale,
					transXOld,
					transYOld;

				if (e.type == 'touchstart') {
					lastTouchesLength = 0;
				}

				if (touches.length == 1) {
					if (lastTouchesLength == 1) {
						transXOld = map.transX;
						transYOld = map.transY;
						map.transX -= (touchX - touches[0].pageX) / map.scale;
						map.transY -= (touchY - touches[0].pageY) / map.scale;
						map.applyTransform();
						map.tip.hide();
						if (transXOld != map.transX || transYOld != map.transY) {
							e.preventDefault();
						}
					}
					touchX = touches[0].pageX;
					touchY = touches[0].pageY;
				} else if (touches.length == 2) {
					if (lastTouchesLength == 2) {
						scale = Math.sqrt(
							Math.pow(touches[0].pageX - touches[1].pageX, 2) +
							Math.pow(touches[0].pageY - touches[1].pageY, 2)
						) / touchStartDistance;
						map.setScale(
							touchStartScale * scale,
							centerTouchX,
							centerTouchY
						)
						map.tip.hide();
						e.preventDefault();
					} else {
						offset = jvm.$(map.container).offset();
						if (touches[0].pageX > touches[1].pageX) {
							centerTouchX = touches[1].pageX + (touches[0].pageX - touches[1].pageX) / 2;
						} else {
							centerTouchX = touches[0].pageX + (touches[1].pageX - touches[0].pageX) / 2;
						}
						if (touches[0].pageY > touches[1].pageY) {
							centerTouchY = touches[1].pageY + (touches[0].pageY - touches[1].pageY) / 2;
						} else {
							centerTouchY = touches[0].pageY + (touches[1].pageY - touches[0].pageY) / 2;
						}
						centerTouchX -= offset.left;
						centerTouchY -= offset.top;
						touchStartScale = map.scale;
						touchStartDistance = Math.sqrt(
							Math.pow(touches[0].pageX - touches[1].pageX, 2) +
							Math.pow(touches[0].pageY - touches[1].pageY, 2)
						);
					}
				}

				lastTouchesLength = touches.length;
			};

		jvm.$(this.container).bind('touchstart', handleTouchEvent);
		jvm.$(this.container).bind('touchmove', handleTouchEvent);
	},

	bindElementEvents: function () {
		var map = this,
			mouseMoved;

		this.container.mousemove(function () {
			mouseMoved = true;
		});

		/* Can not use common class selectors here because of the bug in jQuery
		 SVG handling, use with caution. */
		this.container.delegate("[class~='jvectormap-element']", 'mouseover mouseout', function (e) {
			var baseVal = jvm.$(this).attr('class').baseVal || jvm.$(this).attr('class'),
				type = baseVal.indexOf('jvectormap-region') === -1 ? 'marker' : 'region',
				code = type == 'region' ? jvm.$(this).attr('data-code') : jvm.$(this).attr('data-index'),
				element = type == 'region' ? map.regions[code].element : map.markers[code].element,
				tipText = type == 'region' ? map.mapData.paths[code].name : (map.markers[code].config.name || ''),
				tipShowEvent = jvm.$.Event(type + 'TipShow.jvectormap'),
				overEvent = jvm.$.Event(type + 'Over.jvectormap');

			if (e.type == 'mouseover') {
				map.container.trigger(overEvent, [code]);
				if (!overEvent.isDefaultPrevented()) {
					element.setHovered(true);
				}

				map.tip.text(tipText);
				map.container.trigger(tipShowEvent, [map.tip, code]);
				if (!tipShowEvent.isDefaultPrevented()) {
					map.tip.show();
					map.tipWidth = map.tip.width();
					map.tipHeight = map.tip.height();
				}
			} else {
				element.setHovered(false);
				map.tip.hide();
				map.container.trigger(type + 'Out.jvectormap', [code]);
			}
		});

		/* Can not use common class selectors here because of the bug in jQuery
		 SVG handling, use with caution. */
		this.container.delegate("[class~='jvectormap-element']", 'mousedown', function () {
			mouseMoved = false;
		});

		/* Can not use common class selectors here because of the bug in jQuery
		 SVG handling, use with caution. */
		this.container.delegate("[class~='jvectormap-element']", 'mouseup', function () {
			var baseVal = jvm.$(this).attr('class').baseVal ? jvm.$(this).attr('class').baseVal : jvm.$(this).attr('class'),
				type = baseVal.indexOf('jvectormap-region') === -1 ? 'marker' : 'region',
				code = type == 'region' ? jvm.$(this).attr('data-code') : jvm.$(this).attr('data-index'),
				clickEvent = jvm.$.Event(type + 'Click.jvectormap'),
				element = type == 'region' ? map.regions[code].element : map.markers[code].element;

			if (!mouseMoved) {
				map.container.trigger(clickEvent, [code]);
				if ((type === 'region' && map.params.regionsSelectable) || (type === 'marker' && map.params.markersSelectable)) {
					if (!clickEvent.isDefaultPrevented()) {
						if (map.params[type + 'sSelectableOne']) {
							map.clearSelected(type + 's');
						}
						element.setSelected(!element.isSelected);
					}
				}
			}
		});
	},

	bindZoomButtons: function () {
		var map = this;

		jvm.$('<div/>').addClass('jvectormap-zoomin').text('+').appendTo(this.container);
		jvm.$('<div/>').addClass('jvectormap-zoomout').html('&#x2212;').appendTo(this.container);

		this.container.find('.jvectormap-zoomin').click(function () {
			map.setScale(map.scale * map.params.zoomStep, map.width / 2, map.height / 2, false, map.params.zoomAnimate);
		});
		this.container.find('.jvectormap-zoomout').click(function () {
			map.setScale(map.scale / map.params.zoomStep, map.width / 2, map.height / 2, false, map.params.zoomAnimate);
		});
	},

	createTip: function () {
		var map = this;

		this.tip = jvm.$('<div/>').addClass('jvectormap-tip').appendTo(jvm.$('body'));

		this.container.mousemove(function (e) {
			var left = e.pageX - 15 - map.tipWidth,
				top = e.pageY - 15 - map.tipHeight;

			if (left < 5) {
				left = e.pageX + 15;
			}
			if (top < 5) {
				top = e.pageY + 15;
			}

			if (map.tip.is(':visible')) {
				map.tip.css({
					left: left,
					top: top
				})
			}
		});
	},

	setScale: function (scale, anchorX, anchorY, isCentered, animate) {
		var viewportChangeEvent = jvm.$.Event('zoom.jvectormap'),
			interval,
			that = this,
			i = 0,
			count = Math.abs(Math.round((scale - this.scale) * 60 / Math.max(scale, this.scale))),
			scaleStart,
			scaleDiff,
			transXStart,
			transXDiff,
			transYStart,
			transYDiff,
			transX,
			transY,
			deferred = new jvm.$.Deferred();

		if (scale > this.params.zoomMax * this.baseScale) {
			scale = this.params.zoomMax * this.baseScale;
		} else if (scale < this.params.zoomMin * this.baseScale) {
			scale = this.params.zoomMin * this.baseScale;
		}

		if (typeof anchorX != 'undefined' && typeof anchorY != 'undefined') {
			zoomStep = scale / this.scale;
			if (isCentered) {
				transX = anchorX + this.defaultWidth * (this.width / (this.defaultWidth * scale)) / 2;
				transY = anchorY + this.defaultHeight * (this.height / (this.defaultHeight * scale)) / 2;
			} else {
				transX = this.transX - (zoomStep - 1) / scale * anchorX;
				transY = this.transY - (zoomStep - 1) / scale * anchorY;
			}
		}

		if (animate && count > 0) {
			scaleStart = this.scale;
			scaleDiff = (scale - scaleStart) / count;
			transXStart = this.transX * this.scale;
			transYStart = this.transY * this.scale;
			transXDiff = (transX * scale - transXStart) / count;
			transYDiff = (transY * scale - transYStart) / count;
			interval = setInterval(function () {
				i += 1;
				that.scale = scaleStart + scaleDiff * i;
				that.transX = (transXStart + transXDiff * i) / that.scale;
				that.transY = (transYStart + transYDiff * i) / that.scale;
				that.applyTransform();
				if (i == count) {
					clearInterval(interval);
					that.container.trigger(viewportChangeEvent, [scale / that.baseScale]);
					deferred.resolve();
				}
			}, 10);
		} else {
			this.transX = transX;
			this.transY = transY;
			this.scale = scale;
			this.applyTransform();
			this.container.trigger(viewportChangeEvent, [scale / this.baseScale]);
			deferred.resolve();
		}

		return deferred;
	},

	/**
	 * Set the map's viewport to the specific point and set zoom of the map to the specific level. Point and zoom level could be defined in two ways: using the code of some region to focus on or a central point and zoom level as numbers.
	 * @param This method takes a configuration object as the single argument. The options passed to it are the following:
	 * @param {Array} params.regions Array of region codes to zoom to.
	 * @param {String} params.region Region code to zoom to.
	 * @param {Number} params.scale Map scale to set.
	 * @param {Number} params.lat Latitude to set viewport to.
	 * @param {Number} params.lng Longitude to set viewport to.
	 * @param {Number} params.x Number from 0 to 1 specifying the horizontal coordinate of the central point of the viewport.
	 * @param {Number} params.y Number from 0 to 1 specifying the vertical coordinate of the central point of the viewport.
	 * @param {Boolean} params.animate Indicates whether or not to animate the scale change and transition.
	 */
	setFocus: function (config) {
		var bbox,
			itemBbox,
			newBbox,
			codes,
			i,
			point;

		config = config || {};

		if (config.region) {
			codes = [config.region];
		} else if (config.regions) {
			codes = config.regions;
		}

		if (codes) {
			for (i = 0; i < codes.length; i++) {
				if (this.regions[codes[i]]) {
					itemBbox = this.regions[codes[i]].element.shape.getBBox();
					if (itemBbox) {
						if (typeof bbox == 'undefined') {
							bbox = itemBbox;
						} else {
							newBbox = {
								x: Math.min(bbox.x, itemBbox.x),
								y: Math.min(bbox.y, itemBbox.y),
								width: Math.max(bbox.x + bbox.width, itemBbox.x + itemBbox.width) - Math.min(bbox.x, itemBbox.x),
								height: Math.max(bbox.y + bbox.height, itemBbox.y + itemBbox.height) - Math.min(bbox.y, itemBbox.y)
							}
							bbox = newBbox;
						}
					}
				}
			}
			return this.setScale(
				Math.min(this.width / bbox.width, this.height / bbox.height),
				- (bbox.x + bbox.width / 2),
				- (bbox.y + bbox.height / 2),
				true,
				config.animate
			);
		} else {
			if (config.lat && config.lng) {
				point = this.latLngToPoint(config.lat, config.lng);
				config.x = this.transX - point.x / this.scale;
				config.y = this.transY - point.y / this.scale;
			} else if (config.x && config.y) {
				config.x *= -this.defaultWidth;
				config.y *= -this.defaultHeight;
			}
			return this.setScale(config.scale * this.baseScale, config.x, config.y, true, config.animate);
		}
	},

	getSelected: function (type) {
		var key,
			selected = [];

		for (key in this[type]) {
			if (this[type][key].element.isSelected) {
				selected.push(key);
			}
		}
		return selected;
	},

	/**
	 * Return the codes of currently selected regions.
	 * @returns {Array}
	 */
	getSelectedRegions: function () {
		return this.getSelected('regions');
	},

	/**
	 * Return the codes of currently selected markers.
	 * @returns {Array}
	 */
	getSelectedMarkers: function () {
		return this.getSelected('markers');
	},

	setSelected: function (type, keys) {
		var i;

		if (typeof keys != 'object') {
			keys = [keys];
		}

		if (jvm.$.isArray(keys)) {
			for (i = 0; i < keys.length; i++) {
				this[type][keys[i]].element.setSelected(true);
			}
		} else {
			for (i in keys) {
				this[type][i].element.setSelected(!!keys[i]);
			}
		}
	},

	/**
	 * Set or remove selected state for the regions.
	 * @param {String|Array|Object} keys If <code>String</code> or <code>Array</code> the region(s) with the corresponding code(s) will be selected. If <code>Object</code> was provided its keys are  codes of regions, state of which should be changed. Selected state will be set if value is true, removed otherwise.
	 */
	setSelectedRegions: function (keys) {
		this.setSelected('regions', keys);
	},

	/**
	 * Set or remove selected state for the markers.
	 * @param {String|Array|Object} keys If <code>String</code> or <code>Array</code> the marker(s) with the corresponding code(s) will be selected. If <code>Object</code> was provided its keys are  codes of markers, state of which should be changed. Selected state will be set if value is true, removed otherwise.
	 */
	setSelectedMarkers: function (keys) {
		this.setSelected('markers', keys);
	},

	clearSelected: function (type) {
		var select = {},
			selected = this.getSelected(type),
			i;

		for (i = 0; i < selected.length; i++) {
			select[selected[i]] = false;
		};

		this.setSelected(type, select);
	},

	/**
	 * Remove the selected state from all the currently selected regions.
	 */
	clearSelectedRegions: function () {
		this.clearSelected('regions');
	},

	/**
	 * Remove the selected state from all the currently selected markers.
	 */
	clearSelectedMarkers: function () {
		this.clearSelected('markers');
	},

	/**
	 * Return the instance of Map. Useful when instantiated as a jQuery plug-in.
	 * @returns {Map}
	 */
	getMapObject: function () {
		return this;
	},

	/**
	 * Return the name of the region by region code.
	 * @returns {String}
	 */
	getRegionName: function (code) {
		return this.mapData.paths[code].name;
	},

	createRegions: function () {
		var key,
			region,
			map = this;

		this.regionLabelsGroup = this.regionLabelsGroup || this.canvas.addGroup();

		for (key in this.mapData.paths) {
			region = new jvm.Region({
				map: this,
				path: this.mapData.paths[key].path,
				code: key,
				style: jvm.$.extend(true, {}, this.params.regionStyle),
				labelStyle: jvm.$.extend(true, {}, this.params.regionLabelStyle),
				canvas: this.canvas,
				labelsGroup: this.regionLabelsGroup,
				label: this.canvas.mode != 'vml' ? (this.params.labels && this.params.labels.regions) : null
			});

			jvm.$(region.shape).bind('selected', function (e, isSelected) {
				map.container.trigger('regionSelected.jvectormap', [jvm.$(this.node).attr('data-code'), isSelected, map.getSelectedRegions()]);
			});
			this.regions[key] = {
				element: region,
				config: this.mapData.paths[key]
			};
		}
	},

	createMarkers: function (markers) {
		var i,
			marker,
			point,
			markerConfig,
			markersArray,
			map = this;

		this.markersGroup = this.markersGroup || this.canvas.addGroup();
		this.markerLabelsGroup = this.markerLabelsGroup || this.canvas.addGroup();

		if (jvm.$.isArray(markers)) {
			markersArray = markers.slice();
			markers = {};
			for (i = 0; i < markersArray.length; i++) {
				markers[i] = markersArray[i];
			}
		}

		for (i in markers) {
			markerConfig = markers[i] instanceof Array ? { latLng: markers[i] } : markers[i];
			point = this.getMarkerPosition(markerConfig);

			if (point !== false) {
				marker = new jvm.Marker({
					map: this,
					style: jvm.$.extend(true, {}, this.params.markerStyle, { initial: markerConfig.style || {} }),
					labelStyle: jvm.$.extend(true, {}, this.params.markerLabelStyle),
					index: i,
					cx: point.x,
					cy: point.y,
					group: this.markersGroup,
					canvas: this.canvas,
					labelsGroup: this.markerLabelsGroup,
					label: this.canvas.mode != 'vml' ? (this.params.labels && this.params.labels.markers) : null
				});

				jvm.$(marker.shape).bind('selected', function (e, isSelected) {
					map.container.trigger('markerSelected.jvectormap', [jvm.$(this.node).attr('data-index'), isSelected, map.getSelectedMarkers()]);
				});
				if (this.markers[i]) {
					this.removeMarkers([i]);
				}
				this.markers[i] = { element: marker, config: markerConfig };
			}
		}
	},

	repositionMarkers: function () {
		var i,
			point;

		for (i in this.markers) {
			point = this.getMarkerPosition(this.markers[i].config);
			if (point !== false) {
				this.markers[i].element.setStyle({ cx: point.x, cy: point.y });
			}
		}
	},

	repositionLabels: function () {
		var key;

		for (key in this.regions) {
			this.regions[key].element.updateLabelPosition();
		}

		for (key in this.markers) {
			this.markers[key].element.updateLabelPosition();
		}
	},

	getMarkerPosition: function (markerConfig) {
		if (jvm.Map.maps[this.params.map].projection) {
			return this.latLngToPoint.apply(this, markerConfig.latLng || [0, 0]);
		} else {
			return {
				x: markerConfig.coords[0] * this.scale + this.transX * this.scale,
				y: markerConfig.coords[1] * this.scale + this.transY * this.scale
			};
		}
	},

	/**
	 * Add one marker to the map.
	 * @param {String} key Marker unique code.
	 * @param {Object} marker Marker configuration parameters.
	 * @param {Array} seriesData Values to add to the data series.
	 */
	addMarker: function (key, marker, seriesData) {
		var markers = {},
			data = [],
			values,
			i,
			seriesData = seriesData || [];

		markers[key] = marker;

		for (i = 0; i < seriesData.length; i++) {
			values = {};
			if (typeof seriesData[i] !== 'undefined') {
				values[key] = seriesData[i];
			}
			data.push(values);
		}
		this.addMarkers(markers, data);
	},

	/**
	 * Add set of marker to the map.
	 * @param {Object|Array} markers Markers to add to the map. In case of array is provided, codes of markers will be set as string representations of array indexes.
	 * @param {Array} seriesData Values to add to the data series.
	 */
	addMarkers: function (markers, seriesData) {
		var i;

		seriesData = seriesData || [];

		this.createMarkers(markers);
		for (i = 0; i < seriesData.length; i++) {
			this.series.markers[i].setValues(seriesData[i] || {});
		};
	},

	/**
	 * Remove some markers from the map.
	 * @param {Array} markers Array of marker codes to be removed.
	 */
	removeMarkers: function (markers) {
		var i;

		for (i = 0; i < markers.length; i++) {
			this.markers[markers[i]].element.remove();
			delete this.markers[markers[i]];
		};
	},

	/**
	 * Remove all markers from the map.
	 */
	removeAllMarkers: function () {
		var i,
			markers = [];

		for (i in this.markers) {
			markers.push(i);
		}
		this.removeMarkers(markers)
	},

	/**
	 * Converts coordinates expressed as latitude and longitude to the coordinates in pixels on the map.
	 * @param {Number} lat Latitide of point in degrees.
	 * @param {Number} lng Longitude of point in degrees.
	 */
	latLngToPoint: function (lat, lng) {
		var point,
			proj = jvm.Map.maps[this.params.map].projection,
			centralMeridian = proj.centralMeridian,
			inset,
			bbox;

		if (lng < (-180 + centralMeridian)) {
			lng += 360;
		}

		point = jvm.Proj[proj.type](lat, lng, centralMeridian);

		inset = this.getInsetForPoint(point.x, point.y);
		if (inset) {
			bbox = inset.bbox;

			point.x = (point.x - bbox[0].x) / (bbox[1].x - bbox[0].x) * inset.width * this.scale;
			point.y = (point.y - bbox[0].y) / (bbox[1].y - bbox[0].y) * inset.height * this.scale;

			return {
				x: point.x + this.transX * this.scale + inset.left * this.scale,
				y: point.y + this.transY * this.scale + inset.top * this.scale
			};
		} else {
			return false;
		}
	},

	/**
	 * Converts cartesian coordinates into coordinates expressed as latitude and longitude.
	 * @param {Number} x X-axis of point on map in pixels.
	 * @param {Number} y Y-axis of point on map in pixels.
	 */
	pointToLatLng: function (x, y) {
		var proj = jvm.Map.maps[this.params.map].projection,
			centralMeridian = proj.centralMeridian,
			insets = jvm.Map.maps[this.params.map].insets,
			i,
			inset,
			bbox,
			nx,
			ny;

		for (i = 0; i < insets.length; i++) {
			inset = insets[i];
			bbox = inset.bbox;

			nx = x - (this.transX * this.scale + inset.left * this.scale);
			ny = y - (this.transY * this.scale + inset.top * this.scale);

			nx = (nx / (inset.width * this.scale)) * (bbox[1].x - bbox[0].x) + bbox[0].x;
			ny = (ny / (inset.height * this.scale)) * (bbox[1].y - bbox[0].y) + bbox[0].y;

			if (nx > bbox[0].x && nx < bbox[1].x && ny > bbox[0].y && ny < bbox[1].y) {
				return jvm.Proj[proj.type + '_inv'](nx, -ny, centralMeridian);
			}
		}

		return false;
	},

	getInsetForPoint: function (x, y) {
		var insets = jvm.Map.maps[this.params.map].insets,
			i,
			bbox;

		for (i = 0; i < insets.length; i++) {
			bbox = insets[i].bbox;
			if (x > bbox[0].x && x < bbox[1].x && y > bbox[0].y && y < bbox[1].y) {
				return insets[i];
			}
		}
	},

	createSeries: function () {
		var i,
			key;

		this.series = {
			markers: [],
			regions: []
		};

		for (key in this.params.series) {
			for (i = 0; i < this.params.series[key].length; i++) {
				this.series[key][i] = new jvm.DataSeries(
					this.params.series[key][i],
					this[key],
					this
				);
			}
		}
	},

	/**
	 * Gracefully remove the map and and all its accessories, unbind event handlers.
	 */
	remove: function () {
		this.tip.remove();
		this.container.remove();
		jvm.$(window).unbind('resize', this.onResize);
		jvm.$('body').unbind('mouseup', this.onContainerMouseUp);
	}
};

jvm.Map.maps = {};
jvm.Map.defaultParams = {
	map: 'world_mill_en',
	backgroundColor: '#505050',
	zoomButtons: true,
	zoomOnScroll: true,
	panOnDrag: true,
	zoomMax: 8,
	zoomMin: 1,
	zoomStep: 1.6,
	zoomAnimate: true,
	regionsSelectable: false,
	markersSelectable: false,
	bindTouchEvents: true,
	regionStyle: {
		initial: {
			fill: 'white',
			"fill-opacity": 1,
			stroke: 'none',
			"stroke-width": 0,
			"stroke-opacity": 1
		},
		hover: {
			"fill-opacity": 0.8,
			cursor: 'pointer'
		},
		selected: {
			fill: 'yellow'
		},
		selectedHover: {
		}
	},
	regionLabelStyle: {
		initial: {
			'font-family': 'Verdana',
			'font-size': '12',
			'font-weight': 'bold',
			cursor: 'default',
			fill: 'black'
		},
		hover: {
			cursor: 'pointer'
		}
	},
	markerStyle: {
		initial: {
			fill: 'grey',
			stroke: '#505050',
			"fill-opacity": 1,
			"stroke-width": 1,
			"stroke-opacity": 1,
			r: 5
		},
		hover: {
			stroke: 'black',
			"stroke-width": 2,
			cursor: 'pointer'
		},
		selected: {
			fill: 'blue'
		},
		selectedHover: {
		}
	},
	markerLabelStyle: {
		initial: {
			'font-family': 'Verdana',
			'font-size': '12',
			'font-weight': 'bold',
			cursor: 'default',
			fill: 'black'
		},
		hover: {
			cursor: 'pointer'
		}
	}
};
jvm.Map.apiEvents = {
	onRegionTipShow: 'regionTipShow',
	onRegionOver: 'regionOver',
	onRegionOut: 'regionOut',
	onRegionClick: 'regionClick',
	onRegionSelected: 'regionSelected',
	onMarkerTipShow: 'markerTipShow',
	onMarkerOver: 'markerOver',
	onMarkerOut: 'markerOut',
	onMarkerClick: 'markerClick',
	onMarkerSelected: 'markerSelected',
	onViewportChange: 'viewportChange'
};
/**
 * Creates map with drill-down functionality.
 * @constructor
 * @param {Object} params Parameters to initialize map with.
 * @param {Number} params.maxLevel Maximum number of levels user can go through
 * @param {Object} params.main Config of the main map. See <a href="./jvm-map/">jvm.Map</a> for more information.
 * @param {Function} params.mapNameByCode Function go generate map name by region code. Default value is:
<pre>
function(code, multiMap) {
return code.toLowerCase()+'_'+
		 multiMap.defaultProjection+'_en';
}
</pre>
 * @param {Function} params.mapUrlByCode Function to generate map url by region code. Default value is:
<pre>
function(code, multiMap){
return 'jquery-jvectormap-data-'+
		 code.toLowerCase()+'-'+
		 multiMap.defaultProjection+'-en.js';
}
</pre>
 */
jvm.MultiMap = function (params) {
	var that = this;

	this.maps = {};
	this.params = jvm.$.extend(true, {}, jvm.MultiMap.defaultParams, params);
	this.params.maxLevel = this.params.maxLevel || Number.MAX_VALUE;
	this.params.main = this.params.main || {};
	this.params.main.multiMapLevel = 0;
	this.history = [this.addMap(this.params.main.map, this.params.main)];
	this.defaultProjection = this.history[0].mapData.projection.type;
	this.mapsLoaded = {};

	this.params.container.css({ position: 'relative' });
	this.backButton = jvm.$('<div/>').addClass('jvectormap-goback').text('Back').appendTo(this.params.container);
	this.backButton.hide();
	this.backButton.click(function () {
		that.goBack();
	});

	this.spinner = jvm.$('<div/>').addClass('jvectormap-spinner').appendTo(this.params.container);
	this.spinner.hide();
};

jvm.MultiMap.prototype = {
	addMap: function (name, config) {
		var cnt = jvm.$('<div/>').css({
			width: '100%',
			height: '100%'
		});

		this.params.container.append(cnt);

		this.maps[name] = new jvm.Map(jvm.$.extend(config, { container: cnt }));
		if (this.params.maxLevel > config.multiMapLevel) {
			this.maps[name].container.on('regionClick.jvectormap', { scope: this }, function (e, code) {
				var multimap = e.data.scope,
					mapName = multimap.params.mapNameByCode(code, multimap);

				if (!multimap.drillDownPromise || multimap.drillDownPromise.state() !== 'pending') {
					multimap.drillDown(mapName, code);
				}
			});
		}


		return this.maps[name];
	},

	downloadMap: function (code) {
		var that = this,
			deferred = jvm.$.Deferred();

		if (!this.mapsLoaded[code]) {
			jvm.$.get(this.params.mapUrlByCode(code, this)).then(function () {
				that.mapsLoaded[code] = true;
				deferred.resolve();
			}, function () {
				deferred.reject();
			});
		} else {
			deferred.resolve();
		}
		return deferred;
	},

	drillDown: function (name, code) {
		var currentMap = this.history[this.history.length - 1],
			that = this,
			focusPromise = currentMap.setFocus({ region: code, animate: true }),
			downloadPromise = this.downloadMap(code);

		focusPromise.then(function () {
			if (downloadPromise.state() === 'pending') {
				that.spinner.show();
			}
		});
		downloadPromise.always(function () {
			that.spinner.hide();
		});
		this.drillDownPromise = jvm.$.when(downloadPromise, focusPromise);
		this.drillDownPromise.then(function () {
			currentMap.params.container.hide();
			if (!that.maps[name]) {
				that.addMap(name, { map: name, multiMapLevel: currentMap.params.multiMapLevel + 1 });
			} else {
				that.maps[name].params.container.show();
			}
			that.history.push(that.maps[name]);
			that.backButton.show();
		});
	},

	goBack: function () {
		var currentMap = this.history.pop(),
			prevMap = this.history[this.history.length - 1],
			that = this;

		currentMap.setFocus({ scale: 1, x: 0.5, y: 0.5, animate: true }).then(function () {
			currentMap.params.container.hide();
			prevMap.params.container.show();
			prevMap.updateSize();
			if (that.history.length === 1) {
				that.backButton.hide();
			}
			prevMap.setFocus({ scale: 1, x: 0.5, y: 0.5, animate: true });
		});
	}
};

jvm.MultiMap.defaultParams = {
	mapNameByCode: function (code, multiMap) {
		return code.toLowerCase() + '_' + multiMap.defaultProjection + '_en';
	},
	mapUrlByCode: function (code, multiMap) {
		return 'jquery-jvectormap-data-' + code.toLowerCase() + '-' + multiMap.defaultProjection + '-en.js';
	}
};

jQuery.fn.vectorMap('addMap', 'au_merc', { "insets": [{ "width": 900, "top": 0, "height": 1099.3708327378595, "bbox": [{ "y": 1033622.6387222832, "x": 12576510.61983689 }, { "y": 7317287.234959443, "x": 17720633.028951164 }], "left": 0 }], "paths": { "AU-ACT": { "path": "M700.02,565.47l-0.59,-0.6l-0.4,-1.32l0.19,-1.63l-0.24,-2.06l0.63,-3.59l5.85,-4.47l0.9,0.66l0.17,0.97l0.91,0.46l0.23,0.75l2.71,1.27l-0.49,0.29l-1.52,-0.24l-0.86,0.7l-0.74,-0.1l-1.29,1.64l-0.15,1.14l0.25,0.99l-0.38,1.3l-0.57,0.3l-0.3,0.69l0.36,5.43l-0.9,1.56l-1.9,-1.01l-0.8,-3.4l-0.55,-0.16l-0.54,0.44Z", "name": "Australian Capital Territory" }, "AU-WA": { "path": "M5.94,348.45l0.32,0.06l0.06,0.3l-0.32,-0.28l-0.07,-0.08ZM6.89,349.56l0.46,-0.3l0.15,-1.35l0.21,3.04l0.64,1.5l0.6,0.38l0.49,-0.48l-0.54,-1.62l0.13,-1.49l0.29,-0.94l0.63,-0.35l1.01,4.28l-0.34,2.47l0.63,0.21l0.41,-0.23l0.32,-1.95l0.21,3.67l0.4,0.42l0.62,-0.13l0.5,-1.32l-0.0,2.16l0.47,0.11l0.05,0.67l0.69,0.46l0.44,-0.38l0.07,-0.56l1.11,-0.37l0.9,0.12l0.39,-0.94l0.69,-0.42l0.69,-1.18l-0.05,-3.65l-2.17,-2.33l0.44,-0.22l1.48,-2.96l0.05,1.16l0.61,0.48l-0.16,0.87l0.67,3.05l2.4,2.76l0.88,-0.04l1.03,-1.15l0.83,-0.32l0.75,-1.46l-0.76,-2.85l0.7,-2.56l-0.5,-1.35l0.86,-0.15l0.39,-0.55l-0.63,-1.15l0.53,-1.33l-0.08,-0.65l-2.09,-1.36l-0.52,-1.56l-1.56,-1.51l-0.63,-1.62l-1.66,-2.52l-2.46,-6.0l-2.18,-1.49l-0.84,-2.3l0.4,-1.28l-0.27,-0.62l-0.82,-0.48l0.21,-1.76l-0.35,-1.56l-3.26,-4.28l-0.86,-2.36l-0.12,-3.45l0.9,-1.54l-0.33,-2.66l0.79,-1.27l0.07,-1.63l0.81,-1.22l0.48,-1.88l0.65,-0.52l0.81,-2.36l2.6,-2.11l0.69,-1.7l0.26,-2.84l-0.66,-3.42l0.13,-0.7l0.6,-0.47l0.49,-1.09l-0.07,-2.72l-1.02,-3.2l-0.99,-1.08l-0.74,-0.31l0.12,-0.87l-0.48,-1.93l1.61,-1.95l0.31,-1.62l1.1,-1.51l1.83,-5.9l0.94,-2.01l1.62,-2.28l2.04,-0.83l-0.88,2.18l-0.99,5.38l0.9,2.14l-0.27,1.16l0.24,0.4l0.6,0.02l-0.69,1.05l0.12,2.36l0.64,0.54l0.85,0.08l1.07,-1.19l0.98,-0.42l0.35,0.71l0.84,0.28l0.8,-0.59l0.48,-2.52l1.47,-3.73l0.6,-0.41l0.4,-2.35l0.58,-0.1l1.47,-2.63l0.32,-1.39l5.41,-3.11l1.54,-0.01l1.44,-0.76l0.49,0.15l2.29,-1.38l4.98,-2.06l2.93,-3.79l3.75,-2.01l1.24,-2.4l1.04,-1.06l4.27,-1.94l0.5,-0.68l0.31,-1.77l1.54,0.38l1.23,-0.72l2.12,-0.33l1.19,-0.8l0.31,-0.57l1.21,-0.32l2.19,-1.58l1.6,-2.07l-0.55,1.86l1.74,1.38l1.04,-0.12l3.09,-1.75l0.64,0.31l0.8,-0.42l0.89,1.32l3.22,0.98l3.25,-0.45l1.69,-0.99l1.47,0.27l3.39,-1.26l0.69,-1.0l0.88,-0.32l0.4,-1.25l3.92,-2.74l1.58,0.31l1.62,-0.71l0.41,0.48l0.56,0.05l4.67,-1.1l1.52,0.28l1.14,-0.66l1.4,-0.29l3.04,-3.72l0.38,-1.18l1.4,-0.68l0.66,-0.83l0.95,0.72l0.67,-0.31l0.19,-0.6l4.68,1.13l0.56,-0.17l1.05,0.96l1.52,0.3l1.6,-1.14l1.06,-0.22l0.22,-0.78l1.27,0.06l8.46,-1.22l2.65,-0.85l11.43,-4.84l3.45,-2.37l3.66,-3.53l4.07,-5.89l2.45,-5.47l0.14,-0.88l-0.45,-0.74l1.53,-0.32l1.21,-1.13l0.23,-1.1l-0.58,-0.69l1.13,-2.13l0.75,0.31l1.11,-0.21l2.24,-1.7l0.74,-1.27l1.54,-0.83l0.7,-0.9l0.49,-0.08l0.35,-0.69l1.94,-0.93l0.63,-0.79l0.47,-1.36l-0.27,-1.56l-1.7,-0.85l-1.4,0.09l0.23,-0.79l-0.28,-2.18l0.23,-1.86l-1.21,-3.12l0.12,-4.41l0.44,-1.62l1.98,-2.29l-0.05,-1.04l2.61,-2.33l1.04,0.19l0.45,-1.04l0.73,0.67l1.44,0.02l-1.28,-2.47l0.84,-1.24l1.03,0.43l1.39,-0.33l0.67,-0.48l1.27,0.36l0.49,-0.16l-0.07,-0.51l-1.33,-1.38l0.25,-1.82l0.41,-0.56l0.96,-0.06l1.08,-1.18l0.49,-1.7l1.0,-0.47l0.16,0.57l0.63,0.28l-0.72,-0.01l-0.4,0.44l0.04,1.07l-0.49,0.85l0.39,1.27l0.36,0.28l0.51,-0.1l0.39,1.26l1.07,0.46l-0.07,1.09l1.14,0.98l-0.26,1.73l0.98,0.67l1.36,1.62l0.2,1.4l1.88,2.92l0.38,1.76l0.99,0.73l1.21,1.61l0.28,0.96l0.76,0.88l0.31,1.54l0.6,0.15l0.51,-0.84l-0.03,-1.34l-0.5,-1.22l0.12,-1.59l0.52,-0.96l0.33,-1.93l0.64,-0.43l0.02,-0.39l-1.27,-2.01l-0.04,-1.13l0.16,-0.32l0.75,-0.07l0.31,1.05l1.18,0.34l0.69,1.17l1.01,0.65l0.71,1.04l1.45,0.25l0.33,-0.37l-0.06,-0.51l-1.22,-0.82l-0.93,-2.63l0.53,0.37l0.64,-0.19l0.06,-0.79l-0.53,-0.69l0.81,-0.98l1.07,-0.66l0.36,-0.93l-0.09,-0.57l-0.53,-0.44l-0.59,0.27l-0.39,0.92l-1.87,0.57l-1.44,-2.92l-1.95,-1.43l-1.09,-0.31l0.32,-0.78l1.26,-1.17l0.33,-1.59l-1.58,-0.83l2.5,0.47l0.38,-0.24l-0.4,-0.74l0.4,-0.24l0.12,-0.58l-0.39,-0.93l-1.02,-0.13l-0.72,-0.67l-0.98,-0.01l0.36,-0.77l-0.27,-0.87l0.59,-0.02l0.15,-0.39l1.34,-0.11l1.46,0.29l-0.33,0.51l0.26,0.52l-0.62,0.12l-0.15,0.71l1.44,1.03l1.04,0.34l-0.44,0.17l-0.18,0.48l0.59,1.34l1.24,-0.13l0.12,-1.46l1.13,0.79l0.63,-0.18l0.08,-0.51l-0.67,-1.2l0.6,-0.45l-0.18,-0.44l0.78,0.38l1.26,0.03l0.98,0.56l0.58,1.51l0.74,0.59l2.45,0.24l0.87,-1.12l1.58,0.84l2.36,0.16l3.27,-0.33l0.74,0.67l0.84,0.16l1.44,-0.55l-0.17,-0.71l-1.25,0.04l-2.78,-1.22l-2.48,-0.38l-1.84,0.39l-1.16,-0.14l-0.33,-2.14l0.18,-0.61l0.64,-0.46l0.11,-1.1l1.0,1.61l0.73,-0.03l0.45,-0.87l0.58,-0.14l0.46,-0.5l-0.2,-2.28l0.57,-0.55l-0.1,-1.32l0.41,-0.42l0.53,0.34l0.49,-0.25l0.4,-1.08l0.38,-0.23l-0.07,-0.72l-0.69,-0.25l-1.75,0.08l-1.46,1.78l-0.6,1.37l-0.81,-2.08l-0.7,-0.49l-0.2,0.32l-0.33,-1.18l-0.06,-1.51l0.7,-0.3l0.19,-0.56l-0.02,-0.72l-0.5,-0.51l0.05,-0.67l0.82,-0.35l0.34,-0.98l2.26,0.84l0.76,-0.13l0.25,-0.63l0.76,0.01l0.4,-0.53l-0.32,-0.67l0.16,-0.62l1.83,-1.72l0.55,1.15l1.45,-0.07l0.9,1.03l0.57,0.19l-0.3,0.92l0.42,0.42l0.53,-0.09l0.73,0.49l0.51,-0.26l0.09,-0.64l1.99,1.28l0.49,-0.11l-0.25,-0.81l-1.84,-1.61l0.28,-1.07l1.1,-0.77l-0.42,-0.52l-0.96,-0.56l-0.36,0.36l-0.82,-0.43l-2.17,1.14l-0.28,-0.72l0.73,-0.86l1.47,-0.09l1.01,-1.25l-0.16,-0.59l-0.83,-0.28l-0.6,0.52l-0.5,-0.15l-1.43,1.25l-0.27,-0.12l0.24,-0.69l-0.34,-0.48l0.14,-0.36l0.52,-0.15l0.99,0.55l0.65,-0.04l0.49,-0.74l0.48,-0.02l0.17,-1.29l0.13,0.4l0.81,0.11l1.03,2.15l0.71,-0.11l0.19,-1.01l-0.26,-1.0l1.0,0.41l0.48,0.47l0.03,0.58l0.82,0.52l1.06,-0.24l1.15,0.24l0.6,-0.33l-0.05,-0.95l-0.96,-0.11l0.27,-0.27l-0.11,-0.59l0.95,-0.81l-0.22,-0.51l-1.09,0.02l-1.04,-0.54l-0.53,0.06l-0.29,-0.58l0.42,-0.25l0.31,-1.09l-0.4,-0.49l-1.8,-0.47l-0.19,-1.23l-0.7,-0.32l0.89,-0.59l0.26,-0.68l0.74,0.09l0.98,-0.83l-0.16,-0.69l-0.97,-0.05l0.39,-0.4l1.04,-0.18l0.07,0.83l1.18,-0.87l0.82,1.54l0.41,-0.21l0.1,-0.85l0.97,-1.23l0.52,0.58l1.13,-0.19l0.53,-1.22l0.26,-1.96l-0.52,-1.15l0.17,-2.02l1.49,1.36l-0.93,-0.01l-0.19,0.79l0.49,2.98l-0.87,1.74l-0.03,0.92l0.66,0.29l0.29,-0.25l1.24,-3.15l1.23,-0.14l0.45,2.45l1.9,1.28l0.49,-0.36l-0.02,-2.06l1.02,0.51l1.35,-0.91l-0.14,-1.25l-0.83,-1.25l1.38,-0.76l0.31,-1.18l-0.26,-1.08l1.41,-0.7l0.21,-1.3l0.27,0.6l0.64,0.4l0.06,0.68l1.56,0.41l0.5,-0.8l0.86,-0.5l-0.78,-1.2l0.56,-1.21l0.83,-0.33l0.67,-0.97l0.92,0.18l-0.82,1.15l0.08,0.52l0.74,0.2l0.6,1.21l0.82,-0.03l0.13,1.14l1.05,0.61l0.31,-1.2l0.76,-0.49l0.04,-0.9l0.8,0.35l0.76,-1.02l0.38,-1.46l-0.19,-0.22l0.63,-0.21l0.76,0.2l0.55,-0.37l0.35,-0.89l-1.05,-0.66l-0.84,-1.97l0.52,-0.16l0.21,0.6l0.44,0.14l1.16,-0.8l-0.54,-0.68l0.99,0.37l0.36,-0.13l0.12,-0.6l1.07,0.85l0.0,0.73l0.89,0.61l-0.19,0.47l0.41,0.56l0.3,-0.04l0.3,1.11l0.58,0.47l0.5,-0.04l0.49,-0.66l0.77,0.33l0.67,-0.96l1.6,1.23l0.53,-0.61l0.9,0.68l0.4,-0.19l0.24,1.85l0.68,0.57l0.59,-0.13l2.94,2.06l0.67,1.17l1.11,0.99l0.6,1.54l0.68,0.38l0.04,0.99l0.57,0.42l0.02,0.47l0.77,0.15l0.91,0.77l0.26,1.17l0.6,0.16l0.71,-0.28l1.02,1.34l0.83,0.23l1.51,1.14l-0.34,0.76l0.28,1.13l-1.32,0.51l0.14,1.06l-1.25,4.26l0.3,1.51l-0.16,1.94l-0.63,0.53l0.55,2.07l-1.06,1.55l0.25,0.66l0.94,-0.14l1.2,-1.41l0.38,-1.95l-0.14,-2.5l1.66,1.43l0.9,2.43l0.52,0.34l0.4,-0.37l0.04,-2.35l-1.41,-1.78l0.12,-0.85l-0.57,-1.93l1.54,-1.66l0.27,-0.8l0.57,2.31l0.29,0.18l0.58,-0.52l1.07,0.57l0.56,-0.24l0.25,-1.08l-1.04,-2.34l0.62,-0.53l-0.03,-0.35l-0.59,-0.54l2.09,-0.8l1.06,0.48l2.25,0.36l0.62,0.52l3.54,0.37l1.23,0.51l0.0,357.93l-4.25,2.01l-2.27,1.56l-8.46,3.92l-3.88,1.51l-4.93,0.91l-3.93,1.43l-0.69,0.62l-4.63,1.4l-4.58,0.69l-5.23,-0.04l-2.0,0.33l-5.87,-0.77l-3.58,-1.14l-1.19,0.28l-1.09,0.79l-1.5,-0.12l-2.76,1.42l-6.43,4.93l-3.83,1.21l-4.74,2.57l-1.84,0.57l-2.04,2.3l-1.23,0.73l-2.37,0.82l-7.71,1.46l-3.07,2.46l-1.44,2.14l-0.51,2.32l-1.18,2.33l-1.05,4.86l-1.14,0.48l-0.66,1.07l-1.99,1.9l-0.52,1.21l-0.01,0.9l-1.48,0.83l-0.51,0.75l-1.1,0.23l-0.78,1.21l-1.02,-0.9l-1.69,-0.2l-0.93,0.4l-1.47,1.9l-1.7,0.43l-0.71,-2.31l-0.68,-0.7l-1.47,-0.45l-3.52,1.0l-1.28,-0.63l-0.81,0.32l-2.47,0.1l-0.78,0.43l-0.06,0.89l-0.59,-0.43l-0.68,0.27l-1.93,-0.65l-1.03,-0.01l-1.58,0.86l-0.35,1.41l-0.71,-0.42l-0.6,0.6l-1.4,-0.03l0.38,-0.84l-0.77,-2.26l-1.38,-1.52l-1.71,0.18l-1.2,1.0l-1.35,0.55l-1.89,-0.92l-1.21,0.45l-0.52,-0.59l-1.51,-0.74l-3.88,-0.1l-2.22,0.56l-1.09,0.62l-1.39,-0.53l-2.42,0.59l-1.97,-0.28l-2.45,0.82l-3.58,0.06l-0.8,1.06l-2.26,0.8l-2.36,-0.79l-2.06,-0.17l-1.4,0.48l-1.08,-0.6l-0.94,-0.0l-1.51,0.88l-2.49,0.59l-1.49,1.5l-1.74,0.86l-0.54,0.42l-0.02,0.49l-0.82,0.46l-2.0,3.61l-0.06,1.43l0.96,0.92l-0.3,0.07l-0.78,-0.66l-0.97,-0.03l-0.6,0.57l-0.17,0.63l0.28,1.13l-0.23,0.2l-0.29,-0.62l-0.51,-0.22l-0.82,0.22l-0.46,0.48l-0.32,1.31l-0.43,-0.67l-1.13,-0.17l-0.68,-0.51l-3.6,-0.63l-0.78,0.29l-1.08,-0.13l-0.3,0.67l0.59,0.65l-1.4,0.27l-1.36,1.01l-0.17,0.92l0.36,0.63l-0.24,0.29l-2.04,1.1l-2.6,0.74l-0.91,0.69l-1.12,2.12l0.21,1.7l-2.27,0.08l-2.16,0.86l-0.25,0.56l0.79,1.13l-0.91,-0.67l-0.71,-0.02l-1.43,0.59l-1.98,-0.16l-1.58,0.47l-0.48,0.42l-0.01,0.64l-1.28,-0.48l-1.67,-0.05l-0.77,0.47l-0.46,1.4l-1.08,-0.84l-1.47,-0.36l-2.53,-1.43l-0.54,0.31l-2.48,-0.54l-0.58,0.28l-0.44,0.77l-1.47,-0.68l-0.99,0.11l-1.07,-0.35l-1.44,0.97l-2.58,-1.08l-2.24,0.88l-0.82,-0.58l-2.27,-0.5l-0.79,-0.79l1.28,0.31l0.47,-0.34l-0.0,-0.57l-2.41,-1.95l-0.71,0.18l0.2,1.18l-5.23,-1.84l-2.03,-0.17l0.05,-0.48l-0.98,-1.95l-3.69,-4.35l-2.69,-2.31l-1.6,-0.7l-0.48,-0.72l-3.35,-1.7l-1.53,-0.41l-1.79,0.12l-0.96,1.12l-1.83,-2.18l-0.01,-1.89l-0.75,-1.89l-0.2,-5.2l0.5,-1.7l-0.58,-2.4l0.89,-1.47l-0.24,-1.86l1.81,2.0l1.62,0.75l1.86,0.17l1.82,-0.5l1.37,-0.88l1.71,-2.05l1.16,-2.04l0.95,-2.69l0.59,0.16l0.74,-0.29l0.36,-0.87l-0.09,-1.99l-0.67,-0.25l0.08,-3.64l-1.42,-8.25l0.99,2.57l0.63,0.41l0.55,-0.19l0.2,-0.64l-0.87,-2.48l1.23,-0.05l0.54,-1.04l-0.13,-0.71l-0.94,-0.94l0.61,-2.67l-0.57,-1.18l0.35,-0.93l-0.56,-0.88l0.58,-0.48l0.42,-1.92l-0.54,-2.64l0.28,-3.32l-0.44,-3.6l-0.82,-2.91l-4.41,-7.91l-2.75,-7.1l-1.47,-2.59l-1.1,-1.16l-0.35,-1.84l-1.97,-4.98l-0.11,-1.67l-0.85,-2.83l0.23,-1.29l-0.92,-1.11l0.25,-1.58l-0.88,-2.5l0.48,-2.93l-0.39,-1.65l-0.03,-3.76l0.64,-4.08l-2.68,-8.39l-3.72,-4.44l-0.92,-1.57l-0.41,-1.15l0.27,-0.7l-0.12,-2.13l-1.2,-3.11l-2.12,-2.71l-2.19,-3.77l-1.31,-0.89l-1.48,-1.82l-1.28,-5.22l0.07,-1.27l0.82,-2.6l-1.36,-5.33l-1.24,-2.99l-4.84,-8.7l-3.39,-5.3l-5.65,-5.99l-0.03,-1.37l-0.85,-1.71ZM16.31,348.92l-0.06,-0.01l-0.37,-0.11l0.27,-0.0l0.17,0.11ZM15.71,348.76l-0.46,-0.13l-0.09,-0.72l-1.37,-1.93l-0.62,-0.24l-0.34,-2.84l-0.72,-0.71l-0.19,-1.35l-1.78,-2.75l0.05,-1.32l1.14,-2.12l0.28,1.43l1.02,0.48l0.89,2.08l1.03,1.11l0.74,0.29l-0.04,1.3l0.71,0.59l-0.46,0.88l-0.59,4.42l0.79,1.53ZM206.79,145.67l-0.28,0.5l-0.5,-0.49l0.26,-0.29l0.52,0.28ZM229.82,121.39l0.05,-0.59l0.39,0.11l-0.24,0.55l-0.19,-0.06ZM240.57,113.63l-0.19,0.09l-0.54,-0.27l0.26,-0.15l0.47,0.33ZM96.47,550.25l0.13,0.06l-0.11,-0.04l-0.02,-0.02ZM96.72,550.35l0.64,-0.23l0.43,0.35l-0.84,-0.03l-0.23,-0.08ZM258.13,97.07l-0.23,-0.55l0.49,0.26l-0.25,0.29ZM257.74,96.31l-0.76,-0.39l-1.87,-0.02l-0.12,-0.24l0.66,0.03l0.28,-0.32l0.85,0.27l0.19,-0.35l0.19,0.18l0.79,-0.4l-0.22,1.25ZM257.01,94.21l-0.58,-0.66l0.06,-0.09l0.68,0.24l-0.16,0.51ZM245.37,105.43l-0.08,-0.36l0.01,-0.16l0.37,0.19l-0.29,0.33ZM236.21,115.43l-0.17,-0.46l0.27,-0.04l-0.07,0.17l-0.03,0.34ZM224.7,137.03l0.01,-0.4l0.02,0.2l-0.02,0.2ZM23.91,265.95l0.05,-0.07l0.02,-0.05l-0.03,0.11l-0.04,0.02ZM18.82,344.1l-0.09,-0.38l-0.13,-0.27l0.27,0.3l-0.05,0.35ZM301.08,113.02l0.41,0.92l0.51,0.77l-0.8,-0.94l-0.12,-0.76ZM296.68,117.0l0.5,0.3l0.15,0.63l-0.55,-0.38l-0.1,-0.54ZM237.6,106.69l0.07,-0.58l0.6,0.2l0.22,-0.4l0.03,-0.91l-0.37,-0.38l0.45,-0.33l0.42,0.26l-0.5,0.89l0.35,0.99l-0.87,0.41l-0.39,-0.15ZM231.75,120.2l0.07,-0.14l0.27,0.08l-0.15,0.17l-0.2,-0.11ZM225.47,122.04l0.06,-0.32l0.49,0.04l0.21,-0.82l0.87,1.06l-0.97,-0.2l-0.68,0.24ZM227.58,122.48l0.18,0.31l-0.84,0.32l0.48,-0.34l0.17,-0.3ZM46.88,234.38l0.41,-1.03l1.75,-2.0l0.24,1.19l-0.58,1.27l-0.87,0.94l-0.96,-0.38ZM0.76,333.48l0.54,0.08l0.93,4.65l1.59,3.46l-0.4,1.39l-0.61,-0.47l-0.62,-1.94l-1.05,-1.37l-0.06,-1.76l-0.68,-1.46l0.01,-2.13l0.35,-0.45ZM3.94,343.78l0.48,0.04l0.78,1.13l0.29,1.73l-0.51,-1.5l-1.04,-1.4Z", "name": "Western Australia" }, "AU-TAS": { "path": "M683.97,681.45l0.16,-0.59l1.06,-0.61l1.07,-0.12l1.4,0.39l0.34,-0.59l1.14,-0.18l0.89,-0.66l2.28,2.54l-1.12,1.2l-0.57,0.1l-0.64,-1.29l-0.83,0.02l-0.91,0.51l-0.79,-0.37l-0.55,0.29l-1.68,0.03l-1.25,-0.66ZM618.05,696.62l0.46,-1.08l-0.3,-0.63l0.51,-0.66l0.72,-0.29l0.3,-0.68l-0.2,-5.11l0.93,1.73l0.7,-0.24l1.82,0.71l1.69,0.0l1.76,1.57l0.82,0.36l0.63,-0.05l0.42,-0.62l1.76,-0.06l1.63,1.33l2.11,0.63l1.22,-0.38l0.23,0.73l0.87,0.7l2.85,0.64l0.66,1.39l1.11,1.0l1.95,0.34l0.32,0.49l0.97,0.14l1.95,1.26l2.67,1.08l2.84,0.36l1.52,-0.06l2.09,-0.73l0.38,0.88l0.73,0.2l0.28,-0.12l-0.01,-0.84l1.19,-1.35l1.51,-0.61l0.62,0.46l0.24,0.69l-0.2,0.54l0.42,0.63l0.96,0.28l0.81,-0.31l1.04,0.24l0.33,-0.79l-0.81,-0.78l-1.51,-0.65l0.19,-1.1l1.74,-0.52l1.44,-0.93l3.19,0.64l1.95,-1.43l0.44,0.17l0.59,-0.25l0.27,0.6l0.62,0.2l0.5,0.67l1.02,0.06l1.55,-1.53l1.34,-2.53l1.01,-0.52l0.89,0.89l0.95,-0.1l1.14,0.85l1.67,-0.5l0.77,-0.74l0.94,-2.66l0.66,0.11l0.49,0.66l0.52,-0.11l1.16,1.67l1.3,0.19l1.45,2.02l0.77,1.73l-1.07,1.01l0.59,0.74l-0.59,1.45l-0.12,1.58l0.21,1.02l0.79,1.18l-1.29,1.54l0.07,0.54l0.67,0.23l0.64,-0.61l-0.9,3.03l0.03,2.23l0.65,1.81l-0.56,2.12l0.36,1.57l-0.84,1.48l1.22,3.05l-0.48,3.4l1.16,1.6l-0.99,-0.27l-0.94,-0.98l-0.71,-0.27l0.93,-0.61l0.24,-1.01l-0.67,-0.64l-0.3,-0.88l-0.8,0.01l-0.22,0.41l0.21,0.72l-0.87,0.59l0.13,0.98l-0.45,0.56l0.2,0.49l-0.7,0.27l-0.4,0.59l-0.15,2.11l-0.73,0.8l-1.41,2.94l0.02,0.49l0.48,0.1l0.73,-0.48l-0.5,0.81l0.04,3.75l-0.61,0.63l-0.52,-0.69l-0.66,0.32l-0.43,0.97l0.89,1.15l0.36,1.56l-0.1,1.6l-1.21,1.06l-0.09,1.59l-0.64,0.77l-0.11,0.92l-2.61,-0.02l-0.41,-0.57l-0.64,-0.22l-0.4,-0.96l-0.61,-0.19l-1.9,1.01l0.1,1.75l-0.45,-0.4l-0.69,0.32l-0.23,-0.79l-1.06,-0.7l-1.09,-2.05l-0.58,-0.27l-0.71,0.39l-0.1,0.52l1.14,1.48l0.75,1.83l-0.55,1.38l-0.01,1.19l-0.47,-0.48l-0.6,0.03l-0.34,0.43l0.1,0.84l0.68,0.86l-1.0,1.21l0.19,3.31l-0.55,0.52l-0.64,-0.35l-0.22,-0.83l-0.88,-0.09l0.39,-0.88l-0.25,-1.03l-0.37,-0.33l-0.84,1.1l-0.39,-0.14l-0.13,-1.76l-0.3,-0.32l-0.62,0.01l-0.65,0.62l-0.29,1.38l0.18,0.96l1.9,1.5l0.58,0.85l-0.31,0.34l-0.45,-0.31l-0.93,0.11l-0.89,0.8l0.36,0.62l1.28,-0.03l-0.92,1.55l-1.55,0.32l0.09,0.45l0.77,0.53l-0.6,0.83l0.3,0.86l-0.98,0.16l-0.15,0.7l0.34,0.6l0.59,0.28l-0.15,0.33l-1.23,0.66l-0.87,-0.78l-1.75,0.41l-0.59,-0.98l-1.32,-0.81l-0.33,-1.49l-0.67,-0.85l-0.6,0.19l-0.1,1.15l-0.5,0.35l-2.33,-0.16l-0.58,-0.52l-0.6,0.01l-0.53,0.57l-0.43,-1.0l-0.74,-0.25l-0.76,0.26l-0.26,0.56l-0.81,-0.23l-0.89,0.37l-0.23,0.53l-0.75,0.17l-0.05,-2.2l-1.03,-1.46l0.61,-0.49l-0.17,-0.39l1.65,0.37l0.92,1.34l0.68,-0.16l0.2,-0.94l0.54,0.63l0.72,-0.46l-0.24,-2.19l-1.02,-1.01l-0.64,-0.18l-0.9,1.4l-0.24,-0.91l-0.46,-0.39l-0.68,0.26l-0.24,0.78l-0.69,-0.81l-0.27,-1.58l-0.94,-0.87l-0.71,0.22l0.02,1.12l-0.63,0.22l-0.29,0.7l0.48,0.54l-0.37,-0.07l-0.57,-1.27l-0.08,-1.01l-1.37,-1.85l-0.02,-0.82l-0.6,-0.41l-0.55,0.08l0.32,-0.99l-0.21,-0.44l-0.92,-0.55l-1.09,-1.71l-1.36,-0.12l-1.1,-1.89l-1.01,-2.81l-0.54,-0.51l0.35,-0.91l-0.67,-1.84l-1.57,-1.47l0.44,-0.65l-0.04,-0.5l-0.9,-1.3l-0.22,-0.92l0.15,-1.04l-0.67,-2.38l-0.11,-1.7l1.35,0.68l0.4,0.9l2.03,1.5l0.74,3.54l0.54,0.13l0.34,-0.39l0.06,-1.83l0.73,-0.33l0.74,-2.22l-0.46,-0.49l-0.38,0.11l-0.59,-0.71l-0.57,0.26l-1.75,-2.23l-0.56,-2.5l-0.9,-0.07l-0.87,0.96l0.41,-1.22l-0.29,-2.15l-0.91,-2.07l-2.83,-3.06l-0.15,-0.77l-1.85,-2.81l-0.76,-0.3l-0.09,-1.26l-0.93,-2.78l-1.41,-2.58l-0.76,-0.71l0.55,-0.58l-0.04,-0.81l-1.88,-3.64l0.15,-1.32l-0.45,-1.35l0.1,-1.09l-1.11,-1.86ZM630.12,727.44l-0.0,0.22l0.0,0.02l-0.07,-0.07l0.07,-0.17ZM642.41,756.76l0.21,-0.03l-0.09,0.04l-0.12,-0.01ZM673.76,746.75l0.77,1.64l-0.9,0.99l0.28,-0.88l-0.33,-0.67l0.18,-1.07ZM680.86,746.46l0.9,0.07l1.11,-0.6l0.36,0.67l-0.22,0.67l0.37,0.77l-0.69,0.51l-0.43,2.62l0.48,0.76l-0.22,0.66l0.32,0.59l0.39,0.06l-0.48,1.03l-0.85,-0.91l-0.26,-1.05l-0.62,-0.09l-0.59,0.76l-0.04,1.03l-0.79,0.81l-1.49,-1.65l-0.04,-0.34l0.9,-0.75l-0.16,-0.63l-1.8,-0.78l-0.42,-1.06l1.18,-0.89l0.15,-0.98l-0.14,1.7l0.96,0.91l1.19,0.47l1.47,-0.39l0.69,-0.62l-0.27,-0.69l-0.46,-0.02l-0.43,-0.55l0.34,-0.86l-0.55,-0.46l0.15,-0.75ZM681.97,745.42l-0.17,-0.07l0.03,-0.06l0.08,-0.05l0.07,0.18ZM689.94,727.56l0.34,0.36l-0.53,1.26l-0.54,-0.31l0.73,-1.32ZM679.48,667.85l1.58,-1.07l0.47,-1.69l1.13,-0.85l3.84,5.25l1.03,0.56l1.4,0.23l-0.16,2.47l-1.15,1.17l0.19,0.59l0.42,0.17l1.11,-0.45l0.22,0.69l-0.66,0.2l0.01,0.92l-1.33,-0.26l-0.4,0.32l-0.2,0.87l-0.94,0.42l-1.14,-0.59l0.13,-1.02l-0.75,-0.81l-0.27,-1.61l-0.97,-0.57l-0.36,-1.07l-0.79,-0.36l0.34,-1.12l-0.56,-2.1l-0.77,-0.27l-0.75,0.43l-0.65,-0.46ZM689.4,676.45l0.08,0.04l-0.06,-0.02l-0.02,-0.02ZM686.07,684.61l0.24,-0.2l1.39,-0.42l-0.5,1.62l-1.14,-1.01ZM684.56,741.36l0.05,-0.13l0.14,-0.57l0.27,0.6l-0.47,0.1ZM684.73,740.11l-0.49,-0.46l0.16,-0.69l0.89,-0.64l0.61,0.11l0.47,1.28l-1.39,0.03l-0.24,0.37ZM670.3,753.24l0.76,-0.13l0.26,-0.62l-0.45,-0.42l0.08,-0.32l0.52,0.59l0.35,1.5l-1.52,-0.6ZM671.97,754.39l0.21,0.81l-0.87,0.06l0.4,-0.41l0.26,-0.46ZM670.6,657.67l-0.05,0.01l0.08,-0.13l0.0,0.0l-0.03,0.12ZM666.95,761.41l0.52,0.17l-0.26,0.42l-0.15,-0.23l-0.12,-0.37ZM668.02,759.85l-0.06,-0.55l0.23,0.27l0.67,-0.12l0.33,-0.86l-0.21,-0.69l0.93,-1.19l0.9,2.66l-0.91,2.78l-0.89,-0.51l0.21,-0.18l-0.24,-1.27l-0.43,-0.39l-0.54,0.05ZM623.02,688.03l0.62,-0.71l1.44,1.02l-2.03,0.73l-0.02,-1.04ZM622.55,682.1l0.6,-0.6l0.04,-0.49l0.75,0.25l-0.21,0.89l-0.71,0.34l-0.47,-0.39ZM619.95,683.46l0.7,-0.18l-0.41,0.85l-0.09,-0.42l-0.2,-0.25ZM603.2,664.74l0.12,-1.15l0.97,-0.47l0.67,-0.76l-0.18,-1.74l0.48,-0.15l1.68,1.21l0.48,1.08l-0.13,1.14l0.4,2.12l-0.4,2.18l0.72,0.74l-0.07,1.44l-0.46,1.09l-1.1,1.03l-2.35,1.25l-0.43,-1.25l0.34,-0.69l-0.13,-1.79l-0.93,-0.9l0.09,-1.56l0.47,-1.23l-0.24,-1.59Z", "name": "Tasmania" }, "AU-": { "path": "M735.21,551.88l0.62,-0.51l1.33,0.12l-0.1,0.47l-0.65,0.28l-0.54,-0.42l-0.65,0.05Z", "name": "Jervis Bay Territory" }, "AU-VIC": { "path": "M546.94,525.19l0.92,1.0l1.88,0.1l1.14,0.6l0.92,-0.3l1.11,0.78l0.42,0.69l1.43,-0.11l1.2,0.78l0.98,0.1l0.26,0.74l0.48,0.34l0.86,-0.21l1.2,-1.5l1.33,-0.84l0.69,-0.13l1.81,0.63l3.91,-0.37l1.11,1.31l0.93,-0.28l0.84,0.75l0.63,0.01l0.34,1.65l0.99,1.19l0.88,0.69l0.93,-0.09l-0.6,1.67l0.27,2.64l1.62,1.77l-0.01,0.69l1.05,2.0l0.03,0.79l0.64,0.66l1.44,0.52l0.81,-0.11l0.23,-0.54l-0.25,-0.69l1.09,-0.15l0.67,-3.04l0.9,-0.38l0.98,0.74l0.44,1.26l0.57,0.24l0.73,-0.44l0.83,0.68l0.72,-0.35l0.81,0.46l1.75,0.16l2.23,1.21l0.19,0.7l0.44,0.31l0.68,-0.21l0.36,0.27l-0.0,1.26l-0.41,0.59l-0.13,1.77l0.67,3.55l1.19,2.09l3.06,1.35l0.15,1.07l-0.29,0.68l0.3,0.8l1.34,0.92l2.42,0.69l2.41,1.76l1.49,0.69l0.49,0.85l1.87,0.68l1.54,2.17l1.92,1.7l0.98,0.2l0.45,0.44l1.97,4.11l0.84,0.37l2.17,2.56l1.53,0.43l1.35,1.29l1.64,-0.17l1.33,-1.22l1.3,0.52l0.68,-0.26l0.23,-0.7l-0.97,-1.74l0.53,-1.16l0.16,-1.33l0.47,-0.4l3.91,-0.38l2.24,0.59l0.92,-0.07l2.32,-1.05l1.25,0.29l3.31,2.89l0.93,0.43l1.12,0.1l1.88,-0.4l0.9,1.15l1.48,0.07l3.0,0.92l0.72,-0.47l2.57,0.39l0.49,-0.29l0.85,-1.43l0.61,0.18l0.54,-0.28l0.77,0.44l1.43,0.0l1.14,1.09l1.29,0.13l1.71,1.13l0.9,-0.05l1.01,0.64l0.84,-0.09l0.58,-0.52l0.4,0.22l0.19,2.07l0.97,1.12l0.59,0.23l1.74,-0.5l0.24,-0.58l-0.39,-0.45l-1.21,-0.23l-0.36,-0.52l-0.26,-1.34l0.74,-1.18l0.77,0.52l1.88,-0.35l0.98,0.52l0.66,-0.1l0.77,-2.25l0.38,-0.36l1.32,-0.28l1.24,1.17l3.15,-1.34l3.6,1.49l0.64,0.91l1.01,0.37l-0.15,1.19l1.01,1.29l-0.25,1.5l0.9,2.64l-0.34,0.95l0.15,0.72l1.26,1.26l0.38,2.51l0.99,0.7l0.24,0.56l-0.16,1.1l-1.59,2.65l0.17,0.67l1.89,0.36l33.71,17.08l-2.55,0.53l0.06,-0.79l-0.46,-0.26l-0.52,0.32l-1.19,-0.03l0.84,1.85l-1.6,2.44l-1.02,0.34l-0.53,0.65l-1.58,0.5l-0.5,0.7l-2.64,0.02l-1.21,0.53l-0.51,-0.46l-1.51,0.02l-0.93,-0.32l-0.76,0.31l-5.9,0.21l-1.24,0.62l-2.32,-0.3l-5.87,0.31l-3.47,0.84l-4.17,1.52l-3.15,1.67l-3.36,2.42l-3.78,3.46l-10.28,10.87l-0.55,-0.15l-2.69,0.62l-1.41,-0.02l-0.93,0.61l-1.34,-0.06l-1.74,0.8l-1.19,-0.95l-1.92,0.18l-0.82,0.45l-0.81,1.04l0.02,0.52l1.02,1.49l0.45,0.21l0.34,1.83l0.44,0.44l0.85,-0.11l0.84,-1.04l0.98,-0.26l0.66,-1.44l0.16,2.67l-0.55,0.67l-0.38,1.83l0.88,1.0l-0.78,0.5l-0.08,1.06l-0.36,0.21l-1.01,-0.71l0.38,-1.1l-1.15,-0.94l-0.75,-2.23l-1.44,-1.87l-2.06,-1.28l-1.45,0.3l-0.46,0.61l-0.12,1.13l-0.92,0.17l-0.41,-1.75l-1.39,-2.68l0.55,-0.55l-0.93,-1.36l-1.88,-0.39l-2.36,1.01l-1.49,-2.38l-2.02,-0.92l0.47,-0.47l-0.03,-1.96l1.19,0.16l1.33,-1.41l-0.12,-0.59l-0.67,-0.66l0.0,-0.94l-1.24,-1.86l-0.81,-0.23l-2.04,0.36l-1.11,-0.2l-0.5,0.27l-0.6,1.68l-0.62,0.72l0.44,1.71l-1.9,-0.06l-0.54,0.79l-0.68,0.31l-0.5,1.06l-1.7,0.27l-2.37,-2.33l1.69,-0.16l2.16,-1.08l0.11,-0.88l2.38,-3.49l0.27,-0.98l-0.43,-2.17l-0.59,-0.79l-1.02,-0.56l-0.9,-2.44l-1.27,-0.91l-0.46,0.05l-0.4,0.68l-1.39,0.05l-0.59,1.17l-1.27,0.58l-1.19,1.2l-2.27,0.81l-0.81,1.38l-0.56,-0.22l-1.55,0.2l-0.81,0.58l-0.2,0.7l0.52,0.71l2.9,0.57l0.96,-0.15l1.7,-1.09l0.72,0.38l0.22,0.26l-0.14,0.82l-0.83,0.67l-0.4,1.07l-1.98,0.04l-0.77,0.32l-0.98,-0.32l-1.01,0.35l-2.88,2.43l-3.91,2.15l-1.11,1.26l-0.14,0.85l-1.02,0.48l-0.69,1.42l-1.07,1.09l-2.67,0.9l-0.87,1.51l-1.02,0.48l-1.19,1.21l-1.46,-1.42l-1.93,-1.02l-2.55,-0.02l-1.98,-2.19l-1.23,-0.82l-2.26,-0.46l-2.59,-0.99l-3.0,-2.58l-2.67,-1.7l-0.48,-0.83l-0.71,0.09l-0.32,0.49l-0.91,-0.73l-1.82,-0.04l-1.76,0.95l-0.79,-0.14l-4.4,-2.85l-3.86,-0.56l-1.83,0.58l-0.87,0.66l-0.42,1.16l0.58,1.01l-0.72,-0.13l-0.8,0.86l-0.59,-0.99l-1.33,-0.41l-0.67,0.26l-0.24,0.51l0.27,-1.7l-0.58,-0.98l-3.17,-2.96l-4.62,-2.71l-0.02,-96.83ZM654.56,639.84l0.36,0.1l0.53,-0.07l-0.26,0.31l-0.63,-0.35ZM631.27,628.82l1.22,0.39l1.12,-0.21l0.53,0.62l-1.1,0.18l-1.1,1.15l-0.91,-0.46l-0.2,-0.78l0.44,-0.88ZM628.4,633.36l0.79,-0.76l1.6,-0.14l0.11,0.96l-0.69,-0.16l-1.08,0.39l-0.72,-0.29Z", "name": "Victoria" }, "AU-NT": { "path": "M313.75,112.68l1.19,0.46l0.59,0.99l1.02,0.49l-0.18,1.36l0.45,1.17l-0.88,2.07l0.42,0.54l0.68,-0.25l0.5,0.53l0.36,-0.31l0.52,-2.28l0.44,-0.42l-0.67,-4.27l0.39,0.23l0.59,-0.52l3.5,1.67l0.28,0.98l1.07,0.77l0.54,1.21l-0.21,1.11l0.63,0.38l0.96,-0.62l0.11,0.89l0.58,0.38l1.24,-0.32l0.01,-0.88l-1.36,-1.62l-0.51,-1.3l-0.27,-1.39l0.55,-1.75l2.7,0.42l1.51,-0.53l1.12,-0.97l0.67,0.36l0.6,-0.38l0.14,-1.82l-0.21,-0.31l-0.72,0.13l-0.33,0.65l-2.61,1.03l0.11,-0.44l-0.39,-0.44l-1.46,0.47l-0.69,-0.54l-0.07,-0.71l-1.15,-0.9l-0.25,-0.7l2.17,-0.22l1.59,-1.4l0.07,-0.44l-0.9,-0.2l-1.82,0.84l-2.39,-0.55l-3.23,-2.53l0.24,-1.33l0.68,-0.85l0.23,-1.06l1.27,-1.46l0.2,-1.81l0.45,0.48l1.25,0.02l0.42,-1.02l1.96,-0.39l0.54,-0.62l0.33,-1.53l-0.64,-1.1l1.86,-1.96l-0.54,-1.66l0.85,-2.09l0.15,-1.3l0.61,-0.43l0.37,0.57l1.11,0.4l1.68,-0.52l1.29,-1.0l0.64,0.03l2.24,-2.67l1.27,0.48l0.46,-0.5l-0.46,-0.93l-1.4,-0.62l-1.57,-2.1l-0.73,-0.23l0.22,-3.99l0.56,-0.25l0.98,0.53l2.06,-0.87l0.72,-1.42l0.17,-2.03l-0.26,-1.01l0.64,0.12l0.95,-1.06l1.55,0.39l0.4,0.63l1.4,0.71l1.66,-0.36l0.19,-0.39l-0.27,-0.49l-1.75,-0.32l-0.19,-0.29l0.7,-0.66l-0.24,-0.72l-0.44,-0.15l0.43,-1.19l-0.23,-0.88l0.5,-0.67l-0.36,-0.45l2.67,0.75l0.26,2.95l0.36,0.29l0.55,-0.78l1.33,1.75l0.46,0.09l0.2,-0.74l0.76,0.45l0.47,-0.03l0.12,-0.45l-0.34,-0.73l-1.33,-1.05l1.15,0.51l0.52,-0.51l-0.83,-1.18l-1.37,-0.91l-0.55,0.17l0.06,-0.37l1.18,-1.21l2.56,0.72l0.58,-0.35l-0.48,-1.43l-0.05,-1.47l-0.53,-0.78l0.29,-0.46l0.72,0.37l0.68,-0.25l0.37,0.46l0.66,0.02l1.18,1.1l0.81,0.07l0.28,-0.64l-0.31,-0.42l0.34,-0.46l0.33,-1.88l0.3,2.06l0.41,0.79l2.22,1.6l1.03,0.17l1.58,-0.27l0.8,0.24l3.31,-0.52l1.96,-1.06l0.66,0.86l2.67,0.93l1.36,-0.72l1.01,-1.01l0.81,-0.25l0.49,-0.88l0.21,0.99l0.42,0.3l1.61,-0.41l0.7,1.53l-0.62,0.79l0.27,1.11l0.44,-0.13l1.24,-1.65l-0.46,-1.63l0.24,-1.18l2.14,-1.13l2.17,0.89l1.64,-0.07l0.33,-0.34l-0.23,-0.41l-0.86,-0.16l-1.17,-0.79l-0.28,-0.53l0.48,-3.9l-0.26,-0.72l-0.81,-0.59l1.92,-2.37l-0.25,-0.51l-2.17,-0.79l-0.35,-0.35l0.02,-0.72l-1.2,-1.48l-1.79,-0.9l-1.52,-0.06l-0.75,0.46l-1.3,-0.12l-2.81,1.27l-0.75,-0.71l0.38,-0.31l-0.07,-0.57l-0.68,-0.41l-0.62,0.1l-0.31,-0.38l0.2,-0.44l-0.25,-0.56l-0.79,-0.09l-0.3,-0.56l-1.4,-0.36l-0.03,-0.93l0.73,-0.32l0.98,1.0l1.0,-0.58l0.25,-1.53l1.52,1.61l0.17,2.03l0.68,0.25l0.14,0.75l0.66,0.55l0.57,0.08l0.45,-0.41l-0.07,-0.57l0.44,-0.11l0.26,-0.5l-0.81,-1.18l-0.19,-1.88l0.8,1.38l0.56,0.39l0.6,-0.26l-0.09,-1.95l0.76,-0.03l0.44,0.92l-0.1,1.18l0.44,0.58l0.82,-0.34l0.32,-0.99l0.4,0.14l0.78,2.0l0.68,0.15l1.23,1.28l1.4,2.14l1.45,-0.02l2.09,-2.1l0.71,0.33l0.51,-0.27l0.17,-1.13l2.0,2.7l0.62,0.37l-0.01,1.01l1.84,2.9l2.08,0.63l0.77,-0.36l0.02,0.6l0.4,0.36l1.32,-0.12l1.64,0.73l0.99,-0.47l-0.32,1.3l0.23,0.57l0.63,-0.08l0.69,-1.09l0.53,0.59l1.12,-0.28l0.5,-0.82l1.2,-0.13l1.06,-1.08l1.62,0.48l-1.31,0.77l-0.25,0.81l0.33,0.65l1.98,1.19l1.57,-0.62l0.52,-0.75l0.49,0.59l0.03,0.86l0.65,0.15l0.62,-0.59l0.7,2.13l-0.11,1.1l0.45,0.45l0.43,-0.08l1.24,-1.25l0.21,-0.77l1.82,1.38l2.82,0.45l1.76,-0.17l2.05,-1.96l0.72,-0.18l0.08,0.75l0.67,1.04l0.58,0.07l0.62,1.67l1.96,0.36l0.65,1.12l1.46,1.18l1.49,-0.3l1.07,0.97l0.63,0.13l0.59,-0.71l-0.64,-0.71l0.52,-0.08l0.83,0.66l1.36,-0.52l0.14,-0.49l-1.76,-0.64l1.14,-0.73l-0.07,-0.57l0.78,-0.4l0.88,0.48l0.82,0.0l1.29,-0.68l1.14,0.38l2.68,-1.81l1.37,-0.38l-3.08,2.82l-0.08,1.08l0.37,0.83l1.23,1.49l0.72,-0.01l0.36,-0.75l0.73,-0.27l0.31,-0.76l1.26,-1.13l0.18,0.39l0.43,0.03l-0.0,0.58l0.61,1.03l0.58,0.16l0.81,-0.31l-1.09,1.9l0.86,2.11l0.67,0.28l0.56,-0.49l1.38,-0.08l0.64,0.52l1.66,-0.44l0.72,-0.57l1.77,-3.73l-0.59,-1.03l-2.16,-0.05l-0.34,-0.36l1.55,-2.03l0.82,-0.13l1.91,-1.69l0.42,0.85l0.91,-0.23l0.45,1.49l0.44,0.31l0.16,1.61l2.09,2.36l1.0,-0.01l1.01,-0.85l-0.13,-0.72l-0.84,-0.46l0.54,-0.23l0.97,0.83l1.06,0.27l0.51,0.66l0.52,1.72l-1.81,1.76l-0.57,-0.45l-1.23,0.64l-0.27,0.98l0.19,1.03l-0.88,1.01l-0.36,1.51l-1.3,0.27l-0.28,0.82l-0.75,-0.32l-0.53,0.23l-0.23,0.54l-0.26,-0.22l-0.68,0.17l0.28,2.02l1.05,0.74l0.42,0.7l1.21,0.56l-0.51,0.26l-0.79,-0.64l-1.3,0.54l0.08,0.97l1.07,1.07l-0.39,1.08l-0.55,0.09l-0.45,0.52l-0.12,0.91l-0.99,0.32l-0.35,-0.57l0.02,-2.68l-1.1,-0.57l-0.93,1.14l0.12,1.23l-0.6,-0.71l-0.47,0.09l-0.45,0.57l0.17,0.83l-0.62,0.63l-0.5,0.14l-0.07,-0.27l0.33,-0.74l-0.2,-1.13l-0.7,-0.2l-0.9,0.9l-0.39,1.08l-0.52,0.23l-0.68,-0.41l-0.51,0.17l-0.45,0.72l-0.92,0.29l-0.75,1.13l-0.12,1.12l0.81,0.51l-0.09,0.47l-0.53,-0.1l-0.62,0.41l0.15,2.19l-0.34,0.41l-0.09,0.95l0.94,1.46l-0.12,0.83l0.51,0.69l1.56,0.08l0.84,-0.68l-0.61,1.21l-0.3,2.11l-1.35,1.29l-0.32,4.27l-2.8,1.68l-1.79,3.22l-0.84,0.13l-0.32,0.46l-1.53,2.64l-0.25,1.36l-1.12,0.55l-0.42,0.68l-0.82,-0.19l-0.52,0.34l0.62,2.26l1.38,2.85l1.66,1.48l1.33,0.58l0.63,-0.07l1.12,1.24l1.01,0.21l1.92,1.19l1.72,1.74l5.35,2.94l0.9,3.01l1.56,1.17l1.32,0.17l2.15,1.93l0.65,0.17l0.62,-0.23l0.25,0.66l2.06,2.1l-0.3,0.85l0.24,0.71l0.92,0.22l0.79,-0.72l1.51,0.15l0.67,0.52l0.6,0.02l0.39,-0.96l0.69,-0.38l1.04,1.04l2.97,1.27l3.24,2.81l0.88,0.15l1.64,0.98l1.21,-0.1l3.63,1.54l2.3,3.68l2.53,2.12l0.0,197.45l-174.58,0.0l0.0,-231.05ZM368.33,40.68l-0.07,0.03l-0.06,0.02l0.04,-0.07l0.1,0.03ZM461.21,69.77l0.26,0.36l-0.02,0.5l-0.04,-0.22l-0.2,-0.63ZM448.25,83.39l0.01,0.0l-0.01,0.01l-0.01,-0.01ZM443.99,54.53l-1.43,0.26l-0.81,0.57l-0.06,-0.18l0.46,-0.95l0.77,0.24l1.08,-0.71l0.66,0.13l-0.67,0.63ZM445.21,53.69l0.42,-0.27l0.6,-0.52l-0.44,0.57l-0.58,0.22ZM447.88,50.86l-0.05,-0.17l-0.18,-0.38l0.38,0.14l-0.15,0.41ZM397.23,49.11l0.04,-0.13l0.05,0.0l-0.09,0.13ZM375.37,38.04l-0.22,-0.18l-0.06,-0.1l0.14,0.05l0.14,0.23ZM468.43,128.82l0.1,-0.36l0.71,0.08l0.22,-0.81l0.98,0.58l-0.09,1.8l0.5,0.56l-0.35,0.79l-0.27,-0.7l-0.69,-0.32l-0.3,-1.36l-0.82,-0.27ZM458.09,98.25l0.55,-1.25l-0.52,-2.35l0.4,-2.35l-0.36,-0.85l0.35,0.34l1.21,0.0l0.57,-0.47l1.7,-0.48l0.35,-0.43l-0.5,-0.98l0.82,-0.4l-0.12,0.7l0.59,0.61l0.23,1.09l0.82,0.57l1.65,0.04l0.63,-0.73l-0.08,-1.07l0.73,-0.02l0.23,0.49l-0.87,0.98l-0.3,0.84l-1.16,0.18l-0.6,0.65l-0.19,1.37l0.54,0.53l-1.53,0.62l-0.15,1.33l0.65,1.63l1.4,0.02l0.27,-0.53l1.48,0.99l0.75,-0.58l0.25,0.54l-0.23,0.68l-0.5,0.2l-3.05,-0.69l-1.18,0.57l-0.62,-0.08l-4.21,-1.71ZM463.06,88.68l0.24,-0.45l0.17,-0.01l-0.1,0.32l-0.31,0.14ZM464.48,129.38l0.09,-0.3l0.03,-0.23l0.16,0.37l-0.27,0.16ZM464.59,128.33l-0.0,-0.01l0.01,0.0l-0.01,0.01ZM459.77,43.12l-0.03,-0.09l0.94,-0.66l-0.69,0.78l-0.22,-0.03ZM461.45,41.19l0.65,-1.44l0.63,-0.86l0.25,-0.07l-1.53,2.36ZM462.63,130.01l-0.47,-0.72l0.51,-0.44l0.51,0.31l-0.56,0.85ZM460.11,127.28l-0.1,-0.5l0.39,-0.8l0.85,-0.31l-0.26,1.53l-0.88,0.07ZM459.73,89.2l0.04,0.13l-0.11,0.55l-0.41,-0.46l0.48,-0.21ZM454.82,47.21l0.22,-0.41l0.11,-0.17l0.13,0.15l-0.46,0.43ZM452.74,55.78l0.7,-0.26l0.15,0.11l-0.34,0.26l-0.51,-0.1ZM452.4,90.01l-0.0,-0.19l0.11,0.06l-0.11,0.13ZM453.34,89.67l0.59,-1.33l1.02,0.72l-0.74,0.38l-0.09,0.31l0.49,0.54l-0.45,0.98l-0.83,-1.61ZM452.64,83.94l0.02,-0.07l0.0,0.05l-0.02,0.02ZM452.93,83.68l-0.24,0.12l0.1,-0.35l0.14,0.22l0.01,0.01ZM449.25,48.58l0.34,-0.26l0.36,-0.17l-0.33,0.44l-0.36,-0.01ZM444.66,112.36l0.04,-0.26l-0.02,-0.12l0.12,0.26l-0.14,0.13ZM428.13,56.28l0.37,0.06l-0.02,0.24l-0.16,0.02l-0.19,-0.33ZM382.93,48.05l0.43,0.07l0.65,-0.04l-0.23,0.49l-0.96,0.15l-0.69,-0.81l0.79,0.13ZM381.87,38.09l0.42,-0.71l-0.4,-1.3l0.95,-0.36l0.5,1.21l-0.59,0.88l0.67,0.58l0.2,1.33l-0.42,1.11l-0.33,-1.3l-1.0,-1.44ZM379.01,56.62l0.45,0.03l-0.01,0.3l-0.45,-0.33ZM340.57,38.48l1.96,2.42l0.6,0.14l0.55,-0.43l0.28,0.18l0.12,0.27l-0.76,1.22l0.46,0.77l0.7,-0.07l0.73,-0.67l0.79,1.27l0.73,0.07l0.47,-0.84l2.16,-0.43l1.4,-1.0l1.38,0.68l0.26,1.11l0.36,0.27l0.5,-0.5l0.37,-1.61l1.45,-0.95l1.12,2.46l0.64,0.26l0.38,-0.53l-0.51,-2.71l0.91,-0.83l0.23,0.49l-0.27,0.63l0.42,0.55l0.59,-0.07l0.39,-0.54l0.61,0.23l0.77,-0.22l0.76,2.53l0.27,0.36l0.9,-0.19l0.09,1.11l-0.77,-0.03l-0.46,0.55l-0.31,1.55l0.19,0.53l-1.42,-0.51l-1.88,2.9l-0.6,0.08l-3.08,1.97l-2.52,2.03l-1.09,-1.05l-3.96,-1.77l-0.21,-0.5l-2.3,-1.85l-1.16,-0.36l-0.21,-1.88l-1.02,-1.24l-0.71,-2.9l0.15,-0.97l-0.62,-0.76l0.15,-1.21ZM333.6,50.36l0.46,0.0l0.52,-0.47l-0.08,-1.22l1.29,0.44l1.3,-1.07l-0.25,-2.23l0.26,-0.92l-0.68,-0.82l1.88,-2.16l1.0,-0.14l0.91,1.77l-0.29,0.84l0.12,1.0l1.41,1.35l-0.28,2.04l0.53,0.38l0.59,-0.24l1.19,0.29l1.31,0.99l-0.07,0.4l-0.79,0.35l-1.39,0.12l-3.34,-1.31l-4.07,1.13l-1.09,-0.08l-0.43,-0.45Z", "name": "Northern Territory" }, "AU-QLD": { "path": "M789.13,381.43l0.3,-1.62l-0.25,-0.64l0.26,-1.29l-0.25,-1.16l0.61,-1.09l0.04,-0.72l0.59,0.49l0.63,0.05l-1.5,5.93l-0.43,0.06ZM489.12,147.17l2.96,2.38l2.28,1.05l1.57,0.02l2.27,0.96l3.13,-0.31l0.56,0.58l3.12,1.29l3.19,0.48l0.98,1.62l1.58,1.0l-0.2,0.5l0.25,2.2l1.84,3.36l0.8,0.58l3.15,0.54l3.84,3.14l3.31,0.82l2.24,1.02l0.55,0.92l1.12,0.87l2.38,0.19l2.4,-0.28l5.31,-1.37l3.54,-2.31l1.0,-0.23l0.6,-0.93l1.65,-0.72l0.76,-1.98l0.41,-2.45l0.89,-1.85l0.21,-1.32l-0.23,-1.12l1.92,-2.49l0.64,-1.7l0.64,-0.17l1.69,-1.97l0.69,-2.66l0.5,-0.22l0.62,-1.36l0.24,-1.17l-0.28,-0.76l0.55,-0.83l0.65,-2.89l1.54,-3.16l-1.01,-2.73l0.51,-0.71l0.68,-4.96l0.91,-3.39l1.63,-3.89l0.2,-1.35l1.07,-1.47l0.0,-0.79l0.45,-0.51l0.06,-2.05l-1.13,-2.32l-1.59,-7.85l0.21,-1.53l1.33,-3.97l-0.04,-1.94l-0.35,-0.95l-1.89,-2.5l-0.31,-1.53l0.12,-1.7l1.01,-4.04l1.94,-4.13l0.72,-0.18l0.01,-0.81l0.6,-1.46l-0.24,-0.93l-1.13,-1.53l-0.17,-1.67l-0.58,-1.21l0.74,-1.19l2.11,-1.35l1.16,-2.82l0.65,-0.21l0.35,0.42l0.3,2.6l0.83,1.24l0.46,0.19l0.29,-0.4l-0.01,-1.23l-0.47,-1.55l1.32,-0.46l0.5,-0.76l-1.87,-0.34l-1.26,-0.87l1.5,-0.85l0.58,0.02l0.42,-0.32l-0.25,-0.46l-0.98,-0.42l-0.71,0.3l-1.72,0.02l-1.29,-1.31l0.48,-0.4l-0.1,-0.71l-1.88,-0.28l1.32,-3.52l1.16,0.25l0.78,-0.48l-0.99,-1.09l0.8,-2.4l1.13,-1.49l0.71,2.74l0.45,-0.2l0.58,-1.1l0.83,0.56l0.6,-0.2l0.21,-0.61l-0.04,-0.47l-0.8,-0.98l-0.77,-0.33l-0.03,-1.18l0.36,-1.57l0.86,-1.18l0.0,-1.01l2.35,-7.27l0.05,-2.07l0.51,-1.78l-0.19,-3.77l3.54,-1.07l1.33,-1.58l0.75,-1.87l0.87,0.04l0.59,-0.33l1.15,0.71l-1.9,1.85l-0.23,1.8l0.47,0.57l0.41,-0.12l0.96,-1.44l0.49,-0.03l0.22,0.94l0.63,0.37l0.01,1.12l0.73,0.07l0.82,-0.46l0.65,1.43l0.53,2.19l-0.26,0.91l0.16,1.28l0.81,0.72l0.55,1.27l-0.96,1.76l0.7,2.74l0.1,4.65l2.74,2.18l2.31,-0.58l1.51,1.2l-2.21,3.25l-0.18,3.62l0.43,0.56l1.86,0.08l1.26,0.88l0.8,2.89l2.52,1.38l-0.98,2.26l-0.39,2.88l0.21,0.47l0.67,-0.37l2.19,-0.07l-0.38,1.07l0.28,0.58l-0.16,2.4l0.47,2.43l-0.01,2.7l1.31,1.99l-0.25,1.33l0.23,0.66l-0.55,1.22l-0.67,3.23l1.31,2.69l0.31,1.35l1.45,1.32l0.4,3.88l1.52,4.0l1.36,1.42l2.36,0.8l2.3,-1.07l1.97,-1.69l0.47,-0.91l0.06,-1.21l0.43,0.06l0.45,0.66l1.25,0.27l2.76,-1.31l0.96,-1.51l1.13,1.53l0.0,2.12l0.87,0.25l-0.27,0.61l0.14,1.48l1.2,1.61l0.59,0.26l1.11,-0.17l0.84,0.95l1.92,0.24l0.79,2.34l1.64,1.41l0.83,-0.06l1.84,0.85l0.81,-0.0l0.23,0.74l1.11,1.33l0.97,0.12l-1.63,2.55l-0.16,1.9l0.5,1.34l0.74,0.47l-0.41,0.77l0.1,0.95l-0.56,0.39l-0.28,1.02l0.51,0.5l0.17,0.62l-0.25,0.78l0.97,1.05l-0.15,1.17l1.12,2.33l-0.13,1.27l0.26,0.51l-0.32,1.39l1.51,1.94l0.56,1.24l-0.54,2.71l0.66,1.19l-1.01,1.41l-0.3,2.5l0.53,0.86l0.75,0.06l0.32,0.95l1.95,2.92l1.8,1.3l0.31,0.86l0.67,0.45l0.93,1.45l-0.64,0.69l0.91,1.82l0.92,-0.23l-0.14,-1.16l0.71,-0.63l0.68,0.36l1.09,-0.77l-1.2,2.29l-0.19,1.35l1.38,2.1l0.3,1.61l1.25,2.43l0.81,0.78l-0.09,2.42l1.5,2.18l-0.78,1.02l-0.02,1.63l-0.38,0.53l0.46,1.58l-0.24,1.34l-1.78,4.32l0.12,2.17l1.9,2.47l1.47,0.47l0.48,2.49l0.52,0.46l2.0,0.2l-1.32,6.4l1.25,2.35l1.61,1.19l0.99,1.32l1.21,0.51l0.93,0.93l2.54,1.1l1.09,-0.35l0.94,1.2l2.01,1.42l1.43,-0.17l1.35,-1.4l0.04,1.62l1.52,2.05l0.9,-0.07l1.85,0.5l0.63,-0.27l2.53,0.04l0.65,-0.32l1.53,2.37l0.76,2.25l0.09,0.93l-0.61,0.34l2.41,2.89l2.25,0.29l0.39,-0.55l-0.6,-2.26l0.77,0.26l0.84,2.72l1.24,1.07l1.86,0.33l1.1,-0.62l0.88,1.03l2.64,0.66l0.36,0.85l-0.29,0.13l0.01,1.47l2.48,1.82l0.24,0.59l0.9,0.02l0.81,-0.63l-0.16,-0.52l0.39,-0.74l-0.75,-0.96l0.73,0.44l1.01,-0.26l0.16,1.28l0.76,1.53l0.38,0.17l0.71,-0.27l0.25,1.17l0.57,0.33l1.54,-0.68l0.08,0.8l1.04,1.13l0.03,1.49l-0.81,-0.17l-0.57,0.8l-1.03,-0.68l-0.51,0.45l0.33,1.46l-0.8,0.49l-0.41,0.5l0.1,0.35l0.72,1.28l0.51,0.29l-0.22,0.32l0.54,1.2l1.07,1.17l0.96,0.07l0.16,0.91l-0.46,1.48l0.77,0.13l0.63,-0.67l0.78,0.44l0.75,-0.12l0.97,0.74l-0.05,0.93l0.3,0.53l1.16,-0.12l0.51,0.47l0.64,0.06l1.35,1.71l-0.68,1.77l0.05,1.0l0.8,1.38l0.74,-0.13l0.41,0.26l-0.1,0.52l0.44,1.02l-0.5,0.74l0.58,0.41l-0.54,0.57l-0.01,1.21l0.44,0.32l0.93,-0.46l0.61,0.25l0.09,0.73l0.53,0.76l0.66,0.22l-0.33,0.85l0.69,1.7l-0.71,0.47l-0.12,1.0l0.8,1.38l-0.02,1.63l0.91,1.75l0.14,1.32l0.76,1.52l-0.3,0.64l1.02,1.33l-0.34,0.62l0.14,0.41l1.12,0.51l0.44,0.76l0.55,0.24l-0.06,1.48l-0.68,0.98l0.43,0.57l2.16,-1.1l0.77,-1.2l0.98,1.65l1.57,1.35l1.21,2.12l0.52,0.32l0.59,-0.44l-0.49,-2.0l-1.78,-4.0l0.38,-0.41l-0.46,-0.81l0.94,-2.37l1.03,-0.45l1.08,1.91l0.64,0.48l0.89,2.43l4.09,2.02l0.77,0.82l1.44,0.52l1.77,1.51l0.57,-0.04l0.11,-0.68l-0.54,-0.82l-0.16,-1.24l-0.58,-0.47l-0.17,-0.94l0.38,-1.58l0.78,0.15l0.02,1.07l2.39,1.3l-0.44,0.54l-0.27,-0.28l-0.71,0.13l-0.27,0.53l0.13,0.84l0.46,0.55l0.3,-0.08l0.3,1.34l0.91,-0.15l0.9,1.46l-0.77,4.32l-0.74,0.16l-0.2,0.57l0.67,0.7l0.11,1.02l-0.28,2.92l0.63,0.58l0.19,1.09l0.61,0.31l-0.97,1.28l0.52,2.16l1.22,1.45l-0.82,-0.01l-0.42,0.54l1.0,0.57l0.44,0.94l0.47,0.2l1.05,-0.58l1.11,0.47l0.39,0.75l1.69,1.42l1.22,2.76l1.78,0.57l0.3,0.57l0.63,0.13l2.35,3.12l0.89,-0.31l0.9,0.6l-0.16,0.81l0.45,0.69l0.43,0.2l0.55,-0.31l0.14,-0.59l0.44,-0.05l1.24,0.93l0.59,-0.43l-0.11,-0.51l0.55,0.24l0.52,-0.42l0.71,2.02l0.86,0.68l0.79,-0.03l0.68,0.79l1.32,4.17l1.07,2.22l1.32,1.76l3.63,2.89l1.97,0.56l1.11,1.07l0.53,1.69l0.14,2.37l1.74,2.74l0.75,0.49l-1.16,0.08l0.04,0.77l1.03,0.29l1.51,1.3l2.29,0.68l0.56,-0.26l1.25,0.32l0.24,2.32l-0.78,0.51l-0.38,0.77l0.53,0.5l0.89,-0.47l0.27,0.69l-1.02,1.14l0.06,2.13l-0.42,0.64l0.76,0.76l0.15,0.75l1.11,0.58l0.62,1.12l0.23,1.46l-0.26,1.51l0.4,0.39l0.49,-0.22l0.69,-1.64l0.62,1.07l1.02,0.25l-0.86,2.0l-1.34,5.7l0.35,1.27l0.83,0.38l-0.42,1.39l-0.07,4.13l0.26,0.84l0.5,0.26l-0.05,4.32l1.23,3.88l-1.48,-0.0l-0.83,0.51l-0.8,1.05l-0.24,1.09l0.61,0.56l0.89,0.03l-1.01,1.46l0.12,0.77l2.0,1.17l0.49,1.89l1.3,0.72l0.86,1.92l0.16,1.72l1.81,2.77l0.02,0.84l0.57,0.2l-0.16,1.43l-0.4,0.31l-0.19,1.02l0.23,0.58l0.64,0.11l0.14,2.05l0.94,1.39l-2.49,1.89l-3.14,0.25l-1.74,2.09l-4.64,-0.69l-2.1,0.79l-2.69,-1.44l-0.43,0.12l-0.51,0.77l-0.55,-1.13l-0.64,-0.43l-0.59,0.05l-1.2,1.02l-0.77,1.25l-1.83,0.44l-1.16,1.08l-1.36,0.06l-4.06,2.45l-0.05,0.92l2.0,2.92l-0.92,4.04l-1.42,0.47l-1.43,-0.18l-0.68,1.05l-0.73,-0.19l-0.63,-1.26l-0.57,-0.26l-1.42,0.88l-1.79,0.59l-0.9,1.51l-0.13,1.11l-1.84,1.94l-0.6,0.27l-0.79,-1.31l-0.54,-3.92l-2.66,-1.93l-1.78,-0.31l-0.11,-1.52l-0.4,-0.67l-1.27,-0.25l-0.8,-0.74l-2.86,-1.23l-3.51,0.51l-3.16,-0.25l-2.97,-2.47l-1.37,0.44l-1.57,-0.02l-2.75,1.02l-4.97,0.14l-0.98,0.34l-1.4,-0.23l-0.54,-0.92l-2.49,0.31l-0.6,0.47l-0.95,1.78l-2.73,1.24l-1.86,1.79l-1.62,0.65l-0.74,2.1l-1.61,1.23l-154.76,0.0l0.0,-65.52l-0.4,-0.4l-58.06,0.0l0.0,-196.56ZM559.65,64.22l0.05,1.1l-0.57,0.2l0.01,-0.18l0.5,-1.12ZM700.17,226.36l0.67,0.49l0.0,0.6l-0.64,-0.42l-0.04,-0.68ZM755.57,301.95l-0.36,-0.5l-0.6,-0.39l0.59,0.16l0.45,0.46l-0.09,0.26ZM788.46,367.36l1.28,-0.57l-0.98,4.4l-0.26,-1.7l-0.04,-2.13ZM781.75,327.05l3.02,-2.34l1.33,-2.16l-0.07,-2.06l-1.56,-2.26l1.68,-1.57l0.02,3.34l0.41,1.27l1.29,1.47l-4.12,9.64l-1.5,4.38l0.33,1.42l-0.38,1.07l-0.83,-1.13l-0.24,-2.2l-0.78,-0.88l0.03,-0.44l0.73,-0.65l0.29,-1.94l0.64,-0.71l0.66,-1.55l-0.02,-2.06l-0.95,-0.65ZM742.31,290.39l0.87,-0.54l0.32,0.48l1.73,0.66l0.15,0.5l0.75,-0.0l0.16,1.97l1.13,1.51l0.04,0.54l-0.35,0.44l-0.71,0.06l-0.55,-0.63l-0.63,-1.42l-2.9,-3.57ZM732.16,264.96l0.3,-0.48l0.56,0.53l-0.56,0.62l-0.29,-0.67ZM720.63,262.71l-0.24,-0.52l0.18,-0.99l0.23,0.45l-0.16,1.06ZM702.5,222.67l0.34,-0.55l-0.23,-0.45l0.12,-0.54l0.12,0.94l0.74,0.79l-0.25,0.37l-0.42,-0.06l-0.4,-0.5ZM701.47,219.84l-0.26,0.0l0.4,-0.54l0.19,0.64l-0.33,-0.11ZM701.73,219.01l-0.01,-0.15l0.09,0.01l-0.08,0.15ZM660.37,199.21l0.55,-0.19l0.31,0.11l-0.67,0.38l-0.19,-0.3ZM656.34,190.67l0.06,0.07l0.18,0.33l-0.41,0.02l0.17,-0.42ZM646.85,181.26l1.88,0.65l0.49,-0.26l0.11,-0.69l0.58,0.03l-0.26,1.28l1.07,1.25l-0.21,0.41l0.42,0.38l-0.57,1.06l-1.07,-0.26l-0.43,-1.73l-0.56,-0.91l-1.46,-1.22ZM578.86,3.15l0.3,-0.11l1.88,0.0l-0.5,0.28l-1.67,-0.17ZM570.88,19.07l0.35,-0.79l0.42,-0.12l0.89,0.13l0.31,0.45l-0.7,0.92l-1.26,-0.59ZM572.37,27.19l-0.4,-0.02l0.05,-0.34l0.52,0.1l-0.16,0.26ZM569.35,28.09l1.24,-0.85l1.06,1.57l-1.14,0.36l-0.45,0.56l-0.68,-0.84l-0.05,-0.8ZM570.35,0.5l0.34,-0.09l0.62,0.18l-0.28,0.01l-0.67,-0.1ZM569.67,18.18l-0.7,-0.72l0.65,-1.0l0.5,0.5l-0.45,1.21ZM511.4,149.62l-0.13,-0.24l0.14,-0.21l0.02,0.32l-0.02,0.13ZM511.7,148.2l1.19,-2.25l1.45,-1.13l3.46,-0.56l1.78,-0.76l0.98,0.79l0.83,0.15l0.32,0.45l-0.1,0.32l-1.47,0.39l-0.98,-1.09l-1.62,0.7l-0.56,1.13l0.05,0.96l-0.35,0.85l-0.96,-0.38l-0.6,1.02l-1.11,0.58l-1.11,0.0l-1.2,-1.19ZM517.12,157.07l0.99,-1.31l0.57,0.48l0.28,0.91l-1.01,0.24l-0.84,-0.32Z", "name": "Queensland" }, "AU-SA": { "path": "M380.32,477.92l-1.26,-0.06l-1.84,0.52l-1.4,-0.4l-2.22,-2.48l-5.83,-4.19l-4.85,-2.82l-7.12,-2.96l-1.02,-0.03l-2.79,1.82l-3.8,1.19l-4.69,-0.51l-7.61,-0.27l-1.59,0.46l-2.64,-0.11l-3.69,0.6l-4.19,0.15l-1.68,0.48l-4.9,0.3l-1.26,0.49l-2.2,0.2l-0.0,-125.78l233.02,0.0l0.01,179.24l-0.64,0.29l0.02,97.65l-4.92,0.35l-1.7,-0.77l-2.69,-2.35l-1.06,-0.43l-0.71,-0.84l-0.44,-1.6l-1.89,-3.72l-2.33,-2.12l0.29,-0.43l-0.46,-1.15l-1.76,-1.02l-0.76,0.2l-3.68,-5.24l-0.92,-1.93l0.69,-0.64l0.1,-0.91l-0.91,-1.63l-0.22,-1.32l-1.02,-0.91l2.0,-1.15l1.22,-1.54l0.43,-1.99l-0.13,-3.35l-3.9,-9.49l0.3,-0.33l-0.12,-1.06l-1.48,-4.09l-2.35,-3.09l-1.17,-0.65l-3.59,-3.5l1.36,0.13l0.83,-0.67l0.33,-2.39l-1.5,-1.5l-0.77,-0.35l0.52,-0.35l1.41,0.27l0.61,-0.52l0.07,-0.76l-0.42,-0.64l0.26,-0.98l-0.19,-0.58l-0.96,0.03l-0.99,-1.17l-1.84,-0.4l-0.24,0.81l-1.41,0.97l-1.47,-0.1l-1.4,0.76l-0.23,1.55l0.51,0.6l-0.69,-0.13l-0.8,-0.73l-1.89,0.22l-0.24,0.71l0.46,0.55l2.12,0.38l-0.69,0.29l-1.53,-0.62l-1.08,0.09l-2.15,0.7l-1.39,1.55l-2.39,0.58l-3.26,-0.25l-1.3,0.57l-1.47,-1.02l0.51,-1.42l2.3,-1.19l1.94,-2.53l1.71,-1.21l0.14,-1.91l0.54,-0.95l-0.25,-1.04l0.13,-1.63l0.93,-1.86l-0.53,-3.89l0.14,-1.87l0.73,0.56l0.37,-0.91l-0.31,-1.09l-1.81,-1.39l-0.19,-1.08l-1.33,-1.2l-0.71,-1.57l-0.75,-0.48l-1.25,-4.24l-0.41,-0.76l-0.94,-0.67l0.0,-1.17l-1.64,-2.04l-0.59,0.08l-1.39,2.82l0.04,0.76l0.47,0.79l-2.05,2.54l-0.76,2.65l-0.11,1.78l0.4,0.61l-0.53,1.46l-0.17,1.97l-1.06,2.0l-0.81,2.83l-0.07,1.31l-0.45,0.59l0.05,1.63l-1.12,1.01l-2.12,-1.17l-2.75,-0.31l-1.83,1.27l-1.89,0.03l-1.38,1.65l-2.38,-0.35l-2.51,1.65l-0.48,-0.03l-0.56,-0.76l0.28,-0.71l1.49,-1.35l0.62,-1.34l-0.33,-1.67l0.64,-0.74l-0.01,-0.81l0.78,-1.15l1.0,0.48l1.03,0.06l2.43,-0.49l2.33,1.13l0.82,-0.2l0.71,-0.78l0.72,-5.05l0.65,-2.2l-0.61,-2.34l-0.04,-1.43l-0.91,-0.74l0.66,-0.6l0.52,-2.88l-0.18,-1.72l-0.57,-1.23l0.94,0.06l0.88,-1.58l0.13,-0.92l-0.36,-0.97l1.69,-1.81l0.13,-0.74l-0.3,-0.61l1.95,-2.0l1.01,-1.9l0.62,-0.13l1.3,-1.86l0.62,0.32l0.69,-0.55l0.1,-2.29l-1.42,-3.01l0.1,-0.95l-1.1,-2.04l0.69,-1.37l1.71,-0.98l1.25,0.04l0.61,-0.29l0.19,-1.69l-0.66,-1.52l-0.97,-0.37l-1.06,-4.93l0.51,-0.42l0.06,-0.64l-1.64,-1.3l-0.01,-0.95l-0.83,-1.16l0.23,-0.83l-0.66,-0.36l-0.25,-0.72l-0.7,-0.01l-0.42,1.4l0.01,2.9l0.75,0.63l0.28,1.38l0.04,1.69l-0.36,0.85l-0.54,0.17l-0.19,0.43l0.43,1.36l-1.81,-0.93l-0.75,0.27l-0.86,0.83l-0.11,1.0l-1.44,1.64l-1.17,0.73l-0.47,2.06l-0.92,1.74l-0.35,2.74l-1.23,1.96l-1.54,3.53l-1.27,1.14l-2.42,0.51l-0.79,-0.97l-0.9,-0.06l-1.36,1.76l0.36,0.85l-1.66,0.32l-1.94,1.38l-2.0,0.86l-0.63,1.17l-1.5,1.27l-1.23,0.43l-1.35,1.22l-0.34,1.28l-2.32,4.23l-1.85,1.12l-0.45,0.68l-0.14,1.05l0.17,1.83l-0.66,-0.73l-2.37,0.94l-0.43,0.44l-0.44,1.36l0.27,0.84l-0.7,0.06l-0.55,1.1l-0.13,1.19l0.48,0.88l-0.86,0.08l-0.81,1.32l0.32,0.5l1.04,0.15l0.92,-0.26l0.99,-0.91l0.67,0.28l0.29,-0.18l-0.9,1.59l0.66,2.79l-0.46,0.2l-0.42,-1.04l-1.19,-0.65l-0.81,-1.22l-0.89,-0.49l-1.27,0.15l-0.84,0.9l-0.32,1.17l-0.49,0.0l-0.39,-1.5l-2.91,-3.61l-2.32,-1.22l0.15,-0.6l0.96,0.41l1.76,-0.48l0.41,-0.53l-0.24,-0.52l-0.99,-0.24l-0.03,-1.06l-0.53,-0.26l-0.54,0.4l0.25,-1.76l-0.67,-1.59l-0.65,-4.43l-0.57,-1.06l-1.13,-0.55l0.58,-0.57l-0.22,-3.06l-1.48,-2.67l-0.99,-0.55l-2.6,-2.88l-2.91,-2.5l0.35,-1.96l-0.15,-1.61l-0.98,-3.09l-2.24,-2.26l0.7,-0.52l-0.52,-1.36l-2.31,-0.89l-0.81,0.24l-0.2,0.95l-1.26,-0.81l-0.78,-0.14l-1.12,0.47l-0.38,-0.39l-0.58,0.1l-0.18,0.84l-0.71,-0.65l-0.88,-2.67l-0.76,-0.34l0.39,-0.94l-0.49,-1.09l-0.65,-0.36l-0.6,0.23l-1.13,-0.31l1.03,-1.05l0.28,-0.72l-0.19,-0.96l-0.97,-1.57l1.76,0.16l-0.11,1.49l0.85,0.46l1.84,-3.15l-0.45,-2.38l-0.95,-1.67l-1.59,-1.54l-0.89,-0.23l-0.68,0.36l-1.13,-0.0l-0.68,0.87l-1.1,-0.09l-1.12,1.08l0.25,-2.1l1.4,-0.41l0.15,-0.96l-2.36,-3.3l-0.44,-0.21l-0.73,0.37l-0.14,-0.85l-1.23,-0.56l-0.06,-0.56l-0.42,-0.35l0.15,-0.73l-0.8,-0.61l-1.02,-0.18l-0.56,0.23l-0.42,1.52l-0.87,-0.51l-0.32,-0.76l-0.57,-0.0l-1.27,0.71l-0.01,0.74l0.48,0.37l-0.28,0.36l-1.83,-0.42l-0.87,0.52l-1.41,-0.69l-0.75,0.22l-1.81,-1.93l-0.59,-0.31l-0.86,0.13l-0.31,-0.64l-3.77,-2.84l-3.78,-0.39l-1.47,0.16l-1.24,0.64l-0.23,1.11ZM508.04,559.93l0.26,0.08l0.07,0.05l-0.12,-0.02l-0.21,-0.12ZM436.62,538.52l-0.12,-0.12l0.13,0.05l-0.01,0.07ZM435.9,537.88l-1.22,-0.57l-1.74,0.63l1.07,-1.99l0.48,0.7l1.38,0.38l0.02,0.86ZM512.21,564.32l-2.85,-2.1l0.71,-0.41l0.14,-0.78l0.7,-0.67l1.5,0.98l-0.2,1.53l0.43,0.64l-0.43,0.81ZM460.59,569.73l1.01,-3.24l1.8,-0.27l2.16,-0.89l5.27,-0.88l3.96,-1.3l1.0,-0.79l2.1,0.66l2.7,-0.64l-0.42,1.03l0.23,0.4l0.82,0.19l-0.97,1.13l0.02,0.55l0.41,0.41l1.95,0.44l1.63,-0.35l0.08,1.2l0.79,0.44l1.34,-0.52l0.72,-1.48l0.79,0.04l1.69,0.68l0.27,1.0l0.81,0.39l0.07,0.41l-1.32,1.27l-1.95,-1.02l-2.31,-0.3l-3.83,1.12l-0.72,1.1l0.28,1.23l-0.23,0.49l-2.44,1.24l-1.69,-1.62l-2.94,-0.77l-0.99,0.39l-0.41,0.99l-0.34,0.12l-2.47,-0.45l-1.74,0.63l-1.25,-0.49l-2.57,0.76l-1.02,-1.92l-1.36,-0.51l-0.92,-0.87ZM453.1,548.84l0.17,0.14l0.07,0.28l-0.16,-0.03l-0.08,-0.39ZM420.61,518.05l0.0,-0.18l0.42,-0.12l0.03,0.17l-0.45,0.14ZM402.89,484.62l-0.58,0.25l-0.04,-0.02l0.76,-0.76l-0.15,0.53Z", "name": "South Australia" }, "AU-NSW": { "path": "M557.86,529.11l-0.52,-1.0l-1.11,-0.13l-1.24,-0.8l-1.2,0.2l-0.39,-0.65l-1.3,-0.89l-1.09,0.26l-1.12,-0.59l-1.7,-0.05l-0.6,-0.74l0.0,-114.26l154.95,-0.01l2.08,-1.56l0.6,-1.93l1.59,-0.64l1.73,-1.68l2.86,-1.34l1.29,-2.11l1.91,-0.31l0.44,0.84l1.98,0.4l0.9,-0.4l5.1,-0.16l2.75,-1.02l1.46,0.04l1.15,-0.43l2.87,2.43l3.41,0.29l3.31,-0.53l2.61,1.12l0.84,0.76l1.23,0.25l0.4,2.09l1.99,0.44l2.27,1.54l0.54,3.9l0.5,0.5l0.19,0.98l0.96,0.31l0.91,-0.36l2.07,-2.18l0.75,-2.38l1.73,-0.56l1.07,-0.74l0.72,1.28l1.5,0.55l0.7,-1.28l1.29,0.22l1.82,-0.66l1.17,-4.78l-1.28,-1.64l-0.78,-1.64l3.71,-2.14l1.32,-0.04l1.24,-1.11l1.86,-0.46l1.91,-2.23l0.6,1.17l0.69,0.41l0.65,-0.11l0.47,-0.63l2.52,1.3l1.11,-0.12l1.16,-0.66l4.72,0.69l0.73,-0.43l1.15,-1.66l3.1,-0.25l2.73,-2.01l0.88,0.42l0.42,2.71l-0.55,4.21l0.29,1.98l1.01,1.49l-0.54,2.16l0.1,2.23l-1.59,1.61l-1.34,2.09l-0.39,1.27l0.17,1.28l-0.41,0.24l-1.43,2.79l-0.2,1.1l0.55,1.51l-0.13,1.67l-0.73,2.31l-0.06,2.7l-0.65,1.72l0.11,1.25l-0.37,0.6l-0.25,1.89l-1.15,1.92l-0.23,3.33l-1.0,1.83l-0.12,1.51l-1.75,3.88l-1.08,5.47l0.36,2.57l0.65,1.15l0.95,0.32l-0.82,1.86l-0.12,1.03l0.38,0.76l-1.5,2.02l-0.42,1.74l0.29,1.84l-1.1,1.69l0.33,1.95l-1.7,1.95l-0.12,1.85l-0.98,1.23l0.19,0.71l-1.06,1.34l-0.15,1.23l-2.41,2.21l-1.31,2.35l0.08,0.73l-0.46,0.55l-0.37,1.56l0.15,0.57l0.92,0.76l-0.77,1.47l0.02,0.78l0.35,0.36l-0.39,2.43l-3.22,1.54l-1.15,1.03l-0.24,0.65l-0.94,0.47l-1.01,1.5l-0.48,-0.3l-1.75,0.78l-0.13,0.69l0.5,0.42l1.88,0.18l-0.02,0.33l-0.55,-0.01l-0.65,0.59l-1.03,-0.18l-1.52,0.33l-2.16,1.02l-1.58,1.27l-0.06,0.73l-1.2,1.16l-0.11,0.93l-1.25,1.26l-0.86,2.97l-1.22,1.7l-0.75,-0.27l-1.29,1.06l-0.31,1.29l0.87,0.75l-0.79,1.11l-0.36,2.06l-2.56,0.68l-0.24,-0.66l-0.68,-0.15l-0.4,0.53l0.21,1.25l-0.31,0.55l0.45,0.4l0.98,-0.53l-0.06,1.16l0.54,0.15l-0.37,1.5l0.25,0.63l-0.22,1.43l-0.68,0.15l-0.47,0.92l0.25,0.67l0.61,0.17l-0.22,1.41l-0.23,0.56l-0.64,-0.72l-0.74,0.03l-0.48,0.9l-0.91,-0.03l-0.53,0.49l0.24,0.61l1.05,0.42l-0.56,0.8l0.63,0.47l-2.58,1.98l-1.22,1.53l-0.91,1.68l-0.46,2.97l0.24,0.76l-0.37,0.51l-1.0,-0.09l-0.77,0.91l0.16,0.78l0.82,0.19l0.56,0.53l-0.92,4.03l-1.1,0.69l-1.03,1.63l0.66,0.89l-0.25,0.5l0.69,0.53l-0.09,0.99l-1.6,0.63l-0.39,1.29l0.45,0.81l-1.08,0.57l-0.53,1.04l-1.19,0.73l-1.07,1.84l-0.33,0.94l0.11,1.2l-1.51,2.07l-0.08,1.92l-1.44,2.23l-0.74,1.89l-1.07,-0.28l-0.74,0.3l-0.16,0.64l0.46,0.51l0.37,1.67l-0.89,0.49l-0.81,1.0l0.22,1.6l-0.2,2.04l-0.77,-0.12l-0.53,0.89l-0.03,0.46l0.78,0.11l0.34,0.41l-0.4,1.41l0.46,2.01l-0.24,0.64l0.18,0.87l-1.37,1.99l0.04,1.46l-0.39,0.88l0.22,1.63l-1.33,2.8l-0.33,2.07l-0.87,1.33l0.01,1.1l-0.51,0.92l-0.07,0.84l0.55,0.51l-0.26,1.22l0.43,0.99l-0.62,0.27l-0.66,1.03l0.62,0.79l1.05,0.05l0.78,0.63l0.57,2.0l-1.13,0.27l-0.46,0.73l0.38,1.33l-0.26,1.97l0.45,1.67l-33.79,-17.11l-1.46,-0.19l1.44,-2.43l0.2,-1.58l-0.36,-0.86l-0.92,-0.54l-0.42,-2.6l-1.21,-1.17l0.27,-1.17l-0.91,-2.92l0.23,-1.57l-1.02,-1.32l0.08,-1.4l-1.4,-0.72l-0.52,-0.83l-3.84,-1.59l-3.19,1.32l-0.5,-0.83l-1.06,-0.33l-1.85,0.61l-0.76,1.08l-0.22,1.08l-1.14,-0.32l-1.68,0.36l-0.95,-0.59l-0.57,0.3l-0.95,1.57l-1.35,-0.66l-0.87,0.65l-1.11,-0.66l-0.69,0.11l-0.58,-0.53l-0.77,-0.09l-0.47,-0.53l-1.23,-0.09l-1.22,-1.13l-1.65,-0.05l-0.75,-0.45l-1.76,0.28l-1.06,1.59l-1.95,-0.42l-1.21,0.36l-2.71,-0.79l-1.39,-0.04l-0.46,-0.87l-0.95,-0.37l-2.52,0.39l-4.1,-3.25l-1.71,-0.39l-2.42,1.07l-2.96,-0.53l-4.26,0.44l-0.89,0.81l-0.77,2.77l0.94,1.93l-1.58,-0.49l-1.53,1.31l-1.05,0.07l-1.17,-1.22l-1.41,-0.35l-2.11,-2.52l-0.86,-0.38l-1.88,-4.02l-0.73,-0.66l-0.85,-0.13l-1.81,-1.61l-1.61,-2.24l-1.89,-0.71l-0.44,-0.81l-1.62,-0.77l-2.4,-1.76l-2.47,-0.71l-1.1,-0.74l0.18,-1.34l-0.29,-1.14l-0.78,-0.65l-2.44,-0.86l-0.94,-1.75l-0.61,-3.29l0.56,-3.68l-0.78,-0.9l-0.83,0.0l-0.42,-0.78l-2.48,-1.31l-1.8,-0.17l-1.08,-0.55l-0.52,0.32l-0.79,-0.59l-0.87,0.36l-0.4,-1.14l-1.62,-1.01l-1.53,0.73l-0.65,2.11l0.08,0.74l-1.02,0.07l-0.3,0.32l0.04,0.74l-1.07,-0.21l-1.32,-2.87l-0.09,-0.96l-1.55,-1.57l-0.25,-2.39l0.64,-1.52l-0.2,-0.75l-0.56,-0.28l-0.73,0.14l-0.57,-0.47l-0.84,-1.0l-0.47,-1.88l-0.94,-0.18l-0.93,-0.77l-0.99,0.15l-0.99,-1.17l-4.12,0.34l-1.75,-0.63l-0.99,0.16l-1.63,0.99l-1.37,1.53ZM698.61,564.26l0.11,0.95l0.8,0.88l0.5,0.26l0.54,-0.21l0.31,2.07l0.6,1.12l2.14,1.06l0.64,-0.1l1.24,-2.1l-0.34,-5.54l0.75,-0.58l0.48,-1.57l-0.12,-2.0l0.81,-1.19l0.82,0.15l0.53,-0.7l2.02,0.11l0.8,-0.71l0.06,-0.52l-3.06,-1.59l-0.21,-0.78l-0.81,-0.29l-0.23,-1.05l-1.21,-0.91l-0.95,0.16l-5.38,3.98l-0.56,0.78l-0.72,4.14l0.25,1.86l-0.19,1.72l0.36,0.6ZM738.24,548.61l0.5,0.14l-0.4,1.32l-0.19,-0.2l0.08,-1.25ZM665.31,574.96l0.37,1.49l0.89,0.8l-0.38,0.05l-0.75,-0.84l-0.14,-1.5Z", "name": "New South Wales" } }, "height": 1099.3708327378595, "projection": { "type": "merc", "centralMeridian": 0.0 }, "width": 900.0 });