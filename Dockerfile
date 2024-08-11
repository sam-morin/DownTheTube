# Use an official Node.js image as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Build the Vite app
RUN npm run build

# Use an official Nginx image to serve the built app
FROM nginx:stable-alpine

# Copy the build output to Nginx's web directory
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose port 5173 to the outside world
EXPOSE 5173
# Change this to the port that you want to use externally, if you need to change it. 5173 will work.

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
