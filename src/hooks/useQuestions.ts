import { useQuery } from "@tanstack/react-query";
import { queryMongoDB } from "./useMongoDB";
export { useCategories, type Category } from "./useCategories";

export interface Question {
  _id: string;
  id: string;
  category_id: string;
  name: string;
  question: string;
  description?: string;
  multiple_answers?: boolean;
  created_at?: string;
  updated_at?: string;
  answers: Answer[];
  // Mapped fields for frontend
  question_text_hy: string;
  question_image?: string;
}

export interface Answer {
  _id: string;
  id: string;
  question_id: string;
  answer: string;
  is_right: string;
  sort: number;
  created_at?: string;
  updated_at?: string;
  // Mapped fields for frontend
  answer_text_hy: string;
  is_correct: boolean;
  order_index: number;
}

export const useQuestionsByCategory = (categoryId: string | null) => {
  return useQuery({
    queryKey: ["questions", categoryId],
    queryFn: async () => {
      const query = categoryId ? { category_id: categoryId } : {};
      
      const questionsResult = await queryMongoDB({
        collection: "questions",
        operation: "find",
        query
      });

      const questions = questionsResult as Question[];

      // Fetch answers for each question and map the data
      for (const question of questions) {
        const answersResult = await queryMongoDB({
          collection: "answers",
          operation: "find",
          query: { question_id: question.id }
        });
        
        // Map answers to frontend format
        const mappedAnswers = (answersResult as any[]).map(answer => ({
          ...answer,
          answer_text_hy: answer.answer,
          is_correct: answer.is_right === "1",
          order_index: answer.sort
        }));
        
        question.answers = mappedAnswers;
        
        // Map question to frontend format
        question.question_text_hy = question.question;
        // Extract image from HTML if present
        const imgMatch = question.question.match(/<img[^>]+src="([^"]+)"/);
        if (imgMatch) {
          question.question_image = imgMatch[1];
        }
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
        query: { category_id: categoryId }
      });
      const questions = questionsResult as Question[];

      // Fetch answers for each question and map the data
      for (const question of questions) {
        const answersResult = await queryMongoDB({
          collection: "answers",
          operation: "find",
          query: { question_id: question.id }
        });
        
        // Map answers to frontend format
        const mappedAnswers = (answersResult as any[]).map(answer => ({
          ...answer,
          answer_text_hy: answer.answer,
          is_correct: answer.is_right === "1",
          order_index: answer.sort
        }));
        
        question.answers = mappedAnswers;
        
        // Map question to frontend format
        question.question_text_hy = question.question;
        // Extract image from HTML if present
        const imgMatch = question.question.match(/<img[^>]+src="([^"]+)"/);
        if (imgMatch) {
          question.question_image = imgMatch[1];
        }
      }

      // Shuffle and take first 'count' questions
      const shuffled = questions.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(count, shuffled.length));
    },
    enabled: !!categoryId,
  });
};
