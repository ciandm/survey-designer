import {QuestionSchema} from '@/lib/validations/survey';

export const getQuestionIndex = (
  questions: QuestionSchema[],
  questionId?: string,
) => {
  return questions.findIndex((q) => q.id === questionId);
};

export const getNextQuestion = (
  questions: QuestionSchema[],
  questionId?: string,
) => {
  const index = getQuestionIndex(questions, questionId);
  return questions[index + 1];
};

export const getPreviousQuestion = (
  questions: QuestionSchema[],
  questionId?: string,
) => {
  const index = getQuestionIndex(questions, questionId);
  return questions[index - 1];
};

export const getQuestionById = (
  questions: QuestionSchema[],
  questionId?: string,
) => {
  return questions.find((q) => q.id === questionId);
};

export const getCanGoBack = (
  questions: QuestionSchema[],
  questionId?: string,
) => {
  const index = getQuestionIndex(questions, questionId);
  return index > 0;
};

export const getCanGoForward = (
  questions: QuestionSchema[],
  questionId?: string,
) => {
  const index = getQuestionIndex(questions, questionId);
  return index < questions.length - 1;
};

export const getIsLastQuestion = (
  questions: QuestionSchema[],
  questionId?: string,
) => {
  const index = getQuestionIndex(questions, questionId);
  return index === questions.length - 1;
};

export const getQuestionStates = (
  questions: QuestionSchema[],
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
