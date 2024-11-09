# Step 1: Build the React app
FROM node:16-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install  --legacy-peer-deps

# Copy the rest of the project files
COPY . .

# Build the project for production
RUN npm run build

# Step 2: Serve the React app with a lightweight HTTP server
FROM nginx:alpine


# Copy the build output to Nginx's web root
COPY --from=build /app/build /usr/share/nginx/html

# copy nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to serve the app
EXPOSE 80

# Start Nginx to serve the React app
CMD ["nginx", "-g", "daemon off;"]
