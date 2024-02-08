import {v4 as uuidv4} from 'uuid';
import {QUESTION_TYPE, QuestionType} from '@/lib/constants/question';
import {getNextQuestionToSelect} from '@/lib/utils';
import {
  deleteQuestion,
  duplicateQuestion,
  insertQuestion,
  useSurveyQuestions,
} from '../store/survey-designer';
import {useActiveQuestion} from './use-active-question';

export const useQuestionCrud = () => {
  const {activeQuestion, setActiveQuestion} = useActiveQuestion();
  const questions = useSurveyQuestions();

  const handleDeleteQuestion = (id: string) => {
    deleteQuestion({id});
    if (activeQuestion?.id === id) {
      setActiveQuestion(getNextQuestionToSelect(questions, id));
    }
  };

  const handleDuplicateQuestion = (id: string) => {
    const ref = uuidv4();
    duplicateQuestion({id, ref});
    setActiveQuestion(ref);
  };

  const handleCreateQuestion = ({
    type = QUESTION_TYPE.short_text,
    index,
  }: {
    type?: QuestionType;
    index?: number;
  } = {}) => {
    const ref = uuidv4();
    insertQuestion(
      {
        id: uuidv4(),
        type,
        text: '',
        properties: {},
        ref,
        validations: {},
        description: '',
      },
      index,
    );
    setActiveQuestion(ref);
  };

  return {
    handleDeleteQuestion,
    handleDuplicateQuestion,
    handleCreateQuestion,
  };
};
