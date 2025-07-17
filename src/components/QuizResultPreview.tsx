import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Award } from "lucide-react";
import { Question } from "./types/apiTypes";
import { startQuiz } from "@/services/apiService";

type Props = {
  quizQuestions: Question[];
  answers: Record<string, string | number>;
  score: number;
  onClose: () => void;
  onRetry: () => void;
};

const QuizResultPreview: React.FC<Props> = ({
  quizQuestions,
  answers,
  score,
  onClose,
  onRetry,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">
        Your Score: {score}/{quizQuestions.length}
      </h3>

     {quizQuestions.map((question, idx) => {
  const selected = answers[question.id];
  const correctIndex = question.correctAnswerPosition - 1;

  return (
    <Card key={question.id}>
      <CardHeader>
        <CardTitle className="text-base">
          Q{idx + 1}: {question.questionText}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {question.type === "SHORT_ANSWER" ? (
          <div className="p-4 border rounded-lg space-y-2 bg-muted/50">
  <p className={`text-base ${selected?.toString().trim().toLowerCase() === question.correctAnswerText?.trim().toLowerCase() ? "text-green-600" : "text-red-600"}`}>
    <span className="font-semibold">Your Answer:</span>{" "}
    {selected?.toString() || "No answer provided"}
  </p>
  <p className="text-base text-green-600">
    <span className="font-semibold">Expected Answer:</span>{" "}
    {question.correctAnswerText || "Not specified"}
  </p>
</div>

        ) : (
          question.options.map((opt, i) => {
            const isCorrect = i === correctIndex;
            const isSelected = i === selected;

            return (
              <div
                key={i}
                className={`flex items-center space-x-2 px-2 py-1 rounded-md
                  ${isCorrect ? "bg-green-100 text-green-800" : ""}
                  ${isSelected && !isCorrect ? "bg-red-100 text-red-800" : ""}
                `}
              >
                <span className="font-medium">
                  {String.fromCharCode(65 + i)}.
                </span>
                <span>{opt}</span>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
})}


      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-green-100 rounded-full">
            <Award className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold">Your Score</h3>
          <p className="text-3xl font-bold text-green-600">
            {score}/{quizQuestions.length}
          </p>
          <p className="text-muted-foreground">
            {Math.round((score / quizQuestions.length) * 100)}% Correct
          </p>
        </div>
      </div>

      <DialogFooter className="flex flex-col gap-2">
        {!showConfirm ? (
          <>
            <Button
              variant="destructive"
              onClick={() => setShowConfirm(true)}
              className="w-full"
            >
              Retry Quiz
            </Button>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </>
        ) : (
          <>
            <div className="text-sm text-center text-muted-foreground">
              Are you sure? Your latest score will be used, if you get a lesser
              score, that one will be used as the final mark.
            </div>
            <div className="flex gap-2 w-full">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setShowConfirm(false)}
              >
                No, go back
              </Button>
              <Button variant="default" className="w-full" onClick={onRetry}>
                Yes, Retry
              </Button>
            </div>
          </>
        )}
      </DialogFooter>
    </div>
  );
};

export default QuizResultPreview;
