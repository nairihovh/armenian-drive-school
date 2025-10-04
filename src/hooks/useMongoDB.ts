import { supabase } from "@/integrations/supabase/client";

export interface MongoDBQuery {
  collection: string;
  operation: 'find' | 'findOne' | 'insert' | 'update' | 'delete' | 'aggregate';
  query?: any;
  data?: any;
}

export const queryMongoDB = async (params: MongoDBQuery) => {
  try {
    const { data, error } = await supabase.functions.invoke('mongodb-query', {
      body: params
    });

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('MongoDB query error:', error);
    throw error;
  }
};

// Example usage hooks
export const useMongoDBQuestions = () => {
  return {
    getAll: () => queryMongoDB({
      collection: 'questions',
      operation: 'find'
    }),
    getByCategory: (categoryId: string) => queryMongoDB({
      collection: 'questions',
      operation: 'find',
      query: { category_id: categoryId }
    }),
    getById: (id: string) => queryMongoDB({
      collection: 'questions',
      operation: 'findOne',
      query: { _id: id }
    })
  };
};

export const useMongoDBCategories = () => {
  return {
    getAll: () => queryMongoDB({
      collection: 'categories',
      operation: 'find'
    }),
    getActive: () => queryMongoDB({
      collection: 'categories',
      operation: 'find',
      query: { is_active: true }
    })
  };
};
