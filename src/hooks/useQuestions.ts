import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
export { useCategories, type Category } from "./useCategories";

export interface Question {
  id: string;
  category_id: string;
  question_text: string;
  question_text_hy: string;
  question_image: string | null;
  explanation: string | null;
  explanation_hy: string | null;
  difficulty_level: number;
  answers: Answer[];
}

export interface Answer {
  id: string;
  question_id: string;
  answer_text: string;
  answer_text_hy: string;
  is_correct: boolean;
  order_index: number;
}

export const useQuestionsByCategory = (categoryId: string | null) => {
  return useQuery({
    queryKey: ["questions", categoryId],
    queryFn: async () => {
      let query = supabase
        .from("questions")
        .select(`
          *,
          answers (*)
        `)
        .eq("is_active", true);

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Question[];
    },
    enabled: !!categoryId,
  });
};

export const useRandomQuestions = (categoryId: string, count: number = 20) => {
  return useQuery({
    queryKey: ["random-questions", categoryId, count],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions")
        .select(`
          *,
          answers (*)
        `)
        .eq("category_id", categoryId)
        .eq("is_active", true);

      if (error) throw error;

      // Shuffle and take first 'count' questions
      const shuffled = (data as Question[]).sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(count, shuffled.length));
    },
    enabled: !!categoryId,
  });
};
