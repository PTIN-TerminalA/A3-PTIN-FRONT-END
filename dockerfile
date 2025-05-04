FROM node:18-alpine

WORKDIR /app

COPY airport-front-end/package*.json ./airport-front-end/
RUN npm install
ENV PATH /app/node_modules/.bin:$PATH

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
