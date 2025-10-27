const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  // 1. Cấu hình chung và cho các file chạy trên Browser (Components, Hooks, Renderer)
  {
    files: [
        "components/**/*.js",
        "hooks/**/*.js",
        "faqRenderer.js",
        "script.js" // Thêm script.js nếu có
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
      },
    },
    rules: {
      ...js.configs.recommended.rules, // Áp dụng rules cơ bản
      "no-unused-vars": ["error", { "varsIgnorePattern": "^(openChat|closeChat|sendToChat|ChatApp|ChatHeader|MessageList|InputBar|FAQRenderer)$" }],
      "no-undef": "error",
      "no-redeclare": "off", // Tắt redeclare cho các file này
      "no-undef-init": "warn", // Cảnh báo thay vì lỗi cho biến khởi tạo undefined
      "no-extra-semi": "warn", // Cảnh báo thay vì lỗi cho dấu ; thừa
    },
  },

  // 2. Cấu hình riêng cho file server.js (Node.js)
  {
    files: ["server.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script", // Hoặc "commonjs" nếu bạn dùng module.exports nhiều
      globals: {
        ...globals.node, // CHỈ cần node globals
      },
    },
    rules: {
       ...js.configs.recommended.rules, // Áp dụng rules cơ bản
       "no-undef": "error",
       "no-unused-vars": "warn", // Giảm lỗi unused cho server log
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
        ...globals.node,    // Globals của Node (cho require, process,...)
        ...globals.browser, // Globals của Browser (cho document,...)
        // Khai báo lại global cần cho test nếu nó không được require
        FAQRenderer: "readonly",
      },
    },
    rules: {
       ...js.configs.recommended.rules, // Áp dụng rules cơ bản
       "no-unused-vars": "warn",
       "no-undef": "error",
       "no-redeclare": "error" // Giữ hoặc tắt ("off") nếu vẫn lỗi redeclare trong test
    }
  },

  // 4. Các file/thư mục cần bỏ qua (áp dụng cho toàn bộ)
  {
    ignores: [
      "node_modules/",
      "coverage/",
      ".github/"
      // Không cần liệt kê server.js và test.js ở đây vì đã có config riêng
    ],
  },
];