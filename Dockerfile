# Simple Node.js Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5173

# Start the development server with host binding
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]