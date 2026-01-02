FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source
COPY . .

# Expose port for ECS / local testing
EXPOSE 5000

# Start the application
CMD ["npm", "run", "start"]


