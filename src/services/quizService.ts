import { getAllQuizzes } from "@/services/apiService";

export const getSubjectsWithQuizzes = async (grade: string): Promise<string[]> => {
  const response = await getAllQuizzes();
  const quizzes = response.data || [];

  const gradeQuizzes = quizzes.filter((q) => q.grade === grade);
  const subjects = Array.from(new Set(gradeQuizzes.map((q) => q.subject))) as string[];

  return subjects;
};
