"use strict";
(self["webpackChunkhealth_ai"] = self["webpackChunkhealth_ai"] || []).push([[347],{

/***/ 6541:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5602);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1148);
var _jsxFileName = "C:\\Users\\KAHIGA\\juA.kalI\\my-webpack-project\\health-ai\\src\\SecondaryApp.js";
// src/SecondaryApp.js (or SecondaryApp.jsx)


const SecondaryApp = () => {
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("div", {
    children: "Secondary App Content"
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 5,
    columnNumber: 10
  }, undefined);
};
_c = SecondaryApp;
/* harmony default export */ __webpack_exports__.A = (SecondaryApp);
var _c;
$RefreshReg$(_c, "SecondaryApp");

/***/ }),

/***/ 7076:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var core_js_modules_es_regexp_flags_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3797);
/* harmony import */ var core_js_modules_es_regexp_flags_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_flags_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_web_immediate_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4978);
/* harmony import */ var core_js_modules_web_immediate_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_immediate_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5602);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(188);
/* harmony import */ var _SecondaryApp__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6541);
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9349);
/* harmony import */ var buffer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1545);
/* harmony import */ var process__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(348);
/* harmony import */ var process__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(process__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(1148);
var _jsxFileName = "C:\\Users\\KAHIGA\\juA.kalI\\my-webpack-project\\health-ai\\src\\secondary.js"; // src/secondary.js




 // Updated import path
 // Shared styles or import secondary-specific styles

// Polyfills (same as main entry)



window.Buffer = buffer__WEBPACK_IMPORTED_MODULE_6__/* .Buffer */ .hp;
window.process = (process__WEBPACK_IMPORTED_MODULE_7___default());

// Initialize React root
const secondaryRootElement = document.getElementById('secondary-root');
if (secondaryRootElement) {
  const secondaryRoot = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_3__.createRoot)(secondaryRootElement);

  // Render secondary app
  secondaryRoot.render(/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxDEV)(react__WEBPACK_IMPORTED_MODULE_2__.StrictMode, {
    children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxDEV)(_SecondaryApp__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A, {}, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 24,
      columnNumber: 7
    }, undefined)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 23,
    columnNumber: 5
  }, undefined));

  // HMR support
  if (true) {
    true.accept('./SecondaryApp', () => {
      const NextSecondaryApp = (__webpack_require__(6541)/* ["default"] */ .A);
      secondaryRoot.render(/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxDEV)(react__WEBPACK_IMPORTED_MODULE_2__.StrictMode, {
        children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxDEV)(NextSecondaryApp, {}, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 34,
          columnNumber: 11
        }, undefined)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 33,
        columnNumber: 9
      }, undefined));
    });
  }
}

/***/ }),

