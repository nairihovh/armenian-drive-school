#!/bin/bash

echo "Setting up MongoDB API Server..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/armenian-drive-school
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/armenian-drive-school

# API Server Configuration
PORT=8000

# Frontend Configuration
VITE_MONGODB_API_URL=http://localhost:8000/mongodb-query
EOF
    echo ".env file created successfully!"
else
    echo ".env file already exists"
fi

# Install dependencies for MongoDB API server
echo "Installing MongoDB API server dependencies..."
npm install express mongodb cors nodemon --save

# Copy the package.json for the API server
cp mongodb-api-package.json package-mongodb-api.json

echo "Setup complete!"
echo ""
echo "To start the MongoDB API server:"
echo "1. Make sure MongoDB is running"
echo "2. Update the MONGODB_URI in .env file with your MongoDB connection string"
echo "3. Run: node mongodb-api-server.js"
echo "4. Or for development: npx nodemon mongodb-api-server.js"
echo ""
echo "The API will be available at: http://localhost:8000/mongodb-query"
echo "Health check: http://localhost:8000/health"
