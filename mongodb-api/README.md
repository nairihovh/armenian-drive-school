# MongoDB API Server

This directory contains the standalone MongoDB API server for the Armenian Drive School application.

## Files

- `mongodb-api-server.js` - Main API server implementation
- `package.json` - Dependencies and scripts for the API server
- `setup-mongodb-api.sh` - Setup script for easy installation

## Quick Start

1. **Install dependencies:**
   ```bash
   cd mongodb-api
   npm install
   ```

2. **Set up environment:**
   ```bash
   ./setup-mongodb-api.sh
   ```

3. **Configure MongoDB URI:**
   Edit the `.env` file and set your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/armenian-drive-school
   ```

4. **Start the server:**
   ```bash
   npm start
   # or for development with auto-restart:
   npm run dev
   ```

## API Endpoints

- **Main API:** `POST http://localhost:8000/mongodb-query`
- **Health Check:** `GET http://localhost:8000/health`

## Environment Variables

- `MONGODB_URI` - MongoDB connection string (required)
- `PORT` - Server port (default: 8000)

## Features

- Full CRUD operations for all collections
- Pagination support
- Sorting and filtering
- Text search
- Aggregation pipelines
- Specialized operations for questions and answers
- Automatic index creation
- CORS support
- Error handling and validation

## Collections Supported

- `questions` - Driving test questions
- `answers` - Answer options for questions
- `questions_categories` - Question categories
- `tests` - Test configurations
- `resources` - Learning resources
- `test_results` - User test results
- `users` - User accounts

## Development

The server uses Express.js with MongoDB driver and includes:
- Automatic reconnection handling
- Index optimization
- Input validation
- Comprehensive error handling
- CORS configuration for web applications

## Production Deployment

For production deployment, consider:
- Using PM2 for process management
- Setting up proper logging
- Configuring reverse proxy (nginx)
- Setting up SSL/TLS
- Implementing rate limiting
- Adding authentication if needed
