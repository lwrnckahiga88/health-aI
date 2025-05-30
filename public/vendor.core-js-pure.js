(self["webpackChunkhealth_ai"] = self["webpackChunkhealth_ai"] || []).push([[51],{

/***/ 87:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var DESCRIPTORS = __webpack_require__(5733);
var hasOwn = __webpack_require__(2474);
var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;
var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
_c = EXISTS;
var PROPER = EXISTS && function something() {/* empty */}.name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable);
module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};
var _c;
$RefreshReg$(_c, "EXISTS");

/***/ }),

/***/ 98:
/***/ (function() {

// empty

/***/ }),

/***/ 230:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


/* eslint-disable no-proto -- safe */
var uncurryThisAccessor = __webpack_require__(7417);
var isObject = __webpack_require__(3911);
var requireObjectCoercible = __webpack_require__(8829);
var aPossiblePrototype = __webpack_require__(769);

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) {/* empty */}
  return function setPrototypeOf(O, proto) {
    requireObjectCoercible(O);
    aPossiblePrototype(proto);
    if (!isObject(O)) return O;
    if (CORRECT_SETTER) setter(O, proto);else O.__proto__ = proto;
    return O;
  };
}() : undefined);

/***/ }),

/***/ 340:
/***/ (function(module) {

"use strict";


module.exports = {};

/***/ }),

/***/ 355:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var toIntegerOrInfinity = __webpack_require__(3408);
var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  var len = toIntegerOrInfinity(argument);
  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

/***/ }),

/***/ 361:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var wellKnownSymbol = __webpack_require__(3362);
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};
test[TO_STRING_TAG] = 'z';
module.exports = String(test) === '[object z]';

/***/ }),

/***/ 423:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var call = __webpack_require__(5888);
var isCallable = __webpack_require__(8932);
var isObject = __webpack_require__(3911);
var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw new $TypeError("Can't convert object to primitive value");
};

/***/ }),

/***/ 438:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var DESCRIPTORS = __webpack_require__(5733);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(8971);
var definePropertyModule = __webpack_require__(8714);
var anObject = __webpack_require__(1730);
var toIndexedObject = __webpack_require__(1060);
var objectKeys = __webpack_require__(1529);

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};

/***/ }),

/***/ 450:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var TO_STRING_TAG_SUPPORT = __webpack_require__(361);
var defineProperty = (__webpack_require__(8714).f);
var createNonEnumerableProperty = __webpack_require__(5440);
var hasOwn = __webpack_require__(2474);
var toString = __webpack_require__(2572);
var wellKnownSymbol = __webpack_require__(3362);
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
module.exports = function (it, TAG, STATIC, SET_METHOD) {
  var target = STATIC ? it : it && it.prototype;
  if (target) {
    if (!hasOwn(target, TO_STRING_TAG)) {
      defineProperty(target, TO_STRING_TAG, {
        configurable: true,
        value: TAG
      });
    }
    if (SET_METHOD && !TO_STRING_TAG_SUPPORT) {
      createNonEnumerableProperty(target, 'toString', toString);
    }
  }
};

/***/ }),

/***/ 457:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var toIndexedObject = __webpack_require__(1060);
var addToUnscopables = __webpack_require__(8202);
var Iterators = __webpack_require__(340);
var InternalStateModule = __webpack_require__(8886);
var defineProperty = (__webpack_require__(8714).f);
var defineIterator = __webpack_require__(9513);
var createIterResultObject = __webpack_require__(1128);
var IS_PURE = __webpack_require__(9150);
var DESCRIPTORS = __webpack_require__(5733);
var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated),
    // target
    index: 0,
    // next index
    kind: kind // kind
  });
  // `%ArrayIteratorPrototype%.next` method
  // https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = null;
    return createIterResultObject(undefined, true);
  }
  switch (state.kind) {
    case 'keys':
      return createIterResultObject(index, false);
    case 'values':
      return createIterResultObject(target[index], false);
  }
  return createIterResultObject([index, target[index]], false);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
var values = Iterators.Arguments = Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

// V8 ~ Chrome 45- bug
if (!IS_PURE && DESCRIPTORS && values.name !== 'values') try {
  defineProperty(values, 'name', {
    value: 'values'
  });
} catch (error) {/* empty */}

/***/ }),

/***/ 548:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var globalThis = __webpack_require__(1365);
var navigator = globalThis.navigator;
var userAgent = navigator && navigator.userAgent;
module.exports = userAgent ? String(userAgent) : '';

/***/ }),

/***/ 769:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isPossiblePrototype = __webpack_require__(1475);
var $String = String;
var $TypeError = TypeError;
module.exports = function (argument) {
  if (isPossiblePrototype(argument)) return argument;
  throw new $TypeError("Can't set " + $String(argument) + ' as a prototype');
};

