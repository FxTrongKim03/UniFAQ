const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  // Áp dụng cấu hình mặc định được khuyến nghị
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
        ChatContainer: "writable", // Writable because it's defined in its file
        ChatPresenter: "writable", // Writable because it's defined in its file
        ChatHeader: "readonly",
        MessageList: "readonly",
        InputBar: "readonly",
        FAQRenderer: "readonly",
        useFaqData: "readonly",
        useFaqSearch: "readonly",
        openChat: "readonly",
        closeChat: "readonly",
        sendToChat: "readonly",
         // Thêm module/exports để ESLint không báo lỗi no-undef
         module: "writable",
         exports: "writable"
      },
    },
    rules: {
      // Cập nhật varsIgnorePattern để bao gồm cả hooks và các class
      "no-unused-vars": ["error", { "varsIgnorePattern": "^(openChat|closeChat|sendToChat|ChatApp|ChatHeader|MessageList|InputBar|FAQRenderer|useFaqData|useFaqSearch)$" }],
      "no-undef": "error",
      // --- TẮT NO-REDECLARE CHO CÁC FILE NÀY ---
      "no-redeclare": "off"
      // -----------------------------------------
    },
  },

  // 2. Cấu hình riêng cho file server.js (Node.js)
  {
    files: ["server.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script", // Hoặc "commonjs"
      globals: {
        ...globals.node, // CHỈ cần node globals (bao gồm require, process, console, module, exports)
      },
    },
    rules: {
       // Giữ rules mặc định từ recommended
       "no-undef": "error",
       "no-unused-vars": "warn",
       // Không cần tắt no-redeclare ở đây
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
        ...globals.node,    // Globals của Node (require, process, global, module, exports)
        ...globals.browser, // Globals của Browser (document, fetch nếu cần)
        // KHÔNG cần khai báo FAQRenderer nữa vì require xử lý
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
      ".github/",
      "backend/"
      // Không cần liệt kê server.js và test.js ở đây vì đã có config riêng
    ],
  },
];