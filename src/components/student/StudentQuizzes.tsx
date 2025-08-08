import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  getQuizzesForGradeSubject, submitQuiz, getQuizById
} from '@/services/apiService';
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface StudentQuizzesProps {
  gradeId: string;
  subjectId: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions?: any[];
}

const StudentQuizzes = ({ gradeId, subjectId }: StudentQuizzesProps) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: number]: string }>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const navigate = useNavigate();

  const { data: fetchedQuizzes, isLoading, isError } = useQuery({
    queryKey: ['quizzes', gradeId, subjectId],
    queryFn: () => getQuizzesForGradeSubject(gradeId, subjectId),
    enabled: !!gradeId && !!subjectId,
  });

  useEffect(() => {
    if (fetchedQuizzes) {
      setQuizzes(fetchedQuizzes);
    }
  }, [fetchedQuizzes]);

  const handleQuizSelect = async (quizId: number) => {
    try {
      const quizDetails = await getQuizById(quizId);
      setSelectedQuiz(quizDetails);
      setCurrentQuestion(0);
      setSelectedAnswers({});
      setQuizStarted(true);
    } catch (error) {
      console.error("Failed to fetch quiz details:", error);
    }
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleQuizSubmit = async () => {
    if (!selectedQuiz) return;

    const quizId = selectedQuiz.id;
    const answers = selectedAnswers;

    try {
      const submissionResult = await submitQuiz(quizId, answers);
      console.log("Quiz submission result:", submissionResult);
      alert("Quiz submitted successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Quiz submission failed:", error);
      alert("Failed to submit quiz.");
    } finally {
      setSelectedQuiz(null);
      setCurrentQuestion(0);
      setSelectedAnswers({});
      setQuizStarted(false);
    }
  };

  const closeQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setQuizStarted(false);
  };

  if (isLoading) return <div>Loading quizzes...</div>;
  if (isError) return <div>Error fetching quizzes.</div>;

  const currentQuestionData = selectedQuiz?.questions?.[currentQuestion] || null;

  if (selectedQuiz && quizStarted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Quiz header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{selectedQuiz.title}</h2>
            <Button variant="ghost" size="sm" onClick={closeQuiz}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Question content */}
          {currentQuestionData && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">
                Question {currentQuestion + 1} of {selectedQuiz.questions?.length || 0}
              </h3>
              <p className="mb-4">{currentQuestionData.question}</p>

              {/* Multiple choice options */}
              {currentQuestionData.type === 'multiple_choice' && currentQuestionData.options && (
                <div className="space-y-2">
                  {currentQuestionData.options.map((option: string, index: number) => (
                    <label key={index} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                      <input
                        type="radio"
                        name={`question_${currentQuestionData.id}`}
                        value={option}
                        checked={selectedAnswers[currentQuestionData.id] === option}
                        onChange={(e) => handleAnswerSelect(currentQuestionData.id, e.target.value)}
                        className="form-radio"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* True/False options */}
              {currentQuestionData.type === 'true_false' && (
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                    <input
                      type="radio"
                      name={`question_${currentQuestionData.id}`}
                      value="true"
                      checked={selectedAnswers[currentQuestionData.id] === 'true'}
                      onChange={(e) => handleAnswerSelect(currentQuestionData.id, e.target.value)}
                      className="form-radio"
                    />
                    <span>True</span>
                  </label>
                  <label className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                    <input
                      type="radio"
                      name={`question_${currentQuestionData.id}`}
                      value="false"
                      checked={selectedAnswers[currentQuestionData.id] === 'false'}
                      onChange={(e) => handleAnswerSelect(currentQuestionData.id, e.target.value)}
                      className="form-radio"
                    />
                    <span>False</span>
                  </label>
                </div>
              )}

              {/* Short answer input */}
              {currentQuestionData.type === 'short_answer' && (
                <textarea
                  className="w-full p-3 border rounded-lg"
                  placeholder="Type your answer here..."
                  value={selectedAnswers[currentQuestionData.id] || ''}
                  onChange={(e) => handleAnswerSelect(currentQuestionData.id, e.target.value)}
                  rows={4}
                />
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={() => {
                if (currentQuestion < (selectedQuiz.questions?.length || 0) - 1) {
                  setCurrentQuestion(currentQuestion + 1);
                } else {
                  handleQuizSubmit();
                }
              }}
            >
              {currentQuestion < (selectedQuiz.questions?.length || 0) - 1 ? 'Next' : 'Submit Quiz'}
            </Button>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / (selectedQuiz.questions?.length || 1)) * 100}%`
                }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Progress: {currentQuestion + 1} of {selectedQuiz.questions?.length || 0} questions
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Quizzes</h2>
      {quizzes.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map(quiz => (
            <li key={quiz.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 ease-in-out">
              <h3 className="text-lg font-semibold mb-2">{quiz.title}</h3>
              <p className="text-gray-600">{quiz.description}</p>
              <Button className="mt-4 w-full" onClick={() => handleQuizSelect(quiz.id)}>
                Start Quiz
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No quizzes available for this grade and subject.</p>
      )}
    </div>
  );
};

export default StudentQuizzes;