/***/ }),

/***/ 886:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


__webpack_require__(98);
var getRegExpFlags = __webpack_require__(4273);
module.exports = getRegExpFlags;

/***/ }),

/***/ 942:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var IS_PURE = __webpack_require__(9150);
var globalThis = __webpack_require__(1365);
var defineGlobalProperty = __webpack_require__(6454);
var SHARED = '__core-js_shared__';
var store = module.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});
(store.versions || (store.versions = [])).push({
  version: '3.41.0',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2025 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.41.0/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});

/***/ }),

/***/ 975:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var parent = __webpack_require__(9860);
module.exports = parent;

/***/ }),

/***/ 976:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var DESCRIPTORS = __webpack_require__(5733);
var call = __webpack_require__(5888);
var propertyIsEnumerableModule = __webpack_require__(6504);
var createPropertyDescriptor = __webpack_require__(8683);
var toIndexedObject = __webpack_require__(1060);
var toPropertyKey = __webpack_require__(9136);
var hasOwn = __webpack_require__(2474);
var IE8_DOM_DEFINE = __webpack_require__(1230);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) {/* empty */}
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};

/***/ }),

/***/ 1060:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(4472);
var requireObjectCoercible = __webpack_require__(8829);
module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};

/***/ }),

/***/ 1128:
/***/ (function(module) {

"use strict";


// `CreateIterResultObject` abstract operation
// https://tc39.es/ecma262/#sec-createiterresultobject
module.exports = function (value, done) {
  return {
    value: value,
    done: done
  };
};

/***/ }),

/***/ 1168:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var shared = __webpack_require__(6546);
var uid = __webpack_require__(8345);
var keys = shared('keys');
module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

/***/ }),

/***/ 1194:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var toIndexedObject = __webpack_require__(1060);
var toAbsoluteIndex = __webpack_require__(6475);
var lengthOfArrayLike = __webpack_require__(5653);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    if (length === 0) return !IS_INCLUDES && -1;
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el !== el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value !== value) return true;
      // Array#indexOf ignores holes, Array#includes - not
    } else for (; length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    }
    return !IS_INCLUDES && -1;
  };
};
module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

/***/ }),

/***/ 1210:
/***/ (function(module) {

"use strict";


module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

/***/ }),

/***/ 1230:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var DESCRIPTORS = __webpack_require__(5733);
var fails = __webpack_require__(1210);
var createElement = __webpack_require__(2766);

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () {
      return 7;
    }
  }).a !== 7;
});

/***/ }),

/***/ 1322:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var fails = __webpack_require__(1210);
var isCallable = __webpack_require__(8932);
var isObject = __webpack_require__(3911);
var create = __webpack_require__(1617);
var getPrototypeOf = __webpack_require__(6930);
var defineBuiltIn = __webpack_require__(9661);
var wellKnownSymbol = __webpack_require__(3362);
var IS_PURE = __webpack_require__(9150);
var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}
var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});
if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable(IteratorPrototype[ITERATOR])) {
  defineBuiltIn(IteratorPrototype, ITERATOR, function () {
    return this;
  });
}
module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};

/***/ }),

/***/ 1365:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var check = function (it) {
  return it && it.Math === Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
// eslint-disable-next-line es/no-global-this -- safe
check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) ||
// eslint-disable-next-line no-restricted-globals -- safe
check(typeof self == 'object' && self) || check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) || check(typeof this == 'object' && this) ||
// eslint-disable-next-line no-new-func -- fallback
function () {
  return this;
}() || Function('return this')();

/***/ }),

/***/ 1389:
/***/ (function(module) {

"use strict";


// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

/***/ }),

/***/ 1436:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var path = __webpack_require__(7368);
var globalThis = __webpack_require__(1365);
var isCallable = __webpack_require__(8932);
var aFunction = function (variable) {
  return isCallable(variable) ? variable : undefined;
};
module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(globalThis[namespace]) : path[namespace] && path[namespace][method] || globalThis[namespace] && globalThis[namespace][method];
};

/***/ }),

/***/ 1451:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var globalThis = __webpack_require__(1365);
var apply = __webpack_require__(5134);
var isCallable = __webpack_require__(8932);
var ENVIRONMENT = __webpack_require__(6990);
var USER_AGENT = __webpack_require__(548);
var arraySlice = __webpack_require__(2985);
var validateArgumentsLength = __webpack_require__(9549);
var Function = globalThis.Function;
// dirty IE9- and Bun 0.3.0- checks
var WRAP = /MSIE .\./.test(USER_AGENT) || ENVIRONMENT === 'BUN' && function () {
  var version = globalThis.Bun.version.split('.');
  return version.length < 3 || version[0] === '0' && (version[1] < 3 || version[1] === '3' && version[2] === '0');
}();

