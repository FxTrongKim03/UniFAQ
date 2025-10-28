const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  // Apply recommended ESLint rules globally first
  js.configs.recommended,

  // 1. Config for Browser-based JS files (Components, Hooks, Renderer, script.js)
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
        ...globals.browser, // Browser built-ins (window, document, fetch...)
        // Declare custom global classes/objects
        ChatContainer: "writable", // Writable because it's defined in its file
        ChatPresenter: "writable", // Writable because it's defined in its file
        ChatHeader: "readonly",    // Readonly because defined elsewhere, used here
        MessageList: "readonly",
        InputBar: "readonly",
        FAQRenderer: "readonly",
        useFaqData: "readonly",
        useFaqSearch: "readonly",
        // Declare global functions from index.html if needed by these files
        openChat: "readonly",
        closeChat: "readonly",
        sendToChat: "readonly",
        // Add 'module' and 'exports' only if absolutely necessary for compatibility checks
        // Typically not needed for browser-only code unless doing specific checks
        // module: "writable",
        // exports: "writable"
      },
    },
    rules: {
      // Allow defined but unused vars IF they match our global patterns
      "no-unused-vars": ["error", {
          "vars": "all",
          "args": "after-used", // Allow unused function arguments unless they are the last one
          "ignoreRestSiblings": true,
          // Ignore these specific global variables if they are defined but not used within the SAME file
          "varsIgnorePattern": "^(ChatContainer|ChatPresenter|ChatHeader|MessageList|InputBar|FAQRenderer|useFaqData|useFaqSearch|openChat|closeChat|sendToChat)$"
      }],
      "no-undef": "error",     // Catch genuinely undefined variables
      "no-redeclare": "error", // Keep this ON, but globals config should prevent false positives now
    },
  },

  // 2. Config for Node.js server file
  {
    files: ["server.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script", // Or "commonjs"
      globals: {
        ...globals.node, // Node.js built-ins (require, process, console, module, exports...)
      },
    },
    rules: {
       "no-unused-vars": "warn", // Be less strict about unused vars in server code (like logs)
       "no-undef": "error",
    }
  },

  // 3. Config for Jest test files
  {
    files: ["**/*.test.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.jest,     // Jest globals (describe, test, expect...)
        ...globals.node,    // Node globals often needed in tests (require, process...)
        ...globals.browser, // Browser globals if testing DOM manipulation (document...)
        // Declare any custom globals needed specifically for tests
        FAQRenderer: "readonly", // If FAQRenderer is loaded globally for testing
      },
    },
    rules: {
       "no-unused-vars": "warn", // Be less strict in tests
       "no-undef": "error",
       "no-redeclare": "error" // Keep ON unless tests specifically require redeclaring globals
    }
  },

  // 4. Global ignores
  {
    ignores: [
      "node_modules/",
      "coverage/",
      ".github/",
      "backend/"
    ],
  },
];