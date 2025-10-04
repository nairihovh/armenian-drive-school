import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { collection, operation, query, data } = await req.json();
    
    console.log('MongoDB request:', { collection, operation, query });

    const MONGODB_URI = Deno.env.get('MONGODB_URI');
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not configured');
    }

    // Connect to MongoDB
    const client = new MongoClient();
    await client.connect(MONGODB_URI);
    
    // Get database (adjust database name as needed)
    const db = client.database();
    const col = db.collection(collection);

    let result;

    switch (operation) {
      case 'find':
        result = await col.find(query || {}).toArray();
        break;
      
      case 'findOne':
        result = await col.findOne(query || {});
        break;
      
      case 'insert':
        result = await col.insertOne(data);
        break;
      
      case 'update':
        result = await col.updateOne(query, { $set: data });
        break;
      
      case 'delete':
        result = await col.deleteOne(query);
        break;
      
      case 'aggregate':
        result = await col.aggregate(query).toArray();
        break;
      
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    // Close connection
    client.close();

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('MongoDB Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
