# Use the official Node.js 16 image from Docker Hub
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code into the container
COPY . .

# Expose the port the app will run on (e.g., 3000)
EXPOSE 5000

# Command to start the app
CMD ["npm", "start"]