// IE9- / Bun 0.3.0- setTimeout / setInterval / setImmediate additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
// https://github.com/oven-sh/bun/issues/1633
module.exports = function (scheduler, hasTimeArg) {
  var firstParamIndex = hasTimeArg ? 2 : 1;
  return WRAP ? function (handler, timeout /* , ...arguments */) {
    var boundArgs = validateArgumentsLength(arguments.length, 1) > firstParamIndex;
    var fn = isCallable(handler) ? handler : Function(handler);
    var params = boundArgs ? arraySlice(arguments, firstParamIndex) : [];
    var callback = boundArgs ? function () {
      apply(fn, this, params);
    } : fn;
    return hasTimeArg ? scheduler(callback, timeout) : scheduler(callback);
  } : scheduler;
};

/***/ }),

/***/ 1475:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isObject = __webpack_require__(3911);
module.exports = function (argument) {
  return isObject(argument) || argument === null;
};

/***/ }),

/***/ 1529:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var internalObjectKeys = __webpack_require__(5659);
var enumBugKeys = __webpack_require__(5442);

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};

/***/ }),

/***/ 1542:
/***/ (function(module) {

"use strict";


// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};

/***/ }),

/***/ 1557:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var uncurryThis = __webpack_require__(6723);
var aCallable = __webpack_require__(2201);
var NATIVE_BIND = __webpack_require__(6359);
var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function /* ...args */
  () {
    return fn.apply(that, arguments);
  };
};

/***/ }),

/***/ 1617:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__(1730);
var definePropertiesModule = __webpack_require__(438);
var enumBugKeys = __webpack_require__(5442);
var hiddenKeys = __webpack_require__(2988);
var html = __webpack_require__(5338);
var documentCreateElement = __webpack_require__(2766);
var sharedKey = __webpack_require__(1168);
var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');
var EmptyConstructor = function () {/* empty */};
_c = EmptyConstructor;
var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  // eslint-disable-next-line no-useless-assignment -- avoid memory leak
  activeXDocument = null;
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
_c2 = NullProtoObjectViaActiveX;
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
_c3 = NullProtoObjectViaIFrame;
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) {/* ignore */}
  NullProtoObject = typeof document != 'undefined' ? document.domain && activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) // old IE
  : NullProtoObjectViaIFrame() : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};
_c4 = NullProtoObject;
hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};
var _c, _c2, _c3, _c4;
$RefreshReg$(_c, "EmptyConstructor");
$RefreshReg$(_c2, "NullProtoObjectViaActiveX");
$RefreshReg$(_c3, "NullProtoObjectViaIFrame");
$RefreshReg$(_c4, "NullProtoObject");

/***/ }),

/***/ 1730:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isObject = __webpack_require__(3911);
var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw new $TypeError($String(argument) + ' is not an object');
};

/***/ }),

/***/ 1800:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var getBuiltIn = __webpack_require__(1436);
var isCallable = __webpack_require__(8932);
var isPrototypeOf = __webpack_require__(5066);
var USE_SYMBOL_AS_UID = __webpack_require__(9353);
var $Object = Object;
module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};

/***/ }),

/***/ 2168:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(2776);
var fails = __webpack_require__(1210);
var globalThis = __webpack_require__(1365);
var $String = globalThis.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol('symbol detection');
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
  // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
  !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});

/***/ }),

/***/ 2186:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var call = __webpack_require__(5888);
var isObject = __webpack_require__(3911);
var isSymbol = __webpack_require__(1800);
var getMethod = __webpack_require__(4569);
var ordinaryToPrimitive = __webpack_require__(423);
var wellKnownSymbol = __webpack_require__(3362);
var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw new $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};

/***/ }),

/***/ 2201:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isCallable = __webpack_require__(8932);
var tryToString = __webpack_require__(7566);
var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw new $TypeError(tryToString(argument) + ' is not a function');
};

/***/ }),

/***/ 2244:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


__webpack_require__(7945);
var path = __webpack_require__(7368);
module.exports = path.setImmediate;

/***/ }),

/***/ 2474:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var uncurryThis = __webpack_require__(9961);
var toObject = __webpack_require__(3908);
var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};

/***/ }),

/***/ 2572:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var TO_STRING_TAG_SUPPORT = __webpack_require__(361);
var classof = __webpack_require__(5446);

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};

/***/ }),

/***/ 2597:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var classof = __webpack_require__(5446);
var $String = String;
module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};

/***/ }),

/***/ 2766:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var globalThis = __webpack_require__(1365);
var isObject = __webpack_require__(3911);
var document = globalThis.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};

