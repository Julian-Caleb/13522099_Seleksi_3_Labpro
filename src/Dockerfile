# Use the official Node.js image
FROM node:18

# Create and set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build
RUN npx prisma migrate deploy

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:prod"]
