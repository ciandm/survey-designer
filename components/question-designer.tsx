'use client';

import {Prisma} from '@prisma/client';
import {cn} from '@/lib/utils';
import {setSelectedQuestionId} from '@/store/features/questions-slice';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {Input} from './ui/input';

interface Props {
  question: Prisma.QuestionGetPayload<{include: {answers: true}}>;
  questionNumber: number;
  isActive?: boolean;
}

const QuestionDesigner = ({question, questionNumber}: Props) => {
  const dispatch = useAppDispatch();
  const selectedQuestionId = useAppSelector(
    (state) => state.questions.selectedQuestionId,
  );

  const onQuestionClick = () => {
    dispatch(setSelectedQuestionId(question.id));
  };

  return (
    <div
      key={question.id}
      className={cn('cursor-pointer border border-transparent p-8', {
        'bg-primary-foreground': selectedQuestionId === question.id,
      })}
      onClick={onQuestionClick}
    >
      <p className="mb-1 text-sm text-muted-foreground">
        Question {questionNumber}
      </p>
      <h5 className="text-lg font-medium">{question.text || 'No title'}</h5>
      {question.description && (
        <p className="mt-1 text-muted-foreground">{question.description}</p>
      )}
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