/***/ }),

/***/ 2776:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var globalThis = __webpack_require__(1365);
var userAgent = __webpack_require__(548);
var process = globalThis.process;
var Deno = globalThis.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;
if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}
module.exports = version;

/***/ }),

/***/ 2985:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var uncurryThis = __webpack_require__(9961);
module.exports = uncurryThis([].slice);

/***/ }),

/***/ 2988:
/***/ (function(module) {

"use strict";


module.exports = {};

/***/ }),

/***/ 3362:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var globalThis = __webpack_require__(1365);
var shared = __webpack_require__(6546);
var hasOwn = __webpack_require__(2474);
var uid = __webpack_require__(8345);
var NATIVE_SYMBOL = __webpack_require__(2168);
var USE_SYMBOL_AS_UID = __webpack_require__(9353);
var Symbol = globalThis.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;
module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name) ? Symbol[name] : createWellKnownSymbol('Symbol.' + name);
  }
  return WellKnownSymbolsStore[name];
};

/***/ }),

/***/ 3377:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var fails = __webpack_require__(1210);
var isCallable = __webpack_require__(8932);
var replacement = /#|\.prototype\./;
var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value === POLYFILL ? true : value === NATIVE ? false : isCallable(detection) ? fails(detection) : !!detection;
};
var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};
var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';
module.exports = isForced;

/***/ }),

/***/ 3408:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var trunc = __webpack_require__(5558);

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};

/***/ }),

/***/ 3461:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var globalThis = __webpack_require__(1365);
var apply = __webpack_require__(5134);
var uncurryThis = __webpack_require__(6723);
var isCallable = __webpack_require__(8932);
var getOwnPropertyDescriptor = (__webpack_require__(976).f);
var isForced = __webpack_require__(3377);
var path = __webpack_require__(7368);
var bind = __webpack_require__(1557);
var createNonEnumerableProperty = __webpack_require__(5440);
var hasOwn = __webpack_require__(2474);
// add debugging info
__webpack_require__(942);
var wrapConstructor = function (NativeConstructor) {
  var Wrapper = function (a, b, c) {
    if (this instanceof Wrapper) {
      switch (arguments.length) {
        case 0:
          return new NativeConstructor();
        case 1:
          return new NativeConstructor(a);
        case 2:
          return new NativeConstructor(a, b);
      }
      return new NativeConstructor(a, b, c);
    }
    return apply(NativeConstructor, this, arguments);
  };
  Wrapper.prototype = NativeConstructor.prototype;
  return Wrapper;
};

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var PROTO = options.proto;
  var nativeSource = GLOBAL ? globalThis : STATIC ? globalThis[TARGET] : globalThis[TARGET] && globalThis[TARGET].prototype;
  var target = GLOBAL ? path : path[TARGET] || createNonEnumerableProperty(path, TARGET, {})[TARGET];
  var targetPrototype = target.prototype;
  var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
  var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;
  for (key in source) {
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contains in native
    USE_NATIVE = !FORCED && nativeSource && hasOwn(nativeSource, key);
    targetProperty = target[key];
    if (USE_NATIVE) if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(nativeSource, key);
      nativeProperty = descriptor && descriptor.value;
    } else nativeProperty = nativeSource[key];

    // export native or implementation
    sourceProperty = USE_NATIVE && nativeProperty ? nativeProperty : source[key];
    if (!FORCED && !PROTO && typeof targetProperty == typeof sourceProperty) continue;

    // bind methods to global for calling from export context
    if (options.bind && USE_NATIVE) resultProperty = bind(sourceProperty, globalThis);
    // wrap global constructors for prevent changes in this version
    else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
    // make static versions for prototype methods
    else if (PROTO && isCallable(sourceProperty)) resultProperty = uncurryThis(sourceProperty);
    // default case
    else resultProperty = sourceProperty;

    // add a flag to not completely full polyfills
    if (options.sham || sourceProperty && sourceProperty.sham || targetProperty && targetProperty.sham) {
      createNonEnumerableProperty(resultProperty, 'sham', true);
    }
    createNonEnumerableProperty(target, key, resultProperty);
    if (PROTO) {
      VIRTUAL_PROTOTYPE = TARGET + 'Prototype';
      if (!hasOwn(path, VIRTUAL_PROTOTYPE)) {
        createNonEnumerableProperty(path, VIRTUAL_PROTOTYPE, {});
      }
      // export virtual prototype methods
      createNonEnumerableProperty(path[VIRTUAL_PROTOTYPE], key, sourceProperty);
      // export real prototype methods
      if (options.real && targetPrototype && (FORCED || !targetPrototype[key])) {
        createNonEnumerableProperty(targetPrototype, key, sourceProperty);
      }
    }
  }
};

