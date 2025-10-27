const js = require("@eslint/js"); // Sử dụng require
const globals = require("globals"); // Sử dụng require

module.exports = [ // Sử dụng module.exports
  // Áp dụng cấu hình mặc định được khuyến nghị
  js.configs.recommended,

  // Cấu hình chung
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"], // Áp dụng cho các file JS
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script", // Code là script thông thường
      globals: {
        ...globals.browser, // Globals của trình duyệt
        ...globals.node,    // Globals của Node (để nhận biết 'module', 'require')
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
      "no-unused-vars": ["error", { "varsIgnorePattern": "^(openChat|closeChat|sendToChat)$" }],
      "no-undef": "error",
      // Bạn có thể thêm rules khác nếu cần
    },
  },

  // Cấu hình riêng cho file test
  {
    files: ["**/*.test.js"],
    languageOptions: {
      globals: {
        ...globals.jest,     // Globals của Jest
        ...globals.browser, // Thêm browser nếu test cần DOM
        FAQRenderer: "readonly", // Khai báo lớp cần test
      },
    },
    rules: {
       "no-unused-vars": "warn", // Giảm mức độ lỗi unused vars trong test
    }
  },

  // Các file/thư mục cần bỏ qua
  {
    ignores: [
      "node_modules/",
      "coverage/",
      "server.js",
      ".github/"
      // Không cần ignore *.test.js nữa vì đã có cấu hình riêng ở trên
    ],
  },
];