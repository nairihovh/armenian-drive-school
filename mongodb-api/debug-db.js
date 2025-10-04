const { MongoClient } = require('mongodb');

async function debugDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/armenian-drive-school';
  
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db();
    
    console.log('Connected to MongoDB');
    console.log('Database name:', db.databaseName);
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\nAvailable collections:');
    collections.forEach(col => {
      console.log(`- ${col.name}`);
    });
    
    // Check each collection for sample data
    for (const collection of collections) {
      const col = db.collection(collection.name);
      const count = await col.countDocuments();
      console.log(`\n${collection.name}: ${count} documents`);
      
      if (count > 0) {
        // Get a sample document
        const sample = await col.findOne();
        console.log('Sample document structure:', Object.keys(sample));
        
        // Check if it has is_active field
        if (sample.hasOwnProperty('is_active')) {
          const activeCount = await col.countDocuments({ is_active: true });
          console.log(`Documents with is_active: true: ${activeCount}`);
        }
      }
    }
    
    client.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

debugDatabase();