/***/ }),

/***/ 3628:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var uncurryThis = __webpack_require__(9961);
var toIntegerOrInfinity = __webpack_require__(3408);
var toString = __webpack_require__(2597);
var requireObjectCoercible = __webpack_require__(8829);
var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var stringSlice = uncurryThis(''.slice);
var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString(requireObjectCoercible($this));
    var position = toIntegerOrInfinity(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = charCodeAt(S, position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF ? CONVERT_TO_STRING ? charAt(S, position) : first : CONVERT_TO_STRING ? stringSlice(S, position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};
module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};

/***/ }),

/***/ 3834:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var classof = __webpack_require__(5446);
var hasOwn = __webpack_require__(2474);
var isNullOrUndefined = __webpack_require__(1542);
var wellKnownSymbol = __webpack_require__(3362);
var Iterators = __webpack_require__(340);
var ITERATOR = wellKnownSymbol('iterator');
var $Object = Object;
module.exports = function (it) {
  if (isNullOrUndefined(it)) return false;
  var O = $Object(it);
  return O[ITERATOR] !== undefined || '@@iterator' in O || hasOwn(Iterators, classof(O));
};

/***/ }),

/***/ 3856:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var fails = __webpack_require__(1210);
module.exports = !fails(function () {
  function F() {/* empty */}
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

/***/ }),

/***/ 3908:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var requireObjectCoercible = __webpack_require__(8829);
var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};

/***/ }),

/***/ 3911:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isCallable = __webpack_require__(8932);
module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};

/***/ }),

/***/ 4273:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _flagsInstanceProperty = __webpack_require__(104);
var call = __webpack_require__(5888);
var hasOwn = __webpack_require__(2474);
var isPrototypeOf = __webpack_require__(5066);
var regExpFlags = __webpack_require__(9484);
var RegExpPrototype = RegExp.prototype;
module.exports = function (R) {
  var flags = _flagsInstanceProperty(R);
  return flags === undefined && !('flags' in RegExpPrototype) && !hasOwn(R, 'flags') && isPrototypeOf(RegExpPrototype, R) ? call(regExpFlags, R) : flags;
};

/***/ }),

/***/ 4321:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var $ = __webpack_require__(3461);
var globalThis = __webpack_require__(1365);
var clearImmediate = (__webpack_require__(6602).clear);

// `clearImmediate` method
// http://w3c.github.io/setImmediate/#si-clearImmediate
$({
  global: true,
  bind: true,
  enumerable: true,
  forced: globalThis.clearImmediate !== clearImmediate
}, {
  clearImmediate: clearImmediate
});

/***/ }),

/***/ 4472:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var uncurryThis = __webpack_require__(9961);
var fails = __webpack_require__(1210);
var classof = __webpack_require__(4745);
var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) === 'String' ? split(it, '') : $Object(it);
} : $Object;

/***/ }),

/***/ 4537:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(975);

/***/ }),

/***/ 4569:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var aCallable = __webpack_require__(2201);
var isNullOrUndefined = __webpack_require__(1542);

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};

/***/ }),

/***/ 4745:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var uncurryThis = __webpack_require__(9961);
var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);
module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};

/***/ }),

/***/ 5066:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var uncurryThis = __webpack_require__(9961);
module.exports = uncurryThis({}.isPrototypeOf);

/***/ }),

/***/ 5134:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var NATIVE_BIND = __webpack_require__(6359);
var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es/no-function-prototype-bind, es/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});

/***/ }),

/***/ 5338:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var getBuiltIn = __webpack_require__(1436);
module.exports = getBuiltIn('document', 'documentElement');

/***/ }),

/***/ 5440:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var DESCRIPTORS = __webpack_require__(5733);
var definePropertyModule = __webpack_require__(8714);
var createPropertyDescriptor = __webpack_require__(8683);
module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

/***/ }),

/***/ 5442:
/***/ (function(module) {

"use strict";


// IE8- don't enum bug keys
module.exports = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

/***/ }),

/***/ 5446:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var TO_STRING_TAG_SUPPORT = __webpack_require__(361);
var isCallable = __webpack_require__(8932);
var classofRaw = __webpack_require__(4745);
var wellKnownSymbol = __webpack_require__(3362);
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () {
  return arguments;
}()) === 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) {/* empty */}
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
  // @@toStringTag case
  : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
  // builtinTag case
  : CORRECT_ARGUMENTS ? classofRaw(O)
  // ES3 arguments fallback
  : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};

/***/ }),

/***/ 5558:
/***/ (function(module) {

"use strict";


var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};

/***/ }),

/***/ 5594:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


