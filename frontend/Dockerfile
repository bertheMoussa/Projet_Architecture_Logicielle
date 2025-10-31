FROM node:16 as build

WORKDIR /al/web/src/app

COPY package*.json ./

RUN npm install --only=production
RUN npm install -g @angular/cli@15.0.4

COPY . .

RUN npm run build
