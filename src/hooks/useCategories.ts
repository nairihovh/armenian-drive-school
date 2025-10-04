import { useQuery } from "@tanstack/react-query";
import { queryMongoDB } from "./useMongoDB";

export interface Category {
  _id: string;
  id: number;
  title: string;
  description?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const result = await queryMongoDB({
        collection: "questions_categories",
        operation: "find"
      });
      console.log('Categories result:', result);
      return result as Category[];
    },
  });
};
