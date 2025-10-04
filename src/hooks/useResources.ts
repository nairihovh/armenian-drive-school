import { useQuery } from "@tanstack/react-query";
import { queryMongoDB } from "./useMongoDB";

export interface Resource {
  _id: string;
  title: string;
  title_hy: string;
  description?: string;
  description_hy?: string;
  resource_type: "video" | "pdf" | "article" | "image" | "link";
  resource_url: string;
  category_id?: string;
  thumbnail_url?: string;
  is_active?: boolean;
}

export const useResources = (categoryId?: string) => {
  return useQuery({
    queryKey: ["resources", categoryId],
    queryFn: async () => {
      const query = categoryId 
        ? { category_id: categoryId, is_active: true }
        : { is_active: true };

      const result = await queryMongoDB({
        collection: "resources",
        operation: "find",
        query
      });

      return result.data as Resource[];
    },
  });
};
