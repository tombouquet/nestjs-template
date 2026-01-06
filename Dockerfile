# Use the official Node.js image as the base image
FROM node:24

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install the application dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN yarn build

# Verify the build output exists
RUN test -f dist/src/main.js || (echo "Build failed: dist/src/main.js not found" && exit 1)

# Expose the application port
EXPOSE 4000

# Command to run the application
CMD ["node", "dist/src/main.js"]