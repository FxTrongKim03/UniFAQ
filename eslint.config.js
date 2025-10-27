import js from "@eslint/js";
import globals from "globals"; // Gói để lấy các biến global chuẩn

export default [
  // Áp dụng cấu hình mặc định được khuyến nghị cho tất cả file JS
  js.configs.recommended,

  // Cấu hình chung cho dự án
  {
    files: ["**/*.js", "**/*.mjs"], // Áp dụng cho các file JS và MJS
    languageOptions: {
      ecmaVersion: "latest", // Dùng cú pháp JS mới nhất
      sourceType: "script", // Code là script thông thường (không phải module)
      globals: {
        ...globals.browser, // Thêm globals của trình duyệt (window, document, fetch...)
        // Khai báo các lớp/biến toàn cục của bạn
        ChatApp: "readonly",
        ChatHeader: "readonly",
        MessageList: "readonly",
        InputBar: "readonly",
        FAQRenderer: "readonly",
        useFaqData: "readonly",
        useFaqSearch: "readonly",
        // Khai báo các hàm global trong index.html
        openChat: "readonly",
        closeChat: "readonly",
        sendToChat: "readonly",
      },
    },
    rules: {
      // Bạn có thể tùy chỉnh rules ở đây
      "no-unused-vars": ["error", { "varsIgnorePattern": "^(openChat|closeChat|sendToChat)$" }],
      "no-undef": "error"
    },
  },

  // Cấu hình riêng cho file test của Jest
  {
    files: ["**/*.test.js"],
    languageOptions: {
      globals: {
        ...globals.jest, // Thêm globals của Jest (describe, test, expect...)
        // Thêm globals của trình duyệt nếu file test cần DOM
        ...globals.browser,
        // Khai báo các lớp cần test nếu chưa được import
         FAQRenderer: "readonly",
         //... thêm các lớp khác nếu cần
      },
    },
    rules: {
      // Có thể tắt một số rule không cần thiết cho test
       "no-unused-vars": "warn" // Giảm mức độ lỗi unused vars trong test
    }
  },

  // Các file/thư mục cần bỏ qua
  {
    ignores: [
      "node_modules/",
      "coverage/",
      "server.js",
      ".github/"
    ],
  },
];