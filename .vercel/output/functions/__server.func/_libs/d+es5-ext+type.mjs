import { t as __commonJSMin } from "../_runtime.mjs";
//#region node_modules/type/value/is.js
var require_is$4 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var _undefined = void 0;
	module.exports = function(value) {
		return value !== _undefined && value !== null;
	};
}));
//#endregion
//#region node_modules/type/object/is.js
var require_is$3 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isValue = require_is$4();
	var possibleTypes = {
		"object": true,
		"function": true,
		"undefined": true
	};
	module.exports = function(value) {
		if (!isValue(value)) return false;
		return hasOwnProperty.call(possibleTypes, typeof value);
	};
}));
//#endregion
//#region node_modules/type/prototype/is.js
var require_is$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isObject = require_is$3();
	module.exports = function(value) {
		if (!isObject(value)) return false;
		try {
			if (!value.constructor) return false;
			return value.constructor.prototype === value;
		} catch (error) {
			return false;
		}
	};
}));
//#endregion
//#region node_modules/type/function/is.js
var require_is$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isPrototype = require_is$2();
	module.exports = function(value) {
		if (typeof value !== "function") return false;
		if (!hasOwnProperty.call(value, "length")) return false;
		try {
			if (typeof value.length !== "number") return false;
			if (typeof value.call !== "function") return false;
			if (typeof value.apply !== "function") return false;
		} catch (error) {
			return false;
		}
		return !isPrototype(value);
	};
}));
//#endregion
//#region node_modules/type/plain-function/is.js
var require_is = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isFunction = require_is$1();
	var classRe = /^\s*class[\s{/}]/;
	var functionToString = Function.prototype.toString;
	module.exports = function(value) {
		if (!isFunction(value)) return false;
		if (classRe.test(functionToString.call(value))) return false;
		return true;
	};
}));
//#endregion
//#region node_modules/es5-ext/object/assign/is-implemented.js
var require_is_implemented$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function() {
		var assign = Object.assign, obj;
		if (typeof assign !== "function") return false;
		obj = { foo: "raz" };
		assign(obj, { bar: "dwa" }, { trzy: "trzy" });
		return obj.foo + obj.bar + obj.trzy === "razdwatrzy";
	};
}));
//#endregion
//#region node_modules/es5-ext/object/keys/is-implemented.js
var require_is_implemented$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function() {
		try {
			return true;
		} catch (e) {
			return false;
		}
	};
}));
//#endregion
//#region node_modules/es5-ext/function/noop.js
var require_noop = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function() {};
}));
//#endregion
//#region node_modules/es5-ext/object/is-value.js
var require_is_value = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var _undefined = require_noop()();
	module.exports = function(val) {
		return val !== _undefined && val !== null;
	};
}));
//#endregion
//#region node_modules/es5-ext/object/keys/shim.js
var require_shim$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isValue = require_is_value();
	var keys = Object.keys;
	module.exports = function(object) {
		return keys(isValue(object) ? Object(object) : object);
	};
}));
//#endregion
//#region node_modules/es5-ext/object/keys/index.js
var require_keys = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_is_implemented$1()() ? Object.keys : require_shim$2();
}));
//#endregion
//#region node_modules/es5-ext/object/valid-value.js
var require_valid_value = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isValue = require_is_value();
	module.exports = function(value) {
		if (!isValue(value)) throw new TypeError("Cannot use null or undefined");
		return value;
	};
}));
//#endregion
//#region node_modules/es5-ext/object/assign/shim.js
var require_shim$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var keys = require_keys();
	var value = require_valid_value();
	var max = Math.max;
	module.exports = function(dest, src) {
		var error, i, length = max(arguments.length, 2), assign;
		dest = Object(value(dest));
		assign = function(key) {
			try {
				dest[key] = src[key];
			} catch (e) {
				if (!error) error = e;
			}
		};
		for (i = 1; i < length; ++i) {
			src = arguments[i];
			keys(src).forEach(assign);
		}
		if (error !== void 0) throw error;
		return dest;
	};
}));
//#endregion
//#region node_modules/es5-ext/object/assign/index.js
var require_assign = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_is_implemented$2()() ? Object.assign : require_shim$1();
}));
//#endregion
//#region node_modules/es5-ext/object/normalize-options.js
var require_normalize_options = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isValue = require_is_value();
	var forEach = Array.prototype.forEach;
	var create = Object.create;
	var process = function(src, obj) {
		var key;
		for (key in src) obj[key] = src[key];
	};
	module.exports = function(opts1) {
		var result = create(null);
		forEach.call(arguments, function(options) {
			if (!isValue(options)) return;
			process(Object(options), result);
		});
		return result;
	};
}));
//#endregion
//#region node_modules/es5-ext/string/#/contains/is-implemented.js
var require_is_implemented = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var str = "razdwatrzy";
	module.exports = function() {
		if (typeof str.contains !== "function") return false;
		return str.contains("dwa") === true && str.contains("foo") === false;
	};
}));
//#endregion
//#region node_modules/es5-ext/string/#/contains/shim.js
var require_shim = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var indexOf = String.prototype.indexOf;
	module.exports = function(searchString) {
		return indexOf.call(this, searchString, arguments[1]) > -1;
	};
}));
//#endregion
//#region node_modules/es5-ext/string/#/contains/index.js
var require_contains = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_is_implemented()() ? String.prototype.contains : require_shim();
}));
//#endregion
//#region node_modules/d/index.js
var require_d = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isValue = require_is$4();
	var isPlainFunction = require_is();
	var assign = require_assign();
	var normalizeOpts = require_normalize_options();
	var contains = require_contains();
	var d = module.exports = function(dscr, value) {
		var c, e, w, options, desc;
		if (arguments.length < 2 || typeof dscr !== "string") {
			options = value;
			value = dscr;
			dscr = null;
		} else options = arguments[2];
		if (isValue(dscr)) {
			c = contains.call(dscr, "c");
			e = contains.call(dscr, "e");
			w = contains.call(dscr, "w");
		} else {
			c = w = true;
			e = false;
		}
		desc = {
			value,
			configurable: c,
			enumerable: e,
			writable: w
		};
		return !options ? desc : assign(normalizeOpts(options), desc);
	};
	d.gs = function(dscr, get, set) {
		var c, e, options, desc;
		if (typeof dscr !== "string") {
			options = set;
			set = get;
			get = dscr;
			dscr = null;
		} else options = arguments[3];
		if (!isValue(get)) get = void 0;
		else if (!isPlainFunction(get)) {
			options = get;
			get = set = void 0;
		} else if (!isValue(set)) set = void 0;
		else if (!isPlainFunction(set)) {
			options = set;
			set = void 0;
		}
		if (isValue(dscr)) {
			c = contains.call(dscr, "c");
			e = contains.call(dscr, "e");
		} else {
			c = true;
			e = false;
		}
		desc = {
			get,
			set,
			configurable: c,
			enumerable: e
		};
		return !options ? desc : assign(normalizeOpts(options), desc);
	};
}));
//#endregion
export { require_d as t };
