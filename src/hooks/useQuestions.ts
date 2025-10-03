import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Answer {
  id: string;
  question_id: string;
  answer_text: string;
  answer_text_hy: string;
  is_correct: boolean;
  order_index: number;
}

export interface Question {
  id: string;
  category_id: string | null;
  question_text: string;
  question_text_hy: string;
  question_image: string | null;
  explanation: string | null;
  explanation_hy: string | null;
  difficulty_level: number;
  answers: Answer[];
}

export const useQuestions = (categoryId: string, limit?: number) => {
  return useQuery({
    queryKey: ["questions", categoryId, limit],
    queryFn: async () => {
      let query = supabase
        .from("questions")
        .select(`
          *,
          answers (*)
        `)
        .eq("is_active", true)
        .eq("category_id", categoryId)
        .order("created_at", { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Question[];
    },
  });
};

export const useRandomQuestions = (categoryId: string, count: number = 10) => {
  return useQuery({
    queryKey: ["random-questions", categoryId, count],
    queryFn: async () => {
      // First get all question IDs for this category
      const { data: allQuestions, error: fetchError } = await supabase
        .from("questions")
        .select("id")
        .eq("is_active", true)
        .eq("category_id", categoryId);

      if (fetchError) throw fetchError;
      
      // Randomly select question IDs
      const shuffled = allQuestions?.sort(() => 0.5 - Math.random());
      const selectedIds = shuffled?.slice(0, count).map(q => q.id) || [];

      // Fetch full question data with answers
      const { data, error } = await supabase
        .from("questions")
        .select(`
          *,
          answers (*)
        `)
        .in("id", selectedIds);

      if (error) throw error;
      return data as Question[];
    },
    enabled: !!categoryId,
  });
};
