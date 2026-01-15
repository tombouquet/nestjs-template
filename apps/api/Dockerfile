# Use the official Bun image as the base image
FROM oven/bun:1

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy all package.json files and lockfile for monorepo workspace resolution
COPY package.json bun.lock* ./
COPY apps/api/package.json ./apps/api/
COPY packages/.gitkeep ./packages/

# Install the application dependencies (including workspace dependencies)
RUN bun install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN bun run build

# Expose the application port
EXPOSE 4000

# Command to run the application
CMD ["bun", "run", "apps/api/dist/src/main.js"]