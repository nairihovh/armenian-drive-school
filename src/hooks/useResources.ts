import { useQuery } from "@tanstack/react-query";
import { queryMongoDB } from "./useMongoDB";

export interface Resource {
  _id: string;
  id: number;
  slug: string;
}

export const useResources = (categoryId?: string) => {
  return useQuery({
    queryKey: ["resources", categoryId],
    queryFn: async () => {
      const query = categoryId 
        ? { category_id: categoryId }
        : {};

      const result = await queryMongoDB({
        collection: "resources",
        operation: "find",
        query
      });

      return result as Resource[];
    },
  });
};
