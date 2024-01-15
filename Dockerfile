# Use an official Node.js runtime as the base image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Copy the .env file to build with it

COPY .env.local ./

# Install the application's dependencies inside the container using yarn
RUN yarn install

# Copy the rest of the application to the container
COPY . .

EXPOSE 3000

# Specify the command to run the application using yarn
CMD ["yarn", "dev"]
