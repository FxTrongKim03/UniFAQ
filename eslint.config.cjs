const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  // Áp dụng cấu hình mặc định được khuyến nghị
  js.configs.recommended,

  // Cấu hình chung cho dự án (trừ file test)
  {
    files: ["**/*.js"],
    ignores: ["**/*.test.js", "server.js", "node_modules/", "coverage/", ".github/"], // Ignore test, server, etc.
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser, // Globals của trình duyệt
        // KHÔNG khai báo node globals ở đây nữa
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
      },
    },
    rules: {
      "no-unused-vars": ["error", { "varsIgnorePattern": "^(openChat|closeChat|sendToChat|ChatApp|ChatHeader|MessageList|InputBar|FAQRenderer)$" }], // Thêm các class vào ignore pattern
      "no-undef": "error",
      // --- TẮT NO-REDECLARE CHO CÁC FILE NÀY ---
      "no-redeclare": "off"
      // -----------------------------------------
    },
  },

  // Cấu hình riêng cho file test của Jest
  {
    files: ["**/*.test.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.jest,     // Globals của Jest
        ...globals.browser, // Thêm browser nếu test cần DOM
        ...globals.node,    // <--- Thêm Node globals cho file test
        // Khai báo lại các biến global cần thiết cho test
        FAQRenderer: "readonly",
         // Thêm các biến khác nếu test cần, ví dụ:
        // document: "readonly", // Đã có trong globals.browser
        // fetch: "readonly" // Đã có trong globals.browser
      },
    },
    rules: {
       "no-unused-vars": "warn",
       "no-undef": "error",
        // Giữ no-redeclare cho file test (hoặc tắt nếu cần "off")
       "no-redeclare": "error"
    }
  },

  // Config ignore tổng thể (có thể không cần nếu đã ignore trong từng khối)
  // {
  //   ignores: [
  //     "node_modules/",
  //     "coverage/",
  //     "server.js",
  //     ".github/"
  //   ],
  // },
];