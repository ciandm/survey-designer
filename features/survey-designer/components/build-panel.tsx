'use client';

import {Button} from '@/components/ui/button';
import {QUESTION_OPTIONS} from '@/lib/constants/question';
import {useQuestionCrud} from '../hooks/use-question-crud';

export const BuildPanel = () => {
  const {handleCreateQuestion} = useQuestionCrud();
  return (
    <div className="flex max-w-[240px] flex-1 flex-col gap-2">
      <div className="flex flex-col gap-2 p-4">
        {QUESTION_OPTIONS.map((option) => (
          <Button
            className="flex items-center justify-start gap-2"
            key={option.value}
            variant="secondary"
            onClick={() => handleCreateQuestion({type: option.value})}
          >
            <option.icon className="h-4 w-4" />
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
