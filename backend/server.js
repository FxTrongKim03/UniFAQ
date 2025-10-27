const express = require('express');
const cors = require('cors');
const fs = require('fs'); // Để đọc file JSON
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Để tạo ID

const app = express();
const PORT = process.env.BACKEND_PORT || 3001; // Dùng cổng khác frontend (ví dụ 3001)
const DB_PATH = path.join(__dirname, 'faqs.json');

// Middleware
app.use(cors()); // Cho phép request từ mọi nguồn gốc (điều chỉnh sau nếu cần)
app.use(express.json()); // Middleware để parse JSON request body

// --- In-memory Database (đọc từ file khi khởi động) ---
let faqs = [];

function loadDB() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    faqs = JSON.parse(data);
    console.log(`✅ Loaded ${faqs.length} FAQs from ${DB_PATH}`);
  } catch (err) {
    console.error(`❌ Error loading database file: ${err.message}`);
    // Khởi tạo mảng rỗng nếu file không tồn tại hoặc lỗi
    faqs = [];
  }
}

// Hàm lưu lại DB (đơn giản, ghi đè toàn bộ file)
// Lưu ý: Cách này không tối ưu cho nhiều request cùng lúc
function saveDB() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(faqs, null, 2), 'utf8'); // Ghi lại file với định dạng đẹp (null, 2)
    console.log(`💾 Saved ${faqs.length} FAQs to ${DB_PATH}`);
  } catch (err) {
    console.error(`❌ Error saving database file: ${err.message}`);
  }
}

// --- API Endpoints ---

// GET /api/faqs - Lấy tất cả FAQs
app.get('/api/faqs', (req, res) => {
  res.status(200).json(faqs);
});

// GET /api/faqs/:id - Lấy một FAQ theo ID
app.get('/api/faqs/:id', (req, res) => {
  const faq = faqs.find(f => f.id === req.params.id);
  if (faq) {
    res.status(200).json(faq);
  } else {
    res.status(404).json({ message: 'FAQ not found' });
  }
});

// POST /api/faqs - Tạo một FAQ mới
app.post('/api/faqs', (req, res) => {
  const { question, answer, category } = req.body;

  // Validation cơ bản
  if (!question || !answer || !category) {
    return res.status(400).json({ message: 'Missing required fields: question, answer, category' });
  }

  const newFaq = {
    id: uuidv4(), // Tạo ID mới
    question,
    answer,
    category,
    votes: req.body.votes || 0 // Mặc định votes là 0 nếu không có
  };

  faqs.push(newFaq);
  saveDB(); // Lưu lại file sau khi thêm
  res.status(201).json(newFaq); // Trả về 201 Created và FAQ mới
});

// PUT /api/faqs/:id - Cập nhật một FAQ
app.put('/api/faqs/:id', (req, res) => {
  const faqIndex = faqs.findIndex(f => f.id === req.params.id);

  if (faqIndex === -1) {
    return res.status(404).json({ message: 'FAQ not found' });
  }

  const { question, answer, category, votes } = req.body;

  // Validation cơ bản
  if (!question || !answer || !category) {
    return res.status(400).json({ message: 'Missing required fields: question, answer, category' });
  }

  // Cập nhật FAQ
  faqs[faqIndex] = {
    ...faqs[faqIndex], // Giữ lại ID cũ và các trường không đổi
    question,
    answer,
    category,
    votes: votes !== undefined ? votes : faqs[faqIndex].votes // Chỉ cập nhật votes nếu có trong request
  };

  saveDB(); // Lưu lại file
  res.status(200).json(faqs[faqIndex]); // Trả về FAQ đã cập nhật
});

// DELETE /api/faqs/:id - Xóa một FAQ
app.delete('/api/faqs/:id', (req, res) => {
  const faqIndex = faqs.findIndex(f => f.id === req.params.id);

  if (faqIndex === -1) {
    return res.status(404).json({ message: 'FAQ not found' });
  }

  // Xóa FAQ khỏi mảng
  faqs.splice(faqIndex, 1);

  saveDB(); // Lưu lại file
  res.status(204).send(); // Trả về 204 No Content
});

// --- Khởi động Server ---
loadDB(); // Đọc dữ liệu từ file khi bắt đầu
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});