/***/ 9051:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6892);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8532);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "    \r\n      :root {\r\n        --primary-color: #4285f4;\r\n        --dark-bg: #1a1a1a;\r\n        --light-text: #ffffff;\r\n        --accent-green: #00C853;\r\n        --accent-blue: #2962FF;\r\n        --transition-speed: 0.3s;\r\n      }\r\n      \r\n      body {\r\n        margin: 0;\r\n        font-family: 'Roboto', sans-serif;\r\n        background-color: var(--dark-bg);\r\n        color: var(--light-text);\r\n        overflow-x: hidden;\r\n      }\r\n      \r\n      .logo {\r\n        position: fixed;\r\n        top: 20px;\r\n        left: 30px;\r\n        font-size: 1.5rem;\r\n        font-weight: 700;\r\n        z-index: 1000;\r\n        text-transform: uppercase;\r\n        letter-spacing: 2px;\r\n      }\r\n      \r\n      .nav-menu {\r\n        position: fixed;\r\n        top: 20px;\r\n        right: 30px;\r\n        display: flex;\r\n        gap: 20px;\r\n        z-index: 1000;\r\n      }\r\n      \r\n      .nav-menu button {\r\n        background: none;\r\n        border: none;\r\n        color: var(--light-text);\r\n        cursor: pointer;\r\n        padding: 10px 20px;\r\n        border-radius: 25px;\r\n        transition: all var(--transition-speed) ease;\r\n      }\r\n      \r\n      .nav-menu button:hover {\r\n        background-color: rgba(255, 255, 255, 0.1);\r\n        transform: translateY(-2px);\r\n      }\r\n      \r\n      .widget {\r\n        height: 100vh;\r\n        width: 100vw;\r\n        position: relative;\r\n        scroll-snap-align: start;\r\n      }\r\n      \r\n      .widget-image {\r\n        width: 100%;\r\n        height: 100%;\r\n        object-fit: cover;\r\n        position: relative;\r\n      }\r\n      \r\n      .overlay-button {\r\n        position: absolute;\r\n        bottom: 6%;\r\n        left: 50%;\r\n        transform: translateX(-50%);\r\n        padding: 15px 40px;\r\n        background-color: var(--accent-blue);\r\n        color: white;\r\n        border: none;\r\n        border-radius: 30px;\r\n        cursor: pointer;\r\n        font-size: 1.1rem;\r\n        transition: all var(--transition-speed) ease;\r\n      }\r\n      \r\n      .overlay-button:hover {\r\n        background-color: #1e50cc;\r\n        transform: translateX(-50%) scale(1.05);\r\n      }\r\n      \r\n      footer {\r\n        position: fixed;\r\n        bottom: 0;\r\n        width: 100%;\r\n        padding: 20px;\r\n        text-align: center;\r\n        background-color: rgba(0, 0, 0, 0.7);\r\n        backdrop-filter: blur(10px);\r\n      }\r\n      \r\n      footer p {\r\n        margin: 0;\r\n        font-size: 0.9rem;\r\n        color: rgba(255, 255, 255, 0.8);\r\n      }\r\n      \r\n      @media (max-width: 768px) {\r\n        .nav-menu {\r\n          flex-direction: column;\r\n          right: 10px;\r\n          top: 60px;\r\n        }\r\n        \r\n        .logo {\r\n          font-size: 1.2rem;\r\n        }\r\n      }\r\n      \r\n      /* Chatbox styles */\r\n      .chat-box {\r\n        position: fixed;\r\n        bottom: 20px;\r\n        right: 20px;\r\n        width: 320px;\r\n        height: 450px;\r\n        background-color: white;\r\n        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);\r\n        border-radius: 12px;\r\n        overflow: hidden;\r\n        display: flex;\r\n        flex-direction: column;\r\n        opacity: 0;\r\n        transform: translateY(20px);\r\n        animation: fadeIn 0.5s forwards;\r\n      }\r\n      \r\n      /* Smooth fade-in animation */\r\n      @keyframes fadeIn {\r\n        to {\r\n          opacity: 1;\r\n          transform: translateY(0);\r\n        }\r\n      }\r\n      \r\n      /* Messages container */\r\n      .chat-box .messages {\r\n        flex: 1;\r\n        padding: 15px;\r\n        overflow-y: auto;\r\n        scroll-behavior: smooth;\r\n        background-color: lightgrey;\r\n        color: green;\r\n      }\r\n      \r\n      /* Individual messages */\r\n      .chat-box .message {\r\n        padding: 10px;\r\n        margin-bottom: 10px;\r\n        background: green;\r\n        color: lightgrey;\r\n        border-radius: 8px;\r\n        max-width: 80%;\r\n        word-wrap: break-word;\r\n      }\r\n      \r\n      /* User messages (align right) */\r\n      .chat-box .message.user {\r\n        background: lightgrey;\r\n        color: green;\r\n        align-self: flex-end;\r\n      }\r\n      \r\n      /* Replies (align left, royal blue background) */\r\n      .chat-box .message.reply {\r\n        background: royalblue;\r\n        color: white;\r\n        align-self: flex-start;\r\n      }\r\n      \r\n      /* Input field */\r\n      .chat-box input {\r\n        width: calc(100% - 20px);\r\n        padding: 12px;\r\n        border-radius: 8px;\r\n        border: 1px solid green;\r\n        font-size: 14px;\r\n        outline: none;\r\n        box-sizing: border-box;\r\n        background: lightgrey;\r\n        color: royalblue; /* Text color changed to royal blue */\r\n      }\r\n      \r\n      /* Send button */\r\n      .chat-box button {\r\n        width: 100%;\r\n        padding: 12px;\r\n        background-color: green;\r\n        color: lightgrey;\r\n        border: none;\r\n        border-radius: 8px;\r\n        font-size: 16px;\r\n        cursor: pointer;\r\n        transition: background 0.3s ease;\r\n      }\r\n      \r\n      .chat-box button:hover {\r\n        background-color: white;\r\n        color: lightgrey;\r\n      }\r\n      \r\n      /* Contact Form */\r\n      .contact-form {\r\n        width: 90%;\r\n        max-width: 500px;\r\n        padding: 30px;\r\n        background: lightgrey;\r\n        border-radius: 12px;\r\n        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);\r\n        margin: 50px auto;\r\n        color: green;\r\n      }\r\n      \r\n      /* Form fields */\r\n      .contact-form input,\r\n      .contact-form textarea {\r\n        width: 100%;\r\n        padding: 12px;\r\n        border-radius: 8px;\r\n        border: 1px solid green;\r\n        font-size: 16px;\r\n        outline: none;\r\n        transition: 0.3s;\r\n        background: white;\r\n        color: royalblue; /* Text color changed to royal blue */\r\n      }\r\n      \r\n      .contact-form input:focus,\r\n      .contact-form textarea:focus {\r\n        border-color: green;\r\n      }\r\n      \r\n      /* Contact Form Button */\r\n      .contact-form button {\r\n        width: 100%;\r\n        padding: 12px;\r\n        background-color: green;\r\n        color: lightgrey;\r\n        border: none;\r\n        border-radius: 8px;\r\n        font-size: 18px;\r\n        cursor: pointer;\r\n        transition: 0.3s ease;\r\n      }\r\n      \r\n      .contact-form button:hover {\r\n        background-color: green;\r\n        color: white;\r\n      }\r\n      \r\n      /* Mobile Responsiveness */\r\n      @media (max-width: 768px) {\r\n        .chat-box {\r\n          width: 90%;\r\n          bottom: 10px;\r\n          right: 5%;\r\n        }\r\n        \r\n        .contact-form {\r\n          width: 95%;\r\n        }\r\n      }", "",{"version":3,"sources":["webpack://./src/styles.css"],"names":[],"mappings":"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","sourcesContent":["    \r\n      :root {\r\n        --primary-color: #4285f4;\r\n        --dark-bg: #1a1a1a;\r\n        --light-text: #ffffff;\r\n        --accent-green: #00C853;\r\n        --accent-blue: #2962FF;\r\n        --transition-speed: 0.3s;\r\n      }\r\n      \r\n      body {\r\n        margin: 0;\r\n        font-family: 'Roboto', sans-serif;\r\n        background-color: var(--dark-bg);\r\n        color: var(--light-text);\r\n        overflow-x: hidden;\r\n      }\r\n      \r\n      .logo {\r\n        position: fixed;\r\n        top: 20px;\r\n        left: 30px;\r\n        font-size: 1.5rem;\r\n        font-weight: 700;\r\n        z-index: 1000;\r\n        text-transform: uppercase;\r\n        letter-spacing: 2px;\r\n      }\r\n      \r\n      .nav-menu {\r\n        position: fixed;\r\n        top: 20px;\r\n        right: 30px;\r\n        display: flex;\r\n        gap: 20px;\r\n        z-index: 1000;\r\n      }\r\n      \r\n      .nav-menu button {\r\n        background: none;\r\n        border: none;\r\n        color: var(--light-text);\r\n        cursor: pointer;\r\n        padding: 10px 20px;\r\n        border-radius: 25px;\r\n        transition: all var(--transition-speed) ease;\r\n      }\r\n      \r\n      .nav-menu button:hover {\r\n        background-color: rgba(255, 255, 255, 0.1);\r\n        transform: translateY(-2px);\r\n      }\r\n      \r\n      .widget {\r\n        height: 100vh;\r\n        width: 100vw;\r\n        position: relative;\r\n        scroll-snap-align: start;\r\n      }\r\n      \r\n      .widget-image {\r\n        width: 100%;\r\n        height: 100%;\r\n        object-fit: cover;\r\n        position: relative;\r\n      }\r\n      \r\n      .overlay-button {\r\n        position: absolute;\r\n        bottom: 6%;\r\n        left: 50%;\r\n        transform: translateX(-50%);\r\n        padding: 15px 40px;\r\n        background-color: var(--accent-blue);\r\n        color: white;\r\n        border: none;\r\n        border-radius: 30px;\r\n        cursor: pointer;\r\n        font-size: 1.1rem;\r\n        transition: all var(--transition-speed) ease;\r\n      }\r\n      \r\n      .overlay-button:hover {\r\n        background-color: #1e50cc;\r\n        transform: translateX(-50%) scale(1.05);\r\n      }\r\n      \r\n      footer {\r\n        position: fixed;\r\n        bottom: 0;\r\n        width: 100%;\r\n        padding: 20px;\r\n        text-align: center;\r\n        background-color: rgba(0, 0, 0, 0.7);\r\n        backdrop-filter: blur(10px);\r\n      }\r\n      \r\n      footer p {\r\n        margin: 0;\r\n        font-size: 0.9rem;\r\n        color: rgba(255, 255, 255, 0.8);\r\n      }\r\n      \r\n      @media (max-width: 768px) {\r\n        .nav-menu {\r\n          flex-direction: column;\r\n          right: 10px;\r\n          top: 60px;\r\n        }\r\n        \r\n        .logo {\r\n          font-size: 1.2rem;\r\n        }\r\n      }\r\n      \r\n      /* Chatbox styles */\r\n      .chat-box {\r\n        position: fixed;\r\n        bottom: 20px;\r\n        right: 20px;\r\n        width: 320px;\r\n        height: 450px;\r\n        background-color: white;\r\n        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);\r\n        border-radius: 12px;\r\n        overflow: hidden;\r\n        display: flex;\r\n        flex-direction: column;\r\n        opacity: 0;\r\n        transform: translateY(20px);\r\n        animation: fadeIn 0.5s forwards;\r\n      }\r\n      \r\n      /* Smooth fade-in animation */\r\n      @keyframes fadeIn {\r\n        to {\r\n          opacity: 1;\r\n          transform: translateY(0);\r\n        }\r\n      }\r\n      \r\n      /* Messages container */\r\n      .chat-box .messages {\r\n        flex: 1;\r\n        padding: 15px;\r\n        overflow-y: auto;\r\n        scroll-behavior: smooth;\r\n        background-color: lightgrey;\r\n        color: green;\r\n      }\r\n      \r\n      /* Individual messages */\r\n      .chat-box .message {\r\n        padding: 10px;\r\n        margin-bottom: 10px;\r\n        background: green;\r\n        color: lightgrey;\r\n        border-radius: 8px;\r\n        max-width: 80%;\r\n        word-wrap: break-word;\r\n      }\r\n      \r\n      /* User messages (align right) */\r\n      .chat-box .message.user {\r\n        background: lightgrey;\r\n        color: green;\r\n        align-self: flex-end;\r\n      }\r\n      \r\n      /* Replies (align left, royal blue background) */\r\n      .chat-box .message.reply {\r\n        background: royalblue;\r\n        color: white;\r\n        align-self: flex-start;\r\n      }\r\n      \r\n      /* Input field */\r\n      .chat-box input {\r\n        width: calc(100% - 20px);\r\n        padding: 12px;\r\n        border-radius: 8px;\r\n        border: 1px solid green;\r\n        font-size: 14px;\r\n        outline: none;\r\n        box-sizing: border-box;\r\n        background: lightgrey;\r\n        color: royalblue; /* Text color changed to royal blue */\r\n      }\r\n      \r\n      /* Send button */\r\n      .chat-box button {\r\n        width: 100%;\r\n        padding: 12px;\r\n        background-color: green;\r\n        color: lightgrey;\r\n        border: none;\r\n        border-radius: 8px;\r\n        font-size: 16px;\r\n        cursor: pointer;\r\n        transition: background 0.3s ease;\r\n      }\r\n      \r\n      .chat-box button:hover {\r\n        background-color: white;\r\n        color: lightgrey;\r\n      }\r\n      \r\n      /* Contact Form */\r\n      .contact-form {\r\n        width: 90%;\r\n        max-width: 500px;\r\n        padding: 30px;\r\n        background: lightgrey;\r\n        border-radius: 12px;\r\n        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);\r\n        margin: 50px auto;\r\n        color: green;\r\n      }\r\n      \r\n      /* Form fields */\r\n      .contact-form input,\r\n      .contact-form textarea {\r\n        width: 100%;\r\n        padding: 12px;\r\n        border-radius: 8px;\r\n        border: 1px solid green;\r\n        font-size: 16px;\r\n        outline: none;\r\n        transition: 0.3s;\r\n        background: white;\r\n        color: royalblue; /* Text color changed to royal blue */\r\n      }\r\n      \r\n      .contact-form input:focus,\r\n      .contact-form textarea:focus {\r\n        border-color: green;\r\n      }\r\n      \r\n      /* Contact Form Button */\r\n      .contact-form button {\r\n        width: 100%;\r\n        padding: 12px;\r\n        background-color: green;\r\n        color: lightgrey;\r\n        border: none;\r\n        border-radius: 8px;\r\n        font-size: 18px;\r\n        cursor: pointer;\r\n        transition: 0.3s ease;\r\n      }\r\n      \r\n      .contact-form button:hover {\r\n        background-color: green;\r\n        color: white;\r\n      }\r\n      \r\n      /* Mobile Responsiveness */\r\n      @media (max-width: 768px) {\r\n        .chat-box {\r\n          width: 90%;\r\n          bottom: 10px;\r\n          right: 5%;\r\n        }\r\n        \r\n        .contact-form {\r\n          width: 95%;\r\n        }\r\n      }"],"sourceRoot":""}]);
// Exports
/* harmony default export */ __webpack_exports__.A = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 9349:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5072);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7825);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7659);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5056);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(540);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1113);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9051);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A, options);




       /* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A && _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A.locals ? _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A.locals : undefined);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [753,51,183,192,57], function() { return __webpack_exec__(7076); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);