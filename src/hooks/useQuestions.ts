import { useQuery } from "@tanstack/react-query";
import { queryMongoDB } from "./useMongoDB";
export { useCategories, type Category } from "./useCategories";

export interface Question {
  _id: string;
  category_id: string;
  question_text: string;
  question_text_hy: string;
  question_image?: string | null;
  explanation?: string | null;
  explanation_hy?: string | null;
  difficulty_level?: number;
  is_active?: boolean;
  answers: Answer[];
}

export interface Answer {
  _id: string;
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
      const query = categoryId ? { category_id: categoryId, is_active: true } : { is_active: true };
      
      const questionsResult = await queryMongoDB({
        collection: "questions",
        operation: "find",
        query
      });

      const questions = questionsResult.data as Question[];

      // Fetch answers for each question
      for (const question of questions) {
        const answersResult = await queryMongoDB({
          collection: "answers",
          operation: "find",
          query: { question_id: question._id }
        });
        question.answers = answersResult.data as Answer[];
      }

      return questions;
    },
    enabled: !!categoryId,
  });
};

export const useRandomQuestions = (categoryId: string, count: number = 20) => {
  return useQuery({
    queryKey: ["random-questions", categoryId, count],
    queryFn: async () => {
      const questionsResult = await queryMongoDB({
        collection: "questions",
        operation: "find",
        query: { category_id: categoryId, is_active: true }
      });

      const questions = questionsResult.data as Question[];

      // Fetch answers for each question
      for (const question of questions) {
        const answersResult = await queryMongoDB({
          collection: "answers",
          operation: "find",
          query: { question_id: question._id }
        });
        question.answers = answersResult.data as Answer[];
      }

      // Shuffle and take first 'count' questions
      const shuffled = questions.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(count, shuffled.length));
    },
    enabled: !!categoryId,
  });
};
