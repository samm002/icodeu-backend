# Base image
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Listen to all network interface
ENV HOST=0.0.0.0

# ENV DATABASE_URL=${DATABASE_URL}

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy prisma schema and generate the client
COPY prisma ./prisma
RUN npx prisma generate

# Bundle app source
COPY . .

# Applying the latest migration
RUN npx prisma migrate deploy

# Creates a "dist" folder with the production build
RUN npm run build

# Copy the entrypoint script
COPY ./start.sh /usr/src/app/start.sh
RUN chmod +x /usr/src/app/start.sh

# Expose port
EXPOSE 3000
EXPOSE 443

# Start the server with the entrypoint script
CMD [ "/usr/src/app/entrypoint.sh" ]