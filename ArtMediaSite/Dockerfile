# Frontend
FROM node:18-alpine

WORKDIR /app

# Copy dependencies
COPY package.json package-lock.json ./
RUN npm install -g @angular/cli
RUN npm install

# Copy full source
COPY . .

# Build app
RUN npm run build

# Port 4200
EXPOSE 4200
CMD ["npm", "start", "--", "--host", "0.0.0.0"]

