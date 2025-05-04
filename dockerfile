# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy frontend files
COPY airport-front-end ./airport-front-end

# Install dependencies
RUN cd airport-front-end && npm install

# Start app (adjust if using Vite or similar)
CMD ["npm", "run", "dev", "--prefix", "airport-front-end"]
