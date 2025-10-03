import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Resource {
  id: string;
  title: string;
  title_hy: string;
  description: string | null;
  description_hy: string | null;
  resource_type: "video" | "pdf" | "article" | "image" | "link";
  resource_url: string;
  category_id: string | null;
  thumbnail_url: string | null;
  is_active: boolean;
}

export const useResources = (categoryId?: string) => {
  return useQuery({
    queryKey: ["resources", categoryId],
    queryFn: async () => {
      let query = supabase
        .from("resources")
        .select("*")
        .eq("is_active", true);

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Resource[];
    },
  });
};
