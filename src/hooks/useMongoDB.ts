export interface MongoDBQuery {
  collection: string;
  operation: 'find' | 'findOne' | 'findById' | 'count' | 'insert' | 'insertMany' | 'update' | 'replace' | 'delete' | 'deleteMany' | 'aggregate' | 'distinct' | 'createIndex' | 'listIndexes' | 'dropIndex' | 'getQuestionsByCategory' | 'getRandomQuestions' | 'search';
  query?: any;
  data?: any;
  options?: {
    limit?: number;
    skip?: number;
    sort?: Record<string, 1 | -1>;
    projection?: Record<string, 1 | 0>;
  };
  pipeline?: any[];
  update?: any;
  upsert?: boolean;
  multi?: boolean;
}

const MONGODB_API_URL = import.meta.env.VITE_MONGODB_API_URL || 'http://localhost:8000/mongodb-query';

export const queryMongoDB = async (params: MongoDBQuery) => {
  try {
    console.log('Making API call to:', MONGODB_API_URL);
    console.log('Request params:', params);
    
    const response = await fetch(MONGODB_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Response result:', result);
    
    if (!result.success) {
      throw new Error(result.error || 'Unknown error');
    }
    
    return result.data;
  } catch (error) {
    console.error('MongoDB query error:', error);
    throw error;
  }
};

// Helper functions for common operations
export const mongoHelpers = {
  // Pagination helper
  paginate: (page: number = 1, limit: number = 10) => ({
    skip: (page - 1) * limit,
    limit
  }),

  // Sorting helpers
  sortBy: (field: string, direction: 'asc' | 'desc' = 'asc') => ({
    [field]: direction === 'asc' ? 1 : -1
  }),

  // Projection helpers
  select: (fields: string[]) => {
    const projection: Record<string, 1> = {};
    fields.forEach(field => projection[field] = 1);
    return projection;
  },

  // Search helpers
  searchText: (fields: string[], searchTerm: string) => ({
    $or: fields.map(field => ({
      [field]: { $regex: searchTerm, $options: 'i' }
    }))
  })
};

// Example usage hooks
export const useMongoDBQuestions = () => {
  return {
    // Basic CRUD operations
    getAll: (options?: { limit?: number; skip?: number; sort?: Record<string, 1 | -1> }) => 
      queryMongoDB({
        collection: 'questions',
        operation: 'find',
        options
      }),
    
    getByCategory: (categoryId: string, options?: { limit?: number; skip?: number; sort?: Record<string, 1 | -1> }) => 
      queryMongoDB({
        collection: 'questions',
        operation: 'find',
        query: { category_id: categoryId, is_active: true },
        options
      }),
    
    getById: (id: string) => 
      queryMongoDB({
        collection: 'questions',
        operation: 'findById',
        query: { _id: id }
      }),
    
    getRandom: (categoryId: string, count: number = 20) =>
      queryMongoDB({
        collection: 'questions',
        operation: 'getRandomQuestions',
        query: { category_id: categoryId, count }
      }),
    
    search: (searchTerm: string, categoryId?: string) =>
      queryMongoDB({
        collection: 'questions',
        operation: 'search',
        query: { searchTerm, category_id: categoryId }
      }),
    
    count: (query?: any) =>
      queryMongoDB({
        collection: 'questions',
        operation: 'count',
        query
      }),
    
    create: (data: any) =>
      queryMongoDB({
        collection: 'questions',
        operation: 'insert',
        data
      }),
    
    update: (id: string, data: any) =>
      queryMongoDB({
        collection: 'questions',
        operation: 'update',
        query: { _id: id },
        data
      }),
    
    delete: (id: string) =>
      queryMongoDB({
        collection: 'questions',
        operation: 'delete',
        query: { _id: id }
      })
  };
};

export const useMongoDBCategories = () => {
  return {
    getAll: (options?: { limit?: number; skip?: number; sort?: Record<string, 1 | -1> }) => 
      queryMongoDB({
        collection: 'questions_categories',
        operation: 'find',
        options
      }),
    
    getActive: (options?: { limit?: number; skip?: number; sort?: Record<string, 1 | -1> }) => 
      queryMongoDB({
        collection: 'questions_categories',
        operation: 'find',
        query: { is_active: true },
        options
      }),
    
    getById: (id: string) =>
      queryMongoDB({
        collection: 'questions_categories',
        operation: 'findById',
        query: { _id: id }
      }),
    
    create: (data: any) =>
      queryMongoDB({
        collection: 'questions_categories',
        operation: 'insert',
        data
      }),
    
    update: (id: string, data: any) =>
      queryMongoDB({
        collection: 'questions_categories',
        operation: 'update',
        query: { _id: id },
        data
      }),
    
    delete: (id: string) =>
      queryMongoDB({
        collection: 'questions_categories',
        operation: 'delete',
        query: { _id: id }
      })
  };
};

export const useMongoDBAnswers = () => {
  return {
    getByQuestion: (questionId: string) =>
      queryMongoDB({
        collection: 'answers',
        operation: 'find',
        query: { question_id: questionId },
        options: { sort: { order_index: 1 } }
      }),
    
    create: (data: any) =>
      queryMongoDB({
        collection: 'answers',
        operation: 'insert',
        data
      }),
    
    createMany: (data: any[]) =>
      queryMongoDB({
        collection: 'answers',
        operation: 'insertMany',
        data
      }),
    
    update: (id: string, data: any) =>
      queryMongoDB({
        collection: 'answers',
        operation: 'update',
        query: { _id: id },
        data
      }),
    
    delete: (id: string) =>
      queryMongoDB({
        collection: 'answers',
        operation: 'delete',
        query: { _id: id }
      }),
    
    deleteByQuestion: (questionId: string) =>
      queryMongoDB({
        collection: 'answers',
        operation: 'deleteMany',
        query: { question_id: questionId }
      })
  };
};

export const useMongoDBTests = () => {
  return {
    getAll: (options?: { limit?: number; skip?: number; sort?: Record<string, 1 | -1> }) =>
      queryMongoDB({
        collection: 'tests',
        operation: 'find',
        query: { is_active: true },
        options
      }),
    
    getByCategory: (categoryId: string, options?: { limit?: number; skip?: number; sort?: Record<string, 1 | -1> }) =>
      queryMongoDB({
        collection: 'tests',
        operation: 'find',
        query: { category_id: categoryId, is_active: true },
        options
      }),
    
    getById: (id: string) =>
      queryMongoDB({
        collection: 'tests',
        operation: 'findById',
        query: { _id: id }
      }),
    
    create: (data: any) =>
      queryMongoDB({
        collection: 'tests',
        operation: 'insert',
        data
      }),
    
    update: (id: string, data: any) =>
      queryMongoDB({
        collection: 'tests',
        operation: 'update',
        query: { _id: id },
        data
      }),
    
    delete: (id: string) =>
      queryMongoDB({
        collection: 'tests',
        operation: 'delete',
        query: { _id: id }
      })
  };
};

export const useMongoDBResources = () => {
  return {
    getAll: (options?: { limit?: number; skip?: number; sort?: Record<string, 1 | -1> }) =>
      queryMongoDB({
        collection: 'resources',
        operation: 'find',
        query: { is_active: true },
        options
      }),
    
    getByCategory: (categoryId: string, options?: { limit?: number; skip?: number; sort?: Record<string, 1 | -1> }) =>
      queryMongoDB({
        collection: 'resources',
        operation: 'find',
        query: { category_id: categoryId, is_active: true },
        options
      }),
    
    getByType: (resourceType: string, options?: { limit?: number; skip?: number; sort?: Record<string, 1 | -1> }) =>
      queryMongoDB({
        collection: 'resources',
        operation: 'find',
        query: { resource_type: resourceType, is_active: true },
        options
      }),
    
    getById: (id: string) =>
      queryMongoDB({
        collection: 'resources',
        operation: 'findById',
        query: { _id: id }
      }),
    
    create: (data: any) =>
      queryMongoDB({
        collection: 'resources',
        operation: 'insert',
        data
      }),
    
    update: (id: string, data: any) =>
      queryMongoDB({
        collection: 'resources',
        operation: 'update',
        query: { _id: id },
        data
      }),
    
    delete: (id: string) =>
      queryMongoDB({
        collection: 'resources',
        operation: 'delete',
        query: { _id: id }
      })
  };
};

// Advanced query helpers
export const useMongoDBAggregation = () => {
  return {
    aggregate: (collection: string, pipeline: any[]) =>
      queryMongoDB({
        collection,
        operation: 'aggregate',
        pipeline
      }),
    
    distinct: (collection: string, field: string, query?: any) =>
      queryMongoDB({
        collection,
        operation: 'distinct',
        query: { field, ...query }
      }),
    
    // Example aggregation pipelines
    getQuestionStats: (categoryId?: string) => {
      const matchStage = categoryId 
        ? { $match: { category_id: categoryId, is_active: true } }
        : { $match: { is_active: true } };
      
      return queryMongoDB({
        collection: 'questions',
        operation: 'aggregate',
        pipeline: [
          matchStage,
          {
            $group: {
              _id: '$category_id',
              totalQuestions: { $sum: 1 },
              avgDifficulty: { $avg: '$difficulty_level' }
            }
          },
          {
            $lookup: {
              from: 'questions_categories',
              localField: '_id',
              foreignField: '_id',
              as: 'category'
            }
          }
        ]
      });
    }
  };
};
