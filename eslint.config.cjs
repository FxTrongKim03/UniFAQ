const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  // 1. Global Ignores (apply first)
  {
    ignores: [
      "node_modules/",
      "coverage/",
      ".github/",
      "backend/node_modules/" // Ignore backend node_modules too
    ],
  },

  // 2. Base Recommended Rules (apply to all matched files after ignores)
  js.configs.recommended,

  // 3. Configuration for Browser JS files (Components, Hooks, Renderer, script.js)
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
        ...globals.browser, // Browser built-ins are primary
        // Declare custom global classes/objects explicitly
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
        // Add module/exports for the checks at the bottom of these files
        module: "writable",
        exports: "writable"
      },
    },
    rules: {
      // Allow specific unused vars (the globally defined classes/functions)
      "no-unused-vars": ["warn", { // Changed to warn
          "vars": "all",
          "args": "none",
          "ignoreRestSiblings": true,
          "varsIgnorePattern": "^(ChatContainer|ChatPresenter|ChatHeader|MessageList|InputBar|FAQRenderer|useFaqData|useFaqSearch|openChat|closeChat|sendToChat)$"
      }],
      "no-undef": "error",
      "no-redeclare": "off", // Turn off redeclare for these browser global classes
    },
  },

  // 4. Configuration for Node.js server file
  {
    files: ["server.js", "backend/server.js"], // Apply to server files
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script", // Or "commonjs"
      globals: {
        ...globals.node, // Node.js built-ins ONLY
      },
    },
    rules: {
       // Inherits recommended rules, add specifics if needed
       "no-unused-vars": "warn",
       "no-undef": "error",
       "no-redeclare": "error" // Keep redeclare ON for server
    }
  },

  // 5. Configuration for Jest test files
  {
    files: ["**/*.test.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.jest,     // Jest globals
        ...globals.node,    // Node globals (for require, process, etc.)
        ...globals.browser, // Browser globals (for document, etc. if needed)
        // Declare globals defined in OTHER files but used in tests
        FAQRenderer: "readonly",
      },
    },
    rules: {
       // Inherits recommended rules
       "no-unused-vars": "warn",
       "no-undef": "error",
       "no-redeclare": "off", // Turn OFF redeclare also for tests involving global classes
    }
  },
];