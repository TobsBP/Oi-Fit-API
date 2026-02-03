# STAGE 1: Build Stage
FROM node:20-alpine AS build 

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# STAGE 2: Production Stage
FROM node:20-alpine AS production

ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --only=production --no-optional && npm cache clean --force

COPY --from=build /usr/src/app/dist ./dist 

EXPOSE 3333

CMD ["node", "dist/server.js"] 
