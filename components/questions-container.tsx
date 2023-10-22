"use client";

import React from "react";
import { Question } from "@prisma/client";
import {
  useSelectedQuestion,
  useSetSelectedQuestion,
} from "@/stores/question/selected-question";

const QuestionsContainer = ({
  children,
  questions,
}: React.PropsWithChildren<{ questions: Question[] }>) => {
  const selectedQuestion = useSelectedQuestion();
  const setSelectedQuestion = useSetSelectedQuestion();

  if (!selectedQuestion && questions.length > 0) {
    setSelectedQuestion(questions[0].id);
  }

  return <>{children}</>;
};

export default QuestionsContainer;
