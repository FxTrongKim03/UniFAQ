const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  // Áp dụng cấu hình mặc định được khuyến nghị cho tất cả file JS
  js.configs.recommended,

  // 1. Cấu hình cho các file chạy trên Browser (Components, Hooks, Renderer, script.js)
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
        ...globals.browser, // CHỈ cần browser globals
        // Khai báo các biến global tùy chỉnh
        ChatApp: "writable",
        ChatHeader: "readonly",
        MessageList: "readonly",
        InputBar: "readonly",
        FAQRenderer: "readonly",
        useFaqData: "readonly",
        useFaqSearch: "readonly",
        openChat: "readonly",
        closeChat: "readonly",
        sendToChat: "readonly",
         // Thêm module/exports để ESLint không báo lỗi no-undef trong các file này
         // Mặc dù chúng chạy trên browser, code này chỉ để tương thích nếu dùng ở Node
         module: "writable",
         exports: "writable"
      },
    },
    rules: {
      "no-unused-vars": ["error", { "varsIgnorePattern": "^(openChat|closeChat|sendToChat|ChatApp|ChatHeader|MessageList|InputBar|FAQRenderer|useFaqData|useFaqSearch)$" }],
      "no-undef": "error",
      "no-redeclare": "off", // Tắt redeclare cho các file này
    },
  },

  // 2. Cấu hình riêng cho file server.js (Node.js)
  {
    files: ["server.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.node, // CHỈ cần node globals (bao gồm require, process, console, module,...)
      },
    },
    rules: {
       // Giữ rules mặc định từ recommended
       "no-undef": "error",
       "no-unused-vars": "warn",
    }
  },

  // 3. Cấu hình riêng cho file test của Jest
  {
    files: ["**/*.test.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.jest,     // Globals của Jest
        ...globals.node,    // Globals của Node (cho require, process, global)
        ...globals.browser, // Globals của Browser (cho document, fetch nếu cần)
        // KHÔNG cần khai báo FAQRenderer nữa vì require('...') sẽ xử lý
      },
    },
    rules: {
       // Giữ rules mặc định từ recommended
       "no-unused-vars": "warn",
       "no-undef": "error",
       // --- TẮT NO-REDECLARE CHO FILE TEST ---
       "no-redeclare": "off"
       // ------------------------------------
    }
  },

  // 4. Các file/thư mục cần bỏ qua (áp dụng cho toàn bộ)
  {
    ignores: [
      "node_modules/",
      "coverage/",
      ".github/"
    ],
  },
];