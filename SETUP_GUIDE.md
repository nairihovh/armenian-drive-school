# Armenian Drive School - Setup Guide

This guide will help you set up the Armenian Drive School application with its MongoDB API.

## Project Structure

```
armenian-drive-school/
├── src/                    # React frontend application
├── mongodb-api/            # Standalone MongoDB API server
│   ├── mongodb-api-server.js
│   ├── package.json
│   ├── setup-mongodb-api.sh
│   └── README.md
├── supabase/               # Supabase functions (legacy)
└── package.json            # Main project configuration
```

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (local installation or MongoDB Atlas account)
3. **npm** or **yarn**

## Quick Start

### 1. Install Dependencies

```bash
# Install main project dependencies
npm install

# Install MongoDB API dependencies
npm run api:install
```

### 2. Set Up MongoDB API

```bash
# Run the setup script
npm run api:setup
```

This will:
- Create a `.env` file in the mongodb-api directory
- Install required dependencies
- Set up the configuration

### 3. Configure MongoDB Connection

Edit `mongodb-api/.env` and set your MongoDB connection string:

```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/armenian-drive-school

# For MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/armenian-drive-school
```

### 4. Start the Application

You have several options:

#### Option A: Start Both API and Frontend Together
```bash
npm run start:all
```

#### Option B: Start Separately
```bash
# Terminal 1 - Start MongoDB API
npm run api:start

# Terminal 2 - Start Frontend
npm run dev
```

#### Option C: Development Mode (with auto-restart)
```bash
# Terminal 1 - Start MongoDB API in dev mode
npm run api:dev

# Terminal 2 - Start Frontend
npm run dev
```

## Verification

1. **MongoDB API Health Check:**
   - Visit: http://localhost:8000/health
   - Should return: `{"status":"OK","timestamp":"..."}`

2. **Frontend Application:**
   - Visit: http://localhost:5173
   - Should load the Armenian Drive School application

3. **API Endpoint:**
   - The frontend will automatically connect to: http://localhost:8000/mongodb-query

## Environment Variables

### Frontend (.env in root directory)
```env
VITE_MONGODB_API_URL=http://localhost:8000/mongodb-query
```

### MongoDB API (mongodb-api/.env)
```env
MONGODB_URI=mongodb://localhost:27017/armenian-drive-school
PORT=8000
```

## Available Scripts

### Main Project
- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### MongoDB API
- `npm run api:install` - Install API dependencies
- `npm run api:start` - Start API server
- `npm run api:dev` - Start API server in development mode
- `npm run api:setup` - Run setup script

### Combined
- `npm run start:all` - Start both API and frontend together

## Troubleshooting

### Common Issues

1. **"Failed to fetch" error:**
   - Make sure MongoDB API is running on port 8000
   - Check if MongoDB is running and accessible
   - Verify the MONGODB_URI in mongodb-api/.env

2. **MongoDB connection error:**
   - Ensure MongoDB is running locally or Atlas cluster is accessible
   - Check connection string format
   - Verify network connectivity

3. **Port already in use:**
   - Change the PORT in mongodb-api/.env
   - Update VITE_MONGODB_API_URL accordingly

4. **CORS errors:**
   - The API server includes CORS headers
   - Make sure you're accessing from the correct frontend URL

### Debug Mode

To run with debug logging:

```bash
# MongoDB API with debug
DEBUG=* npm run api:start

# Frontend with debug
DEBUG=vite:* npm run dev
```

## Development Workflow

1. **Start MongoDB** (if using local installation)
2. **Start MongoDB API:** `npm run api:start`
3. **Start Frontend:** `npm run dev`
4. **Make changes** to either frontend or API
5. **Test functionality** in the browser

## Production Deployment

### MongoDB API
1. Set up a production MongoDB instance
2. Configure environment variables
3. Use PM2 or similar for process management
4. Set up reverse proxy (nginx)
5. Configure SSL/TLS

### Frontend
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update API URL for production environment

## API Documentation

See `MONGODB_API_DOCS.md` for complete API documentation.

## Support

If you encounter issues:
1. Check the console logs for both frontend and API
2. Verify MongoDB connection
3. Check environment variables
4. Review the API documentation
