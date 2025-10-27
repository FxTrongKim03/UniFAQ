const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  // Áp dụng cấu hình mặc định được khuyến nghị
  js.configs.recommended,

  // Cấu hình chung cho dự án
  {
    files: ["**/*.js"], // Áp dụng cho file .js
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser, // <--- Khai báo globals browser trực tiếp
        ...globals.node,    // <--- Khai báo globals node trực tiếp
        // Khai báo các biến global DO BẠN TỰ TẠO RA
        ChatApp: "readonly",
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
    // BỎ HOÀN TOÀN KHỐI "env" Ở ĐÂY
    rules: {
      "no-unused-vars": ["error", { "varsIgnorePattern": "^(openChat|closeChat|sendToChat)$" }], // Có thể cần lại rule này nếu globals không đủ
      "no-undef": "error",
      "no-redeclare": "error" // Giữ lại rule này
    },
  },

  // Cấu hình riêng cho file test của Jest
  {
    files: ["**/*.test.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.jest,     // <--- Khai báo globals jest trực tiếp
        ...globals.browser, // Thêm browser nếu test cần DOM
        FAQRenderer: "readonly",
      },
    },
    // BỎ HOÀN TOÀN KHỐI "env" Ở ĐÂY
    rules: {
       "no-unused-vars": "warn"
    }
  },

  // Các file/thư mục cần bỏ qua (áp dụng cho toàn bộ)
  {
    ignores: [
      "node_modules/",
      "coverage/",
      "server.js",
      ".github/"
    ],
  },
];