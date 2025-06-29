# Frontend
FROM node:18-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -g @angular/cli
RUN npm install
COPY . .

# Port 4200
EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0"]

