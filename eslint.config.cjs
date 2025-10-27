const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  // Áp dụng cấu hình mặc định được khuyến nghị
  js.configs.recommended,

  // Cấu hình chung cho dự án (trừ file test)
  {
    files: ["**/*.js"], // Áp dụng cho file .js
    ignores: ["**/*.test.js"], // Loại trừ file test khỏi cấu hình này
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser, // Globals của trình duyệt
        ...globals.node,    // Globals của Node (cho 'module', 'require')
        // --- KHAI BÁO LẠI CÁC BIẾN GLOBAL TÙY CHỈNH ---
        ChatApp: "writable",     // Cho phép định nghĩa class ChatApp
        ChatHeader: "readonly",  // Các class khác được đọc
        MessageList: "readonly",
        InputBar: "readonly",
        FAQRenderer: "readonly",
        useFaqData: "readonly",
        useFaqSearch: "readonly",
        openChat: "readonly",
        closeChat: "readonly",
        sendToChat: "readonly",
        // ---------------------------------------------
      },
    },
    rules: {
      // Rule này để xử lý việc ChatApp được định nghĩa nhưng có thể chưa dùng ngay
       "no-unused-vars": ["error", {
           "vars": "all",
           "args": "after-used",
           "ignoreRestSiblings": false,
           // Cho phép khai báo ChatApp dù nó có thể được khởi tạo ở file khác (index.html)
           "varsIgnorePattern": "^(ChatApp|openChat|closeChat|sendToChat)$"
       }],
      "no-undef": "error",
      "no-redeclare": "error" // Vẫn giữ rule này
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
        // Khai báo global cần thiết cho test (nếu không require/import)
        FAQRenderer: "readonly",
        // Thêm các biến global khác nếu file test cần
      },
    },
    rules: {
       "no-unused-vars": "warn", // Giảm mức độ lỗi unused vars trong test
       "no-undef": "error",
       "no-redeclare": "error" // Có thể cần tắt nếu có lỗi redeclare trong test
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