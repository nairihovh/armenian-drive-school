const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
let db;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is required');
  process.exit(1);
}

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db();
    console.log('Connected to MongoDB');
    console.log('Database name:', db.databaseName);
    
    // Create indexes for better performance
    await createIndexes();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Create indexes
async function createIndexes() {
  try {
    await db.collection('questions').createIndex({ category_id: 1 });
    await db.collection('questions').createIndex({ _id: 1 });
    await db.collection('answers').createIndex({ question_id: 1 });
    await db.collection('answers').createIndex({ _id: 1 });
    await db.collection('questions_categories').createIndex({ _id: 1 });
    await db.collection('tests').createIndex({ _id: 1 });
    await db.collection('resources').createIndex({ _id: 1 });
    console.log('Indexes created successfully');
  } catch (error) {
    console.warn('Index creation warning:', error);
  }
}

// Helper functions
function validateCollection(collection) {
  const allowedCollections = [
    'questions',
    'answers', 
    'questions_categories',
    'tests',
    'resources',
    'test_results',
    'pages',
    'menus',
    'exam_configurations',
    'exam_configuration_items',
    'roles'
  ];
  return allowedCollections.includes(collection);
}

function validateObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

function convertStringIdsToObjectIds(query) {
  if (!query) return query;
  
  const converted = { ...query };
  
  // Convert _id fields to ObjectId
  if (converted._id && typeof converted._id === 'string') {
    if (validateObjectId(converted._id)) {
      converted._id = new ObjectId(converted._id);
    }
  }
  
  // Convert nested _id fields
  if (converted.question_id && typeof converted.question_id === 'string') {
    if (validateObjectId(converted.question_id)) {
      converted.question_id = new ObjectId(converted.question_id);
    }
  }
  
  if (converted.category_id && typeof converted.category_id === 'string') {
    if (validateObjectId(converted.category_id)) {
      converted.category_id = new ObjectId(converted.category_id);
    }
  }
  
  return converted;
}

