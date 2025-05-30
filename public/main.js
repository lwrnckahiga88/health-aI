(self["webpackChunkhealth_ai"] = self["webpackChunkhealth_ai"] || []).push([[792],{

/***/ 143:
/***/ (function() {

/* (ignored) */

/***/ }),

/***/ 579:
/***/ (function() {



/***/ }),

/***/ 2009:
/***/ (function() {

/* (ignored) */

/***/ }),

/***/ 2499:
/***/ (function() {

/* (ignored) */

/***/ }),

/***/ 2603:
/***/ (function() {

/* (ignored) */

/***/ }),

/***/ 3052:
/***/ (function() {

/* (ignored) */

/***/ }),

/***/ 5173:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: function() { return /* binding */ src_App; }
});

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(5602);
// EXTERNAL MODULE: ./src/styles.css
var styles = __webpack_require__(9349);
// EXTERNAL MODULE: ./node_modules/react/jsx-dev-runtime.js
var jsx_dev_runtime = __webpack_require__(1148);
;// ./src/components/Header.js
var _jsxFileName = "C:\\Users\\KAHIGA\\juA.kalI\\my-webpack-project\\health-ai\\src\\components\\Header.js";



const Header = () => {
  return /*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)("header", {
    className: "header",
    children: [/*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)("h1", {
      children: "HomeHealth AI Chat"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 8,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)("nav", {
      children: /*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)("ul", {
        className: "nav-list",
        children: [/*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)("li", {
          children: /*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)("a", {
            href: "/",
            "aria-label": "Go to Home Page",
            children: "Home"
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 11,
            columnNumber: 15
          }, undefined)
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 11,
          columnNumber: 11
        }, undefined), /*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)("li", {
          children: /*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)("a", {
            href: "/about",
            "aria-label": "Learn more About Us",
            children: "About"
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 12,
            columnNumber: 15
          }, undefined)
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 12,
          columnNumber: 11
        }, undefined), /*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)("li", {
          children: /*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)("a", {
            href: "/contact",
            "aria-label": "Contact Us",
            children: "Contact"
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 13,
            columnNumber: 15
          }, undefined)
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 13,
          columnNumber: 11
        }, undefined)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 10,
        columnNumber: 9
      }, undefined)
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 9,
      columnNumber: 7
    }, undefined)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 7,
    columnNumber: 5
  }, undefined);
};
_c = Header;
/* harmony default export */ var components_Header = (Header); // ✅ Properly placed
var _c;
$RefreshReg$(_c, "Header");
// EXTERNAL MODULE: ./node_modules/onnxruntime-web/dist/ort.bundle.min.mjs
var ort_bundle_min = __webpack_require__(8189);
// EXTERNAL MODULE: ./node_modules/@xenova/transformers/src/transformers.js + 15 modules
var transformers = __webpack_require__(3610);
// EXTERNAL MODULE: ./node_modules/axios/lib/axios.js + 48 modules
var axios = __webpack_require__(7178);
// EXTERNAL MODULE: ./src/components/ErrorBoundary.js
var ErrorBoundary = __webpack_require__(579);
var ErrorBoundary_default = /*#__PURE__*/__webpack_require__.n(ErrorBoundary);
// EXTERNAL MODULE: ./node_modules/buffer/index.js
var buffer = __webpack_require__(1545);
;// ./src/components/Chat.js
var Chat_jsxFileName = "C:\\Users\\KAHIGA\\juA.kalI\\my-webpack-project\\health-ai\\src\\components\\Chat.js",
  _s = $RefreshSig$();







// Polyfill for buffer


window.Buffer = buffer/* Buffer */.hp;
const Chat = () => {
  _s();
  const [session, setSession] = (0,react.useState)(null);
  const [tokenizer, setTokenizer] = (0,react.useState)(null);
  const [messages, setMessages] = (0,react.useState)([]);
  const [input, setInput] = (0,react.useState)('');
  const [loading, setLoading] = (0,react.useState)(false);
  const [modelStatus, setModelStatus] = (0,react.useState)('loading');

  // Load model from public folder
  const ONNX_MODEL_PATH = {"NODE_ENV":"development","PUBLIC_URL":"/"}.PUBLIC_URL + '/models/gpt2-large.onnx';
  (0,react.useEffect)(() => {
    const loadModel = async () => {
      try {
        const [model, tokenizer] = await Promise.all([ort_bundle_min/* InferenceSession */.wV.create(ONNX_MODEL_PATH), transformers/* AutoTokenizer */.v6I.from_pretrained('gpt2')]);
        setSession(model);
        setTokenizer(tokenizer);
        setModelStatus('onnx-ready');
      } catch (error) {
        console.error('Model loading failed:', error);
        setModelStatus('api-fallback');
      }
    };
    loadModel();
  }, []);
  const handleSubmit = async e => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    setLoading(true);
    const newMessages = [...messages, {
      sender: 'User',
      text: input
    }];
    setMessages(newMessages);
    setInput('');
    try {
      let response;
      if (modelStatus === 'onnx-ready') {
        const inputs = tokenizer.encode(input, {
          padding: true,
          truncation: true
        });
        const tensor = new ort_bundle_min/* Tensor */.qY('int64', new BigInt64Array(inputs), [1, inputs.length]);
        const results = await session.run({
          input_ids: tensor
        });
        response = tokenizer.decode(results.output.data);
      } else {
        const res = await axios/* default */.A.post('https://api.deepseek.com/v1/chat', {
          messages: [{
            role: 'user',
            content: input
          }]
        }, {
          headers: {
            Authorization: `Bearer ${{"NODE_ENV":"development","PUBLIC_URL":"/"}.REACT_APP_DEEPSEEK_KEY}`
          }
        });
        response = res.data.choices[0].message.content;
      }
      setMessages(prev => [...prev, {
        sender: 'AI',
        text: response
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        sender: 'System',
        text: 'Error processing request. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };
  return /*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)("div", {
    className: "chat-container",
    children: [/*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)("div", {
      className: "chat-messages",
      children: messages.map((msg, i) => /*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)("div", {
        className: `message ${msg.sender.toLowerCase()}`,
        children: [/*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)("strong", {
          children: [msg.sender, ":"]
        }, void 0, true, {
          fileName: Chat_jsxFileName,
          lineNumber: 84,
          columnNumber: 13
        }, undefined), /*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)("p", {
          children: msg.text
        }, void 0, false, {
          fileName: Chat_jsxFileName,
          lineNumber: 85,
          columnNumber: 13
        }, undefined)]
      }, i, true, {
        fileName: Chat_jsxFileName,
        lineNumber: 83,
        columnNumber: 11
      }, undefined))
    }, void 0, false, {
      fileName: Chat_jsxFileName,
      lineNumber: 81,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)("form", {
      onSubmit: handleSubmit,
      className: "chat-input",
      children: [/*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)("input", {
        type: "text",
        value: input,
        onChange: e => setInput(e.target.value),
        placeholder: "Type your message...",
        disabled: loading
      }, void 0, false, {
        fileName: Chat_jsxFileName,
        lineNumber: 91,
        columnNumber: 9
      }, undefined), /*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)("button", {
        type: "submit",
        disabled: loading,
        children: loading ? 'Processing...' : 'Send'
      }, void 0, false, {
        fileName: Chat_jsxFileName,
        lineNumber: 98,
        columnNumber: 9
      }, undefined)]
    }, void 0, true, {
      fileName: Chat_jsxFileName,
      lineNumber: 90,
      columnNumber: 7
    }, undefined)]
  }, void 0, true, {
    fileName: Chat_jsxFileName,
    lineNumber: 80,
    columnNumber: 5
  }, undefined);
};

// Error Boundary Wrapper
_s(Chat, "EQtsBq9QV0xtlWR89Nh7ZlFY1xU=");
Chat_c = Chat;
function ChatWrapper() {
  return /*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)((ErrorBoundary_default()), {
    fallback: /*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)("div", {
      className: "error",
      children: "Chat unavailable"
    }, void 0, false, {
      fileName: Chat_jsxFileName,
      lineNumber: 109,
      columnNumber: 30
    }, this),
    children: /*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)(Chat, {}, void 0, false, {
      fileName: Chat_jsxFileName,
      lineNumber: 110,
      columnNumber: 7
    }, this)
  }, void 0, false, {
    fileName: Chat_jsxFileName,
    lineNumber: 109,
    columnNumber: 5
  }, this);
}
_c2 = ChatWrapper;
var Chat_c, _c2;
$RefreshReg$(Chat_c, "Chat");
$RefreshReg$(_c2, "ChatWrapper");
;// ./src/App.js
var App_jsxFileName = "C:\\Users\\KAHIGA\\juA.kalI\\my-webpack-project\\health-ai\\src\\App.js";





const App = () => {
  return /*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)("div", {
    className: "app-container",
    children: [/*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)(components_Header, {}, void 0, false, {
      fileName: App_jsxFileName,
      lineNumber: 9,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,jsx_dev_runtime.jsxDEV)(ChatWrapper, {}, void 0, false, {
      fileName: App_jsxFileName,
      lineNumber: 10,
      columnNumber: 7
    }, undefined)]
  }, void 0, true, {
    fileName: App_jsxFileName,
    lineNumber: 8,
    columnNumber: 5
  }, undefined);
};
App_c = App;
/* harmony default export */ var src_App = (App); // ✅ Clean export
var App_c;
$RefreshReg$(App_c, "App");

/***/ }),

/***/ 6837:
/***/ (function() {

/* (ignored) */

/***/ }),

/***/ 6954:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var core_js_modules_es_regexp_flags_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3797);
/* harmony import */ var core_js_modules_es_regexp_flags_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_flags_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_web_immediate_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4978);
/* harmony import */ var core_js_modules_web_immediate_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_immediate_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5602);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(188);
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5173);
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9349);
/* harmony import */ var buffer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1545);
/* harmony import */ var process__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(348);
/* harmony import */ var process__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(process__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(1148);
var _jsxFileName = "C:\\Users\\KAHIGA\\juA.kalI\\my-webpack-project\\health-ai\\src\\index.js"; // src/index.js



 // Updated for React 18+

 // Ensure this file exists in src/




// Polyfill for browser environment

window.Buffer = buffer__WEBPACK_IMPORTED_MODULE_6__/* .Buffer */ .hp;
window.process = (process__WEBPACK_IMPORTED_MODULE_7___default());

// Initialize React root
const rootElement = document.getElementById('root');
const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_3__.createRoot)(rootElement);

// Render main app
root.render(/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxDEV)(react__WEBPACK_IMPORTED_MODULE_2__.StrictMode, {
  children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxDEV)(_App__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A, {}, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 23,
    columnNumber: 5
  }, undefined)
}, void 0, false, {
  fileName: _jsxFileName,
  lineNumber: 22,
  columnNumber: 3
}, undefined));

// Webpack Hot Module Replacement API
if (true) {
  true.accept('./App', () => {
    const NextApp = (__webpack_require__(5173)/* ["default"] */ .A);
    root.render(/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxDEV)(react__WEBPACK_IMPORTED_MODULE_2__.StrictMode, {
      children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxDEV)(NextApp, {}, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 33,
        columnNumber: 9
      }, undefined)
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 32,
      columnNumber: 7
    }, undefined));
  });
}

/***/ }),

/***/ 7376:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(4537);

/***/ }),

/***/ 7806:
/***/ (function() {

/* (ignored) */

/***/ }),

/***/ 9051:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

"use strict";
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
/******/ __webpack_require__.O(0, [753,51,183,192,277,594,418,837,497,57], function() { return __webpack_exec__(6954); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);