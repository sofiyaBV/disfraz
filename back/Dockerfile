# Use the official Node.js image as the base image
FROM node:22-alpine
RUN apk add --no-cache git libc6-compat

RUN npm install -g npm@latest
RUN npm install -g typescript

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock files to the working directory
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

RUN npm run migration:run

# Build the NestJS application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
