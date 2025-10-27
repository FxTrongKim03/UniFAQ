const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  // Áp dụng cấu hình mặc định được khuyến nghị
  js.configs.recommended,

  // Cấu hình chung cho dự án
  {
    files: ["**/*.js"], // Chỉ áp dụng cho file .js
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        // Chỉ khai báo các biến global DO BẠN TỰ TẠO RA
        // Các biến của browser, node, jest đã được env xử lý
        ChatApp: "readonly",
        ChatHeader: "readonly",
        MessageList: "readonly",
        InputBar: "readonly",
        FAQRenderer: "readonly",
        useFaqData: "readonly",
        useFaqSearch: "readonly",
        openChat: "readonly", // Thêm các hàm global vào đây
        closeChat: "readonly",
        sendToChat: "readonly",
      },
    },
    // Khai báo môi trường để ESLint biết các biến global dựng sẵn
    env: {
        browser: true,
        es2021: true,
        node: true // Cần cho 'module' trong các file component/hook
    },
    rules: {
      // Rule này không cần nữa vì đã khai báo globals ở trên
      // "no-unused-vars": ["error", { "varsIgnorePattern": "^(openChat|closeChat|sendToChat)$" }],
      "no-undef": "error", // Vẫn giữ để bắt lỗi biến chưa khai báo
      "no-redeclare": "error" // Giữ rule này
      // Bạn có thể thêm rules khác nếu cần
    },
  },

  // Cấu hình riêng cho file test của Jest
  {
    files: ["**/*.test.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script", // File test cũng là script thường
      globals: {
        // Chỉ cần khai báo thêm globals của Jest ở đây
         ...globals.jest,
         // Khai báo thêm các lớp/biến bạn dùng trong test mà chưa import
         FAQRenderer: "readonly",
      },
    },
     // Khai báo môi trường Jest cho file test
    env: {
       jest: true,
       browser: true // Nếu file test có dùng DOM
    },
    rules: {
       "no-unused-vars": "warn" // Giảm mức độ lỗi unused vars trong test
       // Các rule khác nếu cần
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