// Main API endpoint
app.post('/mongodb-query', async (req, res) => {
  try {
    const { collection, operation, query, data, options, pipeline, update, upsert, multi } = req.body;
    
    console.log('MongoDB request:', { collection, operation, query: query ? 'present' : 'none' });

    // Validate collection name
    if (!validateCollection(collection)) {
      return res.status(400).json({
        success: false,
        error: `Invalid collection: ${collection}`
      });
    }

    const col = db.collection(collection);
    let result;
    let totalCount = 0;

    // Convert string IDs to ObjectIds
    const convertedQuery = convertStringIdsToObjectIds(query);
    const convertedData = convertStringIdsToObjectIds(data);
    const convertedUpdate = convertStringIdsToObjectIds(update);

    switch (operation) {
      case 'find':
        let findQuery = col.find(convertedQuery || {});
        
        if (options?.projection) {
          findQuery = findQuery.project(options.projection);
        }
        
        if (options?.sort) {
          findQuery = findQuery.sort(options.sort);
        }
        
        if (options?.skip) {
          findQuery = findQuery.skip(options.skip);
        }
        
        if (options?.limit) {
          findQuery = findQuery.limit(options.limit);
        }
        
        result = await findQuery.toArray();
        
        // Get total count for pagination
        if (options?.skip !== undefined || options?.limit !== undefined) {
          totalCount = await col.countDocuments(convertedQuery || {});
        }
        break;
      
      case 'findOne':
        result = await col.findOne(convertedQuery || {});
        break;
      
      case 'findById':
        if (!query?._id) {
          throw new Error('_id is required for findById operation');
        }
        result = await col.findOne({ _id: new ObjectId(query._id) });
        break;
      
      case 'count':
        result = await col.countDocuments(convertedQuery || {});
        break;
      
      case 'insert':
        if (!convertedData) {
          throw new Error('Data is required for insert operation');
        }
        result = await col.insertOne(convertedData);
        break;
      
      case 'insertMany':
        if (!Array.isArray(data)) {
          throw new Error('Data must be an array for insertMany operation');
        }
        const convertedDataArray = data.map(item => convertStringIdsToObjectIds(item));
        result = await col.insertMany(convertedDataArray);
        break;
      
      case 'update':
        if (!convertedQuery || !convertedUpdate) {
          throw new Error('Query and update data are required for update operation');
        }
        const updateOperation = multi ? 'updateMany' : 'updateOne';
        if (updateOperation === 'updateMany') {
          result = await col.updateMany(convertedQuery, { $set: convertedUpdate }, { upsert: upsert || false });
        } else {
          result = await col.updateOne(convertedQuery, { $set: convertedUpdate }, { upsert: upsert || false });
        }
        break;
      
      case 'replace':
        if (!convertedQuery || !convertedData) {
          throw new Error('Query and data are required for replace operation');
        }
        result = await col.replaceOne(convertedQuery, convertedData, { upsert: upsert || false });
        break;
      
      case 'delete':
        if (!convertedQuery) {
          throw new Error('Query is required for delete operation');
        }
        result = await col.deleteOne(convertedQuery);
        break;
      
      case 'deleteMany':
        if (!convertedQuery) {
          throw new Error('Query is required for deleteMany operation');
        }
        result = await col.deleteMany(convertedQuery);
        break;
      
      case 'aggregate':
        if (!pipeline || !Array.isArray(pipeline)) {
          throw new Error('Pipeline must be an array for aggregate operation');
        }
        result = await col.aggregate(pipeline).toArray();
        break;
      
      case 'distinct':
        if (!query?.field) {
          throw new Error('Field is required for distinct operation');
        }
        result = await col.distinct(query.field, convertedQuery || {});
        break;
      
      // Specialized operations for the application
      case 'getQuestionsByCategory':
        if (!query?.category_id) {
          throw new Error('category_id is required for getQuestionsByCategory operation');
        }
        const questions = await col.find({
          category_id: new ObjectId(query.category_id)
        }).sort({ created_at: -1 }).toArray();
        
        // Fetch answers for each question
        for (const question of questions) {
          const answers = await db.collection('answers').find({
            question_id: question._id
          }).sort({ sort: 1 }).toArray();
          question.answers = answers;
        }
        
        result = questions;
        break;
      
      case 'getRandomQuestions':
        if (!query?.category_id || !query?.count) {
          throw new Error('category_id and count are required for getRandomQuestions operation');
        }
        const allQuestions = await col.find({
          category_id: new ObjectId(query.category_id)
        }).toArray();
        
        // Shuffle and take random questions
        const shuffled = allQuestions.sort(() => Math.random() - 0.5);
        const randomQuestions = shuffled.slice(0, Math.min(query.count, shuffled.length));
        
        // Fetch answers for each question
        for (const question of randomQuestions) {
          const answers = await db.collection('answers').find({
            question_id: question._id
          }).sort({ sort: 1 }).toArray();
          question.answers = answers;
        }
        
        result = randomQuestions;
        break;
      
      case 'search':
        if (!query?.searchTerm) {
          throw new Error('searchTerm is required for search operation');
        }
        const searchQuery = {
          $or: [
            { question: { $regex: query.searchTerm, $options: 'i' } },
            { name: { $regex: query.searchTerm, $options: 'i' } }
          ]
        };
        
        if (query.category_id) {
          searchQuery.category_id = new ObjectId(query.category_id);
        }
        
        result = await col.find(searchQuery).toArray();
        break;
      
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    const response = { success: true, data: result };
    
    // Add pagination info if applicable
    if (totalCount > 0) {
      response.pagination = {
        total: totalCount,
        page: options?.skip ? Math.floor(options.skip / (options.limit || 10)) + 1 : 1,
        limit: options?.limit || 10,
        pages: Math.ceil(totalCount / (options?.limit || 10))
      };
    }

    console.log('Result:', result.length || 1, 'documents');
    res.json(response);

  } catch (error) {
    console.error('MongoDB Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
async function startServer() {
  await connectToMongoDB();
  
  app.listen(PORT, () => {
    console.log(`MongoDB API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API endpoint: http://localhost:${PORT}/mongodb-query`);
  });
}

startServer().catch(console.error);
