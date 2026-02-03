# STAGE 1: Production Stage
FROM node:20-alpine AS production

ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --only=production --no-optional

# Copy built app and any runtime configs/scripts
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3333

# Fix: Run node directly for better signal handling
CMD ["node", "dist/server.js"]
