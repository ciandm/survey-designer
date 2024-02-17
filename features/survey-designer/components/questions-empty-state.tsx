import React from 'react';
import {PlusIcon, QuestionMarkCircledIcon} from '@radix-ui/react-icons';
import {Button} from '@/components/ui/button';
import {useQuestionCrud} from '../hooks/use-question-crud';

export const QuestionsEmptyState = () => {
  const {handleCreateQuestion} = useQuestionCrud();

  return (
    <div className="text-center">
      <QuestionMarkCircledIcon className="mx-auto mb-2 h-10 w-10" />
      <h3 className="mt-2 font-semibold text-foreground">No questions yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by adding a new question
      </p>
      <div className="mt-6">
        <Button onClick={() => handleCreateQuestion({index: 0})}>
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          New Question
        </Button>
      </div>
    </div>
  );
};
