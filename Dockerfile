# Use official Node.js runtime
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Expose port (Cloud Run requirement)
EXPOSE 8080

# Start the app
CMD ["npm", "start"]