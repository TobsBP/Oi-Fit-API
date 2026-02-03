FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install all dependencies (including dev)
COPY package.json package-lock.json ./
RUN npm install

# Copy source code and build configuration
COPY src ./src
COPY tsconfig.json ./

# Compile TypeScript to JavaScript
RUN npx tsc --outDir dist

# Stage 2: Create the production image
FROM node:20-alpine

WORKDIR /app

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy only production dependencies from the builder stage
COPY package.json package-lock.json ./
RUN npm install --production

# Copy the compiled code from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the application port
EXPOSE 3333

# The application requires a JWT_SECRET environment variable.
# Pass it during 'docker run', e.g., docker run -e JWT_SECRET='your-secret' my-app
#
# Start the application
CMD [ "node", "dist/server.js" ]
