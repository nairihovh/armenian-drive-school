import { useQuery } from "@tanstack/react-query";
import { queryMongoDB } from "./useMongoDB";

export interface Test {
  _id: string;
  id: number;
  name: string;
  description?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export const useTests = (categoryId?: string) => {
  return useQuery({
    queryKey: ["tests", categoryId],
    queryFn: async () => {
      const query = categoryId 
        ? { category_id: categoryId }
        : {};

      const result = await queryMongoDB({
        collection: "tests",
        operation: "find",
        query
      });

      return result as Test[];
    },
  });
};