__webpack_require__(457);
var DOMIterables = __webpack_require__(1389);
var globalThis = __webpack_require__(1365);
var setToStringTag = __webpack_require__(450);
var Iterators = __webpack_require__(340);
for (var COLLECTION_NAME in DOMIterables) {
  setToStringTag(globalThis[COLLECTION_NAME], COLLECTION_NAME);
  Iterators[COLLECTION_NAME] = Iterators.Array;
}

/***/ }),

/***/ 5653:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var toLength = __webpack_require__(355);

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};

/***/ }),

/***/ 5659:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var uncurryThis = __webpack_require__(9961);
var hasOwn = __webpack_require__(2474);
var toIndexedObject = __webpack_require__(1060);
var indexOf = (__webpack_require__(1194).indexOf);
var hiddenKeys = __webpack_require__(2988);
var push = uncurryThis([].push);
module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};

/***/ }),

/***/ 5733:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var fails = __webpack_require__(1210);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, {
    get: function () {
      return 7;
    }
  })[1] !== 7;
});

/***/ }),

/***/ 5888:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var NATIVE_BIND = __webpack_require__(6359);
var call = Function.prototype.call;
// eslint-disable-next-line es/no-function-prototype-bind -- safe
module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};

/***/ }),

/***/ 5944:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _flagsInstanceProperty = __webpack_require__(104);
var isPrototypeOf = __webpack_require__(5066);
var flags = __webpack_require__(886);
var RegExpPrototype = RegExp.prototype;
module.exports = function (it) {
  return it === RegExpPrototype || isPrototypeOf(RegExpPrototype, it) ? flags(it) : _flagsInstanceProperty(it);
};

/***/ }),

/***/ 6359:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var fails = __webpack_require__(1210);
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = function () {/* empty */}.bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});

/***/ }),

/***/ 6454:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var globalThis = __webpack_require__(1365);

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
module.exports = function (key, value) {
  try {
    defineProperty(globalThis, key, {
      value: value,
      configurable: true,
      writable: true
    });
  } catch (error) {
    globalThis[key] = value;
  }
  return value;
};

/***/ }),

/***/ 6475:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var toIntegerOrInfinity = __webpack_require__(3408);
var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};

/***/ }),

/***/ 6504:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({
  1: 2
}, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;

/***/ }),

/***/ 6546:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var store = __webpack_require__(942);
module.exports = function (key, value) {
  return store[key] || (store[key] = value || {});
};

/***/ }),

/***/ 6602:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var globalThis = __webpack_require__(1365);
var apply = __webpack_require__(5134);
var bind = __webpack_require__(1557);
var isCallable = __webpack_require__(8932);
var hasOwn = __webpack_require__(2474);
var fails = __webpack_require__(1210);
var html = __webpack_require__(5338);
var arraySlice = __webpack_require__(2985);
var createElement = __webpack_require__(2766);
var validateArgumentsLength = __webpack_require__(9549);
var IS_IOS = __webpack_require__(7427);
var IS_NODE = __webpack_require__(9836);
var set = globalThis.setImmediate;
var clear = globalThis.clearImmediate;
var process = globalThis.process;
var Dispatch = globalThis.Dispatch;
var Function = globalThis.Function;
var MessageChannel = globalThis.MessageChannel;
var String = globalThis.String;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var $location, defer, channel, port;
fails(function () {
  // Deno throws a ReferenceError on `location` access without `--location` flag
  $location = globalThis.location;
});
var run = function (id) {
  if (hasOwn(queue, id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var runner = function (id) {
  return function () {
    run(id);
  };
};
var eventListener = function (event) {
  run(event.data);
};
var globalPostMessageDefer = function (id) {
  // old engines have not location.origin
  globalThis.postMessage(String(id), $location.protocol + '//' + $location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set || !clear) {
  set = function setImmediate(handler) {
    validateArgumentsLength(arguments.length, 1);
    var fn = isCallable(handler) ? handler : Function(handler);
    var args = arraySlice(arguments, 1);
    queue[++counter] = function () {
      apply(fn, undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (IS_NODE) {
    defer = function (id) {
      process.nextTick(runner(id));
    };
    // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
    // Browsers with MessageChannel, includes WebWorkers
    // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !IS_IOS) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = eventListener;
    defer = bind(port.postMessage, port);
    // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (globalThis.addEventListener && isCallable(globalThis.postMessage) && !globalThis.importScripts && $location && $location.protocol !== 'file:' && !fails(globalPostMessageDefer)) {
    defer = globalPostMessageDefer;
    globalThis.addEventListener('message', eventListener, false);
    // IE8-
  } else if (ONREADYSTATECHANGE in createElement('script')) {
    defer = function (id) {
      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
    // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}
module.exports = {
  set: set,
  clear: clear
};

/***/ }),

/***/ 6723:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var classofRaw = __webpack_require__(4745);
var uncurryThis = __webpack_require__(9961);
module.exports = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
};

/***/ }),

/***/ 6930:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var hasOwn = __webpack_require__(2474);
var isCallable = __webpack_require__(8932);
var toObject = __webpack_require__(3908);
var sharedKey = __webpack_require__(1168);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(3856);
var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  }
  return object instanceof $Object ? ObjectPrototype : null;
};

/***/ }),

/***/ 6972:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var $ = __webpack_require__(3461);
var globalThis = __webpack_require__(1365);
var setTask = (__webpack_require__(6602).set);
var schedulersFix = __webpack_require__(1451);

// https://github.com/oven-sh/bun/issues/1633
var setImmediate = globalThis.setImmediate ? schedulersFix(setTask, false) : setTask;

// `setImmediate` method
// http://w3c.github.io/setImmediate/#si-setImmediate
$({
  global: true,
  bind: true,
  enumerable: true,
  forced: globalThis.setImmediate !== setImmediate
}, {
  setImmediate: setImmediate
});

/***/ }),

