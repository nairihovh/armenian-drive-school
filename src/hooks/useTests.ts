import { useQuery } from "@tanstack/react-query";
import { queryMongoDB } from "./useMongoDB";

export interface Test {
  _id: string;
  title: string;
  title_hy: string;
  description?: string;
  description_hy?: string;
  category_id?: string;
  time_limit_minutes?: number;
  passing_score?: number;
  is_active?: boolean;
}

export const useTests = (categoryId?: string) => {
  return useQuery({
    queryKey: ["tests", categoryId],
    queryFn: async () => {
      const query = categoryId 
        ? { category_id: categoryId, is_active: true }
        : { is_active: true };

      const result = await queryMongoDB({
        collection: "tests",
        operation: "find",
        query
      });

      return result.data as Test[];
    },
  });
};
