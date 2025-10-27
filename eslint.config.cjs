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
        ...globals.browser, // Globals của trình duyệt
        ...globals.node,    // Globals của Node (cho 'module', 'require')
        // --- KHÔNG KHAI BÁO ChatApp, ChatHeader,... Ở ĐÂY NỮA ---
      },
    },
    rules: {
      // Rule này vẫn cần thiết cho các hàm gọi từ HTML
      "no-unused-vars": ["error", { "varsIgnorePattern": "^(openChat|closeChat|sendToChat)$" }],
      "no-undef": "error",
      "no-redeclare": "error" // Vẫn giữ rule này trước
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
         // --- KHÔNG KHAI BÁO FAQRenderer Ở ĐÂY NỮA (trừ khi nó chỉ tồn tại toàn cục trong test) ---
         // Nếu FAQRenderer được require/import trong file test thì không cần khai báo ở đây.
         // Nếu nó được load qua <script> thì mới cần, nhưng có thể bị redeclare.
      },
    },
    rules: {
       "no-unused-vars": "warn",
       "no-undef": "error",
       "no-redeclare": "error" // Vẫn giữ rule này trước
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