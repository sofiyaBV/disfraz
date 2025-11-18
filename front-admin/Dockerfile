# Use the official Node.js image as the base image
FROM node:22-alpine
RUN apk add --no-cache git libc6-compat

RUN npm install -g npm@latest
RUN npm install -g typescript

# Set the working directory inside the container
WORKDIR /app

# Copy package.json first
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 4173

# Start the application
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]