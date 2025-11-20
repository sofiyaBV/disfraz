# Use the official Node.js image as the base image
FROM node:22-alpine

# Install dependencies for building
RUN apk add --no-cache git libc6-compat bash

# Set the working directory inside the container
WORKDIR /app

# Copy package.json first (для кеширования слоев)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci || npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Copy entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Expose the port
EXPOSE 3000

# Start the application with migrations
ENTRYPOINT ["/app/docker-entrypoint.sh"]