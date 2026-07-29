import { i as __require, o as __toESM, r as __exportAll, t as __commonJSMin } from "../_runtime.mjs";
import { t as require_d } from "./d+es5-ext+type.mjs";
import { t as require_lib } from "./xmldom__xmldom.mjs";
//#region node_modules/es5-ext/object/valid-callable.js
var require_valid_callable = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function(fn) {
		if (typeof fn !== "function") throw new TypeError(fn + " is not a function");
		return fn;
	};
}));
//#endregion
//#region node_modules/epubjs/src/utils/core.js
var import_event_emitter = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var d = require_d();
	var callable = require_valid_callable();
	var apply = Function.prototype.apply;
	var call = Function.prototype.call;
	var create = Object.create;
	var defineProperty = Object.defineProperty;
	var defineProperties = Object.defineProperties;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var descriptor = {
		configurable: true,
		enumerable: false,
		writable: true
	};
	var on = function(type, listener) {
		var data;
		callable(listener);
		if (!hasOwnProperty.call(this, "__ee__")) {
			data = descriptor.value = create(null);
			defineProperty(this, "__ee__", descriptor);
			descriptor.value = null;
		} else data = this.__ee__;
		if (!data[type]) data[type] = listener;
		else if (typeof data[type] === "object") data[type].push(listener);
		else data[type] = [data[type], listener];
		return this;
	};
	var once = function(type, listener) {
		var once, self;
		callable(listener);
		self = this;
		on.call(this, type, once = function() {
			off.call(self, type, once);
			apply.call(listener, this, arguments);
		});
		once.__eeOnceListener__ = listener;
		return this;
	};
	var off = function(type, listener) {
		var data, listeners, candidate, i;
		callable(listener);
		if (!hasOwnProperty.call(this, "__ee__")) return this;
		data = this.__ee__;
		if (!data[type]) return this;
		listeners = data[type];
		if (typeof listeners === "object") {
			for (i = 0; candidate = listeners[i]; ++i) if (candidate === listener || candidate.__eeOnceListener__ === listener) if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
			else listeners.splice(i, 1);
		} else if (listeners === listener || listeners.__eeOnceListener__ === listener) delete data[type];
		return this;
	};
	var emit = function(type) {
		var i, l, listener, listeners, args;
		if (!hasOwnProperty.call(this, "__ee__")) return;
		listeners = this.__ee__[type];
		if (!listeners) return;
		if (typeof listeners === "object") {
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) args[i - 1] = arguments[i];
			listeners = listeners.slice();
			for (i = 0; listener = listeners[i]; ++i) apply.call(listener, this, args);
		} else switch (arguments.length) {
			case 1:
				call.call(listeners, this);
				break;
			case 2:
				call.call(listeners, this, arguments[1]);
				break;
			case 3:
				call.call(listeners, this, arguments[1], arguments[2]);
				break;
			default:
				l = arguments.length;
				args = new Array(l - 1);
				for (i = 1; i < l; ++i) args[i - 1] = arguments[i];
				apply.call(listeners, this, args);
		}
	};
	var methods = {
		on,
		once,
		off,
		emit
	};
	var descriptors = {
		on: d(on),
		once: d(once),
		off: d(off),
		emit: d(emit)
	};
	var base = defineProperties({}, descriptors);
	module.exports = exports = function(o) {
		return o == null ? create(base) : defineProperties(Object(o), descriptors);
	};
	exports.methods = methods;
})))());
var core_exports = /* @__PURE__ */ __exportAll({
	RangeObject: () => RangeObject,
	blob2base64: () => blob2base64,
	borders: () => borders,
	bounds: () => bounds,
	createBase64Url: () => createBase64Url,
	createBlob: () => createBlob,
	createBlobUrl: () => createBlobUrl,
	defaults: () => defaults,
	defer: () => defer,
	documentHeight: () => documentHeight,
	extend: () => extend,
	filterChildren: () => filterChildren,
	findChildren: () => findChildren,
	getParentByTagName: () => getParentByTagName,
	indexOfElementNode: () => indexOfElementNode,
	indexOfNode: () => indexOfNode,
	indexOfSorted: () => indexOfSorted,
	indexOfTextNode: () => indexOfTextNode,
	insert: () => insert,
	isElement: () => isElement,
	isFloat: () => isFloat,
	isNumber: () => isNumber,
	isXml: () => isXml,
	locationOf: () => locationOf,
	nodeBounds: () => nodeBounds,
	parents: () => parents,
	parse: () => parse,
	prefixed: () => prefixed,
	qs: () => qs,
	qsa: () => qsa,
	qsp: () => qsp,
	querySelectorByType: () => querySelectorByType,
	requestAnimationFrame: () => requestAnimationFrame$1,
	revokeBlobUrl: () => revokeBlobUrl,
	sprint: () => sprint,
	treeWalker: () => treeWalker,
	type: () => type,
	uuid: () => uuid,
	walk: () => walk,
	windowBounds: () => windowBounds
});
var import_lib = require_lib();
/**
* Vendor prefixed requestAnimationFrame
* @returns {function} requestAnimationFrame
* @memberof Core
*/
var requestAnimationFrame$1 = typeof window != "undefined" ? window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame : false;
var ELEMENT_NODE$2 = 1;
var TEXT_NODE$1 = 3;
var _URL = typeof URL != "undefined" ? URL : typeof window != "undefined" ? window.URL || window.webkitURL || window.mozURL : void 0;
/**
* Generates a UUID
* based on: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
* @returns {string} uuid
* @memberof Core
*/
function uuid() {
	var d = (/* @__PURE__ */ new Date()).getTime();
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == "x" ? r : r & 7 | 8).toString(16);
	});
}
/**
* Gets the height of a document
* @returns {number} height
* @memberof Core
*/
function documentHeight() {
	return Math.max(document.documentElement.clientHeight, document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight);
}
/**
* Checks if a node is an element
* @param {object} obj
* @returns {boolean}
* @memberof Core
*/
function isElement(obj) {
	return !!(obj && obj.nodeType == 1);
}
/**
* @param {any} n
* @returns {boolean}
* @memberof Core
*/
function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
/**
* @param {any} n
* @returns {boolean}
* @memberof Core
*/
function isFloat(n) {
	let f = parseFloat(n);
	if (isNumber(n) === false) return false;
	if (typeof n === "string" && n.indexOf(".") > -1) return true;
	return Math.floor(f) !== f;
}
/**
* Get a prefixed css property
* @param {string} unprefixed
* @returns {string}
* @memberof Core
*/
function prefixed(unprefixed) {
	var vendors = [
		"Webkit",
		"webkit",
		"Moz",
		"O",
		"ms"
	];
	var prefixes = [
		"-webkit-",
		"-webkit-",
		"-moz-",
		"-o-",
		"-ms-"
	];
	var lower = unprefixed.toLowerCase();
	var length = vendors.length;
	if (typeof document === "undefined" || typeof document.body.style[lower] != "undefined") return unprefixed;
	for (var i = 0; i < length; i++) if (typeof document.body.style[prefixes[i] + lower] != "undefined") return prefixes[i] + lower;
	return unprefixed;
}
/**
* Apply defaults to an object
* @param {object} obj
* @returns {object}
* @memberof Core
*/
function defaults(obj) {
	for (var i = 1, length = arguments.length; i < length; i++) {
		var source = arguments[i];
		for (var prop in source) if (obj[prop] === void 0) obj[prop] = source[prop];
	}
	return obj;
}
/**
* Extend properties of an object
* @param {object} target
* @returns {object}
* @memberof Core
*/
function extend(target) {
	[].slice.call(arguments, 1).forEach(function(source) {
		if (!source) return;
		Object.getOwnPropertyNames(source).forEach(function(propName) {
			Object.defineProperty(target, propName, Object.getOwnPropertyDescriptor(source, propName));
		});
	});
	return target;
}
/**
* Fast quicksort insert for sorted array -- based on:
*  http://stackoverflow.com/questions/1344500/efficient-way-to-insert-a-number-into-a-sorted-array-of-numbers
* @param {any} item
* @param {array} array
* @param {function} [compareFunction]
* @returns {number} location (in array)
* @memberof Core
*/
function insert(item, array, compareFunction) {
	var location = locationOf(item, array, compareFunction);
	array.splice(location, 0, item);
	return location;
}
/**
* Finds where something would fit into a sorted array
* @param {any} item
* @param {array} array
* @param {function} [compareFunction]
* @param {function} [_start]
* @param {function} [_end]
* @returns {number} location (in array)
* @memberof Core
*/
function locationOf(item, array, compareFunction, _start, _end) {
	var start = _start || 0;
	var end = _end || array.length;
	var pivot = parseInt(start + (end - start) / 2);
	var compared;
	if (!compareFunction) compareFunction = function(a, b) {
		if (a > b) return 1;
		if (a < b) return -1;
		if (a == b) return 0;
	};
	if (end - start <= 0) return pivot;
	compared = compareFunction(array[pivot], item);
	if (end - start === 1) return compared >= 0 ? pivot : pivot + 1;
	if (compared === 0) return pivot;
	if (compared === -1) return locationOf(item, array, compareFunction, pivot, end);
	else return locationOf(item, array, compareFunction, start, pivot);
}
/**
* Finds index of something in a sorted array
* Returns -1 if not found
* @param {any} item
* @param {array} array
* @param {function} [compareFunction]
* @param {function} [_start]
* @param {function} [_end]
* @returns {number} index (in array) or -1
* @memberof Core
*/
function indexOfSorted(item, array, compareFunction, _start, _end) {
	var start = _start || 0;
	var end = _end || array.length;
	var pivot = parseInt(start + (end - start) / 2);
	var compared;
	if (!compareFunction) compareFunction = function(a, b) {
		if (a > b) return 1;
		if (a < b) return -1;
		if (a == b) return 0;
	};
	if (end - start <= 0) return -1;
	compared = compareFunction(array[pivot], item);
	if (end - start === 1) return compared === 0 ? pivot : -1;
	if (compared === 0) return pivot;
	if (compared === -1) return indexOfSorted(item, array, compareFunction, pivot, end);
	else return indexOfSorted(item, array, compareFunction, start, pivot);
}
/**
* Find the bounds of an element
* taking padding and margin into account
* @param {element} el
* @returns {{ width: Number, height: Number}}
* @memberof Core
*/
function bounds(el) {
	var style = window.getComputedStyle(el);
	var widthProps = [
		"width",
		"paddingRight",
		"paddingLeft",
		"marginRight",
		"marginLeft",
		"borderRightWidth",
		"borderLeftWidth"
	];
	var heightProps = [
		"height",
		"paddingTop",
		"paddingBottom",
		"marginTop",
		"marginBottom",
		"borderTopWidth",
		"borderBottomWidth"
	];
	var width = 0;
	var height = 0;
	widthProps.forEach(function(prop) {
		width += parseFloat(style[prop]) || 0;
	});
	heightProps.forEach(function(prop) {
		height += parseFloat(style[prop]) || 0;
	});
	return {
		height,
		width
	};
}
/**
* Find the bounds of an element
* taking padding, margin and borders into account
* @param {element} el
* @returns {{ width: Number, height: Number}}
* @memberof Core
*/
function borders(el) {
	var style = window.getComputedStyle(el);
	var widthProps = [
		"paddingRight",
		"paddingLeft",
		"marginRight",
		"marginLeft",
		"borderRightWidth",
		"borderLeftWidth"
	];
	var heightProps = [
		"paddingTop",
		"paddingBottom",
		"marginTop",
		"marginBottom",
		"borderTopWidth",
		"borderBottomWidth"
	];
	var width = 0;
	var height = 0;
	widthProps.forEach(function(prop) {
		width += parseFloat(style[prop]) || 0;
	});
	heightProps.forEach(function(prop) {
		height += parseFloat(style[prop]) || 0;
	});
	return {
		height,
		width
	};
}
/**
* Find the bounds of any node
* allows for getting bounds of text nodes by wrapping them in a range
* @param {node} node
* @returns {BoundingClientRect}
* @memberof Core
*/
function nodeBounds(node) {
	let elPos;
	let doc = node.ownerDocument;
	if (node.nodeType == Node.TEXT_NODE) {
		let elRange = doc.createRange();
		elRange.selectNodeContents(node);
		elPos = elRange.getBoundingClientRect();
	} else elPos = node.getBoundingClientRect();
	return elPos;
}
/**
* Find the equivalent of getBoundingClientRect of a browser window
* @returns {{ width: Number, height: Number, top: Number, left: Number, right: Number, bottom: Number }}
* @memberof Core
*/
function windowBounds() {
	var width = window.innerWidth;
	var height = window.innerHeight;
	return {
		top: 0,
		left: 0,
		right: width,
		bottom: height,
		width,
		height
	};
}
/**
* Gets the index of a node in its parent
* @param {Node} node
* @param {string} typeId
* @return {number} index
* @memberof Core
*/
function indexOfNode(node, typeId) {
	var children = node.parentNode.childNodes;
	var sib;
	var index = -1;
	for (var i = 0; i < children.length; i++) {
		sib = children[i];
		if (sib.nodeType === typeId) index++;
		if (sib == node) break;
	}
	return index;
}
/**
* Gets the index of a text node in its parent
* @param {node} textNode
* @returns {number} index
* @memberof Core
*/
function indexOfTextNode(textNode) {
	return indexOfNode(textNode, TEXT_NODE$1);
}
/**
* Gets the index of an element node in its parent
* @param {element} elementNode
* @returns {number} index
* @memberof Core
*/
function indexOfElementNode(elementNode) {
	return indexOfNode(elementNode, ELEMENT_NODE$2);
}
/**
* Check if extension is xml
* @param {string} ext
* @returns {boolean}
* @memberof Core
*/
function isXml(ext) {
	return [
		"xml",
		"opf",
		"ncx"
	].indexOf(ext) > -1;
}
/**
* Create a new blob
* @param {any} content
* @param {string} mime
* @returns {Blob}
* @memberof Core
*/
function createBlob(content, mime) {
	return new Blob([content], { type: mime });
}
/**
* Create a new blob url
* @param {any} content
* @param {string} mime
* @returns {string} url
* @memberof Core
*/
function createBlobUrl(content, mime) {
	var tempUrl;
	var blob = createBlob(content, mime);
	tempUrl = _URL.createObjectURL(blob);
	return tempUrl;
}
/**
* Remove a blob url
* @param {string} url
* @memberof Core
*/
function revokeBlobUrl(url) {
	return _URL.revokeObjectURL(url);
}
/**
* Create a new base64 encoded url
* @param {any} content
* @param {string} mime
* @returns {string} url
* @memberof Core
*/
function createBase64Url(content, mime) {
	var data;
	var datauri;
	if (typeof content !== "string") return;
	data = btoa(content);
	datauri = "data:" + mime + ";base64," + data;
	return datauri;
}
/**
* Get type of an object
* @param {object} obj
* @returns {string} type
* @memberof Core
*/
function type(obj) {
	return Object.prototype.toString.call(obj).slice(8, -1);
}
/**
* Parse xml (or html) markup
* @param {string} markup
* @param {string} mime
* @param {boolean} forceXMLDom force using xmlDom to parse instead of native parser
* @returns {document} document
* @memberof Core
*/
function parse(markup, mime, forceXMLDom) {
	var doc;
	var Parser;
	if (typeof DOMParser === "undefined" || forceXMLDom) Parser = import_lib.DOMParser;
	else Parser = DOMParser;
	if (markup.charCodeAt(0) === 65279) markup = markup.slice(1);
	doc = new Parser().parseFromString(markup, mime);
	return doc;
}
/**
* querySelector polyfill
* @param {element} el
* @param {string} sel selector string
* @returns {element} element
* @memberof Core
*/
function qs(el, sel) {
	var elements;
	if (!el) throw new Error("No Element Provided");
	if (typeof el.querySelector != "undefined") return el.querySelector(sel);
	else {
		elements = el.getElementsByTagName(sel);
		if (elements.length) return elements[0];
	}
}
/**
* querySelectorAll polyfill
* @param {element} el
* @param {string} sel selector string
* @returns {element[]} elements
* @memberof Core
*/
function qsa(el, sel) {
	if (typeof el.querySelector != "undefined") return el.querySelectorAll(sel);
	else return el.getElementsByTagName(sel);
}
/**
* querySelector by property
* @param {element} el
* @param {string} sel selector string
* @param {object[]} props
* @returns {element[]} elements
* @memberof Core
*/
function qsp(el, sel, props) {
	var q, filtered;
	if (typeof el.querySelector != "undefined") {
		sel += "[";
		for (var prop in props) sel += prop + "~='" + props[prop] + "'";
		sel += "]";
		return el.querySelector(sel);
	} else {
		q = el.getElementsByTagName(sel);
		filtered = Array.prototype.slice.call(q, 0).filter(function(el) {
			for (var prop in props) if (el.getAttribute(prop) === props[prop]) return true;
			return false;
		});
		if (filtered) return filtered[0];
	}
}
/**
* Sprint through all text nodes in a document
* @memberof Core
* @param  {element} root element to start with
* @param  {function} func function to run on each element
*/
function sprint(root, func) {
	if (typeof (root.ownerDocument || root).createTreeWalker !== "undefined") treeWalker(root, func, NodeFilter.SHOW_TEXT);
	else walk(root, function(node) {
		if (node && node.nodeType === 3) func(node);
	}, true);
}
/**
* Create a treeWalker
* @memberof Core
* @param  {element} root element to start with
* @param  {function} func function to run on each element
* @param  {function | object} filter function or object to filter with
*/
function treeWalker(root, func, filter) {
	var treeWalker = document.createTreeWalker(root, filter, null, false);
	let node;
	while (node = treeWalker.nextNode()) func(node);
}
/**
* @memberof Core
* @param {node} node
* @param {callback} return false for continue,true for break inside callback
*/
function walk(node, callback) {
	if (callback(node)) return true;
	node = node.firstChild;
	if (node) do {
		if (walk(node, callback)) return true;
		node = node.nextSibling;
	} while (node);
}
/**
* Convert a blob to a base64 encoded string
* @param {Blog} blob
* @returns {string}
* @memberof Core
*/
function blob2base64(blob) {
	return new Promise(function(resolve, reject) {
		var reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.onloadend = function() {
			resolve(reader.result);
		};
	});
}
/**
* Creates a new pending promise and provides methods to resolve or reject it.
* From: https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Deferred#backwards_forwards_compatible
* @memberof Core
*/
function defer() {
	this.resolve = null;
	this.reject = null;
	this.id = uuid();
	this.promise = new Promise((resolve, reject) => {
		this.resolve = resolve;
		this.reject = reject;
	});
	Object.freeze(this);
}
/**
* querySelector with filter by epub type
* @param {element} html
* @param {string} element element type to find
* @param {string} type epub type to find
* @returns {element[]} elements
* @memberof Core
*/
function querySelectorByType(html, element, type) {
	var query;
	if (typeof html.querySelector != "undefined") query = html.querySelector(`${element}[*|type="${type}"]`);
	if (!query || query.length === 0) {
		query = qsa(html, element);
		for (var i = 0; i < query.length; i++) if (query[i].getAttributeNS("http://www.idpf.org/2007/ops", "type") === type || query[i].getAttribute("epub:type") === type) return query[i];
	} else return query;
}
/**
* Find direct descendents of an element
* @param {element} el
* @returns {element[]} children
* @memberof Core
*/
function findChildren(el) {
	var result = [];
	var childNodes = el.childNodes;
	for (var i = 0; i < childNodes.length; i++) {
		let node = childNodes[i];
		if (node.nodeType === 1) result.push(node);
	}
	return result;
}
/**
* Find all parents (ancestors) of an element
* @param {element} node
* @returns {element[]} parents
* @memberof Core
*/
function parents(node) {
	var nodes = [node];
	for (; node; node = node.parentNode) nodes.unshift(node);
	return nodes;
}
/**
* Find all direct descendents of a specific type
* @param {element} el
* @param {string} nodeName
* @param {boolean} [single]
* @returns {element[]} children
* @memberof Core
*/
function filterChildren(el, nodeName, single) {
	var result = [];
	var childNodes = el.childNodes;
	for (var i = 0; i < childNodes.length; i++) {
		let node = childNodes[i];
		if (node.nodeType === 1 && node.nodeName.toLowerCase() === nodeName) if (single) return node;
		else result.push(node);
	}
	if (!single) return result;
}
/**
* Filter all parents (ancestors) with tag name
* @param {element} node
* @param {string} tagname
* @returns {element[]} parents
* @memberof Core
*/
function getParentByTagName(node, tagname) {
	let parent;
	if (node === null || tagname === "") return;
	parent = node.parentNode;
	while (parent.nodeType === 1) {
		if (parent.tagName.toLowerCase() === tagname) return parent;
		parent = parent.parentNode;
	}
}
/**
* Lightweight Polyfill for DOM Range
* @class
* @memberof Core
*/
var RangeObject = class {
	constructor() {
		this.collapsed = false;
		this.commonAncestorContainer = void 0;
		this.endContainer = void 0;
		this.endOffset = void 0;
		this.startContainer = void 0;
		this.startOffset = void 0;
	}
	setStart(startNode, startOffset) {
		this.startContainer = startNode;
		this.startOffset = startOffset;
		if (!this.endContainer) this.collapse(true);
		else this.commonAncestorContainer = this._commonAncestorContainer();
		this._checkCollapsed();
	}
	setEnd(endNode, endOffset) {
		this.endContainer = endNode;
		this.endOffset = endOffset;
		if (!this.startContainer) this.collapse(false);
		else {
			this.collapsed = false;
			this.commonAncestorContainer = this._commonAncestorContainer();
		}
		this._checkCollapsed();
	}
	collapse(toStart) {
		this.collapsed = true;
		if (toStart) {
			this.endContainer = this.startContainer;
			this.endOffset = this.startOffset;
			this.commonAncestorContainer = this.startContainer.parentNode;
		} else {
			this.startContainer = this.endContainer;
			this.startOffset = this.endOffset;
			this.commonAncestorContainer = this.endOffset.parentNode;
		}
	}
	selectNode(referenceNode) {
		let parent = referenceNode.parentNode;
		let index = Array.prototype.indexOf.call(parent.childNodes, referenceNode);
		this.setStart(parent, index);
		this.setEnd(parent, index + 1);
	}
	selectNodeContents(referenceNode) {
		referenceNode.childNodes[referenceNode.childNodes - 1];
		let endIndex = referenceNode.nodeType === 3 ? referenceNode.textContent.length : parent.childNodes.length;
		this.setStart(referenceNode, 0);
		this.setEnd(referenceNode, endIndex);
	}
	_commonAncestorContainer(startContainer, endContainer) {
		var startParents = parents(startContainer || this.startContainer);
		var endParents = parents(endContainer || this.endContainer);
		if (startParents[0] != endParents[0]) return void 0;
		for (var i = 0; i < startParents.length; i++) if (startParents[i] != endParents[i]) return startParents[i - 1];
	}
	_checkCollapsed() {
		if (this.startContainer === this.endContainer && this.startOffset === this.endOffset) this.collapsed = true;
		else this.collapsed = false;
	}
	toString() {}
};
//#endregion
//#region node_modules/epubjs/src/utils/path.js
var import_path = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	if (!process) var process = { "cwd": function() {
		return "/";
	} };
	function assertPath(path) {
		if (typeof path !== "string") throw new TypeError("Path must be a string. Received " + path);
	}
	function normalizeStringPosix(path, allowAboveRoot) {
		var res = "";
		var lastSlash = -1;
		var dots = 0;
		var code;
		for (var i = 0; i <= path.length; ++i) {
			if (i < path.length) code = path.charCodeAt(i);
			else if (code === 47) break;
			else code = 47;
			if (code === 47) {
				if (lastSlash === i - 1 || dots === 1) {} else if (lastSlash !== i - 1 && dots === 2) {
					if (res.length < 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
						if (res.length > 2) {
							var start = res.length - 1;
							var j = start;
							for (; j >= 0; --j) if (res.charCodeAt(j) === 47) break;
							if (j !== start) {
								if (j === -1) res = "";
								else res = res.slice(0, j);
								lastSlash = i;
								dots = 0;
								continue;
							}
						} else if (res.length === 2 || res.length === 1) {
							res = "";
							lastSlash = i;
							dots = 0;
							continue;
						}
					}
					if (allowAboveRoot) if (res.length > 0) res += "/..";
					else res = "..";
				} else if (res.length > 0) res += "/" + path.slice(lastSlash + 1, i);
				else res = path.slice(lastSlash + 1, i);
				lastSlash = i;
				dots = 0;
			} else if (code === 46 && dots !== -1) ++dots;
			else dots = -1;
		}
		return res;
	}
	function _format(sep, pathObject) {
		var dir = pathObject.dir || pathObject.root;
		var base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
		if (!dir) return base;
		if (dir === pathObject.root) return dir + base;
		return dir + sep + base;
	}
	var posix = {
		resolve: function resolve() {
			var resolvedPath = "";
			var resolvedAbsolute = false;
			var cwd;
			for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
				var path;
				if (i >= 0) path = arguments[i];
				else {
					if (cwd === void 0) cwd = process.cwd();
					path = cwd;
				}
				assertPath(path);
				if (path.length === 0) continue;
				resolvedPath = path + "/" + resolvedPath;
				resolvedAbsolute = path.charCodeAt(0) === 47;
			}
			resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
			if (resolvedAbsolute) if (resolvedPath.length > 0) return "/" + resolvedPath;
			else return "/";
			else if (resolvedPath.length > 0) return resolvedPath;
			else return ".";
		},
		normalize: function normalize(path) {
			assertPath(path);
			if (path.length === 0) return ".";
			var isAbsolute = path.charCodeAt(0) === 47;
			var trailingSeparator = path.charCodeAt(path.length - 1) === 47;
			path = normalizeStringPosix(path, !isAbsolute);
			if (path.length === 0 && !isAbsolute) path = ".";
			if (path.length > 0 && trailingSeparator) path += "/";
			if (isAbsolute) return "/" + path;
			return path;
		},
		isAbsolute: function isAbsolute(path) {
			assertPath(path);
			return path.length > 0 && path.charCodeAt(0) === 47;
		},
		join: function join() {
			if (arguments.length === 0) return ".";
			var joined;
			for (var i = 0; i < arguments.length; ++i) {
				var arg = arguments[i];
				assertPath(arg);
				if (arg.length > 0) if (joined === void 0) joined = arg;
				else joined += "/" + arg;
			}
			if (joined === void 0) return ".";
			return posix.normalize(joined);
		},
		relative: function relative(from, to) {
			assertPath(from);
			assertPath(to);
			if (from === to) return "";
			from = posix.resolve(from);
			to = posix.resolve(to);
			if (from === to) return "";
			var fromStart = 1;
			for (; fromStart < from.length; ++fromStart) if (from.charCodeAt(fromStart) !== 47) break;
			var fromEnd = from.length;
			var fromLen = fromEnd - fromStart;
			var toStart = 1;
			for (; toStart < to.length; ++toStart) if (to.charCodeAt(toStart) !== 47) break;
			var toLen = to.length - toStart;
			var length = fromLen < toLen ? fromLen : toLen;
			var lastCommonSep = -1;
			var i = 0;
			for (; i <= length; ++i) {
				if (i === length) {
					if (toLen > length) {
						if (to.charCodeAt(toStart + i) === 47) return to.slice(toStart + i + 1);
						else if (i === 0) return to.slice(toStart + i);
					} else if (fromLen > length) {
						if (from.charCodeAt(fromStart + i) === 47) lastCommonSep = i;
						else if (i === 0) lastCommonSep = 0;
					}
					break;
				}
				var fromCode = from.charCodeAt(fromStart + i);
				if (fromCode !== to.charCodeAt(toStart + i)) break;
				else if (fromCode === 47) lastCommonSep = i;
			}
			var out = "";
			for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) if (i === fromEnd || from.charCodeAt(i) === 47) if (out.length === 0) out += "..";
			else out += "/..";
			if (out.length > 0) return out + to.slice(toStart + lastCommonSep);
			else {
				toStart += lastCommonSep;
				if (to.charCodeAt(toStart) === 47) ++toStart;
				return to.slice(toStart);
			}
		},
		_makeLong: function _makeLong(path) {
			return path;
		},
		dirname: function dirname(path) {
			assertPath(path);
			if (path.length === 0) return ".";
			var code = path.charCodeAt(0);
			var hasRoot = code === 47;
			var end = -1;
			var matchedSlash = true;
			for (var i = path.length - 1; i >= 1; --i) {
				code = path.charCodeAt(i);
				if (code === 47) {
					if (!matchedSlash) {
						end = i;
						break;
					}
				} else matchedSlash = false;
			}
			if (end === -1) return hasRoot ? "/" : ".";
			if (hasRoot && end === 1) return "//";
			return path.slice(0, end);
		},
		basename: function basename(path, ext) {
			if (ext !== void 0 && typeof ext !== "string") throw new TypeError("\"ext\" argument must be a string");
			assertPath(path);
			var start = 0;
			var end = -1;
			var matchedSlash = true;
			var i;
			if (ext !== void 0 && ext.length > 0 && ext.length <= path.length) {
				if (ext.length === path.length && ext === path) return "";
				var extIdx = ext.length - 1;
				var firstNonSlashEnd = -1;
				for (i = path.length - 1; i >= 0; --i) {
					var code = path.charCodeAt(i);
					if (code === 47) {
						if (!matchedSlash) {
							start = i + 1;
							break;
						}
					} else {
						if (firstNonSlashEnd === -1) {
							matchedSlash = false;
							firstNonSlashEnd = i + 1;
						}
						if (extIdx >= 0) if (code === ext.charCodeAt(extIdx)) {
							if (--extIdx === -1) end = i;
						} else {
							extIdx = -1;
							end = firstNonSlashEnd;
						}
					}
				}
				if (start === end) end = firstNonSlashEnd;
				else if (end === -1) end = path.length;
				return path.slice(start, end);
			} else {
				for (i = path.length - 1; i >= 0; --i) if (path.charCodeAt(i) === 47) {
					if (!matchedSlash) {
						start = i + 1;
						break;
					}
				} else if (end === -1) {
					matchedSlash = false;
					end = i + 1;
				}
				if (end === -1) return "";
				return path.slice(start, end);
			}
		},
		extname: function extname(path) {
			assertPath(path);
			var startDot = -1;
			var startPart = 0;
			var end = -1;
			var matchedSlash = true;
			var preDotState = 0;
			for (var i = path.length - 1; i >= 0; --i) {
				var code = path.charCodeAt(i);
				if (code === 47) {
					if (!matchedSlash) {
						startPart = i + 1;
						break;
					}
					continue;
				}
				if (end === -1) {
					matchedSlash = false;
					end = i + 1;
				}
				if (code === 46) {
					if (startDot === -1) startDot = i;
					else if (preDotState !== 1) preDotState = 1;
				} else if (startDot !== -1) preDotState = -1;
			}
			if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) return "";
			return path.slice(startDot, end);
		},
		format: function format(pathObject) {
			if (pathObject === null || typeof pathObject !== "object") throw new TypeError("Parameter \"pathObject\" must be an object, not " + typeof pathObject);
			return _format("/", pathObject);
		},
		parse: function parse(path) {
			assertPath(path);
			var ret = {
				root: "",
				dir: "",
				base: "",
				ext: "",
				name: ""
			};
			if (path.length === 0) return ret;
			var code = path.charCodeAt(0);
			var isAbsolute = code === 47;
			var start;
			if (isAbsolute) {
				ret.root = "/";
				start = 1;
			} else start = 0;
			var startDot = -1;
			var startPart = 0;
			var end = -1;
			var matchedSlash = true;
			var i = path.length - 1;
			var preDotState = 0;
			for (; i >= start; --i) {
				code = path.charCodeAt(i);
				if (code === 47) {
					if (!matchedSlash) {
						startPart = i + 1;
						break;
					}
					continue;
				}
				if (end === -1) {
					matchedSlash = false;
					end = i + 1;
				}
				if (code === 46) {
					if (startDot === -1) startDot = i;
					else if (preDotState !== 1) preDotState = 1;
				} else if (startDot !== -1) preDotState = -1;
			}
			if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
				if (end !== -1) if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);
				else ret.base = ret.name = path.slice(startPart, end);
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
			if (startPart > 0) ret.dir = path.slice(0, startPart - 1);
			else if (isAbsolute) ret.dir = "/";
			return ret;
		},
		sep: "/",
		delimiter: ":",
		posix: null
	};
	module.exports = posix;
})))());
/**
* Creates a Path object for parsing and manipulation of a path strings
*
* Uses a polyfill for Nodejs path: https://nodejs.org/api/path.html
* @param	{string} pathString	a url string (relative or absolute)
* @class
*/
var Path = class {
	constructor(pathString) {
		var protocol;
		var parsed;
		protocol = pathString.indexOf("://");
		if (protocol > -1) pathString = new URL(pathString).pathname;
		parsed = this.parse(pathString);
		this.path = pathString;
		if (this.isDirectory(pathString)) this.directory = pathString;
		else this.directory = parsed.dir + "/";
		this.filename = parsed.base;
		this.extension = parsed.ext.slice(1);
	}
	/**
	* Parse the path: https://nodejs.org/api/path.html#path_path_parse_path
	* @param	{string} what
	* @returns {object}
	*/
	parse(what) {
		return import_path.default.parse(what);
	}
	/**
	* @param	{string} what
	* @returns {boolean}
	*/
	isAbsolute(what) {
		return import_path.default.isAbsolute(what || this.path);
	}
	/**
	* Check if path ends with a directory
	* @param	{string} what
	* @returns {boolean}
	*/
	isDirectory(what) {
		return what.charAt(what.length - 1) === "/";
	}
	/**
	* Resolve a path against the directory of the Path
	*
	* https://nodejs.org/api/path.html#path_path_resolve_paths
	* @param	{string} what
	* @returns {string} resolved
	*/
	resolve(what) {
		return import_path.default.resolve(this.directory, what);
	}
	/**
	* Resolve a path relative to the directory of the Path
	*
	* https://nodejs.org/api/path.html#path_path_relative_from_to
	* @param	{string} what
	* @returns {string} relative
	*/
	relative(what) {
		if (what && what.indexOf("://") > -1) return what;
		return import_path.default.relative(this.directory, what);
	}
	splitPath(filename) {
		return this.splitPathRe.exec(filename).slice(1);
	}
	/**
	* Return the path string
	* @returns {string} path
	*/
	toString() {
		return this.path;
	}
};
//#endregion
//#region node_modules/epubjs/src/utils/url.js
/**
* creates a Url object for parsing and manipulation of a url string
* @param	{string} urlString	a url string (relative or absolute)
* @param	{string} [baseString] optional base for the url,
* default to window.location.href
*/
var Url = class {
	constructor(urlString, baseString) {
		var absolute = urlString.indexOf("://") > -1;
		var pathname = urlString;
		var basePath;
		this.Url = void 0;
		this.href = urlString;
		this.protocol = "";
		this.origin = "";
		this.hash = "";
		this.hash = "";
		this.search = "";
		this.base = baseString;
		if (!absolute && baseString !== false && typeof baseString !== "string" && window && window.location) this.base = window.location.href;
		if (absolute || this.base) try {
			if (this.base) this.Url = new URL(urlString, this.base);
			else this.Url = new URL(urlString);
			this.href = this.Url.href;
			this.protocol = this.Url.protocol;
			this.origin = this.Url.origin;
			this.hash = this.Url.hash;
			this.search = this.Url.search;
			pathname = this.Url.pathname + (this.Url.search ? this.Url.search : "");
		} catch (e) {
			this.Url = void 0;
			if (this.base) {
				basePath = new Path(this.base);
				pathname = basePath.resolve(pathname);
			}
		}
		this.Path = new Path(pathname);
		this.directory = this.Path.directory;
		this.filename = this.Path.filename;
		this.extension = this.Path.extension;
	}
	/**
	* @returns {Path}
	*/
	path() {
		return this.Path;
	}
	/**
	* Resolves a relative path to a absolute url
	* @param {string} what
	* @returns {string} url
	*/
	resolve(what) {
		var isAbsolute = what.indexOf("://") > -1;
		var fullpath;
		if (isAbsolute) return what;
		fullpath = import_path.default.resolve(this.directory, what);
		return this.origin + fullpath;
	}
	/**
	* Resolve a path relative to the url
	* @param {string} what
	* @returns {string} path
	*/
	relative(what) {
		return import_path.default.relative(what, this.directory);
	}
	/**
	* @returns {string}
	*/
	toString() {
		return this.href;
	}
};
//#endregion
//#region node_modules/epubjs/src/epubcfi.js
var ELEMENT_NODE$1 = 1;
var TEXT_NODE = 3;
var DOCUMENT_NODE = 9;
/**
* Parsing and creation of EpubCFIs: http://www.idpf.org/epub/linking/cfi/epub-cfi.html

* Implements:
* - Character Offset: epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)
* - Simple Ranges : epubcfi(/6/4[chap01ref]!/4[body01]/10[para05],/2/1:1,/3:4)

* Does Not Implement:
* - Temporal Offset (~)
* - Spatial Offset (@)
* - Temporal-Spatial Offset (~ + @)
* - Text Location Assertion ([)
* @class
@param {string | Range | Node } [cfiFrom]
@param {string | object} [base]
@param {string} [ignoreClass] class to ignore when parsing DOM
*/
var EpubCFI = class EpubCFI {
	constructor(cfiFrom, base, ignoreClass) {
		var type;
		this.str = "";
		this.base = {};
		this.spinePos = 0;
		this.range = false;
		this.path = {};
		this.start = null;
		this.end = null;
		if (!(this instanceof EpubCFI)) return new EpubCFI(cfiFrom, base, ignoreClass);
		if (typeof base === "string") this.base = this.parseComponent(base);
		else if (typeof base === "object" && base.steps) this.base = base;
		type = this.checkType(cfiFrom);
		if (type === "string") {
			this.str = cfiFrom;
			return extend(this, this.parse(cfiFrom));
		} else if (type === "range") return extend(this, this.fromRange(cfiFrom, this.base, ignoreClass));
		else if (type === "node") return extend(this, this.fromNode(cfiFrom, this.base, ignoreClass));
		else if (type === "EpubCFI" && cfiFrom.path) return cfiFrom;
		else if (!cfiFrom) return this;
		else throw new TypeError("not a valid argument for EpubCFI");
	}
	/**
	* Check the type of constructor input
	* @private
	*/
	checkType(cfi) {
		if (this.isCfiString(cfi)) return "string";
		else if (cfi && typeof cfi === "object" && (type(cfi) === "Range" || typeof cfi.startContainer != "undefined")) return "range";
		else if (cfi && typeof cfi === "object" && typeof cfi.nodeType != "undefined") return "node";
		else if (cfi && typeof cfi === "object" && cfi instanceof EpubCFI) return "EpubCFI";
		else return false;
	}
	/**
	* Parse a cfi string to a CFI object representation
	* @param {string} cfiStr
	* @returns {object} cfi
	*/
	parse(cfiStr) {
		var cfi = {
			spinePos: -1,
			range: false,
			base: {},
			path: {},
			start: null,
			end: null
		};
		var baseComponent, pathComponent, range;
		if (typeof cfiStr !== "string") return { spinePos: -1 };
		if (cfiStr.indexOf("epubcfi(") === 0 && cfiStr[cfiStr.length - 1] === ")") cfiStr = cfiStr.slice(8, cfiStr.length - 1);
		baseComponent = this.getChapterComponent(cfiStr);
		if (!baseComponent) return { spinePos: -1 };
		cfi.base = this.parseComponent(baseComponent);
		pathComponent = this.getPathComponent(cfiStr);
		cfi.path = this.parseComponent(pathComponent);
		range = this.getRange(cfiStr);
		if (range) {
			cfi.range = true;
			cfi.start = this.parseComponent(range[0]);
			cfi.end = this.parseComponent(range[1]);
		}
		cfi.spinePos = cfi.base.steps[1].index;
		return cfi;
	}
	parseComponent(componentStr) {
		var component = {
			steps: [],
			terminal: {
				offset: null,
				assertion: null
			}
		};
		var parts = componentStr.split(":");
		var steps = parts[0].split("/");
		var terminal;
		if (parts.length > 1) {
			terminal = parts[1];
			component.terminal = this.parseTerminal(terminal);
		}
		if (steps[0] === "") steps.shift();
		component.steps = steps.map(function(step) {
			return this.parseStep(step);
		}.bind(this));
		return component;
	}
	parseStep(stepStr) {
		var type, num, index, has_brackets = stepStr.match(/\[(.*)\]/), id;
		if (has_brackets && has_brackets[1]) id = has_brackets[1];
		num = parseInt(stepStr);
		if (isNaN(num)) return;
		if (num % 2 === 0) {
			type = "element";
			index = num / 2 - 1;
		} else {
			type = "text";
			index = (num - 1) / 2;
		}
		return {
			"type": type,
			"index": index,
			"id": id || null
		};
	}
	parseTerminal(termialStr) {
		var characterOffset, textLocationAssertion;
		var assertion = termialStr.match(/\[(.*)\]/);
		if (assertion && assertion[1]) {
			characterOffset = parseInt(termialStr.split("[")[0]);
			textLocationAssertion = assertion[1];
		} else characterOffset = parseInt(termialStr);
		if (!isNumber(characterOffset)) characterOffset = null;
		return {
			"offset": characterOffset,
			"assertion": textLocationAssertion
		};
	}
	getChapterComponent(cfiStr) {
		return cfiStr.split("!")[0];
	}
	getPathComponent(cfiStr) {
		var indirection = cfiStr.split("!");
		if (indirection[1]) return indirection[1].split(",")[0];
	}
	getRange(cfiStr) {
		var ranges = cfiStr.split(",");
		if (ranges.length === 3) return [ranges[1], ranges[2]];
		return false;
	}
	getCharecterOffsetComponent(cfiStr) {
		return cfiStr.split(":")[1] || "";
	}
	joinSteps(steps) {
		if (!steps) return "";
		return steps.map(function(part) {
			var segment = "";
			if (part.type === "element") segment += (part.index + 1) * 2;
			if (part.type === "text") segment += 1 + 2 * part.index;
			if (part.id) segment += "[" + part.id + "]";
			return segment;
		}).join("/");
	}
	segmentString(segment) {
		var segmentString = "/";
		segmentString += this.joinSteps(segment.steps);
		if (segment.terminal && segment.terminal.offset != null) segmentString += ":" + segment.terminal.offset;
		if (segment.terminal && segment.terminal.assertion != null) segmentString += "[" + segment.terminal.assertion + "]";
		return segmentString;
	}
	/**
	* Convert CFI to a epubcfi(...) string
	* @returns {string} epubcfi
	*/
	toString() {
		var cfiString = "epubcfi(";
		cfiString += this.segmentString(this.base);
		cfiString += "!";
		cfiString += this.segmentString(this.path);
		if (this.range && this.start) {
			cfiString += ",";
			cfiString += this.segmentString(this.start);
		}
		if (this.range && this.end) {
			cfiString += ",";
			cfiString += this.segmentString(this.end);
		}
		cfiString += ")";
		return cfiString;
	}
	/**
	* Compare which of two CFIs is earlier in the text
	* @returns {number} First is earlier = -1, Second is earlier = 1, They are equal = 0
	*/
	compare(cfiOne, cfiTwo) {
		var stepsA, stepsB;
		var terminalA, terminalB;
		if (typeof cfiOne === "string") cfiOne = new EpubCFI(cfiOne);
		if (typeof cfiTwo === "string") cfiTwo = new EpubCFI(cfiTwo);
		if (cfiOne.spinePos > cfiTwo.spinePos) return 1;
		if (cfiOne.spinePos < cfiTwo.spinePos) return -1;
		if (cfiOne.range) {
			stepsA = cfiOne.path.steps.concat(cfiOne.start.steps);
			terminalA = cfiOne.start.terminal;
		} else {
			stepsA = cfiOne.path.steps;
			terminalA = cfiOne.path.terminal;
		}
		if (cfiTwo.range) {
			stepsB = cfiTwo.path.steps.concat(cfiTwo.start.steps);
			terminalB = cfiTwo.start.terminal;
		} else {
			stepsB = cfiTwo.path.steps;
			terminalB = cfiTwo.path.terminal;
		}
		for (var i = 0; i < stepsA.length; i++) {
			if (!stepsA[i]) return -1;
			if (!stepsB[i]) return 1;
			if (stepsA[i].index > stepsB[i].index) return 1;
			if (stepsA[i].index < stepsB[i].index) return -1;
		}
		if (stepsA.length < stepsB.length) return -1;
		if (terminalA.offset > terminalB.offset) return 1;
		if (terminalA.offset < terminalB.offset) return -1;
		return 0;
	}
	step(node) {
		var nodeType = node.nodeType === TEXT_NODE ? "text" : "element";
		return {
			"id": node.id,
			"tagName": node.tagName,
			"type": nodeType,
			"index": this.position(node)
		};
	}
	filteredStep(node, ignoreClass) {
		var filteredNode = this.filter(node, ignoreClass);
		var nodeType;
		if (!filteredNode) return;
		nodeType = filteredNode.nodeType === TEXT_NODE ? "text" : "element";
		return {
			"id": filteredNode.id,
			"tagName": filteredNode.tagName,
			"type": nodeType,
			"index": this.filteredPosition(filteredNode, ignoreClass)
		};
	}
	pathTo(node, offset, ignoreClass) {
		var segment = {
			steps: [],
			terminal: {
				offset: null,
				assertion: null
			}
		};
		var currentNode = node;
		var step;
		while (currentNode && currentNode.parentNode && currentNode.parentNode.nodeType != DOCUMENT_NODE) {
			if (ignoreClass) step = this.filteredStep(currentNode, ignoreClass);
			else step = this.step(currentNode);
			if (step) segment.steps.unshift(step);
			currentNode = currentNode.parentNode;
		}
		if (offset != null && offset >= 0) {
			segment.terminal.offset = offset;
			if (segment.steps[segment.steps.length - 1].type != "text") segment.steps.push({
				"type": "text",
				"index": 0
			});
		}
		return segment;
	}
	equalStep(stepA, stepB) {
		if (!stepA || !stepB) return false;
		if (stepA.index === stepB.index && stepA.id === stepB.id && stepA.type === stepB.type) return true;
		return false;
	}
	/**
	* Create a CFI object from a Range
	* @param {Range} range
	* @param {string | object} base
	* @param {string} [ignoreClass]
	* @returns {object} cfi
	*/
	fromRange(range, base, ignoreClass) {
		var cfi = {
			range: false,
			base: {},
			path: {},
			start: null,
			end: null
		};
		var start = range.startContainer;
		var end = range.endContainer;
		var startOffset = range.startOffset;
		var endOffset = range.endOffset;
		var needsIgnoring = false;
		if (ignoreClass) needsIgnoring = start.ownerDocument.querySelector("." + ignoreClass) != null;
		if (typeof base === "string") {
			cfi.base = this.parseComponent(base);
			cfi.spinePos = cfi.base.steps[1].index;
		} else if (typeof base === "object") cfi.base = base;
		if (range.collapsed) {
			if (needsIgnoring) startOffset = this.patchOffset(start, startOffset, ignoreClass);
			cfi.path = this.pathTo(start, startOffset, ignoreClass);
		} else {
			cfi.range = true;
			if (needsIgnoring) startOffset = this.patchOffset(start, startOffset, ignoreClass);
			cfi.start = this.pathTo(start, startOffset, ignoreClass);
			if (needsIgnoring) endOffset = this.patchOffset(end, endOffset, ignoreClass);
			cfi.end = this.pathTo(end, endOffset, ignoreClass);
			cfi.path = {
				steps: [],
				terminal: null
			};
			var len = cfi.start.steps.length;
			var i;
			for (i = 0; i < len; i++) if (this.equalStep(cfi.start.steps[i], cfi.end.steps[i])) if (i === len - 1) {
				if (cfi.start.terminal === cfi.end.terminal) {
					cfi.path.steps.push(cfi.start.steps[i]);
					cfi.range = false;
				}
			} else cfi.path.steps.push(cfi.start.steps[i]);
			else break;
			cfi.start.steps = cfi.start.steps.slice(cfi.path.steps.length);
			cfi.end.steps = cfi.end.steps.slice(cfi.path.steps.length);
		}
		return cfi;
	}
	/**
	* Create a CFI object from a Node
	* @param {Node} anchor
	* @param {string | object} base
	* @param {string} [ignoreClass]
	* @returns {object} cfi
	*/
	fromNode(anchor, base, ignoreClass) {
		var cfi = {
			range: false,
			base: {},
			path: {},
			start: null,
			end: null
		};
		if (typeof base === "string") {
			cfi.base = this.parseComponent(base);
			cfi.spinePos = cfi.base.steps[1].index;
		} else if (typeof base === "object") cfi.base = base;
		cfi.path = this.pathTo(anchor, null, ignoreClass);
		return cfi;
	}
	filter(anchor, ignoreClass) {
		var needsIgnoring;
		var sibling;
		var parent, previousSibling, nextSibling;
		var isText = false;
		if (anchor.nodeType === TEXT_NODE) {
			isText = true;
			parent = anchor.parentNode;
			needsIgnoring = anchor.parentNode.classList.contains(ignoreClass);
		} else {
			isText = false;
			needsIgnoring = anchor.classList.contains(ignoreClass);
		}
		if (needsIgnoring && isText) {
			previousSibling = parent.previousSibling;
			nextSibling = parent.nextSibling;
			if (previousSibling && previousSibling.nodeType === TEXT_NODE) sibling = previousSibling;
			else if (nextSibling && nextSibling.nodeType === TEXT_NODE) sibling = nextSibling;
			if (sibling) return sibling;
			else return anchor;
		} else if (needsIgnoring && !isText) return false;
		else return anchor;
	}
	patchOffset(anchor, offset, ignoreClass) {
		if (anchor.nodeType != TEXT_NODE) throw new Error("Anchor must be a text node");
		var curr = anchor;
		var totalOffset = offset;
		if (anchor.parentNode.classList.contains(ignoreClass)) curr = anchor.parentNode;
		while (curr.previousSibling) {
			if (curr.previousSibling.nodeType === ELEMENT_NODE$1) if (curr.previousSibling.classList.contains(ignoreClass)) totalOffset += curr.previousSibling.textContent.length;
			else break;
			else totalOffset += curr.previousSibling.textContent.length;
			curr = curr.previousSibling;
		}
		return totalOffset;
	}
	normalizedMap(children, nodeType, ignoreClass) {
		var output = {};
		var prevIndex = -1;
		var i, len = children.length;
		var currNodeType;
		var prevNodeType;
		for (i = 0; i < len; i++) {
			currNodeType = children[i].nodeType;
			if (currNodeType === ELEMENT_NODE$1 && children[i].classList.contains(ignoreClass)) currNodeType = TEXT_NODE;
			if (i > 0 && currNodeType === TEXT_NODE && prevNodeType === TEXT_NODE) output[i] = prevIndex;
			else if (nodeType === currNodeType) {
				prevIndex = prevIndex + 1;
				output[i] = prevIndex;
			}
			prevNodeType = currNodeType;
		}
		return output;
	}
	position(anchor) {
		var children, index;
		if (anchor.nodeType === ELEMENT_NODE$1) {
			children = anchor.parentNode.children;
			if (!children) children = findChildren(anchor.parentNode);
			index = Array.prototype.indexOf.call(children, anchor);
		} else {
			children = this.textNodes(anchor.parentNode);
			index = children.indexOf(anchor);
		}
		return index;
	}
	filteredPosition(anchor, ignoreClass) {
		var children, index, map;
		if (anchor.nodeType === ELEMENT_NODE$1) {
			children = anchor.parentNode.children;
			map = this.normalizedMap(children, ELEMENT_NODE$1, ignoreClass);
		} else {
			children = anchor.parentNode.childNodes;
			if (anchor.parentNode.classList.contains(ignoreClass)) {
				anchor = anchor.parentNode;
				children = anchor.parentNode.childNodes;
			}
			map = this.normalizedMap(children, TEXT_NODE, ignoreClass);
		}
		index = Array.prototype.indexOf.call(children, anchor);
		return map[index];
	}
	stepsToXpath(steps) {
		var xpath = [".", "*"];
		steps.forEach(function(step) {
			var position = step.index + 1;
			if (step.id) xpath.push("*[position()=" + position + " and @id='" + step.id + "']");
			else if (step.type === "text") xpath.push("text()[" + position + "]");
			else xpath.push("*[" + position + "]");
		});
		return xpath.join("/");
	}
	stepsToQuerySelector(steps) {
		var query = ["html"];
		steps.forEach(function(step) {
			var position = step.index + 1;
			if (step.id) query.push("#" + step.id);
			else if (step.type === "text") {} else query.push("*:nth-child(" + position + ")");
		});
		return query.join(">");
	}
	textNodes(container, ignoreClass) {
		return Array.prototype.slice.call(container.childNodes).filter(function(node) {
			if (node.nodeType === TEXT_NODE) return true;
			else if (ignoreClass && node.classList.contains(ignoreClass)) return true;
			return false;
		});
	}
	walkToNode(steps, _doc, ignoreClass) {
		var doc = _doc || document;
		var container = doc.documentElement;
		var children;
		var step;
		var len = steps.length;
		var i;
		for (i = 0; i < len; i++) {
			step = steps[i];
			if (step.type === "element") if (step.id) container = doc.getElementById(step.id);
			else {
				children = container.children || findChildren(container);
				container = children[step.index];
			}
			else if (step.type === "text") container = this.textNodes(container, ignoreClass)[step.index];
			if (!container) break;
		}
		return container;
	}
	findNode(steps, _doc, ignoreClass) {
		var doc = _doc || document;
		var container;
		var xpath;
		if (!ignoreClass && typeof doc.evaluate != "undefined") {
			xpath = this.stepsToXpath(steps);
			container = doc.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		} else if (ignoreClass) container = this.walkToNode(steps, doc, ignoreClass);
		else container = this.walkToNode(steps, doc);
		return container;
	}
	fixMiss(steps, offset, _doc, ignoreClass) {
		var container = this.findNode(steps.slice(0, -1), _doc, ignoreClass);
		var children = container.childNodes;
		var map = this.normalizedMap(children, TEXT_NODE, ignoreClass);
		var child;
		var len;
		var lastStepIndex = steps[steps.length - 1].index;
		for (let childIndex in map) {
			if (!map.hasOwnProperty(childIndex)) return;
			if (map[childIndex] === lastStepIndex) {
				child = children[childIndex];
				len = child.textContent.length;
				if (offset > len) offset = offset - len;
				else {
					if (child.nodeType === ELEMENT_NODE$1) container = child.childNodes[0];
					else container = child;
					break;
				}
			}
		}
		return {
			container,
			offset
		};
	}
	/**
	* Creates a DOM range representing a CFI
	* @param {document} _doc document referenced in the base
	* @param {string} [ignoreClass]
	* @return {Range}
	*/
	toRange(_doc, ignoreClass) {
		var doc = _doc || document;
		var range;
		var start, end, startContainer, endContainer;
		var cfi = this;
		var startSteps, endSteps;
		var needsIgnoring = ignoreClass ? doc.querySelector("." + ignoreClass) != null : false;
		var missed;
		if (typeof doc.createRange !== "undefined") range = doc.createRange();
		else range = new RangeObject();
		if (cfi.range) {
			start = cfi.start;
			startSteps = cfi.path.steps.concat(start.steps);
			startContainer = this.findNode(startSteps, doc, needsIgnoring ? ignoreClass : null);
			end = cfi.end;
			endSteps = cfi.path.steps.concat(end.steps);
			endContainer = this.findNode(endSteps, doc, needsIgnoring ? ignoreClass : null);
		} else {
			start = cfi.path;
			startSteps = cfi.path.steps;
			startContainer = this.findNode(cfi.path.steps, doc, needsIgnoring ? ignoreClass : null);
		}
		if (startContainer) try {
			if (start.terminal.offset != null) range.setStart(startContainer, start.terminal.offset);
			else range.setStart(startContainer, 0);
		} catch (e) {
			missed = this.fixMiss(startSteps, start.terminal.offset, doc, needsIgnoring ? ignoreClass : null);
			range.setStart(missed.container, missed.offset);
		}
		else {
			console.log("No startContainer found for", this.toString());
			return null;
		}
		if (endContainer) try {
			if (end.terminal.offset != null) range.setEnd(endContainer, end.terminal.offset);
			else range.setEnd(endContainer, 0);
		} catch (e) {
			missed = this.fixMiss(endSteps, cfi.end.terminal.offset, doc, needsIgnoring ? ignoreClass : null);
			range.setEnd(missed.container, missed.offset);
		}
		return range;
	}
	/**
	* Check if a string is wrapped with "epubcfi()"
	* @param {string} str
	* @returns {boolean}
	*/
	isCfiString(str) {
		if (typeof str === "string" && str.indexOf("epubcfi(") === 0 && str[str.length - 1] === ")") return true;
		return false;
	}
	generateChapterComponent(_spineNodeIndex, _pos, id) {
		var pos = parseInt(_pos), cfi = "/" + (_spineNodeIndex + 1) * 2 + "/";
		cfi += (pos + 1) * 2;
		if (id) cfi += "[" + id + "]";
		return cfi;
	}
	/**
	* Collapse a CFI Range to a single CFI Position
	* @param {boolean} [toStart=false]
	*/
	collapse(toStart) {
		if (!this.range) return;
		this.range = false;
		if (toStart) {
			this.path.steps = this.path.steps.concat(this.start.steps);
			this.path.terminal = this.start.terminal;
		} else {
			this.path.steps = this.path.steps.concat(this.end.steps);
			this.path.terminal = this.end.terminal;
		}
	}
};
//#endregion
//#region node_modules/epubjs/src/utils/hook.js
/**
* Hooks allow for injecting functions that must all complete in order before finishing
* They will execute in parallel but all must finish before continuing
* Functions may return a promise if they are async.
* @param {any} context scope of this
* @example this.content = new EPUBJS.Hook(this);
*/
var Hook = class {
	constructor(context) {
		this.context = context || this;
		this.hooks = [];
	}
	/**
	* Adds a function to be run before a hook completes
	* @example this.content.register(function(){...});
	*/
	register() {
		for (var i = 0; i < arguments.length; ++i) if (typeof arguments[i] === "function") this.hooks.push(arguments[i]);
		else for (var j = 0; j < arguments[i].length; ++j) this.hooks.push(arguments[i][j]);
	}
	/**
	* Removes a function
	* @example this.content.deregister(function(){...});
	*/
	deregister(func) {
		let hook;
		for (let i = 0; i < this.hooks.length; i++) {
			hook = this.hooks[i];
			if (hook === func) {
				this.hooks.splice(i, 1);
				break;
			}
		}
	}
	/**
	* Triggers a hook to run all functions
	* @example this.content.trigger(args).then(function(){...});
	*/
	trigger() {
		var args = arguments;
		var context = this.context;
		var promises = [];
		this.hooks.forEach(function(task) {
			try {
				var executing = task.apply(context, args);
			} catch (err) {
				console.log(err);
			}
			if (executing && typeof executing["then"] === "function") promises.push(executing);
		});
		return Promise.all(promises);
	}
	list() {
		return this.hooks;
	}
	clear() {
		return this.hooks = [];
	}
};
//#endregion
//#region node_modules/epubjs/src/utils/replacements.js
function replaceBase(doc, section) {
	var base;
	var head;
	var url = section.url;
	var absolute = url.indexOf("://") > -1;
	if (!doc) return;
	head = qs(doc, "head");
	base = qs(head, "base");
	if (!base) {
		base = doc.createElement("base");
		head.insertBefore(base, head.firstChild);
	}
	if (!absolute && window && window.location) url = window.location.origin + url;
	base.setAttribute("href", url);
}
function replaceCanonical(doc, section) {
	var head;
	var link;
	var url = section.canonical;
	if (!doc) return;
	head = qs(doc, "head");
	link = qs(head, "link[rel='canonical']");
	if (link) link.setAttribute("href", url);
	else {
		link = doc.createElement("link");
		link.setAttribute("rel", "canonical");
		link.setAttribute("href", url);
		head.appendChild(link);
	}
}
function replaceMeta(doc, section) {
	var head;
	var meta;
	var id = section.idref;
	if (!doc) return;
	head = qs(doc, "head");
	meta = qs(head, "link[property='dc.identifier']");
	if (meta) meta.setAttribute("content", id);
	else {
		meta = doc.createElement("meta");
		meta.setAttribute("name", "dc.identifier");
		meta.setAttribute("content", id);
		head.appendChild(meta);
	}
}
function replaceLinks(contents, fn) {
	var links = contents.querySelectorAll("a[href]");
	if (!links.length) return;
	var base = qs(contents.ownerDocument, "base");
	var location = base ? base.getAttribute("href") : void 0;
	var replaceLink = function(link) {
		var href = link.getAttribute("href");
		if (href.indexOf("mailto:") === 0) return;
		if (href.indexOf("://") > -1) link.setAttribute("target", "_blank");
		else {
			var linkUrl;
			try {
				linkUrl = new Url(href, location);
			} catch (error) {}
			link.onclick = function() {
				if (linkUrl && linkUrl.hash) fn(linkUrl.Path.path + linkUrl.hash);
				else if (linkUrl) fn(linkUrl.Path.path);
				else fn(href);
				return false;
			};
		}
	}.bind(this);
	for (var i = 0; i < links.length; i++) replaceLink(links[i]);
}
function substitute(content, urls, replacements) {
	urls.forEach(function(url, i) {
		if (url && replacements[i]) {
			url = url.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
			content = content.replace(new RegExp(url, "g"), replacements[i]);
		}
	});
	return content;
}
//#endregion
//#region node_modules/epubjs/src/utils/request.js
function request(url, type, withCredentials, headers) {
	var supportsURL = typeof window != "undefined" ? window.URL : false;
	var BLOB_RESPONSE = supportsURL ? "blob" : "arraybuffer";
	var deferred = new defer();
	var xhr = new XMLHttpRequest();
	var xhrPrototype = XMLHttpRequest.prototype;
	var header;
	if (!("overrideMimeType" in xhrPrototype)) Object.defineProperty(xhrPrototype, "overrideMimeType", { value: function xmlHttpRequestOverrideMimeType() {} });
	if (withCredentials) xhr.withCredentials = true;
	xhr.onreadystatechange = handler;
	xhr.onerror = err;
	xhr.open("GET", url, true);
	for (header in headers) xhr.setRequestHeader(header, headers[header]);
	if (type == "json") xhr.setRequestHeader("Accept", "application/json");
	if (!type) type = new Path(url).extension;
	if (type == "blob") xhr.responseType = BLOB_RESPONSE;
	if (isXml(type)) xhr.overrideMimeType("text/xml");
	if (type == "xhtml") {}
	if (type == "html" || type == "htm") {}
	if (type == "binary") xhr.responseType = "arraybuffer";
	xhr.send();
	function err(e) {
		deferred.reject(e);
	}
	function handler() {
		if (this.readyState === XMLHttpRequest.DONE) {
			var responseXML = false;
			if (this.responseType === "" || this.responseType === "document") responseXML = this.responseXML;
			if (this.status === 200 || this.status === 0 || responseXML) {
				var r;
				if (!this.response && !responseXML) {
					deferred.reject({
						status: this.status,
						message: "Empty Response",
						stack: (/* @__PURE__ */ new Error()).stack
					});
					return deferred.promise;
				}
				if (this.status === 403) {
					deferred.reject({
						status: this.status,
						response: this.response,
						message: "Forbidden",
						stack: (/* @__PURE__ */ new Error()).stack
					});
					return deferred.promise;
				}
				if (responseXML) r = this.responseXML;
				else if (isXml(type)) r = parse(this.response, "text/xml");
				else if (type == "xhtml") r = parse(this.response, "application/xhtml+xml");
				else if (type == "html" || type == "htm") r = parse(this.response, "text/html");
				else if (type == "json") r = JSON.parse(this.response);
				else if (type == "blob") if (supportsURL) r = this.response;
				else r = new Blob([this.response]);
				else r = this.response;
				deferred.resolve(r);
			} else deferred.reject({
				status: this.status,
				message: this.response,
				stack: (/* @__PURE__ */ new Error()).stack
			});
		}
	}
	return deferred.promise;
}
//#endregion
//#region node_modules/epubjs/src/section.js
/**
* Represents a Section of the Book
*
* In most books this is equivalent to a Chapter
* @param {object} item  The spine item representing the section
* @param {object} hooks hooks for serialize and content
*/
var Section = class {
	constructor(item, hooks) {
		this.idref = item.idref;
		this.linear = item.linear === "yes";
		this.properties = item.properties;
		this.index = item.index;
		this.href = item.href;
		this.url = item.url;
		this.canonical = item.canonical;
		this.next = item.next;
		this.prev = item.prev;
		this.cfiBase = item.cfiBase;
		if (hooks) this.hooks = hooks;
		else {
			this.hooks = {};
			this.hooks.serialize = new Hook(this);
			this.hooks.content = new Hook(this);
		}
		this.document = void 0;
		this.contents = void 0;
		this.output = void 0;
	}
	/**
	* Load the section from its url
	* @param  {method} [_request] a request method to use for loading
	* @return {document} a promise with the xml document
	*/
	load(_request) {
		var request$1 = _request || this.request || request;
		var loading = new defer();
		var loaded = loading.promise;
		if (this.contents) loading.resolve(this.contents);
		else request$1(this.url).then(function(xml) {
			this.document = xml;
			this.contents = xml.documentElement;
			return this.hooks.content.trigger(this.document, this);
		}.bind(this)).then(function() {
			loading.resolve(this.contents);
		}.bind(this)).catch(function(error) {
			loading.reject(error);
		});
		return loaded;
	}
	/**
	* Adds a base tag for resolving urls in the section
	* @private
	*/
	base() {
		return replaceBase(this.document, this);
	}
	/**
	* Render the contents of a section
	* @param  {method} [_request] a request method to use for loading
	* @return {string} output a serialized XML Document
	*/
	render(_request) {
		var rendering = new defer();
		var rendered = rendering.promise;
		this.output;
		this.load(_request).then(function(contents) {
			var isIE = (typeof navigator !== "undefined" && navigator.userAgent || "").indexOf("Trident") >= 0;
			var Serializer;
			if (typeof XMLSerializer === "undefined" || isIE) Serializer = import_lib.DOMParser;
			else Serializer = XMLSerializer;
			var serializer = new Serializer();
			this.output = serializer.serializeToString(contents);
			return this.output;
		}.bind(this)).then(function() {
			return this.hooks.serialize.trigger(this.output, this);
		}.bind(this)).then(function() {
			rendering.resolve(this.output);
		}.bind(this)).catch(function(error) {
			rendering.reject(error);
		});
		return rendered;
	}
	/**
	* Find a string in a section
	* @param  {string} _query The query string to find
	* @return {object[]} A list of matches, with form {cfi, excerpt}
	*/
	find(_query) {
		var section = this;
		var matches = [];
		var query = _query.toLowerCase();
		var find = function(node) {
			var text = node.textContent.toLowerCase();
			var range = section.document.createRange();
			var cfi;
			var pos;
			var last = -1;
			var excerpt;
			var limit = 150;
			while (pos != -1) {
				pos = text.indexOf(query, last + 1);
				if (pos != -1) {
					range = section.document.createRange();
					range.setStart(node, pos);
					range.setEnd(node, pos + query.length);
					cfi = section.cfiFromRange(range);
					if (node.textContent.length < limit) excerpt = node.textContent;
					else {
						excerpt = node.textContent.substring(pos - limit / 2, pos + limit / 2);
						excerpt = "..." + excerpt + "...";
					}
					matches.push({
						cfi,
						excerpt
					});
				}
				last = pos;
			}
		};
		sprint(section.document, function(node) {
			find(node);
		});
		return matches;
	}
	/**
	* Search a string in multiple sequential Element of the section. If the document.createTreeWalker api is missed(eg: IE8), use `find` as a fallback.
	* @param  {string} _query The query string to search
	* @param  {int} maxSeqEle The maximum number of Element that are combined for search, default value is 5.
	* @return {object[]} A list of matches, with form {cfi, excerpt}
	*/
	search(_query, maxSeqEle = 5) {
		if (typeof document.createTreeWalker == "undefined") return this.find(_query);
		let matches = [];
		const excerptLimit = 150;
		const section = this;
		const query = _query.toLowerCase();
		const search = function(nodeList) {
			const pos = nodeList.reduce((acc, current) => {
				return acc + current.textContent;
			}, "").toLowerCase().indexOf(query);
			if (pos != -1) {
				const startNodeIndex = 0, endPos = pos + query.length;
				let endNodeIndex = 0, l = 0;
				if (pos < nodeList[startNodeIndex].length) {
					let cfi;
					while (endNodeIndex < nodeList.length - 1) {
						l += nodeList[endNodeIndex].length;
						if (endPos <= l) break;
						endNodeIndex += 1;
					}
					let startNode = nodeList[startNodeIndex], endNode = nodeList[endNodeIndex];
					let range = section.document.createRange();
					range.setStart(startNode, pos);
					let beforeEndLengthCount = nodeList.slice(0, endNodeIndex).reduce((acc, current) => {
						return acc + current.textContent.length;
					}, 0);
					range.setEnd(endNode, beforeEndLengthCount > endPos ? endPos : endPos - beforeEndLengthCount);
					cfi = section.cfiFromRange(range);
					let excerpt = nodeList.slice(0, endNodeIndex + 1).reduce((acc, current) => {
						return acc + current.textContent;
					}, "");
					if (excerpt.length > excerptLimit) {
						excerpt = excerpt.substring(pos - excerptLimit / 2, pos + excerptLimit / 2);
						excerpt = "..." + excerpt + "...";
					}
					matches.push({
						cfi,
						excerpt
					});
				}
			}
		};
		const treeWalker = document.createTreeWalker(section.document, NodeFilter.SHOW_TEXT, null, false);
		let node, nodeList = [];
		while (node = treeWalker.nextNode()) {
			nodeList.push(node);
			if (nodeList.length == maxSeqEle) {
				search(nodeList.slice(0, maxSeqEle));
				nodeList = nodeList.slice(1, maxSeqEle);
			}
		}
		if (nodeList.length > 0) search(nodeList);
		return matches;
	}
	/**
	* Reconciles the current chapters layout properties with
	* the global layout properties.
	* @param {object} globalLayout  The global layout settings object, chapter properties string
	* @return {object} layoutProperties Object with layout properties
	*/
	reconcileLayoutSettings(globalLayout) {
		var settings = {
			layout: globalLayout.layout,
			spread: globalLayout.spread,
			orientation: globalLayout.orientation
		};
		this.properties.forEach(function(prop) {
			var rendition = prop.replace("rendition:", "");
			var split = rendition.indexOf("-");
			var property, value;
			if (split != -1) {
				property = rendition.slice(0, split);
				value = rendition.slice(split + 1);
				settings[property] = value;
			}
		});
		return settings;
	}
	/**
	* Get a CFI from a Range in the Section
	* @param  {range} _range
	* @return {string} cfi an EpubCFI string
	*/
	cfiFromRange(_range) {
		return new EpubCFI(_range, this.cfiBase).toString();
	}
	/**
	* Get a CFI from an Element in the Section
	* @param  {element} el
	* @return {string} cfi an EpubCFI string
	*/
	cfiFromElement(el) {
		return new EpubCFI(el, this.cfiBase).toString();
	}
	/**
	* Unload the section document
	*/
	unload() {
		this.document = void 0;
		this.contents = void 0;
		this.output = void 0;
	}
	destroy() {
		this.unload();
		this.hooks.serialize.clear();
		this.hooks.content.clear();
		this.hooks = void 0;
		this.idref = void 0;
		this.linear = void 0;
		this.properties = void 0;
		this.index = void 0;
		this.href = void 0;
		this.url = void 0;
		this.next = void 0;
		this.prev = void 0;
		this.cfiBase = void 0;
	}
};
//#endregion
//#region node_modules/epubjs/src/spine.js
/**
* A collection of Spine Items
*/
var Spine = class {
	constructor() {
		this.spineItems = [];
		this.spineByHref = {};
		this.spineById = {};
		this.hooks = {};
		this.hooks.serialize = new Hook();
		this.hooks.content = new Hook();
		this.hooks.content.register(replaceBase);
		this.hooks.content.register(replaceCanonical);
		this.hooks.content.register(replaceMeta);
		this.epubcfi = new EpubCFI();
		this.loaded = false;
		this.items = void 0;
		this.manifest = void 0;
		this.spineNodeIndex = void 0;
		this.baseUrl = void 0;
		this.length = void 0;
	}
	/**
	* Unpack items from a opf into spine items
	* @param  {Packaging} _package
	* @param  {method} resolver URL resolver
	* @param  {method} canonical Resolve canonical url
	*/
	unpack(_package, resolver, canonical) {
		this.items = _package.spine;
		this.manifest = _package.manifest;
		this.spineNodeIndex = _package.spineNodeIndex;
		this.baseUrl = _package.baseUrl || _package.basePath || "";
		this.length = this.items.length;
		this.items.forEach((item, index) => {
			var manifestItem = this.manifest[item.idref];
			var spineItem;
			item.index = index;
			item.cfiBase = this.epubcfi.generateChapterComponent(this.spineNodeIndex, item.index, item.id);
			if (item.href) {
				item.url = resolver(item.href, true);
				item.canonical = canonical(item.href);
			}
			if (manifestItem) {
				item.href = manifestItem.href;
				item.url = resolver(item.href, true);
				item.canonical = canonical(item.href);
				if (manifestItem.properties.length) item.properties.push.apply(item.properties, manifestItem.properties);
			}
			if (item.linear === "yes") {
				item.prev = function() {
					let prevIndex = item.index;
					while (prevIndex > 0) {
						let prev = this.get(prevIndex - 1);
						if (prev && prev.linear) return prev;
						prevIndex -= 1;
					}
				}.bind(this);
				item.next = function() {
					let nextIndex = item.index;
					while (nextIndex < this.spineItems.length - 1) {
						let next = this.get(nextIndex + 1);
						if (next && next.linear) return next;
						nextIndex += 1;
					}
				}.bind(this);
			} else {
				item.prev = function() {};
				item.next = function() {};
			}
			spineItem = new Section(item, this.hooks);
			this.append(spineItem);
		});
		this.loaded = true;
	}
	/**
	* Get an item from the spine
	* @param  {string|number} [target]
	* @return {Section} section
	* @example spine.get();
	* @example spine.get(1);
	* @example spine.get("chap1.html");
	* @example spine.get("#id1234");
	*/
	get(target) {
		var index = 0;
		if (typeof target === "undefined") while (index < this.spineItems.length) {
			let next = this.spineItems[index];
			if (next && next.linear) break;
			index += 1;
		}
		else if (this.epubcfi.isCfiString(target)) index = new EpubCFI(target).spinePos;
		else if (typeof target === "number" || isNaN(target) === false) index = target;
		else if (typeof target === "string" && target.indexOf("#") === 0) index = this.spineById[target.substring(1)];
		else if (typeof target === "string") {
			target = target.split("#")[0];
			index = this.spineByHref[target] || this.spineByHref[encodeURI(target)];
		}
		return this.spineItems[index] || null;
	}
	/**
	* Append a Section to the Spine
	* @private
	* @param  {Section} section
	*/
	append(section) {
		var index = this.spineItems.length;
		section.index = index;
		this.spineItems.push(section);
		this.spineByHref[decodeURI(section.href)] = index;
		this.spineByHref[encodeURI(section.href)] = index;
		this.spineByHref[section.href] = index;
		this.spineById[section.idref] = index;
		return index;
	}
	/**
	* Prepend a Section to the Spine
	* @private
	* @param  {Section} section
	*/
	prepend(section) {
		this.spineByHref[section.href] = 0;
		this.spineById[section.idref] = 0;
		this.spineItems.forEach(function(item, index) {
			item.index = index;
		});
		return 0;
	}
	/**
	* Remove a Section from the Spine
	* @private
	* @param  {Section} section
	*/
	remove(section) {
		var index = this.spineItems.indexOf(section);
		if (index > -1) {
			delete this.spineByHref[section.href];
			delete this.spineById[section.idref];
			return this.spineItems.splice(index, 1);
		}
	}
	/**
	* Loop over the Sections in the Spine
	* @return {method} forEach
	*/
	each() {
		return this.spineItems.forEach.apply(this.spineItems, arguments);
	}
	/**
	* Find the first Section in the Spine
	* @return {Section} first section
	*/
	first() {
		let index = 0;
		do {
			let next = this.get(index);
			if (next && next.linear) return next;
			index += 1;
		} while (index < this.spineItems.length);
	}
	/**
	* Find the last Section in the Spine
	* @return {Section} last section
	*/
	last() {
		let index = this.spineItems.length - 1;
		do {
			let prev = this.get(index);
			if (prev && prev.linear) return prev;
			index -= 1;
		} while (index >= 0);
	}
	destroy() {
		this.each((section) => section.destroy());
		this.spineItems = void 0;
		this.spineByHref = void 0;
		this.spineById = void 0;
		this.hooks.serialize.clear();
		this.hooks.content.clear();
		this.hooks = void 0;
		this.epubcfi = void 0;
		this.loaded = false;
		this.items = void 0;
		this.manifest = void 0;
		this.spineNodeIndex = void 0;
		this.baseUrl = void 0;
		this.length = void 0;
	}
};
//#endregion
//#region node_modules/epubjs/src/utils/queue.js
/**
* Queue for handling tasks one at a time
* @class
* @param {scope} context what this will resolve to in the tasks
*/
var Queue = class {
	constructor(context) {
		this._q = [];
		this.context = context;
		this.tick = requestAnimationFrame$1;
		this.running = false;
		this.paused = false;
	}
	/**
	* Add an item to the queue
	* @return {Promise}
	*/
	enqueue() {
		var deferred, promise;
		var queued;
		var task = [].shift.call(arguments);
		var args = arguments;
		if (!task) throw new Error("No Task Provided");
		if (typeof task === "function") {
			deferred = new defer();
			promise = deferred.promise;
			queued = {
				"task": task,
				"args": args,
				"deferred": deferred,
				"promise": promise
			};
		} else queued = { "promise": task };
		this._q.push(queued);
		if (this.paused == false && !this.running) this.run();
		return queued.promise;
	}
	/**
	* Run one item
	* @return {Promise}
	*/
	dequeue() {
		var inwait, task, result;
		if (this._q.length && !this.paused) {
			inwait = this._q.shift();
			task = inwait.task;
			if (task) {
				result = task.apply(this.context, inwait.args);
				if (result && typeof result["then"] === "function") return result.then(function() {
					inwait.deferred.resolve.apply(this.context, arguments);
				}.bind(this), function() {
					inwait.deferred.reject.apply(this.context, arguments);
				}.bind(this));
				else {
					inwait.deferred.resolve.apply(this.context, result);
					return inwait.promise;
				}
			} else if (inwait.promise) return inwait.promise;
		} else {
			inwait = new defer();
			inwait.deferred.resolve();
			return inwait.promise;
		}
	}
	dump() {
		while (this._q.length) this.dequeue();
	}
	/**
	* Run all tasks sequentially, at convince
	* @return {Promise}
	*/
	run() {
		if (!this.running) {
			this.running = true;
			this.defered = new defer();
		}
		this.tick.call(window, () => {
			if (this._q.length) this.dequeue().then(function() {
				this.run();
			}.bind(this));
			else {
				this.defered.resolve();
				this.running = void 0;
			}
		});
		if (this.paused == true) this.paused = false;
		return this.defered.promise;
	}
	/**
	* Flush all, as quickly as possible
	* @return {Promise}
	*/
	flush() {
		if (this.running) return this.running;
		if (this._q.length) {
			this.running = this.dequeue().then(function() {
				this.running = void 0;
				return this.flush();
			}.bind(this));
			return this.running;
		}
	}
	/**
	* Clear all items in wait
	*/
	clear() {
		this._q = [];
	}
	/**
	* Get the number of tasks in the queue
	* @return {number} tasks
	*/
	length() {
		return this._q.length;
	}
	/**
	* Pause a running queue
	*/
	pause() {
		this.paused = true;
	}
	/**
	* End the queue
	*/
	stop() {
		this._q = [];
		this.running = false;
		this.paused = true;
	}
};
//#endregion
//#region node_modules/epubjs/src/utils/constants.js
var DOM_EVENTS = [
	"keydown",
	"keyup",
	"keypressed",
	"mouseup",
	"mousedown",
	"mousemove",
	"click",
	"touchend",
	"touchstart",
	"touchmove"
];
var EVENTS = {
	BOOK: { OPEN_FAILED: "openFailed" },
	CONTENTS: {
		EXPAND: "expand",
		RESIZE: "resize",
		SELECTED: "selected",
		SELECTED_RANGE: "selectedRange",
		LINK_CLICKED: "linkClicked"
	},
	LOCATIONS: { CHANGED: "changed" },
	MANAGERS: {
		RESIZE: "resize",
		RESIZED: "resized",
		ORIENTATION_CHANGE: "orientationchange",
		ADDED: "added",
		SCROLL: "scroll",
		SCROLLED: "scrolled",
		REMOVED: "removed"
	},
	VIEWS: {
		AXIS: "axis",
		WRITING_MODE: "writingMode",
		LOAD_ERROR: "loaderror",
		RENDERED: "rendered",
		RESIZED: "resized",
		DISPLAYED: "displayed",
		SHOWN: "shown",
		HIDDEN: "hidden",
		MARK_CLICKED: "markClicked"
	},
	RENDITION: {
		STARTED: "started",
		ATTACHED: "attached",
		DISPLAYED: "displayed",
		DISPLAY_ERROR: "displayerror",
		RENDERED: "rendered",
		REMOVED: "removed",
		RESIZED: "resized",
		ORIENTATION_CHANGE: "orientationchange",
		LOCATION_CHANGED: "locationChanged",
		RELOCATED: "relocated",
		MARK_CLICKED: "markClicked",
		SELECTED: "selected",
		LAYOUT: "layout"
	},
	LAYOUT: { UPDATED: "updated" },
	ANNOTATION: {
		ATTACH: "attach",
		DETACH: "detach"
	}
};
//#endregion
//#region node_modules/epubjs/src/locations.js
/**
* Find Locations for a Book
* @param {Spine} spine
* @param {request} request
* @param {number} [pause=100]
*/
var Locations = class {
	constructor(spine, request, pause) {
		this.spine = spine;
		this.request = request;
		this.pause = pause || 100;
		this.q = new Queue(this);
		this.epubcfi = new EpubCFI();
		this._locations = [];
		this._locationsWords = [];
		this.total = 0;
		this.break = 150;
		this._current = 0;
		this._wordCounter = 0;
		this.currentLocation = "";
		this._currentCfi = "";
		this.processingTimeout = void 0;
	}
	/**
	* Load all of sections in the book to generate locations
	* @param  {int} chars how many chars to split on
	* @return {Promise<Array<string>>} locations
	*/
	generate(chars) {
		if (chars) this.break = chars;
		this.q.pause();
		this.spine.each(function(section) {
			if (section.linear) this.q.enqueue(this.process.bind(this), section);
		}.bind(this));
		return this.q.run().then(function() {
			this.total = this._locations.length - 1;
			if (this._currentCfi) this.currentLocation = this._currentCfi;
			return this._locations;
		}.bind(this));
	}
	createRange() {
		return {
			startContainer: void 0,
			startOffset: void 0,
			endContainer: void 0,
			endOffset: void 0
		};
	}
	process(section) {
		return section.load(this.request).then(function(contents) {
			var completed = new defer();
			var locations = this.parse(contents, section.cfiBase);
			this._locations = this._locations.concat(locations);
			section.unload();
			this.processingTimeout = setTimeout(() => completed.resolve(locations), this.pause);
			return completed.promise;
		}.bind(this));
	}
	parse(contents, cfiBase, chars) {
		var locations = [];
		var range;
		var doc = contents.ownerDocument;
		var body = qs(doc, "body");
		var counter = 0;
		var prev;
		var _break = chars || this.break;
		var parser = function(node) {
			var len = node.length;
			var dist;
			var pos = 0;
			if (node.textContent.trim().length === 0) return false;
			if (counter == 0) {
				range = this.createRange();
				range.startContainer = node;
				range.startOffset = 0;
			}
			dist = _break - counter;
			if (dist > len) {
				counter += len;
				pos = len;
			}
			while (pos < len) {
				dist = _break - counter;
				if (counter === 0) {
					pos += 1;
					range = this.createRange();
					range.startContainer = node;
					range.startOffset = pos;
				}
				if (pos + dist >= len) {
					counter += len - pos;
					pos = len;
				} else {
					pos += dist;
					range.endContainer = node;
					range.endOffset = pos;
					let cfi = new EpubCFI(range, cfiBase).toString();
					locations.push(cfi);
					counter = 0;
				}
			}
			prev = node;
		};
		sprint(body, parser.bind(this));
		if (range && range.startContainer && prev) {
			range.endContainer = prev;
			range.endOffset = prev.length;
			let cfi = new EpubCFI(range, cfiBase).toString();
			locations.push(cfi);
			counter = 0;
		}
		return locations;
	}
	/**
	* Load all of sections in the book to generate locations
	* @param  {string} startCfi start position
	* @param  {int} wordCount how many words to split on
	* @param  {int} count result count
	* @return {object} locations
	*/
	generateFromWords(startCfi, wordCount, count) {
		var start = startCfi ? new EpubCFI(startCfi) : void 0;
		this.q.pause();
		this._locationsWords = [];
		this._wordCounter = 0;
		this.spine.each(function(section) {
			if (section.linear) if (start) {
				if (section.index >= start.spinePos) this.q.enqueue(this.processWords.bind(this), section, wordCount, start, count);
			} else this.q.enqueue(this.processWords.bind(this), section, wordCount, start, count);
		}.bind(this));
		return this.q.run().then(function() {
			if (this._currentCfi) this.currentLocation = this._currentCfi;
			return this._locationsWords;
		}.bind(this));
	}
	processWords(section, wordCount, startCfi, count) {
		if (count && this._locationsWords.length >= count) return Promise.resolve();
		return section.load(this.request).then(function(contents) {
			var completed = new defer();
			var locations = this.parseWords(contents, section, wordCount, startCfi);
			var remainingCount = count - this._locationsWords.length;
			this._locationsWords = this._locationsWords.concat(locations.length >= count ? locations.slice(0, remainingCount) : locations);
			section.unload();
			this.processingTimeout = setTimeout(() => completed.resolve(locations), this.pause);
			return completed.promise;
		}.bind(this));
	}
	countWords(s) {
		s = s.replace(/(^\s*)|(\s*$)/gi, "");
		s = s.replace(/[ ]{2,}/gi, " ");
		s = s.replace(/\n /, "\n");
		return s.split(" ").length;
	}
	parseWords(contents, section, wordCount, startCfi) {
		var cfiBase = section.cfiBase;
		var locations = [];
		var doc = contents.ownerDocument;
		var body = qs(doc, "body");
		var _break = wordCount;
		var foundStartNode = startCfi ? startCfi.spinePos !== section.index : true;
		var startNode;
		if (startCfi && section.index === startCfi.spinePos) startNode = startCfi.findNode(startCfi.range ? startCfi.path.steps.concat(startCfi.start.steps) : startCfi.path.steps, contents.ownerDocument);
		var parser = function(node) {
			if (!foundStartNode) if (node === startNode) foundStartNode = true;
			else return false;
			if (node.textContent.length < 10) {
				if (node.textContent.trim().length === 0) return false;
			}
			var len = this.countWords(node.textContent);
			var dist;
			var pos = 0;
			if (len === 0) return false;
			dist = _break - this._wordCounter;
			if (dist > len) {
				this._wordCounter += len;
				pos = len;
			}
			while (pos < len) {
				dist = _break - this._wordCounter;
				if (pos + dist >= len) {
					this._wordCounter += len - pos;
					pos = len;
				} else {
					pos += dist;
					let cfi = new EpubCFI(node, cfiBase);
					locations.push({
						cfi: cfi.toString(),
						wordCount: this._wordCounter
					});
					this._wordCounter = 0;
				}
			}
		};
		sprint(body, parser.bind(this));
		return locations;
	}
	/**
	* Get a location from an EpubCFI
	* @param {EpubCFI} cfi
	* @return {number}
	*/
	locationFromCfi(cfi) {
		let loc;
		if (EpubCFI.prototype.isCfiString(cfi)) cfi = new EpubCFI(cfi);
		if (this._locations.length === 0) return -1;
		loc = locationOf(cfi, this._locations, this.epubcfi.compare);
		if (loc > this.total) return this.total;
		return loc;
	}
	/**
	* Get a percentage position in locations from an EpubCFI
	* @param {EpubCFI} cfi
	* @return {number}
	*/
	percentageFromCfi(cfi) {
		if (this._locations.length === 0) return null;
		var loc = this.locationFromCfi(cfi);
		return this.percentageFromLocation(loc);
	}
	/**
	* Get a percentage position from a location index
	* @param {number} location
	* @return {number}
	*/
	percentageFromLocation(loc) {
		if (!loc || !this.total) return 0;
		return loc / this.total;
	}
	/**
	* Get an EpubCFI from location index
	* @param {number} loc
	* @return {EpubCFI} cfi
	*/
	cfiFromLocation(loc) {
		var cfi = -1;
		if (typeof loc != "number") loc = parseInt(loc);
		if (loc >= 0 && loc < this._locations.length) cfi = this._locations[loc];
		return cfi;
	}
	/**
	* Get an EpubCFI from location percentage
	* @param {number} percentage
	* @return {EpubCFI} cfi
	*/
	cfiFromPercentage(percentage) {
		let loc;
		if (percentage > 1) console.warn("Normalize cfiFromPercentage value to between 0 - 1");
		if (percentage >= 1) {
			let cfi = new EpubCFI(this._locations[this.total]);
			cfi.collapse();
			return cfi.toString();
		}
		loc = Math.ceil(this.total * percentage);
		return this.cfiFromLocation(loc);
	}
	/**
	* Load locations from JSON
	* @param {json} locations
	*/
	load(locations) {
		if (typeof locations === "string") this._locations = JSON.parse(locations);
		else this._locations = locations;
		this.total = this._locations.length - 1;
		return this._locations;
	}
	/**
	* Save locations to JSON
	* @return {json}
	*/
	save() {
		return JSON.stringify(this._locations);
	}
	getCurrent() {
		return this._current;
	}
	setCurrent(curr) {
		var loc;
		if (typeof curr == "string") this._currentCfi = curr;
		else if (typeof curr == "number") this._current = curr;
		else return;
		if (this._locations.length === 0) return;
		if (typeof curr == "string") {
			loc = this.locationFromCfi(curr);
			this._current = loc;
		} else loc = curr;
		this.emit(EVENTS.LOCATIONS.CHANGED, { percentage: this.percentageFromLocation(loc) });
	}
	/**
	* Get the current location
	*/
	get currentLocation() {
		return this._current;
	}
	/**
	* Set the current location
	*/
	set currentLocation(curr) {
		this.setCurrent(curr);
	}
	/**
	* Locations length
	*/
	length() {
		return this._locations.length;
	}
	destroy() {
		this.spine = void 0;
		this.request = void 0;
		this.pause = void 0;
		this.q.stop();
		this.q = void 0;
		this.epubcfi = void 0;
		this._locations = void 0;
		this.total = void 0;
		this.break = void 0;
		this._current = void 0;
		this.currentLocation = void 0;
		this._currentCfi = void 0;
		clearTimeout(this.processingTimeout);
	}
};
(0, import_event_emitter.default)(Locations.prototype);
//#endregion
//#region node_modules/epubjs/src/container.js
/**
* Handles Parsing and Accessing an Epub Container
* @class
* @param {document} [containerDocument] xml document
*/
var Container = class {
	constructor(containerDocument) {
		this.packagePath = "";
		this.directory = "";
		this.encoding = "";
		if (containerDocument) this.parse(containerDocument);
	}
	/**
	* Parse the Container XML
	* @param  {document} containerDocument
	*/
	parse(containerDocument) {
		var rootfile;
		if (!containerDocument) throw new Error("Container File Not Found");
		rootfile = qs(containerDocument, "rootfile");
		if (!rootfile) throw new Error("No RootFile Found");
		this.packagePath = rootfile.getAttribute("full-path");
		this.directory = import_path.default.dirname(this.packagePath);
		this.encoding = containerDocument.xmlEncoding;
	}
	destroy() {
		this.packagePath = void 0;
		this.directory = void 0;
		this.encoding = void 0;
	}
};
//#endregion
//#region node_modules/epubjs/src/packaging.js
/**
* Open Packaging Format Parser
* @class
* @param {document} packageDocument OPF XML
*/
var Packaging = class {
	constructor(packageDocument) {
		this.manifest = {};
		this.navPath = "";
		this.ncxPath = "";
		this.coverPath = "";
		this.spineNodeIndex = 0;
		this.spine = [];
		this.metadata = {};
		if (packageDocument) this.parse(packageDocument);
	}
	/**
	* Parse OPF XML
	* @param  {document} packageDocument OPF XML
	* @return {object} parsed package parts
	*/
	parse(packageDocument) {
		var metadataNode, manifestNode, spineNode;
		if (!packageDocument) throw new Error("Package File Not Found");
		metadataNode = qs(packageDocument, "metadata");
		if (!metadataNode) throw new Error("No Metadata Found");
		manifestNode = qs(packageDocument, "manifest");
		if (!manifestNode) throw new Error("No Manifest Found");
		spineNode = qs(packageDocument, "spine");
		if (!spineNode) throw new Error("No Spine Found");
		this.manifest = this.parseManifest(manifestNode);
		this.navPath = this.findNavPath(manifestNode);
		this.ncxPath = this.findNcxPath(manifestNode, spineNode);
		this.coverPath = this.findCoverPath(packageDocument);
		this.spineNodeIndex = indexOfElementNode(spineNode);
		this.spine = this.parseSpine(spineNode, this.manifest);
		this.uniqueIdentifier = this.findUniqueIdentifier(packageDocument);
		this.metadata = this.parseMetadata(metadataNode);
		this.metadata.direction = spineNode.getAttribute("page-progression-direction");
		return {
			"metadata": this.metadata,
			"spine": this.spine,
			"manifest": this.manifest,
			"navPath": this.navPath,
			"ncxPath": this.ncxPath,
			"coverPath": this.coverPath,
			"spineNodeIndex": this.spineNodeIndex
		};
	}
	/**
	* Parse Metadata
	* @private
	* @param  {node} xml
	* @return {object} metadata
	*/
	parseMetadata(xml) {
		var metadata = {};
		metadata.title = this.getElementText(xml, "title");
		metadata.creator = this.getElementText(xml, "creator");
		metadata.description = this.getElementText(xml, "description");
		metadata.pubdate = this.getElementText(xml, "date");
		metadata.publisher = this.getElementText(xml, "publisher");
		metadata.identifier = this.getElementText(xml, "identifier");
		metadata.language = this.getElementText(xml, "language");
		metadata.rights = this.getElementText(xml, "rights");
		metadata.modified_date = this.getPropertyText(xml, "dcterms:modified");
		metadata.layout = this.getPropertyText(xml, "rendition:layout");
		metadata.orientation = this.getPropertyText(xml, "rendition:orientation");
		metadata.flow = this.getPropertyText(xml, "rendition:flow");
		metadata.viewport = this.getPropertyText(xml, "rendition:viewport");
		metadata.media_active_class = this.getPropertyText(xml, "media:active-class");
		metadata.spread = this.getPropertyText(xml, "rendition:spread");
		return metadata;
	}
	/**
	* Parse Manifest
	* @private
	* @param  {node} manifestXml
	* @return {object} manifest
	*/
	parseManifest(manifestXml) {
		var manifest = {};
		var selected = qsa(manifestXml, "item");
		Array.prototype.slice.call(selected).forEach(function(item) {
			var id = item.getAttribute("id"), href = item.getAttribute("href") || "", type = item.getAttribute("media-type") || "", overlay = item.getAttribute("media-overlay") || "", properties = item.getAttribute("properties") || "";
			manifest[id] = {
				"href": href,
				"type": type,
				"overlay": overlay,
				"properties": properties.length ? properties.split(" ") : []
			};
		});
		return manifest;
	}
	/**
	* Parse Spine
	* @private
	* @param  {node} spineXml
	* @param  {Packaging.manifest} manifest
	* @return {object} spine
	*/
	parseSpine(spineXml, manifest) {
		var spine = [];
		var selected = qsa(spineXml, "itemref");
		Array.prototype.slice.call(selected).forEach(function(item, index) {
			var idref = item.getAttribute("idref");
			var props = item.getAttribute("properties") || "";
			var propArray = props.length ? props.split(" ") : [];
			var itemref = {
				"id": item.getAttribute("id"),
				"idref": idref,
				"linear": item.getAttribute("linear") || "yes",
				"properties": propArray,
				"index": index
			};
			spine.push(itemref);
		});
		return spine;
	}
	/**
	* Find Unique Identifier
	* @private
	* @param  {node} packageXml
	* @return {string} Unique Identifier text
	*/
	findUniqueIdentifier(packageXml) {
		var uniqueIdentifierId = packageXml.documentElement.getAttribute("unique-identifier");
		if (!uniqueIdentifierId) return "";
		var identifier = packageXml.getElementById(uniqueIdentifierId);
		if (!identifier) return "";
		if (identifier.localName === "identifier" && identifier.namespaceURI === "http://purl.org/dc/elements/1.1/") return identifier.childNodes.length > 0 ? identifier.childNodes[0].nodeValue.trim() : "";
		return "";
	}
	/**
	* Find TOC NAV
	* @private
	* @param {element} manifestNode
	* @return {string}
	*/
	findNavPath(manifestNode) {
		var node = qsp(manifestNode, "item", { "properties": "nav" });
		return node ? node.getAttribute("href") : false;
	}
	/**
	* Find TOC NCX
	* media-type="application/x-dtbncx+xml" href="toc.ncx"
	* @private
	* @param {element} manifestNode
	* @param {element} spineNode
	* @return {string}
	*/
	findNcxPath(manifestNode, spineNode) {
		var node = qsp(manifestNode, "item", { "media-type": "application/x-dtbncx+xml" });
		var tocId;
		if (!node) {
			tocId = spineNode.getAttribute("toc");
			if (tocId) node = manifestNode.querySelector(`#${tocId}`);
		}
		return node ? node.getAttribute("href") : false;
	}
	/**
	* Find the Cover Path
	* <item properties="cover-image" id="ci" href="cover.svg" media-type="image/svg+xml" />
	* Fallback for Epub 2.0
	* @private
	* @param  {node} packageXml
	* @return {string} href
	*/
	findCoverPath(packageXml) {
		qs(packageXml, "package").getAttribute("version");
		var node = qsp(packageXml, "item", { "properties": "cover-image" });
		if (node) return node.getAttribute("href");
		var metaCover = qsp(packageXml, "meta", { "name": "cover" });
		if (metaCover) {
			var coverId = metaCover.getAttribute("content");
			var cover = packageXml.getElementById(coverId);
			return cover ? cover.getAttribute("href") : "";
		} else return false;
	}
	/**
	* Get text of a namespaced element
	* @private
	* @param  {node} xml
	* @param  {string} tag
	* @return {string} text
	*/
	getElementText(xml, tag) {
		var found = xml.getElementsByTagNameNS("http://purl.org/dc/elements/1.1/", tag);
		var el;
		if (!found || found.length === 0) return "";
		el = found[0];
		if (el.childNodes.length) return el.childNodes[0].nodeValue;
		return "";
	}
	/**
	* Get text by property
	* @private
	* @param  {node} xml
	* @param  {string} property
	* @return {string} text
	*/
	getPropertyText(xml, property) {
		var el = qsp(xml, "meta", { "property": property });
		if (el && el.childNodes.length) return el.childNodes[0].nodeValue;
		return "";
	}
	/**
	* Load JSON Manifest
	* @param  {document} packageDocument OPF XML
	* @return {object} parsed package parts
	*/
	load(json) {
		this.metadata = json.metadata;
		let spine = json.readingOrder || json.spine;
		this.spine = spine.map((item, index) => {
			item.index = index;
			item.linear = item.linear || "yes";
			return item;
		});
		json.resources.forEach((item, index) => {
			this.manifest[index] = item;
			if (item.rel && item.rel[0] === "cover") this.coverPath = item.href;
		});
		this.spineNodeIndex = 0;
		this.toc = json.toc.map((item, index) => {
			item.label = item.title;
			return item;
		});
		return {
			"metadata": this.metadata,
			"spine": this.spine,
			"manifest": this.manifest,
			"navPath": this.navPath,
			"ncxPath": this.ncxPath,
			"coverPath": this.coverPath,
			"spineNodeIndex": this.spineNodeIndex,
			"toc": this.toc
		};
	}
	destroy() {
		this.manifest = void 0;
		this.navPath = void 0;
		this.ncxPath = void 0;
		this.coverPath = void 0;
		this.spineNodeIndex = void 0;
		this.spine = void 0;
		this.metadata = void 0;
	}
};
//#endregion
//#region node_modules/epubjs/src/navigation.js
/**
* Navigation Parser
* @param {document} xml navigation html / xhtml / ncx
*/
var Navigation = class {
	constructor(xml) {
		this.toc = [];
		this.tocByHref = {};
		this.tocById = {};
		this.landmarks = [];
		this.landmarksByType = {};
		this.length = 0;
		if (xml) this.parse(xml);
	}
	/**
	* Parse out the navigation items
	* @param {document} xml navigation html / xhtml / ncx
	*/
	parse(xml) {
		let isXml = xml.nodeType;
		let html;
		let ncx;
		if (isXml) {
			html = qs(xml, "html");
			ncx = qs(xml, "ncx");
		}
		if (!isXml) this.toc = this.load(xml);
		else if (html) {
			this.toc = this.parseNav(xml);
			this.landmarks = this.parseLandmarks(xml);
		} else if (ncx) this.toc = this.parseNcx(xml);
		this.length = 0;
		this.unpack(this.toc);
	}
	/**
	* Unpack navigation items
	* @private
	* @param  {array} toc
	*/
	unpack(toc) {
		var item;
		for (var i = 0; i < toc.length; i++) {
			item = toc[i];
			if (item.href) this.tocByHref[item.href] = i;
			if (item.id) this.tocById[item.id] = i;
			this.length++;
			if (item.subitems.length) this.unpack(item.subitems);
		}
	}
	/**
	* Get an item from the navigation
	* @param  {string} target
	* @return {object} navItem
	*/
	get(target) {
		var index;
		if (!target) return this.toc;
		if (target.indexOf("#") === 0) index = this.tocById[target.substring(1)];
		else if (target in this.tocByHref) index = this.tocByHref[target];
		return this.getByIndex(target, index, this.toc);
	}
	/**
	* Get an item from navigation subitems recursively by index
	* @param  {string} target
	* @param  {number} index
	* @param  {array} navItems
	* @return {object} navItem
	*/
	getByIndex(target, index, navItems) {
		if (navItems.length === 0) return;
		const item = navItems[index];
		if (item && (target === item.id || target === item.href)) return item;
		else {
			let result;
			for (let i = 0; i < navItems.length; ++i) {
				result = this.getByIndex(target, index, navItems[i].subitems);
				if (result) break;
			}
			return result;
		}
	}
	/**
	* Get a landmark by type
	* List of types: https://idpf.github.io/epub-vocabs/structure/
	* @param  {string} type
	* @return {object} landmarkItem
	*/
	landmark(type) {
		var index;
		if (!type) return this.landmarks;
		index = this.landmarksByType[type];
		return this.landmarks[index];
	}
	/**
	* Parse toc from a Epub > 3.0 Nav
	* @private
	* @param  {document} navHtml
	* @return {array} navigation list
	*/
	parseNav(navHtml) {
		var navElement = querySelectorByType(navHtml, "nav", "toc");
		var list = [];
		if (!navElement) return list;
		let navList = filterChildren(navElement, "ol", true);
		if (!navList) return list;
		list = this.parseNavList(navList);
		return list;
	}
	/**
	* Parses lists in the toc
	* @param  {document} navListHtml
	* @param  {string} parent id
	* @return {array} navigation list
	*/
	parseNavList(navListHtml, parent) {
		const result = [];
		if (!navListHtml) return result;
		if (!navListHtml.children) return result;
		for (let i = 0; i < navListHtml.children.length; i++) {
			const item = this.navItem(navListHtml.children[i], parent);
			if (item) result.push(item);
		}
		return result;
	}
	/**
	* Create a navItem
	* @private
	* @param  {element} item
	* @return {object} navItem
	*/
	navItem(item, parent) {
		let id = item.getAttribute("id") || void 0;
		let content = filterChildren(item, "a", true) || filterChildren(item, "span", true);
		if (!content) return;
		let src = content.getAttribute("href") || "";
		if (!id) id = src;
		let text = content.textContent || "";
		let subitems = [];
		let nested = filterChildren(item, "ol", true);
		if (nested) subitems = this.parseNavList(nested, id);
		return {
			"id": id,
			"href": src,
			"label": text,
			"subitems": subitems,
			"parent": parent
		};
	}
	/**
	* Parse landmarks from a Epub > 3.0 Nav
	* @private
	* @param  {document} navHtml
	* @return {array} landmarks list
	*/
	parseLandmarks(navHtml) {
		var navElement = querySelectorByType(navHtml, "nav", "landmarks");
		var navItems = navElement ? qsa(navElement, "li") : [];
		var length = navItems.length;
		var i;
		var list = [];
		var item;
		if (!navItems || length === 0) return list;
		for (i = 0; i < length; ++i) {
			item = this.landmarkItem(navItems[i]);
			if (item) {
				list.push(item);
				this.landmarksByType[item.type] = i;
			}
		}
		return list;
	}
	/**
	* Create a landmarkItem
	* @private
	* @param  {element} item
	* @return {object} landmarkItem
	*/
	landmarkItem(item) {
		let content = filterChildren(item, "a", true);
		if (!content) return;
		let type = content.getAttributeNS("http://www.idpf.org/2007/ops", "type") || void 0;
		return {
			"href": content.getAttribute("href") || "",
			"label": content.textContent || "",
			"type": type
		};
	}
	/**
	* Parse from a Epub > 3.0 NC
	* @private
	* @param  {document} navHtml
	* @return {array} navigation list
	*/
	parseNcx(tocXml) {
		var navPoints = qsa(tocXml, "navPoint");
		var length = navPoints.length;
		var i;
		var toc = {};
		var list = [];
		var item, parent;
		if (!navPoints || length === 0) return list;
		for (i = 0; i < length; ++i) {
			item = this.ncxItem(navPoints[i]);
			toc[item.id] = item;
			if (!item.parent) list.push(item);
			else {
				parent = toc[item.parent];
				parent.subitems.push(item);
			}
		}
		return list;
	}
	/**
	* Create a ncxItem
	* @private
	* @param  {element} item
	* @return {object} ncxItem
	*/
	ncxItem(item) {
		var id = item.getAttribute("id") || false, src = qs(item, "content").getAttribute("src"), navLabel = qs(item, "navLabel"), text = navLabel.textContent ? navLabel.textContent : "", subitems = [], parentNode = item.parentNode, parent;
		if (parentNode && (parentNode.nodeName === "navPoint" || parentNode.nodeName.split(":").slice(-1)[0] === "navPoint")) parent = parentNode.getAttribute("id");
		return {
			"id": id,
			"href": src,
			"label": text,
			"subitems": subitems,
			"parent": parent
		};
	}
	/**
	* Load Spine Items
	* @param  {object} json the items to be loaded
	* @return {Array} navItems
	*/
	load(json) {
		return json.map((item) => {
			item.label = item.title;
			item.subitems = item.children ? this.load(item.children) : [];
			return item;
		});
	}
	/**
	* forEach pass through
	* @param  {Function} fn function to run on each item
	* @return {method} forEach loop
	*/
	forEach(fn) {
		return this.toc.forEach(fn);
	}
};
//#endregion
//#region node_modules/epubjs/src/utils/mime.js
var table = {
	"application": {
		"ecmascript": ["es", "ecma"],
		"javascript": "js",
		"ogg": "ogx",
		"pdf": "pdf",
		"postscript": [
			"ps",
			"ai",
			"eps",
			"epsi",
			"epsf",
			"eps2",
			"eps3"
		],
		"rdf+xml": "rdf",
		"smil": ["smi", "smil"],
		"xhtml+xml": ["xhtml", "xht"],
		"xml": [
			"xml",
			"xsl",
			"xsd",
			"opf",
			"ncx"
		],
		"zip": "zip",
		"x-httpd-eruby": "rhtml",
		"x-latex": "latex",
		"x-maker": [
			"frm",
			"maker",
			"frame",
			"fm",
			"fb",
			"book",
			"fbdoc"
		],
		"x-object": "o",
		"x-shockwave-flash": ["swf", "swfl"],
		"x-silverlight": "scr",
		"epub+zip": "epub",
		"font-tdpfr": "pfr",
		"inkml+xml": ["ink", "inkml"],
		"json": "json",
		"jsonml+json": "jsonml",
		"mathml+xml": "mathml",
		"metalink+xml": "metalink",
		"mp4": "mp4s",
		"omdoc+xml": "omdoc",
		"oxps": "oxps",
		"vnd.amazon.ebook": "azw",
		"widget": "wgt",
		"x-dtbook+xml": "dtb",
		"x-dtbresource+xml": "res",
		"x-font-bdf": "bdf",
		"x-font-ghostscript": "gsf",
		"x-font-linux-psf": "psf",
		"x-font-otf": "otf",
		"x-font-pcf": "pcf",
		"x-font-snf": "snf",
		"x-font-ttf": ["ttf", "ttc"],
		"x-font-type1": [
			"pfa",
			"pfb",
			"pfm",
			"afm"
		],
		"x-font-woff": "woff",
		"x-mobipocket-ebook": ["prc", "mobi"],
		"x-mspublisher": "pub",
		"x-nzb": "nzb",
		"x-tgif": "obj",
		"xaml+xml": "xaml",
		"xml-dtd": "dtd",
		"xproc+xml": "xpl",
		"xslt+xml": "xslt",
		"internet-property-stream": "acx",
		"x-compress": "z",
		"x-compressed": "tgz",
		"x-gzip": "gz"
	},
	"audio": {
		"flac": "flac",
		"midi": [
			"mid",
			"midi",
			"kar",
			"rmi"
		],
		"mpeg": [
			"mpga",
			"mpega",
			"mp2",
			"mp3",
			"m4a",
			"mp2a",
			"m2a",
			"m3a"
		],
		"mpegurl": "m3u",
		"ogg": [
			"oga",
			"ogg",
			"spx"
		],
		"x-aiff": [
			"aif",
			"aiff",
			"aifc"
		],
		"x-ms-wma": "wma",
		"x-wav": "wav",
		"adpcm": "adp",
		"mp4": "mp4a",
		"webm": "weba",
		"x-aac": "aac",
		"x-caf": "caf",
		"x-matroska": "mka",
		"x-pn-realaudio-plugin": "rmp",
		"xm": "xm",
		"mid": ["mid", "rmi"]
	},
	"image": {
		"gif": "gif",
		"ief": "ief",
		"jpeg": [
			"jpeg",
			"jpg",
			"jpe"
		],
		"pcx": "pcx",
		"png": "png",
		"svg+xml": ["svg", "svgz"],
		"tiff": ["tiff", "tif"],
		"x-icon": "ico",
		"bmp": "bmp",
		"webp": "webp",
		"x-pict": ["pic", "pct"],
		"x-tga": "tga",
		"cis-cod": "cod"
	},
	"text": {
		"cache-manifest": ["manifest", "appcache"],
		"css": "css",
		"csv": "csv",
		"html": [
			"html",
			"htm",
			"shtml",
			"stm"
		],
		"mathml": "mml",
		"plain": [
			"txt",
			"text",
			"brf",
			"conf",
			"def",
			"list",
			"log",
			"in",
			"bas"
		],
		"richtext": "rtx",
		"tab-separated-values": "tsv",
		"x-bibtex": "bib"
	},
	"video": {
		"mpeg": [
			"mpeg",
			"mpg",
			"mpe",
			"m1v",
			"m2v",
			"mp2",
			"mpa",
			"mpv2"
		],
		"mp4": [
			"mp4",
			"mp4v",
			"mpg4"
		],
		"quicktime": ["qt", "mov"],
		"ogg": "ogv",
		"vnd.mpegurl": ["mxu", "m4u"],
		"x-flv": "flv",
		"x-la-asf": ["lsf", "lsx"],
		"x-mng": "mng",
		"x-ms-asf": [
			"asf",
			"asx",
			"asr"
		],
		"x-ms-wm": "wm",
		"x-ms-wmv": "wmv",
		"x-ms-wmx": "wmx",
		"x-ms-wvx": "wvx",
		"x-msvideo": "avi",
		"x-sgi-movie": "movie",
		"x-matroska": [
			"mpv",
			"mkv",
			"mk3d",
			"mks"
		],
		"3gpp2": "3g2",
		"h261": "h261",
		"h263": "h263",
		"h264": "h264",
		"jpeg": "jpgv",
		"jpm": ["jpm", "jpgm"],
		"mj2": ["mj2", "mjp2"],
		"vnd.ms-playready.media.pyv": "pyv",
		"vnd.uvvu.mp4": ["uvu", "uvvu"],
		"vnd.vivo": "viv",
		"webm": "webm",
		"x-f4v": "f4v",
		"x-m4v": "m4v",
		"x-ms-vob": "vob",
		"x-smv": "smv"
	}
};
var mimeTypes = (function() {
	var type, subtype, val, index, mimeTypes = {};
	for (type in table) if (table.hasOwnProperty(type)) {
		for (subtype in table[type]) if (table[type].hasOwnProperty(subtype)) {
			val = table[type][subtype];
			if (typeof val == "string") mimeTypes[val] = type + "/" + subtype;
			else for (index = 0; index < val.length; index++) mimeTypes[val[index]] = type + "/" + subtype;
		}
	}
	return mimeTypes;
})();
var defaultValue = "text/plain";
function lookup(filename) {
	return filename && mimeTypes[filename.split(".").pop().toLowerCase()] || defaultValue;
}
var mime_default = { lookup };
//#endregion
//#region node_modules/epubjs/src/resources.js
/**
* Handle Package Resources
* @class
* @param {Manifest} manifest
* @param {object} [options]
* @param {string} [options.replacements="base64"]
* @param {Archive} [options.archive]
* @param {method} [options.resolver]
*/
var Resources = class {
	constructor(manifest, options) {
		this.settings = {
			replacements: options && options.replacements || "base64",
			archive: options && options.archive,
			resolver: options && options.resolver,
			request: options && options.request
		};
		this.process(manifest);
	}
	/**
	* Process resources
	* @param {Manifest} manifest
	*/
	process(manifest) {
		this.manifest = manifest;
		this.resources = Object.keys(manifest).map(function(key) {
			return manifest[key];
		});
		this.replacementUrls = [];
		this.html = [];
		this.assets = [];
		this.css = [];
		this.urls = [];
		this.cssUrls = [];
		this.split();
		this.splitUrls();
	}
	/**
	* Split resources by type
	* @private
	*/
	split() {
		this.html = this.resources.filter(function(item) {
			if (item.type === "application/xhtml+xml" || item.type === "text/html") return true;
		});
		this.assets = this.resources.filter(function(item) {
			if (item.type !== "application/xhtml+xml" && item.type !== "text/html") return true;
		});
		this.css = this.resources.filter(function(item) {
			if (item.type === "text/css") return true;
		});
	}
	/**
	* Convert split resources into Urls
	* @private
	*/
	splitUrls() {
		this.urls = this.assets.map(function(item) {
			return item.href;
		}.bind(this));
		this.cssUrls = this.css.map(function(item) {
			return item.href;
		});
	}
	/**
	* Create a url to a resource
	* @param {string} url
	* @return {Promise<string>} Promise resolves with url string
	*/
	createUrl(url) {
		var parsedUrl = new Url(url);
		var mimeType = mime_default.lookup(parsedUrl.filename);
		if (this.settings.archive) return this.settings.archive.createUrl(url, { "base64": this.settings.replacements === "base64" });
		else if (this.settings.replacements === "base64") return this.settings.request(url, "blob").then((blob) => {
			return blob2base64(blob);
		}).then((blob) => {
			return createBase64Url(blob, mimeType);
		});
		else return this.settings.request(url, "blob").then((blob) => {
			return createBlobUrl(blob, mimeType);
		});
	}
	/**
	* Create blob urls for all the assets
	* @return {Promise}         returns replacement urls
	*/
	replacements() {
		if (this.settings.replacements === "none") return new Promise(function(resolve) {
			resolve(this.urls);
		}.bind(this));
		var replacements = this.urls.map((url) => {
			var absolute = this.settings.resolver(url);
			return this.createUrl(absolute).catch((err) => {
				console.error(err);
				return null;
			});
		});
		return Promise.all(replacements).then((replacementUrls) => {
			this.replacementUrls = replacementUrls.filter((url) => {
				return typeof url === "string";
			});
			return replacementUrls;
		});
	}
	/**
	* Replace URLs in CSS resources
	* @private
	* @param  {Archive} [archive]
	* @param  {method} [resolver]
	* @return {Promise}
	*/
	replaceCss(archive, resolver) {
		var replaced = [];
		archive = archive || this.settings.archive;
		resolver = resolver || this.settings.resolver;
		this.cssUrls.forEach(function(href) {
			var replacement = this.createCssFile(href, archive, resolver).then(function(replacementUrl) {
				var indexInUrls = this.urls.indexOf(href);
				if (indexInUrls > -1) this.replacementUrls[indexInUrls] = replacementUrl;
			}.bind(this));
			replaced.push(replacement);
		}.bind(this));
		return Promise.all(replaced);
	}
	/**
	* Create a new CSS file with the replaced URLs
	* @private
	* @param  {string} href the original css file
	* @return {Promise}  returns a BlobUrl to the new CSS file or a data url
	*/
	createCssFile(href) {
		var newUrl;
		if (import_path.default.isAbsolute(href)) return new Promise(function(resolve) {
			resolve();
		});
		var absolute = this.settings.resolver(href);
		var textResponse;
		if (this.settings.archive) textResponse = this.settings.archive.getText(absolute);
		else textResponse = this.settings.request(absolute, "text");
		var relUrls = this.urls.map((assetHref) => {
			var resolved = this.settings.resolver(assetHref);
			return new Path(absolute).relative(resolved);
		});
		if (!textResponse) return new Promise(function(resolve) {
			resolve();
		});
		return textResponse.then((text) => {
			text = substitute(text, relUrls, this.replacementUrls);
			if (this.settings.replacements === "base64") newUrl = createBase64Url(text, "text/css");
			else newUrl = createBlobUrl(text, "text/css");
			return newUrl;
		}, (err) => {
			return new Promise(function(resolve) {
				resolve();
			});
		});
	}
	/**
	* Resolve all resources URLs relative to an absolute URL
	* @param  {string} absolute to be resolved to
	* @param  {resolver} [resolver]
	* @return {string[]} array with relative Urls
	*/
	relativeTo(absolute, resolver) {
		resolver = resolver || this.settings.resolver;
		return this.urls.map(function(href) {
			var resolved = resolver(href);
			return new Path(absolute).relative(resolved);
		}.bind(this));
	}
	/**
	* Get a URL for a resource
	* @param  {string} path
	* @return {string} url
	*/
	get(path) {
		var indexInUrls = this.urls.indexOf(path);
		if (indexInUrls === -1) return;
		if (this.replacementUrls.length) return new Promise(function(resolve, reject) {
			resolve(this.replacementUrls[indexInUrls]);
		}.bind(this));
		else return this.createUrl(path);
	}
	/**
	* Substitute urls in content, with replacements,
	* relative to a url if provided
	* @param  {string} content
	* @param  {string} [url]   url to resolve to
	* @return {string}         content with urls substituted
	*/
	substitute(content, url) {
		var relUrls;
		if (url) relUrls = this.relativeTo(url);
		else relUrls = this.urls;
		return substitute(content, relUrls, this.replacementUrls);
	}
	destroy() {
		this.settings = void 0;
		this.manifest = void 0;
		this.resources = void 0;
		this.replacementUrls = void 0;
		this.html = void 0;
		this.assets = void 0;
		this.css = void 0;
		this.urls = void 0;
		this.cssUrls = void 0;
	}
};
//#endregion
//#region node_modules/epubjs/src/pagelist.js
/**
* Page List Parser
* @param {document} [xml]
*/
var PageList = class {
	constructor(xml) {
		this.pages = [];
		this.locations = [];
		this.epubcfi = new EpubCFI();
		this.firstPage = 0;
		this.lastPage = 0;
		this.totalPages = 0;
		this.toc = void 0;
		this.ncx = void 0;
		if (xml) this.pageList = this.parse(xml);
		if (this.pageList && this.pageList.length) this.process(this.pageList);
	}
	/**
	* Parse PageList Xml
	* @param  {document} xml
	*/
	parse(xml) {
		var html = qs(xml, "html");
		var ncx = qs(xml, "ncx");
		if (html) return this.parseNav(xml);
		else if (ncx) return this.parseNcx(xml);
	}
	/**
	* Parse a Nav PageList
	* @private
	* @param  {node} navHtml
	* @return {PageList.item[]} list
	*/
	parseNav(navHtml) {
		var navElement = querySelectorByType(navHtml, "nav", "page-list");
		var navItems = navElement ? qsa(navElement, "li") : [];
		var length = navItems.length;
		var i;
		var list = [];
		var item;
		if (!navItems || length === 0) return list;
		for (i = 0; i < length; ++i) {
			item = this.item(navItems[i]);
			list.push(item);
		}
		return list;
	}
	parseNcx(navXml) {
		var list = [];
		var i = 0;
		var item;
		var pageList;
		var pageTargets;
		var length = 0;
		pageList = qs(navXml, "pageList");
		if (!pageList) return list;
		pageTargets = qsa(pageList, "pageTarget");
		length = pageTargets.length;
		if (!pageTargets || pageTargets.length === 0) return list;
		for (i = 0; i < length; ++i) {
			item = this.ncxItem(pageTargets[i]);
			list.push(item);
		}
		return list;
	}
	ncxItem(item) {
		var pageText = qs(qs(item, "navLabel"), "text").textContent;
		return {
			"href": qs(item, "content").getAttribute("src"),
			"page": parseInt(pageText, 10)
		};
	}
	/**
	* Page List Item
	* @private
	* @param  {node} item
	* @return {object} pageListItem
	*/
	item(item) {
		var content = qs(item, "a"), href = content.getAttribute("href") || "", text = content.textContent || "", page = parseInt(text), isCfi = href.indexOf("epubcfi"), split, packageUrl, cfi;
		if (isCfi != -1) {
			split = href.split("#");
			packageUrl = split[0];
			cfi = split.length > 1 ? split[1] : false;
			return {
				"cfi": cfi,
				"href": href,
				"packageUrl": packageUrl,
				"page": page
			};
		} else return {
			"href": href,
			"page": page
		};
	}
	/**
	* Process pageList items
	* @private
	* @param  {array} pageList
	*/
	process(pageList) {
		pageList.forEach(function(item) {
			this.pages.push(item.page);
			if (item.cfi) this.locations.push(item.cfi);
		}, this);
		this.firstPage = parseInt(this.pages[0]);
		this.lastPage = parseInt(this.pages[this.pages.length - 1]);
		this.totalPages = this.lastPage - this.firstPage;
	}
	/**
	* Get a PageList result from a EpubCFI
	* @param  {string} cfi EpubCFI String
	* @return {number} page
	*/
	pageFromCfi(cfi) {
		var pg = -1;
		if (this.locations.length === 0) return -1;
		var index = indexOfSorted(cfi, this.locations, this.epubcfi.compare);
		if (index != -1) pg = this.pages[index];
		else {
			index = locationOf(cfi, this.locations, this.epubcfi.compare);
			pg = index - 1 >= 0 ? this.pages[index - 1] : this.pages[0];
			if (pg !== void 0) {} else pg = -1;
		}
		return pg;
	}
	/**
	* Get an EpubCFI from a Page List Item
	* @param  {string | number} pg
	* @return {string} cfi
	*/
	cfiFromPage(pg) {
		var cfi = -1;
		if (typeof pg != "number") pg = parseInt(pg);
		var index = this.pages.indexOf(pg);
		if (index != -1) cfi = this.locations[index];
		return cfi;
	}
	/**
	* Get a Page from Book percentage
	* @param  {number} percent
	* @return {number} page
	*/
	pageFromPercentage(percent) {
		return Math.round(this.totalPages * percent);
	}
	/**
	* Returns a value between 0 - 1 corresponding to the location of a page
	* @param  {number} pg the page
	* @return {number} percentage
	*/
	percentageFromPage(pg) {
		var percentage = (pg - this.firstPage) / this.totalPages;
		return Math.round(percentage * 1e3) / 1e3;
	}
	/**
	* Returns a value between 0 - 1 corresponding to the location of a cfi
	* @param  {string} cfi EpubCFI String
	* @return {number} percentage
	*/
	percentageFromCfi(cfi) {
		var pg = this.pageFromCfi(cfi);
		return this.percentageFromPage(pg);
	}
	/**
	* Destroy
	*/
	destroy() {
		this.pages = void 0;
		this.locations = void 0;
		this.epubcfi = void 0;
		this.pageList = void 0;
		this.toc = void 0;
		this.ncx = void 0;
	}
};
//#endregion
//#region node_modules/epubjs/src/layout.js
/**
* Figures out the CSS values to apply for a layout
* @class
* @param {object} settings
* @param {string} [settings.layout='reflowable']
* @param {string} [settings.spread]
* @param {number} [settings.minSpreadWidth=800]
* @param {boolean} [settings.evenSpreads=false]
*/
var Layout = class {
	constructor(settings) {
		this.settings = settings;
		this.name = settings.layout || "reflowable";
		this._spread = settings.spread === "none" ? false : true;
		this._minSpreadWidth = settings.minSpreadWidth || 800;
		this._evenSpreads = settings.evenSpreads || false;
		if (settings.flow === "scrolled" || settings.flow === "scrolled-continuous" || settings.flow === "scrolled-doc") this._flow = "scrolled";
		else this._flow = "paginated";
		this.width = 0;
		this.height = 0;
		this.spreadWidth = 0;
		this.delta = 0;
		this.columnWidth = 0;
		this.gap = 0;
		this.divisor = 1;
		this.props = {
			name: this.name,
			spread: this._spread,
			flow: this._flow,
			width: 0,
			height: 0,
			spreadWidth: 0,
			delta: 0,
			columnWidth: 0,
			gap: 0,
			divisor: 1
		};
	}
	/**
	* Switch the flow between paginated and scrolled
	* @param  {string} flow paginated | scrolled
	* @return {string} simplified flow
	*/
	flow(flow) {
		if (typeof flow != "undefined") {
			if (flow === "scrolled" || flow === "scrolled-continuous" || flow === "scrolled-doc") this._flow = "scrolled";
			else this._flow = "paginated";
			this.update({ flow: this._flow });
		}
		return this._flow;
	}
	/**
	* Switch between using spreads or not, and set the
	* width at which they switch to single.
	* @param  {string} spread "none" | "always" | "auto"
	* @param  {number} min integer in pixels
	* @return {boolean} spread true | false
	*/
	spread(spread, min) {
		if (spread) {
			this._spread = spread === "none" ? false : true;
			this.update({ spread: this._spread });
		}
		if (min >= 0) this._minSpreadWidth = min;
		return this._spread;
	}
	/**
	* Calculate the dimensions of the pagination
	* @param  {number} _width  width of the rendering
	* @param  {number} _height height of the rendering
	* @param  {number} _gap    width of the gap between columns
	*/
	calculate(_width, _height, _gap) {
		var divisor = 1;
		var gap = _gap || 0;
		var width = _width;
		var height = _height;
		var section = Math.floor(width / 12);
		var columnWidth;
		var spreadWidth;
		var pageWidth;
		var delta;
		if (this._spread && width >= this._minSpreadWidth) divisor = 2;
		else divisor = 1;
		if (this.name === "reflowable" && this._flow === "paginated" && !(_gap >= 0)) gap = section % 2 === 0 ? section : section - 1;
		if (this.name === "pre-paginated") gap = 0;
		if (divisor > 1) {
			columnWidth = width / divisor - gap;
			pageWidth = columnWidth + gap;
		} else {
			columnWidth = width;
			pageWidth = width;
		}
		if (this.name === "pre-paginated" && divisor > 1) width = columnWidth;
		spreadWidth = columnWidth * divisor + gap;
		delta = width;
		this.width = width;
		this.height = height;
		this.spreadWidth = spreadWidth;
		this.pageWidth = pageWidth;
		this.delta = delta;
		this.columnWidth = columnWidth;
		this.gap = gap;
		this.divisor = divisor;
		this.update({
			width,
			height,
			spreadWidth,
			pageWidth,
			delta,
			columnWidth,
			gap,
			divisor
		});
	}
	/**
	* Apply Css to a Document
	* @param  {Contents} contents
	* @return {Promise}
	*/
	format(contents, section, axis) {
		var formating;
		if (this.name === "pre-paginated") formating = contents.fit(this.columnWidth, this.height, section);
		else if (this._flow === "paginated") formating = contents.columns(this.width, this.height, this.columnWidth, this.gap, this.settings.direction);
		else if (axis && axis === "horizontal") formating = contents.size(null, this.height);
		else formating = contents.size(this.width, null);
		return formating;
	}
	/**
	* Count number of pages
	* @param  {number} totalLength
	* @param  {number} pageLength
	* @return {{spreads: Number, pages: Number}}
	*/
	count(totalLength, pageLength) {
		let spreads, pages;
		if (this.name === "pre-paginated") {
			spreads = 1;
			pages = 1;
		} else if (this._flow === "paginated") {
			pageLength = pageLength || this.delta;
			spreads = Math.ceil(totalLength / pageLength);
			pages = spreads * this.divisor;
		} else {
			pageLength = pageLength || this.height;
			spreads = Math.ceil(totalLength / pageLength);
			pages = spreads;
		}
		return {
			spreads,
			pages
		};
	}
	/**
	* Update props that have changed
	* @private
	* @param  {object} props
	*/
	update(props) {
		Object.keys(props).forEach((propName) => {
			if (this.props[propName] === props[propName]) delete props[propName];
		});
		if (Object.keys(props).length > 0) {
			let newProps = extend(this.props, props);
			this.emit(EVENTS.LAYOUT.UPDATED, newProps, props);
		}
	}
};
(0, import_event_emitter.default)(Layout.prototype);
//#endregion
//#region node_modules/epubjs/src/themes.js
/**
* Themes to apply to displayed content
* @class
* @param {Rendition} rendition
*/
var Themes = class {
	constructor(rendition) {
		this.rendition = rendition;
		this._themes = { "default": {
			"rules": {},
			"url": "",
			"serialized": ""
		} };
		this._overrides = {};
		this._current = "default";
		this._injected = [];
		this.rendition.hooks.content.register(this.inject.bind(this));
		this.rendition.hooks.content.register(this.overrides.bind(this));
	}
	/**
	* Add themes to be used by a rendition
	* @param {object | Array<object> | string}
	* @example themes.register("light", "http://example.com/light.css")
	* @example themes.register("light", { "body": { "color": "purple"}})
	* @example themes.register({ "light" : {...}, "dark" : {...}})
	*/
	register() {
		if (arguments.length === 0) return;
		if (arguments.length === 1 && typeof arguments[0] === "object") return this.registerThemes(arguments[0]);
		if (arguments.length === 1 && typeof arguments[0] === "string") return this.default(arguments[0]);
		if (arguments.length === 2 && typeof arguments[1] === "string") return this.registerUrl(arguments[0], arguments[1]);
		if (arguments.length === 2 && typeof arguments[1] === "object") return this.registerRules(arguments[0], arguments[1]);
	}
	/**
	* Add a default theme to be used by a rendition
	* @param {object | string} theme
	* @example themes.register("http://example.com/default.css")
	* @example themes.register({ "body": { "color": "purple"}})
	*/
	default(theme) {
		if (!theme) return;
		if (typeof theme === "string") return this.registerUrl("default", theme);
		if (typeof theme === "object") return this.registerRules("default", theme);
	}
	/**
	* Register themes object
	* @param {object} themes
	*/
	registerThemes(themes) {
		for (var theme in themes) if (themes.hasOwnProperty(theme)) if (typeof themes[theme] === "string") this.registerUrl(theme, themes[theme]);
		else this.registerRules(theme, themes[theme]);
	}
	/**
	* Register a theme by passing its css as string
	* @param {string} name 
	* @param {string} css 
	*/
	registerCss(name, css) {
		this._themes[name] = { "serialized": css };
		if (this._injected[name] || name == "default") this.update(name);
	}
	/**
	* Register a url
	* @param {string} name
	* @param {string} input
	*/
	registerUrl(name, input) {
		var url = new Url(input);
		this._themes[name] = { "url": url.toString() };
		if (this._injected[name] || name == "default") this.update(name);
	}
	/**
	* Register rule
	* @param {string} name
	* @param {object} rules
	*/
	registerRules(name, rules) {
		this._themes[name] = { "rules": rules };
		if (this._injected[name] || name == "default") this.update(name);
	}
	/**
	* Select a theme
	* @param {string} name
	*/
	select(name) {
		var prev = this._current;
		var contents;
		this._current = name;
		this.update(name);
		contents = this.rendition.getContents();
		contents.forEach((content) => {
			content.removeClass(prev);
			content.addClass(name);
		});
	}
	/**
	* Update a theme
	* @param {string} name
	*/
	update(name) {
		this.rendition.getContents().forEach((content) => {
			this.add(name, content);
		});
	}
	/**
	* Inject all themes into contents
	* @param {Contents} contents
	*/
	inject(contents) {
		var links = [];
		var themes = this._themes;
		var theme;
		for (var name in themes) if (themes.hasOwnProperty(name) && (name === this._current || name === "default")) {
			theme = themes[name];
			if (theme.rules && Object.keys(theme.rules).length > 0 || theme.url && links.indexOf(theme.url) === -1) this.add(name, contents);
			this._injected.push(name);
		}
		if (this._current != "default") contents.addClass(this._current);
	}
	/**
	* Add Theme to contents
	* @param {string} name
	* @param {Contents} contents
	*/
	add(name, contents) {
		var theme = this._themes[name];
		if (!theme || !contents) return;
		if (theme.url) contents.addStylesheet(theme.url);
		else if (theme.serialized) {
			contents.addStylesheetCss(theme.serialized, name);
			theme.injected = true;
		} else if (theme.rules) {
			contents.addStylesheetRules(theme.rules, name);
			theme.injected = true;
		}
	}
	/**
	* Add override
	* @param {string} name
	* @param {string} value
	* @param {boolean} priority
	*/
	override(name, value, priority) {
		var contents = this.rendition.getContents();
		this._overrides[name] = {
			value,
			priority: priority === true
		};
		contents.forEach((content) => {
			content.css(name, this._overrides[name].value, this._overrides[name].priority);
		});
	}
	removeOverride(name) {
		var contents = this.rendition.getContents();
		delete this._overrides[name];
		contents.forEach((content) => {
			content.css(name);
		});
	}
	/**
	* Add all overrides
	* @param {Content} content
	*/
	overrides(contents) {
		var overrides = this._overrides;
		for (var rule in overrides) if (overrides.hasOwnProperty(rule)) contents.css(rule, overrides[rule].value, overrides[rule].priority);
	}
	/**
	* Adjust the font size of a rendition
	* @param {number} size
	*/
	fontSize(size) {
		this.override("font-size", size);
	}
	/**
	* Adjust the font-family of a rendition
	* @param {string} f
	*/
	font(f) {
		this.override("font-family", f, true);
	}
	destroy() {
		this.rendition = void 0;
		this._themes = void 0;
		this._overrides = void 0;
		this._current = void 0;
		this._injected = void 0;
	}
};
//#endregion
//#region node_modules/epubjs/src/mapping.js
/**
* Map text locations to CFI ranges
* @class
* @param {Layout} layout Layout to apply
* @param {string} [direction="ltr"] Text direction
* @param {string} [axis="horizontal"] vertical or horizontal axis
* @param {boolean} [dev] toggle developer highlighting
*/
var Mapping = class {
	constructor(layout, direction, axis, dev = false) {
		this.layout = layout;
		this.horizontal = axis === "horizontal" ? true : false;
		this.direction = direction || "ltr";
		this._dev = dev;
	}
	/**
	* Find CFI pairs for entire section at once
	*/
	section(view) {
		var ranges = this.findRanges(view);
		return this.rangeListToCfiList(view.section.cfiBase, ranges);
	}
	/**
	* Find CFI pairs for a page
	* @param {Contents} contents Contents from view
	* @param {string} cfiBase string of the base for a cfi
	* @param {number} start position to start at
	* @param {number} end position to end at
	*/
	page(contents, cfiBase, start, end) {
		var root = contents && contents.document ? contents.document.body : false;
		var result;
		if (!root) return;
		result = this.rangePairToCfiPair(cfiBase, {
			start: this.findStart(root, start, end),
			end: this.findEnd(root, start, end)
		});
		if (this._dev === true) {
			let doc = contents.document;
			let startRange = new EpubCFI(result.start).toRange(doc);
			let endRange = new EpubCFI(result.end).toRange(doc);
			let selection = doc.defaultView.getSelection();
			let r = doc.createRange();
			selection.removeAllRanges();
			r.setStart(startRange.startContainer, startRange.startOffset);
			r.setEnd(endRange.endContainer, endRange.endOffset);
			selection.addRange(r);
		}
		return result;
	}
	/**
	* Walk a node, preforming a function on each node it finds
	* @private
	* @param {Node} root Node to walkToNode
	* @param {function} func walk function
	* @return {*} returns the result of the walk function
	*/
	walk(root, func) {
		if (root && root.nodeType === Node.TEXT_NODE) return;
		var filter = { acceptNode: function(node) {
			if (node.data.trim().length > 0) return NodeFilter.FILTER_ACCEPT;
			else return NodeFilter.FILTER_REJECT;
		} };
		var safeFilter = filter.acceptNode;
		safeFilter.acceptNode = filter.acceptNode;
		var treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, safeFilter, false);
		var node;
		var result;
		while (node = treeWalker.nextNode()) {
			result = func(node);
			if (result) break;
		}
		return result;
	}
	findRanges(view) {
		var columns = [];
		var scrollWidth = view.contents.scrollWidth();
		var count = Math.ceil(scrollWidth / this.layout.spreadWidth) * this.layout.divisor;
		var columnWidth = this.layout.columnWidth;
		var gap = this.layout.gap;
		var start, end;
		for (var i = 0; i < count.pages; i++) {
			start = (columnWidth + gap) * i;
			end = columnWidth * (i + 1) + gap * i;
			columns.push({
				start: this.findStart(view.document.body, start, end),
				end: this.findEnd(view.document.body, start, end)
			});
		}
		return columns;
	}
	/**
	* Find Start Range
	* @private
	* @param {Node} root root node
	* @param {number} start position to start at
	* @param {number} end position to end at
	* @return {Range}
	*/
	findStart(root, start, end) {
		var stack = [root];
		var $el;
		var found;
		var $prev = root;
		while (stack.length) {
			$el = stack.shift();
			found = this.walk($el, (node) => {
				var left, right, top, bottom;
				var elPos = nodeBounds(node);
				if (this.horizontal && this.direction === "ltr") {
					left = this.horizontal ? elPos.left : elPos.top;
					right = this.horizontal ? elPos.right : elPos.bottom;
					if (left >= start && left <= end) return node;
					else if (right > start) return node;
					else {
						$prev = node;
						stack.push(node);
					}
				} else if (this.horizontal && this.direction === "rtl") {
					left = elPos.left;
					right = elPos.right;
					if (right <= end && right >= start) return node;
					else if (left < end) return node;
					else {
						$prev = node;
						stack.push(node);
					}
				} else {
					top = elPos.top;
					bottom = elPos.bottom;
					if (top >= start && top <= end) return node;
					else if (bottom > start) return node;
					else {
						$prev = node;
						stack.push(node);
					}
				}
			});
			if (found) return this.findTextStartRange(found, start, end);
		}
		return this.findTextStartRange($prev, start, end);
	}
	/**
	* Find End Range
	* @private
	* @param {Node} root root node
	* @param {number} start position to start at
	* @param {number} end position to end at
	* @return {Range}
	*/
	findEnd(root, start, end) {
		var stack = [root];
		var $el;
		var $prev = root;
		var found;
		while (stack.length) {
			$el = stack.shift();
			found = this.walk($el, (node) => {
				var left, right, top, bottom;
				var elPos = nodeBounds(node);
				if (this.horizontal && this.direction === "ltr") {
					left = Math.round(elPos.left);
					right = Math.round(elPos.right);
					if (left > end && $prev) return $prev;
					else if (right > end) return node;
					else {
						$prev = node;
						stack.push(node);
					}
				} else if (this.horizontal && this.direction === "rtl") {
					left = Math.round(this.horizontal ? elPos.left : elPos.top);
					right = Math.round(this.horizontal ? elPos.right : elPos.bottom);
					if (right < start && $prev) return $prev;
					else if (left < start) return node;
					else {
						$prev = node;
						stack.push(node);
					}
				} else {
					top = Math.round(elPos.top);
					bottom = Math.round(elPos.bottom);
					if (top > end && $prev) return $prev;
					else if (bottom > end) return node;
					else {
						$prev = node;
						stack.push(node);
					}
				}
			});
			if (found) return this.findTextEndRange(found, start, end);
		}
		return this.findTextEndRange($prev, start, end);
	}
	/**
	* Find Text Start Range
	* @private
	* @param {Node} root root node
	* @param {number} start position to start at
	* @param {number} end position to end at
	* @return {Range}
	*/
	findTextStartRange(node, start, end) {
		var ranges = this.splitTextNodeIntoRanges(node);
		var range;
		var pos;
		var left, top, right;
		for (var i = 0; i < ranges.length; i++) {
			range = ranges[i];
			pos = range.getBoundingClientRect();
			if (this.horizontal && this.direction === "ltr") {
				left = pos.left;
				if (left >= start) return range;
			} else if (this.horizontal && this.direction === "rtl") {
				right = pos.right;
				if (right <= end) return range;
			} else {
				top = pos.top;
				if (top >= start) return range;
			}
		}
		return ranges[0];
	}
	/**
	* Find Text End Range
	* @private
	* @param {Node} root root node
	* @param {number} start position to start at
	* @param {number} end position to end at
	* @return {Range}
	*/
	findTextEndRange(node, start, end) {
		var ranges = this.splitTextNodeIntoRanges(node);
		var prev;
		var range;
		var pos;
		var left, right, top, bottom;
		for (var i = 0; i < ranges.length; i++) {
			range = ranges[i];
			pos = range.getBoundingClientRect();
			if (this.horizontal && this.direction === "ltr") {
				left = pos.left;
				right = pos.right;
				if (left > end && prev) return prev;
				else if (right > end) return range;
			} else if (this.horizontal && this.direction === "rtl") {
				left = pos.left;
				right = pos.right;
				if (right < start && prev) return prev;
				else if (left < start) return range;
			} else {
				top = pos.top;
				bottom = pos.bottom;
				if (top > end && prev) return prev;
				else if (bottom > end) return range;
			}
			prev = range;
		}
		return ranges[ranges.length - 1];
	}
	/**
	* Split up a text node into ranges for each word
	* @private
	* @param {Node} root root node
	* @param {string} [_splitter] what to split on
	* @return {Range[]}
	*/
	splitTextNodeIntoRanges(node, _splitter) {
		var ranges = [];
		var text = (node.textContent || "").trim();
		var range;
		var doc = node.ownerDocument;
		var splitter = _splitter || " ";
		var pos = text.indexOf(splitter);
		if (pos === -1 || node.nodeType != Node.TEXT_NODE) {
			range = doc.createRange();
			range.selectNodeContents(node);
			return [range];
		}
		range = doc.createRange();
		range.setStart(node, 0);
		range.setEnd(node, pos);
		ranges.push(range);
		range = false;
		while (pos != -1) {
			pos = text.indexOf(splitter, pos + 1);
			if (pos > 0) {
				if (range) {
					range.setEnd(node, pos);
					ranges.push(range);
				}
				range = doc.createRange();
				range.setStart(node, pos + 1);
			}
		}
		if (range) {
			range.setEnd(node, text.length);
			ranges.push(range);
		}
		return ranges;
	}
	/**
	* Turn a pair of ranges into a pair of CFIs
	* @private
	* @param {string} cfiBase base string for an EpubCFI
	* @param {object} rangePair { start: Range, end: Range }
	* @return {object} { start: "epubcfi(...)", end: "epubcfi(...)" }
	*/
	rangePairToCfiPair(cfiBase, rangePair) {
		var startRange = rangePair.start;
		var endRange = rangePair.end;
		startRange.collapse(true);
		endRange.collapse(false);
		return {
			start: new EpubCFI(startRange, cfiBase).toString(),
			end: new EpubCFI(endRange, cfiBase).toString()
		};
	}
	rangeListToCfiList(cfiBase, columns) {
		var map = [];
		var cifPair;
		for (var i = 0; i < columns.length; i++) {
			cifPair = this.rangePairToCfiPair(cfiBase, columns[i]);
			map.push(cifPair);
		}
		return map;
	}
	/**
	* Set the axis for mapping
	* @param {string} axis horizontal | vertical
	* @return {boolean} is it horizontal?
	*/
	axis(axis) {
		if (axis) this.horizontal = axis === "horizontal" ? true : false;
		return this.horizontal;
	}
};
//#endregion
//#region node_modules/epubjs/src/contents.js
var hasNavigator = typeof navigator !== "undefined";
var isChrome = hasNavigator && /Chrome/.test(navigator.userAgent);
var isWebkit = hasNavigator && !isChrome && /AppleWebKit/.test(navigator.userAgent);
var ELEMENT_NODE = 1;
/**
* Handles DOM manipulation, queries and events for View contents
* @class
* @param {document} doc Document
* @param {element} content Parent Element (typically Body)
* @param {string} cfiBase Section component of CFIs
* @param {number} sectionIndex Index in Spine of Conntent's Section
*/
var Contents = class {
	constructor(doc, content, cfiBase, sectionIndex) {
		this.epubcfi = new EpubCFI();
		this.document = doc;
		this.documentElement = this.document.documentElement;
		this.content = content || this.document.body;
		this.window = this.document.defaultView;
		this._size = {
			width: 0,
			height: 0
		};
		this.sectionIndex = sectionIndex || 0;
		this.cfiBase = cfiBase || "";
		this.epubReadingSystem("epub.js", "0.3");
		this.called = 0;
		this.active = true;
		this.listeners();
	}
	/**
	* Get DOM events that are listened for and passed along
	*/
	static get listenedEvents() {
		return DOM_EVENTS;
	}
	/**
	* Get or Set width
	* @param {number} [w]
	* @returns {number} width
	*/
	width(w) {
		var frame = this.content;
		if (w && isNumber(w)) w = w + "px";
		if (w) frame.style.width = w;
		return parseInt(this.window.getComputedStyle(frame)["width"]);
	}
	/**
	* Get or Set height
	* @param {number} [h]
	* @returns {number} height
	*/
	height(h) {
		var frame = this.content;
		if (h && isNumber(h)) h = h + "px";
		if (h) frame.style.height = h;
		return parseInt(this.window.getComputedStyle(frame)["height"]);
	}
	/**
	* Get or Set width of the contents
	* @param {number} [w]
	* @returns {number} width
	*/
	contentWidth(w) {
		var content = this.content || this.document.body;
		if (w && isNumber(w)) w = w + "px";
		if (w) content.style.width = w;
		return parseInt(this.window.getComputedStyle(content)["width"]);
	}
	/**
	* Get or Set height of the contents
	* @param {number} [h]
	* @returns {number} height
	*/
	contentHeight(h) {
		var content = this.content || this.document.body;
		if (h && isNumber(h)) h = h + "px";
		if (h) content.style.height = h;
		return parseInt(this.window.getComputedStyle(content)["height"]);
	}
	/**
	* Get the width of the text using Range
	* @returns {number} width
	*/
	textWidth() {
		let rect;
		let width;
		let range = this.document.createRange();
		let content = this.content || this.document.body;
		let border = borders(content);
		range.selectNodeContents(content);
		rect = range.getBoundingClientRect();
		width = rect.width;
		if (border && border.width) width += border.width;
		return Math.round(width);
	}
	/**
	* Get the height of the text using Range
	* @returns {number} height
	*/
	textHeight() {
		let rect;
		let height;
		let range = this.document.createRange();
		let content = this.content || this.document.body;
		range.selectNodeContents(content);
		rect = range.getBoundingClientRect();
		height = rect.bottom;
		return Math.round(height);
	}
	/**
	* Get documentElement scrollWidth
	* @returns {number} width
	*/
	scrollWidth() {
		return this.documentElement.scrollWidth;
	}
	/**
	* Get documentElement scrollHeight
	* @returns {number} height
	*/
	scrollHeight() {
		return this.documentElement.scrollHeight;
	}
	/**
	* Set overflow css style of the contents
	* @param {string} [overflow]
	*/
	overflow(overflow) {
		if (overflow) this.documentElement.style.overflow = overflow;
		return this.window.getComputedStyle(this.documentElement)["overflow"];
	}
	/**
	* Set overflowX css style of the documentElement
	* @param {string} [overflow]
	*/
	overflowX(overflow) {
		if (overflow) this.documentElement.style.overflowX = overflow;
		return this.window.getComputedStyle(this.documentElement)["overflowX"];
	}
	/**
	* Set overflowY css style of the documentElement
	* @param {string} [overflow]
	*/
	overflowY(overflow) {
		if (overflow) this.documentElement.style.overflowY = overflow;
		return this.window.getComputedStyle(this.documentElement)["overflowY"];
	}
	/**
	* Set Css styles on the contents element (typically Body)
	* @param {string} property
	* @param {string} value
	* @param {boolean} [priority] set as "important"
	*/
	css(property, value, priority) {
		var content = this.content || this.document.body;
		if (value) content.style.setProperty(property, value, priority ? "important" : "");
		else content.style.removeProperty(property);
		return this.window.getComputedStyle(content)[property];
	}
	/**
	* Get or Set the viewport element
	* @param {object} [options]
	* @param {string} [options.width]
	* @param {string} [options.height]
	* @param {string} [options.scale]
	* @param {string} [options.minimum]
	* @param {string} [options.maximum]
	* @param {string} [options.scalable]
	*/
	viewport(options) {
		var $viewport = this.document.querySelector("meta[name='viewport']");
		var parsed = {
			"width": void 0,
			"height": void 0,
			"scale": void 0,
			"minimum": void 0,
			"maximum": void 0,
			"scalable": void 0
		};
		var newContent = [];
		var settings = {};
		if ($viewport && $viewport.hasAttribute("content")) {
			let content = $viewport.getAttribute("content");
			let _width = content.match(/width\s*=\s*([^,]*)/);
			let _height = content.match(/height\s*=\s*([^,]*)/);
			let _scale = content.match(/initial-scale\s*=\s*([^,]*)/);
			let _minimum = content.match(/minimum-scale\s*=\s*([^,]*)/);
			let _maximum = content.match(/maximum-scale\s*=\s*([^,]*)/);
			let _scalable = content.match(/user-scalable\s*=\s*([^,]*)/);
			if (_width && _width.length && typeof _width[1] !== "undefined") parsed.width = _width[1];
			if (_height && _height.length && typeof _height[1] !== "undefined") parsed.height = _height[1];
			if (_scale && _scale.length && typeof _scale[1] !== "undefined") parsed.scale = _scale[1];
			if (_minimum && _minimum.length && typeof _minimum[1] !== "undefined") parsed.minimum = _minimum[1];
			if (_maximum && _maximum.length && typeof _maximum[1] !== "undefined") parsed.maximum = _maximum[1];
			if (_scalable && _scalable.length && typeof _scalable[1] !== "undefined") parsed.scalable = _scalable[1];
		}
		settings = defaults(options || {}, parsed);
		if (options) {
			if (settings.width) newContent.push("width=" + settings.width);
			if (settings.height) newContent.push("height=" + settings.height);
			if (settings.scale) newContent.push("initial-scale=" + settings.scale);
			if (settings.scalable === "no") {
				newContent.push("minimum-scale=" + settings.scale);
				newContent.push("maximum-scale=" + settings.scale);
				newContent.push("user-scalable=" + settings.scalable);
			} else {
				if (settings.scalable) newContent.push("user-scalable=" + settings.scalable);
				if (settings.minimum) newContent.push("minimum-scale=" + settings.minimum);
				if (settings.maximum) newContent.push("minimum-scale=" + settings.maximum);
			}
			if (!$viewport) {
				$viewport = this.document.createElement("meta");
				$viewport.setAttribute("name", "viewport");
				this.document.querySelector("head").appendChild($viewport);
			}
			$viewport.setAttribute("content", newContent.join(", "));
			this.window.scrollTo(0, 0);
		}
		return settings;
	}
	/**
	* Event emitter for when the contents has expanded
	* @private
	*/
	expand() {
		this.emit(EVENTS.CONTENTS.EXPAND);
	}
	/**
	* Add DOM listeners
	* @private
	*/
	listeners() {
		this.imageLoadListeners();
		this.mediaQueryListeners();
		this.addEventListeners();
		this.addSelectionListeners();
		if (typeof ResizeObserver === "undefined") {
			this.resizeListeners();
			this.visibilityListeners();
		} else this.resizeObservers();
		this.linksHandler();
	}
	/**
	* Remove DOM listeners
	* @private
	*/
	removeListeners() {
		this.removeEventListeners();
		this.removeSelectionListeners();
		if (this.observer) this.observer.disconnect();
		clearTimeout(this.expanding);
	}
	/**
	* Check if size of contents has changed and
	* emit 'resize' event if it has.
	* @private
	*/
	resizeCheck() {
		let width = this.textWidth();
		let height = this.textHeight();
		if (width != this._size.width || height != this._size.height) {
			this._size = {
				width,
				height
			};
			this.onResize && this.onResize(this._size);
			this.emit(EVENTS.CONTENTS.RESIZE, this._size);
		}
	}
	/**
	* Poll for resize detection
	* @private
	*/
	resizeListeners() {
		clearTimeout(this.expanding);
		requestAnimationFrame(this.resizeCheck.bind(this));
		this.expanding = setTimeout(this.resizeListeners.bind(this), 350);
	}
	/**
	* Listen for visibility of tab to change
	* @private
	*/
	visibilityListeners() {
		document.addEventListener("visibilitychange", () => {
			if (document.visibilityState === "visible" && this.active === false) {
				this.active = true;
				this.resizeListeners();
			} else {
				this.active = false;
				clearTimeout(this.expanding);
			}
		});
	}
	/**
	* Use css transitions to detect resize
	* @private
	*/
	transitionListeners() {
		let body = this.content;
		body.style["transitionProperty"] = "font, font-size, font-size-adjust, font-stretch, font-variation-settings, font-weight, width, height";
		body.style["transitionDuration"] = "0.001ms";
		body.style["transitionTimingFunction"] = "linear";
		body.style["transitionDelay"] = "0";
		this._resizeCheck = this.resizeCheck.bind(this);
		this.document.addEventListener("transitionend", this._resizeCheck);
	}
	/**
	* Listen for media query changes and emit 'expand' event
	* Adapted from: https://github.com/tylergaw/media-query-events/blob/master/js/mq-events.js
	* @private
	*/
	mediaQueryListeners() {
		var sheets = this.document.styleSheets;
		var mediaChangeHandler = function(m) {
			if (m.matches && !this._expanding) setTimeout(this.expand.bind(this), 1);
		}.bind(this);
		for (var i = 0; i < sheets.length; i += 1) {
			var rules;
			try {
				rules = sheets[i].cssRules;
			} catch (e) {
				return;
			}
			if (!rules) return;
			for (var j = 0; j < rules.length; j += 1) if (rules[j].media) this.window.matchMedia(rules[j].media.mediaText).addListener(mediaChangeHandler);
		}
	}
	/**
	* Use ResizeObserver to listen for changes in the DOM and check for resize
	* @private
	*/
	resizeObservers() {
		this.observer = new ResizeObserver((e) => {
			requestAnimationFrame(this.resizeCheck.bind(this));
		});
		this.observer.observe(this.document.documentElement);
	}
	/**
	* Use MutationObserver to listen for changes in the DOM and check for resize
	* @private
	*/
	mutationObservers() {
		this.observer = new MutationObserver((mutations) => {
			this.resizeCheck();
		});
		this.observer.observe(this.document, {
			attributes: true,
			childList: true,
			characterData: true,
			subtree: true
		});
	}
	/**
	* Test if images are loaded or add listener for when they load
	* @private
	*/
	imageLoadListeners() {
		var images = this.document.querySelectorAll("img");
		var img;
		for (var i = 0; i < images.length; i++) {
			img = images[i];
			if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) img.onload = this.expand.bind(this);
		}
	}
	/**
	* Listen for font load and check for resize when loaded
	* @private
	*/
	fontLoadListeners() {
		if (!this.document || !this.document.fonts) return;
		this.document.fonts.ready.then(function() {
			this.resizeCheck();
		}.bind(this));
	}
	/**
	* Get the documentElement
	* @returns {element} documentElement
	*/
	root() {
		if (!this.document) return null;
		return this.document.documentElement;
	}
	/**
	* Get the location offset of a EpubCFI or an #id
	* @param {string | EpubCFI} target
	* @param {string} [ignoreClass] for the cfi
	* @returns { {left: Number, top: Number }
	*/
	locationOf(target, ignoreClass) {
		var position;
		var targetPos = {
			"left": 0,
			"top": 0
		};
		if (!this.document) return targetPos;
		if (this.epubcfi.isCfiString(target)) {
			let range = new EpubCFI(target).toRange(this.document, ignoreClass);
			if (range) {
				try {
					if (!range.endContainer || range.startContainer == range.endContainer && range.startOffset == range.endOffset) {
						let pos = range.startContainer.textContent.indexOf(" ", range.startOffset);
						if (pos == -1) pos = range.startContainer.textContent.length;
						range.setEnd(range.startContainer, pos);
					}
				} catch (e) {
					console.error("setting end offset to start container length failed", e);
				}
				if (range.startContainer.nodeType === Node.ELEMENT_NODE) {
					position = range.startContainer.getBoundingClientRect();
					targetPos.left = position.left;
					targetPos.top = position.top;
				} else if (isWebkit) {
					let container = range.startContainer;
					let newRange = new Range();
					try {
						if (container.nodeType === ELEMENT_NODE) position = container.getBoundingClientRect();
						else if (range.startOffset + 2 < container.length) {
							newRange.setStart(container, range.startOffset);
							newRange.setEnd(container, range.startOffset + 2);
							position = newRange.getBoundingClientRect();
						} else if (range.startOffset - 2 > 0) {
							newRange.setStart(container, range.startOffset - 2);
							newRange.setEnd(container, range.startOffset);
							position = newRange.getBoundingClientRect();
						} else position = container.parentNode.getBoundingClientRect();
					} catch (e) {
						console.error(e, e.stack);
					}
				} else position = range.getBoundingClientRect();
			}
		} else if (typeof target === "string" && target.indexOf("#") > -1) {
			let id = target.substring(target.indexOf("#") + 1);
			let el = this.document.getElementById(id);
			if (el) if (isWebkit) {
				let newRange = new Range();
				newRange.selectNode(el);
				position = newRange.getBoundingClientRect();
			} else position = el.getBoundingClientRect();
		}
		if (position) {
			targetPos.left = position.left;
			targetPos.top = position.top;
		}
		return targetPos;
	}
	/**
	* Append a stylesheet link to the document head
	* @param {string} src url
	*/
	addStylesheet(src) {
		return new Promise(function(resolve, reject) {
			var $stylesheet;
			var ready = false;
			if (!this.document) {
				resolve(false);
				return;
			}
			$stylesheet = this.document.querySelector("link[href='" + src + "']");
			if ($stylesheet) {
				resolve(true);
				return;
			}
			$stylesheet = this.document.createElement("link");
			$stylesheet.type = "text/css";
			$stylesheet.rel = "stylesheet";
			$stylesheet.href = src;
			$stylesheet.onload = $stylesheet.onreadystatechange = function() {
				if (!ready && (!this.readyState || this.readyState == "complete")) {
					ready = true;
					setTimeout(() => {
						resolve(true);
					}, 1);
				}
			};
			this.document.head.appendChild($stylesheet);
		}.bind(this));
	}
	_getStylesheetNode(key) {
		var styleEl;
		key = "epubjs-inserted-css-" + (key || "");
		if (!this.document) return false;
		styleEl = this.document.getElementById(key);
		if (!styleEl) {
			styleEl = this.document.createElement("style");
			styleEl.id = key;
			this.document.head.appendChild(styleEl);
		}
		return styleEl;
	}
	/**
	* Append stylesheet css
	* @param {string} serializedCss
	* @param {string} key If the key is the same, the CSS will be replaced instead of inserted
	*/
	addStylesheetCss(serializedCss, key) {
		if (!this.document || !serializedCss) return false;
		var styleEl = this._getStylesheetNode(key);
		styleEl.innerHTML = serializedCss;
		return true;
	}
	/**
	* Append stylesheet rules to a generate stylesheet
	* Array: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule
	* Object: https://github.com/desirable-objects/json-to-css
	* @param {array | object} rules
	* @param {string} key If the key is the same, the CSS will be replaced instead of inserted
	*/
	addStylesheetRules(rules, key) {
		var styleSheet;
		if (!this.document || !rules || rules.length === 0) return;
		styleSheet = this._getStylesheetNode(key).sheet;
		if (Object.prototype.toString.call(rules) === "[object Array]") for (var i = 0, rl = rules.length; i < rl; i++) {
			var j = 1, rule = rules[i], selector = rules[i][0], propStr = "";
			if (Object.prototype.toString.call(rule[1][0]) === "[object Array]") {
				rule = rule[1];
				j = 0;
			}
			for (var pl = rule.length; j < pl; j++) {
				var prop = rule[j];
				propStr += prop[0] + ":" + prop[1] + (prop[2] ? " !important" : "") + ";\n";
			}
			styleSheet.insertRule(selector + "{" + propStr + "}", styleSheet.cssRules.length);
		}
		else Object.keys(rules).forEach((selector) => {
			const definition = rules[selector];
			if (Array.isArray(definition)) definition.forEach((item) => {
				const result = Object.keys(item).map((rule) => {
					return `${rule}:${item[rule]}`;
				}).join(";");
				styleSheet.insertRule(`${selector}{${result}}`, styleSheet.cssRules.length);
			});
			else {
				const result = Object.keys(definition).map((rule) => {
					return `${rule}:${definition[rule]}`;
				}).join(";");
				styleSheet.insertRule(`${selector}{${result}}`, styleSheet.cssRules.length);
			}
		});
	}
	/**
	* Append a script tag to the document head
	* @param {string} src url
	* @returns {Promise} loaded
	*/
	addScript(src) {
		return new Promise(function(resolve, reject) {
			var $script;
			var ready = false;
			if (!this.document) {
				resolve(false);
				return;
			}
			$script = this.document.createElement("script");
			$script.type = "text/javascript";
			$script.async = true;
			$script.src = src;
			$script.onload = $script.onreadystatechange = function() {
				if (!ready && (!this.readyState || this.readyState == "complete")) {
					ready = true;
					setTimeout(function() {
						resolve(true);
					}, 1);
				}
			};
			this.document.head.appendChild($script);
		}.bind(this));
	}
	/**
	* Add a class to the contents container
	* @param {string} className
	*/
	addClass(className) {
		var content;
		if (!this.document) return;
		content = this.content || this.document.body;
		if (content) content.classList.add(className);
	}
	/**
	* Remove a class from the contents container
	* @param {string} removeClass
	*/
	removeClass(className) {
		var content;
		if (!this.document) return;
		content = this.content || this.document.body;
		if (content) content.classList.remove(className);
	}
	/**
	* Add DOM event listeners
	* @private
	*/
	addEventListeners() {
		if (!this.document) return;
		this._triggerEvent = this.triggerEvent.bind(this);
		DOM_EVENTS.forEach(function(eventName) {
			this.document.addEventListener(eventName, this._triggerEvent, { passive: true });
		}, this);
	}
	/**
	* Remove DOM event listeners
	* @private
	*/
	removeEventListeners() {
		if (!this.document) return;
		DOM_EVENTS.forEach(function(eventName) {
			this.document.removeEventListener(eventName, this._triggerEvent, { passive: true });
		}, this);
		this._triggerEvent = void 0;
	}
	/**
	* Emit passed browser events
	* @private
	*/
	triggerEvent(e) {
		this.emit(e.type, e);
	}
	/**
	* Add listener for text selection
	* @private
	*/
	addSelectionListeners() {
		if (!this.document) return;
		this._onSelectionChange = this.onSelectionChange.bind(this);
		this.document.addEventListener("selectionchange", this._onSelectionChange, { passive: true });
	}
	/**
	* Remove listener for text selection
	* @private
	*/
	removeSelectionListeners() {
		if (!this.document) return;
		this.document.removeEventListener("selectionchange", this._onSelectionChange, { passive: true });
		this._onSelectionChange = void 0;
	}
	/**
	* Handle getting text on selection
	* @private
	*/
	onSelectionChange(e) {
		if (this.selectionEndTimeout) clearTimeout(this.selectionEndTimeout);
		this.selectionEndTimeout = setTimeout(function() {
			var selection = this.window.getSelection();
			this.triggerSelectedEvent(selection);
		}.bind(this), 250);
	}
	/**
	* Emit event on text selection
	* @private
	*/
	triggerSelectedEvent(selection) {
		var range, cfirange;
		if (selection && selection.rangeCount > 0) {
			range = selection.getRangeAt(0);
			if (!range.collapsed) {
				cfirange = new EpubCFI(range, this.cfiBase).toString();
				this.emit(EVENTS.CONTENTS.SELECTED, cfirange);
				this.emit(EVENTS.CONTENTS.SELECTED_RANGE, range);
			}
		}
	}
	/**
	* Get a Dom Range from EpubCFI
	* @param {EpubCFI} _cfi
	* @param {string} [ignoreClass]
	* @returns {Range} range
	*/
	range(_cfi, ignoreClass) {
		return new EpubCFI(_cfi).toRange(this.document, ignoreClass);
	}
	/**
	* Get an EpubCFI from a Dom Range
	* @param {Range} range
	* @param {string} [ignoreClass]
	* @returns {EpubCFI} cfi
	*/
	cfiFromRange(range, ignoreClass) {
		return new EpubCFI(range, this.cfiBase, ignoreClass).toString();
	}
	/**
	* Get an EpubCFI from a Dom node
	* @param {node} node
	* @param {string} [ignoreClass]
	* @returns {EpubCFI} cfi
	*/
	cfiFromNode(node, ignoreClass) {
		return new EpubCFI(node, this.cfiBase, ignoreClass).toString();
	}
	map(layout) {
		return new Mapping(layout).section();
	}
	/**
	* Size the contents to a given width and height
	* @param {number} [width]
	* @param {number} [height]
	*/
	size(width, height) {
		var viewport = {
			scale: 1,
			scalable: "no"
		};
		this.layoutStyle("scrolling");
		if (width >= 0) {
			this.width(width);
			viewport.width = width;
			this.css("padding", "0 " + width / 12 + "px");
		}
		if (height >= 0) {
			this.height(height);
			viewport.height = height;
		}
		this.css("margin", "0");
		this.css("box-sizing", "border-box");
		this.viewport(viewport);
	}
	/**
	* Apply columns to the contents for pagination
	* @param {number} width
	* @param {number} height
	* @param {number} columnWidth
	* @param {number} gap
	*/
	columns(width, height, columnWidth, gap, dir) {
		let COLUMN_AXIS = prefixed("column-axis");
		let COLUMN_GAP = prefixed("column-gap");
		let COLUMN_WIDTH = prefixed("column-width");
		let COLUMN_FILL = prefixed("column-fill");
		let axis = this.writingMode().indexOf("vertical") === 0 ? "vertical" : "horizontal";
		this.layoutStyle("paginated");
		if (dir === "rtl" && axis === "horizontal") this.direction(dir);
		this.width(width);
		this.height(height);
		this.viewport({
			width,
			height,
			scale: 1,
			scalable: "no"
		});
		this.css("overflow-y", "hidden");
		this.css("margin", "0", true);
		if (axis === "vertical") {
			this.css("padding-top", gap / 2 + "px", true);
			this.css("padding-bottom", gap / 2 + "px", true);
			this.css("padding-left", "20px");
			this.css("padding-right", "20px");
			this.css(COLUMN_AXIS, "vertical");
		} else {
			this.css("padding-top", "20px");
			this.css("padding-bottom", "20px");
			this.css("padding-left", gap / 2 + "px", true);
			this.css("padding-right", gap / 2 + "px", true);
			this.css(COLUMN_AXIS, "horizontal");
		}
		this.css("box-sizing", "border-box");
		this.css("max-width", "inherit");
		this.css(COLUMN_FILL, "auto");
		this.css(COLUMN_GAP, gap + "px");
		this.css(COLUMN_WIDTH, columnWidth + "px");
		this.css("-webkit-line-box-contain", "block glyphs replaced");
	}
	/**
	* Scale contents from center
	* @param {number} scale
	* @param {number} offsetX
	* @param {number} offsetY
	*/
	scaler(scale, offsetX, offsetY) {
		var scaleStr = "scale(" + scale + ")";
		var translateStr = "";
		this.css("transform-origin", "top left");
		if (offsetX >= 0 || offsetY >= 0) translateStr = " translate(" + (offsetX || 0) + "px, " + (offsetY || 0) + "px )";
		this.css("transform", scaleStr + translateStr);
	}
	/**
	* Fit contents into a fixed width and height
	* @param {number} width
	* @param {number} height
	*/
	fit(width, height, section) {
		var viewport = this.viewport();
		var viewportWidth = parseInt(viewport.width);
		var viewportHeight = parseInt(viewport.height);
		var widthScale = width / viewportWidth;
		var heightScale = height / viewportHeight;
		var scale = widthScale < heightScale ? widthScale : heightScale;
		this.layoutStyle("paginated");
		this.width(viewportWidth);
		this.height(viewportHeight);
		this.overflow("hidden");
		this.scaler(scale, 0, 0);
		this.css("background-size", viewportWidth * scale + "px " + viewportHeight * scale + "px");
		this.css("background-color", "transparent");
		if (section && section.properties.includes("page-spread-left")) {
			var marginLeft = width - viewportWidth * scale;
			this.css("margin-left", marginLeft + "px");
		}
	}
	/**
	* Set the direction of the text
	* @param {string} [dir="ltr"] "rtl" | "ltr"
	*/
	direction(dir) {
		if (this.documentElement) this.documentElement.style["direction"] = dir;
	}
	mapPage(cfiBase, layout, start, end, dev) {
		return new Mapping(layout, dev).page(this, cfiBase, start, end);
	}
	/**
	* Emit event when link in content is clicked
	* @private
	*/
	linksHandler() {
		replaceLinks(this.content, (href) => {
			this.emit(EVENTS.CONTENTS.LINK_CLICKED, href);
		});
	}
	/**
	* Set the writingMode of the text
	* @param {string} [mode="horizontal-tb"] "horizontal-tb" | "vertical-rl" | "vertical-lr"
	*/
	writingMode(mode) {
		let WRITING_MODE = prefixed("writing-mode");
		if (mode && this.documentElement) this.documentElement.style[WRITING_MODE] = mode;
		return this.window.getComputedStyle(this.documentElement)[WRITING_MODE] || "";
	}
	/**
	* Set the layoutStyle of the content
	* @param {string} [style="paginated"] "scrolling" | "paginated"
	* @private
	*/
	layoutStyle(style) {
		if (style) {
			this._layoutStyle = style;
			navigator.epubReadingSystem.layoutStyle = this._layoutStyle;
		}
		return this._layoutStyle || "paginated";
	}
	/**
	* Add the epubReadingSystem object to the navigator
	* @param {string} name
	* @param {string} version
	* @private
	*/
	epubReadingSystem(name, version) {
		navigator.epubReadingSystem = {
			name,
			version,
			layoutStyle: this.layoutStyle(),
			hasFeature: function(feature) {
				switch (feature) {
					case "dom-manipulation": return true;
					case "layout-changes": return true;
					case "touch-events": return true;
					case "mouse-events": return true;
					case "keyboard-events": return true;
					case "spine-scripting": return false;
					default: return false;
				}
			}
		};
		return navigator.epubReadingSystem;
	}
	destroy() {
		this.removeListeners();
	}
};
(0, import_event_emitter.default)(Contents.prototype);
//#endregion
//#region node_modules/epubjs/src/annotations.js
/**
* Handles managing adding & removing Annotations
* @param {Rendition} rendition
* @class
*/
var Annotations = class {
	constructor(rendition) {
		this.rendition = rendition;
		this.highlights = [];
		this.underlines = [];
		this.marks = [];
		this._annotations = {};
		this._annotationsBySectionIndex = {};
		this.rendition.hooks.render.register(this.inject.bind(this));
		this.rendition.hooks.unloaded.register(this.clear.bind(this));
	}
	/**
	* Add an annotation to store
	* @param {string} type Type of annotation to add: "highlight", "underline", "mark"
	* @param {EpubCFI} cfiRange EpubCFI range to attach annotation to
	* @param {object} data Data to assign to annotation
	* @param {function} [cb] Callback after annotation is added
	* @param {string} className CSS class to assign to annotation
	* @param {object} styles CSS styles to assign to annotation
	* @returns {Annotation} annotation
	*/
	add(type, cfiRange, data, cb, className, styles) {
		let hash = encodeURI(cfiRange + type);
		let sectionIndex = new EpubCFI(cfiRange).spinePos;
		let annotation = new Annotation({
			type,
			cfiRange,
			data,
			sectionIndex,
			cb,
			className,
			styles
		});
		this._annotations[hash] = annotation;
		if (sectionIndex in this._annotationsBySectionIndex) this._annotationsBySectionIndex[sectionIndex].push(hash);
		else this._annotationsBySectionIndex[sectionIndex] = [hash];
		this.rendition.views().forEach((view) => {
			if (annotation.sectionIndex === view.index) annotation.attach(view);
		});
		return annotation;
	}
	/**
	* Remove an annotation from store
	* @param {EpubCFI} cfiRange EpubCFI range the annotation is attached to
	* @param {string} type Type of annotation to add: "highlight", "underline", "mark"
	*/
	remove(cfiRange, type) {
		let hash = encodeURI(cfiRange + type);
		if (hash in this._annotations) {
			let annotation = this._annotations[hash];
			if (type && annotation.type !== type) return;
			this.rendition.views().forEach((view) => {
				this._removeFromAnnotationBySectionIndex(annotation.sectionIndex, hash);
				if (annotation.sectionIndex === view.index) annotation.detach(view);
			});
			delete this._annotations[hash];
		}
	}
	/**
	* Remove an annotations by Section Index
	* @private
	*/
	_removeFromAnnotationBySectionIndex(sectionIndex, hash) {
		this._annotationsBySectionIndex[sectionIndex] = this._annotationsAt(sectionIndex).filter((h) => h !== hash);
	}
	/**
	* Get annotations by Section Index
	* @private
	*/
	_annotationsAt(index) {
		return this._annotationsBySectionIndex[index];
	}
	/**
	* Add a highlight to the store
	* @param {EpubCFI} cfiRange EpubCFI range to attach annotation to
	* @param {object} data Data to assign to annotation
	* @param {function} cb Callback after annotation is clicked
	* @param {string} className CSS class to assign to annotation
	* @param {object} styles CSS styles to assign to annotation
	*/
	highlight(cfiRange, data, cb, className, styles) {
		return this.add("highlight", cfiRange, data, cb, className, styles);
	}
	/**
	* Add a underline to the store
	* @param {EpubCFI} cfiRange EpubCFI range to attach annotation to
	* @param {object} data Data to assign to annotation
	* @param {function} cb Callback after annotation is clicked
	* @param {string} className CSS class to assign to annotation
	* @param {object} styles CSS styles to assign to annotation
	*/
	underline(cfiRange, data, cb, className, styles) {
		return this.add("underline", cfiRange, data, cb, className, styles);
	}
	/**
	* Add a mark to the store
	* @param {EpubCFI} cfiRange EpubCFI range to attach annotation to
	* @param {object} data Data to assign to annotation
	* @param {function} cb Callback after annotation is clicked
	*/
	mark(cfiRange, data, cb) {
		return this.add("mark", cfiRange, data, cb);
	}
	/**
	* iterate over annotations in the store
	*/
	each() {
		return this._annotations.forEach.apply(this._annotations, arguments);
	}
	/**
	* Hook for injecting annotation into a view
	* @param {View} view
	* @private
	*/
	inject(view) {
		let sectionIndex = view.index;
		if (sectionIndex in this._annotationsBySectionIndex) this._annotationsBySectionIndex[sectionIndex].forEach((hash) => {
			this._annotations[hash].attach(view);
		});
	}
	/**
	* Hook for removing annotation from a view
	* @param {View} view
	* @private
	*/
	clear(view) {
		let sectionIndex = view.index;
		if (sectionIndex in this._annotationsBySectionIndex) this._annotationsBySectionIndex[sectionIndex].forEach((hash) => {
			this._annotations[hash].detach(view);
		});
	}
	/**
	* [Not Implemented] Show annotations
	* @TODO: needs implementation in View
	*/
	show() {}
	/**
	* [Not Implemented] Hide annotations
	* @TODO: needs implementation in View
	*/
	hide() {}
};
/**
* Annotation object
* @class
* @param {object} options
* @param {string} options.type Type of annotation to add: "highlight", "underline", "mark"
* @param {EpubCFI} options.cfiRange EpubCFI range to attach annotation to
* @param {object} options.data Data to assign to annotation
* @param {int} options.sectionIndex Index in the Spine of the Section annotation belongs to
* @param {function} [options.cb] Callback after annotation is clicked
* @param {string} className CSS class to assign to annotation
* @param {object} styles CSS styles to assign to annotation
* @returns {Annotation} annotation
*/
var Annotation = class {
	constructor({ type, cfiRange, data, sectionIndex, cb, className, styles }) {
		this.type = type;
		this.cfiRange = cfiRange;
		this.data = data;
		this.sectionIndex = sectionIndex;
		this.mark = void 0;
		this.cb = cb;
		this.className = className;
		this.styles = styles;
	}
	/**
	* Update stored data
	* @param {object} data
	*/
	update(data) {
		this.data = data;
	}
	/**
	* Add to a view
	* @param {View} view
	*/
	attach(view) {
		let { cfiRange, data, type, mark, cb, className, styles } = this;
		let result;
		if (type === "highlight") result = view.highlight(cfiRange, data, cb, className, styles);
		else if (type === "underline") result = view.underline(cfiRange, data, cb, className, styles);
		else if (type === "mark") result = view.mark(cfiRange, data, cb);
		this.mark = result;
		this.emit(EVENTS.ANNOTATION.ATTACH, result);
		return result;
	}
	/**
	* Remove from a view
	* @param {View} view
	*/
	detach(view) {
		let { cfiRange, type } = this;
		let result;
		if (view) {
			if (type === "highlight") result = view.unhighlight(cfiRange);
			else if (type === "underline") result = view.ununderline(cfiRange);
			else if (type === "mark") result = view.unmark(cfiRange);
		}
		this.mark = void 0;
		this.emit(EVENTS.ANNOTATION.DETACH, result);
		return result;
	}
	/**
	* [Not Implemented] Get text of an annotation
	* @TODO: needs implementation in contents
	*/
	text() {}
};
(0, import_event_emitter.default)(Annotation.prototype);
//#endregion
//#region node_modules/marks-pane/lib/svg.js
var require_svg = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createElement = createElement;
	function createElement(name) {
		return document.createElementNS("http://www.w3.org/2000/svg", name);
	}
	exports.default = { createElement };
}));
//#endregion
//#region node_modules/marks-pane/lib/events.js
var require_events = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.proxyMouse = proxyMouse;
	exports.clone = clone;
	exports.default = { proxyMouse };
	/**
	* Start proxying all mouse events that occur on the target node to each node in
	* a set of tracked nodes.
	*
	* The items in tracked do not strictly have to be DOM Nodes, but they do have
	* to have dispatchEvent, getBoundingClientRect, and getClientRects methods.
	*
	* @param target {Node} The node on which to listen for mouse events.
	* @param tracked {Node[]} A (possibly mutable) array of nodes to which to proxy
	*                         events.
	*/
	function proxyMouse(target, tracked) {
		function dispatch(e) {
			for (var i = tracked.length - 1; i >= 0; i--) {
				var t = tracked[i];
				var x = e.clientX;
				var y = e.clientY;
				if (e.touches && e.touches.length) {
					x = e.touches[0].clientX;
					y = e.touches[0].clientY;
				}
				if (!contains(t, target, x, y)) continue;
				t.dispatchEvent(clone(e));
				break;
			}
		}
		if (target.nodeName === "iframe" || target.nodeName === "IFRAME") try {
			this.target = target.contentDocument;
		} catch (err) {
			this.target = target;
		}
		else this.target = target;
		var _arr = [
			"mouseup",
			"mousedown",
			"click",
			"touchstart"
		];
		for (var _i = 0; _i < _arr.length; _i++) {
			var ev = _arr[_i];
			this.target.addEventListener(ev, function(e) {
				return dispatch(e);
			}, false);
		}
	}
	/**
	* Clone a mouse event object.
	*
	* @param e {MouseEvent} A mouse event object to clone.
	* @returns {MouseEvent}
	*/
	function clone(e) {
		var opts = Object.assign({}, e, { bubbles: false });
		try {
			return new MouseEvent(e.type, opts);
		} catch (err) {
			var copy = document.createEvent("MouseEvents");
			copy.initMouseEvent(e.type, false, opts.cancelable, opts.view, opts.detail, opts.screenX, opts.screenY, opts.clientX, opts.clientY, opts.ctrlKey, opts.altKey, opts.shiftKey, opts.metaKey, opts.button, opts.relatedTarget);
			return copy;
		}
	}
	/**
	* Check if the item contains the point denoted by the passed coordinates
	* @param item {Object} An object with getBoundingClientRect and getClientRects
	*                      methods.
	* @param x {Number}
	* @param y {Number}
	* @returns {Boolean}
	*/
	function contains(item, target, x, y) {
		var offset = target.getBoundingClientRect();
		function rectContains(r, x, y) {
			var top = r.top - offset.top;
			var left = r.left - offset.left;
			var bottom = top + r.height;
			var right = left + r.width;
			return top <= y && left <= x && bottom > y && right > x;
		}
		if (!rectContains(item.getBoundingClientRect(), x, y)) return false;
		var rects = item.getClientRects();
		for (var i = 0, len = rects.length; i < len; i++) if (rectContains(rects[i], x, y)) return true;
		return false;
	}
}));
//#endregion
//#region node_modules/epubjs/src/managers/views/iframe.js
var import_marks = (/* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Underline = exports.Highlight = exports.Mark = exports.Pane = void 0;
	var _get = function get(object, property, receiver) {
		if (object === null) object = Function.prototype;
		var desc = Object.getOwnPropertyDescriptor(object, property);
		if (desc === void 0) {
			var parent = Object.getPrototypeOf(object);
			if (parent === null) return;
			else return get(parent, property, receiver);
		} else if ("value" in desc) return desc.value;
		else {
			var getter = desc.get;
			if (getter === void 0) return;
			return getter.call(receiver);
		}
	};
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	var _svg2 = _interopRequireDefault(require_svg());
	var _events2 = _interopRequireDefault(require_events());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	exports.Pane = function() {
		function Pane(target) {
			var container = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : document.body;
			_classCallCheck(this, Pane);
			this.target = target;
			this.element = _svg2.default.createElement("svg");
			this.marks = [];
			this.element.style.position = "absolute";
			this.element.setAttribute("pointer-events", "none");
			_events2.default.proxyMouse(this.target, this.marks);
			this.container = container;
			this.container.appendChild(this.element);
			this.render();
		}
		_createClass(Pane, [
			{
				key: "addMark",
				value: function addMark(mark) {
					var g = _svg2.default.createElement("g");
					this.element.appendChild(g);
					mark.bind(g, this.container);
					this.marks.push(mark);
					mark.render();
					return mark;
				}
			},
			{
				key: "removeMark",
				value: function removeMark(mark) {
					var idx = this.marks.indexOf(mark);
					if (idx === -1) return;
					var el = mark.unbind();
					this.element.removeChild(el);
					this.marks.splice(idx, 1);
				}
			},
			{
				key: "render",
				value: function render() {
					setCoords(this.element, coords(this.target, this.container));
					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = void 0;
					try {
						for (var _iterator = this.marks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) _step.value.render();
					} catch (err) {
						_didIteratorError = true;
						_iteratorError = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion && _iterator.return) _iterator.return();
						} finally {
							if (_didIteratorError) throw _iteratorError;
						}
					}
				}
			}
		]);
		return Pane;
	}();
	exports.Underline = function(_Highlight) {
		_inherits(Underline, _Highlight);
		function Underline(range, className, data, attributes) {
			_classCallCheck(this, Underline);
			return _possibleConstructorReturn(this, (Underline.__proto__ || Object.getPrototypeOf(Underline)).call(this, range, className, data, attributes));
		}
		_createClass(Underline, [{
			key: "render",
			value: function render() {
				while (this.element.firstChild) this.element.removeChild(this.element.firstChild);
				var docFrag = this.element.ownerDocument.createDocumentFragment();
				var filtered = this.filteredRanges();
				var offset = this.element.getBoundingClientRect();
				var container = this.container.getBoundingClientRect();
				for (var i = 0, len = filtered.length; i < len; i++) {
					var r = filtered[i];
					var rect = _svg2.default.createElement("rect");
					rect.setAttribute("x", r.left - offset.left + container.left);
					rect.setAttribute("y", r.top - offset.top + container.top);
					rect.setAttribute("height", r.height);
					rect.setAttribute("width", r.width);
					rect.setAttribute("fill", "none");
					var line = _svg2.default.createElement("line");
					line.setAttribute("x1", r.left - offset.left + container.left);
					line.setAttribute("x2", r.left - offset.left + container.left + r.width);
					line.setAttribute("y1", r.top - offset.top + container.top + r.height - 1);
					line.setAttribute("y2", r.top - offset.top + container.top + r.height - 1);
					line.setAttribute("stroke-width", 1);
					line.setAttribute("stroke", "black");
					line.setAttribute("stroke-linecap", "square");
					docFrag.appendChild(rect);
					docFrag.appendChild(line);
				}
				this.element.appendChild(docFrag);
			}
		}]);
		return Underline;
	}(exports.Highlight = function(_Mark) {
		_inherits(Highlight, _Mark);
		function Highlight(range, className, data, attributes) {
			_classCallCheck(this, Highlight);
			var _this = _possibleConstructorReturn(this, (Highlight.__proto__ || Object.getPrototypeOf(Highlight)).call(this));
			_this.range = range;
			_this.className = className;
			_this.data = data || {};
			_this.attributes = attributes || {};
			return _this;
		}
		_createClass(Highlight, [{
			key: "bind",
			value: function bind(element, container) {
				_get(Highlight.prototype.__proto__ || Object.getPrototypeOf(Highlight.prototype), "bind", this).call(this, element, container);
				for (var attr in this.data) if (this.data.hasOwnProperty(attr)) this.element.dataset[attr] = this.data[attr];
				for (var attr in this.attributes) if (this.attributes.hasOwnProperty(attr)) this.element.setAttribute(attr, this.attributes[attr]);
				if (this.className) this.element.classList.add(this.className);
			}
		}, {
			key: "render",
			value: function render() {
				while (this.element.firstChild) this.element.removeChild(this.element.firstChild);
				var docFrag = this.element.ownerDocument.createDocumentFragment();
				var filtered = this.filteredRanges();
				var offset = this.element.getBoundingClientRect();
				var container = this.container.getBoundingClientRect();
				for (var i = 0, len = filtered.length; i < len; i++) {
					var r = filtered[i];
					var el = _svg2.default.createElement("rect");
					el.setAttribute("x", r.left - offset.left + container.left);
					el.setAttribute("y", r.top - offset.top + container.top);
					el.setAttribute("height", r.height);
					el.setAttribute("width", r.width);
					docFrag.appendChild(el);
				}
				this.element.appendChild(docFrag);
			}
		}]);
		return Highlight;
	}(exports.Mark = function() {
		function Mark() {
			_classCallCheck(this, Mark);
			this.element = null;
		}
		_createClass(Mark, [
			{
				key: "bind",
				value: function bind(element, container) {
					this.element = element;
					this.container = container;
				}
			},
			{
				key: "unbind",
				value: function unbind() {
					var el = this.element;
					this.element = null;
					return el;
				}
			},
			{
				key: "render",
				value: function render() {}
			},
			{
				key: "dispatchEvent",
				value: function dispatchEvent(e) {
					if (!this.element) return;
					this.element.dispatchEvent(e);
				}
			},
			{
				key: "getBoundingClientRect",
				value: function getBoundingClientRect() {
					return this.element.getBoundingClientRect();
				}
			},
			{
				key: "getClientRects",
				value: function getClientRects() {
					var rects = [];
					var el = this.element.firstChild;
					while (el) {
						rects.push(el.getBoundingClientRect());
						el = el.nextSibling;
					}
					return rects;
				}
			},
			{
				key: "filteredRanges",
				value: function filteredRanges() {
					var rects = Array.from(this.range.getClientRects());
					return rects.filter(function(box) {
						for (var i = 0; i < rects.length; i++) {
							if (rects[i] === box) return true;
							if (contains(rects[i], box)) return false;
						}
						return true;
					});
				}
			}
		]);
		return Mark;
	}()));
	function coords(el, container) {
		var offset = container.getBoundingClientRect();
		var rect = el.getBoundingClientRect();
		return {
			top: rect.top - offset.top,
			left: rect.left - offset.left,
			height: el.scrollHeight,
			width: el.scrollWidth
		};
	}
	function setCoords(el, coords) {
		el.style.setProperty("top", coords.top + "px", "important");
		el.style.setProperty("left", coords.left + "px", "important");
		el.style.setProperty("height", coords.height + "px", "important");
		el.style.setProperty("width", coords.width + "px", "important");
	}
	function contains(rect1, rect2) {
		return rect2.right <= rect1.right && rect2.left >= rect1.left && rect2.top >= rect1.top && rect2.bottom <= rect1.bottom;
	}
})))();
var IframeView = class {
	constructor(section, options) {
		this.settings = extend({
			ignoreClass: "",
			axis: void 0,
			direction: void 0,
			width: 0,
			height: 0,
			layout: void 0,
			globalLayoutProperties: {},
			method: void 0,
			forceRight: false,
			allowScriptedContent: false,
			allowPopups: false
		}, options || {});
		this.id = "epubjs-view-" + uuid();
		this.section = section;
		this.index = section.index;
		this.element = this.container(this.settings.axis);
		this.added = false;
		this.displayed = false;
		this.rendered = false;
		this.fixedWidth = 0;
		this.fixedHeight = 0;
		this.epubcfi = new EpubCFI();
		this.layout = this.settings.layout;
		this.pane = void 0;
		this.highlights = {};
		this.underlines = {};
		this.marks = {};
	}
	container(axis) {
		var element = document.createElement("div");
		element.classList.add("epub-view");
		element.style.height = "0px";
		element.style.width = "0px";
		element.style.overflow = "hidden";
		element.style.position = "relative";
		element.style.display = "block";
		if (axis && axis == "horizontal") element.style.flex = "none";
		else element.style.flex = "initial";
		return element;
	}
	create() {
		if (this.iframe) return this.iframe;
		if (!this.element) this.element = this.createContainer();
		this.iframe = document.createElement("iframe");
		this.iframe.id = this.id;
		this.iframe.scrolling = "no";
		this.iframe.style.overflow = "hidden";
		this.iframe.seamless = "seamless";
		this.iframe.style.border = "none";
		this.iframe.sandbox = "allow-same-origin";
		if (this.settings.allowScriptedContent) this.iframe.sandbox += " allow-scripts";
		if (this.settings.allowPopups) this.iframe.sandbox += " allow-popups";
		this.iframe.setAttribute("enable-annotation", "true");
		this.resizing = true;
		this.element.style.visibility = "hidden";
		this.iframe.style.visibility = "hidden";
		this.iframe.style.width = "0";
		this.iframe.style.height = "0";
		this._width = 0;
		this._height = 0;
		this.element.setAttribute("ref", this.index);
		this.added = true;
		this.elementBounds = bounds(this.element);
		if ("srcdoc" in this.iframe) this.supportsSrcdoc = true;
		else this.supportsSrcdoc = false;
		if (!this.settings.method) this.settings.method = this.supportsSrcdoc ? "srcdoc" : "write";
		return this.iframe;
	}
	render(request, show) {
		this.create();
		this.size();
		if (!this.sectionRender) this.sectionRender = this.section.render(request);
		return this.sectionRender.then(function(contents) {
			return this.load(contents);
		}.bind(this)).then(function() {
			let writingMode = this.contents.writingMode();
			let axis;
			if (this.settings.flow === "scrolled") axis = writingMode.indexOf("vertical") === 0 ? "horizontal" : "vertical";
			else axis = writingMode.indexOf("vertical") === 0 ? "vertical" : "horizontal";
			if (writingMode.indexOf("vertical") === 0 && this.settings.flow === "paginated") this.layout.delta = this.layout.height;
			this.setAxis(axis);
			this.emit(EVENTS.VIEWS.AXIS, axis);
			this.setWritingMode(writingMode);
			this.emit(EVENTS.VIEWS.WRITING_MODE, writingMode);
			this.layout.format(this.contents, this.section, this.axis);
			this.addListeners();
			return new Promise((resolve, reject) => {
				this.expand();
				if (this.settings.forceRight) this.element.style.marginLeft = this.width() + "px";
				resolve();
			});
		}.bind(this), function(e) {
			this.emit(EVENTS.VIEWS.LOAD_ERROR, e);
			return new Promise((resolve, reject) => {
				reject(e);
			});
		}.bind(this)).then(function() {
			this.emit(EVENTS.VIEWS.RENDERED, this.section);
		}.bind(this));
	}
	reset() {
		if (this.iframe) {
			this.iframe.style.width = "0";
			this.iframe.style.height = "0";
			this._width = 0;
			this._height = 0;
			this._textWidth = void 0;
			this._contentWidth = void 0;
			this._textHeight = void 0;
			this._contentHeight = void 0;
		}
		this._needsReframe = true;
	}
	size(_width, _height) {
		var width = _width || this.settings.width;
		var height = _height || this.settings.height;
		if (this.layout.name === "pre-paginated") this.lock("both", width, height);
		else if (this.settings.axis === "horizontal") this.lock("height", width, height);
		else this.lock("width", width, height);
		this.settings.width = width;
		this.settings.height = height;
	}
	lock(what, width, height) {
		var elBorders = borders(this.element);
		var iframeBorders;
		if (this.iframe) iframeBorders = borders(this.iframe);
		else iframeBorders = {
			width: 0,
			height: 0
		};
		if (what == "width" && isNumber(width)) this.lockedWidth = width - elBorders.width - iframeBorders.width;
		if (what == "height" && isNumber(height)) this.lockedHeight = height - elBorders.height - iframeBorders.height;
		if (what === "both" && isNumber(width) && isNumber(height)) {
			this.lockedWidth = width - elBorders.width - iframeBorders.width;
			this.lockedHeight = height - elBorders.height - iframeBorders.height;
		}
		if (this.displayed && this.iframe) this.expand();
	}
	expand(force) {
		var width = this.lockedWidth;
		var height = this.lockedHeight;
		var columns;
		if (!this.iframe || this._expanding) return;
		this._expanding = true;
		if (this.layout.name === "pre-paginated") {
			width = this.layout.columnWidth;
			height = this.layout.height;
		} else if (this.settings.axis === "horizontal") {
			width = this.contents.textWidth();
			if (width % this.layout.pageWidth > 0) width = Math.ceil(width / this.layout.pageWidth) * this.layout.pageWidth;
			if (this.settings.forceEvenPages) {
				columns = width / this.layout.pageWidth;
				if (this.layout.divisor > 1 && this.layout.name === "reflowable" && columns % 2 > 0) width += this.layout.pageWidth;
			}
		} else if (this.settings.axis === "vertical") {
			height = this.contents.textHeight();
			if (this.settings.flow === "paginated" && height % this.layout.height > 0) height = Math.ceil(height / this.layout.height) * this.layout.height;
		}
		if (this._needsReframe || width != this._width || height != this._height) this.reframe(width, height);
		this._expanding = false;
	}
	reframe(width, height) {
		var size;
		if (isNumber(width)) {
			this.element.style.width = width + "px";
			this.iframe.style.width = width + "px";
			this._width = width;
		}
		if (isNumber(height)) {
			this.element.style.height = height + "px";
			this.iframe.style.height = height + "px";
			this._height = height;
		}
		size = {
			width,
			height,
			widthDelta: this.prevBounds ? width - this.prevBounds.width : width,
			heightDelta: this.prevBounds ? height - this.prevBounds.height : height
		};
		this.pane && this.pane.render();
		requestAnimationFrame(() => {
			let mark;
			for (let m in this.marks) if (this.marks.hasOwnProperty(m)) {
				mark = this.marks[m];
				this.placeMark(mark.element, mark.range);
			}
		});
		this.onResize(this, size);
		this.emit(EVENTS.VIEWS.RESIZED, size);
		this.prevBounds = size;
		this.elementBounds = bounds(this.element);
	}
	load(contents) {
		var loading = new defer();
		var loaded = loading.promise;
		if (!this.iframe) {
			loading.reject(/* @__PURE__ */ new Error("No Iframe Available"));
			return loaded;
		}
		this.iframe.onload = function(event) {
			this.onLoad(event, loading);
		}.bind(this);
		if (this.settings.method === "blobUrl") {
			this.blobUrl = createBlobUrl(contents, "application/xhtml+xml");
			this.iframe.src = this.blobUrl;
			this.element.appendChild(this.iframe);
		} else if (this.settings.method === "srcdoc") {
			this.iframe.srcdoc = contents;
			this.element.appendChild(this.iframe);
		} else {
			this.element.appendChild(this.iframe);
			this.document = this.iframe.contentDocument;
			if (!this.document) {
				loading.reject(/* @__PURE__ */ new Error("No Document Available"));
				return loaded;
			}
			this.iframe.contentDocument.open();
			if (window.MSApp && MSApp.execUnsafeLocalFunction) {
				var outerThis = this;
				MSApp.execUnsafeLocalFunction(function() {
					outerThis.iframe.contentDocument.write(contents);
				});
			} else this.iframe.contentDocument.write(contents);
			this.iframe.contentDocument.close();
		}
		return loaded;
	}
	onLoad(event, promise) {
		this.window = this.iframe.contentWindow;
		this.document = this.iframe.contentDocument;
		this.contents = new Contents(this.document, this.document.body, this.section.cfiBase, this.section.index);
		this.rendering = false;
		var link = this.document.querySelector("link[rel='canonical']");
		if (link) link.setAttribute("href", this.section.canonical);
		else {
			link = this.document.createElement("link");
			link.setAttribute("rel", "canonical");
			link.setAttribute("href", this.section.canonical);
			this.document.querySelector("head").appendChild(link);
		}
		this.contents.on(EVENTS.CONTENTS.EXPAND, () => {
			if (this.displayed && this.iframe) {
				this.expand();
				if (this.contents) this.layout.format(this.contents);
			}
		});
		this.contents.on(EVENTS.CONTENTS.RESIZE, (e) => {
			if (this.displayed && this.iframe) {
				this.expand();
				if (this.contents) this.layout.format(this.contents);
			}
		});
		promise.resolve(this.contents);
	}
	setLayout(layout) {
		this.layout = layout;
		if (this.contents) {
			this.layout.format(this.contents);
			this.expand();
		}
	}
	setAxis(axis) {
		this.settings.axis = axis;
		if (axis == "horizontal") this.element.style.flex = "none";
		else this.element.style.flex = "initial";
		this.size();
	}
	setWritingMode(mode) {
		this.writingMode = mode;
	}
	addListeners() {}
	removeListeners(layoutFunc) {}
	display(request) {
		var displayed = new defer();
		if (!this.displayed) this.render(request).then(function() {
			this.emit(EVENTS.VIEWS.DISPLAYED, this);
			this.onDisplayed(this);
			this.displayed = true;
			displayed.resolve(this);
		}.bind(this), function(err) {
			displayed.reject(err, this);
		});
		else displayed.resolve(this);
		return displayed.promise;
	}
	show() {
		this.element.style.visibility = "visible";
		if (this.iframe) {
			this.iframe.style.visibility = "visible";
			this.iframe.style.transform = "translateZ(0)";
			this.iframe.offsetWidth;
			this.iframe.style.transform = null;
		}
		this.emit(EVENTS.VIEWS.SHOWN, this);
	}
	hide() {
		this.element.style.visibility = "hidden";
		this.iframe.style.visibility = "hidden";
		this.stopExpanding = true;
		this.emit(EVENTS.VIEWS.HIDDEN, this);
	}
	offset() {
		return {
			top: this.element.offsetTop,
			left: this.element.offsetLeft
		};
	}
	width() {
		return this._width;
	}
	height() {
		return this._height;
	}
	position() {
		return this.element.getBoundingClientRect();
	}
	locationOf(target) {
		this.iframe.getBoundingClientRect();
		var targetPos = this.contents.locationOf(target, this.settings.ignoreClass);
		return {
			"left": targetPos.left,
			"top": targetPos.top
		};
	}
	onDisplayed(view) {}
	onResize(view, e) {}
	bounds(force) {
		if (force || !this.elementBounds) this.elementBounds = bounds(this.element);
		return this.elementBounds;
	}
	highlight(cfiRange, data = {}, cb, className = "epubjs-hl", styles = {}) {
		if (!this.contents) return;
		const attributes = Object.assign({
			"fill": "yellow",
			"fill-opacity": "0.3",
			"mix-blend-mode": "multiply"
		}, styles);
		let range = this.contents.range(cfiRange);
		let emitter = () => {
			this.emit(EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
		};
		data["epubcfi"] = cfiRange;
		if (!this.pane) this.pane = new import_marks.Pane(this.iframe, this.element);
		let m = new import_marks.Highlight(range, className, data, attributes);
		let h = this.pane.addMark(m);
		this.highlights[cfiRange] = {
			"mark": h,
			"element": h.element,
			"listeners": [emitter, cb]
		};
		h.element.setAttribute("ref", className);
		h.element.addEventListener("click", emitter);
		h.element.addEventListener("touchstart", emitter);
		if (cb) {
			h.element.addEventListener("click", cb);
			h.element.addEventListener("touchstart", cb);
		}
		return h;
	}
	underline(cfiRange, data = {}, cb, className = "epubjs-ul", styles = {}) {
		if (!this.contents) return;
		const attributes = Object.assign({
			"stroke": "black",
			"stroke-opacity": "0.3",
			"mix-blend-mode": "multiply"
		}, styles);
		let range = this.contents.range(cfiRange);
		let emitter = () => {
			this.emit(EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
		};
		data["epubcfi"] = cfiRange;
		if (!this.pane) this.pane = new import_marks.Pane(this.iframe, this.element);
		let m = new import_marks.Underline(range, className, data, attributes);
		let h = this.pane.addMark(m);
		this.underlines[cfiRange] = {
			"mark": h,
			"element": h.element,
			"listeners": [emitter, cb]
		};
		h.element.setAttribute("ref", className);
		h.element.addEventListener("click", emitter);
		h.element.addEventListener("touchstart", emitter);
		if (cb) {
			h.element.addEventListener("click", cb);
			h.element.addEventListener("touchstart", cb);
		}
		return h;
	}
	mark(cfiRange, data = {}, cb) {
		if (!this.contents) return;
		if (cfiRange in this.marks) return this.marks[cfiRange];
		let range = this.contents.range(cfiRange);
		if (!range) return;
		let container = range.commonAncestorContainer;
		let parent = container.nodeType === 1 ? container : container.parentNode;
		let emitter = (e) => {
			this.emit(EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
		};
		if (range.collapsed && container.nodeType === 1) {
			range = new Range();
			range.selectNodeContents(container);
		} else if (range.collapsed) {
			range = new Range();
			range.selectNodeContents(parent);
		}
		let mark = this.document.createElement("a");
		mark.setAttribute("ref", "epubjs-mk");
		mark.style.position = "absolute";
		mark.dataset["epubcfi"] = cfiRange;
		if (data) Object.keys(data).forEach((key) => {
			mark.dataset[key] = data[key];
		});
		if (cb) {
			mark.addEventListener("click", cb);
			mark.addEventListener("touchstart", cb);
		}
		mark.addEventListener("click", emitter);
		mark.addEventListener("touchstart", emitter);
		this.placeMark(mark, range);
		this.element.appendChild(mark);
		this.marks[cfiRange] = {
			"element": mark,
			"range": range,
			"listeners": [emitter, cb]
		};
		return parent;
	}
	placeMark(element, range) {
		let top, right, left;
		if (this.layout.name === "pre-paginated" || this.settings.axis !== "horizontal") {
			let pos = range.getBoundingClientRect();
			top = pos.top;
			right = pos.right;
		} else {
			let rects = range.getClientRects();
			let rect;
			for (var i = 0; i != rects.length; i++) {
				rect = rects[i];
				if (!left || rect.left < left) {
					left = rect.left;
					right = Math.ceil(left / this.layout.props.pageWidth) * this.layout.props.pageWidth - this.layout.gap / 2;
					top = rect.top;
				}
			}
		}
		element.style.top = `${top}px`;
		element.style.left = `${right}px`;
	}
	unhighlight(cfiRange) {
		let item;
		if (cfiRange in this.highlights) {
			item = this.highlights[cfiRange];
			this.pane.removeMark(item.mark);
			item.listeners.forEach((l) => {
				if (l) {
					item.element.removeEventListener("click", l);
					item.element.removeEventListener("touchstart", l);
				}
			});
			delete this.highlights[cfiRange];
		}
	}
	ununderline(cfiRange) {
		let item;
		if (cfiRange in this.underlines) {
			item = this.underlines[cfiRange];
			this.pane.removeMark(item.mark);
			item.listeners.forEach((l) => {
				if (l) {
					item.element.removeEventListener("click", l);
					item.element.removeEventListener("touchstart", l);
				}
			});
			delete this.underlines[cfiRange];
		}
	}
	unmark(cfiRange) {
		let item;
		if (cfiRange in this.marks) {
			item = this.marks[cfiRange];
			this.element.removeChild(item.element);
			item.listeners.forEach((l) => {
				if (l) {
					item.element.removeEventListener("click", l);
					item.element.removeEventListener("touchstart", l);
				}
			});
			delete this.marks[cfiRange];
		}
	}
	destroy() {
		for (let cfiRange in this.highlights) this.unhighlight(cfiRange);
		for (let cfiRange in this.underlines) this.ununderline(cfiRange);
		for (let cfiRange in this.marks) this.unmark(cfiRange);
		if (this.blobUrl) revokeBlobUrl(this.blobUrl);
		if (this.displayed) {
			this.displayed = false;
			this.removeListeners();
			this.contents.destroy();
			this.stopExpanding = true;
			this.element.removeChild(this.iframe);
			if (this.pane) {
				this.pane.element.remove();
				this.pane = void 0;
			}
			this.iframe = void 0;
			this.contents = void 0;
			this._textWidth = null;
			this._textHeight = null;
			this._width = null;
			this._height = null;
		}
	}
};
(0, import_event_emitter.default)(IframeView.prototype);
//#endregion
//#region node_modules/epubjs/src/utils/scrolltype.js
function scrollType() {
	var type = "reverse";
	var definer = createDefiner();
	document.body.appendChild(definer);
	if (definer.scrollLeft > 0) type = "default";
	else if (typeof Element !== "undefined" && Element.prototype.scrollIntoView) {
		definer.children[0].children[1].scrollIntoView();
		if (definer.scrollLeft < 0) type = "negative";
	} else {
		definer.scrollLeft = 1;
		if (definer.scrollLeft === 0) type = "negative";
	}
	document.body.removeChild(definer);
	return type;
}
function createDefiner() {
	var definer = document.createElement("div");
	definer.dir = "rtl";
	definer.style.position = "fixed";
	definer.style.width = "1px";
	definer.style.height = "1px";
	definer.style.top = "0px";
	definer.style.left = "0px";
	definer.style.overflow = "hidden";
	var innerDiv = document.createElement("div");
	innerDiv.style.width = "2px";
	var spanA = document.createElement("span");
	spanA.style.width = "1px";
	spanA.style.display = "inline-block";
	var spanB = document.createElement("span");
	spanB.style.width = "1px";
	spanB.style.display = "inline-block";
	innerDiv.appendChild(spanA);
	innerDiv.appendChild(spanB);
	definer.appendChild(innerDiv);
	return definer;
}
//#endregion
//#region node_modules/lodash/isObject.js
var require_isObject = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Checks if `value` is the
	* [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	* of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is an object, else `false`.
	* @example
	*
	* _.isObject({});
	* // => true
	*
	* _.isObject([1, 2, 3]);
	* // => true
	*
	* _.isObject(_.noop);
	* // => true
	*
	* _.isObject(null);
	* // => false
	*/
	function isObject(value) {
		var type = typeof value;
		return value != null && (type == "object" || type == "function");
	}
	module.exports = isObject;
}));
//#endregion
//#region node_modules/lodash/_freeGlobal.js
var require__freeGlobal = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = typeof global == "object" && global && global.Object === Object && global;
}));
//#endregion
//#region node_modules/lodash/_root.js
var require__root = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var freeGlobal = require__freeGlobal();
	/** Detect free variable `self`. */
	var freeSelf = typeof self == "object" && self && self.Object === Object && self;
	module.exports = freeGlobal || freeSelf || Function("return this")();
}));
//#endregion
//#region node_modules/lodash/now.js
var require_now = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var root = require__root();
	/**
	* Gets the timestamp of the number of milliseconds that have elapsed since
	* the Unix epoch (1 January 1970 00:00:00 UTC).
	*
	* @static
	* @memberOf _
	* @since 2.4.0
	* @category Date
	* @returns {number} Returns the timestamp.
	* @example
	*
	* _.defer(function(stamp) {
	*   console.log(_.now() - stamp);
	* }, _.now());
	* // => Logs the number of milliseconds it took for the deferred invocation.
	*/
	var now = function() {
		return root.Date.now();
	};
	module.exports = now;
}));
//#endregion
//#region node_modules/lodash/_trimmedEndIndex.js
var require__trimmedEndIndex = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** Used to match a single whitespace character. */
	var reWhitespace = /\s/;
	/**
	* Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
	* character of `string`.
	*
	* @private
	* @param {string} string The string to inspect.
	* @returns {number} Returns the index of the last non-whitespace character.
	*/
	function trimmedEndIndex(string) {
		var index = string.length;
		while (index-- && reWhitespace.test(string.charAt(index)));
		return index;
	}
	module.exports = trimmedEndIndex;
}));
//#endregion
//#region node_modules/lodash/_baseTrim.js
var require__baseTrim = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var trimmedEndIndex = require__trimmedEndIndex();
	/** Used to match leading whitespace. */
	var reTrimStart = /^\s+/;
	/**
	* The base implementation of `_.trim`.
	*
	* @private
	* @param {string} string The string to trim.
	* @returns {string} Returns the trimmed string.
	*/
	function baseTrim(string) {
		return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
	}
	module.exports = baseTrim;
}));
//#endregion
//#region node_modules/lodash/_Symbol.js
var require__Symbol = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__root().Symbol;
}));
//#endregion
//#region node_modules/lodash/_getRawTag.js
var require__getRawTag = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Symbol = require__Symbol();
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	/**
	* Used to resolve the
	* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	* of values.
	*/
	var nativeObjectToString = objectProto.toString;
	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : void 0;
	/**
	* A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	*
	* @private
	* @param {*} value The value to query.
	* @returns {string} Returns the raw `toStringTag`.
	*/
	function getRawTag(value) {
		var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
		try {
			value[symToStringTag] = void 0;
			var unmasked = true;
		} catch (e) {}
		var result = nativeObjectToString.call(value);
		if (unmasked) if (isOwn) value[symToStringTag] = tag;
		else delete value[symToStringTag];
		return result;
	}
	module.exports = getRawTag;
}));
//#endregion
//#region node_modules/lodash/_objectToString.js
var require__objectToString = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Used to resolve the
	* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	* of values.
	*/
	var nativeObjectToString = Object.prototype.toString;
	/**
	* Converts `value` to a string using `Object.prototype.toString`.
	*
	* @private
	* @param {*} value The value to convert.
	* @returns {string} Returns the converted string.
	*/
	function objectToString(value) {
		return nativeObjectToString.call(value);
	}
	module.exports = objectToString;
}));
//#endregion
//#region node_modules/lodash/_baseGetTag.js
var require__baseGetTag = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Symbol = require__Symbol();
	var getRawTag = require__getRawTag();
	var objectToString = require__objectToString();
	/** `Object#toString` result references. */
	var nullTag = "[object Null]";
	var undefinedTag = "[object Undefined]";
	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : void 0;
	/**
	* The base implementation of `getTag` without fallbacks for buggy environments.
	*
	* @private
	* @param {*} value The value to query.
	* @returns {string} Returns the `toStringTag`.
	*/
	function baseGetTag(value) {
		if (value == null) return value === void 0 ? undefinedTag : nullTag;
		return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
	}
	module.exports = baseGetTag;
}));
//#endregion
//#region node_modules/lodash/isObjectLike.js
var require_isObjectLike = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Checks if `value` is object-like. A value is object-like if it's not `null`
	* and has a `typeof` result of "object".
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	* @example
	*
	* _.isObjectLike({});
	* // => true
	*
	* _.isObjectLike([1, 2, 3]);
	* // => true
	*
	* _.isObjectLike(_.noop);
	* // => false
	*
	* _.isObjectLike(null);
	* // => false
	*/
	function isObjectLike(value) {
		return value != null && typeof value == "object";
	}
	module.exports = isObjectLike;
}));
//#endregion
//#region node_modules/lodash/isSymbol.js
var require_isSymbol = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseGetTag = require__baseGetTag();
	var isObjectLike = require_isObjectLike();
	/** `Object#toString` result references. */
	var symbolTag = "[object Symbol]";
	/**
	* Checks if `value` is classified as a `Symbol` primitive or object.
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	* @example
	*
	* _.isSymbol(Symbol.iterator);
	* // => true
	*
	* _.isSymbol('abc');
	* // => false
	*/
	function isSymbol(value) {
		return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
	}
	module.exports = isSymbol;
}));
//#endregion
//#region node_modules/lodash/toNumber.js
var require_toNumber = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseTrim = require__baseTrim();
	var isObject = require_isObject();
	var isSymbol = require_isSymbol();
	/** Used as references for various `Number` constants. */
	var NAN = NaN;
	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;
	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;
	/** Built-in method references without a dependency on `root`. */
	var freeParseInt = parseInt;
	/**
	* Converts `value` to a number.
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to process.
	* @returns {number} Returns the number.
	* @example
	*
	* _.toNumber(3.2);
	* // => 3.2
	*
	* _.toNumber(Number.MIN_VALUE);
	* // => 5e-324
	*
	* _.toNumber(Infinity);
	* // => Infinity
	*
	* _.toNumber('3.2');
	* // => 3.2
	*/
	function toNumber(value) {
		if (typeof value == "number") return value;
		if (isSymbol(value)) return NAN;
		if (isObject(value)) {
			var other = typeof value.valueOf == "function" ? value.valueOf() : value;
			value = isObject(other) ? other + "" : other;
		}
		if (typeof value != "string") return value === 0 ? value : +value;
		value = baseTrim(value);
		var isBinary = reIsBinary.test(value);
		return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
	}
	module.exports = toNumber;
}));
//#endregion
//#region node_modules/lodash/debounce.js
var require_debounce = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isObject = require_isObject();
	var now = require_now();
	var toNumber = require_toNumber();
	/** Error message constants. */
	var FUNC_ERROR_TEXT = "Expected a function";
	var nativeMax = Math.max;
	var nativeMin = Math.min;
	/**
	* Creates a debounced function that delays invoking `func` until after `wait`
	* milliseconds have elapsed since the last time the debounced function was
	* invoked. The debounced function comes with a `cancel` method to cancel
	* delayed `func` invocations and a `flush` method to immediately invoke them.
	* Provide `options` to indicate whether `func` should be invoked on the
	* leading and/or trailing edge of the `wait` timeout. The `func` is invoked
	* with the last arguments provided to the debounced function. Subsequent
	* calls to the debounced function return the result of the last `func`
	* invocation.
	*
	* **Note:** If `leading` and `trailing` options are `true`, `func` is
	* invoked on the trailing edge of the timeout only if the debounced function
	* is invoked more than once during the `wait` timeout.
	*
	* If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
	* until to the next tick, similar to `setTimeout` with a timeout of `0`.
	*
	* See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	* for details over the differences between `_.debounce` and `_.throttle`.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Function
	* @param {Function} func The function to debounce.
	* @param {number} [wait=0] The number of milliseconds to delay.
	* @param {Object} [options={}] The options object.
	* @param {boolean} [options.leading=false]
	*  Specify invoking on the leading edge of the timeout.
	* @param {number} [options.maxWait]
	*  The maximum time `func` is allowed to be delayed before it's invoked.
	* @param {boolean} [options.trailing=true]
	*  Specify invoking on the trailing edge of the timeout.
	* @returns {Function} Returns the new debounced function.
	* @example
	*
	* // Avoid costly calculations while the window size is in flux.
	* jQuery(window).on('resize', _.debounce(calculateLayout, 150));
	*
	* // Invoke `sendMail` when clicked, debouncing subsequent calls.
	* jQuery(element).on('click', _.debounce(sendMail, 300, {
	*   'leading': true,
	*   'trailing': false
	* }));
	*
	* // Ensure `batchLog` is invoked once after 1 second of debounced calls.
	* var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
	* var source = new EventSource('/stream');
	* jQuery(source).on('message', debounced);
	*
	* // Cancel the trailing debounced invocation.
	* jQuery(window).on('popstate', debounced.cancel);
	*/
	function debounce(func, wait, options) {
		var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
		if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
		wait = toNumber(wait) || 0;
		if (isObject(options)) {
			leading = !!options.leading;
			maxing = "maxWait" in options;
			maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
			trailing = "trailing" in options ? !!options.trailing : trailing;
		}
		function invokeFunc(time) {
			var args = lastArgs, thisArg = lastThis;
			lastArgs = lastThis = void 0;
			lastInvokeTime = time;
			result = func.apply(thisArg, args);
			return result;
		}
		function leadingEdge(time) {
			lastInvokeTime = time;
			timerId = setTimeout(timerExpired, wait);
			return leading ? invokeFunc(time) : result;
		}
		function remainingWait(time) {
			var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
			return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
		}
		function shouldInvoke(time) {
			var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
			return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
		}
		function timerExpired() {
			var time = now();
			if (shouldInvoke(time)) return trailingEdge(time);
			timerId = setTimeout(timerExpired, remainingWait(time));
		}
		function trailingEdge(time) {
			timerId = void 0;
			if (trailing && lastArgs) return invokeFunc(time);
			lastArgs = lastThis = void 0;
			return result;
		}
		function cancel() {
			if (timerId !== void 0) clearTimeout(timerId);
			lastInvokeTime = 0;
			lastArgs = lastCallTime = lastThis = timerId = void 0;
		}
		function flush() {
			return timerId === void 0 ? result : trailingEdge(now());
		}
		function debounced() {
			var time = now(), isInvoking = shouldInvoke(time);
			lastArgs = arguments;
			lastThis = this;
			lastCallTime = time;
			if (isInvoking) {
				if (timerId === void 0) return leadingEdge(lastCallTime);
				if (maxing) {
					clearTimeout(timerId);
					timerId = setTimeout(timerExpired, wait);
					return invokeFunc(lastCallTime);
				}
			}
			if (timerId === void 0) timerId = setTimeout(timerExpired, wait);
			return result;
		}
		debounced.cancel = cancel;
		debounced.flush = flush;
		return debounced;
	}
	module.exports = debounce;
}));
//#endregion
//#region node_modules/epubjs/src/managers/helpers/stage.js
var import_throttle = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var debounce = require_debounce();
	var isObject = require_isObject();
	/** Error message constants. */
	var FUNC_ERROR_TEXT = "Expected a function";
	/**
	* Creates a throttled function that only invokes `func` at most once per
	* every `wait` milliseconds. The throttled function comes with a `cancel`
	* method to cancel delayed `func` invocations and a `flush` method to
	* immediately invoke them. Provide `options` to indicate whether `func`
	* should be invoked on the leading and/or trailing edge of the `wait`
	* timeout. The `func` is invoked with the last arguments provided to the
	* throttled function. Subsequent calls to the throttled function return the
	* result of the last `func` invocation.
	*
	* **Note:** If `leading` and `trailing` options are `true`, `func` is
	* invoked on the trailing edge of the timeout only if the throttled function
	* is invoked more than once during the `wait` timeout.
	*
	* If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
	* until to the next tick, similar to `setTimeout` with a timeout of `0`.
	*
	* See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	* for details over the differences between `_.throttle` and `_.debounce`.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Function
	* @param {Function} func The function to throttle.
	* @param {number} [wait=0] The number of milliseconds to throttle invocations to.
	* @param {Object} [options={}] The options object.
	* @param {boolean} [options.leading=true]
	*  Specify invoking on the leading edge of the timeout.
	* @param {boolean} [options.trailing=true]
	*  Specify invoking on the trailing edge of the timeout.
	* @returns {Function} Returns the new throttled function.
	* @example
	*
	* // Avoid excessively updating the position while scrolling.
	* jQuery(window).on('scroll', _.throttle(updatePosition, 100));
	*
	* // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
	* var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
	* jQuery(element).on('click', throttled);
	*
	* // Cancel the trailing throttled invocation.
	* jQuery(window).on('popstate', throttled.cancel);
	*/
	function throttle(func, wait, options) {
		var leading = true, trailing = true;
		if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
		if (isObject(options)) {
			leading = "leading" in options ? !!options.leading : leading;
			trailing = "trailing" in options ? !!options.trailing : trailing;
		}
		return debounce(func, wait, {
			"leading": leading,
			"maxWait": wait,
			"trailing": trailing
		});
	}
	module.exports = throttle;
})))());
var Stage = class {
	constructor(_options) {
		this.settings = _options || {};
		this.id = "epubjs-container-" + uuid();
		this.container = this.create(this.settings);
		if (this.settings.hidden) this.wrapper = this.wrap(this.container);
	}
	create(options) {
		let height = options.height;
		let width = options.width;
		let overflow = options.overflow || false;
		let axis = options.axis || "vertical";
		let direction = options.direction;
		extend(this.settings, options);
		if (options.height && isNumber(options.height)) height = options.height + "px";
		if (options.width && isNumber(options.width)) width = options.width + "px";
		let container = document.createElement("div");
		container.id = this.id;
		container.classList.add("epub-container");
		container.style.wordSpacing = "0";
		container.style.lineHeight = "0";
		container.style.verticalAlign = "top";
		container.style.position = "relative";
		if (axis === "horizontal") {
			container.style.display = "flex";
			container.style.flexDirection = "row";
			container.style.flexWrap = "nowrap";
		}
		if (width) container.style.width = width;
		if (height) container.style.height = height;
		if (overflow) if (overflow === "scroll" && axis === "vertical") {
			container.style["overflow-y"] = overflow;
			container.style["overflow-x"] = "hidden";
		} else if (overflow === "scroll" && axis === "horizontal") {
			container.style["overflow-y"] = "hidden";
			container.style["overflow-x"] = overflow;
		} else container.style["overflow"] = overflow;
		if (direction) {
			container.dir = direction;
			container.style["direction"] = direction;
		}
		if (direction && this.settings.fullsize) document.body.style["direction"] = direction;
		return container;
	}
	wrap(container) {
		var wrapper = document.createElement("div");
		wrapper.style.visibility = "hidden";
		wrapper.style.overflow = "hidden";
		wrapper.style.width = "0";
		wrapper.style.height = "0";
		wrapper.appendChild(container);
		return wrapper;
	}
	getElement(_element) {
		var element;
		if (isElement(_element)) element = _element;
		else if (typeof _element === "string") element = document.getElementById(_element);
		if (!element) throw new Error("Not an Element");
		return element;
	}
	attachTo(what) {
		var element = this.getElement(what);
		var base;
		if (!element) return;
		if (this.settings.hidden) base = this.wrapper;
		else base = this.container;
		element.appendChild(base);
		this.element = element;
		return element;
	}
	getContainer() {
		return this.container;
	}
	onResize(func) {
		if (!isNumber(this.settings.width) || !isNumber(this.settings.height)) {
			this.resizeFunc = (0, import_throttle.default)(func, 50);
			window.addEventListener("resize", this.resizeFunc, false);
		}
	}
	onOrientationChange(func) {
		this.orientationChangeFunc = func;
		window.addEventListener("orientationchange", this.orientationChangeFunc, false);
	}
	size(width, height) {
		var bounds;
		let _width = width || this.settings.width;
		let _height = height || this.settings.height;
		if (width === null) {
			bounds = this.element.getBoundingClientRect();
			if (bounds.width) {
				width = Math.floor(bounds.width);
				this.container.style.width = width + "px";
			}
		} else if (isNumber(width)) this.container.style.width = width + "px";
		else this.container.style.width = width;
		if (height === null) {
			bounds = bounds || this.element.getBoundingClientRect();
			if (bounds.height) {
				height = bounds.height;
				this.container.style.height = height + "px";
			}
		} else if (isNumber(height)) this.container.style.height = height + "px";
		else this.container.style.height = height;
		if (!isNumber(width)) width = this.container.clientWidth;
		if (!isNumber(height)) height = this.container.clientHeight;
		this.containerStyles = window.getComputedStyle(this.container);
		this.containerPadding = {
			left: parseFloat(this.containerStyles["padding-left"]) || 0,
			right: parseFloat(this.containerStyles["padding-right"]) || 0,
			top: parseFloat(this.containerStyles["padding-top"]) || 0,
			bottom: parseFloat(this.containerStyles["padding-bottom"]) || 0
		};
		let _windowBounds = windowBounds();
		let bodyStyles = window.getComputedStyle(document.body);
		let bodyPadding = {
			left: parseFloat(bodyStyles["padding-left"]) || 0,
			right: parseFloat(bodyStyles["padding-right"]) || 0,
			top: parseFloat(bodyStyles["padding-top"]) || 0,
			bottom: parseFloat(bodyStyles["padding-bottom"]) || 0
		};
		if (!_width) width = _windowBounds.width - bodyPadding.left - bodyPadding.right;
		if (this.settings.fullsize && !_height || !_height) height = _windowBounds.height - bodyPadding.top - bodyPadding.bottom;
		return {
			width: width - this.containerPadding.left - this.containerPadding.right,
			height: height - this.containerPadding.top - this.containerPadding.bottom
		};
	}
	bounds() {
		let box;
		if (this.container.style.overflow !== "visible") box = this.container && this.container.getBoundingClientRect();
		if (!box || !box.width || !box.height) return windowBounds();
		else return box;
	}
	getSheet() {
		var style = document.createElement("style");
		style.appendChild(document.createTextNode(""));
		document.head.appendChild(style);
		return style.sheet;
	}
	addStyleRules(selector, rulesArray) {
		var scope = "#" + this.id + " ";
		var rules = "";
		if (!this.sheet) this.sheet = this.getSheet();
		rulesArray.forEach(function(set) {
			for (var prop in set) if (set.hasOwnProperty(prop)) rules += prop + ":" + set[prop] + ";";
		});
		this.sheet.insertRule(scope + selector + " {" + rules + "}", 0);
	}
	axis(axis) {
		if (axis === "horizontal") {
			this.container.style.display = "flex";
			this.container.style.flexDirection = "row";
			this.container.style.flexWrap = "nowrap";
		} else this.container.style.display = "block";
		this.settings.axis = axis;
	}
	direction(dir) {
		if (this.container) {
			this.container.dir = dir;
			this.container.style["direction"] = dir;
		}
		if (this.settings.fullsize) document.body.style["direction"] = dir;
		this.settings.dir = dir;
	}
	overflow(overflow) {
		if (this.container) if (overflow === "scroll" && this.settings.axis === "vertical") {
			this.container.style["overflow-y"] = overflow;
			this.container.style["overflow-x"] = "hidden";
		} else if (overflow === "scroll" && this.settings.axis === "horizontal") {
			this.container.style["overflow-y"] = "hidden";
			this.container.style["overflow-x"] = overflow;
		} else this.container.style["overflow"] = overflow;
		this.settings.overflow = overflow;
	}
	destroy() {
		if (this.element) {
			if (this.settings.hidden) this.wrapper;
			else this.container;
			if (this.element.contains(this.container)) this.element.removeChild(this.container);
			window.removeEventListener("resize", this.resizeFunc);
			window.removeEventListener("orientationChange", this.orientationChangeFunc);
		}
	}
};
//#endregion
//#region node_modules/epubjs/src/managers/helpers/views.js
var Views = class {
	constructor(container) {
		this.container = container;
		this._views = [];
		this.length = 0;
		this.hidden = false;
	}
	all() {
		return this._views;
	}
	first() {
		return this._views[0];
	}
	last() {
		return this._views[this._views.length - 1];
	}
	indexOf(view) {
		return this._views.indexOf(view);
	}
	slice() {
		return this._views.slice.apply(this._views, arguments);
	}
	get(i) {
		return this._views[i];
	}
	append(view) {
		this._views.push(view);
		if (this.container) this.container.appendChild(view.element);
		this.length++;
		return view;
	}
	prepend(view) {
		this._views.unshift(view);
		if (this.container) this.container.insertBefore(view.element, this.container.firstChild);
		this.length++;
		return view;
	}
	insert(view, index) {
		this._views.splice(index, 0, view);
		if (this.container) if (index < this.container.children.length) this.container.insertBefore(view.element, this.container.children[index]);
		else this.container.appendChild(view.element);
		this.length++;
		return view;
	}
	remove(view) {
		var index = this._views.indexOf(view);
		if (index > -1) this._views.splice(index, 1);
		this.destroy(view);
		this.length--;
	}
	destroy(view) {
		if (view.displayed) view.destroy();
		if (this.container) this.container.removeChild(view.element);
		view = null;
	}
	forEach() {
		return this._views.forEach.apply(this._views, arguments);
	}
	clear() {
		var view;
		var len = this.length;
		if (!this.length) return;
		for (var i = 0; i < len; i++) {
			view = this._views[i];
			this.destroy(view);
		}
		this._views = [];
		this.length = 0;
	}
	find(section) {
		var view;
		var len = this.length;
		for (var i = 0; i < len; i++) {
			view = this._views[i];
			if (view.displayed && view.section.index == section.index) return view;
		}
	}
	displayed() {
		var displayed = [];
		var view;
		var len = this.length;
		for (var i = 0; i < len; i++) {
			view = this._views[i];
			if (view.displayed) displayed.push(view);
		}
		return displayed;
	}
	show() {
		var view;
		var len = this.length;
		for (var i = 0; i < len; i++) {
			view = this._views[i];
			if (view.displayed) view.show();
		}
		this.hidden = false;
	}
	hide() {
		var view;
		var len = this.length;
		for (var i = 0; i < len; i++) {
			view = this._views[i];
			if (view.displayed) view.hide();
		}
		this.hidden = true;
	}
};
//#endregion
//#region node_modules/epubjs/src/managers/default/index.js
var DefaultViewManager = class {
	constructor(options) {
		this.name = "default";
		this.optsSettings = options.settings;
		this.View = options.view;
		this.request = options.request;
		this.renditionQueue = options.queue;
		this.q = new Queue(this);
		this.settings = extend(this.settings || {}, {
			infinite: true,
			hidden: false,
			width: void 0,
			height: void 0,
			axis: void 0,
			writingMode: void 0,
			flow: "scrolled",
			ignoreClass: "",
			fullsize: void 0,
			allowScriptedContent: false,
			allowPopups: false
		});
		extend(this.settings, options.settings || {});
		this.viewSettings = {
			ignoreClass: this.settings.ignoreClass,
			axis: this.settings.axis,
			flow: this.settings.flow,
			layout: this.layout,
			method: this.settings.method,
			width: 0,
			height: 0,
			forceEvenPages: true,
			allowScriptedContent: this.settings.allowScriptedContent,
			allowPopups: this.settings.allowPopups
		};
		this.rendered = false;
	}
	render(element, size) {
		let tag = element.tagName;
		if (typeof this.settings.fullsize === "undefined" && tag && (tag.toLowerCase() == "body" || tag.toLowerCase() == "html")) this.settings.fullsize = true;
		if (this.settings.fullsize) {
			this.settings.overflow = "visible";
			this.overflow = this.settings.overflow;
		}
		this.settings.size = size;
		this.settings.rtlScrollType = scrollType();
		this.stage = new Stage({
			width: size.width,
			height: size.height,
			overflow: this.overflow,
			hidden: this.settings.hidden,
			axis: this.settings.axis,
			fullsize: this.settings.fullsize,
			direction: this.settings.direction
		});
		this.stage.attachTo(element);
		this.container = this.stage.getContainer();
		this.views = new Views(this.container);
		this._bounds = this.bounds();
		this._stageSize = this.stage.size();
		this.viewSettings.width = this._stageSize.width;
		this.viewSettings.height = this._stageSize.height;
		this.stage.onResize(this.onResized.bind(this));
		this.stage.onOrientationChange(this.onOrientationChange.bind(this));
		this.addEventListeners();
		if (this.layout) this.updateLayout();
		this.rendered = true;
	}
	addEventListeners() {
		var scroller;
		window.addEventListener("unload", function(e) {
			this.destroy();
		}.bind(this));
		if (!this.settings.fullsize) scroller = this.container;
		else scroller = window;
		this._onScroll = this.onScroll.bind(this);
		scroller.addEventListener("scroll", this._onScroll);
	}
	removeEventListeners() {
		var scroller;
		if (!this.settings.fullsize) scroller = this.container;
		else scroller = window;
		scroller.removeEventListener("scroll", this._onScroll);
		this._onScroll = void 0;
	}
	destroy() {
		clearTimeout(this.orientationTimeout);
		clearTimeout(this.resizeTimeout);
		clearTimeout(this.afterScrolled);
		this.clear();
		this.removeEventListeners();
		this.stage.destroy();
		this.rendered = false;
	}
	onOrientationChange(e) {
		let { orientation } = window;
		if (this.optsSettings.resizeOnOrientationChange) this.resize();
		clearTimeout(this.orientationTimeout);
		this.orientationTimeout = setTimeout(function() {
			this.orientationTimeout = void 0;
			if (this.optsSettings.resizeOnOrientationChange) this.resize();
			this.emit(EVENTS.MANAGERS.ORIENTATION_CHANGE, orientation);
		}.bind(this), 500);
	}
	onResized(e) {
		this.resize();
	}
	resize(width, height, epubcfi) {
		let stageSize = this.stage.size(width, height);
		this.winBounds = windowBounds();
		if (this.orientationTimeout && this.winBounds.width === this.winBounds.height) {
			this._stageSize = void 0;
			return;
		}
		if (this._stageSize && this._stageSize.width === stageSize.width && this._stageSize.height === stageSize.height) return;
		this._stageSize = stageSize;
		this._bounds = this.bounds();
		this.clear();
		this.viewSettings.width = this._stageSize.width;
		this.viewSettings.height = this._stageSize.height;
		this.updateLayout();
		this.emit(EVENTS.MANAGERS.RESIZED, {
			width: this._stageSize.width,
			height: this._stageSize.height
		}, epubcfi);
	}
	createView(section, forceRight) {
		return new this.View(section, extend(this.viewSettings, { forceRight }));
	}
	handleNextPrePaginated(forceRight, section, action) {
		let next;
		if (this.layout.name === "pre-paginated" && this.layout.divisor > 1) {
			if (forceRight || section.index === 0) return;
			next = section.next();
			if (next && !next.properties.includes("page-spread-left")) return action.call(this, next);
		}
	}
	display(section, target) {
		var displaying = new defer();
		var displayed = displaying.promise;
		if (target === section.href || isNumber(target)) target = void 0;
		var visible = this.views.find(section);
		if (visible && section && this.layout.name !== "pre-paginated") {
			let offset = visible.offset();
			if (this.settings.direction === "ltr") this.scrollTo(offset.left, offset.top, true);
			else {
				let width = visible.width();
				this.scrollTo(offset.left + width, offset.top, true);
			}
			if (target) {
				let offset = visible.locationOf(target);
				let width = visible.width();
				this.moveTo(offset, width);
			}
			displaying.resolve();
			return displayed;
		}
		this.clear();
		let forceRight = false;
		if (this.layout.name === "pre-paginated" && this.layout.divisor === 2 && section.properties.includes("page-spread-right")) forceRight = true;
		this.add(section, forceRight).then(function(view) {
			if (target) {
				let offset = view.locationOf(target);
				let width = view.width();
				this.moveTo(offset, width);
			}
		}.bind(this), (err) => {
			displaying.reject(err);
		}).then(function() {
			return this.handleNextPrePaginated(forceRight, section, this.add);
		}.bind(this)).then(function() {
			this.views.show();
			displaying.resolve();
		}.bind(this));
		return displayed;
	}
	afterDisplayed(view) {
		this.emit(EVENTS.MANAGERS.ADDED, view);
	}
	afterResized(view) {
		this.emit(EVENTS.MANAGERS.RESIZE, view.section);
	}
	moveTo(offset, width) {
		var distX = 0, distY = 0;
		if (!this.isPaginated) distY = offset.top;
		else {
			distX = Math.floor(offset.left / this.layout.delta) * this.layout.delta;
			if (distX + this.layout.delta > this.container.scrollWidth) distX = this.container.scrollWidth - this.layout.delta;
			distY = Math.floor(offset.top / this.layout.delta) * this.layout.delta;
			if (distY + this.layout.delta > this.container.scrollHeight) distY = this.container.scrollHeight - this.layout.delta;
		}
		if (this.settings.direction === "rtl") {
			/***
			the `floor` function above (L343) is on positive values, so we should add one `layout.delta`
			to distX or use `Math.ceil` function, or multiply offset.left by -1
			before `Math.floor`
			*/
			distX = distX + this.layout.delta;
			distX = distX - width;
		}
		this.scrollTo(distX, distY, true);
	}
	add(section, forceRight) {
		var view = this.createView(section, forceRight);
		this.views.append(view);
		view.onDisplayed = this.afterDisplayed.bind(this);
		view.onResize = this.afterResized.bind(this);
		view.on(EVENTS.VIEWS.AXIS, (axis) => {
			this.updateAxis(axis);
		});
		view.on(EVENTS.VIEWS.WRITING_MODE, (mode) => {
			this.updateWritingMode(mode);
		});
		return view.display(this.request);
	}
	append(section, forceRight) {
		var view = this.createView(section, forceRight);
		this.views.append(view);
		view.onDisplayed = this.afterDisplayed.bind(this);
		view.onResize = this.afterResized.bind(this);
		view.on(EVENTS.VIEWS.AXIS, (axis) => {
			this.updateAxis(axis);
		});
		view.on(EVENTS.VIEWS.WRITING_MODE, (mode) => {
			this.updateWritingMode(mode);
		});
		return view.display(this.request);
	}
	prepend(section, forceRight) {
		var view = this.createView(section, forceRight);
		view.on(EVENTS.VIEWS.RESIZED, (bounds) => {
			this.counter(bounds);
		});
		this.views.prepend(view);
		view.onDisplayed = this.afterDisplayed.bind(this);
		view.onResize = this.afterResized.bind(this);
		view.on(EVENTS.VIEWS.AXIS, (axis) => {
			this.updateAxis(axis);
		});
		view.on(EVENTS.VIEWS.WRITING_MODE, (mode) => {
			this.updateWritingMode(mode);
		});
		return view.display(this.request);
	}
	counter(bounds) {
		if (this.settings.axis === "vertical") this.scrollBy(0, bounds.heightDelta, true);
		else this.scrollBy(bounds.widthDelta, 0, true);
	}
	next() {
		var next;
		var left;
		let dir = this.settings.direction;
		if (!this.views.length) return;
		if (this.isPaginated && this.settings.axis === "horizontal" && (!dir || dir === "ltr")) {
			this.scrollLeft = this.container.scrollLeft;
			left = this.container.scrollLeft + this.container.offsetWidth + this.layout.delta;
			if (left <= this.container.scrollWidth) this.scrollBy(this.layout.delta, 0, true);
			else next = this.views.last().section.next();
		} else if (this.isPaginated && this.settings.axis === "horizontal" && dir === "rtl") {
			this.scrollLeft = this.container.scrollLeft;
			if (this.settings.rtlScrollType === "default") {
				left = this.container.scrollLeft;
				if (left > 0) this.scrollBy(this.layout.delta, 0, true);
				else next = this.views.last().section.next();
			} else {
				left = this.container.scrollLeft + this.layout.delta * -1;
				if (left > this.container.scrollWidth * -1) this.scrollBy(this.layout.delta, 0, true);
				else next = this.views.last().section.next();
			}
		} else if (this.isPaginated && this.settings.axis === "vertical") {
			this.scrollTop = this.container.scrollTop;
			if (this.container.scrollTop + this.container.offsetHeight < this.container.scrollHeight) this.scrollBy(0, this.layout.height, true);
			else next = this.views.last().section.next();
		} else next = this.views.last().section.next();
		if (next) {
			this.clear();
			this.updateLayout();
			let forceRight = false;
			if (this.layout.name === "pre-paginated" && this.layout.divisor === 2 && next.properties.includes("page-spread-right")) forceRight = true;
			return this.append(next, forceRight).then(function() {
				return this.handleNextPrePaginated(forceRight, next, this.append);
			}.bind(this), (err) => {
				return err;
			}).then(function() {
				if (!this.isPaginated && this.settings.axis === "horizontal" && this.settings.direction === "rtl" && this.settings.rtlScrollType === "default") this.scrollTo(this.container.scrollWidth, 0, true);
				this.views.show();
			}.bind(this));
		}
	}
	prev() {
		var prev;
		var left;
		let dir = this.settings.direction;
		if (!this.views.length) return;
		if (this.isPaginated && this.settings.axis === "horizontal" && (!dir || dir === "ltr")) {
			this.scrollLeft = this.container.scrollLeft;
			left = this.container.scrollLeft;
			if (left > 0) this.scrollBy(-this.layout.delta, 0, true);
			else prev = this.views.first().section.prev();
		} else if (this.isPaginated && this.settings.axis === "horizontal" && dir === "rtl") {
			this.scrollLeft = this.container.scrollLeft;
			if (this.settings.rtlScrollType === "default") {
				left = this.container.scrollLeft + this.container.offsetWidth;
				if (left < this.container.scrollWidth) this.scrollBy(-this.layout.delta, 0, true);
				else prev = this.views.first().section.prev();
			} else {
				left = this.container.scrollLeft;
				if (left < 0) this.scrollBy(-this.layout.delta, 0, true);
				else prev = this.views.first().section.prev();
			}
		} else if (this.isPaginated && this.settings.axis === "vertical") {
			this.scrollTop = this.container.scrollTop;
			if (this.container.scrollTop > 0) this.scrollBy(0, -this.layout.height, true);
			else prev = this.views.first().section.prev();
		} else prev = this.views.first().section.prev();
		if (prev) {
			this.clear();
			this.updateLayout();
			let forceRight = false;
			if (this.layout.name === "pre-paginated" && this.layout.divisor === 2 && typeof prev.prev() !== "object") forceRight = true;
			return this.prepend(prev, forceRight).then(function() {
				var left;
				if (this.layout.name === "pre-paginated" && this.layout.divisor > 1) {
					left = prev.prev();
					if (left) return this.prepend(left);
				}
			}.bind(this), (err) => {
				return err;
			}).then(function() {
				if (this.isPaginated && this.settings.axis === "horizontal") if (this.settings.direction === "rtl") if (this.settings.rtlScrollType === "default") this.scrollTo(0, 0, true);
				else this.scrollTo(this.container.scrollWidth * -1 + this.layout.delta, 0, true);
				else this.scrollTo(this.container.scrollWidth - this.layout.delta, 0, true);
				this.views.show();
			}.bind(this));
		}
	}
	current() {
		var visible = this.visible();
		if (visible.length) return visible[visible.length - 1];
		return null;
	}
	clear() {
		if (this.views) {
			this.views.hide();
			this.scrollTo(0, 0, true);
			this.views.clear();
		}
	}
	currentLocation() {
		this.updateLayout();
		if (this.isPaginated && this.settings.axis === "horizontal") this.location = this.paginatedLocation();
		else this.location = this.scrolledLocation();
		return this.location;
	}
	scrolledLocation() {
		let visible = this.visible();
		let container = this.container.getBoundingClientRect();
		let pageHeight = container.height < window.innerHeight ? container.height : window.innerHeight;
		let pageWidth = container.width < window.innerWidth ? container.width : window.innerWidth;
		let vertical = this.settings.axis === "vertical";
		this.settings.direction;
		let offset = 0;
		let used = 0;
		if (this.settings.fullsize) offset = vertical ? window.scrollY : window.scrollX;
		return visible.map((view) => {
			let { index, href } = view.section;
			let position = view.position();
			let width = view.width();
			let height = view.height();
			let startPos;
			let endPos;
			let stopPos;
			let totalPages;
			if (vertical) {
				startPos = offset + container.top - position.top + used;
				endPos = startPos + pageHeight - used;
				totalPages = this.layout.count(height, pageHeight).pages;
				stopPos = pageHeight;
			} else {
				startPos = offset + container.left - position.left + used;
				endPos = startPos + pageWidth - used;
				totalPages = this.layout.count(width, pageWidth).pages;
				stopPos = pageWidth;
			}
			let currPage = Math.ceil(startPos / stopPos);
			let pages = [];
			let endPage = Math.ceil(endPos / stopPos);
			if (this.settings.direction === "rtl" && !vertical) {
				let tempStartPage = currPage;
				currPage = totalPages - endPage;
				endPage = totalPages - tempStartPage;
			}
			pages = [];
			for (var i = currPage; i <= endPage; i++) {
				let pg = i + 1;
				pages.push(pg);
			}
			let mapping = this.mapping.page(view.contents, view.section.cfiBase, startPos, endPos);
			return {
				index,
				href,
				pages,
				totalPages,
				mapping
			};
		});
	}
	paginatedLocation() {
		let visible = this.visible();
		let container = this.container.getBoundingClientRect();
		let left = 0;
		let used = 0;
		if (this.settings.fullsize) left = window.scrollX;
		return visible.map((view) => {
			let { index, href } = view.section;
			let offset;
			let position = view.position();
			let width = view.width();
			let start;
			let end;
			let pageWidth;
			if (this.settings.direction === "rtl") {
				offset = container.right - left;
				pageWidth = Math.min(Math.abs(offset - position.left), this.layout.width) - used;
				end = position.width - (position.right - offset) - used;
				start = end - pageWidth;
			} else {
				offset = container.left + left;
				pageWidth = Math.min(position.right - offset, this.layout.width) - used;
				start = offset - position.left + used;
				end = start + pageWidth;
			}
			used += pageWidth;
			let mapping = this.mapping.page(view.contents, view.section.cfiBase, start, end);
			let totalPages = this.layout.count(width).pages;
			let startPage = Math.floor(start / this.layout.pageWidth);
			let pages = [];
			let endPage = Math.floor(end / this.layout.pageWidth);
			if (startPage < 0) {
				startPage = 0;
				endPage = endPage + 1;
			}
			if (this.settings.direction === "rtl") {
				let tempStartPage = startPage;
				startPage = totalPages - endPage;
				endPage = totalPages - tempStartPage;
			}
			for (var i = startPage + 1; i <= endPage; i++) {
				let pg = i;
				pages.push(pg);
			}
			return {
				index,
				href,
				pages,
				totalPages,
				mapping
			};
		});
	}
	isVisible(view, offsetPrev, offsetNext, _container) {
		var position = view.position();
		var container = _container || this.bounds();
		if (this.settings.axis === "horizontal" && position.right > container.left - offsetPrev && position.left < container.right + offsetNext) return true;
		else if (this.settings.axis === "vertical" && position.bottom > container.top - offsetPrev && position.top < container.bottom + offsetNext) return true;
		return false;
	}
	visible() {
		var container = this.bounds();
		var views = this.views.displayed();
		var viewsLength = views.length;
		var visible = [];
		var isVisible;
		var view;
		for (var i = 0; i < viewsLength; i++) {
			view = views[i];
			isVisible = this.isVisible(view, 0, 0, container);
			if (isVisible === true) visible.push(view);
		}
		return visible;
	}
	scrollBy(x, y, silent) {
		let dir = this.settings.direction === "rtl" ? -1 : 1;
		if (silent) this.ignore = true;
		if (!this.settings.fullsize) {
			if (x) this.container.scrollLeft += x * dir;
			if (y) this.container.scrollTop += y;
		} else window.scrollBy(x * dir, y * dir);
		this.scrolled = true;
	}
	scrollTo(x, y, silent) {
		if (silent) this.ignore = true;
		if (!this.settings.fullsize) {
			this.container.scrollLeft = x;
			this.container.scrollTop = y;
		} else window.scrollTo(x, y);
		this.scrolled = true;
	}
	onScroll() {
		let scrollTop;
		let scrollLeft;
		if (!this.settings.fullsize) {
			scrollTop = this.container.scrollTop;
			scrollLeft = this.container.scrollLeft;
		} else {
			scrollTop = window.scrollY;
			scrollLeft = window.scrollX;
		}
		this.scrollTop = scrollTop;
		this.scrollLeft = scrollLeft;
		if (!this.ignore) {
			this.emit(EVENTS.MANAGERS.SCROLL, {
				top: scrollTop,
				left: scrollLeft
			});
			clearTimeout(this.afterScrolled);
			this.afterScrolled = setTimeout(function() {
				this.emit(EVENTS.MANAGERS.SCROLLED, {
					top: this.scrollTop,
					left: this.scrollLeft
				});
			}.bind(this), 20);
		} else this.ignore = false;
	}
	bounds() {
		return this.stage.bounds();
	}
	applyLayout(layout) {
		this.layout = layout;
		this.updateLayout();
		if (this.views && this.views.length > 0 && this.layout.name === "pre-paginated") this.display(this.views.first().section);
	}
	updateLayout() {
		if (!this.stage) return;
		this._stageSize = this.stage.size();
		if (!this.isPaginated) this.layout.calculate(this._stageSize.width, this._stageSize.height);
		else {
			this.layout.calculate(this._stageSize.width, this._stageSize.height, this.settings.gap);
			this.settings.offset = this.layout.delta / this.layout.divisor;
		}
		this.viewSettings.width = this.layout.width;
		this.viewSettings.height = this.layout.height;
		this.setLayout(this.layout);
	}
	setLayout(layout) {
		this.viewSettings.layout = layout;
		this.mapping = new Mapping(layout.props, this.settings.direction, this.settings.axis);
		if (this.views) this.views.forEach(function(view) {
			if (view) view.setLayout(layout);
		});
	}
	updateWritingMode(mode) {
		this.writingMode = mode;
	}
	updateAxis(axis, forceUpdate) {
		if (!forceUpdate && axis === this.settings.axis) return;
		this.settings.axis = axis;
		this.stage && this.stage.axis(axis);
		this.viewSettings.axis = axis;
		if (this.mapping) this.mapping = new Mapping(this.layout.props, this.settings.direction, this.settings.axis);
		if (this.layout) if (axis === "vertical") this.layout.spread("none");
		else this.layout.spread(this.layout.settings.spread);
	}
	updateFlow(flow, defaultScrolledOverflow = "auto") {
		let isPaginated = flow === "paginated" || flow === "auto";
		this.isPaginated = isPaginated;
		if (flow === "scrolled-doc" || flow === "scrolled-continuous" || flow === "scrolled") this.updateAxis("vertical");
		else this.updateAxis("horizontal");
		this.viewSettings.flow = flow;
		if (!this.settings.overflow) this.overflow = isPaginated ? "hidden" : defaultScrolledOverflow;
		else this.overflow = this.settings.overflow;
		this.stage && this.stage.overflow(this.overflow);
		this.updateLayout();
	}
	getContents() {
		var contents = [];
		if (!this.views) return contents;
		this.views.forEach(function(view) {
			const viewContents = view && view.contents;
			if (viewContents) contents.push(viewContents);
		});
		return contents;
	}
	direction(dir = "ltr") {
		this.settings.direction = dir;
		this.stage && this.stage.direction(dir);
		this.viewSettings.direction = dir;
		this.updateLayout();
	}
	isRendered() {
		return this.rendered;
	}
};
(0, import_event_emitter.default)(DefaultViewManager.prototype);
//#endregion
//#region node_modules/epubjs/src/managers/helpers/snap.js
var PI_D2 = Math.PI / 2;
var EASING_EQUATIONS = {
	easeOutSine: function(pos) {
		return Math.sin(pos * PI_D2);
	},
	easeInOutSine: function(pos) {
		return -.5 * (Math.cos(Math.PI * pos) - 1);
	},
	easeInOutQuint: function(pos) {
		if ((pos /= .5) < 1) return .5 * Math.pow(pos, 5);
		return .5 * (Math.pow(pos - 2, 5) + 2);
	},
	easeInCubic: function(pos) {
		return Math.pow(pos, 3);
	}
};
var Snap = class {
	constructor(manager, options) {
		this.settings = extend({
			duration: 80,
			minVelocity: .2,
			minDistance: 10,
			easing: EASING_EQUATIONS["easeInCubic"]
		}, options || {});
		this.supportsTouch = this.supportsTouch();
		if (this.supportsTouch) this.setup(manager);
	}
	setup(manager) {
		this.manager = manager;
		this.layout = this.manager.layout;
		this.fullsize = this.manager.settings.fullsize;
		if (this.fullsize) {
			this.element = this.manager.stage.element;
			this.scroller = window;
			this.disableScroll();
		} else {
			this.element = this.manager.stage.container;
			this.scroller = this.element;
			this.element.style["WebkitOverflowScrolling"] = "touch";
		}
		this.manager.settings.offset = this.layout.width;
		this.manager.settings.afterScrolledTimeout = this.settings.duration * 2;
		this.isVertical = this.manager.settings.axis === "vertical";
		if (!this.manager.isPaginated || this.isVertical) return;
		this.touchCanceler = false;
		this.resizeCanceler = false;
		this.snapping = false;
		this.scrollLeft;
		this.scrollTop;
		this.startTouchX = void 0;
		this.startTouchY = void 0;
		this.startTime = void 0;
		this.endTouchX = void 0;
		this.endTouchY = void 0;
		this.endTime = void 0;
		this.addListeners();
	}
	supportsTouch() {
		if ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch) return true;
		return false;
	}
	disableScroll() {
		this.element.style.overflow = "hidden";
	}
	enableScroll() {
		this.element.style.overflow = "";
	}
	addListeners() {
		this._onResize = this.onResize.bind(this);
		window.addEventListener("resize", this._onResize);
		this._onScroll = this.onScroll.bind(this);
		this.scroller.addEventListener("scroll", this._onScroll);
		this._onTouchStart = this.onTouchStart.bind(this);
		this.scroller.addEventListener("touchstart", this._onTouchStart, { passive: true });
		this.on("touchstart", this._onTouchStart);
		this._onTouchMove = this.onTouchMove.bind(this);
		this.scroller.addEventListener("touchmove", this._onTouchMove, { passive: true });
		this.on("touchmove", this._onTouchMove);
		this._onTouchEnd = this.onTouchEnd.bind(this);
		this.scroller.addEventListener("touchend", this._onTouchEnd, { passive: true });
		this.on("touchend", this._onTouchEnd);
		this._afterDisplayed = this.afterDisplayed.bind(this);
		this.manager.on(EVENTS.MANAGERS.ADDED, this._afterDisplayed);
	}
	removeListeners() {
		window.removeEventListener("resize", this._onResize);
		this._onResize = void 0;
		this.scroller.removeEventListener("scroll", this._onScroll);
		this._onScroll = void 0;
		this.scroller.removeEventListener("touchstart", this._onTouchStart, { passive: true });
		this.off("touchstart", this._onTouchStart);
		this._onTouchStart = void 0;
		this.scroller.removeEventListener("touchmove", this._onTouchMove, { passive: true });
		this.off("touchmove", this._onTouchMove);
		this._onTouchMove = void 0;
		this.scroller.removeEventListener("touchend", this._onTouchEnd, { passive: true });
		this.off("touchend", this._onTouchEnd);
		this._onTouchEnd = void 0;
		this.manager.off(EVENTS.MANAGERS.ADDED, this._afterDisplayed);
		this._afterDisplayed = void 0;
	}
	afterDisplayed(view) {
		let contents = view.contents;
		[
			"touchstart",
			"touchmove",
			"touchend"
		].forEach((e) => {
			contents.on(e, (ev) => this.triggerViewEvent(ev, contents));
		});
	}
	triggerViewEvent(e, contents) {
		this.emit(e.type, e, contents);
	}
	onScroll(e) {
		this.scrollLeft = this.fullsize ? window.scrollX : this.scroller.scrollLeft;
		this.scrollTop = this.fullsize ? window.scrollY : this.scroller.scrollTop;
	}
	onResize(e) {
		this.resizeCanceler = true;
	}
	onTouchStart(e) {
		let { screenX, screenY } = e.touches[0];
		if (this.fullsize) this.enableScroll();
		this.touchCanceler = true;
		if (!this.startTouchX) {
			this.startTouchX = screenX;
			this.startTouchY = screenY;
			this.startTime = this.now();
		}
		this.endTouchX = screenX;
		this.endTouchY = screenY;
		this.endTime = this.now();
	}
	onTouchMove(e) {
		let { screenX, screenY } = e.touches[0];
		let deltaY = Math.abs(screenY - this.endTouchY);
		this.touchCanceler = true;
		if (!this.fullsize && deltaY < 10) this.element.scrollLeft -= screenX - this.endTouchX;
		this.endTouchX = screenX;
		this.endTouchY = screenY;
		this.endTime = this.now();
	}
	onTouchEnd(e) {
		if (this.fullsize) this.disableScroll();
		this.touchCanceler = false;
		let swipped = this.wasSwiped();
		if (swipped !== 0) this.snap(swipped);
		else this.snap();
		this.startTouchX = void 0;
		this.startTouchY = void 0;
		this.startTime = void 0;
		this.endTouchX = void 0;
		this.endTouchY = void 0;
		this.endTime = void 0;
	}
	wasSwiped() {
		let snapWidth = this.layout.pageWidth * this.layout.divisor;
		let distance = this.endTouchX - this.startTouchX;
		let absolute = Math.abs(distance);
		let velocity = distance / (this.endTime - this.startTime);
		let minVelocity = this.settings.minVelocity;
		if (absolute <= this.settings.minDistance || absolute >= snapWidth) return 0;
		if (velocity > minVelocity) return -1;
		else if (velocity < -minVelocity) return 1;
	}
	needsSnap() {
		return this.scrollLeft % (this.layout.pageWidth * this.layout.divisor) !== 0;
	}
	snap(howMany = 0) {
		let left = this.scrollLeft;
		let snapWidth = this.layout.pageWidth * this.layout.divisor;
		let snapTo = Math.round(left / snapWidth) * snapWidth;
		if (howMany) snapTo += howMany * snapWidth;
		return this.smoothScrollTo(snapTo);
	}
	smoothScrollTo(destination) {
		const deferred = new defer();
		const start = this.scrollLeft;
		const startTime = this.now();
		const duration = this.settings.duration;
		const easing = this.settings.easing;
		this.snapping = true;
		function tick() {
			const now = this.now();
			const time = Math.min(1, (now - startTime) / duration);
			easing(time);
			if (this.touchCanceler || this.resizeCanceler) {
				this.resizeCanceler = false;
				this.snapping = false;
				deferred.resolve();
				return;
			}
			if (time < 1) {
				window.requestAnimationFrame(tick.bind(this));
				this.scrollTo(start + (destination - start) * time, 0);
			} else {
				this.scrollTo(destination, 0);
				this.snapping = false;
				deferred.resolve();
			}
		}
		tick.call(this);
		return deferred.promise;
	}
	scrollTo(left = 0, top = 0) {
		if (this.fullsize) window.scroll(left, top);
		else {
			this.scroller.scrollLeft = left;
			this.scroller.scrollTop = top;
		}
	}
	now() {
		return "now" in window.performance ? performance.now() : (/* @__PURE__ */ new Date()).getTime();
	}
	destroy() {
		if (!this.scroller) return;
		if (this.fullsize) this.enableScroll();
		this.removeListeners();
		this.scroller = void 0;
	}
};
(0, import_event_emitter.default)(Snap.prototype);
//#endregion
//#region node_modules/epubjs/src/managers/continuous/index.js
var import_debounce = /* @__PURE__ */ __toESM(require_debounce());
var ContinuousViewManager = class extends DefaultViewManager {
	constructor(options) {
		super(options);
		this.name = "continuous";
		this.settings = extend(this.settings || {}, {
			infinite: true,
			overflow: void 0,
			axis: void 0,
			writingMode: void 0,
			flow: "scrolled",
			offset: 500,
			offsetDelta: 250,
			width: void 0,
			height: void 0,
			snap: false,
			afterScrolledTimeout: 10,
			allowScriptedContent: false,
			allowPopups: false
		});
		extend(this.settings, options.settings || {});
		if (options.settings.gap != "undefined" && options.settings.gap === 0) this.settings.gap = options.settings.gap;
		this.viewSettings = {
			ignoreClass: this.settings.ignoreClass,
			axis: this.settings.axis,
			flow: this.settings.flow,
			layout: this.layout,
			width: 0,
			height: 0,
			forceEvenPages: false,
			allowScriptedContent: this.settings.allowScriptedContent,
			allowPopups: this.settings.allowPopups
		};
		this.scrollTop = 0;
		this.scrollLeft = 0;
	}
	display(section, target) {
		return DefaultViewManager.prototype.display.call(this, section, target).then(function() {
			return this.fill();
		}.bind(this));
	}
	fill(_full) {
		var full = _full || new defer();
		this.q.enqueue(() => {
			return this.check();
		}).then((result) => {
			if (result) this.fill(full);
			else full.resolve();
		});
		return full.promise;
	}
	moveTo(offset) {
		var distX = 0, distY = 0;
		if (!this.isPaginated) {
			distY = offset.top;
			offset.top + this.settings.offsetDelta;
		} else {
			distX = Math.floor(offset.left / this.layout.delta) * this.layout.delta;
			distX + this.settings.offsetDelta;
		}
		if (distX > 0 || distY > 0) this.scrollBy(distX, distY, true);
	}
	afterResized(view) {
		this.emit(EVENTS.MANAGERS.RESIZE, view.section);
	}
	removeShownListeners(view) {
		view.onDisplayed = function() {};
	}
	add(section) {
		var view = this.createView(section);
		this.views.append(view);
		view.on(EVENTS.VIEWS.RESIZED, (bounds) => {
			view.expanded = true;
		});
		view.on(EVENTS.VIEWS.AXIS, (axis) => {
			this.updateAxis(axis);
		});
		view.on(EVENTS.VIEWS.WRITING_MODE, (mode) => {
			this.updateWritingMode(mode);
		});
		view.onDisplayed = this.afterDisplayed.bind(this);
		view.onResize = this.afterResized.bind(this);
		return view.display(this.request);
	}
	append(section) {
		var view = this.createView(section);
		view.on(EVENTS.VIEWS.RESIZED, (bounds) => {
			view.expanded = true;
		});
		view.on(EVENTS.VIEWS.AXIS, (axis) => {
			this.updateAxis(axis);
		});
		view.on(EVENTS.VIEWS.WRITING_MODE, (mode) => {
			this.updateWritingMode(mode);
		});
		this.views.append(view);
		view.onDisplayed = this.afterDisplayed.bind(this);
		return view;
	}
	prepend(section) {
		var view = this.createView(section);
		view.on(EVENTS.VIEWS.RESIZED, (bounds) => {
			this.counter(bounds);
			view.expanded = true;
		});
		view.on(EVENTS.VIEWS.AXIS, (axis) => {
			this.updateAxis(axis);
		});
		view.on(EVENTS.VIEWS.WRITING_MODE, (mode) => {
			this.updateWritingMode(mode);
		});
		this.views.prepend(view);
		view.onDisplayed = this.afterDisplayed.bind(this);
		return view;
	}
	counter(bounds) {
		if (this.settings.axis === "vertical") this.scrollBy(0, bounds.heightDelta, true);
		else this.scrollBy(bounds.widthDelta, 0, true);
	}
	update(_offset) {
		var container = this.bounds();
		var views = this.views.all();
		var viewsLength = views.length;
		var visible = [];
		var offset = typeof _offset != "undefined" ? _offset : this.settings.offset || 0;
		var isVisible;
		var view;
		var updating = new defer();
		var promises = [];
		for (var i = 0; i < viewsLength; i++) {
			view = views[i];
			isVisible = this.isVisible(view, offset, offset, container);
			if (isVisible === true) {
				if (!view.displayed) {
					let displayed = view.display(this.request).then(function(view) {
						view.show();
					}, (err) => {
						view.hide();
					});
					promises.push(displayed);
				} else view.show();
				visible.push(view);
			} else {
				this.q.enqueue(view.destroy.bind(view));
				clearTimeout(this.trimTimeout);
				this.trimTimeout = setTimeout(function() {
					this.q.enqueue(this.trim.bind(this));
				}.bind(this), 250);
			}
		}
		if (promises.length) return Promise.all(promises).catch((err) => {
			updating.reject(err);
		});
		else {
			updating.resolve();
			return updating.promise;
		}
	}
	check(_offsetLeft, _offsetTop) {
		var checking = new defer();
		var newViews = [];
		var horizontal = this.settings.axis === "horizontal";
		var delta = this.settings.offset || 0;
		if (_offsetLeft && horizontal) delta = _offsetLeft;
		if (_offsetTop && !horizontal) delta = _offsetTop;
		var bounds = this._bounds;
		let offset = horizontal ? this.scrollLeft : this.scrollTop;
		let visibleLength = horizontal ? Math.floor(bounds.width) : bounds.height;
		let contentLength = horizontal ? this.container.scrollWidth : this.container.scrollHeight;
		let writingMode = this.writingMode && this.writingMode.indexOf("vertical") === 0 ? "vertical" : "horizontal";
		let rtlScrollType = this.settings.rtlScrollType;
		let rtl = this.settings.direction === "rtl";
		if (!this.settings.fullsize) {
			if (rtl && rtlScrollType === "default" && writingMode === "horizontal") offset = contentLength - visibleLength - offset;
			if (rtl && rtlScrollType === "negative" && writingMode === "horizontal") offset = offset * -1;
		} else if (horizontal && rtl && rtlScrollType === "negative" || !horizontal && rtl && rtlScrollType === "default") offset = offset * -1;
		let prepend = () => {
			let first = this.views.first();
			let prev = first && first.section.prev();
			if (prev) newViews.push(this.prepend(prev));
		};
		let append = () => {
			let last = this.views.last();
			let next = last && last.section.next();
			if (next) newViews.push(this.append(next));
		};
		let end = offset + visibleLength + delta;
		let start = offset - delta;
		if (end >= contentLength) append();
		if (start < 0) prepend();
		let promises = newViews.map((view) => {
			return view.display(this.request);
		});
		if (newViews.length) return Promise.all(promises).then(() => {
			return this.check();
		}).then(() => {
			return this.update(delta);
		}, (err) => {
			return err;
		});
		else {
			this.q.enqueue(function() {
				this.update();
			}.bind(this));
			checking.resolve(false);
			return checking.promise;
		}
	}
	trim() {
		var task = new defer();
		var displayed = this.views.displayed();
		var first = displayed[0];
		var last = displayed[displayed.length - 1];
		var firstIndex = this.views.indexOf(first);
		var lastIndex = this.views.indexOf(last);
		var above = this.views.slice(0, firstIndex);
		var below = this.views.slice(lastIndex + 1);
		for (var i = 0; i < above.length - 1; i++) this.erase(above[i], above);
		for (var j = 1; j < below.length; j++) this.erase(below[j]);
		task.resolve();
		return task.promise;
	}
	erase(view, above) {
		var prevTop;
		var prevLeft;
		if (!this.settings.fullsize) {
			prevTop = this.container.scrollTop;
			prevLeft = this.container.scrollLeft;
		} else {
			prevTop = window.scrollY;
			prevLeft = window.scrollX;
		}
		var bounds = view.bounds();
		this.views.remove(view);
		if (above) if (this.settings.axis === "vertical") this.scrollTo(0, prevTop - bounds.height, true);
		else if (this.settings.direction === "rtl") if (!this.settings.fullsize) this.scrollTo(prevLeft, 0, true);
		else this.scrollTo(prevLeft + Math.floor(bounds.width), 0, true);
		else this.scrollTo(prevLeft - Math.floor(bounds.width), 0, true);
	}
	addEventListeners(stage) {
		window.addEventListener("unload", function(e) {
			this.ignore = true;
			this.destroy();
		}.bind(this));
		this.addScrollListeners();
		if (this.isPaginated && this.settings.snap) this.snapper = new Snap(this, this.settings.snap && typeof this.settings.snap === "object" && this.settings.snap);
	}
	addScrollListeners() {
		var scroller;
		this.tick = requestAnimationFrame$1;
		let dir = this.settings.direction === "rtl" && this.settings.rtlScrollType === "default" ? -1 : 1;
		this.scrollDeltaVert = 0;
		this.scrollDeltaHorz = 0;
		if (!this.settings.fullsize) {
			scroller = this.container;
			this.scrollTop = this.container.scrollTop;
			this.scrollLeft = this.container.scrollLeft;
		} else {
			scroller = window;
			this.scrollTop = window.scrollY * dir;
			this.scrollLeft = window.scrollX * dir;
		}
		this._onScroll = this.onScroll.bind(this);
		scroller.addEventListener("scroll", this._onScroll);
		this._scrolled = (0, import_debounce.default)(this.scrolled.bind(this), 30);
		this.didScroll = false;
	}
	removeEventListeners() {
		var scroller;
		if (!this.settings.fullsize) scroller = this.container;
		else scroller = window;
		scroller.removeEventListener("scroll", this._onScroll);
		this._onScroll = void 0;
	}
	onScroll() {
		let scrollTop;
		let scrollLeft;
		let dir = this.settings.direction === "rtl" && this.settings.rtlScrollType === "default" ? -1 : 1;
		if (!this.settings.fullsize) {
			scrollTop = this.container.scrollTop;
			scrollLeft = this.container.scrollLeft;
		} else {
			scrollTop = window.scrollY * dir;
			scrollLeft = window.scrollX * dir;
		}
		this.scrollTop = scrollTop;
		this.scrollLeft = scrollLeft;
		if (!this.ignore) this._scrolled();
		else this.ignore = false;
		this.scrollDeltaVert += Math.abs(scrollTop - this.prevScrollTop);
		this.scrollDeltaHorz += Math.abs(scrollLeft - this.prevScrollLeft);
		this.prevScrollTop = scrollTop;
		this.prevScrollLeft = scrollLeft;
		clearTimeout(this.scrollTimeout);
		this.scrollTimeout = setTimeout(function() {
			this.scrollDeltaVert = 0;
			this.scrollDeltaHorz = 0;
		}.bind(this), 150);
		clearTimeout(this.afterScrolled);
		this.didScroll = false;
	}
	scrolled() {
		this.q.enqueue(function() {
			return this.check();
		}.bind(this));
		this.emit(EVENTS.MANAGERS.SCROLL, {
			top: this.scrollTop,
			left: this.scrollLeft
		});
		clearTimeout(this.afterScrolled);
		this.afterScrolled = setTimeout(function() {
			if (this.snapper && this.snapper.supportsTouch && this.snapper.needsSnap()) return;
			this.emit(EVENTS.MANAGERS.SCROLLED, {
				top: this.scrollTop,
				left: this.scrollLeft
			});
		}.bind(this), this.settings.afterScrolledTimeout);
	}
	next() {
		let delta = this.layout.props.name === "pre-paginated" && this.layout.props.spread ? this.layout.props.delta * 2 : this.layout.props.delta;
		if (!this.views.length) return;
		if (this.isPaginated && this.settings.axis === "horizontal") this.scrollBy(delta, 0, true);
		else this.scrollBy(0, this.layout.height, true);
		this.q.enqueue(function() {
			return this.check();
		}.bind(this));
	}
	prev() {
		let delta = this.layout.props.name === "pre-paginated" && this.layout.props.spread ? this.layout.props.delta * 2 : this.layout.props.delta;
		if (!this.views.length) return;
		if (this.isPaginated && this.settings.axis === "horizontal") this.scrollBy(-delta, 0, true);
		else this.scrollBy(0, -this.layout.height, true);
		this.q.enqueue(function() {
			return this.check();
		}.bind(this));
	}
	updateFlow(flow) {
		if (this.rendered && this.snapper) {
			this.snapper.destroy();
			this.snapper = void 0;
		}
		super.updateFlow(flow, "scroll");
		if (this.rendered && this.isPaginated && this.settings.snap) this.snapper = new Snap(this, this.settings.snap && typeof this.settings.snap === "object" && this.settings.snap);
	}
	destroy() {
		super.destroy();
		if (this.snapper) this.snapper.destroy();
	}
};
//#endregion
//#region node_modules/epubjs/src/rendition.js
/**
* Displays an Epub as a series of Views for each Section.
* Requires Manager and View class to handle specifics of rendering
* the section content.
* @class
* @param {Book} book
* @param {object} [options]
* @param {number} [options.width]
* @param {number} [options.height]
* @param {string} [options.ignoreClass] class for the cfi parser to ignore
* @param {string | function | object} [options.manager='default']
* @param {string | function} [options.view='iframe']
* @param {string} [options.layout] layout to force
* @param {string} [options.spread] force spread value
* @param {number} [options.minSpreadWidth] overridden by spread: none (never) / both (always)
* @param {string} [options.stylesheet] url of stylesheet to be injected
* @param {boolean} [options.resizeOnOrientationChange] false to disable orientation events
* @param {string} [options.script] url of script to be injected
* @param {boolean | object} [options.snap=false] use snap scrolling
* @param {string} [options.defaultDirection='ltr'] default text direction
* @param {boolean} [options.allowScriptedContent=false] enable running scripts in content
* @param {boolean} [options.allowPopups=false] enable opening popup in content
*/
var Rendition = class {
	constructor(book, options) {
		this.settings = extend(this.settings || {}, {
			width: null,
			height: null,
			ignoreClass: "",
			manager: "default",
			view: "iframe",
			flow: null,
			layout: null,
			spread: null,
			minSpreadWidth: 800,
			stylesheet: null,
			resizeOnOrientationChange: true,
			script: null,
			snap: false,
			defaultDirection: "ltr",
			allowScriptedContent: false,
			allowPopups: false
		});
		extend(this.settings, options);
		if (typeof this.settings.manager === "object") this.manager = this.settings.manager;
		this.book = book;
		/**
		* Adds Hook methods to the Rendition prototype
		* @member {object} hooks
		* @property {Hook} hooks.content
		* @memberof Rendition
		*/
		this.hooks = {};
		this.hooks.display = new Hook(this);
		this.hooks.serialize = new Hook(this);
		this.hooks.content = new Hook(this);
		this.hooks.unloaded = new Hook(this);
		this.hooks.layout = new Hook(this);
		this.hooks.render = new Hook(this);
		this.hooks.show = new Hook(this);
		this.hooks.content.register(this.handleLinks.bind(this));
		this.hooks.content.register(this.passEvents.bind(this));
		this.hooks.content.register(this.adjustImages.bind(this));
		this.book.spine.hooks.content.register(this.injectIdentifier.bind(this));
		if (this.settings.stylesheet) this.book.spine.hooks.content.register(this.injectStylesheet.bind(this));
		if (this.settings.script) this.book.spine.hooks.content.register(this.injectScript.bind(this));
		/**
		* @member {Themes} themes
		* @memberof Rendition
		*/
		this.themes = new Themes(this);
		/**
		* @member {Annotations} annotations
		* @memberof Rendition
		*/
		this.annotations = new Annotations(this);
		this.epubcfi = new EpubCFI();
		this.q = new Queue(this);
		/**
		* A Rendered Location Range
		* @typedef location
		* @type {Object}
		* @property {object} start
		* @property {string} start.index
		* @property {string} start.href
		* @property {object} start.displayed
		* @property {EpubCFI} start.cfi
		* @property {number} start.location
		* @property {number} start.percentage
		* @property {number} start.displayed.page
		* @property {number} start.displayed.total
		* @property {object} end
		* @property {string} end.index
		* @property {string} end.href
		* @property {object} end.displayed
		* @property {EpubCFI} end.cfi
		* @property {number} end.location
		* @property {number} end.percentage
		* @property {number} end.displayed.page
		* @property {number} end.displayed.total
		* @property {boolean} atStart
		* @property {boolean} atEnd
		* @memberof Rendition
		*/
		this.location = void 0;
		this.q.enqueue(this.book.opened);
		this.starting = new defer();
		/**
		* @member {promise} started returns after the rendition has started
		* @memberof Rendition
		*/
		this.started = this.starting.promise;
		this.q.enqueue(this.start);
	}
	/**
	* Set the manager function
	* @param {function} manager
	*/
	setManager(manager) {
		this.manager = manager;
	}
	/**
	* Require the manager from passed string, or as a class function
	* @param  {string|object} manager [description]
	* @return {method}
	*/
	requireManager(manager) {
		var viewManager;
		if (typeof manager === "string" && manager === "default") viewManager = DefaultViewManager;
		else if (typeof manager === "string" && manager === "continuous") viewManager = ContinuousViewManager;
		else viewManager = manager;
		return viewManager;
	}
	/**
	* Require the view from passed string, or as a class function
	* @param  {string|object} view
	* @return {view}
	*/
	requireView(view) {
		var View;
		if (typeof view == "string" && view === "iframe") View = IframeView;
		else View = view;
		return View;
	}
	/**
	* Start the rendering
	* @return {Promise} rendering has started
	*/
	start() {
		if (!this.settings.layout && (this.book.package.metadata.layout === "pre-paginated" || this.book.displayOptions.fixedLayout === "true")) this.settings.layout = "pre-paginated";
		switch (this.book.package.metadata.spread) {
			case "none":
				this.settings.spread = "none";
				break;
			case "both":
				this.settings.spread = true;
				break;
		}
		if (!this.manager) {
			this.ViewManager = this.requireManager(this.settings.manager);
			this.View = this.requireView(this.settings.view);
			this.manager = new this.ViewManager({
				view: this.View,
				queue: this.q,
				request: this.book.load.bind(this.book),
				settings: this.settings
			});
		}
		this.direction(this.book.package.metadata.direction || this.settings.defaultDirection);
		this.settings.globalLayoutProperties = this.determineLayoutProperties(this.book.package.metadata);
		this.flow(this.settings.globalLayoutProperties.flow);
		this.layout(this.settings.globalLayoutProperties);
		this.manager.on(EVENTS.MANAGERS.ADDED, this.afterDisplayed.bind(this));
		this.manager.on(EVENTS.MANAGERS.REMOVED, this.afterRemoved.bind(this));
		this.manager.on(EVENTS.MANAGERS.RESIZED, this.onResized.bind(this));
		this.manager.on(EVENTS.MANAGERS.ORIENTATION_CHANGE, this.onOrientationChange.bind(this));
		this.manager.on(EVENTS.MANAGERS.SCROLLED, this.reportLocation.bind(this));
		/**
		* Emit that rendering has started
		* @event started
		* @memberof Rendition
		*/
		this.emit(EVENTS.RENDITION.STARTED);
		this.starting.resolve();
	}
	/**
	* Call to attach the container to an element in the dom
	* Container must be attached before rendering can begin
	* @param  {element} element to attach to
	* @return {Promise}
	*/
	attachTo(element) {
		return this.q.enqueue(function() {
			this.manager.render(element, {
				"width": this.settings.width,
				"height": this.settings.height
			});
			/**
			* Emit that rendering has attached to an element
			* @event attached
			* @memberof Rendition
			*/
			this.emit(EVENTS.RENDITION.ATTACHED);
		}.bind(this));
	}
	/**
	* Display a point in the book
	* The request will be added to the rendering Queue,
	* so it will wait until book is opened, rendering started
	* and all other rendering tasks have finished to be called.
	* @param  {string} target Url or EpubCFI
	* @return {Promise}
	*/
	display(target) {
		if (this.displaying) this.displaying.resolve();
		return this.q.enqueue(this._display, target);
	}
	/**
	* Tells the manager what to display immediately
	* @private
	* @param  {string} target Url or EpubCFI
	* @return {Promise}
	*/
	_display(target) {
		if (!this.book) return;
		this.epubcfi.isCfiString(target);
		var displaying = new defer();
		var displayed = displaying.promise;
		var section;
		this.displaying = displaying;
		if (this.book.locations.length() && isFloat(target)) target = this.book.locations.cfiFromPercentage(parseFloat(target));
		section = this.book.spine.get(target);
		if (!section) {
			displaying.reject(/* @__PURE__ */ new Error("No Section Found"));
			return displayed;
		}
		this.manager.display(section, target).then(() => {
			displaying.resolve(section);
			this.displaying = void 0;
			/**
			* Emit that a section has been displayed
			* @event displayed
			* @param {Section} section
			* @memberof Rendition
			*/
			this.emit(EVENTS.RENDITION.DISPLAYED, section);
			this.reportLocation();
		}, (err) => {
			/**
			* Emit that has been an error displaying
			* @event displayError
			* @param {Section} section
			* @memberof Rendition
			*/
			this.emit(EVENTS.RENDITION.DISPLAY_ERROR, err);
		});
		return displayed;
	}
	/**
	* Report what section has been displayed
	* @private
	* @param  {*} view
	*/
	afterDisplayed(view) {
		view.on(EVENTS.VIEWS.MARK_CLICKED, (cfiRange, data) => this.triggerMarkEvent(cfiRange, data, view.contents));
		this.hooks.render.trigger(view, this).then(() => {
			if (view.contents) this.hooks.content.trigger(view.contents, this).then(() => {
				/**
				* Emit that a section has been rendered
				* @event rendered
				* @param {Section} section
				* @param {View} view
				* @memberof Rendition
				*/
				this.emit(EVENTS.RENDITION.RENDERED, view.section, view);
			});
			else this.emit(EVENTS.RENDITION.RENDERED, view.section, view);
		});
	}
	/**
	* Report what has been removed
	* @private
	* @param  {*} view
	*/
	afterRemoved(view) {
		this.hooks.unloaded.trigger(view, this).then(() => {
			/**
			* Emit that a section has been removed
			* @event removed
			* @param {Section} section
			* @param {View} view
			* @memberof Rendition
			*/
			this.emit(EVENTS.RENDITION.REMOVED, view.section, view);
		});
	}
	/**
	* Report resize events and display the last seen location
	* @private
	*/
	onResized(size, epubcfi) {
		/**
		* Emit that the rendition has been resized
		* @event resized
		* @param {number} width
		* @param {height} height
		* @param {string} epubcfi (optional)
		* @memberof Rendition
		*/
		this.emit(EVENTS.RENDITION.RESIZED, {
			width: size.width,
			height: size.height
		}, epubcfi);
		if (this.location && this.location.start) this.display(epubcfi || this.location.start.cfi);
	}
	/**
	* Report orientation events and display the last seen location
	* @private
	*/
	onOrientationChange(orientation) {
		/**
		* Emit that the rendition has been rotated
		* @event orientationchange
		* @param {string} orientation
		* @memberof Rendition
		*/
		this.emit(EVENTS.RENDITION.ORIENTATION_CHANGE, orientation);
	}
	/**
	* Move the Rendition to a specific offset
	* Usually you would be better off calling display()
	* @param {object} offset
	*/
	moveTo(offset) {
		this.manager.moveTo(offset);
	}
	/**
	* Trigger a resize of the views
	* @param {number} [width]
	* @param {number} [height]
	* @param {string} [epubcfi] (optional)
	*/
	resize(width, height, epubcfi) {
		if (width) this.settings.width = width;
		if (height) this.settings.height = height;
		this.manager.resize(width, height, epubcfi);
	}
	/**
	* Clear all rendered views
	*/
	clear() {
		this.manager.clear();
	}
	/**
	* Go to the next "page" in the rendition
	* @return {Promise}
	*/
	next() {
		return this.q.enqueue(this.manager.next.bind(this.manager)).then(this.reportLocation.bind(this));
	}
	/**
	* Go to the previous "page" in the rendition
	* @return {Promise}
	*/
	prev() {
		return this.q.enqueue(this.manager.prev.bind(this.manager)).then(this.reportLocation.bind(this));
	}
	/**
	* Determine the Layout properties from metadata and settings
	* @private
	* @param  {object} metadata
	* @return {object} properties
	*/
	determineLayoutProperties(metadata) {
		var properties;
		var layout = this.settings.layout || metadata.layout || "reflowable";
		var spread = this.settings.spread || metadata.spread || "auto";
		var orientation = this.settings.orientation || metadata.orientation || "auto";
		var flow = this.settings.flow || metadata.flow || "auto";
		var viewport = metadata.viewport || "";
		var minSpreadWidth = this.settings.minSpreadWidth || metadata.minSpreadWidth || 800;
		var direction = this.settings.direction || metadata.direction || "ltr";
		if ((this.settings.width === 0 || this.settings.width > 0) && (this.settings.height === 0 || this.settings.height > 0)) {}
		properties = {
			layout,
			spread,
			orientation,
			flow,
			viewport,
			minSpreadWidth,
			direction
		};
		return properties;
	}
	/**
	* Adjust the flow of the rendition to paginated or scrolled
	* (scrolled-continuous vs scrolled-doc are handled by different view managers)
	* @param  {string} flow
	*/
	flow(flow) {
		var _flow = flow;
		if (flow === "scrolled" || flow === "scrolled-doc" || flow === "scrolled-continuous") _flow = "scrolled";
		if (flow === "auto" || flow === "paginated") _flow = "paginated";
		this.settings.flow = flow;
		if (this._layout) this._layout.flow(_flow);
		if (this.manager && this._layout) this.manager.applyLayout(this._layout);
		if (this.manager) this.manager.updateFlow(_flow);
		if (this.manager && this.manager.isRendered() && this.location) {
			this.manager.clear();
			this.display(this.location.start.cfi);
		}
	}
	/**
	* Adjust the layout of the rendition to reflowable or pre-paginated
	* @param  {object} settings
	*/
	layout(settings) {
		if (settings) {
			this._layout = new Layout(settings);
			this._layout.spread(settings.spread, this.settings.minSpreadWidth);
			this._layout.on(EVENTS.LAYOUT.UPDATED, (props, changed) => {
				this.emit(EVENTS.RENDITION.LAYOUT, props, changed);
			});
		}
		if (this.manager && this._layout) this.manager.applyLayout(this._layout);
		return this._layout;
	}
	/**
	* Adjust if the rendition uses spreads
	* @param  {string} spread none | auto (TODO: implement landscape, portrait, both)
	* @param  {int} [min] min width to use spreads at
	*/
	spread(spread, min) {
		this.settings.spread = spread;
		if (min) this.settings.minSpreadWidth = min;
		if (this._layout) this._layout.spread(spread, min);
		if (this.manager && this.manager.isRendered()) this.manager.updateLayout();
	}
	/**
	* Adjust the direction of the rendition
	* @param  {string} dir
	*/
	direction(dir) {
		this.settings.direction = dir || "ltr";
		if (this.manager) this.manager.direction(this.settings.direction);
		if (this.manager && this.manager.isRendered() && this.location) {
			this.manager.clear();
			this.display(this.location.start.cfi);
		}
	}
	/**
	* Report the current location
	* @fires relocated
	* @fires locationChanged
	*/
	reportLocation() {
		return this.q.enqueue(function reportedLocation() {
			requestAnimationFrame(function reportedLocationAfterRAF() {
				var location = this.manager.currentLocation();
				if (location && location.then && typeof location.then === "function") location.then(function(result) {
					let located = this.located(result);
					if (!located || !located.start || !located.end) return;
					this.location = located;
					this.emit(EVENTS.RENDITION.LOCATION_CHANGED, {
						index: this.location.start.index,
						href: this.location.start.href,
						start: this.location.start.cfi,
						end: this.location.end.cfi,
						percentage: this.location.start.percentage
					});
					this.emit(EVENTS.RENDITION.RELOCATED, this.location);
				}.bind(this));
				else if (location) {
					let located = this.located(location);
					if (!located || !located.start || !located.end) return;
					this.location = located;
					/**
					* @event locationChanged
					* @deprecated
					* @type {object}
					* @property {number} index
					* @property {string} href
					* @property {EpubCFI} start
					* @property {EpubCFI} end
					* @property {number} percentage
					* @memberof Rendition
					*/
					this.emit(EVENTS.RENDITION.LOCATION_CHANGED, {
						index: this.location.start.index,
						href: this.location.start.href,
						start: this.location.start.cfi,
						end: this.location.end.cfi,
						percentage: this.location.start.percentage
					});
					/**
					* @event relocated
					* @type {displayedLocation}
					* @memberof Rendition
					*/
					this.emit(EVENTS.RENDITION.RELOCATED, this.location);
				}
			}.bind(this));
		}.bind(this));
	}
	/**
	* Get the Current Location object
	* @return {displayedLocation | promise} location (may be a promise)
	*/
	currentLocation() {
		var location = this.manager.currentLocation();
		if (location && location.then && typeof location.then === "function") location.then(function(result) {
			return this.located(result);
		}.bind(this));
		else if (location) return this.located(location);
	}
	/**
	* Creates a Rendition#locationRange from location
	* passed by the Manager
	* @returns {displayedLocation}
	* @private
	*/
	located(location) {
		if (!location.length) return {};
		let start = location[0];
		let end = location[location.length - 1];
		let located = {
			start: {
				index: start.index,
				href: start.href,
				cfi: start.mapping.start,
				displayed: {
					page: start.pages[0] || 1,
					total: start.totalPages
				}
			},
			end: {
				index: end.index,
				href: end.href,
				cfi: end.mapping.end,
				displayed: {
					page: end.pages[end.pages.length - 1] || 1,
					total: end.totalPages
				}
			}
		};
		let locationStart = this.book.locations.locationFromCfi(start.mapping.start);
		let locationEnd = this.book.locations.locationFromCfi(end.mapping.end);
		if (locationStart != null) {
			located.start.location = locationStart;
			located.start.percentage = this.book.locations.percentageFromLocation(locationStart);
		}
		if (locationEnd != null) {
			located.end.location = locationEnd;
			located.end.percentage = this.book.locations.percentageFromLocation(locationEnd);
		}
		let pageStart = this.book.pageList.pageFromCfi(start.mapping.start);
		let pageEnd = this.book.pageList.pageFromCfi(end.mapping.end);
		if (pageStart != -1) located.start.page = pageStart;
		if (pageEnd != -1) located.end.page = pageEnd;
		if (end.index === this.book.spine.last().index && located.end.displayed.page >= located.end.displayed.total) located.atEnd = true;
		if (start.index === this.book.spine.first().index && located.start.displayed.page === 1) located.atStart = true;
		return located;
	}
	/**
	* Remove and Clean Up the Rendition
	*/
	destroy() {
		this.manager && this.manager.destroy();
		this.book = void 0;
	}
	/**
	* Pass the events from a view's Contents
	* @private
	* @param  {Contents} view contents
	*/
	passEvents(contents) {
		DOM_EVENTS.forEach((e) => {
			contents.on(e, (ev) => this.triggerViewEvent(ev, contents));
		});
		contents.on(EVENTS.CONTENTS.SELECTED, (e) => this.triggerSelectedEvent(e, contents));
	}
	/**
	* Emit events passed by a view
	* @private
	* @param  {event} e
	*/
	triggerViewEvent(e, contents) {
		this.emit(e.type, e, contents);
	}
	/**
	* Emit a selection event's CFI Range passed from a a view
	* @private
	* @param  {string} cfirange
	*/
	triggerSelectedEvent(cfirange, contents) {
		/**
		* Emit that a text selection has occurred
		* @event selected
		* @param {string} cfirange
		* @param {Contents} contents
		* @memberof Rendition
		*/
		this.emit(EVENTS.RENDITION.SELECTED, cfirange, contents);
	}
	/**
	* Emit a markClicked event with the cfiRange and data from a mark
	* @private
	* @param  {EpubCFI} cfirange
	*/
	triggerMarkEvent(cfiRange, data, contents) {
		/**
		* Emit that a mark was clicked
		* @event markClicked
		* @param {EpubCFI} cfirange
		* @param {object} data
		* @param {Contents} contents
		* @memberof Rendition
		*/
		this.emit(EVENTS.RENDITION.MARK_CLICKED, cfiRange, data, contents);
	}
	/**
	* Get a Range from a Visible CFI
	* @param  {string} cfi EpubCfi String
	* @param  {string} ignoreClass
	* @return {range}
	*/
	getRange(cfi, ignoreClass) {
		var _cfi = new EpubCFI(cfi);
		var found = this.manager.visible().filter(function(view) {
			if (_cfi.spinePos === view.index) return true;
		});
		if (found.length) return found[0].contents.range(_cfi, ignoreClass);
	}
	/**
	* Hook to adjust images to fit in columns
	* @param  {Contents} contents
	* @private
	*/
	adjustImages(contents) {
		if (this._layout.name === "pre-paginated") return new Promise(function(resolve) {
			resolve();
		});
		let computed = contents.window.getComputedStyle(contents.content, null);
		let height = (contents.content.offsetHeight - (parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom))) * .95;
		let horizontalPadding = parseFloat(computed.paddingLeft) + parseFloat(computed.paddingRight);
		contents.addStylesheetRules({
			"img": {
				"max-width": (this._layout.columnWidth ? this._layout.columnWidth - horizontalPadding + "px" : "100%") + "!important",
				"max-height": height + "px!important",
				"object-fit": "contain",
				"page-break-inside": "avoid",
				"break-inside": "avoid",
				"box-sizing": "border-box"
			},
			"svg": {
				"max-width": (this._layout.columnWidth ? this._layout.columnWidth - horizontalPadding + "px" : "100%") + "!important",
				"max-height": height + "px!important",
				"page-break-inside": "avoid",
				"break-inside": "avoid"
			}
		});
		return new Promise(function(resolve, reject) {
			setTimeout(function() {
				resolve();
			}, 1);
		});
	}
	/**
	* Get the Contents object of each rendered view
	* @returns {Contents[]}
	*/
	getContents() {
		return this.manager ? this.manager.getContents() : [];
	}
	/**
	* Get the views member from the manager
	* @returns {Views}
	*/
	views() {
		return (this.manager ? this.manager.views : void 0) || [];
	}
	/**
	* Hook to handle link clicks in rendered content
	* @param  {Contents} contents
	* @private
	*/
	handleLinks(contents) {
		if (contents) contents.on(EVENTS.CONTENTS.LINK_CLICKED, (href) => {
			let relative = this.book.path.relative(href);
			this.display(relative);
		});
	}
	/**
	* Hook to handle injecting stylesheet before
	* a Section is serialized
	* @param  {document} doc
	* @param  {Section} section
	* @private
	*/
	injectStylesheet(doc, section) {
		let style = doc.createElement("link");
		style.setAttribute("type", "text/css");
		style.setAttribute("rel", "stylesheet");
		style.setAttribute("href", this.settings.stylesheet);
		doc.getElementsByTagName("head")[0].appendChild(style);
	}
	/**
	* Hook to handle injecting scripts before
	* a Section is serialized
	* @param  {document} doc
	* @param  {Section} section
	* @private
	*/
	injectScript(doc, section) {
		let script = doc.createElement("script");
		script.setAttribute("type", "text/javascript");
		script.setAttribute("src", this.settings.script);
		script.textContent = " ";
		doc.getElementsByTagName("head")[0].appendChild(script);
	}
	/**
	* Hook to handle the document identifier before
	* a Section is serialized
	* @param  {document} doc
	* @param  {Section} section
	* @private
	*/
	injectIdentifier(doc, section) {
		let ident = this.book.packaging.metadata.identifier;
		let meta = doc.createElement("meta");
		meta.setAttribute("name", "dc.relation.ispartof");
		if (ident) meta.setAttribute("content", ident);
		doc.getElementsByTagName("head")[0].appendChild(meta);
	}
};
(0, import_event_emitter.default)(Rendition.prototype);
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/
//#endregion
//#region node_modules/epubjs/src/archive.js
var import_jszip = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(f) {
		if (typeof exports === "object" && typeof module !== "undefined") module.exports = f();
		else if (typeof define === "function" && define.amd) define([], f);
		else {
			var g;
			if (typeof window !== "undefined") g = window;
			else if (typeof global !== "undefined") g = global;
			else if (typeof self !== "undefined") g = self;
			else g = this;
			g.JSZip = f();
		}
	})(function() {
		return (function e(t, n, r) {
			function s(o, u) {
				if (!n[o]) {
					if (!t[o]) {
						var a = typeof __require == "function" && __require;
						if (!u && a) return a(o, !0);
						if (i) return i(o, !0);
						var f = /* @__PURE__ */ new Error("Cannot find module '" + o + "'");
						throw f.code = "MODULE_NOT_FOUND", f;
					}
					var l = n[o] = { exports: {} };
					t[o][0].call(l.exports, function(e) {
						var n = t[o][1][e];
						return s(n ? n : e);
					}, l, l.exports, e, t, n, r);
				}
				return n[o].exports;
			}
			var i = typeof __require == "function" && __require;
			for (var o = 0; o < r.length; o++) s(r[o]);
			return s;
		})({
			1: [function(require, module$5, exports$5) {
				"use strict";
				var utils = require("./utils");
				var support = require("./support");
				var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
				exports$5.encode = function(input) {
					var output = [];
					var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
					var i = 0, len = input.length, remainingBytes = len;
					var isArray = utils.getTypeOf(input) !== "string";
					while (i < input.length) {
						remainingBytes = len - i;
						if (!isArray) {
							chr1 = input.charCodeAt(i++);
							chr2 = i < len ? input.charCodeAt(i++) : 0;
							chr3 = i < len ? input.charCodeAt(i++) : 0;
						} else {
							chr1 = input[i++];
							chr2 = i < len ? input[i++] : 0;
							chr3 = i < len ? input[i++] : 0;
						}
						enc1 = chr1 >> 2;
						enc2 = (chr1 & 3) << 4 | chr2 >> 4;
						enc3 = remainingBytes > 1 ? (chr2 & 15) << 2 | chr3 >> 6 : 64;
						enc4 = remainingBytes > 2 ? chr3 & 63 : 64;
						output.push(_keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4));
					}
					return output.join("");
				};
				exports$5.decode = function(input) {
					var chr1, chr2, chr3;
					var enc1, enc2, enc3, enc4;
					var i = 0, resultIndex = 0;
					var dataUrlPrefix = "data:";
					if (input.substr(0, dataUrlPrefix.length) === dataUrlPrefix) throw new Error("Invalid base64 input, it looks like a data url.");
					input = input.replace(/[^A-Za-z0-9+/=]/g, "");
					var totalLength = input.length * 3 / 4;
					if (input.charAt(input.length - 1) === _keyStr.charAt(64)) totalLength--;
					if (input.charAt(input.length - 2) === _keyStr.charAt(64)) totalLength--;
					if (totalLength % 1 !== 0) throw new Error("Invalid base64 input, bad content length.");
					var output;
					if (support.uint8array) output = new Uint8Array(totalLength | 0);
					else output = new Array(totalLength | 0);
					while (i < input.length) {
						enc1 = _keyStr.indexOf(input.charAt(i++));
						enc2 = _keyStr.indexOf(input.charAt(i++));
						enc3 = _keyStr.indexOf(input.charAt(i++));
						enc4 = _keyStr.indexOf(input.charAt(i++));
						chr1 = enc1 << 2 | enc2 >> 4;
						chr2 = (enc2 & 15) << 4 | enc3 >> 2;
						chr3 = (enc3 & 3) << 6 | enc4;
						output[resultIndex++] = chr1;
						if (enc3 !== 64) output[resultIndex++] = chr2;
						if (enc4 !== 64) output[resultIndex++] = chr3;
					}
					return output;
				};
			}, {
				"./support": 30,
				"./utils": 32
			}],
			2: [function(require, module$6, exports$6) {
				"use strict";
				var external = require("./external");
				var DataWorker = require("./stream/DataWorker");
				var Crc32Probe = require("./stream/Crc32Probe");
				var DataLengthProbe = require("./stream/DataLengthProbe");
				/**
				* Represent a compressed object, with everything needed to decompress it.
				* @constructor
				* @param {number} compressedSize the size of the data compressed.
				* @param {number} uncompressedSize the size of the data after decompression.
				* @param {number} crc32 the crc32 of the decompressed file.
				* @param {object} compression the type of compression, see lib/compressions.js.
				* @param {String|ArrayBuffer|Uint8Array|Buffer} data the compressed data.
				*/
				function CompressedObject(compressedSize, uncompressedSize, crc32, compression, data) {
					this.compressedSize = compressedSize;
					this.uncompressedSize = uncompressedSize;
					this.crc32 = crc32;
					this.compression = compression;
					this.compressedContent = data;
				}
				CompressedObject.prototype = {
					/**
					* Create a worker to get the uncompressed content.
					* @return {GenericWorker} the worker.
					*/
					getContentWorker: function() {
						var worker = new DataWorker(external.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new DataLengthProbe("data_length"));
						var that = this;
						worker.on("end", function() {
							if (this.streamInfo["data_length"] !== that.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
						});
						return worker;
					},
					/**
					* Create a worker to get the compressed content.
					* @return {GenericWorker} the worker.
					*/
					getCompressedWorker: function() {
						return new DataWorker(external.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
					}
				};
				/**
				* Chain the given worker with other workers to compress the content with the
				* given compression.
				* @param {GenericWorker} uncompressedWorker the worker to pipe.
				* @param {Object} compression the compression object.
				* @param {Object} compressionOptions the options to use when compressing.
				* @return {GenericWorker} the new worker compressing the content.
				*/
				CompressedObject.createWorkerFrom = function(uncompressedWorker, compression, compressionOptions) {
					return uncompressedWorker.pipe(new Crc32Probe()).pipe(new DataLengthProbe("uncompressedSize")).pipe(compression.compressWorker(compressionOptions)).pipe(new DataLengthProbe("compressedSize")).withStreamInfo("compression", compression);
				};
				module$6.exports = CompressedObject;
			}, {
				"./external": 6,
				"./stream/Crc32Probe": 25,
				"./stream/DataLengthProbe": 26,
				"./stream/DataWorker": 27
			}],
			3: [function(require, module$7, exports$7) {
				"use strict";
				var GenericWorker = require("./stream/GenericWorker");
				exports$7.STORE = {
					magic: "\0\0",
					compressWorker: function() {
						return new GenericWorker("STORE compression");
					},
					uncompressWorker: function() {
						return new GenericWorker("STORE decompression");
					}
				};
				exports$7.DEFLATE = require("./flate");
			}, {
				"./flate": 7,
				"./stream/GenericWorker": 28
			}],
			4: [function(require, module$8, exports$8) {
				"use strict";
				var utils = require("./utils");
				/**
				* The following functions come from pako, from pako/lib/zlib/crc32.js
				* released under the MIT license, see pako https://github.com/nodeca/pako/
				*/
				function makeTable() {
					var c, table = [];
					for (var n = 0; n < 256; n++) {
						c = n;
						for (var k = 0; k < 8; k++) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
						table[n] = c;
					}
					return table;
				}
				var crcTable = makeTable();
				function crc32(crc, buf, len, pos) {
					var t = crcTable, end = pos + len;
					crc = crc ^ -1;
					for (var i = pos; i < end; i++) crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
					return crc ^ -1;
				}
				/**
				* Compute the crc32 of a string.
				* This is almost the same as the function crc32, but for strings. Using the
				* same function for the two use cases leads to horrible performances.
				* @param {Number} crc the starting value of the crc.
				* @param {String} str the string to use.
				* @param {Number} len the length of the string.
				* @param {Number} pos the starting position for the crc32 computation.
				* @return {Number} the computed crc32.
				*/
				function crc32str(crc, str, len, pos) {
					var t = crcTable, end = pos + len;
					crc = crc ^ -1;
					for (var i = pos; i < end; i++) crc = crc >>> 8 ^ t[(crc ^ str.charCodeAt(i)) & 255];
					return crc ^ -1;
				}
				module$8.exports = function crc32wrapper(input, crc) {
					if (typeof input === "undefined" || !input.length) return 0;
					if (utils.getTypeOf(input) !== "string") return crc32(crc | 0, input, input.length, 0);
					else return crc32str(crc | 0, input, input.length, 0);
				};
			}, { "./utils": 32 }],
			5: [function(require, module$9, exports$9) {
				"use strict";
				exports$9.base64 = false;
				exports$9.binary = false;
				exports$9.dir = false;
				exports$9.createFolders = true;
				exports$9.date = null;
				exports$9.compression = null;
				exports$9.compressionOptions = null;
				exports$9.comment = null;
				exports$9.unixPermissions = null;
				exports$9.dosPermissions = null;
			}, {}],
			6: [function(require, module$10, exports$10) {
				"use strict";
				var ES6Promise = null;
				if (typeof Promise !== "undefined") ES6Promise = Promise;
				else ES6Promise = require("lie");
				/**
				* Let the user use/change some implementations.
				*/
				module$10.exports = { Promise: ES6Promise };
			}, { "lie": 37 }],
			7: [function(require, module$11, exports$11) {
				"use strict";
				var USE_TYPEDARRAY = typeof Uint8Array !== "undefined" && typeof Uint16Array !== "undefined" && typeof Uint32Array !== "undefined";
				var pako = require("pako");
				var utils = require("./utils");
				var GenericWorker = require("./stream/GenericWorker");
				var ARRAY_TYPE = USE_TYPEDARRAY ? "uint8array" : "array";
				exports$11.magic = "\b\0";
				/**
				* Create a worker that uses pako to inflate/deflate.
				* @constructor
				* @param {String} action the name of the pako function to call : either "Deflate" or "Inflate".
				* @param {Object} options the options to use when (de)compressing.
				*/
				function FlateWorker(action, options) {
					GenericWorker.call(this, "FlateWorker/" + action);
					this._pako = null;
					this._pakoAction = action;
					this._pakoOptions = options;
					this.meta = {};
				}
				utils.inherits(FlateWorker, GenericWorker);
				/**
				* @see GenericWorker.processChunk
				*/
				FlateWorker.prototype.processChunk = function(chunk) {
					this.meta = chunk.meta;
					if (this._pako === null) this._createPako();
					this._pako.push(utils.transformTo(ARRAY_TYPE, chunk.data), false);
				};
				/**
				* @see GenericWorker.flush
				*/
				FlateWorker.prototype.flush = function() {
					GenericWorker.prototype.flush.call(this);
					if (this._pako === null) this._createPako();
					this._pako.push([], true);
				};
				/**
				* @see GenericWorker.cleanUp
				*/
				FlateWorker.prototype.cleanUp = function() {
					GenericWorker.prototype.cleanUp.call(this);
					this._pako = null;
				};
				/**
				* Create the _pako object.
				* TODO: lazy-loading this object isn't the best solution but it's the
				* quickest. The best solution is to lazy-load the worker list. See also the
				* issue #446.
				*/
				FlateWorker.prototype._createPako = function() {
					this._pako = new pako[this._pakoAction]({
						raw: true,
						level: this._pakoOptions.level || -1
					});
					var self = this;
					this._pako.onData = function(data) {
						self.push({
							data,
							meta: self.meta
						});
					};
				};
				exports$11.compressWorker = function(compressionOptions) {
					return new FlateWorker("Deflate", compressionOptions);
				};
				exports$11.uncompressWorker = function() {
					return new FlateWorker("Inflate", {});
				};
			}, {
				"./stream/GenericWorker": 28,
				"./utils": 32,
				"pako": 38
			}],
			8: [function(require, module$12, exports$12) {
				"use strict";
				var utils = require("../utils");
				var GenericWorker = require("../stream/GenericWorker");
				var utf8 = require("../utf8");
				var crc32 = require("../crc32");
				var signature = require("../signature");
				/**
				* Transform an integer into a string in hexadecimal.
				* @private
				* @param {number} dec the number to convert.
				* @param {number} bytes the number of bytes to generate.
				* @returns {string} the result.
				*/
				var decToHex = function(dec, bytes) {
					var hex = "", i;
					for (i = 0; i < bytes; i++) {
						hex += String.fromCharCode(dec & 255);
						dec = dec >>> 8;
					}
					return hex;
				};
				/**
				* Generate the UNIX part of the external file attributes.
				* @param {Object} unixPermissions the unix permissions or null.
				* @param {Boolean} isDir true if the entry is a directory, false otherwise.
				* @return {Number} a 32 bit integer.
				*
				* adapted from http://unix.stackexchange.com/questions/14705/the-zip-formats-external-file-attribute :
				*
				* TTTTsstrwxrwxrwx0000000000ADVSHR
				* ^^^^____________________________ file type, see zipinfo.c (UNX_*)
				*     ^^^_________________________ setuid, setgid, sticky
				*        ^^^^^^^^^________________ permissions
				*                 ^^^^^^^^^^______ not used ?
				*                           ^^^^^^ DOS attribute bits : Archive, Directory, Volume label, System file, Hidden, Read only
				*/
				var generateUnixExternalFileAttr = function(unixPermissions, isDir) {
					var result = unixPermissions;
					if (!unixPermissions) result = isDir ? 16893 : 33204;
					return (result & 65535) << 16;
				};
				/**
				* Generate the DOS part of the external file attributes.
				* @param {Object} dosPermissions the dos permissions or null.
				* @param {Boolean} isDir true if the entry is a directory, false otherwise.
				* @return {Number} a 32 bit integer.
				*
				* Bit 0     Read-Only
				* Bit 1     Hidden
				* Bit 2     System
				* Bit 3     Volume Label
				* Bit 4     Directory
				* Bit 5     Archive
				*/
				var generateDosExternalFileAttr = function(dosPermissions) {
					return (dosPermissions || 0) & 63;
				};
				/**
				* Generate the various parts used in the construction of the final zip file.
				* @param {Object} streamInfo the hash with information about the compressed file.
				* @param {Boolean} streamedContent is the content streamed ?
				* @param {Boolean} streamingEnded is the stream finished ?
				* @param {number} offset the current offset from the start of the zip file.
				* @param {String} platform let's pretend we are this platform (change platform dependents fields)
				* @param {Function} encodeFileName the function to encode the file name / comment.
				* @return {Object} the zip parts.
				*/
				var generateZipParts = function(streamInfo, streamedContent, streamingEnded, offset, platform, encodeFileName) {
					var file = streamInfo["file"], compression = streamInfo["compression"], useCustomEncoding = encodeFileName !== utf8.utf8encode, encodedFileName = utils.transformTo("string", encodeFileName(file.name)), utfEncodedFileName = utils.transformTo("string", utf8.utf8encode(file.name)), comment = file.comment, encodedComment = utils.transformTo("string", encodeFileName(comment)), utfEncodedComment = utils.transformTo("string", utf8.utf8encode(comment)), useUTF8ForFileName = utfEncodedFileName.length !== file.name.length, useUTF8ForComment = utfEncodedComment.length !== comment.length, dosTime, dosDate, extraFields = "", unicodePathExtraField = "", unicodeCommentExtraField = "", dir = file.dir, date = file.date;
					var dataInfo = {
						crc32: 0,
						compressedSize: 0,
						uncompressedSize: 0
					};
					if (!streamedContent || streamingEnded) {
						dataInfo.crc32 = streamInfo["crc32"];
						dataInfo.compressedSize = streamInfo["compressedSize"];
						dataInfo.uncompressedSize = streamInfo["uncompressedSize"];
					}
					var bitflag = 0;
					if (streamedContent) bitflag |= 8;
					if (!useCustomEncoding && (useUTF8ForFileName || useUTF8ForComment)) bitflag |= 2048;
					var extFileAttr = 0;
					var versionMadeBy = 0;
					if (dir) extFileAttr |= 16;
					if (platform === "UNIX") {
						versionMadeBy = 798;
						extFileAttr |= generateUnixExternalFileAttr(file.unixPermissions, dir);
					} else {
						versionMadeBy = 20;
						extFileAttr |= generateDosExternalFileAttr(file.dosPermissions, dir);
					}
					dosTime = date.getUTCHours();
					dosTime = dosTime << 6;
					dosTime = dosTime | date.getUTCMinutes();
					dosTime = dosTime << 5;
					dosTime = dosTime | date.getUTCSeconds() / 2;
					dosDate = date.getUTCFullYear() - 1980;
					dosDate = dosDate << 4;
					dosDate = dosDate | date.getUTCMonth() + 1;
					dosDate = dosDate << 5;
					dosDate = dosDate | date.getUTCDate();
					if (useUTF8ForFileName) {
						unicodePathExtraField = decToHex(1, 1) + decToHex(crc32(encodedFileName), 4) + utfEncodedFileName;
						extraFields += "up" + decToHex(unicodePathExtraField.length, 2) + unicodePathExtraField;
					}
					if (useUTF8ForComment) {
						unicodeCommentExtraField = decToHex(1, 1) + decToHex(crc32(encodedComment), 4) + utfEncodedComment;
						extraFields += "uc" + decToHex(unicodeCommentExtraField.length, 2) + unicodeCommentExtraField;
					}
					var header = "";
					header += "\n\0";
					header += decToHex(bitflag, 2);
					header += compression.magic;
					header += decToHex(dosTime, 2);
					header += decToHex(dosDate, 2);
					header += decToHex(dataInfo.crc32, 4);
					header += decToHex(dataInfo.compressedSize, 4);
					header += decToHex(dataInfo.uncompressedSize, 4);
					header += decToHex(encodedFileName.length, 2);
					header += decToHex(extraFields.length, 2);
					return {
						fileRecord: signature.LOCAL_FILE_HEADER + header + encodedFileName + extraFields,
						dirRecord: signature.CENTRAL_FILE_HEADER + decToHex(versionMadeBy, 2) + header + decToHex(encodedComment.length, 2) + "\0\0\0\0" + decToHex(extFileAttr, 4) + decToHex(offset, 4) + encodedFileName + extraFields + encodedComment
					};
				};
				/**
				* Generate the EOCD record.
				* @param {Number} entriesCount the number of entries in the zip file.
				* @param {Number} centralDirLength the length (in bytes) of the central dir.
				* @param {Number} localDirLength the length (in bytes) of the local dir.
				* @param {String} comment the zip file comment as a binary string.
				* @param {Function} encodeFileName the function to encode the comment.
				* @return {String} the EOCD record.
				*/
				var generateCentralDirectoryEnd = function(entriesCount, centralDirLength, localDirLength, comment, encodeFileName) {
					var dirEnd = "";
					var encodedComment = utils.transformTo("string", encodeFileName(comment));
					dirEnd = signature.CENTRAL_DIRECTORY_END + "\0\0\0\0" + decToHex(entriesCount, 2) + decToHex(entriesCount, 2) + decToHex(centralDirLength, 4) + decToHex(localDirLength, 4) + decToHex(encodedComment.length, 2) + encodedComment;
					return dirEnd;
				};
				/**
				* Generate data descriptors for a file entry.
				* @param {Object} streamInfo the hash generated by a worker, containing information
				* on the file entry.
				* @return {String} the data descriptors.
				*/
				var generateDataDescriptors = function(streamInfo) {
					var descriptor = "";
					descriptor = signature.DATA_DESCRIPTOR + decToHex(streamInfo["crc32"], 4) + decToHex(streamInfo["compressedSize"], 4) + decToHex(streamInfo["uncompressedSize"], 4);
					return descriptor;
				};
				/**
				* A worker to concatenate other workers to create a zip file.
				* @param {Boolean} streamFiles `true` to stream the content of the files,
				* `false` to accumulate it.
				* @param {String} comment the comment to use.
				* @param {String} platform the platform to use, "UNIX" or "DOS".
				* @param {Function} encodeFileName the function to encode file names and comments.
				*/
				function ZipFileWorker(streamFiles, comment, platform, encodeFileName) {
					GenericWorker.call(this, "ZipFileWorker");
					this.bytesWritten = 0;
					this.zipComment = comment;
					this.zipPlatform = platform;
					this.encodeFileName = encodeFileName;
					this.streamFiles = streamFiles;
					this.accumulate = false;
					this.contentBuffer = [];
					this.dirRecords = [];
					this.currentSourceOffset = 0;
					this.entriesCount = 0;
					this.currentFile = null;
					this._sources = [];
				}
				utils.inherits(ZipFileWorker, GenericWorker);
				/**
				* @see GenericWorker.push
				*/
				ZipFileWorker.prototype.push = function(chunk) {
					var currentFilePercent = chunk.meta.percent || 0;
					var entriesCount = this.entriesCount;
					var remainingFiles = this._sources.length;
					if (this.accumulate) this.contentBuffer.push(chunk);
					else {
						this.bytesWritten += chunk.data.length;
						GenericWorker.prototype.push.call(this, {
							data: chunk.data,
							meta: {
								currentFile: this.currentFile,
								percent: entriesCount ? (currentFilePercent + 100 * (entriesCount - remainingFiles - 1)) / entriesCount : 100
							}
						});
					}
				};
				/**
				* The worker started a new source (an other worker).
				* @param {Object} streamInfo the streamInfo object from the new source.
				*/
				ZipFileWorker.prototype.openedSource = function(streamInfo) {
					this.currentSourceOffset = this.bytesWritten;
					this.currentFile = streamInfo["file"].name;
					var streamedContent = this.streamFiles && !streamInfo["file"].dir;
					if (streamedContent) {
						var record = generateZipParts(streamInfo, streamedContent, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
						this.push({
							data: record.fileRecord,
							meta: { percent: 0 }
						});
					} else this.accumulate = true;
				};
				/**
				* The worker finished a source (an other worker).
				* @param {Object} streamInfo the streamInfo object from the finished source.
				*/
				ZipFileWorker.prototype.closedSource = function(streamInfo) {
					this.accumulate = false;
					var streamedContent = this.streamFiles && !streamInfo["file"].dir;
					var record = generateZipParts(streamInfo, streamedContent, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
					this.dirRecords.push(record.dirRecord);
					if (streamedContent) this.push({
						data: generateDataDescriptors(streamInfo),
						meta: { percent: 100 }
					});
					else {
						this.push({
							data: record.fileRecord,
							meta: { percent: 0 }
						});
						while (this.contentBuffer.length) this.push(this.contentBuffer.shift());
					}
					this.currentFile = null;
				};
				/**
				* @see GenericWorker.flush
				*/
				ZipFileWorker.prototype.flush = function() {
					var localDirLength = this.bytesWritten;
					for (var i = 0; i < this.dirRecords.length; i++) this.push({
						data: this.dirRecords[i],
						meta: { percent: 100 }
					});
					var centralDirLength = this.bytesWritten - localDirLength;
					var dirEnd = generateCentralDirectoryEnd(this.dirRecords.length, centralDirLength, localDirLength, this.zipComment, this.encodeFileName);
					this.push({
						data: dirEnd,
						meta: { percent: 100 }
					});
				};
				/**
				* Prepare the next source to be read.
				*/
				ZipFileWorker.prototype.prepareNextSource = function() {
					this.previous = this._sources.shift();
					this.openedSource(this.previous.streamInfo);
					if (this.isPaused) this.previous.pause();
					else this.previous.resume();
				};
				/**
				* @see GenericWorker.registerPrevious
				*/
				ZipFileWorker.prototype.registerPrevious = function(previous) {
					this._sources.push(previous);
					var self = this;
					previous.on("data", function(chunk) {
						self.processChunk(chunk);
					});
					previous.on("end", function() {
						self.closedSource(self.previous.streamInfo);
						if (self._sources.length) self.prepareNextSource();
						else self.end();
					});
					previous.on("error", function(e) {
						self.error(e);
					});
					return this;
				};
				/**
				* @see GenericWorker.resume
				*/
				ZipFileWorker.prototype.resume = function() {
					if (!GenericWorker.prototype.resume.call(this)) return false;
					if (!this.previous && this._sources.length) {
						this.prepareNextSource();
						return true;
					}
					if (!this.previous && !this._sources.length && !this.generatedError) {
						this.end();
						return true;
					}
				};
				/**
				* @see GenericWorker.error
				*/
				ZipFileWorker.prototype.error = function(e) {
					var sources = this._sources;
					if (!GenericWorker.prototype.error.call(this, e)) return false;
					for (var i = 0; i < sources.length; i++) try {
						sources[i].error(e);
					} catch (e) {}
					return true;
				};
				/**
				* @see GenericWorker.lock
				*/
				ZipFileWorker.prototype.lock = function() {
					GenericWorker.prototype.lock.call(this);
					var sources = this._sources;
					for (var i = 0; i < sources.length; i++) sources[i].lock();
				};
				module$12.exports = ZipFileWorker;
			}, {
				"../crc32": 4,
				"../signature": 23,
				"../stream/GenericWorker": 28,
				"../utf8": 31,
				"../utils": 32
			}],
			9: [function(require, module$13, exports$13) {
				"use strict";
				var compressions = require("../compressions");
				var ZipFileWorker = require("./ZipFileWorker");
				/**
				* Find the compression to use.
				* @param {String} fileCompression the compression defined at the file level, if any.
				* @param {String} zipCompression the compression defined at the load() level.
				* @return {Object} the compression object to use.
				*/
				var getCompression = function(fileCompression, zipCompression) {
					var compressionName = fileCompression || zipCompression;
					var compression = compressions[compressionName];
					if (!compression) throw new Error(compressionName + " is not a valid compression method !");
					return compression;
				};
				/**
				* Create a worker to generate a zip file.
				* @param {JSZip} zip the JSZip instance at the right root level.
				* @param {Object} options to generate the zip file.
				* @param {String} comment the comment to use.
				*/
				exports$13.generateWorker = function(zip, options, comment) {
					var zipFileWorker = new ZipFileWorker(options.streamFiles, comment, options.platform, options.encodeFileName);
					var entriesCount = 0;
					try {
						zip.forEach(function(relativePath, file) {
							entriesCount++;
							var compression = getCompression(file.options.compression, options.compression);
							var compressionOptions = file.options.compressionOptions || options.compressionOptions || {};
							var dir = file.dir, date = file.date;
							file._compressWorker(compression, compressionOptions).withStreamInfo("file", {
								name: relativePath,
								dir,
								date,
								comment: file.comment || "",
								unixPermissions: file.unixPermissions,
								dosPermissions: file.dosPermissions
							}).pipe(zipFileWorker);
						});
						zipFileWorker.entriesCount = entriesCount;
					} catch (e) {
						zipFileWorker.error(e);
					}
					return zipFileWorker;
				};
			}, {
				"../compressions": 3,
				"./ZipFileWorker": 8
			}],
			10: [function(require, module$14, exports$14) {
				"use strict";
				/**
				* Representation a of zip file in js
				* @constructor
				*/
				function JSZip() {
					if (!(this instanceof JSZip)) return new JSZip();
					if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
					this.files = Object.create(null);
					this.comment = null;
					this.root = "";
					this.clone = function() {
						var newObj = new JSZip();
						for (var i in this) if (typeof this[i] !== "function") newObj[i] = this[i];
						return newObj;
					};
				}
				JSZip.prototype = require("./object");
				JSZip.prototype.loadAsync = require("./load");
				JSZip.support = require("./support");
				JSZip.defaults = require("./defaults");
				JSZip.version = "3.10.1";
				JSZip.loadAsync = function(content, options) {
					return new JSZip().loadAsync(content, options);
				};
				JSZip.external = require("./external");
				module$14.exports = JSZip;
			}, {
				"./defaults": 5,
				"./external": 6,
				"./load": 11,
				"./object": 15,
				"./support": 30
			}],
			11: [function(require, module$15, exports$15) {
				"use strict";
				var utils = require("./utils");
				var external = require("./external");
				var utf8 = require("./utf8");
				var ZipEntries = require("./zipEntries");
				var Crc32Probe = require("./stream/Crc32Probe");
				var nodejsUtils = require("./nodejsUtils");
				/**
				* Check the CRC32 of an entry.
				* @param {ZipEntry} zipEntry the zip entry to check.
				* @return {Promise} the result.
				*/
				function checkEntryCRC32(zipEntry) {
					return new external.Promise(function(resolve, reject) {
						var worker = zipEntry.decompressed.getContentWorker().pipe(new Crc32Probe());
						worker.on("error", function(e) {
							reject(e);
						}).on("end", function() {
							if (worker.streamInfo.crc32 !== zipEntry.decompressed.crc32) reject(/* @__PURE__ */ new Error("Corrupted zip : CRC32 mismatch"));
							else resolve();
						}).resume();
					});
				}
				module$15.exports = function(data, options) {
					var zip = this;
					options = utils.extend(options || {}, {
						base64: false,
						checkCRC32: false,
						optimizedBinaryString: false,
						createFolders: false,
						decodeFileName: utf8.utf8decode
					});
					if (nodejsUtils.isNode && nodejsUtils.isStream(data)) return external.Promise.reject(/* @__PURE__ */ new Error("JSZip can't accept a stream when loading a zip file."));
					return utils.prepareContent("the loaded zip file", data, true, options.optimizedBinaryString, options.base64).then(function(data) {
						var zipEntries = new ZipEntries(options);
						zipEntries.load(data);
						return zipEntries;
					}).then(function checkCRC32(zipEntries) {
						var promises = [external.Promise.resolve(zipEntries)];
						var files = zipEntries.files;
						if (options.checkCRC32) for (var i = 0; i < files.length; i++) promises.push(checkEntryCRC32(files[i]));
						return external.Promise.all(promises);
					}).then(function addFiles(results) {
						var zipEntries = results.shift();
						var files = zipEntries.files;
						for (var i = 0; i < files.length; i++) {
							var input = files[i];
							var unsafeName = input.fileNameStr;
							var safeName = utils.resolve(input.fileNameStr);
							zip.file(safeName, input.decompressed, {
								binary: true,
								optimizedBinaryString: true,
								date: input.date,
								dir: input.dir,
								comment: input.fileCommentStr.length ? input.fileCommentStr : null,
								unixPermissions: input.unixPermissions,
								dosPermissions: input.dosPermissions,
								createFolders: options.createFolders
							});
							if (!input.dir) zip.file(safeName).unsafeOriginalName = unsafeName;
						}
						if (zipEntries.zipComment.length) zip.comment = zipEntries.zipComment;
						return zip;
					});
				};
			}, {
				"./external": 6,
				"./nodejsUtils": 14,
				"./stream/Crc32Probe": 25,
				"./utf8": 31,
				"./utils": 32,
				"./zipEntries": 33
			}],
			12: [function(require, module$16, exports$16) {
				"use strict";
				var utils = require("../utils");
				var GenericWorker = require("../stream/GenericWorker");
				/**
				* A worker that use a nodejs stream as source.
				* @constructor
				* @param {String} filename the name of the file entry for this stream.
				* @param {Readable} stream the nodejs stream.
				*/
				function NodejsStreamInputAdapter(filename, stream) {
					GenericWorker.call(this, "Nodejs stream input adapter for " + filename);
					this._upstreamEnded = false;
					this._bindStream(stream);
				}
				utils.inherits(NodejsStreamInputAdapter, GenericWorker);
				/**
				* Prepare the stream and bind the callbacks on it.
				* Do this ASAP on node 0.10 ! A lazy binding doesn't always work.
				* @param {Stream} stream the nodejs stream to use.
				*/
				NodejsStreamInputAdapter.prototype._bindStream = function(stream) {
					var self = this;
					this._stream = stream;
					stream.pause();
					stream.on("data", function(chunk) {
						self.push({
							data: chunk,
							meta: { percent: 0 }
						});
					}).on("error", function(e) {
						if (self.isPaused) this.generatedError = e;
						else self.error(e);
					}).on("end", function() {
						if (self.isPaused) self._upstreamEnded = true;
						else self.end();
					});
				};
				NodejsStreamInputAdapter.prototype.pause = function() {
					if (!GenericWorker.prototype.pause.call(this)) return false;
					this._stream.pause();
					return true;
				};
				NodejsStreamInputAdapter.prototype.resume = function() {
					if (!GenericWorker.prototype.resume.call(this)) return false;
					if (this._upstreamEnded) this.end();
					else this._stream.resume();
					return true;
				};
				module$16.exports = NodejsStreamInputAdapter;
			}, {
				"../stream/GenericWorker": 28,
				"../utils": 32
			}],
			13: [function(require, module$17, exports$17) {
				"use strict";
				var Readable = require("readable-stream").Readable;
				require("../utils").inherits(NodejsStreamOutputAdapter, Readable);
				/**
				* A nodejs stream using a worker as source.
				* @see the SourceWrapper in http://nodejs.org/api/stream.html
				* @constructor
				* @param {StreamHelper} helper the helper wrapping the worker
				* @param {Object} options the nodejs stream options
				* @param {Function} updateCb the update callback.
				*/
				function NodejsStreamOutputAdapter(helper, options, updateCb) {
					Readable.call(this, options);
					this._helper = helper;
					var self = this;
					helper.on("data", function(data, meta) {
						if (!self.push(data)) self._helper.pause();
						if (updateCb) updateCb(meta);
					}).on("error", function(e) {
						self.emit("error", e);
					}).on("end", function() {
						self.push(null);
					});
				}
				NodejsStreamOutputAdapter.prototype._read = function() {
					this._helper.resume();
				};
				module$17.exports = NodejsStreamOutputAdapter;
			}, {
				"../utils": 32,
				"readable-stream": 16
			}],
			14: [function(require, module$18, exports$18) {
				"use strict";
				module$18.exports = {
					/**
					* True if this is running in Nodejs, will be undefined in a browser.
					* In a browser, browserify won't include this file and the whole module
					* will be resolved an empty object.
					*/
					isNode: typeof Buffer !== "undefined",
					/**
					* Create a new nodejs Buffer from an existing content.
					* @param {Object} data the data to pass to the constructor.
					* @param {String} encoding the encoding to use.
					* @return {Buffer} a new Buffer.
					*/
					newBufferFrom: function(data, encoding) {
						if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(data, encoding);
						else {
							if (typeof data === "number") throw new Error("The \"data\" argument must not be a number");
							return new Buffer(data, encoding);
						}
					},
					/**
					* Create a new nodejs Buffer with the specified size.
					* @param {Integer} size the size of the buffer.
					* @return {Buffer} a new Buffer.
					*/
					allocBuffer: function(size) {
						if (Buffer.alloc) return Buffer.alloc(size);
						else {
							var buf = new Buffer(size);
							buf.fill(0);
							return buf;
						}
					},
					/**
					* Find out if an object is a Buffer.
					* @param {Object} b the object to test.
					* @return {Boolean} true if the object is a Buffer, false otherwise.
					*/
					isBuffer: function(b) {
						return Buffer.isBuffer(b);
					},
					isStream: function(obj) {
						return obj && typeof obj.on === "function" && typeof obj.pause === "function" && typeof obj.resume === "function";
					}
				};
			}, {}],
			15: [function(require, module$19, exports$19) {
				"use strict";
				var utf8 = require("./utf8");
				var utils = require("./utils");
				var GenericWorker = require("./stream/GenericWorker");
				var StreamHelper = require("./stream/StreamHelper");
				var defaults = require("./defaults");
				var CompressedObject = require("./compressedObject");
				var ZipObject = require("./zipObject");
				var generate = require("./generate");
				var nodejsUtils = require("./nodejsUtils");
				var NodejsStreamInputAdapter = require("./nodejs/NodejsStreamInputAdapter");
				/**
				* Add a file in the current folder.
				* @private
				* @param {string} name the name of the file
				* @param {String|ArrayBuffer|Uint8Array|Buffer} data the data of the file
				* @param {Object} originalOptions the options of the file
				* @return {Object} the new file.
				*/
				var fileAdd = function(name, data, originalOptions) {
					var dataType = utils.getTypeOf(data), parent;
					var o = utils.extend(originalOptions || {}, defaults);
					o.date = o.date || /* @__PURE__ */ new Date();
					if (o.compression !== null) o.compression = o.compression.toUpperCase();
					if (typeof o.unixPermissions === "string") o.unixPermissions = parseInt(o.unixPermissions, 8);
					if (o.unixPermissions && o.unixPermissions & 16384) o.dir = true;
					if (o.dosPermissions && o.dosPermissions & 16) o.dir = true;
					if (o.dir) name = forceTrailingSlash(name);
					if (o.createFolders && (parent = parentFolder(name))) folderAdd.call(this, parent, true);
					var isUnicodeString = dataType === "string" && o.binary === false && o.base64 === false;
					if (!originalOptions || typeof originalOptions.binary === "undefined") o.binary = !isUnicodeString;
					if (data instanceof CompressedObject && data.uncompressedSize === 0 || o.dir || !data || data.length === 0) {
						o.base64 = false;
						o.binary = true;
						data = "";
						o.compression = "STORE";
						dataType = "string";
					}
					var zipObjectContent = null;
					if (data instanceof CompressedObject || data instanceof GenericWorker) zipObjectContent = data;
					else if (nodejsUtils.isNode && nodejsUtils.isStream(data)) zipObjectContent = new NodejsStreamInputAdapter(name, data);
					else zipObjectContent = utils.prepareContent(name, data, o.binary, o.optimizedBinaryString, o.base64);
					var object = new ZipObject(name, zipObjectContent, o);
					this.files[name] = object;
				};
				/**
				* Find the parent folder of the path.
				* @private
				* @param {string} path the path to use
				* @return {string} the parent folder, or ""
				*/
				var parentFolder = function(path) {
					if (path.slice(-1) === "/") path = path.substring(0, path.length - 1);
					var lastSlash = path.lastIndexOf("/");
					return lastSlash > 0 ? path.substring(0, lastSlash) : "";
				};
				/**
				* Returns the path with a slash at the end.
				* @private
				* @param {String} path the path to check.
				* @return {String} the path with a trailing slash.
				*/
				var forceTrailingSlash = function(path) {
					if (path.slice(-1) !== "/") path += "/";
					return path;
				};
				/**
				* Add a (sub) folder in the current folder.
				* @private
				* @param {string} name the folder's name
				* @param {boolean=} [createFolders] If true, automatically create sub
				*  folders. Defaults to false.
				* @return {Object} the new folder.
				*/
				var folderAdd = function(name, createFolders) {
					createFolders = typeof createFolders !== "undefined" ? createFolders : defaults.createFolders;
					name = forceTrailingSlash(name);
					if (!this.files[name]) fileAdd.call(this, name, null, {
						dir: true,
						createFolders
					});
					return this.files[name];
				};
				/**
				* Cross-window, cross-Node-context regular expression detection
				* @param  {Object}  object Anything
				* @return {Boolean}        true if the object is a regular expression,
				* false otherwise
				*/
				function isRegExp(object) {
					return Object.prototype.toString.call(object) === "[object RegExp]";
				}
				module$19.exports = {
					/**
					* @see loadAsync
					*/
					load: function() {
						throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
					},
					/**
					* Call a callback function for each entry at this folder level.
					* @param {Function} cb the callback function:
					* function (relativePath, file) {...}
					* It takes 2 arguments : the relative path and the file.
					*/
					forEach: function(cb) {
						var filename, relativePath, file;
						for (filename in this.files) {
							file = this.files[filename];
							relativePath = filename.slice(this.root.length, filename.length);
							if (relativePath && filename.slice(0, this.root.length) === this.root) cb(relativePath, file);
						}
					},
					/**
					* Filter nested files/folders with the specified function.
					* @param {Function} search the predicate to use :
					* function (relativePath, file) {...}
					* It takes 2 arguments : the relative path and the file.
					* @return {Array} An array of matching elements.
					*/
					filter: function(search) {
						var result = [];
						this.forEach(function(relativePath, entry) {
							if (search(relativePath, entry)) result.push(entry);
						});
						return result;
					},
					/**
					* Add a file to the zip file, or search a file.
					* @param   {string|RegExp} name The name of the file to add (if data is defined),
					* the name of the file to find (if no data) or a regex to match files.
					* @param   {String|ArrayBuffer|Uint8Array|Buffer} data  The file data, either raw or base64 encoded
					* @param   {Object} o     File options
					* @return  {JSZip|Object|Array} this JSZip object (when adding a file),
					* a file (when searching by string) or an array of files (when searching by regex).
					*/
					file: function(name, data, o) {
						if (arguments.length === 1) if (isRegExp(name)) {
							var regexp = name;
							return this.filter(function(relativePath, file) {
								return !file.dir && regexp.test(relativePath);
							});
						} else {
							var obj = this.files[this.root + name];
							if (obj && !obj.dir) return obj;
							else return null;
						}
						else {
							name = this.root + name;
							fileAdd.call(this, name, data, o);
						}
						return this;
					},
					/**
					* Add a directory to the zip file, or search.
					* @param   {String|RegExp} arg The name of the directory to add, or a regex to search folders.
					* @return  {JSZip} an object with the new directory as the root, or an array containing matching folders.
					*/
					folder: function(arg) {
						if (!arg) return this;
						if (isRegExp(arg)) return this.filter(function(relativePath, file) {
							return file.dir && arg.test(relativePath);
						});
						var name = this.root + arg;
						var newFolder = folderAdd.call(this, name);
						var ret = this.clone();
						ret.root = newFolder.name;
						return ret;
					},
					/**
					* Delete a file, or a directory and all sub-files, from the zip
					* @param {string} name the name of the file to delete
					* @return {JSZip} this JSZip object
					*/
					remove: function(name) {
						name = this.root + name;
						var file = this.files[name];
						if (!file) {
							if (name.slice(-1) !== "/") name += "/";
							file = this.files[name];
						}
						if (file && !file.dir) delete this.files[name];
						else {
							var kids = this.filter(function(relativePath, file) {
								return file.name.slice(0, name.length) === name;
							});
							for (var i = 0; i < kids.length; i++) delete this.files[kids[i].name];
						}
						return this;
					},
					/**
					* @deprecated This method has been removed in JSZip 3.0, please check the upgrade guide.
					*/
					generate: function() {
						throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
					},
					/**
					* Generate the complete zip file as an internal stream.
					* @param {Object} options the options to generate the zip file :
					* - compression, "STORE" by default.
					* - type, "base64" by default. Values are : string, base64, uint8array, arraybuffer, blob.
					* @return {StreamHelper} the streamed zip file.
					*/
					generateInternalStream: function(options) {
						var worker, opts = {};
						try {
							opts = utils.extend(options || {}, {
								streamFiles: false,
								compression: "STORE",
								compressionOptions: null,
								type: "",
								platform: "DOS",
								comment: null,
								mimeType: "application/zip",
								encodeFileName: utf8.utf8encode
							});
							opts.type = opts.type.toLowerCase();
							opts.compression = opts.compression.toUpperCase();
							if (opts.type === "binarystring") opts.type = "string";
							if (!opts.type) throw new Error("No output type specified.");
							utils.checkSupport(opts.type);
							if (opts.platform === "darwin" || opts.platform === "freebsd" || opts.platform === "linux" || opts.platform === "sunos") opts.platform = "UNIX";
							if (opts.platform === "win32") opts.platform = "DOS";
							var comment = opts.comment || this.comment || "";
							worker = generate.generateWorker(this, opts, comment);
						} catch (e) {
							worker = new GenericWorker("error");
							worker.error(e);
						}
						return new StreamHelper(worker, opts.type || "string", opts.mimeType);
					},
					/**
					* Generate the complete zip file asynchronously.
					* @see generateInternalStream
					*/
					generateAsync: function(options, onUpdate) {
						return this.generateInternalStream(options).accumulate(onUpdate);
					},
					/**
					* Generate the complete zip file asynchronously.
					* @see generateInternalStream
					*/
					generateNodeStream: function(options, onUpdate) {
						options = options || {};
						if (!options.type) options.type = "nodebuffer";
						return this.generateInternalStream(options).toNodejsStream(onUpdate);
					}
				};
			}, {
				"./compressedObject": 2,
				"./defaults": 5,
				"./generate": 9,
				"./nodejs/NodejsStreamInputAdapter": 12,
				"./nodejsUtils": 14,
				"./stream/GenericWorker": 28,
				"./stream/StreamHelper": 29,
				"./utf8": 31,
				"./utils": 32,
				"./zipObject": 35
			}],
			16: [function(require, module$20, exports$20) {
				"use strict";
				module$20.exports = require("stream");
			}, { "stream": void 0 }],
			17: [function(require, module$21, exports$21) {
				"use strict";
				var DataReader = require("./DataReader");
				var utils = require("../utils");
				function ArrayReader(data) {
					DataReader.call(this, data);
					for (var i = 0; i < this.data.length; i++) data[i] = data[i] & 255;
				}
				utils.inherits(ArrayReader, DataReader);
				/**
				* @see DataReader.byteAt
				*/
				ArrayReader.prototype.byteAt = function(i) {
					return this.data[this.zero + i];
				};
				/**
				* @see DataReader.lastIndexOfSignature
				*/
				ArrayReader.prototype.lastIndexOfSignature = function(sig) {
					var sig0 = sig.charCodeAt(0), sig1 = sig.charCodeAt(1), sig2 = sig.charCodeAt(2), sig3 = sig.charCodeAt(3);
					for (var i = this.length - 4; i >= 0; --i) if (this.data[i] === sig0 && this.data[i + 1] === sig1 && this.data[i + 2] === sig2 && this.data[i + 3] === sig3) return i - this.zero;
					return -1;
				};
				/**
				* @see DataReader.readAndCheckSignature
				*/
				ArrayReader.prototype.readAndCheckSignature = function(sig) {
					var sig0 = sig.charCodeAt(0), sig1 = sig.charCodeAt(1), sig2 = sig.charCodeAt(2), sig3 = sig.charCodeAt(3), data = this.readData(4);
					return sig0 === data[0] && sig1 === data[1] && sig2 === data[2] && sig3 === data[3];
				};
				/**
				* @see DataReader.readData
				*/
				ArrayReader.prototype.readData = function(size) {
					this.checkOffset(size);
					if (size === 0) return [];
					var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
					this.index += size;
					return result;
				};
				module$21.exports = ArrayReader;
			}, {
				"../utils": 32,
				"./DataReader": 18
			}],
			18: [function(require, module$22, exports$22) {
				"use strict";
				var utils = require("../utils");
				function DataReader(data) {
					this.data = data;
					this.length = data.length;
					this.index = 0;
					this.zero = 0;
				}
				DataReader.prototype = {
					/**
					* Check that the offset will not go too far.
					* @param {string} offset the additional offset to check.
					* @throws {Error} an Error if the offset is out of bounds.
					*/
					checkOffset: function(offset) {
						this.checkIndex(this.index + offset);
					},
					/**
					* Check that the specified index will not be too far.
					* @param {string} newIndex the index to check.
					* @throws {Error} an Error if the index is out of bounds.
					*/
					checkIndex: function(newIndex) {
						if (this.length < this.zero + newIndex || newIndex < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + newIndex + "). Corrupted zip ?");
					},
					/**
					* Change the index.
					* @param {number} newIndex The new index.
					* @throws {Error} if the new index is out of the data.
					*/
					setIndex: function(newIndex) {
						this.checkIndex(newIndex);
						this.index = newIndex;
					},
					/**
					* Skip the next n bytes.
					* @param {number} n the number of bytes to skip.
					* @throws {Error} if the new index is out of the data.
					*/
					skip: function(n) {
						this.setIndex(this.index + n);
					},
					/**
					* Get the byte at the specified index.
					* @param {number} i the index to use.
					* @return {number} a byte.
					*/
					byteAt: function() {},
					/**
					* Get the next number with a given byte size.
					* @param {number} size the number of bytes to read.
					* @return {number} the corresponding number.
					*/
					readInt: function(size) {
						var result = 0, i;
						this.checkOffset(size);
						for (i = this.index + size - 1; i >= this.index; i--) result = (result << 8) + this.byteAt(i);
						this.index += size;
						return result;
					},
					/**
					* Get the next string with a given byte size.
					* @param {number} size the number of bytes to read.
					* @return {string} the corresponding string.
					*/
					readString: function(size) {
						return utils.transformTo("string", this.readData(size));
					},
					/**
					* Get raw data without conversion, <size> bytes.
					* @param {number} size the number of bytes to read.
					* @return {Object} the raw data, implementation specific.
					*/
					readData: function() {},
					/**
					* Find the last occurrence of a zip signature (4 bytes).
					* @param {string} sig the signature to find.
					* @return {number} the index of the last occurrence, -1 if not found.
					*/
					lastIndexOfSignature: function() {},
					/**
					* Read the signature (4 bytes) at the current position and compare it with sig.
					* @param {string} sig the expected signature
					* @return {boolean} true if the signature matches, false otherwise.
					*/
					readAndCheckSignature: function() {},
					/**
					* Get the next date.
					* @return {Date} the date.
					*/
					readDate: function() {
						var dostime = this.readInt(4);
						return new Date(Date.UTC((dostime >> 25 & 127) + 1980, (dostime >> 21 & 15) - 1, dostime >> 16 & 31, dostime >> 11 & 31, dostime >> 5 & 63, (dostime & 31) << 1));
					}
				};
				module$22.exports = DataReader;
			}, { "../utils": 32 }],
			19: [function(require, module$23, exports$23) {
				"use strict";
				var Uint8ArrayReader = require("./Uint8ArrayReader");
				var utils = require("../utils");
				function NodeBufferReader(data) {
					Uint8ArrayReader.call(this, data);
				}
				utils.inherits(NodeBufferReader, Uint8ArrayReader);
				/**
				* @see DataReader.readData
				*/
				NodeBufferReader.prototype.readData = function(size) {
					this.checkOffset(size);
					var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
					this.index += size;
					return result;
				};
				module$23.exports = NodeBufferReader;
			}, {
				"../utils": 32,
				"./Uint8ArrayReader": 21
			}],
			20: [function(require, module$24, exports$24) {
				"use strict";
				var DataReader = require("./DataReader");
				var utils = require("../utils");
				function StringReader(data) {
					DataReader.call(this, data);
				}
				utils.inherits(StringReader, DataReader);
				/**
				* @see DataReader.byteAt
				*/
				StringReader.prototype.byteAt = function(i) {
					return this.data.charCodeAt(this.zero + i);
				};
				/**
				* @see DataReader.lastIndexOfSignature
				*/
				StringReader.prototype.lastIndexOfSignature = function(sig) {
					return this.data.lastIndexOf(sig) - this.zero;
				};
				/**
				* @see DataReader.readAndCheckSignature
				*/
				StringReader.prototype.readAndCheckSignature = function(sig) {
					return sig === this.readData(4);
				};
				/**
				* @see DataReader.readData
				*/
				StringReader.prototype.readData = function(size) {
					this.checkOffset(size);
					var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
					this.index += size;
					return result;
				};
				module$24.exports = StringReader;
			}, {
				"../utils": 32,
				"./DataReader": 18
			}],
			21: [function(require, module$25, exports$25) {
				"use strict";
				var ArrayReader = require("./ArrayReader");
				var utils = require("../utils");
				function Uint8ArrayReader(data) {
					ArrayReader.call(this, data);
				}
				utils.inherits(Uint8ArrayReader, ArrayReader);
				/**
				* @see DataReader.readData
				*/
				Uint8ArrayReader.prototype.readData = function(size) {
					this.checkOffset(size);
					if (size === 0) return /* @__PURE__ */ new Uint8Array(0);
					var result = this.data.subarray(this.zero + this.index, this.zero + this.index + size);
					this.index += size;
					return result;
				};
				module$25.exports = Uint8ArrayReader;
			}, {
				"../utils": 32,
				"./ArrayReader": 17
			}],
			22: [function(require, module$26, exports$26) {
				"use strict";
				var utils = require("../utils");
				var support = require("../support");
				var ArrayReader = require("./ArrayReader");
				var StringReader = require("./StringReader");
				var NodeBufferReader = require("./NodeBufferReader");
				var Uint8ArrayReader = require("./Uint8ArrayReader");
				/**
				* Create a reader adapted to the data.
				* @param {String|ArrayBuffer|Uint8Array|Buffer} data the data to read.
				* @return {DataReader} the data reader.
				*/
				module$26.exports = function(data) {
					var type = utils.getTypeOf(data);
					utils.checkSupport(type);
					if (type === "string" && !support.uint8array) return new StringReader(data);
					if (type === "nodebuffer") return new NodeBufferReader(data);
					if (support.uint8array) return new Uint8ArrayReader(utils.transformTo("uint8array", data));
					return new ArrayReader(utils.transformTo("array", data));
				};
			}, {
				"../support": 30,
				"../utils": 32,
				"./ArrayReader": 17,
				"./NodeBufferReader": 19,
				"./StringReader": 20,
				"./Uint8ArrayReader": 21
			}],
			23: [function(require, module$27, exports$27) {
				"use strict";
				exports$27.LOCAL_FILE_HEADER = "PK";
				exports$27.CENTRAL_FILE_HEADER = "PK";
				exports$27.CENTRAL_DIRECTORY_END = "PK";
				exports$27.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07";
				exports$27.ZIP64_CENTRAL_DIRECTORY_END = "PK";
				exports$27.DATA_DESCRIPTOR = "PK\x07\b";
			}, {}],
			24: [function(require, module$28, exports$28) {
				"use strict";
				var GenericWorker = require("./GenericWorker");
				var utils = require("../utils");
				/**
				* A worker which convert chunks to a specified type.
				* @constructor
				* @param {String} destType the destination type.
				*/
				function ConvertWorker(destType) {
					GenericWorker.call(this, "ConvertWorker to " + destType);
					this.destType = destType;
				}
				utils.inherits(ConvertWorker, GenericWorker);
				/**
				* @see GenericWorker.processChunk
				*/
				ConvertWorker.prototype.processChunk = function(chunk) {
					this.push({
						data: utils.transformTo(this.destType, chunk.data),
						meta: chunk.meta
					});
				};
				module$28.exports = ConvertWorker;
			}, {
				"../utils": 32,
				"./GenericWorker": 28
			}],
			25: [function(require, module$29, exports$29) {
				"use strict";
				var GenericWorker = require("./GenericWorker");
				var crc32 = require("../crc32");
				var utils = require("../utils");
				/**
				* A worker which calculate the crc32 of the data flowing through.
				* @constructor
				*/
				function Crc32Probe() {
					GenericWorker.call(this, "Crc32Probe");
					this.withStreamInfo("crc32", 0);
				}
				utils.inherits(Crc32Probe, GenericWorker);
				/**
				* @see GenericWorker.processChunk
				*/
				Crc32Probe.prototype.processChunk = function(chunk) {
					this.streamInfo.crc32 = crc32(chunk.data, this.streamInfo.crc32 || 0);
					this.push(chunk);
				};
				module$29.exports = Crc32Probe;
			}, {
				"../crc32": 4,
				"../utils": 32,
				"./GenericWorker": 28
			}],
			26: [function(require, module$30, exports$30) {
				"use strict";
				var utils = require("../utils");
				var GenericWorker = require("./GenericWorker");
				/**
				* A worker which calculate the total length of the data flowing through.
				* @constructor
				* @param {String} propName the name used to expose the length
				*/
				function DataLengthProbe(propName) {
					GenericWorker.call(this, "DataLengthProbe for " + propName);
					this.propName = propName;
					this.withStreamInfo(propName, 0);
				}
				utils.inherits(DataLengthProbe, GenericWorker);
				/**
				* @see GenericWorker.processChunk
				*/
				DataLengthProbe.prototype.processChunk = function(chunk) {
					if (chunk) {
						var length = this.streamInfo[this.propName] || 0;
						this.streamInfo[this.propName] = length + chunk.data.length;
					}
					GenericWorker.prototype.processChunk.call(this, chunk);
				};
				module$30.exports = DataLengthProbe;
			}, {
				"../utils": 32,
				"./GenericWorker": 28
			}],
			27: [function(require, module$31, exports$31) {
				"use strict";
				var utils = require("../utils");
				var GenericWorker = require("./GenericWorker");
				var DEFAULT_BLOCK_SIZE = 16 * 1024;
				/**
				* A worker that reads a content and emits chunks.
				* @constructor
				* @param {Promise} dataP the promise of the data to split
				*/
				function DataWorker(dataP) {
					GenericWorker.call(this, "DataWorker");
					var self = this;
					this.dataIsReady = false;
					this.index = 0;
					this.max = 0;
					this.data = null;
					this.type = "";
					this._tickScheduled = false;
					dataP.then(function(data) {
						self.dataIsReady = true;
						self.data = data;
						self.max = data && data.length || 0;
						self.type = utils.getTypeOf(data);
						if (!self.isPaused) self._tickAndRepeat();
					}, function(e) {
						self.error(e);
					});
				}
				utils.inherits(DataWorker, GenericWorker);
				/**
				* @see GenericWorker.cleanUp
				*/
				DataWorker.prototype.cleanUp = function() {
					GenericWorker.prototype.cleanUp.call(this);
					this.data = null;
				};
				/**
				* @see GenericWorker.resume
				*/
				DataWorker.prototype.resume = function() {
					if (!GenericWorker.prototype.resume.call(this)) return false;
					if (!this._tickScheduled && this.dataIsReady) {
						this._tickScheduled = true;
						utils.delay(this._tickAndRepeat, [], this);
					}
					return true;
				};
				/**
				* Trigger a tick a schedule an other call to this function.
				*/
				DataWorker.prototype._tickAndRepeat = function() {
					this._tickScheduled = false;
					if (this.isPaused || this.isFinished) return;
					this._tick();
					if (!this.isFinished) {
						utils.delay(this._tickAndRepeat, [], this);
						this._tickScheduled = true;
					}
				};
				/**
				* Read and push a chunk.
				*/
				DataWorker.prototype._tick = function() {
					if (this.isPaused || this.isFinished) return false;
					var size = DEFAULT_BLOCK_SIZE;
					var data = null, nextIndex = Math.min(this.max, this.index + size);
					if (this.index >= this.max) return this.end();
					else {
						switch (this.type) {
							case "string":
								data = this.data.substring(this.index, nextIndex);
								break;
							case "uint8array":
								data = this.data.subarray(this.index, nextIndex);
								break;
							case "array":
							case "nodebuffer":
								data = this.data.slice(this.index, nextIndex);
								break;
						}
						this.index = nextIndex;
						return this.push({
							data,
							meta: { percent: this.max ? this.index / this.max * 100 : 0 }
						});
					}
				};
				module$31.exports = DataWorker;
			}, {
				"../utils": 32,
				"./GenericWorker": 28
			}],
			28: [function(require, module$32, exports$32) {
				"use strict";
				/**
				* A worker that does nothing but passing chunks to the next one. This is like
				* a nodejs stream but with some differences. On the good side :
				* - it works on IE 6-9 without any issue / polyfill
				* - it weights less than the full dependencies bundled with browserify
				* - it forwards errors (no need to declare an error handler EVERYWHERE)
				*
				* A chunk is an object with 2 attributes : `meta` and `data`. The former is an
				* object containing anything (`percent` for example), see each worker for more
				* details. The latter is the real data (String, Uint8Array, etc).
				*
				* @constructor
				* @param {String} name the name of the stream (mainly used for debugging purposes)
				*/
				function GenericWorker(name) {
					this.name = name || "default";
					this.streamInfo = {};
					this.generatedError = null;
					this.extraStreamInfo = {};
					this.isPaused = true;
					this.isFinished = false;
					this.isLocked = false;
					this._listeners = {
						"data": [],
						"end": [],
						"error": []
					};
					this.previous = null;
				}
				GenericWorker.prototype = {
					/**
					* Push a chunk to the next workers.
					* @param {Object} chunk the chunk to push
					*/
					push: function(chunk) {
						this.emit("data", chunk);
					},
					/**
					* End the stream.
					* @return {Boolean} true if this call ended the worker, false otherwise.
					*/
					end: function() {
						if (this.isFinished) return false;
						this.flush();
						try {
							this.emit("end");
							this.cleanUp();
							this.isFinished = true;
						} catch (e) {
							this.emit("error", e);
						}
						return true;
					},
					/**
					* End the stream with an error.
					* @param {Error} e the error which caused the premature end.
					* @return {Boolean} true if this call ended the worker with an error, false otherwise.
					*/
					error: function(e) {
						if (this.isFinished) return false;
						if (this.isPaused) this.generatedError = e;
						else {
							this.isFinished = true;
							this.emit("error", e);
							if (this.previous) this.previous.error(e);
							this.cleanUp();
						}
						return true;
					},
					/**
					* Add a callback on an event.
					* @param {String} name the name of the event (data, end, error)
					* @param {Function} listener the function to call when the event is triggered
					* @return {GenericWorker} the current object for chainability
					*/
					on: function(name, listener) {
						this._listeners[name].push(listener);
						return this;
					},
					/**
					* Clean any references when a worker is ending.
					*/
					cleanUp: function() {
						this.streamInfo = this.generatedError = this.extraStreamInfo = null;
						this._listeners = [];
					},
					/**
					* Trigger an event. This will call registered callback with the provided arg.
					* @param {String} name the name of the event (data, end, error)
					* @param {Object} arg the argument to call the callback with.
					*/
					emit: function(name, arg) {
						if (this._listeners[name]) for (var i = 0; i < this._listeners[name].length; i++) this._listeners[name][i].call(this, arg);
					},
					/**
					* Chain a worker with an other.
					* @param {Worker} next the worker receiving events from the current one.
					* @return {worker} the next worker for chainability
					*/
					pipe: function(next) {
						return next.registerPrevious(this);
					},
					/**
					* Same as `pipe` in the other direction.
					* Using an API with `pipe(next)` is very easy.
					* Implementing the API with the point of view of the next one registering
					* a source is easier, see the ZipFileWorker.
					* @param {Worker} previous the previous worker, sending events to this one
					* @return {Worker} the current worker for chainability
					*/
					registerPrevious: function(previous) {
						if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
						this.streamInfo = previous.streamInfo;
						this.mergeStreamInfo();
						this.previous = previous;
						var self = this;
						previous.on("data", function(chunk) {
							self.processChunk(chunk);
						});
						previous.on("end", function() {
							self.end();
						});
						previous.on("error", function(e) {
							self.error(e);
						});
						return this;
					},
					/**
					* Pause the stream so it doesn't send events anymore.
					* @return {Boolean} true if this call paused the worker, false otherwise.
					*/
					pause: function() {
						if (this.isPaused || this.isFinished) return false;
						this.isPaused = true;
						if (this.previous) this.previous.pause();
						return true;
					},
					/**
					* Resume a paused stream.
					* @return {Boolean} true if this call resumed the worker, false otherwise.
					*/
					resume: function() {
						if (!this.isPaused || this.isFinished) return false;
						this.isPaused = false;
						var withError = false;
						if (this.generatedError) {
							this.error(this.generatedError);
							withError = true;
						}
						if (this.previous) this.previous.resume();
						return !withError;
					},
					/**
					* Flush any remaining bytes as the stream is ending.
					*/
					flush: function() {},
					/**
					* Process a chunk. This is usually the method overridden.
					* @param {Object} chunk the chunk to process.
					*/
					processChunk: function(chunk) {
						this.push(chunk);
					},
					/**
					* Add a key/value to be added in the workers chain streamInfo once activated.
					* @param {String} key the key to use
					* @param {Object} value the associated value
					* @return {Worker} the current worker for chainability
					*/
					withStreamInfo: function(key, value) {
						this.extraStreamInfo[key] = value;
						this.mergeStreamInfo();
						return this;
					},
					/**
					* Merge this worker's streamInfo into the chain's streamInfo.
					*/
					mergeStreamInfo: function() {
						for (var key in this.extraStreamInfo) {
							if (!Object.prototype.hasOwnProperty.call(this.extraStreamInfo, key)) continue;
							this.streamInfo[key] = this.extraStreamInfo[key];
						}
					},
					/**
					* Lock the stream to prevent further updates on the workers chain.
					* After calling this method, all calls to pipe will fail.
					*/
					lock: function() {
						if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
						this.isLocked = true;
						if (this.previous) this.previous.lock();
					},
					/**
					*
					* Pretty print the workers chain.
					*/
					toString: function() {
						var me = "Worker " + this.name;
						if (this.previous) return this.previous + " -> " + me;
						else return me;
					}
				};
				module$32.exports = GenericWorker;
			}, {}],
			29: [function(require, module$33, exports$33) {
				"use strict";
				var utils = require("../utils");
				var ConvertWorker = require("./ConvertWorker");
				var GenericWorker = require("./GenericWorker");
				var base64 = require("../base64");
				var support = require("../support");
				var external = require("../external");
				var NodejsStreamOutputAdapter = null;
				if (support.nodestream) try {
					NodejsStreamOutputAdapter = require("../nodejs/NodejsStreamOutputAdapter");
				} catch (e) {}
				/**
				* Apply the final transformation of the data. If the user wants a Blob for
				* example, it's easier to work with an U8intArray and finally do the
				* ArrayBuffer/Blob conversion.
				* @param {String} type the name of the final type
				* @param {String|Uint8Array|Buffer} content the content to transform
				* @param {String} mimeType the mime type of the content, if applicable.
				* @return {String|Uint8Array|ArrayBuffer|Buffer|Blob} the content in the right format.
				*/
				function transformZipOutput(type, content, mimeType) {
					switch (type) {
						case "blob": return utils.newBlob(utils.transformTo("arraybuffer", content), mimeType);
						case "base64": return base64.encode(content);
						default: return utils.transformTo(type, content);
					}
				}
				/**
				* Concatenate an array of data of the given type.
				* @param {String} type the type of the data in the given array.
				* @param {Array} dataArray the array containing the data chunks to concatenate
				* @return {String|Uint8Array|Buffer} the concatenated data
				* @throws Error if the asked type is unsupported
				*/
				function concat(type, dataArray) {
					var i, index = 0, res = null, totalLength = 0;
					for (i = 0; i < dataArray.length; i++) totalLength += dataArray[i].length;
					switch (type) {
						case "string": return dataArray.join("");
						case "array": return Array.prototype.concat.apply([], dataArray);
						case "uint8array":
							res = new Uint8Array(totalLength);
							for (i = 0; i < dataArray.length; i++) {
								res.set(dataArray[i], index);
								index += dataArray[i].length;
							}
							return res;
						case "nodebuffer": return Buffer.concat(dataArray);
						default: throw new Error("concat : unsupported type '" + type + "'");
					}
				}
				/**
				* Listen a StreamHelper, accumulate its content and concatenate it into a
				* complete block.
				* @param {StreamHelper} helper the helper to use.
				* @param {Function} updateCallback a callback called on each update. Called
				* with one arg :
				* - the metadata linked to the update received.
				* @return Promise the promise for the accumulation.
				*/
				function accumulate(helper, updateCallback) {
					return new external.Promise(function(resolve, reject) {
						var dataArray = [];
						var chunkType = helper._internalType, resultType = helper._outputType, mimeType = helper._mimeType;
						helper.on("data", function(data, meta) {
							dataArray.push(data);
							if (updateCallback) updateCallback(meta);
						}).on("error", function(err) {
							dataArray = [];
							reject(err);
						}).on("end", function() {
							try {
								resolve(transformZipOutput(resultType, concat(chunkType, dataArray), mimeType));
							} catch (e) {
								reject(e);
							}
							dataArray = [];
						}).resume();
					});
				}
				/**
				* An helper to easily use workers outside of JSZip.
				* @constructor
				* @param {Worker} worker the worker to wrap
				* @param {String} outputType the type of data expected by the use
				* @param {String} mimeType the mime type of the content, if applicable.
				*/
				function StreamHelper(worker, outputType, mimeType) {
					var internalType = outputType;
					switch (outputType) {
						case "blob":
						case "arraybuffer":
							internalType = "uint8array";
							break;
						case "base64":
							internalType = "string";
							break;
					}
					try {
						this._internalType = internalType;
						this._outputType = outputType;
						this._mimeType = mimeType;
						utils.checkSupport(internalType);
						this._worker = worker.pipe(new ConvertWorker(internalType));
						worker.lock();
					} catch (e) {
						this._worker = new GenericWorker("error");
						this._worker.error(e);
					}
				}
				StreamHelper.prototype = {
					/**
					* Listen a StreamHelper, accumulate its content and concatenate it into a
					* complete block.
					* @param {Function} updateCb the update callback.
					* @return Promise the promise for the accumulation.
					*/
					accumulate: function(updateCb) {
						return accumulate(this, updateCb);
					},
					/**
					* Add a listener on an event triggered on a stream.
					* @param {String} evt the name of the event
					* @param {Function} fn the listener
					* @return {StreamHelper} the current helper.
					*/
					on: function(evt, fn) {
						var self = this;
						if (evt === "data") this._worker.on(evt, function(chunk) {
							fn.call(self, chunk.data, chunk.meta);
						});
						else this._worker.on(evt, function() {
							utils.delay(fn, arguments, self);
						});
						return this;
					},
					/**
					* Resume the flow of chunks.
					* @return {StreamHelper} the current helper.
					*/
					resume: function() {
						utils.delay(this._worker.resume, [], this._worker);
						return this;
					},
					/**
					* Pause the flow of chunks.
					* @return {StreamHelper} the current helper.
					*/
					pause: function() {
						this._worker.pause();
						return this;
					},
					/**
					* Return a nodejs stream for this helper.
					* @param {Function} updateCb the update callback.
					* @return {NodejsStreamOutputAdapter} the nodejs stream.
					*/
					toNodejsStream: function(updateCb) {
						utils.checkSupport("nodestream");
						if (this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
						return new NodejsStreamOutputAdapter(this, { objectMode: this._outputType !== "nodebuffer" }, updateCb);
					}
				};
				module$33.exports = StreamHelper;
			}, {
				"../base64": 1,
				"../external": 6,
				"../nodejs/NodejsStreamOutputAdapter": 13,
				"../support": 30,
				"../utils": 32,
				"./ConvertWorker": 24,
				"./GenericWorker": 28
			}],
			30: [function(require, module$34, exports$34) {
				"use strict";
				exports$34.base64 = true;
				exports$34.array = true;
				exports$34.string = true;
				exports$34.arraybuffer = typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined";
				exports$34.nodebuffer = typeof Buffer !== "undefined";
				exports$34.uint8array = typeof Uint8Array !== "undefined";
				if (typeof ArrayBuffer === "undefined") exports$34.blob = false;
				else {
					var buffer = /* @__PURE__ */ new ArrayBuffer(0);
					try {
						exports$34.blob = new Blob([buffer], { type: "application/zip" }).size === 0;
					} catch (e) {
						try {
							var builder = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
							builder.append(buffer);
							exports$34.blob = builder.getBlob("application/zip").size === 0;
						} catch (e) {
							exports$34.blob = false;
						}
					}
				}
				try {
					exports$34.nodestream = !!require("readable-stream").Readable;
				} catch (e) {
					exports$34.nodestream = false;
				}
			}, { "readable-stream": 16 }],
			31: [function(require, module$35, exports$35) {
				"use strict";
				var utils = require("./utils");
				var support = require("./support");
				var nodejsUtils = require("./nodejsUtils");
				var GenericWorker = require("./stream/GenericWorker");
				/**
				* The following functions come from pako, from pako/lib/utils/strings
				* released under the MIT license, see pako https://github.com/nodeca/pako/
				*/
				var _utf8len = new Array(256);
				for (var i = 0; i < 256; i++) _utf8len[i] = i >= 252 ? 6 : i >= 248 ? 5 : i >= 240 ? 4 : i >= 224 ? 3 : i >= 192 ? 2 : 1;
				_utf8len[254] = _utf8len[254] = 1;
				var string2buf = function(str) {
					var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
					for (m_pos = 0; m_pos < str_len; m_pos++) {
						c = str.charCodeAt(m_pos);
						if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
							c2 = str.charCodeAt(m_pos + 1);
							if ((c2 & 64512) === 56320) {
								c = 65536 + (c - 55296 << 10) + (c2 - 56320);
								m_pos++;
							}
						}
						buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
					}
					if (support.uint8array) buf = new Uint8Array(buf_len);
					else buf = new Array(buf_len);
					for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
						c = str.charCodeAt(m_pos);
						if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
							c2 = str.charCodeAt(m_pos + 1);
							if ((c2 & 64512) === 56320) {
								c = 65536 + (c - 55296 << 10) + (c2 - 56320);
								m_pos++;
							}
						}
						if (c < 128) buf[i++] = c;
						else if (c < 2048) {
							buf[i++] = 192 | c >>> 6;
							buf[i++] = 128 | c & 63;
						} else if (c < 65536) {
							buf[i++] = 224 | c >>> 12;
							buf[i++] = 128 | c >>> 6 & 63;
							buf[i++] = 128 | c & 63;
						} else {
							buf[i++] = 240 | c >>> 18;
							buf[i++] = 128 | c >>> 12 & 63;
							buf[i++] = 128 | c >>> 6 & 63;
							buf[i++] = 128 | c & 63;
						}
					}
					return buf;
				};
				var utf8border = function(buf, max) {
					var pos;
					max = max || buf.length;
					if (max > buf.length) max = buf.length;
					pos = max - 1;
					while (pos >= 0 && (buf[pos] & 192) === 128) pos--;
					if (pos < 0) return max;
					if (pos === 0) return max;
					return pos + _utf8len[buf[pos]] > max ? pos : max;
				};
				var buf2string = function(buf) {
					var i, out, c, c_len;
					var len = buf.length;
					var utf16buf = new Array(len * 2);
					for (out = 0, i = 0; i < len;) {
						c = buf[i++];
						if (c < 128) {
							utf16buf[out++] = c;
							continue;
						}
						c_len = _utf8len[c];
						if (c_len > 4) {
							utf16buf[out++] = 65533;
							i += c_len - 1;
							continue;
						}
						c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
						while (c_len > 1 && i < len) {
							c = c << 6 | buf[i++] & 63;
							c_len--;
						}
						if (c_len > 1) {
							utf16buf[out++] = 65533;
							continue;
						}
						if (c < 65536) utf16buf[out++] = c;
						else {
							c -= 65536;
							utf16buf[out++] = 55296 | c >> 10 & 1023;
							utf16buf[out++] = 56320 | c & 1023;
						}
					}
					if (utf16buf.length !== out) if (utf16buf.subarray) utf16buf = utf16buf.subarray(0, out);
					else utf16buf.length = out;
					return utils.applyFromCharCode(utf16buf);
				};
				/**
				* Transform a javascript string into an array (typed if possible) of bytes,
				* UTF-8 encoded.
				* @param {String} str the string to encode
				* @return {Array|Uint8Array|Buffer} the UTF-8 encoded string.
				*/
				exports$35.utf8encode = function utf8encode(str) {
					if (support.nodebuffer) return nodejsUtils.newBufferFrom(str, "utf-8");
					return string2buf(str);
				};
				/**
				* Transform a bytes array (or a representation) representing an UTF-8 encoded
				* string into a javascript string.
				* @param {Array|Uint8Array|Buffer} buf the data de decode
				* @return {String} the decoded string.
				*/
				exports$35.utf8decode = function utf8decode(buf) {
					if (support.nodebuffer) return utils.transformTo("nodebuffer", buf).toString("utf-8");
					buf = utils.transformTo(support.uint8array ? "uint8array" : "array", buf);
					return buf2string(buf);
				};
				/**
				* A worker to decode utf8 encoded binary chunks into string chunks.
				* @constructor
				*/
				function Utf8DecodeWorker() {
					GenericWorker.call(this, "utf-8 decode");
					this.leftOver = null;
				}
				utils.inherits(Utf8DecodeWorker, GenericWorker);
				/**
				* @see GenericWorker.processChunk
				*/
				Utf8DecodeWorker.prototype.processChunk = function(chunk) {
					var data = utils.transformTo(support.uint8array ? "uint8array" : "array", chunk.data);
					if (this.leftOver && this.leftOver.length) {
						if (support.uint8array) {
							var previousData = data;
							data = new Uint8Array(previousData.length + this.leftOver.length);
							data.set(this.leftOver, 0);
							data.set(previousData, this.leftOver.length);
						} else data = this.leftOver.concat(data);
						this.leftOver = null;
					}
					var nextBoundary = utf8border(data);
					var usableData = data;
					if (nextBoundary !== data.length) if (support.uint8array) {
						usableData = data.subarray(0, nextBoundary);
						this.leftOver = data.subarray(nextBoundary, data.length);
					} else {
						usableData = data.slice(0, nextBoundary);
						this.leftOver = data.slice(nextBoundary, data.length);
					}
					this.push({
						data: exports$35.utf8decode(usableData),
						meta: chunk.meta
					});
				};
				/**
				* @see GenericWorker.flush
				*/
				Utf8DecodeWorker.prototype.flush = function() {
					if (this.leftOver && this.leftOver.length) {
						this.push({
							data: exports$35.utf8decode(this.leftOver),
							meta: {}
						});
						this.leftOver = null;
					}
				};
				exports$35.Utf8DecodeWorker = Utf8DecodeWorker;
				/**
				* A worker to endcode string chunks into utf8 encoded binary chunks.
				* @constructor
				*/
				function Utf8EncodeWorker() {
					GenericWorker.call(this, "utf-8 encode");
				}
				utils.inherits(Utf8EncodeWorker, GenericWorker);
				/**
				* @see GenericWorker.processChunk
				*/
				Utf8EncodeWorker.prototype.processChunk = function(chunk) {
					this.push({
						data: exports$35.utf8encode(chunk.data),
						meta: chunk.meta
					});
				};
				exports$35.Utf8EncodeWorker = Utf8EncodeWorker;
			}, {
				"./nodejsUtils": 14,
				"./stream/GenericWorker": 28,
				"./support": 30,
				"./utils": 32
			}],
			32: [function(require, module$36, exports$36) {
				"use strict";
				var support = require("./support");
				var base64 = require("./base64");
				var nodejsUtils = require("./nodejsUtils");
				var external = require("./external");
				require("setimmediate");
				/**
				* Convert a string that pass as a "binary string": it should represent a byte
				* array but may have > 255 char codes. Be sure to take only the first byte
				* and returns the byte array.
				* @param {String} str the string to transform.
				* @return {Array|Uint8Array} the string in a binary format.
				*/
				function string2binary(str) {
					var result = null;
					if (support.uint8array) result = new Uint8Array(str.length);
					else result = new Array(str.length);
					return stringToArrayLike(str, result);
				}
				/**
				* Create a new blob with the given content and the given type.
				* @param {String|ArrayBuffer} part the content to put in the blob. DO NOT use
				* an Uint8Array because the stock browser of android 4 won't accept it (it
				* will be silently converted to a string, "[object Uint8Array]").
				*
				* Use only ONE part to build the blob to avoid a memory leak in IE11 / Edge:
				* when a large amount of Array is used to create the Blob, the amount of
				* memory consumed is nearly 100 times the original data amount.
				*
				* @param {String} type the mime type of the blob.
				* @return {Blob} the created blob.
				*/
				exports$36.newBlob = function(part, type) {
					exports$36.checkSupport("blob");
					try {
						return new Blob([part], { type });
					} catch (e) {
						try {
							var builder = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
							builder.append(part);
							return builder.getBlob(type);
						} catch (e) {
							throw new Error("Bug : can't construct the Blob.");
						}
					}
				};
				/**
				* The identity function.
				* @param {Object} input the input.
				* @return {Object} the same input.
				*/
				function identity(input) {
					return input;
				}
				/**
				* Fill in an array with a string.
				* @param {String} str the string to use.
				* @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to fill in (will be mutated).
				* @return {Array|ArrayBuffer|Uint8Array|Buffer} the updated array.
				*/
				function stringToArrayLike(str, array) {
					for (var i = 0; i < str.length; ++i) array[i] = str.charCodeAt(i) & 255;
					return array;
				}
				/**
				* An helper for the function arrayLikeToString.
				* This contains static information and functions that
				* can be optimized by the browser JIT compiler.
				*/
				var arrayToStringHelper = {
					/**
					* Transform an array of int into a string, chunk by chunk.
					* See the performances notes on arrayLikeToString.
					* @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
					* @param {String} type the type of the array.
					* @param {Integer} chunk the chunk size.
					* @return {String} the resulting string.
					* @throws Error if the chunk is too big for the stack.
					*/
					stringifyByChunk: function(array, type, chunk) {
						var result = [], k = 0, len = array.length;
						if (len <= chunk) return String.fromCharCode.apply(null, array);
						while (k < len) {
							if (type === "array" || type === "nodebuffer") result.push(String.fromCharCode.apply(null, array.slice(k, Math.min(k + chunk, len))));
							else result.push(String.fromCharCode.apply(null, array.subarray(k, Math.min(k + chunk, len))));
							k += chunk;
						}
						return result.join("");
					},
					/**
					* Call String.fromCharCode on every item in the array.
					* This is the naive implementation, which generate A LOT of intermediate string.
					* This should be used when everything else fail.
					* @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
					* @return {String} the result.
					*/
					stringifyByChar: function(array) {
						var resultStr = "";
						for (var i = 0; i < array.length; i++) resultStr += String.fromCharCode(array[i]);
						return resultStr;
					},
					applyCanBeUsed: {
						/**
						* true if the browser accepts to use String.fromCharCode on Uint8Array
						*/
						uint8array: (function() {
							try {
								return support.uint8array && String.fromCharCode.apply(null, /* @__PURE__ */ new Uint8Array(1)).length === 1;
							} catch (e) {
								return false;
							}
						})(),
						/**
						* true if the browser accepts to use String.fromCharCode on nodejs Buffer.
						*/
						nodebuffer: (function() {
							try {
								return support.nodebuffer && String.fromCharCode.apply(null, nodejsUtils.allocBuffer(1)).length === 1;
							} catch (e) {
								return false;
							}
						})()
					}
				};
				/**
				* Transform an array-like object to a string.
				* @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
				* @return {String} the result.
				*/
				function arrayLikeToString(array) {
					var chunk = 65536, type = exports$36.getTypeOf(array), canUseApply = true;
					if (type === "uint8array") canUseApply = arrayToStringHelper.applyCanBeUsed.uint8array;
					else if (type === "nodebuffer") canUseApply = arrayToStringHelper.applyCanBeUsed.nodebuffer;
					if (canUseApply) while (chunk > 1) try {
						return arrayToStringHelper.stringifyByChunk(array, type, chunk);
					} catch (e) {
						chunk = Math.floor(chunk / 2);
					}
					return arrayToStringHelper.stringifyByChar(array);
				}
				exports$36.applyFromCharCode = arrayLikeToString;
				/**
				* Copy the data from an array-like to an other array-like.
				* @param {Array|ArrayBuffer|Uint8Array|Buffer} arrayFrom the origin array.
				* @param {Array|ArrayBuffer|Uint8Array|Buffer} arrayTo the destination array which will be mutated.
				* @return {Array|ArrayBuffer|Uint8Array|Buffer} the updated destination array.
				*/
				function arrayLikeToArrayLike(arrayFrom, arrayTo) {
					for (var i = 0; i < arrayFrom.length; i++) arrayTo[i] = arrayFrom[i];
					return arrayTo;
				}
				var transform = {};
				transform["string"] = {
					"string": identity,
					"array": function(input) {
						return stringToArrayLike(input, new Array(input.length));
					},
					"arraybuffer": function(input) {
						return transform["string"]["uint8array"](input).buffer;
					},
					"uint8array": function(input) {
						return stringToArrayLike(input, new Uint8Array(input.length));
					},
					"nodebuffer": function(input) {
						return stringToArrayLike(input, nodejsUtils.allocBuffer(input.length));
					}
				};
				transform["array"] = {
					"string": arrayLikeToString,
					"array": identity,
					"arraybuffer": function(input) {
						return new Uint8Array(input).buffer;
					},
					"uint8array": function(input) {
						return new Uint8Array(input);
					},
					"nodebuffer": function(input) {
						return nodejsUtils.newBufferFrom(input);
					}
				};
				transform["arraybuffer"] = {
					"string": function(input) {
						return arrayLikeToString(new Uint8Array(input));
					},
					"array": function(input) {
						return arrayLikeToArrayLike(new Uint8Array(input), new Array(input.byteLength));
					},
					"arraybuffer": identity,
					"uint8array": function(input) {
						return new Uint8Array(input);
					},
					"nodebuffer": function(input) {
						return nodejsUtils.newBufferFrom(new Uint8Array(input));
					}
				};
				transform["uint8array"] = {
					"string": arrayLikeToString,
					"array": function(input) {
						return arrayLikeToArrayLike(input, new Array(input.length));
					},
					"arraybuffer": function(input) {
						return input.buffer;
					},
					"uint8array": identity,
					"nodebuffer": function(input) {
						return nodejsUtils.newBufferFrom(input);
					}
				};
				transform["nodebuffer"] = {
					"string": arrayLikeToString,
					"array": function(input) {
						return arrayLikeToArrayLike(input, new Array(input.length));
					},
					"arraybuffer": function(input) {
						return transform["nodebuffer"]["uint8array"](input).buffer;
					},
					"uint8array": function(input) {
						return arrayLikeToArrayLike(input, new Uint8Array(input.length));
					},
					"nodebuffer": identity
				};
				/**
				* Transform an input into any type.
				* The supported output type are : string, array, uint8array, arraybuffer, nodebuffer.
				* If no output type is specified, the unmodified input will be returned.
				* @param {String} outputType the output type.
				* @param {String|Array|ArrayBuffer|Uint8Array|Buffer} input the input to convert.
				* @throws {Error} an Error if the browser doesn't support the requested output type.
				*/
				exports$36.transformTo = function(outputType, input) {
					if (!input) input = "";
					if (!outputType) return input;
					exports$36.checkSupport(outputType);
					return transform[exports$36.getTypeOf(input)][outputType](input);
				};
				/**
				* Resolve all relative path components, "." and "..", in a path. If these relative components
				* traverse above the root then the resulting path will only contain the final path component.
				*
				* All empty components, e.g. "//", are removed.
				* @param {string} path A path with / or \ separators
				* @returns {string} The path with all relative path components resolved.
				*/
				exports$36.resolve = function(path) {
					var parts = path.split("/");
					var result = [];
					for (var index = 0; index < parts.length; index++) {
						var part = parts[index];
						if (part === "." || part === "" && index !== 0 && index !== parts.length - 1) continue;
						else if (part === "..") result.pop();
						else result.push(part);
					}
					return result.join("/");
				};
				/**
				* Return the type of the input.
				* The type will be in a format valid for JSZip.utils.transformTo : string, array, uint8array, arraybuffer.
				* @param {Object} input the input to identify.
				* @return {String} the (lowercase) type of the input.
				*/
				exports$36.getTypeOf = function(input) {
					if (typeof input === "string") return "string";
					if (Object.prototype.toString.call(input) === "[object Array]") return "array";
					if (support.nodebuffer && nodejsUtils.isBuffer(input)) return "nodebuffer";
					if (support.uint8array && input instanceof Uint8Array) return "uint8array";
					if (support.arraybuffer && input instanceof ArrayBuffer) return "arraybuffer";
				};
				/**
				* Throw an exception if the type is not supported.
				* @param {String} type the type to check.
				* @throws {Error} an Error if the browser doesn't support the requested type.
				*/
				exports$36.checkSupport = function(type) {
					if (!support[type.toLowerCase()]) throw new Error(type + " is not supported by this platform");
				};
				exports$36.MAX_VALUE_16BITS = 65535;
				exports$36.MAX_VALUE_32BITS = -1;
				/**
				* Prettify a string read as binary.
				* @param {string} str the string to prettify.
				* @return {string} a pretty string.
				*/
				exports$36.pretty = function(str) {
					var res = "", code, i;
					for (i = 0; i < (str || "").length; i++) {
						code = str.charCodeAt(i);
						res += "\\x" + (code < 16 ? "0" : "") + code.toString(16).toUpperCase();
					}
					return res;
				};
				/**
				* Defer the call of a function.
				* @param {Function} callback the function to call asynchronously.
				* @param {Array} args the arguments to give to the callback.
				*/
				exports$36.delay = function(callback, args, self) {
					setImmediate(function() {
						callback.apply(self || null, args || []);
					});
				};
				/**
				* Extends a prototype with an other, without calling a constructor with
				* side effects. Inspired by nodejs' `utils.inherits`
				* @param {Function} ctor the constructor to augment
				* @param {Function} superCtor the parent constructor to use
				*/
				exports$36.inherits = function(ctor, superCtor) {
					var Obj = function() {};
					Obj.prototype = superCtor.prototype;
					ctor.prototype = new Obj();
				};
				/**
				* Merge the objects passed as parameters into a new one.
				* @private
				* @param {...Object} var_args All objects to merge.
				* @return {Object} a new object with the data of the others.
				*/
				exports$36.extend = function() {
					var result = {}, i, attr;
					for (i = 0; i < arguments.length; i++) for (attr in arguments[i]) if (Object.prototype.hasOwnProperty.call(arguments[i], attr) && typeof result[attr] === "undefined") result[attr] = arguments[i][attr];
					return result;
				};
				/**
				* Transform arbitrary content into a Promise.
				* @param {String} name a name for the content being processed.
				* @param {Object} inputData the content to process.
				* @param {Boolean} isBinary true if the content is not an unicode string
				* @param {Boolean} isOptimizedBinaryString true if the string content only has one byte per character.
				* @param {Boolean} isBase64 true if the string content is encoded with base64.
				* @return {Promise} a promise in a format usable by JSZip.
				*/
				exports$36.prepareContent = function(name, inputData, isBinary, isOptimizedBinaryString, isBase64) {
					return external.Promise.resolve(inputData).then(function(data) {
						if (support.blob && (data instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(data)) !== -1) && typeof FileReader !== "undefined") return new external.Promise(function(resolve, reject) {
							var reader = new FileReader();
							reader.onload = function(e) {
								resolve(e.target.result);
							};
							reader.onerror = function(e) {
								reject(e.target.error);
							};
							reader.readAsArrayBuffer(data);
						});
						else return data;
					}).then(function(data) {
						var dataType = exports$36.getTypeOf(data);
						if (!dataType) return external.Promise.reject(/* @__PURE__ */ new Error("Can't read the data of '" + name + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
						if (dataType === "arraybuffer") data = exports$36.transformTo("uint8array", data);
						else if (dataType === "string") {
							if (isBase64) data = base64.decode(data);
							else if (isBinary) {
								if (isOptimizedBinaryString !== true) data = string2binary(data);
							}
						}
						return data;
					});
				};
			}, {
				"./base64": 1,
				"./external": 6,
				"./nodejsUtils": 14,
				"./support": 30,
				"setimmediate": 54
			}],
			33: [function(require, module$37, exports$37) {
				"use strict";
				var readerFor = require("./reader/readerFor");
				var utils = require("./utils");
				var sig = require("./signature");
				var ZipEntry = require("./zipEntry");
				var support = require("./support");
				/**
				* All the entries in the zip file.
				* @constructor
				* @param {Object} loadOptions Options for loading the stream.
				*/
				function ZipEntries(loadOptions) {
					this.files = [];
					this.loadOptions = loadOptions;
				}
				ZipEntries.prototype = {
					/**
					* Check that the reader is on the specified signature.
					* @param {string} expectedSignature the expected signature.
					* @throws {Error} if it is an other signature.
					*/
					checkSignature: function(expectedSignature) {
						if (!this.reader.readAndCheckSignature(expectedSignature)) {
							this.reader.index -= 4;
							var signature = this.reader.readString(4);
							throw new Error("Corrupted zip or bug: unexpected signature (" + utils.pretty(signature) + ", expected " + utils.pretty(expectedSignature) + ")");
						}
					},
					/**
					* Check if the given signature is at the given index.
					* @param {number} askedIndex the index to check.
					* @param {string} expectedSignature the signature to expect.
					* @return {boolean} true if the signature is here, false otherwise.
					*/
					isSignature: function(askedIndex, expectedSignature) {
						var currentIndex = this.reader.index;
						this.reader.setIndex(askedIndex);
						var result = this.reader.readString(4) === expectedSignature;
						this.reader.setIndex(currentIndex);
						return result;
					},
					/**
					* Read the end of the central directory.
					*/
					readBlockEndOfCentral: function() {
						this.diskNumber = this.reader.readInt(2);
						this.diskWithCentralDirStart = this.reader.readInt(2);
						this.centralDirRecordsOnThisDisk = this.reader.readInt(2);
						this.centralDirRecords = this.reader.readInt(2);
						this.centralDirSize = this.reader.readInt(4);
						this.centralDirOffset = this.reader.readInt(4);
						this.zipCommentLength = this.reader.readInt(2);
						var zipComment = this.reader.readData(this.zipCommentLength);
						var decodeParamType = support.uint8array ? "uint8array" : "array";
						var decodeContent = utils.transformTo(decodeParamType, zipComment);
						this.zipComment = this.loadOptions.decodeFileName(decodeContent);
					},
					/**
					* Read the end of the Zip 64 central directory.
					* Not merged with the method readEndOfCentral :
					* The end of central can coexist with its Zip64 brother,
					* I don't want to read the wrong number of bytes !
					*/
					readBlockZip64EndOfCentral: function() {
						this.zip64EndOfCentralSize = this.reader.readInt(8);
						this.reader.skip(4);
						this.diskNumber = this.reader.readInt(4);
						this.diskWithCentralDirStart = this.reader.readInt(4);
						this.centralDirRecordsOnThisDisk = this.reader.readInt(8);
						this.centralDirRecords = this.reader.readInt(8);
						this.centralDirSize = this.reader.readInt(8);
						this.centralDirOffset = this.reader.readInt(8);
						this.zip64ExtensibleData = {};
						var extraDataSize = this.zip64EndOfCentralSize - 44, index = 0, extraFieldId, extraFieldLength, extraFieldValue;
						while (index < extraDataSize) {
							extraFieldId = this.reader.readInt(2);
							extraFieldLength = this.reader.readInt(4);
							extraFieldValue = this.reader.readData(extraFieldLength);
							this.zip64ExtensibleData[extraFieldId] = {
								id: extraFieldId,
								length: extraFieldLength,
								value: extraFieldValue
							};
						}
					},
					/**
					* Read the end of the Zip 64 central directory locator.
					*/
					readBlockZip64EndOfCentralLocator: function() {
						this.diskWithZip64CentralDirStart = this.reader.readInt(4);
						this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8);
						this.disksCount = this.reader.readInt(4);
						if (this.disksCount > 1) throw new Error("Multi-volumes zip are not supported");
					},
					/**
					* Read the local files, based on the offset read in the central part.
					*/
					readLocalFiles: function() {
						var i, file;
						for (i = 0; i < this.files.length; i++) {
							file = this.files[i];
							this.reader.setIndex(file.localHeaderOffset);
							this.checkSignature(sig.LOCAL_FILE_HEADER);
							file.readLocalPart(this.reader);
							file.handleUTF8();
							file.processAttributes();
						}
					},
					/**
					* Read the central directory.
					*/
					readCentralDir: function() {
						var file;
						this.reader.setIndex(this.centralDirOffset);
						while (this.reader.readAndCheckSignature(sig.CENTRAL_FILE_HEADER)) {
							file = new ZipEntry({ zip64: this.zip64 }, this.loadOptions);
							file.readCentralPart(this.reader);
							this.files.push(file);
						}
						if (this.centralDirRecords !== this.files.length) {
							if (this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
						}
					},
					/**
					* Read the end of central directory.
					*/
					readEndOfCentral: function() {
						var offset = this.reader.lastIndexOfSignature(sig.CENTRAL_DIRECTORY_END);
						if (offset < 0) if (!this.isSignature(0, sig.LOCAL_FILE_HEADER)) throw new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
						else throw new Error("Corrupted zip: can't find end of central directory");
						this.reader.setIndex(offset);
						var endOfCentralDirOffset = offset;
						this.checkSignature(sig.CENTRAL_DIRECTORY_END);
						this.readBlockEndOfCentral();
						if (this.diskNumber === utils.MAX_VALUE_16BITS || this.diskWithCentralDirStart === utils.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === utils.MAX_VALUE_16BITS || this.centralDirRecords === utils.MAX_VALUE_16BITS || this.centralDirSize === utils.MAX_VALUE_32BITS || this.centralDirOffset === utils.MAX_VALUE_32BITS) {
							this.zip64 = true;
							offset = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
							if (offset < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
							this.reader.setIndex(offset);
							this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
							this.readBlockZip64EndOfCentralLocator();
							if (!this.isSignature(this.relativeOffsetEndOfZip64CentralDir, sig.ZIP64_CENTRAL_DIRECTORY_END)) {
								this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
								if (this.relativeOffsetEndOfZip64CentralDir < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
							}
							this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir);
							this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
							this.readBlockZip64EndOfCentral();
						}
						var expectedEndOfCentralDirOffset = this.centralDirOffset + this.centralDirSize;
						if (this.zip64) {
							expectedEndOfCentralDirOffset += 20;
							expectedEndOfCentralDirOffset += 12 + this.zip64EndOfCentralSize;
						}
						var extraBytes = endOfCentralDirOffset - expectedEndOfCentralDirOffset;
						if (extraBytes > 0) if (this.isSignature(endOfCentralDirOffset, sig.CENTRAL_FILE_HEADER)) {} else this.reader.zero = extraBytes;
						else if (extraBytes < 0) throw new Error("Corrupted zip: missing " + Math.abs(extraBytes) + " bytes.");
					},
					prepareReader: function(data) {
						this.reader = readerFor(data);
					},
					/**
					* Read a zip file and create ZipEntries.
					* @param {String|ArrayBuffer|Uint8Array|Buffer} data the binary string representing a zip file.
					*/
					load: function(data) {
						this.prepareReader(data);
						this.readEndOfCentral();
						this.readCentralDir();
						this.readLocalFiles();
					}
				};
				module$37.exports = ZipEntries;
			}, {
				"./reader/readerFor": 22,
				"./signature": 23,
				"./support": 30,
				"./utils": 32,
				"./zipEntry": 34
			}],
			34: [function(require, module$38, exports$38) {
				"use strict";
				var readerFor = require("./reader/readerFor");
				var utils = require("./utils");
				var CompressedObject = require("./compressedObject");
				var crc32fn = require("./crc32");
				var utf8 = require("./utf8");
				var compressions = require("./compressions");
				var support = require("./support");
				var MADE_BY_DOS = 0;
				var MADE_BY_UNIX = 3;
				/**
				* Find a compression registered in JSZip.
				* @param {string} compressionMethod the method magic to find.
				* @return {Object|null} the JSZip compression object, null if none found.
				*/
				var findCompression = function(compressionMethod) {
					for (var method in compressions) {
						if (!Object.prototype.hasOwnProperty.call(compressions, method)) continue;
						if (compressions[method].magic === compressionMethod) return compressions[method];
					}
					return null;
				};
				/**
				* An entry in the zip file.
				* @constructor
				* @param {Object} options Options of the current file.
				* @param {Object} loadOptions Options for loading the stream.
				*/
				function ZipEntry(options, loadOptions) {
					this.options = options;
					this.loadOptions = loadOptions;
				}
				ZipEntry.prototype = {
					/**
					* say if the file is encrypted.
					* @return {boolean} true if the file is encrypted, false otherwise.
					*/
					isEncrypted: function() {
						return (this.bitFlag & 1) === 1;
					},
					/**
					* say if the file has utf-8 filename/comment.
					* @return {boolean} true if the filename/comment is in utf-8, false otherwise.
					*/
					useUTF8: function() {
						return (this.bitFlag & 2048) === 2048;
					},
					/**
					* Read the local part of a zip file and add the info in this object.
					* @param {DataReader} reader the reader to use.
					*/
					readLocalPart: function(reader) {
						var compression, localExtraFieldsLength;
						reader.skip(22);
						this.fileNameLength = reader.readInt(2);
						localExtraFieldsLength = reader.readInt(2);
						this.fileName = reader.readData(this.fileNameLength);
						reader.skip(localExtraFieldsLength);
						if (this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
						compression = findCompression(this.compressionMethod);
						if (compression === null) throw new Error("Corrupted zip : compression " + utils.pretty(this.compressionMethod) + " unknown (inner file : " + utils.transformTo("string", this.fileName) + ")");
						this.decompressed = new CompressedObject(this.compressedSize, this.uncompressedSize, this.crc32, compression, reader.readData(this.compressedSize));
					},
					/**
					* Read the central part of a zip file and add the info in this object.
					* @param {DataReader} reader the reader to use.
					*/
					readCentralPart: function(reader) {
						this.versionMadeBy = reader.readInt(2);
						reader.skip(2);
						this.bitFlag = reader.readInt(2);
						this.compressionMethod = reader.readString(2);
						this.date = reader.readDate();
						this.crc32 = reader.readInt(4);
						this.compressedSize = reader.readInt(4);
						this.uncompressedSize = reader.readInt(4);
						var fileNameLength = reader.readInt(2);
						this.extraFieldsLength = reader.readInt(2);
						this.fileCommentLength = reader.readInt(2);
						this.diskNumberStart = reader.readInt(2);
						this.internalFileAttributes = reader.readInt(2);
						this.externalFileAttributes = reader.readInt(4);
						this.localHeaderOffset = reader.readInt(4);
						if (this.isEncrypted()) throw new Error("Encrypted zip are not supported");
						reader.skip(fileNameLength);
						this.readExtraFields(reader);
						this.parseZIP64ExtraField(reader);
						this.fileComment = reader.readData(this.fileCommentLength);
					},
					/**
					* Parse the external file attributes and get the unix/dos permissions.
					*/
					processAttributes: function() {
						this.unixPermissions = null;
						this.dosPermissions = null;
						var madeBy = this.versionMadeBy >> 8;
						this.dir = this.externalFileAttributes & 16 ? true : false;
						if (madeBy === MADE_BY_DOS) this.dosPermissions = this.externalFileAttributes & 63;
						if (madeBy === MADE_BY_UNIX) this.unixPermissions = this.externalFileAttributes >> 16 & 65535;
						if (!this.dir && this.fileNameStr.slice(-1) === "/") this.dir = true;
					},
					/**
					* Parse the ZIP64 extra field and merge the info in the current ZipEntry.
					* @param {DataReader} reader the reader to use.
					*/
					parseZIP64ExtraField: function() {
						if (!this.extraFields[1]) return;
						var extraReader = readerFor(this.extraFields[1].value);
						if (this.uncompressedSize === utils.MAX_VALUE_32BITS) this.uncompressedSize = extraReader.readInt(8);
						if (this.compressedSize === utils.MAX_VALUE_32BITS) this.compressedSize = extraReader.readInt(8);
						if (this.localHeaderOffset === utils.MAX_VALUE_32BITS) this.localHeaderOffset = extraReader.readInt(8);
						if (this.diskNumberStart === utils.MAX_VALUE_32BITS) this.diskNumberStart = extraReader.readInt(4);
					},
					/**
					* Read the central part of a zip file and add the info in this object.
					* @param {DataReader} reader the reader to use.
					*/
					readExtraFields: function(reader) {
						var end = reader.index + this.extraFieldsLength, extraFieldId, extraFieldLength, extraFieldValue;
						if (!this.extraFields) this.extraFields = {};
						while (reader.index + 4 < end) {
							extraFieldId = reader.readInt(2);
							extraFieldLength = reader.readInt(2);
							extraFieldValue = reader.readData(extraFieldLength);
							this.extraFields[extraFieldId] = {
								id: extraFieldId,
								length: extraFieldLength,
								value: extraFieldValue
							};
						}
						reader.setIndex(end);
					},
					/**
					* Apply an UTF8 transformation if needed.
					*/
					handleUTF8: function() {
						var decodeParamType = support.uint8array ? "uint8array" : "array";
						if (this.useUTF8()) {
							this.fileNameStr = utf8.utf8decode(this.fileName);
							this.fileCommentStr = utf8.utf8decode(this.fileComment);
						} else {
							var upath = this.findExtraFieldUnicodePath();
							if (upath !== null) this.fileNameStr = upath;
							else {
								var fileNameByteArray = utils.transformTo(decodeParamType, this.fileName);
								this.fileNameStr = this.loadOptions.decodeFileName(fileNameByteArray);
							}
							var ucomment = this.findExtraFieldUnicodeComment();
							if (ucomment !== null) this.fileCommentStr = ucomment;
							else {
								var commentByteArray = utils.transformTo(decodeParamType, this.fileComment);
								this.fileCommentStr = this.loadOptions.decodeFileName(commentByteArray);
							}
						}
					},
					/**
					* Find the unicode path declared in the extra field, if any.
					* @return {String} the unicode path, null otherwise.
					*/
					findExtraFieldUnicodePath: function() {
						var upathField = this.extraFields[28789];
						if (upathField) {
							var extraReader = readerFor(upathField.value);
							if (extraReader.readInt(1) !== 1) return null;
							if (crc32fn(this.fileName) !== extraReader.readInt(4)) return null;
							return utf8.utf8decode(extraReader.readData(upathField.length - 5));
						}
						return null;
					},
					/**
					* Find the unicode comment declared in the extra field, if any.
					* @return {String} the unicode comment, null otherwise.
					*/
					findExtraFieldUnicodeComment: function() {
						var ucommentField = this.extraFields[25461];
						if (ucommentField) {
							var extraReader = readerFor(ucommentField.value);
							if (extraReader.readInt(1) !== 1) return null;
							if (crc32fn(this.fileComment) !== extraReader.readInt(4)) return null;
							return utf8.utf8decode(extraReader.readData(ucommentField.length - 5));
						}
						return null;
					}
				};
				module$38.exports = ZipEntry;
			}, {
				"./compressedObject": 2,
				"./compressions": 3,
				"./crc32": 4,
				"./reader/readerFor": 22,
				"./support": 30,
				"./utf8": 31,
				"./utils": 32
			}],
			35: [function(require, module$39, exports$39) {
				"use strict";
				var StreamHelper = require("./stream/StreamHelper");
				var DataWorker = require("./stream/DataWorker");
				var utf8 = require("./utf8");
				var CompressedObject = require("./compressedObject");
				var GenericWorker = require("./stream/GenericWorker");
				/**
				* A simple object representing a file in the zip file.
				* @constructor
				* @param {string} name the name of the file
				* @param {String|ArrayBuffer|Uint8Array|Buffer} data the data
				* @param {Object} options the options of the file
				*/
				var ZipObject = function(name, data, options) {
					this.name = name;
					this.dir = options.dir;
					this.date = options.date;
					this.comment = options.comment;
					this.unixPermissions = options.unixPermissions;
					this.dosPermissions = options.dosPermissions;
					this._data = data;
					this._dataBinary = options.binary;
					this.options = {
						compression: options.compression,
						compressionOptions: options.compressionOptions
					};
				};
				ZipObject.prototype = {
					/**
					* Create an internal stream for the content of this object.
					* @param {String} type the type of each chunk.
					* @return StreamHelper the stream.
					*/
					internalStream: function(type) {
						var result = null, outputType = "string";
						try {
							if (!type) throw new Error("No output type specified.");
							outputType = type.toLowerCase();
							var askUnicodeString = outputType === "string" || outputType === "text";
							if (outputType === "binarystring" || outputType === "text") outputType = "string";
							result = this._decompressWorker();
							var isUnicodeString = !this._dataBinary;
							if (isUnicodeString && !askUnicodeString) result = result.pipe(new utf8.Utf8EncodeWorker());
							if (!isUnicodeString && askUnicodeString) result = result.pipe(new utf8.Utf8DecodeWorker());
						} catch (e) {
							result = new GenericWorker("error");
							result.error(e);
						}
						return new StreamHelper(result, outputType, "");
					},
					/**
					* Prepare the content in the asked type.
					* @param {String} type the type of the result.
					* @param {Function} onUpdate a function to call on each internal update.
					* @return Promise the promise of the result.
					*/
					async: function(type, onUpdate) {
						return this.internalStream(type).accumulate(onUpdate);
					},
					/**
					* Prepare the content as a nodejs stream.
					* @param {String} type the type of each chunk.
					* @param {Function} onUpdate a function to call on each internal update.
					* @return Stream the stream.
					*/
					nodeStream: function(type, onUpdate) {
						return this.internalStream(type || "nodebuffer").toNodejsStream(onUpdate);
					},
					/**
					* Return a worker for the compressed content.
					* @private
					* @param {Object} compression the compression object to use.
					* @param {Object} compressionOptions the options to use when compressing.
					* @return Worker the worker.
					*/
					_compressWorker: function(compression, compressionOptions) {
						if (this._data instanceof CompressedObject && this._data.compression.magic === compression.magic) return this._data.getCompressedWorker();
						else {
							var result = this._decompressWorker();
							if (!this._dataBinary) result = result.pipe(new utf8.Utf8EncodeWorker());
							return CompressedObject.createWorkerFrom(result, compression, compressionOptions);
						}
					},
					/**
					* Return a worker for the decompressed content.
					* @private
					* @return Worker the worker.
					*/
					_decompressWorker: function() {
						if (this._data instanceof CompressedObject) return this._data.getContentWorker();
						else if (this._data instanceof GenericWorker) return this._data;
						else return new DataWorker(this._data);
					}
				};
				var removedMethods = [
					"asText",
					"asBinary",
					"asNodeBuffer",
					"asUint8Array",
					"asArrayBuffer"
				];
				var removedFn = function() {
					throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
				};
				for (var i = 0; i < removedMethods.length; i++) ZipObject.prototype[removedMethods[i]] = removedFn;
				module$39.exports = ZipObject;
			}, {
				"./compressedObject": 2,
				"./stream/DataWorker": 27,
				"./stream/GenericWorker": 28,
				"./stream/StreamHelper": 29,
				"./utf8": 31
			}],
			36: [function(require, module$40, exports$40) {
				(function(global) {
					"use strict";
					var Mutation = global.MutationObserver || global.WebKitMutationObserver;
					var scheduleDrain;
					if (Mutation) {
						var called = 0;
						var observer = new Mutation(nextTick);
						var element = global.document.createTextNode("");
						observer.observe(element, { characterData: true });
						scheduleDrain = function() {
							element.data = called = ++called % 2;
						};
					} else if (!global.setImmediate && typeof global.MessageChannel !== "undefined") {
						var channel = new global.MessageChannel();
						channel.port1.onmessage = nextTick;
						scheduleDrain = function() {
							channel.port2.postMessage(0);
						};
					} else if ("document" in global && "onreadystatechange" in global.document.createElement("script")) scheduleDrain = function() {
						var scriptEl = global.document.createElement("script");
						scriptEl.onreadystatechange = function() {
							nextTick();
							scriptEl.onreadystatechange = null;
							scriptEl.parentNode.removeChild(scriptEl);
							scriptEl = null;
						};
						global.document.documentElement.appendChild(scriptEl);
					};
					else scheduleDrain = function() {
						setTimeout(nextTick, 0);
					};
					var draining;
					var queue = [];
					function nextTick() {
						draining = true;
						var i, oldQueue;
						var len = queue.length;
						while (len) {
							oldQueue = queue;
							queue = [];
							i = -1;
							while (++i < len) oldQueue[i]();
							len = queue.length;
						}
						draining = false;
					}
					module$40.exports = immediate;
					function immediate(task) {
						if (queue.push(task) === 1 && !draining) scheduleDrain();
					}
				}).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
			}, {}],
			37: [function(require, module$41, exports$41) {
				"use strict";
				var immediate = require("immediate");
				/* istanbul ignore next */
				function INTERNAL() {}
				var handlers = {};
				var REJECTED = ["REJECTED"];
				var FULFILLED = ["FULFILLED"];
				var PENDING = ["PENDING"];
				module$41.exports = Promise;
				function Promise(resolver) {
					if (typeof resolver !== "function") throw new TypeError("resolver must be a function");
					this.state = PENDING;
					this.queue = [];
					this.outcome = void 0;
					if (resolver !== INTERNAL) safelyResolveThenable(this, resolver);
				}
				Promise.prototype["finally"] = function(callback) {
					if (typeof callback !== "function") return this;
					var p = this.constructor;
					return this.then(resolve, reject);
					function resolve(value) {
						function yes() {
							return value;
						}
						return p.resolve(callback()).then(yes);
					}
					function reject(reason) {
						function no() {
							throw reason;
						}
						return p.resolve(callback()).then(no);
					}
				};
				Promise.prototype["catch"] = function(onRejected) {
					return this.then(null, onRejected);
				};
				Promise.prototype.then = function(onFulfilled, onRejected) {
					if (typeof onFulfilled !== "function" && this.state === FULFILLED || typeof onRejected !== "function" && this.state === REJECTED) return this;
					var promise = new this.constructor(INTERNAL);
					if (this.state !== PENDING) unwrap(promise, this.state === FULFILLED ? onFulfilled : onRejected, this.outcome);
					else this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
					return promise;
				};
				function QueueItem(promise, onFulfilled, onRejected) {
					this.promise = promise;
					if (typeof onFulfilled === "function") {
						this.onFulfilled = onFulfilled;
						this.callFulfilled = this.otherCallFulfilled;
					}
					if (typeof onRejected === "function") {
						this.onRejected = onRejected;
						this.callRejected = this.otherCallRejected;
					}
				}
				QueueItem.prototype.callFulfilled = function(value) {
					handlers.resolve(this.promise, value);
				};
				QueueItem.prototype.otherCallFulfilled = function(value) {
					unwrap(this.promise, this.onFulfilled, value);
				};
				QueueItem.prototype.callRejected = function(value) {
					handlers.reject(this.promise, value);
				};
				QueueItem.prototype.otherCallRejected = function(value) {
					unwrap(this.promise, this.onRejected, value);
				};
				function unwrap(promise, func, value) {
					immediate(function() {
						var returnValue;
						try {
							returnValue = func(value);
						} catch (e) {
							return handlers.reject(promise, e);
						}
						if (returnValue === promise) handlers.reject(promise, /* @__PURE__ */ new TypeError("Cannot resolve promise with itself"));
						else handlers.resolve(promise, returnValue);
					});
				}
				handlers.resolve = function(self, value) {
					var result = tryCatch(getThen, value);
					if (result.status === "error") return handlers.reject(self, result.value);
					var thenable = result.value;
					if (thenable) safelyResolveThenable(self, thenable);
					else {
						self.state = FULFILLED;
						self.outcome = value;
						var i = -1;
						var len = self.queue.length;
						while (++i < len) self.queue[i].callFulfilled(value);
					}
					return self;
				};
				handlers.reject = function(self, error) {
					self.state = REJECTED;
					self.outcome = error;
					var i = -1;
					var len = self.queue.length;
					while (++i < len) self.queue[i].callRejected(error);
					return self;
				};
				function getThen(obj) {
					var then = obj && obj.then;
					if (obj && (typeof obj === "object" || typeof obj === "function") && typeof then === "function") return function appyThen() {
						then.apply(obj, arguments);
					};
				}
				function safelyResolveThenable(self, thenable) {
					var called = false;
					function onError(value) {
						if (called) return;
						called = true;
						handlers.reject(self, value);
					}
					function onSuccess(value) {
						if (called) return;
						called = true;
						handlers.resolve(self, value);
					}
					function tryToUnwrap() {
						thenable(onSuccess, onError);
					}
					var result = tryCatch(tryToUnwrap);
					if (result.status === "error") onError(result.value);
				}
				function tryCatch(func, value) {
					var out = {};
					try {
						out.value = func(value);
						out.status = "success";
					} catch (e) {
						out.status = "error";
						out.value = e;
					}
					return out;
				}
				Promise.resolve = resolve;
				function resolve(value) {
					if (value instanceof this) return value;
					return handlers.resolve(new this(INTERNAL), value);
				}
				Promise.reject = reject;
				function reject(reason) {
					var promise = new this(INTERNAL);
					return handlers.reject(promise, reason);
				}
				Promise.all = all;
				function all(iterable) {
					var self = this;
					if (Object.prototype.toString.call(iterable) !== "[object Array]") return this.reject(/* @__PURE__ */ new TypeError("must be an array"));
					var len = iterable.length;
					var called = false;
					if (!len) return this.resolve([]);
					var values = new Array(len);
					var resolved = 0;
					var i = -1;
					var promise = new this(INTERNAL);
					while (++i < len) allResolver(iterable[i], i);
					return promise;
					function allResolver(value, i) {
						self.resolve(value).then(resolveFromAll, function(error) {
							if (!called) {
								called = true;
								handlers.reject(promise, error);
							}
						});
						function resolveFromAll(outValue) {
							values[i] = outValue;
							if (++resolved === len && !called) {
								called = true;
								handlers.resolve(promise, values);
							}
						}
					}
				}
				Promise.race = race;
				function race(iterable) {
					var self = this;
					if (Object.prototype.toString.call(iterable) !== "[object Array]") return this.reject(/* @__PURE__ */ new TypeError("must be an array"));
					var len = iterable.length;
					var called = false;
					if (!len) return this.resolve([]);
					var i = -1;
					var promise = new this(INTERNAL);
					while (++i < len) resolver(iterable[i]);
					return promise;
					function resolver(value) {
						self.resolve(value).then(function(response) {
							if (!called) {
								called = true;
								handlers.resolve(promise, response);
							}
						}, function(error) {
							if (!called) {
								called = true;
								handlers.reject(promise, error);
							}
						});
					}
				}
			}, { "immediate": 36 }],
			38: [function(require, module$42, exports$42) {
				"use strict";
				var assign = require("./lib/utils/common").assign;
				var deflate = require("./lib/deflate");
				var inflate = require("./lib/inflate");
				var constants = require("./lib/zlib/constants");
				var pako = {};
				assign(pako, deflate, inflate, constants);
				module$42.exports = pako;
			}, {
				"./lib/deflate": 39,
				"./lib/inflate": 40,
				"./lib/utils/common": 41,
				"./lib/zlib/constants": 44
			}],
			39: [function(require, module$43, exports$43) {
				"use strict";
				var zlib_deflate = require("./zlib/deflate");
				var utils = require("./utils/common");
				var strings = require("./utils/strings");
				var msg = require("./zlib/messages");
				var ZStream = require("./zlib/zstream");
				var toString = Object.prototype.toString;
				var Z_NO_FLUSH = 0;
				var Z_FINISH = 4;
				var Z_OK = 0;
				var Z_STREAM_END = 1;
				var Z_SYNC_FLUSH = 2;
				var Z_DEFAULT_COMPRESSION = -1;
				var Z_DEFAULT_STRATEGY = 0;
				var Z_DEFLATED = 8;
				/**
				* class Deflate
				*
				* Generic JS-style wrapper for zlib calls. If you don't need
				* streaming behaviour - use more simple functions: [[deflate]],
				* [[deflateRaw]] and [[gzip]].
				**/
				/**
				* Deflate.result -> Uint8Array|Array
				*
				* Compressed result, generated by default [[Deflate#onData]]
				* and [[Deflate#onEnd]] handlers. Filled after you push last chunk
				* (call [[Deflate#push]] with `Z_FINISH` / `true` param)  or if you
				* push a chunk with explicit flush (call [[Deflate#push]] with
				* `Z_SYNC_FLUSH` param).
				**/
				/**
				* Deflate.err -> Number
				*
				* Error code after deflate finished. 0 (Z_OK) on success.
				* You will not need it in real life, because deflate errors
				* are possible only on wrong options or bad `onData` / `onEnd`
				* custom handlers.
				**/
				/**
				* Deflate.msg -> String
				*
				* Error message, if [[Deflate.err]] != 0
				**/
				/**
				* new Deflate(options)
				* - options (Object): zlib deflate options.
				*
				* Creates new deflator instance with specified params. Throws exception
				* on bad params. Supported options:
				*
				* - `level`
				* - `windowBits`
				* - `memLevel`
				* - `strategy`
				* - `dictionary`
				*
				* [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
				* for more information on these.
				*
				* Additional options, for internal needs:
				*
				* - `chunkSize` - size of generated data chunks (16K by default)
				* - `raw` (Boolean) - do raw deflate
				* - `gzip` (Boolean) - create gzip wrapper
				* - `to` (String) - if equal to 'string', then result will be "binary string"
				*    (each char code [0..255])
				* - `header` (Object) - custom header for gzip
				*   - `text` (Boolean) - true if compressed data believed to be text
				*   - `time` (Number) - modification time, unix timestamp
				*   - `os` (Number) - operation system code
				*   - `extra` (Array) - array of bytes with extra data (max 65536)
				*   - `name` (String) - file name (binary string)
				*   - `comment` (String) - comment (binary string)
				*   - `hcrc` (Boolean) - true if header crc should be added
				*
				* ##### Example:
				*
				* ```javascript
				* var pako = require('pako')
				*   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
				*   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
				*
				* var deflate = new pako.Deflate({ level: 3});
				*
				* deflate.push(chunk1, false);
				* deflate.push(chunk2, true);  // true -> last chunk
				*
				* if (deflate.err) { throw new Error(deflate.err); }
				*
				* console.log(deflate.result);
				* ```
				**/
				function Deflate(options) {
					if (!(this instanceof Deflate)) return new Deflate(options);
					this.options = utils.assign({
						level: Z_DEFAULT_COMPRESSION,
						method: Z_DEFLATED,
						chunkSize: 16384,
						windowBits: 15,
						memLevel: 8,
						strategy: Z_DEFAULT_STRATEGY,
						to: ""
					}, options || {});
					var opt = this.options;
					if (opt.raw && opt.windowBits > 0) opt.windowBits = -opt.windowBits;
					else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) opt.windowBits += 16;
					this.err = 0;
					this.msg = "";
					this.ended = false;
					this.chunks = [];
					this.strm = new ZStream();
					this.strm.avail_out = 0;
					var status = zlib_deflate.deflateInit2(this.strm, opt.level, opt.method, opt.windowBits, opt.memLevel, opt.strategy);
					if (status !== Z_OK) throw new Error(msg[status]);
					if (opt.header) zlib_deflate.deflateSetHeader(this.strm, opt.header);
					if (opt.dictionary) {
						var dict;
						if (typeof opt.dictionary === "string") dict = strings.string2buf(opt.dictionary);
						else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") dict = new Uint8Array(opt.dictionary);
						else dict = opt.dictionary;
						status = zlib_deflate.deflateSetDictionary(this.strm, dict);
						if (status !== Z_OK) throw new Error(msg[status]);
						this._dict_set = true;
					}
				}
				/**
				* Deflate#push(data[, mode]) -> Boolean
				* - data (Uint8Array|Array|ArrayBuffer|String): input data. Strings will be
				*   converted to utf8 byte sequence.
				* - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
				*   See constants. Skipped or `false` means Z_NO_FLUSH, `true` meansh Z_FINISH.
				*
				* Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
				* new compressed chunks. Returns `true` on success. The last data block must have
				* mode Z_FINISH (or `true`). That will flush internal pending buffers and call
				* [[Deflate#onEnd]]. For interim explicit flushes (without ending the stream) you
				* can use mode Z_SYNC_FLUSH, keeping the compression context.
				*
				* On fail call [[Deflate#onEnd]] with error code and return false.
				*
				* We strongly recommend to use `Uint8Array` on input for best speed (output
				* array format is detected automatically). Also, don't skip last param and always
				* use the same type in your code (boolean or number). That will improve JS speed.
				*
				* For regular `Array`-s make sure all elements are [0..255].
				*
				* ##### Example
				*
				* ```javascript
				* push(chunk, false); // push one of data chunks
				* ...
				* push(chunk, true);  // push last chunk
				* ```
				**/
				Deflate.prototype.push = function(data, mode) {
					var strm = this.strm;
					var chunkSize = this.options.chunkSize;
					var status, _mode;
					if (this.ended) return false;
					_mode = mode === ~~mode ? mode : mode === true ? Z_FINISH : Z_NO_FLUSH;
					if (typeof data === "string") strm.input = strings.string2buf(data);
					else if (toString.call(data) === "[object ArrayBuffer]") strm.input = new Uint8Array(data);
					else strm.input = data;
					strm.next_in = 0;
					strm.avail_in = strm.input.length;
					do {
						if (strm.avail_out === 0) {
							strm.output = new utils.Buf8(chunkSize);
							strm.next_out = 0;
							strm.avail_out = chunkSize;
						}
						status = zlib_deflate.deflate(strm, _mode);
						if (status !== Z_STREAM_END && status !== Z_OK) {
							this.onEnd(status);
							this.ended = true;
							return false;
						}
						if (strm.avail_out === 0 || strm.avail_in === 0 && (_mode === Z_FINISH || _mode === Z_SYNC_FLUSH)) if (this.options.to === "string") this.onData(strings.buf2binstring(utils.shrinkBuf(strm.output, strm.next_out)));
						else this.onData(utils.shrinkBuf(strm.output, strm.next_out));
					} while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== Z_STREAM_END);
					if (_mode === Z_FINISH) {
						status = zlib_deflate.deflateEnd(this.strm);
						this.onEnd(status);
						this.ended = true;
						return status === Z_OK;
					}
					if (_mode === Z_SYNC_FLUSH) {
						this.onEnd(Z_OK);
						strm.avail_out = 0;
						return true;
					}
					return true;
				};
				/**
				* Deflate#onData(chunk) -> Void
				* - chunk (Uint8Array|Array|String): ouput data. Type of array depends
				*   on js engine support. When string output requested, each chunk
				*   will be string.
				*
				* By default, stores data blocks in `chunks[]` property and glue
				* those in `onEnd`. Override this handler, if you need another behaviour.
				**/
				Deflate.prototype.onData = function(chunk) {
					this.chunks.push(chunk);
				};
				/**
				* Deflate#onEnd(status) -> Void
				* - status (Number): deflate status. 0 (Z_OK) on success,
				*   other if not.
				*
				* Called once after you tell deflate that the input stream is
				* complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
				* or if an error happened. By default - join collected chunks,
				* free memory and fill `results` / `err` properties.
				**/
				Deflate.prototype.onEnd = function(status) {
					if (status === Z_OK) if (this.options.to === "string") this.result = this.chunks.join("");
					else this.result = utils.flattenChunks(this.chunks);
					this.chunks = [];
					this.err = status;
					this.msg = this.strm.msg;
				};
				/**
				* deflate(data[, options]) -> Uint8Array|Array|String
				* - data (Uint8Array|Array|String): input data to compress.
				* - options (Object): zlib deflate options.
				*
				* Compress `data` with deflate algorithm and `options`.
				*
				* Supported options are:
				*
				* - level
				* - windowBits
				* - memLevel
				* - strategy
				* - dictionary
				*
				* [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
				* for more information on these.
				*
				* Sugar (options):
				*
				* - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
				*   negative windowBits implicitly.
				* - `to` (String) - if equal to 'string', then result will be "binary string"
				*    (each char code [0..255])
				*
				* ##### Example:
				*
				* ```javascript
				* var pako = require('pako')
				*   , data = Uint8Array([1,2,3,4,5,6,7,8,9]);
				*
				* console.log(pako.deflate(data));
				* ```
				**/
				function deflate(input, options) {
					var deflator = new Deflate(options);
					deflator.push(input, true);
					if (deflator.err) throw deflator.msg || msg[deflator.err];
					return deflator.result;
				}
				/**
				* deflateRaw(data[, options]) -> Uint8Array|Array|String
				* - data (Uint8Array|Array|String): input data to compress.
				* - options (Object): zlib deflate options.
				*
				* The same as [[deflate]], but creates raw data, without wrapper
				* (header and adler32 crc).
				**/
				function deflateRaw(input, options) {
					options = options || {};
					options.raw = true;
					return deflate(input, options);
				}
				/**
				* gzip(data[, options]) -> Uint8Array|Array|String
				* - data (Uint8Array|Array|String): input data to compress.
				* - options (Object): zlib deflate options.
				*
				* The same as [[deflate]], but create gzip wrapper instead of
				* deflate one.
				**/
				function gzip(input, options) {
					options = options || {};
					options.gzip = true;
					return deflate(input, options);
				}
				exports$43.Deflate = Deflate;
				exports$43.deflate = deflate;
				exports$43.deflateRaw = deflateRaw;
				exports$43.gzip = gzip;
			}, {
				"./utils/common": 41,
				"./utils/strings": 42,
				"./zlib/deflate": 46,
				"./zlib/messages": 51,
				"./zlib/zstream": 53
			}],
			40: [function(require, module$44, exports$44) {
				"use strict";
				var zlib_inflate = require("./zlib/inflate");
				var utils = require("./utils/common");
				var strings = require("./utils/strings");
				var c = require("./zlib/constants");
				var msg = require("./zlib/messages");
				var ZStream = require("./zlib/zstream");
				var GZheader = require("./zlib/gzheader");
				var toString = Object.prototype.toString;
				/**
				* class Inflate
				*
				* Generic JS-style wrapper for zlib calls. If you don't need
				* streaming behaviour - use more simple functions: [[inflate]]
				* and [[inflateRaw]].
				**/
				/**
				* Inflate.result -> Uint8Array|Array|String
				*
				* Uncompressed result, generated by default [[Inflate#onData]]
				* and [[Inflate#onEnd]] handlers. Filled after you push last chunk
				* (call [[Inflate#push]] with `Z_FINISH` / `true` param) or if you
				* push a chunk with explicit flush (call [[Inflate#push]] with
				* `Z_SYNC_FLUSH` param).
				**/
				/**
				* Inflate.err -> Number
				*
				* Error code after inflate finished. 0 (Z_OK) on success.
				* Should be checked if broken data possible.
				**/
				/**
				* Inflate.msg -> String
				*
				* Error message, if [[Inflate.err]] != 0
				**/
				/**
				* new Inflate(options)
				* - options (Object): zlib inflate options.
				*
				* Creates new inflator instance with specified params. Throws exception
				* on bad params. Supported options:
				*
				* - `windowBits`
				* - `dictionary`
				*
				* [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
				* for more information on these.
				*
				* Additional options, for internal needs:
				*
				* - `chunkSize` - size of generated data chunks (16K by default)
				* - `raw` (Boolean) - do raw inflate
				* - `to` (String) - if equal to 'string', then result will be converted
				*   from utf8 to utf16 (javascript) string. When string output requested,
				*   chunk length can differ from `chunkSize`, depending on content.
				*
				* By default, when no options set, autodetect deflate/gzip data format via
				* wrapper header.
				*
				* ##### Example:
				*
				* ```javascript
				* var pako = require('pako')
				*   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
				*   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
				*
				* var inflate = new pako.Inflate({ level: 3});
				*
				* inflate.push(chunk1, false);
				* inflate.push(chunk2, true);  // true -> last chunk
				*
				* if (inflate.err) { throw new Error(inflate.err); }
				*
				* console.log(inflate.result);
				* ```
				**/
				function Inflate(options) {
					if (!(this instanceof Inflate)) return new Inflate(options);
					this.options = utils.assign({
						chunkSize: 16384,
						windowBits: 0,
						to: ""
					}, options || {});
					var opt = this.options;
					if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
						opt.windowBits = -opt.windowBits;
						if (opt.windowBits === 0) opt.windowBits = -15;
					}
					if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) opt.windowBits += 32;
					if (opt.windowBits > 15 && opt.windowBits < 48) {
						if ((opt.windowBits & 15) === 0) opt.windowBits |= 15;
					}
					this.err = 0;
					this.msg = "";
					this.ended = false;
					this.chunks = [];
					this.strm = new ZStream();
					this.strm.avail_out = 0;
					var status = zlib_inflate.inflateInit2(this.strm, opt.windowBits);
					if (status !== c.Z_OK) throw new Error(msg[status]);
					this.header = new GZheader();
					zlib_inflate.inflateGetHeader(this.strm, this.header);
				}
				/**
				* Inflate#push(data[, mode]) -> Boolean
				* - data (Uint8Array|Array|ArrayBuffer|String): input data
				* - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
				*   See constants. Skipped or `false` means Z_NO_FLUSH, `true` meansh Z_FINISH.
				*
				* Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
				* new output chunks. Returns `true` on success. The last data block must have
				* mode Z_FINISH (or `true`). That will flush internal pending buffers and call
				* [[Inflate#onEnd]]. For interim explicit flushes (without ending the stream) you
				* can use mode Z_SYNC_FLUSH, keeping the decompression context.
				*
				* On fail call [[Inflate#onEnd]] with error code and return false.
				*
				* We strongly recommend to use `Uint8Array` on input for best speed (output
				* format is detected automatically). Also, don't skip last param and always
				* use the same type in your code (boolean or number). That will improve JS speed.
				*
				* For regular `Array`-s make sure all elements are [0..255].
				*
				* ##### Example
				*
				* ```javascript
				* push(chunk, false); // push one of data chunks
				* ...
				* push(chunk, true);  // push last chunk
				* ```
				**/
				Inflate.prototype.push = function(data, mode) {
					var strm = this.strm;
					var chunkSize = this.options.chunkSize;
					var dictionary = this.options.dictionary;
					var status, _mode;
					var next_out_utf8, tail, utf8str;
					var dict;
					var allowBufError = false;
					if (this.ended) return false;
					_mode = mode === ~~mode ? mode : mode === true ? c.Z_FINISH : c.Z_NO_FLUSH;
					if (typeof data === "string") strm.input = strings.binstring2buf(data);
					else if (toString.call(data) === "[object ArrayBuffer]") strm.input = new Uint8Array(data);
					else strm.input = data;
					strm.next_in = 0;
					strm.avail_in = strm.input.length;
					do {
						if (strm.avail_out === 0) {
							strm.output = new utils.Buf8(chunkSize);
							strm.next_out = 0;
							strm.avail_out = chunkSize;
						}
						status = zlib_inflate.inflate(strm, c.Z_NO_FLUSH);
						if (status === c.Z_NEED_DICT && dictionary) {
							if (typeof dictionary === "string") dict = strings.string2buf(dictionary);
							else if (toString.call(dictionary) === "[object ArrayBuffer]") dict = new Uint8Array(dictionary);
							else dict = dictionary;
							status = zlib_inflate.inflateSetDictionary(this.strm, dict);
						}
						if (status === c.Z_BUF_ERROR && allowBufError === true) {
							status = c.Z_OK;
							allowBufError = false;
						}
						if (status !== c.Z_STREAM_END && status !== c.Z_OK) {
							this.onEnd(status);
							this.ended = true;
							return false;
						}
						if (strm.next_out) {
							if (strm.avail_out === 0 || status === c.Z_STREAM_END || strm.avail_in === 0 && (_mode === c.Z_FINISH || _mode === c.Z_SYNC_FLUSH)) if (this.options.to === "string") {
								next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
								tail = strm.next_out - next_out_utf8;
								utf8str = strings.buf2string(strm.output, next_out_utf8);
								strm.next_out = tail;
								strm.avail_out = chunkSize - tail;
								if (tail) utils.arraySet(strm.output, strm.output, next_out_utf8, tail, 0);
								this.onData(utf8str);
							} else this.onData(utils.shrinkBuf(strm.output, strm.next_out));
						}
						if (strm.avail_in === 0 && strm.avail_out === 0) allowBufError = true;
					} while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== c.Z_STREAM_END);
					if (status === c.Z_STREAM_END) _mode = c.Z_FINISH;
					if (_mode === c.Z_FINISH) {
						status = zlib_inflate.inflateEnd(this.strm);
						this.onEnd(status);
						this.ended = true;
						return status === c.Z_OK;
					}
					if (_mode === c.Z_SYNC_FLUSH) {
						this.onEnd(c.Z_OK);
						strm.avail_out = 0;
						return true;
					}
					return true;
				};
				/**
				* Inflate#onData(chunk) -> Void
				* - chunk (Uint8Array|Array|String): ouput data. Type of array depends
				*   on js engine support. When string output requested, each chunk
				*   will be string.
				*
				* By default, stores data blocks in `chunks[]` property and glue
				* those in `onEnd`. Override this handler, if you need another behaviour.
				**/
				Inflate.prototype.onData = function(chunk) {
					this.chunks.push(chunk);
				};
				/**
				* Inflate#onEnd(status) -> Void
				* - status (Number): inflate status. 0 (Z_OK) on success,
				*   other if not.
				*
				* Called either after you tell inflate that the input stream is
				* complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
				* or if an error happened. By default - join collected chunks,
				* free memory and fill `results` / `err` properties.
				**/
				Inflate.prototype.onEnd = function(status) {
					if (status === c.Z_OK) if (this.options.to === "string") this.result = this.chunks.join("");
					else this.result = utils.flattenChunks(this.chunks);
					this.chunks = [];
					this.err = status;
					this.msg = this.strm.msg;
				};
				/**
				* inflate(data[, options]) -> Uint8Array|Array|String
				* - data (Uint8Array|Array|String): input data to decompress.
				* - options (Object): zlib inflate options.
				*
				* Decompress `data` with inflate/ungzip and `options`. Autodetect
				* format via wrapper header by default. That's why we don't provide
				* separate `ungzip` method.
				*
				* Supported options are:
				*
				* - windowBits
				*
				* [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
				* for more information.
				*
				* Sugar (options):
				*
				* - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
				*   negative windowBits implicitly.
				* - `to` (String) - if equal to 'string', then result will be converted
				*   from utf8 to utf16 (javascript) string. When string output requested,
				*   chunk length can differ from `chunkSize`, depending on content.
				*
				*
				* ##### Example:
				*
				* ```javascript
				* var pako = require('pako')
				*   , input = pako.deflate([1,2,3,4,5,6,7,8,9])
				*   , output;
				*
				* try {
				*   output = pako.inflate(input);
				* } catch (err)
				*   console.log(err);
				* }
				* ```
				**/
				function inflate(input, options) {
					var inflator = new Inflate(options);
					inflator.push(input, true);
					if (inflator.err) throw inflator.msg || msg[inflator.err];
					return inflator.result;
				}
				/**
				* inflateRaw(data[, options]) -> Uint8Array|Array|String
				* - data (Uint8Array|Array|String): input data to decompress.
				* - options (Object): zlib inflate options.
				*
				* The same as [[inflate]], but creates raw data, without wrapper
				* (header and adler32 crc).
				**/
				function inflateRaw(input, options) {
					options = options || {};
					options.raw = true;
					return inflate(input, options);
				}
				/**
				* ungzip(data[, options]) -> Uint8Array|Array|String
				* - data (Uint8Array|Array|String): input data to decompress.
				* - options (Object): zlib inflate options.
				*
				* Just shortcut to [[inflate]], because it autodetects format
				* by header.content. Done for convenience.
				**/
				exports$44.Inflate = Inflate;
				exports$44.inflate = inflate;
				exports$44.inflateRaw = inflateRaw;
				exports$44.ungzip = inflate;
			}, {
				"./utils/common": 41,
				"./utils/strings": 42,
				"./zlib/constants": 44,
				"./zlib/gzheader": 47,
				"./zlib/inflate": 49,
				"./zlib/messages": 51,
				"./zlib/zstream": 53
			}],
			41: [function(require, module$45, exports$45) {
				"use strict";
				var TYPED_OK = typeof Uint8Array !== "undefined" && typeof Uint16Array !== "undefined" && typeof Int32Array !== "undefined";
				exports$45.assign = function(obj) {
					var sources = Array.prototype.slice.call(arguments, 1);
					while (sources.length) {
						var source = sources.shift();
						if (!source) continue;
						if (typeof source !== "object") throw new TypeError(source + "must be non-object");
						for (var p in source) if (source.hasOwnProperty(p)) obj[p] = source[p];
					}
					return obj;
				};
				exports$45.shrinkBuf = function(buf, size) {
					if (buf.length === size) return buf;
					if (buf.subarray) return buf.subarray(0, size);
					buf.length = size;
					return buf;
				};
				var fnTyped = {
					arraySet: function(dest, src, src_offs, len, dest_offs) {
						if (src.subarray && dest.subarray) {
							dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
							return;
						}
						for (var i = 0; i < len; i++) dest[dest_offs + i] = src[src_offs + i];
					},
					flattenChunks: function(chunks) {
						var i, l, len = 0, pos, chunk, result;
						for (i = 0, l = chunks.length; i < l; i++) len += chunks[i].length;
						result = new Uint8Array(len);
						pos = 0;
						for (i = 0, l = chunks.length; i < l; i++) {
							chunk = chunks[i];
							result.set(chunk, pos);
							pos += chunk.length;
						}
						return result;
					}
				};
				var fnUntyped = {
					arraySet: function(dest, src, src_offs, len, dest_offs) {
						for (var i = 0; i < len; i++) dest[dest_offs + i] = src[src_offs + i];
					},
					flattenChunks: function(chunks) {
						return [].concat.apply([], chunks);
					}
				};
				exports$45.setTyped = function(on) {
					if (on) {
						exports$45.Buf8 = Uint8Array;
						exports$45.Buf16 = Uint16Array;
						exports$45.Buf32 = Int32Array;
						exports$45.assign(exports$45, fnTyped);
					} else {
						exports$45.Buf8 = Array;
						exports$45.Buf16 = Array;
						exports$45.Buf32 = Array;
						exports$45.assign(exports$45, fnUntyped);
					}
				};
				exports$45.setTyped(TYPED_OK);
			}, {}],
			42: [function(require, module$46, exports$46) {
				"use strict";
				var utils = require("./common");
				var STR_APPLY_OK = true;
				var STR_APPLY_UIA_OK = true;
				try {
					String.fromCharCode.apply(null, [0]);
				} catch (__) {
					STR_APPLY_OK = false;
				}
				try {
					String.fromCharCode.apply(null, /* @__PURE__ */ new Uint8Array(1));
				} catch (__) {
					STR_APPLY_UIA_OK = false;
				}
				var _utf8len = new utils.Buf8(256);
				for (var q = 0; q < 256; q++) _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
				_utf8len[254] = _utf8len[254] = 1;
				exports$46.string2buf = function(str) {
					var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
					for (m_pos = 0; m_pos < str_len; m_pos++) {
						c = str.charCodeAt(m_pos);
						if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
							c2 = str.charCodeAt(m_pos + 1);
							if ((c2 & 64512) === 56320) {
								c = 65536 + (c - 55296 << 10) + (c2 - 56320);
								m_pos++;
							}
						}
						buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
					}
					buf = new utils.Buf8(buf_len);
					for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
						c = str.charCodeAt(m_pos);
						if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
							c2 = str.charCodeAt(m_pos + 1);
							if ((c2 & 64512) === 56320) {
								c = 65536 + (c - 55296 << 10) + (c2 - 56320);
								m_pos++;
							}
						}
						if (c < 128) buf[i++] = c;
						else if (c < 2048) {
							buf[i++] = 192 | c >>> 6;
							buf[i++] = 128 | c & 63;
						} else if (c < 65536) {
							buf[i++] = 224 | c >>> 12;
							buf[i++] = 128 | c >>> 6 & 63;
							buf[i++] = 128 | c & 63;
						} else {
							buf[i++] = 240 | c >>> 18;
							buf[i++] = 128 | c >>> 12 & 63;
							buf[i++] = 128 | c >>> 6 & 63;
							buf[i++] = 128 | c & 63;
						}
					}
					return buf;
				};
				function buf2binstring(buf, len) {
					if (len < 65537) {
						if (buf.subarray && STR_APPLY_UIA_OK || !buf.subarray && STR_APPLY_OK) return String.fromCharCode.apply(null, utils.shrinkBuf(buf, len));
					}
					var result = "";
					for (var i = 0; i < len; i++) result += String.fromCharCode(buf[i]);
					return result;
				}
				exports$46.buf2binstring = function(buf) {
					return buf2binstring(buf, buf.length);
				};
				exports$46.binstring2buf = function(str) {
					var buf = new utils.Buf8(str.length);
					for (var i = 0, len = buf.length; i < len; i++) buf[i] = str.charCodeAt(i);
					return buf;
				};
				exports$46.buf2string = function(buf, max) {
					var i, out, c, c_len;
					var len = max || buf.length;
					var utf16buf = new Array(len * 2);
					for (out = 0, i = 0; i < len;) {
						c = buf[i++];
						if (c < 128) {
							utf16buf[out++] = c;
							continue;
						}
						c_len = _utf8len[c];
						if (c_len > 4) {
							utf16buf[out++] = 65533;
							i += c_len - 1;
							continue;
						}
						c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
						while (c_len > 1 && i < len) {
							c = c << 6 | buf[i++] & 63;
							c_len--;
						}
						if (c_len > 1) {
							utf16buf[out++] = 65533;
							continue;
						}
						if (c < 65536) utf16buf[out++] = c;
						else {
							c -= 65536;
							utf16buf[out++] = 55296 | c >> 10 & 1023;
							utf16buf[out++] = 56320 | c & 1023;
						}
					}
					return buf2binstring(utf16buf, out);
				};
				exports$46.utf8border = function(buf, max) {
					var pos;
					max = max || buf.length;
					if (max > buf.length) max = buf.length;
					pos = max - 1;
					while (pos >= 0 && (buf[pos] & 192) === 128) pos--;
					if (pos < 0) return max;
					if (pos === 0) return max;
					return pos + _utf8len[buf[pos]] > max ? pos : max;
				};
			}, { "./common": 41 }],
			43: [function(require, module$47, exports$47) {
				"use strict";
				function adler32(adler, buf, len, pos) {
					var s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
					while (len !== 0) {
						n = len > 2e3 ? 2e3 : len;
						len -= n;
						do {
							s1 = s1 + buf[pos++] | 0;
							s2 = s2 + s1 | 0;
						} while (--n);
						s1 %= 65521;
						s2 %= 65521;
					}
					return s1 | s2 << 16 | 0;
				}
				module$47.exports = adler32;
			}, {}],
			44: [function(require, module$48, exports$48) {
				"use strict";
				module$48.exports = {
					Z_NO_FLUSH: 0,
					Z_PARTIAL_FLUSH: 1,
					Z_SYNC_FLUSH: 2,
					Z_FULL_FLUSH: 3,
					Z_FINISH: 4,
					Z_BLOCK: 5,
					Z_TREES: 6,
					Z_OK: 0,
					Z_STREAM_END: 1,
					Z_NEED_DICT: 2,
					Z_ERRNO: -1,
					Z_STREAM_ERROR: -2,
					Z_DATA_ERROR: -3,
					Z_BUF_ERROR: -5,
					Z_NO_COMPRESSION: 0,
					Z_BEST_SPEED: 1,
					Z_BEST_COMPRESSION: 9,
					Z_DEFAULT_COMPRESSION: -1,
					Z_FILTERED: 1,
					Z_HUFFMAN_ONLY: 2,
					Z_RLE: 3,
					Z_FIXED: 4,
					Z_DEFAULT_STRATEGY: 0,
					Z_BINARY: 0,
					Z_TEXT: 1,
					Z_UNKNOWN: 2,
					Z_DEFLATED: 8
				};
			}, {}],
			45: [function(require, module$49, exports$49) {
				"use strict";
				function makeTable() {
					var c, table = [];
					for (var n = 0; n < 256; n++) {
						c = n;
						for (var k = 0; k < 8; k++) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
						table[n] = c;
					}
					return table;
				}
				var crcTable = makeTable();
				function crc32(crc, buf, len, pos) {
					var t = crcTable, end = pos + len;
					crc ^= -1;
					for (var i = pos; i < end; i++) crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
					return crc ^ -1;
				}
				module$49.exports = crc32;
			}, {}],
			46: [function(require, module$50, exports$50) {
				"use strict";
				var utils = require("../utils/common");
				var trees = require("./trees");
				var adler32 = require("./adler32");
				var crc32 = require("./crc32");
				var msg = require("./messages");
				var Z_NO_FLUSH = 0;
				var Z_PARTIAL_FLUSH = 1;
				var Z_FULL_FLUSH = 3;
				var Z_FINISH = 4;
				var Z_BLOCK = 5;
				var Z_OK = 0;
				var Z_STREAM_END = 1;
				var Z_STREAM_ERROR = -2;
				var Z_DATA_ERROR = -3;
				var Z_BUF_ERROR = -5;
				var Z_DEFAULT_COMPRESSION = -1;
				var Z_FILTERED = 1;
				var Z_HUFFMAN_ONLY = 2;
				var Z_RLE = 3;
				var Z_FIXED = 4;
				var Z_DEFAULT_STRATEGY = 0;
				var Z_UNKNOWN = 2;
				var Z_DEFLATED = 8;
				var MAX_MEM_LEVEL = 9;
				var MAX_WBITS = 15;
				var DEF_MEM_LEVEL = 8;
				var L_CODES = 286;
				var D_CODES = 30;
				var BL_CODES = 19;
				var HEAP_SIZE = 2 * L_CODES + 1;
				var MAX_BITS = 15;
				var MIN_MATCH = 3;
				var MAX_MATCH = 258;
				var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;
				var PRESET_DICT = 32;
				var INIT_STATE = 42;
				var EXTRA_STATE = 69;
				var NAME_STATE = 73;
				var COMMENT_STATE = 91;
				var HCRC_STATE = 103;
				var BUSY_STATE = 113;
				var FINISH_STATE = 666;
				var BS_NEED_MORE = 1;
				var BS_BLOCK_DONE = 2;
				var BS_FINISH_STARTED = 3;
				var BS_FINISH_DONE = 4;
				var OS_CODE = 3;
				function err(strm, errorCode) {
					strm.msg = msg[errorCode];
					return errorCode;
				}
				function rank(f) {
					return (f << 1) - (f > 4 ? 9 : 0);
				}
				function zero(buf) {
					var len = buf.length;
					while (--len >= 0) buf[len] = 0;
				}
				function flush_pending(strm) {
					var s = strm.state;
					var len = s.pending;
					if (len > strm.avail_out) len = strm.avail_out;
					if (len === 0) return;
					utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
					strm.next_out += len;
					s.pending_out += len;
					strm.total_out += len;
					strm.avail_out -= len;
					s.pending -= len;
					if (s.pending === 0) s.pending_out = 0;
				}
				function flush_block_only(s, last) {
					trees._tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
					s.block_start = s.strstart;
					flush_pending(s.strm);
				}
				function put_byte(s, b) {
					s.pending_buf[s.pending++] = b;
				}
				function putShortMSB(s, b) {
					s.pending_buf[s.pending++] = b >>> 8 & 255;
					s.pending_buf[s.pending++] = b & 255;
				}
				function read_buf(strm, buf, start, size) {
					var len = strm.avail_in;
					if (len > size) len = size;
					if (len === 0) return 0;
					strm.avail_in -= len;
					utils.arraySet(buf, strm.input, strm.next_in, len, start);
					if (strm.state.wrap === 1) strm.adler = adler32(strm.adler, buf, len, start);
					else if (strm.state.wrap === 2) strm.adler = crc32(strm.adler, buf, len, start);
					strm.next_in += len;
					strm.total_in += len;
					return len;
				}
				function longest_match(s, cur_match) {
					var chain_length = s.max_chain_length;
					var scan = s.strstart;
					var match;
					var len;
					var best_len = s.prev_length;
					var nice_match = s.nice_match;
					var limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
					var _win = s.window;
					var wmask = s.w_mask;
					var prev = s.prev;
					var strend = s.strstart + MAX_MATCH;
					var scan_end1 = _win[scan + best_len - 1];
					var scan_end = _win[scan + best_len];
					if (s.prev_length >= s.good_match) chain_length >>= 2;
					if (nice_match > s.lookahead) nice_match = s.lookahead;
					do {
						match = cur_match;
						if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) continue;
						scan += 2;
						match++;
						do						;
while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
						len = MAX_MATCH - (strend - scan);
						scan = strend - MAX_MATCH;
						if (len > best_len) {
							s.match_start = cur_match;
							best_len = len;
							if (len >= nice_match) break;
							scan_end1 = _win[scan + best_len - 1];
							scan_end = _win[scan + best_len];
						}
					} while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
					if (best_len <= s.lookahead) return best_len;
					return s.lookahead;
				}
				function fill_window(s) {
					var _w_size = s.w_size;
					var p, n, m, more, str;
					do {
						more = s.window_size - s.lookahead - s.strstart;
						if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
							utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
							s.match_start -= _w_size;
							s.strstart -= _w_size;
							s.block_start -= _w_size;
							n = s.hash_size;
							p = n;
							do {
								m = s.head[--p];
								s.head[p] = m >= _w_size ? m - _w_size : 0;
							} while (--n);
							n = _w_size;
							p = n;
							do {
								m = s.prev[--p];
								s.prev[p] = m >= _w_size ? m - _w_size : 0;
							} while (--n);
							more += _w_size;
						}
						if (s.strm.avail_in === 0) break;
						n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
						s.lookahead += n;
						if (s.lookahead + s.insert >= MIN_MATCH) {
							str = s.strstart - s.insert;
							s.ins_h = s.window[str];
							s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + 1]) & s.hash_mask;
							while (s.insert) {
								s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
								s.prev[str & s.w_mask] = s.head[s.ins_h];
								s.head[s.ins_h] = str;
								str++;
								s.insert--;
								if (s.lookahead + s.insert < MIN_MATCH) break;
							}
						}
					} while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
				}
				function deflate_stored(s, flush) {
					var max_block_size = 65535;
					if (max_block_size > s.pending_buf_size - 5) max_block_size = s.pending_buf_size - 5;
					for (;;) {
						if (s.lookahead <= 1) {
							fill_window(s);
							if (s.lookahead === 0 && flush === Z_NO_FLUSH) return BS_NEED_MORE;
							if (s.lookahead === 0) break;
						}
						s.strstart += s.lookahead;
						s.lookahead = 0;
						var max_start = s.block_start + max_block_size;
						if (s.strstart === 0 || s.strstart >= max_start) {
							s.lookahead = s.strstart - max_start;
							s.strstart = max_start;
							/*** FLUSH_BLOCK(s, 0); ***/
							flush_block_only(s, false);
							if (s.strm.avail_out === 0) return BS_NEED_MORE;
						}
						if (s.strstart - s.block_start >= s.w_size - MIN_LOOKAHEAD) {
							/*** FLUSH_BLOCK(s, 0); ***/
							flush_block_only(s, false);
							if (s.strm.avail_out === 0) return BS_NEED_MORE;
						}
					}
					s.insert = 0;
					if (flush === Z_FINISH) {
						/*** FLUSH_BLOCK(s, 1); ***/
						flush_block_only(s, true);
						if (s.strm.avail_out === 0) return BS_FINISH_STARTED;
						return BS_FINISH_DONE;
					}
					if (s.strstart > s.block_start) {
						/*** FLUSH_BLOCK(s, 0); ***/
						flush_block_only(s, false);
						if (s.strm.avail_out === 0) return BS_NEED_MORE;
					}
					return BS_NEED_MORE;
				}
				function deflate_fast(s, flush) {
					var hash_head;
					var bflush;
					for (;;) {
						if (s.lookahead < MIN_LOOKAHEAD) {
							fill_window(s);
							if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) return BS_NEED_MORE;
							if (s.lookahead === 0) break;
						}
						hash_head = 0;
						if (s.lookahead >= MIN_MATCH) {
							/*** INSERT_STRING(s, s.strstart, hash_head); ***/
							s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
							hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
							s.head[s.ins_h] = s.strstart;
						}
						if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) s.match_length = longest_match(s, hash_head);
						if (s.match_length >= MIN_MATCH) {
							/*** _tr_tally_dist(s, s.strstart - s.match_start,
							s.match_length - MIN_MATCH, bflush); ***/
							bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
							s.lookahead -= s.match_length;
							if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
								s.match_length--;
								do {
									s.strstart++;
									/*** INSERT_STRING(s, s.strstart, hash_head); ***/
									s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
									hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
									s.head[s.ins_h] = s.strstart;
								} while (--s.match_length !== 0);
								s.strstart++;
							} else {
								s.strstart += s.match_length;
								s.match_length = 0;
								s.ins_h = s.window[s.strstart];
								s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 1]) & s.hash_mask;
							}
						} else {
							/*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
							bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
							s.lookahead--;
							s.strstart++;
						}
						if (bflush) {
							/*** FLUSH_BLOCK(s, 0); ***/
							flush_block_only(s, false);
							if (s.strm.avail_out === 0) return BS_NEED_MORE;
						}
					}
					s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
					if (flush === Z_FINISH) {
						/*** FLUSH_BLOCK(s, 1); ***/
						flush_block_only(s, true);
						if (s.strm.avail_out === 0) return BS_FINISH_STARTED;
						return BS_FINISH_DONE;
					}
					if (s.last_lit) {
						/*** FLUSH_BLOCK(s, 0); ***/
						flush_block_only(s, false);
						if (s.strm.avail_out === 0) return BS_NEED_MORE;
					}
					return BS_BLOCK_DONE;
				}
				function deflate_slow(s, flush) {
					var hash_head;
					var bflush;
					var max_insert;
					for (;;) {
						if (s.lookahead < MIN_LOOKAHEAD) {
							fill_window(s);
							if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) return BS_NEED_MORE;
							if (s.lookahead === 0) break;
						}
						hash_head = 0;
						if (s.lookahead >= MIN_MATCH) {
							/*** INSERT_STRING(s, s.strstart, hash_head); ***/
							s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
							hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
							s.head[s.ins_h] = s.strstart;
						}
						s.prev_length = s.match_length;
						s.prev_match = s.match_start;
						s.match_length = MIN_MATCH - 1;
						if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
							s.match_length = longest_match(s, hash_head);
							if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)) s.match_length = MIN_MATCH - 1;
						}
						if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
							max_insert = s.strstart + s.lookahead - MIN_MATCH;
							/***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
							s.prev_length - MIN_MATCH, bflush);***/
							bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
							s.lookahead -= s.prev_length - 1;
							s.prev_length -= 2;
							do
								if (++s.strstart <= max_insert) {
									/*** INSERT_STRING(s, s.strstart, hash_head); ***/
									s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
									hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
									s.head[s.ins_h] = s.strstart;
								}
							while (--s.prev_length !== 0);
							s.match_available = 0;
							s.match_length = MIN_MATCH - 1;
							s.strstart++;
							if (bflush) {
								/*** FLUSH_BLOCK(s, 0); ***/
								flush_block_only(s, false);
								if (s.strm.avail_out === 0) return BS_NEED_MORE;
							}
						} else if (s.match_available) {
							/*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
							bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
							if (bflush)
 /*** FLUSH_BLOCK_ONLY(s, 0) ***/
							flush_block_only(s, false);
							s.strstart++;
							s.lookahead--;
							if (s.strm.avail_out === 0) return BS_NEED_MORE;
						} else {
							s.match_available = 1;
							s.strstart++;
							s.lookahead--;
						}
					}
					if (s.match_available) {
						/*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
						bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
						s.match_available = 0;
					}
					s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
					if (flush === Z_FINISH) {
						/*** FLUSH_BLOCK(s, 1); ***/
						flush_block_only(s, true);
						if (s.strm.avail_out === 0) return BS_FINISH_STARTED;
						return BS_FINISH_DONE;
					}
					if (s.last_lit) {
						/*** FLUSH_BLOCK(s, 0); ***/
						flush_block_only(s, false);
						if (s.strm.avail_out === 0) return BS_NEED_MORE;
					}
					return BS_BLOCK_DONE;
				}
				function deflate_rle(s, flush) {
					var bflush;
					var prev;
					var scan, strend;
					var _win = s.window;
					for (;;) {
						if (s.lookahead <= MAX_MATCH) {
							fill_window(s);
							if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) return BS_NEED_MORE;
							if (s.lookahead === 0) break;
						}
						s.match_length = 0;
						if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
							scan = s.strstart - 1;
							prev = _win[scan];
							if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
								strend = s.strstart + MAX_MATCH;
								do								;
while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
								s.match_length = MAX_MATCH - (strend - scan);
								if (s.match_length > s.lookahead) s.match_length = s.lookahead;
							}
						}
						if (s.match_length >= MIN_MATCH) {
							/*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
							bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);
							s.lookahead -= s.match_length;
							s.strstart += s.match_length;
							s.match_length = 0;
						} else {
							/*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
							bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
							s.lookahead--;
							s.strstart++;
						}
						if (bflush) {
							/*** FLUSH_BLOCK(s, 0); ***/
							flush_block_only(s, false);
							if (s.strm.avail_out === 0) return BS_NEED_MORE;
						}
					}
					s.insert = 0;
					if (flush === Z_FINISH) {
						/*** FLUSH_BLOCK(s, 1); ***/
						flush_block_only(s, true);
						if (s.strm.avail_out === 0) return BS_FINISH_STARTED;
						return BS_FINISH_DONE;
					}
					if (s.last_lit) {
						/*** FLUSH_BLOCK(s, 0); ***/
						flush_block_only(s, false);
						if (s.strm.avail_out === 0) return BS_NEED_MORE;
					}
					return BS_BLOCK_DONE;
				}
				function deflate_huff(s, flush) {
					var bflush;
					for (;;) {
						if (s.lookahead === 0) {
							fill_window(s);
							if (s.lookahead === 0) {
								if (flush === Z_NO_FLUSH) return BS_NEED_MORE;
								break;
							}
						}
						s.match_length = 0;
						/*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
						bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
						s.lookahead--;
						s.strstart++;
						if (bflush) {
							/*** FLUSH_BLOCK(s, 0); ***/
							flush_block_only(s, false);
							if (s.strm.avail_out === 0) return BS_NEED_MORE;
						}
					}
					s.insert = 0;
					if (flush === Z_FINISH) {
						/*** FLUSH_BLOCK(s, 1); ***/
						flush_block_only(s, true);
						if (s.strm.avail_out === 0) return BS_FINISH_STARTED;
						return BS_FINISH_DONE;
					}
					if (s.last_lit) {
						/*** FLUSH_BLOCK(s, 0); ***/
						flush_block_only(s, false);
						if (s.strm.avail_out === 0) return BS_NEED_MORE;
					}
					return BS_BLOCK_DONE;
				}
				function Config(good_length, max_lazy, nice_length, max_chain, func) {
					this.good_length = good_length;
					this.max_lazy = max_lazy;
					this.nice_length = nice_length;
					this.max_chain = max_chain;
					this.func = func;
				}
				var configuration_table = [
					new Config(0, 0, 0, 0, deflate_stored),
					new Config(4, 4, 8, 4, deflate_fast),
					new Config(4, 5, 16, 8, deflate_fast),
					new Config(4, 6, 32, 32, deflate_fast),
					new Config(4, 4, 16, 16, deflate_slow),
					new Config(8, 16, 32, 32, deflate_slow),
					new Config(8, 16, 128, 128, deflate_slow),
					new Config(8, 32, 128, 256, deflate_slow),
					new Config(32, 128, 258, 1024, deflate_slow),
					new Config(32, 258, 258, 4096, deflate_slow)
				];
				function lm_init(s) {
					s.window_size = 2 * s.w_size;
					/*** CLEAR_HASH(s); ***/
					zero(s.head);
					s.max_lazy_match = configuration_table[s.level].max_lazy;
					s.good_match = configuration_table[s.level].good_length;
					s.nice_match = configuration_table[s.level].nice_length;
					s.max_chain_length = configuration_table[s.level].max_chain;
					s.strstart = 0;
					s.block_start = 0;
					s.lookahead = 0;
					s.insert = 0;
					s.match_length = s.prev_length = MIN_MATCH - 1;
					s.match_available = 0;
					s.ins_h = 0;
				}
				function DeflateState() {
					this.strm = null;
					this.status = 0;
					this.pending_buf = null;
					this.pending_buf_size = 0;
					this.pending_out = 0;
					this.pending = 0;
					this.wrap = 0;
					this.gzhead = null;
					this.gzindex = 0;
					this.method = Z_DEFLATED;
					this.last_flush = -1;
					this.w_size = 0;
					this.w_bits = 0;
					this.w_mask = 0;
					this.window = null;
					this.window_size = 0;
					this.prev = null;
					this.head = null;
					this.ins_h = 0;
					this.hash_size = 0;
					this.hash_bits = 0;
					this.hash_mask = 0;
					this.hash_shift = 0;
					this.block_start = 0;
					this.match_length = 0;
					this.prev_match = 0;
					this.match_available = 0;
					this.strstart = 0;
					this.match_start = 0;
					this.lookahead = 0;
					this.prev_length = 0;
					this.max_chain_length = 0;
					this.max_lazy_match = 0;
					this.level = 0;
					this.strategy = 0;
					this.good_match = 0;
					this.nice_match = 0;
					this.dyn_ltree = new utils.Buf16(HEAP_SIZE * 2);
					this.dyn_dtree = new utils.Buf16((2 * D_CODES + 1) * 2);
					this.bl_tree = new utils.Buf16((2 * BL_CODES + 1) * 2);
					zero(this.dyn_ltree);
					zero(this.dyn_dtree);
					zero(this.bl_tree);
					this.l_desc = null;
					this.d_desc = null;
					this.bl_desc = null;
					this.bl_count = new utils.Buf16(MAX_BITS + 1);
					this.heap = new utils.Buf16(2 * L_CODES + 1);
					zero(this.heap);
					this.heap_len = 0;
					this.heap_max = 0;
					this.depth = new utils.Buf16(2 * L_CODES + 1);
					zero(this.depth);
					this.l_buf = 0;
					this.lit_bufsize = 0;
					this.last_lit = 0;
					this.d_buf = 0;
					this.opt_len = 0;
					this.static_len = 0;
					this.matches = 0;
					this.insert = 0;
					this.bi_buf = 0;
					this.bi_valid = 0;
				}
				function deflateResetKeep(strm) {
					var s;
					if (!strm || !strm.state) return err(strm, Z_STREAM_ERROR);
					strm.total_in = strm.total_out = 0;
					strm.data_type = Z_UNKNOWN;
					s = strm.state;
					s.pending = 0;
					s.pending_out = 0;
					if (s.wrap < 0) s.wrap = -s.wrap;
					s.status = s.wrap ? INIT_STATE : BUSY_STATE;
					strm.adler = s.wrap === 2 ? 0 : 1;
					s.last_flush = Z_NO_FLUSH;
					trees._tr_init(s);
					return Z_OK;
				}
				function deflateReset(strm) {
					var ret = deflateResetKeep(strm);
					if (ret === Z_OK) lm_init(strm.state);
					return ret;
				}
				function deflateSetHeader(strm, head) {
					if (!strm || !strm.state) return Z_STREAM_ERROR;
					if (strm.state.wrap !== 2) return Z_STREAM_ERROR;
					strm.state.gzhead = head;
					return Z_OK;
				}
				function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
					if (!strm) return Z_STREAM_ERROR;
					var wrap = 1;
					if (level === Z_DEFAULT_COMPRESSION) level = 6;
					if (windowBits < 0) {
						wrap = 0;
						windowBits = -windowBits;
					} else if (windowBits > 15) {
						wrap = 2;
						windowBits -= 16;
					}
					if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED) return err(strm, Z_STREAM_ERROR);
					if (windowBits === 8) windowBits = 9;
					var s = new DeflateState();
					strm.state = s;
					s.strm = strm;
					s.wrap = wrap;
					s.gzhead = null;
					s.w_bits = windowBits;
					s.w_size = 1 << s.w_bits;
					s.w_mask = s.w_size - 1;
					s.hash_bits = memLevel + 7;
					s.hash_size = 1 << s.hash_bits;
					s.hash_mask = s.hash_size - 1;
					s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
					s.window = new utils.Buf8(s.w_size * 2);
					s.head = new utils.Buf16(s.hash_size);
					s.prev = new utils.Buf16(s.w_size);
					s.lit_bufsize = 1 << memLevel + 6;
					s.pending_buf_size = s.lit_bufsize * 4;
					s.pending_buf = new utils.Buf8(s.pending_buf_size);
					s.d_buf = 1 * s.lit_bufsize;
					s.l_buf = 3 * s.lit_bufsize;
					s.level = level;
					s.strategy = strategy;
					s.method = method;
					return deflateReset(strm);
				}
				function deflateInit(strm, level) {
					return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
				}
				function deflate(strm, flush) {
					var old_flush, s;
					var beg, val;
					if (!strm || !strm.state || flush > Z_BLOCK || flush < 0) return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
					s = strm.state;
					if (!strm.output || !strm.input && strm.avail_in !== 0 || s.status === FINISH_STATE && flush !== Z_FINISH) return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR : Z_STREAM_ERROR);
					s.strm = strm;
					old_flush = s.last_flush;
					s.last_flush = flush;
					if (s.status === INIT_STATE) if (s.wrap === 2) {
						strm.adler = 0;
						put_byte(s, 31);
						put_byte(s, 139);
						put_byte(s, 8);
						if (!s.gzhead) {
							put_byte(s, 0);
							put_byte(s, 0);
							put_byte(s, 0);
							put_byte(s, 0);
							put_byte(s, 0);
							put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
							put_byte(s, OS_CODE);
							s.status = BUSY_STATE;
						} else {
							put_byte(s, (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16));
							put_byte(s, s.gzhead.time & 255);
							put_byte(s, s.gzhead.time >> 8 & 255);
							put_byte(s, s.gzhead.time >> 16 & 255);
							put_byte(s, s.gzhead.time >> 24 & 255);
							put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
							put_byte(s, s.gzhead.os & 255);
							if (s.gzhead.extra && s.gzhead.extra.length) {
								put_byte(s, s.gzhead.extra.length & 255);
								put_byte(s, s.gzhead.extra.length >> 8 & 255);
							}
							if (s.gzhead.hcrc) strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
							s.gzindex = 0;
							s.status = EXTRA_STATE;
						}
					} else {
						var header = Z_DEFLATED + (s.w_bits - 8 << 4) << 8;
						var level_flags = -1;
						if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) level_flags = 0;
						else if (s.level < 6) level_flags = 1;
						else if (s.level === 6) level_flags = 2;
						else level_flags = 3;
						header |= level_flags << 6;
						if (s.strstart !== 0) header |= PRESET_DICT;
						header += 31 - header % 31;
						s.status = BUSY_STATE;
						putShortMSB(s, header);
						if (s.strstart !== 0) {
							putShortMSB(s, strm.adler >>> 16);
							putShortMSB(s, strm.adler & 65535);
						}
						strm.adler = 1;
					}
					if (s.status === EXTRA_STATE) if (s.gzhead.extra) {
						beg = s.pending;
						while (s.gzindex < (s.gzhead.extra.length & 65535)) {
							if (s.pending === s.pending_buf_size) {
								if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
								flush_pending(strm);
								beg = s.pending;
								if (s.pending === s.pending_buf_size) break;
							}
							put_byte(s, s.gzhead.extra[s.gzindex] & 255);
							s.gzindex++;
						}
						if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
						if (s.gzindex === s.gzhead.extra.length) {
							s.gzindex = 0;
							s.status = NAME_STATE;
						}
					} else s.status = NAME_STATE;
					if (s.status === NAME_STATE) if (s.gzhead.name) {
						beg = s.pending;
						do {
							if (s.pending === s.pending_buf_size) {
								if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
								flush_pending(strm);
								beg = s.pending;
								if (s.pending === s.pending_buf_size) {
									val = 1;
									break;
								}
							}
							if (s.gzindex < s.gzhead.name.length) val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
							else val = 0;
							put_byte(s, val);
						} while (val !== 0);
						if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
						if (val === 0) {
							s.gzindex = 0;
							s.status = COMMENT_STATE;
						}
					} else s.status = COMMENT_STATE;
					if (s.status === COMMENT_STATE) if (s.gzhead.comment) {
						beg = s.pending;
						do {
							if (s.pending === s.pending_buf_size) {
								if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
								flush_pending(strm);
								beg = s.pending;
								if (s.pending === s.pending_buf_size) {
									val = 1;
									break;
								}
							}
							if (s.gzindex < s.gzhead.comment.length) val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
							else val = 0;
							put_byte(s, val);
						} while (val !== 0);
						if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
						if (val === 0) s.status = HCRC_STATE;
					} else s.status = HCRC_STATE;
					if (s.status === HCRC_STATE) if (s.gzhead.hcrc) {
						if (s.pending + 2 > s.pending_buf_size) flush_pending(strm);
						if (s.pending + 2 <= s.pending_buf_size) {
							put_byte(s, strm.adler & 255);
							put_byte(s, strm.adler >> 8 & 255);
							strm.adler = 0;
							s.status = BUSY_STATE;
						}
					} else s.status = BUSY_STATE;
					if (s.pending !== 0) {
						flush_pending(strm);
						if (strm.avail_out === 0) {
							s.last_flush = -1;
							return Z_OK;
						}
					} else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH) return err(strm, Z_BUF_ERROR);
					if (s.status === FINISH_STATE && strm.avail_in !== 0) return err(strm, Z_BUF_ERROR);
					if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH && s.status !== FINISH_STATE) {
						var bstate = s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
						if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) s.status = FINISH_STATE;
						if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
							if (strm.avail_out === 0) s.last_flush = -1;
							return Z_OK;
						}
						if (bstate === BS_BLOCK_DONE) {
							if (flush === Z_PARTIAL_FLUSH) trees._tr_align(s);
							else if (flush !== Z_BLOCK) {
								trees._tr_stored_block(s, 0, 0, false);
								if (flush === Z_FULL_FLUSH) {
									/*** CLEAR_HASH(s); ***/ zero(s.head);
									if (s.lookahead === 0) {
										s.strstart = 0;
										s.block_start = 0;
										s.insert = 0;
									}
								}
							}
							flush_pending(strm);
							if (strm.avail_out === 0) {
								s.last_flush = -1;
								return Z_OK;
							}
						}
					}
					if (flush !== Z_FINISH) return Z_OK;
					if (s.wrap <= 0) return Z_STREAM_END;
					if (s.wrap === 2) {
						put_byte(s, strm.adler & 255);
						put_byte(s, strm.adler >> 8 & 255);
						put_byte(s, strm.adler >> 16 & 255);
						put_byte(s, strm.adler >> 24 & 255);
						put_byte(s, strm.total_in & 255);
						put_byte(s, strm.total_in >> 8 & 255);
						put_byte(s, strm.total_in >> 16 & 255);
						put_byte(s, strm.total_in >> 24 & 255);
					} else {
						putShortMSB(s, strm.adler >>> 16);
						putShortMSB(s, strm.adler & 65535);
					}
					flush_pending(strm);
					if (s.wrap > 0) s.wrap = -s.wrap;
					return s.pending !== 0 ? Z_OK : Z_STREAM_END;
				}
				function deflateEnd(strm) {
					var status;
					if (!strm || !strm.state) return Z_STREAM_ERROR;
					status = strm.state.status;
					if (status !== INIT_STATE && status !== EXTRA_STATE && status !== NAME_STATE && status !== COMMENT_STATE && status !== HCRC_STATE && status !== BUSY_STATE && status !== FINISH_STATE) return err(strm, Z_STREAM_ERROR);
					strm.state = null;
					return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
				}
				function deflateSetDictionary(strm, dictionary) {
					var dictLength = dictionary.length;
					var s;
					var str, n;
					var wrap;
					var avail;
					var next;
					var input;
					var tmpDict;
					if (!strm || !strm.state) return Z_STREAM_ERROR;
					s = strm.state;
					wrap = s.wrap;
					if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) return Z_STREAM_ERROR;
					if (wrap === 1) strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
					s.wrap = 0;
					if (dictLength >= s.w_size) {
						if (wrap === 0) {
							/*** CLEAR_HASH(s); ***/
							zero(s.head);
							s.strstart = 0;
							s.block_start = 0;
							s.insert = 0;
						}
						tmpDict = new utils.Buf8(s.w_size);
						utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
						dictionary = tmpDict;
						dictLength = s.w_size;
					}
					avail = strm.avail_in;
					next = strm.next_in;
					input = strm.input;
					strm.avail_in = dictLength;
					strm.next_in = 0;
					strm.input = dictionary;
					fill_window(s);
					while (s.lookahead >= MIN_MATCH) {
						str = s.strstart;
						n = s.lookahead - (MIN_MATCH - 1);
						do {
							s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
							s.prev[str & s.w_mask] = s.head[s.ins_h];
							s.head[s.ins_h] = str;
							str++;
						} while (--n);
						s.strstart = str;
						s.lookahead = MIN_MATCH - 1;
						fill_window(s);
					}
					s.strstart += s.lookahead;
					s.block_start = s.strstart;
					s.insert = s.lookahead;
					s.lookahead = 0;
					s.match_length = s.prev_length = MIN_MATCH - 1;
					s.match_available = 0;
					strm.next_in = next;
					strm.input = input;
					strm.avail_in = avail;
					s.wrap = wrap;
					return Z_OK;
				}
				exports$50.deflateInit = deflateInit;
				exports$50.deflateInit2 = deflateInit2;
				exports$50.deflateReset = deflateReset;
				exports$50.deflateResetKeep = deflateResetKeep;
				exports$50.deflateSetHeader = deflateSetHeader;
				exports$50.deflate = deflate;
				exports$50.deflateEnd = deflateEnd;
				exports$50.deflateSetDictionary = deflateSetDictionary;
				exports$50.deflateInfo = "pako deflate (from Nodeca project)";
			}, {
				"../utils/common": 41,
				"./adler32": 43,
				"./crc32": 45,
				"./messages": 51,
				"./trees": 52
			}],
			47: [function(require, module$51, exports$51) {
				"use strict";
				function GZheader() {
					this.text = 0;
					this.time = 0;
					this.xflags = 0;
					this.os = 0;
					this.extra = null;
					this.extra_len = 0;
					this.name = "";
					this.comment = "";
					this.hcrc = 0;
					this.done = false;
				}
				module$51.exports = GZheader;
			}, {}],
			48: [function(require, module$52, exports$52) {
				"use strict";
				var BAD = 30;
				var TYPE = 12;
				module$52.exports = function inflate_fast(strm, start) {
					var state;
					var _in;
					var last;
					var _out;
					var beg;
					var end;
					var dmax;
					var wsize;
					var whave;
					var wnext;
					var s_window;
					var hold;
					var bits;
					var lcode;
					var dcode;
					var lmask;
					var dmask;
					var here;
					var op;
					var len;
					var dist;
					var from;
					var from_source;
					var input, output;
					state = strm.state;
					_in = strm.next_in;
					input = strm.input;
					last = _in + (strm.avail_in - 5);
					_out = strm.next_out;
					output = strm.output;
					beg = _out - (start - strm.avail_out);
					end = _out + (strm.avail_out - 257);
					dmax = state.dmax;
					wsize = state.wsize;
					whave = state.whave;
					wnext = state.wnext;
					s_window = state.window;
					hold = state.hold;
					bits = state.bits;
					lcode = state.lencode;
					dcode = state.distcode;
					lmask = (1 << state.lenbits) - 1;
					dmask = (1 << state.distbits) - 1;
					top: do {
						if (bits < 15) {
							hold += input[_in++] << bits;
							bits += 8;
							hold += input[_in++] << bits;
							bits += 8;
						}
						here = lcode[hold & lmask];
						dolen: for (;;) {
							op = here >>> 24;
							hold >>>= op;
							bits -= op;
							op = here >>> 16 & 255;
							if (op === 0) output[_out++] = here & 65535;
							else if (op & 16) {
								len = here & 65535;
								op &= 15;
								if (op) {
									if (bits < op) {
										hold += input[_in++] << bits;
										bits += 8;
									}
									len += hold & (1 << op) - 1;
									hold >>>= op;
									bits -= op;
								}
								if (bits < 15) {
									hold += input[_in++] << bits;
									bits += 8;
									hold += input[_in++] << bits;
									bits += 8;
								}
								here = dcode[hold & dmask];
								dodist: for (;;) {
									op = here >>> 24;
									hold >>>= op;
									bits -= op;
									op = here >>> 16 & 255;
									if (op & 16) {
										dist = here & 65535;
										op &= 15;
										if (bits < op) {
											hold += input[_in++] << bits;
											bits += 8;
											if (bits < op) {
												hold += input[_in++] << bits;
												bits += 8;
											}
										}
										dist += hold & (1 << op) - 1;
										if (dist > dmax) {
											strm.msg = "invalid distance too far back";
											state.mode = BAD;
											break top;
										}
										hold >>>= op;
										bits -= op;
										op = _out - beg;
										if (dist > op) {
											op = dist - op;
											if (op > whave) {
												if (state.sane) {
													strm.msg = "invalid distance too far back";
													state.mode = BAD;
													break top;
												}
											}
											from = 0;
											from_source = s_window;
											if (wnext === 0) {
												from += wsize - op;
												if (op < len) {
													len -= op;
													do
														output[_out++] = s_window[from++];
													while (--op);
													from = _out - dist;
													from_source = output;
												}
											} else if (wnext < op) {
												from += wsize + wnext - op;
												op -= wnext;
												if (op < len) {
													len -= op;
													do
														output[_out++] = s_window[from++];
													while (--op);
													from = 0;
													if (wnext < len) {
														op = wnext;
														len -= op;
														do
															output[_out++] = s_window[from++];
														while (--op);
														from = _out - dist;
														from_source = output;
													}
												}
											} else {
												from += wnext - op;
												if (op < len) {
													len -= op;
													do
														output[_out++] = s_window[from++];
													while (--op);
													from = _out - dist;
													from_source = output;
												}
											}
											while (len > 2) {
												output[_out++] = from_source[from++];
												output[_out++] = from_source[from++];
												output[_out++] = from_source[from++];
												len -= 3;
											}
											if (len) {
												output[_out++] = from_source[from++];
												if (len > 1) output[_out++] = from_source[from++];
											}
										} else {
											from = _out - dist;
											do {
												output[_out++] = output[from++];
												output[_out++] = output[from++];
												output[_out++] = output[from++];
												len -= 3;
											} while (len > 2);
											if (len) {
												output[_out++] = output[from++];
												if (len > 1) output[_out++] = output[from++];
											}
										}
									} else if ((op & 64) === 0) {
										here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
										continue dodist;
									} else {
										strm.msg = "invalid distance code";
										state.mode = BAD;
										break top;
									}
									break;
								}
							} else if ((op & 64) === 0) {
								here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
								continue dolen;
							} else if (op & 32) {
								state.mode = TYPE;
								break top;
							} else {
								strm.msg = "invalid literal/length code";
								state.mode = BAD;
								break top;
							}
							break;
						}
					} while (_in < last && _out < end);
					len = bits >> 3;
					_in -= len;
					bits -= len << 3;
					hold &= (1 << bits) - 1;
					strm.next_in = _in;
					strm.next_out = _out;
					strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
					strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
					state.hold = hold;
					state.bits = bits;
				};
			}, {}],
			49: [function(require, module$53, exports$53) {
				"use strict";
				var utils = require("../utils/common");
				var adler32 = require("./adler32");
				var crc32 = require("./crc32");
				var inflate_fast = require("./inffast");
				var inflate_table = require("./inftrees");
				var CODES = 0;
				var LENS = 1;
				var DISTS = 2;
				var Z_FINISH = 4;
				var Z_BLOCK = 5;
				var Z_TREES = 6;
				var Z_OK = 0;
				var Z_STREAM_END = 1;
				var Z_NEED_DICT = 2;
				var Z_STREAM_ERROR = -2;
				var Z_DATA_ERROR = -3;
				var Z_MEM_ERROR = -4;
				var Z_BUF_ERROR = -5;
				var Z_DEFLATED = 8;
				var HEAD = 1;
				var FLAGS = 2;
				var TIME = 3;
				var OS = 4;
				var EXLEN = 5;
				var EXTRA = 6;
				var NAME = 7;
				var COMMENT = 8;
				var HCRC = 9;
				var DICTID = 10;
				var DICT = 11;
				var TYPE = 12;
				var TYPEDO = 13;
				var STORED = 14;
				var COPY_ = 15;
				var COPY = 16;
				var TABLE = 17;
				var LENLENS = 18;
				var CODELENS = 19;
				var LEN_ = 20;
				var LEN = 21;
				var LENEXT = 22;
				var DIST = 23;
				var DISTEXT = 24;
				var MATCH = 25;
				var LIT = 26;
				var CHECK = 27;
				var LENGTH = 28;
				var DONE = 29;
				var BAD = 30;
				var MEM = 31;
				var SYNC = 32;
				var ENOUGH_LENS = 852;
				var ENOUGH_DISTS = 592;
				var DEF_WBITS = 15;
				function zswap32(q) {
					return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
				}
				function InflateState() {
					this.mode = 0;
					this.last = false;
					this.wrap = 0;
					this.havedict = false;
					this.flags = 0;
					this.dmax = 0;
					this.check = 0;
					this.total = 0;
					this.head = null;
					this.wbits = 0;
					this.wsize = 0;
					this.whave = 0;
					this.wnext = 0;
					this.window = null;
					this.hold = 0;
					this.bits = 0;
					this.length = 0;
					this.offset = 0;
					this.extra = 0;
					this.lencode = null;
					this.distcode = null;
					this.lenbits = 0;
					this.distbits = 0;
					this.ncode = 0;
					this.nlen = 0;
					this.ndist = 0;
					this.have = 0;
					this.next = null;
					this.lens = new utils.Buf16(320);
					this.work = new utils.Buf16(288);
					this.lendyn = null;
					this.distdyn = null;
					this.sane = 0;
					this.back = 0;
					this.was = 0;
				}
				function inflateResetKeep(strm) {
					var state;
					if (!strm || !strm.state) return Z_STREAM_ERROR;
					state = strm.state;
					strm.total_in = strm.total_out = state.total = 0;
					strm.msg = "";
					if (state.wrap) strm.adler = state.wrap & 1;
					state.mode = HEAD;
					state.last = 0;
					state.havedict = 0;
					state.dmax = 32768;
					state.head = null;
					state.hold = 0;
					state.bits = 0;
					state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
					state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);
					state.sane = 1;
					state.back = -1;
					return Z_OK;
				}
				function inflateReset(strm) {
					var state;
					if (!strm || !strm.state) return Z_STREAM_ERROR;
					state = strm.state;
					state.wsize = 0;
					state.whave = 0;
					state.wnext = 0;
					return inflateResetKeep(strm);
				}
				function inflateReset2(strm, windowBits) {
					var wrap;
					var state;
					if (!strm || !strm.state) return Z_STREAM_ERROR;
					state = strm.state;
					if (windowBits < 0) {
						wrap = 0;
						windowBits = -windowBits;
					} else {
						wrap = (windowBits >> 4) + 1;
						if (windowBits < 48) windowBits &= 15;
					}
					if (windowBits && (windowBits < 8 || windowBits > 15)) return Z_STREAM_ERROR;
					if (state.window !== null && state.wbits !== windowBits) state.window = null;
					state.wrap = wrap;
					state.wbits = windowBits;
					return inflateReset(strm);
				}
				function inflateInit2(strm, windowBits) {
					var ret;
					var state;
					if (!strm) return Z_STREAM_ERROR;
					state = new InflateState();
					strm.state = state;
					state.window = null;
					ret = inflateReset2(strm, windowBits);
					if (ret !== Z_OK) strm.state = null;
					return ret;
				}
				function inflateInit(strm) {
					return inflateInit2(strm, DEF_WBITS);
				}
				var virgin = true;
				var lenfix, distfix;
				function fixedtables(state) {
					if (virgin) {
						var sym;
						lenfix = new utils.Buf32(512);
						distfix = new utils.Buf32(32);
						sym = 0;
						while (sym < 144) state.lens[sym++] = 8;
						while (sym < 256) state.lens[sym++] = 9;
						while (sym < 280) state.lens[sym++] = 7;
						while (sym < 288) state.lens[sym++] = 8;
						inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
						sym = 0;
						while (sym < 32) state.lens[sym++] = 5;
						inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
						virgin = false;
					}
					state.lencode = lenfix;
					state.lenbits = 9;
					state.distcode = distfix;
					state.distbits = 5;
				}
				function updatewindow(strm, src, end, copy) {
					var dist;
					var state = strm.state;
					if (state.window === null) {
						state.wsize = 1 << state.wbits;
						state.wnext = 0;
						state.whave = 0;
						state.window = new utils.Buf8(state.wsize);
					}
					if (copy >= state.wsize) {
						utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
						state.wnext = 0;
						state.whave = state.wsize;
					} else {
						dist = state.wsize - state.wnext;
						if (dist > copy) dist = copy;
						utils.arraySet(state.window, src, end - copy, dist, state.wnext);
						copy -= dist;
						if (copy) {
							utils.arraySet(state.window, src, end - copy, copy, 0);
							state.wnext = copy;
							state.whave = state.wsize;
						} else {
							state.wnext += dist;
							if (state.wnext === state.wsize) state.wnext = 0;
							if (state.whave < state.wsize) state.whave += dist;
						}
					}
					return 0;
				}
				function inflate(strm, flush) {
					var state;
					var input, output;
					var next;
					var put;
					var have, left;
					var hold;
					var bits;
					var _in, _out;
					var copy;
					var from;
					var from_source;
					var here = 0;
					var here_bits, here_op, here_val;
					var last_bits, last_op, last_val;
					var len;
					var ret;
					var hbuf = new utils.Buf8(4);
					var opts;
					var n;
					var order = [
						16,
						17,
						18,
						0,
						8,
						7,
						9,
						6,
						10,
						5,
						11,
						4,
						12,
						3,
						13,
						2,
						14,
						1,
						15
					];
					if (!strm || !strm.state || !strm.output || !strm.input && strm.avail_in !== 0) return Z_STREAM_ERROR;
					state = strm.state;
					if (state.mode === TYPE) state.mode = TYPEDO;
					put = strm.next_out;
					output = strm.output;
					left = strm.avail_out;
					next = strm.next_in;
					input = strm.input;
					have = strm.avail_in;
					hold = state.hold;
					bits = state.bits;
					_in = have;
					_out = left;
					ret = Z_OK;
					inf_leave: for (;;) switch (state.mode) {
						case HEAD:
							if (state.wrap === 0) {
								state.mode = TYPEDO;
								break;
							}
							while (bits < 16) {
								if (have === 0) break inf_leave;
								have--;
								hold += input[next++] << bits;
								bits += 8;
							}
							if (state.wrap & 2 && hold === 35615) {
								state.check = 0;
								hbuf[0] = hold & 255;
								hbuf[1] = hold >>> 8 & 255;
								state.check = crc32(state.check, hbuf, 2, 0);
								hold = 0;
								bits = 0;
								state.mode = FLAGS;
								break;
							}
							state.flags = 0;
							if (state.head) state.head.done = false;
							if (!(state.wrap & 1) || (((hold & 255) << 8) + (hold >> 8)) % 31) {
								strm.msg = "incorrect header check";
								state.mode = BAD;
								break;
							}
							if ((hold & 15) !== Z_DEFLATED) {
								strm.msg = "unknown compression method";
								state.mode = BAD;
								break;
							}
							hold >>>= 4;
							bits -= 4;
							len = (hold & 15) + 8;
							if (state.wbits === 0) state.wbits = len;
							else if (len > state.wbits) {
								strm.msg = "invalid window size";
								state.mode = BAD;
								break;
							}
							state.dmax = 1 << len;
							strm.adler = state.check = 1;
							state.mode = hold & 512 ? DICTID : TYPE;
							hold = 0;
							bits = 0;
							break;
						case FLAGS:
							while (bits < 16) {
								if (have === 0) break inf_leave;
								have--;
								hold += input[next++] << bits;
								bits += 8;
							}
							state.flags = hold;
							if ((state.flags & 255) !== Z_DEFLATED) {
								strm.msg = "unknown compression method";
								state.mode = BAD;
								break;
							}
							if (state.flags & 57344) {
								strm.msg = "unknown header flags set";
								state.mode = BAD;
								break;
							}
							if (state.head) state.head.text = hold >> 8 & 1;
							if (state.flags & 512) {
								hbuf[0] = hold & 255;
								hbuf[1] = hold >>> 8 & 255;
								state.check = crc32(state.check, hbuf, 2, 0);
							}
							hold = 0;
							bits = 0;
							state.mode = TIME;
						case TIME:
							while (bits < 32) {
								if (have === 0) break inf_leave;
								have--;
								hold += input[next++] << bits;
								bits += 8;
							}
							if (state.head) state.head.time = hold;
							if (state.flags & 512) {
								hbuf[0] = hold & 255;
								hbuf[1] = hold >>> 8 & 255;
								hbuf[2] = hold >>> 16 & 255;
								hbuf[3] = hold >>> 24 & 255;
								state.check = crc32(state.check, hbuf, 4, 0);
							}
							hold = 0;
							bits = 0;
							state.mode = OS;
						case OS:
							while (bits < 16) {
								if (have === 0) break inf_leave;
								have--;
								hold += input[next++] << bits;
								bits += 8;
							}
							if (state.head) {
								state.head.xflags = hold & 255;
								state.head.os = hold >> 8;
							}
							if (state.flags & 512) {
								hbuf[0] = hold & 255;
								hbuf[1] = hold >>> 8 & 255;
								state.check = crc32(state.check, hbuf, 2, 0);
							}
							hold = 0;
							bits = 0;
							state.mode = EXLEN;
						case EXLEN:
							if (state.flags & 1024) {
								while (bits < 16) {
									if (have === 0) break inf_leave;
									have--;
									hold += input[next++] << bits;
									bits += 8;
								}
								state.length = hold;
								if (state.head) state.head.extra_len = hold;
								if (state.flags & 512) {
									hbuf[0] = hold & 255;
									hbuf[1] = hold >>> 8 & 255;
									state.check = crc32(state.check, hbuf, 2, 0);
								}
								hold = 0;
								bits = 0;
							} else if (state.head) state.head.extra = null;
							state.mode = EXTRA;
						case EXTRA:
							if (state.flags & 1024) {
								copy = state.length;
								if (copy > have) copy = have;
								if (copy) {
									if (state.head) {
										len = state.head.extra_len - state.length;
										if (!state.head.extra) state.head.extra = new Array(state.head.extra_len);
										utils.arraySet(state.head.extra, input, next, copy, len);
									}
									if (state.flags & 512) state.check = crc32(state.check, input, copy, next);
									have -= copy;
									next += copy;
									state.length -= copy;
								}
								if (state.length) break inf_leave;
							}
							state.length = 0;
							state.mode = NAME;
						case NAME:
							if (state.flags & 2048) {
								if (have === 0) break inf_leave;
								copy = 0;
								do {
									len = input[next + copy++];
									if (state.head && len && state.length < 65536) state.head.name += String.fromCharCode(len);
								} while (len && copy < have);
								if (state.flags & 512) state.check = crc32(state.check, input, copy, next);
								have -= copy;
								next += copy;
								if (len) break inf_leave;
							} else if (state.head) state.head.name = null;
							state.length = 0;
							state.mode = COMMENT;
						case COMMENT:
							if (state.flags & 4096) {
								if (have === 0) break inf_leave;
								copy = 0;
								do {
									len = input[next + copy++];
									if (state.head && len && state.length < 65536) state.head.comment += String.fromCharCode(len);
								} while (len && copy < have);
								if (state.flags & 512) state.check = crc32(state.check, input, copy, next);
								have -= copy;
								next += copy;
								if (len) break inf_leave;
							} else if (state.head) state.head.comment = null;
							state.mode = HCRC;
						case HCRC:
							if (state.flags & 512) {
								while (bits < 16) {
									if (have === 0) break inf_leave;
									have--;
									hold += input[next++] << bits;
									bits += 8;
								}
								if (hold !== (state.check & 65535)) {
									strm.msg = "header crc mismatch";
									state.mode = BAD;
									break;
								}
								hold = 0;
								bits = 0;
							}
							if (state.head) {
								state.head.hcrc = state.flags >> 9 & 1;
								state.head.done = true;
							}
							strm.adler = state.check = 0;
							state.mode = TYPE;
							break;
						case DICTID:
							while (bits < 32) {
								if (have === 0) break inf_leave;
								have--;
								hold += input[next++] << bits;
								bits += 8;
							}
							strm.adler = state.check = zswap32(hold);
							hold = 0;
							bits = 0;
							state.mode = DICT;
						case DICT:
							if (state.havedict === 0) {
								strm.next_out = put;
								strm.avail_out = left;
								strm.next_in = next;
								strm.avail_in = have;
								state.hold = hold;
								state.bits = bits;
								return Z_NEED_DICT;
							}
							strm.adler = state.check = 1;
							state.mode = TYPE;
						case TYPE: if (flush === Z_BLOCK || flush === Z_TREES) break inf_leave;
						case TYPEDO:
							if (state.last) {
								hold >>>= bits & 7;
								bits -= bits & 7;
								state.mode = CHECK;
								break;
							}
							while (bits < 3) {
								if (have === 0) break inf_leave;
								have--;
								hold += input[next++] << bits;
								bits += 8;
							}
							state.last = hold & 1;
							hold >>>= 1;
							bits -= 1;
							switch (hold & 3) {
								case 0:
									state.mode = STORED;
									break;
								case 1:
									fixedtables(state);
									state.mode = LEN_;
									if (flush === Z_TREES) {
										hold >>>= 2;
										bits -= 2;
										break inf_leave;
									}
									break;
								case 2:
									state.mode = TABLE;
									break;
								case 3:
									strm.msg = "invalid block type";
									state.mode = BAD;
							}
							hold >>>= 2;
							bits -= 2;
							break;
						case STORED:
							hold >>>= bits & 7;
							bits -= bits & 7;
							while (bits < 32) {
								if (have === 0) break inf_leave;
								have--;
								hold += input[next++] << bits;
								bits += 8;
							}
							if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
								strm.msg = "invalid stored block lengths";
								state.mode = BAD;
								break;
							}
							state.length = hold & 65535;
							hold = 0;
							bits = 0;
							state.mode = COPY_;
							if (flush === Z_TREES) break inf_leave;
						case COPY_: state.mode = COPY;
						case COPY:
							copy = state.length;
							if (copy) {
								if (copy > have) copy = have;
								if (copy > left) copy = left;
								if (copy === 0) break inf_leave;
								utils.arraySet(output, input, next, copy, put);
								have -= copy;
								next += copy;
								left -= copy;
								put += copy;
								state.length -= copy;
								break;
							}
							state.mode = TYPE;
							break;
						case TABLE:
							while (bits < 14) {
								if (have === 0) break inf_leave;
								have--;
								hold += input[next++] << bits;
								bits += 8;
							}
							state.nlen = (hold & 31) + 257;
							hold >>>= 5;
							bits -= 5;
							state.ndist = (hold & 31) + 1;
							hold >>>= 5;
							bits -= 5;
							state.ncode = (hold & 15) + 4;
							hold >>>= 4;
							bits -= 4;
							if (state.nlen > 286 || state.ndist > 30) {
								strm.msg = "too many length or distance symbols";
								state.mode = BAD;
								break;
							}
							state.have = 0;
							state.mode = LENLENS;
						case LENLENS:
							while (state.have < state.ncode) {
								while (bits < 3) {
									if (have === 0) break inf_leave;
									have--;
									hold += input[next++] << bits;
									bits += 8;
								}
								state.lens[order[state.have++]] = hold & 7;
								hold >>>= 3;
								bits -= 3;
							}
							while (state.have < 19) state.lens[order[state.have++]] = 0;
							state.lencode = state.lendyn;
							state.lenbits = 7;
							opts = { bits: state.lenbits };
							ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
							state.lenbits = opts.bits;
							if (ret) {
								strm.msg = "invalid code lengths set";
								state.mode = BAD;
								break;
							}
							state.have = 0;
							state.mode = CODELENS;
						case CODELENS:
							while (state.have < state.nlen + state.ndist) {
								for (;;) {
									here = state.lencode[hold & (1 << state.lenbits) - 1];
									here_bits = here >>> 24;
									here_op = here >>> 16 & 255;
									here_val = here & 65535;
									if (here_bits <= bits) break;
									if (have === 0) break inf_leave;
									have--;
									hold += input[next++] << bits;
									bits += 8;
								}
								if (here_val < 16) {
									hold >>>= here_bits;
									bits -= here_bits;
									state.lens[state.have++] = here_val;
								} else {
									if (here_val === 16) {
										n = here_bits + 2;
										while (bits < n) {
											if (have === 0) break inf_leave;
											have--;
											hold += input[next++] << bits;
											bits += 8;
										}
										hold >>>= here_bits;
										bits -= here_bits;
										if (state.have === 0) {
											strm.msg = "invalid bit length repeat";
											state.mode = BAD;
											break;
										}
										len = state.lens[state.have - 1];
										copy = 3 + (hold & 3);
										hold >>>= 2;
										bits -= 2;
									} else if (here_val === 17) {
										n = here_bits + 3;
										while (bits < n) {
											if (have === 0) break inf_leave;
											have--;
											hold += input[next++] << bits;
											bits += 8;
										}
										hold >>>= here_bits;
										bits -= here_bits;
										len = 0;
										copy = 3 + (hold & 7);
										hold >>>= 3;
										bits -= 3;
									} else {
										n = here_bits + 7;
										while (bits < n) {
											if (have === 0) break inf_leave;
											have--;
											hold += input[next++] << bits;
											bits += 8;
										}
										hold >>>= here_bits;
										bits -= here_bits;
										len = 0;
										copy = 11 + (hold & 127);
										hold >>>= 7;
										bits -= 7;
									}
									if (state.have + copy > state.nlen + state.ndist) {
										strm.msg = "invalid bit length repeat";
										state.mode = BAD;
										break;
									}
									while (copy--) state.lens[state.have++] = len;
								}
							}
							if (state.mode === BAD) break;
							if (state.lens[256] === 0) {
								strm.msg = "invalid code -- missing end-of-block";
								state.mode = BAD;
								break;
							}
							state.lenbits = 9;
							opts = { bits: state.lenbits };
							ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
							state.lenbits = opts.bits;
							if (ret) {
								strm.msg = "invalid literal/lengths set";
								state.mode = BAD;
								break;
							}
							state.distbits = 6;
							state.distcode = state.distdyn;
							opts = { bits: state.distbits };
							ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
							state.distbits = opts.bits;
							if (ret) {
								strm.msg = "invalid distances set";
								state.mode = BAD;
								break;
							}
							state.mode = LEN_;
							if (flush === Z_TREES) break inf_leave;
						case LEN_: state.mode = LEN;
						case LEN:
							if (have >= 6 && left >= 258) {
								strm.next_out = put;
								strm.avail_out = left;
								strm.next_in = next;
								strm.avail_in = have;
								state.hold = hold;
								state.bits = bits;
								inflate_fast(strm, _out);
								put = strm.next_out;
								output = strm.output;
								left = strm.avail_out;
								next = strm.next_in;
								input = strm.input;
								have = strm.avail_in;
								hold = state.hold;
								bits = state.bits;
								if (state.mode === TYPE) state.back = -1;
								break;
							}
							state.back = 0;
							for (;;) {
								here = state.lencode[hold & (1 << state.lenbits) - 1];
								here_bits = here >>> 24;
								here_op = here >>> 16 & 255;
								here_val = here & 65535;
								if (here_bits <= bits) break;
								if (have === 0) break inf_leave;
								have--;
								hold += input[next++] << bits;
								bits += 8;
							}
							if (here_op && (here_op & 240) === 0) {
								last_bits = here_bits;
								last_op = here_op;
								last_val = here_val;
								for (;;) {
									here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
									here_bits = here >>> 24;
									here_op = here >>> 16 & 255;
									here_val = here & 65535;
									if (last_bits + here_bits <= bits) break;
									if (have === 0) break inf_leave;
									have--;
									hold += input[next++] << bits;
									bits += 8;
								}
								hold >>>= last_bits;
								bits -= last_bits;
								state.back += last_bits;
							}
							hold >>>= here_bits;
							bits -= here_bits;
							state.back += here_bits;
							state.length = here_val;
							if (here_op === 0) {
								state.mode = LIT;
								break;
							}
							if (here_op & 32) {
								state.back = -1;
								state.mode = TYPE;
								break;
							}
							if (here_op & 64) {
								strm.msg = "invalid literal/length code";
								state.mode = BAD;
								break;
							}
							state.extra = here_op & 15;
							state.mode = LENEXT;
						case LENEXT:
							if (state.extra) {
								n = state.extra;
								while (bits < n) {
									if (have === 0) break inf_leave;
									have--;
									hold += input[next++] << bits;
									bits += 8;
								}
								state.length += hold & (1 << state.extra) - 1;
								hold >>>= state.extra;
								bits -= state.extra;
								state.back += state.extra;
							}
							state.was = state.length;
							state.mode = DIST;
						case DIST:
							for (;;) {
								here = state.distcode[hold & (1 << state.distbits) - 1];
								here_bits = here >>> 24;
								here_op = here >>> 16 & 255;
								here_val = here & 65535;
								if (here_bits <= bits) break;
								if (have === 0) break inf_leave;
								have--;
								hold += input[next++] << bits;
								bits += 8;
							}
							if ((here_op & 240) === 0) {
								last_bits = here_bits;
								last_op = here_op;
								last_val = here_val;
								for (;;) {
									here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
									here_bits = here >>> 24;
									here_op = here >>> 16 & 255;
									here_val = here & 65535;
									if (last_bits + here_bits <= bits) break;
									if (have === 0) break inf_leave;
									have--;
									hold += input[next++] << bits;
									bits += 8;
								}
								hold >>>= last_bits;
								bits -= last_bits;
								state.back += last_bits;
							}
							hold >>>= here_bits;
							bits -= here_bits;
							state.back += here_bits;
							if (here_op & 64) {
								strm.msg = "invalid distance code";
								state.mode = BAD;
								break;
							}
							state.offset = here_val;
							state.extra = here_op & 15;
							state.mode = DISTEXT;
						case DISTEXT:
							if (state.extra) {
								n = state.extra;
								while (bits < n) {
									if (have === 0) break inf_leave;
									have--;
									hold += input[next++] << bits;
									bits += 8;
								}
								state.offset += hold & (1 << state.extra) - 1;
								hold >>>= state.extra;
								bits -= state.extra;
								state.back += state.extra;
							}
							if (state.offset > state.dmax) {
								strm.msg = "invalid distance too far back";
								state.mode = BAD;
								break;
							}
							state.mode = MATCH;
						case MATCH:
							if (left === 0) break inf_leave;
							copy = _out - left;
							if (state.offset > copy) {
								copy = state.offset - copy;
								if (copy > state.whave) {
									if (state.sane) {
										strm.msg = "invalid distance too far back";
										state.mode = BAD;
										break;
									}
								}
								if (copy > state.wnext) {
									copy -= state.wnext;
									from = state.wsize - copy;
								} else from = state.wnext - copy;
								if (copy > state.length) copy = state.length;
								from_source = state.window;
							} else {
								from_source = output;
								from = put - state.offset;
								copy = state.length;
							}
							if (copy > left) copy = left;
							left -= copy;
							state.length -= copy;
							do
								output[put++] = from_source[from++];
							while (--copy);
							if (state.length === 0) state.mode = LEN;
							break;
						case LIT:
							if (left === 0) break inf_leave;
							output[put++] = state.length;
							left--;
							state.mode = LEN;
							break;
						case CHECK:
							if (state.wrap) {
								while (bits < 32) {
									if (have === 0) break inf_leave;
									have--;
									hold |= input[next++] << bits;
									bits += 8;
								}
								_out -= left;
								strm.total_out += _out;
								state.total += _out;
								if (_out) strm.adler = state.check = state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out);
								_out = left;
								if ((state.flags ? hold : zswap32(hold)) !== state.check) {
									strm.msg = "incorrect data check";
									state.mode = BAD;
									break;
								}
								hold = 0;
								bits = 0;
							}
							state.mode = LENGTH;
						case LENGTH:
							if (state.wrap && state.flags) {
								while (bits < 32) {
									if (have === 0) break inf_leave;
									have--;
									hold += input[next++] << bits;
									bits += 8;
								}
								if (hold !== (state.total & 4294967295)) {
									strm.msg = "incorrect length check";
									state.mode = BAD;
									break;
								}
								hold = 0;
								bits = 0;
							}
							state.mode = DONE;
						case DONE:
							ret = Z_STREAM_END;
							break inf_leave;
						case BAD:
							ret = Z_DATA_ERROR;
							break inf_leave;
						case MEM: return Z_MEM_ERROR;
						case SYNC:
						default: return Z_STREAM_ERROR;
					}
					strm.next_out = put;
					strm.avail_out = left;
					strm.next_in = next;
					strm.avail_in = have;
					state.hold = hold;
					state.bits = bits;
					if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH)) {
						if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
							state.mode = MEM;
							return Z_MEM_ERROR;
						}
					}
					_in -= strm.avail_in;
					_out -= strm.avail_out;
					strm.total_in += _in;
					strm.total_out += _out;
					state.total += _out;
					if (state.wrap && _out) strm.adler = state.check = state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out);
					strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
					if ((_in === 0 && _out === 0 || flush === Z_FINISH) && ret === Z_OK) ret = Z_BUF_ERROR;
					return ret;
				}
				function inflateEnd(strm) {
					if (!strm || !strm.state) return Z_STREAM_ERROR;
					var state = strm.state;
					if (state.window) state.window = null;
					strm.state = null;
					return Z_OK;
				}
				function inflateGetHeader(strm, head) {
					var state;
					if (!strm || !strm.state) return Z_STREAM_ERROR;
					state = strm.state;
					if ((state.wrap & 2) === 0) return Z_STREAM_ERROR;
					state.head = head;
					head.done = false;
					return Z_OK;
				}
				function inflateSetDictionary(strm, dictionary) {
					var dictLength = dictionary.length;
					var state;
					var dictid;
					var ret;
					if (!strm || !strm.state) return Z_STREAM_ERROR;
					state = strm.state;
					if (state.wrap !== 0 && state.mode !== DICT) return Z_STREAM_ERROR;
					if (state.mode === DICT) {
						dictid = 1;
						dictid = adler32(dictid, dictionary, dictLength, 0);
						if (dictid !== state.check) return Z_DATA_ERROR;
					}
					ret = updatewindow(strm, dictionary, dictLength, dictLength);
					if (ret) {
						state.mode = MEM;
						return Z_MEM_ERROR;
					}
					state.havedict = 1;
					return Z_OK;
				}
				exports$53.inflateReset = inflateReset;
				exports$53.inflateReset2 = inflateReset2;
				exports$53.inflateResetKeep = inflateResetKeep;
				exports$53.inflateInit = inflateInit;
				exports$53.inflateInit2 = inflateInit2;
				exports$53.inflate = inflate;
				exports$53.inflateEnd = inflateEnd;
				exports$53.inflateGetHeader = inflateGetHeader;
				exports$53.inflateSetDictionary = inflateSetDictionary;
				exports$53.inflateInfo = "pako inflate (from Nodeca project)";
			}, {
				"../utils/common": 41,
				"./adler32": 43,
				"./crc32": 45,
				"./inffast": 48,
				"./inftrees": 50
			}],
			50: [function(require, module$54, exports$54) {
				"use strict";
				var utils = require("../utils/common");
				var MAXBITS = 15;
				var ENOUGH_LENS = 852;
				var ENOUGH_DISTS = 592;
				var CODES = 0;
				var LENS = 1;
				var DISTS = 2;
				var lbase = [
					3,
					4,
					5,
					6,
					7,
					8,
					9,
					10,
					11,
					13,
					15,
					17,
					19,
					23,
					27,
					31,
					35,
					43,
					51,
					59,
					67,
					83,
					99,
					115,
					131,
					163,
					195,
					227,
					258,
					0,
					0
				];
				var lext = [
					16,
					16,
					16,
					16,
					16,
					16,
					16,
					16,
					17,
					17,
					17,
					17,
					18,
					18,
					18,
					18,
					19,
					19,
					19,
					19,
					20,
					20,
					20,
					20,
					21,
					21,
					21,
					21,
					16,
					72,
					78
				];
				var dbase = [
					1,
					2,
					3,
					4,
					5,
					7,
					9,
					13,
					17,
					25,
					33,
					49,
					65,
					97,
					129,
					193,
					257,
					385,
					513,
					769,
					1025,
					1537,
					2049,
					3073,
					4097,
					6145,
					8193,
					12289,
					16385,
					24577,
					0,
					0
				];
				var dext = [
					16,
					16,
					16,
					16,
					17,
					17,
					18,
					18,
					19,
					19,
					20,
					20,
					21,
					21,
					22,
					22,
					23,
					23,
					24,
					24,
					25,
					25,
					26,
					26,
					27,
					27,
					28,
					28,
					29,
					29,
					64,
					64
				];
				module$54.exports = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
					var bits = opts.bits;
					var len = 0;
					var sym = 0;
					var min = 0, max = 0;
					var root = 0;
					var curr = 0;
					var drop = 0;
					var left = 0;
					var used = 0;
					var huff = 0;
					var incr;
					var fill;
					var low;
					var mask;
					var next;
					var base = null;
					var base_index = 0;
					var end;
					var count = new utils.Buf16(MAXBITS + 1);
					var offs = new utils.Buf16(MAXBITS + 1);
					var extra = null;
					var extra_index = 0;
					var here_bits, here_op, here_val;
					for (len = 0; len <= MAXBITS; len++) count[len] = 0;
					for (sym = 0; sym < codes; sym++) count[lens[lens_index + sym]]++;
					root = bits;
					for (max = MAXBITS; max >= 1; max--) if (count[max] !== 0) break;
					if (root > max) root = max;
					if (max === 0) {
						table[table_index++] = 20971520;
						table[table_index++] = 20971520;
						opts.bits = 1;
						return 0;
					}
					for (min = 1; min < max; min++) if (count[min] !== 0) break;
					if (root < min) root = min;
					left = 1;
					for (len = 1; len <= MAXBITS; len++) {
						left <<= 1;
						left -= count[len];
						if (left < 0) return -1;
					}
					if (left > 0 && (type === CODES || max !== 1)) return -1;
					offs[1] = 0;
					for (len = 1; len < MAXBITS; len++) offs[len + 1] = offs[len] + count[len];
					for (sym = 0; sym < codes; sym++) if (lens[lens_index + sym] !== 0) work[offs[lens[lens_index + sym]]++] = sym;
					if (type === CODES) {
						base = extra = work;
						end = 19;
					} else if (type === LENS) {
						base = lbase;
						base_index -= 257;
						extra = lext;
						extra_index -= 257;
						end = 256;
					} else {
						base = dbase;
						extra = dext;
						end = -1;
					}
					huff = 0;
					sym = 0;
					len = min;
					next = table_index;
					curr = root;
					drop = 0;
					low = -1;
					used = 1 << root;
					mask = used - 1;
					if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) return 1;
					for (;;) {
						here_bits = len - drop;
						if (work[sym] < end) {
							here_op = 0;
							here_val = work[sym];
						} else if (work[sym] > end) {
							here_op = extra[extra_index + work[sym]];
							here_val = base[base_index + work[sym]];
						} else {
							here_op = 96;
							here_val = 0;
						}
						incr = 1 << len - drop;
						fill = 1 << curr;
						min = fill;
						do {
							fill -= incr;
							table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
						} while (fill !== 0);
						incr = 1 << len - 1;
						while (huff & incr) incr >>= 1;
						if (incr !== 0) {
							huff &= incr - 1;
							huff += incr;
						} else huff = 0;
						sym++;
						if (--count[len] === 0) {
							if (len === max) break;
							len = lens[lens_index + work[sym]];
						}
						if (len > root && (huff & mask) !== low) {
							if (drop === 0) drop = root;
							next += min;
							curr = len - drop;
							left = 1 << curr;
							while (curr + drop < max) {
								left -= count[curr + drop];
								if (left <= 0) break;
								curr++;
								left <<= 1;
							}
							used += 1 << curr;
							if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) return 1;
							low = huff & mask;
							table[low] = root << 24 | curr << 16 | next - table_index | 0;
						}
					}
					if (huff !== 0) table[next + huff] = len - drop << 24 | 4194304;
					opts.bits = root;
					return 0;
				};
			}, { "../utils/common": 41 }],
			51: [function(require, module$55, exports$55) {
				"use strict";
				module$55.exports = {
					2: "need dictionary",
					1: "stream end",
					0: "",
					"-1": "file error",
					"-2": "stream error",
					"-3": "data error",
					"-4": "insufficient memory",
					"-5": "buffer error",
					"-6": "incompatible version"
				};
			}, {}],
			52: [function(require, module$56, exports$56) {
				"use strict";
				var utils = require("../utils/common");
				var Z_FIXED = 4;
				var Z_BINARY = 0;
				var Z_TEXT = 1;
				var Z_UNKNOWN = 2;
				function zero(buf) {
					var len = buf.length;
					while (--len >= 0) buf[len] = 0;
				}
				var STORED_BLOCK = 0;
				var STATIC_TREES = 1;
				var DYN_TREES = 2;
				var MIN_MATCH = 3;
				var MAX_MATCH = 258;
				var LENGTH_CODES = 29;
				var LITERALS = 256;
				var L_CODES = LITERALS + 1 + LENGTH_CODES;
				var D_CODES = 30;
				var BL_CODES = 19;
				var HEAP_SIZE = 2 * L_CODES + 1;
				var MAX_BITS = 15;
				var Buf_size = 16;
				var MAX_BL_BITS = 7;
				var END_BLOCK = 256;
				var REP_3_6 = 16;
				var REPZ_3_10 = 17;
				var REPZ_11_138 = 18;
				var extra_lbits = [
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					1,
					1,
					1,
					1,
					2,
					2,
					2,
					2,
					3,
					3,
					3,
					3,
					4,
					4,
					4,
					4,
					5,
					5,
					5,
					5,
					0
				];
				var extra_dbits = [
					0,
					0,
					0,
					0,
					1,
					1,
					2,
					2,
					3,
					3,
					4,
					4,
					5,
					5,
					6,
					6,
					7,
					7,
					8,
					8,
					9,
					9,
					10,
					10,
					11,
					11,
					12,
					12,
					13,
					13
				];
				var extra_blbits = [
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					2,
					3,
					7
				];
				var bl_order = [
					16,
					17,
					18,
					0,
					8,
					7,
					9,
					6,
					10,
					5,
					11,
					4,
					12,
					3,
					13,
					2,
					14,
					1,
					15
				];
				var DIST_CODE_LEN = 512;
				var static_ltree = new Array((L_CODES + 2) * 2);
				zero(static_ltree);
				var static_dtree = new Array(D_CODES * 2);
				zero(static_dtree);
				var _dist_code = new Array(DIST_CODE_LEN);
				zero(_dist_code);
				var _length_code = new Array(MAX_MATCH - MIN_MATCH + 1);
				zero(_length_code);
				var base_length = new Array(LENGTH_CODES);
				zero(base_length);
				var base_dist = new Array(D_CODES);
				zero(base_dist);
				function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
					this.static_tree = static_tree;
					this.extra_bits = extra_bits;
					this.extra_base = extra_base;
					this.elems = elems;
					this.max_length = max_length;
					this.has_stree = static_tree && static_tree.length;
				}
				var static_l_desc;
				var static_d_desc;
				var static_bl_desc;
				function TreeDesc(dyn_tree, stat_desc) {
					this.dyn_tree = dyn_tree;
					this.max_code = 0;
					this.stat_desc = stat_desc;
				}
				function d_code(dist) {
					return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
				}
				function put_short(s, w) {
					s.pending_buf[s.pending++] = w & 255;
					s.pending_buf[s.pending++] = w >>> 8 & 255;
				}
				function send_bits(s, value, length) {
					if (s.bi_valid > Buf_size - length) {
						s.bi_buf |= value << s.bi_valid & 65535;
						put_short(s, s.bi_buf);
						s.bi_buf = value >> Buf_size - s.bi_valid;
						s.bi_valid += length - Buf_size;
					} else {
						s.bi_buf |= value << s.bi_valid & 65535;
						s.bi_valid += length;
					}
				}
				function send_code(s, c, tree) {
					send_bits(s, tree[c * 2], tree[c * 2 + 1]);
				}
				function bi_reverse(code, len) {
					var res = 0;
					do {
						res |= code & 1;
						code >>>= 1;
						res <<= 1;
					} while (--len > 0);
					return res >>> 1;
				}
				function bi_flush(s) {
					if (s.bi_valid === 16) {
						put_short(s, s.bi_buf);
						s.bi_buf = 0;
						s.bi_valid = 0;
					} else if (s.bi_valid >= 8) {
						s.pending_buf[s.pending++] = s.bi_buf & 255;
						s.bi_buf >>= 8;
						s.bi_valid -= 8;
					}
				}
				function gen_bitlen(s, desc) {
					var tree = desc.dyn_tree;
					var max_code = desc.max_code;
					var stree = desc.stat_desc.static_tree;
					var has_stree = desc.stat_desc.has_stree;
					var extra = desc.stat_desc.extra_bits;
					var base = desc.stat_desc.extra_base;
					var max_length = desc.stat_desc.max_length;
					var h;
					var n, m;
					var bits;
					var xbits;
					var f;
					var overflow = 0;
					for (bits = 0; bits <= MAX_BITS; bits++) s.bl_count[bits] = 0;
					tree[s.heap[s.heap_max] * 2 + 1] = 0;
					for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
						n = s.heap[h];
						bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
						if (bits > max_length) {
							bits = max_length;
							overflow++;
						}
						tree[n * 2 + 1] = bits;
						if (n > max_code) continue;
						s.bl_count[bits]++;
						xbits = 0;
						if (n >= base) xbits = extra[n - base];
						f = tree[n * 2];
						s.opt_len += f * (bits + xbits);
						if (has_stree) s.static_len += f * (stree[n * 2 + 1] + xbits);
					}
					if (overflow === 0) return;
					do {
						bits = max_length - 1;
						while (s.bl_count[bits] === 0) bits--;
						s.bl_count[bits]--;
						s.bl_count[bits + 1] += 2;
						s.bl_count[max_length]--;
						overflow -= 2;
					} while (overflow > 0);
					for (bits = max_length; bits !== 0; bits--) {
						n = s.bl_count[bits];
						while (n !== 0) {
							m = s.heap[--h];
							if (m > max_code) continue;
							if (tree[m * 2 + 1] !== bits) {
								s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
								tree[m * 2 + 1] = bits;
							}
							n--;
						}
					}
				}
				function gen_codes(tree, max_code, bl_count) {
					var next_code = new Array(MAX_BITS + 1);
					var code = 0;
					var bits;
					var n;
					for (bits = 1; bits <= MAX_BITS; bits++) next_code[bits] = code = code + bl_count[bits - 1] << 1;
					for (n = 0; n <= max_code; n++) {
						var len = tree[n * 2 + 1];
						if (len === 0) continue;
						tree[n * 2] = bi_reverse(next_code[len]++, len);
					}
				}
				function tr_static_init() {
					var n;
					var bits;
					var length;
					var code;
					var dist;
					var bl_count = new Array(MAX_BITS + 1);
					length = 0;
					for (code = 0; code < LENGTH_CODES - 1; code++) {
						base_length[code] = length;
						for (n = 0; n < 1 << extra_lbits[code]; n++) _length_code[length++] = code;
					}
					_length_code[length - 1] = code;
					dist = 0;
					for (code = 0; code < 16; code++) {
						base_dist[code] = dist;
						for (n = 0; n < 1 << extra_dbits[code]; n++) _dist_code[dist++] = code;
					}
					dist >>= 7;
					for (; code < D_CODES; code++) {
						base_dist[code] = dist << 7;
						for (n = 0; n < 1 << extra_dbits[code] - 7; n++) _dist_code[256 + dist++] = code;
					}
					for (bits = 0; bits <= MAX_BITS; bits++) bl_count[bits] = 0;
					n = 0;
					while (n <= 143) {
						static_ltree[n * 2 + 1] = 8;
						n++;
						bl_count[8]++;
					}
					while (n <= 255) {
						static_ltree[n * 2 + 1] = 9;
						n++;
						bl_count[9]++;
					}
					while (n <= 279) {
						static_ltree[n * 2 + 1] = 7;
						n++;
						bl_count[7]++;
					}
					while (n <= 287) {
						static_ltree[n * 2 + 1] = 8;
						n++;
						bl_count[8]++;
					}
					gen_codes(static_ltree, L_CODES + 1, bl_count);
					for (n = 0; n < D_CODES; n++) {
						static_dtree[n * 2 + 1] = 5;
						static_dtree[n * 2] = bi_reverse(n, 5);
					}
					static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
					static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS);
					static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS);
				}
				function init_block(s) {
					var n;
					for (n = 0; n < L_CODES; n++) s.dyn_ltree[n * 2] = 0;
					for (n = 0; n < D_CODES; n++) s.dyn_dtree[n * 2] = 0;
					for (n = 0; n < BL_CODES; n++) s.bl_tree[n * 2] = 0;
					s.dyn_ltree[END_BLOCK * 2] = 1;
					s.opt_len = s.static_len = 0;
					s.last_lit = s.matches = 0;
				}
				function bi_windup(s) {
					if (s.bi_valid > 8) put_short(s, s.bi_buf);
					else if (s.bi_valid > 0) s.pending_buf[s.pending++] = s.bi_buf;
					s.bi_buf = 0;
					s.bi_valid = 0;
				}
				function copy_block(s, buf, len, header) {
					bi_windup(s);
					if (header) {
						put_short(s, len);
						put_short(s, ~len);
					}
					utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
					s.pending += len;
				}
				function smaller(tree, n, m, depth) {
					var _n2 = n * 2;
					var _m2 = m * 2;
					return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
				}
				function pqdownheap(s, tree, k) {
					var v = s.heap[k];
					var j = k << 1;
					while (j <= s.heap_len) {
						if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) j++;
						if (smaller(tree, v, s.heap[j], s.depth)) break;
						s.heap[k] = s.heap[j];
						k = j;
						j <<= 1;
					}
					s.heap[k] = v;
				}
				function compress_block(s, ltree, dtree) {
					var dist;
					var lc;
					var lx = 0;
					var code;
					var extra;
					if (s.last_lit !== 0) do {
						dist = s.pending_buf[s.d_buf + lx * 2] << 8 | s.pending_buf[s.d_buf + lx * 2 + 1];
						lc = s.pending_buf[s.l_buf + lx];
						lx++;
						if (dist === 0) send_code(s, lc, ltree);
						else {
							code = _length_code[lc];
							send_code(s, code + LITERALS + 1, ltree);
							extra = extra_lbits[code];
							if (extra !== 0) {
								lc -= base_length[code];
								send_bits(s, lc, extra);
							}
							dist--;
							code = d_code(dist);
							send_code(s, code, dtree);
							extra = extra_dbits[code];
							if (extra !== 0) {
								dist -= base_dist[code];
								send_bits(s, dist, extra);
							}
						}
					} while (lx < s.last_lit);
					send_code(s, END_BLOCK, ltree);
				}
				function build_tree(s, desc) {
					var tree = desc.dyn_tree;
					var stree = desc.stat_desc.static_tree;
					var has_stree = desc.stat_desc.has_stree;
					var elems = desc.stat_desc.elems;
					var n, m;
					var max_code = -1;
					var node;
					s.heap_len = 0;
					s.heap_max = HEAP_SIZE;
					for (n = 0; n < elems; n++) if (tree[n * 2] !== 0) {
						s.heap[++s.heap_len] = max_code = n;
						s.depth[n] = 0;
					} else tree[n * 2 + 1] = 0;
					while (s.heap_len < 2) {
						node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
						tree[node * 2] = 1;
						s.depth[node] = 0;
						s.opt_len--;
						if (has_stree) s.static_len -= stree[node * 2 + 1];
					}
					desc.max_code = max_code;
					for (n = s.heap_len >> 1; n >= 1; n--) pqdownheap(s, tree, n);
					node = elems;
					do {
						/*** pqremove ***/
						n = s.heap[1];
						s.heap[1] = s.heap[s.heap_len--];
						pqdownheap(s, tree, 1);
						m = s.heap[1];
						s.heap[--s.heap_max] = n;
						s.heap[--s.heap_max] = m;
						tree[node * 2] = tree[n * 2] + tree[m * 2];
						s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
						tree[n * 2 + 1] = tree[m * 2 + 1] = node;
						s.heap[1] = node++;
						pqdownheap(s, tree, 1);
					} while (s.heap_len >= 2);
					s.heap[--s.heap_max] = s.heap[1];
					gen_bitlen(s, desc);
					gen_codes(tree, max_code, s.bl_count);
				}
				function scan_tree(s, tree, max_code) {
					var n;
					var prevlen = -1;
					var curlen;
					var nextlen = tree[1];
					var count = 0;
					var max_count = 7;
					var min_count = 4;
					if (nextlen === 0) {
						max_count = 138;
						min_count = 3;
					}
					tree[(max_code + 1) * 2 + 1] = 65535;
					for (n = 0; n <= max_code; n++) {
						curlen = nextlen;
						nextlen = tree[(n + 1) * 2 + 1];
						if (++count < max_count && curlen === nextlen) continue;
						else if (count < min_count) s.bl_tree[curlen * 2] += count;
						else if (curlen !== 0) {
							if (curlen !== prevlen) s.bl_tree[curlen * 2]++;
							s.bl_tree[REP_3_6 * 2]++;
						} else if (count <= 10) s.bl_tree[REPZ_3_10 * 2]++;
						else s.bl_tree[REPZ_11_138 * 2]++;
						count = 0;
						prevlen = curlen;
						if (nextlen === 0) {
							max_count = 138;
							min_count = 3;
						} else if (curlen === nextlen) {
							max_count = 6;
							min_count = 3;
						} else {
							max_count = 7;
							min_count = 4;
						}
					}
				}
				function send_tree(s, tree, max_code) {
					var n;
					var prevlen = -1;
					var curlen;
					var nextlen = tree[1];
					var count = 0;
					var max_count = 7;
					var min_count = 4;
					if (nextlen === 0) {
						max_count = 138;
						min_count = 3;
					}
					for (n = 0; n <= max_code; n++) {
						curlen = nextlen;
						nextlen = tree[(n + 1) * 2 + 1];
						if (++count < max_count && curlen === nextlen) continue;
						else if (count < min_count) do
							send_code(s, curlen, s.bl_tree);
						while (--count !== 0);
						else if (curlen !== 0) {
							if (curlen !== prevlen) {
								send_code(s, curlen, s.bl_tree);
								count--;
							}
							send_code(s, REP_3_6, s.bl_tree);
							send_bits(s, count - 3, 2);
						} else if (count <= 10) {
							send_code(s, REPZ_3_10, s.bl_tree);
							send_bits(s, count - 3, 3);
						} else {
							send_code(s, REPZ_11_138, s.bl_tree);
							send_bits(s, count - 11, 7);
						}
						count = 0;
						prevlen = curlen;
						if (nextlen === 0) {
							max_count = 138;
							min_count = 3;
						} else if (curlen === nextlen) {
							max_count = 6;
							min_count = 3;
						} else {
							max_count = 7;
							min_count = 4;
						}
					}
				}
				function build_bl_tree(s) {
					var max_blindex;
					scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
					scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
					build_tree(s, s.bl_desc);
					for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) break;
					s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
					return max_blindex;
				}
				function send_all_trees(s, lcodes, dcodes, blcodes) {
					var rank;
					send_bits(s, lcodes - 257, 5);
					send_bits(s, dcodes - 1, 5);
					send_bits(s, blcodes - 4, 4);
					for (rank = 0; rank < blcodes; rank++) send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1], 3);
					send_tree(s, s.dyn_ltree, lcodes - 1);
					send_tree(s, s.dyn_dtree, dcodes - 1);
				}
				function detect_data_type(s) {
					var black_mask = 4093624447;
					var n;
					for (n = 0; n <= 31; n++, black_mask >>>= 1) if (black_mask & 1 && s.dyn_ltree[n * 2] !== 0) return Z_BINARY;
					if (s.dyn_ltree[18] !== 0 || s.dyn_ltree[20] !== 0 || s.dyn_ltree[26] !== 0) return Z_TEXT;
					for (n = 32; n < LITERALS; n++) if (s.dyn_ltree[n * 2] !== 0) return Z_TEXT;
					return Z_BINARY;
				}
				var static_init_done = false;
				function _tr_init(s) {
					if (!static_init_done) {
						tr_static_init();
						static_init_done = true;
					}
					s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
					s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
					s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
					s.bi_buf = 0;
					s.bi_valid = 0;
					init_block(s);
				}
				function _tr_stored_block(s, buf, stored_len, last) {
					send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
					copy_block(s, buf, stored_len, true);
				}
				function _tr_align(s) {
					send_bits(s, STATIC_TREES << 1, 3);
					send_code(s, END_BLOCK, static_ltree);
					bi_flush(s);
				}
				function _tr_flush_block(s, buf, stored_len, last) {
					var opt_lenb, static_lenb;
					var max_blindex = 0;
					if (s.level > 0) {
						if (s.strm.data_type === Z_UNKNOWN) s.strm.data_type = detect_data_type(s);
						build_tree(s, s.l_desc);
						build_tree(s, s.d_desc);
						max_blindex = build_bl_tree(s);
						opt_lenb = s.opt_len + 3 + 7 >>> 3;
						static_lenb = s.static_len + 3 + 7 >>> 3;
						if (static_lenb <= opt_lenb) opt_lenb = static_lenb;
					} else opt_lenb = static_lenb = stored_len + 5;
					if (stored_len + 4 <= opt_lenb && buf !== -1) _tr_stored_block(s, buf, stored_len, last);
					else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
						send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
						compress_block(s, static_ltree, static_dtree);
					} else {
						send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
						send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
						compress_block(s, s.dyn_ltree, s.dyn_dtree);
					}
					init_block(s);
					if (last) bi_windup(s);
				}
				function _tr_tally(s, dist, lc) {
					s.pending_buf[s.d_buf + s.last_lit * 2] = dist >>> 8 & 255;
					s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 255;
					s.pending_buf[s.l_buf + s.last_lit] = lc & 255;
					s.last_lit++;
					if (dist === 0) s.dyn_ltree[lc * 2]++;
					else {
						s.matches++;
						dist--;
						s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]++;
						s.dyn_dtree[d_code(dist) * 2]++;
					}
					return s.last_lit === s.lit_bufsize - 1;
				}
				exports$56._tr_init = _tr_init;
				exports$56._tr_stored_block = _tr_stored_block;
				exports$56._tr_flush_block = _tr_flush_block;
				exports$56._tr_tally = _tr_tally;
				exports$56._tr_align = _tr_align;
			}, { "../utils/common": 41 }],
			53: [function(require, module$57, exports$57) {
				"use strict";
				function ZStream() {
					this.input = null;
					this.next_in = 0;
					this.avail_in = 0;
					this.total_in = 0;
					this.output = null;
					this.next_out = 0;
					this.avail_out = 0;
					this.total_out = 0;
					this.msg = "";
					this.state = null;
					this.data_type = 2;
					this.adler = 0;
				}
				module$57.exports = ZStream;
			}, {}],
			54: [function(require, module$58, exports$58) {
				(function(global) {
					(function(global, undefined) {
						"use strict";
						if (global.setImmediate) return;
						var nextHandle = 1;
						var tasksByHandle = {};
						var currentlyRunningATask = false;
						var doc = global.document;
						var registerImmediate;
						function setImmediate(callback) {
							if (typeof callback !== "function") callback = new Function("" + callback);
							var args = new Array(arguments.length - 1);
							for (var i = 0; i < args.length; i++) args[i] = arguments[i + 1];
							tasksByHandle[nextHandle] = {
								callback,
								args
							};
							registerImmediate(nextHandle);
							return nextHandle++;
						}
						function clearImmediate(handle) {
							delete tasksByHandle[handle];
						}
						function run(task) {
							var callback = task.callback;
							var args = task.args;
							switch (args.length) {
								case 0:
									callback();
									break;
								case 1:
									callback(args[0]);
									break;
								case 2:
									callback(args[0], args[1]);
									break;
								case 3:
									callback(args[0], args[1], args[2]);
									break;
								default:
									callback.apply(undefined, args);
									break;
							}
						}
						function runIfPresent(handle) {
							if (currentlyRunningATask) setTimeout(runIfPresent, 0, handle);
							else {
								var task = tasksByHandle[handle];
								if (task) {
									currentlyRunningATask = true;
									try {
										run(task);
									} finally {
										clearImmediate(handle);
										currentlyRunningATask = false;
									}
								}
							}
						}
						function installNextTickImplementation() {
							registerImmediate = function(handle) {
								process.nextTick(function() {
									runIfPresent(handle);
								});
							};
						}
						function canUsePostMessage() {
							if (global.postMessage && !global.importScripts) {
								var postMessageIsAsynchronous = true;
								var oldOnMessage = global.onmessage;
								global.onmessage = function() {
									postMessageIsAsynchronous = false;
								};
								global.postMessage("", "*");
								global.onmessage = oldOnMessage;
								return postMessageIsAsynchronous;
							}
						}
						function installPostMessageImplementation() {
							var messagePrefix = "setImmediate$" + Math.random() + "$";
							var onGlobalMessage = function(event) {
								if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) runIfPresent(+event.data.slice(messagePrefix.length));
							};
							if (global.addEventListener) global.addEventListener("message", onGlobalMessage, false);
							else global.attachEvent("onmessage", onGlobalMessage);
							registerImmediate = function(handle) {
								global.postMessage(messagePrefix + handle, "*");
							};
						}
						function installMessageChannelImplementation() {
							var channel = new MessageChannel();
							channel.port1.onmessage = function(event) {
								var handle = event.data;
								runIfPresent(handle);
							};
							registerImmediate = function(handle) {
								channel.port2.postMessage(handle);
							};
						}
						function installReadyStateChangeImplementation() {
							var html = doc.documentElement;
							registerImmediate = function(handle) {
								var script = doc.createElement("script");
								script.onreadystatechange = function() {
									runIfPresent(handle);
									script.onreadystatechange = null;
									html.removeChild(script);
									script = null;
								};
								html.appendChild(script);
							};
						}
						function installSetTimeoutImplementation() {
							registerImmediate = function(handle) {
								setTimeout(runIfPresent, 0, handle);
							};
						}
						var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
						attachTo = attachTo && attachTo.setTimeout ? attachTo : global;
						if ({}.toString.call(global.process) === "[object process]") installNextTickImplementation();
						else if (canUsePostMessage()) installPostMessageImplementation();
						else if (global.MessageChannel) installMessageChannelImplementation();
						else if (doc && "onreadystatechange" in doc.createElement("script")) installReadyStateChangeImplementation();
						else installSetTimeoutImplementation();
						attachTo.setImmediate = setImmediate;
						attachTo.clearImmediate = clearImmediate;
					})(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self);
				}).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
			}, {}]
		}, {}, [10])(10);
	});
})))());
/**
* Handles Unzipping a requesting files from an Epub Archive
* @class
*/
var Archive = class {
	constructor() {
		this.zip = void 0;
		this.urlCache = {};
		this.checkRequirements();
	}
	/**
	* Checks to see if JSZip exists in global namspace,
	* Requires JSZip if it isn't there
	* @private
	*/
	checkRequirements() {
		try {
			this.zip = new import_jszip.default();
		} catch (e) {
			throw new Error("JSZip lib not loaded");
		}
	}
	/**
	* Open an archive
	* @param  {binary} input
	* @param  {boolean} [isBase64] tells JSZip if the input data is base64 encoded
	* @return {Promise} zipfile
	*/
	open(input, isBase64) {
		return this.zip.loadAsync(input, { "base64": isBase64 });
	}
	/**
	* Load and Open an archive
	* @param  {string} zipUrl
	* @param  {boolean} [isBase64] tells JSZip if the input data is base64 encoded
	* @return {Promise} zipfile
	*/
	openUrl(zipUrl, isBase64) {
		return request(zipUrl, "binary").then(function(data) {
			return this.zip.loadAsync(data, { "base64": isBase64 });
		}.bind(this));
	}
	/**
	* Request a url from the archive
	* @param  {string} url  a url to request from the archive
	* @param  {string} [type] specify the type of the returned result
	* @return {Promise<Blob | string | JSON | Document | XMLDocument>}
	*/
	request(url, type) {
		var deferred = new defer();
		var response;
		var path = new Path(url);
		if (!type) type = path.extension;
		if (type == "blob") response = this.getBlob(url);
		else response = this.getText(url);
		if (response) response.then(function(r) {
			let result = this.handleResponse(r, type);
			deferred.resolve(result);
		}.bind(this));
		else deferred.reject({
			message: "File not found in the epub: " + url,
			stack: (/* @__PURE__ */ new Error()).stack
		});
		return deferred.promise;
	}
	/**
	* Handle the response from request
	* @private
	* @param  {any} response
	* @param  {string} [type]
	* @return {any} the parsed result
	*/
	handleResponse(response, type) {
		var r;
		if (type == "json") r = JSON.parse(response);
		else if (isXml(type)) r = parse(response, "text/xml");
		else if (type == "xhtml") r = parse(response, "application/xhtml+xml");
		else if (type == "html" || type == "htm") r = parse(response, "text/html");
		else r = response;
		return r;
	}
	/**
	* Get a Blob from Archive by Url
	* @param  {string} url
	* @param  {string} [mimeType]
	* @return {Blob}
	*/
	getBlob(url, mimeType) {
		var decodededUrl = window.decodeURIComponent(url.substr(1));
		var entry = this.zip.file(decodededUrl);
		if (entry) {
			mimeType = mimeType || mime_default.lookup(entry.name);
			return entry.async("uint8array").then(function(uint8array) {
				return new Blob([uint8array], { type: mimeType });
			});
		}
	}
	/**
	* Get Text from Archive by Url
	* @param  {string} url
	* @param  {string} [encoding]
	* @return {string}
	*/
	getText(url, encoding) {
		var decodededUrl = window.decodeURIComponent(url.substr(1));
		var entry = this.zip.file(decodededUrl);
		if (entry) return entry.async("string").then(function(text) {
			return text;
		});
	}
	/**
	* Get a base64 encoded result from Archive by Url
	* @param  {string} url
	* @param  {string} [mimeType]
	* @return {string} base64 encoded
	*/
	getBase64(url, mimeType) {
		var decodededUrl = window.decodeURIComponent(url.substr(1));
		var entry = this.zip.file(decodededUrl);
		if (entry) {
			mimeType = mimeType || mime_default.lookup(entry.name);
			return entry.async("base64").then(function(data) {
				return "data:" + mimeType + ";base64," + data;
			});
		}
	}
	/**
	* Create a Url from an unarchived item
	* @param  {string} url
	* @param  {object} [options.base64] use base64 encoding or blob url
	* @return {Promise} url promise with Url string
	*/
	createUrl(url, options) {
		var deferred = new defer();
		var _URL = window.URL || window.webkitURL || window.mozURL;
		var tempUrl;
		var response;
		var useBase64 = options && options.base64;
		if (url in this.urlCache) {
			deferred.resolve(this.urlCache[url]);
			return deferred.promise;
		}
		if (useBase64) {
			response = this.getBase64(url);
			if (response) response.then(function(tempUrl) {
				this.urlCache[url] = tempUrl;
				deferred.resolve(tempUrl);
			}.bind(this));
		} else {
			response = this.getBlob(url);
			if (response) response.then(function(blob) {
				tempUrl = _URL.createObjectURL(blob);
				this.urlCache[url] = tempUrl;
				deferred.resolve(tempUrl);
			}.bind(this));
		}
		if (!response) deferred.reject({
			message: "File not found in the epub: " + url,
			stack: (/* @__PURE__ */ new Error()).stack
		});
		return deferred.promise;
	}
	/**
	* Revoke Temp Url for a archive item
	* @param  {string} url url of the item in the archive
	*/
	revokeUrl(url) {
		var _URL = window.URL || window.webkitURL || window.mozURL;
		var fromCache = this.urlCache[url];
		if (fromCache) _URL.revokeObjectURL(fromCache);
	}
	destroy() {
		var _URL = window.URL || window.webkitURL || window.mozURL;
		for (let fromCache in this.urlCache) _URL.revokeObjectURL(fromCache);
		this.zip = void 0;
		this.urlCache = {};
	}
};
/*!
localForage -- Offline Storage, Improved
Version 1.10.0
https://localforage.github.io/localForage
(c) 2013-2017 Mozilla, Apache License 2.0
*/
//#endregion
//#region node_modules/epubjs/src/store.js
var import_localforage = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(f) {
		if (typeof exports === "object" && typeof module !== "undefined") module.exports = f();
		else if (typeof define === "function" && define.amd) define([], f);
		else {
			var g;
			if (typeof window !== "undefined") g = window;
			else if (typeof global !== "undefined") g = global;
			else if (typeof self !== "undefined") g = self;
			else g = this;
			g.localforage = f();
		}
	})(function() {
		return (function e(t, n, r) {
			function s(o, u) {
				if (!n[o]) {
					if (!t[o]) {
						var a = typeof __require == "function" && __require;
						if (!u && a) return a(o, !0);
						if (i) return i(o, !0);
						var f = /* @__PURE__ */ new Error("Cannot find module '" + o + "'");
						throw f.code = "MODULE_NOT_FOUND", f;
					}
					var l = n[o] = { exports: {} };
					t[o][0].call(l.exports, function(e) {
						var n = t[o][1][e];
						return s(n ? n : e);
					}, l, l.exports, e, t, n, r);
				}
				return n[o].exports;
			}
			var i = typeof __require == "function" && __require;
			for (var o = 0; o < r.length; o++) s(r[o]);
			return s;
		})({
			1: [function(_dereq_, module$1, exports$1) {
				(function(global) {
					"use strict";
					var Mutation = global.MutationObserver || global.WebKitMutationObserver;
					var scheduleDrain;
					if (Mutation) {
						var called = 0;
						var observer = new Mutation(nextTick);
						var element = global.document.createTextNode("");
						observer.observe(element, { characterData: true });
						scheduleDrain = function() {
							element.data = called = ++called % 2;
						};
					} else if (!global.setImmediate && typeof global.MessageChannel !== "undefined") {
						var channel = new global.MessageChannel();
						channel.port1.onmessage = nextTick;
						scheduleDrain = function() {
							channel.port2.postMessage(0);
						};
					} else if ("document" in global && "onreadystatechange" in global.document.createElement("script")) scheduleDrain = function() {
						var scriptEl = global.document.createElement("script");
						scriptEl.onreadystatechange = function() {
							nextTick();
							scriptEl.onreadystatechange = null;
							scriptEl.parentNode.removeChild(scriptEl);
							scriptEl = null;
						};
						global.document.documentElement.appendChild(scriptEl);
					};
					else scheduleDrain = function() {
						setTimeout(nextTick, 0);
					};
					var draining;
					var queue = [];
					function nextTick() {
						draining = true;
						var i, oldQueue;
						var len = queue.length;
						while (len) {
							oldQueue = queue;
							queue = [];
							i = -1;
							while (++i < len) oldQueue[i]();
							len = queue.length;
						}
						draining = false;
					}
					module$1.exports = immediate;
					function immediate(task) {
						if (queue.push(task) === 1 && !draining) scheduleDrain();
					}
				}).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
			}, {}],
			2: [function(_dereq_, module$2, exports$2) {
				"use strict";
				var immediate = _dereq_(1);
				/* istanbul ignore next */
				function INTERNAL() {}
				var handlers = {};
				var REJECTED = ["REJECTED"];
				var FULFILLED = ["FULFILLED"];
				var PENDING = ["PENDING"];
				module$2.exports = Promise;
				function Promise(resolver) {
					if (typeof resolver !== "function") throw new TypeError("resolver must be a function");
					this.state = PENDING;
					this.queue = [];
					this.outcome = void 0;
					if (resolver !== INTERNAL) safelyResolveThenable(this, resolver);
				}
				Promise.prototype["catch"] = function(onRejected) {
					return this.then(null, onRejected);
				};
				Promise.prototype.then = function(onFulfilled, onRejected) {
					if (typeof onFulfilled !== "function" && this.state === FULFILLED || typeof onRejected !== "function" && this.state === REJECTED) return this;
					var promise = new this.constructor(INTERNAL);
					if (this.state !== PENDING) unwrap(promise, this.state === FULFILLED ? onFulfilled : onRejected, this.outcome);
					else this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
					return promise;
				};
				function QueueItem(promise, onFulfilled, onRejected) {
					this.promise = promise;
					if (typeof onFulfilled === "function") {
						this.onFulfilled = onFulfilled;
						this.callFulfilled = this.otherCallFulfilled;
					}
					if (typeof onRejected === "function") {
						this.onRejected = onRejected;
						this.callRejected = this.otherCallRejected;
					}
				}
				QueueItem.prototype.callFulfilled = function(value) {
					handlers.resolve(this.promise, value);
				};
				QueueItem.prototype.otherCallFulfilled = function(value) {
					unwrap(this.promise, this.onFulfilled, value);
				};
				QueueItem.prototype.callRejected = function(value) {
					handlers.reject(this.promise, value);
				};
				QueueItem.prototype.otherCallRejected = function(value) {
					unwrap(this.promise, this.onRejected, value);
				};
				function unwrap(promise, func, value) {
					immediate(function() {
						var returnValue;
						try {
							returnValue = func(value);
						} catch (e) {
							return handlers.reject(promise, e);
						}
						if (returnValue === promise) handlers.reject(promise, /* @__PURE__ */ new TypeError("Cannot resolve promise with itself"));
						else handlers.resolve(promise, returnValue);
					});
				}
				handlers.resolve = function(self, value) {
					var result = tryCatch(getThen, value);
					if (result.status === "error") return handlers.reject(self, result.value);
					var thenable = result.value;
					if (thenable) safelyResolveThenable(self, thenable);
					else {
						self.state = FULFILLED;
						self.outcome = value;
						var i = -1;
						var len = self.queue.length;
						while (++i < len) self.queue[i].callFulfilled(value);
					}
					return self;
				};
				handlers.reject = function(self, error) {
					self.state = REJECTED;
					self.outcome = error;
					var i = -1;
					var len = self.queue.length;
					while (++i < len) self.queue[i].callRejected(error);
					return self;
				};
				function getThen(obj) {
					var then = obj && obj.then;
					if (obj && (typeof obj === "object" || typeof obj === "function") && typeof then === "function") return function appyThen() {
						then.apply(obj, arguments);
					};
				}
				function safelyResolveThenable(self, thenable) {
					var called = false;
					function onError(value) {
						if (called) return;
						called = true;
						handlers.reject(self, value);
					}
					function onSuccess(value) {
						if (called) return;
						called = true;
						handlers.resolve(self, value);
					}
					function tryToUnwrap() {
						thenable(onSuccess, onError);
					}
					var result = tryCatch(tryToUnwrap);
					if (result.status === "error") onError(result.value);
				}
				function tryCatch(func, value) {
					var out = {};
					try {
						out.value = func(value);
						out.status = "success";
					} catch (e) {
						out.status = "error";
						out.value = e;
					}
					return out;
				}
				Promise.resolve = resolve;
				function resolve(value) {
					if (value instanceof this) return value;
					return handlers.resolve(new this(INTERNAL), value);
				}
				Promise.reject = reject;
				function reject(reason) {
					var promise = new this(INTERNAL);
					return handlers.reject(promise, reason);
				}
				Promise.all = all;
				function all(iterable) {
					var self = this;
					if (Object.prototype.toString.call(iterable) !== "[object Array]") return this.reject(/* @__PURE__ */ new TypeError("must be an array"));
					var len = iterable.length;
					var called = false;
					if (!len) return this.resolve([]);
					var values = new Array(len);
					var resolved = 0;
					var i = -1;
					var promise = new this(INTERNAL);
					while (++i < len) allResolver(iterable[i], i);
					return promise;
					function allResolver(value, i) {
						self.resolve(value).then(resolveFromAll, function(error) {
							if (!called) {
								called = true;
								handlers.reject(promise, error);
							}
						});
						function resolveFromAll(outValue) {
							values[i] = outValue;
							if (++resolved === len && !called) {
								called = true;
								handlers.resolve(promise, values);
							}
						}
					}
				}
				Promise.race = race;
				function race(iterable) {
					var self = this;
					if (Object.prototype.toString.call(iterable) !== "[object Array]") return this.reject(/* @__PURE__ */ new TypeError("must be an array"));
					var len = iterable.length;
					var called = false;
					if (!len) return this.resolve([]);
					var i = -1;
					var promise = new this(INTERNAL);
					while (++i < len) resolver(iterable[i]);
					return promise;
					function resolver(value) {
						self.resolve(value).then(function(response) {
							if (!called) {
								called = true;
								handlers.resolve(promise, response);
							}
						}, function(error) {
							if (!called) {
								called = true;
								handlers.reject(promise, error);
							}
						});
					}
				}
			}, { "1": 1 }],
			3: [function(_dereq_, module$3, exports$3) {
				(function(global) {
					"use strict";
					if (typeof global.Promise !== "function") global.Promise = _dereq_(2);
				}).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
			}, { "2": 2 }],
			4: [function(_dereq_, module$4, exports$4) {
				"use strict";
				var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
					return typeof obj;
				} : function(obj) {
					return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
				};
				function _classCallCheck(instance, Constructor) {
					if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
				}
				function getIDB() {
					try {
						if (typeof indexedDB !== "undefined") return indexedDB;
						if (typeof webkitIndexedDB !== "undefined") return webkitIndexedDB;
						if (typeof mozIndexedDB !== "undefined") return mozIndexedDB;
						if (typeof OIndexedDB !== "undefined") return OIndexedDB;
						if (typeof msIndexedDB !== "undefined") return msIndexedDB;
					} catch (e) {
						return;
					}
				}
				var idb = getIDB();
				function isIndexedDBValid() {
					try {
						if (!idb || !idb.open) return false;
						var isSafari = typeof openDatabase !== "undefined" && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform);
						var hasFetch = typeof fetch === "function" && fetch.toString().indexOf("[native code") !== -1;
						return (!isSafari || hasFetch) && typeof indexedDB !== "undefined" && typeof IDBKeyRange !== "undefined";
					} catch (e) {
						return false;
					}
				}
				function createBlob(parts, properties) {
					parts = parts || [];
					properties = properties || {};
					try {
						return new Blob(parts, properties);
					} catch (e) {
						if (e.name !== "TypeError") throw e;
						var builder = new (typeof BlobBuilder !== "undefined" ? BlobBuilder : typeof MSBlobBuilder !== "undefined" ? MSBlobBuilder : typeof MozBlobBuilder !== "undefined" ? MozBlobBuilder : WebKitBlobBuilder)();
						for (var i = 0; i < parts.length; i += 1) builder.append(parts[i]);
						return builder.getBlob(properties.type);
					}
				}
				if (typeof Promise === "undefined") _dereq_(3);
				var Promise$1 = Promise;
				function executeCallback(promise, callback) {
					if (callback) promise.then(function(result) {
						callback(null, result);
					}, function(error) {
						callback(error);
					});
				}
				function executeTwoCallbacks(promise, callback, errorCallback) {
					if (typeof callback === "function") promise.then(callback);
					if (typeof errorCallback === "function") promise["catch"](errorCallback);
				}
				function normalizeKey(key) {
					if (typeof key !== "string") {
						console.warn(key + " used as a key, but it is not a string.");
						key = String(key);
					}
					return key;
				}
				function getCallback() {
					if (arguments.length && typeof arguments[arguments.length - 1] === "function") return arguments[arguments.length - 1];
				}
				var DETECT_BLOB_SUPPORT_STORE = "local-forage-detect-blob-support";
				var supportsBlobs = void 0;
				var dbContexts = {};
				var toString = Object.prototype.toString;
				var READ_ONLY = "readonly";
				var READ_WRITE = "readwrite";
				function _binStringToArrayBuffer(bin) {
					var length = bin.length;
					var buf = new ArrayBuffer(length);
					var arr = new Uint8Array(buf);
					for (var i = 0; i < length; i++) arr[i] = bin.charCodeAt(i);
					return buf;
				}
				function _checkBlobSupportWithoutCaching(idb) {
					return new Promise$1(function(resolve) {
						var txn = idb.transaction(DETECT_BLOB_SUPPORT_STORE, READ_WRITE);
						var blob = createBlob([""]);
						txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, "key");
						txn.onabort = function(e) {
							e.preventDefault();
							e.stopPropagation();
							resolve(false);
						};
						txn.oncomplete = function() {
							var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
							resolve(navigator.userAgent.match(/Edge\//) || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
						};
					})["catch"](function() {
						return false;
					});
				}
				function _checkBlobSupport(idb) {
					if (typeof supportsBlobs === "boolean") return Promise$1.resolve(supportsBlobs);
					return _checkBlobSupportWithoutCaching(idb).then(function(value) {
						supportsBlobs = value;
						return supportsBlobs;
					});
				}
				function _deferReadiness(dbInfo) {
					var dbContext = dbContexts[dbInfo.name];
					var deferredOperation = {};
					deferredOperation.promise = new Promise$1(function(resolve, reject) {
						deferredOperation.resolve = resolve;
						deferredOperation.reject = reject;
					});
					dbContext.deferredOperations.push(deferredOperation);
					if (!dbContext.dbReady) dbContext.dbReady = deferredOperation.promise;
					else dbContext.dbReady = dbContext.dbReady.then(function() {
						return deferredOperation.promise;
					});
				}
				function _advanceReadiness(dbInfo) {
					var deferredOperation = dbContexts[dbInfo.name].deferredOperations.pop();
					if (deferredOperation) {
						deferredOperation.resolve();
						return deferredOperation.promise;
					}
				}
				function _rejectReadiness(dbInfo, err) {
					var deferredOperation = dbContexts[dbInfo.name].deferredOperations.pop();
					if (deferredOperation) {
						deferredOperation.reject(err);
						return deferredOperation.promise;
					}
				}
				function _getConnection(dbInfo, upgradeNeeded) {
					return new Promise$1(function(resolve, reject) {
						dbContexts[dbInfo.name] = dbContexts[dbInfo.name] || createDbContext();
						if (dbInfo.db) if (upgradeNeeded) {
							_deferReadiness(dbInfo);
							dbInfo.db.close();
						} else return resolve(dbInfo.db);
						var dbArgs = [dbInfo.name];
						if (upgradeNeeded) dbArgs.push(dbInfo.version);
						var openreq = idb.open.apply(idb, dbArgs);
						if (upgradeNeeded) openreq.onupgradeneeded = function(e) {
							var db = openreq.result;
							try {
								db.createObjectStore(dbInfo.storeName);
								if (e.oldVersion <= 1) db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
							} catch (ex) {
								if (ex.name === "ConstraintError") console.warn("The database \"" + dbInfo.name + "\" has been upgraded from version " + e.oldVersion + " to version " + e.newVersion + ", but the storage \"" + dbInfo.storeName + "\" already exists.");
								else throw ex;
							}
						};
						openreq.onerror = function(e) {
							e.preventDefault();
							reject(openreq.error);
						};
						openreq.onsuccess = function() {
							var db = openreq.result;
							db.onversionchange = function(e) {
								e.target.close();
							};
							resolve(db);
							_advanceReadiness(dbInfo);
						};
					});
				}
				function _getOriginalConnection(dbInfo) {
					return _getConnection(dbInfo, false);
				}
				function _getUpgradedConnection(dbInfo) {
					return _getConnection(dbInfo, true);
				}
				function _isUpgradeNeeded(dbInfo, defaultVersion) {
					if (!dbInfo.db) return true;
					var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
					var isDowngrade = dbInfo.version < dbInfo.db.version;
					var isUpgrade = dbInfo.version > dbInfo.db.version;
					if (isDowngrade) {
						if (dbInfo.version !== defaultVersion) console.warn("The database \"" + dbInfo.name + "\" can't be downgraded from version " + dbInfo.db.version + " to version " + dbInfo.version + ".");
						dbInfo.version = dbInfo.db.version;
					}
					if (isUpgrade || isNewStore) {
						if (isNewStore) {
							var incVersion = dbInfo.db.version + 1;
							if (incVersion > dbInfo.version) dbInfo.version = incVersion;
						}
						return true;
					}
					return false;
				}
				function _encodeBlob(blob) {
					return new Promise$1(function(resolve, reject) {
						var reader = new FileReader();
						reader.onerror = reject;
						reader.onloadend = function(e) {
							resolve({
								__local_forage_encoded_blob: true,
								data: btoa(e.target.result || ""),
								type: blob.type
							});
						};
						reader.readAsBinaryString(blob);
					});
				}
				function _decodeBlob(encodedBlob) {
					return createBlob([_binStringToArrayBuffer(atob(encodedBlob.data))], { type: encodedBlob.type });
				}
				function _isEncodedBlob(value) {
					return value && value.__local_forage_encoded_blob;
				}
				function _fullyReady(callback) {
					var self = this;
					var promise = self._initReady().then(function() {
						var dbContext = dbContexts[self._dbInfo.name];
						if (dbContext && dbContext.dbReady) return dbContext.dbReady;
					});
					executeTwoCallbacks(promise, callback, callback);
					return promise;
				}
				function _tryReconnect(dbInfo) {
					_deferReadiness(dbInfo);
					var dbContext = dbContexts[dbInfo.name];
					var forages = dbContext.forages;
					for (var i = 0; i < forages.length; i++) {
						var forage = forages[i];
						if (forage._dbInfo.db) {
							forage._dbInfo.db.close();
							forage._dbInfo.db = null;
						}
					}
					dbInfo.db = null;
					return _getOriginalConnection(dbInfo).then(function(db) {
						dbInfo.db = db;
						if (_isUpgradeNeeded(dbInfo)) return _getUpgradedConnection(dbInfo);
						return db;
					}).then(function(db) {
						dbInfo.db = dbContext.db = db;
						for (var i = 0; i < forages.length; i++) forages[i]._dbInfo.db = db;
					})["catch"](function(err) {
						_rejectReadiness(dbInfo, err);
						throw err;
					});
				}
				function createTransaction(dbInfo, mode, callback, retries) {
					if (retries === void 0) retries = 1;
					try {
						callback(null, dbInfo.db.transaction(dbInfo.storeName, mode));
					} catch (err) {
						if (retries > 0 && (!dbInfo.db || err.name === "InvalidStateError" || err.name === "NotFoundError")) return Promise$1.resolve().then(function() {
							if (!dbInfo.db || err.name === "NotFoundError" && !dbInfo.db.objectStoreNames.contains(dbInfo.storeName) && dbInfo.version <= dbInfo.db.version) {
								if (dbInfo.db) dbInfo.version = dbInfo.db.version + 1;
								return _getUpgradedConnection(dbInfo);
							}
						}).then(function() {
							return _tryReconnect(dbInfo).then(function() {
								createTransaction(dbInfo, mode, callback, retries - 1);
							});
						})["catch"](callback);
						callback(err);
					}
				}
				function createDbContext() {
					return {
						forages: [],
						db: null,
						dbReady: null,
						deferredOperations: []
					};
				}
				function _initStorage(options) {
					var self = this;
					var dbInfo = { db: null };
					if (options) for (var i in options) dbInfo[i] = options[i];
					var dbContext = dbContexts[dbInfo.name];
					if (!dbContext) {
						dbContext = createDbContext();
						dbContexts[dbInfo.name] = dbContext;
					}
					dbContext.forages.push(self);
					if (!self._initReady) {
						self._initReady = self.ready;
						self.ready = _fullyReady;
					}
					var initPromises = [];
					function ignoreErrors() {
						return Promise$1.resolve();
					}
					for (var j = 0; j < dbContext.forages.length; j++) {
						var forage = dbContext.forages[j];
						if (forage !== self) initPromises.push(forage._initReady()["catch"](ignoreErrors));
					}
					var forages = dbContext.forages.slice(0);
					return Promise$1.all(initPromises).then(function() {
						dbInfo.db = dbContext.db;
						return _getOriginalConnection(dbInfo);
					}).then(function(db) {
						dbInfo.db = db;
						if (_isUpgradeNeeded(dbInfo, self._defaultConfig.version)) return _getUpgradedConnection(dbInfo);
						return db;
					}).then(function(db) {
						dbInfo.db = dbContext.db = db;
						self._dbInfo = dbInfo;
						for (var k = 0; k < forages.length; k++) {
							var forage = forages[k];
							if (forage !== self) {
								forage._dbInfo.db = dbInfo.db;
								forage._dbInfo.version = dbInfo.version;
							}
						}
					});
				}
				function getItem(key, callback) {
					var self = this;
					key = normalizeKey(key);
					var promise = new Promise$1(function(resolve, reject) {
						self.ready().then(function() {
							createTransaction(self._dbInfo, READ_ONLY, function(err, transaction) {
								if (err) return reject(err);
								try {
									var req = transaction.objectStore(self._dbInfo.storeName).get(key);
									req.onsuccess = function() {
										var value = req.result;
										if (value === void 0) value = null;
										if (_isEncodedBlob(value)) value = _decodeBlob(value);
										resolve(value);
									};
									req.onerror = function() {
										reject(req.error);
									};
								} catch (e) {
									reject(e);
								}
							});
						})["catch"](reject);
					});
					executeCallback(promise, callback);
					return promise;
				}
				function iterate(iterator, callback) {
					var self = this;
					var promise = new Promise$1(function(resolve, reject) {
						self.ready().then(function() {
							createTransaction(self._dbInfo, READ_ONLY, function(err, transaction) {
								if (err) return reject(err);
								try {
									var req = transaction.objectStore(self._dbInfo.storeName).openCursor();
									var iterationNumber = 1;
									req.onsuccess = function() {
										var cursor = req.result;
										if (cursor) {
											var value = cursor.value;
											if (_isEncodedBlob(value)) value = _decodeBlob(value);
											var result = iterator(value, cursor.key, iterationNumber++);
											if (result !== void 0) resolve(result);
											else cursor["continue"]();
										} else resolve();
									};
									req.onerror = function() {
										reject(req.error);
									};
								} catch (e) {
									reject(e);
								}
							});
						})["catch"](reject);
					});
					executeCallback(promise, callback);
					return promise;
				}
				function setItem(key, value, callback) {
					var self = this;
					key = normalizeKey(key);
					var promise = new Promise$1(function(resolve, reject) {
						var dbInfo;
						self.ready().then(function() {
							dbInfo = self._dbInfo;
							if (toString.call(value) === "[object Blob]") return _checkBlobSupport(dbInfo.db).then(function(blobSupport) {
								if (blobSupport) return value;
								return _encodeBlob(value);
							});
							return value;
						}).then(function(value) {
							createTransaction(self._dbInfo, READ_WRITE, function(err, transaction) {
								if (err) return reject(err);
								try {
									var store = transaction.objectStore(self._dbInfo.storeName);
									if (value === null) value = void 0;
									var req = store.put(value, key);
									transaction.oncomplete = function() {
										if (value === void 0) value = null;
										resolve(value);
									};
									transaction.onabort = transaction.onerror = function() {
										reject(req.error ? req.error : req.transaction.error);
									};
								} catch (e) {
									reject(e);
								}
							});
						})["catch"](reject);
					});
					executeCallback(promise, callback);
					return promise;
				}
				function removeItem(key, callback) {
					var self = this;
					key = normalizeKey(key);
					var promise = new Promise$1(function(resolve, reject) {
						self.ready().then(function() {
							createTransaction(self._dbInfo, READ_WRITE, function(err, transaction) {
								if (err) return reject(err);
								try {
									var req = transaction.objectStore(self._dbInfo.storeName)["delete"](key);
									transaction.oncomplete = function() {
										resolve();
									};
									transaction.onerror = function() {
										reject(req.error);
									};
									transaction.onabort = function() {
										reject(req.error ? req.error : req.transaction.error);
									};
								} catch (e) {
									reject(e);
								}
							});
						})["catch"](reject);
					});
					executeCallback(promise, callback);
					return promise;
				}
				function clear(callback) {
					var self = this;
					var promise = new Promise$1(function(resolve, reject) {
						self.ready().then(function() {
							createTransaction(self._dbInfo, READ_WRITE, function(err, transaction) {
								if (err) return reject(err);
								try {
									var req = transaction.objectStore(self._dbInfo.storeName).clear();
									transaction.oncomplete = function() {
										resolve();
									};
									transaction.onabort = transaction.onerror = function() {
										reject(req.error ? req.error : req.transaction.error);
									};
								} catch (e) {
									reject(e);
								}
							});
						})["catch"](reject);
					});
					executeCallback(promise, callback);
					return promise;
				}
				function length(callback) {
					var self = this;
					var promise = new Promise$1(function(resolve, reject) {
						self.ready().then(function() {
							createTransaction(self._dbInfo, READ_ONLY, function(err, transaction) {
								if (err) return reject(err);
								try {
									var req = transaction.objectStore(self._dbInfo.storeName).count();
									req.onsuccess = function() {
										resolve(req.result);
									};
									req.onerror = function() {
										reject(req.error);
									};
								} catch (e) {
									reject(e);
								}
							});
						})["catch"](reject);
					});
					executeCallback(promise, callback);
					return promise;
				}
				function key(n, callback) {
					var self = this;
					var promise = new Promise$1(function(resolve, reject) {
						if (n < 0) {
							resolve(null);
							return;
						}
						self.ready().then(function() {
							createTransaction(self._dbInfo, READ_ONLY, function(err, transaction) {
								if (err) return reject(err);
								try {
									var store = transaction.objectStore(self._dbInfo.storeName);
									var advanced = false;
									var req = store.openKeyCursor();
									req.onsuccess = function() {
										var cursor = req.result;
										if (!cursor) {
											resolve(null);
											return;
										}
										if (n === 0) resolve(cursor.key);
										else if (!advanced) {
											advanced = true;
											cursor.advance(n);
										} else resolve(cursor.key);
									};
									req.onerror = function() {
										reject(req.error);
									};
								} catch (e) {
									reject(e);
								}
							});
						})["catch"](reject);
					});
					executeCallback(promise, callback);
					return promise;
				}
				function keys(callback) {
					var self = this;
					var promise = new Promise$1(function(resolve, reject) {
						self.ready().then(function() {
							createTransaction(self._dbInfo, READ_ONLY, function(err, transaction) {
								if (err) return reject(err);
								try {
									var req = transaction.objectStore(self._dbInfo.storeName).openKeyCursor();
									var keys = [];
									req.onsuccess = function() {
										var cursor = req.result;
										if (!cursor) {
											resolve(keys);
											return;
										}
										keys.push(cursor.key);
										cursor["continue"]();
									};
									req.onerror = function() {
										reject(req.error);
									};
								} catch (e) {
									reject(e);
								}
							});
						})["catch"](reject);
					});
					executeCallback(promise, callback);
					return promise;
				}
				function dropInstance(options, callback) {
					callback = getCallback.apply(this, arguments);
					var currentConfig = this.config();
					options = typeof options !== "function" && options || {};
					if (!options.name) {
						options.name = options.name || currentConfig.name;
						options.storeName = options.storeName || currentConfig.storeName;
					}
					var self = this;
					var promise;
					if (!options.name) promise = Promise$1.reject("Invalid arguments");
					else {
						var dbPromise = options.name === currentConfig.name && self._dbInfo.db ? Promise$1.resolve(self._dbInfo.db) : _getOriginalConnection(options).then(function(db) {
							var dbContext = dbContexts[options.name];
							var forages = dbContext.forages;
							dbContext.db = db;
							for (var i = 0; i < forages.length; i++) forages[i]._dbInfo.db = db;
							return db;
						});
						if (!options.storeName) promise = dbPromise.then(function(db) {
							_deferReadiness(options);
							var dbContext = dbContexts[options.name];
							var forages = dbContext.forages;
							db.close();
							for (var i = 0; i < forages.length; i++) {
								var forage = forages[i];
								forage._dbInfo.db = null;
							}
							return new Promise$1(function(resolve, reject) {
								var req = idb.deleteDatabase(options.name);
								req.onerror = function() {
									var db = req.result;
									if (db) db.close();
									reject(req.error);
								};
								req.onblocked = function() {
									console.warn("dropInstance blocked for database \"" + options.name + "\" until all open connections are closed");
								};
								req.onsuccess = function() {
									var db = req.result;
									if (db) db.close();
									resolve(db);
								};
							}).then(function(db) {
								dbContext.db = db;
								for (var i = 0; i < forages.length; i++) {
									var _forage = forages[i];
									_advanceReadiness(_forage._dbInfo);
								}
							})["catch"](function(err) {
								(_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function() {});
								throw err;
							});
						});
						else promise = dbPromise.then(function(db) {
							if (!db.objectStoreNames.contains(options.storeName)) return;
							var newVersion = db.version + 1;
							_deferReadiness(options);
							var dbContext = dbContexts[options.name];
							var forages = dbContext.forages;
							db.close();
							for (var i = 0; i < forages.length; i++) {
								var forage = forages[i];
								forage._dbInfo.db = null;
								forage._dbInfo.version = newVersion;
							}
							return new Promise$1(function(resolve, reject) {
								var req = idb.open(options.name, newVersion);
								req.onerror = function(err) {
									req.result.close();
									reject(err);
								};
								req.onupgradeneeded = function() {
									req.result.deleteObjectStore(options.storeName);
								};
								req.onsuccess = function() {
									var db = req.result;
									db.close();
									resolve(db);
								};
							}).then(function(db) {
								dbContext.db = db;
								for (var j = 0; j < forages.length; j++) {
									var _forage2 = forages[j];
									_forage2._dbInfo.db = db;
									_advanceReadiness(_forage2._dbInfo);
								}
							})["catch"](function(err) {
								(_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function() {});
								throw err;
							});
						});
					}
					executeCallback(promise, callback);
					return promise;
				}
				var asyncStorage = {
					_driver: "asyncStorage",
					_initStorage,
					_support: isIndexedDBValid(),
					iterate,
					getItem,
					setItem,
					removeItem,
					clear,
					length,
					key,
					keys,
					dropInstance
				};
				function isWebSQLValid() {
					return typeof openDatabase === "function";
				}
				var BASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
				var BLOB_TYPE_PREFIX = "~~local_forage_type~";
				var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;
				var SERIALIZED_MARKER = "__lfsc__:";
				var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;
				var TYPE_ARRAYBUFFER = "arbf";
				var TYPE_BLOB = "blob";
				var TYPE_INT8ARRAY = "si08";
				var TYPE_UINT8ARRAY = "ui08";
				var TYPE_UINT8CLAMPEDARRAY = "uic8";
				var TYPE_INT16ARRAY = "si16";
				var TYPE_INT32ARRAY = "si32";
				var TYPE_UINT16ARRAY = "ur16";
				var TYPE_UINT32ARRAY = "ui32";
				var TYPE_FLOAT32ARRAY = "fl32";
				var TYPE_FLOAT64ARRAY = "fl64";
				var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;
				var toString$1 = Object.prototype.toString;
				function stringToBuffer(serializedString) {
					var bufferLength = serializedString.length * .75;
					var len = serializedString.length;
					var i;
					var p = 0;
					var encoded1, encoded2, encoded3, encoded4;
					if (serializedString[serializedString.length - 1] === "=") {
						bufferLength--;
						if (serializedString[serializedString.length - 2] === "=") bufferLength--;
					}
					var buffer = new ArrayBuffer(bufferLength);
					var bytes = new Uint8Array(buffer);
					for (i = 0; i < len; i += 4) {
						encoded1 = BASE_CHARS.indexOf(serializedString[i]);
						encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
						encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
						encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);
						bytes[p++] = encoded1 << 2 | encoded2 >> 4;
						bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
						bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
					}
					return buffer;
				}
				function bufferToString(buffer) {
					var bytes = new Uint8Array(buffer);
					var base64String = "";
					var i;
					for (i = 0; i < bytes.length; i += 3) {
						base64String += BASE_CHARS[bytes[i] >> 2];
						base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
						base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
						base64String += BASE_CHARS[bytes[i + 2] & 63];
					}
					if (bytes.length % 3 === 2) base64String = base64String.substring(0, base64String.length - 1) + "=";
					else if (bytes.length % 3 === 1) base64String = base64String.substring(0, base64String.length - 2) + "==";
					return base64String;
				}
				function serialize(value, callback) {
					var valueType = "";
					if (value) valueType = toString$1.call(value);
					if (value && (valueType === "[object ArrayBuffer]" || value.buffer && toString$1.call(value.buffer) === "[object ArrayBuffer]")) {
						var buffer;
						var marker = SERIALIZED_MARKER;
						if (value instanceof ArrayBuffer) {
							buffer = value;
							marker += TYPE_ARRAYBUFFER;
						} else {
							buffer = value.buffer;
							if (valueType === "[object Int8Array]") marker += TYPE_INT8ARRAY;
							else if (valueType === "[object Uint8Array]") marker += TYPE_UINT8ARRAY;
							else if (valueType === "[object Uint8ClampedArray]") marker += TYPE_UINT8CLAMPEDARRAY;
							else if (valueType === "[object Int16Array]") marker += TYPE_INT16ARRAY;
							else if (valueType === "[object Uint16Array]") marker += TYPE_UINT16ARRAY;
							else if (valueType === "[object Int32Array]") marker += TYPE_INT32ARRAY;
							else if (valueType === "[object Uint32Array]") marker += TYPE_UINT32ARRAY;
							else if (valueType === "[object Float32Array]") marker += TYPE_FLOAT32ARRAY;
							else if (valueType === "[object Float64Array]") marker += TYPE_FLOAT64ARRAY;
							else callback(/* @__PURE__ */ new Error("Failed to get type for BinaryArray"));
						}
						callback(marker + bufferToString(buffer));
					} else if (valueType === "[object Blob]") {
						var fileReader = new FileReader();
						fileReader.onload = function() {
							var str = BLOB_TYPE_PREFIX + value.type + "~" + bufferToString(this.result);
							callback(SERIALIZED_MARKER + TYPE_BLOB + str);
						};
						fileReader.readAsArrayBuffer(value);
					} else try {
						callback(JSON.stringify(value));
					} catch (e) {
						console.error("Couldn't convert value into a JSON string: ", value);
						callback(null, e);
					}
				}
				function deserialize(value) {
					if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) return JSON.parse(value);
					var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
					var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);
					var blobType;
					if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
						var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
						blobType = matcher[1];
						serializedString = serializedString.substring(matcher[0].length);
					}
					var buffer = stringToBuffer(serializedString);
					switch (type) {
						case TYPE_ARRAYBUFFER: return buffer;
						case TYPE_BLOB: return createBlob([buffer], { type: blobType });
						case TYPE_INT8ARRAY: return new Int8Array(buffer);
						case TYPE_UINT8ARRAY: return new Uint8Array(buffer);
						case TYPE_UINT8CLAMPEDARRAY: return new Uint8ClampedArray(buffer);
						case TYPE_INT16ARRAY: return new Int16Array(buffer);
						case TYPE_UINT16ARRAY: return new Uint16Array(buffer);
						case TYPE_INT32ARRAY: return new Int32Array(buffer);
						case TYPE_UINT32ARRAY: return new Uint32Array(buffer);
						case TYPE_FLOAT32ARRAY: return new Float32Array(buffer);
						case TYPE_FLOAT64ARRAY: return new Float64Array(buffer);
						default: throw new Error("Unkown type: " + type);
					}
				}
				var localforageSerializer = {
					serialize,
					deserialize,
					stringToBuffer,
					bufferToString
				};
				function createDbTable(t, dbInfo, callback, errorCallback) {
					t.executeSql("CREATE TABLE IF NOT EXISTS " + dbInfo.storeName + " (id INTEGER PRIMARY KEY, key unique, value)", [], callback, errorCallback);
				}
				function _initStorage$1(options) {
					var self = this;
					var dbInfo = { db: null };
					if (options) for (var i in options) dbInfo[i] = typeof options[i] !== "string" ? options[i].toString() : options[i];
					var dbInfoPromise = new Promise$1(function(resolve, reject) {
						try {
							dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
						} catch (e) {
							return reject(e);
						}
						dbInfo.db.transaction(function(t) {
							createDbTable(t, dbInfo, function() {
								self._dbInfo = dbInfo;
								resolve();
							}, function(t, error) {
								reject(error);
							});
						}, reject);
					});
					dbInfo.serializer = localforageSerializer;
					return dbInfoPromise;
				}
				function tryExecuteSql(t, dbInfo, sqlStatement, args, callback, errorCallback) {
					t.executeSql(sqlStatement, args, callback, function(t, error) {
						if (error.code === error.SYNTAX_ERR) t.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", [dbInfo.storeName], function(t, results) {
							if (!results.rows.length) createDbTable(t, dbInfo, function() {
								t.executeSql(sqlStatement, args, callback, errorCallback);
							}, errorCallback);
							else errorCallback(t, error);
						}, errorCallback);
						else errorCallback(t, error);
					}, errorCallback);
				}
				function getItem$1(key, callback) {
					var self = this;
					key = normalizeKey(key);
					var promise = new Promise$1(function(resolve, reject) {
						self.ready().then(function() {
							var dbInfo = self._dbInfo;
							dbInfo.db.transaction(function(t) {
								tryExecuteSql(t, dbInfo, "SELECT * FROM " + dbInfo.storeName + " WHERE key = ? LIMIT 1", [key], function(t, results) {
									var result = results.rows.length ? results.rows.item(0).value : null;
									if (result) result = dbInfo.serializer.deserialize(result);
									resolve(result);
								}, function(t, error) {
									reject(error);
								});
							});
						})["catch"](reject);
					});
					executeCallback(promise, callback);
					return promise;
				}
				function iterate$1(iterator, callback) {
					var self = this;
					var promise = new Promise$1(function(resolve, reject) {
						self.ready().then(function() {
							var dbInfo = self._dbInfo;
							dbInfo.db.transaction(function(t) {
								tryExecuteSql(t, dbInfo, "SELECT * FROM " + dbInfo.storeName, [], function(t, results) {
									var rows = results.rows;
									var length = rows.length;
									for (var i = 0; i < length; i++) {
										var item = rows.item(i);
										var result = item.value;
										if (result) result = dbInfo.serializer.deserialize(result);
										result = iterator(result, item.key, i + 1);
										if (result !== void 0) {
											resolve(result);
											return;
										}
									}
									resolve();
								}, function(t, error) {
									reject(error);
								});
							});
						})["catch"](reject);
					});
					executeCallback(promise, callback);
					return promise;
				}
				function _setItem(key, value, callback, retriesLeft) {
					var self = this;
					key = normalizeKey(key);
					var promise = new Promise$1(function(resolve, reject) {
						self.ready().then(function() {
							if (value === void 0) value = null;
							var originalValue = value;
							var dbInfo = self._dbInfo;
							dbInfo.serializer.serialize(value, function(value, error) {
								if (error) reject(error);
								else dbInfo.db.transaction(function(t) {
									tryExecuteSql(t, dbInfo, "INSERT OR REPLACE INTO " + dbInfo.storeName + " (key, value) VALUES (?, ?)", [key, value], function() {
										resolve(originalValue);
									}, function(t, error) {
										reject(error);
									});
								}, function(sqlError) {
									if (sqlError.code === sqlError.QUOTA_ERR) {
										if (retriesLeft > 0) {
											resolve(_setItem.apply(self, [
												key,
												originalValue,
												callback,
												retriesLeft - 1
											]));
											return;
										}
										reject(sqlError);
									}
								});
							});
						})["catch"](reject);
					});
					executeCallback(promise, callback);
					return promise;
				}
				function setItem$1(key, value, callback) {
					return _setItem.apply(this, [
						key,
						value,
						callback,
						1
					]);
				}
				function removeItem$1(key, callback) {
					var self = this;
					key = normalizeKey(key);
					var promise = new Promise$1(function(resolve, reject) {
						self.ready().then(function() {
							var dbInfo = self._dbInfo;
							dbInfo.db.transaction(function(t) {
								tryExecuteSql(t, dbInfo, "DELETE FROM " + dbInfo.storeName + " WHERE key = ?", [key], function() {
									resolve();
								}, function(t, error) {
									reject(error);
								});
							});
						})["catch"](reject);
					});
					executeCallback(promise, callback);
					return promise;
				}
				function clear$1(callback) {
					var self = this;
					var promise = new Promise$1(function(resolve, reject) {
						self.ready().then(function() {
							var dbInfo = self._dbInfo;
							dbInfo.db.transaction(function(t) {
								tryExecuteSql(t, dbInfo, "DELETE FROM " + dbInfo.storeName, [], function() {
									resolve();
								}, function(t, error) {
									reject(error);
								});
							});
						})["catch"](reject);
					});
					executeCallback(promise, callback);
					return promise;
				}
				function length$1(callback) {
					var self = this;
					var promise = new Promise$1(function(resolve, reject) {
						self.ready().then(function() {
							var dbInfo = self._dbInfo;
							dbInfo.db.transaction(function(t) {
								tryExecuteSql(t, dbInfo, "SELECT COUNT(key) as c FROM " + dbInfo.storeName, [], function(t, results) {
									var result = results.rows.item(0).c;
									resolve(result);
								}, function(t, error) {
									reject(error);
								});
							});
						})["catch"](reject);
					});
					executeCallback(promise, callback);
					return promise;
				}
				function key$1(n, callback) {
					var self = this;
					var promise = new Promise$1(function(resolve, reject) {
						self.ready().then(function() {
							var dbInfo = self._dbInfo;
							dbInfo.db.transaction(function(t) {
								tryExecuteSql(t, dbInfo, "SELECT key FROM " + dbInfo.storeName + " WHERE id = ? LIMIT 1", [n + 1], function(t, results) {
									resolve(results.rows.length ? results.rows.item(0).key : null);
								}, function(t, error) {
									reject(error);
								});
							});
						})["catch"](reject);
					});
					executeCallback(promise, callback);
					return promise;
				}
				function keys$1(callback) {
					var self = this;
					var promise = new Promise$1(function(resolve, reject) {
						self.ready().then(function() {
							var dbInfo = self._dbInfo;
							dbInfo.db.transaction(function(t) {
								tryExecuteSql(t, dbInfo, "SELECT key FROM " + dbInfo.storeName, [], function(t, results) {
									var keys = [];
									for (var i = 0; i < results.rows.length; i++) keys.push(results.rows.item(i).key);
									resolve(keys);
								}, function(t, error) {
									reject(error);
								});
							});
						})["catch"](reject);
					});
					executeCallback(promise, callback);
					return promise;
				}
				function getAllStoreNames(db) {
					return new Promise$1(function(resolve, reject) {
						db.transaction(function(t) {
							t.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], function(t, results) {
								var storeNames = [];
								for (var i = 0; i < results.rows.length; i++) storeNames.push(results.rows.item(i).name);
								resolve({
									db,
									storeNames
								});
							}, function(t, error) {
								reject(error);
							});
						}, function(sqlError) {
							reject(sqlError);
						});
					});
				}
				function dropInstance$1(options, callback) {
					callback = getCallback.apply(this, arguments);
					var currentConfig = this.config();
					options = typeof options !== "function" && options || {};
					if (!options.name) {
						options.name = options.name || currentConfig.name;
						options.storeName = options.storeName || currentConfig.storeName;
					}
					var self = this;
					var promise;
					if (!options.name) promise = Promise$1.reject("Invalid arguments");
					else promise = new Promise$1(function(resolve) {
						var db;
						if (options.name === currentConfig.name) db = self._dbInfo.db;
						else db = openDatabase(options.name, "", "", 0);
						if (!options.storeName) resolve(getAllStoreNames(db));
						else resolve({
							db,
							storeNames: [options.storeName]
						});
					}).then(function(operationInfo) {
						return new Promise$1(function(resolve, reject) {
							operationInfo.db.transaction(function(t) {
								function dropTable(storeName) {
									return new Promise$1(function(resolve, reject) {
										t.executeSql("DROP TABLE IF EXISTS " + storeName, [], function() {
											resolve();
										}, function(t, error) {
											reject(error);
										});
									});
								}
								var operations = [];
								for (var i = 0, len = operationInfo.storeNames.length; i < len; i++) operations.push(dropTable(operationInfo.storeNames[i]));
								Promise$1.all(operations).then(function() {
									resolve();
								})["catch"](function(e) {
									reject(e);
								});
							}, function(sqlError) {
								reject(sqlError);
							});
						});
					});
					executeCallback(promise, callback);
					return promise;
				}
				var webSQLStorage = {
					_driver: "webSQLStorage",
					_initStorage: _initStorage$1,
					_support: isWebSQLValid(),
					iterate: iterate$1,
					getItem: getItem$1,
					setItem: setItem$1,
					removeItem: removeItem$1,
					clear: clear$1,
					length: length$1,
					key: key$1,
					keys: keys$1,
					dropInstance: dropInstance$1
				};
				function isLocalStorageValid() {
					try {
						return typeof localStorage !== "undefined" && "setItem" in localStorage && !!localStorage.setItem;
					} catch (e) {
						return false;
					}
				}
				function _getKeyPrefix(options, defaultConfig) {
					var keyPrefix = options.name + "/";
					if (options.storeName !== defaultConfig.storeName) keyPrefix += options.storeName + "/";
					return keyPrefix;
				}
				function checkIfLocalStorageThrows() {
					var localStorageTestKey = "_localforage_support_test";
					try {
						localStorage.setItem(localStorageTestKey, true);
						localStorage.removeItem(localStorageTestKey);
						return false;
					} catch (e) {
						return true;
					}
				}
				function _isLocalStorageUsable() {
					return !checkIfLocalStorageThrows() || localStorage.length > 0;
				}
				function _initStorage$2(options) {
					var self = this;
					var dbInfo = {};
					if (options) for (var i in options) dbInfo[i] = options[i];
					dbInfo.keyPrefix = _getKeyPrefix(options, self._defaultConfig);
					if (!_isLocalStorageUsable()) return Promise$1.reject();
					self._dbInfo = dbInfo;
					dbInfo.serializer = localforageSerializer;
					return Promise$1.resolve();
				}
				function clear$2(callback) {
					var self = this;
					var promise = self.ready().then(function() {
						var keyPrefix = self._dbInfo.keyPrefix;
						for (var i = localStorage.length - 1; i >= 0; i--) {
							var key = localStorage.key(i);
							if (key.indexOf(keyPrefix) === 0) localStorage.removeItem(key);
						}
					});
					executeCallback(promise, callback);
					return promise;
				}
				function getItem$2(key, callback) {
					var self = this;
					key = normalizeKey(key);
					var promise = self.ready().then(function() {
						var dbInfo = self._dbInfo;
						var result = localStorage.getItem(dbInfo.keyPrefix + key);
						if (result) result = dbInfo.serializer.deserialize(result);
						return result;
					});
					executeCallback(promise, callback);
					return promise;
				}
				function iterate$2(iterator, callback) {
					var self = this;
					var promise = self.ready().then(function() {
						var dbInfo = self._dbInfo;
						var keyPrefix = dbInfo.keyPrefix;
						var keyPrefixLength = keyPrefix.length;
						var length = localStorage.length;
						var iterationNumber = 1;
						for (var i = 0; i < length; i++) {
							var key = localStorage.key(i);
							if (key.indexOf(keyPrefix) !== 0) continue;
							var value = localStorage.getItem(key);
							if (value) value = dbInfo.serializer.deserialize(value);
							value = iterator(value, key.substring(keyPrefixLength), iterationNumber++);
							if (value !== void 0) return value;
						}
					});
					executeCallback(promise, callback);
					return promise;
				}
				function key$2(n, callback) {
					var self = this;
					var promise = self.ready().then(function() {
						var dbInfo = self._dbInfo;
						var result;
						try {
							result = localStorage.key(n);
						} catch (error) {
							result = null;
						}
						if (result) result = result.substring(dbInfo.keyPrefix.length);
						return result;
					});
					executeCallback(promise, callback);
					return promise;
				}
				function keys$2(callback) {
					var self = this;
					var promise = self.ready().then(function() {
						var dbInfo = self._dbInfo;
						var length = localStorage.length;
						var keys = [];
						for (var i = 0; i < length; i++) {
							var itemKey = localStorage.key(i);
							if (itemKey.indexOf(dbInfo.keyPrefix) === 0) keys.push(itemKey.substring(dbInfo.keyPrefix.length));
						}
						return keys;
					});
					executeCallback(promise, callback);
					return promise;
				}
				function length$2(callback) {
					var promise = this.keys().then(function(keys) {
						return keys.length;
					});
					executeCallback(promise, callback);
					return promise;
				}
				function removeItem$2(key, callback) {
					var self = this;
					key = normalizeKey(key);
					var promise = self.ready().then(function() {
						var dbInfo = self._dbInfo;
						localStorage.removeItem(dbInfo.keyPrefix + key);
					});
					executeCallback(promise, callback);
					return promise;
				}
				function setItem$2(key, value, callback) {
					var self = this;
					key = normalizeKey(key);
					var promise = self.ready().then(function() {
						if (value === void 0) value = null;
						var originalValue = value;
						return new Promise$1(function(resolve, reject) {
							var dbInfo = self._dbInfo;
							dbInfo.serializer.serialize(value, function(value, error) {
								if (error) reject(error);
								else try {
									localStorage.setItem(dbInfo.keyPrefix + key, value);
									resolve(originalValue);
								} catch (e) {
									if (e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED") reject(e);
									reject(e);
								}
							});
						});
					});
					executeCallback(promise, callback);
					return promise;
				}
				function dropInstance$2(options, callback) {
					callback = getCallback.apply(this, arguments);
					options = typeof options !== "function" && options || {};
					if (!options.name) {
						var currentConfig = this.config();
						options.name = options.name || currentConfig.name;
						options.storeName = options.storeName || currentConfig.storeName;
					}
					var self = this;
					var promise;
					if (!options.name) promise = Promise$1.reject("Invalid arguments");
					else promise = new Promise$1(function(resolve) {
						if (!options.storeName) resolve(options.name + "/");
						else resolve(_getKeyPrefix(options, self._defaultConfig));
					}).then(function(keyPrefix) {
						for (var i = localStorage.length - 1; i >= 0; i--) {
							var key = localStorage.key(i);
							if (key.indexOf(keyPrefix) === 0) localStorage.removeItem(key);
						}
					});
					executeCallback(promise, callback);
					return promise;
				}
				var localStorageWrapper = {
					_driver: "localStorageWrapper",
					_initStorage: _initStorage$2,
					_support: isLocalStorageValid(),
					iterate: iterate$2,
					getItem: getItem$2,
					setItem: setItem$2,
					removeItem: removeItem$2,
					clear: clear$2,
					length: length$2,
					key: key$2,
					keys: keys$2,
					dropInstance: dropInstance$2
				};
				var sameValue = function sameValue(x, y) {
					return x === y || typeof x === "number" && typeof y === "number" && isNaN(x) && isNaN(y);
				};
				var includes = function includes(array, searchElement) {
					var len = array.length;
					var i = 0;
					while (i < len) {
						if (sameValue(array[i], searchElement)) return true;
						i++;
					}
					return false;
				};
				var isArray = Array.isArray || function(arg) {
					return Object.prototype.toString.call(arg) === "[object Array]";
				};
				var DefinedDrivers = {};
				var DriverSupport = {};
				var DefaultDrivers = {
					INDEXEDDB: asyncStorage,
					WEBSQL: webSQLStorage,
					LOCALSTORAGE: localStorageWrapper
				};
				var DefaultDriverOrder = [
					DefaultDrivers.INDEXEDDB._driver,
					DefaultDrivers.WEBSQL._driver,
					DefaultDrivers.LOCALSTORAGE._driver
				];
				var OptionalDriverMethods = ["dropInstance"];
				var LibraryMethods = [
					"clear",
					"getItem",
					"iterate",
					"key",
					"keys",
					"length",
					"removeItem",
					"setItem"
				].concat(OptionalDriverMethods);
				var DefaultConfig = {
					description: "",
					driver: DefaultDriverOrder.slice(),
					name: "localforage",
					size: 4980736,
					storeName: "keyvaluepairs",
					version: 1
				};
				function callWhenReady(localForageInstance, libraryMethod) {
					localForageInstance[libraryMethod] = function() {
						var _args = arguments;
						return localForageInstance.ready().then(function() {
							return localForageInstance[libraryMethod].apply(localForageInstance, _args);
						});
					};
				}
				function extend() {
					for (var i = 1; i < arguments.length; i++) {
						var arg = arguments[i];
						if (arg) {
							for (var _key in arg) if (arg.hasOwnProperty(_key)) if (isArray(arg[_key])) arguments[0][_key] = arg[_key].slice();
							else arguments[0][_key] = arg[_key];
						}
					}
					return arguments[0];
				}
				module$4.exports = new (function() {
					function LocalForage(options) {
						_classCallCheck(this, LocalForage);
						for (var driverTypeKey in DefaultDrivers) if (DefaultDrivers.hasOwnProperty(driverTypeKey)) {
							var driver = DefaultDrivers[driverTypeKey];
							var driverName = driver._driver;
							this[driverTypeKey] = driverName;
							if (!DefinedDrivers[driverName]) this.defineDriver(driver);
						}
						this._defaultConfig = extend({}, DefaultConfig);
						this._config = extend({}, this._defaultConfig, options);
						this._driverSet = null;
						this._initDriver = null;
						this._ready = false;
						this._dbInfo = null;
						this._wrapLibraryMethodsWithReady();
						this.setDriver(this._config.driver)["catch"](function() {});
					}
					LocalForage.prototype.config = function config(options) {
						if ((typeof options === "undefined" ? "undefined" : _typeof(options)) === "object") {
							if (this._ready) return /* @__PURE__ */ new Error("Can't call config() after localforage has been used.");
							for (var i in options) {
								if (i === "storeName") options[i] = options[i].replace(/\W/g, "_");
								if (i === "version" && typeof options[i] !== "number") return /* @__PURE__ */ new Error("Database version must be a number.");
								this._config[i] = options[i];
							}
							if ("driver" in options && options.driver) return this.setDriver(this._config.driver);
							return true;
						} else if (typeof options === "string") return this._config[options];
						else return this._config;
					};
					LocalForage.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
						var promise = new Promise$1(function(resolve, reject) {
							try {
								var driverName = driverObject._driver;
								var complianceError = /* @__PURE__ */ new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver");
								if (!driverObject._driver) {
									reject(complianceError);
									return;
								}
								var driverMethods = LibraryMethods.concat("_initStorage");
								for (var i = 0, len = driverMethods.length; i < len; i++) {
									var driverMethodName = driverMethods[i];
									if ((!includes(OptionalDriverMethods, driverMethodName) || driverObject[driverMethodName]) && typeof driverObject[driverMethodName] !== "function") {
										reject(complianceError);
										return;
									}
								}
								(function configureMissingMethods() {
									var methodNotImplementedFactory = function methodNotImplementedFactory(methodName) {
										return function() {
											var error = /* @__PURE__ */ new Error("Method " + methodName + " is not implemented by the current driver");
											var promise = Promise$1.reject(error);
											executeCallback(promise, arguments[arguments.length - 1]);
											return promise;
										};
									};
									for (var _i = 0, _len = OptionalDriverMethods.length; _i < _len; _i++) {
										var optionalDriverMethod = OptionalDriverMethods[_i];
										if (!driverObject[optionalDriverMethod]) driverObject[optionalDriverMethod] = methodNotImplementedFactory(optionalDriverMethod);
									}
								})();
								var setDriverSupport = function setDriverSupport(support) {
									if (DefinedDrivers[driverName]) console.info("Redefining LocalForage driver: " + driverName);
									DefinedDrivers[driverName] = driverObject;
									DriverSupport[driverName] = support;
									resolve();
								};
								if ("_support" in driverObject) if (driverObject._support && typeof driverObject._support === "function") driverObject._support().then(setDriverSupport, reject);
								else setDriverSupport(!!driverObject._support);
								else setDriverSupport(true);
							} catch (e) {
								reject(e);
							}
						});
						executeTwoCallbacks(promise, callback, errorCallback);
						return promise;
					};
					LocalForage.prototype.driver = function driver() {
						return this._driver || null;
					};
					LocalForage.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
						var getDriverPromise = DefinedDrivers[driverName] ? Promise$1.resolve(DefinedDrivers[driverName]) : Promise$1.reject(/* @__PURE__ */ new Error("Driver not found."));
						executeTwoCallbacks(getDriverPromise, callback, errorCallback);
						return getDriverPromise;
					};
					LocalForage.prototype.getSerializer = function getSerializer(callback) {
						var serializerPromise = Promise$1.resolve(localforageSerializer);
						executeTwoCallbacks(serializerPromise, callback);
						return serializerPromise;
					};
					LocalForage.prototype.ready = function ready(callback) {
						var self = this;
						var promise = self._driverSet.then(function() {
							if (self._ready === null) self._ready = self._initDriver();
							return self._ready;
						});
						executeTwoCallbacks(promise, callback, callback);
						return promise;
					};
					LocalForage.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
						var self = this;
						if (!isArray(drivers)) drivers = [drivers];
						var supportedDrivers = this._getSupportedDrivers(drivers);
						function setDriverToConfig() {
							self._config.driver = self.driver();
						}
						function extendSelfWithDriver(driver) {
							self._extend(driver);
							setDriverToConfig();
							self._ready = self._initStorage(self._config);
							return self._ready;
						}
						function initDriver(supportedDrivers) {
							return function() {
								var currentDriverIndex = 0;
								function driverPromiseLoop() {
									while (currentDriverIndex < supportedDrivers.length) {
										var driverName = supportedDrivers[currentDriverIndex];
										currentDriverIndex++;
										self._dbInfo = null;
										self._ready = null;
										return self.getDriver(driverName).then(extendSelfWithDriver)["catch"](driverPromiseLoop);
									}
									setDriverToConfig();
									var error = /* @__PURE__ */ new Error("No available storage method found.");
									self._driverSet = Promise$1.reject(error);
									return self._driverSet;
								}
								return driverPromiseLoop();
							};
						}
						var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function() {
							return Promise$1.resolve();
						}) : Promise$1.resolve();
						this._driverSet = oldDriverSetDone.then(function() {
							var driverName = supportedDrivers[0];
							self._dbInfo = null;
							self._ready = null;
							return self.getDriver(driverName).then(function(driver) {
								self._driver = driver._driver;
								setDriverToConfig();
								self._wrapLibraryMethodsWithReady();
								self._initDriver = initDriver(supportedDrivers);
							});
						})["catch"](function() {
							setDriverToConfig();
							var error = /* @__PURE__ */ new Error("No available storage method found.");
							self._driverSet = Promise$1.reject(error);
							return self._driverSet;
						});
						executeTwoCallbacks(this._driverSet, callback, errorCallback);
						return this._driverSet;
					};
					LocalForage.prototype.supports = function supports(driverName) {
						return !!DriverSupport[driverName];
					};
					LocalForage.prototype._extend = function _extend(libraryMethodsAndProperties) {
						extend(this, libraryMethodsAndProperties);
					};
					LocalForage.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
						var supportedDrivers = [];
						for (var i = 0, len = drivers.length; i < len; i++) {
							var driverName = drivers[i];
							if (this.supports(driverName)) supportedDrivers.push(driverName);
						}
						return supportedDrivers;
					};
					LocalForage.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
						for (var i = 0, len = LibraryMethods.length; i < len; i++) callWhenReady(this, LibraryMethods[i]);
					};
					LocalForage.prototype.createInstance = function createInstance(options) {
						return new LocalForage(options);
					};
					return LocalForage;
				}())();
			}, { "3": 3 }]
		}, {}, [4])(4);
	});
})))());
/**
* Handles saving and requesting files from local storage
* @class
* @param {string} name This should be the name of the application for modals
* @param {function} [requester]
* @param {function} [resolver]
*/
var Store = class {
	constructor(name, requester, resolver) {
		this.urlCache = {};
		this.storage = void 0;
		this.name = name;
		this.requester = requester || request;
		this.resolver = resolver;
		this.online = true;
		this.checkRequirements();
		this.addListeners();
	}
	/**
	* Checks to see if localForage exists in global namspace,
	* Requires localForage if it isn't there
	* @private
	*/
	checkRequirements() {
		try {
			let store;
			if (typeof import_localforage.default === "undefined") store = import_localforage.default;
			this.storage = store.createInstance({ name: this.name });
		} catch (e) {
			throw new Error("localForage lib not loaded");
		}
	}
	/**
	* Add online and offline event listeners
	* @private
	*/
	addListeners() {
		this._status = this.status.bind(this);
		window.addEventListener("online", this._status);
		window.addEventListener("offline", this._status);
	}
	/**
	* Remove online and offline event listeners
	* @private
	*/
	removeListeners() {
		window.removeEventListener("online", this._status);
		window.removeEventListener("offline", this._status);
		this._status = void 0;
	}
	/**
	* Update the online / offline status
	* @private
	*/
	status(event) {
		let online = navigator.onLine;
		this.online = online;
		if (online) this.emit("online", this);
		else this.emit("offline", this);
	}
	/**
	* Add all of a book resources to the store
	* @param  {Resources} resources  book resources
	* @param  {boolean} [force] force resaving resources
	* @return {Promise<object>} store objects
	*/
	add(resources, force) {
		let mapped = resources.resources.map((item) => {
			let { href } = item;
			let url = this.resolver(href);
			let encodedUrl = window.encodeURIComponent(url);
			return this.storage.getItem(encodedUrl).then((item) => {
				if (!item || force) return this.requester(url, "binary").then((data) => {
					return this.storage.setItem(encodedUrl, data);
				});
				else return item;
			});
		});
		return Promise.all(mapped);
	}
	/**
	* Put binary data from a url to storage
	* @param  {string} url  a url to request from storage
	* @param  {boolean} [withCredentials]
	* @param  {object} [headers]
	* @return {Promise<Blob>}
	*/
	put(url, withCredentials, headers) {
		let encodedUrl = window.encodeURIComponent(url);
		return this.storage.getItem(encodedUrl).then((result) => {
			if (!result) return this.requester(url, "binary", withCredentials, headers).then((data) => {
				return this.storage.setItem(encodedUrl, data);
			});
			return result;
		});
	}
	/**
	* Request a url
	* @param  {string} url  a url to request from storage
	* @param  {string} [type] specify the type of the returned result
	* @param  {boolean} [withCredentials]
	* @param  {object} [headers]
	* @return {Promise<Blob | string | JSON | Document | XMLDocument>}
	*/
	request(url, type, withCredentials, headers) {
		if (this.online) return this.requester(url, type, withCredentials, headers).then((data) => {
			this.put(url);
			return data;
		});
		else return this.retrieve(url, type);
	}
	/**
	* Request a url from storage
	* @param  {string} url  a url to request from storage
	* @param  {string} [type] specify the type of the returned result
	* @return {Promise<Blob | string | JSON | Document | XMLDocument>}
	*/
	retrieve(url, type) {
		new defer();
		var response;
		var path = new Path(url);
		if (!type) type = path.extension;
		if (type == "blob") response = this.getBlob(url);
		else response = this.getText(url);
		return response.then((r) => {
			var deferred = new defer();
			var result;
			if (r) {
				result = this.handleResponse(r, type);
				deferred.resolve(result);
			} else deferred.reject({
				message: "File not found in storage: " + url,
				stack: (/* @__PURE__ */ new Error()).stack
			});
			return deferred.promise;
		});
	}
	/**
	* Handle the response from request
	* @private
	* @param  {any} response
	* @param  {string} [type]
	* @return {any} the parsed result
	*/
	handleResponse(response, type) {
		var r;
		if (type == "json") r = JSON.parse(response);
		else if (isXml(type)) r = parse(response, "text/xml");
		else if (type == "xhtml") r = parse(response, "application/xhtml+xml");
		else if (type == "html" || type == "htm") r = parse(response, "text/html");
		else r = response;
		return r;
	}
	/**
	* Get a Blob from Storage by Url
	* @param  {string} url
	* @param  {string} [mimeType]
	* @return {Blob}
	*/
	getBlob(url, mimeType) {
		let encodedUrl = window.encodeURIComponent(url);
		return this.storage.getItem(encodedUrl).then(function(uint8array) {
			if (!uint8array) return;
			mimeType = mimeType || mime_default.lookup(url);
			return new Blob([uint8array], { type: mimeType });
		});
	}
	/**
	* Get Text from Storage by Url
	* @param  {string} url
	* @param  {string} [mimeType]
	* @return {string}
	*/
	getText(url, mimeType) {
		let encodedUrl = window.encodeURIComponent(url);
		mimeType = mimeType || mime_default.lookup(url);
		return this.storage.getItem(encodedUrl).then(function(uint8array) {
			var deferred = new defer();
			var reader = new FileReader();
			var blob;
			if (!uint8array) return;
			blob = new Blob([uint8array], { type: mimeType });
			reader.addEventListener("loadend", () => {
				deferred.resolve(reader.result);
			});
			reader.readAsText(blob, mimeType);
			return deferred.promise;
		});
	}
	/**
	* Get a base64 encoded result from Storage by Url
	* @param  {string} url
	* @param  {string} [mimeType]
	* @return {string} base64 encoded
	*/
	getBase64(url, mimeType) {
		let encodedUrl = window.encodeURIComponent(url);
		mimeType = mimeType || mime_default.lookup(url);
		return this.storage.getItem(encodedUrl).then((uint8array) => {
			var deferred = new defer();
			var reader = new FileReader();
			var blob;
			if (!uint8array) return;
			blob = new Blob([uint8array], { type: mimeType });
			reader.addEventListener("loadend", () => {
				deferred.resolve(reader.result);
			});
			reader.readAsDataURL(blob, mimeType);
			return deferred.promise;
		});
	}
	/**
	* Create a Url from a stored item
	* @param  {string} url
	* @param  {object} [options.base64] use base64 encoding or blob url
	* @return {Promise} url promise with Url string
	*/
	createUrl(url, options) {
		var deferred = new defer();
		var _URL = window.URL || window.webkitURL || window.mozURL;
		var tempUrl;
		var response;
		var useBase64 = options && options.base64;
		if (url in this.urlCache) {
			deferred.resolve(this.urlCache[url]);
			return deferred.promise;
		}
		if (useBase64) {
			response = this.getBase64(url);
			if (response) response.then(function(tempUrl) {
				this.urlCache[url] = tempUrl;
				deferred.resolve(tempUrl);
			}.bind(this));
		} else {
			response = this.getBlob(url);
			if (response) response.then(function(blob) {
				tempUrl = _URL.createObjectURL(blob);
				this.urlCache[url] = tempUrl;
				deferred.resolve(tempUrl);
			}.bind(this));
		}
		if (!response) deferred.reject({
			message: "File not found in storage: " + url,
			stack: (/* @__PURE__ */ new Error()).stack
		});
		return deferred.promise;
	}
	/**
	* Revoke Temp Url for a archive item
	* @param  {string} url url of the item in the store
	*/
	revokeUrl(url) {
		var _URL = window.URL || window.webkitURL || window.mozURL;
		var fromCache = this.urlCache[url];
		if (fromCache) _URL.revokeObjectURL(fromCache);
	}
	destroy() {
		var _URL = window.URL || window.webkitURL || window.mozURL;
		for (let fromCache in this.urlCache) _URL.revokeObjectURL(fromCache);
		this.urlCache = {};
		this.removeListeners();
	}
};
(0, import_event_emitter.default)(Store.prototype);
//#endregion
//#region node_modules/epubjs/src/displayoptions.js
/**
* Open DisplayOptions Format Parser
* @class
* @param {document} displayOptionsDocument XML
*/
var DisplayOptions = class {
	constructor(displayOptionsDocument) {
		this.interactive = "";
		this.fixedLayout = "";
		this.openToSpread = "";
		this.orientationLock = "";
		if (displayOptionsDocument) this.parse(displayOptionsDocument);
	}
	/**
	* Parse XML
	* @param  {document} displayOptionsDocument XML
	* @return {DisplayOptions} self
	*/
	parse(displayOptionsDocument) {
		if (!displayOptionsDocument) return this;
		const displayOptionsNode = qs(displayOptionsDocument, "display_options");
		if (!displayOptionsNode) return this;
		qsa(displayOptionsNode, "option").forEach((el) => {
			let value = "";
			if (el.childNodes.length) value = el.childNodes[0].nodeValue;
			switch (el.attributes.name.value) {
				case "interactive":
					this.interactive = value;
					break;
				case "fixed-layout":
					this.fixedLayout = value;
					break;
				case "open-to-spread":
					this.openToSpread = value;
					break;
				case "orientation-lock":
					this.orientationLock = value;
					break;
			}
		});
		return this;
	}
	destroy() {
		this.interactive = void 0;
		this.fixedLayout = void 0;
		this.openToSpread = void 0;
		this.orientationLock = void 0;
	}
};
//#endregion
//#region node_modules/epubjs/src/book.js
var CONTAINER_PATH = "META-INF/container.xml";
var IBOOKS_DISPLAY_OPTIONS_PATH = "META-INF/com.apple.ibooks.display-options.xml";
var INPUT_TYPE = {
	BINARY: "binary",
	BASE64: "base64",
	EPUB: "epub",
	OPF: "opf",
	MANIFEST: "json",
	DIRECTORY: "directory"
};
/**
* An Epub representation with methods for the loading, parsing and manipulation
* of its contents.
* @class
* @param {string} [url]
* @param {object} [options]
* @param {method} [options.requestMethod] a request function to use instead of the default
* @param {boolean} [options.requestCredentials=undefined] send the xhr request withCredentials
* @param {object} [options.requestHeaders=undefined] send the xhr request headers
* @param {string} [options.encoding=binary] optional to pass 'binary' or base64' for archived Epubs
* @param {string} [options.replacements=none] use base64, blobUrl, or none for replacing assets in archived Epubs
* @param {method} [options.canonical] optional function to determine canonical urls for a path
* @param {string} [options.openAs] optional string to determine the input type
* @param {string} [options.store=false] cache the contents in local storage, value should be the name of the reader
* @returns {Book}
* @example new Book("/path/to/book.epub", {})
* @example new Book({ replacements: "blobUrl" })
*/
var Book = class {
	constructor(url, options) {
		if (typeof options === "undefined" && typeof url !== "string" && url instanceof Blob === false && url instanceof ArrayBuffer === false) {
			options = url;
			url = void 0;
		}
		this.settings = extend(this.settings || {}, {
			requestMethod: void 0,
			requestCredentials: void 0,
			requestHeaders: void 0,
			encoding: void 0,
			replacements: void 0,
			canonical: void 0,
			openAs: void 0,
			store: void 0
		});
		extend(this.settings, options);
		this.opening = new defer();
		/**
		* @member {promise} opened returns after the book is loaded
		* @memberof Book
		*/
		this.opened = this.opening.promise;
		this.isOpen = false;
		this.loading = {
			manifest: new defer(),
			spine: new defer(),
			metadata: new defer(),
			cover: new defer(),
			navigation: new defer(),
			pageList: new defer(),
			resources: new defer(),
			displayOptions: new defer()
		};
		this.loaded = {
			manifest: this.loading.manifest.promise,
			spine: this.loading.spine.promise,
			metadata: this.loading.metadata.promise,
			cover: this.loading.cover.promise,
			navigation: this.loading.navigation.promise,
			pageList: this.loading.pageList.promise,
			resources: this.loading.resources.promise,
			displayOptions: this.loading.displayOptions.promise
		};
		/**
		* @member {promise} ready returns after the book is loaded and parsed
		* @memberof Book
		* @private
		*/
		this.ready = Promise.all([
			this.loaded.manifest,
			this.loaded.spine,
			this.loaded.metadata,
			this.loaded.cover,
			this.loaded.navigation,
			this.loaded.resources,
			this.loaded.displayOptions
		]);
		this.isRendered = false;
		/**
		* @member {method} request
		* @memberof Book
		* @private
		*/
		this.request = this.settings.requestMethod || request;
		/**
		* @member {Spine} spine
		* @memberof Book
		*/
		this.spine = new Spine();
		/**
		* @member {Locations} locations
		* @memberof Book
		*/
		this.locations = new Locations(this.spine, this.load.bind(this));
		/**
		* @member {Navigation} navigation
		* @memberof Book
		*/
		this.navigation = void 0;
		/**
		* @member {PageList} pagelist
		* @memberof Book
		*/
		this.pageList = void 0;
		/**
		* @member {Url} url
		* @memberof Book
		* @private
		*/
		this.url = void 0;
		/**
		* @member {Path} path
		* @memberof Book
		* @private
		*/
		this.path = void 0;
		/**
		* @member {boolean} archived
		* @memberof Book
		* @private
		*/
		this.archived = false;
		/**
		* @member {Archive} archive
		* @memberof Book
		* @private
		*/
		this.archive = void 0;
		/**
		* @member {Store} storage
		* @memberof Book
		* @private
		*/
		this.storage = void 0;
		/**
		* @member {Resources} resources
		* @memberof Book
		* @private
		*/
		this.resources = void 0;
		/**
		* @member {Rendition} rendition
		* @memberof Book
		* @private
		*/
		this.rendition = void 0;
		/**
		* @member {Container} container
		* @memberof Book
		* @private
		*/
		this.container = void 0;
		/**
		* @member {Packaging} packaging
		* @memberof Book
		* @private
		*/
		this.packaging = void 0;
		/**
		* @member {DisplayOptions} displayOptions
		* @memberof DisplayOptions
		* @private
		*/
		this.displayOptions = void 0;
		if (this.settings.store) this.store(this.settings.store);
		if (url) this.open(url, this.settings.openAs).catch((error) => {
			var err = /* @__PURE__ */ new Error("Cannot load book at " + url);
			this.emit(EVENTS.BOOK.OPEN_FAILED, err);
		});
	}
	/**
	* Open a epub or url
	* @param {string | ArrayBuffer} input Url, Path or ArrayBuffer
	* @param {string} [what="binary", "base64", "epub", "opf", "json", "directory"] force opening as a certain type
	* @returns {Promise} of when the book has been loaded
	* @example book.open("/path/to/book.epub")
	*/
	open(input, what) {
		var opening;
		var type = what || this.determineType(input);
		if (type === INPUT_TYPE.BINARY) {
			this.archived = true;
			this.url = new Url("/", "");
			opening = this.openEpub(input);
		} else if (type === INPUT_TYPE.BASE64) {
			this.archived = true;
			this.url = new Url("/", "");
			opening = this.openEpub(input, type);
		} else if (type === INPUT_TYPE.EPUB) {
			this.archived = true;
			this.url = new Url("/", "");
			opening = this.request(input, "binary", this.settings.requestCredentials, this.settings.requestHeaders).then(this.openEpub.bind(this));
		} else if (type == INPUT_TYPE.OPF) {
			this.url = new Url(input);
			opening = this.openPackaging(this.url.Path.toString());
		} else if (type == INPUT_TYPE.MANIFEST) {
			this.url = new Url(input);
			opening = this.openManifest(this.url.Path.toString());
		} else {
			this.url = new Url(input);
			opening = this.openContainer(CONTAINER_PATH).then(this.openPackaging.bind(this));
		}
		return opening;
	}
	/**
	* Open an archived epub
	* @private
	* @param  {binary} data
	* @param  {string} [encoding]
	* @return {Promise}
	*/
	openEpub(data, encoding) {
		return this.unarchive(data, encoding || this.settings.encoding).then(() => {
			return this.openContainer(CONTAINER_PATH);
		}).then((packagePath) => {
			return this.openPackaging(packagePath);
		});
	}
	/**
	* Open the epub container
	* @private
	* @param  {string} url
	* @return {string} packagePath
	*/
	openContainer(url) {
		return this.load(url).then((xml) => {
			this.container = new Container(xml);
			return this.resolve(this.container.packagePath);
		});
	}
	/**
	* Open the Open Packaging Format Xml
	* @private
	* @param  {string} url
	* @return {Promise}
	*/
	openPackaging(url) {
		this.path = new Path(url);
		return this.load(url).then((xml) => {
			this.packaging = new Packaging(xml);
			return this.unpack(this.packaging);
		});
	}
	/**
	* Open the manifest JSON
	* @private
	* @param  {string} url
	* @return {Promise}
	*/
	openManifest(url) {
		this.path = new Path(url);
		return this.load(url).then((json) => {
			this.packaging = new Packaging();
			this.packaging.load(json);
			return this.unpack(this.packaging);
		});
	}
	/**
	* Load a resource from the Book
	* @param  {string} path path to the resource to load
	* @return {Promise}     returns a promise with the requested resource
	*/
	load(path) {
		var resolved = this.resolve(path);
		if (this.archived) return this.archive.request(resolved);
		else return this.request(resolved, null, this.settings.requestCredentials, this.settings.requestHeaders);
	}
	/**
	* Resolve a path to it's absolute position in the Book
	* @param  {string} path
	* @param  {boolean} [absolute] force resolving the full URL
	* @return {string}          the resolved path string
	*/
	resolve(path, absolute) {
		if (!path) return;
		var resolved = path;
		if (path.indexOf("://") > -1) return path;
		if (this.path) resolved = this.path.resolve(path);
		if (absolute != false && this.url) resolved = this.url.resolve(resolved);
		return resolved;
	}
	/**
	* Get a canonical link to a path
	* @param  {string} path
	* @return {string} the canonical path string
	*/
	canonical(path) {
		var url = path;
		if (!path) return "";
		if (this.settings.canonical) url = this.settings.canonical(path);
		else url = this.resolve(path, true);
		return url;
	}
	/**
	* Determine the type of they input passed to open
	* @private
	* @param  {string} input
	* @return {string}  binary | directory | epub | opf
	*/
	determineType(input) {
		var url;
		var path;
		var extension;
		if (this.settings.encoding === "base64") return INPUT_TYPE.BASE64;
		if (typeof input != "string") return INPUT_TYPE.BINARY;
		url = new Url(input);
		path = url.path();
		extension = path.extension;
		if (extension) extension = extension.replace(/\?.*$/, "");
		if (!extension) return INPUT_TYPE.DIRECTORY;
		if (extension === "epub") return INPUT_TYPE.EPUB;
		if (extension === "opf") return INPUT_TYPE.OPF;
		if (extension === "json") return INPUT_TYPE.MANIFEST;
	}
	/**
	* unpack the contents of the Books packaging
	* @private
	* @param {Packaging} packaging object
	*/
	unpack(packaging) {
		this.package = packaging;
		if (this.packaging.metadata.layout === "") this.load(this.url.resolve(IBOOKS_DISPLAY_OPTIONS_PATH)).then((xml) => {
			this.displayOptions = new DisplayOptions(xml);
			this.loading.displayOptions.resolve(this.displayOptions);
		}).catch((err) => {
			this.displayOptions = new DisplayOptions();
			this.loading.displayOptions.resolve(this.displayOptions);
		});
		else {
			this.displayOptions = new DisplayOptions();
			this.loading.displayOptions.resolve(this.displayOptions);
		}
		this.spine.unpack(this.packaging, this.resolve.bind(this), this.canonical.bind(this));
		this.resources = new Resources(this.packaging.manifest, {
			archive: this.archive,
			resolver: this.resolve.bind(this),
			request: this.request.bind(this),
			replacements: this.settings.replacements || (this.archived ? "blobUrl" : "base64")
		});
		this.loadNavigation(this.packaging).then(() => {
			this.loading.navigation.resolve(this.navigation);
		});
		if (this.packaging.coverPath) this.cover = this.resolve(this.packaging.coverPath);
		this.loading.manifest.resolve(this.packaging.manifest);
		this.loading.metadata.resolve(this.packaging.metadata);
		this.loading.spine.resolve(this.spine);
		this.loading.cover.resolve(this.cover);
		this.loading.resources.resolve(this.resources);
		this.loading.pageList.resolve(this.pageList);
		this.isOpen = true;
		if (this.archived || this.settings.replacements && this.settings.replacements != "none") this.replacements().then(() => {
			this.loaded.displayOptions.then(() => {
				this.opening.resolve(this);
			});
		}).catch((err) => {
			console.error(err);
		});
		else this.loaded.displayOptions.then(() => {
			this.opening.resolve(this);
		});
	}
	/**
	* Load Navigation and PageList from package
	* @private
	* @param {Packaging} packaging
	*/
	loadNavigation(packaging) {
		let navPath = packaging.navPath || packaging.ncxPath;
		let toc = packaging.toc;
		if (toc) return new Promise((resolve, reject) => {
			this.navigation = new Navigation(toc);
			if (packaging.pageList) this.pageList = new PageList(packaging.pageList);
			resolve(this.navigation);
		});
		if (!navPath) return new Promise((resolve, reject) => {
			this.navigation = new Navigation();
			this.pageList = new PageList();
			resolve(this.navigation);
		});
		return this.load(navPath, "xml").then((xml) => {
			this.navigation = new Navigation(xml);
			this.pageList = new PageList(xml);
			return this.navigation;
		});
	}
	/**
	* Gets a Section of the Book from the Spine
	* Alias for `book.spine.get`
	* @param {string} target
	* @return {Section}
	*/
	section(target) {
		return this.spine.get(target);
	}
	/**
	* Sugar to render a book to an element
	* @param  {element | string} element element or string to add a rendition to
	* @param  {object} [options]
	* @return {Rendition}
	*/
	renderTo(element, options) {
		this.rendition = new Rendition(this, options);
		this.rendition.attachTo(element);
		return this.rendition;
	}
	/**
	* Set if request should use withCredentials
	* @param {boolean} credentials
	*/
	setRequestCredentials(credentials) {
		this.settings.requestCredentials = credentials;
	}
	/**
	* Set headers request should use
	* @param {object} headers
	*/
	setRequestHeaders(headers) {
		this.settings.requestHeaders = headers;
	}
	/**
	* Unarchive a zipped epub
	* @private
	* @param  {binary} input epub data
	* @param  {string} [encoding]
	* @return {Archive}
	*/
	unarchive(input, encoding) {
		this.archive = new Archive();
		return this.archive.open(input, encoding);
	}
	/**
	* Store the epubs contents
	* @private
	* @param  {binary} input epub data
	* @param  {string} [encoding]
	* @return {Store}
	*/
	store(name) {
		let replacementsSetting = this.settings.replacements && this.settings.replacements !== "none";
		let originalUrl = this.url;
		let requester = this.settings.requestMethod || request.bind(this);
		this.storage = new Store(name, requester, this.resolve.bind(this));
		this.request = this.storage.request.bind(this.storage);
		this.opened.then(() => {
			if (this.archived) this.storage.requester = this.archive.request.bind(this.archive);
			let substituteResources = (output, section) => {
				section.output = this.resources.substitute(output, section.url);
			};
			this.resources.settings.replacements = replacementsSetting || "blobUrl";
			this.resources.replacements().then(() => {
				return this.resources.replaceCss();
			});
			this.storage.on("offline", () => {
				this.url = new Url("/", "");
				this.spine.hooks.serialize.register(substituteResources);
			});
			this.storage.on("online", () => {
				this.url = originalUrl;
				this.spine.hooks.serialize.deregister(substituteResources);
			});
		});
		return this.storage;
	}
	/**
	* Get the cover url
	* @return {Promise<?string>} coverUrl
	*/
	coverUrl() {
		return this.loaded.cover.then(() => {
			if (!this.cover) return null;
			if (this.archived) return this.archive.createUrl(this.cover);
			else return this.cover;
		});
	}
	/**
	* Load replacement urls
	* @private
	* @return {Promise} completed loading urls
	*/
	replacements() {
		this.spine.hooks.serialize.register((output, section) => {
			section.output = this.resources.substitute(output, section.url);
		});
		return this.resources.replacements().then(() => {
			return this.resources.replaceCss();
		});
	}
	/**
	* Find a DOM Range for a given CFI Range
	* @param  {EpubCFI} cfiRange a epub cfi range
	* @return {Promise}
	*/
	getRange(cfiRange) {
		var cfi = new EpubCFI(cfiRange);
		var item = this.spine.get(cfi.spinePos);
		var _request = this.load.bind(this);
		if (!item) return new Promise((resolve, reject) => {
			reject("CFI could not be found");
		});
		return item.load(_request).then(function(contents) {
			return cfi.toRange(item.document);
		});
	}
	/**
	* Generates the Book Key using the identifier in the manifest or other string provided
	* @param  {string} [identifier] to use instead of metadata identifier
	* @return {string} key
	*/
	key(identifier) {
		return `epubjs:0.3:${identifier || this.packaging.metadata.identifier || this.url.filename}`;
	}
	/**
	* Destroy the Book and all associated objects
	*/
	destroy() {
		this.opened = void 0;
		this.loading = void 0;
		this.loaded = void 0;
		this.ready = void 0;
		this.isOpen = false;
		this.isRendered = false;
		this.spine && this.spine.destroy();
		this.locations && this.locations.destroy();
		this.pageList && this.pageList.destroy();
		this.archive && this.archive.destroy();
		this.resources && this.resources.destroy();
		this.container && this.container.destroy();
		this.packaging && this.packaging.destroy();
		this.rendition && this.rendition.destroy();
		this.displayOptions && this.displayOptions.destroy();
		this.spine = void 0;
		this.locations = void 0;
		this.pageList = void 0;
		this.archive = void 0;
		this.resources = void 0;
		this.container = void 0;
		this.packaging = void 0;
		this.rendition = void 0;
		this.navigation = void 0;
		this.url = void 0;
		this.path = void 0;
		this.archived = false;
	}
};
(0, import_event_emitter.default)(Book.prototype);
//#endregion
//#region node_modules/epubjs/src/epub.js
/**
* Creates a new Book
* @param {string|ArrayBuffer} url URL, Path or ArrayBuffer
* @param {object} options to pass to the book
* @returns {Book} a new Book object
* @example ePub("/path/to/book.epub", {})
*/
function ePub(url, options) {
	return new Book(url, options);
}
ePub.VERSION = "0.3";
if (typeof global !== "undefined") global.EPUBJS_VERSION = "0.3";
ePub.Book = Book;
ePub.Rendition = Rendition;
ePub.Contents = Contents;
ePub.CFI = EpubCFI;
ePub.utils = core_exports;
//#endregion
//#region node_modules/epubjs/src/index.js
var src_exports = /* @__PURE__ */ __exportAll({ default: () => src_default });
var src_default = ePub;
//#endregion
export { src_exports as t };
