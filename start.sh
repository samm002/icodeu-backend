#!/bin/bash

# Run Prisma migrations
npx prisma migrate deploy

# Start the application
node dist/main.js
