import type {
  Difficulty,
  Question,
  QuestionType,
  QuizConfig,
} from "../utils/type";
import { useQuery } from "@tanstack/react-query";
import { http } from "../utils/http";

const shuffleArray = (array: string[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export const fetchQuestions = async (
  params: QuizConfig,
): Promise<Question[]> => {
  const { amount, category, difficulty, type } = params;

  let url = `api.php?amount=${amount}&category=${category}`;
  if (difficulty) url += `&difficulty=${difficulty}`;
  if (type) url += `&type=${type}`;

  return await http
    .get(url)
    .then((result: any) => {
      const results = result.results || result.data?.results;

      return results.map(
        (q: any): Question => ({
          category: q.category,
          type: q.type as QuestionType,
          difficulty: q.difficulty as Difficulty,
          question: q.question,
          correct_answer: q.correct_answer,
          incorrect_answers: q.incorrect_answers,
          all_answers:
            q.type === "boolean"
              ? ["True", "False"]
              : shuffleArray([
                  ...(q.incorrect_answers || []),
                  q.correct_answer,
                ]),
        }),
      );
    })
    .catch((error) => {
      throw error;
    });
};

export const useGetQuestions = (params: QuizConfig) => {
  return useQuery({
    queryKey: [
      "questions",
      params.amount,
      params.category,
      params.difficulty,
      params.type,
    ],
    queryFn: () => fetchQuestions(params),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    enabled: !!params.amount,
  });
};
