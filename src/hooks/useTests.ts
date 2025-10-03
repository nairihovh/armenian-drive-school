import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Test {
  id: string;
  title: string;
  title_hy: string;
  description: string | null;
  description_hy: string | null;
  category_id: string | null;
  time_limit_minutes: number | null;
  passing_score: number;
  is_active: boolean;
}

export const useTests = (categoryId?: string) => {
  return useQuery({
    queryKey: ["tests", categoryId],
    queryFn: async () => {
      let query = supabase
        .from("tests")
        .select("*")
        .eq("is_active", true);

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Test[];
    },
  });
};
