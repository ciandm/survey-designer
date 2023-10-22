"use client";

import { Prisma } from "@prisma/client";
import { cn } from "@/lib/utils";
import {
  useSelectedQuestion,
  useSetSelectedQuestion,
} from "@/stores/question/selected-question";
import { Input } from "./ui/input";

interface Props {
  question: Prisma.QuestionGetPayload<{ include: { answers: true } }>;
  questionNumber: number;
  isActive?: boolean;
}

const QuestionDesigner = ({ question, questionNumber }: Props) => {
  const selectedQuestion = useSelectedQuestion();
  const setSelectedQuestion = useSetSelectedQuestion();

  const onQuestionClick = () => {
    setSelectedQuestion(question.id);
  };

  return (
    <div
      key={question.id}
      className={cn("cursor-pointer border border-transparent p-8", {
        "bg-primary-foreground": selectedQuestion === question.id,
      })}
      onClick={onQuestionClick}
    >
      <p className="text-muted-foreground mb-1 text-sm">
        Question {questionNumber}
      </p>
      <h5 className="text-lg font-medium">{question.text}</h5>
      <div className="mt-4">
        {question.answers.map((answer) => (
          <div key={answer.id} className="flex items-center">
            <input
              type="radio"
              id={answer.id}
              name={question.id}
              className="mr-2"
            />
            <label htmlFor={answer.id}>{answer.text}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuestionDesignerEditor = () => {
  return <Input />;
};

export default QuestionDesigner;
