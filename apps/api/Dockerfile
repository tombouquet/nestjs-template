# Use the official Bun image as the base image
FROM oven/bun:1

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and lockfile to the working directory
COPY package.json bun.lockb* yarn.lock* ./

# Install the application dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN bun run build

# Expose the application port
EXPOSE 4000

# Command to run the application
CMD ["bun", "run", "dist/src/main.js"]