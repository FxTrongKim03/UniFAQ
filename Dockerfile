# Sử dụng image Node.js LTS Alpine (nhẹ)
FROM node:lts-alpine

# Đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json trước
COPY package*.json ./

# Cài đặt chỉ dependencies cần cho production
RUN npm install --only=production

# Sao chép phần còn lại của code ứng dụng
COPY . .

# Mở cổng 3000 mà server Node.js đang chạy
EXPOSE 3000

# Lệnh mặc định để chạy server
CMD ["npm", "start"]