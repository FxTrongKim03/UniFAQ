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

  // 3. Config for Browser JS (Components, Hooks, Renderer, script.js)
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
        // Declare custom globals
        ChatContainer: "writable",
        ChatPresenter: "writable",
        ChatHeader: "readonly", // Keep these readonly if defined elsewhere
        MessageList: "readonly",
        InputBar: "readonly",
        FAQRenderer: "readonly",
        useFaqData: "readonly",
        useFaqSearch: "readonly",
        openChat: "readonly",
        closeChat: "readonly",
        sendToChat: "readonly",
        // Add module/exports for the compatibility checks
        module: "writable",
        exports: "writable"
      },
    },
    rules: {
      // Allow specific unused vars (globally defined classes/functions) - keep as WARN
      "no-unused-vars": ["warn", {
          "vars": "all",
          "args": "none", // Don't check unused arguments
          "ignoreRestSiblings": true,
          "varsIgnorePattern": "^(ChatContainer|ChatPresenter|ChatHeader|MessageList|InputBar|FAQRenderer|useFaqData|useFaqSearch|openChat|closeChat|sendToChat)$"
      }],
      "no-undef": "error", // Keep checking for undefined variables
      "no-redeclare": "off", // TURN OFF redeclare for these files
    },
  },

  // 4. Config for Node.js server file
  {
    files: ["server.js", "backend/server.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.node, // Node.js built-ins ONLY
      },
    },
    rules: {
       "no-unused-vars": "warn",
       "no-undef": "error",
       "no-redeclare": "error" // Keep redeclare ON for server
    }
  },

  // 5. Config for Jest test files
  {
    files: ["**/*.test.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.jest,     // Jest globals
        ...globals.node,    // Node globals (require, process, global)
        ...globals.browser, // Browser globals (document, fetch etc.)
        // Declare globals defined elsewhere but needed for tests
        FAQRenderer: "readonly",
      },
    },
    rules: {
       "no-unused-vars": "warn",
       "no-undef": "error",
       "no-redeclare": "off", // TURN OFF redeclare for test files too
    }
  },
];