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


ARG VITE_JSON_SERVER_URL=http://localhost:3000
ENV VITE_JSON_SERVER_URL=$VITE_JSON_SERVER_URL

# Build with environment variable
RUN npm run build

# Expose the port the app runs on
EXPOSE 4173

# Start the application
CMD ["npm", "run", "serve"]