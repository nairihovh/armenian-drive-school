import { useQuery } from "@tanstack/react-query";
import { queryMongoDB } from "./useMongoDB";

export interface Category {
  _id: string;
  name: string;
  name_hy: string;
  description?: string;
  icon?: string;
  order_index?: number;
  is_active?: boolean;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const result = await queryMongoDB({
        collection: "questions_categories",
        operation: "find",
        query: { is_active: true }
      });
      return result.data as Category[];
    },
  });
};