/***/ 6990:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


/* global Bun, Deno -- detection */
var globalThis = __webpack_require__(1365);
var userAgent = __webpack_require__(548);
var classof = __webpack_require__(4745);
var userAgentStartsWith = function (string) {
  return userAgent.slice(0, string.length) === string;
};
module.exports = function () {
  if (userAgentStartsWith('Bun/')) return 'BUN';
  if (userAgentStartsWith('Cloudflare-Workers')) return 'CLOUDFLARE';
  if (userAgentStartsWith('Deno/')) return 'DENO';
  if (userAgentStartsWith('Node.js/')) return 'NODE';
  if (globalThis.Bun && typeof Bun.version == 'string') return 'BUN';
  if (globalThis.Deno && typeof Deno.version == 'object') return 'DENO';
  if (classof(globalThis.process) === 'process') return 'NODE';
  if (globalThis.window && globalThis.document) return 'BROWSER';
  return 'REST';
}();

/***/ }),

/***/ 7073:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var parent = __webpack_require__(7202);
__webpack_require__(5594);
module.exports = parent;

/***/ }),

/***/ 7202:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


__webpack_require__(457);
__webpack_require__(8011);
var isIterable = __webpack_require__(3834);
module.exports = isIterable;

/***/ }),

/***/ 7368:
/***/ (function(module) {

"use strict";


module.exports = {};

/***/ }),

/***/ 7377:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var globalThis = __webpack_require__(1365);
var isCallable = __webpack_require__(8932);
var WeakMap = globalThis.WeakMap;
module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));

/***/ }),

/***/ 7417:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var uncurryThis = __webpack_require__(9961);
var aCallable = __webpack_require__(2201);
module.exports = function (object, key, method) {
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) {/* empty */}
};

/***/ }),

/***/ 7427:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var userAgent = __webpack_require__(548);

// eslint-disable-next-line redos/no-vulnerable -- safe
module.exports = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent);

/***/ }),

/***/ 7566:
/***/ (function(module) {

"use strict";


var $String = String;
module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};

/***/ }),

/***/ 7945:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


// TODO: Remove this module from `core-js@4` since it's split to modules listed below
__webpack_require__(4321);
__webpack_require__(6972);

/***/ }),

/***/ 8011:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var charAt = (__webpack_require__(3628).charAt);
var toString = __webpack_require__(2597);
var InternalStateModule = __webpack_require__(8886);
var defineIterator = __webpack_require__(9513);
var createIterResultObject = __webpack_require__(1128);
var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: toString(iterated),
    index: 0
  });
  // `%StringIteratorPrototype%.next` method
  // https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return createIterResultObject(undefined, true);
  point = charAt(string, index);
  state.index += point.length;
  return createIterResultObject(point, false);
});

/***/ }),

/***/ 8202:
/***/ (function(module) {

"use strict";


module.exports = function () {/* empty */};

/***/ }),

/***/ 8345:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var uncurryThis = __webpack_require__(9961);
var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);
module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};

/***/ }),

/***/ 8683:
/***/ (function(module) {

"use strict";


module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

/***/ }),

/***/ 8714:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var DESCRIPTORS = __webpack_require__(5733);
var IE8_DOM_DEFINE = __webpack_require__(1230);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(8971);
var anObject = __webpack_require__(1730);
var toPropertyKey = __webpack_require__(9136);
var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  }
  return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) {/* empty */}
  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

/***/ }),

/***/ 8829:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isNullOrUndefined = __webpack_require__(1542);
var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
  return it;
};

/***/ }),

