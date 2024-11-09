# Sử dụng hình ảnh Nginx chính thức từ Docker Hub
FROM nginx:alpine

# Sao chép tệp cấu hình Nginx vào container
COPY nginx.conf /etc/nginx/nginx.conf

# Mở cổng 80 để phục vụ các yêu cầu HTTP
EXPOSE 80

# Khởi động Nginx trong chế độ nền
CMD ["nginx", "-g", "daemon off;"]
