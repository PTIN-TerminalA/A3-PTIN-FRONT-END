FROM node:18-alpine

WORKDIR /app

# Copy only the package.json and package-lock.json from airport-front-end
COPY airport-front-end/package*.json ./airport-front-end/

# Install dependencies in /app (root), not nested under airport-front-end
RUN cd airport-front-end && npm install --prefix ../

# Ensure binaries in node_modules are available in PATH
ENV PATH /app/airport-front-end/node_modules/.bin:$PATH

# Copy the full project
COPY . .

# Set working directory to where your frontend project is
WORKDIR /app/airport-front-end

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