/***/ 8886:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var NATIVE_WEAK_MAP = __webpack_require__(7377);
var globalThis = __webpack_require__(1365);
var isObject = __webpack_require__(3911);
var createNonEnumerableProperty = __webpack_require__(5440);
var hasOwn = __webpack_require__(2474);
var shared = __webpack_require__(942);
var sharedKey = __webpack_require__(1168);
var hiddenKeys = __webpack_require__(2988);
var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = globalThis.TypeError;
var WeakMap = globalThis.WeakMap;
var set, get, has;
var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};
var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
    }
    return state;
  };
};
if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}
module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

/***/ }),

/***/ 8932:
/***/ (function(module) {

"use strict";


// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
var documentAll = typeof document == 'object' && document.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
module.exports = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};

/***/ }),

/***/ 8971:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var DESCRIPTORS = __webpack_require__(5733);
var fails = __webpack_require__(1210);

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () {/* empty */}, 'prototype', {
    value: 42,
    writable: false
  }).prototype !== 42;
});

/***/ }),

/***/ 9136:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var toPrimitive = __webpack_require__(2186);
var isSymbol = __webpack_require__(1800);

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};

/***/ }),

/***/ 9150:
/***/ (function(module) {

"use strict";


module.exports = true;

/***/ }),

/***/ 9353:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(2168);
module.exports = NATIVE_SYMBOL && !Symbol.sham && typeof Symbol.iterator == 'symbol';

/***/ }),

/***/ 9391:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var IteratorPrototype = (__webpack_require__(1322).IteratorPrototype);
var create = __webpack_require__(1617);
var createPropertyDescriptor = __webpack_require__(8683);
var setToStringTag = __webpack_require__(450);
var Iterators = __webpack_require__(340);
var returnThis = function () {
  return this;
};
module.exports = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, {
    next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next)
  });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};

/***/ }),

/***/ 9484:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(1730);

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.hasIndices) result += 'd';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.unicodeSets) result += 'v';
  if (that.sticky) result += 'y';
  return result;
};

/***/ }),

/***/ 9513:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var $ = __webpack_require__(3461);
var call = __webpack_require__(5888);
var IS_PURE = __webpack_require__(9150);
var FunctionName = __webpack_require__(87);
var isCallable = __webpack_require__(8932);
var createIteratorConstructor = __webpack_require__(9391);
var getPrototypeOf = __webpack_require__(6930);
var setPrototypeOf = __webpack_require__(230);
var setToStringTag = __webpack_require__(450);
var createNonEnumerableProperty = __webpack_require__(5440);
var defineBuiltIn = __webpack_require__(9661);
var wellKnownSymbol = __webpack_require__(3362);
var Iterators = __webpack_require__(340);
var IteratorsCore = __webpack_require__(1322);
var PROPER_FUNCTION_NAME = FunctionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';
var returnThis = function () {
  return this;
};
module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);
  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS:
        return function keys() {
          return new IteratorConstructor(this, KIND);
        };
      case VALUES:
        return function values() {
          return new IteratorConstructor(this, KIND);
        };
      case ENTRIES:
        return function entries() {
          return new IteratorConstructor(this, KIND);
        };
    }
    return function () {
      return new IteratorConstructor(this);
    };
  };
  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR] || IterablePrototype['@@iterator'] || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME === 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {
          defineBuiltIn(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (PROPER_FUNCTION_NAME && DEFAULT === VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
    } else {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() {
        return call(nativeIterator, this);
      };
    }
  }

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({
      target: NAME,
      proto: true,
      forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME
    }, methods);
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    defineBuiltIn(IterablePrototype, ITERATOR, defaultIterator, {
      name: DEFAULT
    });
  }
  Iterators[NAME] = defaultIterator;
  return methods;
};

/***/ }),

/***/ 9549:
/***/ (function(module) {

"use strict";


var $TypeError = TypeError;
module.exports = function (passed, required) {
  if (passed < required) throw new $TypeError('Not enough arguments');
  return passed;
};

/***/ }),

/***/ 9597:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var parent = __webpack_require__(5944);
module.exports = parent;

/***/ }),

/***/ 9661:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var createNonEnumerableProperty = __webpack_require__(5440);
module.exports = function (target, key, value, options) {
  if (options && options.enumerable) target[key] = value;else createNonEnumerableProperty(target, key, value);
  return target;
};

/***/ }),

/***/ 9836:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var ENVIRONMENT = __webpack_require__(6990);
module.exports = ENVIRONMENT === 'NODE';

/***/ }),

/***/ 9860:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var parent = __webpack_require__(7073);
module.exports = parent;

/***/ }),

/***/ 9961:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var NATIVE_BIND = __webpack_require__(6359);
var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
// eslint-disable-next-line es/no-function-prototype-bind -- safe
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);
module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};

/***/ })

}]);