import {Prisma, Question} from '@prisma/client';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';

interface State {
  questions: {
    [id: string]: Prisma.QuestionGetPayload<{include: {answers: true}}>;
  };
  selectedQuestionId?: string;
}

type UpdateQuestionPayload = Partial<Question> & {id: string};

const initialState: State = {
  questions: {},
};

export const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload.reduce(
        (acc, q) => ({...acc, [q.id]: q}),
        {},
      );
    },
    updateQuestion: (state, action: PayloadAction<UpdateQuestionPayload>) => {
      const id = action.payload.id || '';
      state.questions[id] = {
        ...(state.questions[id] || {}),
        ...action.payload,
      };
    },
    setSelectedQuestionId: (state, action: PayloadAction<string>) => {
      state.selectedQuestionId = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function

export const {setQuestions, updateQuestion, setSelectedQuestionId} =
  questionsSlice.actions;

export const useQuestions = (state: RootState) => state.questions;

export default questionsSlice.reducer;
