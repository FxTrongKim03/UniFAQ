const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  // Áp dụng cấu hình mặc định được khuyến nghị
  js.configs.recommended,

  // 1. Cấu hình chung cho dự án (trừ server.js)
  {
    files: ["**/*.js"], // Áp dụng cho tất cả file JS ban đầu
    ignores: ["server.js", "node_modules/", "coverage/", ".github/"], // Bỏ qua server và các thư mục khác
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser, // Globals của trình duyệt là chính
        ...globals.jest,    // Thêm Jest globals (áp dụng cả file test)
        // Khai báo các biến global tùy chỉnh
        ChatContainer: "writable", // Cho phép định nghĩa/ghi đè
        ChatPresenter: "writable",
        ChatHeader: "writable", // Đặt hết là writable để tránh lỗi unused/redeclare phức tạp
        MessageList: "writable",
        InputBar: "writable",
        FAQRenderer: "writable",
        useFaqData: "readonly", // Hooks có thể là readonly
        useFaqSearch: "readonly",
        openChat: "readonly",
        closeChat: "readonly",
        sendToChat: "readonly",
        // Thêm Node globals cần thiết (chủ yếu cho test và module check)
        require: "readonly",
        process: "readonly",
        module: "writable",
        exports: "writable",
        global: "readonly", // Cho file test
      },
    },
    rules: {
      // --- TẮT CÁC RULE GÂY LỖI ---
      "no-redeclare": "off", // Tắt hoàn toàn lỗi định nghĩa lại biến global
      "no-undef": ["error", { "typeof": true }], // Vẫn bắt lỗi undef, nhưng cho phép typeof kiểm tra biến chưa khai báo
      // --- SỬA RULE UNUSED VARS ---
      "no-unused-vars": ["warn", { // Giảm xuống warning và cấu hình lại
          "vars": "all",
          "args": "none", // Không kiểm tra tham số không dùng
          "ignoreRestSiblings": true,
          // Bỏ varsIgnorePattern vì no-redeclare đã tắt
      }],
      // Có thể thêm các rules khác nếu muốn giữ lại
      "no-extra-semi": "warn",
    },
  },

  // 2. Cấu hình RIÊNG cho file server.js (Node.js)
  // Cấu hình này sẽ ghi đè globals/rules cho riêng file server.js
  {
    files: ["server.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script", // Hoặc "commonjs"
      globals: {
        ...globals.node, // CHỈ cần node globals
      },
    },
    rules: {
       // Giữ rules mặc định từ recommended cho file này
       "no-undef": "error",
       "no-unused-vars": "warn",
       "no-redeclare": "error" // Bật lại redeclare cho server
    }
  },

  // Không cần cấu hình riêng cho test nữa vì globals đã bao gồm jest/node/browser
];