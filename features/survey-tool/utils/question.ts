import {QuestionConfig} from '@/lib/validations/question';

export const getQuestionIndex = (
  questions: QuestionConfig[],
  questionId?: string,
) => {
  return questions.findIndex((q) => q.id === questionId);
};

export const getNextQuestion = (
  questions: QuestionConfig[],
  questionId?: string,
) => {
  const index = getQuestionIndex(questions, questionId);
  return questions[index + 1];
};

export const getPreviousQuestion = (
  questions: QuestionConfig[],
  questionId?: string,
) => {
  const index = getQuestionIndex(questions, questionId);
  return questions[index - 1];
};

export const getQuestionById = (
  questions: QuestionConfig[],
  questionId?: string,
) => {
  return questions.find((q) => q.id === questionId);
};

export const getCanGoBack = (
  questions: QuestionConfig[],
  questionId?: string,
) => {
  const index = getQuestionIndex(questions, questionId);
  return index > 0;
};

export const getCanGoForward = (
  questions: QuestionConfig[],
  questionId?: string,
) => {
  const index = getQuestionIndex(questions, questionId);
  return index < questions.length - 1;
};

export const getIsLastQuestion = (
  questions: QuestionConfig[],
  questionId?: string,
) => {
  const index = getQuestionIndex(questions, questionId);
  return index === questions.length - 1;
};

export const getQuestionStates = (
  questions: QuestionConfig[],
  questionId: string,
) => {
  const canGoBack = getCanGoBack(questions, questionId);
  const canGoForward = getCanGoForward(questions, questionId);
  const questionIndex = getQuestionIndex(questions, questionId);
  const isLastQuestion = getIsLastQuestion(questions, questionId);
  const nextQuestion = getNextQuestion(questions, questionId);
  const prevQuestion = getPreviousQuestion(questions, questionId);

  return {
    canGoBack,
    canGoForward,
    questionIndex,
    isLastQuestion,
    nextQuestion,
    prevQuestion,
  };
};
