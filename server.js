const http = require('http');
const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');

// Port server sẽ chạy bên trong container
const PORT = process.env.PORT || 3000;

// Cấu hình để phục vụ file tĩnh từ thư mục gốc '.'
const serve = serveStatic('.', { index: ['index.html'] });

// Tạo server
const server = http.createServer((req, res) => {
  // Xử lý endpoint /health
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK\n');
    console.log(`Health check request received - Status: 200`); // Log health check
    return;
  }

  // Phục vụ các file khác
  console.log(`Serving request: ${req.method} ${req.url}`); // Log requests thông thường
  serve(req, res, (err) => {
      if (err) {
          console.error(`Error serving ${req.url}: ${err.message}`);
      }
      finalhandler(req, res)(err); // Xử lý lỗi hoặc kết thúc request
  });
});

// Chạy server
server.listen(PORT, () => {
  console.log(`UniFAQ server running on http://localhost:${PORT}`);
});