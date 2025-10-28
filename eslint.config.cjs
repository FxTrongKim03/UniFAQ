const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  // 1. Global Ignores
  {
    ignores: [
      "node_modules/",
      "coverage/",
      ".github/",
      "backend/node_modules/"
    ],
  },

  // 2. Base Recommended Rules
  js.configs.recommended,

  // 3. Config cho Browser JS (Components, Hooks, Renderer, script.js)
  {
    files: [
        "components/**/*.js",
        "hooks/**/*.js",
        "faqRenderer.js",
        "script.js"
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
        ChatContainer: "writable",
        ChatPresenter: "writable",
        ChatHeader: "readonly",
        MessageList: "readonly",
        InputBar: "readonly",
        FAQRenderer: "readonly",
        useFaqData: "readonly",
        useFaqSearch: "readonly",
        openChat: "readonly",
        closeChat: "readonly",
        sendToChat: "readonly",
        // Thêm module/exports để xử lý các đoạn kiểm tra typeof
        module: "writable",
        exports: "writable"
      },
    },
    rules: {
      // Giảm xuống warning và giữ ignore pattern
      "no-unused-vars": ["warn", {
          "vars": "all",
          "args": "none",
          "ignoreRestSiblings": true,
          "varsIgnorePattern": "^(ChatContainer|ChatPresenter|ChatHeader|MessageList|InputBar|FAQRenderer|useFaqData|useFaqSearch|openChat|closeChat|sendToChat)$"
      }],
      "no-undef": "error",
      "no-redeclare": "off", // TẮT redeclare cho các file này
    },
  },

  // 4. Config cho Node.js server
  {
    files: ["server.js", "backend/server.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.node, // Chỉ cần globals của Node
      },
    },
    rules: {
       "no-unused-vars": "warn",
       "no-undef": "error",
       "no-redeclare": "error" // Giữ redeclare BẬT cho server
    }
  },

  // 5. Config cho Jest test
  {
    files: ["**/*.test.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.jest,
        ...globals.node, // Cần cho require, process,... trong test
        ...globals.browser, // Cần cho document,... trong test
        FAQRenderer: "readonly", // Khai báo global cần cho test
      },
    },
    rules: {
       "no-unused-vars": "warn",
       "no-undef": "error",
       "no-redeclare": "off", // TẮT redeclare cho file test
    }
  },
];